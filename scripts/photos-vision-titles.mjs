/**
 * photos-vision-titles.mjs
 * Améliore xmp_title et xmp_description des photos dans photos_exif
 * via Claude Vision (Haiku) pour les entrées avec titre = description
 * ou description trop courte (< 80 chars).
 *
 * Cache : colonne vision_improved_at dans photos_exif
 * → Une photo améliorée n'est JAMAIS renvoyée à l'API.
 *
 * Usage :
 *   node scripts/photos-vision-titles.mjs              → dry-run
 *   node scripts/photos-vision-titles.mjs --apply      → applique dans Supabase
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '..');

// ── Chargement .env ───────────────────────────────────────────────────────────
const envPaths = [
  path.join(root, '.env.local'),
  path.join(root, '.env'),
];
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

// ── Supabase client ───────────────────────────────────────────────────────────

let supabase;
function getSb() {
  if (!supabase) supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabase;
}

async function fetchAllToImprove() {
  const { data, error } = await getSb()
    .from('photos_exif')
    .select('src, xmp_title, xmp_description, vision_improved_at')
    .limit(500);
  if (error) throw new Error(`Supabase GET: ${error.message}`);
  return data.filter(p =>
    !p.vision_improved_at && (
      p.xmp_title === p.xmp_description ||
      !p.xmp_description ||
      p.xmp_description.length < 80
    )
  );
}

async function updatePhoto(src, title, description) {
  const { error } = await getSb()
    .from('photos_exif')
    .update({
      xmp_title:          title,
      xmp_description:    description,
      vision_improved_at: new Date().toISOString(),
    })
    .eq('src', src);
  if (error) throw new Error(`Supabase PATCH: ${error.message}`);
}

// ── Claude Vision ─────────────────────────────────────────────────────────────

async function buildImageSource(imageUrl, src) {
  // Essaie d'abord l'URL publique
  try {
    const check = await fetch(imageUrl, { method: 'HEAD' });
    if (check.ok && check.url.startsWith('https://')) {
      return { type: 'url', url: imageUrl };
    }
  } catch {}

  // Fallback : base64 depuis le fichier local
  const localPath = path.join(root, 'public', src);
  if (fs.existsSync(localPath)) {
    const data     = fs.readFileSync(localPath);
    const b64      = data.toString('base64');
    const ext      = src.split('.').pop().toLowerCase();
    const mimeMap  = { jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', png: 'image/png' };
    const mimeType = mimeMap[ext] || 'image/jpeg';
    console.log(`     (base64 local)`);
    return { type: 'base64', media_type: mimeType, data: b64 };
  }

  throw new Error(`Image inaccessible : ${imageUrl} et fichier local introuvable`);
}

async function analyzePhoto(imageUrl, src, currentTitle) {
  const imageSource = await buildImageSource(imageUrl, src);
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
            text: `Tu es expert SEO pour un photographe environnemental à Marseille (Karim Saari / Dark Massilia).
Analyse cette photo et génère en français :

TITRE: [Titre court et évocateur, 5-10 mots, sans guillemets]
DESCRIPTION: [Description riche de 120-180 caractères décrivant le sujet, le lieu (Calanques de Marseille, Méditerranée, Vieux-Port...) et le contexte environnemental]

Contexte : photos de dépollution marine, biodiversité, paysages des Calanques, apnée.${currentTitle && !currentTitle.match(/^\d/) ? `\nTitre actuel (à améliorer) : "${currentTitle}"` : ''}
Réponds UNIQUEMENT avec les deux lignes TITRE: et DESCRIPTION:, rien d'autre.`,
          },
        ],
      }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.content[0].text.trim();

  const titleMatch = text.match(/^TITRE:\s*(.+)$/m);
  const descMatch  = text.match(/^DESCRIPTION:\s*(.+)$/m);

  if (!titleMatch || !descMatch) throw new Error(`Format inattendu : ${text}`);

  return {
    title:       titleMatch[1].trim().replace(/^["']|["']$/g, ''),
    description: descMatch[1].trim().replace(/^["']|["']$/g, ''),
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!ANTHROPIC_KEY) { console.error('❌  ANTHROPIC_API_KEY manquant'); process.exit(1); }
  if (!SUPABASE_URL)  { console.error('❌  VITE_SUPABASE_URL manquant'); process.exit(1); }

  console.log(`\n🔬  Photos Vision Titles — ${DRY_RUN ? 'DRY RUN' : 'MODE APPLY'}\n`);

  // Vérifie si la colonne vision_improved_at existe, sinon on la crée via le script SQL
  let photos;
  try {
    photos = await fetchAllToImprove();
  } catch (err) {
    if (err.message.includes('vision_improved_at')) {
      console.error('❌  Colonne vision_improved_at manquante dans photos_exif.');
      console.error('   Lance d\'abord : node scripts/photos-vision-add-column.mjs');
      process.exit(1);
    }
    throw err;
  }

  console.log(`  📷 ${photos.length} photos à améliorer\n`);

  if (photos.length === 0) {
    console.log('  ✅ Tout est déjà OK !');
    return;
  }

  let improved = 0, errors = 0;

  for (const photo of photos) {
    const filename  = photo.src.split('/').pop();
    const imageUrl  = `${SITE_BASE}${photo.src}`;

    console.log(`  🔍 ${photo.src.replace('/images/', '')}`);
    console.log(`     titre actuel    : "${photo.xmp_title}"`);
    console.log(`     desc actuelle   : "${photo.xmp_description}"`);

    try {
      const { title, description } = await analyzePhoto(imageUrl, photo.src, photo.xmp_title);
      console.log(`     → titre         : "${title}"`);
      console.log(`     → description   : "${description}"\n`);

      if (!DRY_RUN) {
        await updatePhoto(photo.src, title, description);
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

  console.log('─────────────────────────────────────');
  console.log(`  Améliorées${DRY_RUN ? ' (dry-run)' : ''} : ${improved}`);
  if (errors) console.log(`  Erreurs             : ${errors}`);
  if (DRY_RUN) console.log('\n  👆 Relance avec --apply pour appliquer.');
  console.log('');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
