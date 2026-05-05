import { Instagram, Linkedin, Facebook, AtSign, Send } from 'lucide-react';

// X (Twitter) icon — Lucide n'a pas le logo X
const XTwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, APP_CONFIG, NAV_LINKS } from '../../utils/constants';
import { openConsentBanner } from '../../utils/consent';
import { trackEvent } from '../../lib/analytics';

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
    label: 'Portfolio',
    links: [
      { to: '/photographe-environnemental-marseille', text: 'Photographe environnemental' },
      { to: '/photographie-sous-marine',              text: 'Photos sous-marines' },
      { to: '/photographie-paysage-mer',              text: 'Photos de paysages' },
      { to: '/les-francais-yann-arthus-bertrand',     text: 'Yann Arthus-Bertrand' },
    ],
  },
  {
    label: 'Missions',
    links: [
      { to: '/communaute',            text: 'Rejoindre la communauté' },
      { to: '/depollution-marine',    text: 'Dépollution marine' },
      { to: '/donnees-scientifiques', text: 'Données scientifiques' },
      { to: '/local-guide-marseille', text: 'Google Local Guide' },
    ],
  },
  {
    label: 'Médias',
    links: [
      { to: '/videos',                                       text: 'Vidéos & Documentaires' },
      { to: '/sauver-marseille-documentaire-arte',           text: 'ARTE — Sauver Marseille' },
      { to: '/meduses-souveraines-oceans-documentaire-arte', text: 'ARTE — Méduses' },
      { to: '/presse',                                       text: 'Presse' },
      { to: '/blog',                                         text: 'Blog' },
    ],
  },
  {
    label: 'Calanques',
    links: [
      { to: '/communaute-calanques',    text: 'Groupe Facebook Calanques' },
      { to: '/carte-calanques',         text: 'Carte interactive' },
      { to: '/acces-massifs-calanques', text: 'Accès aux massifs' },
      { to: '/actualites',              text: 'News Parc des Calanques' },
    ],
  },
  {
    label: 'Contact',
    links: [
      { to: '/contact',                     text: 'Collaborer avec nous' },
      { to: '/#newsletter',                 text: 'Newsletter', anchor: true },
      { to: 'https://www.team-oxygen.com/', text: 'Team Oxygen', external: true },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { Icon: Send, href: '/#newsletter', label: 'Newsletter', anchor: true },
    { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
    { Icon: TikTokIcon, href: SOCIAL_LINKS.tiktok, label: 'TikTok' },
    { Icon: XTwitterIcon, href: SOCIAL_LINKS.twitter, label: 'X (Twitter)' },
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
            {navColumns.map((col) => (
              <div key={col.label}>
                <p className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
                  {col.label}
                </p>
                <ul className="space-y-1">
                  {col.links.map((link) => {
                    const renderSingle = (l) => l.action ? (
                      <button type="button" onClick={l.action} className="text-sm text-gray-300 hover:text-astroide transition-colors duration-200 cursor-pointer py-1.5">
                        {l.text}
                      </button>
                    ) : l.anchor || l.external ? (
                      <a href={l.to} className="text-sm text-gray-300 hover:text-ocean-teal transition-colors duration-200 py-1.5">
                        {l.text}
                      </a>
                    ) : (
                      <Link to={l.to} className="text-sm text-gray-300 hover:text-ocean-teal transition-colors duration-200 py-1.5">
                        {l.text}
                      </Link>
                    );
                    return (
                      <li key={link.to}>
                        {link.paired ? (
                          <span className="flex items-center justify-center gap-2">
                            {renderSingle(link)}
                            <span className="text-gray-600 text-xs select-none">|</span>
                            {renderSingle(link.paired)}
                          </span>
                        ) : renderSingle(link)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Logo circulaire Dark Massilia — ancrage marque, au-dessus des icônes */}
        <div className="flex justify-center mb-5">
          <div
            className="w-20 h-20 rounded-full bg-white overflow-hidden hover:scale-105 transition-all duration-300"
            style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.3), 0 0 16px rgba(0,171,168,0.25)' }}
          >
            <img
              src="/assets/dark-massilia-logo-200.webp"
              alt="Dark Massilia — logo de Karim Saari, photographe à Marseille"
              width="80"
              height="80"
              className="w-full h-full object-contain p-1"
              loading="lazy"
            />
          </div>
        </div>

        {/* Social Icons - Centered */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
          {socialIcons.map(({ Icon, href, label, anchor, internal }) => {
            const iconClass = "w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-astroide/50 hover:bg-astroide/10 transition-all duration-300 group";
            const innerIcon = <Icon className="w-5 h-5 text-gray-400 group-hover:text-astroide transition-colors" />;

            if (anchor || internal) {
              return (
                <Link key={label} to={href} aria-label={label} className={iconClass}>
                  {innerIcon}
                </Link>
              );
            }
            return (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={iconClass} onClick={() => trackEvent('social_click', { platform: label })}>
                {innerIcon}
              </a>
            );
          })}
        </div>

        {/* Copyright + liens légaux — SEO optimisé */}
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">
            <span itemProp="addressLocality">Marseille</span>
            {', '}
            <span itemProp="addressRegion">Bouches-du-Rhône</span>
            {' · France'}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            © {currentYear}{' '}
            <span className="text-gray-300 font-medium">Karim Saari</span>
            {' '}| Photographe environnemental &amp; sous-marin · Sentinelle des Calanques — Fondateur de{' '}
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
              to="/plan-du-site"
              className="text-xs text-gray-400 hover:text-ocean-teal transition-colors duration-200 py-1.5 px-1"
            >
              Plan du site
            </Link>
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
