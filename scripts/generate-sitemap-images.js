/**
 * scripts/generate-sitemap-images.js — Génération du Sitemap Images XML
 *
 * Couvre :
 *   1. Portfolio photo — Mer & Terre   → /photographie-paysage-mer
 *   2. Images dépollution Sentinelle   → /depollution-marine
 *   3. Images Blog (featured images WP) → /blog/{slug}
 *
 * Usage :
 *   node scripts/generate-sitemap-images.js
 *   (appelé automatiquement par npm run build:full, après generate-sitemap.js)
 *
 * Données images synchronisées avec src/pages/Photos.jsx & PhotoCarousel.jsx.
 * Si les IDs ou alts changent dans Photos.jsx, mettre à jour ici.
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir   = path.resolve(__dirname, '..');
const outPath   = path.resolve(rootDir, 'public', 'sitemap-images.xml');
const imagesDir = path.resolve(rootDir, 'public', 'images');

const BASE_URL = 'https://karimsaari.com';
const WP_BASE  = 'https://cms.karimsaari.com/wp-json/wp/v2';
const CAPTION  = 'Photographie © Karim Saari — Dark Massilia — karimsaari.com';
const GEO      = 'Marseille, France';

// ── Échappement XML ───────────────────────────────────────────────────────────
function escXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── Construction d'une entrée <image:image> ────────────────────────────────
function imageEntry({ loc, title, caption = CAPTION, geo = '' }) {
  const lines = [
    '    <image:image>',
    `      <image:loc>${escXml(loc)}</image:loc>`,
    `      <image:title>${escXml(title)}</image:title>`,
    `      <image:caption>${escXml(caption)}</image:caption>`,
  ];
  if (geo) lines.push(`      <image:geo_location>${escXml(geo)}</image:geo_location>`);
  lines.push('    </image:image>');
  return lines.join('\n');
}

// ── Construction d'une entrée <url> ──────────────────────────────────────────
function urlEntry(pageUrl, imageEntries) {
  return [
    '  <url>',
    `    <loc>${escXml(pageUrl)}</loc>`,
    ...imageEntries,
    '  </url>',
  ].join('\n');
}

// ── 1. Portfolio — Mer & Terre ────────────────────────────────────────────────
// IDs et alts synchronisés avec src/pages/Photos.jsx
const merIds = [
  2, 4, 6, 10, 12, 13, 14, 20, 22, 23, 30, 32, 33, 35, 39, 44, 45, 46, 47,
  50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
  70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 85, 86, 87, 88, 89,
  90, 91, 92, 93, 94, 95, 96, 97, 98,
];
const terreIds = [
  1, 3, 5, 7, 8, 9, 15, 16, 17, 18, 19, 21, 24, 25, 26, 27, 28, 29, 31, 34,
  36, 37, 38, 40, 41, 42, 43, 48, 49, 53, 54,
];

const merAlts = {
  2:  "Petit bateau de pêche blanc ancré sur l'eau turquoise cristalline d'une calanque — photographie aérienne Marseille",
  4:  "Vue mi-eau mi-ciel d'une calanque turquoise, fonds clairs et galets sous l'eau, falaises calcaires et pin — Calanques Marseille",
  6:  "Exploration en apnée d'une grotte marine dans les Calanques de Marseille — vue subjective, mains en néoprène, eau turquoise et parois calcaires",
  10: "Kayakistes sur l'eau turquoise d'une calanque encadrée de hautes falaises calcaires et de pins — Calanques de Marseille",
  12: "Vue depuis une grotte calcaire sur une calanque turquoise encadrée de pins et de falaises — Calanques de Marseille",
  13: "Coucher de soleil sur une plage de calanque entre deux falaises, ciel dramatique, reflets dorés sur le sable mouillé",
  14: "Silhouettes de deux personnes sur un banc et leur reflet parfait dans une flaque, Notre-Dame de la Garde en arrière-plan — Marseille",
  20: "Port du Vallon des Auffes au coucher de soleil, barques colorées, pont en arches, soleil en étoile — Marseille",
  22: "Femme en robe rouge sur une plage de galets face aux falaises volcaniques rouges — paysage côtier Marseille",
  23: "Calanque vue depuis une ouverture dans la roche, femme en bikini dans l'eau cristalline, aiguilles rocheuses en arrière-plan",
  30: "Street art marseillais — poisson coloré peint sous le mot MARSEILLE sur un mur de béton gris",
  32: "Vue fisheye depuis le sommet des Calanques, femme en robe bleue sur les rochers, anse et mer en contrebas",
  33: "Nageur solitaire dans les eaux émeraude translucides d'une anse entre falaises de roches rouges",
  35: "Vue aérienne plongeante sur une calanque turquoise, falaises calcaires blanches, silhouette d'un nageur dans l'eau",
  39: "Calanque sauvage avec pins méditerranéens, eau turquoise et rochers calcaires — Calanques de Marseille",
  44: "Femme en robe bleue les bras écartés sur un rocher calcaire en strates dans les Calanques de Marseille",
  45: "Silhouette d'une personne se reflétant dans une flaque sur la plage à côté d'une jetée en bois, ciel dramatique",
  46: "Kayakistes sur une calanque turquoise encadrée de falaises et de pins, vue à travers un arbre tordu au premier plan",
  47: "Vue aérienne de vagues blanches se brisant sur des rochers et une plage de sable — littoral méditerranéen",
  50: "Vue aérienne d'une calanque secrète, plage de galets, eau émeraude encadrée de falaises calcaires et de végétation",
  51: "Falaises calcaires dorées se reflétant dans les eaux turquoise d'une calanque au coucher de soleil",
  52: "Statue de la Vierge à l'Enfant au sommet d'une falaise surplombant la mer au coucher du soleil — vue du dessus",
  54: "Vue aérienne de la calanque d'En-Vau turquoise entre falaises calcaires blanches et pins — Calanques de Marseille",
  55: "Marquage au sol \"Ne rien jeter ici — La mer commence ici\" sur asphalte rouge — sensibilisation à la pollution urbaine",
  56: "Vieux-Port de Marseille vu à travers une arche ornée de cadenas d'amour, voiliers et Notre-Dame de la Garde",
  57: "Détail de poulies en bois sur un mât de voilier, Notre-Dame de la Garde en arrière-plan flou — Vieux-Port Marseille",
  58: "Personnage costumé en pirate avec masque et pistolet factice — Vieux-Port de Marseille",
  59: "Sculpture sous-marine colonisée par les algues et coraux — musée subaquatique en Méditerranée",
  60: "Port du Vallon des Auffes la nuit sous une arche de pont illuminée, maisons colorées et reflets dans l'eau — Marseille",
  61: "Canette abandonnée sur des algues sous-marines avec une étoile de mer orange — pollution plastique en Méditerranée",
  62: "Pointu marseillais à voile rouge naviguant devant Marseille avec Notre-Dame de la Garde en arrière-plan",
  63: "Bouée de sauvetage sur la proue d'un bateau bleu, Notre-Dame de la Garde floue en arrière-plan — Marseille",
  64: "Pointu marseillais à voile rouge et blanc croisant le grand voilier Kraken dans les Calanques de Marseille",
  65: "Deux plongeurs en combinaison noire explorant les fonds marins de Méditerranée entre algues et rochers",
  66: "Vague du mistral s'écrasant sur le quai en Méditerranée — photographie de tempête à Marseille par Karim Saari",
  67: "Véliplanchiste sur la mer agitée avec les Calanques de Marseille et le fort en arrière-plan",
  68: "Coucher de soleil rouge sur la mer avec trois voiliers en silhouette — Méditerranée",
  69: "Deux apnéistes en combinaison remontant un pneu du fond marin — mission de dépollution Projet Sentinelle Dark Massilia",
  70: "Vue panoramique sur Marseille depuis les hauteurs des Calanques, route sinueuse, Notre-Dame de la Garde visible",
  71: "Apnéiste sous l'eau tenant un panneau de certification — compétition d'apnée en Méditerranée",
  72: "Méduse Pélagie (Pelagia noctiluca) rose en pleine eau turquoise — faune marine Méditerranée",
  73: "Goéland leucophée posé sur un bollard de port devant l'eau turquoise — Marseille",
  74: "Barques de pêche traditionnelles amarrées dans un port de calanque sous les falaises calcaires — Marseille",
  75: "Calanque sauvage aux eaux turquoise avec pin en premier plan, maisons de pêcheurs et mouette en vol",
  76: "Amas de déchets plastiques collectés dans les Calanques — bouteilles, canettes, emballages — Projet Sentinelle Dark Massilia",
  77: "Apnéiste en combinaison remontant un pneu du fond marin sur herbier de posidonie — dépollution Projet Sentinelle Méditerranée",
  78: "Petit port de calanque avec bateaux amarrés se reflétant dans l'eau cristalline, falaises calcaires et ciel bleu — HDR Marseille",
  79: "Proue d'un pointu marseillais se reflétant dans l'eau cristalline d'une calanque, cordages et fond marin visible — HDR",
  80: "Petit bateau de pêche blanc naviguant dans les eaux turquoise d'une calanque encadrée de hautes falaises calcaires",
  81: "Vue aérienne plongeante sur un nageur solitaire dans les eaux turquoise d'une calanque entre rochers calcaires",
  82: "Main tenant une petite étoile de mer rouge sous l'eau — faune marine Méditerranée par Karim Saari",
  83: "Mer turquoise azuréenne vue depuis la calanque de Sormiou — Marseille, Calanques de Marseille",
  85: "Vue panoramique sur le littoral et le stade de Marseille — Méditerranée, lumière du sud",
  86: "Archipel du Frioul vu de la mer — îles sauvages de Marseille en Méditerranée 2020",
  87: "Marseille vue depuis la mer — panorama du littoral méditerranéen, Vieux-Port et Notre-Dame de la Garde",
  88: "Fonds marins des Calanques de Marseille — photographie sous-marine en apnée par Karim Saari",
  89: "Plongée en apnée dans les Calanques — exploration des fonds méditerranéens par Dark Massilia",
  90: "Vie marine en Méditerranée — faune et flore sous-marines des Calanques de Marseille",
  91: "Posidonie et roches calcaires sous-marines — Calanques de Marseille — photographie subaquatique",
  92: "Lumière filtrée sous l'eau dans les Calanques de Marseille — photographie en apnée",
  93: "Apnéiste explorant les fonds marins des Calanques — photographie subaquatique Méditerranée",
  94: "Biodiversité des fonds marins méditerranéens — Calanques de Marseille — Dark Massilia",
  95: "Fonds marins du Frioul — Marseille — exploration en apnée et photographie subaquatique",
  96: "Mission de plongée et dépollution sous-marine — Projet Sentinelle — Dark Massilia Marseille",
  97: "Archipel du Frioul — Marseille — falaises calcaires et eau turquoise méditerranéenne",
  98: "Îlots des Gabian près de Marseille — végétation méditerranéenne sur roches calcaires en Méditerranée",
};

const terreAlts = {
  1:  "Femme au chapeau bleu au milieu d'un champ de lavande en fleur, lumière dorée du soir — Provence",
  3:  "Champ de lavande au coucher de soleil en Provence, rangées parallèles, chemin central, ciel rose et lilas",
  5:  "Femme au chapeau bleu au milieu d'un vaste champ de lavande violette — Provence",
  7:  "Ruelle bleue de Chefchaouen, Maroc — vieil homme en djellaba assis sur des marches, murs bleus et blancs",
  8:  "Femme en robe bleue marchant dans un champ de lavande violette — Provence",
  9:  "Portrait de profil en lumière dorée dans un champ de lavande — chapeau blanc, ambiance coucher de soleil, Provence",
  15: "Carrousel en mouvement flou et enfant debout sur la place du Vieux-Port au coucher de soleil — Marseille",
  16: "Chaton roux couché sur le dos sur un pavé devant un mur bleu — Chefchaouen Maroc",
  17: "Femme de dos avec chapeau gris devant la ville bleue de Chefchaouen — Maroc, vue panoramique",
  18: "Chaton blanc aux yeux bleus assis contre les marches bleues de Chefchaouen — Maroc",
  19: "Deux chats dans une ruelle entièrement bleue de Chefchaouen — Maroc, escaliers bleus et blancs",
  21: "Femme en robe rouge sur les rochers volcaniques noirs d'une côte sauvage — paysage côtier dramatique",
  24: "Silhouette d'une personne au sommet de la Dune du Pilat face à la forêt des Landes — Arcachon",
  25: "Macro d'une coccinelle rouge sur une tige de lavande en fleur — insecte pollinisateur, Provence",
  26: "Vue aérienne de deux femmes courant dans les rangées entre champ de tournesols et champ de lavande — Provence",
  27: "Femme en short jaune et chemise blanche se retournant dans un champ de lavande — Provence",
  28: "Deux femmes enlacées au milieu d'un champ de lavande violet, vue de dessus légèrement en plongée — Provence",
  29: "Champ de lavande en fleur au coucher de soleil en Provence, ciel orange et rouge, rangées convergentes",
  31: "Arbre solitaire au milieu d'un champ de lavande avec ciel dramatique rose-orange aux nuages spectaculaires — Provence HDR",
  34: "Femme au chapeau blanc sentant un coquelicot rouge dans un champ de coquelicots écarlates — Provence",
  36: "Femme debout au pied de la tour du Corbusier à Marseille, architecture brutaliste en béton, ciel bleu",
  37: "Cigognes blanches sur leur nid en terre — scène de reproduction, faune sauvage au Maroc",
  38: "Femme au chapeau dans une ruelle de médina marocaine, murs ocre et orange, lumière rasante",
  40: "Femme en combinaison bleue assise dans un champ de tulipes roses en fleur — Provence",
  41: "Femme au chapeau de paille en combinaison bleue dans un champ de tulipes multicolores — Provence",
  42: "Femme en robe rouge se reflétant dans une flaque entre murs de pierre et végétation — village provençal",
  43: "Femme blonde en robe rouge assise dans un champ de lavande au crépuscule, lumière dorée rasante — Provence",
  48: "Vue plongeante sur des rangées de lavande violette et dorée — géométrie des champs de Provence",
  49: "Champ de lavande violet au coucher de soleil avec personnage discret parmi les rangées, montagnes en arrière-plan",
  53: "Champ de lavande violette au premier plan et champ de tournesols jaunes — contraste de couleurs, Provence",
  54: "Paysage méditerranéen de Provence — nature sauvage et lumière dorée du sud de la France",
};

function buildPortfolioBlock() {
  const entries = [];

  merIds.forEach(id => {
    entries.push(imageEntry({
      loc:   `${BASE_URL}/images/portfolio/Mer/${id}.webp`,
      title: merAlts[id] || `Photographie mer et Calanques de Marseille n°${id} — Karim Saari`,
      geo:   GEO,
    }));
  });

  terreIds.forEach(id => {
    entries.push(imageEntry({
      loc:   `${BASE_URL}/images/portfolio/Terre/${id}.webp`,
      title: terreAlts[id] || `Photographie paysage Provence n°${id} — Karim Saari`,
    }));
  });

  return urlEntry(`${BASE_URL}/photographie-paysage-mer`, entries);
}

// ── 2. Images Dépollution Sentinelle ─────────────────────────────────────────
// Convertit le slug de fichier en titre lisible
function sentinelleTitle(filename) {
  // Ex : "Marseille-dark-massilia-plastique-pollution-projet-sentinelle-apneiste.webp"
  const match = filename.match(/projet-sentinelle-(.+)\.webp$/i);
  if (!match) return `Dépollution marine — Projet Sentinelle Marseille`;
  const raw = match[1]
    .replace(/%C3%A9/gi, 'é').replace(/%C3%A8/gi, 'è').replace(/%C3%A0/gi, 'à')
    .replace(/%C3%AA/gi, 'ê').replace(/%C3%AF/gi, 'ï').replace(/%C3%B4/gi, 'ô')
    .replace(/%C3%BB/gi, 'û').replace(/%C3%BC/gi, 'ü').replace(/%C5%93/gi, 'œ')
    .replace(/%C3%A7/gi, 'ç').replace(/%C3%A2/gi, 'â').replace(/%C3%B9/gi, 'ù')
    .replace(/-/g, ' ').replace(/_/g, ' ');
  const label = raw.charAt(0).toUpperCase() + raw.slice(1);
  return `${label} — Projet Sentinelle, dépollution marine Marseille`;
}

function buildDepollutionBlock() {
  const sentinelleFiles = fs.readdirSync(imagesDir)
    .filter(f => f.startsWith('Marseille-dark-massilia-plastique-pollution-projet-sentinelle-') && f.endsWith('.webp'))
    .sort();

  if (sentinelleFiles.length === 0) {
    console.warn('  ⚠️  Aucune image sentinelle trouvée dans public/images/');
    return null;
  }

  const entries = sentinelleFiles.map(filename =>
    imageEntry({
      loc:   `${BASE_URL}/images/${encodeURIComponent(filename)}`,
      title: sentinelleTitle(filename),
      geo:   GEO,
    })
  );

  return urlEntry(`${BASE_URL}/depollution-marine`, entries);
}

// ── 3. Articles Blog — Featured Images via WordPress API ─────────────────────
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
        console.warn(`  ⚠️  WP API ${res.status} — images blog ignorées dans sitemap-images.`);
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
      imageEntry({
        loc:     imageUrl,
        title:   `${title} — Dark Massilia`,
        caption: imageAlt || CAPTION,
      }),
    ])
  );
}

// ── Génération principale ─────────────────────────────────────────────────────
async function generateSitemapImages() {
  console.log('\n🖼️  Génération du Sitemap Images — Dark Massilia\n');

  const blocks = [];

  // 1. Portfolio photo
  const portfolioBlock = buildPortfolioBlock();
  blocks.push(portfolioBlock);
  const totalPortfolio = merIds.length + terreIds.length;
  console.log(`  ✅ Portfolio : ${totalPortfolio} images (${merIds.length} Mer + ${terreIds.length} Terre)`);

  // 2. Images dépollution
  const depollutionBlock = buildDepollutionBlock();
  if (depollutionBlock) {
    blocks.push(depollutionBlock);
    const nSentinelle = fs.readdirSync(imagesDir)
      .filter(f => f.startsWith('Marseille-dark-massilia-plastique-pollution-projet-sentinelle-') && f.endsWith('.webp'))
      .length;
    console.log(`  ✅ Dépollution : ${nSentinelle} images Sentinelle`);
  }

  // 3. Blog WP
  console.log('  🌐 Récupération des images blog WordPress…');
  const blogPosts = await fetchBlogFeaturedImages();
  if (blogPosts.length > 0) {
    const blogBlocks = buildBlogBlocks(blogPosts);
    blocks.push(...blogBlocks);
    console.log(`  ✅ Blog : ${blogPosts.length} article(s) avec image featured`);
  } else {
    console.log('  ℹ️  Aucune image blog — sitemap statique uniquement');
  }

  // Assemblage XML
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '',
    ...blocks,
    '</urlset>',
  ].join('\n');

  // Écriture
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, 'utf-8');

  const totalImages = totalPortfolio + (depollutionBlock ? fs.readdirSync(imagesDir).filter(f => f.startsWith('Marseille-dark-massilia-plastique-pollution-projet-sentinelle-') && f.endsWith('.webp')).length : 0) + blogPosts.length;
  console.log(`\n  📄 sitemap-images.xml généré — ~${totalImages} images référencées`);
  console.log('✅ Sitemap Images généré\n');
}

generateSitemapImages().catch(err => {
  console.error('\n❌ Erreur génération sitemap-images :', err);
  process.exit(1);
});
