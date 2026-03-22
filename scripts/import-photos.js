/**
 * import-photos.js
 * Scanne les dossiers inbox, convertit JPG → WebP, insère dans Supabase
 * Usage : npm run photos:import
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readdir, mkdir, rename, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { existsSync } from 'node:fs';

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

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.tiff', '.tif']);

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

      // Conversion WebP
      const info = await sharp(srcPath)
        .webp({ quality: QUALITY })
        .toFile(destPath);

      const uid = `${folder.uidPrefix}-${nextNum}`;
      const dbSrc = `${folder.srcPrefix}/${webpName}`;

      // Insertion Supabase
      const { error } = await supabase.from(folder.table).insert({
        uid,
        src: dbSrc,
        title: '',
        alt: '',
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
    console.log(`\n🎉 ${totalImported} photo(s) importée(s) avec succès !`);
    console.log('📝 Prochaine étape : ouvre l\'admin → filtre "Incomplet" → remplis titre/alt/lieu/GPS');
    console.log('👁️  Toggle "visible" quand c\'est prêt, puis build + FTP\n');
  }
}

main().catch(err => { console.error('❌ Erreur fatale :', err); process.exit(1); });
