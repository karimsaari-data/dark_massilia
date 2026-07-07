#!/usr/bin/env node
/**
 * scripts/convert-running-minds.mjs
 *
 * Construit la mosaïque 2x2 (visuels 3,4,5,6) + nettoie le logo (2) pour
 * l'évènement Running Minds (Kilian Jornet Foundation) du 20 juin 2026
 * dans les Calanques — utilisé sur /medias et /photographe-environnemental-marseille.
 *
 * Pré-requis : les 6 fichiers sources « Running minds - kilian jornet
 * foundation - marseille - parc national des calanques - karim saari (N).jpg/png »
 * dans public/images/.
 * Usage : node scripts/convert-running-minds.mjs [--keep]
 */
import sharp from 'sharp';
import { stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, '..', 'public', 'images');
const PARTNERS_DIR = path.join(IMAGES_DIR, 'Partenaires');

const KEEP_SOURCE = process.argv.includes('--keep');
const PREFIX = 'Running minds - kilian jornet foundation - marseille - parc national des calanques - karim saari';

const src = (n, ext = 'jpg') => path.join(IMAGES_DIR, `${PREFIX} (${n}).${ext}`);

const MOSAIC_OUT = path.join(IMAGES_DIR, 'karim-saari-running-minds-kilian-jornet-foundation-calanques-marseille.webp');
const LOGO_OUT   = path.join(PARTNERS_DIR, 'logo-kilian-jornet-foundation.png');

// Ordre narratif : titre → protagoniste (Karim Saari) → partenaire (Sauvage
// Méditerranée) → remerciement. Cellules 800x800, canvas 1600x1600.
const CELL = 800;
const MOSAIC_CELLS = [
  { n: 6, top: 0,    left: 0 },    // "Running Minds at Calanques, Marseille"
  { n: 4, top: 0,    left: CELL }, // Karim Saari — Team Oxygen
  { n: 3, top: CELL, left: 0 },    // Manu & Sébastien — Sauvage Méditerranée
  { n: 5, top: CELL, left: CELL }, // "Thank you..."
];

async function buildMosaic() {
  const composites = [];
  for (const { n, top, left } of MOSAIC_CELLS) {
    const buf = await sharp(src(n))
      .resize({ width: CELL, height: CELL, fit: 'cover', position: 'attention' })
      .toBuffer();
    composites.push({ input: buf, top, left });
  }
  await sharp({
    create: { width: CELL * 2, height: CELL * 2, channels: 3, background: '#000000' },
  })
    .composite(composites)
    .webp({ quality: 84 })
    .toFile(MOSAIC_OUT);
  const outSize = (await stat(MOSAIC_OUT)).size;
  console.log(`  ✅ Mosaïque → ${path.relative(IMAGES_DIR, MOSAIC_OUT)} (${(outSize / 1024).toFixed(0)}ko)`);
}

async function cleanLogo() {
  await sharp(src(2, 'png')).trim().png({ compressionLevel: 9 }).toFile(LOGO_OUT);
  const outSize = (await stat(LOGO_OUT)).size;
  console.log(`  ✅ Logo KJF  → Partenaires/${path.basename(LOGO_OUT)} (${(outSize / 1024).toFixed(0)}ko)`);
}

async function run() {
  console.log('\n🏃 Running Minds — mosaïque + logo\n');
  await buildMosaic();
  await cleanLogo();

  if (!KEEP_SOURCE) {
    const toDelete = [1, 2, 3, 4, 5, 6].flatMap((n) => [src(n, 'jpg'), src(n, 'png')]);
    for (const f of toDelete) {
      try { await unlink(f); } catch { /* n'existe pas dans cette extension */ }
    }
    console.log('  🧹 Fichiers sources supprimés (option --keep pour les garder).');
  }

  console.log('\n  ➜ git add public/images/karim-saari-running-minds-*.webp public/images/Partenaires/logo-kilian-jornet-foundation.png && commit && push\n');
}

run().catch((err) => { console.error('\n❌', err); process.exit(1); });
