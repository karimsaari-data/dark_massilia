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
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 8,
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
  if (diff === 0) return `<span style="color:#64748b">— 0</span>`;
  const sign  = diff > 0 ? '+' : '';
  const color = better ? '#21c47b' : '#e74c3c';
  const arrow = diff > 0 ? '▲' : '▼';
  return `<span style="color:${color}">${arrow} ${sign}${fmtNum(Math.abs(diff))}</span>`;
}

function diffPct(curr, prev) {
  if (!prev) return '';
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (pct === 0) return '';
  const color = pct > 0 ? '#21c47b' : '#e74c3c';
  return ` <span style="font-size:11px;color:${color}">(${pct > 0 ? '+' : ''}${pct}%)</span>`;
}

function kpi(label, value, sub, subColor) {
  return `<div style="flex:1;background:#0f2035;border-radius:12px;padding:16px 12px;text-align:center">
    <div style="font-size:28px;font-weight:700;color:#fff">${value}</div>
    <div style="font-size:11px;color:#64748b;margin-top:3px">${label}</div>
    ${sub ? `<div style="font-size:11px;color:${subColor ?? '#94a3b8'};margin-top:3px">${sub}</div>` : ''}
  </div>`;
}

function sourceLabel(name) {
  const map = {
    'Organic Search':   '🔍 Recherche organique',
    'Direct':           '🔗 Direct',
    'Organic Social':   '📱 Réseaux sociaux',
    'Referral':         '↗️ Référents',
    'Email':            '📧 Email',
    'Paid Search':      '💰 Recherche payante',
    'Unassigned':       '❓ Non assigné',
    'Organic Video':    '▶️ Vidéo organique',
  };
  return map[name] || name;
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

  const [overview, overviewPrev, topPages, sources, devices, countries, overview28] = await Promise.all([
    fetchOverview(token, d7Start, d7End, prevStart, prevEnd),
    fetchOverview(token, prevStart, prevEnd, formatDate(new Date(now - 23 * 86400000)), formatDate(new Date(now - 16 * 86400000))),
    fetchTopPages(token, d7Start, d7End),
    fetchSources(token,  d7Start, d7End),
    fetchDevices(token,  d7Start, d7End),
    fetchCountries(token,d7Start, d7End),
    fetchOverview(token, d28Start, d28End, formatDate(new Date(now - 58 * 86400000)), formatDate(new Date(now - 30 * 86400000))),
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
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${r.dim[0]}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-weight:600;font-size:13px">${fmtNum(r.metrics[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${fmtNum(r.metrics[1])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#94a3b8;font-size:12px">${fmtDuration(r.metrics[2])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:right;padding-right:14px">
        <div style="display:inline-flex;align-items:center;gap:6px">
          <div style="width:50px;height:5px;background:#1e3a50;border-radius:3px">
            <div style="width:${Math.min(pct,100)}%;height:5px;background:#21c47b;border-radius:3px"></div>
          </div>
          <span style="font-size:10px;color:#64748b">${pct}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');

  // ── Sources de trafic ─────────────────────────────────────────────────────
  const sourceRows = getRows(sources);
  const totalSessions = sourceRows.reduce((a, r) => a + r.metrics[0], 0) || 1;

  const sourcesHtml = sourceRows.map(r => {
    const pct = Math.round((r.metrics[0] / totalSessions) * 100);
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${sourceLabel(r.dim[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-weight:600;font-size:13px">${fmtNum(r.metrics[0])}</td>
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

  // ── Appareils ─────────────────────────────────────────────────────────────
  const deviceRows = getRows(devices);
  const totalDeviceSessions = deviceRows.reduce((a, r) => a + r.metrics[0], 0) || 1;

  const devicesHtml = deviceRows.map(r => {
    const pct = Math.round((r.metrics[0] / totalDeviceSessions) * 100);
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${deviceIcon(r.dim[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-weight:600;font-size:13px">${fmtNum(r.metrics[0])}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:right;padding-right:14px">
        <div style="display:inline-flex;align-items:center;gap:6px">
          <div style="width:60px;height:6px;background:#1e3a50;border-radius:3px">
            <div style="width:${Math.min(pct,100)}%;height:6px;background:#0091ff;border-radius:3px"></div>
          </div>
          <span style="font-size:11px;color:#64748b">${pct}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');

  // ── Pays ──────────────────────────────────────────────────────────────────
  const countryRows = getRows(countries);
  const totalCountrySessions = countryRows.reduce((a, r) => a + r.metrics[0], 0) || 1;

  const countriesHtml = countryRows.map(r => {
    const pct = Math.round((r.metrics[0] / totalCountrySessions) * 100);
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${r.dim[0]}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-weight:600;font-size:13px">${fmtNum(r.metrics[0])}</td>
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

  // ── HTML ──────────────────────────────────────────────────────────────────

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a1628;font-family:system-ui,sans-serif;color:#e2e8f0">
<div style="max-width:660px;margin:0 auto;padding:28px 16px">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px">
    <div style="font-size:11px;letter-spacing:2px;color:#21c47b;text-transform:uppercase;margin-bottom:6px">Rapport Analytics hebdomadaire</div>
    <h1 style="margin:0;font-size:22px;color:#fff">Dark Massilia · Google Analytics 4</h1>
    <div style="font-size:12px;color:#64748b;margin-top:4px">${d7Start} → ${d7End}</div>
  </div>

  <!-- KPIs 7j -->
  <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">7 derniers jours</div>
  <div style="display:flex;gap:8px;margin-bottom:8px">
    ${kpi('Sessions', fmtNum(curr.sessions),   `${diffArrow(curr.sessions, prev.sessions)}${diffPct(curr.sessions, prev.sessions)} vs sem. préc.`, curr.sessions >= prev.sessions ? '#21c47b' : '#e74c3c')}
    ${kpi('Utilisateurs', fmtNum(curr.users),   `${diffArrow(curr.users, prev.users)}${diffPct(curr.users, prev.users)} vs sem. préc.`, curr.users >= prev.users ? '#21c47b' : '#e74c3c')}
    ${kpi('Pages vues', fmtNum(curr.pageViews), `${diffArrow(curr.pageViews, prev.pageViews)}${diffPct(curr.pageViews, prev.pageViews)} vs sem. préc.`, curr.pageViews >= prev.pageViews ? '#21c47b' : '#e74c3c')}
    ${kpi('Durée moy.', fmtDuration(curr.duration), `prev: ${fmtDuration(prev.duration)}`, null)}
  </div>
  <div style="display:flex;gap:8px;margin-bottom:24px">
    ${kpi('Engagement', fmtPct(curr.engagementRate), `prev: ${fmtPct(prev.engagementRate)}`, curr.engagementRate >= prev.engagementRate ? '#21c47b' : '#e74c3c')}
    ${kpi('Nv. utilisateurs', fmtNum(curr.newUsers), `${diffArrow(curr.newUsers, prev.newUsers)} vs sem. préc.`, curr.newUsers >= prev.newUsers ? '#21c47b' : '#e74c3c')}
    ${kpi('Sessions 28j', fmtNum(curr28.sessions), null, null)}
    ${kpi('Pages vues 28j', fmtNum(curr28.pageViews), null, null)}
  </div>

  <!-- Top pages + sources -->
  <div style="display:flex;gap:10px;margin-bottom:16px">
    <div style="flex:1.5;background:#0f2035;border-radius:12px;padding:16px">
      <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Top pages — 7 jours</h2>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
          <th style="padding:6px 10px;text-align:left">Page</th>
          <th style="padding:6px 10px">Vues</th>
          <th style="padding:6px 10px">Sessions</th>
          <th style="padding:6px 10px">Durée</th>
          <th style="padding:6px 10px">Part</th>
        </tr></thead>
        <tbody>${pagesHtml}</tbody>
      </table>
    </div>
  </div>

  <!-- Sources + Appareils -->
  <div style="display:flex;gap:10px;margin-bottom:16px">
    <div style="flex:1;background:#0f2035;border-radius:12px;padding:16px">
      <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Sources de trafic — 7j</h2>
      <table style="width:100%;border-collapse:collapse">${sourcesHtml}</table>
    </div>
    <div style="flex:1;background:#0f2035;border-radius:12px;padding:16px">
      <h2 style="margin:0 0 12px;font-size:13px;color:#0091ff">Appareils — 7j</h2>
      <table style="width:100%;border-collapse:collapse">${devicesHtml}</table>
    </div>
  </div>

  <!-- Pays -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:24px">
    <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Top pays — 7 jours</h2>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
        <th style="padding:6px 10px;text-align:left">Pays</th>
        <th style="padding:6px 10px">Sessions</th>
        <th style="padding:6px 10px">Part</th>
      </tr></thead>
      <tbody>${countriesHtml}</tbody>
    </table>
  </div>

  <div style="text-align:center;font-size:11px;color:#334155">
    Généré automatiquement chaque semaine · Google Analytics 4 · Dark Massilia
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
    const pdfName = `ga-report-${d7Start}.pdf`;
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
