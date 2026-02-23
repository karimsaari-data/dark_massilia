import { motion } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const MAP_ID = '1fu2q9DRyD80m11ejdp8Ivuj5vn2aguM';
const EMBED_URL = `https://www.google.com/maps/d/embed?mid=${MAP_ID}&ehbc=2E312F`;
const FULL_URL  = `https://www.google.com/maps/d/viewer?mid=${MAP_ID}`;

export default function Carte() {
  return (
    <>
      <SEO {...SEO_PAGES['/carte']} />

      {/* Carte plein écran — mode immersif */}
      <div style={{ position: 'relative', height: '100vh', paddingTop: '80px', overflow: 'hidden' }}>

        {/* Carte Google My Maps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', height: '100%', overflow: 'hidden' }}
        >
          <iframe
            src={EMBED_URL}
            title="Carte des sites — Dark Massilia Karim Saari"
            style={{
              position: 'absolute',
              top: '-54px',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: 'calc(100% + 54px)',
              border: 'none',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* Bouton flottant — bas droite */}
        <motion.a
          href={FULL_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 10 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-text-secondary text-sm hover:text-white hover:border-white/30 transition-all duration-200"
        >
          <MapPin className="w-4 h-4" />
          Ouvrir dans Maps
          <ExternalLink className="w-3 h-3 opacity-60" />
        </motion.a>

      </div>
    </>
  );
}
