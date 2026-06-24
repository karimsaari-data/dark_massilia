// Application constants and configuration

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Dark Massilia',
  url: import.meta.env.VITE_APP_URL || 'https://karimsaari.com',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'contact@karimsaari.com',
  contactWhatsApp: import.meta.env.VITE_CONTACT_WHATSAPP || '+33695331301',
};

const _todayFR = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
export const CONTACT_MAILTO = `mailto:${APP_CONFIG.contactEmail}?subject=${encodeURIComponent(`Prise de contact du ${_todayFR}`)}`;

export const SOCIAL_LINKS = {
  instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/karimsaari/',
  twitter: import.meta.env.VITE_TWITTER_URL || 'https://x.com/dark_massilia',
  tiktok: import.meta.env.VITE_TIKTOK_URL || 'https://www.tiktok.com/@dark.massilia',
  youtube: import.meta.env.VITE_YOUTUBE_URL || 'https://www.youtube.com/@dark.massilia',
  px500: import.meta.env.VITE_500PX_URL || 'https://500px.com/p/karimsaari?view=photos',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/karimsaari/',
  facebook: import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/Photographie.Marseille',
  facebookPerso: import.meta.env.VITE_FACEBOOK_PERSO_URL || 'https://www.facebook.com/EcoPlongeur',
  facebookGroup: import.meta.env.VITE_FACEBOOK_GROUP_URL || 'https://www.facebook.com/groups/calanque/',
  pinterest: import.meta.env.VITE_PINTEREST_URL || 'https://fr.pinterest.com/Photographie_Marseille/',
  localGuide: import.meta.env.VITE_LOCAL_GUIDE_URL || 'https://www.google.com/maps/contrib/114912564832630219145/photos/',
};

// Statistiques sociales — source de vérité (fallback avant chargement Supabase)
export const FACEBOOK_GROUP_MEMBERS = 65000;

// ⚠️  Ces valeurs sont le fallback affiché AVANT que Supabase ne réponde.
// Mets-les à jour ici chaque mois OU via l'admin (/admin → Stats réseaux).
export const SOCIAL_STATS_DEFAULTS = {
  total_community: 132000, // abonnés toutes plateformes confondues
  instagram:        23.8,  // en K (suffix 'K', decimals 1)
  tiktok:           22.3,  // en K (suffix 'K', decimals 1)
  facebook_pages:   17.8,  // en milliers (page + perso cumulé)
};

export const NAV_LINKS = [
  {
    key: 'portfolio',
    name: 'Portfolio',
    dropdownTitle: 'Galeries photo — Marseille & Calanques',
    icon: 'Camera',
    description: 'Photographies sous-marines, paysages du littoral marseillais et démarche de photographe environnemental.',
    children: [
      { key: 'env_photo',  name: 'Photographe environnemental', path: '/photographe-environnemental-marseille', icon: 'BookOpen',   isHub: true, hubDesc: 'Démarche, univers photographique & partenaires' },
      { key: 'underwater', name: 'Photos sous-marines',         path: '/photographie-sous-marine',              icon: 'Camera'     },
      { key: 'landscapes', name: 'Photos de paysages',          path: '/photographie-paysage-mer',              icon: 'Camera'     },
      { key: 'photo_map',  name: 'Carte des photos',            path: '/carte-photos',                          icon: 'MapPin'     },
      { key: 'yab',        name: 'Yann Arthus-Bertrand',        path: '/les-francais-yann-arthus-bertrand',     icon: 'Camera'     },
    ],
  },
  {
    key: 'missions',
    name: 'Missions',
    dropdownTitle: 'Agir pour la mer Méditerranée',
    icon: 'Compass',
    description: 'Dépollution des fonds marins en apnée, documentation scientifique et mobilisation citoyenne dans les Calanques.',
    children: [
      { key: 'community',   name: 'Rejoindre la communauté', path: '/communaute',            icon: 'Share2',    isHub: true, hubDesc: 'Rejoins la mission — bénévoles, plongeurs, partenaires' },
      { key: 'depollution', name: 'Dépollution marine',      path: '/depollution-marine',    icon: 'Compass'    },
      { key: 'scientific',  name: 'Données scientifiques',   path: '/donnees-scientifiques', icon: 'BarChart2'  },
      { key: 'local_guide', name: 'Google Local Guide',      path: '/local-guide-marseille', icon: 'Navigation' },
    ],
  },
  {
    key: 'medias',
    name: 'Médias',
    dropdownTitle: 'Actualités & présence médias',
    icon: 'Film',
    description: 'Documentaires ARTE, presse nationale, vidéos, blog et actualités sur l\'engagement environnemental à Marseille.',
    children: [
      { key: 'videos',    name: 'Vidéos & Documentaires',   path: '/videos',                                       icon: 'Video',   isHub: true, hubDesc: 'ARTE, M6, France Télévisions, YouTube' },
      { key: 'arte',      name: 'ARTE — Sauver Marseille',  path: '/sauver-marseille-documentaire-arte',           icon: 'Tv',  sub: true },
      { key: 'meduses',   name: 'ARTE — Méduses',           path: '/meduses-souveraines-oceans-documentaire-arte', icon: 'Tv',  sub: true },
      { key: 'echappees', name: 'Échappées Belles',         path: '/echappees-belles-bouches-du-rhone',            icon: 'Tv',  sub: true },
      { key: 'green_got', name: 'Green-Got — Méditerranée', path: '/court-metrage-green-got-mediterranee',         icon: 'Tv',  sub: true },
      { key: 'blog',      name: 'Blog',                     path: '/blog',                                         icon: 'BookOpen' },
    ],
  },
  {
    key: 'calanques',
    name: 'Calanques',
    dropdownTitle: 'Explorer les Calanques de Marseille',
    icon: 'MapPin',
    description: 'Carte interactive, accès aux massifs, actualités du Parc national et communauté des amoureux des Calanques.',
    children: [
      { key: 'facebook_group', name: 'Groupe Facebook Calanques',       path: '/communaute-calanques',    icon: 'Users',     isHub: true, hubDesc: `Plus de ${FACEBOOK_GROUP_MEMBERS.toLocaleString('fr-FR')} membres — la plus grande communauté des Calanques` },
      { key: 'news',           name: 'News Parc des Calanques',         path: '/actualites',              icon: 'Newspaper'  },
      { key: 'map',            name: 'Carte interactive des Calanques', path: '/carte-calanques',         icon: 'MapPin'     },
      { key: 'access',         name: 'Accès aux massifs forestiers',    path: '/acces-massifs-calanques', icon: 'Navigation' },
    ],
  },
  {
    key: 'contact',
    name: 'Contact',
    dropdownTitle: 'Découvrir comment agir pour la mer',
    icon: 'Mail',
    description: 'Collaborations, partenariats médias ou institutionnels — rejoignez la mission Dark Massilia.',
    children: [
      { key: 'collaborate',  name: 'Collaborer avec nous',         path: '/contact',                         icon: 'Mail',    isHub: true, hubDesc: 'Partenariats, médias, institutions' },
      { key: 'press',        name: 'Presse & médias',              path: '/presse',                          icon: 'Newspaper' },
      { key: 'email',        name: 'Envoyer un email',             path: CONTACT_MAILTO,                     icon: 'AtSign'  },
      { key: 'newsletter',   name: 'Newsletter',                   path: '/#newsletter',                     icon: 'Send'    },
      { key: 'team_oxygen',  name: 'Team Oxygen — site officiel',  path: 'https://www.team-oxygen.com/',     icon: 'Compass' },
    ],
  },
];

export const TAGLINE = 'Une Mer · Une Ville · Une Mission';

export const MISSION_STATEMENT =
  "Sentinelle des Calanques, je documente et nettoie les fonds marins de Marseille en apnée. Avec Team Oxygen, chaque plongée devient une mission de dépollution.";

// Media types configuration
export const MEDIA_TYPES = {
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  VIMEO: 'vimeo',
  PX500: '500px',
  INSTAGRAM: 'instagram',
};

// Animation variants for Framer Motion — spring physics
// stiffness = rigidité du ressort  |  damping = amortissement
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 28 }
  }
};

export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 30 }
  }
};

export const STAGGER_CONTAINER = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 28 }
  }
};
