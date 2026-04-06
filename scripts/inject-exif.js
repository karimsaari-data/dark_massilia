#!/usr/bin/env node
/**
 * inject-exif.js — Injection XMP via ExifTool (sans ré-encodage)
 * Source de vérité : Supabase (photos_sous_marine + photos_paysage)
 * MISC_FILES pour images presse/médias/divers hors galeries
 * Usage: node scripts/inject-exif.js
 */

import { execSync }                                                        from 'child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync, statSync }   from 'fs';
import { join, dirname }                                                    from 'path';
import { fileURLToPath }                                                    from 'url';
import { tmpdir }                                                           from 'os';
import { createClient }                                                     from '@supabase/supabase-js';

const NEW_ONLY    = process.argv.includes('--new-only');
const CACHE_FILE  = join(dirname(fileURLToPath(import.meta.url)), '..', '.exif-cache.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const path = { join };

const ROOT        = path.join(__dirname, '..');
const IMAGES_ROOT = path.join(ROOT, 'public', 'images');

const CREATOR       = 'Karim Saari';
const COPYRIGHT     = '(c) Karim Saari - Dark Massilia - karimsaari.com';
const WEB_STATEMENT = 'https://karimsaari.com';
const USAGE_TERMS   = 'All rights reserved - Contact: email@karimsaari.com';

const GEO_MARSEILLE = { lat: '43.2965', lon: '5.3698', city: 'Marseille', country: 'France', state: 'Provence-Alpes-Cote d\'Azur' };

// ── Keywords ──────────────────────────────────────────────────────────────────
const KW_BASE     = ['karim saari', 'dark massilia', 'marseille', 'méditerranée'];
const KW_SOUS_MER = [...KW_BASE, 'photographe sous-marin', 'calanques', 'apnée', 'photographie sous-marine', 'calanques de marseille'];
const KW_DEPOLL   = [...KW_SOUS_MER, 'dépollution marine', 'pollution plastique', 'projet sentinelle', 'dépollution sous-marine'];
const KW_BIOD     = [...KW_SOUS_MER, 'biodiversité marine', 'faune méditerranéenne', 'vie marine'];
const KW_CARACT   = [...KW_SOUS_MER, 'caractérisation déchets', 'projet sentinelle'];
const KW_PAYSAGE  = [...KW_BASE, 'photographe paysage', 'photographie de paysage', 'calanques'];
const KW_MER      = [...KW_PAYSAGE, 'calanques de marseille', 'littoral méditerranéen', 'paysage marin'];
const KW_TERRE    = [...KW_PAYSAGE, 'provence', 'lavande', 'valensole', 'photographie nature'];
const KW_HORIZONS = [...KW_BASE, 'photographe paysage', 'photographie de paysage', 'paysage', 'voyage', 'nature'];
// MISC_FILES only
const KW_PRESSE   = [...KW_BASE, 'calanques', 'photographe sous-marin', 'dépollution marine', 'projet sentinelle'];
const KW_ARTE     = [...KW_BASE, 'arte', 'documentaire', 'photographe sous-marin'];
const KW_RUGULO   = [...KW_BASE, 'calanques', 'marseilleveyre', 'rugulopteryx okamurae', 'algue invasive', 'biodiversité marine'];
const KW_DIVERS   = [...KW_BASE, 'calanques', 'photographe sous-marin'];
const KW_MISSIONS = [...KW_DEPOLL];

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

const EXIFTOOL_PATH = 'C:\\Users\\ksaari\\AppData\\Local\\Programs\\ExifTool\\ExifTool.exe';

// ── Cache (mtime) pour --new-only ─────────────────────────────────────────────
function loadCache() {
  try { return JSON.parse(readFileSync(CACHE_FILE, 'utf-8')); } catch { return {}; }
}
function saveCache(cache) {
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}
function isAlreadyProcessed(cache, filePath) {
  if (!NEW_ONLY) return false;
  const mtime = statSync(filePath).mtimeMs;
  return cache[filePath] === mtime;
}
function markProcessed(cache, filePath) {
  cache[filePath] = statSync(filePath).mtimeMs;
}

// ── ExifTool via argfile cp1252 (encodage Windows natif) ─────────────────────
function runExiftool(filePath, title, description, keywords, geo) {
  // Étape 1 : purge de tous les Subject existants via appel direct
  execSync(
    `"${EXIFTOOL_PATH}" "-XMP:Subject=" -overwrite_original "${filePath}"`,
    { stdio: 'pipe' }
  );

  // Étape 2 : écriture via argfile encodé en latin1 (cp1252 Windows)
  // Tous les caractères français (é â ê î ô û à ç — etc.) sont dans le range cp1252
  // ExifTool lit le fichier avec l'encodage système Windows → conversion correcte en UTF-8 XMP
  const args = [
    `-XMP:Title=${title}`,
    `-XMP:Description=${description}`,
    `-XMP:Creator=${CREATOR}`,
    `-XMP:Rights=${COPYRIGHT}`,
    `-XMP:WebStatement=${WEB_STATEMENT}`,
    `-XMP:Marked=True`,
    `-XMP:UsageTerms=${USAGE_TERMS}`,
    `-EXIF:Artist=${CREATOR}`,
    `-EXIF:Copyright=${COPYRIGHT}`,
    // Subject déjà purgé en étape 1 → on ajoute proprement
    ...keywords.map(kw => `-XMP:Subject+=${kw}`),
  ];

  if (geo) {
    args.push(
      `-XMP-iptcExt:LocationShownCity=${geo.city}`,
      `-XMP-iptcExt:LocationShownCountryName=${geo.country}`,
      `-IPTC:City=${geo.city}`,
      `-IPTC:Country-PrimaryLocationName=${geo.country}`,
      `-IPTC:Province-State=${geo.state}`,
      `-GPS:GPSLatitude=${geo.lat}`,
      `-GPS:GPSLatitudeRef=${parseFloat(geo.lat) >= 0 ? 'N' : 'S'}`,
      `-GPS:GPSLongitude=${Math.abs(parseFloat(geo.lon))}`,
      `-GPS:GPSLongitudeRef=${parseFloat(geo.lon) >= 0 ? 'E' : 'W'}`,
    );
  }

  args.push('-overwrite_original', filePath);

  const tmpFile = join(tmpdir(), `exiftool-args-${Date.now()}.txt`);
  // UTF-8 sans BOM — Windows en mode UTF-8 system-wide → ExifTool lit UTF-8 par défaut
  // Le BOM cassait le premier argument de l'argfile (était préfixé \uFEFF)
  writeFileSync(tmpFile, args.join('\n'), 'utf-8');

  try {
    const result = execSync(
      `"${EXIFTOOL_PATH}" -charset UTF8 -charset IPTC=UTF8 -@ "${tmpFile}"`,
      { stdio: 'pipe', encoding: 'utf8' }
    );
    if (!result.includes('1 image files updated')) {
      throw new Error(result.trim() || 'ExifTool: aucune image mise à jour');
    }
  } finally {
    unlinkSync(tmpFile);
  }
}

// ── Helpers DB ────────────────────────────────────────────────────────────────
function countryFromLieu(lieu) {
  if (!lieu) return 'France';
  const l = lieu.toLowerCase();
  if (l.includes('madère') || l.includes('madeira') || l.includes('portugal')) return 'Portugal';
  if (l.includes('maroc') || l.includes('morocco'))  return 'Maroc';
  if (l.includes('espagne') || l.includes('spain'))  return 'Espagne';
  if (l.includes('italie') || l.includes('italy'))   return 'Italie';
  return 'France';
}

function geoFromRow(row) {
  if (row.lat != null && row.lng != null) {
    const parts = (row.lieu || '').split(',').map(s => s.trim());
    return {
      lat:     String(row.lat),
      lon:     String(row.lng),
      city:    parts[0] || 'Marseille',
      country: countryFromLieu(row.lieu),
      state:   '',
    };
  }
  return GEO_MARSEILLE;
}

function keywordsForSousMarine(type) {
  if (!type) return KW_SOUS_MER;
  const t = type.toLowerCase();
  if (t.includes('d') && t.includes('pollution')) return KW_DEPOLL;
  if (t.includes('biodiv'))                        return KW_BIOD;
  if (t.includes('caract'))                        return KW_CARACT;
  return KW_SOUS_MER;
}

function keywordsForPaysage(type) {
  if (!type) return KW_PAYSAGE;
  const t = type.toLowerCase();
  if (t === 'mer')      return KW_MER;
  if (t === 'terre')    return KW_TERRE;
  if (t === 'horizons') return KW_HORIZONS;
  return KW_PAYSAGE;
}

// ── Traitement d'une galerie depuis Supabase ──────────────────────────────────
async function processGallery(sb, tableName, keywordsFn, cache) {
  const { data, error } = await sb.from(tableName).select('src,title,alt,lieu,lat,lng,categorie');
  if (error) { console.error(`❌  ${tableName} : ${error.message}`); return; }

  console.log(`\n📁 ${tableName}  (${data.length} photos)`);
  let ok = 0, skip = 0, cached = 0, err = 0;

  for (const row of data) {
    if (!row.src) continue;
    // Ignorer les variantes srcset (traitées séparément si besoin)
    if (/_(?:400w|800w|1200w)\.webp$/.test(row.src)) continue;

    const filePath = path.join(ROOT, 'public', row.src).replace(/\//g, '\\');
    if (!existsSync(filePath)) {
      console.log(`  ⚠  Introuvable : ${row.src}`);
      skip++;
      continue;
    }

    if (isAlreadyProcessed(cache, filePath)) {
      cached++;
      continue;
    }

    const title       = row.title?.trim() || row.src.split('/').pop().replace('.webp', '');
    const description = row.alt?.trim()   || title;
    const keywords    = keywordsFn(row.categorie);
    const geo         = geoFromRow(row);

    try {
      runExiftool(filePath, title, description, keywords, geo);
      const filename = row.src.split('/').pop();
      markProcessed(cache, filePath);
      console.log(`  ✓  ${filename}`);
      ok++;

      // Variante 800w dans le sous-dossier 800w/ du même répertoire
      const dir800w    = path.join(ROOT, 'public', row.src, '..', '800w').replace(/\//g, '\\');
      const file800w   = path.join(dir800w, filename).replace(/\//g, '\\');
      if (existsSync(file800w)) {
        runExiftool(file800w, title, description, keywords, geo);
        markProcessed(cache, file800w);
        console.log(`  ✓  800w/${filename}`);
      }
    } catch (e) {
      console.log(`  ✗  ${row.src.split('/').pop()} → ${e.message}`);
      err++;
    }
  }
  const cachedMsg = cached > 0 ? `, ${cached} déjà traités (cache)` : '';
  console.log(`  → ${ok} OK, ${skip} introuvables, ${err} erreurs${cachedMsg}`);
}

// ── MISC_FILES — images presse/médias/divers (hors galeries DB) ───────────────
// geo: null  → GPS original préservé (ne pas écrire)
// geo: omis  → fallback Marseille
const MISC_FILES = [
  { file: 'karim-saari-interview-presse-tiredearth-photographe-sous-marin.webp',       title: 'Interview Tired Earth — Karim Saari photographe sous-marin',                    description: 'Interview presse Tired Earth — Karim Saari apnéiste et photographe sous-marin Marseille (Dark Massilia)', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-marcelle-media-depollution-mer-apnee.webp',            title: 'Marcelle Média — Dépolluer la mer en apnée',                                     description: 'Reportage Marcelle Média sur la dépollution marine en apnée par Karim Saari — Projet Sentinelle Marseille', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-france-bleu-rorqual-cotes-marseille.webp',             title: 'France Bleu — Rorqual au large de Marseille',                                    description: 'France Bleu Provence — Rorqual rarissime aperçu près des côtes de Marseille, témoignage Karim Saari (Dark Massilia)', keywords: [...KW_PRESSE, 'rorqual', 'grand cétacé'] },
  { file: 'karim-saari-marseille-actu-depollution-fonds-marins.webp',                   title: 'Actu.fr — Dépollution fonds marins Marseille',                                   description: 'Reportage Actu.fr sur la dépollution des fonds marins de Marseille par Karim Saari et Team Oxygen — Calanques', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-fondation-mer-projet-sentinelle-calanques.webp',       title: 'Fondation de la Mer — Projet Sentinelle Calanques',                              description: 'La Fondation de la Mer soutient le Projet Sentinelle de dépollution sous-marine dans les Calanques de Marseille', keywords: [...KW_PRESSE, 'fondation de la mer'] },
  { file: 'karim-saari-marseille-la-provence-operation-sentinelle-apnee.webp',          title: 'La Provence — Opération Sentinelle Marseille',                                   description: 'La Provence couvre l\'Opération Sentinelle de dépollution en apnée dans les Calanques de Marseille — Karim Saari', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-france-bleu-goudes-dechets-apneistes.webp',            title: 'France Bleu — 328 kg déchets aux Goudes',                                       description: 'France Bleu Provence — 328 kg de déchets récoltés aux Goudes par les apnéistes de Team Oxygen Marseille', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-ville-reconnaissance-officielle-dark-massilia.webp',   title: 'Ville de Marseille — Reconnaissance officielle Dark Massilia',                  description: 'La Ville de Marseille reconnaît officiellement l\'engagement de Dark Massilia pour la dépollution marine des Calanques', keywords: KW_PRESSE },
  { file: 'karim-saari-marseille-made-in-marseille-provence-tourisme.webp',             title: 'Made in Marseille — Provence tourisme France',                                   description: 'Made in Marseille — Provence classée top destination touristique France, Calanques et Méditerranée', keywords: [...KW_PRESSE, 'tourisme marseille', 'provence'] },
  { file: 'karim-saari-marseille-echappees-belles-reportage-television.webp',           title: 'Échappées Belles — Karim Saari France Télévisions',                             description: 'Reportage Échappées Belles avec Karim Saari (Dark Massilia) au Vallon des Auffes — Marseille, France Télévisions', keywords: [...KW_PRESSE, 'échappées belles', 'france télévisions', 'vallon des auffes'] },
  { file: 'karim-saari-arte-regard-documentaire-calanques-marseille.webp',              title: 'ARTE Regards — Karim Saari Calanques Marseille',                                description: 'Documentaire ARTE Regards — Karim Saari et Team Oxygen contre la pollution plastique dans les Calanques de Marseille', keywords: KW_ARTE },
  { file: 'karim-saari-photo-profil-arte-regard-marseille.webp',                        title: 'Portrait Karim Saari — Documentaire ARTE',                                      description: 'Portrait de Karim Saari photographe sous-marin pour le documentaire ARTE Regards — Marseille, Dark Massilia', keywords: KW_ARTE },
  { file: 'karim-saari-photo-profil-arte-regard-marseille_300w.webp',                   title: 'Portrait Karim Saari — ARTE (300w)',                                             description: 'Portrait de Karim Saari photographe sous-marin pour le documentaire ARTE Regards — Marseille, Dark Massilia', keywords: KW_ARTE },
  { file: 'arte-meduses-souveraines-oceans-documentaire-marseille-2.webp',              title: 'Méduses — Les souveraines des océans (ARTE) 2',                                 description: 'Documentaire ARTE — Méduses les souveraines des océans, contribution Karim Saari Dark Massilia Marseille', keywords: [...KW_ARTE, 'méduses', 'faune marine'] },
  { file: 'arte-meduses-souveraines-oceans-documentaire-marseille-3.webp',              title: 'Méduses — Les souveraines des océans (ARTE) 3',                                 description: 'Documentaire ARTE — Méduses les souveraines des océans, apnée et photographie sous-marine Méditerranée', keywords: [...KW_ARTE, 'méduses', 'faune marine'] },
  { file: 'arte-meduses-souveraines-oceans-documentaire-marseille-4.webp',              title: 'Méduses — Les souveraines des océans (ARTE) 4',                                 description: 'Documentaire ARTE — Méduses les souveraines des océans, Méditerranée et Calanques de Marseille', keywords: [...KW_ARTE, 'méduses', 'faune marine'] },
  { file: 'arte-meduses-souveraines-oceans-documentaire-marseille-5.webp',              title: 'Méduses — Les souveraines des océans (ARTE) 5',                                 description: 'Documentaire ARTE — Méduses les souveraines des océans, photographe sous-marin Karim Saari', keywords: [...KW_ARTE, 'méduses', 'faune marine'] },
  { file: 'marseille-marseilleveyre-avant-rugulopteryx-fonds-marins.webp',              title: 'Marseilleveyre avant Rugulopteryx okamurae',                                    description: 'Fonds marins de Marseilleveyre avant l\'invasion de Rugulopteryx okamurae — Calanques de Marseille', keywords: KW_RUGULO },
  { file: 'marseille-marseilleveyre-avant-rugulopteryx-biodiversite-2.webp',            title: 'Marseilleveyre — biodiversité avant algue invasive',                             description: 'Biodiversité marine de Marseilleveyre avant l\'invasion de Rugulopteryx okamurae — fonds rocheux naturels', keywords: KW_RUGULO },
  { file: 'marseille-marseilleveyre-apres-rugulopteryx-algue-invasive.webp',            title: 'Marseilleveyre après Rugulopteryx okamurae',                                    description: 'Fonds marins de Marseilleveyre après l\'invasion de Rugulopteryx okamurae — algue invasive recouvrant tout', keywords: [...KW_RUGULO, 'espèce invasive', 'alerte environnementale'] },
  { file: 'marseille-marseilleveyre-apres-rugulopteryx-tapis-algues-2.webp',            title: 'Marseilleveyre — tapis algues invasives Rugulopteryx',                          description: 'Tapis d\'algues invasives Rugulopteryx okamurae sur les fonds de Marseilleveyre — Calanques de Marseille', keywords: [...KW_RUGULO, 'espèce invasive', 'alerte environnementale'] },
  { file: 'karim-saari-photographe-sous-marin-marseille-dark-massilia.webp',            title: 'Karim Saari — Photographe sous-marin Marseille',                                description: 'Portrait de Karim Saari, photographe sous-marin et activiste environnemental à Marseille — Dark Massilia', keywords: KW_DIVERS },
  { file: 'karim-saari-photographe-sous-marin-marseille-dark-massilia_480w.webp',       title: 'Karim Saari — Photographe sous-marin Marseille (480w)',                         description: 'Portrait de Karim Saari, photographe sous-marin et activiste environnemental à Marseille — Dark Massilia', keywords: KW_DIVERS },
  { file: 'karim-saari-marseille-dark-massilia-9ans-celebration-projet-sentinelle.webp', title: '9 ans de Dark Massilia — Projet Sentinelle Marseille',                         description: '9 années d\'engagement de Dark Massilia pour la dépollution marine et la sensibilisation environnementale à Marseille', keywords: KW_DIVERS },
  { file: 'karim-saari-marseille-130000-sentinelles-calanques-depollution.webp',        title: '130 000 Sentinelles — Marseille Calanques',                                     description: 'Mobilisation de 130 000 citoyens sentinelles pour la protection des Calanques de Marseille — Dark Massilia', keywords: KW_MISSIONS },
];

// ── Main ──────────────────────────────────────────────────────────────────────
try {
  execSync(`"${EXIFTOOL_PATH}" -ver`, { stdio: 'pipe' });
} catch {
  console.error(`❌  ExifTool introuvable à : ${EXIFTOOL_PATH}`);
  process.exit(1);
}

const env = loadEnv();
if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌  VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY absents dans .env');
  process.exit(1);
}

const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
console.log(`🔧  Injection XMP — source : Supabase${NEW_ONLY ? '  [mode --new-only]' : ''}\n`);

const cache = loadCache();

// Galeries depuis la DB (source de vérité)
await processGallery(sb, 'photos_sous_marine', keywordsForSousMarine, cache);
await processGallery(sb, 'photos_paysage',     keywordsForPaysage,     cache);

// Images presse / médias / divers (hors galeries)
console.log('\n📁 MISC — presse / médias / divers');
let okMisc = 0, cachedMisc = 0, errMisc = 0;
for (const { file, title, description, keywords, geo } of MISC_FILES) {
  const filePath = path.join(IMAGES_ROOT, file).replace(/\//g, '\\');
  if (!existsSync(filePath)) { console.log(`  ⚠  Introuvable : ${file}`); continue; }
  if (isAlreadyProcessed(cache, filePath)) { cachedMisc++; continue; }
  const resolvedGeo = geo === null ? null : (geo ?? GEO_MARSEILLE);
  try {
    runExiftool(filePath, title, description, keywords, resolvedGeo);
    markProcessed(cache, filePath);
    console.log(`  ✓  ${file}`);
    okMisc++;
  } catch (e) {
    console.log(`  ✗  ${file} → ${e.message}`);
    errMisc++;
  }
}
const cachedMiscMsg = cachedMisc > 0 ? `, ${cachedMisc} déjà traités (cache)` : '';
console.log(`  → ${okMisc} OK, ${errMisc} erreurs${cachedMiscMsg}`);

saveCache(cache);
console.log('\n✅  Terminé — relance npm run build:full + FTP');
