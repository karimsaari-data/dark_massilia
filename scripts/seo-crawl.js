/**
 * seo-crawl.js — Audit On-Page & Sémantique (crawl complet)
 * Usage : npm run seo-crawl
 *
 * Extrait pour chaque page :
 *   H1/H2 · ALT manquants · E-E-A-T (Karim Saari) · maillage interne
 *   meta description · canonical · doublons title/description
 *   pages orphelines (aucun lien entrant interne)
 */

import { parse } from 'node-html-parser';
import puppeteer from 'puppeteer';

const SITE        = 'https://karimsaari.com';
const SITEMAP_URL = `${SITE}/home/sitemap.xml`;
const BREVO_TO    = 'email@karimsaari.com';
const BREVO_FROM  = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };
const EEAT_SIGNAL = 'karim saari';
const DELAY_MS    = 1500; // délai entre pages (politesse crawler)

// ── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'DarkMassilia-SEO-Bot/1.0 (+https://karimsaari.com)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.text();
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Sitemap parser ───────────────────────────────────────────────────────────

async function fetchSitemapUrls() {
  const xml = await fetchText(SITEMAP_URL);
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map(m => m[1].trim()).filter(u => u.startsWith(SITE));
}

// ── Page analyser ────────────────────────────────────────────────────────────

function analysePage(url, html) {
  const root = parse(html);

  const title     = root.querySelector('title')?.text?.trim() ?? '';
  const metaDesc  = root.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() ?? '';

  const h1s = root.querySelectorAll('h1').map(n => n.text.trim());
  const h2s = root.querySelectorAll('h2').map(n => n.text.trim());

  // Images sans ALT ou avec ALT vide
  const imgs = root.querySelectorAll('img');
  const imgsNoAlt = imgs.filter(img => {
    const alt = img.getAttribute('alt');
    return alt === null || alt.trim() === '';
  }).map(img => img.getAttribute('src') ?? '').filter(Boolean);

  // E-E-A-T : mention "Karim Saari" dans le corps
  const bodyText  = (root.querySelector('body')?.text ?? '').toLowerCase();
  const hasEEAT   = bodyText.includes(EEAT_SIGNAL);

  // Liens internes (href commençant par / ou SITE)
  const links = root.querySelectorAll('a[href]')
    .map(a => a.getAttribute('href') ?? '')
    .filter(h => h.startsWith('/') || h.startsWith(SITE))
    .map(h => {
      if (h.startsWith('/')) return `${SITE}${h}`;
      return h.split('?')[0].split('#')[0];
    })
    .filter(h => h.startsWith(SITE));
  const internalLinks = [...new Set(links)];

  return {
    url,
    title,
    metaDesc,
    canonical,
    h1Count:    h1s.length,
    h1Text:     h1s[0] ?? '',
    h2Count:    h2s.length,
    imgsNoAlt,
    hasEEAT,
    internalLinks,
    issues: [],
  };
}

// ── Issues detector ──────────────────────────────────────────────────────────

function detectIssues(page, allPages) {
  const issues = [];

  if (!page.title)                     issues.push({ sev: 'error',   msg: 'Title manquant' });
  if (page.title.length > 65)          issues.push({ sev: 'warn',    msg: `Title trop long (${page.title.length} car.)` });
  if (!page.metaDesc)                  issues.push({ sev: 'error',   msg: 'Meta description manquante' });
  if (page.metaDesc.length > 160)      issues.push({ sev: 'warn',    msg: `Meta description trop longue (${page.metaDesc.length} car.)` });
  if (page.h1Count === 0)              issues.push({ sev: 'error',   msg: 'H1 manquant' });
  if (page.h1Count > 1)               issues.push({ sev: 'warn',    msg: `${page.h1Count} H1 sur la page` });
  if (page.imgsNoAlt.length > 0)      issues.push({ sev: 'warn',    msg: `${page.imgsNoAlt.length} image(s) sans ALT` });
  if (!page.hasEEAT)                  issues.push({ sev: 'warn',    msg: 'E-E-A-T : "Karim Saari" absent' });
  if (page.canonical && !page.canonical.startsWith(SITE))
                                       issues.push({ sev: 'warn',    msg: 'Canonical externe' });

  // Doublon titre
  const dupTitle = allPages.filter(p => p.url !== page.url && p.title && p.title === page.title);
  if (dupTitle.length > 0) issues.push({ sev: 'error', msg: `Title dupliqué (${dupTitle.length} autre(s) page(s))` });

  // Doublon meta description
  const dupDesc = allPages.filter(p => p.url !== page.url && p.metaDesc && p.metaDesc === page.metaDesc);
  if (dupDesc.length > 0) issues.push({ sev: 'warn', msg: `Meta desc. dupliquée (${dupDesc.length} autre(s))` });

  return issues;
}

// ── PDF generator ────────────────────────────────────────────────────────────

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

// ── Email sender ─────────────────────────────────────────────────────────────

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

// ── HTML helpers ─────────────────────────────────────────────────────────────

function sevColor(sev) { return sev === 'error' ? '#e74c3c' : '#f59e0b'; }
function sevIcon(sev)  { return sev === 'error' ? '❌' : '⚠️'; }
function pageLabel(url) { return url.replace(SITE, '') || '/'; }

function statusDot(page) {
  if (page.issues.some(i => i.sev === 'error')) return `<span style="color:#e74c3c">●</span>`;
  if (page.issues.some(i => i.sev === 'warn'))  return `<span style="color:#f59e0b">●</span>`;
  return `<span style="color:#21c47b">●</span>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  const dateStr = new Date().toISOString().split('T')[0];
  console.log('🗺️  Lecture du sitemap…');

  let urls;
  try {
    urls = await fetchSitemapUrls();
  } catch (err) {
    console.error('❌ Impossible de lire le sitemap :', err.message);
    process.exit(1);
  }
  console.log(`✅ ${urls.length} URL(s) trouvées\n`);

  // ── Crawl ──────────────────────────────────────────────────────────────────
  const pages = [];
  let crawlErrors = 0;

  for (const url of urls) {
    process.stdout.write(`  → ${pageLabel(url)} … `);
    try {
      const html = await fetchText(url);
      const page = analysePage(url, html);
      pages.push(page);
      console.log(`H1:${page.h1Count} img-noalt:${page.imgsNoAlt.length} eeat:${page.hasEEAT ? '✓' : '✗'}`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
      crawlErrors++;
    }
    await delay(DELAY_MS);
  }

  // ── Issues ─────────────────────────────────────────────────────────────────
  for (const page of pages) {
    page.issues = detectIssues(page, pages);
  }

  // ── Orphelines ─────────────────────────────────────────────────────────────
  const allLinked = new Set(pages.flatMap(p => p.internalLinks));
  const orphans   = pages.filter(p => !allLinked.has(p.url) && p.url !== urls[0]);

  // ── Scores synthèse ────────────────────────────────────────────────────────
  const totalErrors = pages.reduce((a, p) => a + p.issues.filter(i => i.sev === 'error').length, 0);
  const totalWarns  = pages.reduce((a, p) => a + p.issues.filter(i => i.sev === 'warn').length, 0);
  const pagesOK     = pages.filter(p => p.issues.length === 0).length;
  const totalImgsNoAlt = pages.reduce((a, p) => a + p.imgsNoAlt.length, 0);
  const pagesNoEEAT    = pages.filter(p => !p.hasEEAT).length;

  console.log(`\n✅ Crawl terminé — ${pages.length} pages · ${totalErrors} erreurs · ${totalWarns} warnings · ${orphans.length} orphelines\n`);

  // ── HTML rapport ───────────────────────────────────────────────────────────
  function kpi(label, value, color) {
    return `<div style="flex:1;background:#0f2035;border-radius:12px;padding:16px 12px;text-align:center">
      <div style="font-size:32px;font-weight:700;color:${color}">${value}</div>
      <div style="font-size:11px;color:#64748b;margin-top:4px">${label}</div>
    </div>`;
  }

  const pageRows = [...pages]
    .sort((a, b) => b.issues.length - a.issues.length)
    .map(p => `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;font-size:11px;color:#94a3b8;word-break:break-all">
        ${statusDot(p)} ${pageLabel(p.url)}
      </td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;font-size:11px;color:#64748b;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${p.title}">${p.title || '<span style="color:#e74c3c">—</span>'}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-size:12px">${p.h1Count === 1 ? `<span style="color:#21c47b">1</span>` : `<span style="color:#e74c3c">${p.h1Count}</span>`}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-size:12px">${p.h2Count}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-size:12px">${p.imgsNoAlt.length > 0 ? `<span style="color:#f59e0b">${p.imgsNoAlt.length}</span>` : '<span style="color:#21c47b">0</span>'}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;text-align:center;font-size:12px">${p.hasEEAT ? '<span style="color:#21c47b">✓</span>' : '<span style="color:#f59e0b">✗</span>'}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;font-size:10px;color:#64748b">
        ${p.issues.map(i => `<span style="color:${sevColor(i.sev)}">${sevIcon(i.sev)} ${i.msg}</span>`).join('<br>')}
      </td>
    </tr>`).join('');

  const orphanRows = orphans.length
    ? orphans.map(p => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#94a3b8;font-size:12px">${pageLabel(p.url)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #1e3a50;color:#64748b;font-size:11px">${p.title}</td>
      </tr>`).join('')
    : `<tr><td colspan="2" style="padding:12px;color:#64748b;font-size:12px;text-align:center">✅ Aucune page orpheline</td></tr>`;

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a1628;font-family:system-ui,sans-serif;color:#e2e8f0">
<div style="max-width:720px;margin:0 auto;padding:28px 16px">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px">
    <div style="font-size:11px;letter-spacing:2px;color:#21c47b;text-transform:uppercase;margin-bottom:6px">Audit On-Page & Sémantique</div>
    <h1 style="margin:0;font-size:22px;color:#fff">Dark Massilia · Crawl SEO</h1>
    <div style="font-size:12px;color:#64748b;margin-top:4px">${dateStr} — ${pages.length} pages crawlées${crawlErrors ? ` · ⚠️ ${crawlErrors} erreur(s)` : ''}</div>
  </div>

  <!-- KPIs -->
  <div style="display:flex;gap:10px;margin-bottom:24px">
    ${kpi('Pages OK', pagesOK, pagesOK === pages.length ? '#21c47b' : '#f59e0b')}
    ${kpi('Erreurs critiques', totalErrors, totalErrors === 0 ? '#21c47b' : '#e74c3c')}
    ${kpi('Warnings', totalWarns, totalWarns === 0 ? '#21c47b' : '#f59e0b')}
    ${kpi('Images sans ALT', totalImgsNoAlt, totalImgsNoAlt === 0 ? '#21c47b' : '#f59e0b')}
    ${kpi('Pages orphelines', orphans.length, orphans.length === 0 ? '#21c47b' : '#e74c3c')}
    ${kpi('Sans E-E-A-T', pagesNoEEAT, pagesNoEEAT === 0 ? '#21c47b' : '#f59e0b')}
  </div>

  <!-- Tableau principal -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:16px;overflow-x:auto">
    <h2 style="margin:0 0 12px;font-size:13px;color:#21c47b">Détail par page</h2>
    <table style="width:100%;border-collapse:collapse;min-width:600px">
      <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
        <th style="padding:6px 10px;text-align:left">Page</th>
        <th style="padding:6px 10px;text-align:left">Title</th>
        <th style="padding:6px 10px">H1</th>
        <th style="padding:6px 10px">H2</th>
        <th style="padding:6px 10px">ALT∅</th>
        <th style="padding:6px 10px">E-E-A-T</th>
        <th style="padding:6px 10px;text-align:left">Problèmes</th>
      </tr></thead>
      <tbody>${pageRows}</tbody>
    </table>
  </div>

  <!-- Pages orphelines -->
  <div style="background:#0f2035;border-radius:12px;padding:16px;margin-bottom:16px">
    <h2 style="margin:0 0 4px;font-size:13px;color:${orphans.length ? '#e74c3c' : '#21c47b'}">🔗 Pages orphelines (aucun lien interne entrant)</h2>
    <div style="font-size:11px;color:#64748b;margin-bottom:10px">Ces pages ne sont pas accessibles depuis le maillage interne → elles ne seront pas bien indexées</div>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="font-size:10px;color:#64748b;text-transform:uppercase">
        <th style="padding:6px 10px;text-align:left">Page</th>
        <th style="padding:6px 10px;text-align:left">Title</th>
      </tr></thead>
      <tbody>${orphanRows}</tbody>
    </table>
  </div>

  <!-- Légende -->
  <div style="background:#0f2035;border-radius:12px;padding:12px 16px;font-size:11px;color:#64748b;margin-bottom:24px">
    <strong style="color:#94a3b8">Légende :</strong>
    ● <span style="color:#21c47b">vert</span> = OK ·
    ● <span style="color:#f59e0b">orange</span> = warning ·
    ● <span style="color:#e74c3c">rouge</span> = erreur critique ·
    E-E-A-T = présence "Karim Saari" dans le corps de la page ·
    ALT∅ = images sans attribut alt
  </div>

  <div style="text-align:center;font-size:11px;color:#334155">
    Généré automatiquement · Crawl On-Page SEO · Dark Massilia
  </div>
</div>
</body></html>`;

  // ── PDF ─────────────────────────────────────────────────────────────────────
  if (process.env.BREVO_API_KEY) {
    const subject = `🔍 SEO Crawl — ${dateStr} — ${totalErrors} erreur(s) · ${orphans.length} orpheline(s)`;
    const pdfName = `seo-crawl-${dateStr}.pdf`;

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
      process.exit(1);
    }
  } else {
    console.log('ℹ️  BREVO_API_KEY non défini — résultats affichés en console uniquement');
    for (const p of pages.filter(p => p.issues.length > 0)) {
      console.log(`\n${pageLabel(p.url)}`);
      p.issues.forEach(i => console.log(`  ${sevIcon(i.sev)} ${i.msg}`));
    }
    if (orphans.length) {
      console.log('\n🔗 Pages orphelines :');
      orphans.forEach(p => console.log(`  ${pageLabel(p.url)}`));
    }
  }
})();
