/**
 * scripts/sync-wp-to-supabase.mjs — Synchronisation WordPress → Supabase
 *
 * Remplaçant de update-wp-cache.js. Ce script :
 *   1. Récupère tous les articles WordPress publiés (avec médias et auteurs)
 *   2. Upsert dans la table Supabase `blog_posts` (en préservant notified_at)
 *   3. Met également à jour scripts/wp-posts-cache.json (fallback CI)
 *
 * Usage :
 *   node scripts/sync-wp-to-supabase.mjs
 *   (à lancer localement après chaque publication d'article,
 *    ou en CI via npm run sync-wp)
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.resolve(__dirname, 'wp-posts-cache.json');
const WP_BASE    = 'https://cms.karimsaari.com/wp-json/wp/v2';

// ── Chargement des variables d'environnement depuis .env ─────────────────────
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const match = line.replace(/\r$/, '').match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
  });
  return env;
}

const env    = loadEnv();
const sbUrl  = env.VITE_SUPABASE_URL  ?? process.env.VITE_SUPABASE_URL;
const sbKey  = env.VITE_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

// Auth WordPress : depuis juin 2026 l'API REST exige une authentification
// (les requêtes anonymes renvoient 403). On s'aligne sur les autres scripts WP
// (update-wp-alt-text.mjs, wp-alt-vision.mjs) en Basic Auth via Application Password.
const wpUser  = env.WP_USER ?? process.env.WP_USER;
const wpPass  = (env.WP_APP_PASSWORD ?? process.env.WP_APP_PASSWORD ?? '').replace(/\s/g, '');
const WP_AUTH = wpUser && wpPass ? Buffer.from(`${wpUser}:${wpPass}`).toString('base64') : null;

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function stripEntities(str) {
  return str
    .replace(/&amp;/g,   '&').replace(/&lt;/g,    '<').replace(/&gt;/g,    '>')
    .replace(/&quot;/g,  '"').replace(/&#039;/g,   "'").replace(/&hellip;/g,'…')
    .replace(/&laquo;/g, '«').replace(/&raquo;/g,  '»').replace(/&nbsp;/g,  ' ')
    .replace(/&#8217;/g, '’').replace(/&#8216;/g, '‘')
    .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”').replace(/&ldquo;/g, '“');
}

// CDN ShortPixel (SPIO) : WebP/AVIF + resize à la volée depuis l'original.
const SPIO_PREFIX = 'https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize,to_auto,s_webp:avif/';
function toCdn(url) {
  if (!url) return null;
  if (url.includes('spcdn.shortpixel.ai')) return url;
  return SPIO_PREFIX + url.replace(/^https?:\/\//, '');
}

function buildSrcset(media) {
  const sizes = media?.media_details?.sizes;
  if (!sizes) return null;
  const entries = Object.values(sizes)
    .filter(s => s?.source_url && s?.width && s.width <= 1200)
    .map(s => `${toCdn(s.source_url)} ${s.width}w`);
  return entries.length ? entries.join(', ') : null;
}

// ── Récupération des articles WordPress ──────────────────────────────────────

async function fetchAllWPPosts() {
  const allPosts = [];
  let page = 1;
  let totalPages = 1;

  do {
    process.stdout.write(`  Page ${page}/${totalPages}…`);
    const res = await fetch(
      `${WP_BASE}/posts?per_page=100&page=${page}&_embed&status=publish`,
      {
        headers: {
          'User-Agent': 'dark-massilia-sync/1.0',
          ...(WP_AUTH ? { Authorization: `Basic ${WP_AUTH}` } : {}),
        },
      },
    );
    if (!res.ok) throw new Error(`WP API ${res.status}: ${res.statusText}`);
    const posts = await res.json();
    totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
    console.log(` ${posts.length} articles`);

    for (const post of posts) {
      const media  = post._embedded?.['wp:featuredmedia']?.[0];
      const author = post._embedded?.author?.[0];
      const sizes  = media?.media_details?.sizes;
      const rawSrc = sizes?.medium_large?.source_url
                  ?? sizes?.large?.source_url
                  ?? media?.source_url
                  ?? null;
      const imageSrc = toCdn(rawSrc);

      allPosts.push({
        id:            post.id,
        slug:          post.slug,
        modified:      post.modified,
        title:         stripEntities(post.title?.rendered ?? ''),
        excerpt:       stripHtml(post.excerpt?.rendered ?? ''),
        content:       post.content?.rendered ?? '',
        date:          post.date,
        dateFormatted: new Date(post.date).toLocaleDateString('fr-FR', {
          year: 'numeric', month: 'long', day: 'numeric',
        }),
        image:         imageSrc,
        imageOg:       rawSrc,
        imageSrcset:   buildSrcset(media),
        imageWidth:    media?.media_details?.width  ?? 1280,
        imageHeight:   media?.media_details?.height ?? 720,
        imageAlt:      media?.alt_text || stripEntities(post.title?.rendered ?? ''),
        author:        author?.name ?? 'Dark Massilia',
      });
    }

    page++;
  } while (page <= totalPages);

  return allPosts;
}

// ── Upsert vers Supabase ──────────────────────────────────────────────────────

async function upsertToSupabase(sb, posts) {
  // 1. Récupérer les notified_at existants pour ne pas les écraser
  const { data: existing, error: fetchErr } = await sb
    .from('blog_posts')
    .select('slug, notified_at')
    .in('slug', posts.map(p => p.slug));

  if (fetchErr) {
    console.warn(`  ⚠️  Impossible de récupérer les notified_at existants : ${fetchErr.message}`);
  }

  const notifiedMap = new Map(
    (existing ?? []).map(row => [row.slug, row.notified_at])
  );

  // Migration one-time : lire .notified-slugs.json s'il existe
  // pour marquer comme notifiés les articles notifiés avant la migration Supabase
  const legacyLogPath = path.resolve(__dirname, '.notified-slugs.json');
  if (fs.existsSync(legacyLogPath)) {
    try {
      const legacySlugs = JSON.parse(fs.readFileSync(legacyLogPath, 'utf-8'));
      const MIGRATION_DATE = '2026-01-01T00:00:00.000Z'; // date symbolique
      legacySlugs.forEach(slug => {
        if (!notifiedMap.has(slug) || notifiedMap.get(slug) === null) {
          notifiedMap.set(slug, MIGRATION_DATE);
        }
      });
      console.log(`  🔀 Migration legacy : ${legacySlugs.length} slugs lus depuis .notified-slugs.json`);
    } catch (_) {}
  }

  // 2. Construire les rows Supabase (camelCase → snake_case)
  const rows = posts.map(p => ({
    wp_id:          p.id,
    slug:           p.slug,
    title:          p.title,
    excerpt:        p.excerpt,
    content:        p.content,
    date:           p.date,
    modified:       p.modified,
    date_formatted: p.dateFormatted,
    image:          p.image,
    image_og:       p.imageOg,
    image_srcset:   p.imageSrcset,
    image_width:    p.imageWidth,
    image_height:   p.imageHeight,
    image_alt:      p.imageAlt,
    author:         p.author,
    notified_at:    notifiedMap.get(p.slug) ?? null,
    synced_at:      new Date().toISOString(),
  }));

  // 3. Upsert par batch de 50
  const BATCH = 50;
  let upserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await sb
      .from('blog_posts')
      .upsert(batch, { onConflict: 'slug' });
    if (error) throw new Error(`Supabase upsert erreur : ${error.message}`);
    upserted += batch.length;
    process.stdout.write(`  Upsert ${upserted}/${rows.length}…\r`);
  }
  console.log(`  ✅ ${upserted} articles upsertés dans Supabase       `);
}

// ── Mise à jour du fichier JSON de fallback ───────────────────────────────────

function saveWPCache(posts) {
  try {
    fs.writeFileSync(
      CACHE_PATH,
      JSON.stringify({ generated: new Date().toISOString(), posts }, null, 2),
      'utf-8',
    );
    const kb = Math.round(fs.statSync(CACHE_PATH).size / 1024);
    console.log(`  💾 Cache JSON mis à jour → scripts/wp-posts-cache.json (${kb} Ko)`);
    console.log('     → Committez ce fichier pour que GitHub Actions l\'utilise comme fallback.');
  } catch (err) {
    console.warn(`  ⚠️  Impossible d'écrire le cache JSON : ${err.message}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n📥 Synchronisation WordPress → Supabase\n');

  // Initialiser le client Supabase
  if (!sbUrl || !sbKey) {
    console.warn('⚠️  VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant dans .env');
    console.warn('   → Supabase sera ignoré. Seul le cache JSON sera mis à jour.\n');
  }
  const sb = sbUrl && sbKey ? createClient(sbUrl, sbKey) : null;

  // Récupérer les articles WordPress
  const allPosts = await fetchAllWPPosts();
  console.log(`\n  📄 ${allPosts.length} article(s) récupérés depuis WordPress`);

  // Upsert dans Supabase (si configuré)
  if (sb) {
    await upsertToSupabase(sb, allPosts);
  }

  // Mettre à jour le cache JSON de fallback
  saveWPCache(allPosts);

  console.log(`\n✅ Synchronisation terminée — ${allPosts.length} articles traités.\n`);
}

run().catch(err => {
  console.error('\n❌ Erreur :', err.message);
  process.exit(1);
});
