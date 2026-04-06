#!/usr/bin/env node
/**
 * sync-new-images.js — Copie uniquement les nouvelles images de public/ vers dist/
 * Utilise le même cache .exif-cache.json (mtime) pour détecter les nouveaux fichiers.
 * Usage : node scripts/sync-new-images.js
 */

import { existsSync, readFileSync, statSync, copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, '..');
const PUBLIC_IMG = join(ROOT, 'public', 'images');
const DIST_IMG   = join(ROOT, 'dist',   'images');
const CACHE_FILE = join(ROOT, '.exif-cache.json');

if (!existsSync(join(ROOT, 'dist'))) {
  console.error('❌  Dossier dist/ introuvable — lance npm run build:full une première fois.');
  process.exit(1);
}

// Charge le cache (même que inject-exif.js)
function loadCache() {
  try { return JSON.parse(readFileSync(CACHE_FILE, 'utf-8')); } catch { return {}; }
}

// Récupère récursivement tous les fichiers image d'un dossier
function listImages(dir) {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(e => {
    const full = join(dir, e.name);
    if (e.isDirectory()) return listImages(full);
    if (/\.(webp|jpg|jpeg|png|gif|svg)$/i.test(e.name)) return [full];
    return [];
  });
}

const cache    = loadCache();
const allFiles = listImages(PUBLIC_IMG);

let copied = 0, skipped = 0;

for (const srcFile of allFiles) {
  const mtime   = statSync(srcFile).mtimeMs;
  const relPath = relative(join(ROOT, 'public'), srcFile);
  const dstFile = join(ROOT, 'dist', relPath);

  // Nouveau fichier ou modifié depuis le dernier build:full ?
  const dstExists = existsSync(dstFile);
  const dstMtime  = dstExists ? statSync(dstFile).mtimeMs : 0;

  if (dstExists && dstMtime >= mtime) {
    skipped++;
    continue;
  }

  // Crée le dossier destination si besoin, puis copie
  mkdirSync(dirname(dstFile), { recursive: true });
  copyFileSync(srcFile, dstFile);
  console.log(`  ✓  ${relPath}`);
  copied++;
}

console.log(`\n✅  ${copied} fichier(s) copié(s), ${skipped} inchangé(s).`);
if (copied > 0) {
  console.log('   → Upload FTP uniquement ces fichiers + dist/sitemap-images.xml');
}
