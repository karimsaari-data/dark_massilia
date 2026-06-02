/**
 * scripts/sanitize-image-names.mjs
 *
 * Évite le plantage du déploiement FTP causé par les noms de fichiers images
 * contenant des espaces (lftp tronque au premier espace) ou des accents.
 *
 * Renomme les images de public/images/ en ASCII sûr (espaces → tirets,
 * accents normalisés) ET met à jour toutes les références dans le code
 * (formes brutes ET encodées %20 / %C3%A9 …).
 *
 * Modes :
 *   node scripts/sanitize-image-names.mjs <fichier...>   → corrige ces fichiers
 *   node scripts/sanitize-image-names.mjs --staged       → corrige les images
 *                                                          ajoutées/renommées
 *                                                          dans l'index git
 *                                                          (utilisé par le hook)
 *   node scripts/sanitize-image-names.mjs --check         → ne modifie rien ;
 *                                                          exit 1 si une image
 *                                                          de public/images/
 *                                                          contient un espace
 *                                                          (garde-fou CI)
 */

import { execSync } from 'node:child_process';
import {
  readFileSync, writeFileSync, renameSync, existsSync, readdirSync, statSync,
} from 'node:fs';
import { join, dirname, basename, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');

// ── Slug ASCII sûr (conserve casse, underscores, points, tirets) ─────────────
const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

function safeName(name) {
  const ext = extname(name);
  let stem = stripAccents(basename(name, ext));
  stem = stem
    .replace(/\s+/g, '-')            // espaces → tiret
    .replace(/[^A-Za-z0-9._-]/g, '-')// tout autre caractère risqué → tiret
    .replace(/-+/g, '-')             // tirets multiples → un seul
    .replace(/^-|-$/g, '');          // pas de tiret en bord
  return stem + stripAccents(ext);
}

// ── Liste récursive des fichiers d'un dossier ────────────────────────────────
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// ── Fichiers texte où chercher/remplacer les références ──────────────────────
const TEXT_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.xml', '.txt', '.json', '.mjs', '.md']);
function textFiles() {
  const dirs = [join(ROOT, 'src'), join(ROOT, 'public'), join(ROOT, 'scripts')];
  const files = [];
  for (const d of dirs) if (existsSync(d)) files.push(...walk(d));
  // fichiers HTML/JSON à la racine
  for (const f of readdirSync(ROOT)) {
    const p = join(ROOT, f);
    if (statSync(p).isFile() && TEXT_EXT.has(extname(f))) files.push(p);
  }
  return files.filter((f) => TEXT_EXT.has(extname(f)) && !f.includes('node_modules'));
}

// ── Remplace toutes les références oldBase → newBase (brut + encodé) ──────────
function updateReferences(oldBase, newBase) {
  const variants = [oldBase, encodeURIComponent(oldBase)];
  let touched = 0;
  for (const file of textFiles()) {
    let content;
    try { content = readFileSync(file, 'utf-8'); } catch { continue; }
    let next = content;
    for (const v of variants) {
      if (next.includes(v)) next = next.split(v).join(newBase);
    }
    if (next !== content) {
      writeFileSync(file, next);
      touched++;
      console.log(`   ↳ maj réf : ${relative(ROOT, file)}`);
    }
  }
  return touched;
}

// ── Renomme un fichier image + met à jour les références ──────────────────────
function fixFile(absPath) {
  if (!existsSync(absPath)) { console.warn(`⚠️  introuvable : ${absPath}`); return false; }
  const dir = dirname(absPath);
  const old = basename(absPath);
  const next = safeName(old);
  if (next === old) return false; // déjà propre

  let target = join(dir, next);
  if (existsSync(target)) {
    const ext = extname(next);
    target = join(dir, `${basename(next, ext)}-${Date.now()}${ext}`);
  }
  renameSync(absPath, target);
  console.log(`🔧 ${old}\n   → ${basename(target)}`);
  updateReferences(old, basename(target));

  // Re-stage côté git si on est dans un dépôt
  try {
    execSync(`git add -- "${relative(ROOT, absPath)}" "${relative(ROOT, target)}"`, { cwd: ROOT, stdio: 'ignore' });
  } catch { /* hors dépôt git, ignore */ }
  return true;
}

// ── Récupère les images stagées (ajoutées / copiées / renommées) ─────────────
function stagedImages() {
  try {
    // -z : chemins séparés par NUL, sans quoting (gère espaces + accents)
    const out = execSync('git -c core.quotepath=false diff --cached --name-only --diff-filter=ACR -z', { cwd: ROOT, encoding: 'utf-8' });
    return out.split('\0')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('public/images/') && /\.(jpe?g|png|webp|svg|gif|avif)$/i.test(s))
      .map((s) => join(ROOT, s));
  } catch { return []; }
}

// ── Modes ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes('--check')) {
  const bad = walk(IMAGES_DIR).filter((p) => /\s/.test(basename(p)));
  if (bad.length) {
    console.error('❌ Images avec espace dans le nom (cassent l\'upload FTP) :');
    bad.forEach((p) => console.error(`   - ${relative(ROOT, p)}`));
    console.error('\n💡 Corrige avec : node scripts/sanitize-image-names.mjs ' +
      bad.map((p) => `"${relative(ROOT, p)}"`).join(' '));
    process.exit(1);
  }
  console.log('✅ Aucune image avec espace dans public/images/');
  process.exit(0);
}

let targets;
if (args.includes('--staged')) {
  targets = stagedImages();
} else if (args.length) {
  targets = args.map((a) => (a.startsWith('/') ? a : join(ROOT, a)));
} else {
  console.error('Usage : sanitize-image-names.mjs <fichier...> | --staged | --check');
  process.exit(2);
}

let n = 0;
for (const f of targets) if (fixFile(f)) n++;
console.log(n ? `\n✅ ${n} image(s) renommée(s) + références mises à jour` : '✅ Rien à corriger');
