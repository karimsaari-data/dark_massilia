/**
 * BlogCategory — Hub SEO par thématique /blog/categorie/:slug
 *
 * Liste les articles d'une catégorie WordPress.
 * Prérendu statique via scripts/prerender.js.
 */

import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rss, ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { fetchPosts } from '../utils/api';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import { CATEGORIES, PostCard } from './Blog';

const POSTS_PER_PAGE = 9;

const CATEGORY_SEO = {
  depollution: {
    title:       'Dépollution Marine — Missions & Actions | Dark Massilia',
    description: 'Toutes les missions de dépollution en Méditerranée et dans les Calanques de Marseille. Plongées de nettoyage et collectes terrain par Dark Massilia.',
    intro:       'Retrouvez ici toutes nos actions de terrain : missions de nettoyage, plongées de dépollution et initiatives citoyennes pour la Méditerranée.',
  },
  biodiversite: {
    title:       'Biodiversité des Calanques de Marseille | Dark Massilia',
    description: 'Espèces, écosystèmes et menaces sur la biodiversité marine des Calanques. Reportages et analyses par Karim Saari, photographe environnemental.',
    intro:       'Espèces emblématiques, écosystèmes menacés et découvertes sous-marines : plongez dans la richesse de la biodiversité des Calanques de Marseille.',
  },
  calanques: {
    title:       'Calanques & Littoral de Marseille | Dark Massilia',
    description: 'Actualités, découvertes et reportages sur les Calanques de Marseille. Nature, littoral et patrimoine méditerranéen par Dark Massilia.',
    intro:       'Le littoral marseillais et ses Calanques vus de l\'eau : rapports de terrain, actualités du parc national et portraits de ces paysages uniques.',
  },
  pollution: {
    title:       'Pollution Marine & Alertes Environnementales | Dark Massilia',
    description: 'Alertes et reportages sur la pollution plastique et les menaces sur la Méditerranée. Données terrain et analyses par Dark Massilia.',
    intro:       'Microplastiques, espèces invasives, déchets industriels : les alertes environnementales documentées par Karim Saari depuis les fonds méditerranéens.',
  },
};

const BASE_URL = 'https://karimsaari.com';

export default function BlogCategory() {
  const { slug } = useParams();
  const category = CATEGORIES.find(c => c.slug === slug) ?? null;

  const [posts,      setPosts]      = useState([]);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(!!category);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    setError(null);
    fetchPosts({ page, perPage: POSTS_PER_PAGE, categoryId: category.id })
      .then(({ posts: data, totalPages: tp }) => {
        setPosts(data);
        setTotalPages(tp);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, category?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!category) return <Navigate to="/blog" replace />;

  const seo          = CATEGORY_SEO[slug] ?? { title: `${category.name} | Dark Massilia`, description: '', intro: '' };
  const canonicalUrl = `${BASE_URL}/blog/categorie/${slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog',    item: `${BASE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: category.name, item: canonicalUrl },
        ],
      },
      {
        '@type':       'CollectionPage',
        name:          seo.title,
        description:   seo.description,
        url:           canonicalUrl,
        inLanguage:    'fr-FR',
        author: {
          '@type': 'Person',
          name:    'Karim Saari',
          url:     BASE_URL,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen py-24">
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={canonicalUrl}
        schema={schema}
      />

      <div className="container-custom">

        {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
        <nav aria-label="Fil d'Ariane" className="mb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-ocean-teal transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Toutes les actualités
          </Link>
        </nav>

        {/* ── En-tête ─────────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP} className="flex items-center justify-center gap-2 mb-4">
            <Rss className="w-4 h-4 text-ocean-teal" />
            <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest">
              Journal de bord
            </p>
          </motion.div>

          <motion.h1 variants={FADE_IN_UP} className="heading-1 text-white mb-6">
            {category.name}
          </motion.h1>

          {seo.intro && (
            <motion.p variants={FADE_IN_UP} className="body-large max-w-2xl mx-auto">
              {seo.intro}
            </motion.p>
          )}
        </motion.div>

        {/* ── Filtres catégories ─────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="navigation" aria-label="Filtrer par catégorie">
          <Link
            to="/blog"
            className="px-4 py-1.5 rounded-full text-sm font-semibold glass text-text-secondary hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            Tous
          </Link>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/blog/categorie/${cat.slug}`}
              aria-current={cat.slug === slug ? 'page' : undefined}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                cat.slug === slug
                  ? 'bg-ocean-teal text-[#0a1428]'
                  : 'glass text-text-secondary hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* ── Erreur ──────────────────────────────────────────────────────── */}
        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-gray-400 mb-6">Impossible de charger les articles. Réessayez dans quelques instants.</p>
            <button onClick={() => setPage(1)} className="btn-secondary">Réessayer</button>
          </div>
        )}

        {/* ── Skeleton ────────────────────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="card flex flex-col overflow-hidden p-0 animate-pulse">
                <div className="aspect-video bg-white/5 rounded-t-2xl" />
                <div className="flex flex-col flex-1 p-6 gap-3">
                  <div className="h-3 w-24 bg-white/5 rounded" />
                  <div className="h-4 w-full bg-white/8 rounded" />
                  <div className="h-4 w-3/4 bg-white/8 rounded" />
                  <div className="h-3 w-full bg-white/5 rounded mt-2" />
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Grille d'articles ───────────────────────────────────────────── */}
        {!loading && !error && posts.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
          >
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} priority={i === 0} />
            ))}
          </motion.div>
        )}

        {/* ── État vide ───────────────────────────────────────────────────── */}
        {!loading && !error && posts.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-gray-400">Aucun article dans cette catégorie pour le moment.</p>
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Page précédente"
            >
              ← Précédent
            </button>
            <span className="text-gray-400 text-sm tabular-nums">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Page suivante"
            >
              Suivant →
            </button>
          </div>
        )}

        {/* ── Lien retour ─────────────────────────────────────────────────── */}
        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-ocean-teal transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
            Voir tous les articles
          </Link>
        </div>

      </div>
    </div>
  );
}
