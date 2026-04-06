/**
 * backlink-report.js — Rapport Backlinks Off-Page (Phase 3)
 * Source : Export manuel GSC → Liens → "Exporter les liens externes" (mensuel)
 * Usage : npm run backlink-report
 *
 * Fichiers attendus dans data/gsc-links/ :
 *   top-sites.csv    — Principaux sites d'origine
 *   top-anchors.csv  — Principaux textes d'ancrage
 *   top-pages.csv    — Principales pages cibles
 *   sample-links.csv — Échantillon de liens (URLs sources)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR   = resolve(__dirname, '../data/gsc-links');

const BREVO_TO   = 'email@karimsaari.com';
const BREVO_FROM = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

// ── Catégorisation des domaines ────────────────────────────────────────────────
const DOMAIN_META = {
  'flickr.com':          { cat: 'Communauté photo',         quality: 'Bon',       score: 3 },
  '500px.com':           { cat: 'Communauté photo',         quality: 'Bon',       score: 3 },
  'fotocommunity.de':    { cat: 'Communauté photo',         quality: 'Bon',       score: 3 },
  'fotocommunity.com':   { cat: 'Communauté photo',         quality: 'Bon',       score: 3 },
  'fotocommunity.fr':    { cat: 'Communauté photo',         quality: 'Bon',       score: 3 },
  'pinterest.com':       { cat: 'Réseau social',            quality: 'Moyen',     score: 2 },
  'tiktok.com':          { cat: 'Réseau social',            quality: 'Bon',       score: 3 },
  'x.com':               { cat: 'Réseau social',            quality: 'Bon',       score: 3 },
  'wikimedia.org':       { cat: 'Encyclopédie référence',   quality: 'Excellent', score: 5 },
  'madeinmarseille.net': { cat: 'Presse locale',            quality: 'Très bon',  score: 4 },
  'yoys.fr':             { cat: 'Annuaire local',           quality: 'Faible',    score: 1 },
  'threehosts.com':      { cat: 'Annuaire spam',            quality: 'Spam',      score: 0 },
  'wopa.fr':             { cat: 'Annuaire',                 quality: 'Faible',    score: 1 },
  'twstalker.com':       { cat: 'Scraper/Spam',             quality: 'Spam',      score: 0 },
  'mappy.com':           { cat: 'Annuaire local',           quality: 'Moyen',     score: 2 },
};

function qualityBadge(q) {
  const styles = {
    'Excellent': 'background:#1a472a;color:#fff',
    'Très bon':  'background:#21c47b;color:#fff',
    'Bon':       'background:#2d6a4f;color:#fff',
    'Moyen':     'background:#f59e0b;color:#fff',
    'Faible':    'background:#e67e22;color:#fff',
    'Spam':      'background:#c0392b;color:#fff',
  };
  return `<span style="padding:2px 7px;border-radius:3px;font-size:10px;${styles[q] || 'background:#999;color:#fff'}">${q}</span>`;
}

// ── Détection automatique des fichiers GSC ────────────────────────────────────
import { readdirSync } from 'fs';

function findGSCFile(dir, pattern) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter(f => f.toLowerCase().includes(pattern) && f.endsWith('.csv'));
  if (files.length === 0) return null;
  // Prend le plus récent (tri alphabétique = tri par date pour le format GSC)
  files.sort().reverse();
  return `${dir}/${files[0]}`;
}

// ── CSV Parser ────────────────────────────────────────────────────────────────
function decodeHtmlEntities(str) {
  return str
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function parseCSV(filepath) {
  if (!existsSync(filepath)) return null;
  const raw   = readFileSync(filepath, 'utf8').trim();
  const lines = raw.split('\n');
  const headers = lines[0].split(',').map(h => decodeHtmlEntities(h.trim().replace(/^"|"$/g, '')));
  return lines.slice(1).map(line => {
    const fields = [];
    let inQuote = false, current = '';
    for (const ch of line) {
      if (ch === '"')                  { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { fields.push(decodeHtmlEntities(current.trim())); current = ''; }
      else                             { current += ch; }
    }
    fields.push(decodeHtmlEntities(current.trim()));
    return Object.fromEntries(headers.map((h, i) => [h, fields[i] ?? '']));
  });
}

// ── Brevo email ───────────────────────────────────────────────────────────────
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

// ── PDF via Puppeteer ─────────────────────────────────────────────────────────
async function generatePDF(html) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
    printBackground: true,
  });
  await browser.close();
  return pdf;
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  const dateStr  = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const isoDate  = new Date().toISOString().slice(0, 10);

  // ── Lecture des CSV (noms d'origine GSC acceptés) ──
  const sitesPath   = findGSCFile(DATA_DIR, 'top linking sites')   || findGSCFile(DATA_DIR, 'top-sites');
  const anchorsPath = findGSCFile(DATA_DIR, 'top linking text')    || findGSCFile(DATA_DIR, 'top-anchors');
  const pagesPath   = findGSCFile(DATA_DIR, 'top target pages')    || findGSCFile(DATA_DIR, 'top-pages');
  const samplesPath = findGSCFile(DATA_DIR, 'more sample links')   || findGSCFile(DATA_DIR, 'sample-links');

  console.log('📂 Fichiers détectés :');
  console.log('  Sites   :', sitesPath   || '❌ manquant');
  console.log('  Ancres  :', anchorsPath || '❌ manquant');
  console.log('  Pages   :', pagesPath   || '❌ manquant');
  console.log('  Samples :', samplesPath || '(optionnel)');

  const sites   = parseCSV(sitesPath);
  const anchors = parseCSV(anchorsPath);
  const pages   = parseCSV(pagesPath);
  const samples = parseCSV(samplesPath);

  if (!sites || !anchors || !pages) {
    console.error('❌ Fichiers CSV manquants dans data/gsc-links/');
    console.error('   Exporter depuis GSC → Liens → "Exporter les liens externes"');
    console.error('   Coller les fichiers tels quels dans data/gsc-links/ sans les renommer');
    process.exit(1);
  }

  // ── Analyse ──
  const totalLinks   = sites.reduce((s, r) => s + parseInt(r["Pages d'origine"] || 0), 0);
  const totalDomains = sites.length;

  const spamDomains      = sites.filter(r => (DOMAIN_META[r.Site]?.score ?? 2) === 0);
  const highValueDomains = sites.filter(r => (DOMAIN_META[r.Site]?.score ?? 2) >= 4);

  const homepageLinks = parseInt(pages[0]?.["Liens internes"] || 0);
  const homepagePct   = totalLinks > 0 ? Math.round((homepageLinks / totalLinks) * 100) : 100;

  const arteFound = samples?.some(r =>
    (r["Page d'origine"] || '').includes('arte.tv') ||
    (r["Page d'origine"] || '').includes('arte.fr')
  ) ?? false;

  const semanticAnchors = anchors.filter(r => {
    const t = (r["Texte du lien"] || '').toLowerCase();
    return ['marseille','pollution','calanque','freedive','plongée','mer','environnement','ocean'].some(kw => t.includes(kw));
  });

  // ── Tableau : domaines ──
  const sitesRows = sites.map(r => {
    const meta = DOMAIN_META[r.Site] || { cat: 'Inconnu', quality: 'Moyen', score: 2 };
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;color:#1a1a1a">${r.Site || ''}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:11px;color:#555">${meta.cat}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;text-align:center">${qualityBadge(meta.quality)}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;text-align:center;font-size:12px;font-weight:600">${r["Pages d'origine"] || '-'}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;text-align:center;font-size:12px">${r["Pages cibles"] || '-'}</td>
    </tr>`;
  }).join('');

  // ── Tableau : ancres ──
  const anchorRows = anchors.map(r => {
    const text = r["Texte du lien"] || '';
    const lc   = text.toLowerCase();
    const isSemantic = semanticAnchors.some(a => a["Texte du lien"] === text);
    const isUrl      = lc.includes('karimsaari') || lc.includes('http') || lc.includes('www');
    const isEmpty    = text === '(vide)';
    const assess = isSemantic ? '<span style="color:#21c47b;font-weight:600">Thématique</span>'
                 : isUrl      ? '<span style="color:#555">URL-based · Neutre</span>'
                 : isEmpty    ? '<span style="color:#999">Image / vide</span>'
                 :              '<span style="color:#f59e0b">Générique</span>';
    return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;text-align:center;font-size:11px;color:#999">${r.Classement || '-'}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;color:#1a1a1a;font-style:${isEmpty ? 'italic' : 'normal'}">${text || '-'}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:11px">${assess}</td>
    </tr>`;
  }).join('');

  // ── Tableau : pages cibles ──
  const pageRows = pages.map(r => {
    const page      = r["Page cible"] || '';
    const shortPage = page.replace('https://karimsaari.com', '') || '/';
    const isHome    = shortPage === '/' || shortPage === '';
    return `
    <tr style="${isHome ? 'background:#fff8f0' : ''}">
      <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:11px;color:#1a1a1a;word-break:break-all">${shortPage || '/'}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;text-align:center;font-size:12px;font-weight:600">${r["Liens internes"] || '-'}</td>
    </tr>`;
  }).join('');

  // ── Alertes ──
  const alerts = [];
  if (homepagePct >= 90)
    alerts.push(`<li style="margin-bottom:8px"><strong>${homepagePct}% des liens pointent vers la homepage</strong> — Zéro deep link détecté vers les pages internes (/photographie-sous-marine, /missions, /blog). Action prioritaire : négocier des liens vers ces URLs lors des prochaines collaborations.</li>`);
  if (!arteFound)
    alerts.push(`<li style="margin-bottom:8px"><strong>Backlink ARTE non détecté dans l'échantillon GSC</strong> — Le lien du documentaire "Sauver Marseille" n'est pas visible. Vérifier manuellement sur arte.tv et, si présent, le signaler dans GSC → Liens.</li>`);
  if (spamDomains.length > 0)
    alerts.push(`<li style="margin-bottom:8px"><strong>${spamDomains.length} domaine(s) spam identifié(s)</strong> : ${spamDomains.map(d => d.Site).join(', ')} — Si ces liens génèrent des signaux négatifs, envisager un fichier Disavow via Google Search Console.</li>`);
  if (semanticAnchors.length === 0)
    alerts.push(`<li style="margin-bottom:8px"><strong>Aucune ancre sémantique thématique</strong> — Aucun lien avec ancre "Marseille", "pollution marine", "Calanques"… L'autorité topicale n'est pas renforcée via les textes d'ancrage. Mentionner cette priorité lors des prochaines demandes de lien.</li>`);

  // ── Opportunités ──
  const PHOTO_COMMUNITY = ['flickr.com', '500px.com', 'fotocommunity.de', 'fotocommunity.com', 'fotocommunity.fr'];
  const photoLinks = sites
    .filter(r => PHOTO_COMMUNITY.includes(r.Site))
    .reduce((s, r) => s + parseInt(r["Pages d'origine"] || 0), 0);
  const photoPct = totalLinks > 0 ? Math.round((photoLinks / totalLinks) * 100) : 0;
  const opportunities = [
    `<li style="margin-bottom:8px"><strong>Deep links prioritaires</strong> — Demander aux partenaires (madeinmarseille.net, wikimedia.org) de pointer directement vers <code>/photographie-sous-marine</code> et <code>/sauver-marseille-documentaire-arte</code> plutôt que vers la homepage.</li>`,
    `<li style="margin-bottom:8px"><strong>Ancres thématiques</strong> — Lors des prochaines collaborations presse/blog, demander des ancres type "photographe engagé Marseille" ou "pollution plastique Calanques" plutôt que l'URL brute.</li>`,
    `<li style="margin-bottom:8px"><strong>Diversification éditoriale</strong> — Le profil photo (flickr, 500px, fotocommunity) représente ${photoPct}% des liens. Très cohérent E-E-A-T mais insuffisant pour une autorité éditoriale. Viser presse éco, blogs nature/environnement, institutionnels (PACA, Mer Méditerranée).</li>`,
    `<li style="margin-bottom:8px"><strong>Wikimedia.org</strong> — Lien d'autorité élevée. Vérifier que la page Wikimedia Karim Saari pointe vers l'URL canonique HTTPS aktuelle : https://karimsaari.com/</li>`,
    `<li style="margin-bottom:8px"><strong>Google Business Profile</strong> — S'assurer que la fiche GBP est 100% remplie et cohérente avec le NAP du site (Nom, Adresse, Téléphone). Publier des Google Posts réguliers avec photos des missions.</li>`,
  ];

  // ── HTML ──
  const html = `<!DOCTYPE html>
<html lang="fr"><head>
  <meta charset="UTF-8">
  <title>Rapport Backlinks Off-Page — Dark Massilia — ${dateStr}</title>
</head>
<body style="margin:0;background:#fff;font-family:Georgia,serif;color:#1a1a1a;padding:24px">
<div style="max-width:860px;margin:0 auto">

  <h1 style="font-size:20px;color:#1a1a1a;margin:0 0 4px">Rapport Backlinks Off-Page — Phase 3 — Dark Massilia</h1>
  <p style="margin:0 0 4px;font-size:12px;color:#666">${dateStr} · Source : Google Search Console "Liens externes" · karimsaari.com</p>
  <p style="margin:0 0 24px;font-size:12px;color:#666">Export mensuel manuel · ${totalLinks} liens analysés · ${totalDomains} domaines référents · ${alerts.length} alerte(s)</p>

  <!-- Vue d'ensemble -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Vue d'ensemble</h2>
  <table style="border-collapse:collapse;margin-bottom:24px;font-size:12px">
    <tr><td style="padding:3px 24px 3px 0;color:#555">Liens externes totaux (GSC)</td><td style="font-weight:600">${totalLinks}</td></tr>
    <tr><td style="padding:3px 24px 3px 0;color:#555">Domaines référents distincts</td><td style="font-weight:600">${totalDomains}</td></tr>
    <tr><td style="padding:3px 24px 3px 0;color:#555">Concentration sur la homepage</td>
        <td style="font-weight:600;color:${homepagePct >= 90 ? '#c0392b' : '#21c47b'}">${homepagePct}% ${homepagePct >= 90 ? '— Alerte : zéro deep link' : ''}</td></tr>
    <tr><td style="padding:3px 24px 3px 0;color:#555">Domaines de haute autorité</td>
        <td style="font-weight:600;color:#21c47b">${highValueDomains.length} — ${highValueDomains.map(d => d.Site).join(', ')}</td></tr>
    <tr><td style="padding:3px 24px 3px 0;color:#555">Domaines spam / annuaire</td>
        <td style="font-weight:600;color:${spamDomains.length > 0 ? '#c0392b' : '#21c47b'}">${spamDomains.length}${spamDomains.length > 0 ? ' — ' + spamDomains.map(d => d.Site).join(', ') : ''}</td></tr>
    <tr><td style="padding:3px 24px 3px 0;color:#555">Backlink ARTE détecté</td>
        <td style="font-weight:600;color:${arteFound ? '#21c47b' : '#e67e22'}">${arteFound ? 'Oui' : 'Non visible dans l\'échantillon GSC'}</td></tr>
    <tr><td style="padding:3px 24px 3px 0;color:#555">Ancres thématiques (environnement/mer)</td>
        <td style="font-weight:600;color:${semanticAnchors.length > 0 ? '#21c47b' : '#c0392b'}">${semanticAnchors.length > 0 ? semanticAnchors.length : 'Aucune — à corriger'}</td></tr>
  </table>

  <!-- Profil des domaines -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Profil des domaines référents (${totalDomains})</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
    <thead>
      <tr style="background:#1a1a1a;color:#fff;font-size:11px">
        <th style="padding:7px 10px;text-align:left;font-weight:600">Domaine</th>
        <th style="padding:7px 10px;text-align:left;font-weight:600">Catégorie</th>
        <th style="padding:7px 10px;text-align:center;font-weight:600">Qualité</th>
        <th style="padding:7px 10px;text-align:center;font-weight:600">Pages liantes</th>
        <th style="padding:7px 10px;text-align:center;font-weight:600">Pages cibles</th>
      </tr>
    </thead>
    <tbody>${sitesRows}</tbody>
  </table>

  <!-- Ancres -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Analyse des textes d'ancrage</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:8px">
    <thead>
      <tr style="background:#1a1a1a;color:#fff;font-size:11px">
        <th style="padding:7px 10px;text-align:center;font-weight:600;width:40px">#</th>
        <th style="padding:7px 10px;text-align:left;font-weight:600">Texte d'ancrage</th>
        <th style="padding:7px 10px;text-align:left;font-weight:600">Évaluation</th>
      </tr>
    </thead>
    <tbody>${anchorRows}</tbody>
  </table>
  <p style="font-size:11px;color:#666;margin:0 0 24px">
    URL-based = ancre neutre, pas de sur-optimisation ·
    Générique = faible valeur SEO ·
    Thématique = idéal pour l'autorité topicale environnementale
  </p>

  <!-- Pages cibles -->
  <h2 style="font-size:14px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px">Distribution des pages cibles</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
    <thead>
      <tr style="background:#1a1a1a;color:#fff;font-size:11px">
        <th style="padding:7px 10px;text-align:left;font-weight:600">Page cible</th>
        <th style="padding:7px 10px;text-align:center;font-weight:600">Liens entrants</th>
      </tr>
    </thead>
    <tbody>${pageRows}</tbody>
  </table>

  <!-- Alertes -->
  <h2 style="font-size:14px;border-bottom:2px solid #c0392b;padding-bottom:4px;margin-bottom:8px;color:#c0392b">
    Alertes critiques (${alerts.length})
  </h2>
  ${alerts.length > 0
    ? `<ul style="margin:0 0 24px;padding-left:20px;font-size:12px;line-height:1.7">${alerts.join('')}</ul>`
    : `<p style="color:#21c47b;font-size:12px;margin:0 0 24px">Aucune alerte critique.</p>`}

  <!-- Opportunités -->
  <h2 style="font-size:14px;border-bottom:2px solid #21c47b;padding-bottom:4px;margin-bottom:8px;color:#21c47b">
    Opportunités Off-Page
  </h2>
  <ul style="margin:0 0 24px;padding-left:20px;font-size:12px;line-height:1.7">${opportunities.join('')}</ul>

  <!-- Légende -->
  <hr style="border:none;border-top:1px solid #ddd;margin:24px 0 12px">
  <p style="font-size:10px;color:#999;margin:0">
    Qualité : Excellent = encyclopédie/presse nationale · Très bon = presse locale/thématique ·
    Bon = communauté thématique · Moyen = réseau social · Faible = annuaire · Spam = à surveiller<br>
    Source : Google Search Console "Liens externes" — échantillon représentatif, non exhaustif.<br>
    Workflow : exporter depuis GSC → Liens → copier dans data/gsc-links/ → npm run backlink-report
  </p>

</div>
</body></html>`;

  // ── Envoi ──
  if (process.env.BREVO_API_KEY) {
    const alerts_count = alerts.length;
    const subject  = `🔗 Backlinks Off-Page — ${dateStr} — ${alerts_count > 0 ? alerts_count + ' alerte(s)' : 'OK'}`;
    const pdfName  = `backlink-report-${isoDate}.pdf`;

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
    console.log('ℹ️  BREVO_API_KEY non défini — résultats console uniquement');
    console.log(`Liens: ${totalLinks} | Domaines: ${totalDomains} | Homepage: ${homepagePct}% | Alertes: ${alerts.length}`);
  }
})();
