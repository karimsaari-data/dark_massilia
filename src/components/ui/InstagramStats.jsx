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

const SOCIAL_NETWORKS = [
  {
    name: 'Instagram',
    handle: '@karimsaari',
    followers: '24,2K',
    url: 'https://www.instagram.com/karimsaari',
    bg: 'from-purple-600/20 to-pink-600/20',
    border: 'border-pink-500/20',
    icon: <InstagramIcon />,
  },
  {
    name: 'TikTok',
    handle: '@dark.massilia',
    followers: '21,9K',
    url: 'https://www.tiktok.com/@dark.massilia',
    bg: 'from-gray-800/60 to-gray-900/60',
    border: 'border-white/10',
    icon: <TikTokIcon />,
  },
  {
    name: 'X',
    handle: '@dark_massilia',
    followers: '1,6K',
    url: 'https://x.com/dark_massilia',
    bg: 'from-gray-900/60 to-black/60',
    border: 'border-white/10',
    icon: <XIcon />,
  },
  {
    name: 'Facebook',
    handle: 'Pages perso & pro',
    followers: '17,8K',
    note: '13K + 4,8K',
    url: 'https://www.facebook.com/Photographie.Marseille',
    bg: 'from-blue-700/20 to-blue-600/20',
    border: 'border-blue-500/20',
    icon: <FacebookIcon />,
  },
  {
    name: 'Amoureux des Calanques',
    handle: 'Groupe Facebook',
    followers: '64,3K',
    url: 'https://www.facebook.com/groups/calanque/',
    bg: 'from-blue-600/20 to-cyan-600/20',
    border: 'border-blue-400/20',
    icon: <FacebookIcon />,
  },
  {
    name: 'YouTube',
    handle: '@dark.massilia',
    followers: '1,33K',
    url: 'https://www.youtube.com/@dark.massilia',
    bg: 'from-red-700/20 to-red-600/20',
    border: 'border-red-500/20',
    icon: <YouTubeIcon />,
  },
];

const SocialStats = () => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SOCIAL_NETWORKS.map((network) => (
          <a
            key={network.name}
            href={network.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`glass-strong rounded-2xl p-5 border ${network.border} bg-gradient-to-br ${network.bg} hover:scale-[1.02] transition-transform duration-200 flex flex-col gap-3`}
          >
            {/* Icon */}
            <div className="flex items-center justify-between">
              {network.icon}
            </div>

            {/* Followers */}
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white leading-none">
                {network.followers}
              </p>
              {network.note && (
                <p className="text-xs text-gray-500 mt-0.5">{network.note}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">abonnés</p>
            </div>

            {/* Name + handle */}
            <div>
              <p className="text-sm font-semibold text-white">{network.name}</p>
              <p className="text-xs text-gray-500">{network.handle}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialStats;
