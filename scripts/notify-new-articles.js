/**
 * notify-new-articles.js — Notifie les abonnés des nouveaux articles WordPress
 *
 * Fonctionnement :
 *   1. Lit .notified-slugs.json (log local des slugs déjà notifiés)
 *   2. Récupère tous les slugs publiés depuis WordPress
 *   3. Pour chaque nouveau slug → appelle la Edge Function notify-new-article
 *   4. Met à jour .notified-slugs.json
 *
 * Usage : appelé automatiquement par `npm run build:blog`
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────

const LOG_FILE   = resolve(__dirname, '.notified-slugs.json');
const WP_BASE    = 'https://cms.karimsaari.com/wp-json/wp/v2';

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

const env            = loadEnv();
const SUPABASE_URL   = env.VITE_SUPABASE_URL   ?? process.env.VITE_SUPABASE_URL;
const NOTIFY_SECRET  = env.NOTIFY_SECRET        ?? process.env.NOTIFY_SECRET;

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, '\u2019').replace(/&lsquo;/g, '\u2018')
    .replace(/&hellip;/g, '…').replace(/&nbsp;/g, ' ')
    .trim();
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, '\u2019').replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è').replace(/&agrave;/g, 'à')
    .replace(/&ccedil;/g, 'ç').replace(/&hellip;/g, '…');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_URL || !NOTIFY_SECRET) {
    console.warn('⚠️  VITE_SUPABASE_URL ou NOTIFY_SECRET manquant dans .env — notification ignorée.');
    return;
  }

  // 1. Charger les slugs déjà notifiés
  let notified = [];
  if (existsSync(LOG_FILE)) {
    notified = JSON.parse(await readFile(LOG_FILE, 'utf-8'));
  }

  // 2. Récupérer tous les articles WordPress
  let allPosts = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const params = new URLSearchParams({
        per_page: 100,
        page,
        status: 'publish',
        _embed: '',
      });
      const res = await fetch(`${WP_BASE}/posts?${params}`);
      if (!res.ok) {
        console.warn(`⚠️  WordPress API erreur HTTP ${res.status} — notification ignorée.`);
        return;
      }
      const posts = await res.json();
      allPosts = allPosts.concat(posts);
      totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
      page++;
    } while (page <= totalPages);
  } catch (err) {
    console.warn(`⚠️  WordPress injoignable (${err.message}) — notification ignorée.`);
    return;
  }

  // 3. Filtrer les nouveaux slugs
  const newPosts = allPosts.filter(p => !notified.includes(p.slug));

  if (newPosts.length === 0) {
    console.log('✓ Aucun nouvel article — notification ignorée.');
    return;
  }

  console.log(`📧 ${newPosts.length} nouvel(s) article(s) à notifier…`);

  let failures = 0;

  // 4. Notifier article par article — sauvegarde immédiate après chaque succès
  //    pour éviter toute double notification en cas d'erreur ultérieure
  for (const post of newPosts) {
    const title   = decodeEntities(post.title?.rendered ?? '');
    const rawExc  = stripHtml(post.excerpt?.rendered ?? '');
    const excerpt = rawExc.length > 220 ? rawExc.slice(0, 220) + '…' : rawExc;
    const url     = `https://karimsaari.com/blog/${post.slug}`;
    const image   = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null;

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
        console.error(`   ❌ Erreur Supabase (HTTP ${res.status}) : ${err}`);
        failures++;
      } else {
        const data = await res.json();
        console.log(`   ✅ Campagne Brevo envoyée (id: ${data.campaignId})`);
        notified.push(post.slug);
        // Sauvegarde immédiate : si le process est interrompu ensuite,
        // cet article ne sera jamais notifié en double
        await writeFile(LOG_FILE, JSON.stringify(notified, null, 2));
      }
    } catch (err) {
      console.error(`   ❌ Erreur réseau Supabase (${err.message}) — article ignoré, sera retenté demain`);
      failures++;
    }
  }

  console.log(`✓ Log à jour.${failures > 0 ? ` ⚠️  ${failures} notification(s) échouée(s).` : ''}`);
  if (failures > 0) process.exit(1);
}

main().catch(err => {
  console.error('❌ notify-new-articles (erreur inattendue):', err.message);
  process.exit(1);
});
