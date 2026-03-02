import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieBanner from '../CookieBanner';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Retour en haut de page"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-ocean-teal/90 hover:bg-ocean-teal border border-ocean-teal/50 shadow-lg shadow-ocean-teal/20 flex items-center justify-center transition-colors duration-200"
        >
          <ChevronUp className="w-5 h-5 text-black" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link — accessibilité clavier / lecteurs d'écran (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-ocean-teal focus:text-black focus:font-semibold focus:shadow-lg"
      >
        Aller au contenu principal
      </a>
      {/* Fixed background image - Calanques de Marseille */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Background image with parallax effect */}
        <div className="absolute inset-0 bg-hero-ocean" />

        {/* Overlay sombre pour lisibilité du contenu */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-abyss/95" />

        {/* Gradient radial pour effet de profondeur */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 0%, rgba(33, 196, 123, 0.15), transparent 50%),
              radial-gradient(circle at 90% 100%, rgba(0, 145, 255, 0.15), transparent 50%)
            `,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main id="main-content" className="flex-grow pt-16 md:pt-20">
          <Outlet />
        </main>
        <Footer />
        <CookieBanner />
      </div>

      {/* Bouton retour en haut */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
