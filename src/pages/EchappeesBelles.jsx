import { motion } from 'framer-motion';
import { ExternalLink, Tv } from 'lucide-react';
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
  return (
    <div className="min-h-screen py-32">
      <SEO {...SEO_PAGES['/echappees-belles-bouches-du-rhone']} preloadImage="/images/échappée_verte_0.jpg" />
      <div className="container-custom">
        <Breadcrumb label="Échappées Belles — France 5" />

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-12"
        >
          <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-3">
            France 5 · Échappées Belles
          </motion.p>
          <motion.h1
            variants={FADE_IN_UP}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Spéciale Échappée Verte — Les Bouches-du-Rhône en action
          </motion.h1>
          <motion.p
            variants={FADE_IN_UP}
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-8"
          >
            France 5 consacre un épisode d'Échappées Belles aux acteurs de terrain qui agissent pour l'environnement dans les Bouches-du-Rhône — dont les missions de dépollution marine de Karim Saari.
          </motion.p>

          {/* CTA replay */}
          <motion.a
            variants={FADE_IN_UP}
            href={REPLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3 mx-auto mb-12 hover:scale-105 transition-all duration-300"
          >
            <Tv className="w-5 h-5" />
            Voir l'émission en replay sur France.tv
            <ExternalLink className="w-4 h-4" />
          </motion.a>

          {/* Hero image */}
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-2xl overflow-hidden border border-white/10 mb-12"
          >
            <img
              src="/images/échappée_verte_0.jpg"
              alt="Karim Saari dans Spéciale Échappée Verte — Bouches-du-Rhône en action — France 5"
              className="w-full h-auto"
              loading="eager"
              fetchPriority="high"
              width="1280"
              height="720"
            />
          </motion.div>
        </motion.div>

        {/* Bloc éditorial */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6">
              L'émission
            </p>
            <div className="space-y-6 text-text-secondary leading-relaxed border-l-2 border-white/10 pl-6">
              <p>
                Les Bouches-du-Rhône abritent plus de{' '}
                <strong className="text-white">17 000 hectares d'espaces naturels protégés</strong> — Alpilles, Camargue et Calanques — où une faune et une flore exceptionnelles côtoient les zones fortement urbanisées de{' '}
                <strong className="text-white">Marseille</strong>, deuxième ville de France. Ce territoire vulnérable oblige à concilier pression humaine et protection de l'écosystème, et c'est précisément ce défi que cette{' '}
                <strong className="text-ocean-teal">Spéciale Échappée Verte</strong> vient documenter.
              </p>
              <p>
                Présentée par <strong className="text-white">Ismaël Khelifa</strong> et accompagnée de l'éco-aventurier{' '}
                <strong className="text-white">Matthieu Witvoet</strong>, l'émission débute justement aux{' '}
                <strong className="text-ocean-teal">Calanques</strong>. Au programme : la rencontre avec les éco-citoyens du territoire, inspirés par la beauté des paysages et déterminés à les préserver.
              </p>
              <p>
                Parmi eux, <strong className="text-white">Karim Saari</strong>, photographe environnemental et apnéiste, fondateur du{' '}
                <strong className="text-ocean-teal">Projet Sentinelle</strong> et président de{' '}
                <strong className="text-ocean-teal">Team Oxygen</strong>. Depuis plus de dix ans, il documente et combat la pollution plastique dans les fonds marins des Calanques à travers ses plongées en apnée — et cette diffusion nationale sur France 5 donne une nouvelle visibilité à ce combat.
              </p>
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
            Extraits de l'émission
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
              France 5 met les Bouches-du-Rhône à l'honneur
            </h2>
            <p className="text-text-secondary leading-[1.8] text-lg mb-4">
              Cette diffusion sur France 5 s'inscrit dans une longue liste de médias nationaux et internationaux qui ont documenté l'action de{' '}
              <strong className="text-ocean-teal">Karim Saari</strong> et de{' '}
              <strong className="text-ocean-teal">Team Oxygen</strong> pour la protection de la Méditerranée.
            </p>
            <p className="text-text-secondary leading-[1.8] text-lg mb-8">
              Que vous soyez journaliste, producteur ou institution, contactez-nous pour toute demande de tournage ou collaboration.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={REPLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Tv className="w-4 h-4" />
                Voir le replay
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="/contact" className="btn inline-flex items-center gap-2">
                Nous contacter
              </a>
            </div>
          </div>
          <div className="lg:w-[42%] flex-shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden">
            <img
              src="/images/échappée_verte_3.jpg"
              alt="Karim Saari — Échappées Belles France 5 — Dépollution marine Marseille"
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
