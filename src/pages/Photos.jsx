import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight, Waves, TreePine } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const merIds = [2, 4, 6, 10, 11, 12, 13, 14, 20, 22, 23, 30, 32, 33, 35, 39, 44, 45, 46, 47, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82];
const terreIds = [1, 3, 5, 7, 8, 9, 15, 16, 17, 18, 19, 21, 24, 25, 26, 27, 28, 29, 31, 34, 36, 37, 38, 40, 41, 42, 43, 48, 49, 53];

const merDims = { 2:[1920,1312], 4:[1920,1498], 6:[1920,1498], 10:[1920,2400], 11:[1920,1312], 12:[1920,1920], 13:[1920,1312], 14:[1920,1498], 20:[1920,1280], 22:[1920,1312], 23:[1920,1920], 30:[1920,1408], 32:[1920,1440], 33:[1000,700], 35:[1920,1312], 39:[1920,1080], 44:[1920,1312], 45:[1920,1440], 46:[1920,1440], 47:[1920,1491], 50:[1920,1498], 51:[1920,1498], 52:[1500,1200], 54:[1920,1279], 55:[4000,3000], 56:[3000,4000], 57:[4096,2731], 58:[3000,2050], 59:[3000,1750], 60:[4096,2728], 61:[3000,1900], 62:[3000,2020], 63:[3000,2050], 64:[3000,2050], 65:[3000,1750], 66:[3000,2340], 67:[3000,2050], 68:[5315,3543], 69:[3000,1970], 70:[4096,2728], 71:[3000,1750], 72:[3000,1750], 73:[3000,2050], 74:[3000,2050], 75:[3000,4000], 76:[3000,2050], 77:[3000,1750], 78:[3000,2050], 79:[3000,2300], 80:[2895,3620], 81:[3000,2050], 82:[3000,1750] };
const terreDims = { 1:[1920,1312], 3:[1920,1124], 5:[1920,1312], 7:[1080,1143], 8:[1920,1312], 9:[1920,1312], 15:[1920,1280], 16:[1920,1280], 17:[1920,1279], 18:[1920,1279], 19:[1920,1080], 21:[1920,1280], 24:[1920,1440], 25:[1920,2866], 26:[1920,1279], 27:[1920,1312], 28:[1920,1251], 29:[1920,1279], 31:[1920,1279], 34:[1920,1312], 36:[1920,2850], 37:[1920,1312], 38:[1920,1312], 40:[1920,1312], 41:[1920,1312], 42:[1920,1080], 43:[1920,1312], 48:[1920,1216], 49:[1920,1280], 53:[1500,1050] };

const merAlts = {
  2: "Petit bateau de pêche blanc ancré sur l'eau turquoise cristalline d'une calanque — photographie aérienne Marseille",
  4: "Vue mi-eau mi-ciel d'une calanque turquoise, fonds clairs et galets sous l'eau, falaises calcaires et pin — Calanques Marseille",
  6: "Exploration en apnée d'une grotte marine dans les Calanques de Marseille — vue subjective, mains en néoprène, eau turquoise et parois calcaires",
  10: "Kayakistes sur l'eau turquoise d'une calanque encadrée de hautes falaises calcaires et de pins — Calanques de Marseille",
  11: "Vague spectaculaire avec arc-en-ciel se brisant sur le quai sous le mistral — Méditerranée Marseille",
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
  61: "Canette Coca-Cola abandonnée sur des algues sous-marines avec une étoile de mer orange — pollution plastique en Méditerranée",
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
};

const terreAlts = {
  1: "Femme au chapeau bleu au milieu d'un champ de lavande en fleur, lumière dorée du soir — Provence",
  3: "Champ de lavande au coucher de soleil en Provence, rangées parallèles, chemin central, ciel rose et lilas",
  5: "Femme au chapeau bleu au milieu d'un vaste champ de lavande violette — Provence",
  7: "Ruelle bleue de Chefchaouen, Maroc — vieil homme en djellaba assis sur des marches, murs bleus et blancs",
  8: "Femme en robe bleue marchant dans un champ de lavande violette — Provence",
  9: "Portrait de profil en lumière dorée dans un champ de lavande — chapeau blanc, ambiance coucher de soleil, Provence",
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
};

const merImages = merIds.map((id, index) => ({
  uid: `mer-${id}`,
  src: `/images/portfolio/Mer/${id}.webp`,
  alt: merAlts[id] || `Photo mer Karim Saari – Calanques de Marseille ${index + 1}`,
  width: merDims[id][0],
  height: merDims[id][1],
}));

const terreImages = terreIds.map((id, index) => ({
  uid: `terre-${id}`,
  src: `/images/portfolio/Terre/${id}.webp`,
  alt: terreAlts[id] || `Photo paysage Karim Saari – Provence ${index + 1}`,
  width: terreDims[id][0],
  height: terreDims[id][1],
}));

const allImages = [...merImages, ...terreImages];

const SectionTitle = ({ icon: Icon, title, count }) => (
  <motion.div variants={FADE_IN_UP} className="flex items-center gap-3 mb-8">
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6 text-ocean-teal" />
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <span className="text-sm text-white/40 font-medium">({count})</span>
    </div>
    <div className="flex-1 h-px bg-white/10 ml-2" />
  </motion.div>
);

const PhotoGrid = ({ images, onOpenLightbox }) => (
  <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
    {images.map((image, index) => (
      <motion.div
        key={image.uid}
        variants={FADE_IN_UP}
        className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl"
        onClick={() => onOpenLightbox(image)}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    ))}
  </div>
);

const Photos = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const closeBtnRef = useRef(null);

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
      const currentIndex = allImages.findIndex(img => img.uid === current.uid);
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % allImages.length;
      } else {
        newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
      }
      return allImages[newIndex];
    });
  }, []);

  useEffect(() => {
    if (isLightboxOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [isLightboxOpen]);

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
    ? allImages.findIndex(img => img.uid === selectedImage.uid) + 1
    : 0;

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/photos']} />
      <div className="container-custom">
        {/* H1 SEO — visible, keyword-rich */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-12 leading-tight"
        >
          Galerie Photo Sous-Marine
          <span className="block text-xl md:text-2xl font-medium text-ocean-teal mt-3">
            Calanques de Marseille — Méditerranée
          </span>
        </motion.h1>

        {/* Section éditoriale SEO — photographie & engagement environnemental */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Témoigner par l'image
            </h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              La photographie sous-marine et la vidéo sont mes armes pour révéler la beauté
              fragile de la Méditerranée, aujourd'hui considérée comme l'une des mers les plus
              polluées au monde. Mes images documentent le contraste saisissant entre la richesse
              de la faune des Calanques et l'invasion silencieuse du plastique. De la surface aux
              profondeurs, l'objectif est d'éveiller les consciences sur cette mer qui suffoque.
            </p>
          </motion.div>
        </motion.div>

        {/* Section Côté Mer */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16"
        >
          <SectionTitle icon={Waves} title="Côté Mer" count={merImages.length} />
          <PhotoGrid images={merImages} onOpenLightbox={openLightbox} />
        </motion.div>

        {/* Section Côté Terre */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
        >
          <SectionTitle icon={TreePine} title="Côté Terre" count={terreImages.length} />
          <PhotoGrid images={terreImages} onOpenLightbox={openLightbox} />
        </motion.div>

        {/* Description — bas de page */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mt-16"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              La Galerie
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Deux séries composent cette galerie : <strong className="text-ocean-teal">Côté Mer</strong>, les fonds sous-marins des Calanques documentés en apnée — entre beauté des posidonnies et réalité des déchets — et <strong className="text-ocean-teal">Côté Terre</strong>, une collection de paysages de voyages, de Marseille à la Provence et au-delà.
              </p>
              <p>
                Retrouvez l'ensemble de mes photos en haute résolution sur 500px.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="https://500px.com/p/karimsaari?view=photos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
              >
                Voir sur 500px
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${currentIndex} sur ${allImages.length}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            <button
              ref={closeBtnRef}
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-60 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label="Fermer la galerie"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
              className="absolute left-4 z-60 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
              className="absolute right-4 z-60 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6 text-white" />
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

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm">
              {currentIndex} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Photos;
