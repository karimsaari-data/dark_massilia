import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const PROXY_URL = 'https://bzlllfmpojcybuyuemdx.supabase.co/functions/v1/fire-risk-calanques';

/**
 * FireRiskBadge — Affiche le niveau de risque incendie pour le massif des Calanques
 * Source : Préfecture / Frequence-sud.fr (mis à jour quotidiennement)
 */
export default function FireRiskBadge({ className = '', inline = false }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(PROXY_URL)
      .then(r => r.json())
      .then(json => {
        if (!cancelled) {
          if (json.status === 'ok') setData(json);
          else setError(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, []);

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className={`inline-flex items-center gap-3 animate-pulse ${inline ? '' : 'rounded-xl border border-white/10 bg-white/5 px-4 py-3'} ${className}`}>
        <div className="w-3 h-3 rounded-sm bg-white/20 shrink-0" />
        <div className="h-3 w-44 rounded bg-white/15" />
      </div>
    );
  }

  /* ── Erreur silencieuse ── */
  if (error || !data) return null;

  const { label, color, date, source } = data;

  if (inline) {
    /* Mode bande — compact, horizontal, sans card */
    // Label court pour mobile (dernier segment après " - ")
    const shortLabel = label.split(' - ').pop();
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
        {/* Mobile : label court — Desktop : label complet */}
        <span className="text-xs font-medium text-white sm:hidden">{shortLabel}</span>
        <span className="text-sm font-medium text-white hidden sm:inline">{label}</span>
        <span className="text-xs text-white/35 hidden md:inline">
          · {date} · {source}
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 ${className}`}>
      {/* Ligne principale */}
      <div className="flex items-center gap-2.5">
        <span
          className="w-3.5 h-3.5 rounded-sm shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-white leading-tight">
          {label}
        </span>
      </div>

      {/* Date + source */}
      <div className="flex items-center gap-1.5 pl-6">
        <span className="text-xs text-white/40">
          Risque incendie {date} · {source}
        </span>
      </div>
    </div>
  );
}
