import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import useFocusTrap from '../hooks/useFocusTrap';

const allImagePaths = [
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
];

const getAltText = (src) => {
  const filename = src.split('/').pop().replace('.webp', '');
  const descriptor = filename
    .replace('Marseille-dark-massilia-plastique-pollution-projet-sentinelle-', '')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ');
  const cap = descriptor.charAt(0).toUpperCase() + descriptor.slice(1);
  return `Mission Projet Sentinelle Marseille — ${cap} — © Karim Saari, photographe sous-marin Marseille`;
};

const baseImages = allImagePaths.map((src, i) => ({
  uid: `sentinelle-${i}`,
  src,
  alt: getAltText(src),
}));

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

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

const PhotoSousMarine = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const closeBtnRef = useRef(null);
  const [images, setImages] = useState(baseImages);

  const lightboxRef = useFocusTrap(isLightboxOpen);

  // Shuffle côté client uniquement (après hydration SSR)
  useEffect(() => {
    setImages(shuffle(baseImages));
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
      const currentIndex = images.findIndex(img => img.uid === current.uid);
      const newIndex = direction === 'next'
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;
      return images[newIndex];
    });
  }, [images]);

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
        case 'Escape': closeLightbox(); break;
        case 'ArrowRight': navigateImage('next'); break;
        case 'ArrowLeft': navigateImage('prev'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, closeLightbox, navigateImage]);

  const currentIndex = selectedImage
    ? images.findIndex(img => img.uid === selectedImage.uid) + 1
    : 0;

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/photographie-sous-marine']} />
      <div className="container-custom">

        {/* H1 SEO */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl font-bold text-white text-center mb-8 leading-tight"
        >
          Photographe sous-marin à Marseille — Documenter pour alerter
        </motion.h1>

        {/* Bloc éditorial — "documenter pour alerter" */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              La photographie sous-marine au service de l'engagement
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Depuis 10 ans, Karim Saari plonge en apnée dans les Calanques de Marseille avec un
                double objectif : extraire les déchets des fonds marins et les{' '}
                <strong className="text-white">documenter par la photographie sous-marine</strong>.
                Chaque image est un témoignage direct, capturé entre 0 et 20 mètres de profondeur,
                là où personne ne voit ce que la mer cache.
              </p>
              <p>
                Ce travail de{' '}
                <strong className="text-ocean-teal">photographie sous-marine engagée</strong> est
                indissociable des missions de dépollution&nbsp;: les images servent à alerter le
                grand public, à convaincre les partenaires institutionnels et à nourrir les médias
                — ARTE, M6, France Télévisions, La Provence, Fondation de la Mer et bien d'autres — qui ont relayé ces actions sur
                le terrain.
              </p>
              <p>
                La galerie ci-dessous retrace les moments clés de l'
                <strong className="text-white">Opération Sentinelle</strong> à travers le regard
                du{' '}
                <strong className="text-white">photographe sous-marin</strong>&nbsp;:
                fonds marins pollués, vie marine des Calanques, apnéistes en action, déchets remontés
                des profondeurs.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Galerie mur d'images */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16"
        >
          <PhotoGrid images={images} onOpenLightbox={openLightbox} />
        </motion.div>

        {/* Bloc éditorial bas — contexte SEO */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Photographie sous-marine en apnée — une galerie documentaire
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Ce qui distingue ces images : elles sont toutes prises en{' '}
                <strong className="text-white">apnée</strong>, en rétention de souffle —
                contrairement à la majorité des photographes sous-marins qui travaillent en bouteille.
                Chaque photo a été prise en conditions réelles de mission, avec le matériel de
                dépollution dans les mains, au milieu des déchets, entre 0 et 20 mètres de profondeur.
              </p>
              <p>
                Cette galerie rassemble des images de missions{' '}
                <strong className="text-white">Team Oxygen</strong> et de l'
                <strong className="text-white">Opération Sentinelle</strong>, et s'enrichit au fil
                des éditions. Les sujets couverts vont de la{' '}
                <strong className="text-ocean-teal">pollution plastique sous-marine</strong> aux{' '}
                <strong className="text-white">espèces marines des Calanques</strong>
                &nbsp;: poulpes, spirographes, méduses, fonds rocheux. Des images qui montrent à la
                fois l'urgence et la beauté de ce qui reste à protéger.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Maillage interne */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            to="/depollution-marine"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Découvrir les missions de dépollution</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            to="/photographie-paysage-mer"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span>Galerie paysages & littoral</span>
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
            aria-labelledby="lightbox-counter-sm"
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
              id="lightbox-counter-sm"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm"
              aria-live="polite"
              aria-atomic="true"
            >
              {currentIndex} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoSousMarine;
