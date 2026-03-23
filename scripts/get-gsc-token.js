/**
 * get-gsc-token.js — Obtenir le refresh token Google Search Console
 * Usage : node scripts/get-gsc-token.js
 * À exécuter une seule fois en local.
 */

import { readFileSync, writeFileSync } from 'fs';
import { createServer } from 'http';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const credentials = JSON.parse(readFileSync(resolve(__dirname, '../gsc-credentials.json'), 'utf-8'));
const { client_id, client_secret, redirect_uris } = credentials.installed;

const REDIRECT_URI  = 'http://localhost:3456';
const SCOPES        = 'https://www.googleapis.com/auth/webmasters.readonly';
const AUTH_URL      = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`;

console.log('\n🔐 Ouverture du navigateur pour autoriser l\'accès Google Search Console...\n');

// Ouvrir le navigateur
const opener = process.platform === 'win32' ? 'start' : 'open';
exec(`${opener} "${AUTH_URL}"`);

// Serveur local pour recevoir le code OAuth
const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get('code');

  if (!code) {
    res.end('Erreur : pas de code reçu.');
    return;
  }

  res.end('<h1>✅ Autorisé ! Vous pouvez fermer cet onglet.</h1>');
  server.close();

  // Échanger le code contre les tokens
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

  // Sauvegarder les tokens
  writeFileSync(resolve(__dirname, '../gsc-token.json'), JSON.stringify(tokens, null, 2));

  console.log('\n✅ Tokens obtenus avec succès !\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Ajoute ces 3 secrets dans GitHub Actions :');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`GSC_CLIENT_ID      = ${client_id}`);
  console.log(`GSC_CLIENT_SECRET  = ${client_secret}`);
  console.log(`GSC_REFRESH_TOKEN  = ${tokens.refresh_token}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

server.listen(3456, () => {
  console.log('⏳ En attente du callback OAuth sur http://localhost:3456...\n');
});
