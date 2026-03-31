/**
 * scripts/prerender.js — Prérendu statique des routes React
 *
 * Ce script :
 *  1. Lit le template index.html du build client (dist/index.html)
 *  2. Build le bundle SSR (entry-server.jsx) via Vite
 *  3. Pour chaque route, appelle render(url) et injecte le HTML dans le template
 *  4. Sauvegarde chaque route comme dist/{route}/index.html
 *
 * Usage :
 *   node scripts/prerender.js
 *   (appelé automatiquement par npm run build:full)
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build as viteBuild } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir   = path.resolve(__dirname, '..');
const distDir   = path.resolve(rootDir, 'dist');

// ── Routes statiques à prérendrer ────────────────────────────────────────────
const STATIC_ROUTES = [
  '/',
  '/blog',
  '/depollution-marine',
  '/presse',
  '/photographie-paysage-mer',
  '/photographie-sous-marine',
  '/videos',
  '/communaute',
  '/actualites',
  '/sauver-marseille-documentaire-arte',
  '/meduses-souveraines-oceans-documentaire-arte',
  '/donnees-scientifiques',
  '/contact',
  '/carte-calanques',
  '/local-guide-marseille',
  '/les-francais-yann-arthus-bertrand',
  '/mentions-legales',
  '/confidentialite',
  '/admin',
];

// ── Récupération des slugs + dates de modification WP ────────────────────────
// Retourne [{ slug, modified }] pour permettre le prérendu incrémental
async function fetchWPMeta() {
  const WP_BASE = 'https://cms.karimsaari.com/wp-json/wp/v2';
  const metas = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      let res;
      try {
        res = await fetch(
          `${WP_BASE}/posts?per_page=100&page=${page}&_fields=slug,modified&status=publish`,
          { signal: controller.signal }
        );
      } finally {
        clearTimeout(timer);
      }
      if (!res.ok) {
        console.warn(`  ⚠️  WP API ${res.status} — les routes /blog/:slug seront ignorées.`);
        return [];
      }
      const posts = await res.json();
      posts.forEach(p => metas.push({ slug: p.slug, modified: p.modified }));
      totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
      page++;
    } while (page <= totalPages);
  } catch (err) {
    console.warn(`  ⚠️  Impossible de contacter le CMS WP : ${err.message}`);
    console.warn('      Les routes /blog/:slug seront ignorées pour ce build.');
    return [];
  }

  return metas;
}

// ── Pré-fetch parallèle des articles WP (batch de 5) ─────────────────────────
// Divise le temps de fetch par ~5 vs. séquentiel pur
async function prefetchWPPosts(slugs, batchSize = 5) {
  const cache = new Map();
  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(slug => fetchWPPost(slug)));
    batch.forEach((slug, idx) => cache.set(slug, results[idx]));
  }
  return cache;
}

// ── Construit le srcset WebP plafonné à 1200px (miroir de api.js) ────────────
function buildSrcsetSSR(media) {
  const sizes = media?.media_details?.sizes;
  if (!sizes) return null;
  const entries = Object.values(sizes)
    .filter(s => s?.source_url && s?.width && s.width <= 1200)
    .map(s => `${s.source_url.replace(/\.(png|jpe?g)$/i, '.webp')} ${s.width}w`);
  return entries.length ? entries.join(', ') : null;
}

// ── Récupération d'un article WP pour injection SSR ──────────────────────────
async function fetchWPPost(slug) {
  const WP_BASE = 'https://cms.karimsaari.com/wp-json/wp/v2';
  try {
    const res = await fetch(`${WP_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed`);
    if (!res.ok) return null;
    const posts = await res.json();
    if (!posts[0]) return null;

    const post   = posts[0];
    const media  = post._embedded?.['wp:featuredmedia']?.[0];
    const author = post._embedded?.author?.[0];

    // Utiliser medium_large (768px) comme src principal + conversion WebP
    // (identique à normalizePost dans api.js pour cohérence SSR/client)
    const sizes      = media?.media_details?.sizes;
    const rawSrc     = sizes?.medium_large?.source_url
                    ?? sizes?.large?.source_url
                    ?? media?.source_url
                    ?? extractFirstImage(post.content?.rendered ?? '')
                    ?? null;
    const imageSrc     = rawSrc ? rawSrc.replace(/\.(png|jpe?g)$/i, '.webp') : null;
    const imageSrcset  = buildSrcsetSSR(media);

    return {
      id:            post.id,
      slug:          post.slug,
      title:         stripEntities(post.title?.rendered ?? ''),
      excerpt:       stripHtml(post.excerpt?.rendered ?? ''),
      content:       post.content?.rendered ?? '',
      date:          post.date,
      modified:      post.modified,
      dateFormatted: new Date(post.date).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
      }),
      image:         imageSrc,
      imageSrcset:   imageSrcset,
      imageWidth:    media?.media_details?.width  ?? 1280,
      imageHeight:   media?.media_details?.height ?? 720,
      imageAlt:      media?.alt_text || stripEntities(post.title?.rendered ?? ''),
      author:        author?.name    ?? 'Dark Massilia',
    };
  } catch (_) {
    return null;
  }
}

function extractFirstImage(html) {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
function stripEntities(str) {
  return str
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&hellip;/g,'…')
    .replace(/&laquo;/g,'«').replace(/&raquo;/g,'»').replace(/&nbsp;/g,' ');
}

async function prerender() {
  console.log('\n🏗  Prérendu statique — Dark Massilia\n');

  // ── 0. Récupérer les métadonnées WP (slug + modified) ───────────────────
  console.log('  🌐 Récupération des métadonnées WordPress…');
  const wpMetas = await fetchWPMeta();
  const BLOG_ROUTES = wpMetas.map(({ slug }) => `/blog/${slug}`);
  const ROUTES = [...STATIC_ROUTES, ...BLOG_ROUTES];

  if (wpMetas.length > 0) {
    console.log(`  ✅ ${wpMetas.length} article(s) WP trouvé(s)`);
  } else {
    console.log('  ℹ️  Aucun article WP — seul /blog (index) sera prérendu');
  }

  // ── 0b. Prérendu incrémental : détecter les articles à jour ─────────────
  // Si dist/blog/{slug}/index.html existe et est plus récent que la date WP
  // → inutile de re-fetcher et re-rendre cet article
  const slugsToUpdate = wpMetas
    .filter(({ slug, modified }) => {
      const outFile = path.resolve(distDir, `blog/${slug}/index.html`);
      if (!fs.existsSync(outFile)) return true; // nouveau → à créer
      const fileMtime  = fs.statSync(outFile).mtime;
      const wpModified = new Date(modified);
      return fileMtime <= wpModified;            // modifié depuis dernier build
    })
    .map(({ slug }) => slug);

  const skippedCount = wpMetas.length - slugsToUpdate.length;
  if (skippedCount > 0) {
    console.log(`  ⏭  ${skippedCount} article(s) inchangé(s), skippé(s)`);
  }
  if (slugsToUpdate.length > 0) {
    console.log(`  🔄 ${slugsToUpdate.length} article(s) à re-rendre`);
  }

  // ── 0c. Pré-fetch parallèle des articles à mettre à jour (batch de 5) ───
  let wpPostCache = new Map();
  if (slugsToUpdate.length > 0) {
    console.log('  📥 Fetch parallèle des articles WP (batch×5)…');
    wpPostCache = await prefetchWPPosts(slugsToUpdate);
    console.log(`  ✅ ${slugsToUpdate.length} article(s) fetchés\n`);
  } else {
    console.log('');
  }

  // ── 1. Build SSR bundle ─────────────────────────────────────────────────
  console.log('  📦 Build du bundle SSR…');

  // configFile: false — on n'hérite PAS de vite.config.js (sinon manualChunks
  // entre en conflit avec le mode SSR où react/react-dom sont externalisés)
  await viteBuild({
    configFile: false,          // ← clé : ignore vite.config.js
    root: rootDir,
    logLevel: 'warn',
    plugins: [(await import('@vitejs/plugin-react')).default()],
    build: {
      ssr: true,
      ssrEmitAssets: false,
      outDir: path.resolve(rootDir, 'dist-ssr'),
      rollupOptions: {
        input: path.resolve(rootDir, 'src/entry-server.jsx'),
        output: { format: 'esm' },
      },
    },
    ssr: {
      noExternal: ['react-dom'],
    },
  });
  console.log('  ✅ Bundle SSR généré\n');

  // ── 2. Lire le template HTML (build client déjà fait) ──────────────────
  const templatePath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `dist/index.html introuvable. Lancez d'abord "vite build".\n` +
      `Utilisez "npm run build:full" pour tout builder d'un coup.`
    );
  }
  let template = fs.readFileSync(templatePath, 'utf-8');

  // ── 2b. Injecter les preloads critiques très tôt dans <head> ────────────
  // Vite génère <link rel="stylesheet"> et <script type="module"> en fin de <head>
  // (après GTM, meta tags, favicons…). En ajoutant modulepreload + preload juste
  // après <meta charset>, le navigateur mobile démarre le téléchargement PENDANT
  // qu'il parse le reste du head — gain ~150–300 ms sur connexion 4G lente.
  {
    const cssHref = template.match(/<link rel="stylesheet" crossorigin href="([^"]+\.css)"/)?.[1];
    const jsHref  = template.match(/<script type="module" crossorigin src="([^"]+\.js)"/)?.[1];

    let earlyHints = '';
    // preload as="style" : démarre le téléchargement CSS avant le parser-blocking
    if (cssHref) earlyHints += `    <link rel="preload" as="style" crossorigin href="${cssHref}">\n`;
    // modulepreload : pré-fetch + pré-parse le bundle JS principal
    if (jsHref)  earlyHints += `    <link rel="modulepreload" crossorigin href="${jsHref}">\n`;

    if (earlyHints) {
      template = template.replace(
        /(<meta charset="[^"]*"\s*\/>)/,
        `$1\n${earlyHints.trimEnd()}`
      );
    }
  }

  // ── 3. Importer le module SSR compilé ───────────────────────────────────
  const ssrModulePath = path.resolve(rootDir, 'dist-ssr/entry-server.js');
  // pathToFileURL requis sur Windows (les chemins absolus doivent être file://)
  const { render } = await import(pathToFileURL(ssrModulePath).href);

  // ── 4. Rendre chaque route ───────────────────────────────────────────────
  for (const route of ROUTES) {
    process.stdout.write(`  🔧 ${route.padEnd(60)}`);

    try {
      // Pour les routes /blog/:slug, pré-injecter les données WP dans globalThis
      // BlogPost.jsx lit globalThis.__WP_SSR_DATA__ de façon synchrone lors du render()
      if (route.startsWith('/blog/')) {
        const slug = route.slice('/blog/'.length);

        // Prérendu incrémental : skip si article inchangé
        if (!slugsToUpdate.includes(slug)) {
          console.log(`  ⏭  ${route.padEnd(60)}→ inchangé`);
          continue;
        }

        // Données pré-fetchées en parallèle (déjà dans le cache)
        globalThis.__WP_SSR_DATA__ = wpPostCache.get(slug) ?? null;
      } else {
        globalThis.__WP_SSR_DATA__ = null;
      }

      const { html: appHtml } = render(route);

      // ── Extraire les meta tags du rendu SSR et les hisser dans <head> ──
      // React 19 / renderToString : <title>, <meta>, <link> sont rendus inline
      // dans le body (pas de hoisting). On les extrait manuellement pour les
      // injecter dans <head> et améliorer le SEO (social cards, bots sans JS).
      let finalTemplate = template;

      // ── Injecter un <link rel="preload"> explicite pour l'image hero des articles ──
      // PSI vérifie que la ressource LCP est "visible dans le document initial" :
      // un preload dans <head> garantit que le navigateur démarre le téléchargement
      // AVANT l'exécution de JS, ce qui réduit le LCP de plusieurs secondes.
      if (route.startsWith('/blog/')) {
        const slug    = route.slice('/blog/'.length);
        const wpPost  = wpPostCache.get(slug);
        if (wpPost?.image) {
          const srcset = wpPost.imageSrcset
            ? ` imagesrcset="${wpPost.imageSrcset}" imagesizes="(max-width: 480px) 100vw, (max-width: 900px) 100vw, 800px"`
            : '';
          const preloadTag = `    <link rel="preload" as="image" fetchpriority="high" href="${wpPost.image}"${srcset}>\n`;
          finalTemplate = finalTemplate.replace('</head>', `${preloadTag}  </head>`);
        }
      }

      // Extraire le <title> page-spécifique depuis le début du HTML rendu
      const renderedTitle = appHtml.match(/<title>([\s\S]*?)<\/title>/);
      if (renderedTitle) {
        finalTemplate = finalTemplate.replace(
          /<title>[^<]*<\/title>/,
          `<title>${renderedTitle[1]}</title>`
        );
      }

      // Extraire la <meta name="description"> page-spécifique
      const renderedDesc = appHtml.match(/<meta name="description" content="([^"]+)"/);
      if (renderedDesc) {
        finalTemplate = finalTemplate.replace(
          /<meta name="description" content="[^"]*"/,
          `<meta name="description" content="${renderedDesc[1]}"`
        );
      }

      // Extraire le <link rel="canonical"> page-spécifique
      const renderedCanon = appHtml.match(/<link rel="canonical" href="([^"]+)"/);
      if (renderedCanon) {
        finalTemplate = finalTemplate.replace(
          /<link rel="canonical" href="[^"]*"/,
          `<link rel="canonical" href="${renderedCanon[1]}"`
        );
      }

      // Extraire l'og:title page-spécifique
      const renderedOgTitle = appHtml.match(/<meta property="og:title" content="([^"]+)"/);
      if (renderedOgTitle) {
        finalTemplate = finalTemplate.replace(
          /<meta property="og:title" content="[^"]*"/,
          `<meta property="og:title" content="${renderedOgTitle[1]}"`
        );
      }

      // Extraire l'og:description page-spécifique
      const renderedOgDesc = appHtml.match(/<meta property="og:description" content="([^"]+)"/);
      if (renderedOgDesc) {
        finalTemplate = finalTemplate.replace(
          /<meta property="og:description" content="[^"]*"/,
          `<meta property="og:description" content="${renderedOgDesc[1]}"`
        );
      }

      // Extraire l'og:url page-spécifique
      const renderedOgUrl = appHtml.match(/<meta property="og:url" content="([^"]+)"/);
      if (renderedOgUrl) {
        finalTemplate = finalTemplate.replace(
          /<meta property="og:url" content="[^"]*"/,
          `<meta property="og:url" content="${renderedOgUrl[1]}"`
        );
      }

      // Extraire l'og:image page-spécifique
      const renderedOgImage = appHtml.match(/<meta property="og:image" content="([^"]+)"/);
      if (renderedOgImage) {
        finalTemplate = finalTemplate.replace(
          /<meta property="og:image" content="[^"]*"/,
          `<meta property="og:image" content="${renderedOgImage[1]}"`
        );
      }

      // Extraire og:image:width et og:image:height (requis par FB pour traitement synchrone)
      const renderedOgImageWidth = appHtml.match(/<meta property="og:image:width" content="([^"]+)"/);
      if (renderedOgImageWidth) {
        finalTemplate = finalTemplate.replace(
          /<meta property="og:image:width" content="[^"]*"/,
          `<meta property="og:image:width" content="${renderedOgImageWidth[1]}"`
        );
      }
      const renderedOgImageHeight = appHtml.match(/<meta property="og:image:height" content="([^"]+)"/);
      if (renderedOgImageHeight) {
        finalTemplate = finalTemplate.replace(
          /<meta property="og:image:height" content="[^"]*"/,
          `<meta property="og:image:height" content="${renderedOgImageHeight[1]}"`
        );
      }

      // Extraire l'og:image:alt page-spécifique
      const renderedOgImageAlt = appHtml.match(/<meta property="og:image:alt" content="([^"]+)"/);
      if (renderedOgImageAlt) {
        finalTemplate = finalTemplate.replace(
          /<meta property="og:image:alt" content="[^"]*"/,
          `<meta property="og:image:alt" content="${renderedOgImageAlt[1]}"`
        );
      }

      // Extraire l'og:type page-spécifique (article vs website)
      const renderedOgType = appHtml.match(/<meta property="og:type" content="([^"]+)"/);
      if (renderedOgType) {
        finalTemplate = finalTemplate.replace(
          /<meta property="og:type" content="[^"]*"/,
          `<meta property="og:type" content="${renderedOgType[1]}"`
        );
      }

      // Extraire les balises article:* (type="article" uniquement)
      const articleMetas = appHtml.match(/<meta property="article:[^"]*" content="[^"]*"[^>]*>/g) || [];
      if (articleMetas.length > 0) {
        finalTemplate = finalTemplate.replace(
          '</head>',
          `${articleMetas.map(m => `    ${m}`).join('\n')}\n  </head>`
        );
      }

      // Synchroniser les Twitter Card avec le title/description de la page
      // (twitter:title et twitter:description mirrorent og:title/og:description)
      if (renderedTitle) {
        finalTemplate = finalTemplate.replace(
          /<meta name="twitter:title" content="[^"]*"/,
          `<meta name="twitter:title" content="${renderedTitle[1]}"`
        );
      }
      if (renderedDesc) {
        finalTemplate = finalTemplate.replace(
          /<meta name="twitter:description" content="[^"]*"/,
          `<meta name="twitter:description" content="${renderedDesc[1]}"`
        );
      }

      // Extraire le twitter:image page-spécifique
      const renderedTwitterImage = appHtml.match(/<meta name="twitter:image" content="([^"]+)"/);
      if (renderedTwitterImage) {
        finalTemplate = finalTemplate.replace(
          /<meta name="twitter:image" content="[^"]*"/,
          `<meta name="twitter:image" content="${renderedTwitterImage[1]}"`
        );
      }

      // Injecter la directive robots si la page est noindex
      const renderedRobots = appHtml.match(/<meta name="robots" content="([^"]+)"/);
      if (renderedRobots) {
        finalTemplate = finalTemplate.replace(
          '</head>',
          `  <meta name="robots" content="${renderedRobots[1]}">\n  </head>`
        );
      }

      // ── JSON-LD Schema.org ──────────────────────────────────────────────────
      // 1. Supprimer les blocs JSON-LD statiques du template (remplacés ci-dessous
      //    par les schemas rendus par le composant SEO React, toujours plus complets)
      finalTemplate = finalTemplate.replace(
        /[ \t]*(?:<!--[^\n]*-->\n[ \t]*)?<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g,
        ''
      );
      // 2. Extraire tous les JSON-LD rendus par React et les injecter dans <head>
      const schemaMatches = appHtml.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || [];
      if (schemaMatches.length > 0) {
        const schemasBlock = schemaMatches.map(s => `    ${s}`).join('\n');
        finalTemplate = finalTemplate.replace('</head>', `${schemasBlock}\n  </head>`);
      }

      // 3. Supprimer les balises SEO du appHtml avant injection dans le body
      //    (évite les doublons : déjà hoistées dans <head> par les étapes ci-dessus)
      let appHtmlClean = appHtml;
      // JSON-LD déjà dans <head>
      schemaMatches.forEach(match => {
        appHtmlClean = appHtmlClean.replace(match, '');
      });
      // Extraire les <link rel="preload" as="image" fetchpriority="high"> et les hisser dans <head>
      // Dédoublonner par href (React 19 peut émettre le même preload depuis <img> ET depuis SEO)
      const preloadImageMatches = appHtml.match(/<link rel="preload" as="image" [^>]*fetchPriority="high"[^>]*\/?>/gi) || [];
      if (preloadImageMatches.length > 0) {
        const seenHrefs = new Set();
        const unique = preloadImageMatches.filter(l => {
          const m = l.match(/href="([^"]+)"/i);
          if (!m || seenHrefs.has(m[1])) return false;
          seenHrefs.add(m[1]);
          return true;
        });
        const preloadsBlock = unique.map(l => `    ${l.replace(/fetchPriority/g, 'fetchpriority')}`).join('\n');
        finalTemplate = finalTemplate.replace('</head>', `${preloadsBlock}\n  </head>`);
      }

      // Autres balises SEO hoistées dans <head> → retirer du body pour éviter doublons
      appHtmlClean = appHtmlClean
        .replace(/<title>[\s\S]*?<\/title>/g, '')
        .replace(/<meta name="description"[^>]*\/?>/g, '')
        .replace(/<meta name="author"[^>]*\/?>/g, '')
        .replace(/<link rel="canonical"[^>]*\/?>/g, '')
        .replace(/<meta property="og:[^"]*"[^>]*\/?>/g, '')
        .replace(/<meta property="article:[^"]*"[^>]*\/?>/g, '')
        .replace(/<meta name="twitter:[^"]*"[^>]*\/?>/g, '')
        .replace(/<meta name="robots"[^>]*\/?>/g, '')
        .replace(/<link rel="preload" as="image" [^>]*fetchPriority="high"[^>]*\/?>/gi, '');

      // Injecter le HTML rendu dans le placeholder <!--app-html-->
      let pageHtml = finalTemplate.replace('<!--app-html-->', appHtmlClean);

      // ── /blog : injecter les liens d'articles pour les crawlers non-JS ──────
      // Blog.jsx charge les articles en client-side → le HTML prérendu est vide
      // de liens → Ahrefs/Bing voient les articles comme "orphelins" (0 inlinks).
      // On injecte un <noscript> avec tous les slugs connus pour que les crawlers
      // puissent les découvrir via la page index.
      if (route === '/blog' && BLOG_ROUTES.length > 0) {
        const articleLinks = BLOG_ROUTES
          .map(r => {
            const slug = r.replace('/blog/', '');
            const meta = wpMetas.find(m => m.slug === slug);
            const label = meta ? slug.replace(/-/g, ' ') : slug;
            return `<a href="${r}">${label}</a>`;
          })
          .join('\n        ');
        const noscriptNav = `\n  <noscript><nav aria-label="Articles du blog">\n        ${articleLinks}\n      </nav></noscript>`;
        pageHtml = pageHtml.replace('</body>', `${noscriptNav}\n</body>`);
      }

      // Déterminer le chemin de sortie
      // "/" → dist/index.html
      // "/missions" → dist/missions/index.html
      let outPath;
      if (route === '/') {
        outPath = path.resolve(distDir, 'index.html');
      } else {
        const routeDir = path.resolve(distDir, route.slice(1));
        fs.mkdirSync(routeDir, { recursive: true });
        outPath = path.resolve(routeDir, 'index.html');
      }

      fs.writeFileSync(outPath, pageHtml, 'utf-8');
      console.log(`→ ${path.relative(rootDir, outPath)}`);
    } catch (err) {
      console.log(`→ ❌ ERREUR`);
      console.error(`    ${err.message}`);
    } finally {
      // Toujours nettoyer les données SSR après chaque route
      globalThis.__WP_SSR_DATA__ = null;
    }
  }

  // ── 5. Nettoyage du bundle SSR temporaire ────────────────────────────────
  const ssrDir = path.resolve(rootDir, 'dist-ssr');
  fs.rmSync(ssrDir, { recursive: true, force: true });
  console.log('\n  🧹 Bundle SSR temporaire supprimé');

  console.log('\n✅ Prérendu terminé — tous les fichiers dans dist/\n');
}

prerender()
  .then(() => process.exit(0))   // ← force la sortie même si Vite laisse des handles ouverts
  .catch((err) => {
    console.error('\n❌ Erreur de prérendu :', err);
    process.exit(1);
  });
