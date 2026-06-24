import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import YouTubeFacade from '../components/media/YouTubeFacade';
import Breadcrumb from '../components/Breadcrumb';

const img = (n) =>
  `/images/arte-meduses-souveraines-oceans-documentaire-marseille-${n}`;

const HUBLOT_STYLE = {
  overflow: 'hidden',
  borderRadius: '24px',
  border: '2px solid rgba(0,171,168,0.55)',
  boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
};

const Meduses = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/meduses-souveraines-oceans-documentaire-arte']} />

      {/* Breadcrumb */}
      <div className="container-custom pt-4">
        <Breadcrumb label={t('meduses.breadcrumb')} />
      </div>

      {/* Hero — hublot vidéo */}
      <section
        className="container-custom"
        style={{ paddingTop: '1rem', paddingBottom: '2rem' }}
      >
        <motion.div initial="hidden" animate="visible" variants={STAGGER_CONTAINER}>
          <motion.div
            variants={{ hidden: { y: 20 }, visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
            style={HUBLOT_STYLE}
          >
            {/* Vidéo plein-largeur dans le cadre */}
            <motion.div variants={FADE_IN_UP} className="max-h-[520px] overflow-hidden">
              <YouTubeFacade
                videoId="yfebiTFOq7E"
                title="Méduses | Les souveraines des océans — Documentaire ARTE Évasion"
                aspectClass="aspect-[16/8]"
              />
            </motion.div>
            {/* Header text */}
            <div className="p-8 md:p-10 pt-6" style={{ background: 'rgba(3, 10, 28, 0.93)', backdropFilter: 'blur(12px)' }}>
              <div className="mt-4 max-w-3xl">
                <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">
                  {t('meduses.hero_label')}
                </motion.p>
                <motion.h1
                  variants={FADE_IN_UP}
                  className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight"
                >
                  {t('meduses.hero_title')}
                </motion.h1>
                <motion.p variants={FADE_IN_UP} className="text-white/70 text-base md:text-lg max-w-2xl">
                  {t('meduses.hero_subtitle')}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="container-custom pb-12">

        {/* Bloc 1 — Description ARTE + photos 2 & 3 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-8"
        >
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-ocean-teal font-semibold">
                  ARTE Évasion
                </span>
                <span className="text-text-muted">·</span>
                <span className="text-sm text-text-muted">
                  {t('meduses.director_info')}
                </span>
              </div>
              <div className="space-y-4 text-text-secondary leading-[1.8] text-lg">
                <p>{t('meduses.desc_p1')}</p>
                <p>{t('meduses.desc_p2')}</p>
                <p>{t('meduses.desc_p3')}</p>
              </div>
            </div>

            {/* Photos 2 & 3 */}
            <div className="lg:w-[38%] flex-shrink-0 flex flex-col min-h-[300px] lg:min-h-0">
              {[2, 3].map((n) => (
                <div key={n} className="flex-1 overflow-hidden">
                  <picture>
                    <source srcSet={`${img(n)}.webp`} type="image/webp" />
                    <img
                      src={`${img(n)}.jpg`}
                      alt={`Méduses en Méditerranée — image fournie pour le documentaire ARTE Évasion (${n - 1}/4)`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bloc 2 — Contribution éditoriale + photos 4 & 5 + bouton YouTube */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Photos 4 & 5 — à gauche */}
            <div className="lg:w-[38%] flex-shrink-0 flex flex-col min-h-[300px] lg:min-h-0 order-last lg:order-first">
              {[4, 5].map((n) => (
                <div key={n} className="flex-1 overflow-hidden">
                  <picture>
                    <source srcSet={`${img(n)}.webp`} type="image/webp" />
                    <img
                      src={`${img(n)}.jpg`}
                      alt={`Méduses en Méditerranée — image fournie pour le documentaire ARTE Évasion (${n - 1}/4)`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              ))}
            </div>

            {/* Texte + bouton */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <div className="flex items-start justify-between gap-6 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {t('meduses.editorial_title')}
                </h2>
                <h3 className="sr-only">{t('meduses.editorial_subtitle')}</h3>
                <div className="w-14 h-14 rounded-full bg-white overflow-hidden flex-shrink-0 animate-pulse-glow">
                  <img
                    src="/assets/dark-massilia-logo-200.webp"
                    alt="Logo Dark Massilia — Karim Saari"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="space-y-4 text-text-secondary leading-[1.8] text-lg">
                <p>{t('meduses.editorial_p1')}</p>
                <p>{t('meduses.editorial_p2')}</p>
                <p>{t('meduses.editorial_p3')}</p>
              </div>

              {/* Bouton YouTube intégré */}
              <div className="mt-8">
                <a
                  href="https://youtu.be/yfebiTFOq7E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn inline-flex items-center gap-3 group hover:scale-105 transition-all duration-300"
                >
                  <span>{t('meduses.yt_cta')}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTAs — Continuer la navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/depollution-marine"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>{t('meduses.cta_missions')}</span>
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link
            to="/sauver-marseille-documentaire-arte"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <span>{t('meduses.cta_arte')}</span>
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            to="/presse"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('meduses.cta_back_medias')}</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Meduses;
