import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight, Waves, TreePine, ArrowLeft } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import { Link } from 'react-router-dom';
import useFocusTrap from '../hooks/useFocusTrap';

const merIds = [2, 4, 6, 10, 12, 13, 14, 20, 22, 23, 30, 32, 33, 35, 39, 44, 45, 46, 47, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98];
const terreIds = [1, 3, 5, 7, 8, 9, 15, 16, 17, 18, 19, 21, 24, 25, 26, 27, 28, 29, 31, 34, 36, 37, 38, 40, 41, 42, 43, 48, 49, 53, 54];

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
};

const merDims = { 2:[1920,1312], 4:[1920,1498], 6:[1920,1498], 10:[1920,2400], 12:[1920,1920], 13:[1920,1312], 14:[1920,1498], 20:[1920,1280], 22:[1920,1312], 23:[1920,1920], 30:[1920,1408], 32:[1920,1440], 33:[1000,700], 35:[1920,1312], 39:[1920,1080], 44:[1920,1312], 45:[1920,1440], 46:[1920,1440], 47:[1920,1491], 50:[1920,1498], 51:[1920,1498], 52:[1500,1200], 54:[1920,1279], 55:[4000,3000], 56:[3000,4000], 57:[4096,2731], 58:[3000,2050], 59:[3000,1750], 60:[4096,2728], 61:[3000,1900], 62:[3000,2020], 63:[3000,2050], 64:[3000,2050], 65:[3000,1750], 66:[3000,2340], 67:[3000,2050], 68:[5315,3543], 69:[3000,1970], 70:[4096,2728], 71:[3000,1750], 72:[3000,1750], 73:[3000,2050], 74:[3000,2050], 75:[3000,4000], 76:[3000,2050], 77:[3000,1750], 78:[3000,2050], 79:[3000,2300], 80:[2895,3620], 81:[3000,2050], 82:[3000,1750], 83:[1920,1498], 85:[1920,1248], 86:[1920,1312], 87:[1920,1312], 88:[1920,1440], 89:[1920,1440], 90:[1920,1440], 91:[1920,1440], 92:[1920,1440], 93:[1920,1440], 94:[1920,1440], 95:[1920,1440], 96:[1920,1440], 97:[1920,1312], 98:[1500,1050] };

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
  65: 'photographe-sous-marin-marseille-plongeurs-fonds-marins-mediterranee',
  66: 'karim-saari-marseille-vague-mistral-tempete-mediterranee',
  67: 'karim-saari-marseille-veliplanchiste-calanques-fort',
  68: 'karim-saari-marseille-coucher-soleil-voiliers-silhouettes',
  69: 'photographe-sous-marin-marseille-depollution-apnee-pneu-projet-sentinelle',
  70: 'karim-saari-marseille-panoramique-calanques-notre-dame-garde',
  71: 'photographe-sous-marin-marseille-apneiste-competition-certification',
  72: 'photographe-sous-marin-marseille-meduse-pelagie-faune-marine',
  73: 'karim-saari-marseille-goeland-bollard-port-turquoise',
  74: 'karim-saari-marseille-barques-peche-calanque-falaises',
  75: 'karim-saari-marseille-calanque-maisons-pecheurs-turquoise',
  76: 'karim-saari-marseille-dechets-plastiques-calanques-projet-sentinelle',
  77: 'photographe-sous-marin-marseille-depollution-posidonie-apnee-projet-sentinelle',
  78: 'karim-saari-marseille-port-calanque-reflets-eau-cristalline',
  79: 'karim-saari-marseille-pointu-reflet-calanque-hdr',
  80: 'karim-saari-marseille-bateau-calanque-turquoise-falaises',
  81: 'karim-saari-marseille-aerien-nageur-calanque-rochers',
  82: 'photographe-sous-marin-marseille-etoile-mer-faune-marine',
  83: 'karim-saari-marseille-sormiou-calanque-mer-turquoise',
  85: 'karim-saari-marseille-littoral-stade-panoramique',
  86: 'karim-saari-marseille-frioul-iles-sauvages-mediterranee',
  87: 'karim-saari-marseille-vue-mer-vieux-port-notre-dame-panorama',
  88: 'photographe-sous-marin-marseille-fonds-marins-calanques-apnee',
  89: 'photographe-sous-marin-marseille-plongee-apnee-calanques-dark-massilia',
  90: 'photographe-sous-marin-marseille-faune-flore-marine-mediterranee',
  91: 'photographe-sous-marin-marseille-posidonie-roches-calcaires-calanques',
  92: 'photographe-sous-marin-marseille-lumiere-filtree-eau-apnee',
  93: 'photographe-sous-marin-marseille-apneiste-exploration-fonds-marins',
  94: 'photographe-sous-marin-marseille-biodiversite-fonds-marins-calanques',
  95: 'photographe-sous-marin-marseille-frioul-exploration-subaquatique',
  96: 'photographe-sous-marin-marseille-mission-depollution-projet-sentinelle',
  97: 'karim-saari-marseille-frioul-falaises-eau-turquoise',
  98: 'karim-saari-marseille-gabian-ilots-roches-calcaires',
};
const terreDims = { 1:[1920,1312], 3:[1920,1124], 5:[1920,1312], 7:[1080,1143], 8:[1920,1312], 9:[1920,1312], 15:[1920,1280], 16:[1920,1280], 17:[1920,1279], 18:[1920,1279], 19:[1920,1080], 21:[1920,1280], 24:[1920,1440], 25:[1920,2866], 26:[1920,1279], 27:[1920,1312], 28:[1920,1251], 29:[1920,1279], 31:[1920,1279], 34:[1920,1312], 36:[1920,2850], 37:[1920,1312], 38:[1920,1312], 40:[1920,1312], 41:[1920,1312], 42:[1920,1080], 43:[1920,1312], 48:[1920,1216], 49:[1920,1280], 53:[1500,1050], 54:[1920,1280] };

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
  65: "Deux plongeurs en combinaison noire explorant les fonds marins de Méditerranée entre algues et rochers — © Karim Saari, photographe sous-marin Marseille",
  66: "Vague du mistral s'écrasant sur le quai en Méditerranée — photographie de tempête à Marseille par Karim Saari",
  67: "Véliplanchiste sur la mer agitée avec les Calanques de Marseille et le fort en arrière-plan",
  68: "Coucher de soleil rouge sur la mer avec trois voiliers en silhouette — Méditerranée",
  69: "Deux apnéistes remontant un pneu du fond marin — dépollution Projet Sentinelle — © Karim Saari, photographe sous-marin Marseille",
  70: "Vue panoramique sur Marseille depuis les hauteurs des Calanques, route sinueuse, Notre-Dame de la Garde visible",
  71: "Apnéiste sous l'eau tenant un panneau de certification — compétition d'apnée en Méditerranée — © Karim Saari, photographe sous-marin Marseille",
  72: "Méduse Pélagie (Pelagia noctiluca) rose en pleine eau turquoise — faune marine Méditerranée — © Karim Saari, photographe sous-marin Marseille",
  73: "Goéland leucophée posé sur un bollard de port devant l'eau turquoise — Marseille",
  74: "Barques de pêche traditionnelles amarrées dans un port de calanque sous les falaises calcaires — Marseille",
  75: "Calanque sauvage aux eaux turquoise avec pin en premier plan, maisons de pêcheurs et mouette en vol",
  76: "Amas de déchets plastiques collectés dans les Calanques — bouteilles, canettes, emballages — Projet Sentinelle Dark Massilia",
  77: "Apnéiste remontant un pneu sur herbier de posidonie — dépollution Projet Sentinelle Méditerranée — © Karim Saari, photographe sous-marin Marseille",
  78: "Petit port de calanque avec bateaux amarrés se reflétant dans l'eau cristalline, falaises calcaires et ciel bleu — HDR Marseille",
  79: "Proue d'un pointu marseillais se reflétant dans l'eau cristalline d'une calanque, cordages et fond marin visible — HDR",
  80: "Petit bateau de pêche blanc naviguant dans les eaux turquoise d'une calanque encadrée de hautes falaises calcaires",
  81: "Vue aérienne plongeante sur un nageur solitaire dans les eaux turquoise d'une calanque entre rochers calcaires",
  82: "Main tenant une étoile de mer rouge sous l'eau — faune marine Méditerranée — © Karim Saari, photographe sous-marin Marseille",
  83: "Mer turquoise azuréenne vue depuis la calanque de Sormiou — Marseille, Calanques de Marseille",
  85: "Vue panoramique sur le littoral et le stade de Marseille — Méditerranée, lumière du sud",
  86: "Archipel du Frioul vu de la mer — îles sauvages de Marseille en Méditerranée 2020",
  87: "Marseille vue depuis la mer — panorama du littoral méditerranéen, Vieux-Port et Notre-Dame de la Garde",
  88: "Fonds marins des Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille — apnée subaquatique",
  89: "Plongée en apnée dans les Calanques — exploration des fonds méditerranéens — © Karim Saari, photographe sous-marin Marseille",
  90: "Faune et flore sous-marines des Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",
  91: "Posidonie et roches calcaires sous-marines — Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",
  92: "Lumière filtrée sous l'eau dans les Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",
  93: "Apnéiste explorant les fonds marins des Calanques — © Karim Saari, photographe sous-marin Marseille",
  94: "Biodiversité des fonds marins méditerranéens — Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",
  95: "Fonds marins du Frioul — exploration en apnée — © Karim Saari, photographe sous-marin Marseille",
  96: "Mission de dépollution sous-marine — Projet Sentinelle — © Karim Saari, photographe sous-marin Marseille",
  97: "Archipel du Frioul — Marseille — falaises calcaires et eau turquoise méditerranéenne",
  98: "Îlots des Gabian près de Marseille — végétation méditerranéenne sur roches calcaires en Méditerranée",
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
};

const merImages = merIds.map((id, index) => ({
  uid: `mer-${id}`,
  src: `/images/portfolio/Mer/${merFilenames[id]}.webp`,
  alt: merAlts[id] || `Photo mer Karim Saari – Calanques de Marseille ${index + 1}`,
  width: merDims[id][0],
  height: merDims[id][1],
}));

const terreImages = terreIds.map((id, index) => ({
  uid: `terre-${id}`,
  src: `/images/portfolio/Terre/${terreFilenames[id]}.webp`,
  alt: terreAlts[id] || `Photographe paysage Provence Karim Saari ${index + 1}`,
  width: terreDims[id][0],
  height: terreDims[id][1],
}));

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const SectionTitle = ({ icon: Icon, title, count }) => (
  <motion.div variants={FADE_IN_UP} className="flex items-center gap-3 mb-8">
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6 text-ocean-teal" aria-hidden="true" />
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <span className="text-sm text-white/40 font-medium">({count})</span>
    </div>
    <div className="flex-1 h-px bg-white/10 ml-2" />
  </motion.div>
);

const PhotoGrid = ({ images, onOpenLightbox }) => (
  <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
    {images.map((image, index) => (
      <motion.button
        key={image.uid}
        type="button"
        variants={FADE_IN_UP}
        className="block w-full break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl focus-ring"
        onClick={() => onOpenLightbox(image)}
        aria-label={`Ouvrir la photo : ${image.alt}`}
      >
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
      </motion.button>
    ))}
  </div>
);

const Photos = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const closeBtnRef = useRef(null);

  const [shuffledMer, setShuffledMer] = useState(merImages);
  const [shuffledTerre, setShuffledTerre] = useState(terreImages);
  const shuffledAll = useMemo(() => [...shuffledMer, ...shuffledTerre], [shuffledMer, shuffledTerre]);

  // Focus trap pour le lightbox
  const lightboxRef = useFocusTrap(isLightboxOpen);

  // Shuffle côté client uniquement (après hydration SSR)
  useEffect(() => {
    setShuffledMer(shuffle(merImages));
    setShuffledTerre(shuffle(terreImages));
  }, []);

  const openLightbox = (image) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => setSelectedImage(null), 300);
  }, []);

  const navigateImage = useCallback((direction) => {
    setSelectedImage((current) => {
      if (!current) return current;
      const currentIndex = shuffledAll.findIndex(img => img.uid === current.uid);
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % shuffledAll.length;
      } else {
        newIndex = (currentIndex - 1 + shuffledAll.length) % shuffledAll.length;
      }
      return shuffledAll[newIndex];
    });
  }, [shuffledAll]);

  // Focus sur le bouton fermer à l'ouverture
  useEffect(() => {
    if (isLightboxOpen && closeBtnRef.current) {
      setTimeout(() => closeBtnRef.current?.focus(), 100);
    }
  }, [isLightboxOpen]);

  // Navigation clavier
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, closeLightbox, navigateImage]);

  const currentIndex = selectedImage
    ? shuffledAll.findIndex(img => img.uid === selectedImage.uid) + 1
    : 0;

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/photographie-paysage-mer']} />
      <div className="container-custom">
        {/* H1 SEO — visible, keyword-rich */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl font-bold text-white text-center mb-8 leading-tight"
        >
          Photographie environnementale : Les paysages littoraux et sous-marins des Calanques
        </motion.h1>

        {/* Section Côté Mer */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16"
        >
          <SectionTitle icon={Waves} title="Côté Mer" count={shuffledMer.length} />
          <PhotoGrid images={shuffledMer} onOpenLightbox={openLightbox} />
        </motion.div>

        {/* Section Côté Terre */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
        >
          <SectionTitle icon={TreePine} title="Côté Terre" count={shuffledTerre.length} />
          <PhotoGrid images={shuffledTerre} onOpenLightbox={openLightbox} />
        </motion.div>

        {/* Description — bas de page */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mt-16"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              La Galerie
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>Deux univers structurent mon travail photographique :</p>
              <p>
                <strong className="text-ocean-teal">Côté Mer</strong> — Photographe sous-marin à Marseille, je documente les fonds des Calanques et la biodiversité méditerranéenne en apnée. De la faune aux paysages subaquatiques, mes images témoignent de la beauté et des fragilités de la Méditerranée.
              </p>
              <p>
                <strong className="text-ocean-teal">Côté Terre</strong> — Photographe de paysages en Provence, je capture les reliefs des Calanques, les champs de lavande, les lumières marseillaises et les horizons méditerranéens. Une approche naturaliste et immersive du territoire.
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
          </motion.div>
        </motion.div>

        {/* Section éditoriale SEO — déplacée en bas */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mt-12 mb-0"
        >
          <motion.div variants={FADE_IN_UP} className="glass rounded-3xl p-8 md:p-10">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">
              Témoigner par l'image
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-text-secondary leading-relaxed text-sm">
              <p>
                Photographe sous-marin à Marseille et photographe de paysages en Provence, j'explore
                la Méditerranée de la surface aux profondeurs.
              </p>
              <p>
                Sous l'eau, mes images révèlent la biodiversité des fonds marins méditerranéens et
                leurs fragilités.
              </p>
              <p>
                Mon travail documente un territoire — la Méditerranée et la Provence — entre beauté
                naturelle et enjeux contemporains.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTAs — Continuer la navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/depollution-marine"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Nos missions de dépollution</span>
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link
            to="/contact"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <span>Nous contacter</span>
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedImage && (
          <motion.div
            ref={lightboxRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-counter"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            <button
              ref={closeBtnRef}
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-60 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md focus-ring"
              aria-label="Fermer la galerie"
            >
              <X className="w-6 h-6 text-white" aria-hidden="true" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
              className="absolute left-4 z-60 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md focus-ring"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6 text-white" aria-hidden="true" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
              className="absolute right-4 z-60 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md focus-ring"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6 text-white" aria-hidden="true" />
            </button>

            <motion.img
              key={selectedImage.uid}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div
              id="lightbox-counter"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm"
              aria-live="polite"
              aria-atomic="true"
            >
              {currentIndex} / {shuffledAll.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Photos;
