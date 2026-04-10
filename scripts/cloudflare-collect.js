/**
 * cloudflare-collect.js — Collecte Cloudflare Analytics → Supabase
 *   · cf_daily           : métriques globales quotidiennes
 *   · cf_daily_countries : top 10 pays
 *   · cf_hourly          : agrégats par heure (0-23) — visiteurs, pages vues, requêtes…
 *   · cf_daily_bots      : répartition humain / crawlers / bots
 *
 * Usage quotidien  : node scripts/cloudflare-collect.js
 * Backfill jours   : BACKFILL_DAYS=30 node scripts/cloudflare-collect.js
 */

import { createClient } from '@supabase/supabase-js';

const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ZONE_ID   = process.env.CLOUDFLARE_ZONE_ID || '5b01c0fff9eea9bfc96073071e8340db';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!CF_API_TOKEN) { console.error('❌ CLOUDFLARE_API_TOKEN manquant'); process.exit(1); }
if (!SUPABASE_URL) { console.error('❌ VITE_SUPABASE_URL manquant'); process.exit(1); }
if (!SUPABASE_KEY) { console.error('❌ SUPABASE_SERVICE_KEY manquant'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function formatDate(d) { return d.toISOString().slice(0, 10); }

function daysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return formatDate(d);
}

function dateToISO(date, endOfDay = false) {
  return endOfDay ? `${date}T23:59:59Z` : `${date}T00:00:00Z`;
}

async function cfGraphQL(query) {
  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(`CF GraphQL: ${JSON.stringify(json.errors)}`);
  return json.data;
}

async function collectDay(date) {
  // ── Métriques globales ────────────────────────────────────────────────────────
  const data = await cfGraphQL(`{
    viewer {
      zones(filter: {zoneTag: "${CF_ZONE_ID}"}) {
        httpRequests1dGroups(
          limit: 1
          filter: {date_geq: "${date}", date_leq: "${date}"}
        ) {
          dimensions { date }
          sum { requests pageViews cachedRequests bytes cachedBytes threats }
          uniq { uniques }
        }
      }
    }
  }`);

  const zone = data?.viewer?.zones?.[0];
  const day  = zone?.httpRequests1dGroups?.[0];

  if (!day) {
    console.log(`  ⚠️  Pas de données CF pour ${date}`);
    return;
  }

  const row = {
    date,
    unique_visitors: day.uniq.uniques,
    page_views:      day.sum.pageViews,
    requests:        day.sum.requests,
    cached_requests: day.sum.cachedRequests,
    bytes:           day.sum.bytes,
    cached_bytes:    day.sum.cachedBytes,
    threats:         day.sum.threats,
  };

  const { error } = await supabase.from('cf_daily').upsert(row, { onConflict: 'date' });
  if (error) throw new Error(`cf_daily upsert: ${error.message}`);

  // ── Pays (graceful) ───────────────────────────────────────────────────────────
  try {
    const dataC = await cfGraphQL(`{
      viewer {
        zones(filter: {zoneTag: "${CF_ZONE_ID}"}) {
          httpRequests1dByCountryGroups(
            limit: 10
            orderBy: [sum_requests_DESC]
            filter: {date_geq: "${date}", date_leq: "${date}"}
          ) {
            dimensions { clientCountryName }
            sum { requests bytes threats }
          }
        }
      }
    }`);

    const countryRows = (dataC?.viewer?.zones?.[0]?.httpRequests1dByCountryGroups || [])
      .map(r => ({ date, country: r.dimensions.clientCountryName, requests: r.sum.requests, bytes: r.sum.bytes, threats: r.sum.threats }))
      .filter(r => r.country);

    if (countryRows.length) {
      await supabase.from('cf_daily_countries').delete().eq('date', date);
      const { error: errC } = await supabase.from('cf_daily_countries').insert(countryRows);
      if (errC) console.warn(`  ⚠️  cf_daily_countries: ${errC.message}`);
    }
  } catch (e) {
    console.warn(`  ⚠️  Pays CF ignorés (${e.message})`);
  }

  // ── Heures (graceful) ─────────────────────────────────────────────────────────
  try {
    const dataH = await cfGraphQL(`{
      viewer {
        zones(filter: {zoneTag: "${CF_ZONE_ID}"}) {
          httpRequests1hGroups(
            limit: 24
            orderBy: [datetimeHour_ASC]
            filter: {datetimeHour_geq: "${dateToISO(date)}", datetimeHour_leq: "${dateToISO(date, true)}"}
          ) {
            dimensions { datetimeHour }
            sum { requests pageViews cachedRequests bytes threats }
            uniq { uniques }
          }
        }
      }
    }`);

    const hourRows = (dataH?.viewer?.zones?.[0]?.httpRequests1hGroups || []).map(r => ({
      date,
      hour:            new Date(r.dimensions.datetimeHour).getUTCHours(),
      unique_visitors: r.uniq.uniques,
      page_views:      r.sum.pageViews,
      requests:        r.sum.requests,
      cached_requests: r.sum.cachedRequests,
      bytes:           r.sum.bytes,
      threats:         r.sum.threats,
    }));

    if (hourRows.length) {
      await supabase.from('cf_hourly').delete().eq('date', date);
      const { error: errH } = await supabase.from('cf_hourly').insert(hourRows);
      if (errH) console.warn(`  ⚠️  cf_hourly: ${errH.message}`);
      else console.log(`     ⏰ ${hourRows.length} tranches horaires stockées`);
    }
  } catch (e) {
    console.warn(`  ⚠️  Horaires CF ignorés (${e.message})`);
  }

  // ── Bots (graceful) ───────────────────────────────────────────────────────────
  try {
    const dataB = await cfGraphQL(`{
      viewer {
        zones(filter: {zoneTag: "${CF_ZONE_ID}"}) {
          httpRequestsAdaptiveGroups(
            limit: 10
            filter: {datetime_geq: "${dateToISO(date)}", datetime_leq: "${dateToISO(date, true)}"}
            orderBy: [count_DESC]
          ) {
            count
            dimensions { clientIPClass }
          }
        }
      }
    }`);

    const groups = { human: 0, crawler: 0, bot: 0 };
    for (const r of (dataB?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups || [])) {
      const cls = r.dimensions.clientIPClass || '';
      if (cls === 'clean')                                                          groups.human   += r.count;
      else if (['searchEngine','monitoringService','backupService'].includes(cls))  groups.crawler += r.count;
      else                                                                          groups.bot     += r.count;
    }
    const total = groups.human + groups.crawler + groups.bot;
    if (total > 0) {
      const { error: errB } = await supabase.from('cf_daily_bots').upsert({
        date,
        human_requests:   groups.human,
        crawler_requests: groups.crawler,
        bot_requests:     groups.bot,
        total_requests:   total,
      }, { onConflict: 'date' });
      if (errB) console.warn(`  ⚠️  cf_daily_bots: ${errB.message}`);
      else {
        const humanPct = Math.round((groups.human / total) * 100);
        console.log(`     🤖 Bots : humain ${humanPct}%, crawlers ${Math.round((groups.crawler/total)*100)}%, bots ${Math.round((groups.bot/total)*100)}%`);
      }
    }
  } catch (e) {
    console.warn(`  ⚠️  Bots CF ignorés (${e.message})`);
  }

  const cacheRate = row.requests > 0 ? ((row.cached_requests / row.requests) * 100).toFixed(1) : '0.0';
  const bw = (row.bytes / 1024 / 1024).toFixed(1);
  console.log(`  ✅ ${date} — ${row.unique_visitors} visiteurs, ${row.page_views} pages vues, ${bw} MB, cache ${cacheRate}%, ${row.threats} menaces`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  console.log('☁️  Collecte Cloudflare Analytics → Supabase\n');

  const backfillDays = parseInt(process.env.BACKFILL_DAYS || '1', 10);

  if (backfillDays > 1) {
    console.log(`🔄 Backfill ${backfillDays} jours (J-1 à J-${backfillDays})...\n`);
    for (let i = 1; i <= backfillDays; i++) {
      const date = daysAgo(i);
      process.stdout.write(`  📅 ${date}\n`);
      try { await collectDay(date); }
      catch (e) { console.error(`  ❌ ${e.message}`); }
    }
  } else {
    const date = daysAgo(1);
    console.log(`📅 Collecte J-1 : ${date}`);
    await collectDay(date);
  }

  console.log('\n✅ Collecte Cloudflare terminée.');
})().catch(e => { console.error('❌', e.message); process.exit(1); });
