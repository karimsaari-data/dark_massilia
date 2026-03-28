/**
 * get-ga-token.js — Obtenir un refresh token avec accès GSC + GA4
 * Usage : node scripts/get-ga-token.js
 * À exécuter une seule fois en local pour régénérer le token avec le scope GA4.
 */

import { readFileSync, writeFileSync } from 'fs';
import { createServer } from 'http';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const credentials = JSON.parse(readFileSync(resolve(__dirname, '../gsc-credentials.json'), 'utf-8'));
const { client_id, client_secret } = credentials.installed;

const REDIRECT_URI = 'http://localhost:3456';

// ⚠️ Les deux scopes combinés : GSC + GA4
const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
].join(' ');

const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`;

console.log('\n🔐 Autorisation GSC + GA4 requise.\n');
console.log('👉 Ouvre cette URL dans ton navigateur :\n');
console.log(AUTH_URL);
console.log('\n');

const opener = process.platform === 'win32' ? 'start' : 'open';
exec(`${opener} "${AUTH_URL}"`);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3456');
  const code = url.searchParams.get('code');

  if (!code) {
    res.end('Erreur : pas de code reçu.');
    return;
  }

  res.end('<h1>✅ Autorisé ! Vous pouvez fermer cet onglet.</h1>');
  server.close();

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenRes.json();

  if (tokens.error) {
    console.error('❌ Erreur :', tokens.error_description);
    process.exit(1);
  }

  writeFileSync(resolve(__dirname, '../ga-token.json'), JSON.stringify(tokens, null, 2));

  console.log('\n✅ Nouveau token obtenu avec les scopes GSC + GA4 !\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  Mets à jour le secret GitHub Actions :');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`GSC_REFRESH_TOKEN  = ${tokens.refresh_token}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n(Remplace l\'ancien GSC_REFRESH_TOKEN dans GitHub → Settings → Secrets)\n');
});

server.listen(3456, () => {
  console.log('⏳ En attente du callback OAuth sur http://localhost:3456...\n');
});
