import { useEffect } from 'react';
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

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Chargement du script Website Carbon Badge
  useEffect(() => {
    if (document.getElementById('wcb-script')) return;
    const script = document.createElement('script');
    script.id = 'wcb-script';
    script.src = 'https://unpkg.com/website-carbon-badges@1.1.3/b.min.js';
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const socialIcons = [
    { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
    { Icon: XIcon, href: SOCIAL_LINKS.twitter, label: 'X (Twitter)' },
    { Icon: TikTokIcon, href: SOCIAL_LINKS.tiktok, label: 'TikTok' },
    { Icon: Youtube, href: SOCIAL_LINKS.youtube, label: 'YouTube' },
    { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
    { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
    { Icon: AtSign, href: '/contact', label: 'Contact', internal: true },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-abyss-light/30 mt-20">
      <div className="container-custom py-8">
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

        {/* Website Carbon Badge */}
        <div className="flex justify-center mb-4">
          <div id="wcb" className="carbonbadge wcb-d" />
        </div>

        {/* Copyright - Centered */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © {currentYear} Dark Massilia · Karim Saari
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
