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

export const NAV_LINKS = [
  {
    name: 'Missions',
    icon: 'Compass',
    description: 'Dépollution des fonds marins en apnée, documentation scientifique et mobilisation citoyenne dans les Calanques.',
    children: [
      { name: 'Photos sous-marines',       path: '/photographie-sous-marine', icon: 'Camera'   },
      { name: 'Dépollution marine',       path: '/depollution-marine',       icon: 'Compass'  },
      { name: 'Rejoindre la communauté',  path: '/communaute',               icon: 'Share2'   },
      { name: 'Données scientifiques',    path: '/donnees-scientifiques',    icon: 'BarChart2' },
    ],
  },
  {
    name: 'Explorer',
    icon: 'Compass',
    description: 'Galeries photo paysages & mer, carte interactive des Calanques et guide local de Marseille.',
    children: [
      { name: 'Photos de paysages',  path: '/photographie-paysage-mer', icon: 'Camera'     },
      { name: 'Carte des Calanques', path: '/carte-calanques',          icon: 'MapPin'     },
      { name: 'Google Local Guide',  path: '/local-guide-marseille',    icon: 'Navigation' },
      { name: 'Blog',                path: '/blog',                     icon: 'BookOpen'   },
      { name: 'Actualités',          path: '/actualites',               icon: 'Newspaper'  },
    ],
  },
  {
    name: 'Médias',
    icon: 'Film',
    description: 'Documentaires ARTE, presse nationale, vidéos et actualités sur l\'engagement environnemental à Marseille.',
    children: [
      { name: 'Vidéos',                  path: '/videos',                                        icon: 'Video'     },
      { name: 'Presse',                  path: '/presse',                                        icon: 'Film'      },
      { name: 'ARTE — Sauver Marseille', path: '/sauver-marseille-documentaire-arte',            icon: 'Tv'        },
      { name: 'ARTE — Méduses',          path: '/meduses-souveraines-oceans-documentaire-arte',  icon: 'Tv'        },
      { name: 'Yann Arthus-Bertrand',    path: '/les-francais-yann-arthus-bertrand',             icon: 'Camera'    },
    ],
  },
  {
    name: 'Contact',
    icon: 'Mail',
    description: 'Collaborations, partenariats médias ou institutionnels — rejoignez la mission Dark Massilia.',
    children: [
      { name: 'Collaborer avec nous',          path: '/contact',                                              icon: 'Mail'    },
      { name: 'Newsletter',                   path: '/#newsletter',                                          icon: 'Send'    },
      { name: 'Amoureux des Calanques',       path: 'https://www.facebook.com/groups/calanque/',             icon: 'Share2'  },
      { name: 'Team Oxygen',                  path: 'https://www.team-oxygen.com/',                          icon: 'Compass' },
    ],
  },
];

export const TAGLINE = 'Une Mer · Une Ville · Une Mission';

export const MISSION_STATEMENT =
  "Sentinelle des Calanques, je documente et nettoie les fonds marins de Marseille en apnée. Avec Team Oxygen, chaque plongée devient une mission de dépollution.";

// Facebook Group Stats
export const FACEBOOK_GROUP_MEMBERS = 64300;

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
