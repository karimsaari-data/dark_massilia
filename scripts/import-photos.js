/**
 * import-photos.js
 * Scanne les dossiers inbox, convertit JPG → WebP, insère dans Supabase
 * Usage : npm run photos:import
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { execSync } from 'node:child_process';
import { readdir, mkdir, rename, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { existsSync, statSync } from 'node:fs';

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://bzlllfmpojcybuyuemdx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bGxsZm1wb2pjeWJ1eXVlbWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzQ1NjQsImV4cCI6MjA4NjYxMDU2NH0.A1nGk9fsNgukxo4WggzFF-lgOFHDaCJS0phbeldx6xY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const QUALITY = 85;
const ROOT = process.cwd();
const NEW_DIR = join(ROOT, 'public/images/portfolio/New');
const DONE_DIR = join(NEW_DIR, 'done');

// Mapping : dossier inbox → { table, categorie, destDir, uidPrefix }
const FOLDERS = [
  {
    inbox: join(NEW_DIR, 'photos_paysages/Mer'),
    table: 'photos_paysage',
    categorie: 'mer',
    destDir: join(ROOT, 'public/images/portfolio/Mer'),
    uidPrefix: 'mer',
    srcPrefix: '/images/portfolio/Mer',
  },
  {
    inbox: join(NEW_DIR, 'photos_paysages/Terre'),
    table: 'photos_paysage',
    categorie: 'terre',
    destDir: join(ROOT, 'public/images/portfolio/Terre'),
    uidPrefix: 'terre',
    srcPrefix: '/images/portfolio/Terre',
  },
  {
    inbox: join(NEW_DIR, 'photos_sous_marine/Dépollution'),
    table: 'photos_sous_marine',
    categorie: 'depollution',
    destDir: join(ROOT, 'public/images'),
    uidPrefix: 'sentinelle',
    srcPrefix: '/images',
  },
  {
    inbox: join(NEW_DIR, 'photos_sous_marine/Biodiversité'),
    table: 'photos_sous_marine',
    categorie: 'biodiversite',
    destDir: join(ROOT, 'public/images'),
    uidPrefix: 'bio',
    srcPrefix: '/images',
  },
  {
    inbox: join(NEW_DIR, 'photos_sous_marine/Caractérisation'),
    table: 'photos_sous_marine',
    categorie: 'caracterisation',
    destDir: join(ROOT, 'public/images'),
    uidPrefix: 'carac',
    srcPrefix: '/images',
  },
  {
    inbox: join(NEW_DIR, 'photos_paysages/Horizons'),
    table: 'photos_paysage',
    categorie: 'horizons',
    destDir: join(ROOT, 'public/images/portfolio/Horizons'),
    uidPrefix: 'mer',
    srcPrefix: '/images/portfolio/Horizons',
  },
];

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp']);
const WEBP_EXTS  = new Set(['.webp']); // déjà convertis → copie directe sans re-conversion

// ── Thumbnail 800w ──────────────────────────────────────────────────────────
const THUMB_WIDTH = 800;
const THUMB_QUALITY = 82;

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
  return { thumbKB, wasResized: meta.width > THUMB_WIDTH };
}

// ── EXIF injection ───────────────────────────────────────────────────────────
const EXIF_CREATOR   = 'Karim Saari';
const EXIF_COPYRIGHT = '(c) Karim Saari - Dark Massilia - karimsaari.com';

// ExifTool — binaire local en priorité, sinon PATH système
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const EXIFTOOL_LOCAL = join(__dirname, 'exiftool', 'ExifTool.exe');
const EXIFTOOL_BIN   = existsSync(EXIFTOOL_LOCAL) ? EXIFTOOL_LOCAL : 'exiftool';

function injectExif(filePath) {
  try {
    const args = [
      `-XMP-dc:Creator=${EXIF_CREATOR}`,
      `-XMP-iptcCore:Creator=${EXIF_CREATOR}`,
      `-IPTC:By-line=${EXIF_CREATOR}`,
      `-XMP:Rights=${EXIF_COPYRIGHT}`,
      `-EXIF:Artist=${EXIF_CREATOR}`,
      `-EXIF:Copyright=${EXIF_COPYRIGHT}`,
      '-overwrite_original',
      filePath,
    ].map(a => `"${a}"`).join(' ');
    execSync(`"${EXIFTOOL_BIN}" ${args}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Slugifie un nom de fichier → SEO-friendly */
function slugify(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // supprime accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // caractères spéciaux → tiret
    .replace(/^-|-$/g, '')         // trim tirets
    .replace(/-{2,}/g, '-');       // double tirets
}

/** Récupère le prochain numéro UID pour un préfixe donné */
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

/** Liste les fichiers images dans un dossier */
async function listImages(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir);
  return entries.filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()));
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🖼️  Import de photos — Dark Massilia\n');

  // Créer le dossier done/ si besoin
  if (!existsSync(DONE_DIR)) await mkdir(DONE_DIR, { recursive: true });

  let totalImported = 0;

  for (const folder of FOLDERS) {
    const images = await listImages(folder.inbox);
    if (images.length === 0) continue;

    console.log(`📁 ${basename(folder.inbox)} → ${images.length} image(s) trouvée(s)`);

    // Créer le dossier de destination si besoin
    if (!existsSync(folder.destDir)) await mkdir(folder.destDir, { recursive: true });

    // Récupérer le prochain UID
    let nextNum = await getNextUid(folder.table, folder.uidPrefix);

    for (const file of images) {
      const srcPath = join(folder.inbox, file);
      const slug = slugify(basename(file, extname(file)));
      const webpName = `${slug}.webp`;
      const destPath = join(folder.destDir, webpName);

      // Vérifier si le fichier existe déjà
      if (existsSync(destPath)) {
        console.log(`  ⚠️  ${webpName} existe déjà → skip`);
        continue;
      }

      // Conversion WebP (ou copie directe si déjà en webp)
      let info;
      if (WEBP_EXTS.has(extname(file).toLowerCase())) {
        // Déjà en WebP → on relit juste les metadata + on copie via sharp pour normaliser
        const { copyFile } = await import('node:fs/promises');
        await copyFile(srcPath, destPath);
        info = await sharp(destPath).metadata();
        info.size = statSync(destPath).size;
      } else {
        info = await sharp(srcPath)
          .webp({ quality: QUALITY })
          .toFile(destPath);
      }

      // Injection EXIF auteur + copyright
      const exifOk = injectExif(destPath);
      if (!exifOk) console.log(`  ⚠️  EXIF non injecté sur ${webpName} (exiftool introuvable ?)`);

      // Thumbnail 800w
      const { thumbKB, wasResized } = await generateThumb(destPath, folder.destDir, webpName);
      console.log(`  🖼  800w → ${thumbKB} KB${wasResized ? '' : ' (pas de resize, image déjà ≤800px)'}`);

      const uid = `${folder.uidPrefix}-${nextNum}`;
      const dbSrc = `${folder.srcPrefix}/${webpName}`;

      // Insertion Supabase
      // Titre par défaut = slug humanisé (tirets → espaces, 1ère lettre majuscule)
      const defaultTitle = slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());

      const { error } = await supabase.from(folder.table).insert({
        uid,
        src: dbSrc,
        title: defaultTitle,
        alt: defaultTitle,
        lieu: '',
        visible: false,
        categorie: folder.categorie,
      });

      if (error) {
        console.log(`  ❌ ${uid} — erreur Supabase : ${error.message}`);
        continue;
      }

      // Déplacer l'original dans done/
      const donePath = join(DONE_DIR, file);
      await rename(srcPath, donePath);

      const sizeKB = Math.round(info.size / 1024);
      console.log(`  ✅ ${uid} → ${webpName} (${info.width}×${info.height}, ${sizeKB} KB)`);

      nextNum++;
      totalImported++;
    }
  }

  if (totalImported === 0) {
    console.log('📭 Aucune nouvelle image à importer.\n');
    console.log('Dépose tes JPG dans :');
    console.log('  • public/images/portfolio/New/photos_paysages/Mer/');
    console.log('  • public/images/portfolio/New/photos_paysages/Terre/');
    console.log('  • public/images/portfolio/New/photos_paysages/Horizons/');
    console.log('  • public/images/portfolio/New/photos_sous_marine/Dépollution/');
    console.log('  • public/images/portfolio/New/photos_sous_marine/Biodiversité/');
    console.log('  • public/images/portfolio/New/photos_sous_marine/Caractérisation/\n');
  } else {
    console.log(`\n🎉 ${totalImported} photo(s) importée(s) avec succès !\n`);
    console.log('📋 Workflow complet :');
    console.log('   1. npm run dev → admin → filtre "Incomplet" → remplis titre/alt/lieu/GPS');
    console.log('   2. Toggle "visible = true" quand c\'est prêt');
    console.log('   3. Ctrl+C pour arrêter le serveur dev');
    console.log('   4. node scripts/inject-exif.js && node scripts/audit-exif.js');
    console.log('   5. npm run build:full');
    console.log('   6. FTP\n');
  }
}

main().catch(err => { console.error('❌ Erreur fatale :', err); process.exit(1); });
