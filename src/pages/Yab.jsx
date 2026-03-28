import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
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
              srcSet="/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_400w.webp 400w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_800w.webp 800w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_1200w.webp 1200w"
              sizes="(max-width: 480px) 100vw, (max-width: 900px) 100vw, 1200px"
              alt="Team Oxygen à Marseille — Portrait par Yann Arthus-Bertrand pour le projet Les Français (2024)"
              className="w-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              width="1920"
              height="1281"
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
            <div className="pt-6 border-t border-white/8">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-4 font-semibold">
                Découvrir le projet
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://www.yabstudio.fr/portfolio/marseille-2024/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn inline-flex items-center gap-2 group hover:scale-105 transition-all duration-300"
                >
                  <span>« Les Français » — Yann Arthus-Bertrand</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0" />
                </a>
                <Link
                  to="/presse"
                  className="btn-secondary inline-flex items-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Retour aux Médias</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Cluster interne ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 text-sm"
        >
          <Link to="/depollution-marine" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
            Nos missions de dépollution <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/photographie-sous-marine" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
            Galerie photos sous-marines <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/communaute" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
            Rejoindre la communauté <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Yab;
