/**
 * photo-add.js
 * Import interactif d'une seule photo — conversion WebP, EXIF, Supabase, visible=true direct
 * Usage : npm run photo:add [chemin/vers/photo.jpg]
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { execSync, spawnSync } from 'node:child_process';
import { mkdir, rename, stat } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://bzlllfmpojcybuyuemdx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bGxsZm1wb2pjeWJ1eXVlbWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzQ1NjQsImV4cCI6MjA4NjYxMDU2NH0.A1nGk9fsNgukxo4WggzFF-lgOFHDaCJS0phbeldx6xY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXIFTOOL_PATH = 'C:\\Users\\ksaari\\AppData\\Local\\Programs\\ExifTool\\ExifTool.exe';
const EXIF_CREATOR   = 'Karim Saari';
const EXIF_COPYRIGHT = '(c) Karim Saari - Dark Massilia - karimsaari.com';

const QUALITY       = 85;
const THUMB_WIDTH   = 800;
const THUMB_QUALITY = 82;

const ROOT     = process.cwd();
const DONE_DIR = join(ROOT, 'public/images/portfolio/New/done');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp']);

// ── Catégories (même mapping que import-photos.js) ──────────────────────────
const CATEGORIES = [
  {
    label: 'Photos sous-marine — Dépollution',
    table: 'photos_sous_marine',
    categorie: 'depollution',
    destDir: join(ROOT, 'public/images'),
    uidPrefix: 'sentinelle',
    srcPrefix: '/images',
  },
  {
    label: 'Photos sous-marine — Biodiversité',
    table: 'photos_sous_marine',
    categorie: 'biodiversite',
    destDir: join(ROOT, 'public/images'),
    uidPrefix: 'bio',
    srcPrefix: '/images',
  },
  {
    label: 'Photos sous-marine — Caractérisation',
    table: 'photos_sous_marine',
    categorie: 'caracterisation',
    destDir: join(ROOT, 'public/images'),
    uidPrefix: 'carac',
    srcPrefix: '/images',
  },
  {
    label: 'Photos paysage — Mer',
    table: 'photos_paysage',
    categorie: 'mer',
    destDir: join(ROOT, 'public/images/portfolio/Mer'),
    uidPrefix: 'mer',
    srcPrefix: '/images/portfolio/Mer',
  },
  {
    label: 'Photos paysage — Horizons',
    table: 'photos_paysage',
    categorie: 'horizons',
    destDir: join(ROOT, 'public/images/portfolio/Horizons'),
    uidPrefix: 'mer',
    srcPrefix: '/images/portfolio/Horizons',
  },
  {
    label: 'Photos paysage — Terre',
    table: 'photos_paysage',
    categorie: 'terre',
    destDir: join(ROOT, 'public/images/portfolio/Terre'),
    uidPrefix: 'terre',
    srcPrefix: '/images/portfolio/Terre',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Nettoie un chemin drag-and-drop Windows (guillemets, backslashes) */
function normalizePath(raw) {
  return raw.trim().replace(/^["']|["']$/g, '').replace(/\\/g, '/');
}

/** Slugifie un nom → SEO-friendly */
function slugify(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/-{2,}/g, '-');
}

/** Récupère le prochain numéro UID pour un préfixe */
async function getNextUid(table, prefix) {
  const { data } = await supabase
    .from(table)
    .select('uid')
    .like('uid', `${prefix}-%`)
    .order('uid', { ascending: false })
    .limit(100);

  let maxNum = -1;
  (data || []).forEach(row => {
    const match = row.uid.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (match) maxNum = Math.max(maxNum, parseInt(match[1], 10));
  });
  return maxNum + 1;
}

/** Injection EXIF auteur + copyright */
function injectExif(filePath) {
  try {
    const args = [
      `-XMP-dc:Creator=${EXIF_CREATOR}`,
      `-IPTC:By-line=${EXIF_CREATOR}`,
      `-XMP:Rights=${EXIF_COPYRIGHT}`,
      `-EXIF:Artist=${EXIF_CREATOR}`,
      `-EXIF:Copyright=${EXIF_COPYRIGHT}`,
      '-overwrite_original',
      filePath,
    ].map(a => `"${a}"`).join(' ');
    execSync(`"${EXIFTOOL_PATH}" ${args}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/** Génère un thumbnail 800w */
async function generateThumb(srcPath, destDir, webpName) {
  const thumbDir = join(destDir, '800w');
  if (!existsSync(thumbDir)) await mkdir(thumbDir, { recursive: true });
  const thumbPath = join(thumbDir, webpName);
  const meta = await sharp(srcPath).metadata();
  await sharp(srcPath)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMB_QUALITY })
    .toFile(thumbPath);
  const thumbKB = Math.round(statSync(thumbPath).size / 1024);
  return { thumbKB, wasResized: (meta.width || 0) > THUMB_WIDTH };
}

/** Prompt avec valeur par défaut affichée */
async function ask(rl, question, defaultValue = '') {
  const hint = defaultValue ? ` [${defaultValue}]` : '';
  const answer = await rl.question(`  ${question}${hint} : `);
  return answer.trim() || defaultValue;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n📸  Ajout d\'une photo — Dark Massilia\n');

  const rl = readline.createInterface({ input, output });

  // ── 1. Chemin du fichier ──────────────────────────────────────────────────
  let rawPath = process.argv[2] || '';
  if (!rawPath) {
    rawPath = await rl.question('  Glisse/colle le chemin de l\'image : ');
  }
  const filePath = normalizePath(rawPath);

  if (!existsSync(filePath)) {
    console.error(`\n❌ Fichier introuvable : ${filePath}\n`);
    rl.close();
    process.exit(1);
  }

  const ext = extname(filePath).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) {
    console.error(`\n❌ Extension non supportée : ${ext}\n`);
    rl.close();
    process.exit(1);
  }

  // ── 2. Choix de la catégorie ──────────────────────────────────────────────
  console.log('\n  Catégories :');
  CATEGORIES.forEach((c, i) => console.log(`    ${i + 1}. ${c.label}`));

  let catChoice = '';
  let cat;
  while (!cat) {
    catChoice = await rl.question('\n  Numéro de catégorie (1-6) : ');
    const idx = parseInt(catChoice, 10) - 1;
    if (idx >= 0 && idx < CATEGORIES.length) {
      cat = CATEGORIES[idx];
    } else {
      console.log('  ⚠️  Choix invalide, entre 1 et 6.');
    }
  }
  console.log(`  ✔  ${cat.label}\n`);

  // ── 3. Nom SEO du fichier (WebP) ──────────────────────────────────────────
  const originalName = basename(filePath, ext);
  const suggestedSlug = slugify(originalName);

  console.log(`  Nom de fichier WebP — suggestion auto : ${suggestedSlug}.webp`);
  const seoInput = await rl.question('  Nom SEO (Entrée = garder la suggestion) : ');
  const seoSlug  = seoInput.trim() ? slugify(seoInput.trim()) : suggestedSlug;
  const webpName = `${seoSlug}.webp`;

  // Vérifier si le fichier existe déjà
  const destPath = join(cat.destDir, webpName);
  if (existsSync(destPath)) {
    console.error(`\n❌ ${webpName} existe déjà dans ${cat.destDir}\n   Choisis un autre nom SEO.\n`);
    rl.close();
    process.exit(1);
  }

  // ── 4. Métadonnées ────────────────────────────────────────────────────────
  console.log('\n  Métadonnées SEO :');
  const defaultTitle = seoSlug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());

  const title = await ask(rl, 'Titre',           defaultTitle);
  const alt   = await ask(rl, 'Texte alt (SEO)', title);
  const lieu  = await ask(rl, 'Lieu (ex: Calanques de Marseille)', '');
  const gpsRaw = await ask(rl, 'GPS  ex: 43.1778, 5.3700  (vide si inconnu)', '');

  let lat = null;
  let lng = null;
  if (gpsRaw.trim()) {
    // Accepte "lat, lng" ou "lat lng" ou "lat;lng"
    const parts = gpsRaw.trim().split(/[\s,;]+/).map(s => s.replace(',', '.'));
    if (parts.length >= 2) {
      lat = parseFloat(parts[0]);
      lng = parseFloat(parts[1]);
    } else {
      lat = parseFloat(parts[0].replace(',', '.'));
    }
    if (isNaN(lat)) lat = null;
    if (isNaN(lng)) lng = null;
  }

  rl.close();

  // ── 5. Conversion WebP ────────────────────────────────────────────────────
  console.log('\n  ⚙️  Conversion WebP...');
  if (!existsSync(cat.destDir)) await mkdir(cat.destDir, { recursive: true });

  let info;
  if (ext === '.webp') {
    const { copyFile } = await import('node:fs/promises');
    await copyFile(filePath, destPath);
    info = await sharp(destPath).metadata();
    info.size = statSync(destPath).size;
  } else {
    info = await sharp(filePath).webp({ quality: QUALITY }).toFile(destPath);
  }
  const sizeKB = Math.round((info.size || statSync(destPath).size) / 1024);
  console.log(`  ✅ WebP : ${info.width}×${info.height} px — ${sizeKB} KB`);

  // ── 6. Thumbnail 800w ─────────────────────────────────────────────────────
  console.log('  ⚙️  Génération thumbnail 800w...');
  const { thumbKB, wasResized } = await generateThumb(destPath, cat.destDir, webpName);
  console.log(`  ✅ 800w : ${thumbKB} KB${wasResized ? '' : ' (image ≤800px, pas de resize)'}`);

  // ── 7. Injection EXIF auteur/copyright ───────────────────────────────────
  console.log('  ⚙️  Injection EXIF...');
  const exifOk = injectExif(destPath);
  console.log(exifOk ? '  ✅ EXIF auteur + copyright injectés' : '  ⚠️  EXIF non injecté (exiftool introuvable ?)');

  // ── 8. Supabase — insert visible=true ────────────────────────────────────
  console.log('  ⚙️  Insertion Supabase...');
  const nextNum = await getNextUid(cat.table, cat.uidPrefix);
  const uid     = `${cat.uidPrefix}-${nextNum}`;
  const dbSrc   = `${cat.srcPrefix}/${webpName}`;

  const record = {
    uid,
    src: dbSrc,
    title,
    alt,
    lieu: lieu || null,
    visible: false,
    categorie: cat.categorie,
    ...(lat !== null ? { lat } : {}),
    ...(lng !== null ? { lng } : {}),
  };

  const { error } = await supabase.from(cat.table).insert(record);
  if (error) {
    console.error(`\n❌ Erreur Supabase : ${error.message}\n`);
    process.exit(1);
  }
  console.log(`  ✅ Supabase : ${uid} — visible=true`);

  // ── 9. exif:inject:new (EXIF détaillés depuis Supabase) ──────────────────
  console.log('  ⚙️  Lancement exif:inject:new...');
  const exifResult = spawnSync(
    'node', ['scripts/inject-exif.js', '--new-only'],
    { cwd: ROOT, stdio: 'inherit', shell: true }
  );
  if (exifResult.status !== 0) {
    console.log('  ⚠️  exif:inject:new terminé avec une erreur (non bloquant)');
  }

  // ── 10. Archive l'original dans done/ ────────────────────────────────────
  console.log('  ⚙️  Archivage de l\'original...');
  if (!existsSync(DONE_DIR)) await mkdir(DONE_DIR, { recursive: true });
  const donePath = join(DONE_DIR, basename(filePath));
  try {
    await rename(filePath, donePath);
    console.log(`  ✅ Original archivé → New/done/${basename(filePath)}`);
  } catch {
    console.log(`  ⚠️  Impossible de déplacer l'original (fichier en cours d'utilisation ?)`);
  }

  // ── Récap ─────────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(58));
  console.log('🎉  Photo ajoutée avec succès !\n');
  console.log(`   UID      : ${uid}`);
  console.log(`   Fichier  : ${dbSrc}`);
  console.log(`   Table    : ${cat.table} / ${cat.categorie}`);
  console.log(`   Visible  : ⏸  masquée (visible=false)`);
  console.log('─'.repeat(58));
  console.log('\n📋  Prochaines étapes :');
  console.log(`   1. FTP  public/images/${webpName}`);
  console.log(`        +  public/images/800w/${webpName}`);
  console.log('   2. Supabase admin → mettre visible=true');
  console.log('   3. npm run build:full   puis FTP → dist/\n');
}

main().catch(err => { console.error('\n❌ Erreur fatale :', err); process.exit(1); });
