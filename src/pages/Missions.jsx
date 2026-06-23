import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useCardHover } from '../hooks/useCardHover';
import { ArrowLeft, ArrowRight, ExternalLink, Camera, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER, SOCIAL_STATS_DEFAULTS } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';
import StatCounter from '../components/ui/StatCounter';

const EDITION_YEARS = ['2022', '2023', '2024', '2025'];
const EDITION_WASTE = { '2022': 900, '2023': 1357, '2024': 1147, '2025': 2320 };
const EDITION_DAYS  = { '2022': 8,   '2023': 7,    '2024': 9,    '2025': 7    };
const EDITION_COLOR = { '2022': '#21c47b', '2023': '#0091ff', '2024': '#ff6b35', '2025': '#ffd93d' };

const Missions = () => {
  const { t, i18n } = useTranslation();
  const cardHover = useCardHover();
  const lng = i18n.language;

  return (
    <div className="min-h-screen pt-8 pb-24">
      <SEO {...SEO_PAGES['/depollution-marine']} />
      <div className="container-custom">
        <Breadcrumb label={t('missions.breadcrumb')} />

        {/* H1 SEO */}
        <div className="flex items-stretch gap-4 mb-3">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
            style={{ transformOrigin: 'top' }}
            className="w-[3px] bg-ocean-teal rounded-full flex-shrink-0"
            aria-hidden="true"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-2xl font-bold text-white leading-tight"
          >
            {t('missions.hero_title')}
          </motion.h1>
        </div>
        <p className="text-center text-xs text-gray-500 mb-8">
          {t('missions.updated')}
        </p>

        {/* Mission Description */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(10, 20, 40, 0.45)',
              backdropFilter: 'blur(14px)',
              borderRadius: '24px',
              padding: 'clamp(32px, 5vw, 72px)',
              border: '2px solid rgba(0,171,168,0.55)',
              boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
              minHeight: '360px',
            }}>
            {/* Vidéo fond */}
            <video
              autoPlay muted loop playsInline preload="none"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
              poster="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-v%C3%A9lo-m%C3%A9tropole.webp"
            >
              <source src="/assets/video/pollution-hero.mp4" type="video/mp4" />
            </video>
            {/* Contenu */}
            <div className="relative p-8 md:p-12 flex flex-col justify-center" style={{ zIndex: 1 }}>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t('missions.section_mission')}
              </h2>
              <h3 className="sr-only">{t('missions.subtitle')}</h3>
              <div className="rounded-xl px-5 py-4" style={{ background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(8px)' }}>
                <div className="space-y-4 text-white/90 leading-[1.8]">
                  <p className="font-medium">{t('missions.desc1')}</p>
                  <p>
                    {t('missions.desc2')}{' '}
                    <strong className="text-ocean-teal">Team Oxygen</strong>{' '}
                    <Link to="/photographie-sous-marine" className="text-ocean-teal hover:text-white transition-colors">
                      {t('missions.bullet_photo')}
                    </Link>{' '}
                    {t('missions.bullet_data')}.
                  </p>
                  <p>
                    {t('missions.president_note')}{' '}
                    <Link to="/photographe-environnemental-marseille" className="text-ocean-teal hover:text-white transition-colors">
                      {lng === 'en' ? 'environmental photographer in Marseille' : 'photographe environnemental engagé à Marseille'}
                    </Link>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Éditions — 4 années avec compteurs animés */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDITION_YEARS.map((year) => (
              <div key={year} className="glass-strong rounded-2xl p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: EDITION_COLOR[year] }}
                  >
                    {year}
                  </h3>
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      <StatCounter end={EDITION_WASTE[year]} suffix=" kg" />
                    </p>
                    <p className="text-sm text-text-muted">{t('missions.waste_collected')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium">{t('missions.duration', { count: EDITION_DAYS[year] })}</p>
                  <p className="text-text-secondary text-sm">{t(`missions.editions.${year}.name`)}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Lien Wikipedia Projet Sentinelle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mb-6 text-center"
        >
          <a
            href="https://fr.wikipedia.org/wiki/Projet_Sentinelle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zm-.75 3.5v1.25H9.5v1.5h1.75v5.5H9.5v1.5h5v-1.5h-1.75V7h-1.5z"/>
            </svg>
            {t('missions.wikipedia_label')}
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </motion.div>

        {/* 5ème édition — Annonce octobre 2026 + lien Team Oxygen */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div
            {...cardHover}
            variants={FADE_IN_UP}
            className="glass-strong rounded-3xl p-8 md:p-12 border border-ocean-teal/30 text-center animate-border-pulse"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ocean-teal/15 border border-ocean-teal/30 text-ocean-teal text-xs font-semibold mb-6">
              📅 {t('missions.next_edition_label')}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('missions.next_edition_title')}
            </h3>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
              {t('missions.next_edition_desc')}
            </p>
            <a
              href="https://www.team-oxygen.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-base font-medium"
            >
              {t('missions.cta_team_oxygen')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>

        {/* Photo hero — lien vers /photographie-sous-marine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mb-12"
        >
          <Link to="/photographie-sous-marine" className="group block relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <div className="aspect-[16/7] relative">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen_1200w.webp"
                alt={t('missions.gallery_photo_alt')}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">{t('missions.gallery_photo_label')}</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  {t('missions.gallery_subtitle')}
                </h2>
                <h3 className="sr-only">{t('missions.gallery_title')}</h3>
                <p className="text-white/70 text-base mb-4 max-w-xl">
                  {t('missions.gallery_desc')}
                </p>
                <span className="inline-flex items-center gap-2 text-ocean-teal font-medium group-hover:gap-3 transition-all">
                  <Camera className="w-4 h-4" aria-hidden="true" />
                  {t('missions.cta_gallery')}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Section éditoriale SEO */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t('missions.editorial_title')}
              </h2>
              <h3 className="sr-only">{t('missions.editorial_subtitle')}</h3>
              <p className="text-text-secondary leading-[1.8] text-lg">
                {t('missions.editorial_p1')}{' '}
                {t('missions.editorial_p2')}{' '}
                {t('missions.editorial_p3')}{' '}
                {t('missions.editorial_p4')}{' '}
                {t('missions.editorial_p5', { defaultValue: '' })}
              </p>
              <div className="mt-6 flex flex-wrap gap-6">
                <Link
                  to="/donnees-scientifiques"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
                >
                  {t('missions.cta_sources')}
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  to="/photographie-paysage-mer"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
                >
                  {t('missions.cta_landscapes')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="lg:w-[38%] flex-shrink-0 min-h-[260px] lg:min-h-0">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-plaque-immatriculation.webp"
                alt={t('missions.plate_img_alt')}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* À propos de l'association */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row-reverse">
            <div className="lg:w-[38%] flex-shrink-0 min-h-[260px] lg:min-h-0">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen-freediving.webp"
                alt={t('missions.freediver_img_alt')}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {t('missions.org_title')}
            </h2>
            <h3 className="sr-only">{t('missions.org_subtitle')}</h3>
            <div className="space-y-4 text-text-secondary leading-[1.8]">
              <p>{t('missions.org_p1')}{' '}{t('missions.org_p2')}</p>
              <p>{t('missions.org_p3')}{' '}{t('missions.org_p4')}</p>
              <p>{t('missions.org_p5')}{' '}{t('missions.org_p6')}</p>
            </div>

            {/* Chiffres clés association */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '2018', label: t('missions.stat_founded') },
                { value: '5 724 kg', label: t('missions.stat_waste') },
                { value: '4', label: t('missions.stat_editions') },
                { value: SOCIAL_STATS_DEFAULTS.total_community.toLocaleString(lng === 'en' ? 'en-US' : 'fr-FR'), label: t('missions.stat_sentinels') },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xl md:text-2xl font-bold text-ocean-teal">{stat.value}</p>
                  <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                to="/communaute"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
              >
                {t('missions.cta_join')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Section ramassage fonds marins */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="glass rounded-2xl px-8 py-6 border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">
              {t('missions.cleanup_title')}
            </h2>
            <p className="text-text-secondary leading-[1.8]">
              {t('missions.cleanup_p')}
            </p>
          </div>
        </motion.div>

        {/* Types de déchets — impact écologique */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {t('missions.pollution_title')}
            </h2>
            <div className="space-y-0 text-text-secondary leading-loose text-sm md:text-[0.95rem]">

              {/* Lead */}
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-light mb-6">
                {t('missions.pollution_lead')}
              </p>

              {/* Chapitre 1 */}
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-2 pb-1">{t('missions.fauna_section')}</p>
              <p className="mb-4">{t('missions.fauna_p')}</p>

              {/* Chapitre 2 */}
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-3 pb-1">{t('missions.doc_section')}</p>
              <p className="mb-4">{t('missions.doc_p')}</p>

              {/* Pull quote */}
              <blockquote className="my-5 py-4 px-5 bg-white/[0.04] border-l-2 border-ocean-teal rounded-r-lg">
                <p className="text-white/85 italic text-base leading-snug">{t('missions.dive_quote')}</p>
              </blockquote>
            </div>
          </div>
        </motion.div>

        {/* Rejoindre une mission */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {t('missions.participate_title')}
            </h2>
            <div className="space-y-0 text-text-secondary leading-loose text-sm md:text-[0.95rem]">

              {/* Lead */}
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-light mb-6">
                {t('missions.participate_desc')}{' '}{t('missions.participate_note')}
              </p>

              {/* Chapitre 1 */}
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-2 pb-1">{t('missions.for_freedivers')}</p>
              <p className="mb-4">
                {t('missions.freediver_p1')}{' '}
                {t('missions.freediver_p2')}{' '}
                {t('missions.freediver_p3')}{' '}
                {t('missions.freediver_p4')}
              </p>

              {/* Chapitre 2 */}
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-3 pb-1">{t('missions.edition5_label')}</p>
              <p className="mb-4">
                {t('missions.edition5_desc')}{' '}{t('missions.edition5_newsletter')}{' '}
                {t('missions.community_cta')}
              </p>

              {/* Pull quote */}
              <blockquote className="my-5 py-4 px-5 bg-white/[0.04] border-l-2 border-ocean-teal rounded-r-lg">
                <p className="text-white/85 italic text-base leading-snug">{t('missions.no_freediver_needed')}</p>
              </blockquote>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/#newsletter"
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>{t('missions.cta_register')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/communaute"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <span>{t('missions.cta_community')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Accès aux massifs forestiers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="glass rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-orange-500/20">
            <div>
              <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                {t('missions.before_mission')}
              </p>
              <p className="text-white font-semibold text-lg leading-snug">
                {t('missions.access_title')}
              </p>
              <p className="text-text-secondary text-sm mt-1">
                {t('missions.access_desc')}
              </p>
            </div>
            <Link
              to="/acces-massifs-calanques"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-orange-500/40 text-orange-400 text-sm font-semibold hover:bg-orange-500/10 transition-colors whitespace-nowrap flex-shrink-0"
            >
              <Flame className="w-4 h-4" />
              {t('missions.cta_risk_map')}
            </Link>
          </div>
        </motion.div>

        {/* Dernières actualités */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="glass rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/5">
            <div>
              <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">
                {t('missions.blog_title')}
              </p>
              <p className="text-white font-semibold text-lg leading-snug">
                {t('missions.blog_subtitle')}
              </p>
              <p className="text-text-secondary text-sm mt-1">
                {t('missions.blog_desc')}
              </p>
            </div>
            <Link
              to="/blog"
              className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <span>{t('missions.cta_blog')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Voir aussi — maillage interne vidéos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="glass rounded-2xl px-8 py-6 flex flex-col gap-6 border border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">
                  {t('missions.videos_title')}
                </p>
                <p className="text-white font-semibold text-lg leading-snug">
                  {t('missions.videos_subtitle')}
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  {t('missions.videos_desc')}
                </p>
              </div>
              <Link
                to="/videos"
                className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0"
              >
                <span>{t('missions.cta_videos')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 border-t border-white/8">
              <Link
                to="/#newsletter"
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>{t('missions.newsletter_cta')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/"
                className="btn-secondary inline-flex items-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                <span>{t('missions.cta_home')}</span>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Missions;
