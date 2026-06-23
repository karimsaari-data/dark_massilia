import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Compass, Film, Camera, Video, Mail, Send,
  Menu, X as XIcon, BookOpen, Share2, MapPin, Navigation,
  ChevronDown, Newspaper, Instagram, Facebook, BarChart2, Tv, AtSign, Users,
} from 'lucide-react';
import { NAV_LINKS, SOCIAL_LINKS, FACEBOOK_GROUP_MEMBERS } from '../../utils/constants';
import useFocusTrap from '../../hooks/useFocusTrap';

/* ─── Custom icons (Lucide n'a pas TikTok / X) ──────────── */
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const XTwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Px500Icon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm0 2.4c-3.977 0-7.2 3.223-7.2 7.2s3.223 7.2 7.2 7.2 7.2-3.223 7.2-7.2-3.223-7.2-7.2-7.2zm0 2.4c2.651 0 4.8 2.149 4.8 4.8S14.651 16.8 12 16.8 7.2 14.651 7.2 12s2.149-4.8 4.8-4.8zm0 2.4c-1.326 0-2.4 1.074-2.4 2.4s1.074 2.4 2.4 2.4 2.4-1.074 2.4-2.4-1.074-2.4-2.4-2.4z"/>
  </svg>
);

/* ─── Icônes réseaux sociaux navbar ─────────────────────── */
const NAV_SOCIALS = [
  { Icon: Send,        href: '/#newsletter',                             label: 'Newsletter',                               anchor: true },
  { Icon: Instagram,   href: 'https://www.instagram.com/karimsaari',    label: 'Instagram Karim Saari' },
  { Icon: TikTokIcon,  href: 'https://www.tiktok.com/@dark.massilia',   label: 'TikTok Dark Massilia' },
  { Icon: XTwitterIcon,href: 'https://x.com/dark_massilia',            label: 'X Dark Massilia' },
  { Icon: Facebook,    href: 'https://www.facebook.com/Photographie.Marseille', label: 'Page Facebook Karim Saari - Dark Massilia' },
  { Icon: Px500Icon,   href: SOCIAL_LINKS.px500,                       label: '500px Karim Saari' },
];

/* ─── Icon map pour les dropdowns ───────────────────────── */
const iconMap = {
  Compass, Film, Camera, Video, Mail, Send, BookOpen, Share2, MapPin, Navigation, Newspaper, BarChart2, Tv, AtSign, Users,
};

/* ─── Desktop mega menu ──────────────────────────────────── */
const NavDropdown = ({ item }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const pathMatches = (childPath) => {
    if (!childPath || childPath.startsWith('/#') || childPath.startsWith('https')) return false;
    return location.pathname === childPath || location.pathname.startsWith(childPath + '/');
  };
  const isActive = item.children?.some(c => pathMatches(c.path));
  const HeaderIcon = iconMap[item.icon];

  const openMenu  = () => { clearTimeout(timerRef.current); setOpen(true); };
  const closeMenu = () => { timerRef.current = setTimeout(() => setOpen(false), 150); };

  useEffect(() => () => clearTimeout(timerRef.current), []);
  useEffect(() => { setOpen(false); }, [location]);

  const handleChildClick = (path) => {
    setOpen(false);
    if (path.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const id = path.slice(2);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
    }
  };

  const megaVariants = {
    hidden:  { opacity: 0, y: -6, scale: 0.98 },
    visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.2, ease: 'easeOut' } },
    exit:    { opacity: 0, y: -4, scale: 0.98,  transition: { duration: 0.15, ease: 'easeIn' } },
  };

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      {/* Trigger */}
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 text-[14px] lg:text-[15px] font-extrabold tracking-[0.15em] uppercase font-display focus-ring whitespace-nowrap relative group ${
          isActive
            ? 'text-astroide bg-astroide/10 ring-1 ring-astroide/20'
            : 'text-white hover:text-astroide hover:bg-white/5'
        }`}
      >
        {t(`nav.${item.key}.name`, item.name)}
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ${
          isActive ? 'bg-astroide scale-x-100' : 'bg-astroide scale-x-0 group-hover:scale-x-100 origin-left'
        }`} aria-hidden="true" />
      </button>

      {/* Mega menu panel — pleine largeur */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden" animate="visible" exit="exit"
            variants={megaVariants}
            className="fixed left-1/2 -translate-x-1/2 z-60 w-full max-w-2xl px-4"
            style={{ top: 'var(--navbar-h-md)' }}
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 flex">

              {/* Colonne gauche — dark abyss */}
              <div className="w-64 flex-shrink-0 p-8 flex flex-col gap-4" style={{ background: 'rgba(4,14,28,0.98)' }}>
                <div className="flex gap-3 items-start">
                  <div className="w-1 self-stretch rounded-full bg-astroide flex-shrink-0 mt-1" aria-hidden="true" />
                  <p className="font-anton text-4xl leading-none uppercase text-white">{t(`nav.${item.key}.title`, item.dropdownTitle ?? item.name)}</p>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">{t(`nav.${item.key}.desc`, item.description)}</p>
                <div className="mt-auto">
                  <div className="h-px mb-3 bg-white/10" />
                  <p className="text-xs uppercase tracking-widest text-gray-600">Karim Saari</p>
                </div>
              </div>

              {/* Colonne droite — dark ocean */}
              <div className="flex-1 p-6 flex flex-col justify-center gap-2" style={{ background: 'rgba(11,28,45,0.97)' }}>
                {(() => {
                  const hub = item.children.find(c => c.isHub);
                  const rest = item.children.filter(c => !c.isHub);

                  const renderBtn = (child, extraClass = '') => {
                    const Icon = iconMap[child.icon];
                    const childActive = location.pathname === child.path ||
                      (child.path && !child.path.startsWith('/#') && !child.path.startsWith('https') && location.pathname.startsWith(child.path + '/'));
                    const cls = `w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm transition-all duration-150 text-left focus-ring group/link ${
                      childActive ? 'text-astroide bg-white/10' : 'text-gray-200 hover:text-astroide hover:bg-white/10'
                    } ${extraClass}`;
                    const inner = (
                      <>
                        {Icon && <Icon className={`w-4 h-4 flex-shrink-0 ${childActive ? 'text-astroide' : 'text-gray-500 group-hover/link:text-astroide'}`} aria-hidden="true" />}
                        <span className="font-semibold">{t(`nav.${item.key}.${child.key}.name`, child.name)}</span>
                        {childActive && <div className="ml-auto w-2 h-2 rounded-full bg-astroide flex-shrink-0" aria-hidden="true" />}
                      </>
                    );
                    if (child.path?.startsWith('https://')) return <a href={child.path} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
                    if (child.path?.startsWith('mailto:')) return <a href={child.path} className={cls}>{inner}</a>;
                    if (child.path?.startsWith('/#')) return <Link to={child.path} onClick={() => setOpen(false)} className={cls}>{inner}</Link>;
                    return <button onClick={() => handleChildClick(child.path)} className={cls}>{inner}</button>;
                  };

                  return (
                    <ul className="list-none m-0 p-0 w-full space-y-1">
                      {hub && (
                        <li className="mb-2">
                          <button
                            onClick={() => handleChildClick(hub.path)}
                            className={`w-full text-left rounded-xl border px-4 py-3 transition-all duration-150 group/hub focus-ring ${
                              location.pathname === hub.path
                                ? 'border-astroide bg-astroide/10'
                                : 'border-astroide/30 bg-astroide/5 hover:border-astroide hover:bg-astroide/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-bold text-sm ${location.pathname === hub.path ? 'text-astroide' : 'text-gray-100 group-hover/hub:text-astroide'}`}>
                                {t(`nav.${item.key}.${hub.key}.name`, hub.name)}
                              </span>
                              <span className={`text-xs font-semibold transition-colors ${location.pathname === hub.path ? 'text-astroide' : 'text-gray-400 group-hover/hub:text-astroide'}`}>
                                {t('nav.see')}
                              </span>
                            </div>
                            {hub.hubDesc && (
                              <p className="text-xs text-gray-400 mt-0.5">{t(`nav.${item.key}.${hub.key}.hubDesc`, { count: FACEBOOK_GROUP_MEMBERS.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR'), defaultValue: hub.hubDesc })}</p>
                            )}
                          </button>
                        </li>
                      )}
                      {rest.map(child => (
                        <li key={child.path ?? child.name} className={child.sub ? 'pl-8 border-l-2 border-white/10' : 'pl-3 border-l-2 border-white/15'}>
                          {renderBtn(child, child.sub ? 'text-xs py-2.5' : '')}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Mobile accordion item ─────────────────────────────── */
const MobileNavItem = ({ item, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const pathMatches = (childPath) => {
    if (!childPath || childPath.startsWith('/#') || childPath.startsWith('https')) return false;
    return location.pathname === childPath || location.pathname.startsWith(childPath + '/');
  };
  const isActive = item.children?.some(c => pathMatches(c.path));

  const handleChildClick = (path) => {
    onClose();
    if (path.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const id = path.slice(2);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
    }
  };

  const Icon = iconMap[item.icon];

  return (
    <li>
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 focus-ring ${
          isActive
            ? 'bg-astroide/20 text-astroide border border-astroide/30'
            : 'text-text-secondary hover:text-astroide hover:bg-astroide/10'
        }`}
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />}
          <span className="font-medium">{t(`nav.${item.key}.name`, item.name)}</span>
        </span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden list-none m-0 p-0 ml-4 mt-1 space-y-0.5"
          >
            {item.children.map((child) => {
              const ChildIcon = iconMap[child.icon];
              const childActive = location.pathname === child.path ||
                (child.path && !child.path.startsWith('/#') && !child.path.startsWith('https') && location.pathname.startsWith(child.path + '/'));
              return (
                <li key={child.path ?? child.name} className={child.sub ? 'ml-4 border-l border-gray-600/40 pl-2' : ''}>
                  {child.path?.startsWith('mailto:') ? (
                    <a
                      href={child.path}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-left focus-ring relative text-text-muted hover:text-astroide hover:bg-astroide/10`}
                      onClick={onClose}
                    >
                      {ChildIcon && <ChildIcon className={`flex-shrink-0 ${child.sub ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} aria-hidden="true" />}
                      <span className={`font-medium ${child.sub ? 'text-xs' : 'text-sm'}`}>{t(`nav.${item.key}.${child.key}.name`, child.name)}</span>
                    </a>
                  ) : (
                  <button
                    onClick={() => handleChildClick(child.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-left focus-ring relative ${
                      childActive
                        ? 'bg-astroide/15 text-astroide border border-astroide/20'
                        : 'text-text-muted hover:text-astroide hover:bg-astroide/10'
                    }`}
                  >
                    {ChildIcon && <ChildIcon className={`flex-shrink-0 ${child.sub ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} aria-hidden="true" />}
                    <span className={`font-medium ${child.sub ? 'text-xs' : 'text-sm'}`}>{t(`nav.${item.key}.${child.key}.name`, child.name)}</span>
                    {childActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/4 bg-ocean-teal rounded-r-full" aria-hidden="true" />
                    )}
                  </button>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

/* ─── Main Navbar ────────────────────────────────────────── */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden]     = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const menuButtonRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const switchLang = () => {
    if (isEn) {
      const newPath = location.pathname.startsWith('/en')
        ? location.pathname.slice(3) || '/'
        : '/';
      navigate(newPath + location.search + location.hash);
    } else {
      navigate('/en' + location.pathname + location.search + location.hash);
    }
  };

  const menuPanelRef = useFocusTrap(isMobileMenuOpen);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta    = currentY - lastScrollY.current;

          setIsScrolled(currentY > 60);

          if (currentY < 80) {
            // Tout en haut → toujours visible
            setIsHidden(false);
          } else if (delta > 6) {
            // Scroll vers le bas → on cache
            setIsHidden(true);
          } else if (delta < -6) {
            // Scroll vers le haut → on montre
            setIsHidden(false);
          }

          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

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

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const openMobileMenu  = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const navVariants = {
    hidden:  { y: '-100%' },
    visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, x: '100%', transition: { duration: 0.3, ease: 'easeInOut' } },
    open:   { opacity: 1, x: 0,      transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <>
      <motion.nav
        initial={{ y: '-100%' }}
        animate={{ y: isHidden ? '-100%' : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        aria-label={t('nav.aria_main')}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isScrolled
            ? 'bg-[#0a142c]/95 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/40'
            : 'bg-gradient-to-b from-[#0a142c]/88 via-[#0a142c]/50 to-transparent backdrop-blur-sm'
        }`}
      >
        <div className="container-custom">
          {/* Layout 3 colonnes : Logo | Nav centré | Réseaux sociaux */}
          <div className="flex items-center h-[70px] md:h-[128px] gap-4">

            {/* Colonne 1 — Logo */}
            <div className="flex-shrink-0">
              <Link
                to={isEn ? '/en' : '/'}
                className="group flex items-center"
                aria-label={isEn ? 'Karim Saari — Calanques Sentinel — Home' : 'Karim Saari — Sentinelle des Calanques — Accueil'}
              >
                <img
                  src="/assets/Karim SAARI WHITE.svg"
                  alt="Karim Saari - Photographe Marseille"
                  width="1138"
                  height="506"
                  className="logo-fade-in h-[62px] md:h-[140px] lg:h-[160px] w-auto group-hover:opacity-100 transition-opacity duration-300" style={{ filter: 'brightness(0) invert(1)' }}
                  loading="eager"
                  decoding="async"
                />
              </Link>
            </div>

            {/* Colonne 2 — Nav dropdowns (centré) */}
            <nav aria-label={t('nav.aria_main')} className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-8">
              {NAV_LINKS.map((item) => (
                <NavDropdown key={item.name} item={item} />
              ))}
            </nav>

            {/* Colonne 3 — Icônes sociales (desktop) + Burger (mobile) */}
            <div className="flex-shrink-0 flex items-center gap-1.5 lg:gap-2 ml-auto">
              {/* Réseaux — desktop uniquement */}
              <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
                {NAV_SOCIALS.map(({ Icon, href, label, anchor }) => {
                  const iconClass = "w-10 h-10 lg:w-11 lg:h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-astroide/50 hover:bg-astroide/10 transition-all duration-300 group";
                  const inner = <Icon className="w-[20px] h-[20px] text-white/80 group-hover:text-astroide transition-colors" />;
                  if (anchor) {
                    return (
                      <Link key={label} to={href} aria-label={label} className={iconClass}>
                        {inner}
                      </Link>
                    );
                  }
                  return (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${t('common.open_tab')}`} className={iconClass}>
                      {inner}
                    </a>
                  );
                })}
              </div>

              {/* Language switcher */}
              <button
                onClick={switchLang}
                className="text-[11px] font-bold tracking-widest text-white/60 hover:text-white border border-white/20 hover:border-white/50 rounded px-2 py-1 transition-all duration-200 uppercase"
                aria-label={isEn ? 'Passer en français' : 'Switch to English'}
              >
                {isEn ? 'FR' : 'EN'}
              </button>

              {/* Burger — mobile uniquement */}
              <button
                ref={menuButtonRef}
                onClick={openMobileMenu}
                className="md:hidden p-2 rounded-lg glass hover:bg-white/10 transition-colors focus-ring"
                aria-label={t('nav.aria_open')}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu-panel"
              >
                <Menu className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            <motion.div
              ref={menuPanelRef}
              id="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label={t('nav.aria_mobile')}
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="fixed top-0 right-0 bottom-0 w-72 glass-strong z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <button
                  onClick={closeMobileMenu}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors focus-ring"
                  aria-label={t('nav.aria_close')}
                >
                  <XIcon className="w-6 h-6" aria-hidden="true" />
                </button>

                <div className="mb-8 mt-4">
                  <h2 className="text-xl font-bold text-white">Karim Saari</h2>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{t('nav.mobile_subtitle')}</p>
                </div>

                <nav aria-label={t('nav.aria_main')}>
                  <ul className="space-y-1 list-none p-0 m-0">
                    {NAV_LINKS.map((item) => (
                      <MobileNavItem key={item.name} item={item} onClose={closeMobileMenu} />
                    ))}
                  </ul>
                </nav>

                {/* Language switcher — menu mobile */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => { switchLang(); closeMobileMenu(); }}
                    className="w-full text-center text-sm font-semibold tracking-widest uppercase py-2 rounded-lg border border-white/20 hover:border-astroide/50 hover:bg-astroide/10 text-white/70 hover:text-white transition-all duration-200"
                  >
                    {isEn ? '🇫🇷 Français' : '🇬🇧 English'}
                  </button>
                </div>

                {/* Réseaux sociaux — menu mobile */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-3" id="social-links-label">
                    {t('nav.follow_us')}
                  </p>
                  <div className="flex flex-wrap gap-2" aria-labelledby="social-links-label">
                    {NAV_SOCIALS.map(({ Icon, href, label, anchor }) => {
                      const iconClass = "w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-astroide/50 hover:bg-astroide/10 transition-all duration-300 group";
                      const inner = <Icon className="w-5 h-5 text-gray-400 group-hover:text-astroide transition-colors" />;
                      if (anchor) {
                        return (
                          <Link
                            key={label}
                            to={href}
                            aria-label={label}
                            className={iconClass}
                            onClick={closeMobileMenu}
                          >
                            {inner}
                          </Link>
                        );
                      }
                      return (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${t('common.open_tab')}`} className={iconClass}>
                          {inner}
                        </a>
                      );
                    })}
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
