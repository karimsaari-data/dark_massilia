/**
 * scripts/generate-sitemap.js — Génération du Sitemap XML global
 *
 * Fusionne les routes statiques React + les slugs dynamiques WordPress.
 * Génère public/sitemap.xml (copié dans dist/ par vite build).
 *
 * Usage :
 *   node scripts/generate-sitemap.js
 *   (appelé automatiquement par npm run build:full, AVANT vite build)
 *
 * Déclaration dans la Google Search Console :
 *   → https://karimsaari.com/sitemap.xml (source unique de vérité)
 *
 * Le sitemap WordPress (cms.karimsaari.com) NE doit PAS être soumis à GSC
 * pour éviter les doublons de contenu et protéger le crawl budget.
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir   = path.resolve(__dirname, '..');
const outPath   = path.resolve(rootDir, 'public', 'sitemap.xml');

const BASE_URL = 'https://karimsaari.com';
const WP_BASE  = 'https://cms.karimsaari.com/wp-json/wp/v2';
const TODAY    = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// ── Routes statiques ─────────────────────────────────────────────────────────
// priority : importance relative pour Googlebot (1.0 = max)
// changefreq : conseil de fréquence de crawl

const STATIC_PAGES = [
  { path: '/',                                              priority: '1.0', changefreq: 'weekly'  },
  { path: '/depollution-marine',                           priority: '0.9', changefreq: 'monthly' },
  { path: '/blog',                                         priority: '0.9', changefreq: 'weekly'  },
  { path: '/communaute',                                   priority: '0.8', changefreq: 'monthly' },
  { path: '/photographie-paysage-mer',                     priority: '0.8', changefreq: 'monthly' },
  { path: '/photographie-sous-marine',                     priority: '0.8', changefreq: 'monthly' },
  { path: '/videos',                                       priority: '0.8', changefreq: 'monthly' },
  { path: '/carte-calanques',                              priority: '0.8', changefreq: 'weekly'  },
  { path: '/actualites',                                   priority: '0.6', changefreq: 'weekly'  },
  { path: '/presse',                                       priority: '0.7', changefreq: 'monthly' },
  { path: '/donnees-scientifiques',                        priority: '0.7', changefreq: 'monthly' },
  { path: '/local-guide-marseille',                        priority: '0.7', changefreq: 'monthly' },
  { path: '/les-francais-yann-arthus-bertrand',            priority: '0.7', changefreq: 'yearly'  },
  { path: '/sauver-marseille-documentaire-arte',           priority: '0.6', changefreq: 'yearly'  },
  { path: '/meduses-souveraines-oceans-documentaire-arte', priority: '0.6', changefreq: 'yearly' },
  { path: '/contact',                                      priority: '0.5', changefreq: 'yearly'  },
  // mentions-legales et confidentialite : volontairement absents (noindex implicite)
];

// ── Récupération des articles WP avec leur date de modification ───────────────
async function fetchWPMeta() {
  const metas = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const res = await fetch(
        `${WP_BASE}/posts?per_page=100&page=${page}&_fields=slug,modified&status=publish`
      );
      if (!res.ok) {
        console.warn(`  ⚠️  WP API ${res.status} — les URLs blog seront ignorées dans le sitemap.`);
        return [];
      }
      const posts = await res.json();
      posts.forEach(p => metas.push({
        slug:     p.slug,
        modified: p.modified ? p.modified.slice(0, 10) : TODAY,
      }));
      totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
      page++;
    } while (page <= totalPages);
  } catch (err) {
    console.warn(`  ⚠️  Impossible de contacter le CMS WP : ${err.message}`);
    return [];
  }

  return metas;
}

// ── Construction d'une entrée <url> ──────────────────────────────────────────
function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

// ── Génération du sitemap ─────────────────────────────────────────────────────
async function generateSitemap() {
  console.log('\n📍 Génération du Sitemap XML — Dark Massilia\n');

  // Routes statiques
  const staticEntries = STATIC_PAGES.map(p =>
    urlEntry({
      loc:        `${BASE_URL}${p.path}`,
      lastmod:    TODAY,
      changefreq: p.changefreq,
      priority:   p.priority,
    })
  );

  // Routes dynamiques WordPress
  console.log('  🌐 Récupération des métadonnées WordPress…');
  const wpMeta = await fetchWPMeta();

  const blogEntries = wpMeta.map(({ slug, modified }) =>
    urlEntry({
      loc:        `${BASE_URL}/blog/${slug}`,
      lastmod:    modified,
      changefreq: 'monthly',
      priority:   '0.8',
    })
  );

  if (wpMeta.length > 0) {
    console.log(`  ✅ ${wpMeta.length} article(s) WP intégré(s) dans le sitemap`);
  } else {
    console.log('  ℹ️  Aucun article WP — sitemap statique uniquement');
  }

  // Assemblage XML
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...blogEntries,
    '</urlset>',
  ].join('\n');

  // Écriture
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, 'utf-8');

  const totalUrls = STATIC_PAGES.length + blogEntries.length;
  console.log(`\n  📄 ${totalUrls} URL(s) écrites dans public/sitemap.xml`);
  console.log('✅ Sitemap généré\n');
}

generateSitemap().catch(err => {
  console.error('\n❌ Erreur génération sitemap :', err);
  process.exit(1);
});
