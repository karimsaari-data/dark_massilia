/**
 * wp-alt-vision.mjs
 * Analyse les images WordPress avec Claude Vision et génère des alt text SEO.
 *
 * Cache Supabase : table wp_media_alt (media_id = clé)
 * → Une image analysée n'est JAMAIS renvoyée à l'API lors des prochaines exécutions.
 * → Le cache est éditable directement dans Supabase pour corriger un alt text.
 *
 * Usage :
 *   node scripts/wp-alt-vision.mjs                      → dry-run (analyse + affiche, ne touche ni WP ni Supabase)
 *   node scripts/wp-alt-vision.mjs --apply              → toutes les images
 *   node scripts/wp-alt-vision.mjs --apply --posts-only → uniquement les images attachées à un article
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '../../../..');

// ── Chargement .env ───────────────────────────────────────────────────────────
const envPaths = [
  path.join(root, '.env.local'),
  path.join(root, '.env'),
  path.resolve(__dirname, '..', '.env.local'),
  path.resolve(__dirname, '..', '.env'),
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf-8').replace(/\r/g, '').split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  }
}

const WP_BASE        = 'https://cms.karimsaari.com/wp-json/wp/v2';
const WP_USER        = process.env.WP_USER;
const WP_PASS        = (process.env.WP_APP_PASSWORD || '').replace(/\s/g, '');
const AUTH           = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
const ANTHROPIC_KEY  = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL   = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY   = process.env.VITE_SUPABASE_ANON_KEY;
const MODEL          = 'claude-haiku-4-5-20251001';
const DRY_RUN        = !process.argv.includes('--apply');
const POSTS_ONLY     = process.argv.includes('--posts-only');

// ── Cache (Supabase avec fallback JSON local) ─────────────────────────────────

const CACHE_PATH  = path.resolve(__dirname, 'wp-alt-vision-cache.json');
let   USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);

function loadLocalCache() {
  if (fs.existsSync(CACHE_PATH)) return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
  return {};
}
function saveLocalCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
}

async function sbGet(mediaIds) {
  const ids = mediaIds.join(',');
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/wp_media_alt?media_id=in.(${ids})&select=media_id,alt_text`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) throw new Error(`Supabase GET → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function sbUpsert(row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/wp_media_alt`, {
    method:  'POST',
    headers: {
      apikey:          SUPABASE_KEY,
      Authorization:   `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
      Prefer:          'resolution=merge-duplicates',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase upsert → ${res.status}: ${await res.text()}`);
}

async function sbMarkApplied(mediaId) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/wp_media_alt?media_id=eq.${mediaId}`,
    {
      method:  'PATCH',
      headers: {
        apikey:         SUPABASE_KEY,
        Authorization:  `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ applied_at: new Date().toISOString() }),
    }
  );
}

// ── WordPress helpers ─────────────────────────────────────────────────────────

async function wpGet(p) {
  const res = await fetch(`${WP_BASE}${p}`, { headers: { Authorization: `Basic ${AUTH}` } });
  if (!res.ok) throw new Error(`GET ${p} → ${res.status}`);
  return res.json();
}

async function wpPatch(id, data) {
  const res = await fetch(`${WP_BASE}/media/${id}`, {
    method:  'POST',
    headers: { Authorization: `Basic ${AUTH}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PATCH media/${id} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchAllMedia() {
  const all = [];
  let page = 1;
  while (true) {
    const items = await wpGet(`/media?per_page=100&page=${page}&_fields=id,alt_text,source_url,post,mime_type`);
    if (!items.length) break;
    all.push(...items);
    if (items.length < 100) break;
    page++;
  }
  return all;
}

const postTitleCache = new Map();
async function getPostTitle(postId) {
  if (!postId) return null;
  if (postTitleCache.has(postId)) return postTitleCache.get(postId);
  try {
    const post = await wpGet(`/posts/${postId}?_fields=title`);
    const title = post.title?.rendered?.replace(/<[^>]+>/g, '') || null;
    postTitleCache.set(postId, title);
    return title;
  } catch {
    return null;
  }
}

// ── Claude Vision ─────────────────────────────────────────────────────────────

async function analyzeImage(imageUrl, articleTitle) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'x-api-key':         ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'url', url: imageUrl } },
          {
            type: 'text',
            text: `Tu es expert SEO. Génère un texte alternatif d'image en français pour cette photo.
Format STRICT (une seule ligne, sans guillemets) :
[Sujet précis visible] — [Lieu/contexte : Calanques de Marseille, Méditerranée, Vieux-Port, etc.] — © Karim Saari

Contexte : photos de Karim Saari, apnéiste et activiste à Marseille.${articleTitle ? `\nCette image illustre l'article : "${articleTitle}".` : ''}
Sujets courants : plongée en apnée, dépollution marine, faune sous-marine, paysages Calanques, bénévoles, déchets plastiques.
Réponds UNIQUEMENT avec le texte alternatif, rien d'autre.`,
          },
        ],
      }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text.trim().replace(/^["']|["']$/g, '');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!WP_USER || !WP_PASS) { console.error('❌  WP_USER ou WP_APP_PASSWORD manquant'); process.exit(1); }
  if (!ANTHROPIC_KEY)       { console.error('❌  ANTHROPIC_API_KEY manquant dans .env'); process.exit(1); }

  // Teste si Supabase est disponible, sinon bascule sur JSON local
  if (USE_SUPABASE) {
    try {
      await sbGet([0]); // requête test
    } catch {
      USE_SUPABASE = false;
      console.warn('  ⚠️  Supabase indisponible → cache JSON local (wp-alt-vision-cache.json)\n');
    }
  }
  const cacheLabel = USE_SUPABASE ? 'Supabase' : 'JSON local';

  console.log(`\n🔬  Alt text Vision — ${DRY_RUN ? 'DRY RUN' : 'MODE APPLY'}${POSTS_ONLY ? ' · articles seulement' : ''}\n`);

  const allMedia = await fetchAllMedia();
  const images   = allMedia.filter(m =>
    m.mime_type?.startsWith('image/') &&
    (!POSTS_ONLY || m.post > 0)
  );

  // Charge le cache
  let cacheMap;
  if (USE_SUPABASE) {
    const ids    = images.map(m => m.id);
    const cached = await sbGet(ids);
    cacheMap = new Map(cached.map(r => [r.media_id, r.alt_text]));
  } else {
    const local = loadLocalCache();
    cacheMap = new Map(Object.entries(local).map(([k, v]) => [Number(k), v]));
  }

  const uncached = images.filter(m => !cacheMap.has(m.id));
  console.log(`  📦 ${images.length} images | 💾 ${cacheMap.size} en cache (${cacheLabel}) | 🔍 ${uncached.length} à analyser\n`);

  let analyzed = 0, fromCache = 0, alreadyOk = 0, wpUpdated = 0, errors = 0;

  for (const media of images) {
    const filename = media.source_url.split('/').pop();

    // ── Déjà en cache Supabase ──
    if (cacheMap.has(media.id)) {
      const cachedAlt = cacheMap.get(media.id);
      if ((media.alt_text || '').trim() === cachedAlt.trim()) {
        alreadyOk++;
        continue;
      }
      console.log(`  💾 [cache] ${media.id} — ${filename}`);
      console.log(`     → "${cachedAlt}"\n`);
      if (!DRY_RUN) {
        await wpPatch(media.id, { alt_text: cachedAlt });
        if (USE_SUPABASE) await sbMarkApplied(media.id);
        fromCache++;
      }
      continue;
    }

    // ── Nouvel appel Vision ──
    const articleTitle = await getPostTitle(media.post);
    console.log(`  🔍 Analyse ${media.id} — ${filename}${articleTitle ? ` (${articleTitle})` : ''}`);
    try {
      const generatedAlt = await analyzeImage(media.source_url, articleTitle);
      console.log(`     → "${generatedAlt}"\n`);

      if (!DRY_RUN) {
        if (USE_SUPABASE) {
          await sbUpsert({
            media_id:    media.id,
            source_url:  media.source_url,
            alt_text:    generatedAlt,
            model:       MODEL,
            analyzed_at: new Date().toISOString(),
          });
        } else {
          const local = loadLocalCache();
          local[media.id] = generatedAlt;
          saveLocalCache(local);
        }
        if ((media.alt_text || '').trim() !== generatedAlt.trim()) {
          await wpPatch(media.id, { alt_text: generatedAlt });
          if (USE_SUPABASE) await sbMarkApplied(media.id);
          wpUpdated++;
        }
        analyzed++;
      } else {
        analyzed++;
      }
    } catch (err) {
      console.error(`  ❌ ${media.id}: ${err.message}\n`);
      errors++;
    }

    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`  Analysés (Vision)   : ${analyzed}`);
  console.log(`  WP mis à jour       : ${DRY_RUN ? '(dry-run)' : wpUpdated}`);
  console.log(`  Appliqués (cache)   : ${fromCache}`);
  console.log(`  Déjà OK             : ${alreadyOk}`);
  if (errors) console.log(`  Erreurs             : ${errors}`);
  if (DRY_RUN) console.log(`\n  👆 Relance avec --apply pour appliquer.`);
  console.log('');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
