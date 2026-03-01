import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const Missions = () => {
  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/depollution-marine']} />
      <div className="container-custom">
        {/* H1 SEO — visible, keyword-rich */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-12 leading-tight"
        >
          Team Oxygen — Dépollution en apnée à Marseille
          <span className="block text-xl md:text-2xl font-medium text-ocean-teal mt-3">
            Littoral marseillais · Côte Bleue · Calanques · Frioul · La Ciotat · Méditerranée
          </span>
        </motion.h1>

        {/* Mission Description */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Notre mission sur le littoral méditerranéen
            </h2>

            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p className="font-medium text-white/80">
                Association d'apnéistes éco-engagés basée à Marseille et intervenant sur l'ensemble du littoral marseillais : plages, ports, îles du Frioul, Calanques, Côte Bleue et jusqu'à La Ciotat.
              </p>
              <p>
                De la surface à 20 mètres de profondeur, <strong className="text-ocean-teal">Team Oxygen</strong> conduit des opérations structurées de dépollution sous-marine en apnée, combinant extraction de déchets, documentation visuelle et collecte de données environnementales sur les fonds marins de Méditerranée.
              </p>
              <p>
                L'association est aujourd'hui présidée par <strong className="text-white">Karim Saari</strong>, apnéiste et photographe engagé à Marseille, impliqué dans les actions de dépollution du littoral méditerranéen depuis 10 ans.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Éditions - 4 années */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div
            variants={FADE_IN_UP}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
        </motion.div>

        {/* Section éditoriale SEO — contexte local Calanques / Côte Bleue */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Agir à la source : Les Calanques et la Côte Bleue
            </h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              L'urgence est à nos portes&nbsp;: 80&nbsp;% des déchets marins proviennent de la terre.
              L'impact sur notre littoral est massif. À titre d'exemple, lors du bilan 2023 de
              l'opération Calanques Propres, 119&nbsp;m³ de déchets ont été récoltés sur le seul
              littoral marseillais. Parmi les polluants les plus présents dans nos filets&nbsp;: les
              bouteilles en verre, les canettes, les bouteilles en plastique et divers emballages.
              Avec <strong className="text-ocean-teal">Team Oxygen</strong>, chaque immersion en
              apnée est une action directe pour soustraire ces polluants de notre biodiversité locale.
            </p>
            <div className="mt-6">
              <Link
                to="/donnees-scientifiques"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
              >
                Sources scientifiques
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Header avec lien Team Oxygen */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-8"
        >
          <motion.div variants={FADE_IN_UP} className="text-center">
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

        {/* Description galerie */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-text-secondary">
            Cette galerie retrace nos actions terrain dans le Parc National des Calanques de Marseille.
          </p>
        </motion.div>

        {/* Voir aussi — maillage interne */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-8"
        >
          <p className="text-text-secondary text-sm mb-3">Nos missions en images et en vidéo</p>
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium"
          >
            <span>Voir nos documentaires & vidéos de mission</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
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
