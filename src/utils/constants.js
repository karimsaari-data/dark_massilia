// Application constants and configuration

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Dark Massilia',
  url: import.meta.env.VITE_APP_URL || 'https://karimsaari.com',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'email@karimsaari.com',
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
  { name: 'Missions', path: '/depollution-marine', icon: 'Compass' },
  { name: 'Vidéos', path: '/videos', icon: 'Video' },
  { name: 'Photos', path: '/photographie-paysage-mer', icon: 'Camera' },
  { name: 'Médias', path: '/presse', icon: 'Film' },
  { name: 'Réseaux', path: '/communaute', icon: 'Share2' },
  { name: 'Carte', path: '/carte-calanques', icon: 'MapPin' },
  { name: 'Contact', path: '/contact', icon: 'Mail' },
  // Menu mobile uniquement — pages secondaires
  { name: 'Blog', path: '/blog', icon: 'BookOpen', mobileOnly: true },
  { name: 'Local Guides', path: '/local-guide-marseille', icon: 'Navigation', mobileOnly: true },
  { name: 'Références', path: '/donnees-scientifiques', icon: 'BookOpen', mobileOnly: true },
];

export const TAGLINE = 'Une Mer · Une Ville · Une Mission';

export const MISSION_STATEMENT =
  "Sentinelle de la Méditerranée, je documente et nettoie les fonds marins des Calanques de Marseille en apnée. Avec Team Oxygen, chaque plongée devient une mission de dépollution.";

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
  hidden: { y: 30 },
  visible: {
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
