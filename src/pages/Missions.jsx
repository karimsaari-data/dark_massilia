import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

const Missions = () => {
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
            Projet <span className="gradient-text">Sentinelle</span>
          </motion.h1>

          <motion.p
            variants={FADE_IN_UP}
            className="text-text-secondary text-lg max-w-3xl mx-auto mb-8"
          >
            Une fois par an, à l'automne, nous organisons une grande dépollution d'une semaine en apnée dans les Calanques de Marseille, de 0 à 20 mètres de profondeur.
          </motion.p>
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

          {/* Stats */}
          <motion.div
            variants={FADE_IN_UP}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { label: 'Déchets collectés', value: '450 kg', color: '#21c47b' },
              { label: 'Heures de plongée', value: '35h', color: '#0091ff' },
              { label: 'Participants', value: '12', color: '#ff6b35' },
              { label: 'Profondeur max', value: '20m', color: '#ffd93d' },
            ].map((stat, index) => (
              <div key={index} className="glass-strong rounded-2xl p-6 text-center">
                <p
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={FADE_IN_UP} className="text-center">
            <p className="text-text-secondary mb-6">
              Cette galerie retrace nos actions terrain dans le Parc National des Calanques de Marseille.
            </p>
            <a
              href="https://www.facebook.com/groups/calanque/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <span>Rejoindre le Groupe Facebook</span>
            </a>
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
