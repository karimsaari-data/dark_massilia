# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for "Dark Massilia" (Karim Saari), an environmental activist and freediver based in Marseille, France. The site showcases marine cleanup projects ("Projet Sentinelle"), underwater photography, and media coverage of environmental work in the Mediterranean Sea and Calanques of Marseille.

**Site URL**: https://karimsaari.com/
**Primary Language**: French
**Tech Stack**: ⚠️ N'est PLUS un site statique. C'est désormais une app **React 19 + Vite** (SPA pré-rendue) avec CMS **Supabase**. Voir la section « Stack réel & mécanique du site (à jour — juin 2026) » ci-dessous — les sections « Architecture / Site Structure » plus bas sont conservées à titre historique (ancien site statique).

## Déploiement

Tout push sur la branche `main` déclenche automatiquement le workflow GitHub Actions (`.github/workflows/nightly-build-deploy.yml`) qui build le site et le déploie en FTP sur karimsaari.com. **Il suffit de merger sur `main` et pousser — le site est en live en quelques minutes.** Pas besoin de PR ni d'étape manuelle.

---

## Stack réel & mécanique du site (à jour — juin 2026)

> ⚠️ Le site n'est plus le site statique décrit dans les sections « Architecture / Site Structure » plus bas (gardées à titre historique). Réalité actuelle ci-dessous.

### Stack technique
- **Front** : app **React 19 + Vite** (SPA), **Tailwind CSS**. Code dans `src/`. Entrée `index.html` → `/src/main.jsx`.
- **Pré-rendu SEO** : `scripts/prerender.js` génère le HTML statique au build et injecte les **JSON-LD**. Critique : Google doit voir le HTML pré-rendu, pas une page vide. Toujours vérifier le rendu après modif de page.
- **CMS / blog** : **Supabase** (Postgres) + **WordPress headless** sur `cms.karimsaari.com` (images hero des articles). Sync via `scripts/sync-wp-to-supabase.mjs`, `seed-supabase.js`, `update-wp-*.mjs`.
- **Sitemaps** : générés par `scripts/generate-sitemap.js` + `generate-sitemap-images.js` → `public/sitemap.xml` & `public/sitemap-images.xml` (~40 URLs : pages + blog + catégories).
- **Analytics** : **GA4** (`G-R3EY7H9Y2Z`) + **GTM** avec **Consent Mode v2** (bannière, clé `dm_consent` en localStorage).
- **Déploiement** : push `main` → `nightly-build-deploy.yml` → build + **FTP** karimsaari.com. `vercel.json` présent (Vercel également possible).

### Mécanique SEO automatisée (GitHub Actions) — IMPORTANT
Tout le suivi SEO est **automatisé en CI** ; ce n'est PAS récupéré en live via un MCP. Les rapports (le « Dashboard Requêtes Cibles » que Karim peut montrer) sortent de ces workflows :
- **Collecte GSC** : `daily-gsc-collect.yml` → `scripts/gsc-collect.js` interroge l'**API Google Search Console** via un **compte de service** (secrets GitHub ; token via `get-gsc-token.js`) et stocke dans la table Supabase **`gsc_daily_queries`** (`date, query, clicks, impressions, position`).
- **Rapports** (PDF Puppeteer → email via **Brevo** à `email@karimsaari.com`) :
  - `weekly-targets-report.yml` → `scripts/weekly-targets-report.js` = **« Dashboard Requêtes Cibles »** (30 j glissants vs période précédente ; 3 pages : KPIs+graphes / tableau détaillé / requêtes découvertes). Lundi 6h UTC, `workflow_dispatch` possible.
  - `weekly-gsc-28day-report.yml` → `gsc-28day-report.js` ; `weekly-ga-report.yml` → `ga-report.js` ; `monthly-backlink-report.yml` → `backlink-report.js` (exports Ahrefs dans `data/gsc-links/`) ; `weekly-seo-digest.yml` → `weekly-seo-digest.js` ; `monthly-seo-crawl.yml` → `seo-crawl.js` ; `lighthouse.yml` (`.lighthouserc.json`). + reports Instagram/Facebook/Cloudflare.

### Requêtes cibles suivies (`TARGET_QUERIES`, weekly-targets-report.js)
`photographe environnemental` · `photographe environnemental marseille` · `photographe sous marin marseille` · `photographe calanques` · `photographe paysages marseille` · `dark massilia` · `karim saari` · `dépollution marine marseille`

### Pour faire un bilan / accéder aux données
- **Chiffres GSC** → table Supabase **`gsc_daily_queries`** (lecture via MCP Supabase si autorisé, ou via les scripts npm).
- **Régénérer un rapport à la demande** : déclencher le workflow (`workflow_dispatch`) ou lancer le script npm (ex. `npm run weekly-targets-report` — nécessite secrets Supabase/Brevo).
- **Backlinks / Domain Rating** : exports Ahrefs dans `data/gsc-links/` et `SEO/`. Dans l'environnement MCP de session, **seul le Domain Rating public gratuit d'Ahrefs répond** (DR ≈ **1,9** au 21/06/2026) ; le Site Explorer et l'intégration GSC d'Ahrefs renvoient « Insufficient plan ».

### État SEO (constat juin 2026)
- **Top 3** : `photographe environnemental` (~2,6 ; impressions +500 %), `karim saari` (~2,1).
- **À portée (pos. 5-15)** : `photographe sous marin marseille` (~7,2), `photographe calanques` (~8,3).
- **Inactives à débloquer** : `photographe paysages marseille` (page `/photographie-paysage-mer` existe pourtant), `dépollution marine marseille`, `dark massilia`.
- **Plus gros levier = netlinking** : Domain Rating très bas (~1,9).

---

## Architecture

### Site Structure

This is a **static multi-page website** with no external CSS/JS files. All styling and scripts are embedded directly in each HTML file using `<style>` and `<script>` tags.

**Main Pages**:
- `index.html` - Main landing page (bio-link style with social links)
- `medias.html` - Press coverage and media appearances
- `videos.html` - Video gallery (Vimeo embed, YouTube links)
- `photos.html` - Photo carousel of marine cleanup missions (58 images from `/images/`)
- `actu-x.html` - Twitter/X feed for news updates
- `arte.html` - ARTE documentary feature page
- `test.html` - Testing page (not linked publicly)

### Design System

All pages share a **consistent visual design** with these characteristics:

**Visual Theme**:
- Dark oceanic aesthetic with animated gradient overlays
- Teal/green accent color: `#21c47b` (brand color for "Dark Massilia")
- Blue accent: `rgba(0, 145, 255, 0.18)` for underwater feel
- Background image: `bg-home.jpg` with parallax on desktop
- Glassmorphism cards with `backdrop-filter: blur(12px)`
- Animated glowing effects on avatars and badges

**Common CSS Pattern**:
Each page duplicates the core CSS (body styling, card design, buttons, responsive breakpoints). The CSS is versioned in comments (e.g., "V13", "V14", "V15") across different pages. When making design changes, update ALL pages to maintain consistency.

**Responsive Breakpoints**:
- Mobile: `max-width: 480px`
- Very small screens: `max-width: 360px`
- Tablets: `481px - 900px`
- Desktop large: `min-width: 1200px`

### Key Components

**Avatar/Logo**:
- White circular container with pulsing glow animation
- Contains `dark_massilia_karim_saari.png`
- `@keyframes pulseGlow` creates breathing effect

**Badge**:
- Pill-shaped banner with gradient background
- Displays "Dark Massilia — Karim Saari"
- Subtle scale animation via `@keyframes pulseBadge`

**Buttons**:
- `.btn` - Default style (transparent with white border)
- `.btn-primary` - Green gradient (call-to-action)
- Hover states include glow effects and `transform: translateY(-1px)`

**Photo Carousel** (photos.html):
- JavaScript-based slideshow with 58 images
- Fisher-Yates shuffle algorithm randomizes image order on page load
- Images use URL-encoding for French characters (é, è, à)
- Alt text auto-generated from filenames for SEO

## SEO & Web Standards

### Metadata Architecture

Every page includes comprehensive SEO metadata:

**Required Elements**:
- Canonical URL (`<link rel="canonical">`)
- Meta description (150-160 characters)
- Open Graph tags (title, description, image, locale, URL)
- Schema.org structured data (JSON-LD)

**index.html Schema**:
The homepage has a Person schema with:
- `"@type": "Person"` for Karim Saari
- `alternateName`: "Dark Massilia"
- Social media profiles in `sameAs` array
- Geographic data (Marseille coordinates)
- Professional description and expertise areas

When adding new pages, maintain this SEO structure. Use geo.region `FR-13` (Bouches-du-Rhône) and geo.position coordinates for Marseille.

### URL Structure

**.htaccess Configuration**:
- Clean URLs enabled: `/page` instead of `/page.html`
- 301 redirects from `.html` to extension-less URLs
- Gzip compression enabled for text files
- Browser caching configured (1 year for images, 1 month for CSS/JS)
- Security headers (XSS protection, SAMEORIGIN, nosniff)
- Directory listing disabled

When referencing internal pages, use `rel="internal"` for intra-site links and `rel="noopener"` for external links.

## Images and Media

### Image Directory

**Location**: `/images/`
**Naming Convention**: `Marseille-dark-massilia-plastique-pollution-projet-sentinelle-{descriptor}.jpg`

All underwater photos follow this strict naming pattern for SEO purposes. The long prefixes ensure images rank well for keywords like "Marseille", "dark massilia", "pollution", "projet sentinelle".

**Important**: When adding new images to the carousel in `photos.html`, add paths to the `allImages` array (starting with `/images/`). URL-encode French characters:
- `é` → `%C3%A9`
- `è` → `%C3%A8`
- `à` → `%C3%A0`

### Video Embeds

- Primary video hosting: **Vimeo** (see videos.html)
- Secondary platform: **YouTube** (@dark.massilia channel)
- Use `.video-responsive` wrapper class for 16:9 aspect ratio iframes

## Contact Information

**Email**: email@karimsaari.com
**WhatsApp**: +33 6 95 33 13 01
**Organization**: Team Oxygen (président)

These appear in the `.contact-box` section at the bottom of most pages.

## Social Media & External Links

**Primary Platforms**:
- Facebook Group: "Amoureux des Calanques de Marseille à Port-Cros" (main CTA)
- Instagram: @karimsaari
- TikTok: @dark.massilia
- YouTube: @dark.massilia
- Twitter/X: @dark_massilia
- 500px: karimsaari
- LinkedIn: karimsaari

**Team Website**: https://www.team-oxygen.com/

## Development Guidelines

### Making Design Changes

Since CSS is duplicated across all HTML files:
1. Make changes in index.html first
2. Copy the updated `<style>` block to all other pages
3. Increment the version comment (e.g., "V15" → "V16")
4. Test on mobile, tablet, and desktop breakpoints

### Animation Performance

The site uses CSS animations for visual polish:
- Background gradient drift animation (`@keyframes drift`)
- Avatar pulse glow (`@keyframes pulseGlow`)
- Badge subtle scaling (`@keyframes pulseBadge`)
- Particle/bubble effect on index.html (`@keyframes bubbleUp`)

**Performance Note**: Mobile devices disable `background-attachment: fixed` (causes iOS bugs) and switch to `scroll`. Keep animations lightweight.

### Browser Compatibility

**Target Browsers**:
- Modern Chrome, Firefox, Safari, Edge
- Mobile Safari (iOS quirks handled)
- Android Chrome

**Key Compatibility Considerations**:
- `backdrop-filter` for glassmorphism (has good support now)
- CSS Grid/Flexbox for layouts
- CSS custom properties not used (could be added for easier theming)

### Sitemap Maintenance

**File**: `sitemap.xml`

Currently includes:
- `/` (accueil, priority 1.0)
- `/photographie-sous-marine` (priority 0.9)
- `/videos` (priority 0.9)

When adding new pages, update the sitemap with appropriate priority and changefreq values.

### Testing Checklist

Before deploying changes:
- [ ] Test all pages on mobile (< 480px width)
- [ ] Verify clean URLs work (without .html extension)
- [ ] Check all internal links use clean URLs
- [ ] Validate Open Graph metadata with Facebook debugger
- [ ] Test Schema.org markup with Google Rich Results tester
- [ ] Verify images load correctly (check URL encoding)
- [ ] Test animations perform smoothly on mobile

## Common Tasks

### Adding a New Page

1. Copy the structure from `index.html` or the most similar page
2. Update `<title>`, meta description, canonical URL
3. Update Open Graph tags (title, description, URL)
4. Update Schema.org structured data if applicable
5. Maintain the design system (use existing CSS)
6. Add entry to `sitemap.xml`
7. Add link from `index.html` if it should be discoverable

### Updating the Photo Gallery

1. Add new images to `/images/` directory
2. Follow naming convention: `Marseille-dark-massilia-plastique-pollution-projet-sentinelle-{descriptor}.jpg`
3. Add image paths to `allImages` array in photos.html (line ~496)
4. Use URL encoding for French characters
5. Test carousel navigation works correctly

### Changing Brand Colors

Primary brand color `#21c47b` appears in:
- Badge backgrounds
- Button gradients (`.btn-primary`)
- Glow effects (box-shadow)
- Strong text emphasis
- Link hover states

To change branding, find-and-replace `#21c47b` across all HTML files, then test visual consistency.

## Analytics & Tracking

**Google Site Verification**: `google8f4683bb31574284.html` (verification file in root)

No analytics tracking code is currently present. Add Google Analytics or similar if needed.

## Accessibility

**Current State**:
- Semantic HTML structure (main, h1-h2 headings)
- Alt text on images (auto-generated from filenames in carousel)
- Focus states on buttons (`:focus-visible`)
- Sufficient color contrast for text

**Improvement Opportunities**:
- Add ARIA labels to carousel navigation buttons
- Improve keyboard navigation for photo slideshow
- Add skip-to-content link
- Test with screen readers

## Performance Optimization

**Current Optimizations**:
- Gzip compression via .htaccess
- Long cache times for static assets
- No external dependencies (no CDN requests)
- Inline CSS/JS (eliminates render-blocking requests)

**Future Considerations**:
- Image optimization (convert to WebP for smaller file sizes)
- Lazy loading for carousel images
- Critical CSS extraction if pages grow larger
- Consider CDN for image hosting

## Project Mission

The website serves to:
1. Promote environmental awareness about Mediterranean pollution
2. Showcase underwater photography documenting marine life and pollution
3. Recruit volunteers for "Projet Sentinelle" cleanup missions
4. Build credibility through media coverage and partnerships
5. Provide direct contact for collaboration opportunities

When making changes, keep the mission-focused, environmentally conscious tone consistent across all pages.
