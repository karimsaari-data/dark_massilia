/**
 * cloudflare-report.js — Rapport hebdomadaire Cloudflare → Brevo
 *
 * Lit les 7 derniers jours depuis Supabase (cf_daily + cf_daily_countries)
 * Compare avec la semaine précédente (J-8 à J-14)
 * Envoie un email HTML via Brevo
 *
 * Usage : npm run cloudflare-report
 * Variables : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (ou SUPABASE_SERVICE_KEY), BREVO_API_KEY
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TO      = 'email@karimsaari.com';
const BREVO_FROM    = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant');
  process.exit(1);
}
if (!BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY manquant');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d) { return d.toISOString().slice(0, 10); }

function dateRange(startOffset, endOffset) {
  const end   = new Date(); end.setUTCDate(end.getUTCDate() - startOffset);
  const start = new Date(); start.setUTCDate(start.getUTCDate() - endOffset);
  return { from: formatDate(start), to: formatDate(end) };
}

function shortDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

function frDateRange(from, to) {
  const opts = { day: 'numeric', month: 'long' };
  const f = new Date(from + 'T12:00:00Z').toLocaleDateString('fr-FR', opts);
  const t = new Date(to   + 'T12:00:00Z').toLocaleDateString('fr-FR', { ...opts, year: 'numeric' });
  return `${f} – ${t}`;
}

function fmtBytes(b) {
  if (b >= 1024 * 1024 * 1024) return (b / 1024 / 1024 / 1024).toFixed(1) + ' GB';
  return (b / 1024 / 1024).toFixed(1) + ' MB';
}

function fmtNum(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('fr-FR').format(n);
}

function delta(curr, prev) {
  if (!prev || prev === 0) return null;
  return Math.round(((curr - prev) / prev) * 100);
}

function deltaHtml(pct) {
  if (pct == null) return '<span style="color:#bbb;font-size:10px">—</span>';
  const up    = pct >= 0;
  const color = up ? '#21c47b' : '#e85555';
  const arrow = up ? '▲' : '▼';
  return `<span style="color:${color};font-size:10px;font-weight:600">${arrow} ${Math.abs(pct)}%</span>`;
}

const CF_COUNTRY_NAMES = {
  'France': 'France', 'Belgium': 'Belgique', 'Switzerland': 'Suisse', 'Canada': 'Canada',
  'Germany': 'Allemagne', 'United Kingdom': 'Royaume-Uni', 'United States': 'États-Unis',
  'Spain': 'Espagne', 'Italy': 'Italie', 'Portugal': 'Portugal', 'Netherlands': 'Pays-Bas',
  'Morocco': 'Maroc', 'Tunisia': 'Tunisie', 'Algeria': 'Algérie', 'Luxembourg': 'Luxembourg',
  'Brazil': 'Brésil', 'Mexico': 'Mexique', 'Australia': 'Australie', 'Japan': 'Japon',
  'Reunion': 'La Réunion', 'Unknown': '—',
};
function cfCountryLabel(name) { return CF_COUNTRY_NAMES[name] || name || '—'; }

// ── Fetch Supabase ────────────────────────────────────────────────────────────

async function fetchWeek(from, to) {
  const { data, error } = await supabase
    .from('cf_daily')
    .select('*')
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true });
  if (error) throw new Error(`cf_daily: ${error.message}`);
  return data || [];
}

async function fetchCountriesForWeek(from, to) {
  const { data, error } = await supabase
    .from('cf_daily_countries')
    .select('country, requests, bytes, threats')
    .gte('date', from)
    .lte('date', to);
  if (error) return []; // graceful

  // Agréger par pays
  const map = {};
  for (const r of (data || [])) {
    if (!map[r.country]) map[r.country] = { country: r.country, requests: 0, bytes: 0, threats: 0 };
    map[r.country].requests += r.requests || 0;
    map[r.country].bytes    += r.bytes    || 0;
    map[r.country].threats  += r.threats  || 0;
  }
  return Object.values(map).sort((a, b) => b.requests - a.requests).slice(0, 8);
}

function sumWeek(rows) {
  return rows.reduce((acc, r) => ({
    unique_visitors:  acc.unique_visitors  + (r.unique_visitors  || 0),
    page_views:       acc.page_views       + (r.page_views       || 0),
    requests:         acc.requests         + (r.requests         || 0),
    cached_requests:  acc.cached_requests  + (r.cached_requests  || 0),
    bytes:            acc.bytes            + (r.bytes            || 0),
    cached_bytes:     acc.cached_bytes     + (r.cached_bytes     || 0),
    threats:          acc.threats          + (r.threats          || 0),
  }), { unique_visitors: 0, page_views: 0, requests: 0, cached_requests: 0, bytes: 0, cached_bytes: 0, threats: 0 });
}

// ── HTML Email ────────────────────────────────────────────────────────────────

function buildHtml({ thisWeek, prevWeek, thisSum, prevSum, countries, fromDate, toDate }) {

  function section(title, content) {
    return `
      <div style="margin-top:24px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#21c47b;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e8f8f0">${title}</div>
        ${content}
      </div>`;
  }

  function dataTable(headers, rows) {
    return `
      <table width="100%" cellpadding="0" cellspacing="0">
        <thead>
          <tr>${headers.map(h => `<th style="padding:4px 8px 4px 0;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:${h.align || 'left'};white-space:nowrap">${h.label}</th>`).join('')}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  const cacheRate = thisSum.requests > 0
    ? ((thisSum.cached_requests / thisSum.requests) * 100).toFixed(1) + '%'
    : '—';
  const prevCacheRate = prevSum && prevSum.requests > 0
    ? ((prevSum.cached_requests / prevSum.requests) * 100).toFixed(1) + '%'
    : null;

  // ── KPI bar ──
  const kpis = [
    { label: 'Visiteurs uniques', curr: thisSum.unique_visitors,  prev: prevSum?.unique_visitors,  fmt: fmtNum },
    { label: 'Pages vues',        curr: thisSum.page_views,       prev: prevSum?.page_views,       fmt: fmtNum },
    { label: 'Bande passante',    curr: thisSum.bytes,            prev: prevSum?.bytes,            fmt: fmtBytes },
    { label: 'Menaces bloquées',  curr: thisSum.threats,         prev: prevSum?.threats,          fmt: fmtNum },
  ];

  const kpiBar = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">
      <tr>
        ${kpis.map(k => `
          <td align="center" width="25%" style="padding:8px 4px">
            <div style="background:#f8f9fa;border-radius:8px;padding:12px 8px;border-top:3px solid #21c47b">
              <div style="font-size:20px;font-weight:700;color:#1a1a1a">${k.fmt(k.curr)}</div>
              <div style="font-size:10px;color:#666;margin-top:2px">${k.label}</div>
              <div style="margin-top:4px">${deltaHtml(delta(k.curr, k.prev))}</div>
            </div>
          </td>
        `).join('')}
      </tr>
    </table>`;

  // ── Métriques secondaires ──
  const secondaryBar = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0">
      <tr>
        ${[
          ['Requêtes totales', fmtNum(thisSum.requests),  delta(thisSum.requests, prevSum?.requests)],
          ['Cache rate',       cacheRate,                  prevCacheRate ? null : null],
          ['Bande passante mise en cache', fmtBytes(thisSum.cached_bytes), delta(thisSum.cached_bytes, prevSum?.cached_bytes)],
        ].map(([label, value, d]) => `
          <td align="center" width="33%" style="padding:6px 4px">
            <div style="background:#f8f9fa;border-radius:6px;padding:10px 8px">
              <div style="font-size:15px;font-weight:600;color:#333">${value}</div>
              <div style="font-size:10px;color:#999;margin-top:2px">${label}</div>
              ${d != null ? `<div style="margin-top:3px">${deltaHtml(d)}</div>` : ''}
            </div>
          </td>
        `).join('')}
      </tr>
    </table>`;

  // ── Graphique barres 7 jours (requêtes + visiteurs) ──
  const maxReq = Math.max(...thisWeek.map(d => d.requests || 0), 1);
  const maxVis = Math.max(...thisWeek.map(d => d.unique_visitors || 0), 1);

  const chartCols = thisWeek.map(d => {
    const hReq = Math.max(4, Math.round(((d.requests || 0) / maxReq) * 80));
    const hVis = Math.max((d.unique_visitors || 0) > 0 ? 4 : 0, Math.round(((d.unique_visitors || 0) / maxVis) * 80));
    return `
      <td align="center" valign="bottom" style="width:${Math.floor(100/thisWeek.length)}%;padding:0 2px">
        <div style="height:88px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center">
          <div style="width:28px;height:${hReq}px;background:rgba(33,196,123,0.2);border-radius:3px 3px 0 0;position:relative">
            ${(d.unique_visitors || 0) > 0 ? `<div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:10px;height:${hVis}px;background:#21c47b;border-radius:2px 2px 0 0"></div>` : ''}
          </div>
        </div>
        <div style="font-size:10px;font-weight:600;color:#21c47b;margin-top:3px">${fmtNum(d.unique_visitors || 0)}</div>
        <div style="font-size:9px;color:#bbb;margin-top:2px;white-space:nowrap">${shortDate(d.date)}</div>
      </td>`;
  }).join('');

  const chart7 = `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:2px solid #eee">
      <tr>${chartCols}</tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">
      <tr>
        <td style="font-size:10px;color:#999">
          <span style="display:inline-block;width:10px;height:10px;background:rgba(33,196,123,0.2);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Requêtes
          &nbsp;
          <span style="display:inline-block;width:10px;height:10px;background:#21c47b;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Visiteurs uniques
        </td>
        <td align="right" style="font-size:10px;color:#bbb">max req. : ${fmtNum(maxReq)}</td>
      </tr>
    </table>`;

  // ── Tableau détaillé 7 jours ──
  const weekRows = thisWeek.map(d => {
    const cr = d.requests > 0 ? ((d.cached_requests / d.requests) * 100).toFixed(0) + '%' : '—';
    return `
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:5px 0;font-size:12px;color:#333;white-space:nowrap">${shortDate(d.date)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right;font-weight:600;color:#21c47b">${fmtNum(d.unique_visitors || 0)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right">${fmtNum(d.page_views || 0)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right;color:#555">${fmtNum(d.requests || 0)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right;color:#888">${cr}</td>
        <td style="padding:5px 0;font-size:12px;text-align:right;color:#aaa">${fmtBytes(d.bytes || 0)}</td>
      </tr>`;
  }).join('');

  // ── Top pays ──
  const totalReqCountry = countries.reduce((a, r) => a + r.requests, 0) || 1;
  const countryRows = countries.length === 0
    ? `<tr><td colspan="4" style="color:#999;font-size:12px;padding:8px 0;font-style:italic">Aucune donnée pays disponible</td></tr>`
    : countries.map(r => {
        const barW = Math.round((r.requests / totalReqCountry) * 100);
        const threatsIcon = r.threats > 0 ? ` <span style="color:#e85555;font-size:10px">(${r.threats} ⚠)</span>` : '';
        return `
          <tr style="border-bottom:1px solid #f0f0f0">
            <td style="padding:5px 0;font-size:12px;width:120px">${cfCountryLabel(r.country)}${threatsIcon}</td>
            <td style="padding:5px 8px;font-size:12px;text-align:right;font-weight:600;width:60px">${fmtNum(r.requests)}</td>
            <td style="padding:5px 8px;font-size:12px;text-align:right;color:#888;width:60px">${fmtBytes(r.bytes)}</td>
            <td style="padding:5px 0;width:80px">
              <div style="background:#e8f8f0;border-radius:3px;height:6px;width:100%">
                <div style="background:#21c47b;border-radius:3px;height:6px;width:${barW}%"></div>
              </div>
            </td>
          </tr>`;
      }).join('');

  const generatedAt = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d1f2d 0%,#1a3a4a 100%);padding:24px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-bottom:4px">Rapport Hebdomadaire · Cloudflare</div>
                  <div style="font-size:22px;font-weight:700;color:#ffffff">☁️ Trafic du site</div>
                  <div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px">${frDateRange(fromDate, toDate)}</div>
                </td>
                <td align="right" valign="top">
                  <div style="background:rgba(33,196,123,0.15);border:1px solid rgba(33,196,123,0.3);border-radius:8px;padding:10px 16px;display:inline-block;text-align:center">
                    <div style="font-size:28px;font-weight:800;color:#21c47b">${fmtNum(thisSum.unique_visitors)}</div>
                    <div style="font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px">visiteurs</div>
                    <div style="margin-top:4px">${deltaHtml(delta(thisSum.unique_visitors, prevSum?.unique_visitors))}</div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 28px">

            ${kpiBar}
            ${secondaryBar}

            ${section('Évolution sur 7 jours', chart7)}

            ${section('Détail quotidien', dataTable(
              [
                { label: 'Date' },
                { label: 'Visiteurs', align: 'right' },
                { label: 'Pages vues', align: 'right' },
                { label: 'Requêtes', align: 'right' },
                { label: 'Cache', align: 'right' },
                { label: 'Bande passante', align: 'right' },
              ],
              weekRows
            ))}

            ${section('Top pays (requêtes)', dataTable(
              [
                { label: 'Pays' },
                { label: 'Requêtes', align: 'right' },
                { label: 'Bande passante', align: 'right' },
                { label: '' },
              ],
              countryRows
            ))}

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fa;padding:16px 28px;border-top:1px solid #f0f0f0">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:10px;color:#bbb">Généré le ${generatedAt} · karimsaari.com</td>
                <td align="right" style="font-size:10px;color:#bbb">Dark Massilia · Données Cloudflare via Supabase</td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Send via Brevo ────────────────────────────────────────────────────────────

async function sendEmail(subject, htmlContent) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: BREVO_FROM,
      to: [{ email: BREVO_TO }],
      subject,
      htmlContent,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Brevo: ${res.status} ${txt}`);
  }
  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  console.log('☁️  Rapport hebdomadaire Cloudflare\n');

  // Cette semaine : J-7 à J-1 (hier)
  const { from: thisFrom, to: thisTo } = dateRange(1, 7);
  // Semaine précédente : J-8 à J-14
  const { from: prevFrom, to: prevTo } = dateRange(8, 14);

  console.log(`📅 Cette semaine : ${thisFrom} → ${thisTo}`);
  console.log(`📅 Semaine préc. : ${prevFrom} → ${prevTo}\n`);

  const [thisWeek, prevWeek, countries] = await Promise.all([
    fetchWeek(thisFrom, thisTo),
    fetchWeek(prevFrom, prevTo),
    fetchCountriesForWeek(thisFrom, thisTo),
  ]);

  if (thisWeek.length === 0) {
    console.warn('⚠️  Aucune donnée Cloudflare pour cette semaine. Abandon.');
    process.exit(0);
  }

  const thisSum = sumWeek(thisWeek);
  const prevSum = prevWeek.length > 0 ? sumWeek(prevWeek) : null;

  console.log(`✅ ${thisWeek.length} jours collectés — ${fmtNum(thisSum.unique_visitors)} visiteurs, ${fmtBytes(thisSum.bytes)}`);
  if (prevSum) {
    const d = delta(thisSum.unique_visitors, prevSum.unique_visitors);
    console.log(`   vs semaine préc. : ${d != null ? (d >= 0 ? '+' : '') + d + '%' : '—'} visiteurs`);
  }

  const html = buildHtml({
    thisWeek,
    prevWeek,
    thisSum,
    prevSum,
    countries,
    fromDate: thisFrom,
    toDate:   thisTo,
  });

  const weekLabel = `${thisFrom} → ${thisTo}`;
  const subject   = `☁️ Cloudflare — Semaine du ${thisFrom}`;

  console.log('\n📧 Envoi email Brevo...');
  await sendEmail(subject, html);
  console.log(`✅ Email envoyé : "${subject}"`);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
