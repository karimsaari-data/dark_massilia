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
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, ArrowLeft, ArrowRight, User, Loader2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { fetchPostBySlug } from '../utils/api';
import { FADE_IN_UP } from '../utils/constants';
import RecentArticles from '../components/RecentArticles';
import NewsletterInline from '../components/NewsletterInline';

const BASE_URL = 'https://karimsaari.com';

// Génère un alt de secours depuis l'URL d'une image (nom de fichier sans extension)
function altFromSrc(imgTag, postTitle = '') {
  const src = imgTag.match(/src=["']([^"']+)["']/i)?.[1] ?? '';
  const filename = src.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_x]/g, ' ').replace(/\s+/g, ' ').trim();
  return filename || postTitle || 'Image Dark Massilia';
}

// Post-traite le HTML WordPress : lazy loading images + rétrogradation h1→h2 + alt manquants
function lazyLoadContent(html, postTitle = '') {
  let firstImg = true;
  return html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>')
    // Première image → eager + fetchpriority high (LCP) ; les suivantes → lazy
    .replace(/<img(?![^>]*\bloading=)([^>]*>)/gi, (match, rest) => {
      if (firstImg) {
        firstImg = false;
        return `<img loading="eager" fetchpriority="high" decoding="async"${rest}`;
      }
      return `<img loading="lazy" decoding="async"${rest}`;
    })
    // Injecte alt de secours sur les <img> sans alt ou avec alt=""
    .replace(/<img([^>]*)>/gi, (match, attrs) => {
      if (/\balt=["'][^"']+["']/.test(attrs)) return match; // alt non vide → OK
      const fallback = altFromSrc(match, postTitle);
      if (/\balt=/.test(attrs)) {
        return `<img${attrs.replace(/\balt=["'][^"']*["']/i, `alt="${fallback}"`)}>`;
      }
      return `<img alt="${fallback}"${attrs}>`;
    });
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
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${slug}` },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${BASE_URL}/blog/${slug}#article`,
        headline: post.title,
        description: post.excerpt,
        image: post.image ?? `${BASE_URL}/assets/og-social-card.jpg`,
        datePublished: post.date,
        dateModified: post.modified ?? post.date,
        url: `${BASE_URL}/blog/${slug}`,
        inLanguage: 'fr-FR',
        ...(post.categoryName && { articleSection: post.categoryName }),
        author: {
          '@type': 'Person',
          '@id': `${BASE_URL}/#karim-saari`,
          name: 'Karim Saari',
          alternateName: 'Dark Massilia',
          url: BASE_URL,
          sameAs: [
            'https://www.instagram.com/karimsaari',
            'https://www.tiktok.com/@dark.massilia',
            'https://www.youtube.com/@dark.massilia',
            'https://twitter.com/dark_massilia',
            'https://www.linkedin.com/in/karimsaari',
            'https://500px.com/karimsaari',
          ],
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
      },
    ],
  };
}

export default function BlogPost() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const prefersReducedMotion = useReducedMotion();

  // État initial : données SSR si disponibles (prerender), sinon null (client)
  const [post,         setPost]        = useState(getSSRPost);
  const [loading,      setLoading]     = useState(!getSSRPost());
  const [error,        setError]       = useState(null);
  const [copied,       setCopied]      = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      setReadProgress(Math.min(100, (window.scrollY / scrollable) * 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
  const seoTitle       = post
    ? (post.title.length > 44 ? post.title.slice(0, 57) + '…' : `${post.title} | Dark Massilia`)
    : 'Article | Karim Saari';
  const rawExcerpt     = post?.excerpt ?? 'Actualités et actions de dépollution marine par Dark Massilia.';
  const seoDescription = rawExcerpt.length > 155 ? rawExcerpt.slice(0, 152) + '…' : rawExcerpt;
  // imageOg = URL originale JPEG/PNG pour les réseaux sociaux (LinkedIn, FB…)
  // image   = URL WebP pour la balise <img> (perf)
  const seoImage       = post?.imageOg ?? post?.image ?? `${BASE_URL}/assets/og-social-card.jpg`;
  const seoCanonical   = `${BASE_URL}/blog/${slug}`;

  return (
    <div className="min-h-screen py-24">
      {/* Barre de progression de lecture — fixed en haut du viewport */}
      {!loading && post && (
        <div
          role="progressbar"
          aria-label="Progression de lecture"
          aria-valuenow={Math.round(readProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '3px',
            width: `${readProgress}%`,
            background: 'linear-gradient(90deg, #21c47b 0%, #0091ff 100%)',
            zIndex: 100,
            transition: prefersReducedMotion ? 'none' : 'width 80ms linear',
            borderRadius: '0 2px 2px 0',
          }}
        />
      )}
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
        articleSection={post?.categoryName ?? 'Environnement marin'}
        schema={post ? buildSchema(post, slug) : null}
      />

      <div className="container-custom max-w-4xl">

        {/* ── Fil d'Ariane ──────────────────────────────────────────────── */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-ocean-teal transition-colors text-sm mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          {t('blogCategory.back')}
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
              {t('blogPost.back_blog')}
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
                  onError={(e) => {
                    if (post.imageFallback && e.target.src !== post.imageFallback) {
                      e.target.src = post.imageFallback;
                    }
                  }}
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
              {/* Méta — date, auteur & temps de lecture */}
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
                {post.readingTime && (
                  <>
                    <span className="text-gray-600" aria-hidden="true">·</span>
                    <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {post.readingTime} {t('blogPost.reading_min')}
                    </span>
                  </>
                )}
              </div>

              {/* Titre H1 */}
              <h1 className="heading-1 mb-10">{post.title}</h1>

              {/* Contenu HTML WordPress — les h1 WP sont rétrogradés en h2 pour éviter les doublons */}
              <div
                className="prose-blog"
                dangerouslySetInnerHTML={{ __html: lazyLoadContent(post.content, post.title) }}
              />

              {/* Newsletter inline — formulaire complet, zéro friction */}
              <NewsletterInline source="blog_article" />

              {/* Partage */}
              <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-sm font-semibold text-gray-300 mb-4">{t('blogPost.share_title')}</p>
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
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE_URL}/blog/${slug}`)}`}
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
                    {copied ? t('blogPost.copied') : t('blogPost.copy_link')}
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
                {t('blog.cluster_missions')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/photographie-sous-marine" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                {t('blog.cluster_gallery')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/photographie-paysage-mer" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                {t('blog.cluster_landscapes')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/communaute" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                {t('blogPost.join_community')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/communaute-calanques" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
                {t('blogPost.fb_group')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* ── Bas de page article ──────────────────────────────────── */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-ocean-teal transition-colors text-sm group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                {t('blogPost.back_news')}
              </Link>

              <Link to="/communaute" className="btn-primary text-sm">
                {t('blogPost.join_mission')}
              </Link>
            </div>
          </motion.article>
          </>
        )}

      </div>

      {/* ── Articles similaires ─────────────────────────────────────────────── */}
      {!loading && post && (
        <div className="mt-16">
          <RecentArticles title={t('blogPost.similar_articles')} count={3} excludeSlug={slug} />
        </div>
      )}
    </div>
  );
}
