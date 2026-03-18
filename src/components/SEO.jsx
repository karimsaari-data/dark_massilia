/**
 * SEO — Composant de métadonnées dynamiques
 *
 * Utilise le support natif React 19 : <title>, <meta> et <link>
 * sont automatiquement hoistés vers le <head> du document.
 * Aucune dépendance tierce requise (react-helmet-async incompatible React 19).
 *
 * Usage :
 *   import SEO from '../components/SEO';
 *   import { SEO_PAGES } from '../utils/seo';
 *
 *   const MaPage = () => (
 *     <>
 *       <SEO {...SEO_PAGES['/ma-route']} />
 *       ...contenu...
 *     </>
 *   );
 */

import { DEFAULT_SEO } from '../utils/seo';

// Supprime le slash final pour éviter les canonical → 301
// ex: https://karimsaari.com/communaute/ → https://karimsaari.com/communaute
const normalizeCanonical = (url) => (url || '').replace(/\/$/, '') || url;

const SEO = ({
  title, description, canonical, image, imageAlt = null,
  imageWidth = 1200, imageHeight = 630,
  noindex = false, robots = null, schema = null,
  type = 'website',
  // Balises article:* (uniquement si type="article")
  articlePublishedTime = null, articleModifiedTime = null, articleAuthor = null, articleSection = null,
}) => {
  const metaTitle       = title       || DEFAULT_SEO.title;
  const metaDescription = description || DEFAULT_SEO.description;
  const metaCanonical   = normalizeCanonical(canonical || DEFAULT_SEO.canonical);
  const metaImage       = image       || DEFAULT_SEO.image;
  const metaImageAlt    = imageAlt    || 'Dark Massilia · Karim Saari — Sentinelle des Calanques';

  return (
    <>
      {/* ── Balises fondamentales ── */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="author"      content="Karim Saari" />
      <link rel="canonical" href={metaCanonical} />

      {/* ── Open Graph (Facebook, LinkedIn, WhatsApp…) ── */}
      <meta property="og:title"       content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url"         content={metaCanonical} />
      <meta property="og:image"        content={metaImage} />
      <meta property="og:image:width"  content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt"   content={metaImageAlt} />
      <meta property="og:type"        content={type} />
      <meta property="og:locale"      content="fr_FR" />
      <meta property="og:site_name"   content={DEFAULT_SEO.siteName} />

      {/* ── Balises article:* (type="article" uniquement) ── */}
      {type === 'article' && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {type === 'article' && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {type === 'article' && articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}
      {type === 'article' && articleSection && (
        <meta property="article:section" content={articleSection} />
      )}

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={DEFAULT_SEO.twitterHandle} />
      <meta name="twitter:title"       content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image"       content={metaImage} />

      {/* ── Robots (crawl budget / indexation) ── */}
      {robots  && <meta name="robots" content={robots} />}
      {!robots && noindex && <meta name="robots" content="noindex, follow" />}

      {/* ── JSON-LD Schema.org ── */}
      {schema && (
        <script
          id="json-ld-schema"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
};

export default SEO;
