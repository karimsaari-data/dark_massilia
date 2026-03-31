/**
 * weekly-seo-digest.js — Digest SEO hebdomadaire via Google Search Console + Brevo
 * Usage : npm run seo-digest
 */

import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

const GSC_SITE  = 'sc-domain:karimsaari.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const BREVO_TO  = 'email@karimsaari.com';
const BREVO_FROM = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

const COUNTRY_NAMES = {
  fra: 'France', deu: 'Allemagne', aus: 'Australie', bel: 'Belgique',
  bra: 'Brésil', usa: 'États-Unis', gbr: 'Royaume-Uni', can: 'Canada',
  che: 'Suisse', esp: 'Espagne', ita: 'Italie', nld: 'Pays-Bas',
  prt: 'Portugal', mar: 'Maroc', tun: 'Tunisie', dza: 'Algérie',
  lux: 'Luxembourg', mex: 'Mexique', arg: 'Argentine', jpn: 'Japon',
  reu: 'La Réunion', mrt: 'Mauritanie', sen: 'Sénégal', civ: "Côte d'Ivoire",
  cmr: 'Cameroun', gin: 'Guinée', cod: 'R.D. Congo', nga: 'Nigéria',
};
function countryLabel(code) {
  return COUNTRY_NAMES[code.toLowerCase()] || code.toUpperCase();
}

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
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
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

function fetchPages(token, startDate, endDate, limit = 25) {
  return gscQuery(token, {
    startDate, endDate,
    dimensions: ['page'],
    rowLimit: limit,
    orderBy: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }],
  });
}

function fetchQueries(token, startDate, endDate) {
  return gscQuery(token, {
    startDate, endDate,
    dimensions: ['query'],
    rowLimit: 10,
    orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
  });
}

function fetchCountries(token, startDate, endDate) {
  return gscQuery(token, {
    startDate, endDate,
    dimensions: ['country'],
    rowLimit: 8,
    orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
  });
}

function fetchImageSearch(token, startDate, endDate) {
  return gscQuery(token, {
    startDate, endDate,
    type: 'image',
    dimensions: [],
    rowLimit: 1,
  });
}

function fetchWeekSummary(token, startDate, endDate) {
  return gscQuery(token, {
    startDate, endDate,
    dimensions: [],
    rowLimit: 1,
  });
}

function formatDate(d) { return d.toISOString().split('T')[0]; }
function pageLabel(url) { return url.replace('https://karimsaari.com', '') || '/'; }
function sum(rows, field) { return (rows || []).reduce((a, r) => a + r[field], 0); }

// ── Mots-clés cibles à suivre ─────────────────────────────────────────────────
const TRACKED_KEYWORDS = [
  // Marque
  { q: 'karim saari',                                   cat: 'Marque' },
  { q: 'dark massilia',                                 cat: 'Marque' },
  { q: 'projet sentinelle',                             cat: 'Marque' },
  { q: 'projet sentinelle marseille',                   cat: 'Marque' },
  { q: 'team oxygen',                                   cat: 'Marque' },
  // Longue traîne locale
  { q: 'calanques marseille',                           cat: 'Local' },
  { q: 'dépollution marine marseille',                  cat: 'Local' },
  { q: 'dépollution calanques marseille',               cat: 'Local' },
  { q: 'nettoyage calanques',                           cat: 'Local' },
  { q: 'photographe sous-marin marseille',              cat: 'Local' },
  { q: 'photographe sous-marin calanques',              cat: 'Local' },
  { q: 'photographe paysages marseille',                cat: 'Local' },
  { q: 'photographe de paysages marseille',             cat: 'Local' },
  { q: 'photographe environnemental marseille',         cat: 'Local' },
  { q: 'bénévolat dépollution marseille',               cat: 'Local' },
  { q: 'bénévolat écologique marseille',                cat: 'Local' },
  { q: 'association dépollution marine marseille',      cat: 'Local' },
  // Documentaires ARTE
  { q: 'documentaire arte sauver marseille',            cat: 'ARTE' },
  { q: 'documentaire arte méduses souveraines',         cat: 'ARTE' },
  { q: 'yann arthus-bertrand les français karim saari', cat: 'ARTE' },
  // Éditorial
  { q: 'ramassage plastique mer',                       cat: 'Éditorial' },
  { q: 'pollution plastique méditerranée',              cat: 'Éditorial' },
  { q: 'microplastiques méditerranée',                  cat: 'Éditorial' },
  { q: 'rugulopteryx okamurae calanques',               cat: 'Éditorial' },
  { q: 'posidonie calanques',                           cat: 'Éditorial' },
];

function fetchAllQueries(token, startDate, endDate) {
  return gscQuery(token, {
    startDate, endDate,
    dimensions: ['query'],
    rowLimit: 5000,
  });
}

function extractKeywordData(currMap, prevMap) {
  return TRACKED_KEYWORDS.map(kw => {
    const c = currMap[kw.q.toLowerCase()];
    const p = prevMap[kw.q.toLowerCase()];
    return {
      ...kw,
      clicks:      c?.clicks      ?? 0,
      impressions: c?.impressions ?? 0,
      ctr:         c?.ctr         ?? 0,
      position:    c?.position ? +c.position : null,
      prevPos:     p?.position ? +p.position : null,
    };
  });
}

function avgPos(rows) {
  const total = (rows || []).reduce((a, r) => a + r.impressions, 0);
  if (!total) return 0;
  return (rows || []).reduce((a, r) => a + r.position * r.impressions, 0) / total;
}

function trendRows(curr, prev) {
  const currMap = Object.fromEntries((curr.rows || []).map(r => [r.keys[0], r]));
  const prevMap = Object.fromEntries((prev.rows || []).map(r => [r.keys[0], r]));
  const rising = [], falling = [];
  for (const [url, c] of Object.entries(currMap)) {
    const p = prevMap[url];
    if (!p || p.impressions < 8) continue; // anti-bruit : volume minimum
    const diff = c.impressions - p.impressions;
    const pct  = Math.round((diff / p.impressions) * 100);
    if (pct >= 20 && diff >= 5)   rising.push({ url, impressions: c.impressions, diff, pct });
    if (pct <= -20 && diff <= -5) falling.push({ url, impressions: c.impressions, diff, pct });
  }
  rising.sort((a, b) => b.pct - a.pct);
  falling.sort((a, b) => a.pct - b.pct);
  return { rising: rising.slice(0, 5), falling: falling.slice(0, 5) };
}

function kpiBlock(label, value, sub) {
  // Retourne une ligne <tr> pour le tableau synthèse KPI
  return `<tr><td style="padding:3px 16px 3px 0;color:#555;font-size:12px">${label}</td><td style="font-weight:700;font-size:12px">${value}${sub ? ` <span style="font-size:11px;color:#555">${sub}</span>` : ''}</td></tr>`;
}

function diffArrow(diff) {
  const d = +parseFloat(diff).toFixed(1);
  if (d > 0) return `<span style="color:green">▲ ${d}</span>`;
  if (d < 0) return `<span style="color:#c0392b">▼ ${Math.abs(d)}</span>`;
  return `<span style="color:#666">— 0</span>`;
}

async function generatePDF(html) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 680, height: 900 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  });
  await browser.close();
  return pdf;
}

async function sendEmail(html, subject, pdfBuffer, pdfName) {
  const body = {
    sender: BREVO_FROM,
    to: [{ email: BREVO_TO }],
    subject,
    htmlContent: html,
  };
  if (pdfBuffer) {
    body.attachment = [{ name: pdfName, content: Buffer.from(pdfBuffer).toString('base64') }];
  }
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

(async () => {
  const now = new Date();

  // Périodes
  const d7End      = formatDate(new Date(now - 2  * 86400000));
  const d7Start    = formatDate(new Date(now - 9  * 86400000));
  const d28End     = d7End;
  const d28Start   = formatDate(new Date(now - 30 * 86400000));
  const prevStart  = formatDate(new Date(now - 16 * 86400000));
  const prevEnd    = formatDate(new Date(now - 9  * 86400000));
  const prev28Start = formatDate(new Date(now - 58 * 86400000));
  const prev28End   = formatDate(new Date(now - 30 * 86400000));

  console.log('📊 Récupération GSC...');
  const token = await getAccessToken();

  const [curr7, prev7, curr28, prev28, queries7, queries28, countries7, imageSearch7] = await Promise.all([
    fetchPages(token,      d7Start,    d7End,    25),
    fetchPages(token,      prevStart,  prevEnd,  25),
    fetchPages(token,      d28Start,   d28End,   25),
    fetchPages(token,      prev28Start,prev28End,25),
    fetchQueries(token,    d7Start,    d7End),
    fetchQueries(token,    d28Start,   d28End),
    fetchCountries(token,  d7Start,    d7End),
    fetchImageSearch(token,d7Start,    d7End),
  ]);

  // KPIs 7j
  const c7  = { clicks: sum(curr7.rows, 'clicks'),  impressions: sum(curr7.rows, 'impressions') };
  const p7  = { clicks: sum(prev7.rows, 'clicks'),  impressions: sum(prev7.rows, 'impressions') };
  // KPIs 28j
  const c28 = { clicks: sum(curr28.rows, 'clicks'), impressions: sum(curr28.rows, 'impressions') };
  const p28 = { clicks: sum(prev28.rows, 'clicks'), impressions: sum(prev28.rows, 'impressions') };

  const ctr7  = c7.impressions  > 0 ? ((c7.clicks  / c7.impressions)  * 100).toFixed(1) : '0';
  const ctr28 = c28.impressions > 0 ? ((c28.clicks / c28.impressions) * 100).toFixed(1) : '0';

  // Position moyenne pondérée (impressions)
  const pos7  = avgPos(curr7.rows).toFixed(1);
  const ppos7 = avgPos(prev7.rows).toFixed(1);
  const pos28 = avgPos(curr28.rows).toFixed(1);

  // Tendances
  const { rising, falling } = trendRows(curr7, prev7);

  // Top pages (7j, triées par clics)
  const top10 = [...(curr7.rows || [])].sort((a,b) => b.clicks - a.clicks).slice(0, 10);

  // Carte prev7 pour delta position
  const prev7Map = Object.fromEntries((prev7.rows || []).map(r => [r.keys[0], r]));

  // Opportunités quick wins : position 4–10, impressions >= 5, CTR < CTR moyen
  const avgCtr7 = c7.impressions > 0 ? c7.clicks / c7.impressions : 0;
  const opportunities = (curr7.rows || [])
    .filter(r => r.position >= 4 && r.position <= 10 && r.impressions >= 5 && r.ctr < avgCtr7)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5);

  // Image search
  const imgClicks = imageSearch7.rows?.[0]?.clicks ?? 0;
  const imgImpr   = imageSearch7.rows?.[0]?.impressions ?? 0;

  // ── Mots-clés cibles depuis Supabase (gsc_weekly_queries) ──────────────────
  let trackedData = TRACKED_KEYWORDS.map(kw => ({ ...kw, clicks: 0, impressions: 0, ctr: 0, position: null, prevPos: null }));
  if (SUPABASE_URL && SUPABASE_KEY) {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: weeklyRows } = await sb
      .from('gsc_weekly_queries')
      .select('week_start, query, clicks, impressions, ctr, position')
      .order('week_start', { ascending: false })
      .limit(200);
    const weekStarts = [...new Set((weeklyRows || []).map(r => r.week_start))].slice(0, 2);
    const toMap = rows => Object.fromEntries((rows || []).map(r => [r.query.toLowerCase(), r]));
    const currMap = toMap((weeklyRows || []).filter(r => r.week_start === weekStarts[0]));
    const prevMap = toMap((weeklyRows || []).filter(r => r.week_start === weekStarts[1]));
    trackedData = extractKeywordData(currMap, prevMap);
    console.log(`📋 Mots-clés : semaine du ${weekStarts[0]} vs ${weekStarts[1] || 'N/A'}`);
  }

  // ── Données graphiques depuis Supabase (28 derniers jours) ───────────────
  let chartH = [];
  if (SUPABASE_URL && SUPABASE_KEY) {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: sbRows } = await sb
      .from('gsc_daily')
      .select('date, clicks, impressions, ctr, position')
      .gte('date', d28Start)
      .lte('date', d28End)
      .order('date', { ascending: true });
    chartH = (sbRows || []).map(r => ({
      label:       r.date.slice(5),
      clicks:      r.clicks,
      impressions: r.impressions,
      ctr:         +((r.ctr * 100).toFixed(1)),
      pos:         +(+r.position).toFixed(1),
    }));
  }
  const chartLabels = JSON.stringify(chartH.map(e => e.label));
  const chartClicks = JSON.stringify(chartH.map(e => e.clicks));
  const chartImpr   = JSON.stringify(chartH.map(e => e.impressions));
  const chartCtr    = JSON.stringify(chartH.map(e => e.ctr));
  const chartPos    = JSON.stringify(chartH.map(e => e.pos));

  // Pays
  const totalCountryClicks = sum(countries7.rows, 'clicks') || 1;

  // ── HTML rows ────────────────────────────────────────────────────────────────

  const pagesRows = top10.map(r => {
    const prev = prev7Map[r.keys[0]];
    const posDelta = prev ? (prev.position - r.position).toFixed(1) : null;
    const posCell = r.position.toFixed(1) + (posDelta !== null
      ? ` <span style="font-size:10px;color:${posDelta > 0 ? 'green' : posDelta < 0 ? '#c0392b' : '#666'}">${posDelta > 0 ? '↑' : posDelta < 0 ? '↓' : ''}${Math.abs(posDelta)}</span>`
      : '');
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${pageLabel(r.keys[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${r.clicks}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${r.impressions}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${(r.ctr*100).toFixed(1)}%</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${posCell}</td>
    </tr>`;
  }).join('');

  const queriesRows = (queries7.rows || []).slice(0, 10).map(r => `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${r.keys[0]}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${r.clicks}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${r.impressions}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${(r.ctr*100).toFixed(1)}%</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${r.position.toFixed(1)}</td>
    </tr>`).join('');

  const risingRows = rising.length
    ? rising.map(r => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${pageLabel(r.url)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:green;font-weight:600">+${r.pct}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${r.impressions} impr.</td>
      </tr>`).join('')
    : `<tr><td colspan="3" style="padding:12px;color:#666;font-size:12px;text-align:center">Pas de tendance haussière cette semaine</td></tr>`;

  const fallingRows = falling.length
    ? falling.map(r => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${pageLabel(r.url)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#c0392b;font-weight:600">${r.pct}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${r.impressions} impr.</td>
      </tr>`).join('')
    : `<tr><td colspan="3" style="padding:12px;color:#666;font-size:12px;text-align:center">Pas de tendance baissière cette semaine</td></tr>`;

  const countryRows = (countries7.rows || []).map(r => {
    const pct = Math.round((r.clicks / totalCountryClicks) * 100);
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${countryLabel(r.keys[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${r.clicks}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${pct}%</td>
    </tr>`;
  }).join('');

  // ── HTML template ────────────────────────────────────────────────────────────

  const html = `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2/dist/chartjs-plugin-datalabels.min.js"></script>
</head>
<body style="margin:0;background:#fff;font-family:Georgia,serif;color:#1a1a1a;padding:24px">
<div style="max-width:620px;margin:0 auto">

  <h1 style="font-size:20px;color:#1a1a1a;margin:0 0 4px">Digest SEO hebdomadaire — Dark Massilia</h1>
  <p style="margin:0 0 4px;font-size:12px;color:#666">${d7Start} → ${d7End} · Google Search Console · karimsaari.com</p>
  <p style="margin:0 0 24px;font-size:11px;color:#aaa">Généré le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' })} (heure de Paris)</p>

  <!-- KPIs 7 jours -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">7 derniers jours</h2>
  <table style="border-collapse:collapse;margin-bottom:24px;font-size:12px">
    ${kpiBlock('Clics', c7.clicks, `— ${diffArrow(c7.clicks - p7.clicks)} vs sem. préc.`)}
    ${kpiBlock('Impressions', c7.impressions, `— ${diffArrow(c7.impressions - p7.impressions)} vs sem. préc.`)}
    ${kpiBlock('CTR moyen', ctr7 + '%', null)}
    ${kpiBlock('Position moyenne', pos7, `— ${diffArrow(parseFloat(ppos7) - parseFloat(pos7))} vs sem. préc.`)}
  </table>

  <!-- KPIs 28 jours -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">28 derniers jours</h2>
  <table style="border-collapse:collapse;margin-bottom:24px;font-size:12px">
    ${kpiBlock('Clics', c28.clicks, `— ${diffArrow(c28.clicks - p28.clicks)} vs 28j préc.`)}
    ${kpiBlock('Impressions', c28.impressions, `— ${diffArrow(c28.impressions - p28.impressions)} vs 28j préc.`)}
    ${kpiBlock('CTR moyen', ctr28 + '%', null)}
    ${kpiBlock('Position moyenne', pos28, null)}
  </table>

  <!-- Tendances -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Tendances — 7 jours</h2>
  <div style="display:flex;gap:16px;margin-bottom:24px">
    <div style="flex:1">
      <p style="font-size:12px;font-weight:700;color:green;margin:0 0 6px">▲ En progression</p>
      <table style="width:100%;border-collapse:collapse">${risingRows}</table>
    </div>
    <div style="flex:1">
      <p style="font-size:12px;font-weight:700;color:#c0392b;margin:0 0 6px">▼ En recul</p>
      <table style="width:100%;border-collapse:collapse">${fallingRows}</table>
    </div>
  </div>

  <!-- Sources de trafic -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Sources de trafic — 7 jours</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead><tr style="background:#1a1a1a;color:#fff">
      <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Source</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Clics</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Impressions</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">CTR</th>
    </tr></thead>
    <tbody>
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">🔍 Recherche web</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${c7.clicks}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${c7.impressions}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${ctr7}%</td>
      </tr>
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">🖼️ Recherche d'images</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${imgClicks}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${imgImpr}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${imgImpr > 0 ? ((imgClicks/imgImpr)*100).toFixed(1) : '0'}%</td>
      </tr>
    </tbody>
  </table>

  <!-- Top pays -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Top pays — 7 jours</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead><tr style="background:#1a1a1a;color:#fff">
      <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Pays</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Clics</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Part</th>
    </tr></thead>
    <tbody>${countryRows}</tbody>
  </table>

  <!-- Top pages 7j -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Top pages — 7 jours</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead><tr style="background:#1a1a1a;color:#fff">
      <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Page</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Clics</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Impr.</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">CTR</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Pos.</th>
    </tr></thead>
    <tbody>${pagesRows}</tbody>
  </table>

  <!-- Opportunités quick wins -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Quick wins — pos. 4–10 · CTR sous la moyenne</h2>
  <p style="font-size:11px;color:#666;margin:0 0 8px">Pages bien positionnées mais avec un CTR faible → optimiser title/meta description</p>
  ${opportunities.length ? `
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead><tr style="background:#1a1a1a;color:#fff">
      <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Page</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Impr.</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">CTR</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Pos.</th>
    </tr></thead>
    <tbody>${opportunities.map(r => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${pageLabel(r.keys[0])}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${r.impressions}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#c0392b;font-size:12px">${(r.ctr*100).toFixed(1)}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${r.position.toFixed(1)}</td>
      </tr>`).join('')}
    </tbody>
  </table>` : `<p style="font-size:12px;color:#666;margin-bottom:24px">Aucune opportunité détectée cette semaine</p>`}

  <!-- Top requêtes 7j -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Top requêtes — 7 jours</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead><tr style="background:#1a1a1a;color:#fff">
      <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Requête</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Clics</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Impr.</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">CTR</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Pos.</th>
    </tr></thead>
    <tbody>${queriesRows}</tbody>
  </table>

  <!-- Top requêtes 28j -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Top requêtes — 28 jours</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead><tr style="background:#1a1a1a;color:#fff">
      <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Requête</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Clics</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Impr.</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">CTR</th>
      <th style="padding:7px 10px;font-weight:600;font-size:12px">Pos.</th>
    </tr></thead>
    <tbody>${(queries28.rows || []).slice(0, 15).map(r => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${r.keys[0]}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${r.clicks}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${r.impressions}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${(r.ctr*100).toFixed(1)}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${r.position.toFixed(1)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <!-- Suivi mots-clés cibles -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Suivi mots-clés cibles — semaine</h2>
  <p style="font-size:11px;color:#666;margin:0 0 12px">Position moyenne · ↑ amélioration · ↓ recul · — non détecté cette semaine</p>
  ${['Marque', 'Local', 'ARTE', 'Éditorial'].map(cat => {
    const rows = trackedData.filter(k => k.cat === cat);
    return `
    <div style="margin-bottom:16px">
      <p style="font-size:11px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px">${cat}</p>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:#1a1a1a;color:#fff">
          <th style="padding:5px 8px;text-align:left;font-weight:600;font-size:11px">Mot-clé</th>
          <th style="padding:5px 8px;text-align:center;width:50px;font-weight:600;font-size:11px">Pos.</th>
          <th style="padding:5px 8px;text-align:center;width:40px;font-weight:600;font-size:11px">Δ</th>
          <th style="padding:5px 8px;text-align:center;width:50px;font-weight:600;font-size:11px">Impr.</th>
          <th style="padding:5px 8px;text-align:center;width:40px;font-weight:600;font-size:11px">Clics</th>
        </tr></thead>
        <tbody>
        ${rows.map(k => {
          const posColor = k.position === null ? '#666'
            : k.position <= 3  ? 'green'
            : k.position <= 10 ? '#e67e22'
            : '#555';
          const posLabel = k.position === null ? '—' : k.position.toFixed(1);
          let deltaCell = '<span style="color:#666">—</span>';
          if (k.position !== null && k.prevPos !== null) {
            const d = (k.prevPos - k.position).toFixed(1);
            if (d > 0)      deltaCell = `<span style="color:green">↑${d}</span>`;
            else if (d < 0) deltaCell = `<span style="color:#c0392b">↓${Math.abs(d)}</span>`;
            else            deltaCell = `<span style="color:#666">0</span>`;
          }
          return `<tr>
            <td style="padding:5px 8px;border-bottom:1px solid #ddd;color:#555;font-size:11px">${k.q}</td>
            <td style="padding:5px 8px;border-bottom:1px solid #ddd;text-align:center;font-weight:700;font-size:12px;color:${posColor}">${posLabel}</td>
            <td style="padding:5px 8px;border-bottom:1px solid #ddd;text-align:center;font-size:11px">${deltaCell}</td>
            <td style="padding:5px 8px;border-bottom:1px solid #ddd;text-align:center;color:#666;font-size:11px">${k.impressions}</td>
            <td style="padding:5px 8px;border-bottom:1px solid #ddd;text-align:center;color:#666;font-size:11px">${k.clicks}</td>
          </tr>`;
        }).join('')}
        </tbody>
      </table>
    </div>`;
  }).join('')}

  <!-- Graphiques historiques GSC -->
  ${chartH.some(e => e.clicks !== null) ? `
  <div style="page-break-before:always"></div>
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Évolution — 28 derniers jours</h2>
  <p style="font-size:11px;color:#666;margin:0 0 14px">Données GSC quotidiennes</p>
  <div style="background:#f8f9fa;border:1px solid #ddd;border-radius:4px;padding:16px;margin-bottom:24px">
    <div style="background:#fff;padding:8px;border-radius:4px;margin-bottom:12px"><canvas id="gscClics" height="80"></canvas></div>
    <div style="background:#fff;padding:8px;border-radius:4px;margin-bottom:12px"><canvas id="gscImpr"  height="80"></canvas></div>
    <div style="background:#fff;padding:8px;border-radius:4px;margin-bottom:12px"><canvas id="gscCtr"   height="80"></canvas></div>
    <div style="background:#fff;padding:8px;border-radius:4px">                  <canvas id="gscPos"   height="80"></canvas></div>
  </div>` : ''}

  <p style="font-size:10px;color:#aaa;text-align:center;margin:0">Généré automatiquement chaque dimanche · Dark Massilia · karimsaari.com</p>
</div>
${chartH.some(e => e.clicks !== null) ? `
<script>
Chart.register(ChartDataLabels);
const chartDefaults = {
  responsive: true,
  plugins: {
    legend: { display: false },
    datalabels: {
      display: ctx => ctx.dataset.data[ctx.dataIndex] !== null && ctx.dataset.data[ctx.dataIndex] !== 0,
      color: '#444',
      font: { size: 8 },
      anchor: 'end',
      align: 'top',
      offset: 2,
      formatter: v => v !== null ? (Number.isInteger(v) ? v : v.toFixed(1)) : '',
    },
  },
  scales: {
    x: { ticks: { color: '#666', font: { size: 9 } }, grid: { color: '#ddd' } },
    y: { ticks: { color: '#666', font: { size: 9 } }, grid: { color: '#ddd' } },
  },
};
function lineChart(id, label, color, data, extraOpts = {}) {
  new Chart(document.getElementById(id), {
    type: 'line',
    data: {
      labels: ${chartLabels},
      datasets: [{ label, data, borderColor: color, backgroundColor: color.replace(')', ',0.12)').replace('rgb','rgba'), borderWidth: 2, pointRadius: 3, tension: 0.3, fill: true }],
    },
    options: { ...chartDefaults, ...extraOpts,
      plugins: { ...chartDefaults.plugins, title: { display: true, text: label, color: '#1a1a1a', font: { size: 11 }, padding: { bottom: 8 } } },
    },
  });
}
lineChart('gscClics', 'Clics',         'rgb(33,196,123)',  ${chartClicks});
lineChart('gscImpr',  'Impressions',   'rgb(0,145,255)',   ${chartImpr});
lineChart('gscCtr',   'CTR %',         'rgb(245,158,11)',  ${chartCtr});
lineChart('gscPos',   'Position moy.', 'rgb(167,139,250)', ${chartPos}, { scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, reverse: true } } });
</script>` : ''}
</body></html>`;

  // ── PDF ──────────────────────────────────────────────────────────────────────
  console.log('📄 Génération PDF...');
  let pdfBuffer = null;
  try {
    pdfBuffer = await generatePDF(html);
    console.log(`✅ PDF généré (${Math.round(pdfBuffer.length / 1024)} KB)`);
  } catch (err) {
    console.warn('⚠️  PDF non généré (puppeteer indisponible) :', err.message);
  }

  // ── Email ────────────────────────────────────────────────────────────────────
  const subject  = `📊 SEO Digest — semaine du ${d7Start}`;
  const pdfName  = `seo-digest-${d7End}.pdf`;
  console.log('📧 Envoi email Brevo...');
  const result = await sendEmail(html, subject, pdfBuffer, pdfName);
  if (result.messageId) {
    console.log(`✅ Email envoyé (messageId: ${result.messageId})${pdfBuffer ? ' + PDF en pièce jointe' : ''}`);
  } else {
    console.error('❌ Erreur Brevo:', JSON.stringify(result));
    process.exit(1);
  }
})();
