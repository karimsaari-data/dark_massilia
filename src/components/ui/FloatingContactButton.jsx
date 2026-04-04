import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Phone } from 'lucide-react';
import { APP_CONFIG } from '../../utils/constants';
import { trackEvent } from '../../lib/analytics';

const FloatingContactButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Afficher après 300px de scroll
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu à la touche Escape
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-40"
        >
          {/* Menu étendu */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                role="menu"
                aria-label="Menu de contact"
                className="absolute bottom-16 right-0 mb-2 space-y-2"
              >
                {/* Email */}
                <motion.a
                  href={`mailto:${APP_CONFIG.contactEmail}`}
                  role="menuitem"
                  onClick={() => { setIsExpanded(false); trackEvent('contact_click', { method: 'email', source: 'floating_button' }); }}
                  className="flex items-center gap-3 glass-strong rounded-full pl-4 pr-5 py-3 hover:bg-ocean-teal/20 hover:border-ocean-teal/30 transition-all duration-300 group whitespace-nowrap"
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center group-hover:shadow-lg group-hover:shadow-ocean-teal/50 transition-all" aria-hidden="true">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">Email</span>
                </motion.a>

                {/* WhatsApp */}
                <motion.a
                  href={`https://wa.me/${APP_CONFIG.contactWhatsApp.replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Contacter par WhatsApp (ouvre dans un nouvel onglet)"
                  onClick={() => { setIsExpanded(false); trackEvent('contact_click', { method: 'whatsapp', source: 'floating_button' }); }}
                  className="flex items-center gap-3 glass-strong rounded-full pl-4 pr-5 py-3 hover:bg-ocean-blue/20 hover:border-ocean-blue/30 transition-all duration-300 group whitespace-nowrap"
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-blue to-ocean-teal flex items-center justify-center group-hover:shadow-lg group-hover:shadow-ocean-blue/50 transition-all" aria-hidden="true">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">WhatsApp</span>
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton principal */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
              isExpanded
                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30'
                : 'bg-gradient-to-br from-ocean-teal to-ocean-blue shadow-lg shadow-ocean-teal/30'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isExpanded ? 'Fermer le menu de contact' : 'Ouvrir le menu de contact'}
            aria-expanded={isExpanded}
            aria-haspopup="menu"
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="mail"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  <Mail className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Pulse indicator */}
          {!isExpanded && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-ocean-teal"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingContactButton;
