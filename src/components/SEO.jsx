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

const SEO = ({ title, description, canonical, image, noindex = false, schema = null }) => {
  const metaTitle       = title       || DEFAULT_SEO.title;
  const metaDescription = description || DEFAULT_SEO.description;
  const metaCanonical   = canonical   || DEFAULT_SEO.canonical;
  const metaImage       = image       || DEFAULT_SEO.image;

  return (
    <>
      {/* ── Balises fondamentales ── */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={metaCanonical} />

      {/* ── Open Graph (Facebook, LinkedIn, WhatsApp…) ── */}
      <meta property="og:title"       content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url"         content={metaCanonical} />
      <meta property="og:image"       content={metaImage} />
      <meta property="og:image:alt"   content="Dark Massilia · Karim Saari — Sentinelle de la Méditerranée" />
      <meta property="og:type"        content="website" />
      <meta property="og:locale"      content="fr_FR" />
      <meta property="og:site_name"   content={DEFAULT_SEO.siteName} />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={DEFAULT_SEO.twitterHandle} />
      <meta name="twitter:title"       content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image"       content={metaImage} />

      {/* ── Robots (noindex pour pages thin content) ── */}
      {noindex && <meta name="robots" content="noindex, follow" />}

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
