/**
 * AccesMassifs — Carte en temps réel des accès aux massifs forestiers
 * Route : /acces-massifs-calanques
 * Données : WMS public DFCI Bouches-du-Rhône (opendfci.fr)
 * Vert = massif ouvert · Rouge = massif fermé (risque incendie)
 */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, ExternalLink, Flame, Info, CheckCircle, XCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

// WMS officiel DFCI 13 — paramètres Lizmap dans l'URL
const WMS_URL =
  'https://opendfci.fr/13/index.php/lizmap/service?repository=openmassifs&project=open_massifs';

// Centre sur les Calanques / Bouches-du-Rhône
const CENTER = [43.42, 5.25];
const ZOOM = 10;

export default function AccesMassifs() {
  return (
    <>
      <SEO {...SEO_PAGES['/acces-massifs-calanques']} />

      <div className="min-h-screen py-24">
        <div className="container-custom">

          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-4">
              <Flame className="w-3.5 h-3.5" />
              Mise à jour quotidienne — données officielles DFCI
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              Accès aux massifs forestiers des Calanques
            </h1>
            <p className="text-text-secondary max-w-xl mx-auto">
              Carte officielle du risque incendie en temps réel pour les Bouches-du-Rhône.
              Indispensable avant toute mission de dépollution ou sortie dans les Calanques.
            </p>
          </motion.div>

          {/* Légende */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-4 mb-6"
          >
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-text-secondary">Vert — massif ouvert</span>
            </div>
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm">
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-text-secondary">Rouge — massif fermé</span>
            </div>
            <a
              href="https://www.risque-prevention-incendie.fr/13"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-ocean-teal hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Voir le détail par massif
            </a>
          </motion.div>

          {/* Carte Leaflet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 mb-8"
            style={{ height: '520px' }}
          >
            <MapContainer
              center={CENTER}
              zoom={ZOOM}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <WMSTileLayer
                url={WMS_URL}
                layers="vue_acces_massifs_13"
                format="image/png"
                transparent={true}
                version="1.3.0"
                opacity={0.82}
                attribution='© <a href="https://opendfci.fr/13" target="_blank" rel="noopener">DFCI / opendfci.fr</a>'
              />
            </MapContainer>
          </motion.div>

          {/* Info pratique */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass rounded-2xl p-6 border border-white/8 mb-8"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-ocean-teal flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-text-secondary leading-relaxed">
                <p>
                  <strong className="text-white">Accès aux massifs forestiers</strong> — En période estivale (juin–septembre),
                  la préfecture des Bouches-du-Rhône peut fermer l'accès aux massifs forestiers
                  selon le niveau de risque incendie. La carte est actualisée chaque matin.
                </p>
                <p>
                  Avant chaque mission <strong className="text-ocean-teal">Team Oxygen</strong>, nous
                  vérifions systématiquement l'état d'ouverture des massifs concernés —
                  notamment les Calanques, la Côte Bleue et Marseilleveyre.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href="https://www.risque-prevention-incendie.fr/13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ocean-teal hover:text-white transition-colors font-medium"
                  >
                    risque-prevention-incendie.fr/13
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://opendfci.fr/13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-text-muted hover:text-white transition-colors"
                  >
                    opendfci.fr/13
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              to="/depollution-marine"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Nos missions de dépollution
            </Link>
            <Link
              to="/carte-calanques"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
            >
              Carte de nos interventions
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
