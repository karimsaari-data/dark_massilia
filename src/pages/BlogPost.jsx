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
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${slug}/` },
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
  const seoCanonical   = `${BASE_URL}/blog/${slug}/`;

  return (
    <div className="min-h-screen py-24">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={seoCanonical}
        image={seoImage}
        imageAlt={post?.imageAlt ?? null}
        type="article"
        articlePublishedTime={post?.date ?? null}
        articleModifiedTime={post?.modified ?? post?.date ?? null}
        articleAuthor="Karim Saari"
        articleSection="Environnement marin"
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

            {/* Contenu principal — fond semi-transparent pour lisibilité sur fond méduses */}
            <div
              style={{
                background: 'rgba(8, 16, 32, 0.78)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: 'clamp(24px, 5vw, 52px) clamp(20px, 5vw, 52px)',
              }}
            >
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

              {/* Contenu HTML WordPress — les h1 WP sont rétrogradés en h2 pour éviter les doublons */}
              <div
                className="prose-blog"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/<h1(\s[^>]*)?>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>') }}
              />

              {/* Partage */}
              <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-sm font-semibold text-gray-300 mb-4">Partager cet article</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${BASE_URL}/blog/${slug}/`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1877F2] hover:bg-[#1877F2]/80 text-white transition-colors shadow-lg"
                    aria-label="Partager sur Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${BASE_URL}/blog/${slug}/?ref=share`)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-black hover:bg-gray-900 text-white border border-white/20 transition-colors shadow-lg"
                    aria-label="Partager sur X"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} — ${BASE_URL}/blog/${slug}/`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#25D366] hover:bg-[#25D366]/80 text-white transition-colors shadow-lg"
                    aria-label="Partager sur WhatsApp"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE_URL}/blog/${slug}/`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white transition-colors shadow-lg"
                    aria-label="Partager sur LinkedIn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <img
                  src="/assets/karim-saari-photography-marseille.svg"
                  alt="Karim Saari"
                  className="h-24 md:h-32 w-auto opacity-85 invert"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* ── Bas de page article ──────────────────────────────────── */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
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
