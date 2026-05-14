import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.fullscreen/Control.FullScreen.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import { ChevronLeft } from 'lucide-react';
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

function MapControls() {
  const map = useMap();
  useEffect(() => {
    let fsCtrl, locCtrl;
    // Fullscreen
    import('leaflet.fullscreen').then(() => {
      fsCtrl = L.control.fullscreen({
        position: 'topright',
        title: { false: 'Plein écran', true: 'Quitter le plein écran' },
        forceSeparateButton: true,
      });
      fsCtrl.addTo(map);
    });
    // Locate
    import('leaflet.locatecontrol').then(mod => {
      const LC = mod.default ?? mod;
      locCtrl = new LC({
        position: 'topright',
        flyTo: true,
        keepCurrentZoomLevel: true,
        strings: {
          title: 'Me localiser',
          popup: 'Vous êtes dans un rayon de {distance} {unit} de ce point',
        },
        locateOptions: { maxZoom: 14, enableHighAccuracy: true },
      });
      locCtrl.addTo(map);
    });
    return () => {
      if (fsCtrl)  try { map.removeControl(fsCtrl);  } catch {}
      if (locCtrl) try { map.removeControl(locCtrl); } catch {}
    };
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
  .leaflet-control-zoom a { background: rgba(11,28,45,0.95) !important; color: white !important; border-color: rgba(255,255,255,0.1) !important; }
  .leaflet-control-zoom a:hover { background: rgba(0,171,168,0.2) !important; }
  .leaflet-control-attribution { background: rgba(11,28,45,0.8) !important; color: rgba(255,255,255,0.35) !important; }
  .leaflet-control-attribution a { color: rgba(255,255,255,0.5) !important; }

  /* ── Fullscreen & Locate — thème dark ──────────────────────── */
  .leaflet-control-fullscreen a,
  .leaflet-bar-part.leaflet-bar-part-single,
  .leaflet-control-locate a {
    background-color: rgba(11,28,45,0.95) !important;
    border-color: rgba(255,255,255,0.1) !important;
    color: white !important;
  }
  .leaflet-control-fullscreen a:hover,
  .leaflet-control-locate a:hover {
    background-color: rgba(0,171,168,0.2) !important;
  }
  /* Icône fullscreen SVG → blanc */
  .leaflet-control-fullscreen a {
    background-image: none !important;
  }
  .leaflet-control-fullscreen a::before {
    content: '';
    display: block;
    width: 14px; height: 14px;
    margin: auto;
    background: white;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zM3 13h2v4h4v2H3v-6zm16 4h-4v2h6v-6h-2v4z'/%3E%3C/svg%3E") center/14px no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zM3 13h2v4h4v2H3v-6zm16 4h-4v2h6v-6h-2v4z'/%3E%3C/svg%3E") center/14px no-repeat;
  }
  /* Icône locate → teal quand actif */
  .leaflet-control-locate.active a {
    background-color: rgba(0,171,168,0.25) !important;
    border-color: rgba(0,171,168,0.5) !important;
  }
  .leaflet-locate-location-marker-location {
    background: #00ABA8 !important;
    border-color: white !important;
  }
  .marker-cluster { background: transparent !important; }

  /* ── Animations ────────────────────────────────────────────── */

  /* 1. Popup fade + slide-up à l'ouverture */
  @keyframes popup-in {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  .leaflet-popup-content-wrapper {
    animation: popup-in 0.22s ease-out;
  }

  /* 2. Glow pulsé sur le point du filtre actif */
  @keyframes dot-pulse {
    0%, 100% { opacity: 1;   transform: scale(1);    }
    50%       { opacity: 0.7; transform: scale(1.35); }
  }
  .filter-dot-active {
    animation: dot-pulse 2s ease-in-out infinite;
  }

  /* 3. Slide-in de la sidebar au premier chargement */
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
  const [photos, setPhotos]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [subFilter, setSubFilter] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
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
                    {/* Icône colorée — inspirée des pictogrammes Fondation de la Mer */}
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

              {/* Badge type actif — comme le bandeau orange "COLLECTE DE DÉCHETS" */}
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

              {/* Cartes résultats */}
              {loading ? (
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
                        {/* Carte résultat — structure inspirée des fiches événements FdlM */}
                        <div className="rounded-xl border border-white/8 overflow-hidden hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
                          style={{ background: 'rgba(255,255,255,0.03)' }}>
                          {/* Vignette */}
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
                            {/* Titre */}
                            {photo.title && (
                              <p className="text-white/90 text-xs font-semibold leading-snug line-clamp-2">
                                {photo.title}
                              </p>
                            )}
                            {/* Lieu */}
                            {photo.lieu && (
                              <p className="flex items-center gap-1.5 text-[11px] text-white/40">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c }} />
                                {photo.lieu}
                              </p>
                            )}
                            {/* CTA */}
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 flex items-center justify-center w-full py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors"
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
            >
              <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
              <ClusterLayer photos={filtered} />
              <MapControls />
            </MapContainer>
          )}
        </div>
      </div>

      {/* ── Barre légende ── */}
      {!loading && photos.length > 0 && (
        <div className="border-t border-white/8 px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-2"
          style={{ background: 'rgba(4,12,24,0.85)' }}>
          <span className="text-white/30 text-xs">{photos.length} lieux cartographiés</span>
          <span className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#00ABA8', boxShadow: '0 0 6px #00ABA8' }} />
            Paysages
          </span>
          <span className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#0091ff', boxShadow: '0 0 6px #0091ff' }} />
            Sous-marine
          </span>
          <span className="ml-auto flex items-center gap-3 text-xs text-white/30">
            <a href="/photographie-paysage-mer" className="hover:text-white/70 transition-colors">Galerie paysages →</a>
            <a href="/photographie-sous-marine" className="hover:text-white/70 transition-colors">Galerie sous-marine →</a>
          </span>
        </div>
      )}
    </>
  );
}
