import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

const Videos = () => {
  const videos = [
    {
      id: 'cxjAQtSHHyI',
      title: 'Documentaire ARTE',
      description: 'Reportage sur les actions de dépollution en Méditerranée',
      url: 'https://www.youtube.com/watch?v=cxjAQtSHHyI'
    },
    {
      id: 'XHqB603STuw',
      title: 'Projet Sentinelle Frioul',
      description: 'Mission de dépollution dans l\'archipel du Frioul',
      url: 'https://youtu.be/XHqB603STuw'
    },
    {
      id: 'a3nw8N7_lhI',
      title: 'Pollution des Plages du Prado',
      description: 'Documentation de la pollution sur les plages marseillaises',
      url: 'https://youtu.be/a3nw8N7_lhI'
    },
    {
      id: '-EwJUePiAdk',
      title: 'Une Année d\'Action',
      description: 'Rétrospective de nos actions environnementales',
      url: 'https://youtu.be/-EwJUePiAdk'
    },
    {
      id: 'AkOFh9rwT0g',
      title: 'Plage du Prado',
      description: 'Nettoyage et sensibilisation au Prado',
      url: 'https://youtu.be/AkOFh9rwT0g'
    },
    {
      id: 'rYza88fs76k',
      title: 'Une Année d\'Action',
      description: 'Bilan annuel de nos missions de dépollution',
      url: 'https://youtu.be/rYza88fs76k'
    },
    {
      id: '9OEa85XS5nU',
      title: 'Quai Marcel Pagnol',
      description: 'Action de nettoyage au Quai Marcel Pagnol',
      url: 'https://youtu.be/9OEa85XS5nU'
    },
    {
      id: 'oq_ACgCB53A',
      title: 'Une Année d\'Action 2021',
      description: 'Rétrospective 2021 de nos actions',
      url: 'https://youtu.be/oq_ACgCB53A'
    },
    {
      id: '7aJ4UHEHf_A',
      title: 'Embouchure de l\'Huveaune',
      description: 'Mission de dépollution à l\'embouchure de l\'Huveaune',
      url: 'https://youtu.be/7aJ4UHEHf_A'
    }
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="container-custom">
        {/* Header avec lien */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="text-center mb-6">
            <a
              href="https://www.youtube.com/@dark.massilia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-lg font-medium"
            >
              Voir sur YouTube
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Video Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {videos.map((video, index) => (
            <motion.div
              key={index}
              variants={FADE_IN_UP}
              className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group"
            >
              {/* YouTube Embed */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

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
