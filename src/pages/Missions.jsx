import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

const Missions = () => {
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
              href="https://www.team-oxygen.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-lg font-medium"
            >
              Voir sur Team Oxygen
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Photo Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <PhotoCarousel />
        </motion.div>

        {/* Mission Description */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              La Mission
            </h2>

            <div className="space-y-6 text-text-secondary leading-relaxed">
              <p>
                De 0 à 20 mètres de profondeur, nous documentons et nettoyons les fonds marins. Chaque plongée devient une mission de dépollution.
              </p>

              <p>
                Avec <strong className="text-ocean-teal">Team Oxygen</strong>, nous allions l'apnée sportive à l'action environnementale. Notre objectif : sensibiliser le public sur l'état réel de nos calanques et inspirer le changement.
              </p>
            </div>
          </motion.div>

          {/* Éditions - 4 années */}
          <motion.div
            variants={FADE_IN_UP}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {[
              {
                year: '2022',
                waste: '900 Kg',
                duration: '8 jours',
                location: 'Côte Bleue, de Martigues à l\'Estaque',
                color: '#21c47b'
              },
              {
                year: '2023',
                waste: '1 357 Kg',
                duration: '7 jours',
                location: 'Archipel du Frioul',
                color: '#0091ff'
              },
              {
                year: '2024',
                waste: '1 147 Kg',
                duration: '9 jours',
                location: 'Parc National des Calanques',
                color: '#ff6b35'
              },
              {
                year: '2025',
                waste: '2 320 Kg',
                duration: '7 jours',
                location: 'Rade de Marseille',
                color: '#ffd93d'
              },
            ].map((edition, index) => (
              <div key={index} className="glass-strong rounded-2xl p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: edition.color }}
                  >
                    {edition.year}
                  </h3>
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-bold text-white">{edition.waste}</p>
                    <p className="text-sm text-text-muted">déchets collectés</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium">{edition.duration} d'aventure</p>
                  <p className="text-text-secondary text-sm">{edition.location}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Description */}
          <motion.div variants={FADE_IN_UP} className="text-center">
            <p className="text-text-secondary">
              Cette galerie retrace nos actions terrain dans le Parc National des Calanques de Marseille.
            </p>
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

export default Missions;
