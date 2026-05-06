# Audit SEO Complet — karimsaari.com
**Date** : 26 avril 2026  
**Portée** : 39 pages crawlées · 1 erreur · Suivi de 40 URLs sitemap

---

## Score de Santé SEO Global : **78 / 100**

| Catégorie | Score | Poids | Contribution |
|-----------|-------|-------|-------------|
| SEO Technique | 82/100 | 22% | 18.0 |
| Qualité du Contenu | 88/100 | 23% | 20.2 |
| On-Page SEO | 80/100 | 20% | 16.0 |
| Schema / Données Structurées | 72/100 | 10% | 7.2 |
| Performance (CWV) | 65/100 | 10% | 6.5 |
| Lisibilité IA (AI Search) | 90/100 | 10% | 9.0 |
| Images | 85/100 | 5% | 4.3 |
| **TOTAL** | **78/100** | 100% | **81.2** |

---

## Résumé Exécutif

**Type de site détecté** : Portefeuille personnel / Engagement environnemental · Photographe professionnel · Local (Marseille)

**Top 5 — Problèmes Critiques**
1. `/dossier-presse` : dans le sitemap mais aucun fichier `dist/` → **404 garantie** pour Google
2. Schema `LocalBusiness` stub vide (pas de nom, adresse, téléphone, horaires)
3. Schema `WebSite` + `SearchAction` absents → pas de SiteLinks SearchBox
4. `/acces-massifs-calanques` : **aucun H1** alors que c'est une page indexée à fort trafic quotidien
5. PSI_API_KEY non configurée → surveillance CWV aveugle

**Top 5 — Quick Wins**
1. Supprimer `/dossier-presse` du sitemap (ou builder la page) — 5 min
2. Ajouter H1 à `/acces-massifs-calanques` — 5 min
3. Compléter le schema `LocalBusiness` (nom + adresse + tel + type) — 15 min
4. Ajouter schema `WebSite` avec `SearchAction` sur la home — 10 min
5. Configurer `PSI_API_KEY` en secret GitHub pour le monitoring CWV — 5 min

---

## 1. SEO Technique — 82/100

### ✅ Points forts

**robots.txt** : Configuration exemplaire.
- Crawlers AI de recherche explicitement autorisés : Google-Extended, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot
- Scrapers d'entraînement bloqués : Bytespider, CCBot, Amazonbot
- 2 sitemaps référencés : `sitemap.xml` + `sitemap-images.xml`

**Redirections 301** (.htaccess) : Infrastructure de redirections solide.
- www → non-www (canonicalisation domaine)
- Trailing slash supprimé (évite duplication `/page/` vs `/page`)
- Toutes les anciennes URLs legacy `/home/`, `.html`, anciens slugs couverts
- Redirection emoji slug WordPress → URL propre

**Headers de sécurité** :
- HSTS : `max-age=31536000; includeSubDomains` ✅
- X-Frame-Options: SAMEORIGIN ✅
- X-Content-Type-Options: nosniff ✅
- COOP: same-origin-allow-popups ✅
- Cache immutable sur assets Vite hashés ✅

**Prérendu SSR** : Toutes les pages clés ont un `index.html` statique — parfait pour le crawl Google.

**Pages légales** : `confidentialite` et `mentions-legales` ont `robots: noindex, nofollow` ✅

### ⚠️ Problèmes

**[CRITIQUE] /dossier-presse dans le sitemap mais absent du dist**
```
Sitemap : https://karimsaari.com/dossier-presse (priority 0.8, changefreq monthly)
Dist    : ❌ C:\...\dist\dossier-presse\index.html introuvable
```
Google essaiera de crawler cette URL et tombera sur une 404. Supprimer du sitemap ou construire la page.

**[MOYEN] plan-du-site sans noindex**
La page `/plan-du-site` est indexable (pas de `robots: noindex`) mais absente du sitemap. Ajouter `noindex` ou l'inclure dans le sitemap.

**[MOYEN] Canonical home : incohérence trailing slash**
```
Dist (dist/index.html) : https://karimsaari.com    (sans slash final)
Sitemap               : https://karimsaari.com/    (avec slash final)
```
Google traite ces deux URLs comme identiques grâce au 301, mais idéalement le sitemap devrait correspondre exactement au canonical déclaré.

**[MOYEN] CSP (Content-Security-Policy) absent**
Aucun header CSP configuré dans `.htaccess`. Non bloquant pour le SEO mais un signal de sécurité apprécié par Google.

**[INFO] PSI_API_KEY non configurée**
Le script `psi-audit.js` retourne 429 sur toutes les pages sans clé API. CWV non mesurables via le monitoring automatique.

---

## 2. Sitemap — 88/100

### ✅ Points forts
- 40 URLs couvertes (pages statiques + blog + catégories)
- Sitemap images séparé (`sitemap-images.xml`)
- `lastmod` à jour sur les pages actives
- `changefreq` adapté au contenu (`daily` pour accès-massifs, `weekly` pour blog)
- Priorités cohérentes (1.0 accueil → 0.5 contact)

### ⚠️ Problèmes
**[CRITIQUE]** `/dossier-presse` : voir section Technique  
**[MOYEN]** Les 16 articles de blog ont tous `lastmod: 2026-04-12` même s'ils ont été mis à jour après. Le script `generate-sitemap.js` devrait lire la date de modification réelle depuis l'API WP.  
**[BAS]** `/actualites` (alias Twitter) : priorité 0.6 alors que c'est une page de signal d'actualité — 0.7-0.8 serait plus approprié.

---

## 3. Qualité du Contenu — 88/100

### ✅ Points forts

**E-E-A-T très solide** :
- Expérience : 10 ans de terrain documentés, chiffres précis (5 724 kg, 4 éditions, dates)
- Expertise : Wikidata `Q138808583`, Wikipedia `Projet_Sentinelle`, certification Zero Déchet Sauvage
- Autorité : ARTE, TF1, M6, Le Monde, La Provence, Midi Libre, Yann Arthus-Bertrand
- Confiance : Contact visible, association loi 1901 (Team Oxygen), Parc National partenaire

**FAQ Homepage** : 15 questions/réponses substantielles, toutes dans le DOM (visibles pour les crawlers même fermées grâce à `max-h-0` CSS). Parfait pour les rich snippets.

**Impact facts** : 10 faits scientifiques sourcés, contenu de haute valeur pour les AI Overviews.

**Blog** : 16 articles récents (avril 2026), sujets ciblés (biodiversité, dépollution, calanques).

**llms.txt** : Présent et bien structuré ✅ — faits citables, liens canoniques, identité claire.

### ⚠️ Problèmes

**[HAUT]** Les articles du blog ne citent pas de sources scientifiques explicitement dans le corps du texte. La page `/donnees-scientifiques` existe mais n'est pas linkée depuis chaque article. Signal E-E-A-T manquant.

**[MOYEN]** Cannibalisation potentielle entre `/communaute` et `/communaute-calanques` : deux pages ciblant la même intention de recherche ("communauté calanques"). Différencier clairement les cibles KW ou rediriger l'une vers l'autre.

**[BAS]** Les articles de blog n'ont pas de date de publication visible dans le corps du texte (seulement en metadata). Google préfère les dates visibles pour les contenus d'actualité.

---

## 4. On-Page SEO — 80/100

### ✅ Points forts

| Page | Title (chars) | Description (chars) | H1 | Canonical |
|------|--------------|--------------------|----|-----------|
| `/` | 51 ✅ | 149 ✅ | 1 ✅ | ✅ |
| `/depollution-marine` | 62 ✅ | 148 ✅ | 1 ✅ | ✅ |
| `/photographie-sous-marine` | 46 ✅ | 156 ✅ | 1 ✅ | ✅ |
| `/blog` | 50 ✅ | 150 ✅ | 1 ✅ | ✅ |
| `/acces-massifs-calanques` | 55 ✅ | 142 ✅ | **0 ❌** | ✅ |

Toutes les pages testées ont : `<title>`, `<meta description>`, canonical, Open Graph complet, Twitter Card.

**Keywords dans les titles** : Les mots-clés cibles principaux sont bien intégrés (Marseille, Calanques, Photographe, Dépollution).

**Maillage interne depuis la home** : équilibré — toutes les pages importantes reçoivent 2-3 liens.

### ⚠️ Problèmes

**[HAUT]** `/acces-massifs-calanques` : H1 absent alors que la page est indexée et reçoit du trafic quotidien (accès massifs = requête saisonnière forte). À corriger immédiatement.

**[HAUT]** Toutes les pages partagent la même image OG (`og-social-card.jpg`). Pour les pages phares (dépollution-marine, photographie-sous-marine, blog), une image OG spécifique améliorerait significativement le CTR sur les réseaux sociaux.

**[MOYEN]** La page `/blog` n'est liée qu'**une seule fois** depuis la home. C'est une section structurante — augmenter le linkage interne vers le blog.

**[BAS]** Quelques titles en anglais dans les alt text ("Team Oxygen - Projet Sentinelle Marseille" sur l'image team). Uniformiser en français.

---

## 5. Schema / Données Structurées — 72/100

### ✅ Points forts

**`Person` schema (`PERSON_SCHEMA`)** : Exceptionnel.
- `sameAs` : 29 URLs (réseaux sociaux, médias, Wikidata, Wikimedia, articles de presse)
- `knowsAbout` : 12 domaines d'expertise
- `memberOf`, `owns`, `sponsor`, `hasCredential` : champs rares et précieux pour E-E-A-T
- `@id` unique réutilisé entre pages (`#person`) — bonne pratique

**`FAQPage`** : Sur `/` (15 Q&A) et `/depollution-marine` (4 Q&A) — eligible aux rich snippets Google

**`Organization / NGO`** sur `/depollution-marine` : Schema très complet (Team Oxygen)

**`BlogPosting`** sur les articles : datePublished, dateModified, author, image, breadcrumb

**`BreadcrumbList`** : Présent sur la majorité des pages secondaires

### ⚠️ Problèmes

**[CRITIQUE] `LocalBusiness` schema vide**
```javascript
// Actuel — stub incomplet
{ '@type': 'LocalBusiness', '@id': `${BASE_URL}/#business` }
```
Ce schema est inopérant. Il faut au minimum : `name`, `@type` spécifique (ex: `LocalBusiness` → `PhotographyBusiness` ou `Person`), `address`, `telephone`, `url`, `image`, `description`.

**[HAUT] Schema `WebSite` + `SearchAction` absents**
```javascript
// À ajouter sur la home
{
  '@type': 'WebSite',
  '@id': 'https://karimsaari.com/#website',
  name: 'Karim Saari — Dark Massilia',
  url: 'https://karimsaari.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://karimsaari.com/blog?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
}
```
Ce schema active la SiteLinks SearchBox dans les SERP pour les requêtes de marque.

**[MOYEN]** Les pages de catégories blog (`/blog/categorie/biodiversite` etc.) n'ont pas de schema `CollectionPage` ni `ItemList`. Ajouter un schema `ItemList` avec les articles listés.

**[BAS]** Les pages documentaires ARTE (`/sauver-marseille-documentaire-arte`, `/meduses-souveraines-oceans-documentaire-arte`) pourraient bénéficier d'un schema `Movie` ou `VideoObject` enrichi.

---

## 6. Performance (CWV) — 65/100

> ⚠️ PSI API quota dépassé — données basées sur l'analyse du code source (estimation)

### ✅ Points forts identifiés dans le code

**Images** :
- Format WebP exclusif ✅
- `srcSet` multi-résolutions sur toutes les images hero et cards ✅  
- `sizes` adaptés (100vw mobile, 50vw desktop) ✅
- Image LCP avec `loading="eager"` + `fetchpriority="high"` ✅
- `decoding="async"` sur toutes les images secondaires ✅
- Preload LCP via `<link rel="preload">` dans le composant SEO ✅

**Build** :
- Compression Brotli/Gzip (vite-plugin-compression2) ✅
- Assets Vite avec hash + `Cache-Control: immutable` ✅
- Code splitting (lazy loading Supabase, Newsletter, RecentArticles) ✅
- React 19 (meilleure performance rendu vs React 17-18) ✅

**HTML** :
- `no-cache, must-revalidate` sur les HTML ✅ (évite les pages périmées)

### ⚠️ Risques identifiés

**[HAUT] CLS potentiel** : La section stats (`StatCounter`) charge des valeurs Supabase de façon asynchrone. Si les dimensions ne sont pas réservées (elles semblent l'être via `text-3xl md:text-4xl lg:text-5xl`), un layout shift est possible pendant le chargement dynamique.

**[HAUT] LCP mobile** : L'image hero profil a 2 déclinaisons séparées (mobile/desktop, CSS `hidden md:hidden`). Les deux sont dans le DOM et toutes les deux ont `fetchpriority="high"`. Sur mobile, le navigateur charge potentiellement les 2. Vérifier avec Chrome DevTools sur réseau lent.

**[MOYEN] Framer Motion** : `motion/react` est importé en haut niveau dans `Home.jsx` (pas lazy). Cette librairie est lourde (~50KB gzippé). Évaluer si le lazy loading de motion est possible pour les sections below-the-fold.

**[BAS] Font Display** : Vérifier que les polices custom (si présentes) ont `font-display: swap`.

---

## 7. Images — 85/100

### ✅ Points forts
- 100% WebP ✅
- 0 image sans alt text (crawl : `img-noalt:0` sur toutes les pages) ✅
- Sitemap images séparé (`sitemap-images.xml`) ✅
- Nommage SEO des images (`Marseille-dark-massilia-plastique-pollution-projet-sentinelle-*.webp`)
- `ImageObject` schema sur `/depollution-marine` (copyright, creditText, license) ✅

### ⚠️ Problèmes

**[MOYEN]** Nom de fichier avec espaces : `groupe des amoureux des calanques.webp` → URL-encodé en `groupe%20des%20amoureux%20des%20calanques.webp`. Fonctionnel mais à renommer pour propret (tirets).

**[BAS]** Certains alt text sont informatifs mais manquent de mots-clés cibles. Ex : `"Team Oxygen - Projet Sentinelle Marseille"` → améliorer en `"Équipe Team Oxygen en mission de dépollution sous-marine Calanques de Marseille — Projet Sentinelle"`.

---

## 8. AI Search Readiness — 90/100

### ✅ Points forts

**llms.txt** : Présent et excellent.
- Faits citables structurés (5 724 kg, 130 000 membres, 1% océans / 7% plastiques)
- Toutes les pages principales listées avec descriptions
- Contact, association, partenaires institutionnels

**robots.txt** : Stratégie AI optimale — crawlers de recherche autorisés, scrapers d'entraînement bloqués.

**Signaux de citabilité** :
- Wikidata `Q138808583` : présence encyclopédique vérifiable
- Wikipedia `Projet_Sentinelle` : référence externe neutre
- Schema `Person` avec 29 `sameAs` : graphe de connaissance riche
- Mentions presse de référence (ARTE, TF1, M6, Le Monde)
- Données chiffrées précises et vérifiables (kg, kg/édition, membres, vues Maps)

**Contenu FAQ** : 15 Q&A sur la home dans le DOM (visibles sans JS) = source idéale pour les AI Overviews Google.

### ⚠️ Problèmes

**[MOYEN]** Le `llms.txt` indique "5 724 kg" mais la home affiche le même chiffre avec l'annotation "jusqu'à 2025". Ajouter une date de dernière mise à jour dans `llms.txt` pour que les IA sachent quand les données ont été vérifiées.

**[BAS]** Pas de `/.well-known/` directory. Envisager `/.well-known/gpc.json` (Global Privacy Control) pour signal de conformité RGPD.

---

## 9. Pages Orphelines — Analyse

**Pages dans dist mais absentes du sitemap :**

| Page | Status | Action |
|------|--------|--------|
| `admin` | Normal (admin privé) | Noindex déjà géré par le routeur |
| `confidentialite` | `noindex, nofollow` ✅ | OK |
| `mentions-legales` | `noindex, nofollow` ✅ | OK |
| `plan-du-site` | **index (default) ⚠️** | Ajouter `noindex` ou inclure dans sitemap |
| `p` | Inconnu | Vérifier si c'est un reste de preview |
| `images` | Dossier d'assets | Normal |

**Dans le sitemap mais absent du dist :**

| Page | Status | Action |
|------|--------|--------|
| `/dossier-presse` | **CRITIQUE — 404** | Construire la page ou supprimer du sitemap |

---

## 10. Crawl — 16 pages orphelines signalées

Le script `seo-crawl.js` a signalé 16 pages orphelines (dans le dist mais sans lien entrant depuis le sitemap ou les autres pages). Vérifier que toutes les pages importantes sont accessibles depuis au moins une page linkée.

---

## Résumé : Plan d'Action Prioritaire

### 🔴 Critique (corriger immédiatement)

1. **`/dossier-presse` 404**
   - Option A : Supprimer la ligne de `sitemap.xml`
   - Option B : Créer la page `src/pages/DossierPresse.jsx` + route + build
   - Temps estimé : 5 min (suppression) ou 2h (création)

2. **`LocalBusiness` schema vide**
   - Compléter dans `src/utils/seo.js` avec name, address, telephone, image
   - Temps estimé : 15 min

### 🟠 Haute priorité (corriger dans la semaine)

3. **H1 manquant sur `/acces-massifs-calanques`**
   - Ajouter un `<h1>` visible dans `src/pages/AccesMassifs.jsx`
   - Temps estimé : 5 min

4. **Schema `WebSite` + `SearchAction`**
   - Ajouter dans le `@graph` de la home dans `seo.js`
   - Temps estimé : 10 min

5. **OG images spécifiques par page**
   - Générer des OG images pour les 5 pages principales (dépollution, photographie-sous-marine, blog, photographe-environnemental, communaute)
   - Temps estimé : 1h (avec `scripts/generate-og-image.js` existant)

6. **`plan-du-site` : ajouter `noindex`**
   - Dans `src/pages/` correspondante, ajouter `<SEO noindex={true} />`
   - Temps estimé : 5 min

7. **Configurer `PSI_API_KEY`**
   - Obtenir clé gratuite sur Google Cloud Console > PageSpeed Insights API
   - Ajouter en secret dans `.env.local` ou GitHub Actions
   - Temps estimé : 10 min

### 🟡 Moyenne priorité (corriger dans le mois)

8. **Sources scientifiques dans les articles de blog**
   - Lier vers `/donnees-scientifiques` depuis chaque article
   
9. **Différenciation `/communaute` vs `/communaute-calanques`**
   - Clarifier les intentions de recherche cibles pour éviter la cannibalisation

10. **Sitemap blog : `lastmod` dynamique**
    - Le script de génération doit lire les dates réelles depuis l'API WP

11. **Renommer `groupe des amoureux des calanques.webp`**
    - → `groupe-amoureux-calanques-facebook.webp`

12. **Améliorer les alt text des images secondaires**
    - Intégrer les mots-clés cibles tout en restant descriptifs

### 🟢 Basse priorité (backlog)

13. Ajouter schema `CollectionPage` + `ItemList` sur `/blog/categorie/*`
14. Enrichir schema `VideoObject` sur les pages documentaires ARTE
15. CSP header dans `.htaccess`
16. `/.well-known/gpc.json`
17. Évaluer lazy loading de framer-motion pour les sections below-fold
18. Date visible dans le corps des articles de blog

---

*Audit généré par Claude Code · 26 avril 2026 · karimsaari.com*
