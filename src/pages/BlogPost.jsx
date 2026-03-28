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
import { Calendar, ArrowLeft, ArrowRight, User, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import { fetchPostBySlug } from '../utils/api';
import { FADE_IN_UP } from '../utils/constants';

const BASE_URL = 'https://karimsaari.com';

// Post-traite le HTML WordPress : lazy loading images + rétrogradation h1→h2
function lazyLoadContent(html) {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>')
    .replace(/<img(?![^>]*\bloading=)([^>]*>)/gi, '<img loading="lazy" decoding="async"$1');
}

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
  const [copied,  setCopied]  = useState(false);

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
          <>
            {/* Image de couverture — hors motion.article pour éviter le render delay LCP
                (motion démarre à opacity:0, ce qui retardait l'affichage de ~3,6s) */}
            {post.image && (
              <div className="rounded-2xl overflow-hidden mb-10 aspect-video">
                <img
                  src={post.image}
                  srcSet={post.imageSrcset ?? undefined}
                  sizes="(max-width: 480px) 100vw, (max-width: 900px) 100vw, 800px"
                  alt={post.imageAlt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  width={post.imageWidth ?? 1280}
                  height={post.imageHeight ?? 720}
                />
              </div>
            )}

          <motion.article
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP}
          >

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
                dangerouslySetInnerHTML={{ __html: lazyLoadContent(post.content) }}
              />

              {/* Partage */}
              <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-sm font-semibold text-gray-300 mb-4">Partager cet article</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${BASE_URL}/blog/${slug}/`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1565C0] hover:bg-[#1255AA] text-white transition-colors shadow-lg"
                    aria-label="Partager sur Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${BASE_URL}/blog/${slug}/`)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-black hover:bg-gray-900 text-white border border-white/20 transition-colors shadow-lg"
                    aria-label="Partager sur X"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X
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
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${BASE_URL}/blog/${slug}/`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors shadow-lg"
                    aria-label="Copier le lien"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    {copied ? 'Copié !' : 'Copier le lien'}
                  </button>
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
                  width="1120"
                  height="335"
                />
              </div>
            </div>

            {/* ── Cluster interne ──────────────────────────────────────── */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 text-sm">
              <Link to="/depollution-marine" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                Nos missions de dépollution <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/photographie-sous-marine" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                Galerie photos sous-marines <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/communaute" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                Rejoindre la communauté <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/#newsletter" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                S'inscrire à la newsletter <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* ── Bas de page article ──────────────────────────────────── */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-ocean-teal transition-colors text-sm group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                Retour aux actualités
              </Link>

              <Link to="/communaute" className="btn-primary text-sm">
                Rejoindre la mission →
              </Link>
            </div>
          </motion.article>
          </>
        )}

      </div>
    </div>
  );
}
