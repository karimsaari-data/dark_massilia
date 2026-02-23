import { motion } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const MAP_ID = '1fu2q9DRyD80m11ejdp8Ivuj5vn2aguM';
const EMBED_URL = `https://www.google.com/maps/d/embed?mid=${MAP_ID}&ehbc=2E312F`;
const FULL_URL  = `https://www.google.com/maps/d/viewer?mid=${MAP_ID}`;

export default function Carte() {
  return (
    <>
      <SEO
        title="Carte des Sites — Dark Massilia | Karim Saari"
        description="Cartographie interactive des sites de plongée, zones polluées et spots naturels des Calanques de Marseille documentés par Dark Massilia."
        url="https://karimsaari.com/carte"
      />

      <div className="min-h-screen pt-20 flex flex-col">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container-custom pt-4 pb-3 flex items-center justify-between flex-wrap gap-3"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Carte des Sites
            </h1>
            <p className="text-text-secondary">
              Marseille &amp; Calanques — 133 lieux documentés
            </p>
          </div>

          <a
            href={FULL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-text-secondary text-sm hover:text-white hover:border-white/30 transition-all duration-200"
          >
            <MapPin className="w-4 h-4" />
            Ouvrir dans Maps
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </motion.div>

        {/* Carte Google My Maps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full"
          style={{
            overflow: 'hidden',
            minHeight: '520px',
            height: 'calc(100vh - 160px)',
          }}
        >
          {/* marginTop négatif pour masquer la barre grise native de l'embed (~54px) */}
          <iframe
            src={EMBED_URL}
            title="Carte des sites — Dark Massilia Karim Saari"
            width="100%"
            style={{
              border: 'none',
              display: 'block',
              marginTop: '-54px',
              height: 'calc(100% + 54px)',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

      </div>
    </>
  );
}
