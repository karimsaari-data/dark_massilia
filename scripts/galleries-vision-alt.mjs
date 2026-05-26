/**
 * galleries-vision-alt.mjs
 * Améliore title + alt des galeries photos_paysage et photos_sous_marine
 * via Claude Vision (Haiku) pour les entrées avec alt = title ou alt trop court.
 *
 * Cache : colonne vision_improved_at dans chaque table
 * → Une photo améliorée n'est JAMAIS renvoyée à l'API.
 *
 * Usage :
 *   node scripts/galleries-vision-alt.mjs              → dry-run
 *   node scripts/galleries-vision-alt.mjs --apply      → applique dans Supabase
 *   node scripts/galleries-vision-alt.mjs --apply --table=paysage
 *   node scripts/galleries-vision-alt.mjs --apply --table=sous_marine
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient }  from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '..');

// ── Chargement .env ───────────────────────────────────────────────────────────
const envPaths = [path.join(root, '.env.local'), path.join(root, '.env')];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf-8').replace(/\r/g, '').split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  }
}

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL  = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_BASE     = 'https://karimsaari.com';
const MODEL         = 'claude-haiku-4-5-20251001';
const DRY_RUN       = !process.argv.includes('--apply');
const TABLE_FILTER  = process.argv.find(a => a.startsWith('--table='))?.split('=')[1];

const TABLES = [
  {
    name:    'photos_paysage',
    context: 'Photos de paysage : Calanques de Marseille, Provence, littoral méditerranéen, lavande, portraits nature.',
  },
  {
    name:    'photos_sous_marine',
    context: 'Photos sous-marines : plongée en apnée, dépollution marine, faune méditerranéenne, Calanques de Marseille.',
  },
].filter(t => !TABLE_FILTER || t.name.includes(TABLE_FILTER));

// ── Supabase ──────────────────────────────────────────────────────────────────
let _sb;
const sb = () => _sb || (_sb = createClient(SUPABASE_URL, SUPABASE_KEY));

async function fetchToImprove(tableName) {
  const { data, error } = await sb()
    .from(tableName)
    .select('id, src, title, alt, lieu, vision_improved_at')
    .limit(500);
  if (error) throw new Error(`Supabase GET ${tableName}: ${error.message}`);
  return data.filter(p =>
    !p.vision_improved_at && (
      !p.alt ||
      p.alt === p.title ||
      p.alt.length < 40
    )
  );
}

async function updateRow(tableName, id, title, alt) {
  const { error } = await sb()
    .from(tableName)
    .update({ title, alt, vision_improved_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(`Supabase UPDATE ${tableName}: ${error.message}`);
}

// ── Image source (URL publique ou base64 local) ───────────────────────────────
async function buildImageSource(src) {
  const url = `${SITE_BASE}${src}`;
  try {
    const check = await fetch(url, { method: 'HEAD' });
    if (check.ok && check.url.startsWith('https://')) return { type: 'url', url };
  } catch {}

  const localPath = path.join(root, 'public', src);
  if (fs.existsSync(localPath)) {
    const ext     = src.split('.').pop().toLowerCase();
    const mime    = { jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', png: 'image/png' }[ext] || 'image/jpeg';
    const data    = fs.readFileSync(localPath).toString('base64');
    console.log(`     (base64 local)`);
    return { type: 'base64', media_type: mime, data };
  }
  throw new Error(`Image inaccessible : ${url}`);
}

// ── Claude Vision ─────────────────────────────────────────────────────────────
async function analyzePhoto(src, context, lieu) {
  const imageSource = await buildImageSource(src);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'x-api-key':         ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: imageSource },
          {
            type: 'text',
            text: `Tu es expert SEO pour Karim Saari, photographe environnemental à Marseille (Dark Massilia).
${context}${lieu ? `\nLieu connu : ${lieu}` : ''}

Génère en français :
TITRE: [Titre court et évocateur, 5-10 mots, sans guillemets]
ALT: [Texte alternatif SEO riche, 120-180 caractères, décrivant précisément le sujet, le lieu et le contexte]

Réponds UNIQUEMENT avec les deux lignes TITRE: et ALT:, rien d'autre.`,
          },
        ],
      }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.content[0].text.trim();

  const titleMatch = text.match(/^TITRE:\s*(.+)$/m);
  const altMatch   = text.match(/^ALT:\s*(.+)$/m);
  if (!titleMatch || !altMatch) throw new Error(`Format inattendu : ${text}`);

  return {
    title: titleMatch[1].trim().replace(/^["']|["']$/g, ''),
    alt:   altMatch[1].trim().replace(/^["']|["']$/g, ''),
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!ANTHROPIC_KEY) { console.error('❌  ANTHROPIC_API_KEY manquant'); process.exit(1); }
  if (!SUPABASE_URL)  { console.error('❌  VITE_SUPABASE_URL manquant'); process.exit(1); }

  console.log(`\n🔬  Galleries Vision Alt — ${DRY_RUN ? 'DRY RUN' : 'MODE APPLY'}${TABLE_FILTER ? ` · ${TABLE_FILTER}` : ''}\n`);

  let totalImproved = 0, totalErrors = 0;

  for (const { name, context } of TABLES) {
    const photos = await fetchToImprove(name);
    console.log(`📁 ${name} — ${photos.length} à améliorer\n`);

    let improved = 0, errors = 0;

    for (const photo of photos) {
      const filename = photo.src.split('/').pop();
      console.log(`  🔍 ${filename}`);
      console.log(`     titre actuel : "${photo.title}"`);
      console.log(`     alt actuel   : "${photo.alt}"`);

      try {
        const { title, alt } = await analyzePhoto(photo.src, context, photo.lieu);
        console.log(`     → titre      : "${title}"`);
        console.log(`     → alt        : "${alt}"\n`);

        if (!DRY_RUN) {
          await updateRow(name, photo.id, title, alt);
          improved++;
        } else {
          improved++;
        }
      } catch (err) {
        console.error(`  ❌ ${filename}: ${err.message}\n`);
        errors++;
      }

      await new Promise(r => setTimeout(r, 400));
    }

    console.log(`  ✅ ${name} : ${improved} améliorées${errors ? `, ${errors} erreurs` : ''}\n`);
    totalImproved += improved;
    totalErrors   += errors;
  }

  console.log('─────────────────────────────────────');
  console.log(`  Total améliorées${DRY_RUN ? ' (dry-run)' : ''} : ${totalImproved}`);
  if (totalErrors) console.log(`  Erreurs                   : ${totalErrors}`);
  if (DRY_RUN) console.log('\n  👆 Relance avec --apply pour appliquer.');
  console.log('');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
