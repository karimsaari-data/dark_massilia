/**
 * gsc-collect.js — Collecte quotidienne GSC → Supabase table gsc_daily
 * Usage normal  : node scripts/gsc-collect.js
 * Backfill 28j  : BACKFILL_DAYS=28 node scripts/gsc-collect.js
 */

import { createClient } from '@supabase/supabase-js';

const GSC_SITE     = 'sc-domain:karimsaari.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ VITE_SUPABASE_URL ou SUPABASE_SERVICE_KEY manquant');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function formatDate(d) { return d.toISOString().slice(0, 10); }

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GSC_CLIENT_ID,
      client_secret: process.env.GSC_CLIENT_SECRET,
      refresh_token: process.env.GSC_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token GSC: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function fetchDay(token, date) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: date, endDate: date, dimensions: [], rowLimit: 1 }),
    }
  );
  return res.json();
}

async function collectDate(token, date) {
  const data = await fetchDay(token, date);
  const row  = data.rows?.[0];
  if (!row) {
    console.log(`  ⚠️  ${date} — pas de données GSC`);
    return;
  }
  const { error } = await supabase.from('gsc_daily').upsert({
    date,
    clicks:      row.clicks,
    impressions: row.impressions,
    ctr:         row.ctr,
    position:    row.position,
  }, { onConflict: 'date' });
  if (error) throw new Error(`Supabase upsert ${date}: ${error.message}`);
  console.log(`  ✅ ${date} — ${row.clicks} clics / ${row.impressions} impr. / pos. ${row.position.toFixed(1)}`);
}

(async () => {
  const now          = Date.now();
  const backfillDays = parseInt(process.env.BACKFILL_DAYS || '1', 10);

  // GSC a un délai de ~2 jours, on part de J-2
  const dates = Array.from({ length: backfillDays }, (_, i) =>
    formatDate(new Date(now - (2 + i) * 86400000))
  ).reverse();

  console.log(`📊 Collecte GSC → Supabase (${dates.length} jour${dates.length > 1 ? 's' : ''})...`);
  const token = await getAccessToken();

  for (const date of dates) {
    await collectDate(token, date);
  }
  console.log('✅ Collecte terminée.');
})().catch(e => { console.error('❌', e.message); process.exit(1); });
