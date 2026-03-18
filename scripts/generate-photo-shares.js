#!/usr/bin/env node
/**
 * generate-photo-shares.js
 *
 * Génère dist/p/{uid}/index.html pour chaque photo des deux galeries.
 * Chaque page relais contient :
 *   - og:title   → titre personnalisé par photo (depuis Supabase)
 *   - og:image   → URL absolue de LA photo
 *   - JSON-LD    → ImageObject Schema.org avec auteur, lieu, description
 *   - script JS  → redirige l'utilisateur vers la galerie avec deep-link
 *
 * Lancer après `vite build` : les dossiers dist/p/{uid}/ sont créés dynamiquement.
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

/* ── Lecture du .env pour récupérer les clés Supabase ─────────── */
function loadEnv() {
  // process.cwd() = racine du projet quand lancé via npm run
  const candidates = [
    path.join(process.cwd(), '.env'),
    path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'),
  ];
  const vars = {};
  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    fs.readFileSync(envPath, 'utf-8').split(/\r?\n/).forEach(line => {
      const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (m) vars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    });
    break;
  }
  return vars;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;

/* ── Fetch title + lieu + lat + lng depuis Supabase ───────────── */
async function fetchSupabaseMeta() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('⚠️  Supabase env vars manquantes — og:title générique utilisé');
    return {};
  }
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const map = {};
  for (const table of ['photos_paysage', 'photos_sous_marine']) {
    const { data, error } = await sb.from(table).select('uid, title, lieu, lat, lng');
    if (error) { console.warn(`⚠️  Supabase ${table} :`, error.message); continue; }
    for (const row of data || []) map[row.uid] = row;
  }
  console.log(`📦  Supabase : ${Object.keys(map).length} photos enrichies (title + lieu)`);
  return map;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir   = path.join(__dirname, '..', 'dist');
const BASE      = 'https://karimsaari.com';

// ────────────────────────────────────────────────────────────────────────────
// 1. Données — synchronisées avec Photos.jsx
// ────────────────────────────────────────────────────────────────────────────

const merIds = [2,4,6,10,12,13,14,20,22,23,30,32,33,35,39,44,45,46,47,50,51,52,54,55,56,57,58,59,60,61,62,63,64,66,67,68,70,72,73,74,75,76,78,79,80,81,82,83,86,87,89,90,91,92,94,95,97,98,99,100];
const terreIds = [1,3,5,7,8,9,15,16,17,18,19,21,24,25,26,27,28,29,31,34,36,37,38,40,41,42,43,48,49,53,54,85];

const merFilenames = {
  2:   'karim-saari-marseille-bateau-peche-calanque-turquoise-aerien',
  4:   'photographe-sous-marin-marseille-mi-eau-mi-ciel-calanque-turquoise',
  6:   'photographe-sous-marin-marseille-apnee-grotte-marine-calanques',
  10:  'karim-saari-marseille-kayakistes-calanque-falaises-calcaires',
  12:  'karim-saari-marseille-grotte-calanque-turquoise-pins-falaises',
  13:  'karim-saari-marseille-coucher-soleil-calanque-plage-galets',
  14:  'karim-saari-marseille-silhouettes-notre-dame-garde-flaque',
  20:  'karim-saari-marseille-vallon-auffes-coucher-soleil-barques',
  22:  'karim-saari-marseille-falaises-volcaniques-rouges-cote',
  23:  'karim-saari-marseille-calanque-aiguilles-eau-cristalline',
  30:  'karim-saari-marseille-street-art-poisson-mur',
  32:  'karim-saari-marseille-fisheye-calanques-sommets-rochers',
  33:  'karim-saari-marseille-nageur-roches-rouges-anse',
  35:  'karim-saari-marseille-aerien-calanque-nageur-turquoise',
  39:  'karim-saari-marseille-calanque-sauvage-pins-mediterraneens',
  44:  'karim-saari-marseille-femme-rocher-calcaire-calanques',
  45:  'karim-saari-marseille-silhouette-flaque-plage-jetee',
  46:  'karim-saari-marseille-kayakistes-calanque-arbre-tordu',
  47:  'karim-saari-marseille-aerien-vagues-littoral-mediterraneen',
  50:  'karim-saari-marseille-aerien-calanque-secrete-galets-emeraude',
  51:  'karim-saari-marseille-falaises-calcaires-calanque-coucher-soleil',
  52:  'karim-saari-marseille-statue-vierge-falaise-mer-vue-dessus',
  54:  'karim-saari-marseille-en-vau-aerien-calanque-falaises',
  55:  'karim-saari-marseille-marquage-sol-pollution-sensibilisation',
  56:  'karim-saari-marseille-vieux-port-arche-cadenas-notre-dame',
  57:  'karim-saari-marseille-poulies-voilier-notre-dame-garde',
  58:  'karim-saari-marseille-pirate-vieux-port',
  59:  'photographe-sous-marin-marseille-sculpture-musee-subaquatique',
  60:  'karim-saari-marseille-vallon-auffes-nuit-pont-reflets',
  61:  'photographe-sous-marin-marseille-pollution-plastique-fond-marin',
  62:  'karim-saari-marseille-pointu-voile-rouge-notre-dame',
  63:  'karim-saari-marseille-bouee-bateau-notre-dame-garde',
  64:  'karim-saari-marseille-pointu-kraken-calanques',
  66:  'karim-saari-marseille-vague-mistral-tempete-mediterranee',
  67:  'karim-saari-marseille-veliplanchiste-calanques-fort',
  68:  'karim-saari-marseille-coucher-soleil-voiliers-silhouettes',
  70:  'karim-saari-marseille-panoramique-calanques-notre-dame-garde',
  72:  'photographe-sous-marin-marseille-meduse-pelagie-faune-marine',
  73:  'karim-saari-marseille-goeland-bollard-port-turquoise',
  74:  'karim-saari-marseille-barques-peche-calanque-falaises',
  75:  'karim-saari-marseille-calanque-maisons-pecheurs-turquoise',
  76:  'karim-saari-marseille-dechets-plastiques-calanques-projet-sentinelle',
  78:  'karim-saari-marseille-port-calanque-reflets-eau-cristalline',
  79:  'karim-saari-marseille-pointu-reflet-calanque-hdr',
  80:  'karim-saari-marseille-bateau-calanque-turquoise-falaises',
  81:  'karim-saari-marseille-aerien-nageur-calanque-rochers',
  82:  'photographe-sous-marin-marseille-etoile-mer-faune-marine',
  83:  'karim-saari-marseille-sormiou-calanque-mer-turquoise',
  86:  'karim-saari-marseille-frioul-iles-sauvages-mediterranee',
  87:  'karim-saari-marseille-vue-mer-vieux-port-notre-dame-panorama',
  89:  'photographe-sous-marin-marseille-plongee-apnee-calanques-dark-massilia',
  90:  'photographe-sous-marin-marseille-faune-flore-marine-mediterranee',
  91:  'photographe-sous-marin-marseille-posidonie-roches-calcaires-calanques',
  92:  'photographe-sous-marin-marseille-lumiere-filtree-eau-apnee',
  94:  'photographe-sous-marin-marseille-biodiversite-fonds-marins-calanques',
  95:  'photographe-sous-marin-marseille-frioul-exploration-subaquatique',
  97:  'karim-saari-marseille-frioul-falaises-eau-turquoise',
  98:  'karim-saari-marseille-gabian-ilots-roches-calcaires',
  99:  'karim-saari-marseille-paysage-calanque-sormiou-eau-turquoise',
  100: 'karim-saari-capbreton-cote-landaise-ocean-atlantique-paysage',
};

const merAlts = {
  2:   "Petit bateau de pêche blanc ancré sur l'eau turquoise d'une calanque — Karim Saari, photographe Marseille",
  4:   "Vue mi-eau mi-ciel d'une calanque turquoise, fonds clairs, falaises calcaires — © Karim Saari",
  6:   "Exploration en apnée d'une grotte marine dans les Calanques de Marseille — © Karim Saari",
  10:  "Kayakistes sur l'eau turquoise d'une calanque, hautes falaises calcaires — Calanques de Marseille",
  12:  "Vue depuis une grotte calcaire sur une calanque turquoise — Calanques de Marseille",
  13:  "Coucher de soleil sur une plage de calanque entre deux falaises, reflets dorés",
  14:  "Silhouettes sur un banc, reflet dans une flaque, Notre-Dame de la Garde — Marseille",
  20:  "Port du Vallon des Auffes au coucher de soleil, barques colorées — Marseille",
  22:  "Femme en robe rouge sur une plage de galets face aux falaises volcaniques rouges",
  23:  "Calanque vue depuis une ouverture dans la roche, aiguilles rocheuses en arrière-plan",
  30:  "Street art marseillais — poisson coloré peint sur un mur de béton",
  32:  "Vue fisheye depuis le sommet des Calanques, femme en robe bleue sur les rochers",
  33:  "Nageur solitaire dans les eaux émeraude translucides d'une anse de roches rouges",
  35:  "Vue aérienne plongeante sur une calanque turquoise, silhouette d'un nageur",
  39:  "Calanque sauvage avec pins méditerranéens, eau turquoise et rochers calcaires",
  44:  "Femme en robe bleue les bras écartés sur un rocher calcaire dans les Calanques",
  45:  "Silhouette se reflétant dans une flaque sur la plage, ciel dramatique",
  46:  "Kayakistes sur une calanque turquoise, vue à travers un arbre tordu",
  47:  "Vue aérienne de vagues blanches se brisant sur des rochers — littoral méditerranéen",
  50:  "Vue aérienne d'une calanque secrète, plage de galets, eau émeraude",
  51:  "Falaises calcaires dorées se reflétant dans les eaux turquoise au coucher de soleil",
  52:  "Statue de la Vierge au sommet d'une falaise surplombant la mer — vue du dessus",
  54:  "Vue aérienne de la calanque d'En-Vau turquoise entre falaises calcaires — Marseille",
  55:  "Marquage au sol 'La mer commence ici' — sensibilisation à la pollution urbaine",
  56:  "Vieux-Port de Marseille vu à travers une arche de cadenas, Notre-Dame de la Garde",
  57:  "Détail de poulies en bois sur un mât de voilier, Notre-Dame de la Garde — Marseille",
  58:  "Personnage costumé en pirate avec masque — Vieux-Port de Marseille",
  59:  "Sculpture sous-marine colonisée par les algues — musée subaquatique Méditerranée",
  60:  "Port du Vallon des Auffes la nuit sous une arche de pont illuminée — Marseille",
  61:  "Canette Coca-Cola sur algues sous-marines avec étoile de mer — pollution plastique",
  62:  "Pointu marseillais à voile rouge naviguant devant Notre-Dame de la Garde",
  63:  "Bouée de sauvetage sur la proue d'un bateau bleu, Notre-Dame de la Garde — Marseille",
  64:  "Pointu marseillais à voile rouge croisant le grand voilier Kraken dans les Calanques",
  66:  "Vague du mistral s'écrasant sur le quai en Méditerranée — tempête à Marseille",
  67:  "Véliplanchiste sur la mer agitée avec les Calanques et le fort en arrière-plan",
  68:  "Coucher de soleil rouge sur la mer avec trois voiliers en silhouette — Méditerranée",
  70:  "Vue panoramique sur Marseille depuis les hauteurs des Calanques, Notre-Dame de la Garde",
  72:  "Méduse Pélagie rose en pleine eau turquoise — faune marine Méditerranée",
  73:  "Goéland leucophée posé sur un bollard de port, eau turquoise — Marseille",
  74:  "Barques de pêche traditionnelles amarrées dans un port de calanque — Marseille",
  75:  "Calanque sauvage aux eaux turquoise, maisons de pêcheurs et mouette en vol",
  76:  "Déchets plastiques collectés dans les Calanques — Projet Sentinelle Dark Massilia",
  78:  "Petit port de calanque, bateaux amarrés, falaises calcaires et ciel bleu — Marseille",
  79:  "Proue d'un pointu marseillais se reflétant dans l'eau cristalline d'une calanque",
  80:  "Petit bateau de pêche blanc naviguant dans les eaux turquoise d'une calanque",
  81:  "Vue aérienne plongeante sur un nageur solitaire dans les eaux turquoise d'une calanque",
  82:  "Main tenant une étoile de mer rouge sous l'eau — faune marine Méditerranée",
  83:  "Mer turquoise azuréenne vue depuis la calanque de Sormiou — Marseille",
  86:  "Archipel du Frioul vu de la mer — îles sauvages de Marseille en Méditerranée",
  87:  "Marseille vue depuis la mer — panorama du littoral méditerranéen, Vieux-Port",
  89:  "Plongée en apnée dans les Calanques — exploration des fonds méditerranéens",
  90:  "Faune et flore sous-marines des Calanques de Marseille — © Karim Saari",
  91:  "Posidonie et roches calcaires sous-marines — Calanques de Marseille",
  92:  "Lumière filtrée sous l'eau dans les Calanques de Marseille — © Karim Saari",
  94:  "Biodiversité des fonds marins méditerranéens — Calanques de Marseille",
  95:  "Fonds marins du Frioul — exploration en apnée — © Karim Saari",
  97:  "Archipel du Frioul — Marseille — falaises calcaires et eau turquoise",
  98:  "Îlots des Gabian près de Marseille — végétation méditerranéenne",
  99:  "Calanque de Sormiou, Marseille — eau turquoise et falaises calcaires",
  100: "Côte landaise à Capbreton — paysage de l'océan Atlantique — © Karim Saari",
};

const terreFilenames = {
  1:  'karim-saari-photographe-provence-femme-chapeau-champ-lavande-lumiere-doree',
  3:  'karim-saari-photographe-provence-champ-lavande-coucher-soleil-rangees',
  5:  'karim-saari-photographe-provence-femme-chapeau-lavande-violette',
  7:  'karim-saari-photographe-maroc-chefchaouen-ruelle-bleue-vieil-homme',
  8:  'karim-saari-photographe-provence-femme-robe-bleue-lavande',
  9:  'karim-saari-photographe-provence-portrait-chapeau-blanc-lavande',
  15: 'karim-saari-photographe-marseille-carrousel-vieux-port-coucher-soleil',
  16: 'karim-saari-photographe-maroc-chefchaouen-chaton-roux-mur-bleu',
  17: 'karim-saari-photographe-maroc-chefchaouen-femme-chapeau-ville-bleue',
  18: 'karim-saari-photographe-maroc-chefchaouen-chaton-blanc-escaliers-bleus',
  19: 'karim-saari-photographe-maroc-chefchaouen-chats-ruelle-bleue',
  21: 'karim-saari-photographe-femme-robe-rouge-rochers-volcaniques-cote-sauvage',
  24: 'karim-saari-photographe-dune-pilat-arcachon-silhouette-foret-landes',
  25: 'karim-saari-photographe-provence-macro-coccinelle-lavande-pollinisateur',
  26: 'karim-saari-photographe-provence-aerien-tournesols-lavande',
  27: 'karim-saari-photographe-provence-femme-short-jaune-champ-lavande',
  28: 'karim-saari-photographe-provence-couple-champ-lavande-vue-dessus',
  29: 'karim-saari-photographe-provence-lavande-coucher-soleil-ciel-orange-rouge',
  31: 'karim-saari-photographe-provence-arbre-solitaire-lavande-ciel-dramatique',
  34: 'karim-saari-photographe-provence-femme-chapeau-blanc-coquelicots',
  36: 'karim-saari-photographe-marseille-tour-corbusier-architecture-brutaliste',
  37: 'karim-saari-photographe-maroc-cigognes-nid-faune-sauvage',
  38: 'karim-saari-photographe-maroc-femme-chapeau-ruelle-medina-ocre',
  40: 'karim-saari-photographe-provence-femme-champ-tulipes-roses',
  41: 'karim-saari-photographe-provence-femme-chapeau-paille-tulipes-multicolores',
  42: 'karim-saari-photographe-provence-village-femme-robe-rouge-flaque',
  43: 'karim-saari-photographe-provence-femme-robe-rouge-lavande-crepuscule',
  48: 'karim-saari-photographe-provence-geometrie-rangees-lavande-vue-dessus',
  49: 'karim-saari-photographe-provence-lavande-coucher-soleil-montagnes',
  53: 'karim-saari-photographe-provence-lavande-tournesols-contraste-couleurs',
  54: 'karim-saari-photographe-provence-paysage-mediterraneen-lumiere-doree',
  85: 'karim-saari-marseille-littoral-stade-panoramique',
};

const terreAlts = {
  1:  "Femme au chapeau bleu dans un champ de lavande, lumière dorée — photographe Provence Karim Saari",
  3:  "Champ de lavande de Valensole au coucher de soleil, rangées parallèles — Karim Saari",
  5:  "Femme au chapeau bleu dans un vaste champ de lavande violette — Karim Saari Provence",
  7:  "Ruelle bleue de Chefchaouen, vieil homme en djellaba — photographe Maroc Karim Saari",
  8:  "Femme en robe bleue marchant dans un champ de lavande violette — Karim Saari",
  9:  "Portrait lumière dorée dans les lavandes de Valensole, chapeau blanc — Karim Saari",
  15: "Carrousel flou et enfant sur la place du Vieux-Port au coucher de soleil — Marseille",
  16: "Chaton roux couché sur un pavé devant un mur bleu — Chefchaouen, Karim Saari",
  17: "Femme de dos avec chapeau, ville bleue de Chefchaouen — photographe Maroc Karim Saari",
  18: "Chaton blanc yeux bleus contre les marches bleues de Chefchaouen — Karim Saari",
  19: "Deux chats dans une ruelle bleue de Chefchaouen — Karim Saari",
  21: "Femme en robe rouge sur des rochers volcaniques noirs, côte sauvage — Karim Saari",
  24: "Silhouette au sommet de la Dune du Pilat face à la forêt des Landes — Karim Saari",
  25: "Macro coccinelle rouge sur lavande en fleur, Valensole — Karim Saari Provence",
  26: "Vue aérienne femmes courant entre tournesols et lavande — Karim Saari Provence",
  27: "Femme en short jaune dans un champ de lavande de Provence — Karim Saari",
  28: "Couple enlacé au milieu d'un champ de lavande vu d'en haut — Karim Saari",
  29: "Champ de lavande de Valensole au coucher de soleil, ciel orange rouge — Karim Saari",
  31: "Arbre solitaire dans la lavande de Provence, ciel dramatique — Karim Saari",
  34: "Femme au chapeau blanc avec un coquelicot dans un champ — Karim Saari Provence",
  36: "Femme au pied de la tour du Corbusier à Marseille — Karim Saari",
  37: "Cigognes blanches sur leur nid, faune sauvage — photographe Maroc Karim Saari",
  38: "Femme au chapeau dans une ruelle de médina marocaine — Karim Saari",
  40: "Femme en combinaison bleue dans un champ de tulipes roses — Karim Saari Provence",
  41: "Femme au chapeau de paille dans un champ de tulipes multicolores — Karim Saari",
  42: "Femme en robe rouge se reflétant dans une flaque, village provençal — Karim Saari",
  43: "Femme en robe rouge dans la lavande au crépuscule — Karim Saari Provence",
  48: "Géométrie des rangées de lavande de Valensole vue d'en haut — Karim Saari",
  49: "Lavande de Provence au coucher de soleil avec montagnes — Karim Saari",
  53: "Champ de lavande et champ de tournesols, contraste de couleurs — Karim Saari Provence",
  54: "Paysage méditerranéen de Provence, nature sauvage et lumière dorée — Karim Saari",
  85: "Vue panoramique sur le littoral méditerranéen et le stade de Marseille — Karim Saari",
};

// ── Galerie sous-marine (PhotoSousMarine.jsx) ────────────────────────────────

const sentinellePaths = [
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-apneiste.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-1.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-2.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-3.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-4.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-5.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-6.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-8.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bache.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-barri\u00e8re.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bateau.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bouteille.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-canette.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-d\u00e9chets.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-escargot.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-fonds-marins.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-1.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-4.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-8.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-goudes-esprit-equipe-fight.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte-riou.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-huveaune.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-kayak-boudmer.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mer-de-plastique.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-morgan-bourchis.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-moyades-romuald.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-moyades.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mus\u00e9e.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mus\u00e9e_subaquatique-1.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mus\u00e9e_subaquatique-2.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mus\u00e9e_subaquatique-vie-marine.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-nage-calanque.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-nage.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-plaque-immatriculation.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-pollution-huveaune.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-pos\u00e9idon.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poulpe.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-shooting-cave.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-shooting.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-soupe-plastique.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-spirographe.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen-freediving.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-v\u00e9lo-m\u00e9tropole.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-v\u00e9lo.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-angel.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-7.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-diving.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-7.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-9.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mer-goudes.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mus\u00e9e-subaquatique.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mus\u00e9e_subaquatique-3.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-octopus.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-paysage-sous-marin.webp",
  "/images/photographe-sous-marin-marseille-depollution-posidonie-apnee-projet-sentinelle.webp",
  "/images/photographe-sous-marin-marseille-mission-depollution-projet-sentinelle.webp",
  "/images/photographe-sous-marin-marseille-fonds-marins-calanques-apnee.webp",
  "/images/photographe-sous-marin-marseille-apneiste-competition-certification.webp",
  "/images/photographe-sous-marin-marseille-morgan-bourchis-triple-champion-monde-apnee-depollution-sentinelle.webp",
  "/images/photographe-sous-marin-marseille-plongeurs-fonds-marins-mediterranee.webp",
  "/images/photographe-sous-marin-marseille-apneiste-exploration-fonds-marins.webp",
  "/images/marseille-dark-massilia-depollution-maritime-calanques-projet-sentinelle.webp",
  "/images/marseille-dark-massilia-depollution-pneu-port-goudes-projet-sentinelle.webp",
  "/images/marseille-dark-massilia-operation-sentinelle-kayak-dechets-calanques.webp",
  "/images/marseille-dark-massilia-photo-sous-marine-depollution-team-oxygen.webp",
  "/images/marseille-dark-massilia-port-goudes-depollution-apnee-projet-sentinelle.webp",
  "/images/marseille-dark-massilia-projet-sentinelle-caracterisation-dechets.webp",
  "/images/marseille-dark-massilia-tf1-reportage-projet-sentinelle-depollution.webp",
];

// ────────────────────────────────────────────────────────────────────────────
// 2. Construction de la liste complète des photos avec métadonnées
// ────────────────────────────────────────────────────────────────────────────

const photos = [];

// Mer
for (const id of merIds) {
  photos.push({
    uid:     `mer-${id}`,
    src:     `/images/portfolio/Mer/${merFilenames[id]}.webp`,
    alt:     merAlts[id] || `Photo mer Karim Saari — Calanques de Marseille`,
    gallery: 'photographie-paysage-mer',
  });
}

// Photo portfolio bonus (mer)
photos.push({
  uid:     'mer-portfolio-paysages-env',
  src:     '/images/Karimsaari-portfolio-sous-marin-paysages-calanques-marseille-photographie-photographe-environnemental.webp',
  alt:     'Karim Saari photographe — portfolio sous-marin et paysages des Calanques de Marseille',
  gallery: 'photographie-paysage-mer',
});

// Terre
for (const id of terreIds) {
  photos.push({
    uid:     `terre-${id}`,
    src:     `/images/portfolio/Terre/${terreFilenames[id]}.webp`,
    alt:     terreAlts[id] || `Photographe paysage Provence Karim Saari`,
    gallery: 'photographie-paysage-mer',
  });
}

// Sentinelle (sous-marine)
for (let i = 0; i < sentinellePaths.length; i++) {
  const src       = sentinellePaths[i];
  const filename  = src.split('/').pop().replace('.webp', '');
  const descriptor = filename
    .replace('Marseille-dark-massilia-plastique-pollution-projet-sentinelle-', '')
    .replace('photographe-sous-marin-marseille-', '')
    .replace('marseille-dark-massilia-', '')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ');
  const cap = descriptor.charAt(0).toUpperCase() + descriptor.slice(1);

  photos.push({
    uid:     `sentinelle-${i}`,
    src,
    alt:     `Mission Projet Sentinelle Marseille — ${cap} — © Karim Saari, photographe sous-marin`,
    gallery: 'photographie-sous-marine',
  });
}

// ────────────────────────────────────────────────────────────────────────────
// 3. Génération HTML
// ────────────────────────────────────────────────────────────────────────────

/**
 * Génère le HTML d'une page relais OG enrichie.
 * @param {string} uid       - identifiant unique de la photo
 * @param {string} imageSrc  - chemin relatif (ex: /images/...)
 * @param {string} alt       - texte alt / og:description
 * @param {string} gallery   - slug de la galerie
 * @param {object} meta      - {title, lieu, lat, lng} depuis Supabase (peut être vide)
 */
function buildRelayPage(uid, imageSrc, alt, gallery, meta = {}) {
  const imageAbsUrl = `${BASE}${imageSrc}`;
  const galleryUrl  = `${BASE}/${gallery}?photo=${encodeURIComponent(uid)}`;
  const relayUrl    = `${BASE}/p/${encodeURIComponent(uid)}`;

  // ── og:title personnalisé ─────────────────────────────────────
  const photoTitle = meta.title || '';
  const lieu       = meta.lieu  || 'Marseille';
  const ogTitle    = photoTitle
    ? `${photoTitle} — ${lieu} | Karim Saari`
    : `Karim Saari — Photographe ${lieu}`;

  // ── og:description (alt tronqué à 160 car.) ───────────────────
  const description = alt.length > 160 ? alt.slice(0, 157) + '...' : alt;
  const descEsc     = description.replace(/"/g, '&quot;');
  const titleEsc    = ogTitle.replace(/"/g, '&quot;');

  // ── JSON-LD ImageObject ───────────────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'ImageObject',
    'name':     photoTitle || alt.replace(/\s*—\s*©.*$/, '').replace(/\s*—\s*Karim Saari.*$/i, ''),
    'description': alt,
    'contentUrl':  imageAbsUrl,
    'url':         relayUrl,
    'author': {
      '@type': 'Person',
      'name':  'Karim Saari',
      'url':   'https://karimsaari.com',
      'sameAs': [
        'https://www.instagram.com/karimsaari',
        'https://twitter.com/dark_massilia',
        'https://www.tiktok.com/@dark.massilia',
      ],
    },
    'locationCreated': {
      '@type': 'Place',
      'name':  lieu,
      ...(meta.lat && meta.lng ? {
        'geo': { '@type': 'GeoCoordinates', 'latitude': meta.lat, 'longitude': meta.lng },
      } : {}),
    },
    'license': 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    'acquireLicensePage': 'https://karimsaari.com/contact',
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${titleEsc}</title>
  <!-- Robots : page technique, pas besoin d'indexation directe -->
  <meta name="robots" content="noindex, nofollow">
  <!-- Open Graph — miniature et titre spécifiques à la photo -->
  <meta property="og:type"        content="website">
  <meta property="og:site_name"   content="Karim Saari — Dark Massilia">
  <meta property="og:title"       content="${titleEsc}">
  <meta property="og:description" content="${descEsc}">
  <meta property="og:image"       content="${imageAbsUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:url"         content="${relayUrl}">
  <meta property="og:locale"      content="fr_FR">
  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@dark_massilia">
  <meta name="twitter:title"       content="${titleEsc}">
  <meta name="twitter:description" content="${descEsc}">
  <meta name="twitter:image"       content="${imageAbsUrl}">
  <!-- Schema.org ImageObject -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <script>window.location.replace('${galleryUrl}');</script>
  <p>Redirection en cours… <a href="${galleryUrl}">Cliquez ici</a> si elle ne s'effectue pas.</p>
</body>
</html>`;
}

// ────────────────────────────────────────────────────────────────────────────
// 4. Écriture des fichiers (async pour fetch Supabase)
// ────────────────────────────────────────────────────────────────────────────

const supaMeta = await fetchSupabaseMeta();

let count = 0;

for (const photo of photos) {
  const dir      = path.join(distDir, 'p', photo.uid);
  const filePath = path.join(dir, 'index.html');
  const meta     = supaMeta[photo.uid] || {};

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, buildRelayPage(photo.uid, photo.src, photo.alt, photo.gallery, meta), 'utf-8');
  count++;
}

console.log(`✅  generate-photo-shares : ${count} pages relais OG générées dans dist/p/`);
