/**
 * Blog — Page index des actualités /blog
 *
 * Grille d'articles alimentée par WordPress Headless.
 * Fetch client-side avec pagination + filtre par catégorie.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Rss } from 'lucide-react';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import { fetchPosts } from '../utils/api';
import Breadcrumb from '../components/Breadcrumb';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

export const CATEGORIES = [
  { id: 2, name: 'Dépollution & Action',       slug: 'depollution'  },
  { id: 3, name: 'Biodiversité des calanques',  slug: 'biodiversite' },
  { id: 4, name: 'Calanques & Littoral',        slug: 'calanques'    },
  { id: 5, name: 'Pollution & Alertes',         slug: 'pollution'    },
];

const POSTS_PER_PAGE = 9;

export default function Blog() {
  const [posts,      setPosts]      = useState([]);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchPosts({ page, perPage: POSTS_PER_PAGE })
      .then(({ posts: data, totalPages: tp }) => {
        setPosts(data);
        setTotalPages(tp);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/blog']} />

      <div className="container-custom">
        <Breadcrumb label="Actualités" />

        {/* ── En-tête ─────────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-16"
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
            Actualités & Actions
          </motion.h1>

          <motion.p variants={FADE_IN_UP} className="body-large max-w-2xl mx-auto">
            Suivez en direct les missions de dépollution, les rencontres et les coups de cœur
            de l'équipe Dark Massilia en Méditerranée.
          </motion.p>
        </motion.div>

        {/* ── Filtres catégories ─────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="navigation" aria-label="Filtrer par catégorie">
          <Link
            to="/blog"
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 bg-ocean-teal text-[#0a1428]"
          >
            Tous
          </Link>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/blog/categorie/${cat.slug}`}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 glass text-text-secondary hover:text-white border border-white/10 hover:border-white/20"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* ── Erreur ──────────────────────────────────────────────────────── */}
        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-gray-400 mb-6">
              Impossible de charger les articles. Réessayez dans quelques instants.
            </p>
            <button onClick={() => setPage(1)} className="btn-secondary">
              Réessayer
            </button>
          </div>
        )}

        {/* ── Chargement — skeleton grid pour réserver l'espace (évite CLS) ── */}
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
            <p className="text-gray-400">Aucun article disponible pour le moment.</p>
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

            <span className="text-gray-400 text-sm tabular-nums">
              {page} / {totalPages}
            </span>

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

        {/* ── Cluster interne ─────────────────────────────────────────────── */}
        <div className="mt-16">
          <div className="glass rounded-2xl px-8 py-6 flex flex-col gap-6 border border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">
                  Passer à l'action
                </p>
                <p className="text-white font-semibold text-lg leading-snug">
                  Rejoindre une mission de dépollution
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  Bénévoles, kayakistes, photographes — chaque profil a sa place dans nos équipes.
                </p>
              </div>
              <Link
                to="/communaute"
                className="btn-primary inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0"
              >
                <span>Devenir bénévole</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 pt-2 border-t border-white/8 text-sm">
              <Link to="/depollution-marine" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                Nos missions de dépollution <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/#newsletter" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                S'inscrire à la newsletter <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/carte-calanques" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                Carte interactive des Calanques <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/donnees-scientifiques" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                Données scientifiques <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/photographie-sous-marine" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                Galerie photos sous-marines <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/photographie-paysage-mer" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                Galerie paysages Marseille <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Composant carte article ───────────────────────────────────────────────────

export function PostCard({ post, priority = false }) {
  // La carte prioritaire (LCP) utilise un article natif pour éviter le render delay
  // causé par motion.article qui démarre à opacity:0 (FADE_IN_UP)
  const Tag = priority ? 'article' : motion.article;
  const motionProps = priority ? {} : { variants: FADE_IN_UP };

  return (
    <Tag
      {...motionProps}
      className="card group flex flex-col overflow-hidden p-0"
    >
      {/* Image de couverture */}
      {post.image ? (
        <Link
          to={`/blog/${post.slug}`}
          className="block overflow-hidden rounded-t-2xl aspect-video"
          aria-label={`Lire : ${post.title}`}
        >
          <img
            src={post.image}
            alt={post.imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding={priority ? 'sync' : 'async'}
            width="640"
            height="360"
          />
        </Link>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-ocean-teal/10 to-ocean-blue/10 rounded-t-2xl flex items-center justify-center">
          <Rss className="w-10 h-10 text-ocean-teal/30" />
        </div>
      )}

      {/* Contenu */}
      <div
        className="flex flex-col flex-1 p-6"
        style={{ background: 'rgba(8, 16, 32, 0.72)', backdropFilter: 'blur(8px)' }}
      >
        {/* Date + catégorie */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-ocean-teal text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <time dateTime={post.date}>{post.dateFormatted}</time>
          </div>
          {(() => {
            const cat = post.categories?.[0]
              ? CATEGORIES.find(c => c.id === post.categories[0])
              : null;
            return cat ? (
              <Link
                to={`/blog/categorie/${cat.slug}`}
                className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/8 text-text-secondary hover:bg-ocean-teal/20 hover:text-ocean-teal transition-colors whitespace-nowrap"
                onClick={e => e.stopPropagation()}
                aria-label={`Catégorie : ${cat.name}`}
              >
                {cat.name}
              </Link>
            ) : null;
          })()}
        </div>

        {/* Titre */}
        <h2 className="text-base font-bold text-text-primary mb-3 leading-snug group-hover:text-astroide transition-colors">
          <Link to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* Extrait */}
        {post.excerpt && (
          <p className="body-small flex-1 mb-5 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* CTA */}
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-ocean-teal text-sm font-semibold hover:gap-3 transition-all duration-200 mt-auto"
          aria-label={`Lire l'article : ${post.title}`}
        >
          Lire la suite
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>

      </div>
    </Tag>
  );
}
