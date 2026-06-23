import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Linkedin } from 'lucide-react';
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

// Extraits du court-métrage — images du reportage Green-Got
// Crédits : Kim Nguyen & Benoît Prabel
// Fichiers générés par scripts/convert-green-got.mjs (WebP, sans espace — requis
// par le déploiement lftp). Ordre = ordre d'envoi (7 = ponton, mis en avant).
const PHOTOS = [
  { src: '/images/green-got-karim-saari-ponton-vieux-port-notre-dame-de-la-garde-marseille.webp', alt: 'Karim Saari sur un ponton du Vieux-Port de Marseille, Notre-Dame de la Garde en fond — court-métrage de la Fondation Green-Got' },
  { src: '/images/green-got-karim-saari-barque-vieux-port-marseille-team-oxygen.webp', alt: 'Karim Saari à bord d\'une barque dans le Vieux-Port de Marseille, t-shirt Team Oxygen — court-métrage de la Fondation Green-Got' },
  { src: '/images/green-got-karim-saari-interview-marseille-team-oxygen.webp', alt: 'Karim Saari, habitant de Marseille et bénévole Team Oxygen, en interview dans le court-métrage de la Fondation Green-Got' },
  { src: '/images/green-got-karim-saari-barque-profil-vieux-port-marseille.webp', alt: 'Karim Saari sur une barque dans le Vieux-Port de Marseille — court-métrage Fondation Green-Got' },
  { src: '/images/green-got-karim-saari-quai-vieux-port-marseille.webp', alt: 'Karim Saari sur le quai du Vieux-Port de Marseille lors du tournage du court-métrage Green-Got' },
  { src: '/images/green-got-depollution-apnee-plastique-fond-marin-mediterranee.webp', alt: 'Dépollution en apnée des microplastiques au fond de la Méditerranée — court-métrage Fondation Green-Got' },
];

const PARTICIPANT_HREFS = [
  { name: 'Karim Saari', href: 'https://www.team-oxygen.com/', roleKey: 'participant_karim_role', descKey: 'participant_karim_desc' },
  { name: 'Nicolas Camo', href: 'https://www.wingsoftheocean.com/', roleKey: 'participant_nicolas_role', descKey: 'participant_nicolas_desc' },
  { name: 'Anne-Leila Meistertzheim', href: 'https://plasticatsea.com/', roleKey: 'participant_anne_role', descKey: 'participant_anne_desc' },
];

const GreenGot = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/court-metrage-green-got-mediterranee']} preloadImage="/images/green-got-karim-saari-ponton-vieux-port-notre-dame-de-la-garde-marseille.webp" />

      {/* Breadcrumb */}
      <div className="container-custom pt-4">
        <Breadcrumb label={t('greenGot.breadcrumb')} />
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
                videoId="BoqO1LVcx5A"
                title="Court-métrage documentaire Fondation Green-Got — Sous la Méditerranée, au large de Marseille"
                aspectClass="aspect-[16/8]"
              />
            </motion.div>
            {/* Header text */}
            <div className="p-8 md:p-10 pt-6" style={{ background: 'rgba(3, 10, 28, 0.93)', backdropFilter: 'blur(12px)' }}>
              <div className="mt-4 max-w-3xl">
                <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">
                  {t('greenGot.hero_label')}
                </motion.p>
                <motion.h1
                  variants={FADE_IN_UP}
                  className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight"
                >
                  {t('greenGot.hero_title')}
                </motion.h1>
                <motion.p variants={FADE_IN_UP} className="text-white/70 text-base md:text-lg max-w-2xl">
                  {t('greenGot.hero_subtitle')}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="container-custom pb-12">

        {/* Résumé éditorial */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6">
              {t('greenGot.film_section')}
            </p>
            <div className="space-y-6 text-text-secondary leading-relaxed border-l-2 border-white/10 pl-6">
              <p>{t('greenGot.film_p1')}</p>
              <p>{t('greenGot.film_p2')}</p>
              <p>{t('greenGot.film_p3')}</p>
              <p>{t('greenGot.film_p4')}</p>
              <p className="text-ocean-teal font-semibold">{t('greenGot.film_p5')}</p>
            </div>

            {/* Galerie — extraits du court-métrage, intégrée au bloc éditorial */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6 text-center">
                {t('greenGot.gallery_title')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {PHOTOS.map((photo) => (
                  <div
                    key={photo.src}
                    className="basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-0.75rem)] rounded-2xl overflow-hidden border border-white/10"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-auto aspect-video object-cover"
                      loading="lazy"
                      decoding="async"
                      width="640"
                      height="360"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Participants */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.p variants={FADE_IN_UP} className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6 text-center">
            {t('greenGot.participants_title')}
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTICIPANT_HREFS.map((p) => (
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
                  {t(`greenGot.${p.roleKey}`)}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-text-secondary leading-relaxed text-sm">{t(`greenGot.${p.descKey}`)}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bloc éditorial + photo — bas de page */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t('greenGot.editorial_title')}
              </h2>
              <h3 className="sr-only">{t('greenGot.editorial_subtitle')}</h3>
              <div className="space-y-4 text-text-secondary leading-[1.8] text-lg">
                <p>{t('greenGot.editorial_p1')}</p>
                <p>{t('greenGot.editorial_p2')}</p>
              </div>
            </div>
            {/* Photo — extrait du reportage Green-Got */}
            <div className="lg:w-[42%] flex-shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden">
              <img
                src="/images/green-got-team-oxygen-apneistes-depollution-calanques-marseille.webp"
                alt="Les apnéistes de Team Oxygen rejoignant la mer pour une mission de dépollution — court-métrage Fondation Green-Got"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
                width="1280"
                height="720"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* En savoir plus — partenaires */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="text-center mb-4"
        >
          <motion.h2
            variants={FADE_IN_UP}
            className="text-sm uppercase tracking-widest text-text-muted mb-6 font-semibold"
          >
            {t('greenGot.more_info')}
          </motion.h2>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Fondation Green-Got', href: 'https://fondation.green-got.com/' },
              { label: 'Wings of the Ocean', href: 'https://www.wingsoftheocean.com/' },
              { label: 'Team Oxygen', href: 'https://www.team-oxygen.com/' },
              { label: 'Plastic At Sea', href: 'https://plasticatsea.com/' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn inline-flex items-center gap-2 group hover:scale-105 transition-all duration-300"
              >
                <span>{l.label}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            ))}
          </div>
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-2xl border border-white/10 p-6 md:p-8 mt-10 max-w-2xl mx-auto"
          >
            <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-4">
              {t('greenGot.credits_title')}
            </p>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed">
              {t('greenGot.credits_images')}
            </p>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed mt-2">
              {t('greenGot.credits_film')}
            </p>
            <a
              href="https://www.linkedin.com/posts/greengot_vous-m%C3%A9ritez-de-savoir-avant-de-mettre-les-activity-7471075104869941248-3M1g"
              target="_blank"
              rel="noopener noreferrer"
              className="btn inline-flex items-center gap-2 group hover:scale-105 transition-all duration-300 mt-6"
            >
              <Linkedin className="w-4 h-4" aria-hidden="true" />
              <span>{t('greenGot.linkedin_post')}</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
            </a>
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
            <span>{t('greenGot.cta_missions')}</span>
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link
            to="/videos"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <span>{t('greenGot.cta_videos')}</span>
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            to="/presse"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span>{t('greenGot.cta_back_medias')}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default GreenGot;
