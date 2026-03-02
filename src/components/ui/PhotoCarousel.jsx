import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Liste complète des 58 images du Projet Sentinelle
const allImages = [
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
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-moyades-riou.webp",
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
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-angel.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-archipel-frioul-barquette-7.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-diving.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-frioul-7.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-frioul-9.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-huveaune.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-mer-goudes.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-musée-subaquatique.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-musée_subaquatique-3.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-octopus.webp",
  "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-paysage-sous-marin.webp"
];

// Algorithme de mélange Fisher-Yates
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Générer alt text depuis le nom de fichier
const getAltText = (imgSrc) => {
  return imgSrc
    .split('/').pop()
    .replace('.webp', '')
    .replace(/-/g, ' ')
    .replace(/%C3%A8re/g, 'ière')
    .replace(/%C3%A9/g, 'é')
    .replace(/%C3%A0/g, 'à')
    .replace(/%20/g, ' ');
};

// Catégoriser les images par mot-clé
const getCategoryFromFilename = (imgSrc) => {
  const filename = imgSrc.toLowerCase();
  if (filename.includes('barquette')) return { name: 'Pollution plastique', color: '#ff6b35' };
  if (filename.includes('musée')) return { name: 'Musée subaquatique', color: '#0091ff' };
  if (filename.includes('frioul')) return { name: 'Archipel du Frioul', color: '#21c47b' };
  if (filename.includes('apneiste') || filename.includes('diving') || filename.includes('moyades')) return { name: 'Apnée & Plongée', color: '#0091ff' };
  if (filename.includes('poulpe') || filename.includes('spirographe') || filename.includes('angel')) return { name: 'Vie marine', color: '#ffd93d' };
  if (filename.includes('vélo') || filename.includes('plaque') || filename.includes('barrière')) return { name: 'Déchets collectés', color: '#ff6b35' };
  if (filename.includes('grotte') || filename.includes('cave')) return { name: 'Grottes marines', color: '#9b59b6' };
  if (filename.includes('huveaune')) return { name: 'Rivière Huveaune', color: '#3498db' };
  return { name: 'Projet Sentinelle', color: '#21c47b' };
};

const PhotoCarousel = () => {
  const [shuffledImages, setShuffledImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Mélanger les images au chargement
  useEffect(() => {
    setShuffledImages(shuffleArray(allImages));
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % shuffledImages.length);
  }, [shuffledImages.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + shuffledImages.length) % shuffledImages.length);
  }, [shuffledImages.length]);

  // Navigation au clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (shuffledImages.length === 0) {
    return <div className="skeleton aspect-[16/9] rounded-3xl" />;
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -400 : 400,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const currentCategory = getCategoryFromFilename(shuffledImages[currentIndex]);
  const currentAlt = getAltText(shuffledImages[currentIndex]);

  return (
    <div
      role="region"
      aria-label="Carrousel de photos — Projet Sentinelle"
      aria-roledescription="carrousel"
      className="relative w-full max-w-6xl mx-auto"
    >
      {/* Annonce live pour lecteurs d'écran */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Photo {currentIndex + 1} sur {shuffledImages.length} : {currentAlt}
      </div>

      {/* Main Carousel Container - Format cinématique */}
      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10 pointer-events-none" aria-hidden="true" />

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={currentIndex}
            src={shuffledImages[currentIndex]}
            alt={currentAlt}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 280, damping: 35 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>

        {/* Navigation Buttons - Design moderne */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-ocean-teal/40 hover:border-ocean-teal/60 transition-all duration-300 z-20 group hover:scale-110 active:scale-95 focus-ring"
          aria-label="Photo précédente"
        >
          <ChevronLeft className="w-7 h-7 text-white group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} aria-hidden="true" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-ocean-teal/40 hover:border-ocean-teal/60 transition-all duration-300 z-20 group hover:scale-110 active:scale-95 focus-ring"
          aria-label="Photo suivante"
        >
          <ChevronRight className="w-7 h-7 text-white group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} aria-hidden="true" />
        </button>

        {/* Category Badge - Design élégant */}
        <motion.div
          key={currentCategory.name}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-6 z-20"
          aria-hidden="true"
        >
          <div
            className="px-5 py-2.5 rounded-full backdrop-blur-xl font-semibold text-sm shadow-lg"
            style={{
              backgroundColor: `${currentCategory.color}20`,
              borderColor: `${currentCategory.color}60`,
              borderWidth: '1.5px',
              boxShadow: `0 8px 20px ${currentCategory.color}30`
            }}
          >
            <span style={{ color: currentCategory.color }}>● {currentCategory.name}</span>
          </div>
        </motion.div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20" aria-hidden="true">
          <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent px-6 pt-16 pb-6">
            <div className="flex items-end justify-between gap-4">
              {/* Caption */}
              <div className="flex-1 min-w-0">
                <motion.p
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white font-semibold text-base md:text-lg mb-1 drop-shadow-lg truncate"
                >
                  {getAltText(shuffledImages[currentIndex]).split(' ').slice(5, 10).join(' ')}
                </motion.p>
                <p className="text-white/70 text-sm">Calanques de Marseille · Projet Sentinelle</p>
              </div>

              {/* Counter */}
              <div className="flex-shrink-0">
                <div className="px-5 py-2.5 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold text-sm shadow-xl">
                  {currentIndex + 1} / {shuffledImages.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30" aria-hidden="true">
          <motion.div
            className="h-full bg-gradient-to-r from-ocean-teal via-ocean-blue to-ocean-teal"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / shuffledImages.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Thumbnails Navigation - Grid moderne */}
      <div
        className="mt-8 grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3"
        role="group"
        aria-label="Vignettes de navigation"
      >
        {shuffledImages.slice(0, 10).map((img, idx) => (
          <motion.button
            key={idx}
            type="button"
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Photo ${idx + 1} : ${getAltText(img).split(' ').slice(5, 9).join(' ')}`}
            aria-pressed={idx === currentIndex}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 focus-ring ${
              idx === currentIndex
                ? 'ring-3 ring-ocean-teal shadow-lg shadow-ocean-teal/50'
                : 'opacity-50 hover:opacity-100 ring-1 ring-white/10 hover:ring-white/30'
            }`}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {idx === currentIndex && (
              <motion.div
                layoutId="thumbnail-active"
                className="absolute inset-0 bg-gradient-to-t from-ocean-teal/40 to-transparent"
                aria-hidden="true"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;
