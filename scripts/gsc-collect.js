/**
 * gsc-collect.js — Collecte GSC → Supabase
 *   · gsc_daily          : agrégat global quotidien (clics, impressions, CTR, position)
 *   · gsc_weekly_queries : détail par mot-clé tracé sur 7 jours (dimanche uniquement)
 *
 * Usage quotidien  : node scripts/gsc-collect.js
 * Backfill jours   : BACKFILL_DAYS=28 node scripts/gsc-collect.js
 * Backfill semaines: BACKFILL_WEEKS=12 node scripts/gsc-collect.js
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

// ── Helpers ──────────────────────────────────────────────────────────────────
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

async function gscQuery(token, body) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  return res.json();
}

// ── Collecte agrégat global (quotidien) ──────────────────────────────────────
async function collectGlobal(token, date) {
  const data = await gscQuery(token, {
    startDate: date, endDate: date, dimensions: [], rowLimit: 1,
  });
  const row = data.rows?.[0];
  if (!row) { console.log(`  ⚠️  ${date} — pas de données globales`); return; }

  const { error } = await supabase.from('gsc_daily').upsert({
    date,
    clicks:      row.clicks,
    impressions: row.impressions,
    ctr:         row.ctr,
    position:    row.position,
  }, { onConflict: 'date' });
  if (error) throw new Error(`gsc_daily ${date}: ${error.message}`);
  console.log(`  ✅ global — ${row.clicks} clics / ${row.impressions} impr. / pos. ${row.position.toFixed(1)}`);
}

// ── Collecte top requêtes réelles (hebdomadaire, fenêtre 7 jours) ────────────
async function collectWeeklyQueries(token, weekStart) {
  const weekEnd = formatDate(new Date(new Date(weekStart).getTime() + 6 * 86400000));

  const data = await gscQuery(token, {
    startDate: weekStart, endDate: weekEnd,
    dimensions: ['query'],
    rowLimit: 50,
  });

  if (data.error) throw new Error(`GSC API: ${JSON.stringify(data.error)}`);
  const rows = (data.rows || []).map(r => ({
    week_start:  weekStart,
    query:       r.keys[0],
    clicks:      r.clicks,
    impressions: r.impressions,
    ctr:         r.ctr,
    position:    +(r.position.toFixed(2)),
  }));

  if (rows.length === 0) {
    console.log(`  ⚠️  Semaine du ${weekStart} — aucune requête retournée par GSC`);
    return;
  }

  const { error } = await supabase
    .from('gsc_weekly_queries')
    .upsert(rows, { onConflict: 'week_start,query' });
  if (error) throw new Error(`gsc_weekly_queries ${weekStart}: ${error.message}`);

  console.log(`  ✅ ${rows.length} requêtes stockées (semaine du ${weekStart})`);
  rows.slice(0, 5).forEach(r =>
    console.log(`     "${r.query}" — ${r.impressions} impr. / pos. ${r.position}`)
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  const now          = Date.now();
  const backfillDays = parseInt(process.env.BACKFILL_DAYS  || '1',  10);
  const backfillWeeks= parseInt(process.env.BACKFILL_WEEKS || '0',  10);

  const token = await getAccessToken();

  // ── Collecte quotidienne globale ─────────────────────────────────────────
  const dates = Array.from({ length: backfillDays }, (_, i) =>
    formatDate(new Date(now - (2 + i) * 86400000))
  ).reverse();

  console.log(`📊 Collecte globale GSC → gsc_daily (${dates.length} jour${dates.length > 1 ? 's' : ''})...`);
  for (const date of dates) {
    console.log(`\n📅 ${date}`);
    await collectGlobal(token, date);
  }

  // ── Collecte hebdomadaire requêtes ───────────────────────────────────────
  const weeksToCollect = backfillWeeks > 0 ? backfillWeeks : 1;
  // week_start = lundi de la semaine (J-2 arrondi au lundi précédent)
  const refDate  = new Date(now - 2 * 86400000);
  const dayOfWeek = refDate.getUTCDay(); // 0=dim, 1=lun...
  const daysToLastMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  const lastMonday = new Date(refDate.getTime() - daysToLastMonday * 86400000);

  const weeks = Array.from({ length: weeksToCollect }, (_, i) =>
    formatDate(new Date(lastMonday.getTime() - i * 7 * 86400000))
  ).reverse();

  console.log(`\n📊 Collecte requêtes GSC → gsc_weekly_queries (${weeks.length} semaine${weeks.length > 1 ? 's' : ''})...`);
  for (const weekStart of weeks) {
    console.log(`\n📅 Semaine du ${weekStart}`);
    await collectWeeklyQueries(token, weekStart);
  }

  console.log('\n✅ Collecte terminée.');
})().catch(e => { console.error('❌', e.message); process.exit(1); });
