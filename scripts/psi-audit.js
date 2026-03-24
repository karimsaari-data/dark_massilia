/**
 * psi-audit.js — Audit PageSpeed Insights (Lighthouse via API Google)
 * Usage : npm run psi-audit
 * Avantage vs LHCI : Google exécute Chrome sur ses propres serveurs → pas de NO_FCP en CI
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BREVO_TO   = 'email@karimsaari.com';
const BREVO_FROM = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

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
  await page.setViewport({ width: 720, height: 900 });
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
  console.log('⚠️  Sans clé PSI_API_KEY : limite 50 req/s → délai 1,5s entre pages\n');

  const results = [];
  let errors = 0;
  let apiErrors = 0;

  for (const url of URLS) {
    process.stdout.write(`  → ${pageLabel(url)} … `);
    try {
      const data = await fetchPSI(url, 'mobile');
      const r = {
        url,
        perf: score(data, 'performance'),
        seo:  score(data, 'seo'),
        a11y: score(data, 'accessibility'),
        bp:   score(data, 'best-practices'),
        fcp:  data.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue ?? '—',
        lcp:  data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue ?? '—',
        cls:  data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue ?? '—',
      };
      results.push(r);

      // Vérifier seuils
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
      results.push({ url, perf: null, seo: null, a11y: null, bp: null, fcp: '—', lcp: '—', cls: '—', error: err.message });
      if (is429) apiErrors++;
      else errors++;
    }

    // Délai pour ne pas dépasser la limite sans clé API
    if (!process.env.PSI_API_KEY) await new Promise(r => setTimeout(r, 3000));
  }

  if (apiErrors > 0) console.warn(`\n⚠️  ${apiErrors} page(s) ignorées (429 rate limit — configurez PSI_API_KEY dans les secrets GitHub)`);
  console.log(`\n${errors === 0 ? '✅' : '❌'} Audit terminé — ${errors} page(s) sous les seuils\n`);

  // ── Calcul des moyennes ──────────────────────────────────────────────────────
  const avg = (key) => {
    const vals = results.filter(r => r[key] !== null).map(r => r[key]);
    return vals.length ? Math.round((vals.reduce((a,b) => a+b, 0) / vals.length) * 100) : null;
  };

  const avgPerf = avg('perf'), avgSeo = avg('seo'), avgA11y = avg('a11y'), avgBp = avg('bp');

  // ── Tri par performance croissante (pages les moins bonnes en premier) ──────
  const sorted = [...results].sort((a, b) => (a.perf ?? 1) - (b.perf ?? 1));

  // ── HTML Email ───────────────────────────────────────────────────────────────
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

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a1628;font-family:system-ui,sans-serif;color:#e2e8f0">
<div style="max-width:700px;margin:0 auto;padding:28px 16px">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px">
    <div style="font-size:11px;letter-spacing:2px;color:#21c47b;text-transform:uppercase;margin-bottom:6px">Audit Performance hebdomadaire</div>
    <h1 style="margin:0;font-size:22px;color:#fff">Dark Massilia · PageSpeed Insights</h1>
    <div style="font-size:12px;color:#64748b;margin-top:4px">${dateStr} — ${URLS.length} pages · mobile</div>
    <div style="margin-top:10px;font-size:13px;font-weight:600;color:${statusColor}">${statusLabel}</div>
  </div>

  <!-- Moyennes -->
  <div style="display:flex;gap:10px;margin-bottom:24px">
    ${kpi('Perf. moy.', avgPerf, avgPerf !== null && avgPerf >= 60 ? '#21c47b' : '#e74c3c')}
    ${kpi('SEO moy.', avgSeo, avgSeo !== null && avgSeo >= 90 ? '#21c47b' : '#e74c3c')}
    ${kpi('Accessib. moy.', avgA11y, avgA11y !== null && avgA11y >= 80 ? '#21c47b' : '#f59e0b')}
    ${kpi('Best Pract. moy.', avgBp, avgBp !== null && avgBp >= 80 ? '#21c47b' : '#f59e0b')}
  </div>

  <!-- Seuils -->
  <div style="background:#0f2035;border-radius:12px;padding:12px 16px;margin-bottom:20px;font-size:11px;color:#64748b">
    Seuils : Perf ≥60 (erreur) · SEO ≥90 (erreur) · Accessibilité ≥80 (warning) · Best Practices ≥80 (warning)
  </div>

  <!-- Tableau -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;overflow-x:auto">
    <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Détail par page (triées par perf. croissante)</h2>
    <table style="width:100%;border-collapse:collapse;min-width:550px">
      <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
        <th style="padding:6px 10px;text-align:left">Page</th>
        <th style="padding:6px 10px">Perf</th>
        <th style="padding:6px 10px">SEO</th>
        <th style="padding:6px 10px">A11y</th>
        <th style="padding:6px 10px">BP</th>
        <th style="padding:6px 10px">FCP</th>
        <th style="padding:6px 10px">LCP</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <div style="text-align:center;font-size:11px;color:#334155;margin-top:24px">
    Généré automatiquement chaque semaine · PageSpeed Insights API · Dark Massilia
  </div>
</div>
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
