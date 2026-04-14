/**
 * scripts/import-facebook-insights.js
 *
 * Importe tous les fichiers Facebook_Group_Insights_*.csv du dossier data/
 * dans la table Supabase `facebook_group_insights`.
 *
 * Usage :
 *   node scripts/import-facebook-insights.js
 *
 * Workflow :
 *   1. Télécharger le CSV depuis Facebook Admin → Statistiques → Télécharger
 *   2. Déposer le fichier dans data/ (nom horodaté, ex: Facebook_Group_Insights_4-13-2026.csv)
 *   3. Lancer ce script
 */

import { createClient }  from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname }             from 'node:path';
import { fileURLToPath }             from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = join(__dirname, '..', 'data');
const START_DATE = '2026-01-01';

// ── Supabase ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://bzlllfmpojcybuyuemdx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bGxsZm1wb2pjeWJ1eXVlbWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzQ1NjQsImV4cCI6MjA4NjYxMDU2NH0.A1nGk9fsNgukxo4WggzFF-lgOFHDaCJS0phbeldx6xY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Scan des fichiers CSV ─────────────────────────────────────────────────────
const files = readdirSync(DATA_DIR)
  .filter(f => f.startsWith('Facebook_Group_Insights_') && f.endsWith('.csv'))
  .map(f => join(DATA_DIR, f));

if (files.length === 0) {
  console.error('❌ Aucun fichier Facebook_Group_Insights_*.csv trouvé dans data/');
  process.exit(1);
}

console.log(`📂 ${files.length} fichier(s) trouvé(s) :`);
files.forEach(f => console.log(`   → ${f.split(/[\\/]/).pop()}`));

// ── Parse des CSV ─────────────────────────────────────────────────────────────
// Colonnes : Date, Participant, Membres actifs, Vu, Publications, Commentaires, Réactions
const rowsMap = new Map(); // date → row (déduplique si CSV se chevauchent)

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const lines   = content.split('\n').slice(1); // ignorer l'en-tête

  for (const line of lines) {
    if (!line.trim()) continue;

    // Parser les champs CSV entre guillemets
    const cols = line.split('","').map(c => c.replace(/^"|"$/g, '').trim());
    const [date, participants, active_members, views, publications, comments, reactions] = cols;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (date < START_DATE) continue;

    rowsMap.set(date, {
      date,
      participants:    parseInt(participants)    || 0,
      active_members:  parseInt(active_members)  || 0,
      views:           parseInt(views)           || 0,
      publications:    parseInt(publications)    || 0,
      comments:        parseInt(comments)        || 0,
      reactions:       parseInt(reactions)       || 0,
    });
  }
}

const rows = Array.from(rowsMap.values()).sort((a, b) => a.date.localeCompare(b.date));

if (rows.length === 0) {
  console.error(`❌ Aucune donnée valide trouvée après ${START_DATE}`);
  process.exit(1);
}

console.log(`\n📊 ${rows.length} jour(s) à importer (${rows[0].date} → ${rows[rows.length - 1].date})`);

// Stats rapides
const totalViews    = rows.reduce((s, r) => s + r.views, 0);
const peakDay       = rows.reduce((best, r) => r.views > best.views ? r : best, rows[0]);
const avgViews      = Math.round(totalViews / rows.length);

console.log(`   Vues totales  : ${totalViews.toLocaleString('fr-FR')}`);
console.log(`   Vues moy/jour : ${avgViews.toLocaleString('fr-FR')}`);
console.log(`   Pic           : ${peakDay.date} — ${peakDay.views.toLocaleString('fr-FR')} vues`);

// ── Upsert Supabase ───────────────────────────────────────────────────────────
console.log('\n⬆️  Upsert vers Supabase...');

const BATCH = 100;
let upserted = 0;

for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH);
  const { error } = await supabase
    .from('facebook_group_insights')
    .upsert(batch, { onConflict: 'date' });

  if (error) {
    console.error(`❌ Erreur Supabase (batch ${i}–${i + BATCH}) :`, error.message);
    process.exit(1);
  }
  upserted += batch.length;
}

console.log(`✅ Import terminé — ${upserted} ligne(s) upsertées dans facebook_group_insights`);
