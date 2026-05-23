#!/usr/bin/env node
/**
 * audit-exif.js — Lit les métadonnées EXIF/XMP/IPTC/GPS des fichiers physiques
 *                 et les pousse dans la table Supabase `photos_exif`.
 * Usage : node scripts/audit-exif.js
 * Prérequis : exiftool installé, .env avec VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
 */

import { execSync }                            from 'child_process';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { tmpdir }                              from 'os';
import { join, dirname }                       from 'path';
import { fileURLToPath }                       from 'url';
import { createClient }                        from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const path = { join };

const ROOT     = path.join(__dirname, '..');
const NEW_ONLY = process.argv.includes('--new-only');

// ExifTool — chemin local en priorité (scripts/exiftool/), sinon PATH système
const EXIFTOOL_LOCAL = join(__dirname, 'exiftool', 'ExifTool.exe');
const EXIFTOOL = existsSync(EXIFTOOL_LOCAL) ? `"${EXIFTOOL_LOCAL}"` : 'exiftool';

// ── .env loader ───────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!existsSync(envPath)) return {};
  return Object.fromEntries(
    readFileSync(envPath, 'utf-8')
      .split('\n')
      .filter(l => l.trim() && !l.startsWith('#'))
      .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
      .filter(([k]) => k)
  );
}

// Convertit un chemin absolu en clé src (/images/portfolio/Mer/foo.webp)
function toSrcKey(filePath) {
  return filePath.replace(/\\/g, '/').replace(/^.*\/public/, '');
}

// Lit les métadonnées d'un fichier via ExifTool (sortie JSON)
function readExif(filePath) {
  try {
    const exiftoolBin = existsSync(EXIFTOOL_LOCAL) ? EXIFTOOL_LOCAL : 'exiftool';
    const raw = execSync(
      `"${exiftoolBin}" -json -charset UTF8 -charset IPTC=UTF8 ` +
      `-XMP:Title -XMP:Description -XMP:Creator -XMP:Rights -XMP:Subject ` +
      `-XMP-iptcExt:LocationShownCity -XMP-iptcExt:LocationShownCountryName ` +
      `-IPTC:City -IPTC:Country-PrimaryLocationName -IPTC:Province-State ` +
      `-GPS:GPSLatitude# -GPS:GPSLongitude# ` +
      `-EXIF:Artist -EXIF:Copyright ` +
      `"${filePath}"`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    const parsed = JSON.parse(raw);
    return parsed[0] || {};
  } catch {
    return null;
  }
}

// Parse une valeur GPS ExifTool
// Formats possibles : 43.2965, "43.2965 N", "43 deg 17' 28.76\" N"
function parseGps(val) {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  const str = String(val).trim();

  // Format décimal simple : "43.2965" ou "43.2965 N"
  const decimal = str.match(/^([\d.]+)\s*([NSEW])?$/);
  if (decimal) {
    let n = parseFloat(decimal[1]);
    if (decimal[2] === 'S' || decimal[2] === 'W') n = -n;
    return isNaN(n) ? null : n;
  }

  // Format DMS : "43 deg 17' 28.76\" N" ou "43° 17' 28.76\" N"
  const dms = str.match(/(\d+)\s*(?:deg|°)\s*(\d+)['\u2019]\s*([\d.]+)["\u201d]?\s*([NSEW])?/i);
  if (dms) {
    let n = parseInt(dms[1]) + parseInt(dms[2]) / 60 + parseFloat(dms[3]) / 3600;
    if (dms[4] === 'S' || dms[4] === 'W') n = -n;
    return isNaN(n) ? null : Math.round(n * 1e6) / 1e6;
  }

  return null;
}

// Normalise les keywords (ExifTool retourne string ou tableau)
function parseKeywords(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String);
  return String(val).split(',').map(s => s.trim()).filter(Boolean);
}

// ── Main ──────────────────────────────────────────────────────────────────────
try {
  execSync(`"${existsSync(EXIFTOOL_LOCAL) ? EXIFTOOL_LOCAL : 'exiftool'}" -ver`, { stdio: 'pipe' });
} catch {
  console.error('❌  ExifTool introuvable — installe-le via : winget install OliverBetz.ExifTool');
  process.exit(1);
}

const env = loadEnv();
if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌  VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY absents dans .env');
  process.exit(1);
}

// Service role key pour bypasser le RLS en écriture (script serveur uniquement)
const supabaseKey = env.SUPABASE_SERVICE_KEY || env.VITE_SUPABASE_ANON_KEY;
if (!env.SUPABASE_SERVICE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_KEY absent — utilisation de la clé anon (RLS peut bloquer les inserts)');
}
const sb = createClient(env.VITE_SUPABASE_URL, supabaseKey);

console.log(`🔗  Chargement des photos depuis Supabase…${NEW_ONLY ? '  [mode --new-only]' : ''}`);
const [{ data: paysage, error: e1 }, { data: sousMarine, error: e2 }] = await Promise.all([
  sb.from('photos_paysage').select('src'),
  sb.from('photos_sous_marine').select('src'),
]);
if (e1) { console.error('❌  photos_paysage :', e1.message); process.exit(1); }
if (e2) { console.error('❌  photos_sous_marine :', e2.message); process.exit(1); }

let allSrcs = [...new Set(
  [...(paysage || []), ...(sousMarine || [])].map(r => r.src).filter(Boolean)
)];

// --new-only : exclure les srcs déjà auditées dans photos_exif
if (NEW_ONLY) {
  const { data: existing } = await sb.from('photos_exif').select('src').eq('file_exists', true);
  const existingSet = new Set((existing || []).map(r => r.src));
  const before = allSrcs.length;
  allSrcs = allSrcs.filter(src => !existingSet.has(src));
  console.log(`  → ${before} photos au total, ${before - allSrcs.length} déjà auditées, ${allSrcs.length} nouvelles à traiter\n`);
} else {
  console.log(`  → ${allSrcs.length} photos trouvées (dédupliqué)\n`);
}

const rows = [];
let ok = 0, missing = 0, err = 0;

for (const src of allSrcs) {
  const filePath = path.join(ROOT, 'public', src).replace(/\//g, '\\');
  const fileExists = existsSync(filePath);

  if (!fileExists) {
    console.log(`  ⚠  Fichier introuvable : ${src}`);
    rows.push({ src, file_exists: false, checked_at: new Date().toISOString() });
    missing++;
    continue;
  }

  const exif = readExif(filePath);
  if (!exif) {
    console.log(`  ✗  Erreur lecture : ${src}`);
    rows.push({ src, file_exists: true, checked_at: new Date().toISOString() });
    err++;
    continue;
  }

  const lat = parseGps(exif.GPSLatitude);
  const lng = parseGps(exif.GPSLongitude);

  rows.push({
    src,
    xmp_title:       exif.Title        || null,
    xmp_description: exif.Description  || null,
    xmp_creator:     exif.Creator      || null,
    xmp_rights:      exif.Rights       || null,
    xmp_keywords:    parseKeywords(exif.Subject),
    iptc_city:       exif.LocationShownCity || (Array.isArray(exif.City) ? exif.City[0] : exif.City) || null,
    iptc_country:    exif.LocationShownCountryName || exif['Country-PrimaryLocationName'] || null,
    iptc_state:      exif['Province-State'] || null,
    gps_lat:         lat,
    gps_lng:         lng,
    exif_artist:     exif.Artist       || null,
    exif_copyright:  exif.Copyright    || null,
    file_exists:     true,
    checked_at:      new Date().toISOString(),
  });

  const hasGps = lat != null && lng != null ? '📍' : '  ';
  const hasXmp = exif.Title ? '✓' : '✗';
  console.log(`  ${hasGps} [XMP:${hasXmp}] ${src.split('/').pop()}`);
  ok++;
}

// ── Upsert par batch de 100 ───────────────────────────────────────────────────
console.log(`\n📤  Envoi vers Supabase (${rows.length} lignes)…`);
const BATCH = 100;
let upsertErr = 0;
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH);
  const { error } = await sb.from('photos_exif').upsert(batch, { onConflict: 'src' });
  if (error) {
    console.error(`  ✗  Batch ${i}–${i + BATCH} : ${error.message}`);
    upsertErr++;
  }
}

console.log(`
✅  Audit terminé
   Lus     : ${ok}
   Manquants: ${missing}
   Erreurs  : ${err}
   Upsert   : ${upsertErr === 0 ? 'OK' : `${upsertErr} batch(s) en erreur`}
`);
