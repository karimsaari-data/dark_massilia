/**
 * scripts/generate-sitemap-images.js — Génération du Sitemap Images XML
 *
 * Couvre :
 *   1. Portfolio photo (Mer & Terre) → /photographie-paysage-mer   (données Supabase)
 *   2. Galerie sous-marine           → /photographie-sous-marine    (données Supabase)
 *   3. Articles Blog (WP API)        → /blog/{slug}
 *
 * Les URLs, titres et lieux viennent directement de Supabase pour être
 * toujours synchronisés avec ce qui est affiché sur le site.
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir   = path.resolve(__dirname, '..');
const outPath   = path.resolve(rootDir, 'public', 'sitemap-images.xml');

const BASE_URL = 'https://karimsaari.com';
const WP_BASE  = 'https://cms.karimsaari.com/wp-json/wp/v2';
const CAPTION  = 'Photographie © Karim Saari — Dark Massilia — karimsaari.com';

// ── Lecture du .env ───────────────────────────────────────────────────────────
function loadEnv() {
  const candidates = [
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '.env'),
  ];
  const vars = {};
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    fs.readFileSync(p, 'utf-8').split(/\r?\n/).forEach(line => {
      const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (m) vars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    });
    break;
  }
  return vars;
}

// ── Supabase : fetch photos_paysage + photos_sous_marine ─────────────────────
async function fetchPhotos() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('  ⚠️  Supabase env vars manquantes — sitemap images statique uniquement');
    return { paysage: [], sousMarine: [] };
  }
  const sb = createClient(url, key);

  const [p, s] = await Promise.all([
    sb.from('photos_paysage').select('uid, src, title, alt, lieu, categorie, visible').eq('visible', true).order('uid'),
    sb.from('photos_sous_marine').select('uid, src, title, alt, lieu, visible').eq('visible', true).order('uid'),
  ]);

  if (p.error) console.warn('  ⚠️  Supabase photos_paysage :', p.error.message);
  if (s.error) console.warn('  ⚠️  Supabase photos_sous_marine :', s.error.message);

  return { paysage: p.data || [], sousMarine: s.data || [] };
}

// ── Échappement XML ───────────────────────────────────────────────────────────
function escXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const LICENSE_URL = 'https://karimsaari.com/contact';

// ── Entrée <image:image> ──────────────────────────────────────────────────────
function imageEntry({ loc, title, caption = CAPTION, geo = '' }) {
  const lines = [
    '    <image:image>',
    `      <image:loc>${escXml(loc)}</image:loc>`,
    `      <image:title>${escXml(title)}</image:title>`,
    `      <image:caption>${escXml(caption)}</image:caption>`,
    `      <image:license>${LICENSE_URL}</image:license>`,
  ];
  if (geo) lines.push(`      <image:geo_location>${escXml(geo)}</image:geo_location>`);
  lines.push('    </image:image>');
  return lines.join('\n');
}

// ── Entrée <url> ──────────────────────────────────────────────────────────────
function urlEntry(pageUrl, imageEntries) {
  return [
    '  <url>',
    `    <loc>${escXml(pageUrl)}</loc>`,
    ...imageEntries,
    '  </url>',
  ].join('\n');
}

// ── Détection de captions placeholder (Supabase) ─────────────────────────────
function isPlaceholderAlt(alt) {
  const v = (alt || '').trim().toLowerCase();
  return v === '' || v === 'test' || v === 'test alt text' || v.startsWith('test ');
}

// ── 1. Portfolio Paysage (Mer + Terre) ────────────────────────────────────────
function buildPortfolioBlock(photos) {
  const entries = photos.map(photo => {
    const isMer    = photo.categorie === 'mer';
    const baseTitle = photo.title || photo.alt || `Photographie — Karim Saari`;
    const title    = isMer
      ? `${baseTitle} — Photographe Calanques Marseille`
      : baseTitle;
    const altClean    = isPlaceholderAlt(photo.alt) ? null : photo.alt;
    const baseCaption = altClean || CAPTION;
    const caption  = isMer
      ? `${baseCaption} — © Karim Saari, photographe Calanques Marseille`
      : baseCaption;
    const geo      = photo.lieu  || 'Marseille, France';
    const loc      = `${BASE_URL}${photo.src}`;
    return imageEntry({ loc, title, caption, geo });
  });
  return urlEntry(`${BASE_URL}/photographie-paysage-mer`, entries);
}

// ── 2. Galerie Sous-Marine ────────────────────────────────────────────────────
function buildSousMarineBlock(photos) {
  const entries = photos.map(photo => {
    const title   = photo.title || photo.alt || `Dépollution marine — Projet Sentinelle Marseille`;
    const caption = isPlaceholderAlt(photo.alt) ? CAPTION : (photo.alt || CAPTION);
    const geo     = photo.lieu  || 'Calanques de Marseille, France';
    const loc     = `${BASE_URL}${photo.src}`;
    return imageEntry({ loc, title, caption, geo });
  });
  return urlEntry(`${BASE_URL}/photographie-sous-marine`, entries);
}

// ── 3. Blog WP ────────────────────────────────────────────────────────────────
async function fetchBlogFeaturedImages() {
  const results = [];
  let page = 1;
  let totalPages = 1;
  try {
    do {
      const res = await fetch(
        `${WP_BASE}/posts?per_page=100&page=${page}&_fields=slug,title,_links&_embed=wp:featuredmedia&status=publish`
      );
      if (!res.ok) {
        console.warn(`  ⚠️  WP API ${res.status} — images blog ignorées`);
        return [];
      }
      const posts = await res.json();
      for (const post of posts) {
        const media = post._embedded?.['wp:featuredmedia']?.[0];
        if (!media?.source_url) continue;
        results.push({
          slug:     post.slug,
          title:    post.title?.rendered?.replace(/<[^>]+>/g, '') || post.slug,
          imageUrl: media.source_url,
          imageAlt: media.alt_text || `Illustration — ${post.slug}`,
        });
      }
      totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
      page++;
    } while (page <= totalPages);
  } catch (err) {
    console.warn(`  ⚠️  CMS WP inaccessible : ${err.message} — images blog ignorées.`);
    return [];
  }
  return results;
}

function buildBlogBlocks(posts) {
  return posts.map(({ slug, title, imageUrl, imageAlt }) =>
    urlEntry(`${BASE_URL}/blog/${slug}`, [
      imageEntry({ loc: imageUrl, title: `${title} — Dark Massilia`, caption: imageAlt || CAPTION }),
    ])
  );
}

// ── Génération principale ─────────────────────────────────────────────────────
async function generateSitemapImages() {
  console.log('\n🖼️  Génération du Sitemap Images — Dark Massilia\n');

  const { paysage, sousMarine } = await fetchPhotos();
  console.log(`  📦 Supabase : ${paysage.length} paysages + ${sousMarine.length} sous-marines`);

  const blocks = [];

  // 1. Portfolio paysage
  if (paysage.length > 0) {
    blocks.push(buildPortfolioBlock(paysage));
    const mer   = paysage.filter(p => p.categorie === 'mer').length;
    const terre = paysage.filter(p => p.categorie === 'terre').length;
    console.log(`  ✅ Portfolio : ${paysage.length} images (${mer} Mer + ${terre} Terre)`);
  }

  // 2. Galerie sous-marine
  if (sousMarine.length > 0) {
    blocks.push(buildSousMarineBlock(sousMarine));
    console.log(`  ✅ Sous-marine : ${sousMarine.length} images`);
  }

  // 3. Blog WP
  console.log('  🌐 Récupération des images blog WordPress…');
  const blogPosts = await fetchBlogFeaturedImages();
  if (blogPosts.length > 0) {
    blocks.push(...buildBlogBlocks(blogPosts));
    console.log(`  ✅ Blog : ${blogPosts.length} article(s) avec image featured`);
  } else {
    console.log('  ℹ️  Aucune image blog — sitemap statique uniquement');
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '',
    ...blocks,
    '</urlset>',
  ].join('\n');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, 'utf-8');

  const total = paysage.length + sousMarine.length + blogPosts.length;
  console.log(`\n  📄 sitemap-images.xml généré — ${total} images référencées`);
  console.log('✅ Sitemap Images généré\n');
}

generateSitemapImages().catch(err => {
  console.error('\n❌ Erreur génération sitemap-images :', err);
  process.exit(1);
});
