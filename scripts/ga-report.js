/**
 * ga-report.js — Rapport Google Analytics 4 hebdomadaire
 * Usage : npm run ga-report
 * Variables requises : GSC_CLIENT_ID, GSC_CLIENT_SECRET, GSC_REFRESH_TOKEN, GA_PROPERTY_ID, BREVO_API_KEY
 */

import puppeteer from 'puppeteer';

const BREVO_TO   = 'email@karimsaari.com';
const BREVO_FROM = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

// ── Auth OAuth2 (mêmes credentials que GSC) ──────────────────────────────────

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
  if (!data.access_token) throw new Error(`Token OAuth2 : ${JSON.stringify(data)}`);
  return data.access_token;
}

// ── GA4 Data API ──────────────────────────────────────────────────────────────

const GA_PROPERTY = process.env.GA_PROPERTY_ID; // ex: "properties/123456789"

async function gaQuery(token, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${GA_PROPERTY}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const json = await res.json();
  if (json.error) throw new Error(`GA4 API: ${json.error.message}`);
  return json;
}

// Requête overview — deux périodes en une seule requête (GA4 multi-dateRange)
function fetchOverview(token, startCurr, endCurr, startPrev, endPrev) {
  return gaQuery(token, {
    dateRanges: [
      { startDate: startCurr, endDate: endCurr,  name: 'current' },
      { startDate: startPrev, endDate: endPrev,   name: 'previous' },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'engagementRate' },
      { name: 'newUsers' },
    ],
  });
}

function fetchTopPages(token, startDate, endDate) {
  return gaQuery(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }, { name: 'averageSessionDuration' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  });
}

function fetchSources(token, startDate, endDate) {
  return gaQuery(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'sessionSourceMedium' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    // Exclure les bots connus (Ahrefs, Semrush, etc.)
    dimensionFilter: {
      notExpression: {
        filter: {
          fieldName: 'sessionSource',
          stringFilter: { matchType: 'CONTAINS', value: 'ahrefs' },
        },
      },
    },
    limit: 10,
  });
}

function fetchTopPhotos(token, startDate, endDate) {
  return gaQuery(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'customEvent:photo_name' }],
    metrics: [{ name: 'eventCount' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    // Filtre sur le nom de l'événement : seuls les photo_view sont inclus
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { matchType: 'EXACT', value: 'photo_view' },
      },
    },
    limit: 8,
  });
}

function fetchTopVideos(token, startDate, endDate) {
  return gaQuery(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'customEvent:video_title' }],
    metrics: [{ name: 'eventCount' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    // Filtre sur le nom de l'événement : seuls les video_play sont inclus
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { matchType: 'EXACT', value: 'video_play' },
      },
    },
    limit: 5,
  });
}

function fetchTopCTAs(token, startDate, endDate) {
  return gaQuery(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'customEvent:button_name' }],
    metrics: [{ name: 'eventCount' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    // Filtre sur le nom de l'événement : seuls les cta_click sont inclus
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { matchType: 'EXACT', value: 'cta_click' },
      },
    },
    limit: 6,
  });
}

function fetchDevices(token, startDate, endDate) {
  return gaQuery(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });
}

function fetchCountries(token, startDate, endDate) {
  return gaQuery(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 8,
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d) { return d.toISOString().split('T')[0]; }

function fmtDuration(seconds) {
  const s = Math.round(Number(seconds));
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function fmtPct(val) {
  return `${Math.round(Number(val) * 100)}%`;
}

function fmtNum(val) {
  return Math.round(Number(val)).toLocaleString('fr-FR');
}

// Extrait la valeur d'une métrique depuis la réponse GA4 multi-dateRange
function getMetric(report, dateRangeName, metricIndex) {
  const row = (report.rows || []).find(r => r.dimensionValues?.[0]?.value === dateRangeName);
  return row ? Number(row.metricValues?.[metricIndex]?.value ?? 0) : 0;
}

// Pour les rapports sans dimension dateRange (single-range)
function getRows(report) {
  return (report.rows || []).map(r => ({
    dim:     r.dimensionValues?.map(d => d.value) ?? [],
    metrics: r.metricValues?.map(m => Number(m.value)) ?? [],
  }));
}

function diffArrow(curr, prev, lowerIsBetter = false) {
  const diff = curr - prev;
  const better = lowerIsBetter ? diff < 0 : diff > 0;
  if (diff === 0) return `<span style="color:#666">— 0</span>`;
  const sign  = diff > 0 ? '+' : '';
  const color = better ? 'green' : '#c0392b';
  const arrow = diff > 0 ? '▲' : '▼';
  return `<span style="color:${color}">${arrow} ${sign}${fmtNum(Math.abs(diff))}</span>`;
}

function diffPct(curr, prev) {
  if (!prev) return '';
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (pct === 0) return '';
  const color = pct > 0 ? 'green' : '#c0392b';
  return ` <span style="font-size:11px;color:${color}">(${pct > 0 ? '+' : ''}${pct}%)</span>`;
}

function kpi(label, value, sub) {
  // Retourne une ligne <tr> pour le tableau synthèse KPI
  return `<tr><td style="padding:3px 16px 3px 0;color:#555;font-size:12px">${label}</td><td style="font-weight:700;font-size:12px;color:#1a1a1a">${value}${sub ? ` <span style="font-size:11px;color:#555">${sub}</span>` : ''}</td></tr>`;
}

function sourceLabel(name) {
  // name = "source / medium"
  const map = {
    'google / organic':           '🔍 Google organique',
    'ig / social':                '📸 Instagram',
    'sendinblue / email':         '📧 Brevo email',
    'brevo / email':              '📧 Brevo email',
    '(direct) / (none)':         '🔗 Direct',
    'fr.pinterest.com / referral':'📌 Pinterest',
    't.co / referral':            '🐦 Twitter/X',
    'bing / organic':             '🔍 Bing organique',
    'facebook.com / referral':    '📘 Facebook',
    'youtube.com / referral':     '▶️ YouTube',
  };
  if (map[name]) return map[name];
  // Génération automatique pour les autres
  const [src, med] = name.split(' / ');
  const icons = { organic: '🔍', social: '📱', email: '📧', referral: '↗️', cpc: '💰', none: '🔗' };
  return (icons[med] ?? '🌐') + ' ' + name;
}

function deviceIcon(name) {
  const map = { mobile: '📱', desktop: '💻', tablet: '🖥️' };
  return (map[name.toLowerCase()] ?? '📟') + ' ' + name;
}

// ── PDF & Email ───────────────────────────────────────────────────────────────

async function generatePDF(html) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 700, height: 900 });
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

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  if (!GA_PROPERTY) {
    console.error('❌ GA_PROPERTY_ID manquant (ex: properties/123456789)');
    process.exit(1);
  }

  const now      = new Date();
  const dateStr  = formatDate(now);

  // Périodes (même logique que SEO Digest — décalage 2j pour fraîcheur des données GA4)
  const d7End    = formatDate(new Date(now - 2  * 86400000));
  const d7Start  = formatDate(new Date(now - 9  * 86400000));
  const prevEnd  = formatDate(new Date(now - 9  * 86400000));
  const prevStart = formatDate(new Date(now - 16 * 86400000));
  const d28End   = d7End;
  const d28Start = formatDate(new Date(now - 30 * 86400000));

  console.log(`📊 GA Report — ${d7Start} → ${d7End}`);
  console.log(`   Property : ${GA_PROPERTY}\n`);

  const token = await getAccessToken();
  console.log('✅ Token OAuth2 ok');

  const [overview, overviewPrev, topPages, sources, devices, countries, overview28, topPhotos, topVideos, topCTAs] = await Promise.all([
    fetchOverview(token, d7Start, d7End, prevStart, prevEnd),
    fetchOverview(token, prevStart, prevEnd, formatDate(new Date(now - 23 * 86400000)), formatDate(new Date(now - 16 * 86400000))),
    fetchTopPages(token, d7Start, d7End),
    fetchSources(token,  d7Start, d7End),
    fetchDevices(token,  d7Start, d7End),
    fetchCountries(token,d7Start, d7End),
    fetchOverview(token, d28Start, d28End, formatDate(new Date(now - 58 * 86400000)), formatDate(new Date(now - 30 * 86400000))),
    fetchTopPhotos(token, d28Start, d28End),
    fetchTopVideos(token, d28Start, d28End),
    fetchTopCTAs(token,   d28Start, d28End),
  ]);

  console.log('✅ Données GA4 récupérées');

  // ── Extraction overview 7j ────────────────────────────────────────────────

  // Multi-dateRange : les rows sont indexées par dateRange name dans dimensionValues[0]
  function extractOverview(report, rangeName) {
    // GA4 renvoie rows avec dimensionValues[0].value = rangeName quand on a multi-dateRange sans dimension
    const rows = report.rows || [];
    // Avec 0 dimension + 2 dateRanges → 2 rows
    const row = rows.find(r => r.dimensionValues?.[0]?.value === rangeName);
    if (!row) return { sessions: 0, users: 0, pageViews: 0, duration: 0, engagementRate: 0, newUsers: 0 };
    const m = row.metricValues;
    return {
      sessions:       Number(m[0]?.value ?? 0),
      users:          Number(m[1]?.value ?? 0),
      pageViews:      Number(m[2]?.value ?? 0),
      duration:       Number(m[3]?.value ?? 0),
      engagementRate: Number(m[4]?.value ?? 0),
      newUsers:       Number(m[5]?.value ?? 0),
    };
  }

  const curr = extractOverview(overview, 'current');
  const prev = extractOverview(overview, 'previous');
  const curr28 = extractOverview(overview28, 'current');

  console.log(`   Sessions 7j : ${curr.sessions} (prev: ${prev.sessions})`);
  console.log(`   Users 7j    : ${curr.users}`);
  console.log(`   Pages vues  : ${curr.pageViews}`);

  // ── Top pages ─────────────────────────────────────────────────────────────
  const pageRows = getRows(topPages);
  const totalPageViews = pageRows.reduce((a, r) => a + r.metrics[0], 0) || 1;

  const pagesHtml = pageRows.map(r => {
    const pct = Math.round((r.metrics[0] / totalPageViews) * 100);
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${r.dim[0]}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${fmtNum(r.metrics[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${fmtNum(r.metrics[1])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${fmtDuration(r.metrics[2])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${pct}%</td>
    </tr>`;
  }).join('');

  // ── Sources de trafic ─────────────────────────────────────────────────────
  const sourceRows = getRows(sources);
  const totalSessions = sourceRows.reduce((a, r) => a + r.metrics[0], 0) || 1;

  const sourcesHtml = sourceRows.map(r => {
    const pct = Math.round((r.metrics[0] / totalSessions) * 100);
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${sourceLabel(r.dim[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${fmtNum(r.metrics[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${pct}%</td>
    </tr>`;
  }).join('');

  // ── Appareils ─────────────────────────────────────────────────────────────
  const deviceRows = getRows(devices);
  const totalDeviceSessions = deviceRows.reduce((a, r) => a + r.metrics[0], 0) || 1;

  const devicesHtml = deviceRows.map(r => {
    const pct = Math.round((r.metrics[0] / totalDeviceSessions) * 100);
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${deviceIcon(r.dim[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${fmtNum(r.metrics[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${pct}%</td>
    </tr>`;
  }).join('');

  // ── Top Photos ────────────────────────────────────────────────────────────
  const photoRows = getRows(topPhotos);
  const totalPhotoEvents = photoRows.reduce((a, r) => a + r.metrics[0], 0) || 1;

  const photosHtml = photoRows.length === 0
    ? `<tr><td colspan="3" style="padding:12px;color:#666;font-size:12px;text-align:center">Aucune donnée photo sur 28j</td></tr>`
    : photoRows.map(r => {
        // photo_name = "filename.webp | Titre de la photo" → on sépare les deux parties
        const parts = r.dim[0].split(' | ');
        const filename = parts[0].replace(/\.webp$/, '').replace(/-/g, ' ').slice(0, 40);
        const title    = parts[1] ? parts[1].slice(0, 35) : filename;
        const pct = Math.round((r.metrics[0] / totalPhotoEvents) * 100);
        return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;font-size:12px">
        <div style="color:#1a1a1a;font-weight:500">${title}</div>
        <div style="color:#666;font-size:10px;margin-top:2px">${filename}</div>
      </td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${fmtNum(r.metrics[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${pct}%</td>
    </tr>`;
      }).join('');

  // ── Top Vidéos ────────────────────────────────────────────────────────────
  const videoRows = getRows(topVideos);
  const videosHtml = videoRows.length === 0
    ? `<tr><td colspan="2" style="padding:12px;color:#666;font-size:12px;text-align:center">Aucune vidéo sur 28j</td></tr>`
    : videoRows.map(r => `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">▶ ${r.dim[0].slice(0, 45)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${fmtNum(r.metrics[0])}</td>
    </tr>`).join('');

  // ── Top CTAs ──────────────────────────────────────────────────────────────
  const ctaRows = getRows(topCTAs);
  const totalCTAEvents = ctaRows.reduce((a, r) => a + r.metrics[0], 0) || 1;
  const ctasHtml = ctaRows.length === 0
    ? `<tr><td colspan="3" style="padding:12px;color:#666;font-size:12px;text-align:center">Aucun clic CTA sur 28j</td></tr>`
    : ctaRows.map(r => {
        const pct = Math.round((r.metrics[0] / totalCTAEvents) * 100);
        return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${r.dim[0].slice(0, 40)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${fmtNum(r.metrics[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${pct}%</td>
    </tr>`;
      }).join('');

  // ── Pays ──────────────────────────────────────────────────────────────────
  const countryRows = getRows(countries);
  const totalCountrySessions = countryRows.reduce((a, r) => a + r.metrics[0], 0) || 1;

  const countriesHtml = countryRows.map(r => {
    const pct = Math.round((r.metrics[0] / totalCountrySessions) * 100);
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:12px">${r.dim[0]}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;font-size:13px;color:#1a1a1a">${fmtNum(r.metrics[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:12px">${pct}%</td>
    </tr>`;
  }).join('');

  // ── HTML ──────────────────────────────────────────────────────────────────

  const PB = 'page-break-before:always;padding-top:24px;'; // shorthand saut de page Puppeteer

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body { margin:0; padding:24px; background:#fff; font-family:Georgia,serif; color:#1a1a1a; }
  tr { page-break-inside: avoid; }
  table { border-collapse: collapse; width: 100%; }
</style>
</head>
<body>
<div style="max-width:660px;margin:0 auto">

  <!-- ═══════════════════ PAGE 1 — Header + KPIs ═══════════════════ -->
  <h1 style="font-size:20px;color:#1a1a1a;margin:0 0 4px">Rapport Google Analytics 4 — Dark Massilia</h1>
  <p style="margin:0 0 24px;font-size:12px;color:#666">${d7Start} → ${d7End} · karimsaari.com</p>

  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">7 derniers jours</h2>
  <table style="border-collapse:collapse;margin-bottom:24px;font-size:12px">
    ${kpi('Sessions',         fmtNum(curr.sessions),       `— ${diffArrow(curr.sessions,        prev.sessions)}${diffPct(curr.sessions,        prev.sessions)} vs péri. préc.`)}
    ${kpi('Utilisateurs',     fmtNum(curr.users),          `— ${diffArrow(curr.users,           prev.users)}${diffPct(curr.users,            prev.users)} vs péri. préc.`)}
    ${kpi('Pages vues',       fmtNum(curr.pageViews),      `— ${diffArrow(curr.pageViews,       prev.pageViews)}${diffPct(curr.pageViews,      prev.pageViews)} vs péri. préc.`)}
    ${kpi('Durée moy.',       fmtDuration(curr.duration),  `— prev: ${fmtDuration(prev.duration)}`)}
    ${kpi('Engagement',       fmtPct(curr.engagementRate), `— prev: ${fmtPct(prev.engagementRate)}`)}
    ${kpi('Nv. utilisateurs', fmtNum(curr.newUsers),       `— ${diffArrow(curr.newUsers, prev.newUsers)} vs péri. préc.`)}
  </table>

  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">28 derniers jours</h2>
  <table style="border-collapse:collapse;margin-bottom:32px;font-size:12px">
    ${kpi('Sessions 28j',       fmtNum(curr28.sessions),       null)}
    ${kpi('Utilisateurs 28j',   fmtNum(curr28.users),          null)}
    ${kpi('Pages vues 28j',     fmtNum(curr28.pageViews),      null)}
    ${kpi('Durée moy. 28j',     fmtDuration(curr28.duration),  null)}
    ${kpi('Engagement 28j',     fmtPct(curr28.engagementRate), null)}
    ${kpi('Nv. visiteurs 28j',  fmtNum(curr28.newUsers),       null)}
  </table>

  <!-- ═══════════════════ PAGE 2 — Top pages ═══════════════════ -->
  <div style="${PB}">
    <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Top pages — 7 jours</h2>
    <table style="margin-bottom:24px">
      <thead><tr style="background:#1a1a1a;color:#fff">
        <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Page</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Vues</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Sessions</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Durée</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Part</th>
      </tr></thead>
      <tbody>${pagesHtml}</tbody>
    </table>
  </div>

  <!-- ═══════════════════ PAGE 3 — Sources + Appareils + Pays ═══════════════════ -->
  <div style="${PB}">
    <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Source / Support — 7 jours</h2>
    <table style="margin-bottom:24px">
      <thead><tr style="background:#1a1a1a;color:#fff">
        <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Source</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Sessions</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Part</th>
      </tr></thead>
      <tbody>${sourcesHtml}</tbody>
    </table>

    <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Appareils — 7 jours</h2>
    <table style="margin-bottom:24px">
      <thead><tr style="background:#1a1a1a;color:#fff">
        <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Appareil</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Sessions</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Part</th>
      </tr></thead>
      <tbody>${devicesHtml}</tbody>
    </table>

    <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Top pays — 7 jours</h2>
    <table style="margin-bottom:24px">
      <thead><tr style="background:#1a1a1a;color:#fff">
        <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Pays</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Sessions</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Part</th>
      </tr></thead>
      <tbody>${countriesHtml}</tbody>
    </table>
  </div>

  <!-- ═══════════════════ PAGE 4 — Photos + Vidéos + CTAs (28j) ═══════════════════ -->
  <div style="${PB}">
    <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">📸 Top photos vues — 28 jours</h2>
    <table style="margin-bottom:24px">
      <thead><tr style="background:#1a1a1a;color:#fff">
        <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Photo</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Vues</th>
        <th style="padding:7px 10px;font-weight:600;font-size:12px">Part</th>
      </tr></thead>
      <tbody>${photosHtml}</tbody>
    </table>

    <div style="display:flex;gap:16px;margin-bottom:24px">
      <div style="flex:1">
        <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">▶ Top vidéos — 28j</h2>
        <table>
          <thead><tr style="background:#1a1a1a;color:#fff">
            <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Vidéo</th>
            <th style="padding:7px 10px;font-weight:600;font-size:12px">Lectures</th>
          </tr></thead>
          <tbody>${videosHtml}</tbody>
        </table>
      </div>
      <div style="flex:1">
        <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">🎯 Top CTAs — 28j</h2>
        <table>
          <thead><tr style="background:#1a1a1a;color:#fff">
            <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:12px">Bouton</th>
            <th style="padding:7px 10px;font-weight:600;font-size:12px">Clics</th>
            <th style="padding:7px 10px;font-weight:600;font-size:12px">Part</th>
          </tr></thead>
          <tbody>${ctasHtml}</tbody>
        </table>
      </div>
    </div>

    <p style="font-size:10px;color:#aaa;text-align:center;margin:0">Généré automatiquement · Google Analytics 4 · Dark Massilia · karimsaari.com</p>
  </div>

</div>
</body></html>`;

  // ── PDF ───────────────────────────────────────────────────────────────────
  if (process.env.BREVO_API_KEY) {
    console.log('📄 Génération PDF...');
    let pdfBuffer = null;
    try {
      pdfBuffer = await generatePDF(html);
      console.log(`✅ PDF généré (${Math.round(pdfBuffer.length / 1024)} KB)`);
    } catch (err) {
      console.warn('⚠️  PDF non généré (puppeteer) :', err.message);
    }

    const subject = `📈 GA Report — semaine du ${d7Start}`;
    const pdfName = `ga-report-${d7End}.pdf`;
    console.log('📧 Envoi email Brevo...');
    const result = await sendEmail(html, subject, pdfBuffer, pdfName);
    if (result.messageId) {
      console.log(`✅ Email envoyé (messageId: ${result.messageId})${pdfBuffer ? ' + PDF' : ''}`);
    } else {
      console.error('❌ Erreur Brevo:', JSON.stringify(result));
      process.exit(1);
    }
  } else {
    console.log('ℹ️  BREVO_API_KEY non défini — rapport généré sans envoi email');
    console.log(`\n📊 Résumé :`);
    console.log(`   Sessions : ${curr.sessions} (${curr.sessions >= prev.sessions ? '+' : ''}${curr.sessions - prev.sessions} vs sem. préc.)`);
    console.log(`   Users    : ${curr.users}`);
    console.log(`   Vues     : ${curr.pageViews}`);
    console.log(`   Durée    : ${fmtDuration(curr.duration)}`);
    console.log(`   Engagement : ${fmtPct(curr.engagementRate)}`);
  }
})();
