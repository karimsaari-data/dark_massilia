import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const Twitter = () => {
  useEffect(() => {
    // Load Twitter widgets script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/actualites']} />
      <div className="container-custom">

        {/* Section éditoriale SEO — veille environnementale & actualité marine */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Actualités du Projet Sentinelle en temps réel
            </h1>
            <p className="text-text-secondary leading-relaxed text-lg">
              Sur <strong className="text-white">X (ex-Twitter)</strong>, le compte{' '}
              <strong className="text-ocean-teal">@dark_massilia</strong> est le fil direct des
              actions de terrain du{' '}
              <strong className="text-ocean-teal">Projet Sentinelle</strong> : annonces de missions,
              bilans de dépollution, alertes environnementales et partage de données scientifiques
              sur la pollution plastique en{' '}
              <strong className="text-white">Méditerranée</strong>. C'est aussi un espace de veille
              sur les enjeux de protection du littoral marseillais et des{' '}
              <strong className="text-white">Calanques de Marseille</strong> — un terrain d'action
              au cœur du Parc National. Chaque post est une prise de parole engagée, relayant les
              avancées de <strong className="text-ocean-teal">Team Oxygen</strong> et les
              initiatives citoyennes pour la préservation de notre patrimoine naturel marin.
            </p>
          </motion.div>
        </motion.div>

        {/* Header avec lien */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="text-center mb-6">
            <a
              href="https://x.com/dark_massilia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-lg font-medium"
            >
              Voir sur X
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Twitter Feed */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP}>
            <div className="glass-strong rounded-2xl overflow-hidden border border-white/10 p-6 flex justify-center">
              <blockquote
                className="twitter-tweet"
                data-lang="fr"
                data-theme="dark"
                data-dnt="true"
              >
                <p lang="fr" dir="ltr">Chargement du tweet...</p>
                <a href="https://twitter.com/dark_massilia/status/1954162961947230533?ref_src=twsrc%5Etfw">February 5, 2025</a>
              </blockquote>
            </div>
          </motion.div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
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

export default Twitter;
