/**
 * CarteSSR — Version statique de la page Carte pour le prérendu SSR.
 * Utilisée uniquement dans entry-server.jsx (pas de Leaflet = pas de window).
 * Le client charge Carte.jsx complet avec react-leaflet.
 */
import SEO from '../components/SEO';

export default function CarteSSR() {
  return (
    <>
      <SEO
        title="Carte des Calanques : Dépollution & Biodiversité | Karim Saari"
        description="Explorez la carte interactive des Calanques de Marseille. Localisez nos zones de dépollution avec Team Oxygen et découvrez la biodiversité à protéger."
        canonical="https://karimsaari.com/carte-calanques"
      />
      <div className="min-h-screen pt-[70px] md:pt-[128px]">
        <div className="container-custom py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Carte des Sites</h1>
          <p className="text-text-secondary text-lg">Calanques de Marseille — zones documentées en apnée</p>
        </div>
        <div className="w-full bg-white/5 flex items-center justify-center" style={{ height: '60vh' }}>
          <span className="text-text-muted text-sm">Chargement de la carte…</span>
        </div>
      </div>
    </>
  );
}
