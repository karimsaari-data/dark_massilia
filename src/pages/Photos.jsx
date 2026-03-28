import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Waves, TreePine, Compass, ArrowLeft, ZoomIn, ExternalLink } from 'lucide-react';
// Référence Fancybox — peuplée dynamiquement côté client uniquement
let _FB = null;
const getFB = () => _FB;
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const merIds = [2, 4, 6, 10, 12, 13, 14, 20, 22, 23, 30, 32, 33, 35, 39, 44, 45, 46, 47, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68, 70, 72, 73, 74, 75, 76, 78, 79, 80, 81, 82, 83, 86, 87, 89, 90, 91, 92, 94, 95, 97, 98, 99, 100];
const terreIds = [1, 3, 5, 7, 8, 9, 15, 16, 17, 18, 19, 21, 24, 25, 26, 27, 28, 29, 31, 34, 36, 37, 38, 40, 41, 42, 43, 48, 49, 53, 54, 85];
const horizonsIds = []; // géré via Supabase admin

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

const merDims = { 2:[1920,1312], 4:[1920,1498], 6:[1920,1498], 10:[1920,2400], 12:[1920,1920], 13:[1920,1312], 14:[1920,1498], 20:[1920,1280], 22:[1920,1312], 23:[1920,1920], 30:[1920,1408], 32:[1920,1440], 33:[1000,700], 35:[1920,1312], 39:[1920,1080], 44:[1920,1312], 45:[1920,1440], 46:[1920,1440], 47:[1920,1491], 50:[1920,1498], 51:[1920,1498], 52:[1500,1200], 54:[1920,1279], 55:[4000,3000], 56:[3000,4000], 57:[4096,2731], 58:[3000,2050], 59:[3000,1750], 60:[4096,2728], 61:[3000,1900], 62:[3000,2020], 63:[3000,2050], 64:[3000,2050], 66:[3000,2340], 67:[3000,2050], 68:[5315,3543], 70:[4096,2728], 72:[3000,1750], 73:[3000,2050], 74:[3000,2050], 75:[3000,4000], 76:[3000,2050], 78:[3000,2050], 79:[3000,2300], 80:[2895,3620], 81:[3000,2050], 82:[3000,1750], 83:[1920,1498], 86:[1920,1312], 87:[1920,1312], 89:[1920,1440], 90:[1920,1440], 91:[1920,1440], 92:[1920,1440], 94:[1920,1440], 95:[1920,1440], 97:[1920,1312], 98:[1500,1050], 99:[1440,1800], 100:[2048,1400] };

const merFilenames = {
  2: 'karim-saari-marseille-bateau-peche-calanque-turquoise-aerien',
  4: 'photographe-sous-marin-marseille-mi-eau-mi-ciel-calanque-turquoise',
  6: 'photographe-sous-marin-marseille-apnee-grotte-marine-calanques',
  10: 'karim-saari-marseille-kayakistes-calanque-falaises-calcaires',
  12: 'karim-saari-marseille-grotte-calanque-turquoise-pins-falaises',
  13: 'karim-saari-marseille-coucher-soleil-calanque-plage-galets',
  14: 'karim-saari-marseille-silhouettes-notre-dame-garde-flaque',
  20: 'karim-saari-marseille-vallon-auffes-coucher-soleil-barques',
  22: 'karim-saari-marseille-falaises-volcaniques-rouges-cote',
  23: 'karim-saari-marseille-calanque-aiguilles-eau-cristalline',
  30: 'karim-saari-marseille-street-art-poisson-mur',
  32: 'karim-saari-marseille-fisheye-calanques-sommets-rochers',
  33: 'karim-saari-marseille-nageur-roches-rouges-anse',
  35: 'karim-saari-marseille-aerien-calanque-nageur-turquoise',
  39: 'karim-saari-marseille-calanque-sauvage-pins-mediterraneens',
  44: 'karim-saari-marseille-femme-rocher-calcaire-calanques',
  45: 'karim-saari-marseille-silhouette-flaque-plage-jetee',
  46: 'karim-saari-marseille-kayakistes-calanque-arbre-tordu',
  47: 'karim-saari-marseille-aerien-vagues-littoral-mediterraneen',
  50: 'karim-saari-marseille-aerien-calanque-secrete-galets-emeraude',
  51: 'karim-saari-marseille-falaises-calcaires-calanque-coucher-soleil',
  52: 'karim-saari-marseille-statue-vierge-falaise-mer-vue-dessus',
  54: 'karim-saari-marseille-en-vau-aerien-calanque-falaises',
  55: 'karim-saari-marseille-marquage-sol-pollution-sensibilisation',
  56: 'karim-saari-marseille-vieux-port-arche-cadenas-notre-dame',
  57: 'karim-saari-marseille-poulies-voilier-notre-dame-garde',
  58: 'karim-saari-marseille-pirate-vieux-port',
  59: 'photographe-sous-marin-marseille-sculpture-musee-subaquatique',
  60: 'karim-saari-marseille-vallon-auffes-nuit-pont-reflets',
  61: 'photographe-sous-marin-marseille-pollution-plastique-fond-marin',
  62: 'karim-saari-marseille-pointu-voile-rouge-notre-dame',
  63: 'karim-saari-marseille-bouee-bateau-notre-dame-garde',
  64: 'karim-saari-marseille-pointu-kraken-calanques',
  66: 'karim-saari-marseille-vague-mistral-tempete-mediterranee',
  67: 'karim-saari-marseille-veliplanchiste-calanques-fort',
  68: 'karim-saari-marseille-coucher-soleil-voiliers-silhouettes',
  70: 'karim-saari-marseille-panoramique-calanques-notre-dame-garde',
  72: 'photographe-sous-marin-marseille-meduse-pelagie-faune-marine',
  73: 'karim-saari-marseille-goeland-bollard-port-turquoise',
  74: 'karim-saari-marseille-barques-peche-calanque-falaises',
  75: 'karim-saari-marseille-calanque-maisons-pecheurs-turquoise',
  76: 'karim-saari-marseille-dechets-plastiques-calanques-projet-sentinelle',
  78: 'karim-saari-marseille-port-calanque-reflets-eau-cristalline',
  79: 'karim-saari-marseille-pointu-reflet-calanque-hdr',
  80: 'karim-saari-marseille-bateau-calanque-turquoise-falaises',
  81: 'karim-saari-marseille-aerien-nageur-calanque-rochers',
  82: 'photographe-sous-marin-marseille-etoile-mer-faune-marine',
  83: 'karim-saari-marseille-sormiou-calanque-mer-turquoise',
  86: 'karim-saari-marseille-frioul-iles-sauvages-mediterranee',
  87: 'karim-saari-marseille-vue-mer-vieux-port-notre-dame-panorama',
  89: 'photographe-sous-marin-marseille-plongee-apnee-calanques-dark-massilia',
  90: 'photographe-sous-marin-marseille-faune-flore-marine-mediterranee',
  91: 'photographe-sous-marin-marseille-posidonie-roches-calcaires-calanques',
  92: 'photographe-sous-marin-marseille-lumiere-filtree-eau-apnee',
  94: 'photographe-sous-marin-marseille-biodiversite-fonds-marins-calanques',
  95: 'photographe-sous-marin-marseille-frioul-exploration-subaquatique',
  97: 'karim-saari-marseille-frioul-falaises-eau-turquoise',
  98: 'karim-saari-marseille-gabian-ilots-roches-calcaires',
  99: 'karim-saari-marseille-paysage-calanque-sormiou-eau-turquoise',
  100: 'karim-saari-capbreton-cote-landaise-ocean-atlantique-paysage',
};
const terreDims = { 1:[1920,1312], 3:[1920,1124], 5:[1920,1312], 7:[1080,1143], 8:[1920,1312], 9:[1920,1312], 15:[1920,1280], 16:[1920,1280], 17:[1920,1279], 18:[1920,1279], 19:[1920,1080], 21:[1920,1280], 24:[1920,1440], 25:[1920,2866], 26:[1920,1279], 27:[1920,1312], 28:[1920,1251], 29:[1920,1279], 31:[1920,1279], 34:[1920,1312], 36:[1920,2850], 37:[1920,1312], 38:[1920,1312], 40:[1920,1312], 41:[1920,1312], 42:[1920,1080], 43:[1920,1312], 48:[1920,1216], 49:[1920,1280], 53:[1500,1050], 54:[1920,1280], 85:[1920,1248] };

const merAlts = {
  2: "Petit bateau de pêche blanc ancré sur l'eau turquoise cristalline d'une calanque — photographie aérienne Marseille",
  4: "Vue mi-eau mi-ciel d'une calanque turquoise, fonds clairs et galets sous l'eau, falaises calcaires et pin — © Karim Saari, photographe sous-marin Marseille",
  6: "Exploration en apnée d'une grotte marine dans les Calanques de Marseille — vue subjective, mains en néoprène, eau turquoise — © Karim Saari, photographe sous-marin Marseille",
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
  59: "Sculpture sous-marine colonisée par les algues et coraux — musée subaquatique Méditerranée — © Karim Saari, photographe sous-marin Marseille",
  60: "Port du Vallon des Auffes la nuit sous une arche de pont illuminée, maisons colorées et reflets dans l'eau — Marseille",
  61: "Canette Coca-Cola sur algues sous-marines avec étoile de mer orange — pollution plastique — © Karim Saari, photographe sous-marin Marseille",
  62: "Pointu marseillais à voile rouge naviguant devant Marseille avec Notre-Dame de la Garde en arrière-plan",
  63: "Bouée de sauvetage sur la proue d'un bateau bleu, Notre-Dame de la Garde floue en arrière-plan — Marseille",
  64: "Pointu marseillais à voile rouge et blanc croisant le grand voilier Kraken dans les Calanques de Marseille",
  66: "Vague du mistral s'écrasant sur le quai en Méditerranée — photographie de tempête à Marseille par Karim Saari",
  67: "Véliplanchiste sur la mer agitée avec les Calanques de Marseille et le fort en arrière-plan",
  68: "Coucher de soleil rouge sur la mer avec trois voiliers en silhouette — Méditerranée",
  70: "Vue panoramique sur Marseille depuis les hauteurs des Calanques, route sinueuse, Notre-Dame de la Garde visible",
  72: "Méduse Pélagie (Pelagia noctiluca) rose en pleine eau turquoise — faune marine Méditerranée — © Karim Saari, photographe sous-marin Marseille",
  73: "Goéland leucophée posé sur un bollard de port devant l'eau turquoise — Marseille",
  74: "Barques de pêche traditionnelles amarrées dans un port de calanque sous les falaises calcaires — Marseille",
  75: "Calanque sauvage aux eaux turquoise avec pin en premier plan, maisons de pêcheurs et mouette en vol",
  76: "Amas de déchets plastiques collectés dans les Calanques — bouteilles, canettes, emballages — Projet Sentinelle Dark Massilia",
  78: "Petit port de calanque avec bateaux amarrés se reflétant dans l'eau cristalline, falaises calcaires et ciel bleu — HDR Marseille",
  79: "Proue d'un pointu marseillais se reflétant dans l'eau cristalline d'une calanque, cordages et fond marin visible — HDR",
  80: "Petit bateau de pêche blanc naviguant dans les eaux turquoise d'une calanque encadrée de hautes falaises calcaires",
  81: "Vue aérienne plongeante sur un nageur solitaire dans les eaux turquoise d'une calanque entre rochers calcaires",
  82: "Main tenant une étoile de mer rouge sous l'eau — faune marine Méditerranée — © Karim Saari, photographe sous-marin Marseille",
  83: "Mer turquoise azuréenne vue depuis la calanque de Sormiou — Marseille, Calanques de Marseille",
  86: "Archipel du Frioul vu de la mer — îles sauvages de Marseille en Méditerranée 2020",
  87: "Marseille vue depuis la mer — panorama du littoral méditerranéen, Vieux-Port et Notre-Dame de la Garde",
  89: "Plongée en apnée dans les Calanques — exploration des fonds méditerranéens — © Karim Saari, photographe sous-marin Marseille",
  90: "Faune et flore sous-marines des Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",
  91: "Posidonie et roches calcaires sous-marines — Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",
  92: "Lumière filtrée sous l'eau dans les Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",
  94: "Biodiversité des fonds marins méditerranéens — Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",
  95: "Fonds marins du Frioul — exploration en apnée — © Karim Saari, photographe sous-marin Marseille",
  97: "Archipel du Frioul — Marseille — falaises calcaires et eau turquoise méditerranéenne",
  98: "Îlots des Gabian près de Marseille — végétation méditerranéenne sur roches calcaires en Méditerranée",
  99: "Paysage de la calanque de Sormiou, Marseille — eau turquoise et falaises calcaires méditerranéennes — © Karim Saari",
  100: "Côte landaise à Capbreton — paysage de l'océan Atlantique, vagues et plage de sable — © Karim Saari",
};

const terreAlts = {
  1:  "Femme au chapeau bleu dans un champ de lavande, lumière dorée du soir — photographe paysage Provence Karim Saari",
  3:  "Champ de lavande de Valensole au coucher de soleil, rangées parallèles, ciel rose — photographe Provence Karim Saari",
  5:  "Femme au chapeau bleu dans un vaste champ de lavande violette — photographe paysage Provence Karim Saari",
  7:  "Ruelle bleue de Chefchaouen, vieil homme en djellaba sur des marches — photographe Maroc Karim Saari",
  8:  "Femme en robe bleue marchant dans un champ de lavande violette — photographe Provence Karim Saari",
  9:  "Portrait lumière dorée dans les lavandes de Valensole, chapeau blanc, coucher de soleil — Karim Saari",
  15: "Carrousel flou et enfant sur la place du Vieux-Port au coucher de soleil — photographe Marseille Karim Saari",
  16: "Chaton roux couché sur un pavé devant un mur bleu — Chefchaouen, photographe Maroc Karim Saari",
  17: "Femme de dos avec chapeau, ville bleue de Chefchaouen vue panoramique — photographe Maroc Karim Saari",
  18: "Chaton blanc yeux bleus contre les marches bleues de Chefchaouen — photographe Maroc Karim Saari",
  19: "Deux chats dans une ruelle bleue de Chefchaouen, escaliers bleus et blancs — Karim Saari",
  21: "Femme en robe rouge sur des rochers volcaniques noirs, côte sauvage — photographe paysage Karim Saari",
  24: "Silhouette au sommet de la Dune du Pilat face à la forêt des Landes — photographe Arcachon Karim Saari",
  25: "Macro coccinelle rouge sur lavande en fleur, Valensole — photographe nature Provence Karim Saari",
  26: "Vue aérienne femmes courant entre tournesols et lavande — photographe paysage Provence Karim Saari",
  27: "Femme en short jaune dans un champ de lavande de Provence — photographe Valensole Karim Saari",
  28: "Couple enlacé au milieu d'un champ de lavande vu d'en haut — photographe Provence Karim Saari",
  29: "Champ de lavande de Valensole au coucher de soleil, ciel orange rouge — photographe Provence Karim Saari",
  31: "Arbre solitaire dans la lavande de Provence, ciel dramatique rose-orange — photographe Karim Saari",
  34: "Femme au chapeau blanc avec un coquelicot dans un champ de coquelicots — photographe Provence Karim Saari",
  36: "Femme au pied de la tour du Corbusier à Marseille, architecture brutaliste — photographe Marseille Karim Saari",
  37: "Cigognes blanches sur leur nid, reproduction faune sauvage — photographe Maroc Karim Saari",
  38: "Femme au chapeau dans une ruelle de médina marocaine, murs ocre, lumière rasante — Karim Saari",
  40: "Femme en combinaison bleue dans un champ de tulipes roses — photographe paysage Provence Karim Saari",
  41: "Femme au chapeau de paille dans un champ de tulipes multicolores — photographe Provence Karim Saari",
  42: "Femme en robe rouge se reflétant dans une flaque, village provençal — photographe Karim Saari",
  43: "Femme en robe rouge dans la lavande au crépuscule, lumière dorée rasante — photographe Provence Karim Saari",
  48: "Géométrie des rangées de lavande de Valensole vue d'en haut — photographe paysage Provence Karim Saari",
  49: "Lavande de Provence au coucher de soleil avec montagnes en arrière-plan — photographe Karim Saari",
  53: "Champ de lavande et champ de tournesols, contraste de couleurs, Provence — photographe Karim Saari",
  54: "Paysage méditerranéen de Provence, nature sauvage et lumière dorée — photographe Karim Saari",
  85: "Vue panoramique sur le littoral méditerranéen et le stade de Marseille — © Karim Saari",
};

const merLieux = {
  2:'Calanques de Marseille', 4:'Calanques de Marseille', 6:'Calanques de Marseille',
  10:'Calanques de Marseille', 12:'Calanques de Marseille', 13:'Calanques de Marseille',
  14:'Vieux-Port, Marseille', 20:'Vallon des Auffes', 22:'Côte Marseillaise',
  23:'Calanques de Marseille', 30:'Marseille', 32:'Calanques de Marseille',
  33:'Côte Marseillaise', 35:'Calanques de Marseille', 39:'Calanques de Marseille',
  44:'Calanques de Marseille', 45:'Plage, Marseille', 46:'Calanques de Marseille',
  47:'Littoral Méditerranéen', 50:'Calanques de Marseille', 51:'Calanques de Marseille',
  52:'Côte Marseillaise', 54:"Calanque d'En-Vau", 55:'Marseille',
  56:'Vieux-Port, Marseille', 57:'Vieux-Port, Marseille', 58:'Vieux-Port, Marseille',
  59:'Musée Subaquatique Méditerranée', 60:'Vallon des Auffes', 61:'Fonds marins, Calanques',
  62:'Marseille', 63:'Marseille', 64:'Calanques de Marseille', 66:'Marseille',
  67:'Calanques de Marseille', 68:'Méditerranée', 70:'Calanques de Marseille',
  72:'Méditerranée', 73:'Marseille', 74:'Calanques de Marseille',
  75:'Calanques de Marseille', 76:'Calanques de Marseille', 78:'Calanques de Marseille',
  79:'Calanques de Marseille', 80:'Calanques de Marseille', 81:'Calanques de Marseille',
  82:'Fonds marins, Calanques', 83:'Calanque de Sormiou', 86:'Archipel du Frioul',
  87:'Marseille', 89:'Calanques de Marseille', 90:'Calanques de Marseille',
  91:'Calanques de Marseille', 92:'Calanques de Marseille', 94:'Calanques de Marseille',
  95:'Archipel du Frioul', 97:'Archipel du Frioul', 98:'Îlots des Gabian',
  99:'Calanque de Sormiou', 100:'Capbreton, Atlantique',
};

const terreLieux = {
  1:'Valensole, Provence', 3:'Valensole, Provence', 5:'Valensole, Provence',
  7:'Chefchaouen, Maroc', 8:'Valensole, Provence', 9:'Valensole, Provence',
  15:'Vieux-Port, Marseille', 16:'Chefchaouen, Maroc', 17:'Chefchaouen, Maroc',
  18:'Chefchaouen, Maroc', 19:'Chefchaouen, Maroc', 21:'Côte Sauvage',
  24:'Dune du Pilat, Arcachon', 25:'Valensole, Provence', 26:'Valensole, Provence',
  27:'Valensole, Provence', 28:'Valensole, Provence', 29:'Valensole, Provence',
  31:'Provence', 34:'Provence', 36:'Marseille', 37:'Maroc', 38:'Médina, Maroc',
  40:'Provence', 41:'Provence', 42:'Provence', 43:'Valensole, Provence',
  48:'Valensole, Provence', 49:'Provence', 53:'Provence', 54:'Provence', 85:'Marseille',
};

/* ─── Helper Google Maps URL ─────────────────────────────────────────── */
const mapsUrl = ({ lat, lng, lieu }) => {
  if (lat && lng) return `https://maps.google.com/?q=${lat},${lng}&z=13`;
  const q = lieu ? `${lieu}, Marseille, France` : 'Calanques de Marseille, France';
  return `https://maps.google.com/?q=${encodeURIComponent(q)}`;
};

const merImages = merIds.map((id, index) => {
  const lieu = merLieux[id] || 'Calanques de Marseille';
  return {
    uid: `mer-${id}`,
    src: `/images/portfolio/Mer/${merFilenames[id]}.webp`,
    alt: merAlts[id] || `Photo mer Karim Saari – Calanques de Marseille ${index + 1}`,
    lieu,
    maps: mapsUrl({ lieu }),
    width: merDims[id][0],
    height: merDims[id][1],
  };
});
merImages.push({
  uid: 'mer-portfolio-paysages-env',
  src: '/images/Karimsaari-portfolio-sous-marin-paysages-calanques-marseille-photographie-photographe-environnemental.webp',
  alt: 'Karim Saari photographe — portfolio sous-marin et paysages des Calanques de Marseille, engagement environnemental',
  lieu: 'Calanques de Marseille',
  maps: mapsUrl({ lieu: 'Calanques de Marseille' }),
  width: 1920,
  height: 1280,
});

const terreImages = terreIds.map((id, index) => {
  const lieu = terreLieux[id] || 'Provence';
  return {
    uid: `terre-${id}`,
    src: `/images/portfolio/Terre/${terreFilenames[id]}.webp`,
    alt: terreAlts[id] || `Photographe paysage Provence Karim Saari ${index + 1}`,
    lieu,
    maps: mapsUrl({ lieu }),
    width: terreDims[id][0],
    height: terreDims[id][1],
  };
});

const horizonsImages = horizonsIds.map((id, index) => {
  const lieu = terreLieux[id] || 'Voyage';
  return {
    uid: `horizons-${id}`,
    src: `/images/portfolio/Terre/${terreFilenames[id]}.webp`,
    alt: terreAlts[id] || `Photographe voyage Karim Saari ${index + 1}`,
    lieu,
    maps: mapsUrl({ lieu }),
    width: terreDims[id]?.[0] || 1920,
    height: terreDims[id]?.[1] || 1280,
  };
});

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ─── Modal de partage centré ──────────────────────────────── */
const SHARE_ICONS = {
  facebook:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  twitter:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  pinterest: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>`,
  whatsapp:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
  copy:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
};

function showShareMenu(_triggerEl, slide) {
  document.querySelector('.fb-share-overlay')?.remove();
  if (!slide) return;

  const uid  = slide.triggerEl?.getAttribute('data-uid')  || '';
  const slug = slide.triggerEl?.getAttribute('data-slug') || uid;
  const alt  = slide.alt || slide.triggerEl?.getAttribute('data-caption') || '';
  const src  = slide.src || '';

  const relayUrl    = `https://karimsaari.com/p/${encodeURIComponent(slug)}`;
  const imageAbsUrl = `https://karimsaari.com${src}`;
  const shareText   = `📸 ${alt} — Karim Saari, photographe Marseille`;
  const enc = (s) => encodeURIComponent(s);

  // Overlay plein écran
  const overlay = document.createElement('div');
  overlay.className = 'fb-share-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '99999',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
    fontFamily: 'system-ui, sans-serif',
  });

  // Boîte modale
  const box = document.createElement('div');
  Object.assign(box.style, {
    background: '#faf8f4',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '20px',
    padding: '32px 32px 28px',
    width: '340px',
    maxWidth: 'calc(100vw - 32px)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
    position: 'relative',
  });

  // Titre + bouton fermer
  const header = document.createElement('div');
  Object.assign(header.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' });
  const title = document.createElement('p');
  title.textContent = 'Partager';
  Object.assign(title.style, { color: '#1a1a2e', fontWeight: '700', fontSize: '16px', margin: '0' });
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  Object.assign(closeBtn.style, { background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(0,0,0,0.5)', flexShrink: '0' });
  closeBtn.addEventListener('click', () => overlay.remove());
  header.appendChild(title);
  header.appendChild(closeBtn);
  box.appendChild(header);

  // Boutons réseau sociaux (grille 2×2)
  const grid = document.createElement('div');
  Object.assign(grid.style, { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '18px' });

  const socialItems = [
    { label: 'Facebook',   icon: SHARE_ICONS.facebook,  bg: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${enc(relayUrl)}` },
    { label: 'X',           icon: SHARE_ICONS.twitter,   bg: '#000000', url: `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(relayUrl)}&via=dark_massilia` },
    { label: 'Pinterest',  icon: SHARE_ICONS.pinterest, bg: '#E60023', url: `https://pinterest.com/pin/create/button/?url=${enc(relayUrl)}&media=${enc(imageAbsUrl)}&description=${enc(shareText)}` },
  ];

  socialItems.forEach(({ label, icon, bg, url }) => {
    const btn = document.createElement('a');
    btn.href = url; btn.target = '_blank'; btn.rel = 'noopener noreferrer';
    btn.innerHTML = icon;
    btn.title = label;
    Object.assign(btn.style, {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '52px', height: '52px', borderRadius: '12px', background: bg,
      color: '#fff', textDecoration: 'none', transition: 'opacity 0.15s',
    });
    btn.addEventListener('mouseover', () => { btn.style.opacity = '0.85'; });
    btn.addEventListener('mouseout',  () => { btn.style.opacity = '1'; });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(url, '_blank', 'noopener,noreferrer');
      overlay.remove();
    });
    grid.appendChild(btn);
  });
  box.appendChild(grid);

  // Ligne "Copier le lien"
  const copyRow = document.createElement('div');
  Object.assign(copyRow.style, { display: 'flex', gap: '8px', alignItems: 'center' });

  const urlInput = document.createElement('input');
  urlInput.value = relayUrl; urlInput.readOnly = true;
  Object.assign(urlInput.style, {
    flex: '1', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.10)',
    borderRadius: '10px', padding: '8px 12px', color: 'rgba(0,0,0,0.45)',
    fontSize: '11px', fontFamily: 'monospace', outline: 'none',
  });
  urlInput.addEventListener('click', () => urlInput.select());

  const copyBtn = document.createElement('button');
  copyBtn.innerHTML = `${SHARE_ICONS.copy}<span>Copier</span>`;
  Object.assign(copyBtn.style, {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '10px', background: 'rgba(33,196,123,0.15)',
    border: '1px solid rgba(33,196,123,0.4)', color: '#21c47b',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer', flexShrink: '0', whiteSpace: 'nowrap',
  });
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(relayUrl); }
    catch {
      const t = document.createElement('textarea');
      t.value = relayUrl; document.body.appendChild(t); t.select();
      document.execCommand('copy'); document.body.removeChild(t);
    }
    copyBtn.innerHTML = `${SHARE_ICONS.copy}<span>Copié !</span>`;
    copyBtn.style.color = '#fff';
    setTimeout(() => overlay.remove(), 1200);
  });

  copyRow.appendChild(urlInput);
  copyRow.appendChild(copyBtn);
  box.appendChild(copyRow);

  overlay.appendChild(box);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  const fbContainer = getFB()?.getInstance?.()?.getContainer?.();
  (fbContainer || document.body).appendChild(overlay);
}

/* ─── Config Fancybox ──────────────────────────────────────── */
const buildOpts = () => ({
  on: {
    initSlides(fancybox) {
      const opts = fancybox.getOptions();
      if (!opts.Carousel) opts.Carousel = {};
      opts.Carousel.captionEl = null;
      // Caption formatée : info gauche (titre + lieu) + bouton Commander droite
      opts.Carousel.formatCaption = (_fb, slide) => {
        const lieu    = slide.caption || '';
        const title   = slide.triggerEl?.dataset?.title || '';
        const mapsHref = slide.triggerEl?.dataset?.maps || '';
        const pin = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
        const uid       = slide.triggerEl?.dataset?.hash || '';
        const titleHtml = title ? `<span class="fb-caption-title">${title}</span>` : '';
        const lieuHtml  = lieu
          ? mapsHref
            ? `<a class="fb-caption-lieu fb-caption-maps" href="${mapsHref}" target="_blank" rel="noopener" title="Voir sur Google Maps">${pin}${lieu}</a>`
            : `<span class="fb-caption-lieu">${pin}${lieu}</span>`
          : '';
        const cartIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;
        const buyBtn = `<button class="fb-caption-buy" data-uid="${uid}" data-title="${title}" title="Demander l'utilisation">${cartIcon}<span>Demander l'utilisation</span></button>`;
        return `<span class="fb-caption-wrapper"><span class="fb-caption-info">${titleHtml}${lieuHtml}</span>${buyBtn}</span>`;
      };
    },
    initLayout(fancybox) {
      const c = fancybox.getContainer();
      if (!c) return;
      // Clic sur l'icône panier dans la caption
      c.addEventListener('click', (e) => {
        const btn = e.target.closest('.fb-caption-buy');
        if (!btn) return;
        const uid   = btn.dataset.uid || '';
        const title = btn.dataset.title || '';
        const [cat, num] = uid.split('-');
        const parts = [`catégorie ${cat || uid}`, num ? `numéro ${num}` : null, title || null].filter(Boolean);
        const subject = encodeURIComponent(`Demande d'utilisation : ${parts.join(' - ')}`);
        window.location.href = `mailto:commande@karimsaari.com?subject=${subject}`;
      });
      // Protection clic droit sur les images
      c.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.fancybox__slide')) e.preventDefault();
      });
    },
  },
  Carousel: {
    Thumbs: false,
    Autoplay: {
      playOnStart: false,
      timeout: 3000,
    },
    Toolbar: {
      display: {
        left:   ['counter'],
        middle: [],
        right:  ['autoplay', 'share', 'fullscreen', 'close'],
      },
      items: {
        share: {
          tpl: `<button class="f-button" title="Partager">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>`,
          click: (carousel, event) => {
            const slide = getFB()?.getSlide?.() || carousel.getPage()?.slides?.[0];
            showShareMenu(event?.currentTarget || event?.target?.closest('.f-button'), slide);
          },
        },
        fullscreen: {
          tpl: `<button class="f-button" title="Plein écran" data-fullscreen-action="toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <g class="full-exit"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></g>
              <g class="full-enter"><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g>
            </svg>
          </button>`,
        },
      },
    },
  },
  l10n: {
    CLOSE:  'Fermer',
    NEXT:   'Suivant',
    PREV:   'Précédent',
    TOGGLE_FS:      'Plein écran',
    TOGGLE_SIDEBAR: 'Vignettes',
    TOGGLE_AUTOPLAY: 'Diaporama',
  },
});

/* ─── Composants utilitaires ───────────────────────────────── */
const SectionTitle = ({ icon: Icon, title, count }) => (
  <motion.div variants={FADE_IN_UP} className="flex items-center gap-3 mb-8">
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6 text-ocean-teal" aria-hidden="true" />
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <span className="text-sm text-white/70 font-medium">({count})</span>
    </div>
    <div className="flex-1 h-px bg-white/10 ml-2" />
  </motion.div>
);

/* Thumb 800px pour la grille — original pour Fancybox */
const toThumbSrc = (src) =>
  src.replace(/\/images\/portfolio\/(Mer|Terre)\//, '/images/portfolio/$1/800w/');

const PhotoGrid = ({ images }) => (
  <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
    {images.map((image, index) => {
      const thumbSrc = image.thumbSrc || toThumbSrc(image.src);
      return (
      <a
        key={image.uid}
        href={image.src}
        data-fancybox="gallery-paysage"
        data-caption={image.lieu || image.alt}
        data-title={image.title || ''}
        data-uid={image.uid}
        data-slug={image.slug || image.uid}
        data-hash={image.uid}
        data-maps={image.maps}
        data-thumb={thumbSrc}
        className="block w-full break-inside-avoid cursor-pointer relative overflow-hidden rounded-xl focus-ring mb-4"
        aria-label={`Ouvrir la photo : ${image.alt}`}
      >
        <img
          src={thumbSrc}
          srcSet={`${thumbSrc} 800w`}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          alt={image.alt}
          width={Math.min(image.width, 800)}
          height={Math.round(image.height * (Math.min(image.width, 800) / image.width))}
          className="w-full h-auto object-cover"
          loading={index < 4 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : undefined}
          decoding="async"
        />
      </a>
      );
    })}
  </div>
);

/* ─── Fusionne les données Supabase avec les dimensions statiques ─── */
const mergeWithDims = (rows) => {
  return rows.map(row => {
    const id = parseInt(row.uid.replace('mer-', '').replace('terre-', ''), 10);
    const isTerre = row.categorie === 'terre';
    const dims = isTerre ? (terreDims[id] || [1920, 1280]) : (merDims[id] || [1920, 1280]);
    return { ...row, width: dims[0], height: dims[1], maps: mapsUrl(row) };
  });
};

/* ─── Composant principal ─────────────────────────────────── */
const Photos = () => {
  const [merImages_,      setMerImages]      = useState(merImages);
  const [terreImages_,    setTerreImages]    = useState(terreImages);
  const [horizonsImages_, setHorizonsImages] = useState(horizonsImages);

  const [shuffledMer,      setShuffledMer]      = useState(merImages);
  const [shuffledTerre,    setShuffledTerre]    = useState(terreImages);
  const [shuffledHorizons, setShuffledHorizons] = useState(horizonsImages);
  const [searchParams] = useSearchParams();
  const deepLinkDone = useRef(false);

  // Fetch Supabase — remplace les données statiques si disponible
  useEffect(() => {
    supabase
      .from('photos_paysage')
      .select('uid, src, alt, title, lieu, lat, lng, slug, categorie, visible')
      .eq('visible', true)
      .order('uid')
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const withDims = mergeWithDims(data);
        const mer      = withDims.filter(p => p.categorie === 'mer');
        const terre    = withDims.filter(p => p.categorie === 'terre');
        const horizons = withDims.filter(p => p.categorie === 'horizons');
        setMerImages(mer);
        setTerreImages(terre);
        setHorizonsImages(horizons);
        setShuffledMer(shuffle(mer));
        setShuffledTerre(shuffle(terre));
        setShuffledHorizons(shuffle(horizons));
      });
  }, []);

  // Shuffle côté client uniquement (après hydration SSR)
  useEffect(() => {
    setShuffledMer(shuffle(merImages_));
    setShuffledTerre(shuffle(terreImages_));
    setShuffledHorizons(shuffle(horizonsImages_));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bind / unbind Fancybox (import dynamique — SSR safe)
  useEffect(() => {
    let FB;
    Promise.all([
      import('@fancyapps/ui'),
      import('@fancyapps/ui/dist/fancybox/fancybox.css'),
    ]).then(([mod]) => {
      FB = mod.Fancybox;
      _FB = FB;
      FB.bind('[data-fancybox="gallery-paysage"]', buildOpts());
    });
    return () => {
      FB?.unbind('[data-fancybox="gallery-paysage"]');
      FB?.close();
    };
  }, []);

  // Deep-link : ouvre directement la photo ciblée via ?photo=uid (partage Pinterest / Facebook)
  useEffect(() => {
    const uid = searchParams.get('photo');
    if (!uid || deepLinkDone.current) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-uid="${uid}"]`);
      if (el) {
        deepLinkDone.current = true;
        el.click();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchParams, shuffledMer, shuffledTerre, shuffledHorizons]);

  const totalImages = useMemo(
    () => merImages_.length + terreImages_.length + horizonsImages_.length,
    [merImages_, terreImages_, horizonsImages_]
  );

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/photographie-paysage-mer']} />
      <div className="container-custom">
        {/* H1 SEO */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl font-bold text-white text-center mb-8 leading-tight"
        >
          Photographie de Paysages : Du Littoral Marseillais aux Horizons Lointains
        </motion.h1>

        {/* Section 1 — Littoral Marseillais & Calanques */}
        <motion.div
          id="littoral"
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16 scroll-mt-8"
        >
          <SectionTitle icon={Waves} title="Le Littoral Marseillais & Calanques" count={shuffledMer.length} />
          <PhotoGrid images={shuffledMer} />
        </motion.div>

        {/* Section 2 — Terres de Provence & Camargue */}
        <motion.div
          id="provence"
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16 scroll-mt-8"
        >
          <SectionTitle icon={TreePine} title="Terres de Provence & Camargue" count={shuffledTerre.length} />
          <PhotoGrid images={shuffledTerre} />
        </motion.div>

        {/* Section 3 — Explorations & Horizons Lointains */}
        <motion.div
          id="horizons"
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16 scroll-mt-8"
        >
          <SectionTitle icon={Compass} title="Explorations & Horizons Lointains" count={shuffledHorizons.length} />
          <PhotoGrid images={shuffledHorizons} />
        </motion.div>

        {/* Description */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mt-16"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Portfolio : de l'abyssal à l'horizon</h2>
              <p className="text-ocean-teal font-semibold text-sm uppercase tracking-widest mb-6">
                Sentinelle du littoral et des terres sauvages
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { href: '#littoral', label: '🌊 Littoral & Calanques' },
                  { href: '#provence', label: '🌿 Provence & Camargue' },
                  { href: '#horizons', label: '🧭 Horizons Lointains' },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                               bg-white/5 border border-white/10 text-text-secondary
                               hover:bg-ocean-teal/10 hover:border-ocean-teal/40 hover:text-ocean-teal
                               transition-colors duration-200"
                  >
                    {label}
                  </a>
                ))}
              </div>
              <div className="space-y-4 text-text-secondary leading-[1.8]">
                <p>
                  <strong className="text-ocean-teal">Le Littoral Marseillais & Calanques</strong> — Une immersion au cœur du Parc national des Calanques. Entre falaises calcaires monumentales et eaux turquoises, je documente la splendeur et la fragilité de ce littoral rocheux de la mer Méditerranée. Une géographie d'exception où chaque crique sauvage appelle à la préservation de la faune.
                </p>
                <p>
                  <strong className="text-ocean-teal">Terres de Provence & Camargue</strong> — Des marais salants de Camargue aux champs de lavande du plateau de Valensole, je parcours l'arrière-pays provençal. Sous les lumières rasantes, les reliefs sauvages du Luberon et des Alpilles révèlent la richesse d'une flore méditerranéenne préservée.
                </p>
                <p>
                  <strong className="text-ocean-teal">Explorations & Horizons Lointains</strong> — Mes carnets de voyage s'ouvrent sur la diversité culturelle et les paysages du monde. Des ruelles bleues de Chefchaouen aux dunes du Pilat, mon regard de photographe naturaliste cherche à capturer la beauté brute de notre planète, bien au-delà de Marseille.
                </p>
                <p>Retrouvez l'ensemble de mes photographies en haute résolution sur 500px.</p>
              </div>
              <div className="mt-6">
                <a
                  href="https://500px.com/p/karimsaari?view=photos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Voir la galerie complète sur 500px (ouvre dans un nouvel onglet)"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
                >
                  Voir sur 500px
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="lg:w-[38%] flex-shrink-0 min-h-[260px] lg:min-h-0">
              <img
                src="/images/Karimsaari-portfolio-sous-marin-paysages-calanques-marseille-photographie-photographe-environnemental.webp"
                alt="Karim Saari — portfolio photographe sous-marin et paysages dans les Calanques de Marseille"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Section éditoriale SEO */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mt-12 mb-8"
        >
          <motion.div variants={FADE_IN_UP} className="glass rounded-3xl p-8 md:p-10">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">Témoigner par l'image</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-text-secondary leading-relaxed text-sm mb-8">
              <p>Photographe sous-marin et photographe de paysages à Marseille, j'explore la Méditerranée et la Provence de la surface aux profondeurs.</p>
              <p>Sous l'eau, mes images révèlent la biodiversité des fonds marins méditerranéens et leurs fragilités.</p>
              <p>Mon travail documente un territoire — la Méditerranée et la Provence — entre beauté naturelle et enjeux contemporains.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/photographie-sous-marine"
                className="btn-primary inline-flex items-center gap-2"
                title="Découvrir la galerie sous-marine de Karim Saari"
              >
                <span>Galerie Sous-marine &amp; Dépollution</span>
                <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center gap-2 group"
              >
                <span>Nous contacter</span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Photos;
