import { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieBanner from '../CookieBanner';
import NewsletterPopup from '../NewsletterPopup';

function LanguageSync() {
  const { i18n } = useTranslation();
  const location = useLocation();
  useEffect(() => {
    // URL takes priority over localStorage (for direct /en/* links when server allows it)
    const urlLang = location.pathname.startsWith('/en') ? 'en' : null;
    const lang = urlLang || localStorage.getItem('dm_lang') || 'fr';
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [location.pathname, i18n]);
  return null;
}

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="spinner" />
  </div>
);

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

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
          aria-label={t('common.back_to_top')}
          className="fixed bottom-6 left-4 md:bottom-6 md:left-6 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-astroide/20 hover:border-astroide/50 shadow-lg shadow-black/30 group"
        >
          <ChevronUp className="w-5 h-5 text-white/70 group-hover:text-astroide transition-colors duration-300" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
};

const Layout = () => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <LanguageSync />
      {/* Schema Person géré page par page via SEO_PAGES dans seo.js */}
      {/* Skip link — accessibilité clavier / lecteurs d'écran (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-ocean-teal focus:text-black focus:font-semibold focus:shadow-lg"
      >
        {t('common.skip_content')}
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
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
        <Footer />
        <CookieBanner />
        <NewsletterPopup />
      </div>

      {/* Bouton retour en haut */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
