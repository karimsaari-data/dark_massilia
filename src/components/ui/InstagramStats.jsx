import { useRef, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useInView, useReducedMotion } from 'framer-motion';

const StatCounter = ({ end, suffix = '', decimals = 0, duration = 2000 }) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) { setCount(end); return; }
    let startTime = null;
    let raf;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration, decimals, prefersReducedMotion]);
  const display = decimals > 0
    ? count.toFixed(decimals).replace('.', ',')
    : count.toLocaleString('fr-FR');
  return <span ref={ref}>{display}{suffix}</span>;
};

// SVG icons pour les réseaux sociaux
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#ig-grad)" />
    <circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="1.8" />
    <circle cx="17.2" cy="6.8" r="1.2" fill="white" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.77 1.52V6.77a4.85 4.85 0 0 1-1-.08z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" />
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const Px500Icon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm0 2.4c-3.977 0-7.2 3.223-7.2 7.2s3.223 7.2 7.2 7.2 7.2-3.223 7.2-7.2-3.223-7.2-7.2-7.2zm0 2.4c2.651 0 4.8 2.149 4.8 4.8S14.651 16.8 12 16.8 7.2 14.651 7.2 12s2.149-4.8 4.8-4.8zm0 2.4c-1.326 0-2.4 1.074-2.4 2.4s1.074 2.4 2.4 2.4 2.4-1.074 2.4-2.4-1.074-2.4-2.4-2.4z" />
  </svg>
);

const LocalGuideIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4285F4" />
  </svg>
);

// Couleurs par KPI
// abonnés → bleu/indigo   |   vues/impressions → vert/teal (couleur de marque)
const KPI_COLORS = {
  abonnes: { bg: 'from-blue-600/20 to-indigo-600/20',    border: 'border-blue-500/20' },
  vues:    { bg: 'from-emerald-600/20 to-teal-500/20',   border: 'border-emerald-500/20' },
};

const isVuesKpi = (unit) => unit && (unit.includes('vues') || unit.includes('impressions'));

// Icônes par plateforme (non stockées en DB)
const PLATFORM_ICONS = {
  facebook_group: <FacebookIcon />,
  instagram:      <InstagramIcon />,
  tiktok:         <TikTokIcon />,
  facebook_pages: <FacebookIcon />,
  pinterest:      <PinterestIcon />,
  px500:          <Px500Icon />,
  youtube:        <YouTubeIcon />,
  x:              <XIcon />,
  local_guides:   <LocalGuideIcon />,
};

// Fallback statique (utilisé si Supabase vide ou inaccessible)
// Ordre : ligne 1 → Amoureux, Instagram, TikTok, Facebook
//          ligne 2 → YouTube, X, Local Guide, 500px
const SOCIAL_NETWORKS_STATIC = [
  { platform: 'facebook_group', name: 'Amoureux des Calanques', handle: 'Groupe Facebook',        end: 64.7, suffix: 'K', decimals: 1, url: 'https://www.facebook.com/groups/calanque/' },
  { platform: 'instagram',      name: 'Instagram',              handle: '@karimsaari',             end: 24.2, suffix: 'K', decimals: 1, url: 'https://www.instagram.com/karimsaari' },
  { platform: 'tiktok',         name: 'TikTok',                 handle: '@dark.massilia',          end: 22.2, suffix: 'K', decimals: 1, url: 'https://www.tiktok.com/@dark.massilia' },
  { platform: 'facebook_pages', name: 'Facebook',               handle: 'Pages pro & perso',       end: 17.8, suffix: 'K', decimals: 1, note: '13K + 4,8K', url: 'https://www.facebook.com/Photographie.Marseille' },
  { platform: 'youtube',        name: 'YouTube',                handle: '@dark.massilia',          end: 1.3,  suffix: 'K', decimals: 1, url: 'https://www.youtube.com/@dark.massilia' },
  { platform: 'x',              name: 'X',                      handle: '@dark_massilia',          end: 1.6,  suffix: 'K', decimals: 1, url: 'https://x.com/dark_massilia' },
  { platform: 'local_guides',   name: 'Local Guides',           handle: 'Google Maps · Marseille', end: 185,  suffix: 'M', decimals: 0, unit: 'vues', url: 'https://www.google.com/maps/contrib/114912564832630219145/photos/' },
  { platform: 'pinterest',      name: 'Pinterest',              handle: 'Photographie_Marseille',  end: 16,   suffix: 'K', decimals: 0, unit: 'vues / mois', url: 'https://fr.pinterest.com/Photographie_Marseille/' },
  { platform: 'px500',          name: '500px',                  handle: 'karimsaari',              end: 800,  suffix: 'K', decimals: 0, unit: 'impressions photos', url: 'https://500px.com/p/karimsaari?view=photos' },
];

const SocialStats = () => {
  const toVisual = (platform, unit) => {
    const colors = isVuesKpi(unit) ? KPI_COLORS.vues : KPI_COLORS.abonnes;
    return { ...colors, icon: PLATFORM_ICONS[platform] ?? null };
  };

  const [networks, setNetworks] = useState(
    SOCIAL_NETWORKS_STATIC.map(n => ({ ...n, ...toVisual(n.platform, n.unit) }))
  );
  const [fbViews28j, setFbViews28j] = useState(null);

  useEffect(() => {
    // Fetch vues Facebook groupe · 28j
    const since = new Date();
    since.setDate(since.getDate() - 28);
    supabase
      .from('facebook_group_insights')
      .select('views')
      .gte('date', since.toISOString().slice(0, 10))
      .then(({ data }) => {
        if (!data?.length) return;
        const total = data.reduce((s, r) => s + (r.views ?? 0), 0);
        if (total > 0) setFbViews28j(total);
      });

    // On ne fetch que value + note (colonnes sûres en DB)
    // Le reste (suffix, decimals, name, handle, url) vient du fallback statique
    // ── Vues Local Guides (indépendant du reste) ──────────────────────────────
    supabase
      .from('social_stats')
      .select('value')
      .eq('platform', 'local_guide_views_m')
      .single()
      .then(({ data: lgViews }) => {
        if (!lgViews) return;
        const val = parseFloat(lgViews.value);
        if (isNaN(val)) return;
        setNetworks(prev => prev.map(n =>
          n.platform === 'local_guides' ? { ...n, end: val } : n
        ));
      });

    // ── Abonnés & autres stats ─────────────────────────────────────────────────
    supabase
      .from('social_stats')
      .select('platform, value, note')
      .neq('platform', 'total_community')
      .neq('platform', 'local_guide_views_m')
      .then(({ data: cards }) => {
        if (!cards || cards.length === 0) return;
        const staticByPlatform = Object.fromEntries(
          SOCIAL_NETWORKS_STATIC.map(n => [n.platform, n])
        );
        setNetworks(prev => prev.map(network => {
          if (network.platform === 'local_guides') return network; // géré séparément
          const row = cards.find(c => c.platform === network.platform);
          if (!row) return network;
          const staticRow = staticByPlatform[network.platform] || {};
          const rawValue = parseFloat(row.value);

          let end;
          if (staticRow.suffix === 'K') {
            end = rawValue >= 1000 ? rawValue / 1000 : rawValue;
          } else if (staticRow.suffix === 'M') {
            end = rawValue >= 1000000 ? rawValue / 1000000 : rawValue;
          } else {
            end = rawValue;
          }

          return {
            ...network,
            end,
            note: row.note || staticRow.note || undefined,
          };
        }));
      });
  }, []);

  const abonnes = networks.filter(n => !isVuesKpi(n.unit));
  const vues    = networks.filter(n =>  isVuesKpi(n.unit));

  const CardLink = ({ network }) => (
    <a
      key={network.name}
      href={network.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`glass-strong rounded-2xl p-5 border ${network.border} bg-gradient-to-br ${network.bg} hover:scale-[1.02] transition-transform duration-200 flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        {network.icon}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-white leading-none">
          <StatCounter end={network.end} suffix={network.suffix} decimals={network.decimals} />
        </p>
        {network.note && (
          <p className="text-xs text-gray-500 mt-0.5">{network.note}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{network.unit ?? 'abonnés'}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{network.name}</p>
        <p className="text-xs text-gray-500">{network.handle}</p>
      </div>
    </a>
  );

  return (
    <div className="mb-8 flex flex-col gap-6">

      {/* Groupe abonnés — contribuent au total 132K */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">Abonnés</span>
          <span className="h-px flex-1 bg-blue-500/20" />
          <span className="text-xs text-blue-300/60">= 132K sentinelles</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {abonnes.map(n => <CardLink key={n.name} network={n} />)}
        </div>
      </div>

      {/* Groupe vues — portée & visibilité */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest">Portée & visibilité</span>
          <span className="h-px flex-1 bg-emerald-500/20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {vues.map(n => <CardLink key={n.name} network={n} />)}

          {/* Vues Facebook groupe · 28j */}
          {fbViews28j && (
            <a
              href="https://www.facebook.com/groups/calanque/"
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-strong rounded-2xl p-5 border border-emerald-500/20 bg-gradient-to-br from-emerald-600/20 to-teal-500/20 hover:scale-[1.02] transition-transform duration-200 flex flex-col gap-3`}
            >
              <div className="flex items-center justify-between">
                <FacebookIcon />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-white leading-none">
                  <StatCounter
                    end={fbViews28j >= 1000 ? Math.round(fbViews28j / 1000) : fbViews28j}
                    suffix={fbViews28j >= 1000 ? 'K' : ''}
                    decimals={0}
                  />
                </p>
                <p className="text-xs text-gray-400 mt-1">vues / 28j</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Groupe Calanques</p>
                <p className="text-xs text-gray-500">Amoureux des Calanques</p>
              </div>
            </a>
          )}
        </div>
      </div>

    </div>
  );
};

export default SocialStats;
