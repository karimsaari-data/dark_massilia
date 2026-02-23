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

// ── Routes à prérendrer ─────────────────────────────────────────────────────
const ROUTES = [
  '/',
  '/missions',
  '/medias',
  '/photos',
  '/videos',
  '/reseaux',
  '/twitter',
  '/arte',
  '/sources',
  '/contact',
  '/carte',
  '/local-guide',
  '/admin',
];

async function prerender() {
  console.log('\n🏗  Prérendu statique — Dark Massilia\n');

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
  const template = fs.readFileSync(templatePath, 'utf-8');

  // ── 3. Importer le module SSR compilé ───────────────────────────────────
  const ssrModulePath = path.resolve(rootDir, 'dist-ssr/entry-server.js');
  // pathToFileURL requis sur Windows (les chemins absolus doivent être file://)
  const { render } = await import(pathToFileURL(ssrModulePath).href);

  // ── 4. Rendre chaque route ───────────────────────────────────────────────
  for (const route of ROUTES) {
    process.stdout.write(`  🔧 ${route.padEnd(15)}`);

    try {
      const { html: appHtml } = render(route);

      // ── Extraire les meta tags du rendu SSR et les hisser dans <head> ──
      // React 19 / renderToString : <title>, <meta>, <link> sont rendus inline
      // dans le body (pas de hoisting). On les extrait manuellement pour les
      // injecter dans <head> et améliorer le SEO (social cards, bots sans JS).
      let finalTemplate = template;

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

      // Injecter le HTML rendu dans le placeholder <!--app-html-->
      const pageHtml = finalTemplate.replace('<!--app-html-->', appHtml);

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
    }
  }

  // ── 5. Nettoyage du bundle SSR temporaire ────────────────────────────────
  const ssrDir = path.resolve(rootDir, 'dist-ssr');
  fs.rmSync(ssrDir, { recursive: true, force: true });
  console.log('\n  🧹 Bundle SSR temporaire supprimé');

  console.log('\n✅ Prérendu terminé — tous les fichiers dans dist/\n');
}

prerender().catch((err) => {
  console.error('\n❌ Erreur de prérendu :', err);
  process.exit(1);
});
