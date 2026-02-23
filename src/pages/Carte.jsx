import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

// Fix leaflet default icons (webpack/vite issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icônes personnalisées
const landscapeIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 28px; height: 28px;
    background: #21c47b;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(33,196,123,0.7);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

const wasteIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 28px; height: 28px;
    background: #ef4444;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(239,68,68,0.7);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

// Centrage automatique sur tous les marqueurs
function FitBounds({ photos }) {
  const map = useMap();
  useEffect(() => {
    if (photos.length > 0) {
      const bounds = L.latLngBounds(photos.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [photos, map]);
  return null;
}

const MARSEILLE_CENTER = [43.2965, 5.3698];

export default function Carte() {
  const [photos, setPhotos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'landscape' | 'waste'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      const { data, error } = await supabase
        .from('map_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setPhotos(data || []);
        setFiltered(data || []);
      }
      setLoading(false);
    }
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFiltered(photos);
    } else {
      setFiltered(photos.filter(p => p.type === filter));
    }
  }, [filter, photos]);

  const counts = {
    all: photos.length,
    landscape: photos.filter(p => p.type === 'landscape').length,
    waste: photos.filter(p => p.type === 'waste').length,
  };

  return (
    <>
      <SEO
        title="Carte des Sites — Dark Massilia | Karim Saari"
        description="Cartographie interactive des sites de plongée, zones polluées et spots naturels des Calanques de Marseille documentés par Dark Massilia."
        url="https://karimsaari.com/carte"
      />

      <div className="min-h-screen pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container-custom pt-4 pb-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Carte des Sites
          </h1>
          <p className="text-text-secondary text-lg mb-6">
            Calanques de Marseille — zones documentées en apnée
          </p>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { key: 'all', label: 'Tous les sites', color: 'ocean-teal' },
              { key: 'landscape', label: '🟢 Paysages', color: 'green' },
              { key: 'waste', label: '🔴 Pollution', color: 'red' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  filter === key
                    ? 'bg-ocean-teal/20 border-ocean-teal/50 text-ocean-teal shadow-lg shadow-ocean-teal/20'
                    : 'glass border-white/10 text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
                <span className="ml-2 text-xs opacity-60">({counts[key]})</span>
              </button>
            ))}
          </div>

          {/* Légende */}
          <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-4">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#21c47b] shadow-[0_0_6px_rgba(33,196,123,0.8)] inline-block"></span>
              Paysage / Faune
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)] inline-block"></span>
              Zone polluée / Déchet
            </span>
          </div>
        </motion.div>

        {/* Carte */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
          style={{ height: 'calc(100vh - 320px)', minHeight: '420px' }}
        >
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="spinner" />
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <div className="glass rounded-xl p-6 text-center max-w-md">
                <p className="text-red-400 mb-2">Erreur de chargement</p>
                <p className="text-text-secondary text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={MARSEILLE_CENTER}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.length > 0 && <FitBounds photos={filtered} />}
              {filtered.map(photo => (
                <Marker
                  key={photo.id}
                  position={[photo.lat, photo.lng]}
                  icon={photo.type === 'landscape' ? landscapeIcon : wasteIcon}
                  eventHandlers={{ click: () => setSelected(photo) }}
                >
                  <Popup>
                    <div className="text-sm" style={{ minWidth: '200px' }}>
                      {photo.photo_url && (
                        <img
                          src={photo.photo_url}
                          alt={photo.title}
                          className="w-full h-32 object-cover rounded mb-2"
                          style={{ borderRadius: '6px', marginBottom: '8px' }}
                        />
                      )}
                      <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                        {photo.title}
                      </strong>
                      {photo.description && (
                        <span style={{ color: '#666', fontSize: '12px' }}>
                          {photo.description}
                        </span>
                      )}
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '6px',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          background: photo.type === 'landscape' ? '#21c47b22' : '#ef444422',
                          color: photo.type === 'landscape' ? '#21c47b' : '#ef4444',
                          border: `1px solid ${photo.type === 'landscape' ? '#21c47b44' : '#ef444444'}`,
                        }}
                      >
                        {photo.type === 'landscape' ? '🟢 Paysage' : '🔴 Pollution'}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </motion.div>

        {/* Message si vide */}
        {!loading && !error && filtered.length === 0 && (
          <div className="container-custom py-8 text-center">
            <p className="text-text-secondary">
              Aucun site pour ce filtre. Les données seront ajoutées prochainement.
            </p>
          </div>
        )}

        {/* Info SQL pour admin */}
        {!loading && !error && photos.length === 0 && (
          <div className="container-custom py-4">
            <div className="glass rounded-xl p-4 border border-ocean-teal/20 text-sm text-text-secondary">
              <p className="font-medium text-ocean-teal mb-2">ℹ️ Aucun site enregistré</p>
              <p>Ajoute des entrées dans la table <code className="text-white bg-white/10 px-1 rounded">map_photos</code> de Supabase.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
