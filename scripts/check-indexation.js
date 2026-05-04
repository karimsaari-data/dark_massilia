/**
 * check-indexation.js — Vérifie l'état d'indexation de chaque URL du sitemap
 * via l'URL Inspection API de Google Search Console.
 *
 * Usage : node scripts/check-indexation.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ── Credentials ───────────────────────────────────────────────────────────────
const creds     = JSON.parse(readFileSync(resolve(root, 'gsc-credentials.json'), 'utf-8'));
const tokenData = JSON.parse(readFileSync(resolve(root, 'gsc-token.json'), 'utf-8'));

const CLIENT_ID     = creds.installed.client_id;
const CLIENT_SECRET = creds.installed.client_secret;
const REFRESH_TOKEN = tokenData.refresh_token;
const SITE_URL      = 'https://karimsaari.com/';

// ── Refresh access token ───────────────────────────────────────────────────────
async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

// ── URL Inspection API ─────────────────────────────────────────────────────────
async function inspectUrl(token, url) {
  const res = await fetch(
    'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl: SITE_URL,
      }),
    }
  );
  return res.json();
}

// ── Lire les URLs du sitemap ───────────────────────────────────────────────────
const sitemap  = readFileSync(resolve(root, 'public/sitemap.xml'), 'utf-8');
const urlList  = [...sitemap.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)]
  .map(m => m[1].trim())
  .filter(u => u.startsWith('https://karimsaari.com'));

console.log(`\n🔍 Vérification de ${urlList.length} URLs via URL Inspection API GSC\n`);

const token = await getAccessToken();

const results = { indexed: [], notIndexed: [], error: [] };

for (const url of urlList) {
  try {
    const data = await inspectUrl(token, url);
    const verdict = data?.inspectionResult?.indexStatusResult?.coverageState ?? 'UNKNOWN';
    const robotsTxt = data?.inspectionResult?.indexStatusResult?.robotsTxtState ?? '';
    const indexing  = data?.inspectionResult?.indexStatusResult?.indexingState ?? '';

    const slug = url.replace('https://karimsaari.com', '') || '/';

    if (verdict === 'Submitted and indexed' || verdict === 'Indexed, not submitted in sitemap') {
      results.indexed.push({ url: slug, verdict });
      console.log(`  ✅ ${slug}`);
    } else {
      results.notIndexed.push({ url: slug, verdict, robotsTxt, indexing });
      console.log(`  ❌ ${slug} → ${verdict}`);
    }

    // Pause pour éviter le rate limit (600 req/min max)
    await new Promise(r => setTimeout(r, 200));
  } catch (err) {
    results.error.push({ url, error: err.message });
    console.log(`  ⚠️  ${url} → erreur: ${err.message}`);
  }
}

console.log(`\n📊 Résultat :`);
console.log(`  ✅ Indexées     : ${results.indexed.length}`);
console.log(`  ❌ Non indexées : ${results.notIndexed.length}`);
console.log(`  ⚠️  Erreurs      : ${results.error.length}`);

if (results.notIndexed.length > 0) {
  console.log(`\n🚨 URLs non indexées :`);
  results.notIndexed.forEach(r => {
    console.log(`  • ${r.url}`);
    console.log(`    Statut    : ${r.verdict}`);
    if (r.robotsTxt) console.log(`    robots.txt: ${r.robotsTxt}`);
    if (r.indexing)  console.log(`    Indexing  : ${r.indexing}`);
  });
}

// Sauvegarde JSON
const outputPath = resolve(root, 'scripts/indexation-report.json');
writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`\n💾 Rapport sauvegardé : scripts/indexation-report.json\n`);
