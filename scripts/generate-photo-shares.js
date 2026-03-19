#!/usr/bin/env node
/**
 * generate-photo-shares.js
 *
 * Génère dist/p/{uid}/index.html pour chaque photo des deux galeries.
 * Chaque page relais contient :
 *   - og:title   → titre personnalisé par photo (depuis Supabase)
 *   - og:image   → URL absolue de LA photo
 *   - JSON-LD    → ImageObject Schema.org avec auteur, lieu, description
 *   - script JS  → redirige l'utilisateur vers la galerie avec deep-link
 *
 * Lancer après `vite build` : les dossiers dist/p/{uid}/ sont créés dynamiquement.
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

/* ── Lecture du .env pour récupérer les clés Supabase ─────────── */
function loadEnv() {
  // process.cwd() = racine du projet quand lancé via npm run
  const candidates = [
    path.join(process.cwd(), '.env'),
    path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'),
  ];
  const vars = {};
  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    fs.readFileSync(envPath, 'utf-8').split(/\r?\n/).forEach(line => {
      const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (m) vars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    });
    break;
  }
  return vars;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;

const GALLERY_BY_TABLE = {
  photos_paysage:     'photographie-paysage-mer',
  photos_sous_marine: 'photographie-sous-marine',
};

/* ── Fetch toutes les photos depuis Supabase ──────────────────── */
async function fetchAllPhotos() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('⚠️  Supabase env vars manquantes — aucune page générée');
    return [];
  }
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const photos = [];
  for (const [table, gallery] of Object.entries(GALLERY_BY_TABLE)) {
    const { data, error } = await sb
      .from(table)
      .select('uid, src, alt, title, lieu, lat, lng, slug')
      .eq('visible', true);
    if (error) { console.warn(`⚠️  Supabase ${table} :`, error.message); continue; }
    for (const row of data || []) {
      photos.push({ ...row, gallery });
    }
  }
  console.log(`📦  Supabase : ${photos.length} photos visibles récupérées`);
  return photos;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir   = path.join(__dirname, '..', 'dist');
const BASE      = 'https://karimsaari.com';

// ────────────────────────────────────────────────────────────────────────────
// 3. Génération HTML
// ────────────────────────────────────────────────────────────────────────────

/**
 * Génère le HTML d'une page relais OG enrichie.
 * @param {string} uid       - identifiant unique de la photo (pour le deep-link)
 * @param {string} pageSlug  - slug textuel de l'URL /p/{slug}
 * @param {string} imageSrc  - chemin relatif (ex: /images/...)
 * @param {string} alt       - texte alt / og:description
 * @param {string} gallery   - slug de la galerie
 * @param {object} meta      - {title, lieu, lat, lng} depuis Supabase (peut être vide)
 */
function buildRelayPage(uid, pageSlug, imageSrc, alt, gallery, meta = {}) {
  const imageAbsUrl = `${BASE}${imageSrc}`;
  const galleryUrl  = `${BASE}/${gallery}?photo=${encodeURIComponent(uid)}`;
  const relayUrl    = `${BASE}/p/${encodeURIComponent(pageSlug)}`;

  // ── og:title personnalisé ─────────────────────────────────────
  const photoTitle = meta.title || '';
  const lieu       = meta.lieu  || 'Marseille';
  const ogTitle    = photoTitle
    ? `${photoTitle} — ${lieu} | Karim Saari`
    : `Karim Saari — Photographe ${lieu}`;

  // ── og:description (alt tronqué à 160 car.) ───────────────────
  const description = alt.length > 160 ? alt.slice(0, 157) + '...' : alt;
  const descEsc     = description.replace(/"/g, '&quot;');
  const titleEsc    = ogTitle.replace(/"/g, '&quot;');

  // ── JSON-LD ImageObject ───────────────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'ImageObject',
    'name':     photoTitle || alt.replace(/\s*—\s*©.*$/, '').replace(/\s*—\s*Karim Saari.*$/i, ''),
    'description': alt,
    'contentUrl':  imageAbsUrl,
    'url':         relayUrl,
    'author': {
      '@type': 'Person',
      'name':  'Karim Saari',
      'url':   'https://karimsaari.com',
      'sameAs': [
        'https://www.instagram.com/karimsaari',
        'https://twitter.com/dark_massilia',
        'https://www.tiktok.com/@dark.massilia',
      ],
    },
    'locationCreated': {
      '@type': 'Place',
      'name':  lieu,
      ...(meta.lat && meta.lng ? {
        'geo': { '@type': 'GeoCoordinates', 'latitude': meta.lat, 'longitude': meta.lng },
      } : {}),
    },
    'license': 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    'acquireLicensePage': 'https://karimsaari.com/contact',
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${titleEsc}</title>
  <!-- Robots : page technique, pas besoin d'indexation directe -->
  <meta name="robots" content="noindex, nofollow">
  <!-- Open Graph — miniature et titre spécifiques à la photo -->
  <meta property="og:type"        content="website">
  <meta property="og:site_name"   content="Karim Saari — Dark Massilia">
  <meta property="og:title"       content="${titleEsc}">
  <meta property="og:description" content="${descEsc}">
  <meta property="og:image"       content="${imageAbsUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:url"         content="${relayUrl}">
  <meta property="og:locale"      content="fr_FR">
  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@dark_massilia">
  <meta name="twitter:title"       content="${titleEsc}">
  <meta name="twitter:description" content="${descEsc}">
  <meta name="twitter:image"       content="${imageAbsUrl}">
  <!-- Schema.org ImageObject -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <script>window.location.replace('${galleryUrl}');</script>
  <p>Redirection en cours… <a href="${galleryUrl}">Cliquez ici</a> si elle ne s'effectue pas.</p>
</body>
</html>`;
}

// ────────────────────────────────────────────────────────────────────────────
// 4. Écriture des fichiers (100% dynamique depuis Supabase)
// ────────────────────────────────────────────────────────────────────────────

const photos = await fetchAllPhotos();

let count = 0;

for (const photo of photos) {
  if (!photo.uid || !photo.src) continue;

  // Générer un alt depuis le nom de fichier si vide en DB
  const altText = photo.alt || (() => {
    const filename = photo.src.split('/').pop().replace('.webp', '');
    const desc = filename
      .replace(/marseille-dark-massilia-plastique-pollution-projet-sentinelle-/i, '')
      .replace(/photographe-sous-marin-marseille-/i, '')
      .replace(/marseille-dark-massilia-/i, '')
      .replace(/karim-saari-marseille-/i, '')
      .replace(/karim-saari-photographe-/i, '')
      .replace(/-/g, ' ').replace(/_/g, ' ');
    return desc.charAt(0).toUpperCase() + desc.slice(1) + ' — © Karim Saari';
  })();

  const pageSlug = photo.slug || photo.uid;
  const meta     = { title: photo.title, lieu: photo.lieu, lat: photo.lat, lng: photo.lng };

  // Page principale : /p/{slug}/
  const dir      = path.join(distDir, 'p', pageSlug);
  const filePath = path.join(dir, 'index.html');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, buildRelayPage(photo.uid, pageSlug, photo.src, altText, photo.gallery, meta), 'utf-8');
  count++;

  // Rétrocompat : /p/{uid}/ redirige vers /p/{slug}/ si différent
  if (pageSlug !== photo.uid) {
    const uidDir  = path.join(distDir, 'p', photo.uid);
    const uidFile = path.join(uidDir, 'index.html');
    fs.mkdirSync(uidDir, { recursive: true });
    fs.writeFileSync(uidFile,
      `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="robots" content="noindex"><script>window.location.replace('${BASE}/p/${encodeURIComponent(pageSlug)}');</script></head><body><a href="${BASE}/p/${encodeURIComponent(pageSlug)}">Redirection…</a></body></html>`,
      'utf-8'
    );
  }
}

console.log(`✅  generate-photo-shares : ${count} pages relais OG générées dans dist/p/`);
