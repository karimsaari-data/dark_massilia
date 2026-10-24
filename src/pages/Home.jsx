import { lazy, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCardHover } from '../hooks/useCardHover';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, ChevronDown, Camera, MapPin, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FADE_IN_UP, STAGGER_CONTAINER, FACEBOOK_GROUP_MEMBERS, SOCIAL_STATS_DEFAULTS } from '../utils/constants';
import { trackEvent } from '../lib/analytics';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import FireRiskBadge from '../components/FireRiskBadge';

// Lazy-loaded — rompt la chaîne statique Home → supabase → @supabase/supabase-js
const NewsletterSection = lazy(() => import('../components/NewsletterSection'));
const RecentArticles    = lazy(() => import('../components/RecentArticles'));

import StatCounter from '../components/ui/StatCounter';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="text-white font-semibold text-base md:text-lg group-hover:text-ocean-teal transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-ocean-teal flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Contenu toujours dans le DOM pour le SEO — max-h-0 quand fermé */}
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px] mt-4' : 'max-h-0'}`}
        aria-hidden={!isOpen}
      >
        <p className="text-text-secondary leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const prefersReducedMotion = useReducedMotion();
  const cardHover = useCardHover();
  const [showScroll, setShowScroll] = useState(true);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const IMPACT_FACTS = t('home.impact_facts', { returnObjects: true });
  const FAQ_ITEMS = t('home.faq', { returnObjects: true });

  const KEY_STATS_BASE = [
    {
      end: SOCIAL_STATS_DEFAULTS.total_community,
      suffix: '',
      label: t('home.stats.community_label'),
      sub: t('home.stats.community_sub'),
      detail: t('home.stats.community_detail', { count: FACEBOOK_GROUP_MEMBERS.toLocaleString(lng === 'en' ? 'en-US' : 'fr-FR') }),
      href: '/communaute',
    },
    {
      end: 5724,
      suffix: ' kg',
      label: t('home.stats.waste_label'),
      sub: t('home.stats.waste_sub'),
      detail: t('home.stats.waste_detail'),
      href: '/depollution-marine',
    },
    {
      end: 143,
      suffix: ' M',
      label: t('home.stats.maps_label'),
      sub: t('home.stats.maps_sub'),
      detail: t('home.stats.maps_detail'),
      href: '/local-guide-marseille',
    },
    {
      key: 'impressions_500px',
      end: 800,
      suffix: ' K',
      label: t('home.stats.px500_label'),
      sub: t('home.stats.px500_sub'),
      detail: t('home.stats.px500_detail'),
    },
  ];

  // Stats réseaux — valeurs dynamiques depuis Supabase (fallback sur KEY_STATS_BASE)
  const [communityEnd, setCommunityEnd]       = useState(SOCIAL_STATS_DEFAULTS.total_community);
  const [communityDetail, setCommunityDetail] = useState('');
  const [localGuidesEnd, setLocalGuidesEnd]   = useState(143);
  const [fbGroupMembers, setFbGroupMembers]   = useState(FACEBOOK_GROUP_MEMBERS);
  const [impressions500px, setImpressions500px] = useState(800);

  useEffect(() => {
    import('../lib/supabase').then(({ supabase }) => {
      supabase
        .from('social_stats')
        .select('platform, value, note')
        .in('platform', ['total_community', 'local_guide_views_m', 'facebook_group', '500px_impressions'])
        .then(({ data }) => {
          data?.forEach(row => {
            if (row.platform === 'total_community') {
              setCommunityEnd(parseFloat(row.value));
              if (row.note) setCommunityDetail(row.note);
            } else if (row.platform === 'local_guide_views_m') {
              setLocalGuidesEnd(parseFloat(row.value));
            } else if (row.platform === 'facebook_group') {
              const v = parseFloat(row.value);
              if (v > 100) setFbGroupMembers(v);
              else setFbGroupMembers(Math.round(v * 1000));
            } else if (row.platform === '500px_impressions') {
              setImpressions500px(parseFloat(row.value));
            }
          });
        });
    });
  }, []);

  const KEY_STATS = [
    { ...KEY_STATS_BASE[0], end: communityEnd, detail: t('home.stats.community_detail', { count: fbGroupMembers.toLocaleString(lng === 'en' ? 'en-US' : 'fr-FR') }) },
    KEY_STATS_BASE[1],
    { ...KEY_STATS_BASE[2], end: localGuidesEnd },
    { ...KEY_STATS_BASE[3], end: impressions500px, href: 'https://500px.com/p/karimsaari' },
  ];

  const [factsPaused, setFactsPaused] = useState(false);
  const [factsTimerKey, setFactsTimerKey] = useState(0);

  // Auto-rotation des phrases choc — pause au hover, reset au clic
  useEffect(() => {
    if (factsPaused) return;
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % IMPACT_FACTS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [factsPaused, factsTimerKey, IMPACT_FACTS.length]);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY < 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToFact = (index) => {
    setCurrentFactIndex(index);
    setFactsTimerKey((k) => k + 1); // reset le timer
  };

  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/']} />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden">
        {/* Hero Content — layout 2 colonnes desktop, empilé mobile */}
        <div className="container-custom relative z-10 w-full px-4 pt-6 pb-16 md:pt-8 md:pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
          >
            <motion.div
              variants={{
                hidden: { y: 20 },
                visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
              }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(10, 20, 40, 0.45)',
                backdropFilter: 'blur(14px)',
                borderRadius: '24px',
                padding: 'clamp(20px, 5vw, 88px)',
                border: '2px solid rgba(0,171,168,0.55)',
                boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
              }}
            >
              {/* Fond vidéo méduses dans le cadre — désactivé si prefers-reduced-motion */}
              {!prefersReducedMotion && (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ zIndex: 0 }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster="/assets/hero-bg.webp"
                  aria-hidden="true"
                >
                  <source src="/assets/video/barracuda-hero.mp4" type="video/mp4" />
                </video>
              )}
              {/* Contenu au-dessus de la vidéo */}
              <div className="relative" style={{ zIndex: 2 }}>
              {/* Photo profil — Mobile uniquement (au-dessus du texte) */}
              <div className="flex justify-center mb-6 md:hidden">
                <motion.div
                  animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <img
                    src="/images/karim-saari-photographe-sous-marin-marseille.webp"
                    srcSet="/images/karim-saari-photographe-sous-marin-marseille_300w.webp 300w, /images/karim-saari-photographe-sous-marin-marseille_400w.webp 400w, /images/karim-saari-photographe-sous-marin-marseille.webp 640w, /images/karim-saari-photographe-sous-marin-marseille_800w.webp 800w"
                    sizes="192px"
                    alt="Karim Saari - Photographe sous-marin en action à Marseille"
                    width="640"
                    height="662"
                    className="h-48 w-auto rounded-xl border border-white/20 shadow-lg shadow-ocean-teal/20"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <Link
                    to="/oxygene-documentaire-depollution-mediterranee"
                    className="absolute bottom-1.5 right-2 text-white/60 hover:text-white/90 text-[10px] font-medium transition-colors"
                  >
                    {t('home.hero.photo_credit')}
                  </Link>
                </motion.div>
              </div>

              {/* Grille 2 colonnes desktop : texte gauche, photo droite */}
              <div className="md:grid md:grid-cols-[1fr_auto] md:gap-12 md:items-center">
                {/* Bloc texte */}
                <div className="text-center md:text-left">
                  {/* Grand cadre englobant titre + texte + compteur */}
                  <div className="rounded-xl px-5 py-5 mb-8" style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(6px)' }}>
                  {/* Trait vertical + titre */}
                  <div className="flex items-stretch gap-5 mb-5">
                    <div className="flex gap-[3px] flex-shrink-0" aria-hidden="true">
                      <motion.div
                        initial={prefersReducedMotion ? {} : { scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
                        style={{ transformOrigin: 'top' }}
                        className="w-[3px] bg-black rounded-full"
                      />
                      <motion.div
                        initial={prefersReducedMotion ? {} : { scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.65 }}
                        style={{ transformOrigin: 'top' }}
                        className="w-[3px] bg-ocean-teal rounded-full"
                      />
                    </div>
                    <h1 className="font-display text-[1.7rem] sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-[0.01em] md:tracking-[0.08em] leading-[1.15]">
                      {t('home.hero.title')}
                    </h1>
                  </div>

                  {/* Texte + compteur */}
                  <div className="">
                    <p className="font-display text-base md:text-lg font-normal text-white/90 leading-[1.85] mb-4">
                      <strong className="text-white font-semibold">{t('home.hero.subtitle')}</strong>{' '}
                      {t('home.hero.desc1')}{' '}
                      {t('home.hero.desc2')}
                    </p>
                    {/* Compteur communauté */}
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse flex-shrink-0" aria-hidden="true" />
                      <span className="text-white font-bold text-lg tabular-nums leading-none">
                        <StatCounter end={communityEnd} suffix="" />
                      </span>
                      <span className="text-white/70 text-sm font-medium">{t('home.hero.community_label')}</span>
                    </div>
                  </div>{/* fin texte+compteur */}
                  </div>{/* fin grand cadre */}

                  {/* Hero CTAs */}
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-2">
                    <a
                      href="#newsletter"
                      className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
                      onClick={() => trackEvent('cta_click', { button_name: 'cta_photo' })}
                    >
                      <Gift className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>{t('home.hero.cta_photo')}</span>
                    </a>
                    <a
                      href="#galerie"
                      className="btn-ghost inline-flex items-center gap-2 whitespace-nowrap"
                      onClick={() => trackEvent('cta_click', { button_name: 'cta_discover' })}
                    >
                      <span>{t('home.hero.cta_discover')}</span>
                      <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    </a>
                    <Link
                      to="/contact"
                      className="btn-ghost inline-flex items-center gap-2 whitespace-nowrap"
                      onClick={() => trackEvent('cta_click', { button_name: 'cta_contact' })}
                    >
                      <span>{t('home.hero.cta_contact')}</span>
                      <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                {/* Photo profil — Desktop uniquement (colonne droite) */}
                <div className="hidden md:flex items-center justify-center">
                  <motion.div
                    animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <img
                      src="/images/karim-saari-photographe-sous-marin-marseille.webp"
                      srcSet="/images/karim-saari-photographe-sous-marin-marseille_300w.webp 300w, /images/karim-saari-photographe-sous-marin-marseille_400w.webp 400w, /images/karim-saari-photographe-sous-marin-marseille.webp 640w, /images/karim-saari-photographe-sous-marin-marseille_800w.webp 800w"
                      sizes="(max-width: 1024px) 280px, 360px"
                      alt="Karim Saari - Photographe sous-marin en action à Marseille"
                      width="640"
                      height="662"
                      className="h-[380px] lg:h-[460px] w-auto rounded-xl border-2 border-black shadow-[0_0_0_1px_rgba(0,171,168,0.4),0_8px_32px_rgba(0,0,0,0.5)]"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <Link
                      to="/oxygene-documentaire-depollution-mediterranee"
                      className="absolute bottom-2 right-3 text-white/60 hover:text-white/90 text-xs font-medium transition-colors"
                    >
                      {t('home.hero.photo_credit')}
                    </Link>
                  </motion.div>
                </div>
              </div>
              </div>{/* fin wrapper z-2 */}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator — disparaît dès le premier scroll */}
        <AnimatePresence>
          {showScroll && !prefersReducedMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
              aria-hidden="true"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <ChevronDown className="w-7 h-7 text-white/40" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Section bio — identité & engagement */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          {...cardHover}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu — Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t('home.about.name')}
              </h2>
              <div className="space-y-0 text-text-secondary leading-loose text-sm md:text-[0.95rem]">

                {/* Lead */}
                <p className="text-base md:text-lg text-white/90 leading-relaxed font-light mb-6">
                  {t('home.about.desc')}
                </p>

                {/* Chapitre 1 */}
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-2 pb-1">{t('home.about.vision_title')}</p>
                {(() => {
                  const vd = t('home.about.vision_desc');
                  return (
                    <p className="mb-4">
                      <span className="float-left text-[3.2rem] leading-[0.8] font-bold text-ocean-teal mr-2 mt-1 select-none" aria-hidden="true">{vd[0]}</span>
                      {vd.slice(1)}
                    </p>
                  );
                })()}

                {/* Pull quote */}
                <blockquote className="clear-left my-5 py-4 px-5 bg-white/[0.04] border-l-2 border-ocean-teal rounded-r-lg">
                  <p className="text-white/85 italic text-base leading-snug">« {t('home.about.vision_quote')} »</p>
                </blockquote>

                {/* Chapitre 2 */}
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-3 pb-1">{t('home.about.action_title')}</p>
                <p className="mb-4">
                  {t('home.about.action_desc1')}{' '}
                  {t('home.about.action_desc2')}
                </p>
              </div>

              <div className="mt-6">
                <Link
                  to="/photographe-environnemental-marseille"
                  className="btn-primary inline-flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { button_name: 'about_learn_more' })}
                >
                  <span>{t('home.about.learn_more')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>

            {/* Image — Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique.webp"
                srcSet="/images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique_400w.webp 400w, /images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique_800w.webp 800w, /images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique_1200w.webp 1200w, /images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Karim Saari, photographe sous-marin Marseille — apnéiste en exploration subaquatique au Frioul © Karim Saari"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section className="py-10 md:py-16 relative overflow-hidden">
        {/* Fond distinct : gradient radial teal */}
        <div className="absolute inset-0 bg-gradient-to-b from-abyss via-abyss-light to-abyss pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,171,168,0.08),transparent)] pointer-events-none" />

        <div className="container-custom relative">
          {/* Titre */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_IN_UP}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t('home.stats.title')}
            </h2>
            <h3 className="sr-only">{t('home.stats.subtitle')}</h3>

          </motion.div>

          {/* Grille 4 chiffres */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {KEY_STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={FADE_IN_UP}
                whileHover={{ scale: 1.04, y: -5, transition: { type: 'spring', stiffness: 350, damping: 22 } }}
                whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                className="relative rounded-2xl border border-ocean-teal/20 bg-white/[0.04] p-6 md:p-8 text-center group hover:border-ocean-teal/50 hover:bg-white/[0.07] transition-colors duration-300 cursor-pointer"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 40px rgba(0,171,168,0.10), 0 8px 32px rgba(0,171,168,0.08)' }} />

                {/* Lien pleine carte — interne (Link) ou externe (a) */}
                {stat.href && (
                  stat.href.startsWith('http')
                    ? <a href={stat.href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 rounded-2xl z-10" aria-label={stat.label} />
                    : <Link to={stat.href} className="absolute inset-0 rounded-2xl z-10" aria-label={stat.label} />
                )}

                {/* Valeur animée — scale léger au hover via group */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-1 tabular-nums pb-1 transition-transform duration-200 group-hover:scale-110 origin-center">
                  <StatCounter
                    end={stat.end}
                    suffix={stat.suffix}
                  />
                </div>

                {/* Label principal */}
                <p className="text-sm md:text-base font-semibold text-white/90 mt-2 mb-1">
                  {stat.label}
                </p>

                {/* Sous-titre */}
                <p className="text-xs text-gray-400 leading-snug">
                  {stat.sub}
                </p>

                {/* Détail au survol (desktop) */}
                <p className="hidden md:block text-xs text-ocean-teal/70 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Badge accès massifs — signal frais quotidien + cohérence inter-pages */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_IN_UP}
            className="flex flex-col items-center mt-8 gap-2"
          >
            <p className="text-xs text-white/40 uppercase tracking-widest">{t('home.map.cta_access')}</p>
            <Link to="/acces-massifs-calanques" className="hover:opacity-80 transition-opacity" title={t('home.map.cta_access')}>
              <FireRiskBadge inline />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Card Yann Arthus-Bertrand — Les Français (image gauche) */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          {...cardHover}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            {/* Photo YAB - Gauche */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1">
              <img
                src="/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp"
                srcSet="/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_400w.webp 400w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_800w.webp 800w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_1200w.webp 1200w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Team Oxygen photographié par Yann Arthus-Bertrand — projet Les Français, Marseille 2024"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
                loading="lazy"
                decoding="async"
                width="1365"
                height="910"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              {/* Copyright watermark */}
              <p className="absolute bottom-3 right-3 text-white/40 text-xs font-medium">
                © Yann Arthus-Bertrand
              </p>
            </div>

            {/* Contenu - Droite */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2">

              {/* Badge photographe */}
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-ocean-teal/10 rounded-full border border-ocean-teal/30 w-fit">
                <Camera className="w-5 h-5 text-ocean-teal" />
                <span className="text-sm font-semibold text-ocean-teal">
                  {t('home.yab.title')}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('home.yab.subtitle')}
              </h2>

              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                {t('home.yab.desc')}
              </p>

              <Link
                to="/les-francais-yann-arthus-bertrand"
                className="btn-primary inline-flex items-center gap-2 w-fit"
              >
                <span>{t('home.yab.cta')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Derniers articles du blog — maillage interne + contenu frais */}
      <Suspense fallback={<section className="container-custom py-8 md:py-12" />}>
        <RecentArticles title={t('home.blog_title')} count={3} />
      </Suspense>

      {/* Missions Section - image droite */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          {...cardHover}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu - Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('home.missions.title')}
              </h2>
              <h3 className="sr-only">{t('home.missions.subtitle')}</h3>

              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                {t('home.missions.desc1')}{' '}
                {t('home.missions.desc2')}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/depollution-marine"
                  className="btn-primary inline-flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { button_name: 'missions_cta' })}
                >
                  <span>{t('home.missions.cta_missions')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/presse"
                  className="btn-ghost inline-flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { button_name: 'media_coverage' })}
                >
                  <span>{t('home.missions.cta_media')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Image Team Oxygen - Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp"
                srcSet="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen_400w.webp 400w, /images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen_800w.webp 800w, /images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen_1200w.webp 1200w, /images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Team Oxygen - Projet Sentinelle Marseille"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '12% 25%' }}
                loading="lazy"
                decoding="async"
              />
              {/* Overlay subtil */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Vidéos - image gauche */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          {...cardHover}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            {/* Image - Gauche */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1">
              <img
                src="/images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques.webp"
                srcSet="/images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques_400w.webp 400w, /images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques_800w.webp 800w, /images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques_1200w.webp 1200w, /images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Photographe sous-marin Marseille — apnée en grotte marine Calanques de Marseille © Karim Saari"
                width="800"
                height="534"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
            </div>

            {/* Contenu - Droite */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('home.videos.title')}
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                {t('home.videos.desc')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/videos"
                  className="btn-primary inline-flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { button_name: 'videos_cta' })}
                >
                  <span>{t('home.videos.cta')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/presse"
                  className="btn-ghost inline-flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { button_name: 'media_coverage' })}
                >
                  <span>{t('home.missions.cta_media')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Photos - image droite */}
      <section id="galerie" className="container-custom py-8 md:py-12">
        <motion.div
          {...cardHover}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu - Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('home.gallery.title')}
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                {t('home.gallery.desc1')}{' '}
                {t('home.gallery.desc2')}
              </p>
              <div className="flex flex-col gap-3 items-start">
                <Link
                  to="/photographie-paysage-mer"
                  className="btn-primary inline-flex items-center justify-between gap-2 w-auto min-w-[280px]"
                >
                  <span>{t('home.gallery.cta_landscapes')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/photographie-sous-marine"
                  className="btn-ghost inline-flex items-center justify-between gap-2 w-auto min-w-[280px]"
                >
                  <span>{t('home.gallery.cta_underwater')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/carte-photos"
                  className="btn-ghost inline-flex items-center justify-between gap-2 w-auto min-w-[280px]"
                >
                  <span>{t('home.gallery.cta_map')}</span>
                  <MapPin className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Image - Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/Karimsaari-portfolio-sous-marin-paysages-calanques-marseille-photographie-photographe-environnemental.webp"
                alt="Karim Saari — portfolio photographie sous-marine et paysages des Calanques de Marseille, photographe environnemental"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action Communauté - image gauche (alternance) */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          {...cardHover}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            {/* Image du groupe Facebook - Gauche */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1">
              <img
                src="/images/groupe-des-amoureux-des-calanques.webp"
                srcSet="/images/groupe-des-amoureux-des-calanques_400w.webp 400w, /images/groupe-des-amoureux-des-calanques_800w.webp 800w, /images/groupe-des-amoureux-des-calanques_1200w.webp 1200w, /images/groupe-des-amoureux-des-calanques.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Groupe Facebook Amoureux des Calanques de Marseille à Port-Cros"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '12% 25%' }}
                loading="lazy"
                decoding="async"
              />
              {/* Overlay subtil */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
            </div>

            {/* Contenu - Droite */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('home.community.title')}
              </h2>
              <h3 className="sr-only">{t('home.community.subtitle')}</h3>

              {/* Badge nombre de membres */}
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-ocean-teal/10 rounded-full border border-ocean-teal/30 w-fit">
                <Users className="w-5 h-5 text-ocean-teal" />
                <span className="text-xl font-bold text-white">
                  {fbGroupMembers.toLocaleString(lng === 'en' ? 'en-US' : 'fr-FR')}
                </span>
                <span className="text-gray-300">{t('home.community.members')}</span>
              </div>

              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                {t('home.community.desc')}
              </p>

              <Link
                to="/communaute-calanques"
                className="btn-primary inline-flex items-center gap-2 w-fit"
                onClick={() => trackEvent('cta_click', { button_name: 'join_fb_group' })}
              >
                <span>{t('home.community.cta_fb')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section Newsletter — lazy (supabase hors bundle initial) */}
      <Suspense fallback={
        <section className="container-custom py-8 md:py-12">
          <div className="rounded-3xl border border-ocean-teal/30 mb-16 min-h-[420px] md:min-h-[480px]" />
        </section>
      }>
        <NewsletterSection />
      </Suspense>

      {/* Section Phrases choc - Impact environnemental */}
      <section className="container-custom py-8 md:py-12">
        {/* Label de section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="text-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ocean-teal/30 bg-ocean-teal/10 text-ocean-teal text-xs font-semibold uppercase tracking-widest">
            <span>🌊</span> {t('home.impact_title')}
          </span>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl border border-ocean-teal/20 p-8 md:p-12 shadow-lg shadow-ocean-teal/10 mb-16"
          onMouseEnter={() => setFactsPaused(true)}
          onMouseLeave={() => setFactsPaused(false)}
        >
          {/* Compteur discret */}
          <p className="text-center text-xs text-text-muted mb-6 tabular-nums">
            {currentFactIndex + 1} / {IMPACT_FACTS.length}
          </p>

          {/* Tous les faits dans le DOM — indexables par les crawlers + lecteurs
              d'écran (le carrousel n'en monte qu'un à la fois via AnimatePresence) */}
          <ul className="sr-only">
            {IMPACT_FACTS.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>

          <div className="min-h-[180px] md:min-h-[140px] flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFactIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-lg md:text-xl lg:text-2xl font-semibold text-white leading-relaxed max-w-5xl"
              >
                {IMPACT_FACTS[currentFactIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Indicateurs de progression — dots plus grands + pause indicator */}
          <div className="flex justify-center items-center gap-0 mt-8">
            {IMPACT_FACTS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToFact(index)}
                className="inline-flex items-center justify-center p-2"
                aria-label={t('home.impact_aria', { n: index + 1 })}
              >
                <span className={`rounded-full transition-all duration-300 ${
                  index === currentFactIndex
                    ? 'w-8 h-2.5 bg-ocean-teal'
                    : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                }`} />
              </button>
            ))}
            {factsPaused && (
              <span className="ml-3 text-xs text-text-muted italic">{t('home.impact_paused')}</span>
            )}
          </div>
        </motion.div>
      </section>

      {/* CTA Carte Interactive */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          {...cardHover}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu - Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-ocean-teal/10 rounded-full border border-ocean-teal/30 w-fit">
                <MapPin className="w-5 h-5 text-ocean-teal" />
                <span className="text-sm font-semibold text-ocean-teal">Calanques · Côte Bleue · Frioul</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('home.map.title')}
              </h2>
              <h3 className="sr-only">{t('home.editorial.h3')}</h3>

              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                {t('home.map.desc')}{' '}
                {t('home.map.note')}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/carte-calanques"
                  className="btn-primary inline-flex items-center gap-2 w-fit"
                >
                  <span>{t('home.map.cta_map')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/acces-massifs-calanques"
                  className="btn-ghost inline-flex items-center gap-2 w-fit"
                >
                  <span>{t('home.map.cta_access')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Image - Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises.webp"
                srcSet="/images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises_400w.webp 400w, /images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises_800w.webp 800w, /images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises_1200w.webp 1200w, /images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Karim Saari photographe Marseille — grotte calanque eau turquoise pins et falaises calcaires"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section FAQ — rich results FAQPage + contenu statique pour crawlers */}
      <section className="container-custom pb-12 md:pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl border border-white/10 p-8 md:p-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            {t('home.faq_title')}
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem key={index} question={item.q} answer={item.a} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section éditoriale SEO — contexte Méditerranée (après FAQ) */}
      <section className="container-custom pb-12 md:pb-16">
        <motion.div
          {...cardHover}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10"
        >
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            {/* Image — Gauche */}
            <div className="relative h-64 md:h-auto min-h-[400px]">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-huveaune.webp"
                srcSet="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-huveaune_400w.webp 400w, /images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-huveaune_800w.webp 800w, /images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-huveaune_1200w.webp 1200w, /images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-huveaune.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Pollution plastique dans l'Huveaune à Marseille - Projet Sentinelle Dark Massilia"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
            </div>

            {/* Contenu — Droite */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t('home.editorial.title')}
              </h2>
              <h3 className="sr-only">{t('home.editorial.h3')}</h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                {t('home.editorial.p')}
              </p>
              <div className="mt-6">
                <Link
                  to="/donnees-scientifiques"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
                >
                  {t('home.editorial.cta')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
