import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import InstagramFeed from '../components/ui/InstagramFeed';
import InstagramStats from '../components/ui/InstagramStats';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

const Instagram = () => {
  return (
    <div className="min-h-screen py-24">
      <div className="container-custom">
        {/* Description */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Instagram
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Sur Instagram, je partage les coulisses de chaque mission : les plongées en apnée, les déchets remontés, la faune des Calanques et les paysages du littoral marseillais. Un fil qui documente au plus près la réalité de notre Méditerranée.
              </p>
              <p>
                Suivez les actions du Projet Sentinelle au quotidien sur <strong className="text-ocean-teal">@karimsaari</strong>.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="https://www.instagram.com/karimsaari"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
              >
                Voir sur Instagram
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Statistiques Instagram */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP}>
            <InstagramStats />
          </motion.div>
        </motion.div>

        {/* Full Width Photo Wall */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP}>
            <InstagramFeed limit={9} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Instagram;
