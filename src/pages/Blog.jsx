/**
 * Blog — Page index des actualités /blog
 *
 * Grille d'articles alimentée par WordPress Headless.
 * Fetch client-side avec pagination.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Loader2, Rss } from 'lucide-react';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import { fetchPosts } from '../utils/api';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

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

        {/* ── Chargement ──────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-9 h-9 text-ocean-teal animate-spin" />
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
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
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

      </div>
    </div>
  );
}

// ── Composant carte article ───────────────────────────────────────────────────

function PostCard({ post }) {
  return (
    <motion.article
      variants={FADE_IN_UP}
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
            loading="lazy"
            decoding="async"
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
        {/* Date */}
        <div className="flex items-center gap-2 text-ocean-teal text-xs font-semibold uppercase tracking-wider mb-3">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <time dateTime={post.date}>{post.dateFormatted}</time>
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
    </motion.article>
  );
}
