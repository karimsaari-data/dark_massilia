/**
 * sync-indexed-pages.mjs
 *
 * Synchronise la table Supabase `indexed_pages` avec toutes les URLs
 * connues du site karimsaari.com :
 *   - Pages statiques + articles blog  → public/sitemap.xml
 *
 * Usage :
 *   npm run pages:sync
 *
 * Nécessite SUPABASE_SERVICE_KEY dans .env (droits d'écriture RLS).
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');

// ── Supabase (service role pour les inserts) ─────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
                  || 'https://bzlllfmpojcybuyuemdx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌  SUPABASE_SERVICE_KEY manquant dans .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Mapping URL → page_type ──────────────────────────────────────
function inferPageType(url) {
  const path = url.replace('https://karimsaari.com', '');

  if (path === '/blog' || path.startsWith('/blog/categorie/')) return 'page';
  if (path.startsWith('/blog/'))                               return 'blog';

  if (
    path.startsWith('/photographie-') ||
    path.startsWith('/photographe-')  ||
    path.startsWith('/carte-photos')
  ) return 'photo';

  if (path.startsWith('/carte-')) return 'map';

  if ([
    '/videos',
    '/sauver-marseille-documentaire-arte',
    '/meduses-souveraines-oceans-documentaire-arte',
    '/echappees-belles-bouches-du-rhone',
    '/les-francais-yann-arthus-bertrand',
  ].includes(path)) return 'video';

  if ([
    '/presse',
    '/dossier-presse',
  ].includes(path)) return 'media';

  return 'page';
}

// ── Parse sitemap.xml ────────────────────────────────────────────
function parseSitemap(filePath) {
  const xml  = readFileSync(filePath, 'utf-8');
  const rows = [];

  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const block of urlBlocks) {
    const locMatch     = block.match(/<loc>([^<]+)<\/loc>/);
    const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/);
    if (!locMatch) continue;

    const url = locMatch[1].trim();
    if (!url.startsWith('https://karimsaari.com')) continue;

    rows.push({
      url,
      page_type: inferPageType(url),
      title:     null, // rempli si nécessaire via une autre source
    });
  }
  return rows;
}

// ── Titre depuis le HTML prérendu ────────────────────────────────
function extractTitleFromHtml(url) {
  const path    = url.replace('https://karimsaari.com', '') || '/';
  const htmlPath = resolve(ROOT, 'dist', path.replace(/^\//, ''), 'index.html');
  if (!existsSync(htmlPath)) return null;
  const html  = readFileSync(htmlPath, 'utf-8');
  const match = html.match(/<title>([^<]+)<\/title>/i);
  if (!match) return null;
  // Nettoie le suffixe " | karimsaari.com" ou " — Dark Massilia"
  return match[1].replace(/\s*[|—–-]\s*(karimsaari\.com|Dark Massilia|Karim Saari).*$/i, '').trim();
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log('\n📄  Sync indexed_pages — karimsaari.com\n');

  // 1. Sitemap principal (pages statiques + blog)
  const sitemapPath = resolve(ROOT, 'public/sitemap.xml');
  const rows        = parseSitemap(sitemapPath);
  console.log(`   Sitemap         : ${rows.length} URLs`);

  // 2. Titres articles blog depuis Supabase blog_posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, title');
  const blogTitles = new Map((blogPosts || []).map(p => [p.slug, p.title]));

  // 3. Enrichir les titres
  for (const row of rows) {
    const path = row.url.replace('https://karimsaari.com', '');
    if (row.page_type === 'blog') {
      const slug = path.replace('/blog/', '');
      row.title  = blogTitles.get(slug) || extractTitleFromHtml(row.url);
    } else {
      row.title = extractTitleFromHtml(row.url);
    }
  }
  const withTitle = rows.filter(r => r.title).length;
  console.log(`   Titres résolus  : ${withTitle}/${rows.length}`);

  // 4. Résumé par type
  const byType = rows.reduce((acc, r) => {
    acc[r.page_type] = (acc[r.page_type] || 0) + 1;
    return acc;
  }, {});
  Object.entries(byType).sort().forEach(([t, n]) =>
    console.log(`     ${t.padEnd(10)} ${n}`)
  );

  // 5. Upsert dans Supabase
  console.log(`\n⚙️   Upsert dans indexed_pages…`);
  const BATCH = 100;
  let upserted = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase
      .from('indexed_pages')
      .upsert(batch, { onConflict: 'url', ignoreDuplicates: false });

    if (error) {
      console.error(`\n❌  Supabase upsert error : ${error.message}`);
      process.exit(1);
    }
    upserted += batch.length;
  }

  console.log(`✅  ${upserted} URLs synchronisées dans indexed_pages\n`);
}

main().catch(e => { console.error('\n❌  Erreur fatale :', e); process.exit(1); });
