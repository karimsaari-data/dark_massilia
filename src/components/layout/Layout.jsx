import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
          className="fixed bottom-28 right-4 md:bottom-6 md:right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-astroide/20 hover:border-astroide/50 shadow-lg shadow-black/30 group"
        >
          <ChevronUp className="w-5 h-5 text-white/70 group-hover:text-astroide transition-colors duration-300" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
};

const Layout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Schema Person géré page par page via SEO_PAGES dans seo.js */}
      {/* Skip link — accessibilité clavier / lecteurs d'écran (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-ocean-teal focus:text-black focus:font-semibold focus:shadow-lg"
      >
        Aller au contenu principal
      </a>
      {/* Fixed background image - Calanques de Marseille */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Background image — décoratif, pas de role="img" (évite candidature LCP parasite) */}
        <div className="absolute inset-0 bg-hero-ocean" aria-hidden="true" />

        {/* ── Overlays Premium — 3 couches pour laisser l'image respirer ── */}

        {/* Couche 1 : Voile haut — lisibilité navbar uniquement */}
        <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />

        {/* Couche 2 : Voile bas — lisibilité du texte Hero */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-abyss via-abyss/65 to-transparent pointer-events-none" />

        {/* Couche 3 : Radial center + accents chromatiques — profondeur & identité */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 70% 60% at 60% 38%, rgba(0,0,0,0.18) 0%, transparent 100%),
              radial-gradient(circle at 8% 0%, rgba(0, 171, 168, 0.10), transparent 42%),
              radial-gradient(circle at 92% 98%, rgba(0, 145, 255, 0.10), transparent 42%)
            `,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main id="main-content" className="flex-grow pt-[var(--navbar-h)] md:pt-[var(--navbar-h-md)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
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
