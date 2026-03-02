import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useFocusTrap from '../../hooks/useFocusTrap';

const VideoModal = ({ isOpen, onClose, embedUrl, title }) => {
  const closeBtnRef = useRef(null);
  const titleId = 'video-modal-title';

  // Piège de focus dans la modale
  const modalRef = useFocusTrap(isOpen);

  // Escape key + scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus sur le bouton fermer à l'ouverture
  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      // Léger délai pour laisser l'animation d'entrée démarrer
      const timer = setTimeout(() => closeBtnRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // SSR guard — document n'existe pas côté serveur
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" aria-hidden="true" />

          {/* Modal — dialog accessible */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Titre sr-only pour les lecteurs d'écran */}
            <span id={titleId} className="sr-only">
              {title ? `Vidéo : ${title}` : 'Lecteur vidéo'}
            </span>

            {/* Close Button */}
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="absolute -top-11 right-0 flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm focus-ring rounded"
              aria-label={title ? `Fermer la vidéo : ${title}` : 'Fermer'}
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Fermer
            </button>

            {/* Video */}
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={embedUrl}
                title={title || 'Lecteur vidéo'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {title && (
              <p className="mt-3 text-white/70 text-center text-sm font-medium" aria-hidden="true">
                {title}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default VideoModal;
