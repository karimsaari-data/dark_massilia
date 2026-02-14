import { Instagram, Youtube, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, APP_CONFIG, NAV_LINKS } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
    { Icon: Youtube, href: SOCIAL_LINKS.youtube, label: 'YouTube' },
    { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
    { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-abyss-light/50 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text">Dark Massilia</h3>
                <p className="text-xs text-gray-400">Sentinelle de la Mer</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Éco-acteur marseillais, apnéiste & sentinelle de la Méditerranée. Dépollution des Calanques avec Team Oxygen.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <nav className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-gray-400 hover:text-ocean-teal transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-2 mb-6">
              <a
                href={`mailto:${APP_CONFIG.contactEmail}`}
                className="block text-sm text-gray-400 hover:text-ocean-teal transition-colors"
              >
                {APP_CONFIG.contactEmail}
              </a>
              <a
                href={`https://wa.me/${APP_CONFIG.contactWhatsApp.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 hover:text-ocean-teal transition-colors"
              >
                WhatsApp: {APP_CONFIG.contactWhatsApp}
              </a>
            </div>

            <div className="flex space-x-3">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-ocean-teal/20 hover:border-ocean-teal/30 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-ocean-teal transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400">
            © {currentYear} Dark Massilia · Karim Saari. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.team-oxygen.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-ocean-teal transition-colors"
            >
              Team Oxygen
            </a>
            <span className="text-gray-600">·</span>
            <span className="text-sm text-gray-400">Marseille, France</span>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ocean-teal/50 to-transparent" />
    </footer>
  );
};

export default Footer;
