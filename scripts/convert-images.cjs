/**
 * convert-images.cjs — Convert specific images to WebP
 * Usage: node scripts/convert-images.cjs
 */
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const imagesDir = path.resolve(__dirname, '../public/images');

async function convert(input, output, options = {}) {
  const inPath  = path.join(imagesDir, input);
  const outPath = path.join(imagesDir, output);

  const sizeBefore = fs.statSync(inPath).size;
  await sharp(inPath, options).webp({ quality: 82, effort: 6 }).toFile(outPath);
  const sizeAfter = fs.statSync(outPath).size;

  const saved = ((1 - sizeAfter / sizeBefore) * 100).toFixed(0);
  console.log(`  ✅  ${input} → ${output}`);
  console.log(`       ${(sizeBefore/1024).toFixed(0)} kB → ${(sizeAfter/1024).toFixed(0)} kB  (−${saved}%)`);
}

(async () => {
  console.log('\n🖼  WebP conversion — Dark Massilia\n');

  // 1. Animated GIF → animated WebP (sharp 0.32+ supports animated)
  await convert('9ans.gif',   '9ans.webp', { animated: true });

  // 2. Community panoramic JPEG
  await convert('130000_sentinelles_Marseille.jpg', '130000_sentinelles_Marseille.webp');

  // 3. Street View Trusted logo PNG
  await convert('logo-trusted.png', 'logo-trusted.webp');

  console.log('\n✅  All conversions done.\n');
})();
