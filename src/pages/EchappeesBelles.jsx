import { motion } from 'framer-motion';
import { ExternalLink, Tv } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';

const REPLAY_URL = 'https://www.france.tv/france-5/echappees-belles/saison-18/5875509-speciale-echappee-verte-les-bouches-du-rhone-en-action.html';

const PHOTOS = [
  { src: '/images/échappée_verte_0.jpg', alt: 'Spéciale Échappée verte Bouches-du-Rhône — France 5 Échappées Belles — Karim Saari' },
  { src: '/images/échappée_verte_1.jpg', alt: 'Karim Saari dans Échappées Belles — Dépollution marine Calanques de Marseille' },
  { src: '/images/échappée_verte_2.jpg', alt: 'Échappées Belles Bouches-du-Rhône — Environnement et action terrain' },
  { src: '/images/échappée_verte_4.jpg', alt: 'Échappées Belles France 5 — Karim Saari photographe et apnéiste Marseille' },
  { src: '/images/échappée_verte_5.jpg', alt: 'Échappées Belles Spéciale Verte — Les Bouches-du-Rhône en action, France 5' },
];

const EchappeesBelles = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/echappees-belles-bouches-du-rhone']} preloadImage="/images/échappée_verte_0.jpg" />

      {/* Breadcrumb */}
      <div className="container-custom pt-4">
        <Breadcrumb label={t('echappees.breadcrumb')} />
      </div>

      {/* Hero — cadre hublot avec image en fond */}
      <section
        className="container-custom"
        style={{ paddingTop: '1rem', paddingBottom: '2rem' }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
        >
          <motion.div
            variants={{ hidden: { y: 20 }, visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              border: '2px solid rgba(0,171,168,0.55)',
              boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
              minHeight: '65vh',
            }}
            className="flex flex-col justify-end"
          >
            {/* Image hero en fond */}
            <img
              src="/images/échappée_verte_0.jpg"
              alt={t('echappees.hero_img_alt')}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ zIndex: 0 }}
              loading="eager"
              fetchPriority="high"
              width="1280"
              height="720"
            />
            {/* Gradient bas → haut */}
            <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/60 to-transparent" style={{ zIndex: 1 }} />

            {/* Contenu overlaid */}
            <div className="relative p-8 md:p-12" style={{ zIndex: 2 }}>
              <div className="max-w-3xl mt-3">
                <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">
                  France 5 · Échappées Belles
                </motion.p>
                <motion.h1
                  variants={FADE_IN_UP}
                  className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight"
                >
                  {t('echappees.hero_title')}
                </motion.h1>
                <motion.p
                  variants={FADE_IN_UP}
                  className="text-white/80 text-base md:text-lg max-w-2xl mb-5"
                >
                  {t('echappees.hero_desc')}
                </motion.p>
                <motion.a
                  variants={FADE_IN_UP}
                  href={REPLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-3 hover:scale-105 transition-all duration-300"
                >
                  <Tv className="w-5 h-5" />
                  {t('echappees.cta_replay')}
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="container-custom py-10">
        {/* Bloc éditorial */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6">
              {t('echappees.section_title')}
            </p>
            <div className="space-y-6 text-text-secondary leading-relaxed border-l-2 border-white/10 pl-6">
              <p>{t('echappees.p1')}</p>
              <p>{t('echappees.p2')}</p>
              <p>{t('echappees.p3')}</p>
            </div>
          </motion.div>
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
            {t('echappees.gallery_title')}
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHOTOS.slice(1).map((photo, i) => (
              <motion.div
                key={i}
                variants={FADE_IN_UP}
                className="glass-strong rounded-2xl overflow-hidden border border-white/10"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto aspect-video object-cover"
                  loading="lazy"
                  decoding="async"
                  width="1280"
                  height="720"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA bas de page */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row"
        >
          <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {t('echappees.editorial_title')}
            </h2>
            <h3 className="sr-only">{t('echappees.editorial_subtitle')}</h3>
            <div className="space-y-4 text-text-secondary leading-[1.8] text-lg mb-8">
              <p>{t('echappees.editorial_p1')}</p>
              <p>{t('echappees.editorial_p2')}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href={REPLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Tv className="w-4 h-4" />
                {t('echappees.replay_label')}
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="/contact" className="btn inline-flex items-center gap-2">
                {t('echappees.contact_cta')}
              </a>
            </div>
          </div>
          <div className="lg:w-[42%] flex-shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden">
            <img
              src="/images/échappée_verte_3.jpg"
              alt={t('echappees.bottom_img_alt')}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              decoding="async"
              width="1280"
              height="720"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default EchappeesBelles;
