import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

const Medias = () => {
  // Données extraites de l'ancien site medias.html
  const pressLinks = [
    {
      title: 'Ville de Marseille — Reconnaissance Officielle',
      url: 'https://www.facebook.com/marseilleville/photos/a.220707724621813/3697054720320412/?_rdr',
      featured: true,
    },
    {
      title: 'La Provence — Opération Sentinelle',
      url: 'https://www.laprovence.com/article/ecoplanete/1845794554454214/de-montredon-a-cassis-les-apneistes-lancent-leur-operation-sentinelle-des-samedi-et-jusquau-6-octobre',
      featured: true,
    },
    {
      title: 'Documentaire ARTE',
      url: '/arte',
      internal: true,
      featured: true,
    },
    {
      title: 'Interview Presse — Tired Earth (EN/FR)',
      url: 'https://www.tiredearth.com/interviews/interview-de-karim-saari-apneiste-et-photographe-sous-marin#',
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen py-32">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-16"
        >
          <motion.h1
            variants={FADE_IN_UP}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Ressources Presse & <span className="gradient-text">Médias</span>
          </motion.h1>

          <motion.p
            variants={FADE_IN_UP}
            className="text-text-secondary text-lg max-w-2xl mx-auto"
          >
            Retrouvez ici les reportages et articles de presse réalisés sur le Projet Sentinelle et l'action de Dark Massilia.
          </motion.p>
        </motion.div>

        {/* Section: À la une */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-3xl mx-auto"
        >
          <motion.h2
            variants={FADE_IN_UP}
            className="text-sm uppercase tracking-widest text-text-muted mb-6 font-semibold text-center"
          >
            À la une
          </motion.h2>

          <motion.div variants={STAGGER_CONTAINER} className="space-y-4">
            {pressLinks.map((link, index) => (
              <motion.div key={index} variants={FADE_IN_UP}>
                {link.internal ? (
                  <Link
                    to={link.url}
                    className={`btn ${link.featured ? 'font-semibold' : ''} w-full inline-flex items-center justify-between group hover:scale-105 transition-all duration-300`}
                  >
                    <span>{link.title}</span>
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn ${link.featured ? 'font-semibold' : ''} w-full inline-flex items-center justify-between group hover:scale-105 transition-all duration-300`}
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                )}
              </motion.div>
            ))}
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

export default Medias;
