/**
 * seed-supabase.js
 * Peuple photos_paysage, photos_sous_marine, social_stats
 * Usage : node scripts/seed-supabase.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bzlllfmpojcybuyuemdx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bGxsZm1wb2pjeWJ1eXVlbWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzQ1NjQsImV4cCI6MjA4NjYxMDU2NH0.A1nGk9fsNgukxo4WggzFF-lgOFHDaCJS0phbeldx6xY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── PAYSAGE MER ─────────────────────────────────────────────────────────────
const merIds = [2,4,6,10,12,13,14,20,22,23,30,32,33,35,39,44,45,46,47,50,51,52,54,55,56,57,58,59,60,61,62,63,64,66,67,68,70,72,73,74,75,76,78,79,80,81,82,83,86,87,89,90,91,92,94,95,97,98,99,100];
const merFilenames = {
  2:'karim-saari-marseille-bateau-peche-calanque-turquoise-aerien',4:'photographe-sous-marin-marseille-mi-eau-mi-ciel-calanque-turquoise',6:'photographe-sous-marin-marseille-apnee-grotte-marine-calanques',10:'karim-saari-marseille-kayakistes-calanque-falaises-calcaires',12:'karim-saari-marseille-grotte-calanque-turquoise-pins-falaises',13:'karim-saari-marseille-coucher-soleil-calanque-plage-galets',14:'karim-saari-marseille-silhouettes-notre-dame-garde-flaque',20:'karim-saari-marseille-vallon-auffes-coucher-soleil-barques',22:'karim-saari-marseille-falaises-volcaniques-rouges-cote',23:'karim-saari-marseille-calanque-aiguilles-eau-cristalline',30:'karim-saari-marseille-street-art-poisson-mur',32:'karim-saari-marseille-fisheye-calanques-sommets-rochers',33:'karim-saari-marseille-nageur-roches-rouges-anse',35:'karim-saari-marseille-aerien-calanque-nageur-turquoise',39:'karim-saari-marseille-calanque-sauvage-pins-mediterraneens',44:'karim-saari-marseille-femme-rocher-calcaire-calanques',45:'karim-saari-marseille-silhouette-flaque-plage-jetee',46:'karim-saari-marseille-kayakistes-calanque-arbre-tordu',47:'karim-saari-marseille-aerien-vagues-littoral-mediterraneen',50:'karim-saari-marseille-aerien-calanque-secrete-galets-emeraude',51:'karim-saari-marseille-falaises-calcaires-calanque-coucher-soleil',52:'karim-saari-marseille-statue-vierge-falaise-mer-vue-dessus',54:'karim-saari-marseille-en-vau-aerien-calanque-falaises',55:'karim-saari-marseille-marquage-sol-pollution-sensibilisation',56:'karim-saari-marseille-vieux-port-arche-cadenas-notre-dame',57:'karim-saari-marseille-poulies-voilier-notre-dame-garde',58:'karim-saari-marseille-pirate-vieux-port',59:'photographe-sous-marin-marseille-sculpture-musee-subaquatique',60:'karim-saari-marseille-vallon-auffes-nuit-pont-reflets',61:'photographe-sous-marin-marseille-pollution-plastique-fond-marin',62:'karim-saari-marseille-pointu-voile-rouge-notre-dame',63:'karim-saari-marseille-bouee-bateau-notre-dame-garde',64:'karim-saari-marseille-pointu-kraken-calanques',66:'karim-saari-marseille-vague-mistral-tempete-mediterranee',67:'karim-saari-marseille-veliplanchiste-calanques-fort',68:'karim-saari-marseille-coucher-soleil-voiliers-silhouettes',70:'karim-saari-marseille-panoramique-calanques-notre-dame-garde',72:'photographe-sous-marin-marseille-meduse-pelagie-faune-marine',73:'karim-saari-marseille-goeland-bollard-port-turquoise',74:'karim-saari-marseille-barques-peche-calanque-falaises',75:'karim-saari-marseille-calanque-maisons-pecheurs-turquoise',76:'karim-saari-marseille-dechets-plastiques-calanques-projet-sentinelle',78:'karim-saari-marseille-port-calanque-reflets-eau-cristalline',79:'karim-saari-marseille-pointu-reflet-calanque-hdr',80:'karim-saari-marseille-bateau-calanque-turquoise-falaises',81:'karim-saari-marseille-aerien-nageur-calanque-rochers',82:'photographe-sous-marin-marseille-etoile-mer-faune-marine',83:'karim-saari-marseille-sormiou-calanque-mer-turquoise',86:'karim-saari-marseille-frioul-iles-sauvages-mediterranee',87:'karim-saari-marseille-vue-mer-vieux-port-notre-dame-panorama',89:'photographe-sous-marin-marseille-plongee-apnee-calanques-dark-massilia',90:'photographe-sous-marin-marseille-faune-flore-marine-mediterranee',91:'photographe-sous-marin-marseille-posidonie-roches-calcaires-calanques',92:'photographe-sous-marin-marseille-lumiere-filtree-eau-apnee',94:'photographe-sous-marin-marseille-biodiversite-fonds-marins-calanques',95:'photographe-sous-marin-marseille-frioul-exploration-subaquatique',97:'karim-saari-marseille-frioul-falaises-eau-turquoise',98:'karim-saari-marseille-gabian-ilots-roches-calcaires',99:'karim-saari-marseille-paysage-calanque-sormiou-eau-turquoise',100:'karim-saari-capbreton-cote-landaise-ocean-atlantique-paysage',
};
const merAlts = {
  2:"Petit bateau de pêche blanc ancré sur l'eau turquoise cristalline d'une calanque — photographie aérienne Marseille",4:"Vue mi-eau mi-ciel d'une calanque turquoise, fonds clairs et galets sous l'eau, falaises calcaires et pin — © Karim Saari",6:"Exploration en apnée d'une grotte marine dans les Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",10:"Kayakistes sur l'eau turquoise d'une calanque encadrée de hautes falaises calcaires et de pins — Calanques de Marseille",12:"Vue depuis une grotte calcaire sur une calanque turquoise encadrée de pins et de falaises — Calanques de Marseille",13:"Coucher de soleil sur une plage de calanque entre deux falaises, ciel dramatique, reflets dorés sur le sable mouillé",14:"Silhouettes de deux personnes sur un banc et leur reflet dans une flaque, Notre-Dame de la Garde en arrière-plan — Marseille",20:"Port du Vallon des Auffes au coucher de soleil, barques colorées, pont en arches, soleil en étoile — Marseille",22:"Femme en robe rouge sur une plage de galets face aux falaises volcaniques rouges — paysage côtier Marseille",23:"Calanque vue depuis une ouverture dans la roche, femme en bikini dans l'eau cristalline, aiguilles rocheuses",30:"Street art marseillais — poisson coloré peint sous le mot MARSEILLE sur un mur de béton gris",32:"Vue fisheye depuis le sommet des Calanques, femme en robe bleue sur les rochers, anse et mer en contrebas",33:"Nageur solitaire dans les eaux émeraude translucides d'une anse entre falaises de roches rouges",35:"Vue aérienne plongeante sur une calanque turquoise, falaises calcaires blanches, silhouette d'un nageur",39:"Calanque sauvage avec pins méditerranéens, eau turquoise et rochers calcaires — Calanques de Marseille",44:"Femme en robe bleue les bras écartés sur un rocher calcaire dans les Calanques de Marseille",45:"Silhouette d'une personne se reflétant dans une flaque sur la plage à côté d'une jetée en bois, ciel dramatique",46:"Kayakistes sur une calanque turquoise encadrée de falaises et de pins, arbre tordu au premier plan",47:"Vue aérienne de vagues blanches se brisant sur des rochers et une plage de sable — littoral méditerranéen",50:"Vue aérienne d'une calanque secrète, plage de galets, eau émeraude encadrée de falaises calcaires",51:"Falaises calcaires dorées se reflétant dans les eaux turquoise d'une calanque au coucher de soleil",52:"Statue de la Vierge à l'Enfant au sommet d'une falaise surplombant la mer au coucher du soleil — vue du dessus",54:"Vue aérienne de la calanque d'En-Vau turquoise entre falaises calcaires blanches et pins — Calanques de Marseille",55:'Marquage au sol "Ne rien jeter ici — La mer commence ici" sur asphalte rouge — sensibilisation à la pollution',56:"Vieux-Port de Marseille vu à travers une arche ornée de cadenas d'amour, voiliers et Notre-Dame de la Garde",57:"Détail de poulies en bois sur un mât de voilier, Notre-Dame de la Garde en arrière-plan flou — Vieux-Port Marseille",58:"Personnage costumé en pirate avec masque et pistolet factice — Vieux-Port de Marseille",59:"Sculpture sous-marine colonisée par les algues et coraux — musée subaquatique Méditerranée — © Karim Saari",60:"Port du Vallon des Auffes la nuit sous une arche de pont illuminée, maisons colorées et reflets dans l'eau",61:"Canette Coca-Cola sur algues sous-marines avec étoile de mer orange — pollution plastique — © Karim Saari",62:"Pointu marseillais à voile rouge naviguant devant Marseille avec Notre-Dame de la Garde en arrière-plan",63:"Bouée de sauvetage sur la proue d'un bateau bleu, Notre-Dame de la Garde floue en arrière-plan — Marseille",64:"Pointu marseillais à voile rouge et blanc croisant le grand voilier Kraken dans les Calanques de Marseille",66:"Vague du mistral s'écrasant sur le quai en Méditerranée — photographie de tempête à Marseille par Karim Saari",67:"Véliplanchiste sur la mer agitée avec les Calanques de Marseille et le fort en arrière-plan",68:"Coucher de soleil rouge sur la mer avec trois voiliers en silhouette — Méditerranée",70:"Vue panoramique sur Marseille depuis les hauteurs des Calanques, route sinueuse, Notre-Dame de la Garde visible",72:"Méduse Pélagie (Pelagia noctiluca) rose en pleine eau turquoise — faune marine Méditerranée — © Karim Saari",73:"Goéland leucophée posé sur un bollard de port devant l'eau turquoise — Marseille",74:"Barques de pêche traditionnelles amarrées dans un port de calanque sous les falaises calcaires — Marseille",75:"Calanque sauvage aux eaux turquoise avec pin en premier plan, maisons de pêcheurs et mouette en vol",76:"Amas de déchets plastiques collectés dans les Calanques — bouteilles, canettes, emballages — Projet Sentinelle",78:"Petit port de calanque avec bateaux amarrés se reflétant dans l'eau cristalline, falaises calcaires — HDR Marseille",79:"Proue d'un pointu marseillais se reflétant dans l'eau cristalline d'une calanque, cordages et fond marin — HDR",80:"Petit bateau de pêche blanc naviguant dans les eaux turquoise d'une calanque encadrée de hautes falaises calcaires",81:"Vue aérienne plongeante sur un nageur solitaire dans les eaux turquoise d'une calanque entre rochers calcaires",82:"Main tenant une étoile de mer rouge sous l'eau — faune marine Méditerranée — © Karim Saari",83:"Mer turquoise azuréenne vue depuis la calanque de Sormiou — Marseille, Calanques de Marseille",86:"Archipel du Frioul vu de la mer — îles sauvages de Marseille en Méditerranée 2020",87:"Marseille vue depuis la mer — panorama du littoral méditerranéen, Vieux-Port et Notre-Dame de la Garde",89:"Plongée en apnée dans les Calanques — exploration des fonds méditerranéens — © Karim Saari",90:"Faune et flore sous-marines des Calanques de Marseille — © Karim Saari, photographe sous-marin Marseille",91:"Posidonie et roches calcaires sous-marines — Calanques de Marseille — © Karim Saari",92:"Lumière filtrée sous l'eau dans les Calanques de Marseille — © Karim Saari",94:"Biodiversité des fonds marins méditerranéens — Calanques de Marseille — © Karim Saari",95:"Fonds marins du Frioul — exploration en apnée — © Karim Saari",97:"Archipel du Frioul — Marseille — falaises calcaires et eau turquoise méditerranéenne",98:"Îlots des Gabian près de Marseille — végétation méditerranéenne sur roches calcaires",99:"Paysage de la calanque de Sormiou, Marseille — eau turquoise et falaises calcaires — © Karim Saari",100:"Côte landaise à Capbreton — paysage de l'océan Atlantique, vagues et plage de sable — © Karim Saari",
};

// ── PAYSAGE TERRE ─────────────────────────────────────────────────────────────
const terreIds = [1,3,5,7,8,9,15,16,17,18,19,21,24,25,26,27,28,29,31,34,36,37,38,40,41,42,43,48,49,53,54,85];
const terreFilenames = {
  1:'karim-saari-photographe-provence-femme-chapeau-champ-lavande-lumiere-doree',3:'karim-saari-photographe-provence-champ-lavande-coucher-soleil-rangees',5:'karim-saari-photographe-provence-femme-chapeau-lavande-violette',7:'karim-saari-photographe-maroc-chefchaouen-ruelle-bleue-vieil-homme',8:'karim-saari-photographe-provence-femme-robe-bleue-lavande',9:'karim-saari-photographe-provence-portrait-chapeau-blanc-lavande',15:'karim-saari-photographe-marseille-carrousel-vieux-port-coucher-soleil',16:'karim-saari-photographe-maroc-chefchaouen-chaton-roux-mur-bleu',17:'karim-saari-photographe-maroc-chefchaouen-femme-chapeau-ville-bleue',18:'karim-saari-photographe-maroc-chefchaouen-chaton-blanc-escaliers-bleus',19:'karim-saari-photographe-maroc-chefchaouen-chats-ruelle-bleue',21:'karim-saari-photographe-femme-robe-rouge-rochers-volcaniques-cote-sauvage',24:'karim-saari-photographe-dune-pilat-arcachon-silhouette-foret-landes',25:'karim-saari-photographe-provence-macro-coccinelle-lavande-pollinisateur',26:'karim-saari-photographe-provence-aerien-tournesols-lavande',27:'karim-saari-photographe-provence-femme-short-jaune-champ-lavande',28:'karim-saari-photographe-provence-couple-champ-lavande-vue-dessus',29:'karim-saari-photographe-provence-lavande-coucher-soleil-ciel-orange-rouge',31:'karim-saari-photographe-provence-arbre-solitaire-lavande-ciel-dramatique',34:'karim-saari-photographe-provence-femme-chapeau-blanc-coquelicots',36:'karim-saari-photographe-marseille-tour-corbusier-architecture-brutaliste',37:'karim-saari-photographe-maroc-cigognes-nid-faune-sauvage',38:'karim-saari-photographe-maroc-femme-chapeau-ruelle-medina-ocre',40:'karim-saari-photographe-provence-femme-champ-tulipes-roses',41:'karim-saari-photographe-provence-femme-chapeau-paille-tulipes-multicolores',42:'karim-saari-photographe-provence-village-femme-robe-rouge-flaque',43:'karim-saari-photographe-provence-femme-robe-rouge-lavande-crepuscule',48:'karim-saari-photographe-provence-geometrie-rangees-lavande-vue-dessus',49:'karim-saari-photographe-provence-lavande-coucher-soleil-montagnes',53:'karim-saari-photographe-provence-lavande-tournesols-contraste-couleurs',54:'karim-saari-photographe-provence-paysage-mediterraneen-lumiere-doree',85:'karim-saari-marseille-littoral-stade-panoramique',
};
const terreAlts = {
  1:"Femme au chapeau bleu dans un champ de lavande, lumière dorée du soir — photographe paysage Provence Karim Saari",3:"Champ de lavande de Valensole au coucher de soleil, rangées parallèles, ciel rose — photographe Provence Karim Saari",5:"Femme au chapeau bleu dans un vaste champ de lavande violette — photographe paysage Provence Karim Saari",7:"Ruelle bleue de Chefchaouen, vieil homme en djellaba sur des marches — photographe Maroc Karim Saari",8:"Femme en robe bleue marchant dans un champ de lavande violette — photographe Provence Karim Saari",9:"Portrait lumière dorée dans les lavandes de Valensole, chapeau blanc, coucher de soleil — Karim Saari",15:"Carrousel flou et enfant sur la place du Vieux-Port au coucher de soleil — photographe Marseille Karim Saari",16:"Chaton roux couché sur un pavé devant un mur bleu — Chefchaouen, photographe Maroc Karim Saari",17:"Femme de dos avec chapeau, ville bleue de Chefchaouen vue panoramique — photographe Maroc Karim Saari",18:"Chaton blanc yeux bleus contre les marches bleues de Chefchaouen — photographe Maroc Karim Saari",19:"Deux chats dans une ruelle bleue de Chefchaouen, escaliers bleus et blancs — Karim Saari",21:"Femme en robe rouge sur des rochers volcaniques noirs, côte sauvage — photographe paysage Karim Saari",24:"Silhouette au sommet de la Dune du Pilat face à la forêt des Landes — photographe Arcachon Karim Saari",25:"Macro coccinelle rouge sur lavande en fleur, Valensole — photographe nature Provence Karim Saari",26:"Vue aérienne femmes courant entre tournesols et lavande — photographe paysage Provence Karim Saari",27:"Femme en short jaune dans un champ de lavande de Provence — photographe Valensole Karim Saari",28:"Couple enlacé au milieu d'un champ de lavande vu d'en haut — photographe Provence Karim Saari",29:"Champ de lavande de Valensole au coucher de soleil, ciel orange rouge — photographe Provence Karim Saari",31:"Arbre solitaire dans la lavande de Provence, ciel dramatique rose-orange — photographe Karim Saari",34:"Femme au chapeau blanc avec un coquelicot dans un champ de coquelicots — photographe Provence Karim Saari",36:"Femme au pied de la tour du Corbusier à Marseille, architecture brutaliste — photographe Marseille Karim Saari",37:"Cigognes blanches sur leur nid, reproduction faune sauvage — photographe Maroc Karim Saari",38:"Femme au chapeau dans une ruelle de médina marocaine, murs ocre, lumière rasante — Karim Saari",40:"Femme en combinaison bleue dans un champ de tulipes roses — photographe paysage Provence Karim Saari",41:"Femme au chapeau de paille dans un champ de tulipes multicolores — photographe Provence Karim Saari",42:"Femme en robe rouge se reflétant dans une flaque, village provençal — photographe Karim Saari",43:"Femme en robe rouge dans la lavande au crépuscule, lumière dorée rasante — photographe Provence Karim Saari",48:"Géométrie des rangées de lavande de Valensole vue d'en haut — photographe paysage Provence Karim Saari",49:"Lavande de Provence au coucher de soleil avec montagnes en arrière-plan — photographe Karim Saari",53:"Champ de lavande et champ de tournesols, contraste de couleurs, Provence — photographe Karim Saari",54:"Paysage méditerranéen de Provence, nature sauvage et lumière dorée — photographe Karim Saari",85:"Vue panoramique sur le littoral méditerranéen et le stade de Marseille — © Karim Saari",
};

// ── SOUS-MARINE ────────────────────────────────────────────────────────────────
const sousMarine = [
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-apneiste.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-1.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-2.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-3.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-4.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-5.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-6.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-8.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bache.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-barrière.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bateau.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bouteille.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-canette.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-déchets.webp",
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
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-1.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-2.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-vie-marine.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-nage-calanque.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-nage.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-plaque-immatriculation.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-pollution-huveaune.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poséidon.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poulpe.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-shooting-cave.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-shooting.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-soupe-plastique.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-spirographe.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen-freediving.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-vélo-métropole.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-vélo.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-angel.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-7.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-diving.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-7.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-9.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mer-goudes.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée-subaquatique.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-3.webp",
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

const getAltSM = (src) => {
  const f = src.split('/').pop().replace('.webp', '');
  const d = f.replace('Marseille-dark-massilia-plastique-pollution-projet-sentinelle-', '').replace(/-/g,' ').replace(/_/g,' ');
  return `Mission Projet Sentinelle Marseille — ${d.charAt(0).toUpperCase()+d.slice(1)} — © Karim Saari`;
};

// ── SOCIAL STATS ────────────────────────────────────────────────────────────────
const socialStats = [
  { platform:'facebook_group', value:64300, note:'Amoureux des Calanques', sort_order:1 },
  { platform:'instagram',      value:24200, note:'@karimsaari',            sort_order:2 },
  { platform:'tiktok',         value:21900, note:'@dark.massilia',         sort_order:3 },
  { platform:'youtube',        value:5000,  note:'@dark.massilia',         sort_order:4 },
  { platform:'facebook_perso', value:5800,  note:'Karim Saari',            sort_order:5 },
  { platform:'facebook_page',  value:12200, note:'Dark Massilia',          sort_order:6 },
  { platform:'pinterest',      value:800,   note:'Photographie Marseille', sort_order:7 },
  { platform:'x',              value:1200,  note:'@dark_massilia',         sort_order:8 },
  { platform:'local_guide_contributions', value:22000,  note:'Contributions Google Maps', sort_order:10 },
  { platform:'local_guide_points',        value:118000, note:'Points obtenus',             sort_order:11 },
  { platform:'local_guide_views_m',       value:183,    note:'Vues générées (millions)',   sort_order:12 },
  { platform:'local_guide_level',         value:10,     note:'Niveau Local Guide',         sort_order:13 },
];

// ── SEED ────────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Démarrage du seed Supabase…\n');

  // 1. photos_paysage — Mer
  const merRows = merIds.map(id => ({
    uid: `mer-${id}`,
    src: `/images/portfolio/Mer/${merFilenames[id]}.webp`,
    alt: merAlts[id] || `Photo mer Calanques de Marseille — © Karim Saari`,
    title: '',
    lieu: 'Calanques de Marseille',
    visible: true,
    categorie: 'mer',
  }));
  // extra mer
  merRows.push({
    uid: 'mer-portfolio-paysages-env',
    src: '/images/Karimsaari-portfolio-sous-marin-paysages-calanques-marseille-photographie-photographe-environnemental.webp',
    alt: 'Karim Saari photographe — portfolio sous-marin et paysages des Calanques de Marseille, engagement environnemental',
    title: '', lieu: 'Calanques de Marseille', visible: true, categorie: 'mer',
  });

  // 2. photos_paysage — Terre
  const terreRows = terreIds.map(id => ({
    uid: `terre-${id}`,
    src: `/images/portfolio/Terre/${terreFilenames[id]}.webp`,
    alt: terreAlts[id] || `Photographe paysage Provence — © Karim Saari`,
    title: '', lieu: 'Provence', visible: true, categorie: 'terre',
  }));

  const paysageRows = [...merRows, ...terreRows];
  const { error: e1 } = await supabase.from('photos_paysage').upsert(paysageRows, { onConflict: 'uid' });
  if (e1) console.error('❌ photos_paysage :', e1.message);
  else console.log(`✅ photos_paysage : ${paysageRows.length} lignes insérées`);

  // 3. photos_sous_marine
  const smRows = sousMarine.map((src, i) => ({
    uid: `sentinelle-${i}`,
    src,
    alt: getAltSM(src),
    title: '', lieu: 'Calanques de Marseille', visible: true,
  }));
  const { error: e2 } = await supabase.from('photos_sous_marine').upsert(smRows, { onConflict: 'uid' });
  if (e2) console.error('❌ photos_sous_marine :', e2.message);
  else console.log(`✅ photos_sous_marine : ${smRows.length} lignes insérées`);

  // 4. social_stats
  const { error: e3 } = await supabase.from('social_stats').upsert(socialStats, { onConflict: 'platform' });
  if (e3) console.error('❌ social_stats :', e3.message);
  else console.log(`✅ social_stats : ${socialStats.length} lignes insérées`);

  console.log('\n🎉 Seed terminé !');
}

seed();
