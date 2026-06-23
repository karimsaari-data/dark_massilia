import { motion } from 'framer-motion';
import { ArrowLeft, Youtube, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import YouTubeFacade from '../components/media/YouTubeFacade';
import Breadcrumb from '../components/Breadcrumb';

const HUBLOT_STYLE = {
  overflow: 'hidden',
  borderRadius: '24px',
  border: '2px solid rgba(0,171,168,0.55)',
  boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
};

const Arte = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/sauver-marseille-documentaire-arte']} preloadImage="/images/karim-saari-arte-regard-documentaire-calanques-marseille_800w.webp" />

      {/* Breadcrumb */}
      <div className="container-custom pt-4">
        <Breadcrumb label={t('arte.breadcrumb')} />
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
                videoId="cxjAQtSHHyI"
                title="Documentaire ARTE — Pollution : Il faut sauver Marseille et ses Calanques"
                aspectClass="aspect-[16/8]"
              />
            </motion.div>
            {/* Header text */}
            <div className="p-8 md:p-10 pt-6" style={{ background: 'rgba(3, 10, 28, 0.93)', backdropFilter: 'blur(12px)' }}>
              <div className="mt-4 max-w-3xl">
                <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">
                  ARTE Regards · 2024
                </motion.p>
                <motion.h1
                  variants={FADE_IN_UP}
                  className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight"
                >
                  {t('arte.hero_title')}
                </motion.h1>
                <motion.p variants={FADE_IN_UP} className="text-white/70 text-base md:text-lg max-w-2xl">
                  {t('arte.hero_subtitle')}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="container-custom pb-12">

        {/* Mission Summary */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6">
              {t('arte.summary_title')}
            </p>
            <div className="space-y-6 text-text-secondary leading-relaxed border-l-2 border-white/10 pl-6">
              <p>{t('arte.summary')}</p>
            </div>
            <p className="text-xs text-text-muted italic mt-8">
              {t('arte.quote_source')}
            </p>
          </motion.div>
        </motion.div>

        {/* Additional Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center"
        >
          <motion.h2
            variants={FADE_IN_UP}
            className="text-sm uppercase tracking-widest text-text-muted mb-6 font-semibold"
          >
            {t('arte.more_arte')}
          </motion.h2>

          <motion.a
            variants={FADE_IN_UP}
            href="https://www.youtube.com/user/arte"
            target="_blank"
            rel="noopener noreferrer"
            className="btn inline-flex items-center justify-between group max-w-md mx-auto hover:scale-105 transition-all duration-300"
          >
            <span>{t('arte.yt_channel')}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Bloc éditorial + photo — bas de page */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mt-12 mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t('arte.editorial_title')}
              </h2>
              <h3 className="sr-only">{t('arte.editorial_subtitle')}</h3>
              <div className="space-y-4 text-text-secondary leading-[1.8] text-lg">
                <p>{t('arte.editorial_p1')}</p>
                <p>{t('arte.editorial_p2')}</p>
              </div>
            </div>
            {/* Photo */}
            <div className="lg:w-[42%] flex-shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden">
              <picture>
                <source
                  srcSet="/images/karim-saari-arte-regard-documentaire-calanques-marseille_800w.webp 800w, /images/karim-saari-arte-regard-documentaire-calanques-marseille.webp 1440w"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  type="image/webp"
                />
                <img
                  src="/images/karim-saari-arte-regard-documentaire-calanques-marseille.jpg"
                  alt={t('arte.img_alt')}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  fetchPriority="high"
                  width="800"
                  height="1000"
                />
              </picture>
            </div>
          </motion.div>
        </motion.div>

        {/* CTAs — Continuer la navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/depollution-marine"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>{t('arte.cta_missions')}</span>
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link
            to="/videos"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <span>{t('arte.cta_videos')}</span>
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            to="/presse"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span>{t('arte.cta_back_medias')}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Arte;
