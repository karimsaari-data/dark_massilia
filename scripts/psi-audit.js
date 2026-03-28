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
  if (s === null) return '#666';
  const t = THRESHOLDS[cat];
  if (s >= t.min) return 'green';
  return t.level === 'error' ? '#c0392b' : '#e67e22';
}

function scoreLabel(s) {
  if (s === null) return '—';
  const pct = Math.round(s * 100);
  const label = pct >= 90 ? 'Bon' : pct >= 50 ? 'Moyen' : 'Faible';
  const color = pct >= 90 ? 'green' : pct >= 50 ? '#e67e22' : '#c0392b';
  return `<span style="font-weight:700;color:${color}">${pct} (${label})</span>`;
}

function scoreBar(s) {
  if (s === null) return '—';
  const pct = Math.round(s * 100);
  const color = pct >= 90 ? 'green' : pct >= 50 ? '#e67e22' : '#c0392b';
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
  if (!process.env.PSI_API_KEY) console.log('⚠️  Sans clé PSI_API_KEY : limite 50 req/s → délai 3s entre pages\n');
  else console.log(`✅ PSI_API_KEY configurée — délai 1s entre pages\n`);

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

    // Délai anti rate-limit : 1s avec clé (quota dédié), 3s sans
    await new Promise(r => setTimeout(r, process.env.PSI_API_KEY ? 1000 : 3000));
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
    <tr style="${warn ? 'background:rgba(192,57,43,0.05)' : ''}">
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;color:#555;font-size:11px;word-break:break-all">${pageLabel(r.url)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-size:12px">${scoreLabel(r.perf)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-size:12px">${scoreLabel(r.seo)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-size:12px">${scoreLabel(r.a11y)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;font-size:12px">${scoreLabel(r.bp)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:11px">${r.fcp}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:11px">${r.lcp}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:11px">${r.cls}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:11px">${r.tbt}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:11px">${r.inp}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #ddd;text-align:center;color:#555;font-size:11px">${r.ttfb}</td>
    </tr>`;
  }).join('');

  const statusColor = errors === 0 ? 'green' : '#c0392b';
  const statusLabel = errors === 0 ? 'Toutes les pages OK' : `${errors} page(s) sous les seuils`;
  const barsHeight  = Math.max(320, sorted.length * 22);

  const html = `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
</head>
<body style="margin:0;background:#fff;font-family:Georgia,serif;color:#1a1a1a;padding:24px">
<div style="max-width:860px;margin:0 auto">

  <h1 style="font-size:20px;color:#1a1a1a;margin:0 0 4px">Audit PageSpeed Insights — Dark Massilia</h1>
  <p style="margin:0 0 4px;font-size:12px;color:#666">${dateStr} — ${URLS.length} pages · mobile · karimsaari.com</p>
  <p style="margin:0 0 24px;font-size:13px;font-weight:600;color:${statusColor}">${statusLabel}</p>

  <!-- Scores moyens (tableau synthèse) -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Scores moyens — ${URLS.length} pages</h2>
  <table style="border-collapse:collapse;margin-bottom:24px;font-size:12px">
    <tr><td style="padding:3px 16px 3px 0;color:#555">Performance</td><td>${scoreLabel(avgPerf !== null ? avgPerf / 100 : null)}</td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#555">SEO</td><td>${scoreLabel(avgSeo !== null ? avgSeo / 100 : null)}</td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#555">Accessibilité</td><td>${scoreLabel(avgA11y !== null ? avgA11y / 100 : null)}</td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#555">Best Practices</td><td>${scoreLabel(avgBp !== null ? avgBp / 100 : null)}</td></tr>
  </table>

  <!-- Seuils -->
  <p style="font-size:11px;color:#666;margin:0 0 24px">Seuils : Perf ≥60 (erreur) · SEO ≥90 (erreur) · Accessibilité ≥80 (warning) · Best Practices ≥80 (warning) — Interprétation : ≥90 = Bon · ≥50 = Moyen · &lt;50 = Faible</p>

  <!-- Tableau détail par page -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Détail par page (triées par perf. croissante)</h2>
  <div style="overflow-x:auto;margin-bottom:24px">
    <table style="width:100%;border-collapse:collapse;min-width:750px">
      <thead><tr style="background:#1a1a1a;color:#fff">
        <th style="padding:7px 10px;text-align:left;font-weight:600;font-size:11px">Page</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">Perf</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">SEO</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">A11y</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">BP</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">FCP</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">LCP</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">CLS</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">TBT</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">INP</th>
        <th style="padding:7px 10px;font-weight:600;font-size:11px">TTFB</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <!-- Courbe d'évolution -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">
    Évolution — ${chartHistory.length} semaine${chartHistory.length > 1 ? 's' : ''}
    ${chartHistory.length < 2 ? '<span style="font-size:10px;color:#666;margin-left:8px">(courbe disponible dès la 2e semaine)</span>' : ''}
  </h2>
  <div style="background:#f8f9fa;border:1px solid #ddd;border-radius:4px;padding:16px;margin-bottom:24px">
    <div style="position:relative;height:180px">
      <canvas id="chartEvol" style="background:#f8f9fa"></canvas>
    </div>
  </div>

  <!-- Barres horizontales — comparaison pages -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Score performance par page</h2>
  <div style="background:#f8f9fa;border:1px solid #ddd;border-radius:4px;padding:16px;margin-bottom:24px">
    <div style="position:relative;height:${barsHeight}px">
      <canvas id="chartBars" style="background:#f8f9fa"></canvas>
    </div>
  </div>

  <p style="font-size:10px;color:#aaa;text-align:center;margin:0">Généré automatiquement chaque dimanche · PageSpeed Insights API · Dark Massilia · karimsaari.com</p>
</div>

<!-- ── GLOSSAIRE ──────────────────────────────────────────────────────── -->
<div style="max-width:860px;margin:0 auto;page-break-before:always;padding-top:16px">
  <h2 style="font-size:16px;color:#1a1a1a;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:4px">Glossaire Technique — Webperf &amp; SEO</h2>
  <p style="font-size:10px;color:#888;margin:0 0 16px">Référence des indicateurs — Rapport Audit PageSpeed Insights · Dark Massilia</p>

  <!-- Section 1 -->
  <h3 style="font-size:12px;font-weight:700;color:#21c47b;border-left:3px solid #21c47b;padding-left:8px;margin:0 0 8px">Indicateurs de Performance (Core Web Vitals &amp; Lab Data)</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11px">
    <tr style="background:#f5f5f5"><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;width:160px;border-bottom:1px solid #e0e0e0">Performance (Score Global)</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Note calculée par Google sur 100 synthétisant la vitesse de chargement et la fluidité de la page. Ton score moyen actuel est de 66/100.</td></tr>
    <tr><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #e0e0e0">FCP — First Contentful Paint</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Temps écoulé avant que le premier texte ou image ne devienne visible à l'écran. Sur /actualites, il est de 2,6 s.</td></tr>
    <tr style="background:#f5f5f5"><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #e0e0e0">LCP — Largest Contentful Paint</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Temps nécessaire pour afficher l'élément le plus volumineux de la page (souvent une photo haute résolution). Point critique sur /photographie-paysage-mer (15,9 s).</td></tr>
    <tr><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #e0e0e0">CLS — Cumulative Layout Shift</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Mesure la stabilité visuelle. Un score élevé (0,166 sur /blog) indique que des éléments « sautent » pendant le chargement, ce qui nuit à l'expérience utilisateur.</td></tr>
    <tr style="background:#f5f5f5"><td style="padding:6px 8px;font-weight:700;color:#1a1a1a">TBT — Total Blocking Time</td><td style="padding:6px 8px;color:#444">Temps total durant lequel la page est bloquée par des scripts, empêchant l'utilisateur d'interagir (clics, défilement).</td></tr>
  </table>

  <!-- Section 2 -->
  <h3 style="font-size:12px;font-weight:700;color:#f97316;border-left:3px solid #f97316;padding-left:8px;margin:0 0 8px">Qualité &amp; Accessibilité</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11px">
    <tr style="background:#f5f5f5"><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;width:160px;border-bottom:1px solid #e0e0e0">BP — Best Practices</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Respect des standards de développement web (HTTPS, contraste des images, bibliothèques JS à jour). Ton site excelle ici : 99/100.</td></tr>
    <tr><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #e0e0e0">A11y — Accessibility</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Facilité d'utilisation pour les personnes en situation de handicap (lecteurs d'écran, navigation au clavier). Score : 98/100.</td></tr>
    <tr style="background:#f5f5f5"><td style="padding:6px 8px;font-weight:700;color:#1a1a1a">SEO</td><td style="padding:6px 8px;color:#444">Présence des éléments de base pour l'indexation (balises Title, Meta descriptions, H1). Score : 100/100.</td></tr>
  </table>

  <!-- Section 3 -->
  <h3 style="font-size:12px;font-weight:700;color:#3b82f6;border-left:3px solid #3b82f6;padding-left:8px;margin:0 0 8px">Lexique SEO &amp; On-Page</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11px">
    <tr style="background:#f5f5f5"><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;width:160px;border-bottom:1px solid #e0e0e0">E-E-A-T</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Expérience, Expertise, Autorité et Fiabilité. Critère Google pour juger la qualité d'un auteur sur des sujets sensibles (écologie, science).</td></tr>
    <tr><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #e0e0e0">Ancre de lien (Anchor Text)</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Texte cliquable d'un lien hypertexte. Des ancres thématiques (ex : « calanques marseille ») ont plus de valeur SEO que les ancres neutres (ex : « official website »).</td></tr>
    <tr style="background:#f5f5f5"><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #e0e0e0">Deep Link (Lien profond)</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Lien pointant vers une page interne plutôt que vers la page d'accueil. Une absence critique (0 %) nuit à la distribution du PageRank.</td></tr>
    <tr><td style="padding:6px 8px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #e0e0e0">CTR — Click-Through Rate</td><td style="padding:6px 8px;color:#444;border-bottom:1px solid #e0e0e0">Rapport entre clics et impressions dans les résultats de recherche. Un CTR moyen de 6,5 % est au-dessus de la norme (2-3 %).</td></tr>
    <tr style="background:#f5f5f5"><td style="padding:6px 8px;font-weight:700;color:#1a1a1a">Lien Orphelin</td><td style="padding:6px 8px;color:#444">Page présente sur le site mais ne recevant aucun lien interne, la rendant invisible pour Google. Aucune détectée sur ton site.</td></tr>
  </table>

  <p style="font-size:10px;color:#aaa;text-align:center;margin:24px 0 0">karimsaari.com — Dark Massilia · Karim Saari · Rapport Audit PageSpeed Insights 2026</p>
</div>

<script>
// Courbe d'évolution
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
    plugins: { legend: { labels: { color: '#1a1a1a', font: { size: 10 } } } },
    scales: {
      x: { ticks: { color: '#666', font: { size: 9 } }, grid: { color: '#ddd' } },
      y: {
        type: 'linear', position: 'left', min: 0, max: 100,
        ticks: { color: '#21c47b', font: { size: 9 } },
        grid: { color: '#ddd' },
        title: { display: true, text: 'Score Perf', color: '#21c47b', font: { size: 9 } }
      },
      y1: {
        type: 'linear', position: 'right', min: 0,
        ticks: { color: '#e67e22', font: { size: 9 } },
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'LCP (s)', color: '#e67e22', font: { size: 9 } }
      }
    }
  }
});

// Barres horizontales
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
        ticks: { color: '#666', font: { size: 9 } },
        grid: { color: '#ddd' }
      },
      y: { ticks: { color: '#555', font: { size: 9 } }, grid: { display: false } }
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
