// Application constants and configuration

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Dark Massilia',
  url: import.meta.env.VITE_APP_URL || 'https://karimsaari.com',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'contact@karimsaari.com',
  contactWhatsApp: import.meta.env.VITE_CONTACT_WHATSAPP || '+33695331301',
};

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

// Facebook Group Stats — source de vérité pour toute l'app (menu, Home, etc.)
export const FACEBOOK_GROUP_MEMBERS = 64900;

export const NAV_LINKS = [
  {
    name: 'Portfolio',
    dropdownTitle: 'Galeries photo — Marseille & Calanques',
    icon: 'Camera',
    description: 'Photographies sous-marines, paysages du littoral marseillais et démarche de photographe environnemental.',
    children: [
      { name: 'Photographe environnemental', path: '/photographe-environnemental-marseille', icon: 'BookOpen',   isHub: true, hubDesc: 'Démarche, univers photographique & partenaires' },
      { name: 'Photos sous-marines',         path: '/photographie-sous-marine',              icon: 'Camera'     },
      { name: 'Photos de paysages',          path: '/photographie-paysage-mer',              icon: 'Camera'     },
      { name: 'Yann Arthus-Bertrand',        path: '/les-francais-yann-arthus-bertrand',     icon: 'Camera'     },
    ],
  },
  {
    name: 'Missions',
    dropdownTitle: 'Agir pour la mer Méditerranée',
    icon: 'Compass',
    description: 'Dépollution des fonds marins en apnée, documentation scientifique et mobilisation citoyenne dans les Calanques.',
    children: [
      { name: 'Rejoindre la communauté', path: '/communaute',            icon: 'Share2',  isHub: true, hubDesc: 'Rejoins la mission — bénévoles, plongeurs, partenaires' },
      { name: 'Dépollution marine',      path: '/depollution-marine',    icon: 'Compass'  },
      { name: 'Données scientifiques',   path: '/donnees-scientifiques', icon: 'BarChart2' },
      { name: 'Google Local Guide',      path: '/local-guide-marseille', icon: 'Navigation' },
    ],
  },
  {
    name: 'Médias',
    dropdownTitle: 'Actualités & présence médias',
    icon: 'Film',
    description: 'Documentaires ARTE, presse nationale, vidéos, blog et actualités sur l\'engagement environnemental à Marseille.',
    children: [
      { name: 'Vidéos & Documentaires',  path: '/videos',                                       icon: 'Video',   isHub: true, hubDesc: 'ARTE, M6, France Télévisions, YouTube' },
      { name: 'ARTE — Sauver Marseille', path: '/sauver-marseille-documentaire-arte',           icon: 'Tv',  sub: true },
      { name: 'ARTE — Méduses',          path: '/meduses-souveraines-oceans-documentaire-arte', icon: 'Tv',  sub: true },
      { name: 'Échappées Belles',        path: '/echappees-belles-bouches-du-rhone',            icon: 'Tv',  sub: true },
      { name: 'Presse',                  path: '/presse',                                       icon: 'Film'     },
      { name: 'Blog',                    path: '/blog',                                         icon: 'BookOpen' },
    ],
  },
  {
    name: 'Calanques',
    dropdownTitle: 'Explorer les Calanques de Marseille',
    icon: 'MapPin',
    description: 'Carte interactive, accès aux massifs, actualités du Parc national et communauté des amoureux des Calanques.',
    children: [
      { name: 'Groupe Facebook Calanques',       path: '/communaute-calanques',    icon: 'Users',     isHub: true, hubDesc: `${FACEBOOK_GROUP_MEMBERS.toLocaleString('fr-FR')} membres — la plus grande communauté des Calanques` },
      { name: 'Carte interactive des Calanques', path: '/carte-calanques',         icon: 'MapPin'     },
      { name: 'Accès aux massifs forestiers',    path: '/acces-massifs-calanques', icon: 'Navigation' },
      { name: 'News Parc des Calanques',         path: '/actualites',              icon: 'Newspaper'  },
    ],
  },
  {
    name: 'Contact',
    dropdownTitle: 'Découvrir comment agir pour la mer',
    icon: 'Mail',
    description: 'Collaborations, partenariats médias ou institutionnels — rejoignez la mission Dark Massilia.',
    children: [
      { name: 'Collaborer avec nous',         path: '/contact',                         icon: 'Mail',    isHub: true, hubDesc: 'Partenariats, médias, institutions' },
      { name: 'Envoyer un email',             path: 'mailto:contact@karimsaari.com',    icon: 'AtSign'  },
      { name: 'Newsletter',                   path: '/#newsletter',                     icon: 'Send'    },
      { name: 'Team Oxygen — site officiel',  path: 'https://www.team-oxygen.com/',     icon: 'Compass' },
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

// Animation variants for Framer Motion
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export const STAGGER_CONTAINER = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};
