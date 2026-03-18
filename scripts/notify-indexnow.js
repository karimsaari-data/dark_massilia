/**
 * notify-indexnow.js — Soumet toutes les URLs du sitemap à IndexNow (Bing)
 * Usage : npm run indexnow
 * À lancer après chaque déploiement FTP.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const INDEXNOW_KEY  = 'bd8917dee11648b28d95e98c76657f5f';
const INDEXNOW_HOST = 'karimsaari.com';
const KEY_LOCATION  = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
const ENDPOINT      = 'https://api.indexnow.org/indexnow';

// Lire le sitemap.xml et extraire les URLs
const sitemapPath = resolve(__dirname, '../public/sitemap.xml');
const sitemap = readFileSync(sitemapPath, 'utf-8');
const urlList = [...sitemap.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)]
  .map(m => m[1].trim())
  .filter(u => u.startsWith(`https://${INDEXNOW_HOST}`));

if (urlList.length === 0) {
  console.error('❌ Aucune URL trouvée dans le sitemap.');
  process.exit(1);
}

console.log(`📡 Soumission de ${urlList.length} URLs à IndexNow…`);

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

if (res.status === 200 || res.status === 202) {
  console.log(`✅ IndexNow — ${urlList.length} URLs soumises (HTTP ${res.status})`);
  urlList.forEach(u => console.log(`   • ${u}`));
} else {
  const text = await res.text();
  console.error(`❌ IndexNow erreur ${res.status}: ${text}`);
  process.exit(1);
}
