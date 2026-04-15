/**
 * CarteRisqueIncendie — Carte Leaflet des massifs forestiers (Bouches-du-Rhône)
 * Source : opendfci.fr — WMS public officiel DFCI 13
 * Couche : vue_acces_massifs_13 (vert = ouvert, rouge = fermé)
 */
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Les paramètres Lizmap (repository, project) sont encodés directement dans l'URL
const WMS_URL =
  'https://opendfci.fr/13/index.php/lizmap/service?repository=openmassifs&project=open_massifs';

const PACA_CENTER = [43.45, 5.15];
const DEFAULT_ZOOM = 10;

export default function CarteRisqueIncendie({ height = '500px', zoom = DEFAULT_ZOOM }) {
  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={PACA_CENTER}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        {/* Fond de carte OpenStreetMap */}
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Couche WMS massifs forestiers DFCI 13 — vert = ouvert, rouge = fermé */}
        <WMSTileLayer
          url={WMS_URL}
          layers="vue_acces_massifs_13"
          format="image/png"
          transparent={true}
          version="1.3.0"
          opacity={0.85}
          attribution='© <a href="https://opendfci.fr" target="_blank" rel="noopener">DFCI / opendfci.fr</a>'
        />
      </MapContainer>
    </div>
  );
}
