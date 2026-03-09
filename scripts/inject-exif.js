#!/usr/bin/env node
/**
 * inject-exif.js — Injection XMP via ExifTool (sans ré-encodage)
 * Usage: node scripts/inject-exif.js
 * Prérequis: dossier exiftool/ à la racine du projet
 */

import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const path = { join };

// ── Config ───────────────────────────────────────────────────────────────────
const ROOT       = path.join(__dirname, '..');
const EXIFTOOL   = path.join(ROOT, 'exiftool', 'exiftool(-k).exe');
const PORTFOLIO  = path.join(ROOT, 'public', 'images', 'portfolio', 'Mer');
const TERRE      = path.join(ROOT, 'public', 'images', 'portfolio', 'Terre');
const MISSIONS   = path.join(ROOT, 'public', 'images');

const CREATOR    = 'Karim Saari';
const COPYRIGHT  = '© Karim Saari — Dark Massilia — Photographe sous-marin Marseille';

const KW_PORTFOLIO = [
  'photographe sous-marin', 'marseille', 'calanques', 'apnée',
  'méditerranée', 'dark massilia', 'karim saari',
  'photographie sous-marine', 'calanques de marseille',
];
const KW_MISSIONS = [
  'photographe sous-marin', 'marseille', 'calanques', 'apnée',
  'méditerranée', 'dark massilia', 'karim saari',
  'dépollution marine', 'pollution plastique', 'projet sentinelle',
];
const KW_TERRE = [
  'photographe paysage', 'provence', 'lavande', 'valensole',
  'karim saari', 'dark massilia', 'champs de lavande',
  'photographie de paysage', 'méditerranée',
];

const UNDERWATER_HINTS = [
  'fonds-marins', 'nage', 'grotte', 'poulpe', 'spirographe',
  'musée', 'museum', 'diving', 'apneiste', 'shooting', 'soupe',
  'poseidon', 'angel', 'octopus', 'paysage-sous-marin',
  'teamoxygen-freediving', 'mer-de-plastique', 'moyades',
  'mer-goudes', 'freediving', 'sous-marin', 'subaquatique', 'frioul',
];
const MAROC_HINTS    = ['maroc', 'chefchaouen', 'medina', 'cigognes'];
const LAVANDE_HINTS  = ['lavande', 'valensole', 'coquelicots', 'tulipes', 'tournesols'];

const SRCSET_SUFFIXES = ['_400w', '_800w', '_1200w'];

// ── Helpers ──────────────────────────────────────────────────────────────────
function isSrcset(filename) {
  return SRCSET_SUFFIXES.some(s => filename.includes(s));
}

function metaFromFilename(filename, baseKeywords, descriptionPrefix) {
  const name = filename.toLowerCase();
  let label  = filename.replace('.webp', '');

  for (const prefix of [
    'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-',
    'photographe-sous-marin-marseille-',
    'karim-saari-marseille-',
  ]) {
    if (label.startsWith(prefix)) { label = label.slice(prefix.length); break; }
  }
  label = label.replace(/-/g, ' ').replace(/_/g, ' ').trim();
  label = label.charAt(0).toUpperCase() + label.slice(1);
  label = label.slice(0, 80);

  const isUnderwater = UNDERWATER_HINTS.some(kw => name.includes(kw));
  const isMaroc      = MAROC_HINTS.some(kw => name.includes(kw));
  const isLavande    = LAVANDE_HINTS.some(kw => name.includes(kw));
  let description, keywords;

  if (isUnderwater) {
    description = `Photographie sous-marine — ${label}. Dépollution sous-marine en apnée, Calanques de Marseille — Projet Sentinelle par Karim Saari (Dark Massilia)`;
    keywords    = [...baseKeywords, 'dépollution sous-marine', 'freediving calanques'];
  } else if (isMaroc) {
    description = `${descriptionPrefix}${label}. Photographie de voyage au Maroc — Karim Saari (Dark Massilia)`;
    keywords    = [...baseKeywords, 'photographie voyage', 'maroc', 'chefchaouen'];
  } else if (isLavande) {
    description = `${descriptionPrefix}${label}. Champs de lavande de Valensole et Provence — Karim Saari (Dark Massilia)`;
    keywords    = [...baseKeywords, 'champs de lavande', 'valensole provence', 'photographie nature'];
  } else {
    description = `${descriptionPrefix}${label}. Marseille et Calanques — Karim Saari (Dark Massilia)`;
    keywords    = [...baseKeywords, 'calanques de marseille', 'littoral méditerranéen'];
  }

  return { title: label, description, keywords };
}

function runExiftool(filePath, title, description, keywords) {
  const args = [
    `-XMP:Title=${title}`,
    `-XMP:Description=${description}`,
    `-XMP:Creator=${CREATOR}`,
    `-XMP:Rights=${COPYRIGHT}`,
    ...keywords.map(kw => `-XMP:Subject+=${kw}`),
    '-overwrite_original',
    filePath,
  ].map(a => `"${a}"`).join(' ');

  // echo "" simule le ENTER requis par la version -k
  execSync(`echo "" | "${EXIFTOOL}" ${args}`, { stdio: 'pipe' });
}

function processDir(dirPath, files, baseKeywords, descPrefix) {
  console.log(`\n📁 ${dirPath}  (${files.length} fichiers)`);
  let ok = 0, err = 0;
  for (const f of files) {
    const { title, description, keywords } = metaFromFilename(f, baseKeywords, descPrefix);
    const filePath = path.join(dirPath, f);
    try {
      runExiftool(filePath, title, description, keywords);
      console.log(`  ✓  ${f}`);
      ok++;
    } catch (e) {
      console.log(`  ✗  ${f} → ${e.message}`);
      err++;
    }
  }
  console.log(`  → ${ok} OK, ${err} erreurs`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
if (!existsSync(EXIFTOOL)) {
  console.error(`❌  ExifTool introuvable : ${EXIFTOOL}`);
  process.exit(1);
}

console.log('🔧  Injection XMP via ExifTool…\n');

// Galerie portfolio (Mer/)
if (existsSync(PORTFOLIO)) {
  const files = readdirSync(PORTFOLIO)
    .filter(f => f.endsWith('.webp') && !isSrcset(f))
    .sort();
  processDir(PORTFOLIO, files, KW_PORTFOLIO, 'Photographie Calanques de Marseille — ');
} else {
  console.log(`⚠  Dossier introuvable : ${PORTFOLIO}`);
}

// Galerie paysages (Terre/)
if (existsSync(TERRE)) {
  const files = readdirSync(TERRE)
    .filter(f => f.endsWith('.webp') && !isSrcset(f))
    .sort();
  processDir(TERRE, files, KW_TERRE, 'Photographie paysage — ');
} else {
  console.log(`⚠  Dossier introuvable : ${TERRE}`);
}

// Images missions (Marseille-dark-massilia-*.webp à la racine /images)
if (existsSync(MISSIONS)) {
  const files = readdirSync(MISSIONS)
    .filter(f => f.startsWith('Marseille-dark-massilia-') && f.endsWith('.webp') && !isSrcset(f))
    .sort();
  processDir(MISSIONS, files, KW_MISSIONS, 'Mission dépollution — ');
} else {
  console.log(`⚠  Dossier introuvable : ${MISSIONS}`);
}

console.log('\n✅  Terminé — relance npm run build:full + FTP');
