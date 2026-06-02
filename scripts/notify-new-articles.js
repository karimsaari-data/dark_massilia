/**
 * notify-new-articles.js — Notifie les abonnés des nouveaux articles
 *
 * Fonctionnement (version Supabase) :
 *   1. Query Supabase : SELECT * FROM blog_posts WHERE notified_at IS NULL
 *   2. Pour chaque article non notifié → appelle la Edge Function notify-new-article
 *   3. Sur succès → UPDATE blog_posts SET notified_at = NOW() WHERE slug = ?
 *
 * Usage : appelé automatiquement par `npm run build:blog`
 */

import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────

// Charge les variables depuis .env (sans dépendance externe)
function loadEnv() {
  const envPath = resolve(__dirname, '../.env');
  if (!existsSync(envPath)) return {};
  const env = {};
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const match = line.replace(/\r$/, '').match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
  });
  return env;
}

const env           = loadEnv();
const SUPABASE_URL  = env.VITE_SUPABASE_URL    ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = env.VITE_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
const NOTIFY_SECRET = env.NOTIFY_SECRET         ?? process.env.NOTIFY_SECRET;

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
    .replace(/&hellip;/g, '…').replace(/&nbsp;/g, ' ')
    .trim();
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, '’').replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è').replace(/&agrave;/g, 'à')
    .replace(/&ccedil;/g, 'ç').replace(/&hellip;/g, '…');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !NOTIFY_SECRET) {
    console.warn('⚠️  VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY ou NOTIFY_SECRET manquant dans .env — notification ignorée.');
    return;
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. Récupérer les articles non encore notifiés depuis Supabase
  const { data: unnotified, error: fetchErr } = await sb
    .from('blog_posts')
    .select('*')
    .is('notified_at', null)
    .order('date', { ascending: true });

  if (fetchErr) {
    console.error(`❌ Erreur Supabase lors du fetch : ${fetchErr.message}`);
    process.exit(1);
  }

  if (!unnotified || unnotified.length === 0) {
    console.log('✓ Aucun nouvel article — notification ignorée.');
    return;
  }

  console.log(`📧 ${unnotified.length} nouvel(s) article(s) à notifier…`);

  let failures = 0;

  // 2. Notifier article par article — mise à jour immédiate après chaque succès
  //    pour éviter toute double notification en cas d'erreur ultérieure
  for (const post of unnotified) {
    const title   = decodeEntities(post.title ?? '');
    const rawExc  = stripHtml(post.excerpt ?? '');
    const excerpt = rawExc.length > 220 ? rawExc.slice(0, 220) + '…' : rawExc;
    const url     = `https://karimsaari.com/blog/${post.slug}`;
    // Email : éviter le WebP (Outlook & certains clients mail ne le rendent
    // pas → image cassée). On privilégie une image non-webp (souvent le JPG og).
    const imgCandidates = [post.image_og, post.image].filter(Boolean);
    const image   = imgCandidates.find((u) => !/\.webp(\?|$)/i.test(u))
                 ?? imgCandidates[0]?.replace(/\.webp(\?|$)/i, '.jpg$1')
                 ?? null;

    console.log(`   → ${title}`);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/notify-new-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-notify-secret': NOTIFY_SECRET,
        },
        body: JSON.stringify({ title, excerpt, url, image }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`   ❌ Erreur Edge Function (HTTP ${res.status}) : ${err}`);
        failures++;
      } else {
        const data = await res.json();
        console.log(`   ✅ Campagne Brevo envoyée (id: ${data.campaignId})`);

        // 3. Marquer l'article comme notifié dans Supabase (mise à jour immédiate)
        const { error: updateErr } = await sb
          .from('blog_posts')
          .update({ notified_at: new Date().toISOString() })
          .eq('slug', post.slug);

        if (updateErr) {
          console.warn(`   ⚠️  Impossible de mettre à jour notified_at pour "${post.slug}" : ${updateErr.message}`);
          // On ne compte pas comme failure car la notification a été envoyée
          // L'article sera re-tenté au prochain run, ce qui causera un doublon.
          // C'est intentionnel : mieux vaut signaler que laisser en silence.
        }
      }
    } catch (err) {
      console.error(`   ❌ Erreur réseau (${err.message}) — article ignoré, sera retenté demain`);
      failures++;
    }
  }

  console.log(`✓ Notifications traitées.${failures > 0 ? ` ⚠️  ${failures} notification(s) échouée(s).` : ''}`);
  if (failures > 0) process.exit(1);
}

main().catch(err => {
  console.error('❌ notify-new-articles (erreur inattendue):', err.message);
  process.exit(1);
});
