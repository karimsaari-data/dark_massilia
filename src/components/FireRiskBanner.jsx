import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

const PROXY_URL = 'https://bzlllfmpojcybuyuemdx.supabase.co/functions/v1/fire-risk-calanques';

const getBg = (level) => {
  if (!level || level <= 1) return 'rgba(16,40,28,0.95)';  // vert foncé
  if (level === 2)          return 'rgba(40,35,10,0.95)';  // jaune foncé
  if (level === 3)          return 'rgba(40,22,8,0.95)';   // orange foncé
  return                           'rgba(40,10,10,0.95)';  // rouge foncé
};

export default function FireRiskBanner() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(PROXY_URL)
      .then(r => r.json())
      .then(json => { if (json.status === 'ok') setData(json); })
      .catch(() => {});
  }, []);

  return (
    <div
      className="flex items-center justify-between px-4 md:px-8 h-12 border-b border-white/8"
      style={{ background: data ? getBg(data.level) : 'rgba(15,20,30,0.95)' }}
    >
      {/* Gauche : icône + label + statut */}
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
