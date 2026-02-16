import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

// Import all portfolio images (1.jpg to 54.jpg)
const portfolioImages = Array.from({ length: 54 }, (_, i) => ({
  id: i + 1,
  src: `/images/portfolio/${i + 1}.jpg`,
  alt: `Photo sous-marine Karim Saari – Calanques de Marseille ${i + 1}`
}));

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
      const currentIndex = portfolioImages.findIndex(img => img.id === current.id);
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % portfolioImages.length;
      } else {
        newIndex = (currentIndex - 1 + portfolioImages.length) % portfolioImages.length;
      }
      return portfolioImages[newIndex];
    });
  }, []);

  // Focus trap : déplacer le focus dans la lightbox à l'ouverture
  useEffect(() => {
    if (isLightboxOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [isLightboxOpen]);

  // Navigation clavier : flèches + Escape
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

  return (
    <div className="min-h-screen py-24">
      <div className="container-custom">
        {/* Header avec lien */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="text-center mb-6">
            <a
              href="https://500px.com/p/karimsaari?view=photos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-lg font-medium"
            >
              Voir sur 500px
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        >
          {portfolioImages.map((image, index) => (
            <motion.div
              key={image.id}
              variants={FADE_IN_UP}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl"
              onClick={() => openLightbox(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                loading={index < 4 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
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
            aria-label={`Photo ${selectedImage.id} sur ${portfolioImages.length}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              ref={closeBtnRef}
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-60 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label="Fermer la galerie"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 z-60 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 z-60 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.img
              key={selectedImage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm">
              {selectedImage.id} / {portfolioImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Photos;
