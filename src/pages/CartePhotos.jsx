import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GestureHandling } from 'leaflet-gesture-handling';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import { locate as leafletLocate } from 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
import 'leaflet.fullscreen/dist/Control.FullScreen.css';
import FullScreenPlugin from 'leaflet.fullscreen';
import 'leaflet.heat/dist/leaflet-heat.js';
import { ChevronLeft, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

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
      ${thumb ? `<a href="${href}" target="_blank" rel="noopener" style="display:block;margin-bottom:10px"><img src="${thumb}" alt="" loading="lazy"
        style="width:100%;height:130px;object-fit:cover;border-radius:8px;display:block"/></a>` : ''}
      ${photo.title ? `<p style="font-weight:600;font-size:13px;line-height:1.4;margin:0 0 4px;color:white">${photo.title}</p>` : ''}
      ${photo.lieu  ? `<p style="font-size:12px;color:rgba(255,255,255,0.45);margin:0 0 10px">📍 ${photo.lieu}</p>` : ''}
      <a href="${href}" target="_blank" rel="noopener" style="
        display:block;text-align:center;padding:6px 12px;
        background:${c}22;border:1px solid ${c}66;
        border-radius:8px;font-size:12px;color:${c};
        text-decoration:none;font-weight:500">
        Voir la photo →
      </a>
    </div>`;
}

function ClusterLayer({ photos }) {
  const map = useMap();

  useEffect(() => {
    if (!photos.length) return;
    let group;

    window.L = L;
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

function HeatLayer({ photos }) {
  const map = useMap();

  useEffect(() => {
    if (!photos.length) return;
    const points = photos.map(p => [p.lat, p.lng, 1]);
    const layer = L.heatLayer(points, {
      radius: 28,
      blur: 22,
      maxZoom: 14,
      gradient: { 0.3: '#0091ff', 0.6: '#00ABA8', 1.0: '#21c47b' },
    });
    map.addLayer(layer);
    return () => map.removeLayer(layer);
  }, [map, photos]);

  return null;
}

function LocateControl() {
  const map = useMap();

  useEffect(() => {
    const lc = leafletLocate({
      position: 'topright',
      flyTo: true,
      cacheLocation: true,
      drawCircle: true,
      drawMarker: true,
      showCompass: true,
      setView: 'untilPan',
      locateOptions: { maxZoom: 14, enableHighAccuracy: true, timeout: 10000 },
      strings: {
        title: 'Ma position',
        metersUnit: 'm',
        feetUnit: 'ft',
        popup: 'Vous êtes ici (±{distance} {unit})',
        outsideMapBoundsMsg: 'Position hors de la carte',
      },
      onLocationError(err) {
        if (err.code === 1) return; // permission refusée — silencieux
        map.fire('locatecontrol:error', { message: err.message });
      },
    });
    lc.addTo(map);
    return () => lc.remove();
  }, [map]);

  return null;
}

function MapRefCapture({ mapRef }) {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map, mapRef]);
  return null;
}

function FullscreenControl() {
  const map = useMap();

  useEffect(() => {
    const fs = new FullScreenPlugin({
      position: 'topright',
      title: 'Plein écran',
      titleCancel: 'Quitter le plein écran',
      forceSeparateButton: true,
    });
    fs.addTo(map);
    return () => fs.remove();
  }, [map]);

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
  .leaflet-control-zoom a,
  .leaflet-control-fullscreen a,
  .leaflet-bar a {
    background-color: rgba(11,28,45,0.95) !important;
    color: white !important;
    border-color: rgba(255,255,255,0.1) !important;
  }
  .leaflet-control-zoom a:hover,
  .leaflet-control-fullscreen a:hover,
  .leaflet-bar a:hover { background-color: rgba(0,171,168,0.2) !important; }
  .leaflet-control-attribution { background: rgba(11,28,45,0.8) !important; color: rgba(255,255,255,0.35) !important; }
  .leaflet-control-attribution a { color: rgba(255,255,255,0.5) !important; }
  .marker-cluster { background: transparent !important; }

  /* Icônes blanches — fullscreen SVG sur :root, locate sur son propre sélecteur */
  :root {
    --fullscreen-icon-enter: url("data:image/svg+xml,<svg viewBox='0 0 26 26' xmlns='http://www.w3.org/2000/svg'><path d='M5 10.3V5.9c0-.5.4-.9.9-.9h4.4c.2 0 .4.2.4.4V7c0 .2-.2.4-.4.4h-3v3c0 .2-.2.4-.4.4H5.4a.4.4 0 0 1-.4-.4zm10.3-4.9V7c0 .2.2.4.4.4h3v3c0 .2.2.4.4.4h1.5c.2 0 .4-.2.4-.4V5.9c0-.5-.4-.9-.9-.9h-4.4c-.2 0-.4.2-.4.4zm5.3 9.9H19c-.2 0-.4.2-.4.4v3h-3c-.2 0-.4.2-.4.4v1.5c0 .2.2.4.4.4h4.4c.5 0 .9-.4.9-.9v-4.4c0-.2-.2-.4-.4-.4zm-9.9 5.3V19c0-.2-.2-.4-.4-.4h-3v-3c0-.2-.2-.4-.4-.4H5.4c-.2 0-.4.2-.4.4v4.4c0 .5.4.9.9.9h4.4c.2 0 .4-.2.4-.4z' fill='white'/></svg>");
    --fullscreen-icon-exit: url("data:image/svg+xml,<svg viewBox='0 0 26 26' xmlns='http://www.w3.org/2000/svg'><path d='M20.6 10.7H16a.9.9 0 0 1-.8-.8v-4.5c0-.2.2-.4.4-.4h1.4c.3 0 .5.2.5.4v3h3c.2 0 .4.2.4.5v1.4c0 .2-.2.4-.4.4zm-9.9-.8V5.4c0-.2-.2-.4-.4-.4H8.9c-.3 0-.5.2-.5.4v3h-3c-.2 0-.4.2-.4.5v1.4c0 .2.2.4.4.4H9.9c.4 0 .8-.4.8-.8zm0 10.7V16c0-.4-.4-.8-.8-.8H5.4c-.2 0-.4.2-.4.4v1.4c0 .3.2.5.4.5h3v3c0 .2.2.4.5.4h1.4c.2 0 .4-.2.4-.4zm6.9 0v-3h3c.2 0 .4-.2.4-.5v-1.4c0-.2-.2-.4-.4-.4H16c-.4 0-.8.4-.8.8v4.5c0 .2.2.4.4.4h1.5c.3 0 .5-.2.5-.4z' fill='white'/></svg>");
  }
  /* Locate control — override au même niveau de spécificité que le plugin */
  .leaflet-control-locate {
    --locate-control-icon-color: rgba(255,255,255,0.85);
    --locate-control-active-color: #00ABA8;
    --locate-control-following-color: #00ABA8;
  }
  .leaflet-control-locate a {
    background-color: rgba(11,28,45,0.95) !important;
    color: white !important;
    border-color: rgba(255,255,255,0.1) !important;
  }
  .leaflet-control-locate a:hover { background-color: rgba(0,171,168,0.2) !important; }
  .leaflet-control-locate.active a { color: #00ABA8 !important; }

  /* GestureHandling overlay */
  .leaflet-gesture-handling-touch-warning,
  .leaflet-gesture-handling-scroll-warning {
    background: rgba(11,28,45,0.85);
    color: white;
    font-family: inherit;
  }

  /* ── Animations ────────────────────────────────────────────── */

  @keyframes popup-in {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  .leaflet-popup-content-wrapper {
    animation: popup-in 0.22s ease-out;
  }

  @keyframes dot-pulse {
    0%, 100% { opacity: 1;   transform: scale(1);    }
    50%       { opacity: 0.7; transform: scale(1.35); }
  }
  .filter-dot-active {
    animation: dot-pulse 2s ease-in-out infinite;
  }

  @keyframes sidebar-enter {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  .sidebar-inner {
    animation: sidebar-enter 0.38s ease-out;
  }

  /* Layout sidebar + carte */
  .carte-layout {
    height: calc(100dvh - var(--navbar-h));
  }
  @media (min-width: 768px) {
    .carte-layout {
      height: calc(100dvh - var(--navbar-h-md));
    }
  }
  /* Mobile : sidebar en overlay */
  @media (max-width: 767px) {
    .carte-sidebar {
      position: absolute !important;
      top: 0;
      left: 0;
      z-index: 500;
      height: 100%;
    }
  }
`;

const SUBCATS = {
  paysage:     [
    { key: 'mer',       label: 'Mer'          },
    { key: 'terre',     label: 'Terre'        },
    { key: 'horizons',  label: 'Horizons'     },
  ],
  sous_marine: [
    { key: 'depollution',      label: 'Dépollution'     },
    { key: 'biodiversite',     label: 'Biodiversité'    },
    { key: 'caracterisation',  label: 'Caractérisation' },
  ],
};

export default function CartePhotos() {
  const mapRef = useRef(null);
  const [photos, setPhotos]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [subFilter, setSubFilter] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [heatMode, setHeatMode]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    setIsMounted(true);
    Promise.all([
      supabase.from('photos_paysage')
        .select('uid,src,title,lieu,lat,lng,categorie')
        .eq('visible', true).not('lat','is',null).not('lng','is',null),
      supabase.from('photos_sous_marine')
        .select('uid,src,title,lieu,lat,lng,categorie')
        .eq('visible', true).not('lat','is',null).not('lng','is',null),
    ]).then(([{ data: paysage }, { data: sousMarine }]) => {
      setPhotos([
        ...(paysage    || []).map(p => ({ ...p, type: 'paysage'     })),
        ...(sousMarine || []).map(p => ({ ...p, type: 'sous_marine' })),
      ]);
      setLoading(false);
    });
  }, []);

  function handleMainFilter(key) {
    setFilter(key);
    setSubFilter(null);
  }

  const byType   = filter === 'all' ? photos : photos.filter(p => p.type === filter);
  const filtered = subFilter ? byType.filter(p => p.categorie === subFilter) : byType;

  const paysageCount    = photos.filter(p => p.type === 'paysage').length;
  const sousMarineCount = photos.filter(p => p.type === 'sous_marine').length;

  const subcats = SUBCATS[filter] ?? [];

  return (
    <>
      <SEO {...SEO_PAGES['/carte-photos']} />
      <style>{POPUP_CSS}</style>

      {/* ── Layout pleine hauteur : sidebar + carte ── */}
      <div className="carte-layout relative flex overflow-hidden">

        {/* Backdrop mobile (ferme la sidebar au clic) */}
        {sidebarOpen && (
          <div
            className="md:hidden absolute inset-0 bg-black/50 z-[499]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside
          className="carte-sidebar flex-shrink-0 border-r border-white/10 transition-[width] duration-300 ease-in-out overflow-hidden"
          style={{ width: sidebarOpen ? 300 : 0, background: 'rgba(4,12,24,0.98)' }}
        >
          <div className="w-[300px] h-full flex flex-col sidebar-inner">

            {/* En-tête */}
            <div className="px-5 pt-6 pb-5 border-b border-white/8 flex-shrink-0">
              <h1 className="text-xs font-black uppercase tracking-[0.15em] text-white/50 mb-1">
                Carte des photos
              </h1>
              <p className="text-white text-lg font-bold leading-tight">
                Filtrez vos recherches
              </p>
            </div>

            {/* ── Vue : Marqueurs / Zones chaudes ── */}
            <div className="px-5 py-4 border-b border-white/8 flex-shrink-0">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/40 mb-3">
                Vue :
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { mode: false, label: 'Marqueurs',    icon: '📍' },
                  { mode: true,  label: 'Zones chaudes', icon: '🔥' },
                ].map(({ mode, label, icon }) => (
                  <button
                    key={String(mode)}
                    onClick={() => setHeatMode(mode)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      heatMode === mode
                        ? 'bg-white/10 border-white/25 text-white'
                        : 'border-white/10 text-white/45 hover:bg-white/5 hover:text-white/70'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Filtres principaux ── */}
            <div className="px-5 py-5 border-b border-white/8 flex-shrink-0">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/40 mb-3">
                Filtrer par type :
              </p>
              <div className="space-y-1">
                {[
                  { key: 'all',         label: 'Toutes les photos', count: photos.length,   color: null,      desc: 'Paysage & sous-marine' },
                  { key: 'paysage',     label: 'Paysages',          count: paysageCount,    color: '#00ABA8', desc: 'Littoral & nature'     },
                  { key: 'sous_marine', label: 'Sous-marine',       count: sousMarineCount, color: '#0091ff', desc: 'Plongée & dépollution' },
                ].map(({ key, label, count, color, desc }) => (
                  <button
                    key={key}
                    onClick={() => handleMainFilter(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      filter === key
                        ? 'bg-white/10 border border-white/20'
                        : 'border border-transparent hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: color ? `${color}22` : 'rgba(255,255,255,0.08)',
                        border: `2px solid ${color ?? 'rgba(255,255,255,0.15)'}`,
                        boxShadow: color && filter === key ? `0 0 10px ${color}55` : 'none',
                      }}
                    >
                      <span
                        className={`w-3 h-3 rounded-full${filter === key ? ' filter-dot-active' : ''}`}
                        style={{ background: color ?? 'rgba(255,255,255,0.3)' }}
                      />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={`block text-sm font-semibold leading-tight ${filter === key ? 'text-white' : 'text-white/70'}`}>
                        {label}
                      </span>
                      <span className="block text-[11px] text-white/35 mt-0.5">{desc}</span>
                    </span>
                    <span
                      className="text-xs font-bold tabular-nums px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: color ? `${color}22` : 'rgba(255,255,255,0.08)',
                        color: color ?? 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Sous-filtres ── */}
            {subcats.length > 0 && (
              <div className="px-5 py-4 border-b border-white/8 flex-shrink-0">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/40 mb-3">
                  Affiner par catégorie :
                </p>
                <div className="flex flex-wrap gap-2">
                  {subcats.map(({ key, label }) => {
                    const count = byType.filter(p => p.categorie === key).length;
                    const active = subFilter === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSubFilter(active ? null : key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-white/15 border-white/40 text-white'
                            : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white/80'
                        }`}
                      >
                        {label}
                        <span className={`text-[10px] ${active ? 'text-white/70' : 'text-white/30'}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Badge catégorie active + résultats ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">

              {!loading && filtered.length > 0 && (
                <div className="px-5 py-3 sticky top-0 z-10 border-b border-white/5"
                  style={{ background: 'rgba(4,12,24,0.98)' }}>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: filter === 'paysage' ? '#00ABA822' : filter === 'sous_marine' ? '#0091ff22' : 'rgba(255,255,255,0.06)',
                      borderLeft: `3px solid ${filter === 'paysage' ? '#00ABA8' : filter === 'sous_marine' ? '#0091ff' : 'rgba(255,255,255,0.2)'}`,
                      color: filter === 'paysage' ? '#00ABA8' : filter === 'sous_marine' ? '#0091ff' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                      background: filter === 'paysage' ? '#00ABA8' : filter === 'sous_marine' ? '#0091ff' : 'rgba(255,255,255,0.4)'
                    }} />
                    {filter === 'paysage' ? 'Paysages' : filter === 'sous_marine' ? 'Sous-marine' : 'Toutes les photos'}
                    {subFilter && ` — ${subcats.find(s => s.key === subFilter)?.label}`}
                  </div>
                </div>
              )}

              {/* Liste résultats — masquée en vue heatmap (pas de popup sur les points) */}
              {heatMode ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
                  <span className="text-3xl">🔥</span>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Vue zones chaudes — les couleurs indiquent la densité de photos.
                    Passez en vue Marqueurs pour accéder aux photos individuelles.
                  </p>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center h-24">
                  <div className="spinner" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-center text-white/30 text-sm py-10 px-5">Aucune photo pour ce filtre.</p>
              ) : (
                <ul className="py-2">
                  {filtered.map(photo => {
                    const c     = MARKER_COLORS[photo.type];
                    const base  = photo.type === 'paysage' ? '/photographie-paysage-mer' : '/photographie-sous-marine';
                    const href  = photo.uid ? `${base}?photo=${encodeURIComponent(photo.uid)}` : base;
                    const thumb = toThumb(photo.src);
                    return (
                      <li key={photo.uid ?? photo.src} className="px-4 py-2">
                        <div className="rounded-xl border border-white/8 overflow-hidden hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
                          style={{ background: 'rgba(255,255,255,0.03)' }}>
                          {thumb && (
                            <a href={href} target="_blank" rel="noopener noreferrer">
                              <img
                                src={thumb}
                                alt={photo.title || ''}
                                loading="lazy"
                                className="w-full h-28 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                            </a>
                          )}
                          <div className="px-3 py-2.5 space-y-1.5">
                            {photo.title && (
                              <p className="text-white/90 text-xs font-semibold leading-snug line-clamp-2">
                                {photo.title}
                              </p>
                            )}
                            {photo.lieu && (
                              <p className="flex items-center gap-1.5 text-[11px] text-white/40">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c }} />
                                {photo.lieu}
                              </p>
                            )}
                            <div className="mt-1 flex gap-1.5">
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors"
                                style={{
                                  background: `${c}20`,
                                  border: `1px solid ${c}50`,
                                  color: c,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${c}35`; }}
                                onMouseLeave={e => { e.currentTarget.style.background = `${c}20`; }}
                              >
                                Voir la photo →
                              </a>
                              <button
                                onClick={() => {
                                  mapRef.current?.flyTo([photo.lat, photo.lng], 14, { duration: 1.2 });
                                  if (window.innerWidth < 768) setSidebarOpen(false);
                                }}
                                title="Voir sur la carte"
                                className="flex-shrink-0 flex items-center justify-center w-9 py-1.5 rounded-lg text-[14px] transition-colors"
                                style={{
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                              >
                                🎯
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </aside>

        {/* ── BOUTON TOGGLE ── */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="absolute z-[1000] top-1/2 -translate-y-1/2 w-5 h-12 flex items-center justify-center border border-white/15 rounded-r-lg hover:bg-white/10 transition-all text-white/60 hover:text-white"
          style={{
            left: sidebarOpen ? 280 : 0,
            background: 'rgba(5,15,30,0.9)',
            transition: 'left 0.3s ease-in-out, background 0.2s',
          }}
          aria-label={sidebarOpen ? 'Masquer le panneau' : 'Afficher le panneau'}
        >
          <ChevronLeft
            className="w-3.5 h-3.5 transition-transform duration-300"
            style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
          />
        </button>

        {/* ── CARTE ── */}
        <div className="flex-1 isolate min-w-0">
          {(loading || !isMounted) ? (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <div className="spinner" />
            </div>
          ) : (
            <MapContainer
              center={[43.22, 5.45]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              gestureHandling={true}
            >
              <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
              <MapRefCapture mapRef={mapRef} />
              <LocateControl />
              <FullscreenControl />
              {heatMode
                ? <HeatLayer photos={filtered} />
                : <ClusterLayer photos={filtered} />
              }
            </MapContainer>
          )}
        </div>
      </div>

      {/* ── Barre légende ── */}
      {!loading && photos.length > 0 && (
        <div className="border-t border-white/8 px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-2"
          style={{ background: 'rgba(4,12,24,0.85)' }}>
          <span className="text-white/30 text-xs">{photos.length} lieux cartographiés</span>
          {heatMode ? (
            <>
              <span className="flex items-center gap-2 text-xs text-white/50">
                <span className="inline-block w-10 h-2 rounded-full flex-shrink-0"
                  style={{ background: 'linear-gradient(to right, #0091ff, #00ABA8, #21c47b)' }} />
                Densité de photos
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-2 text-xs text-white/50">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#00ABA8', boxShadow: '0 0 6px #00ABA8' }} />
                Paysages
              </span>
              <span className="flex items-center gap-2 text-xs text-white/50">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#0091ff', boxShadow: '0 0 6px #0091ff' }} />
                Sous-marine
              </span>
            </>
          )}
          <span className="ml-auto flex items-center gap-3 text-xs text-white/30">
            <a href="/photographie-paysage-mer" className="hover:text-white/70 transition-colors">Galerie paysages →</a>
            <a href="/photographie-sous-marine" className="hover:text-white/70 transition-colors">Galerie sous-marine →</a>
          </span>
        </div>
      )}
    </>
  );
}
