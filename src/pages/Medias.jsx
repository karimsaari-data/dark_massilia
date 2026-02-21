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
      image: '/images/ville de marseille.webp'
    },
    {
      title: 'La Provence — Opération Sentinelle',
      url: 'https://www.laprovence.com/article/ecoplanete/1845794554454214/de-montredon-a-cassis-les-apneistes-lancent-leur-operation-sentinelle-des-samedi-et-jusquau-6-octobre',
      featured: true,
      image: '/images/la provence.webp'
    },
    {
      title: 'Documentaire ARTE',
      url: '/arte',
      internal: true,
      featured: true,
      image: '/images/photo profil Arte.webp'
    },
    {
      title: 'Interview Presse — Tired Earth (EN/FR)',
      url: 'https://www.tiredearth.com/interviews/interview-de-karim-saari-apneiste-et-photographe-sous-marin#',
      featured: false,
      image: '/images/tiredearth.webp'
    },
  ];

  return (
    <div className="min-h-screen py-32">
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
              Couverture Médiatique
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Du documentaire <strong className="text-ocean-teal">ARTE</strong> diffusé à l'échelle européenne aux articles de <em>La Provence</em>, en passant par la reconnaissance officielle de la Ville de Marseille, le travail de Dark Massilia et du Projet Sentinelle a été relayé par de nombreux médias.
              </p>
              <p>
                Ces couvertures témoignent de l'impact concret de nos missions et contribuent à sensibiliser le grand public à la pollution des fonds marins méditerranéens.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Section: À la une */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            variants={FADE_IN_UP}
            className="text-sm uppercase tracking-widest text-text-muted mb-8 font-semibold text-center"
          >
            À la une
          </motion.h2>

          <motion.div
            variants={STAGGER_CONTAINER}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {pressLinks.map((link, index) => (
              <motion.div key={index} variants={FADE_IN_UP}>
                {link.internal ? (
                  <Link
                    to={link.url}
                    className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      <img
                        src={link.image}
                        alt={link.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-ocean-teal transition-colors flex items-center justify-between">
                        <span>{link.title}</span>
                        <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                      </h3>
                    </div>
                  </Link>
                ) : (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      <img
                        src={link.image}
                        alt={link.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-ocean-teal transition-colors flex items-center justify-between">
                        <span>{link.title}</span>
                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0 ml-2" />
                      </h3>
                    </div>
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
