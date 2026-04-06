/**
 * rename-legacy-photos.js
 * Rattrapage des photos uploadées avec des noms Facebook (IDs numériques).
 * Renomme les fichiers WebP + thumbnails 800w, et met à jour les chemins en Supabase.
 *
 * Usage :
 *   node scripts/rename-legacy-photos.js          → dry-run (aucune modif)
 *   node scripts/rename-legacy-photos.js --apply  → applique les changements
 */

import { createClient } from '@supabase/supabase-js';
import { rename, access } from 'node:fs/promises';
import { join } from 'node:path';
import { constants } from 'node:fs';

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://bzlllfmpojcybuyuemdx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bGxsZm1wb2pjeWJ1eXVlbWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzQ1NjQsImV4cCI6MjA4NjYxMDU2NH0.A1nGk9fsNgukxo4WggzFF-lgOFHDaCJS0phbeldx6xY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ROOT     = process.cwd();
const IMG_DIR  = join(ROOT, 'public/images');
const APPLY    = process.argv.includes('--apply');

// Mapping catégorie → préfixe SEO du nom de fichier
const SEO_PREFIX = {
  caracterisation : 'marseille-dark-massilia-caracterisation-dechets',
  depollution     : 'marseille-dark-massilia-depollution-sous-marine',
  biodiversite    : 'marseille-dark-massilia-biodiversite-fonds-marins',
};

// Tables à traiter
const TABLES = ['photos_sous_marine'];

// Regex : nom de fichier Facebook (longue suite de chiffres + tirets)
const LEGACY_PATTERN = /^\d[\d-]+-n\.webp$/;

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fileExists(path) {
  try { await access(path, constants.F_OK); return true; }
  catch { return false; }
}

function newFilename(categorie, uid) {
  const prefix = SEO_PREFIX[categorie] ?? `marseille-dark-massilia-${categorie}`;
  return `${prefix}-${uid}.webp`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍 rename-legacy-photos — mode ${APPLY ? '✏️  APPLY' : '🧪 DRY-RUN'}\n`);

  let totalFound = 0;
  let totalRenamed = 0;
  let totalErrors = 0;

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select('uid, src, categorie');
    if (error) { console.error(`❌ Erreur lecture ${table} :`, error.message); continue; }

    const legacy = data.filter(row => {
      const filename = row.src.split('/').pop();
      return LEGACY_PATTERN.test(filename);
    });

    if (legacy.length === 0) {
      console.log(`✅ ${table} — aucun fichier legacy trouvé`);
      continue;
    }

    console.log(`📋 ${table} — ${legacy.length} fichier(s) à renommer :\n`);
    totalFound += legacy.length;

    for (const row of legacy) {
      const oldFilename  = row.src.split('/').pop();
      const srcPrefix    = row.src.replace(`/${oldFilename}`, ''); // ex: /images
      const newName      = newFilename(row.categorie, row.uid);
      const newSrc       = `${srcPrefix}/${newName}`;

      const oldPath      = join(IMG_DIR, oldFilename);
      const newPath      = join(IMG_DIR, newName);
      const oldThumb     = join(IMG_DIR, '800w', oldFilename);
      const newThumb     = join(IMG_DIR, '800w', newName);

      console.log(`  ${row.uid} [${row.categorie}]`);
      console.log(`    ${oldFilename}`);
      console.log(`  → ${newName}`);

      // Vérifications
      if (!(await fileExists(oldPath))) {
        console.log(`    ⚠️  fichier introuvable sur disque → skip\n`);
        totalErrors++;
        continue;
      }
      if (await fileExists(newPath)) {
        console.log(`    ⚠️  destination existe déjà → skip\n`);
        totalErrors++;
        continue;
      }

      if (APPLY) {
        // Renommer le WebP principal
        await rename(oldPath, newPath);

        // Renommer le thumbnail 800w s'il existe
        if (await fileExists(oldThumb)) {
          await rename(oldThumb, newThumb);
          console.log(`    📐 thumbnail 800w renommé`);
        }

        // Mettre à jour Supabase
        const { error: updateErr } = await supabase
          .from(table)
          .update({ src: newSrc })
          .eq('uid', row.uid);

        if (updateErr) {
          console.log(`    ❌ Supabase update échoué : ${updateErr.message}`);
          totalErrors++;
        } else {
          console.log(`    ✅ Supabase mis à jour → ${newSrc}\n`);
          totalRenamed++;
        }
      } else {
        console.log(`    [dry-run] renommage non effectué\n`);
      }
    }
  }

  console.log('─'.repeat(50));
  console.log(`📊 Résultat : ${totalFound} trouvé(s), ${totalRenamed} renommé(s), ${totalErrors} erreur(s)`);
  if (!APPLY && totalFound > 0) {
    console.log('\n💡 Lance avec --apply pour appliquer les changements :');
    console.log('   node scripts/rename-legacy-photos.js --apply\n');
  }
}

main().catch(console.error);
