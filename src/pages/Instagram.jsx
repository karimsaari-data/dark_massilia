import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import InstagramFeed from '../components/ui/InstagramFeed';
import InstagramStats from '../components/ui/InstagramStats';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

const Instagram = () => {
  return (
    <div className="min-h-screen py-24">
      <div className="container-custom">
        {/* Header avec statistiques */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="text-center mb-6">
            <a
              href="https://www.instagram.com/karimsaari"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-lg font-medium"
            >
              Voir sur Instagram
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>

          {/* Statistiques Instagram */}
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
