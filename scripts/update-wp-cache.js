/**
 * scripts/update-wp-cache.js — Mise à jour du cache WP local
 *
 * Récupère tous les articles WordPress (avec contenu complet) et les sauvegarde
 * dans scripts/wp-posts-cache.json. Ce fichier est commité dans le dépôt et
 * sert de fallback lors des builds GitHub Actions quand le CMS est inaccessible
 * depuis les runners Azure (firewall Easy Hebergement).
 *
 * Usage :
 *   node scripts/update-wp-cache.js
 *   (à lancer localement après chaque publication d'article)
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.resolve(__dirname, 'wp-posts-cache.json');
const WP_BASE    = 'https://cms.karimsaari.com/wp-json/wp/v2';

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

async function run() {
  console.log('\n📥 Mise à jour du cache WP local…\n');

  const allPosts = [];
  let page = 1;
  let totalPages = 1;

  do {
    process.stdout.write(`  Page ${page}/${totalPages}…`);
    const res = await fetch(
      `${WP_BASE}/posts?per_page=100&page=${page}&_embed&status=publish`,
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

  fs.writeFileSync(
    CACHE_PATH,
    JSON.stringify({ generated: new Date().toISOString(), posts: allPosts }, null, 2),
    'utf-8',
  );

  const kb = Math.round(fs.statSync(CACHE_PATH).size / 1024);
  console.log(`\n✅ ${allPosts.length} articles sauvegardés → scripts/wp-posts-cache.json (${kb} Ko)`);
  console.log('   → Committez ce fichier pour que GitHub Actions l\'utilise comme fallback.\n');
}

run().catch(err => {
  console.error('\n❌ Erreur :', err.message);
  process.exit(1);
});
