/**
 * AccesMassifs — Carte en temps réel des accès aux massifs forestiers
 * Route : /acces-massifs-calanques
 * Source : opendfci.fr — carte Lizmap officielle DFCI Bouches-du-Rhône
 */
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import FireRiskBadge from '../components/FireRiskBadge';

const IFRAME_URL =
  'https://opendfci.fr/13/index.php/view/map?repository=openmassifs&project=open_massifs';

export default function AccesMassifs() {
  return (
    <>
      <SEO {...SEO_PAGES['/acces-massifs-calanques']} />

      {/* Carte pleine largeur + badge superposé sur la bande opendfci */}
      <div className="relative overflow-hidden h-[calc(100vh-70px)] md:h-[calc(100vh-128px-80px)]">
        <iframe
          src={IFRAME_URL}
          title="Carte des accès aux massifs forestiers — DFCI Bouches-du-Rhône"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          loading="lazy"
          allowFullScreen
        />
        {/* Badge superposé à droite de la bande grise opendfci (~38px de haut) */}
        <div
          className="absolute top-0 right-0 flex items-center h-[38px] px-3 pointer-events-none"
          style={{ background: 'rgba(30,30,30,0.55)', backdropFilter: 'blur(4px)' }}
        >
          <FireRiskBadge inline />
        </div>
      </div>

      {/* Info + navigation */}
      <div className="container-custom py-6">
        <div className="glass rounded-2xl p-5 border border-white/8 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-ocean-teal flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary leading-relaxed">
              En période estivale (juin–septembre), la préfecture peut fermer les massifs selon le niveau de risque incendie.
              Avant chaque mission <strong className="text-ocean-teal">Team Oxygen</strong>, nous vérifions l'état des massifs —
              Calanques, Côte Bleue, Marseilleveyre. Sources :&nbsp;
              <a href="https://www.risque-prevention-incendie.fr/13" target="_blank" rel="noopener noreferrer"
                className="text-ocean-teal hover:text-white transition-colors font-medium">
                risque-prevention-incendie.fr/13
              </a>
              {' · '}
              <a href="https://opendfci.fr/13" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-text-muted hover:text-white transition-colors">
                opendfci.fr/13
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/depollution-marine"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Nos missions de dépollution
          </Link>
          <Link to="/carte-calanques"
            className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium">
            Carte de nos interventions
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
