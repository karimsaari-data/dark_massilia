/**
 * Blog — Page index des actualités /blog
 *
 * Grille d'articles alimentée par WordPress Headless.
 * Fetch client-side avec pagination + filtre par catégorie.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Rss, Search, X, Clock } from 'lucide-react';
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
  const [posts,        setPosts]       = useState([]);
  const [page,         setPage]        = useState(1);
  const [totalPages,   setTotalPages]  = useState(1);
  const [loading,      setLoading]     = useState(true);
  const [error,        setError]       = useState(null);
  const [searchInput,  setSearchInput] = useState('');
  const [search,       setSearch]      = useState('');
  const searchTimeout  = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(val.trim());
      setPage(1);
    }, 350);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchPosts({ page, perPage: POSTS_PER_PAGE, search: search || undefined })
      .then(({ posts: data, totalPages: tp }) => {
        setPosts(data);
        setTotalPages(tp);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, search]);

  return (
    <div className="min-h-screen pt-4 pb-16">
      <SEO {...SEO_PAGES['/blog']} />

      <div className="container-custom">
        <Breadcrumb label="Actualités" />

        {/* ── Cadre hublot — en-tête + recherche + filtres ─────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12 p-8 md:p-12 text-center"
          style={{
            overflow: 'hidden',
            borderRadius: '24px',
            border: '2px solid rgba(0,171,168,0.55)',
            boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
            background: 'rgba(5,15,30,0.75)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* En-tête */}
          <motion.div variants={FADE_IN_UP} className="flex items-center justify-center gap-2 mb-4">
            <Rss className="w-4 h-4 text-ocean-teal" />
            <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest">
              Journal de bord
            </p>
          </motion.div>

          <motion.h1 variants={FADE_IN_UP} className="heading-1 text-white mb-6">
            Actualités & Actions
          </motion.h1>
          <h3 className="sr-only">Articles sur la mer Méditerranée, la faune marine et la dépollution des Calanques</h3>

          <motion.p variants={FADE_IN_UP} className="body-large max-w-2xl mx-auto mb-10">
            Suivez en direct les missions de dépollution, les rencontres et les coups de cœur
            de l'équipe Dark Massilia en Méditerranée.
          </motion.p>

          {/* Recherche */}
          <motion.div variants={FADE_IN_UP} className="max-w-xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              placeholder="Rechercher un article…"
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-10 py-3 rounded-2xl glass border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-ocean-teal/50 focus:ring-1 focus:ring-ocean-teal/30 transition-all"
              aria-label="Rechercher dans les articles"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* Filtres catégories */}
          <motion.div variants={FADE_IN_UP} className="flex flex-wrap justify-center gap-2" role="navigation" aria-label="Filtrer par catégorie">
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
          </motion.div>
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

        {/* ── Résultats de recherche ──────────────────────────────────────── */}
        {!loading && !error && search && (
          <p className="text-center text-gray-400 text-sm mb-6">
            {posts.length > 0
              ? <>{posts.length} résultat{posts.length > 1 ? 's' : ''} pour <span className="text-white font-semibold">« {search} »</span></>
              : <>Aucun résultat pour <span className="text-white font-semibold">« {search} »</span></>
            }
          </p>
        )}

        {/* ── État vide ───────────────────────────────────────────────────── */}
        {!loading && !error && posts.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-gray-400 mb-4">
              {search ? 'Aucun article ne correspond à cette recherche.' : 'Aucun article disponible pour le moment.'}
            </p>
            {search && (
              <button onClick={clearSearch} className="btn-secondary text-sm">
                Voir tous les articles
              </button>
            )}
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
  const motionProps = priority ? {} : { variants: FADE_IN_UP, whileHover: { x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } } };

  // Option A — fondu doux : on garde un fond placeholder océan derrière l'image,
  // qui apparaît en fade-in une fois chargée (pas de spinner, pas de saut de layout).
  // La carte prioritaire (LCP) reste affichée immédiatement pour ne pas retarder le LCP.
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(priority);
  useEffect(() => {
    // Si l'image est déjà en cache, onLoad a pu se déclencher avant l'attache du handler.
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <Tag
      {...motionProps}
      className="card group flex flex-col overflow-hidden p-0"
    >
      {/* Image de couverture */}
      {post.image ? (
        <Link
          to={`/blog/${post.slug}`}
          className="block overflow-hidden rounded-t-2xl aspect-video bg-gradient-to-br from-ocean-teal/10 to-ocean-blue/10"
          aria-label={`Lire : ${post.title}`}
        >
          <img
            ref={imgRef}
            src={post.image}
            srcSet={post.imageSrcset ?? undefined}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={post.imageAlt}
            className={`w-full h-full object-cover transition-[transform,opacity] duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding={priority ? 'sync' : 'async'}
            width="640"
            height="360"
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              setLoaded(true);
              if (post.imageFallback && e.target.src !== post.imageFallback) {
                e.target.src = post.imageFallback;
              }
            }}
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
        {/* Date + temps de lecture + catégorie */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-ocean-teal text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <time dateTime={post.date}>{post.dateFormatted}</time>
            {post.readingTime && (
              <>
                <span className="text-ocean-teal/40" aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-normal normal-case tracking-normal text-gray-500">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {post.readingTime} min
                </span>
              </>
            )}
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
