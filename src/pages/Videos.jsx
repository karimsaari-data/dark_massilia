import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoPlayer from '../components/media/VideoPlayer';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';
import { videos as videoList } from '../data/videos';
import videoDates from '../data/video-dates.json';

const Videos = () => {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Date de publication (ISO) récupérée via l'API YouTube au build, formatée selon la langue.
  const formatDate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return dateFormatter.format(d);
  };

  // Tri par date de publication décroissante (plus récente en premier).
  const videos = videoList
    .map((video) => {
      const iso = videoDates[video.id] || null;
      return { ...video, iso, date: formatDate(iso) };
    })
    .sort((a, b) => {
      if (a.iso && b.iso) return b.iso.localeCompare(a.iso);
      if (a.iso) return -1;
      if (b.iso) return 1;
      return 0;
    });

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/videos']} />
      <div className="container-custom">
        <Breadcrumb label={t('videos.hero_title')} />
        {/* H1 SEO — visible, keyword-rich */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl font-bold text-white text-center mb-8 leading-tight"
        >
          {t('videos.hero_title')}{' '}
          <span className="block text-sm md:text-base font-medium text-ocean-teal mt-2">
            {t('videos.hero_subtitle')}
          </span>
        </motion.h1>

        {/* Video Grid — Facade pattern : iframe chargée uniquement au clic */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {videos.map((video) => (
            <motion.div
              key={video.id}
              variants={FADE_IN_UP}
              className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group"
            >
              <VideoPlayer
                media={{
                  type: video.type || 'youtube',
                  url: video.type === 'vimeo'
                    ? `https://vimeo.com/${video.id}`
                    : `https://www.youtube.com/watch?v=${video.id}`,
                  embed_id: video.id,
                  title: video.title,
                  thumbnail_url: video.thumbnail_url || null,
                }}
              />

              {/* Video Info */}
              <div className="p-4">
                {video.date && (
                  <time
                    dateTime={video.iso}
                    className="block text-[11px] font-semibold text-ocean-teal uppercase tracking-widest mb-1"
                  >
                    {video.date}
                  </time>
                )}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-ocean-teal transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-text-secondary text-xs line-clamp-2">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Description — bas de page */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mt-16 mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t('videos.section_title')}
              </h2>
              <h3 className="sr-only">{t('videos.section_subtitle')}</h3>
              <div className="space-y-4 text-text-secondary leading-[1.8]">
                <p>{t('videos.desc')}</p>
                <p>{t('videos.yt_desc')}</p>
              </div>
              <div className="mt-6">
                <a
                  href="https://www.youtube.com/@dark.massilia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
                >
                  {t('videos.cta_yt')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="lg:w-[38%] flex-shrink-0 min-h-[260px] lg:min-h-0 overflow-hidden">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte-riou.webp"
                alt={t('videos.img_alt')}
                className="w-full h-full object-cover scale-[1.15] object-[center_40%]"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Callouts ARTE */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Sauver Marseille */}
          <motion.div
            variants={FADE_IN_UP}
            whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            className="glass-strong rounded-3xl p-8 border border-ocean-teal/20 flex flex-col gap-4"
          >
            <div className="flex-1">
              <p className="text-xs font-semibold text-ocean-teal uppercase tracking-widest mb-2">{t('videos.arte_label')}</p>
              <h2 className="text-xl font-bold text-white mb-3">{t('videos.arte_title')}</h2>
              <h3 className="sr-only">{t('videos.arte_subtitle')}</h3>
              <p className="text-text-secondary leading-relaxed text-sm">{t('videos.arte_desc')}</p>
            </div>
            <Link
              to="/sauver-marseille-documentaire-arte"
              className="btn-primary inline-flex items-center gap-2 self-start"
            >
              {t('videos.cta_arte')}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Méduses */}
          <motion.div
            variants={FADE_IN_UP}
            whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            className="glass-strong rounded-3xl p-8 border border-ocean-teal/20 flex flex-col gap-4"
          >
            <div className="flex-1">
              <p className="text-xs font-semibold text-ocean-teal uppercase tracking-widest mb-2">{t('videos.arte_meduses_label')}</p>
              <h2 className="text-xl font-bold text-white mb-3">{t('videos.arte_meduses_title')}</h2>
              <h3 className="sr-only">{t('videos.arte_meduses_subtitle')}</h3>
              <p className="text-text-secondary leading-relaxed text-sm">{t('videos.arte_meduses_desc')}</p>
            </div>
            <Link
              to="/meduses-souveraines-oceans-documentaire-arte"
              className="btn-primary inline-flex items-center gap-2 self-start"
            >
              {t('videos.cta_meduses')}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Green-Got */}
          <motion.div
            variants={FADE_IN_UP}
            whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            className="glass-strong rounded-3xl p-8 border border-ocean-teal/20 flex flex-col gap-4"
          >
            <div className="flex-1">
              <p className="text-xs font-semibold text-ocean-teal uppercase tracking-widest mb-2">{t('videos.greengot_label')}</p>
              <h2 className="text-xl font-bold text-white mb-3">{t('videos.greengot_title')}</h2>
              <h3 className="sr-only">{t('videos.greengot_subtitle')}</h3>
              <p className="text-text-secondary leading-relaxed text-sm">{t('videos.greengot_desc')}</p>
            </div>
            <Link
              to="/court-metrage-green-got-mediterranee"
              className="btn-primary inline-flex items-center gap-2 self-start"
            >
              {t('videos.cta_greengot')}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Section éditoriale SEO — vidéaste engagé & légitimité médiatique */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass rounded-3xl p-8 md:p-10">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">
              {t('videos.editorial_title')}
            </h2>
            <h3 className="sr-only">{t('videos.editorial_subtitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary leading-relaxed text-sm">
              <p>{t('videos.editorial_p1')}</p>
              <p>{t('videos.editorial_p2')}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Liens internes — cluster dépollution/photos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              to="/depollution-marine"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              {t('videos.link_missions')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/photographie-sous-marine"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              {t('videos.link_photos')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/presse"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              {t('videos.link_press')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Link
            to="/"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('videos.back_home')}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Videos;
