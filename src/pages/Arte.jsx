import { motion } from 'framer-motion';
import { ArrowLeft, Youtube, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

const Arte = () => {
  return (
    <div className="min-h-screen py-32">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-12"
        >
          <motion.h1
            variants={FADE_IN_UP}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Documentaire <span className="gradient-text">ARTE</span>
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
            <div className="relative aspect-video bg-black">
              <iframe
                src="https://www.youtube.com/embed/cxjAQtSHHyI"
                title="Documentaire ARTE"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Mission Summary */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl p-8 md:p-12 mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="space-y-6 text-text-secondary leading-relaxed">
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

        {/* Back to Medias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            to="/medias"
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

export default Arte;
