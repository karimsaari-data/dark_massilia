import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Film, Camera, Video, Instagram, Mail, Menu, X as XIcon, BookOpen, Share2, MapPin, Navigation } from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';
import useFocusTrap from '../../hooks/useFocusTrap';

const iconMap = {
  Home,
  Compass,
  Film,
  Camera,
  Video,
  Instagram,
  BookOpen,
  Share2,
  Mail,
  MapPin,
  Navigation,
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef(null);

  // Focus trap pour le menu mobile
  const menuPanelRef = useFocusTrap(isMobileMenuOpen);

  // Scroll listener throttlé avec requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Fermer le menu au touche Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Bloquer le scroll de la page quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  const navVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        aria-label="Navigation principale"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-strong shadow-lg shadow-black/20'
            : 'bg-black/60 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="group" aria-label="Karim Saari — Accueil">
              <div className="text-left">
                <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-ocean-teal transition-colors duration-300 block tracking-tight">
                  Karim Saari
                </span>
                <div className="text-xs md:text-sm text-gray-400 uppercase tracking-widest leading-tight" style={{ letterSpacing: '0.15em' }}>
                  <p className="mb-0">Sentinelle des Calanques</p>
                  <p>Photographe de paysages</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation — 6 items max, pages secondaires en mobile uniquement */}
            <div className="hidden md:flex items-center gap-3 flex-1 justify-end ml-4">
              {NAV_LINKS.filter(link => !link.mobileOnly).map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center px-3 py-1.5 rounded-full transition-all duration-300 relative whitespace-nowrap flex-shrink-0 text-sm focus-ring ${
                      isActive
                        ? 'bg-ocean-teal/20 text-ocean-teal border border-ocean-teal/30 shadow-lg shadow-ocean-teal/20'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="font-medium">{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-ocean-teal rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={menuButtonRef}
              onClick={openMobileMenu}
              className="md:hidden p-2 rounded-lg glass hover:bg-white/10 transition-colors focus-ring"
              aria-label="Ouvrir le menu de navigation"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-panel"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop — cliquable pour fermer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Menu Panel — dialog modal */}
            <motion.div
              ref={menuPanelRef}
              id="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="fixed top-0 right-0 bottom-0 w-64 glass-strong z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={closeMobileMenu}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors focus-ring"
                  aria-label="Fermer le menu"
                >
                  <XIcon className="w-6 h-6" aria-hidden="true" />
                </button>

                {/* Logo */}
                <div className="mb-8 mt-4">
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>Karim Saari</h2>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Photographe / Sentinelle des Calanques</p>
                </div>

                {/* Navigation Links */}
                <nav aria-label="Menu principal">
                  <ul className="space-y-2 list-none p-0 m-0">
                    {NAV_LINKS.map((link) => {
                      const Icon = iconMap[link.icon];
                      const isActive = location.pathname === link.path;

                      return (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 relative focus-ring ${
                              isActive
                                ? 'bg-ocean-teal/20 text-ocean-teal border border-ocean-teal/30 shadow-lg shadow-ocean-teal/20'
                                : 'text-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                            <span className="font-medium">{link.name}</span>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-ocean-teal rounded-r-full" aria-hidden="true" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Social Links in Mobile Menu */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-3" id="social-links-label">
                    Suivez-nous
                  </p>
                  <div className="flex flex-wrap gap-2" aria-labelledby="social-links-label">
                    <a
                      href="https://www.instagram.com/karimsaari"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram de Karim Saari (ouvre dans un nouvel onglet)"
                      className="px-3 py-1.5 text-xs glass rounded-full hover:bg-ocean-teal/20 hover:border-ocean-teal/30 transition-all focus-ring"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://www.tiktok.com/@dark.massilia"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok Dark Massilia (ouvre dans un nouvel onglet)"
                      className="px-3 py-1.5 text-xs glass rounded-full hover:bg-ocean-teal/20 hover:border-ocean-teal/30 transition-all focus-ring"
                    >
                      TikTok
                    </a>
                    <a
                      href="https://www.youtube.com/@dark.massilia"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube Dark Massilia (ouvre dans un nouvel onglet)"
                      className="px-3 py-1.5 text-xs glass rounded-full hover:bg-ocean-teal/20 hover:border-ocean-teal/30 transition-all focus-ring"
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
