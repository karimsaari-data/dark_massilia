/**
 * images-ftp-sync.mjs
 *
 * Gère la registry Supabase des images pour l'upload FTP sélectif.
 * Détecte automatiquement l'usage de chaque image (galerie, portfolio, décoration…)
 *
 * Modes :
 *   node scripts/images-ftp-sync.mjs
 *     → Scanne dist/images/, compare avec la registry, écrit /tmp/ftp-upload-list.txt
 *
 *   node scripts/images-ftp-sync.mjs --mark-uploaded [/tmp/ftp-upload-list.txt]
 *     → Après lftp, marque les fichiers uploadés (uploaded_at = now())
 *
 *   node scripts/images-ftp-sync.mjs --mark-all-uploaded
 *     → Après force_images=true, marque tout dist/images/ comme uploadé
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, basename, extname } from 'path';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const DIST_IMAGES = 'dist/images';
const OUTPUT_FILE = '/tmp/ftp-upload-list.txt';
const BATCH_SIZE  = 200;

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);

/* ── Timestamp git du dernier commit par fichier (un seul appel git) ── */
function loadGitMtimes() {
  const map = {};
  try {
    const out = execSync(
      'git log --pretty=format:"%ct" --name-only -- public/images/',
      { maxBuffer: 64 * 1024 * 1024, stdio: ['pipe', 'pipe', 'ignore'] }
    ).toString();
    let ts = null;
    for (const line of out.split('\n')) {
      const t = line.trim();
      if (!t) continue;
      if (/^\d{9,11}$/.test(t)) { ts = parseInt(t); continue; }
      if (t.startsWith('public/images/') && ts) {
        const path = `images/${t.slice('public/images/'.length)}`;
        if (!map[path]) map[path] = new Date(ts * 1000).toISOString(); // premier = plus récent
      }
    }
  } catch { /* git indisponible */ }
  return map;
}

/* ── Scan récursif des fichiers images ── */
function scanImages(dir, base = dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanImages(full, base));
    } else if (/\.(webp|jpg|jpeg|png|gif|svg)$/i.test(entry.name)) {
      const rel       = relative(base, full).replace(/\\/g, '/');
      const path      = `images/${rel}`;
      const { size }  = statSync(full);
      const file_type = extname(entry.name).slice(1).toLowerCase(); // "webp", "jpg"…
      results.push({ path, size_bytes: size, file_type });
    }
  }
  return results;
}

/* ── Déterminer l'usage d'une image à partir de son chemin ── */
function inferUsage(path, paysageSrcs, sousMarineSrcs) {
  // Galeries Supabase (correspondance exacte sur le src stocké)
  if (paysageSrcs.has(path))    return 'galerie_paysage';
  if (sousMarineSrcs.has(path)) return 'galerie_sous_marine';

  // Patterns de chemin
  if (path.includes('/portfolio/Terre/'))    return 'portfolio_paysage';
  if (path.includes('/portfolio/Mer/'))      return 'portfolio_paysage';
  if (path.includes('/portfolio/Horizons/')) return 'portfolio_paysage';
  if (path.includes('/portfolio/'))          return 'portfolio_paysage';

  // Sous-marine hors galerie (ex: images en dehors du portfolio)
  if (/depoll|caracterisation|biodiversite|sous.?marine/i.test(path)) return 'galerie_sous_marine';

  // Décorations / assets généraux
  if (/bg-|avatar|logo|karim-saari\.(png|jpg|webp)|\.vcf/i.test(basename(path))) return 'decoration';
  if (path.includes('/libwebp/'))  return 'unknown';

  return 'decoration';
}

/* ── Upsert par batch ── */
async function upsertBatch(rows) {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const { error } = await supabase
      .from('images_registry')
      .upsert(rows.slice(i, i + BATCH_SIZE), { onConflict: 'path' });
    if (error) throw new Error(`Supabase upsert: ${error.message}`);
  }
}

/* ── Main ── */
async function main() {
  const args = process.argv.slice(2);

  /* --mark-uploaded */
  if (args[0] === '--mark-uploaded') {
    const listFile = args[1] || OUTPUT_FILE;
    if (!existsSync(listFile)) { console.log('Aucune liste à marquer.'); return; }
    const paths = readFileSync(listFile, 'utf-8').trim().split('\n').filter(Boolean);
    if (!paths.length) { console.log('Liste vide.'); return; }

    const now  = new Date().toISOString();
    const rows = paths.map(path => {
      const distPath   = `dist/${path}`;
      const size_bytes = existsSync(distPath) ? statSync(distPath).size : 0;
      return { path, size_bytes, uploaded_at: now, updated_at: now };
    });
    await upsertBatch(rows);
    console.log(`✅ ${rows.length} image(s) marquée(s) comme uploadées`);
    return;
  }

  /* --mark-all-uploaded */
  if (args[0] === '--mark-all-uploaded') {
    if (!existsSync(DIST_IMAGES)) { console.error('dist/images introuvable'); process.exit(1); }
    const files = scanImages(DIST_IMAGES);
    const now   = new Date().toISOString();

    // Charger les srcs des galeries pour l'usage
    const [{ data: paysage }, { data: sousMarine }] = await Promise.all([
      supabase.from('photos_paysage').select('src'),
      supabase.from('photos_sous_marine').select('src'),
    ]);
    const paysageSrcs    = new Set((paysage    || []).map(r => r.src));
    const sousMarineSrcs = new Set((sousMarine || []).map(r => r.src));

    const gitMtimes = loadGitMtimes();
    const rows = files.map(({ path, size_bytes, file_type }) => ({
      path,
      size_bytes,
      file_type,
      file_mtime:  gitMtimes[path] ?? null,
      usage:       inferUsage(path, paysageSrcs, sousMarineSrcs),
      uploaded_at: now,
      updated_at:  now,
    }));
    await upsertBatch(rows);
    console.log(`✅ Toutes les ${rows.length} images marquées comme uploadées`);
    return;
  }

  /* Mode détection */
  if (!existsSync(DIST_IMAGES)) {
    console.error('dist/images introuvable — lancer après le build');
    process.exit(1);
  }

  const localFiles = scanImages(DIST_IMAGES);
  console.log(`📂 ${localFiles.length} images dans dist/images/`);

  /* Charger registry + srcs galeries + timestamps git en parallèle */
  const [
    { data: registry, error: regErr },
    { data: paysage },
    { data: sousMarine },
    gitMtimes,
  ] = await Promise.all([
    supabase.from('images_registry').select('path, size_bytes, uploaded_at'),
    supabase.from('photos_paysage').select('src'),
    supabase.from('photos_sous_marine').select('src'),
    Promise.resolve(loadGitMtimes()),
  ]);
  if (regErr) { console.error('Supabase error:', regErr.message); process.exit(1); }

  const regMap         = new Map((registry    || []).map(r => [r.path, r]));
  const paysageSrcs    = new Set((paysage     || []).map(r => r.src));
  const sousMarineSrcs = new Set((sousMarine  || []).map(r => r.src));
  console.log(`📋 ${regMap.size} entrées en registry | ${Object.keys(gitMtimes).length} timestamps git chargés`);

  /* Upsert la registry complète (taille + usage + dates à jour) */
  const now     = new Date().toISOString();
  const allRows = localFiles.map(({ path, size_bytes, file_type }) => ({
    path,
    size_bytes,
    file_type,
    file_mtime:  gitMtimes[path] ?? regMap.get(path)?.file_mtime ?? null,
    usage:       inferUsage(path, paysageSrcs, sousMarineSrcs),
    uploaded_at: regMap.get(path)?.uploaded_at ?? null,
    updated_at:  now,
  }));
  await upsertBatch(allRows);

  /* Fichiers à uploader : nouveau | jamais uploadé | taille changée */
  const toUpload = localFiles.filter(({ path, size_bytes }) => {
    const reg = regMap.get(path);
    if (!reg)             return true;
    if (!reg.uploaded_at) return true;
    if (reg.size_bytes !== size_bytes) return true;
    return false;
  });

  if (!toUpload.length) {
    console.log('✅ Aucune image à uploader');
    writeFileSync(OUTPUT_FILE, '');
    return;
  }

  console.log(`📸 ${toUpload.length} image(s) à uploader :`);
  toUpload.forEach(({ path }) => console.log(`  ${path}`));
  writeFileSync(OUTPUT_FILE, toUpload.map(f => f.path).join('\n') + '\n');
  console.log(`📝 Liste écrite dans ${OUTPUT_FILE}`);
}

main().catch(e => { console.error(e); process.exit(1); });
