// Récupère les dates de publication des vidéos YouTube via l'API YouTube
// Data v3 et les écrit dans src/data/video-dates.json.
//
// Utilisé au build (npm run build:full). Nécessite la variable d'env
// YOUTUBE_API_KEY (secret GitHub en CI, .env en local).
//
// Comportement :
//   - récupère en un seul appel toutes les vidéos de type YouTube listées
//     dans src/data/videos.js (les entrées Vimeo sont ignorées) ;
//   - fusionne avec le contenu existant de video-dates.json, ce qui préserve
//     les dates saisies manuellement (Vimeo) ;
//   - si YOUTUBE_API_KEY est absente, on n'écrase rien et on sort proprement
//     (le JSON déjà versionné sert de fallback).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { videos } from '../src/data/videos.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATES_PATH = join(__dirname, '..', 'src', 'data', 'video-dates.json');

const API_KEY = process.env.YOUTUBE_API_KEY;

function loadExisting() {
  try {
    return JSON.parse(readFileSync(DATES_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  const existing = loadExisting();

  if (!API_KEY) {
    console.warn('⚠️  YOUTUBE_API_KEY absente — dates YouTube non rafraîchies, video-dates.json conservé tel quel.');
    return;
  }

  const ids = videos
    .filter((v) => (v.type || 'youtube') === 'youtube')
    .map((v) => v.id);

  if (ids.length === 0) {
    console.log('Aucune vidéo YouTube à interroger.');
    return;
  }

  // L'API accepte jusqu'à 50 ID par appel — on est largement en dessous.
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('id', ids.join(','));
  url.searchParams.set('key', API_KEY);

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API YouTube ${res.status} : ${body}`);
  }

  const data = await res.json();
  const merged = { ...existing };
  let updated = 0;

  for (const item of data.items || []) {
    // publishedAt = "2024-06-11T17:30:00Z" → on ne garde que la date.
    const iso = item.snippet?.publishedAt?.slice(0, 10);
    if (iso && merged[item.id] !== iso) {
      merged[item.id] = iso;
      updated++;
    }
  }

  const found = (data.items || []).length;
  const missing = ids.filter((id) => !merged[id]);
  if (missing.length) {
    console.warn(`⚠️  Aucune date trouvée pour : ${missing.join(', ')}`);
  }

  // Écriture dans l'ordre de videos.js (les dates manuelles, ex. Vimeo, en fin).
  const ordered = {};
  for (const v of videos) {
    if (merged[v.id]) ordered[v.id] = merged[v.id];
  }
  for (const [k, val] of Object.entries(merged)) {
    if (!(k in ordered)) ordered[k] = val;
  }

  writeFileSync(DATES_PATH, JSON.stringify(ordered, null, 2) + '\n');
  console.log(`✅ Dates YouTube récupérées : ${found}/${ids.length} vidéos, ${updated} date(s) mise(s) à jour.`);
}

main().catch((err) => {
  console.error('❌ fetch-youtube-dates :', err.message);
  process.exitCode = 1;
});
