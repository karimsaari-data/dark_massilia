/**
 * api.js — Client WordPress Headless API
 *
 * Dark Massilia · karimsaari.com
 * CMS endpoint : https://cms.karimsaari.com/wp-json/wp/v2/
 *
 * Utilisé par :
 *   - src/pages/Blog.jsx       (liste paginée)
 *   - src/pages/BlogPost.jsx   (article par slug)
 *   - scripts/prerender.js     (slugs pour le rendu statique)
 *   - scripts/generate-sitemap.js (slugs + dates pour le sitemap)
 */

const WP_BASE = 'https://cms.karimsaari.com/wp-json/wp/v2';

// ── Liste des articles (paginée) ─────────────────────────────────────────────

export async function fetchPosts({ page = 1, perPage = 12, categoryId } = {}) {
  const params = new URLSearchParams({ _embed: '', per_page: perPage, page });
  if (categoryId) params.set('categories', String(categoryId));

  const res = await fetch(`${WP_BASE}/posts?${params}`);
  if (!res.ok) throw new Error(`WP API ${res.status}: ${res.statusText}`);

  const posts = await res.json();
  const total      = parseInt(res.headers.get('X-WP-Total')      ?? '0', 10);
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);

  return { posts: posts.map(normalizePost), total, totalPages };
}

// ── Article unique par slug ───────────────────────────────────────────────────

export async function fetchPostBySlug(slug) {
  const res = await fetch(`${WP_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed`);
  if (!res.ok) throw new Error(`WP API ${res.status}: ${res.statusText}`);

  const posts = await res.json();
  return posts[0] ? normalizePost(posts[0]) : null;
}

// ── Tous les slugs (pour prerender + sitemap) ─────────────────────────────────

export async function fetchAllSlugs() {
  const slugs = [];
  let page = 1;
  let totalPages = 1;

  do {
    const params = new URLSearchParams({ per_page: 100, page, _fields: 'slug', status: 'publish' });
    const res = await fetch(`${WP_BASE}/posts?${params}`);
    if (!res.ok) break;

    const posts = await res.json();
    posts.forEach(p => slugs.push(p.slug));
    totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
    page++;
  } while (page <= totalPages);

  return slugs;
}

// ── Tous les articles avec métadonnées (pour sitemap lastmod) ─────────────────

export async function fetchAllPostsMeta() {
  const metas = [];
  let page = 1;
  let totalPages = 1;

  do {
    const params = new URLSearchParams({ per_page: 100, page, _fields: 'slug,modified,title', status: 'publish' });
    const res = await fetch(`${WP_BASE}/posts?${params}`);
    if (!res.ok) break;

    const posts = await res.json();
    posts.forEach(p => metas.push({ slug: p.slug, modified: p.modified, title: p.title?.rendered || '' }));
    totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
    page++;
  } while (page <= totalPages);

  return metas;
}

// ── Normalisation de la réponse WP ───────────────────────────────────────────

export function normalizePost(post) {
  const media  = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];

  const rawTitle   = post.title?.rendered   ?? '';
  const rawExcerpt = post.excerpt?.rendered ?? '';

  // Préférer medium_large (768px) comme src principal → LCP plus rapide sur mobile
  // URL convertie en WebP (ShortPixel stocke les WebP avec extension remplacée)
  const sizes = media?.media_details?.sizes;
  const rawImageSrc =
    sizes?.medium_large?.source_url ??
    sizes?.large?.source_url ??
    media?.source_url ??
    extractFirstImage(post.content?.rendered ?? '') ??
    null;
  const imageSrc = rawImageSrc
    ? rawImageSrc.replace(/\.(png|jpe?g)$/i, '.webp')
    : null;

  const wpTerms      = post._embedded?.['wp:term'] ?? [];
  const categoryName = wpTerms[0]?.[0]?.name ?? null;

  return {
    id:            post.id,
    slug:          post.slug,
    title:         decodeEntities(rawTitle),
    excerpt:       stripHtml(rawExcerpt),
    content:       post.content?.rendered ?? '',
    date:          post.date,
    modified:      post.modified,
    dateFormatted: formatDate(post.date),
    image:         imageSrc,
    imageSrcset:   buildSrcset(media),
    imageWidth:    media?.media_details?.width  ?? 1280,
    imageHeight:   media?.media_details?.height ?? 720,
    imageAlt:      media?.alt_text || decodeEntities(rawTitle),
    author:        author?.name    ?? 'Dark Massilia',
    categories:    post.categories ?? [],
    categoryName,
  };
}

// ── Helpers privés ────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g,   '&')
    .replace(/&lt;/g,    '<')
    .replace(/&gt;/g,    '>')
    .replace(/&quot;/g,  '"')
    .replace(/&#039;/g,  "'")
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&hellip;/g,'…')
    .replace(/&nbsp;/g,  ' ')
    .trim();
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g,   '&')
    .replace(/&lt;/g,    '<')
    .replace(/&gt;/g,    '>')
    .replace(/&quot;/g,  '"')
    .replace(/&#039;/g,  "'")
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&hellip;/g,'…')
    .replace(/&eacute;/g,'é')
    .replace(/&egrave;/g,'è')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&agrave;/g,'à')
    .replace(/&ccedil;/g,'ç')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&ugrave;/g,'ù')
    .replace(/&nbsp;/g,  ' ');
}

function extractFirstImage(html) {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

// Construit un srcset à partir des tailles générées par WordPress.
// - Plafond à 1200px : évite les variants 1536/2048px (PNG 1-3 Mo sur Retina)
// - URLs converties en WebP : ShortPixel stocke les WebP avec extension remplacée
//   (ex: image-768x413.png → image-768x413.webp), ce qui réduit le poids de 60-80%.
function buildSrcset(media) {
  const sizes = media?.media_details?.sizes;
  if (!sizes) return null;
  const entries = Object.values(sizes)
    .filter(s => s?.source_url && s?.width && s.width <= 1200)
    .map(s => {
      const webpUrl = s.source_url.replace(/\.(png|jpe?g)$/i, '.webp');
      return `${webpUrl} ${s.width}w`;
    });
  return entries.length ? entries.join(', ') : null;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
