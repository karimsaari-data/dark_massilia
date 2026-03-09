/**
 * BlogPost — Article individuel /blog/:slug
 *
 * Stratégie de données :
 *   - SSR (prerender.js) : globalThis.__WP_SSR_DATA__ est pré-injecté
 *     par le script avant chaque appel à render(). Le composant lit la donnée
 *     synchroniquement → les balises SEO sont extraites dans le HTML statique.
 *   - Client (navigateur) : useEffect fetch l'article via l'API WP.
 *     Si l'article SSR correspond au slug courant, on évite un refetch inutile.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, User, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import { fetchPostBySlug } from '../utils/api';
import { FADE_IN_UP } from '../utils/constants';

const BASE_URL = 'https://karimsaari.com';

// Lire les données pré-injectées par prerender.js lors du rendu SSR
function getSSRPost() {
  try {
    return globalThis.__WP_SSR_DATA__ ?? null;
  } catch (_) {
    return null;
  }
}

// Schema.org BlogPosting pour les rich snippets Google
function buildSchema(post, slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image ?? `${BASE_URL}/assets/og-social-card.jpg`,
    datePublished: post.date,
    dateModified: post.modified ?? post.date,
    url: `${BASE_URL}/blog/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Karim Saari',
      alternateName: 'Dark Massilia',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dark Massilia',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/dark-massilia-logo.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${slug}`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${slug}` },
      ],
    },
  };
}

export default function BlogPost() {
  const { slug } = useParams();

  // État initial : données SSR si disponibles (prerender), sinon null (client)
  const [post,    setPost]    = useState(getSSRPost);
  const [loading, setLoading] = useState(!getSSRPost());
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // Si les données SSR correspondent déjà au slug courant, pas de refetch
    if (post && post.slug === slug) {
      // Nettoyer les données globales pour éviter qu'elles polluent les navigations suivantes
      try { globalThis.__WP_SSR_DATA__ = null; } catch (_) {}
      setLoading(false);
      return;
    }

    // Navigation client vers un autre article → fetch
    setLoading(true);
    setError(null);

    fetchPostBySlug(slug)
      .then(data => {
        if (!data) setError('Article introuvable.');
        else setPost(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Balises SEO dynamiques ──────────────────────────────────────────────────
  const seoTitle       = post ? `${post.title} | Dark Massilia` : 'Article | Dark Massilia';
  const seoDescription = post?.excerpt ?? 'Actualités et actions de dépollution marine par Dark Massilia.';
  const seoImage       = post?.image   ?? `${BASE_URL}/assets/og-social-card.jpg`;
  const seoCanonical   = `${BASE_URL}/blog/${slug}`;

  return (
    <div className="min-h-screen py-24">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={seoCanonical}
        image={seoImage}
        schema={post ? buildSchema(post, slug) : null}
      />

      <div className="container-custom max-w-4xl">

        {/* ── Fil d'Ariane ──────────────────────────────────────────────── */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-ocean-teal transition-colors text-sm mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          Toutes les actualités
        </Link>

        {/* ── Chargement ──────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="w-9 h-9 text-ocean-teal animate-spin" />
          </div>
        )}

        {/* ── Erreur ──────────────────────────────────────────────────────── */}
        {!loading && error && (
          <div className="glass-strong rounded-2xl p-12 text-center">
            <p className="text-gray-400 mb-8">{error}</p>
            <Link to="/blog" className="btn-primary">
              Retour au blog
            </Link>
          </div>
        )}

        {/* ── Article ─────────────────────────────────────────────────────── */}
        {!loading && post && (
          <motion.article
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP}
          >
            {/* Image de couverture */}
            {post.image && (
              <div className="rounded-2xl overflow-hidden mb-10 aspect-video">
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  width="1280"
                  height="720"
                />
              </div>
            )}

            {/* Méta — date & auteur */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <span className="flex items-center gap-1.5 text-ocean-teal font-semibold uppercase tracking-wider text-xs">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <time dateTime={post.date}>{post.dateFormatted}</time>
              </span>
              <span className="text-gray-600" aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                {post.author}
              </span>
            </div>

            {/* Titre H1 */}
            <h1 className="heading-1 mb-10">{post.title}</h1>

            {/* Contenu HTML WordPress — source interne de confiance */}
            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* ── Bas de page article ──────────────────────────────────── */}
            <div className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-ocean-teal transition-colors text-sm group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                Retour aux actualités
              </Link>

              <Link to="/contact" className="btn-primary text-sm">
                Rejoindre la mission →
              </Link>
            </div>
          </motion.article>
        )}

      </div>
    </div>
  );
}
