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
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname   = dirname(fileURLToPath(import.meta.url));
const SITE        = 'https://karimsaari.com';
const DIST_DIR    = resolve(__dirname, '../dist');
const BREVO_TO    = 'email@karimsaari.com';
const BREVO_FROM  = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };
const EEAT_SIGNAL = 'karim saari';
const DELAY_MS    = 500; // réduit car lecture locale en CI

// ── Lecture locale depuis dist/ (pas de réseau) ──────────────────────────────
// Le serveur bloque les IP GitHub Actions → on build d'abord, on lit ensuite

function urlToDistPath(url) {
  const path = url.replace(SITE, '').replace(/\/$/, '') || '/';
  if (path === '/') return resolve(DIST_DIR, 'index.html');
  return resolve(DIST_DIR, path.replace(/^\//, ''), 'index.html');
}

function readPageFromDist(url) {
  const filePath = urlToDistPath(url);
  if (!existsSync(filePath)) throw new Error(`Fichier dist introuvable : ${filePath}`);
  return readFileSync(filePath, 'utf8');
}

const USE_DIST = existsSync(DIST_DIR) && existsSync(resolve(DIST_DIR, 'index.html'));

// ── Fetch helpers (fallback réseau si dist/ absent — usage local) ─────────────

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'DarkMassilia-SEO-Bot/1.0 (+https://karimsaari.com)' },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.text();
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Sitemap parser — lit le fichier local (plus fiable que le fetch réseau) ──

function readSitemapUrls() {
  // 1. Fichier local public/sitemap.xml (disponible après git checkout en CI)
  const localPath = resolve(__dirname, '../public/sitemap.xml');
  if (existsSync(localPath)) {
    console.log('📄 Sitemap lu depuis le repo local :', localPath);
    const xml = readFileSync(localPath, 'utf8');
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
    return matches.map(m => m[1].trim()).filter(u => u.startsWith(SITE));
  }
  throw new Error('public/sitemap.xml introuvable — s\'assurer que le repo est bien cloné');
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
    urls = readSitemapUrls();
  } catch (err) {
    console.error('❌ Impossible de lire le sitemap :', err.message);
    process.exit(1);
  }
  console.log(`✅ ${urls.length} URL(s) trouvées\n`);

  // ── Crawl ──────────────────────────────────────────────────────────────────
  const pages = [];
  let crawlErrors = 0;

  console.log(USE_DIST
    ? `📁 Lecture depuis dist/ (${DIST_DIR})`
    : '🌐 Fetch depuis le site live (dist/ absent)');

  for (const url of urls) {
    process.stdout.write(`  → ${pageLabel(url)} … `);
    try {
      const html = USE_DIST ? readPageFromDist(url) : await fetchText(url);
      const page = analysePage(url, html);
      pages.push(page);
      console.log(`H1:${page.h1Count} img-noalt:${page.imgsNoAlt.length} eeat:${page.hasEEAT ? '✓' : '✗'}`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
      crawlErrors++;
    }
    if (!USE_DIST) await delay(DELAY_MS);
  }

  // ── Issues ─────────────────────────────────────────────────────────────────
  for (const page of pages) {
    page.issues = detectIssues(page, pages);
  }

  // ── Orphelines ─────────────────────────────────────────────────────────────
  const allLinked = new Set(pages.flatMap(p => p.internalLinks));
  const orphans   = pages.filter(p => !allLinked.has(p.url) && p.url !== urls[0]);

  // ── Inlinks par page (nombre de pages qui pointent vers chaque URL) ─────────
  const inlinksMap = new Map(pages.map(p => [p.url, 0]));
  for (const p of pages) {
    for (const link of p.internalLinks) {
      if (inlinksMap.has(link)) inlinksMap.set(link, inlinksMap.get(link) + 1);
    }
  }

  // ── Scores synthèse ────────────────────────────────────────────────────────
  const totalErrors    = pages.reduce((a, p) => a + p.issues.filter(i => i.sev === 'error').length, 0);
  const totalWarns     = pages.reduce((a, p) => a + p.issues.filter(i => i.sev === 'warn').length, 0);
  const pagesOK        = pages.filter(p => p.issues.length === 0).length;
  const totalImgsNoAlt = pages.reduce((a, p) => a + p.imgsNoAlt.length, 0);
  const pagesNoEEAT    = pages.filter(p => !p.hasEEAT).length;

  console.log(`\n✅ Crawl terminé — ${pages.length} pages · ${totalErrors} erreurs · ${totalWarns} warnings · ${orphans.length} orphelines\n`);

  // ── Helpers colonnes (labels textuels pour lecture IA) ────────────────────
  function h1Label(count) {
    if (count === 0) return 'Vide';
    if (count === 1) return 'Oui';
    return `Multiple (${count})`;
  }
  function h1Color(count) {
    if (count === 1) return '#21c47b';
    if (count === 0) return '#e74c3c';
    return '#f59e0b';
  }

  // ── Tableau principal (colonnes exactes pour extraction IA) ──────────────
  const sortedPages = [...pages].sort((a, b) => b.issues.length - a.issues.length);

  const pageRows = sortedPages.map(p => {
    const inlinks = inlinksMap.get(p.url) ?? 0;
    return `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #ddd;font-size:11px;font-family:monospace">${pageLabel(p.url)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center;font-size:11px;color:${h1Color(p.h1Count)};font-weight:600">${h1Label(p.h1Count)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center;font-size:11px;color:${p.metaDesc ? '#21c47b' : '#e74c3c'};font-weight:600">${p.metaDesc ? 'Oui' : 'Non'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center;font-size:11px;color:${p.imgsNoAlt.length > 0 ? '#f59e0b' : '#21c47b'};font-weight:600">${p.imgsNoAlt.length}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center;font-size:11px;color:${p.hasEEAT ? '#21c47b' : '#f59e0b'};font-weight:600">${p.hasEEAT ? 'Trouvé' : 'Absent'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:center;font-size:11px;color:${inlinks === 0 ? '#e74c3c' : '#21c47b'};font-weight:600">${inlinks}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #ddd;font-size:10px;color:#555">${p.issues.map(i => `${sevIcon(i.sev)} ${i.msg}`).join(' · ') || '—'}</td>
    </tr>`;
  }).join('');

  // ── Liste orphelines (section dédiée pour trigger maillage IA) ───────────
  const orphanList = orphans.length
    ? orphans.map(p => `<li style="margin:4px 0;font-family:monospace;font-size:12px">${pageLabel(p.url)}<span style="color:#666;font-family:sans-serif"> — ${p.title || 'sans titre'}</span></li>`).join('')
    : '<li style="color:#21c47b;font-size:12px">Aucune page orpheline détectée</li>';

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px;background:#fff;font-family:Georgia,serif;color:#1a1a1a">
<div style="max-width:760px;margin:0 auto">

  <h1 style="font-size:20px;margin:0 0 4px">Audit On-Page & Sémantique — Dark Massilia</h1>
  <p style="margin:0 0 24px;font-size:12px;color:#666">${dateStr} · ${pages.length} pages crawlées · karimsaari.com${crawlErrors ? ` · ⚠️ ${crawlErrors} erreur(s) de crawl` : ''}</p>

  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Synthèse</h2>
  <table style="border-collapse:collapse;margin-bottom:24px;font-size:12px">
    <tr><td style="padding:3px 16px 3px 0;color:#555">Pages crawlées</td><td style="font-weight:700">${pages.length}</td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#555">Pages sans problème</td><td style="font-weight:700;color:${pagesOK === pages.length ? 'green' : '#c0392b'}">${pagesOK}</td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#555">Erreurs critiques</td><td style="font-weight:700;color:${totalErrors === 0 ? 'green' : '#c0392b'}">${totalErrors}</td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#555">Warnings</td><td style="font-weight:700;color:${totalWarns === 0 ? 'green' : '#e67e22'}">${totalWarns}</td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#555">Images sans attribut ALT</td><td style="font-weight:700;color:${totalImgsNoAlt === 0 ? 'green' : '#e67e22'}">${totalImgsNoAlt}</td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#555">Pages orphelines (0 lien entrant)</td><td style="font-weight:700;color:${orphans.length === 0 ? 'green' : '#c0392b'}">${orphans.length}</td></tr>
    <tr><td style="padding:3px 16px 3px 0;color:#555">Pages sans mention E-E-A-T</td><td style="font-weight:700;color:${pagesNoEEAT === 0 ? 'green' : '#e67e22'}">${pagesNoEEAT}</td></tr>
  </table>

  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Tableau récapitulatif On-Page</h2>
  <p style="font-size:11px;color:#666;margin:0 0 8px">Colonnes : URL · H1 Unique ? · Meta Desc Présente ? · Images sans ALT · Mention Karim Saari (E-E-A-T) · Maillage Interne (Inlinks) · Problèmes détectés</p>
  <div style="overflow-x:auto">
  <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:28px">
    <thead>
      <tr style="background:#1a1a1a;color:#fff">
        <th style="padding:7px 10px;text-align:left;font-weight:600">URL</th>
        <th style="padding:7px 10px;text-align:center;font-weight:600">H1 Unique ?</th>
        <th style="padding:7px 10px;text-align:center;font-weight:600">Meta Desc ?</th>
        <th style="padding:7px 10px;text-align:center;font-weight:600">Images sans ALT</th>
        <th style="padding:7px 10px;text-align:center;font-weight:600">Karim Saari (E-E-A-T)</th>
        <th style="padding:7px 10px;text-align:center;font-weight:600">Inlinks</th>
        <th style="padding:7px 10px;text-align:left;font-weight:600">Problèmes</th>
      </tr>
    </thead>
    <tbody>${pageRows}</tbody>
  </table>
  </div>

  <h2 style="font-size:14px;border-bottom:2px solid #c0392b;padding-bottom:4px;margin-bottom:8px;color:#c0392b">Pages Orphelines — Action Maillage Interne Requise</h2>
  <p style="font-size:11px;color:#666;margin:0 0 8px">Pages avec 0 lien interne entrant. Non accessibles depuis le maillage → indexation compromise.</p>
  <ul style="margin:0 0 28px;padding-left:20px;line-height:1.8">
    ${orphanList}
  </ul>

  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Légende</h2>
  <p style="font-size:11px;color:#555;line-height:1.8;margin:0 0 24px">
    <strong>H1 Unique ?</strong> : Oui = exactement 1 H1 · Non/Vide = 0 H1 · Multiple = plus d'un H1<br>
    <strong>Images sans ALT</strong> : nombre exact d'images sans attribut alt (ou alt vide)<br>
    <strong>Karim Saari (E-E-A-T)</strong> : Trouvé = texte "Karim Saari" présent dans le corps de la page · Absent = signal E-E-A-T manquant<br>
    <strong>Inlinks</strong> : nombre de pages du site pointant vers cette URL via un lien &lt;a href&gt;<br>
    ❌ = erreur critique · ⚠️ = warning
  </p>

  <p style="font-size:10px;color:#aaa;text-align:center;margin:0">Généré automatiquement le ${dateStr} · Crawl On-Page SEO · Dark Massilia · karimsaari.com</p>
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
