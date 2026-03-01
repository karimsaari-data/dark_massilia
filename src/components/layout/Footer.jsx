import { Instagram, Youtube, Linkedin, Facebook, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, APP_CONFIG, NAV_LINKS } from '../../utils/constants';

// TikTok icon component (Lucide doesn't have TikTok, so we use a custom SVG)
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// X/Twitter icon component
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// 500px icon component
const Px500Icon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm0 2.4c-3.977 0-7.2 3.223-7.2 7.2s3.223 7.2 7.2 7.2 7.2-3.223 7.2-7.2-3.223-7.2-7.2-7.2zm0 2.4c2.651 0 4.8 2.149 4.8 4.8S14.651 16.8 12 16.8 7.2 14.651 7.2 12s2.149-4.8 4.8-4.8zm0 2.4c-1.326 0-2.4 1.074-2.4 2.4s1.074 2.4 2.4 2.4 2.4-1.074 2.4-2.4-1.074-2.4-2.4-2.4z"/>
  </svg>
);

// Pinterest icon component
const PinterestIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const navColumns = [
  {
    label: 'Missions',
    links: [
      { to: '/depollution-marine', text: 'Dépollution marine' },
      { to: '/donnees-scientifiques', text: 'Données scientifiques' },
      { to: '/communaute', text: 'Communauté' },
    ],
  },
  {
    label: 'Médias',
    links: [
      { to: '/videos', text: 'Vidéos' },
      { to: '/presse', text: 'Presse' },
      { to: '/sauver-marseille-documentaire-arte', text: 'Documentaire ARTE' },
      { to: '/les-francais-yann-arthus-bertrand', text: 'Yann Arthus-Bertrand' },
    ],
  },
  {
    label: 'Explorer',
    links: [
      { to: '/photographie-paysage-mer', text: 'Photographies' },
      { to: '/carte-calanques', text: 'Carte des Calanques' },
      { to: '/local-guide-marseille', text: 'Google Local Guide' },
    ],
  },
  {
    label: 'Contact',
    links: [
      { to: '/contact', text: 'Collaborer avec nous' },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
    { Icon: XIcon, href: '/twitter', label: 'X (Twitter)', internal: true },
    { Icon: TikTokIcon, href: SOCIAL_LINKS.tiktok, label: 'TikTok' },
    { Icon: Youtube, href: SOCIAL_LINKS.youtube, label: 'YouTube' },
    { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
    { Icon: Px500Icon, href: SOCIAL_LINKS.px500, label: '500px' },
    { Icon: PinterestIcon, href: SOCIAL_LINKS.pinterest, label: 'Pinterest' },
    { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
    { Icon: AtSign, href: '/contact', label: 'Contact', internal: true },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-abyss-light/30 mt-20">
      <div className="container-custom py-12">

        {/* Navigation secondaire — maillage interne SEO */}
        <nav aria-label="Navigation secondaire" className="mb-10 pb-8 border-b border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {navColumns.map((col) => (
              <div key={col.label}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                  {col.label}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-400 hover:text-ocean-teal transition-colors duration-200"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Social Icons - Centered */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          {socialIcons.map(({ Icon, href, label, internal }) => {
            const Component = internal ? Link : 'a';
            const linkProps = internal
              ? { to: href }
              : { href, target: '_blank', rel: 'noopener noreferrer' };

            return (
              <Component
                key={label}
                {...linkProps}
                aria-label={label}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-ocean-teal/50 hover:bg-ocean-teal/10 transition-all duration-300 group"
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-ocean-teal transition-colors" />
              </Component>
            );
          })}
        </div>

        {/* Copyright - Centered */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            © {currentYear} Dark Massilia · Karim Saari
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
