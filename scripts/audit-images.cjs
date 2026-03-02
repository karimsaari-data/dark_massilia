const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const imagesDir = path.join(projectDir, 'public', 'images');
const srcDir = path.join(projectDir, 'src');

function walkDir(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files = files.concat(walkDir(full));
    else files.push({ full, size: stat.size });
  }
  return files;
}

// All images in public/images
const imgs = walkDir(imagesDir)
  .filter(f => /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(f.full))
  .map(f => ({
    ...f,
    rel: f.full.substring(imagesDir.length).split(path.sep).join('/'),
    basename: path.basename(f.full),
    ext: path.extname(f.full).toLowerCase(),
  }));

// Read all src files content
const srcFiles = walkDir(srcDir)
  .filter(f => /\.(jsx|js|ts|tsx|json)$/i.test(f.full));
let srcContent = '';
for (const f of srcFiles) srcContent += fs.readFileSync(f.full, 'utf8');

// Check reference
const referenced = imgs.filter(img => srcContent.includes(img.basename));
const unreferenced = imgs.filter(img => !srcContent.includes(img.basename));

const nonWebpRef = referenced.filter(f => f.ext !== '.webp');
const nonWebpUnref = unreferenced.filter(f => f.ext !== '.webp');
const unrefSize = unreferenced.reduce((s, f) => s + f.size, 0);
const nonWebpUnrefSize = nonWebpUnref.reduce((s, f) => s + f.size, 0);
const nonWebpRefSize = nonWebpRef.reduce((s, f) => s + f.size, 0);

console.log('=== REFERENCED non-WebP (need conversion) ===');
console.log(`Count: ${nonWebpRef.length} | Size: ${(nonWebpRefSize/1024/1024).toFixed(1)} MB`);
nonWebpRef.sort((a, b) => b.size - a.size).forEach(f =>
  console.log(`  ${(f.size/1024/1024).toFixed(2)} MB  ${f.rel}`)
);

console.log('\n=== UNREFERENCED non-WebP (candidates for deletion) ===');
console.log(`Count: ${nonWebpUnref.length} | Size: ${(nonWebpUnrefSize/1024/1024).toFixed(1)} MB`);
nonWebpUnref.sort((a, b) => b.size - a.size).slice(0, 15).forEach(f =>
  console.log(`  ${(f.size/1024/1024).toFixed(2)} MB  ${f.rel}`)
);

console.log('\n=== SUMMARY ===');
console.log(`Total images: ${imgs.length}`);
console.log(`Non-WebP referenced: ${nonWebpRef.length} (${(nonWebpRefSize/1024/1024).toFixed(1)} MB)`);
console.log(`Non-WebP unreferenced: ${nonWebpUnref.length} (${(nonWebpUnrefSize/1024/1024).toFixed(1)} MB)`);
console.log(`Total unreferenced files: ${unreferenced.length} (${(unrefSize/1024/1024).toFixed(1)} MB)`);
