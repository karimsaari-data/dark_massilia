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
import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

const PROXY_URL = 'https://bzlllfmpojcybuyuemdx.supabase.co/functions/v1/fire-risk-calanques';

function FireRiskBanner() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(PROXY_URL).then(r => r.json()).then(json => {
      if (json.status === 'ok') setData(json);
    }).catch(() => {});
  }, []);

  // Couleur de fond selon le niveau
  const getBg = (level) => {
    if (!level || level <= 1) return 'rgba(16,40,28,0.95)';   // vert foncé
    if (level === 2)          return 'rgba(40,35,10,0.95)';   // jaune foncé
    if (level === 3)          return 'rgba(40,22,8,0.95)';    // orange foncé
    return                           'rgba(40,10,10,0.95)';   // rouge foncé
  };

  return (
    <div
      className="flex items-center justify-between px-4 md:px-8 h-12 border-b border-white/8"
      style={{ background: data ? getBg(data.level) : 'rgba(15,20,30,0.95)' }}
    >
      {/* Gauche : label + pastille */}
      <div className="flex items-center gap-3">
        <Flame className="w-4 h-4 text-white/40 shrink-0" />
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest hidden sm:inline">
          Accès Massif · Calanques
        </span>
        {data ? (
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ backgroundColor: data.color }}
            />
            <span className="text-sm font-semibold text-white">{data.label}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 rounded-sm bg-white/20" />
            <div className="h-3 w-40 rounded bg-white/15" />
          </div>
        )}
      </div>

      {/* Droite : date + source */}
      {data && (
        <span className="text-xs text-white/35 hidden md:inline shrink-0">
          {data.date} · {data.source}
        </span>
      )}
    </div>
  );
}

const IFRAME_URL =
  'https://opendfci.fr/13/index.php/view/map?repository=openmassifs&project=open_massifs';

export default function AccesMassifs() {
  return (
    <>
      <SEO {...SEO_PAGES['/acces-massifs-calanques']} />

      {/* Bande statut pleine largeur */}
      <FireRiskBanner />

      {/* Carte pleine largeur */}
      <div className="relative overflow-hidden h-[calc(100vh-70px-48px)] md:h-[calc(100vh-128px-80px-48px)]">
        <iframe
          src={IFRAME_URL}
          title="Carte des accès aux massifs forestiers — DFCI Bouches-du-Rhône"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          loading="lazy"
          allowFullScreen
        />
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
