#!/usr/bin/env node
/**
 * scripts/convert-green-got.mjs
 *
 * Convertit + renomme les 7 visuels du court-métrage Fondation Green-Got
 * (« Karim saari green got 1.jpg » … « 7.jpg ») en WebP avec des noms SEO,
 * pour la page /court-metrage-green-got-mediterranee.
 *
 * Pré-requis : déposer les 7 fichiers sources dans public/images/.
 * Usage :
 *   node scripts/convert-green-got.mjs            # convertit
 *   node scripts/convert-green-got.mjs --keep     # garde les fichiers sources
 *
 * Après exécution : git add public/images/green-got-*.webp && commit && push.
 */
import sharp from 'sharp';
import { stat, unlink, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, '..', 'public', 'images');

const WEBP_QUALITY = 82;
const MAX_WIDTH    = 1920;
const KEEP_SOURCE  = process.argv.includes('--keep');

// Mapping : numéro source (Karim saari green got N) → nom SEO .webp + alt indicatif
// L'ordre suit celui d'envoi : 7 = ponton Notre-Dame de la Garde (mis en avant).
const MAPPING = [
  { n: 1, dst: 'green-got-karim-saari-interview-marseille-team-oxygen.webp',                desc: 'Interview (fond gorgone)' },
  { n: 2, dst: 'green-got-karim-saari-barque-profil-vieux-port-marseille.webp',             desc: 'Barque, profil casquette' },
  { n: 3, dst: 'green-got-karim-saari-quai-vieux-port-marseille.webp',                      desc: 'Quai, stand bois' },
  { n: 4, dst: 'green-got-team-oxygen-apneistes-depollution-calanques-marseille.webp',      desc: 'Les 4 Team Oxygen vers l\'eau' },
  { n: 5, dst: 'green-got-depollution-apnee-plastique-fond-marin-mediterranee.webp',        desc: 'Plongeur, déchets sous l\'eau' },
  { n: 6, dst: 'green-got-karim-saari-barque-vieux-port-marseille-team-oxygen.webp',        desc: 'Barque, assis face caméra' },
  { n: 7, dst: 'green-got-karim-saari-ponton-vieux-port-notre-dame-de-la-garde-marseille.webp', desc: 'Ponton + Bonne Mère (mis en avant)' },
];

const SRC_EXTS = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG'];

async function findSource(n) {
  for (const ext of SRC_EXTS) {
    const p = path.join(IMAGES_DIR, `Karim saari green got ${n}${ext}`);
    try { await access(p); return p; } catch { /* next */ }
  }
  return null;
}

async function run() {
  console.log('\n🟢 Conversion des visuels Green-Got → WebP SEO\n');
  let ok = 0, missing = 0, totalIn = 0, totalOut = 0;

  for (const { n, dst, desc } of MAPPING) {
    const src = await findSource(n);
    if (!src) {
      console.warn(`  ⚠️  Source introuvable : "Karim saari green got ${n}.(jpg|png)" — ${desc}`);
      missing++;
      continue;
    }
    const dstPath = path.join(IMAGES_DIR, dst);
    try {
      const inSize = (await stat(src)).size;
      let pipeline = sharp(src);
      const meta = await pipeline.metadata();
      if (meta.width > MAX_WIDTH) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(dstPath);
      const outSize = (await stat(dstPath)).size;
      totalIn += inSize; totalOut += outSize;
      const saved = Math.round((1 - outSize / inSize) * 100);
      console.log(`  ✅ #${n} → ${dst}  (${(inSize/1024).toFixed(0)}ko → ${(outSize/1024).toFixed(0)}ko, −${saved}%)  · ${desc}`);

      // Visuel mis en avant (#7) : générer aussi un JPG pour les cartes sociales
      // (og:image / Twitter — le WebP n'est pas fiable partout, ex. LinkedIn).
      if (n === 7) {
        const jpgPath = dstPath.replace(/\.webp$/, '.jpg');
        await sharp(src).resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 85 }).toFile(jpgPath);
        console.log(`  🖼️  carte sociale → ${path.basename(jpgPath)}`);
      }

      if (!KEEP_SOURCE) await unlink(src);
      ok++;
    } catch (err) {
      console.error(`  ❌ #${n} : ${err.message}`);
    }
  }

  console.log(`\n  ${ok}/7 converti(s)${missing ? `, ${missing} source(s) manquante(s)` : ''}.`);
  if (totalIn) console.log(`  Poids total : ${(totalIn/1024/1024).toFixed(1)}Mo → ${(totalOut/1024/1024).toFixed(1)}Mo`);
  if (!KEEP_SOURCE && ok) console.log('  🧹 Fichiers sources supprimés (option --keep pour les garder).');
  console.log('\n  ➜ git add public/images/green-got-*.webp && git commit && git push\n');
}

run().catch((err) => { console.error('\n❌', err); process.exit(1); });
