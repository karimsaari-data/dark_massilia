/**
 * weekly-seo-digest.js — Digest SEO hebdomadaire via Google Search Console + Brevo
 * Usage : npm run seo-digest
 */

import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GSC_HISTORY_PATH = resolve(__dirname, '../data/gsc-history.json');

let gscHistory = { history: [] };
try { gscHistory = JSON.parse(readFileSync(GSC_HISTORY_PATH, 'utf8')); }
catch (e) { /* première exécution */ }

const GSC_SITE  = 'sc-domain:karimsaari.com';
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

function formatDate(d) { return d.toISOString().split('T')[0]; }
function pageLabel(url) { return url.replace('https://karimsaari.com', '') || '/'; }
function sum(rows, field) { return (rows || []).reduce((a, r) => a + r[field], 0); }

// ── Mots-clés cibles à suivre ─────────────────────────────────────────────────
const TRACKED_KEYWORDS = [
  // Marque
  { q: 'karim saari',                                   cat: 'Marque' },
  { q: 'dark massilia',                                 cat: 'Marque' },
  { q: 'projet sentinelle',                             cat: 'Marque' },
  { q: 'team oxygen',                                   cat: 'Marque' },
  // Longue traîne locale
  { q: 'dépollution marine marseille',                  cat: 'Local' },
  { q: 'photographe sous-marin marseille',              cat: 'Local' },
  { q: 'photographe sous-marin calanques',              cat: 'Local' },
  { q: 'bénévolat dépollution marseille',               cat: 'Local' },
  { q: 'bénévolat écologique marseille',                cat: 'Local' },
  { q: 'association dépollution marine marseille',      cat: 'Local' },
  { q: 'photographe de paysages marseille',             cat: 'Local' },
  { q: 'photographe environnemental marseille',         cat: 'Local' },
  // Documentaires ARTE
  { q: 'documentaire arte sauver marseille',            cat: 'ARTE' },
  { q: 'documentaire arte méduses souveraines',         cat: 'ARTE' },
  { q: 'yann arthus-bertrand les français karim saari', cat: 'ARTE' },
  // Éditorial
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

function extractKeywordData(gscRows, prevRows) {
  const curr = Object.fromEntries((gscRows || []).map(r => [r.keys[0].toLowerCase(), r]));
  const prev = Object.fromEntries((prevRows  || []).map(r => [r.keys[0].toLowerCase(), r]));
  return TRACKED_KEYWORDS.map(kw => {
    const c = curr[kw.q];
    const p = prev[kw.q];
    return {
      ...kw,
      clicks:      c?.clicks      ?? 0,
      impressions: c?.impressions ?? 0,
      ctr:         c?.ctr         ?? 0,
      position:    c?.position    ?? null,
      prevPos:     p?.position    ?? null,
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

function kpiBlock(label, value, sub, subColor) {
  return `<div style="flex:1;background:#0f2035;border-radius:12px;padding:16px 12px;text-align:center">
    <div style="font-size:28px;font-weight:700;color:#fff">${value}</div>
    <div style="font-size:11px;color:#64748b;margin-top:3px">${label}</div>
    ${sub ? `<div style="font-size:11px;color:${subColor};margin-top:3px">${sub}</div>` : ''}
  </div>`;
}

function diffArrow(diff) {
  if (diff > 0) return `<span style="color:#21c47b">▲ ${diff}</span>`;
  if (diff < 0) return `<span style="color:#e74c3c">▼ ${Math.abs(diff)}</span>`;
  return `<span style="color:#64748b">— 0</span>`;
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

  const [curr7, prev7, curr28, prev28, queries7, countries7, imageSearch7, kwCurr, kwPrev] = await Promise.all([
    fetchPages(token,      d7Start,    d7End,    25),
    fetchPages(token,      prevStart,  prevEnd,  25),
    fetchPages(token,      d28Start,   d28End,   25),
    fetchPages(token,      prev28Start,prev28End,25),
    fetchQueries(token,    d7Start,    d7End),
    fetchCountries(token,  d7Start,    d7End),
    fetchImageSearch(token,d7Start,    d7End),
    fetchAllQueries(token, d7Start,    d7End),
    fetchAllQueries(token, prevStart,  prevEnd),
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

  // Mots-clés cibles
  const trackedData = extractKeywordData(kwCurr.rows, kwPrev.rows);

  // ── Mise à jour historique GSC ────────────────────────────────────────────
  gscHistory.history.push({
    date: d7Start,
    clicks:      c7.clicks,
    impressions: c7.impressions,
    ctr:         parseFloat(ctr7),
    pos:         parseFloat(pos7),
  });
  if (gscHistory.history.length > 52) gscHistory.history = gscHistory.history.slice(-52);
  mkdirSync(resolve(__dirname, '../data'), { recursive: true });
  writeFileSync(GSC_HISTORY_PATH, JSON.stringify(gscHistory, null, 2), 'utf8');
  console.log(`📊 Historique GSC mis à jour (${gscHistory.history.length} entrée(s))`);

  // ── Données graphiques GSC (12 dernières semaines) ────────────────────────
  const chartH      = gscHistory.history.slice(-12);
  const chartLabels = JSON.stringify(chartH.map(e => e.date.slice(5)));  // MM-DD
  const chartClicks = JSON.stringify(chartH.map(e => e.clicks ?? null));
  const chartImpr   = JSON.stringify(chartH.map(e => e.impressions ?? null));
  const chartCtr    = JSON.stringify(chartH.map(e => e.ctr ?? null));
  const chartPos    = JSON.stringify(chartH.map(e => e.pos ?? null));

  // Pays
  const totalCountryClicks = sum(countries7.rows, 'clicks') || 1;

  // ── HTML rows ────────────────────────────────────────────────────────────────

  const pagesRows = top10.map(r => {
    const prev = prev7Map[r.keys[0]];
    const posDelta = prev ? (prev.position - r.position).toFixed(1) : null;
    const posCell = r.position.toFixed(1) + (posDelta !== null
      ? ` <span style="font-size:10px;color:${posDelta > 0 ? '#21c47b' : posDelta < 0 ? '#e74c3c' : '#64748b'}">${posDelta > 0 ? '↑' : posDelta < 0 ? '↓' : ''}${Math.abs(posDelta)}</span>`
      : '');
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${pageLabel(r.keys[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-weight:600;font-size:13px">${r.clicks}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${r.impressions}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${(r.ctr*100).toFixed(1)}%</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${posCell}</td>
    </tr>`;
  }).join('');

  const queriesRows = (queries7.rows || []).slice(0, 10).map(r => `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${r.keys[0]}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-weight:600;font-size:13px">${r.clicks}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${r.impressions}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${(r.ctr*100).toFixed(1)}%</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${r.position.toFixed(1)}</td>
    </tr>`).join('');

  const risingRows = rising.length
    ? rising.map(r => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${pageLabel(r.url)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#21c47b;font-weight:600">+${r.pct}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${r.impressions} impr.</td>
      </tr>`).join('')
    : `<tr><td colspan="3" style="padding:12px;color:#64748b;font-size:12px;text-align:center">Pas de tendance haussière cette semaine</td></tr>`;

  const fallingRows = falling.length
    ? falling.map(r => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${pageLabel(r.url)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#e74c3c;font-weight:600">${r.pct}%</td>
        <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${r.impressions} impr.</td>
      </tr>`).join('')
    : `<tr><td colspan="3" style="padding:12px;color:#64748b;font-size:12px;text-align:center">Pas de tendance baissière cette semaine</td></tr>`;

  const countryRows = (countries7.rows || []).map(r => {
    const pct = Math.round((r.clicks / totalCountryClicks) * 100);
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${countryLabel(r.keys[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-weight:600;font-size:13px">${r.clicks}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:right;padding-right:14px">
        <div style="display:inline-flex;align-items:center;gap:6px">
          <div style="width:60px;height:6px;background:#1e3a50;border-radius:3px">
            <div style="width:${Math.min(pct,100)}%;height:6px;background:#21c47b;border-radius:3px"></div>
          </div>
          <span style="font-size:11px;color:#64748b">${pct}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');

  // ── HTML template ────────────────────────────────────────────────────────────

  const html = `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
</head>
<body style="margin:0;padding:0;background:#0a1628;font-family:system-ui,sans-serif;color:#e2e8f0">
<div style="max-width:620px;margin:0 auto;padding:28px 16px">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px">
    <div style="font-size:11px;letter-spacing:2px;color:#21c47b;text-transform:uppercase;margin-bottom:6px">Rapport SEO hebdomadaire</div>
    <h1 style="margin:0;font-size:22px;color:#fff">Dark Massilia</h1>
    <div style="font-size:12px;color:#64748b;margin-top:4px">${d7Start} → ${d7End}</div>
  </div>

  <!-- KPIs 7 jours -->
  <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">7 derniers jours</div>
  <div style="display:flex;gap:8px;margin-bottom:8px">
    ${kpiBlock('Clics', c7.clicks, `${diffArrow(c7.clicks - p7.clicks)} vs sem. préc.`, c7.clicks >= p7.clicks ? '#21c47b' : '#e74c3c')}
    ${kpiBlock('Impressions', c7.impressions, `${diffArrow(c7.impressions - p7.impressions)} vs sem. préc.`, c7.impressions >= p7.impressions ? '#21c47b' : '#e74c3c')}
    ${kpiBlock('CTR moyen', ctr7 + '%', null, null)}
    ${kpiBlock('Pos. moyenne', pos7, `${diffArrow(parseFloat(ppos7) - parseFloat(pos7))} vs sem. préc.`, parseFloat(pos7) <= parseFloat(ppos7) ? '#21c47b' : '#e74c3c')}
  </div>

  <!-- KPIs 28 jours -->
  <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;margin-top:20px">28 derniers jours</div>
  <div style="display:flex;gap:8px;margin-bottom:24px">
    ${kpiBlock('Clics', c28.clicks, `${diffArrow(c28.clicks - p28.clicks)} vs 28j préc.`, c28.clicks >= p28.clicks ? '#21c47b' : '#e74c3c')}
    ${kpiBlock('Impressions', c28.impressions, `${diffArrow(c28.impressions - p28.impressions)} vs 28j préc.`, c28.impressions >= p28.impressions ? '#21c47b' : '#e74c3c')}
    ${kpiBlock('CTR moyen', ctr28 + '%', null, null)}
    ${kpiBlock('Pos. moyenne', pos28, null, null)}
  </div>

  <!-- Tendances -->
  <div style="display:flex;gap:10px;margin-bottom:16px">
    <div style="flex:1;background:#0f2035;border-radius:12px;padding:16px">
      <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">▲ En progression</h2>
      <table style="width:100%;border-collapse:collapse">${risingRows}</table>
    </div>
    <div style="flex:1;background:#0f2035;border-radius:12px;padding:16px">
      <h2 style="margin:0 0 12px;font-size:13px;color:#e74c3c">▼ En recul</h2>
      <table style="width:100%;border-collapse:collapse">${fallingRows}</table>
    </div>
  </div>

  <!-- Sources de trafic -->
  <div style="display:flex;gap:10px;margin-bottom:16px">
    <div style="flex:1;background:#0f2035;border-radius:12px;padding:16px">
      <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Sources de trafic — 7 jours</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">🔍 Recherche web</td>
          <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-weight:600;font-size:13px">${c7.clicks}</td>
          <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${c7.impressions} impr.</td>
          <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${ctr7}% CTR</td>
        </tr>
        <tr>
          <td style="padding:7px 10px;color:#94a3b8;font-size:12px">🖼️ Recherche d'images</td>
          <td style="padding:7px 10px;text-align:center;font-weight:600;font-size:13px">${imgClicks}</td>
          <td style="padding:7px 10px;text-align:center;color:#94a3b8;font-size:12px">${imgImpr} impr.</td>
          <td style="padding:7px 10px;text-align:center;color:#94a3b8;font-size:12px">${imgImpr > 0 ? ((imgClicks/imgImpr)*100).toFixed(1) : '0'}% CTR</td>
        </tr>
      </table>
    </div>
    <div style="flex:1;background:#0f2035;border-radius:12px;padding:16px">
      <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Top pays — 7 jours</h2>
      <table style="width:100%;border-collapse:collapse">${countryRows}</table>
    </div>
  </div>

  <!-- Top pages 7j -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:12px">
    <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Top pages — 7 jours</h2>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
        <th style="padding:6px 10px;text-align:left">Page</th>
        <th style="padding:6px 10px">Clics</th>
        <th style="padding:6px 10px">Impr.</th>
        <th style="padding:6px 10px">CTR</th>
        <th style="padding:6px 10px">Pos.</th>
      </tr></thead>
      <tbody>${pagesRows}</tbody>
    </table>
  </div>

  <!-- Opportunités quick wins -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:12px">
    <h2 style="margin:0 0 4px;font-size:13px;color:#f59e0b">⚡ Opportunités quick wins — pos. 4–10 · CTR sous la moyenne</h2>
    <div style="font-size:11px;color:#64748b;margin-bottom:10px">Pages bien positionnées mais avec un CTR faible → optimiser title/meta description</div>
    ${opportunities.length ? `
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
        <th style="padding:6px 10px;text-align:left">Page</th>
        <th style="padding:6px 10px">Impr.</th>
        <th style="padding:6px 10px">CTR</th>
        <th style="padding:6px 10px">Pos.</th>
      </tr></thead>
      <tbody>${opportunities.map(r => `
        <tr>
          <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${pageLabel(r.keys[0])}</td>
          <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${r.impressions}</td>
          <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#f59e0b;font-size:12px">${(r.ctr*100).toFixed(1)}%</td>
          <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${r.position.toFixed(1)}</td>
        </tr>`).join('')}
      </tbody>
    </table>` : `<div style="font-size:12px;color:#64748b;padding:8px 0">Aucune opportunité détectée cette semaine</div>`}
  </div>

  <!-- Top requêtes -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:24px">
    <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Top requêtes — 7 jours</h2>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
        <th style="padding:6px 10px;text-align:left">Requête</th>
        <th style="padding:6px 10px">Clics</th>
        <th style="padding:6px 10px">Impr.</th>
        <th style="padding:6px 10px">CTR</th>
        <th style="padding:6px 10px">Pos.</th>
      </tr></thead>
      <tbody>${queriesRows}</tbody>
    </table>
  </div>

  <!-- Suivi mots-clés cibles -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:24px">
    <h2 style="margin:0 0 4px;font-size:13px;color:#21c47b">🎯 Suivi mots-clés cibles — 7 jours</h2>
    <div style="font-size:11px;color:#64748b;margin-bottom:12px">Position moyenne · ↑ amélioration · ↓ recul · — non détecté dans le top 5 000</div>
    ${['Marque', 'Local', 'ARTE', 'Éditorial'].map(cat => {
      const rows = trackedData.filter(k => k.cat === cat);
      const catColors = { Marque: '#0091ff', Local: '#21c47b', ARTE: '#ff6b35', 'Éditorial': '#a78bfa' };
      return `
      <div style="margin-bottom:14px">
        <div style="font-size:10px;font-weight:700;color:${catColors[cat]};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">${cat}</div>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
            <th style="padding:4px 8px;text-align:left">Mot-clé</th>
            <th style="padding:4px 8px;text-align:center;width:50px">Pos.</th>
            <th style="padding:4px 8px;text-align:center;width:40px">Δ</th>
            <th style="padding:4px 8px;text-align:center;width:50px">Impr.</th>
            <th style="padding:4px 8px;text-align:center;width:40px">Clics</th>
          </tr></thead>
          <tbody>
          ${rows.map(k => {
            const posColor = k.position === null ? '#334155'
              : k.position <= 3  ? '#21c47b'
              : k.position <= 10 ? '#f59e0b'
              : '#94a3b8';
            const posLabel = k.position === null ? '—' : k.position.toFixed(1);
            let deltaCell = '<span style="color:#64748b">—</span>';
            if (k.position !== null && k.prevPos !== null) {
              const d = (k.prevPos - k.position).toFixed(1);
              if (d > 0)      deltaCell = `<span style="color:#21c47b">↑${d}</span>`;
              else if (d < 0) deltaCell = `<span style="color:#e74c3c">↓${Math.abs(d)}</span>`;
              else            deltaCell = `<span style="color:#64748b">0</span>`;
            }
            return `<tr>
              <td style="padding:5px 8px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:11px">${k.q}</td>
              <td style="padding:5px 8px;border-bottom:1px solid #1e3a50;text-align:center;font-weight:700;font-size:12px;color:${posColor}">${posLabel}</td>
              <td style="padding:5px 8px;border-bottom:1px solid #1e3a50;text-align:center;font-size:11px">${deltaCell}</td>
              <td style="padding:5px 8px;border-bottom:1px solid #1e3a50;text-align:center;color:#64748b;font-size:11px">${k.impressions}</td>
              <td style="padding:5px 8px;border-bottom:1px solid #1e3a50;text-align:center;color:#64748b;font-size:11px">${k.clicks}</td>
            </tr>`;
          }).join('')}
          </tbody>
        </table>
      </div>`;
    }).join('')}
  </div>

  <!-- Graphiques historiques GSC -->
  ${chartH.length >= 2 ? `
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:16px">
    <h2 style="margin:0 0 4px;font-size:13px;color:#21c47b">📈 Évolution — 12 dernières semaines</h2>
    <div style="font-size:11px;color:#64748b;margin-bottom:14px">Données GSC hebdomadaires</div>
    <div style="display:flex;gap:12px;margin-bottom:16px">
      <div style="flex:1"><canvas id="gscClics" height="120"></canvas></div>
      <div style="flex:1"><canvas id="gscImpr"  height="120"></canvas></div>
    </div>
    <div style="display:flex;gap:12px">
      <div style="flex:1"><canvas id="gscCtr"   height="120"></canvas></div>
      <div style="flex:1"><canvas id="gscPos"   height="120"></canvas></div>
    </div>
  </div>` : ''}

  <div style="text-align:center;font-size:11px;color:#334155">
    Généré automatiquement chaque dimanche · Dark Massilia
  </div>
</div>
${chartH.length >= 2 ? `
<script>
const chartDefaults = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { color: '#1e3a50' } },
    y: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { color: '#1e3a50' } },
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
      plugins: { ...chartDefaults.plugins, title: { display: true, text: label, color: '#94a3b8', font: { size: 11 }, padding: { bottom: 8 } } },
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
  const pdfName  = `seo-digest-${d7Start}.pdf`;
  console.log('📧 Envoi email Brevo...');
  const result = await sendEmail(html, subject, pdfBuffer, pdfName);
  if (result.messageId) {
    console.log(`✅ Email envoyé (messageId: ${result.messageId})${pdfBuffer ? ' + PDF en pièce jointe' : ''}`);
  } else {
    console.error('❌ Erreur Brevo:', JSON.stringify(result));
    process.exit(1);
  }
})();
