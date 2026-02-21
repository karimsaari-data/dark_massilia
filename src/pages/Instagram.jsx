import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import InstagramFeed from '../components/ui/InstagramFeed';
import InstagramStats from '../components/ui/InstagramStats';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const Instagram = () => {
  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/instagram']} />
      <div className="container-custom">
        {/* Section éditoriale SEO — autorité communautaire & engagement citoyen */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Une communauté de plus de 130&nbsp;000 sentinelles
            </h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              La protection de la Méditerranée ne se fait pas seul&nbsp;: elle nécessite une
              mobilisation collective et quotidienne. Aujourd'hui, les actions de{' '}
              <strong className="text-ocean-teal">Dark Massilia</strong> et du{' '}
              <strong className="text-ocean-teal">Projet Sentinelle</strong> fédèrent une
              communauté de plus de <strong className="text-white">130&nbsp;000 citoyens
              engagés</strong> à travers les réseaux sociaux. De nos reportages en immersion sur{' '}
              <strong className="text-white">YouTube</strong> à nos alertes environnementales sur{' '}
              <strong className="text-white">Instagram</strong> (24,2K) et{' '}
              <strong className="text-white">TikTok</strong> (21,9K), notre écho numérique se
              traduit par des actes concrets sur le terrain. À travers l'animation du groupe
              incontournable des{' '}
              <strong className="text-white">Amoureux des Calanques</strong> (plus de
              64&nbsp;000&nbsp;membres) et notre présence sur{' '}
              <strong className="text-white">Facebook</strong> (près de 18&nbsp;000 abonnés
              cumulés) ou <strong className="text-white">X</strong>, nous interpellons et informons
              en temps réel. Cette audience massive n'est pas qu'une statistique&nbsp;: c'est une
              véritable force d'action citoyenne, vitale pour la préservation de notre littoral
              marseillais.
            </p>
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

        {/* Description — bas de page */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mt-12 mb-12"
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
      </div>
    </div>
  );
};

export default Instagram;
