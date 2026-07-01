import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import { toCdn } from '../utils/api';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';
import VimeoFacade from '../components/media/VimeoFacade';

const HUBLOT_STYLE = {
  overflow: 'hidden',
  borderRadius: '24px',
  border: '2px solid rgba(0,171,168,0.55)',
  boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
};

// Photos de la soirée de projection (Grotte Cosquer Méditerranée, 24 juin 2026)
// Source : article de blog /blog/oxygene-un-plaidoyer-pour-la-mediterranee
// FEATURED = images d'appel dans les blocs éditoriaux · GALLERY = reste de la soirée
const FEATURED_PHOTOS = [
  'cms.karimsaari.com/wp-content/uploads/2026/07/65-006A3810-1-1024x683.jpg',   // landscape
  'cms.karimsaari.com/wp-content/uploads/2026/07/88-0I4A5642-683x1024.jpg',     // portrait
  'cms.karimsaari.com/wp-content/uploads/2026/07/85-0I4A5630-1-1-1024x683.jpg', // landscape
].map(toCdn);

const GALLERY_PHOTOS = [
  'cms.karimsaari.com/wp-content/uploads/2026/07/147-006A3932-1024x683.jpg',
  'cms.karimsaari.com/wp-content/uploads/2026/07/90-0I4A5671-683x1024.jpg',
  'cms.karimsaari.com/wp-content/uploads/2026/07/99-0I4A5764-683x1024.jpg',
  'cms.karimsaari.com/wp-content/uploads/2026/07/68-006A3812-1-1024x683.jpg',
  'cms.karimsaari.com/wp-content/uploads/2026/07/53-0I4A5510-2-683x1024.jpg',
  'cms.karimsaari.com/wp-content/uploads/2026/07/103-0I4A5815-1-683x1024.jpg',
  'cms.karimsaari.com/wp-content/uploads/2026/07/104-0I4A5819-683x1024.jpg',
  'cms.karimsaari.com/wp-content/uploads/2026/07/117-006A3885-683x1024.jpg',
  'cms.karimsaari.com/wp-content/uploads/2026/07/20260624_182308-1024x577.jpg',
].map(toCdn);

const Oxygene = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/oxygene-documentaire-depollution-mediterranee']} />

      {/* Breadcrumb */}
      <div className="container-custom pt-4">
        <Breadcrumb label={t('oxygene.breadcrumb')} />
      </div>

      {/* Hero — hublot vidéo (facade : l'iframe Vimeo ne charge qu'au clic) */}
      <section className="container-custom" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        <motion.div initial="hidden" animate="visible" variants={STAGGER_CONTAINER}>
          <motion.div
            variants={{ hidden: { y: 20 }, visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
            style={HUBLOT_STYLE}
          >
            <motion.div variants={FADE_IN_UP} className="max-h-[520px] overflow-hidden">
              <VimeoFacade
                videoId="1193190954"
                title="OXYGÈNE — Trailer VO"
                poster={GALLERY_PHOTOS[8]}
                aspectClass="aspect-[16/8]"
              />
            </motion.div>
            {/* Header text */}
            <div className="p-8 md:p-10 pt-6" style={{ background: 'rgba(3, 10, 28, 0.93)', backdropFilter: 'blur(12px)' }}>
              <div className="mt-4 max-w-3xl">
                <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">
                  {t('oxygene.hero_label')}
                </motion.p>
                <motion.h1 variants={FADE_IN_UP} className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                  {t('oxygene.hero_title')}
                </motion.h1>
                <motion.p variants={FADE_IN_UP} className="text-white/70 text-base md:text-lg max-w-2xl">
                  {t('oxygene.hero_subtitle')}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="container-custom pb-12">

        {/* Synopsis */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-8"
        >
          <motion.div variants={FADE_IN_UP} className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6">
              {t('oxygene.synopsis_label')}
            </p>
            <div className="space-y-6 text-text-secondary leading-relaxed border-l-2 border-white/10 pl-6 text-lg">
              <p>{t('oxygene.synopsis_p1')}</p>
              <p>{t('oxygene.synopsis_p2')}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Tournage en immersion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-8"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{t('oxygene.immersion_title')}</h2>
              <div className="space-y-4 text-text-secondary leading-[1.8] text-lg">
                <p>{t('oxygene.immersion_p1')}</p>
                <p>{t('oxygene.immersion_p2')}</p>
              </div>
              <blockquote className="mt-6 border-l-2 border-ocean-teal/50 pl-5 italic text-white/90">
                {t('oxygene.quote_karim')}
                <footer className="mt-2 text-sm not-italic text-text-muted">{t('oxygene.quote_karim_source')}</footer>
              </blockquote>
            </div>
            <div className="lg:w-[42%] flex-shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden">
              <img
                src={FEATURED_PHOTOS[0]}
                alt="Soirée de projection du documentaire Oxygène à la Grotte Cosquer Méditerranée, Marseille"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
                width="1024"
                height="683"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* L'apnée, choix esthétique */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-8"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row-reverse">
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{t('oxygene.apnea_title')}</h2>
              <div className="space-y-4 text-text-secondary leading-[1.8] text-lg">
                <p>{t('oxygene.apnea_p1')}</p>
              </div>
              <blockquote className="mt-6 border-l-2 border-ocean-teal/50 pl-5 italic text-white/90">
                {t('oxygene.quote_jeremy')}
                <footer className="mt-2 text-sm not-italic text-text-muted">{t('oxygene.quote_jeremy_source')}</footer>
              </blockquote>
              <blockquote className="mt-4 border-l-2 border-ocean-teal/50 pl-5 italic text-white/90">
                {t('oxygene.quote_realisateurs')}
                <footer className="mt-2 text-sm not-italic text-text-muted">{t('oxygene.quote_realisateurs_source')}</footer>
              </blockquote>
            </div>
            <div className="lg:w-[42%] flex-shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden">
              <img
                src={FEATURED_PHOTOS[1]}
                alt="Soirée de projection du documentaire Oxygène à la Grotte Cosquer Méditerranée, Marseille"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
                width="683"
                height="1024"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Le mythe de Sisyphe — chiffres */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-8"
        >
          <motion.div variants={FADE_IN_UP} className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{t('oxygene.sisyphe_title')}</h2>
            <div className="space-y-4 text-text-secondary leading-[1.8] text-lg mb-8">
              <p>{t('oxygene.sisyphe_p1')}</p>
            </div>
            {/* Chiffres clés */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="glass rounded-2xl p-6 text-center border border-white/10">
                <p className="text-3xl md:text-4xl font-bold text-ocean-teal mb-1">600 000 t</p>
                <p className="text-xs text-text-muted uppercase tracking-wide">{t('oxygene.stat_tonnes')}</p>
              </div>
              <div className="glass rounded-2xl p-6 text-center border border-white/10">
                <p className="text-3xl md:text-4xl font-bold text-ocean-teal mb-1">34 000</p>
                <p className="text-xs text-text-muted uppercase tracking-wide">{t('oxygene.stat_bottles')}</p>
              </div>
              <div className="glass rounded-2xl p-6 text-center border border-white/10">
                <p className="text-3xl md:text-4xl font-bold text-ocean-teal mb-1">7 % / 1 %</p>
                <p className="text-xs text-text-muted uppercase tracking-wide">{t('oxygene.stat_microplastics')}</p>
              </div>
            </div>
            <blockquote className="border-l-2 border-ocean-teal/50 pl-5 italic text-white/90 text-lg">
              {t('oxygene.sisyphe_p3')}
              <footer className="mt-2 text-sm not-italic text-text-muted">{t('oxygene.quote_karim_source')}</footer>
            </blockquote>
          </motion.div>
        </motion.div>

        {/* Pourquoi CITEO */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{t('oxygene.citeo_title')}</h2>
              <div className="space-y-4 text-text-secondary leading-[1.8] text-lg">
                <p>{t('oxygene.citeo_p1')}</p>
              </div>
              <blockquote className="mt-6 border-l-2 border-ocean-teal/50 pl-5 italic text-white/90">
                {t('oxygene.quote_christine')}
                <footer className="mt-2 text-sm not-italic text-text-muted">{t('oxygene.quote_christine_source')}</footer>
              </blockquote>
            </div>
            <div className="lg:w-[42%] flex-shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden">
              <img
                src={FEATURED_PHOTOS[2]}
                alt="Soirée de projection du documentaire Oxygène à la Grotte Cosquer Méditerranée, Marseille"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
                width="1024"
                height="683"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Projections / tournée */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="p-8 md:p-12 text-center">
            <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-4">
              {t('oxygene.screenings_title')}
            </p>
            <p className="text-text-secondary leading-relaxed text-lg max-w-3xl mx-auto">
              {t('oxygene.screenings_p1')}
            </p>
          </motion.div>
        </motion.div>

        {/* Équipe */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.p variants={FADE_IN_UP} className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6 text-center">
            {t('oxygene.team_title')}
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Karim Saari', href: 'https://www.team-oxygen.com/', roleKey: 'team_karim_role', descKey: 'team_karim_desc' },
              { name: 'Roxane Perrot & Ugo Isoard', href: 'https://www.linkedin.com/company/z%C3%A9k%C3%A9-film/', roleKey: 'team_realisateurs_role', descKey: 'team_realisateurs_desc' },
              { name: 'CITEO', href: 'https://www.citeo.com/', roleKey: 'team_citeo_role', descKey: 'team_citeo_desc' },
            ].map((p) => (
              <motion.a
                key={p.name}
                variants={FADE_IN_UP}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-strong rounded-3xl p-8 border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group flex flex-col"
              >
                <h2 className="text-lg font-bold text-white mb-1 group-hover:text-ocean-teal transition-colors">
                  {p.name}
                </h2>
                <p className="text-xs font-semibold text-ocean-teal uppercase tracking-widest mb-3 inline-flex items-center gap-1">
                  {t(`oxygene.${p.roleKey}`)}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-text-secondary leading-relaxed text-sm">{t(`oxygene.${p.descKey}`)}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Galerie photos */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.p variants={FADE_IN_UP} className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6 text-center">
            {t('oxygene.gallery_title')}
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GALLERY_PHOTOS.map((src) => (
              <div key={src} className="overflow-hidden rounded-2xl border border-white/10 aspect-[4/5]">
                <img
                  src={src}
                  alt="Soirée de projection du documentaire Oxygène à la Grotte Cosquer Méditerranée, Marseille — copyright Z'art Films Production"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  width="683"
                  height="854"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Crédits */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="text-center mb-4"
        >
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-2xl border border-white/10 p-6 md:p-8 max-w-2xl mx-auto"
          >
            <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-4">
              {t('oxygene.credits_title')}
            </p>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed">
              {t('oxygene.credits_photos')}
            </p>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed mt-2">
              {t('oxygene.credits_film')}
            </p>
            <Link
              to="/blog/oxygene-un-plaidoyer-pour-la-mediterranee"
              className="btn inline-flex items-center gap-2 group hover:scale-105 transition-all duration-300 mt-6"
            >
              <span>{t('oxygene.cta_blog')}</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>

        {/* CTAs — Continuer la navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/depollution-marine" className="btn-primary inline-flex items-center gap-2">
            <span>{t('oxygene.cta_missions')}</span>
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link to="/videos" className="btn-secondary inline-flex items-center gap-2 group">
            <span>{t('oxygene.cta_videos')}</span>
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link to="/presse" className="btn-secondary inline-flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span>{t('oxygene.cta_back_medias')}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Oxygene;
