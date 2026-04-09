import { motion } from 'framer-motion';
import { ArrowLeft, Youtube, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import YouTubeFacade from '../components/media/YouTubeFacade';

const Arte = () => {
  return (
    <div className="min-h-screen py-32">
      <SEO {...SEO_PAGES['/sauver-marseille-documentaire-arte']} preloadImage="/images/karim-saari-arte-regard-documentaire-calanques-marseille_800w.webp" />
      <div className="container-custom">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-12"
        >
          <motion.h1
            variants={FADE_IN_UP}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Documentaire ARTE — Pollution : Il faut sauver Marseille et ses Calanques
          </motion.h1>

          <motion.p
            variants={FADE_IN_UP}
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-8"
          >
            Regardez le reportage intégral sur la Méditerranée et l'engagement des éco-acteurs.
          </motion.p>

          {/* YouTube Video Embed */}
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-2xl overflow-hidden border border-white/10 mb-12"
          >
            <YouTubeFacade
              videoId="cxjAQtSHHyI"
              title="Documentaire ARTE — Pollution : Il faut sauver Marseille et ses Calanques"
            />
          </motion.div>
        </motion.div>

        {/* Mission Summary */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6">
              Résumé du reportage ARTE Regards
            </p>
            <div className="space-y-6 text-text-secondary leading-relaxed border-l-2 border-white/10 pl-6">
              <p>
                Marseille, deuxième ville de France, mais en bas du classement pour sa gestion des déchets. Des ordures qui finissent souvent... en mer. Face à l'ampleur du problème, des habitants ont décidé de s'attaquer eux-mêmes au problème.
              </p>

              <p>
                Les Calanques sont le terrain d'action préféré de <strong className="text-white font-semibold">Karim</strong>. Lorsqu'il n'est pas dans son bureau de contrôleur de gestion, ce cinquantenaire passe son temps sous l'eau et sur les chemins de randonnées. <strong className="text-white font-semibold">Apnéiste</strong> depuis des années, il a rejoint un club local il y a trois ans. S'il pensait au départ admirer la beauté des fonds marins, il se confronte très vite aux canettes de Coca Cola et aux milliers de détritus. Les sorties <strong className="text-white font-semibold">"dépollutions"</strong> commencent, très physiques. Avec sa Gopro, il documente les dizaines de kilos d'objets remontés. Ses photos rejoignent celles du littoral, lui aussi pollué. Son objectif ? Sensibiliser le public sur les réseaux sociaux et lors d'expositions.
              </p>

              <p>
                Eric et Isabelle, eux, ont fait du combat contre les déchets leur métier mais avec des approches très différentes. Sous ses lunettes de soleil, le jeune Eric croit en une mobilisation festive. Armé d'un mégaphone, il écume les festivals et rassemble des centaines de Marseillais pour des opération <strong className="text-white font-semibold">"dépollutions"</strong> où la danse et la bonne humeur sont toujours de mise. Mais la clef pour lui est ailleurs. Avec l'association qu'il a créée, <strong className="text-white font-semibold">Clean My Calanques</strong>, il parcourt les écoles pour convaincre les enfants de ne pas reproduire les comportements de leurs aînés.
              </p>

              <p>
                En complément de ces méthodes, Isabelle a choisi la science. Lorsqu'elle arrive à Marseille en 2000, elle est jeune chercheuse en biologie marine. Atterrée par ce qu'elle voit, elle constate que les déchets sauvages ne sont alors pas considérés comme une pollution. Elle s'engouffre dans le sujet, écrit une thèse, et développe une méthodologie de caractérisation pour tenter d'identifier sources et responsables. Un long chemin pour cette écologue, comme pour Eric et Karim. Mais ensemble et grâce aux centaines de citoyens qui les accompagnent, <strong className="text-ocean-teal font-semibold">ils sont déterminés. Marseille doit être sauvée !</strong>
              </p>
            </div>
            <p className="text-xs text-text-muted italic mt-8">
              — Extrait du commentaire du documentaire <em>ARTE Regards</em>, diffusé en 2024
            </p>
          </motion.div>
        </motion.div>

        {/* Additional Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center"
        >
          <motion.h2
            variants={FADE_IN_UP}
            className="text-sm uppercase tracking-widest text-text-muted mb-6 font-semibold"
          >
            Plus de contenu ARTE
          </motion.h2>

          <motion.a
            variants={FADE_IN_UP}
            href="https://www.youtube.com/user/arte"
            target="_blank"
            rel="noopener noreferrer"
            className="btn inline-flex items-center justify-between group max-w-md mx-auto hover:scale-105 transition-all duration-300"
          >
            <span>Chaîne YouTube ARTE</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Bloc éditorial + photo — bas de page */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mt-12 mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                ARTE met les Calanques à l'honneur
              </h2>
              <p className="text-text-secondary leading-[1.8] text-lg mb-4">
                En 2024, la chaîne culturelle européenne{' '}
                <strong className="text-white">ARTE</strong> a consacré un reportage aux éco-acteurs
                marseillais mobilisés contre la pollution plastique en Méditerranée. Au cœur du
                documentaire : <strong className="text-ocean-teal">Karim Saari</strong>, apnéiste et
                photographe sous-marin, engagé au sein de{' '}
                <strong className="text-ocean-teal">Team Oxygen</strong> et impliqué dès la première
                édition du <strong className="text-ocean-teal">Projet Sentinelle</strong>.
              </p>
              <p className="text-text-secondary leading-[1.8] text-lg">
                Ses plongées en apnée dans les Calanques de Marseille — entre 0 et 20 mètres de
                profondeur — documentent une réalité brute : canettes, filets, plastiques et déchets
                piégés dans les herbiers de posidonie. Cette diffusion à l'échelle européenne a donné
                une visibilité accrue aux missions de dépollution et contribué à sensibiliser un large
                public à l'urgence de la{' '}
                <strong className="text-white">pollution marine en Méditerranée</strong>.
              </p>
            </div>
            {/* Photo */}
            <div className="lg:w-[42%] flex-shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden">
              <picture>
                <source
                  srcSet="/images/karim-saari-arte-regard-documentaire-calanques-marseille_800w.webp 800w, /images/karim-saari-arte-regard-documentaire-calanques-marseille.webp 1440w"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  type="image/webp"
                />
                <img
                  src="/images/karim-saari-arte-regard-documentaire-calanques-marseille.jpg"
                  alt="Karim Saari dans le reportage ARTE Regards — Pollution marine à Marseille"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  fetchPriority="high"
                  width="800"
                  height="1000"
                />
              </picture>
            </div>
          </motion.div>
        </motion.div>

        {/* CTAs — Continuer la navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/depollution-marine"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Nos missions de dépollution</span>
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link
            to="/videos"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <span>Voir tous les documentaires</span>
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            to="/presse"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span>Retour aux Médias</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Arte;
