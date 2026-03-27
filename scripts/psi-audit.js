/**
 * psi-audit.js — Audit PageSpeed Insights (Lighthouse via API Google)
 * Usage : npm run psi-audit
 * Avantage vs LHCI : Google exécute Chrome sur ses propres serveurs → pas de NO_FCP en CI
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BREVO_TO   = 'email@karimsaari.com';
const BREVO_FROM = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };
const HISTORY_PATH = resolve(__dirname, '../data/psi-history.json');

// Seuils (cohérents avec l'ancien .lighthouserc.json)
const THRESHOLDS = {
  performance:    { min: 0.60, level: 'error' },
  seo:            { min: 0.90, level: 'error' },
  accessibility:  { min: 0.80, level: 'warn'  },
  'best-practices':{ min: 0.80, level: 'warn' },
};

// URLs à auditer (tirées de .lighthouserc.json)
const URLS = JSON.parse(
  readFileSync(resolve(__dirname, '../.lighthouserc.json'), 'utf8')
).ci.collect.url;

// ── Historique ────────────────────────────────────────────────────────────────
let historyData = { history: [] };
if (existsSync(HISTORY_PATH)) {
  try { historyData = JSON.parse(readFileSync(HISTORY_PATH, 'utf8')); }
  catch (e) { console.warn('⚠️  psi-history.json illisible:', e.message); }
}

async function fetchPSI(url, strategy = 'mobile') {
  const apiKey = process.env.PSI_API_KEY || '';
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
    + `?url=${encodeURIComponent(url)}`
    + `&strategy=${strategy}`
    + `&category=performance&category=seo&category=accessibility&category=best-practices`
    + (apiKey ? `&key=${apiKey}` : '');

  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`PSI ${res.status} for ${url}`);
  return res.json();
}

function score(data, cat) {
  return data.lighthouseResult?.categories?.[cat]?.score ?? null;
}

function scoreColor(s, cat) {
  if (s === null) return '#64748b';
  const t = THRESHOLDS[cat];
  if (s >= t.min) return '#21c47b';
  return t.level === 'error' ? '#e74c3c' : '#f59e0b';
}

function scoreBar(s) {
  if (s === null) return '—';
  const pct = Math.round(s * 100);
  const color = pct >= 90 ? '#21c47b' : pct >= 50 ? '#f59e0b' : '#e74c3c';
  return `<span style="font-weight:700;color:${color}">${pct}</span>`;
}

function pageLabel(url) { return url.replace('https://karimsaari.com', '') || '/'; }

async function generatePDF(html) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 1100 });
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
  const dateStr = now.toISOString().split('T')[0];

  console.log(`🔍 PSI Audit — ${URLS.length} pages (mobile) …`);
  console.log('⚠️  Sans clé PSI_API_KEY : limite 50 req/s → délai 3s entre pages\n');

  const results = [];
  let errors = 0;
  let apiErrors = 0;

  for (const url of URLS) {
    process.stdout.write(`  → ${pageLabel(url)} … `);
    try {
      const data = await fetchPSI(url, 'mobile');
      const lh = data.lighthouseResult?.audits;
      const r = {
        url,
        perf: score(data, 'performance'),
        seo:  score(data, 'seo'),
        a11y: score(data, 'accessibility'),
        bp:   score(data, 'best-practices'),
        fcp:  lh?.['first-contentful-paint']?.displayValue ?? '—',
        lcp:  lh?.['largest-contentful-paint']?.displayValue ?? '—',
        cls:  lh?.['cumulative-layout-shift']?.displayValue ?? '—',
        tbt:  lh?.['total-blocking-time']?.displayValue ?? '—',
        inp:  lh?.['interaction-to-next-paint']?.displayValue ?? '—',
        ttfb: lh?.['server-response-time']?.displayValue ?? '—',
        // Valeurs numériques pour l'historique et les graphiques
        lcp_ms:  lh?.['largest-contentful-paint']?.numericValue ?? null,
        fcp_ms:  lh?.['first-contentful-paint']?.numericValue ?? null,
        tbt_ms:  lh?.['total-blocking-time']?.numericValue ?? null,
      };
      results.push(r);

      let fail = false;
      for (const [cat, key] of [['performance','perf'],['seo','seo'],['accessibility','a11y'],['best-practices','bp']]) {
        const t = THRESHOLDS[cat];
        if (r[key] !== null && r[key] < t.min && t.level === 'error') fail = true;
      }
      if (fail) errors++;

      console.log(`perf=${Math.round((r.perf??0)*100)} seo=${Math.round((r.seo??0)*100)} a11y=${Math.round((r.a11y??0)*100)} bp=${Math.round((r.bp??0)*100)}`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
      const is429 = err.message.includes('429');
      results.push({ url, perf: null, seo: null, a11y: null, bp: null, fcp: '—', lcp: '—', cls: '—', tbt: '—', inp: '—', ttfb: '—', lcp_ms: null, fcp_ms: null, tbt_ms: null, error: err.message });
      if (is429) apiErrors++;
      else errors++;
    }

    if (!process.env.PSI_API_KEY) await new Promise(r => setTimeout(r, 3000));
  }

  if (apiErrors > 0) console.warn(`\n⚠️  ${apiErrors} page(s) ignorées (429 rate limit — configurez PSI_API_KEY dans les secrets GitHub)`);
  console.log(`\n${errors === 0 ? '✅' : '❌'} Audit terminé — ${errors} page(s) sous les seuils\n`);

  // ── Moyennes scores (0-100) ──────────────────────────────────────────────────
  const avg = (key) => {
    const vals = results.filter(r => r[key] !== null).map(r => r[key]);
    return vals.length ? Math.round((vals.reduce((a,b) => a+b, 0) / vals.length) * 100) : null;
  };
  const avgMs = (key) => {
    const vals = results.filter(r => r[key] !== null).map(r => r[key]);
    return vals.length ? Math.round(vals.reduce((a,b) => a+b, 0) / vals.length) : null;
  };

  const avgPerf = avg('perf'), avgSeo = avg('seo'), avgA11y = avg('a11y'), avgBp = avg('bp');
  const avgLcpMs = avgMs('lcp_ms'), avgFcpMs = avgMs('fcp_ms'), avgTbtMs = avgMs('tbt_ms');

  // ── Mise à jour historique ────────────────────────────────────────────────────
  historyData.history.push({
    date: dateStr,
    avg_perf: avgPerf,
    avg_seo:  avgSeo,
    avg_a11y: avgA11y,
    avg_bp:   avgBp,
    avg_lcp_ms: avgLcpMs,
    avg_fcp_ms: avgFcpMs,
    avg_tbt_ms: avgTbtMs,
  });
  if (historyData.history.length > 52) historyData.history = historyData.history.slice(-52);
  mkdirSync(resolve(__dirname, '../data'), { recursive: true });
  writeFileSync(HISTORY_PATH, JSON.stringify(historyData, null, 2), 'utf8');
  console.log(`📊 Historique mis à jour (${historyData.history.length} entrée(s) — ${HISTORY_PATH})`);

  // ── Données graphiques ───────────────────────────────────────────────────────
  const chartHistory = historyData.history.slice(-12);
  const sorted = [...results].sort((a, b) => (a.perf ?? 1) - (b.perf ?? 1));

  // Chart 1 — Courbe d'évolution
  const evolLabels  = JSON.stringify(chartHistory.map(e => e.date));
  const evolPerf    = JSON.stringify(chartHistory.map(e => e.avg_perf ?? null));
  const evolLcp     = JSON.stringify(chartHistory.map(e => e.avg_lcp_ms ? +(e.avg_lcp_ms / 1000).toFixed(2) : null));

  // Chart 2 — Barres horizontales (pages)
  const barLabels = JSON.stringify(sorted.map(r => pageLabel(r.url)));
  const barData   = JSON.stringify(sorted.map(r => r.perf !== null ? Math.round(r.perf * 100) : 0));
  const barColors = JSON.stringify(sorted.map(r => {
    const s = r.perf !== null ? Math.round(r.perf * 100) : 0;
    return s >= 90 ? 'rgba(33,196,123,0.75)' : s >= 50 ? 'rgba(245,158,11,0.75)' : 'rgba(248,81,73,0.75)';
  }));

  // Chart 3 — Jauges (scores globaux)
  const gaugeColor = (s) => s === null ? '#334155' : s >= 90 ? '#21c47b' : s >= 60 ? '#f59e0b' : '#e74c3c';
  const g = [
    { id: 'gPerf', label: 'Performance', val: avgPerf,  color: gaugeColor(avgPerf) },
    { id: 'gSeo',  label: 'SEO',         val: avgSeo,   color: gaugeColor(avgSeo)  },
    { id: 'gA11y', label: 'Accessibilité', val: avgA11y, color: gaugeColor(avgA11y) },
    { id: 'gBp',   label: 'Best Practices', val: avgBp, color: gaugeColor(avgBp)  },
  ];
  const gaugeScript = g.map(({ id, val }) => `
    new Chart(document.getElementById('${id}'), {
      type: 'doughnut',
      data: { datasets: [{ data: [${val ?? 0}, ${100 - (val ?? 0)}], backgroundColor: ['${gaugeColor(val)}','#1e3a50'], borderWidth: 0, circumference: 180, rotation: 270 }] },
      options: { responsive: true, cutout: '78%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    });`).join('\n');

  // ── Ligne et tableau ─────────────────────────────────────────────────────────
  const rows = sorted.map(r => {
    const warn = (r.perf ?? 1) < THRESHOLDS.performance.min || (r.seo ?? 1) < THRESHOLDS.seo.min;
    return `
    <tr style="${warn ? 'background:rgba(231,76,60,0.05)' : ''}">
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:11px;word-break:break-all">${pageLabel(r.url)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-size:13px">${scoreBar(r.perf)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-size:13px">${scoreBar(r.seo)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-size:13px">${scoreBar(r.a11y)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-size:13px">${scoreBar(r.bp)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#64748b;font-size:11px">${r.fcp}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#64748b;font-size:11px">${r.lcp}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#64748b;font-size:11px">${r.cls}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#64748b;font-size:11px">${r.tbt}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#64748b;font-size:11px">${r.inp}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;color:#64748b;font-size:11px">${r.ttfb}</td>
    </tr>`;
  }).join('');

  function kpi(label, value, color) {
    return `<div style="flex:1;background:#0f2035;border-radius:12px;padding:16px 12px;text-align:center">
      <div style="font-size:32px;font-weight:700;color:${color ?? '#fff'}">${value ?? '—'}</div>
      <div style="font-size:11px;color:#64748b;margin-top:4px">${label}</div>
    </div>`;
  }

  const statusColor = errors === 0 ? '#21c47b' : '#e74c3c';
  const statusLabel = errors === 0 ? '✅ Toutes les pages OK' : `❌ ${errors} page(s) sous les seuils`;
  const barsHeight  = Math.max(320, sorted.length * 22);

  const html = `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
</head>
<body style="margin:0;padding:0;background:#0a1628;font-family:system-ui,sans-serif;color:#e2e8f0">
<div style="max-width:860px;margin:0 auto;padding:28px 16px">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px">
    <div style="font-size:11px;letter-spacing:2px;color:#21c47b;text-transform:uppercase;margin-bottom:6px">Audit Performance hebdomadaire</div>
    <h1 style="margin:0;font-size:22px;color:#fff">Dark Massilia · PageSpeed Insights</h1>
    <div style="font-size:12px;color:#64748b;margin-top:4px">${dateStr} — ${URLS.length} pages · mobile</div>
    <div style="margin-top:10px;font-size:13px;font-weight:600;color:${statusColor}">${statusLabel}</div>
  </div>

  <!-- ① Jauges scores globaux -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:20px">
    <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px">Scores moyens — ${URLS.length} pages</div>
    <div style="display:flex;gap:8px;justify-content:space-around">
      ${g.map(({ id, label, val, color }) => `
      <div style="flex:1;text-align:center">
        <div style="position:relative;height:80px">
          <canvas id="${id}"></canvas>
          <div style="position:absolute;bottom:4px;left:50%;transform:translateX(-50%);font-size:20px;font-weight:800;color:${color}">${val ?? '—'}</div>
        </div>
        <div style="font-size:10px;color:#64748b;margin-top:2px">${label}</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- ② Courbe d'évolution -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:20px">
    <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px">
      Évolution — ${chartHistory.length} semaine${chartHistory.length > 1 ? 's' : ''}
      ${chartHistory.length < 2 ? '<span style="font-size:10px;color:#334155;margin-left:8px">(courbe disponible dès la 2e semaine)</span>' : ''}
    </div>
    <div style="position:relative;height:180px">
      <canvas id="chartEvol"></canvas>
    </div>
  </div>

  <!-- ③ Barres horizontales — comparaison pages -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:20px">
    <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px">Score performance par page</div>
    <div style="position:relative;height:${barsHeight}px">
      <canvas id="chartBars"></canvas>
    </div>
  </div>

  <!-- Seuils -->
  <div style="background:#0f2035;border-radius:12px;padding:12px 16px;margin-bottom:20px;font-size:11px;color:#64748b">
    Seuils : Perf ≥60 (erreur) · SEO ≥90 (erreur) · Accessibilité ≥80 (warning) · Best Practices ≥80 (warning)
  </div>

  <!-- Tableau détail -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;overflow-x:auto">
    <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Détail par page (triées par perf. croissante)</h2>
    <table style="width:100%;border-collapse:collapse;min-width:750px">
      <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
        <th style="padding:6px 10px;text-align:left">Page</th>
        <th style="padding:6px 10px">Perf</th>
        <th style="padding:6px 10px">SEO</th>
        <th style="padding:6px 10px">A11y</th>
        <th style="padding:6px 10px">BP</th>
        <th style="padding:6px 10px">FCP</th>
        <th style="padding:6px 10px">LCP</th>
        <th style="padding:6px 10px">CLS</th>
        <th style="padding:6px 10px">TBT</th>
        <th style="padding:6px 10px">INP</th>
        <th style="padding:6px 10px">TTFB</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <div style="text-align:center;font-size:11px;color:#334155;margin-top:24px">
    Généré automatiquement chaque dimanche · PageSpeed Insights API · Dark Massilia
  </div>
</div>

<script>
// ① Jauges
${gaugeScript}

// ② Courbe d'évolution
new Chart(document.getElementById('chartEvol'), {
  type: 'line',
  data: {
    labels: ${evolLabels},
    datasets: [
      {
        label: 'Performance moy.',
        data: ${evolPerf},
        borderColor: '#21c47b',
        backgroundColor: 'rgba(33,196,123,0.08)',
        fill: true, tension: 0.4, pointRadius: 4,
        yAxisID: 'y',
      },
      {
        label: 'LCP moy. (s)',
        data: ${evolLcp},
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.08)',
        fill: true, tension: 0.4, pointRadius: 4,
        yAxisID: 'y1',
      }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
    scales: {
      x: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: {
        type: 'linear', position: 'left', min: 0, max: 100,
        ticks: { color: '#21c47b', font: { size: 9 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        title: { display: true, text: 'Score Perf', color: '#21c47b', font: { size: 9 } }
      },
      y1: {
        type: 'linear', position: 'right', min: 0,
        ticks: { color: '#f59e0b', font: { size: 9 } },
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'LCP (s)', color: '#f59e0b', font: { size: 9 } }
      }
    }
  }
});

// ③ Barres horizontales
new Chart(document.getElementById('chartBars'), {
  type: 'bar',
  data: {
    labels: ${barLabels},
    datasets: [{
      label: 'Score Performance',
      data: ${barData},
      backgroundColor: ${barColors},
      borderRadius: 3,
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        min: 0, max: 100,
        ticks: { color: '#64748b', font: { size: 9 } },
        grid: { color: 'rgba(255,255,255,0.04)' }
      },
      y: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } }
    }
  }
});
</script>
</body></html>`;

  if (process.env.BREVO_API_KEY) {
    const subject = `🚦 PSI Audit — ${dateStr} — ${errors === 0 ? 'OK' : errors + ' alerte(s)'}`;
    const pdfName = `psi-audit-${dateStr}.pdf`;

    console.log('📄 Génération PDF…');
    let pdfBuffer = null;
    try {
      pdfBuffer = await generatePDF(html);
      console.log(`✅ PDF généré (${Math.round(pdfBuffer.length / 1024)} KB)`);
    } catch (err) {
      console.warn('⚠️  PDF non généré (puppeteer indisponible) :', err.message);
    }

    console.log('📧 Envoi email Brevo…');
    const result = await sendEmail(html, subject, pdfBuffer, pdfName);
    if (result.messageId) {
      console.log(`✅ Email envoyé (messageId: ${result.messageId})${pdfBuffer ? ' + PDF en pièce jointe' : ''}`);
    } else {
      console.error('❌ Erreur Brevo:', JSON.stringify(result));
    }
  } else {
    console.log('ℹ️  BREVO_API_KEY non défini — résultats affichés uniquement en console');
  }

  // Le rapport email/PDF indique les pages sous les seuils — pas besoin d'échouer en CI
})();
