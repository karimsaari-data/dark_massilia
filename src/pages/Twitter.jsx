import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

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
