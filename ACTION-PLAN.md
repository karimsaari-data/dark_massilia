# Plan d'Action SEO — karimsaari.com
**Généré le** : 26 avril 2026 | **Score actuel** : 78/100

---

## 🔴 CRITIQUE — Corriger immédiatement

### 1. /dossier-presse → 404 dans le sitemap
**Fichier** : `public/sitemap.xml`  
**Impact** : Google tente de crawler une URL 404 référencée comme priorité 0.8  
**Fix rapide** (5 min) : supprimer les lignes suivantes de `sitemap.xml` :
```xml
<url>
  <loc>https://karimsaari.com/dossier-presse</loc>
  ...
</url>
```
**Fix complet** (2h) : créer `src/pages/DossierPresse.jsx` + ajouter la route dans `src/AppRoutes.jsx` + `npm run build:full`

---

### 2. LocalBusiness schema vide
**Fichier** : `src/utils/seo.js` (ligne ~146 dans `SEO_PAGES['/']`)  
**Impact** : Schema invalide, pas de rich result Local sur Google  
**Fix** : Remplacer le stub par :
```javascript
{
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#business`,
  name: 'Dark Massilia — Karim Saari',
  description: 'Photographe environnemental et sous-marin à Marseille. Fondateur du Projet Sentinelle — dépollution marine des Calanques.',
  url: BASE_URL,
  telephone: '+33695331301',
  image: DEFAULT_IMAGE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Marseille',
    addressRegion: 'Bouches-du-Rhône',
    postalCode: '13000',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.2965,
    longitude: 5.3698,
  },
  sameAs: [`${BASE_URL}/#person`],
}
```

---

## 🟠 HAUTE PRIORITÉ — Corriger cette semaine

### 3. H1 manquant sur /acces-massifs-calanques
**Fichier** : `src/pages/AccesMassifs.jsx`  
**Impact** : Page sans H1 = signal SEO faible sur une page à fort trafic saisonnier  
**Fix** : Ajouter un `<h1>` visible dans le JSX (ex: "Accès Massifs des Calanques — Restrictions & Risque Incendie")

---

### 4. WebSite + SearchAction schema
**Fichier** : `src/utils/seo.js` — dans `SEO_PAGES['/'].schema['@graph']`  
**Impact** : SiteLinks SearchBox absente des SERP sur requêtes de marque  
**Fix** : Ajouter dans le `@graph` :
```javascript
{
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'Karim Saari — Dark Massilia',
  url: BASE_URL,
  inLanguage: 'fr-FR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
}
```

---

### 5. plan-du-site → ajouter noindex
**Fichier** : `src/pages/` (page plan-du-site)  
**Impact** : Page indexée sans valeur SEO, consomme du crawl budget  
**Fix** : Ajouter `<SEO noindex={true} robots="noindex, nofollow" ... />`

---

### 6. OG images spécifiques pour les pages phares
**Fichier** : `src/utils/seo.js`  
**Impact** : Toutes les pages partagent `og-social-card.jpg` → CTR social sous-optimal  
**Pages prioritaires** : `/depollution-marine`, `/photographie-sous-marine`, `/photographe-environnemental-marseille`, `/blog`  
**Fix** : Générer des OG images via `scripts/generate-og-image.js` puis référencer dans `SEO_PAGES`:
```javascript
'/depollution-marine': {
  ...
  image: `${BASE_URL}/assets/og-depollution-marine.jpg`,
  ...
}
```

---

### 7. PSI_API_KEY — configurer la surveillance CWV
**Impact** : Sans clé, le monitoring performance `scripts/psi-audit.js` est aveugle (429 sur 25 pages)  
**Fix** :
1. Aller sur [Google Cloud Console](https://console.cloud.google.com) → activer "PageSpeed Insights API"
2. Créer une clé API
3. Ajouter dans `.env.local` : `PSI_API_KEY=your_key_here`
4. Ou en secret GitHub Actions si utilisé dans CI

---

## 🟡 MOYENNE PRIORITÉ — Corriger ce mois

### 8. Sitemap : lastmod dynamiques pour les articles
**Fichier** : `scripts/generate-sitemap.js`  
**Fix** : Lire la date `modified` depuis l'API WP lors de la génération du sitemap

### 9. Différenciation communaute vs communaute-calanques
Analyser les KW cibles de chaque page et s'assurer qu'elles ne se cannibalisent pas. Suggestion :
- `/communaute` → hub agrégateur de tous les réseaux
- `/communaute-calanques` → focus spécifique Facebook + rejoindre le groupe

### 10. Sources dans les articles de blog
Ajouter un lien vers `/donnees-scientifiques` dans chaque article qui cite des statistiques sur la pollution marine.

### 11. Renommer l'image avec espaces
`public/images/groupe des amoureux des calanques.webp` → `public/images/groupe-amoureux-calanques-facebook.webp`  
Mettre à jour les références dans `src/pages/Home.jsx`.

### 12. Alt texts enrichis (mots-clés)
Améliorer les alt texts des images secondaires pour inclure les mots-clés cibles tout en restant descriptifs.

---

## 🟢 BASSE PRIORITÉ — Backlog

- [ ] Schema `CollectionPage` + `ItemList` sur `/blog/categorie/*`
- [ ] Schema `VideoObject` enrichi sur pages ARTE
- [ ] Content-Security-Policy header dans `.htaccess`
- [ ] `/.well-known/gpc.json`
- [ ] Lazy loading framer-motion (sections below-fold)
- [ ] Dates visibles dans le corps des articles

---

## Commandes de vérification post-fix

```bash
# Après correction dossier-presse
npm run build:full && node scripts/seo-crawl.js

# Valider les schemas
# → https://validator.schema.org/  (coller le JSON-LD)
# → https://search.google.com/test/rich-results

# Tester les canonical + H1
node -e "
const fs = require('fs');
['dist/acces-massifs-calanques/index.html'].forEach(p => {
  const html = fs.readFileSync(p,'utf8');
  console.log('H1:', (html.match(/<h1[\s>]/gi)||[]).length);
});
"
```

---

*Plan d'action généré par Claude Code · 26 avril 2026*
