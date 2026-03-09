import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ExternalLink, Star, MapPin, ThumbsUp, Eye } from 'lucide-react';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const StatCounter = ({ end, suffix = '', decimals = 0, duration = 2000 }) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) { setCount(end); return; }
    let startTime = null;
    let raf;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration, decimals, prefersReducedMotion]);
  const display = decimals > 0
    ? count.toFixed(decimals).replace('.', ',')
    : count.toLocaleString('fr-FR');
  return <span ref={ref}>{display}{suffix}</span>;
};

const STATS = [
  { label: 'Contributions', end: 22000, suffix: '+', icon: Star },
  { label: 'Points obtenus', end: 118000, suffix: '+', icon: ThumbsUp },
  { label: 'Vues générées', end: 183, suffix: ' M', icon: Eye },
  { label: 'Niveau', end: 10, suffix: '', icon: null, badge: true },
];

const PROFILE_URL = 'https://www.google.com/maps/contrib/114912564832630219145/photos';

const GALLERY = [
  { src: '/images/portfolio/Mer/12.webp', alt: 'Dark Massilia — photographie sous-marine dans les Calanques de Marseille' },
  { src: '/images/portfolio/Mer/10.webp', alt: 'Dark Massilia — apnée et documentation marine, Méditerranée' },
  { src: '/images/portfolio/Mer/80.webp', alt: 'Dark Massilia — faune marine des Calanques, plongée en apnée' },
];

export default function LocalGuide() {
  return (
    <>
      <SEO {...SEO_PAGES['/local-guide-marseille']} />

      <div className="min-h-screen pt-20 pb-16">
        <div className="container-custom">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#4285F4]/20 border border-[#4285F4]/30 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#4285F4]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                  Google Local Guides
                </h1>
                <p className="text-text-secondary text-lg">
                  Karim Saari — Marseille & Calanques
                </p>
              </div>
            </div>
          </motion.div>

          {/* Carte anniversaire 9 ans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass rounded-2xl p-5 mb-4 flex items-center gap-6 border border-white/5"
          >
            <picture>
              <source srcSet="/images/karim-saari-marseille-dark-massilia-9ans-celebration-projet-sentinelle.webp" type="image/webp" />
              <img
                src="/images/karim-saari-marseille-dark-massilia-9ans-celebration-projet-sentinelle.gif"
                alt="Google Local Guides — email anniversaire 9 ans"
                className="w-24 md:w-28 flex-shrink-0 rounded-xl"
              />
            </picture>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Anniversaire Google</p>
              <p className="text-white font-semibold text-lg leading-snug">Ces 9 dernières années</p>
              <p className="text-text-secondary text-sm mt-1">
                Email envoyé par Google pour célébrer 9 ans de contributions sur Google Maps.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {STATS.map(({ label, end, suffix, decimals = 0, icon: Icon, badge }) => (
              <div key={label} className="glass rounded-xl p-5 text-center border border-white/5 hover:border-ocean-teal/20 transition-all duration-300">
                {badge ? (
                  <img
                    src="/assets/points-badges_level_ten.png"
                    alt="Google Local Guides — Niveau 10"
                    className="w-8 h-8 object-contain mx-auto mb-2"
                  />
                ) : (
                  <Icon className="w-6 h-6 text-ocean-teal mx-auto mb-2" />
                )}
                <div className="text-2xl font-bold text-white mb-1">
                  <StatCounter end={end} suffix={suffix} />
                </div>
                <div className="text-xs text-text-muted">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Texte éditorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="glass-strong rounded-3xl p-8 md:p-12 mb-12"
          >
            <div className="space-y-4 text-text-secondary leading-relaxed text-lg">
              <p>
                Mon engagement avec Google a commencé il y a plus de 9 ans, à une période où la
                plateforme développait activement la cartographie 360° via Street View.
              </p>
              <p>
                À l'époque, Google m'a prêté une caméra 360° pour documenter des zones difficiles
                d'accès. J'ai couvert les{' '}
                <strong className="text-white">Calanques de Marseille</strong>, territoire complexe
                et partiellement inaccessible aux dispositifs classiques de captation.
              </p>
              <p>
                J'ai obtenu la{' '}
                <strong className="text-ocean-teal">certification Street View Trusted</strong>,
                reconnaissance accordée aux contributeurs capables de produire des contenus
                immersifs conformes aux standards techniques de Google. Street View a depuis été
                intégré pleinement à Google Maps, mais la logique reste identique : documenter le
                terrain réel.
              </p>

              {/* Logo Street View Trusted */}
              <div className="flex items-center gap-4 py-2">
                <img
                  src="/images/logo-trusted.webp"
                  alt="Google Street View Trusted — certification contributeur"
                  className="h-10 object-contain opacity-80"
                />
                <p className="text-sm text-text-muted italic">
                  Programme Street View Trusted — certification désormais intégrée à Google Maps
                </p>
              </div>

              <p>
                Neuf ans plus tard, ces contributions ont généré plus de{' '}
                <strong className="text-white">183 millions de vues</strong> sur Google Maps. Ce
                chiffre signifie concrètement que des millions de personnes ont découvert les
                Calanques, les sentiers du Parc National ou les criques du littoral à travers mes
                photos et avis — avant même de les avoir visitées. Une portée que je n'aurais pas
                imaginée en acceptant la caméra 360° au départ.
              </p>

              <p>
                Mon approche ne se limite pas à la cartographie. Je publie également les actions
                de dépollution sous-marine, les déchets extraits en mer, les déchets observés sur
                les sentiers et espaces naturels.
              </p>
              <p>
                L'objectif est double : <strong className="text-white">valoriser le territoire</strong>{' '}
                et <strong className="text-white">rendre visible son état environnemental réel</strong>.
              </p>
            </div>
          </motion.div>

          {/* Galerie photos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {GALLERY.map(({ src, alt }, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <img
                  src={src}
                  alt={alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Liens bas de page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 flex flex-col items-center gap-4"
          >
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #4285F4, #34A853)',
                boxShadow: '0 4px 20px rgba(66,133,244,0.3)',
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Voir mon profil Local Guides
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="/carte-calanques"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-ocean-teal/30 text-ocean-teal text-sm font-medium hover:bg-ocean-teal/10 transition-all duration-300"
            >
              <MapPin className="w-4 h-4" />
              Voir la Carte interactive
            </a>
          </motion.div>

        </div>
      </div>
    </>
  );
}
