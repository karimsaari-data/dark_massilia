import { Instagram, Linkedin, Facebook, AtSign, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, APP_CONFIG, NAV_LINKS } from '../../utils/constants';
import { openConsentBanner } from '../../utils/consent';

// TikTok icon component (Lucide doesn't have TikTok, so we use a custom SVG)
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// 500px icon component
const Px500Icon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm0 2.4c-3.977 0-7.2 3.223-7.2 7.2s3.223 7.2 7.2 7.2 7.2-3.223 7.2-7.2-3.223-7.2-7.2-7.2zm0 2.4c2.651 0 4.8 2.149 4.8 4.8S14.651 16.8 12 16.8 7.2 14.651 7.2 12s2.149-4.8 4.8-4.8zm0 2.4c-1.326 0-2.4 1.074-2.4 2.4s1.074 2.4 2.4 2.4 2.4-1.074 2.4-2.4-1.074-2.4-2.4-2.4z"/>
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
      { to: '/blog', text: 'Actualités' },
    ],
  },
  {
    label: 'Contact',
    links: [
      { to: '/contact', text: 'Collaborer avec nous' },
      { to: '/#newsletter', text: 'Newsletter', anchor: true },
      { to: 'mailto:contact@karimsaari.com', text: 'Envoyer un mail', external: true },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { Icon: Send, href: '/#newsletter', label: 'Newsletter', anchor: true },
    { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
    { Icon: TikTokIcon, href: SOCIAL_LINKS.tiktok, label: 'TikTok' },
    { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
    { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
    { Icon: Px500Icon, href: SOCIAL_LINKS.px500, label: '500px' },
    { Icon: AtSign, href: '/contact', label: 'Contact', internal: true },
  ];

  return (
    <footer className="relative border-t border-white/5 mt-20" style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="container-custom py-12">

        {/* Navigation secondaire — maillage interne SEO */}
        <nav aria-label="Navigation secondaire" className="mb-10 pb-8 border-b border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {navColumns.map((col) => (
              <div key={col.label}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {col.label}
                </p>
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      {link.action ? (
                        <button
                          type="button"
                          onClick={link.action}
                          className="text-sm text-gray-300 hover:text-ocean-teal transition-colors duration-200 cursor-pointer py-1.5 block w-full"
                        >
                          {link.text}
                        </button>
                      ) : link.anchor || link.external ? (
                        <a
                          href={link.to}
                          className="text-sm text-gray-300 hover:text-ocean-teal transition-colors duration-200 py-1.5 block"
                        >
                          {link.text}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className="text-sm text-gray-300 hover:text-ocean-teal transition-colors duration-200 py-1.5 block"
                        >
                          {link.text}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Logo circulaire Dark Massilia — ancrage marque, au-dessus des icônes */}
        <div className="flex justify-center mb-5">
          <div
            className="w-20 h-20 rounded-full bg-white overflow-hidden hover:scale-105 transition-all duration-300"
            style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.3), 0 0 16px rgba(33,196,123,0.2)' }}
          >
            <img
              src="/assets/dark-massilia-logo.webp"
              alt="Dark Massilia — logo de Karim Saari, photographe à Marseille"
              width="80"
              height="80"
              className="w-full h-full object-contain p-1"
              loading="lazy"
            />
          </div>
        </div>

        {/* Social Icons - Centered */}
        <div className="flex justify-center items-center gap-5 mb-8">
          {socialIcons.map(({ Icon, href, label, anchor, internal }) => {
            const iconClass = "w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-ocean-teal/50 hover:bg-ocean-teal/10 transition-all duration-300 group";
            const innerIcon = <Icon className="w-5 h-5 text-gray-400 group-hover:text-ocean-teal transition-colors" />;

            if (anchor || internal) {
              return (
                <Link key={label} to={href} aria-label={label} className={iconClass}>
                  {innerIcon}
                </Link>
              );
            }
            return (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={iconClass}>
                {innerIcon}
              </a>
            );
          })}
        </div>

        {/* Copyright + liens légaux — SEO optimisé */}
        <div className="text-center">
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            © {currentYear}{' '}
            <span className="text-gray-300 font-medium">Karim Saari</span>
            {' '}| Photographe de paysages &amp; Sentinelle des calanques — Fondateur de{' '}
            <span className="text-gray-300">Dark Massilia</span>
            {' '}&amp; Président de{' '}
            <a
              href="https://www.team-oxygen.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-ocean-teal underline decoration-white/40 hover:decoration-ocean-teal/60 underline-offset-2 transition-colors duration-200"
            >
              Team Oxygen
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link
              to="/mentions-legales"
              className="text-xs text-gray-400 hover:text-ocean-teal transition-colors duration-200 py-1.5 px-1"
            >
              Mentions légales
            </Link>
            <Link
              to="/confidentialite"
              className="text-xs text-gray-400 hover:text-ocean-teal transition-colors duration-200 py-1.5 px-1"
            >
              Politique de confidentialité
            </Link>
            <button
              type="button"
              onClick={openConsentBanner}
              className="text-xs text-gray-400 hover:text-ocean-teal transition-colors duration-200 cursor-pointer py-1.5 px-1"
            >
              Gérer les cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
