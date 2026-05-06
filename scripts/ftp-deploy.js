/**
 * ftp-deploy.js — Déploiement FTP via WinSCP
 * Synchronise dist/ vers le serveur de prod (Easy Hébergement)
 *
 * Usage :
 *   npm run ftp:deploy       → upload seul
 *   npm run build:deploy     → build:full + upload
 *
 * Variables requises dans .env :
 *   FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE
 */

import { spawnSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { tmpdir } from 'os';
import { join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ── Lecture du .env ────────────────────────────────────────────────────────
const env = {};
try {
  const content = readFileSync(resolve(root, '.env'), 'utf-8');
  for (const line of content.split('\n')) {
    const m = line.match(/^([^#=][^=]*)=(.*)/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
} catch { /* .env absent → on utilisera process.env */ }

const host   = env.FTP_HOST   || process.env.FTP_HOST;
const user   = env.FTP_USER   || process.env.FTP_USER;
const pass   = env.FTP_PASS   || process.env.FTP_PASS;
const remote = env.FTP_REMOTE || process.env.FTP_REMOTE || '/home';
const local  = resolve(root, 'dist');
const deleteRemote = process.argv.includes('--delete');

// ── WinSCP path ────────────────────────────────────────────────────────────
const WINSCP = 'C:\\Program Files (x86)\\WinSCP\\WinSCP.com';

// ── Validation ─────────────────────────────────────────────────────────────
if (!host || !user || !pass) {
  console.error('❌  FTP credentials manquants dans .env (FTP_HOST, FTP_USER, FTP_PASS)');
  process.exit(1);
}

// ── Script WinSCP (fichier temp) ───────────────────────────────────────────
// Deux passes :
//   1. Code (JS/CSS/HTML/JSON/XML…) avec criteria=either : détecte les changements
//      de contenu même quand la taille ne change pas (ex. hash Vite remplacé).
//   2. Images avec criteria=size : évite de re-uploader les images inchangées
//      (Vite leur donne de nouveaux timestamps à chaque build, mais pas de nouvelle taille).
const scriptContent = [
  `open ftp://${user}:${pass}@${host}/`,
  // Passe 1 — tout sauf images/ et le dossier portfolio/New (lourd, rarement modifié)
  `synchronize remote -criteria=either${deleteRemote ? ' -delete' : ''} -filemask="| images/" "${local}" ${remote}`,
  // Passe 2 — images uniquement, critère taille
  `synchronize remote -criteria=size${deleteRemote ? ' -delete' : ''} "${local}\\images" ${remote}/images`,
  'exit',
].join('\r\n');

const tmpScript = join(tmpdir(), 'winscp-deploy.txt');
writeFileSync(tmpScript, scriptContent, 'utf-8');

// ── Déploiement ────────────────────────────────────────────────────────────
console.log(`\n🚀  Déploiement FTP`);
console.log(`    Local  : ${local}`);
console.log(`    Remote : ${host}${remote}\n`);

let exitCode = 0;
try {
  const result = spawnSync(WINSCP, [`/script=${tmpScript}`], { stdio: 'inherit' });
  exitCode = result.status ?? 1;
  if (exitCode === 0) {
    console.log('\n✅  Déploiement terminé avec succès');
  } else {
    console.error(`\n❌  WinSCP a retourné le code ${exitCode}`);
  }
} catch (err) {
  console.error(`\n❌  Impossible de lancer WinSCP : ${err.message}`);
  console.error(`    Chemin attendu : ${WINSCP}`);
  exitCode = 1;
} finally {
  try { unlinkSync(tmpScript); } catch { /* nettoyage silencieux */ }
}

process.exit(exitCode);
