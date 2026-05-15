/**
 * PlanDuSite.jsx — Plan du site HTML
 * Liste toutes les pages du site + tous les articles de blog
 * Utile pour le crawl Google et le maillage interne
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Camera, Compass, Film, MapPin, Mail, ExternalLink, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import { fetchAllPostsMeta } from '../utils/api';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

// ── Sections principales du site ─────────────────────────────────────────────

const SECTIONS = [
  {
    label: 'Portfolio',
    icon: Camera,
    pages: [
      { to: '/photographe-environnemental-marseille', text: 'Photographe environnemental à Marseille' },
      { to: '/photographie-sous-marine',              text: 'Photographie sous-marine' },
      { to: '/photographie-paysage-mer',              text: 'Photographie de paysages' },
      { to: '/carte-photos',                          text: 'Carte des photos' },
      { to: '/les-francais-yann-arthus-bertrand',     text: 'Les Français — Yann Arthus-Bertrand' },
    ],
  },
  {
    label: 'Missions',
    icon: Compass,
    pages: [
      { to: '/communaute',            text: 'Rejoindre la communauté' },
      { to: '/depollution-marine',    text: 'Dépollution marine' },
      { to: '/donnees-scientifiques', text: 'Données scientifiques' },
      { to: '/local-guide-marseille', text: 'Google Local Guide Marseille' },
    ],
  },
  {
    label: 'Médias',
    icon: Film,
    pages: [
      { to: '/videos',                                       text: 'Vidéos & Documentaires' },
      { to: '/sauver-marseille-documentaire-arte',           text: 'ARTE — Sauver Marseille' },
      { to: '/meduses-souveraines-oceans-documentaire-arte', text: 'ARTE — Méduses souveraines des océans' },
      { to: '/presse',                                       text: 'Presse & médias' },
      { to: '/blog',                                         text: 'Blog' },
    ],
  },
  {
    label: 'Calanques',
    icon: MapPin,
    pages: [
      { to: '/communaute-calanques',    text: 'Groupe Facebook — Amoureux des Calanques' },
      { to: '/carte-calanques',         text: 'Carte interactive des Calanques' },
      { to: '/acces-massifs-calanques', text: 'Accès aux massifs forestiers' },
      { to: '/actualites',              text: 'Actualités du Parc des Calanques' },
    ],
  },
  {
    label: 'Contact',
    icon: Mail,
    pages: [
      { to: '/contact', text: 'Collaborer avec nous' },
    ],
  },
];

// ── Composant ─────────────────────────────────────────────────────────────────

const PlanDuSite = () => {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const metas = await fetchAllPostsMeta();
        // Tri par date décroissante (les plus récents en premier)
        const sorted = [...metas].sort((a, b) => new Date(b.modified) - new Date(a.modified));
        setPosts(sorted);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <SEO {...(SEO_PAGES['plan-du-site'] ?? {
        title: 'Plan du site | Karim Saari — Dark Massilia',
        description: 'Plan du site karimsaari.com — toutes les pages et articles de blog de Karim Saari, photographe environnemental et sous-marin à Marseille.',
        canonical: 'https://karimsaari.com/plan-du-site',
      })} />

      <div className="container-custom py-16 md:py-24" style={{ position: 'relative', zIndex: 1 }}>
        {/* Voile pour lisibilité sur fond animé */}
        <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: 'rgba(5,15,30,0.55)', backdropFilter: 'blur(2px)' }} />

        {/* En-tête */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="mb-14"
        >
          <p className="text-ocean-teal text-xs font-semibold uppercase tracking-widest mb-3">Navigation</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Plan du site</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Naviguez dans l'univers de <span className="text-white">karimsaari.com</span> — portfolio, missions terrain, médias et blog.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* ── Sections principales ── */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={STAGGER_CONTAINER}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ocean-teal mb-6">Pages du site</h2>
            <div className="space-y-6">
              {SECTIONS.map(({ label, icon: Icon, pages }) => (
                <motion.div key={label} variants={FADE_IN_UP}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-astroide flex-shrink-0" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{label}</h3>
                  </div>
                  <ul className="space-y-1 pl-6 border-l border-white/10">
                    {pages.map(({ to, text }) => (
                      <li key={to}>
                        <Link
                          to={to}
                          className="text-sm text-gray-400 hover:text-ocean-teal transition-colors duration-200 py-0.5 inline-block"
                        >
                          {text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Articles de blog ── */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={FADE_IN_UP}
          >
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-4 h-4 text-ocean-teal flex-shrink-0" aria-hidden="true" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-ocean-teal">
                Articles de blog
                {posts.length > 0 && (
                  <span className="ml-2 text-gray-500 normal-case tracking-normal font-normal">
                    ({posts.length})
                  </span>
                )}
              </h2>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Chargement des articles…
              </div>
            )}

            {error && (
              <p className="text-gray-500 text-sm">Impossible de charger les articles.</p>
            )}

            {!loading && !error && (
              <ul className="space-y-1 border-l border-white/10 pl-6">
                {posts.map(({ slug, modified, title }) => (
                  <li key={slug} className="flex items-baseline justify-between gap-4">
                    <Link
                      to={`/blog/${slug}`}
                      className="text-sm text-gray-400 hover:text-ocean-teal transition-colors duration-200 py-0.5 inline-block leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: title || slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()) }}
                    />
                    {modified && (
                      <span className="text-xs text-gray-600 flex-shrink-0">
                        {new Date(modified).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Lien vers le blog */}
            {!loading && posts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm text-ocean-teal hover:text-astroide transition-colors duration-200 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  Voir tous les articles
                </Link>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default PlanDuSite;
