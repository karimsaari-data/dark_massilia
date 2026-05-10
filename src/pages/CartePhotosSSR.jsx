/**
 * CartePhotosSSR — Version statique pour le prérendu SSR de /carte-photos.
 * Pas de Leaflet (pas de window en Node). Le client charge CartePhotos.jsx.
 */
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

export default function CartePhotosSSR() {
  return (
    <>
      <SEO {...SEO_PAGES['/carte-photos']} />
      <div className="min-h-screen pt-[70px] md:pt-[128px]">
        <div className="container-custom py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Carte des photos</h1>
          <p className="text-text-secondary text-lg">Tous les lieux de prise de vue — Méditerranée, Provence & ailleurs</p>
        </div>
        <div className="w-full bg-white/5 flex items-center justify-center" style={{ height: '68vh' }}>
          <span className="text-text-muted text-sm">Chargement de la carte…</span>
        </div>
      </div>
    </>
  );
}
