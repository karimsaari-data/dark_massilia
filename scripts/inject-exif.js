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

// ── Images médias/presse + profil + divers (racine /images, hors Marseille-dark-massilia-*) ─────
const KW_PRESSE = [
  'karim saari', 'dark massilia', 'marseille', 'calanques',
  'photographe sous-marin', 'dépollution marine', 'projet sentinelle',
];
const KW_ARTE = [
  'karim saari', 'dark massilia', 'marseille', 'arte',
  'documentaire', 'méditerranée', 'photographe sous-marin',
];
const KW_RUGULOPTERYX = [
  'marseille', 'calanques', 'marseilleveyre', 'rugulopteryx okamurae',
  'algue invasive', 'karim saari', 'dark massilia', 'biodiversité marine',
];
const KW_DIVERS = [
  'karim saari', 'dark massilia', 'marseille', 'calanques',
  'photographe sous-marin', 'méditerranée', 'méditerranée',
];

const MISC_FILES = [
  // Presse / médias
  { file: 'karim-saari-interview-presse-tiredearth-photographe-sous-marin.webp', title: 'Interview Tired Earth — Karim Saari photographe sous-marin', description: 'Interview presse Tired Earth — Karim Saari apnéiste et photographe sous-marin Marseille (Dark Massilia)', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-marcelle-media-depollution-mer-apnee.webp', title: 'Marcelle Média — Dépolluer la mer en apnée', description: 'Reportage Marcelle Média sur la dépollution marine en apnée par Karim Saari — Projet Sentinelle Marseille', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-france-bleu-rorqual-cotes-marseille.webp', title: 'France Bleu — Rorqual au large de Marseille', description: 'France Bleu Provence — Rorqual rarissime aperçu près des côtes de Marseille, témoignage Karim Saari (Dark Massilia)', keywords: [...KW_PRESSE, 'rorqual', 'grand cétacé'] },
  { file: 'karim-saari-marseille-actu-depollution-fonds-marins.webp', title: 'Actu.fr — Dépollution fonds marins Marseille', description: 'Reportage Actu.fr sur la dépollution des fonds marins de Marseille par Karim Saari et Team Oxygen — Calanques', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-fondation-mer-projet-sentinelle-calanques.webp', title: 'Fondation de la Mer — Projet Sentinelle Calanques', description: 'La Fondation de la Mer soutient le Projet Sentinelle de dépollution sous-marine dans les Calanques de Marseille', keywords: [...KW_PRESSE, 'fondation de la mer'] },
  { file: 'karim-saari-marseille-la-provence-operation-sentinelle-apnee.webp', title: 'La Provence — Opération Sentinelle Marseille', description: 'La Provence couvre l\'Opération Sentinelle de dépollution en apnée dans les Calanques de Marseille — Karim Saari', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-france-bleu-goudes-dechets-apneistes.webp', title: 'France Bleu — 328 kg déchets aux Goudes', description: 'France Bleu Provence — 328 kg de déchets récoltés aux Goudes par les apnéistes de Team Oxygen Marseille', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-ville-reconnaissance-officielle-dark-massilia.webp', title: 'Ville de Marseille — Reconnaissance officielle Dark Massilia', description: 'La Ville de Marseille reconnaît officiellement l\'engagement de Dark Massilia pour la dépollution marine des Calanques', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-made-in-marseille-provence-tourisme.webp', title: 'Made in Marseille — Provence tourisme France', description: 'Made in Marseille — Provence classée top destination touristique France, Calanques et Méditerranée', keywords: [...KW_PRESSE, 'tourisme marseille', 'provence'] },
  { file: 'karim-saari-marseille-echappees-belles-reportage-television.webp', title: 'Échappées Belles — Karim Saari France Télévisions', description: 'Reportage Échappées Belles avec Karim Saari (Dark Massilia) au Vallon des Auffes — Marseille, France Télévisions', keywords: [...KW_PRESSE, 'échappées belles', 'france télévisions', 'vallon des auffes'] },
  // ARTE
  { file: 'karim-saari-arte-regard-documentaire-calanques-marseille.webp', title: 'ARTE Regards — Karim Saari Calanques Marseille', description: 'Documentaire ARTE Regards — Karim Saari et Team Oxygen contre la pollution plastique dans les Calanques de Marseille', keywords: KW_ARTE },
  { file: 'karim-saari-photo-profil-arte-regard-marseille.webp', title: 'Portrait Karim Saari — Documentaire ARTE', description: 'Portrait de Karim Saari photographe sous-marin pour le documentaire ARTE Regards — Marseille, Dark Massilia', keywords: KW_ARTE },
  { file: 'karim-saari-photo-profil-arte-regard-marseille_300w.webp', title: 'Portrait Karim Saari — ARTE (300w)', description: 'Portrait de Karim Saari photographe sous-marin pour le documentaire ARTE Regards — Marseille, Dark Massilia', keywords: KW_ARTE },
  // Méduses ARTE
  { file: 'arte-meduses-souveraines-oceans-documentaire-marseille-2.webp', title: 'Méduses — Les souveraines des océans (ARTE) 2', description: 'Documentaire ARTE — Méduses les souveraines des océans, contribution Karim Saari Dark Massilia Marseille', keywords: [...KW_ARTE, 'méduses', 'faune marine'] },
  { file: 'arte-meduses-souveraines-oceans-documentaire-marseille-3.webp', title: 'Méduses — Les souveraines des océans (ARTE) 3', description: 'Documentaire ARTE — Méduses les souveraines des océans, apnée et photographie sous-marine Méditerranée', keywords: [...KW_ARTE, 'méduses', 'faune marine'] },
  { file: 'arte-meduses-souveraines-oceans-documentaire-marseille-4.webp', title: 'Méduses — Les souveraines des océans (ARTE) 4', description: 'Documentaire ARTE — Méduses les souveraines des océans, Méditerranée et Calanques de Marseille', keywords: [...KW_ARTE, 'méduses', 'faune marine'] },
  { file: 'arte-meduses-souveraines-oceans-documentaire-marseille-5.webp', title: 'Méduses — Les souveraines des océans (ARTE) 5', description: 'Documentaire ARTE — Méduses les souveraines des océans, photographe sous-marin Karim Saari', keywords: [...KW_ARTE, 'méduses', 'faune marine'] },
  // Ruguloptérix / Marseilleveyre
  { file: 'marseille-marseilleveyre-avant-rugulopteryx-fonds-marins.webp', title: 'Marseilleveyre avant Rugulopteryx okamurae', description: 'Fonds marins de Marseilleveyre avant l\'invasion de Rugulopteryx okamurae — Calanques de Marseille', keywords: KW_RUGULOPTERYX },
  { file: 'marseille-marseilleveyre-avant-rugulopteryx-biodiversite-2.webp', title: 'Marseilleveyre — biodiversité avant algue invasive', description: 'Biodiversité marine de Marseilleveyre avant l\'invasion de Rugulopteryx okamurae — fonds rocheux naturels', keywords: KW_RUGULOPTERYX },
  { file: 'marseille-marseilleveyre-apres-rugulopteryx-algue-invasive.webp', title: 'Marseilleveyre après Rugulopteryx okamurae', description: 'Fonds marins de Marseilleveyre après l\'invasion de Rugulopteryx okamurae — algue invasive recouvrant tout', keywords: [...KW_RUGULOPTERYX, 'espèce invasive', 'alerte environnementale'] },
  { file: 'marseille-marseilleveyre-apres-rugulopteryx-tapis-algues-2.webp', title: 'Marseilleveyre — tapis algues invasives Rugulopteryx', description: 'Tapis d\'algues invasives Rugulopteryx okamurae sur les fonds de Marseilleveyre — Calanques de Marseille', keywords: [...KW_RUGULOPTERYX, 'espèce invasive', 'alerte environnementale'] },
  // Profil / portrait
  { file: 'karim-saari-photographe-sous-marin-marseille-dark-massilia.webp', title: 'Karim Saari — Photographe sous-marin Marseille', description: 'Portrait de Karim Saari, photographe sous-marin et activiste environnemental à Marseille — Dark Massilia', keywords: KW_DIVERS },
  { file: 'karim-saari-photographe-sous-marin-marseille-dark-massilia_480w.webp', title: 'Karim Saari — Photographe sous-marin Marseille (480w)', description: 'Portrait de Karim Saari, photographe sous-marin et activiste environnemental à Marseille — Dark Massilia', keywords: KW_DIVERS },
  // Célébration 9 ans
  { file: 'karim-saari-marseille-dark-massilia-9ans-celebration-projet-sentinelle.webp', title: '9 ans de Dark Massilia — Projet Sentinelle Marseille', description: '9 années d\'engagement de Dark Massilia pour la dépollution marine et la sensibilisation environnementale à Marseille', keywords: KW_DIVERS },
  // Orphans indexables
  { file: 'karim-saari-marseille-130000-sentinelles-calanques-depollution.webp', title: '130 000 Sentinelles — Marseille Calanques', description: 'Mobilisation de 130 000 citoyens sentinelles pour la protection des Calanques de Marseille — Dark Massilia', keywords: KW_MISSIONS },
  { file: 'karim-saari-marseille-echappees-belles-reportage-television.webp', title: 'Échappées Belles — Karim Saari Marseille', description: 'Reportage Échappées Belles avec Karim Saari (Dark Massilia) au Vallon des Auffes — Marseille', keywords: KW_PRESSE },
];

console.log('\n📁 Images médias / presse / divers');
let okMisc = 0, errMisc = 0;
for (const { file, title, description, keywords } of MISC_FILES) {
  const filePath = path.join(MISSIONS, file);
  if (!existsSync(filePath)) { console.log(`  ⚠  Introuvable : ${file}`); continue; }
  try {
    runExiftool(filePath, title, description, keywords);
    console.log(`  ✓  ${file}`);
    okMisc++;
  } catch (e) {
    console.log(`  ✗  ${file} → ${e.message}`);
    errMisc++;
  }
}
console.log(`  → ${okMisc} OK, ${errMisc} erreurs`);

console.log('\n✅  Terminé — relance npm run build:full + FTP');
