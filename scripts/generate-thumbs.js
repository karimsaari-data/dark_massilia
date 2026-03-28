/**
 * Génère des thumbnails 800px pour les galeries portfolio
 * Usage : node scripts/generate-thumbs.js
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';

const THUMB_WIDTH = 800;
const QUALITY = 82;

const dirs = [
  'public/images/portfolio/Mer',
  'public/images/portfolio/Terre',
];

for (const dir of dirs) {
  const thumbDir = join(dir, '800w');
  if (!existsSync(thumbDir)) mkdirSync(thumbDir, { recursive: true });

  const files = readdirSync(dir).filter(f =>
    ['.webp', '.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase())
  );

  for (const file of files) {
    const src = join(dir, file);
    const dest = join(thumbDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    const destWebp = dest.endsWith('.webp') ? dest : dest + '.webp';

    try {
      const meta = await sharp(src).metadata();
      if (meta.width <= THUMB_WIDTH) {
        // Image déjà petite — copie simple recompressée
        await sharp(src).webp({ quality: QUALITY }).toFile(destWebp);
        console.log(`[skip-resize] ${file} (${meta.width}px)`);
      } else {
        await sharp(src)
          .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(destWebp);
        console.log(`[ok] ${file} → 800px`);
      }
    } catch (e) {
      console.error(`[err] ${file}:`, e.message);
    }
  }
}

console.log('Thumbnails générés.');
