import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight, Waves, TreePine } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

const merIds = [2, 4, 6, 10, 11, 12, 13, 14, 20, 22, 23, 30, 32, 33, 35, 39, 44, 45, 46, 47, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82];
const terreIds = [1, 3, 5, 7, 8, 9, 15, 16, 17, 18, 19, 21, 24, 25, 26, 27, 28, 29, 31, 34, 36, 37, 38, 40, 41, 42, 43, 48, 49, 53];

const merImages = merIds.map((id, index) => ({
  uid: `mer-${id}`,
  src: `/images/portfolio/Mer/${id}.webp`,
  alt: `Photo mer Karim Saari – Calanques de Marseille ${index + 1}`,
}));

const terreImages = terreIds.map((id, index) => ({
  uid: `terre-${id}`,
  src: `/images/portfolio/Terre/${id}.webp`,
  alt: `Photo paysage Karim Saari – Provence ${index + 1}`,
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
      <div className="container-custom">

        {/* Header */}
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
