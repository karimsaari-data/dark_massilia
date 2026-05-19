import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import YouTubeFacade from '../components/media/YouTubeFacade';
import Breadcrumb from '../components/Breadcrumb';

const img = (n) =>
  `/images/arte-meduses-souveraines-oceans-documentaire-marseille-${n}`;

const HUBLOT_STYLE = {
  overflow: 'hidden',
  borderRadius: '24px',
  border: '2px solid rgba(0,171,168,0.55)',
  boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
};

const Meduses = () => {
  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/meduses-souveraines-oceans-documentaire-arte']} />

      {/* Hero — hublot vidéo */}
      <section
        className="container-custom"
        style={{ paddingTop: '1rem', paddingBottom: '2rem' }}
      >
        <motion.div initial="hidden" animate="visible" variants={STAGGER_CONTAINER}>
          <motion.div
            variants={{ hidden: { y: 20 }, visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
            style={HUBLOT_STYLE}
          >
            {/* Vidéo plein-largeur dans le cadre */}
            <motion.div variants={FADE_IN_UP}>
              <YouTubeFacade
                videoId="yfebiTFOq7E"
                title="Méduses | Les souveraines des océans — Documentaire ARTE Évasion"
                aspectClass="aspect-[16/8]"
              />
            </motion.div>
            {/* Header text */}
            <div className="p-8 md:p-10 pt-6">
              <Breadcrumb label="Méduses — Documentaire ARTE" />
              <div className="mt-4 max-w-3xl">
                <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">
                  ARTE Évasion · Sébastien Lafont, 2024
                </motion.p>
                <motion.h1
                  variants={FADE_IN_UP}
                  className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight"
                >
                  Méduses — Les souveraines des océans
                </motion.h1>
                <motion.p variants={FADE_IN_UP} className="text-white/70 text-base md:text-lg max-w-2xl">
                  Documentaire ARTE aux images envoûtantes sur la prolifération des méduses — avec des images fournies par Karim Saari, tournées en Méditerranée.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="container-custom pb-12">

        {/* Bloc 1 — Description ARTE + photos 2 & 3 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-8"
        >
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-ocean-teal font-semibold">
                  ARTE Évasion
                </span>
                <span className="text-text-muted">·</span>
                <span className="text-sm text-text-muted">
                  Réalisé par <strong className="text-white">Sébastien Lafont</strong> — France, 2024, 43 min
                </span>
              </div>
              <div className="space-y-4 text-text-secondary leading-[1.8] text-lg">
                <p>
                  Les méduses sont-elles en passe de dominer les océans ? Donnant la parole à l'une
                  d'elles, ce documentaire aux images envoûtantes dévoile les superpouvoirs de ces
                  créatures d'apparence si fragile, qui profitent de la surpêche, de la pollution et
                  du réchauffement climatique pour proliférer.
                </p>
                <p>
                  Elles n'ont ni cœur, ni cerveau, ni squelette et sont constituées à 90 % d'eau.
                  Malgré leur apparente fragilité, les méduses ont conquis toutes les mers du globe
                  au fil de leurs{' '}
                  <strong className="text-white">650 millions d'années d'évolution</strong>. Mais
                  depuis quelques décennies, de la{' '}
                  <strong className="text-ocean-teal">Méditerranée</strong> aux fjords norvégiens en
                  passant par les côtes namibiennes, leur prolifération inquiète. Cette{' '}
                  <em>« gélification »</em> des mers et océans menace des pêcheries et aquacultures
                  aux quatre coins du monde.
                </p>
                <p>
                  Capacités de reproduction hors normes, venins redoutables, immortalité… Par la
                  voix d'<em>Aurelia aurita</em>, la méduse commune, ce documentaire passe en revue
                  les superpouvoirs de ses congénères et se penche sur les raisons de leur expansion
                  spectaculaire.
                </p>
              </div>
            </div>

            {/* Photos 2 & 3 */}
            <div className="lg:w-[38%] flex-shrink-0 flex flex-col min-h-[300px] lg:min-h-0">
              {[2, 3].map((n) => (
                <div key={n} className="flex-1 overflow-hidden">
                  <picture>
                    <source srcSet={`${img(n)}.webp`} type="image/webp" />
                    <img
                      src={`${img(n)}.jpg`}
                      alt={`Méduses en Méditerranée — image fournie pour le documentaire ARTE Évasion (${n - 1}/4)`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bloc 2 — Contribution éditoriale + photos 4 & 5 + bouton YouTube */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Photos 4 & 5 — à gauche */}
            <div className="lg:w-[38%] flex-shrink-0 flex flex-col min-h-[300px] lg:min-h-0 order-last lg:order-first">
              {[4, 5].map((n) => (
                <div key={n} className="flex-1 overflow-hidden">
                  <picture>
                    <source srcSet={`${img(n)}.webp`} type="image/webp" />
                    <img
                      src={`${img(n)}.jpg`}
                      alt={`Méduses en Méditerranée — image fournie pour le documentaire ARTE Évasion (${n - 1}/4)`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              ))}
            </div>

            {/* Texte + bouton */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <div className="flex items-start justify-between gap-6 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Contribution au documentaire ARTE « Méduses | Les souveraines des océans »
                </h2>
                <div className="w-14 h-14 rounded-full bg-white overflow-hidden flex-shrink-0 animate-pulse-glow">
                  <img
                    src="/assets/dark-massilia-logo-200.webp"
                    alt="Logo Dark Massilia — Karim Saari"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="space-y-4 text-text-secondary leading-[1.8] text-lg">
                <p>
                  Le documentaire{' '}
                  <strong className="text-white">« Méduses | Les souveraines des océans »</strong>{' '}
                  a été mis en ligne sur YouTube le 18 novembre 2025 par{' '}
                  <strong className="text-ocean-teal">ARTE Évasion</strong>. Diffusé initialement en
                  2024, ce film réalisé par{' '}
                  <strong className="text-white">Sébastien Lafont</strong> explore la prolifération
                  des méduses et la transformation des écosystèmes marins. J'ai fourni plusieurs
                  images tournées en Méditerranée pour cette production, issues de mon travail de
                  terrain.
                </p>
                <p>
                  La méduse n'est pas un sujet anecdotique dans mon univers : elle est au cœur de
                  l'identité visuelle de{' '}
                  <strong className="text-ocean-teal">Dark Massilia</strong>. Symbole d'adaptation
                  et d'évolution, elle représente à la fois la fragilité des équilibres marins et la
                  capacité du vivant à survivre aux bouleversements.
                </p>
                <p>
                  Contribuer à ce documentaire s'inscrit dans la continuité de mon engagement :
                  documenter l'océan, comprendre ses mutations et rendre visibles les signaux faibles
                  qui annoncent ses transformations.
                </p>
              </div>

              {/* Bouton YouTube intégré */}
              <div className="mt-8">
                <a
                  href="https://youtu.be/yfebiTFOq7E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn inline-flex items-center gap-3 group hover:scale-105 transition-all duration-300"
                >
                  <span>Voir sur YouTube — ARTE Évasion</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTAs — Continuer la navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/depollution-marine"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Nos missions de dépollution</span>
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link
            to="/sauver-marseille-documentaire-arte"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <span>ARTE — Sauver Marseille</span>
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            to="/presse"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour aux Médias</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Meduses;
