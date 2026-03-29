/**
 * gsc-collect.js — Collecte quotidienne GSC → Supabase
 *   · gsc_daily         : agrégat global (clics, impressions, CTR, position)
 *   · gsc_daily_queries : détail par mot-clé tracé
 *
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

// ── Mots-clés à suivre (synchronisé avec weekly-seo-digest.js) ──────────────
const TRACKED_QUERIES = [
  // Marque
  'karim saari',
  'dark massilia',
  'projet sentinelle',
  'projet sentinelle marseille',
  'team oxygen',
  // Longue traîne locale
  'calanques marseille',
  'dépollution marine marseille',
  'dépollution calanques marseille',
  'nettoyage calanques',
  'photographe sous-marin marseille',
  'photographe sous-marin calanques',
  'photographe paysages marseille',
  'photographe de paysages marseille',
  'photographe environnemental marseille',
  'bénévolat dépollution marseille',
  'bénévolat écologique marseille',
  'association dépollution marine marseille',
  // ARTE
  'documentaire arte sauver marseille',
  'documentaire arte méduses souveraines',
  'yann arthus-bertrand les français karim saari',
  // Éditorial
  'ramassage plastique mer',
  'pollution plastique méditerranée',
  'microplastiques méditerranée',
  'rugulopteryx okamurae calanques',
  'posidonie calanques',
];

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

// ── Collecte agrégat global ───────────────────────────────────────────────────
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

// ── Collecte par mot-clé tracé ────────────────────────────────────────────────
async function collectQueries(token, date) {
  // Un seul appel GSC : toutes les requêtes du jour, jusqu'à 5000 lignes
  const data = await gscQuery(token, {
    startDate: date, endDate: date, dimensions: ['query'], rowLimit: 5000,
  });
  const rowMap = Object.fromEntries(
    (data.rows || []).map(r => [r.keys[0].toLowerCase(), r])
  );

  const rows = TRACKED_QUERIES.map(q => {
    const r = rowMap[q.toLowerCase()];
    return {
      date,
      query:       q,
      clicks:      r?.clicks      ?? 0,
      impressions: r?.impressions ?? 0,
      ctr:         r?.ctr         ?? 0,
      position:    r ? +(r.position.toFixed(2)) : 0,
    };
  });

  const { error } = await supabase
    .from('gsc_daily_queries')
    .upsert(rows, { onConflict: 'date,query' });
  if (error) throw new Error(`gsc_daily_queries ${date}: ${error.message}`);

  const found = rows.filter(r => r.impressions > 0).length;
  console.log(`  ✅ requêtes — ${found}/${TRACKED_QUERIES.length} avec données`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  const now          = Date.now();
  const backfillDays = parseInt(process.env.BACKFILL_DAYS || '1', 10);

  const dates = Array.from({ length: backfillDays }, (_, i) =>
    formatDate(new Date(now - (2 + i) * 86400000))
  ).reverse();

  console.log(`📊 Collecte GSC → Supabase (${dates.length} jour${dates.length > 1 ? 's' : ''})...`);
  const token = await getAccessToken();

  for (const date of dates) {
    console.log(`\n📅 ${date}`);
    await collectGlobal(token, date);
    await collectQueries(token, date);
  }
  console.log('\n✅ Collecte terminée.');
})().catch(e => { console.error('❌', e.message); process.exit(1); });
