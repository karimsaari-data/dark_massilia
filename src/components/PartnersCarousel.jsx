/**
 * PartnersCarousel — Barre de défilement infini des logos partenaires/médias
 *
 * - Défilement horizontal continu de droite à gauche
 * - Logos gris clair par défaut, couleurs originales au survol individuel
 * - Animation en pause au survol de la barre
 * - Masque de fondu sur les bords pour une transition invisible
 */

const logos = [
  { src: '/images/Partenaires/svg/Logo_TF1_Info.svg',                    alt: 'TF1 Info',              href: 'https://www.tf1info.fr/' },
  { src: '/images/Partenaires/svg/France_Bleu_2021.svg',                 alt: 'France Bleu',           href: 'https://www.francebleu.fr/' },
  { src: '/images/Partenaires/svg/France_Inter_logo.svg',                alt: 'France Inter',          href: 'https://www.radiofrance.fr/franceinter/' },
  { src: '/images/Partenaires/svg/Franceinfo.svg',                       alt: 'Franceinfo',            href: 'https://www.francetvinfo.fr/' },
  { src: '/images/Partenaires/svg/France.tv_-_logo_2022.svg',            alt: 'France.tv',             href: 'https://www.france.tv/' },
  { src: '/images/Partenaires/svg/France_5_-_logo_2018.svg',             alt: 'France 5',              href: 'https://www.france.tv/france-5/' },
  { src: '/images/Partenaires/svg/Arte-Logo.svg',                        alt: 'ARTE',                  href: 'https://www.arte.tv/' },
  { src: '/images/Partenaires/svg/Logo_M6_(2020,_fond_clair).svg',       alt: 'M6',                    href: 'https://www.m6.fr/' },
  { src: '/images/Partenaires/svg/Europe1-logo.svg',                     alt: 'Europe 1',              href: 'https://www.europe1.fr/' },
  { src: '/images/Partenaires/svg/La-provence-2023.svg',                 alt: 'La Provence',           href: 'https://www.laprovence.com/' },
  { src: '/images/Partenaires/svg/midi-libre-logo-vector.svg',           alt: 'Midi Libre',            href: 'https://www.midilibre.fr/' },
  { src: '/images/Partenaires/svg/Actu.fr_logo_2020.svg',                alt: 'Actu.fr',               href: 'https://actu.fr/' },
  { src: '/images/Partenaires/svg/national-geographic-logo.svg',          alt: 'National Geographic',   href: 'https://www.nationalgeographic.fr/' },
  { src: '/images/Partenaires/svg/Armoiries_de_Marseille.svg',           alt: 'Ville de Marseille',    href: 'https://www.marseille.fr/' },
  { src: '/images/Partenaires/svg/logo-fondation-de-la-mer.svg', alt: 'Fondation de la Mer',   href: 'https://www.fondationdelamer.org/' },
  { src: '/images/Partenaires/svg/logo-un-geste-pour-la-mer.svg',        alt: 'Un Geste pour la Mer',  href: 'https://www.ungestepourlamer.org/' },
  { src: '/images/Partenaires/svg/Logo_NOVO19_-_2025.svg',               alt: 'Novo19',                href: 'https://www.novo19.tv/' },
];

export default function PartnersCarousel() {
  return (
    <section
      className="mb-8 py-8 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
      aria-label="Médias et partenaires"
    >
      {/* Conteneur avec masque de fondu sur les bords */}
      <div
        className="relative overflow-hidden group"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        {/* Piste double pour le défilement infini */}
        <div
          className="flex items-center gap-16 w-max animate-scroll-left group-hover:[animation-play-state:paused]"
        >
          {logos.map((logo, i) => (
            <LogoItem key={`a-${i}`} {...logo} />
          ))}
          {logos.map((logo, i) => (
            <LogoItem key={`b-${i}`} {...logo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoItem({ src, alt, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={alt}
      className="flex-shrink-0 group/logo"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-10 w-auto object-contain
                   brightness-0 invert opacity-80
                   transition-all duration-300
                   group-hover/logo:brightness-100 group-hover/logo:invert-0 group-hover/logo:opacity-100"
        style={{ maxWidth: '140px' }}
      />
    </a>
  );
}
