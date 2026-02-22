import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoPlayer from '../components/media/VideoPlayer';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const videos = [
  {
    id: 'cxjAQtSHHyI',
    title: 'Documentaire ARTE',
    description: 'Reportage sur les actions de dépollution en Méditerranée',
  },
  {
    id: 'sseo9sf7jow',
    title: '2025, une année de dépollution en apnée à Marseille',
    description: 'Rétrospective 2025 des actions de dépollution en apnée à Marseille',
  },
  {
    id: 'XHqB603STuw',
    title: 'Projet Sentinelle Frioul',
    description: "Mission de dépollution dans l'archipel du Frioul",
  },
  {
    id: 'a3nw8N7_lhI',
    title: 'Pollution des Plages du Prado',
    description: 'Documentation de la pollution sur les plages marseillaises',
  },
  {
    id: '-EwJUePiAdk',
    title: "Une Année d'Action",
    description: 'Rétrospective de nos actions environnementales',
  },
  {
    id: 'AkOFh9rwT0g',
    title: 'Plage du Prado',
    description: 'Nettoyage et sensibilisation au Prado',
  },
  {
    id: 'rYza88fs76k',
    title: "Une Année d'Action",
    description: 'Bilan annuel de nos missions de dépollution',
  },
  {
    id: '9OEa85XS5nU',
    title: 'Quai Marcel Pagnol',
    description: 'Action de nettoyage au Quai Marcel Pagnol',
  },
  {
    id: 'oq_ACgCB53A',
    title: "Une Année d'Action 2021",
    description: 'Rétrospective 2021 de nos actions',
  },
  {
    id: '7aJ4UHEHf_A',
    title: "Embouchure de l'Huveaune",
    description: "Mission de dépollution à l'embouchure de l'Huveaune",
  },
];

const Videos = () => {
  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/videos']} />
      <div className="container-custom">
        {/* H1 SEO — visible, keyword-rich */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-12 leading-tight"
        >
          Vidéos &amp; Documentaires
          <span className="block text-xl md:text-2xl font-medium text-ocean-teal mt-3">
            Dépollution en Méditerranée — Calanques de Marseille
          </span>
        </motion.h1>

        {/* Section éditoriale SEO — vidéaste engagé & légitimité médiatique */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Documenter l'urgence : L'action en immersion
            </h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              Si la photographie d'art sublime nos paysages, la vidéo est le témoin brut de notre
              combat quotidien. En tant que vidéaste sous-marin, je filme en immersion totale et en
              direct nos opérations de dépollution avec{' '}
              <strong className="text-ocean-teal">Team Oxygen</strong>. Ces images d'action
              documentent l'extraction physique des déchets dans les Calanques et révèlent sans
              filtre l'état critique de la Méditerranée. Ce travail de terrain, reconnu pour son
              impact visuel et militant, m'a conduit à être suivi et diffusé par des médias majeurs
              tels que la chaîne <strong className="text-white">ARTE</strong>, l'émission{' '}
              <strong className="text-white">Échappées Belles</strong>, ainsi que par{' '}
              <strong className="text-white">Green Got</strong>. Mon objectif&nbsp;: utiliser la
              force du reportage pour mobiliser massivement face à l'urgence environnementale.
            </p>
          </motion.div>
        </motion.div>

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
                  type: 'youtube',
                  url: `https://www.youtube.com/watch?v=${video.id}`,
                  embed_id: video.id,
                  title: video.title,
                }}
              />

              {/* Video Info */}
              <div className="p-4">
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
          className="max-w-4xl mx-auto mt-16 mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Les Vidéos
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                De l'immersion en apnée dans les Calanques au reportage diffusé sur ARTE, nos vidéos racontent chaque mission de dépollution. Images tournées sous l'eau, témoignages de terrain, rétrospectives annuelles — chaque format documente une réalité que l'œil nu ne peut pas toujours atteindre.
              </p>
              <p>
                Retrouvez l'intégralité de nos productions sur notre chaîne YouTube, mise à jour après chaque mission.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="https://www.youtube.com/@dark.massilia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
              >
                Voir sur YouTube
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link
            to="/"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'Accueil</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Videos;
