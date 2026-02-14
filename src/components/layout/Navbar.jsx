import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Film, Mail, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';

const iconMap = {
  Home,
  Compass,
  Film,
  Mail,
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-strong shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center glow-teal group-hover:glow-blue transition-all duration-300">
                  <span className="text-white font-bold text-lg md:text-xl">D</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text">
                  Dark Massilia
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Sentinelle de la Mer</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {NAV_LINKS.map((link) => {
                const Icon = iconMap[link.icon];
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-ocean-teal/20 text-ocean-teal border border-ocean-teal/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg glass hover:bg-white/10 transition-colors focus-ring"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="fixed top-0 right-0 bottom-0 w-64 glass-strong z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Logo */}
                <div className="mb-8 mt-4">
                  <h2 className="text-xl font-bold gradient-text">Dark Massilia</h2>
                  <p className="text-sm text-gray-400 mt-1">Sentinelle de la Mer</p>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {NAV_LINKS.map((link) => {
                    const Icon = iconMap[link.icon];
                    const isActive = location.pathname === link.path;

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-ocean-teal/20 text-ocean-teal border border-ocean-teal/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Social Links in Mobile Menu */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                    Suivez-nous
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://www.instagram.com/karimsaari"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs glass rounded-full hover:bg-ocean-teal/20 hover:border-ocean-teal/30 transition-all"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://www.tiktok.com/@dark.massilia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs glass rounded-full hover:bg-ocean-teal/20 hover:border-ocean-teal/30 transition-all"
                    >
                      TikTok
                    </a>
                    <a
                      href="https://www.youtube.com/@dark.massilia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs glass rounded-full hover:bg-ocean-teal/20 hover:border-ocean-teal/30 transition-all"
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
