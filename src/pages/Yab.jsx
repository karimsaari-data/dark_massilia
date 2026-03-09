import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const Yab = () => {
  return (
    <div className="min-h-screen py-32">
      <SEO {...SEO_PAGES['/les-francais-yann-arthus-bertrand']} />
      <div className="container-custom">

        {/* H1 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-12 max-w-4xl mx-auto"
        >
          <motion.h1
            variants={FADE_IN_UP}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            « Les Français » —{' '}
            <span className="gradient-text">Yann Arthus-Bertrand</span>
          </motion.h1>

          <motion.p
            variants={FADE_IN_UP}
            className="text-text-secondary text-lg max-w-2xl mx-auto"
          >
            Team Oxygen à l'honneur dans le projet photographique de YAB — Marseille, 2024.
          </motion.p>
        </motion.div>

        {/* Photo principale — pleine largeur container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="relative w-full">
            <img
              src="/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp"
              alt="Team Oxygen à Marseille — Portrait par Yann Arthus-Bertrand pour le projet Les Français (2024)"
              className="w-full object-cover"
              loading="eager"
              decoding="async"
            />
            {/* Crédit photo */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-white/60 text-xs font-medium text-right">
                © Yann Arthus-Bertrand
              </p>
            </div>
          </motion.div>

          {/* Texte sous la photo */}
          <motion.div
            variants={FADE_IN_UP}
            className="p-8 md:p-12 space-y-5 text-text-secondary leading-relaxed max-w-4xl mx-auto"
          >
            <p>
              Ce portrait de la{' '}
              <strong className="text-ocean-teal">Team Oxygen</strong> a été réalisé par{' '}
              <strong className="text-white">Yann Arthus-Bertrand</strong>, figure majeure de la
              photographie contemporaine et pionnier du regard environnemental porté sur notre
              planète.
            </p>
            <p>
              Photographe de paysages depuis mon adolescence, j'ai grandi avec ses images. Son
              travail a profondément façonné ma vision : raconter un territoire, révéler sa beauté,
              mais surtout montrer sa fragilité. À ce titre, il représente pour moi un véritable{' '}
              <strong className="text-white">mentor artistique</strong>.
            </p>
            <p>
              Lorsque la production m'a contacté pour participer au shooting, l'évidence s'est
              imposée immédiatement : réaliser cette photo avec la{' '}
              <strong className="text-ocean-teal">Team Oxygen</strong>. Parce que notre engagement
              pour la <strong className="text-white">Méditerranée</strong>, nos actions de
              dépollution et notre ancrage marseillais résonnent directement avec la démarche
              humaniste et écologique qu'il défend depuis des décennies.
            </p>
            <p>
              Ce cliché dépasse le simple portrait. Il symbolise une{' '}
              <strong className="text-white">transmission</strong> : celle d'un regard, d'une
              exigence et d'un engagement au service des océans.
            </p>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <motion.h2
            variants={FADE_IN_UP}
            className="text-sm uppercase tracking-widest text-text-muted mb-6 font-semibold"
          >
            Découvrir le projet
          </motion.h2>

          <motion.a
            variants={FADE_IN_UP}
            href="https://www.yabstudio.fr/portfolio/marseille-2024/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn inline-flex items-center justify-between group max-w-md mx-auto hover:scale-105 transition-all duration-300"
          >
            <span>« Les Français » — Yann Arthus-Bertrand</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0 ml-3" />
          </motion.a>
        </motion.div>

        {/* Back to Medias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Link
            to="/presse"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour aux Médias</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Yab;
