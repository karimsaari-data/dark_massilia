/**
 * generate-responsive-images.js
 * Génère des variantes responsives (400w, 800w, 1200w) pour les images lourdes de Home.jsx
 * Usage : node scripts/generate-responsive-images.js
 */

import sharp from 'sharp';
import { existsSync, statSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Images à traiter — toutes utilisées dans Home.jsx avec objet-cover pleine zone
const IMAGES = [
  'public/images/portfolio/Mer/6.webp',
  'public/images/portfolio/Mer/54.webp',
  'public/images/portfolio/Mer/12.webp',
  'public/images/portfolio/Mer/95.webp',
  'public/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-huveaune.webp',
  'public/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp',
  'public/images/groupe-des-amoureux-des-calanques.webp',
  'public/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp',
];

// Largeurs à générer (en pixels)
const WIDTHS = [400, 800, 1200];

// Qualité WebP (85 = bon compromis taille/qualité)
const QUALITY = 85;

async function processImage(relativePath) {
  const src = resolve(root, relativePath);

  if (!existsSync(src)) {
    console.warn(`⚠ Fichier introuvable : ${relativePath}`);
    return;
  }

  const meta = await sharp(src).metadata();
  const originalKB = Math.round(statSync(src).size / 1024);
  const dir = dirname(src);
  const ext = extname(src);
  const name = basename(src, ext);

  console.log(`\n📸 ${relativePath}`);
  console.log(`   Origine : ${meta.width}×${meta.height}px · ${originalKB} KB`);

  for (const width of WIDTHS) {
    // Ignorer si la largeur cible est supérieure à l'originale
    if (width >= meta.width) {
      console.log(`   ↳ ${width}w : skipped (original plus petit)`);
      continue;
    }

    const outPath = resolve(dir, `${name}_${width}w${ext}`);

    await sharp(src)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    const outKB = Math.round(statSync(outPath).size / 1024);
    const saving = Math.round((1 - outKB / originalKB) * 100);
    console.log(`   ↳ ${width}w : ${outKB} KB (-${saving}% vs original)`);
  }
}

async function main() {
  console.log('🔧 Génération des images responsives...');
  console.log(`   Largeurs : ${WIDTHS.join(', ')}w · Qualité : ${QUALITY}`);

  for (const img of IMAGES) {
    await processImage(img);
  }

  console.log('\n✅ Terminé.');
}

main().catch((err) => {
  console.error('Erreur :', err);
  process.exit(1);
});
