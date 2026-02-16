#!/usr/bin/env node
/**
 * Convert all JPG/PNG images in public/ to WebP using sharp.
 * Usage: node scripts/convert-to-webp.mjs
 */
import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png']);
const SKIP_FILES = new Set([
  'favicon.ico', 'favicon.svg', 'favicon-96x96.png',
  'apple-touch-icon.png', 'app-icon-1024x1024.png',
]);

const WEBP_QUALITY = 80;
const MAX_WIDTH = 1920; // Cap images at 1920px wide

let totalOriginal = 0;
let totalConverted = 0;
let fileCount = 0;

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findImages(fullPath));
    } else if (IMAGE_EXTS.has(extname(entry.name).toLowerCase()) && !SKIP_FILES.has(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function convertFile(filePath) {
  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const name = filePath.replace(PUBLIC_DIR + '/', '');

  try {
    const originalStat = await stat(filePath);
    const originalSize = originalStat.size;

    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(webpPath);

    const newStat = await stat(webpPath);
    const newSize = newStat.size;

    totalOriginal += originalSize;
    totalConverted += newSize;
    fileCount++;

    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(`  ${name}: ${(originalSize / 1024).toFixed(0)}K → ${(newSize / 1024).toFixed(0)}K (-${reduction}%)`);
  } catch (err) {
    console.warn(`  SKIP ${name}: ${err.message}`);
  }
}

async function main() {
  console.log('Finding images...');
  const images = await findImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to convert.\n`);

  // Process in batches of 4 for parallelism
  for (let i = 0; i < images.length; i += 4) {
    const batch = images.slice(i, i + 4);
    await Promise.all(batch.map(convertFile));
  }

  console.log(`\n--- Summary ---`);
  console.log(`Files converted: ${fileCount}`);
  console.log(`Original total:  ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`WebP total:      ${(totalConverted / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Reduction:       ${((1 - totalConverted / totalOriginal) * 100).toFixed(1)}%`);
}

main().catch(err => { console.error(err); process.exit(1); });
