/**
 * fix-empty-titles.js — Rattrappage des photos sans titre
 * Remplit title + alt à partir du nom de fichier (src) pour toutes les photos avec title = ''
 * Usage : node scripts/fix-empty-titles.js
 */

import { createClient } from '@supabase/supabase-js';
import { basename, extname } from 'node:path';

const SUPABASE_URL = 'https://bzlllfmpojcybuyuemdx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bGxsZm1wb2pjeWJ1eXVlbWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzQ1NjQsImV4cCI6MjA4NjYxMDU2NH0.A1nGk9fsNgukxo4WggzFF-lgOFHDaCJS0phbeldx6xY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function titleFromSrc(src) {
  const file = basename(src, extname(src)); // ex: "marseille-calanques-poulpe-apnee"
  return file.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

async function fixTable(table) {
  const { data, error } = await supabase
    .from(table)
    .select('uid, src, title')
    .eq('title', '');

  if (error) { console.error(`❌ ${table} :`, error.message); return; }
  if (!data.length) { console.log(`✅ ${table} : aucune photo sans titre`); return; }

  console.log(`\n📋 ${table} — ${data.length} photo(s) à corriger`);
  let ok = 0;

  for (const row of data) {
    const defaultTitle = titleFromSrc(row.src);
    const { error: updateError } = await supabase
      .from(table)
      .update({ title: defaultTitle, alt: defaultTitle })
      .eq('uid', row.uid);

    if (updateError) {
      console.log(`  ✗ ${row.uid} → ${updateError.message}`);
    } else {
      console.log(`  ✓ ${row.uid} → "${defaultTitle}"`);
      ok++;
    }
  }
  console.log(`  → ${ok}/${data.length} mis à jour`);
}

console.log('🔧 Rattrappage des titres manquants...\n');
await fixTable('photos_paysage');
await fixTable('photos_sous_marine');
console.log('\n✅ Terminé');
