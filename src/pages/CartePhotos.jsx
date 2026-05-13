import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const TILE_URL  = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const MARKER_COLORS = { paysage: '#00ABA8', sous_marine: '#0091ff' };

function markerIcon(type) {
  const c = MARKER_COLORS[type];
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:${c};border:2px solid white;border-radius:50%;box-shadow:0 0 8px ${c}99"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7],
  });
}

function clusterIcon(cluster) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:38px;height:38px;
      background:rgba(11,28,45,0.92);
      border:2px solid rgba(0,171,168,0.7);
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      color:white;font-size:13px;font-weight:700;
      box-shadow:0 0 14px rgba(0,171,168,0.45);
    ">${cluster.getChildCount()}</div>`,
    iconSize: L.point(38, 38),
    iconAnchor: L.point(19, 19),
  });
}

function toThumb(src) {
  if (!src) return src;
  if (src.startsWith('/images/portfolio/New/'))
    return src.replace('/images/portfolio/New/', '/images/portfolio/New/800w/');
  if (src.startsWith('/images/portfolio/'))
    return src.replace(/\/images\/portfolio\/([^/]+)\/([^/]+)$/, '/images/portfolio/$1/800w/$2');
  return src.replace(/^\/images\/([^/]+\.(webp|jpg))$/, '/images/800w/$1');
}

function popupHtml(photo) {
  const c     = MARKER_COLORS[photo.type];
  const base  = photo.type === 'paysage' ? '/photographie-paysage-mer' : '/photographie-sous-marine';
  const href  = photo.uid ? `${base}?photo=${encodeURIComponent(photo.uid)}` : base;
  const thumb = toThumb(photo.src);
  return `
    <div style="padding:14px;width:220px;box-sizing:border-box">
      ${thumb ? `<a href="${href}" style="display:block;margin-bottom:10px"><img src="${thumb}" alt="" loading="lazy"
        style="width:100%;height:130px;object-fit:cover;border-radius:8px;display:block"/></a>` : ''}
      ${photo.title ? `<p style="font-weight:600;font-size:13px;line-height:1.4;margin:0 0 4px;color:white">${photo.title}</p>` : ''}
      ${photo.lieu  ? `<p style="font-size:12px;color:rgba(255,255,255,0.45);margin:0 0 10px">📍 ${photo.lieu}</p>` : ''}
      <a href="${href}" style="
        display:block;text-align:center;padding:6px 12px;
        background:${c}22;border:1px solid ${c}66;
        border-radius:8px;font-size:12px;color:${c};
        text-decoration:none;font-weight:500">
        Voir la photo →
      </a>
    </div>`;
}

/* Composant interne — charge le plugin via import() dynamique (UMD attend L global) */
function ClusterLayer({ photos }) {
  const map = useMap();

  useEffect(() => {
    if (!photos.length) return;
    let group;

    window.L = L; // exposer L globalement pour le plugin UMD
    import('leaflet.markercluster').then(() => {
      group = L.markerClusterGroup({
        iconCreateFunction: clusterIcon,
        maxClusterRadius: 55,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        animate: true,
      });

      photos.forEach(photo => {
        const m = L.marker([photo.lat, photo.lng], { icon: markerIcon(photo.type) });
        m.bindPopup(popupHtml(photo), { minWidth: 220, maxWidth: 240 });
        group.addLayer(m);
      });

      map.addLayer(group);
    });

    return () => { if (group) map.removeLayer(group); };
  }, [map, photos]);

  return null;
}

const POPUP_CSS = `
  .leaflet-cluster-anim .leaflet-marker-icon,
  .leaflet-cluster-anim .leaflet-marker-shadow {
    transition: transform .3s ease-out, opacity .3s ease-in;
  }
  .leaflet-cluster-spider-leg {
    transition: stroke-dashoffset .3s ease-out, stroke-opacity .3s ease-in;
  }
  .leaflet-popup-content-wrapper {
    background: rgba(11,28,45,0.97);
    border: 1px solid rgba(255,255,255,0.12);
    color: white;
    border-radius: 14px;
    backdrop-filter: blur(16px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
    padding: 0;
  }
  .leaflet-popup-content { margin: 0; }
  .leaflet-popup-tip-container { display: none; }
  .leaflet-popup-close-button { color: rgba(255,255,255,0.45) !important; top: 10px !important; right: 10px !important; font-size: 18px !important; }
  .leaflet-popup-close-button:hover { color: white !important; }
  .leaflet-control-zoom a { background: rgba(11,28,45,0.95) !important; color: white !important; border-color: rgba(255,255,255,0.1) !important; }
  .leaflet-control-zoom a:hover { background: rgba(0,171,168,0.2) !important; }
  .leaflet-control-attribution { background: rgba(11,28,45,0.8) !important; color: rgba(255,255,255,0.35) !important; }
  .leaflet-control-attribution a { color: rgba(255,255,255,0.5) !important; }
  .marker-cluster { background: transparent !important; }
`;

export default function CartePhotos() {
  const [photos, setPhotos]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    Promise.all([
      supabase.from('photos_paysage')
        .select('uid,src,title,lieu,lat,lng')
        .eq('visible', true).not('lat','is',null).not('lng','is',null),
      supabase.from('photos_sous_marine')
        .select('uid,src,title,lieu,lat,lng')
        .eq('visible', true).not('lat','is',null).not('lng','is',null),
    ]).then(([{ data: paysage }, { data: sousMarine }]) => {
      setPhotos([
        ...(paysage    || []).map(p => ({ ...p, type: 'paysage'     })),
        ...(sousMarine || []).map(p => ({ ...p, type: 'sous_marine' })),
      ]);
      setLoading(false);
    });
  }, []);

  const filtered        = filter === 'all' ? photos : photos.filter(p => p.type === filter);
  const paysageCount    = photos.filter(p => p.type === 'paysage').length;
  const sousMarineCount = photos.filter(p => p.type === 'sous_marine').length;

  return (
    <>
      <SEO {...SEO_PAGES['/carte-photos']} />
      <style>{POPUP_CSS}</style>

      <section className="container-custom pt-8 pb-4 space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Carte des photos</h1>
          <p className="text-text-secondary text-lg">
            Tous les lieux de prise de vue — Méditerranée, Provence & ailleurs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all',         label: `Tout (${photos.length})`,          color: null         },
            { key: 'paysage',     label: `Paysages (${paysageCount})`,       color: '#00ABA8'    },
            { key: 'sous_marine', label: `Sous-marine (${sousMarineCount})`, color: '#0091ff'    },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${
                filter === key
                  ? 'bg-white/15 border-white/40 text-white'
                  : 'border-white/10 text-text-muted hover:border-white/25 hover:text-white'
              }`}
            >
              {color && (
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                  style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                />
              )}
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Carte pleine largeur */}
      <div style={{ height: '70vh', minHeight: 450 }}>
        {(loading || !isMounted) ? (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <div className="spinner" />
          </div>
        ) : (
          <MapContainer
            center={[43.25, 5.45]}
            zoom={9}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
            <ClusterLayer photos={filtered} />
          </MapContainer>
        )}
      </div>

      <section className="container-custom py-6">
        {!loading && photos.length === 0 && (
          <p className="text-center text-text-muted py-8">Aucune photo géolocalisée disponible pour l'instant.</p>
        )}

        {!loading && photos.length > 0 && (
          <div className="border-t border-white/8 pt-6 space-y-3 text-text-secondary text-sm leading-relaxed max-w-3xl">
            <p>
              Cette carte recense les {photos.length} lieux de prise de vue de Karim Saari — des{' '}
              <a href="/photographie-paysage-mer" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">
                paysages de Provence et du littoral méditerranéen
              </a>{' '}
              aux{' '}
              <a href="/photographie-sous-marine" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">
                photographies sous-marines dans les Calanques de Marseille
              </a>.
              Chaque marqueur correspond à un lieu réel : calanque, épave, spot de plongée ou site naturel.
            </p>
            <p>
              Cliquez sur un marqueur pour voir la photo et accéder directement à l'image dans la galerie.
              Les points <span className="font-medium" style={{ color: '#00ABA8' }}>teal</span> représentent les paysages,
              les points <span className="font-medium" style={{ color: '#0091ff' }}>bleus</span> la photographie sous-marine.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
