/**
 * gsc-daily-report.js — Rapport GSC journalier via Supabase → Brevo
 *
 * Affiche le dernier jour disponible :
 *   · KPIs globaux (clics, impressions, CTR, position)
 *   · Top 10 requêtes
 *   · Top 10 pages
 *   · Breakdown pays
 *   · Breakdown appareils
 *   · Tableau 7 jours glissants
 *
 * Usage : npm run gsc-daily-report
 * Variables : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, BREVO_API_KEY
 */

import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TO   = 'email@karimsaari.com';
const BREVO_FROM = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant');
  process.exit(1);
}
if (!BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY manquant');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Helpers ───────────────────────────────────────────────────────────────────

const COUNTRY_NAMES = {
  fra: 'France', bel: 'Belgique', che: 'Suisse', can: 'Canada',
  deu: 'Allemagne', gbr: 'Royaume-Uni', usa: 'États-Unis', esp: 'Espagne',
  ita: 'Italie', prt: 'Portugal', nld: 'Pays-Bas', mar: 'Maroc',
  tun: 'Tunisie', dza: 'Algérie', lux: 'Luxembourg', bra: 'Brésil',
  mex: 'Mexique', reu: 'La Réunion', aus: 'Australie', jpn: 'Japon',
};
function countryLabel(code) {
  return COUNTRY_NAMES[code?.toLowerCase()] || (code || '').toUpperCase();
}

const DEVICE_LABELS = { mobile: '📱 Mobile', desktop: '🖥️ Desktop', tablet: '📲 Tablette' };
function deviceLabel(d) { return DEVICE_LABELS[d?.toLowerCase()] || d; }

function pageLabel(url) {
  return (url || '').replace('https://karimsaari.com', '') || '/';
}

function pct(v) {
  if (v == null || isNaN(v)) return '—';
  return (v * 100).toFixed(1) + '%';
}
function pos(v) {
  if (v == null || isNaN(v) || v === 0) return '—';
  return parseFloat(v).toFixed(1);
}

function frDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function shortDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

// ── Fetch Supabase ────────────────────────────────────────────────────────────

async function fetchLastDay() {
  const { data, error } = await supabase
    .from('gsc_daily')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single();
  if (error) throw new Error(`gsc_daily: ${error.message}`);
  return data;
}

async function fetch7Days() {
  const { data, error } = await supabase
    .from('gsc_daily')
    .select('*')
    .order('date', { ascending: false })
    .limit(7);
  if (error) throw new Error(`gsc_daily 7j: ${error.message}`);
  return (data || []).reverse();
}

async function fetchQueries(date) {
  const { data, error } = await supabase
    .from('gsc_daily_queries')
    .select('*')
    .eq('date', date)
    .order('impressions', { ascending: false })
    .limit(10);
  if (error) throw new Error(`gsc_daily_queries: ${error.message}`);
  return data || [];
}

async function fetchPages(date) {
  const { data, error } = await supabase
    .from('gsc_daily_pages')
    .select('*')
    .eq('date', date)
    .order('impressions', { ascending: false })
    .limit(10);
  if (error) throw new Error(`gsc_daily_pages: ${error.message}`);
  return data || [];
}

async function fetchCountries(date) {
  const { data, error } = await supabase
    .from('gsc_daily_countries')
    .select('*')
    .eq('date', date)
    .order('impressions', { ascending: false })
    .limit(8);
  if (error) throw new Error(`gsc_daily_countries: ${error.message}`);
  return data || [];
}

async function fetchDevices(date) {
  const { data, error } = await supabase
    .from('gsc_daily_devices')
    .select('*')
    .eq('date', date)
    .order('impressions', { ascending: false });
  if (error) throw new Error(`gsc_daily_devices: ${error.message}`);
  return data || [];
}

async function fetch28DaysClicks() {
  const { data, error } = await supabase
    .from('gsc_daily')
    .select('date, clicks')
    .order('date', { ascending: false })
    .limit(28);
  if (error) throw new Error(`gsc_daily 28j: ${error.message}`);
  const rows = data || [];
  return {
    total: rows.reduce((s, r) => s + (r.clicks || 0), 0),
    days:  rows.length,
  };
}

// ── HTML Email ────────────────────────────────────────────────────────────────

// Paliers GSC "Réussites" (clics / 28 jours glissants)
const MILESTONES = [10, 25, 50, 100, 120, 150, 200, 300, 500, 750, 1000];

function getMilestone(total) {
  const next = MILESTONES.find(m => m > total) || MILESTONES[MILESTONES.length - 1];
  const prev = [...MILESTONES].reverse().find(m => m <= total) || 0;
  const pct  = Math.min(100, Math.round((total / next) * 100));
  return { total, next, prev, pct };
}

function buildHtml({ lastDay, days7, queries, pages, countries, devices, clicks28, generatedAt }) {
  const date = lastDay.date;

  // ── KPI bar ──
  const kpiBar = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">
      <tr>
        ${[
          ['Clics', lastDay.clicks, ''],
          ['Impressions', lastDay.impressions, ''],
          ['CTR', pct(lastDay.ctr), ''],
          ['Position moy.', pos(lastDay.position), ''],
        ].map(([label, value, _]) => `
          <td align="center" width="25%" style="padding:12px 4px">
            <div style="background:#f8f9fa;border-radius:8px;padding:12px 8px;border-top:3px solid #21c47b">
              <div style="font-size:22px;font-weight:700;color:#1a1a1a">${value}</div>
              <div style="font-size:11px;color:#666;margin-top:2px">${label}</div>
            </div>
          </td>
        `).join('')}
      </tr>
    </table>`;

  // ── Rows helper ──
  function tableRows(rows, cols) {
    if (!rows.length) return `<tr><td colspan="${cols}" style="color:#999;font-size:12px;padding:8px 0;font-style:italic">Aucune donnée disponible</td></tr>`;
    return rows.map(r => `<tr style="border-bottom:1px solid #f0f0f0">${r}</tr>`).join('');
  }

  // ── Top requêtes ──
  const queryRows = tableRows(
    queries.map(r => `
      <td style="padding:6px 0;font-size:12px;color:#333;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.query}</td>
      <td style="padding:6px 8px;font-size:12px;text-align:right;font-weight:600">${r.clicks}</td>
      <td style="padding:6px 8px;font-size:12px;text-align:right;color:#555">${r.impressions}</td>
      <td style="padding:6px 8px;font-size:12px;text-align:right;color:#555">${pct(r.ctr)}</td>
      <td style="padding:6px 0;font-size:12px;text-align:right;color:#888">${pos(r.position)}</td>
    `), 5
  );

  // ── Top pages ──
  const pageRows = tableRows(
    pages.map(r => `
      <td style="padding:6px 0;font-size:11px;color:#0066cc;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${pageLabel(r.page)}</td>
      <td style="padding:6px 8px;font-size:12px;text-align:right;font-weight:600">${r.clicks}</td>
      <td style="padding:6px 8px;font-size:12px;text-align:right;color:#555">${r.impressions}</td>
      <td style="padding:6px 8px;font-size:12px;text-align:right;color:#555">${pct(r.ctr)}</td>
      <td style="padding:6px 0;font-size:12px;text-align:right;color:#888">${pos(r.position)}</td>
    `), 5
  );

  // ── Pays ──
  const totalImprCountry = countries.reduce((a, r) => a + r.impressions, 0) || 1;
  const countryRows = tableRows(
    countries.map(r => {
      const barW = Math.round((r.impressions / totalImprCountry) * 100);
      return `
        <td style="padding:5px 0;font-size:12px;width:120px">${countryLabel(r.country)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right;font-weight:600;width:40px">${r.clicks}</td>
        <td style="padding:5px 0;font-size:12px;color:#555;width:50px;text-align:right">${r.impressions}</td>
        <td style="padding:5px 0 5px 8px;width:80px">
          <div style="background:#e8f8f0;border-radius:3px;height:6px;width:100%">
            <div style="background:#21c47b;border-radius:3px;height:6px;width:${barW}%"></div>
          </div>
        </td>
      `;
    }), 4
  );

  // ── Appareils ──
  const totalImprDevice = devices.reduce((a, r) => a + r.impressions, 0) || 1;
  const deviceRows = tableRows(
    devices.map(r => {
      const barW = Math.round((r.impressions / totalImprDevice) * 100);
      return `
        <td style="padding:5px 0;font-size:12px;width:120px">${deviceLabel(r.device)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right;font-weight:600;width:40px">${r.clicks}</td>
        <td style="padding:5px 0;font-size:12px;color:#555;width:50px;text-align:right">${r.impressions}</td>
        <td style="padding:5px 0 5px 8px;width:80px">
          <div style="background:#e8f8f0;border-radius:3px;height:6px;width:100%">
            <div style="background:#21c47b;border-radius:3px;height:6px;width:${barW}%"></div>
          </div>
        </td>
      `;
    }), 4
  );

  // ── Graphique 7 jours (HTML/CSS — compatible email + PDF) ───────────────────
  const maxImpr  = Math.max(...days7.map(d => d.impressions), 1);
  const maxClicks = Math.max(...days7.map(d => d.clicks), 1);
  const chartCols = days7.map(d => {
    const isLast   = d.date === date;
    const hImpr    = Math.max(4, Math.round((d.impressions / maxImpr)  * 80));
    const hClicks  = Math.max(d.clicks > 0 ? 4 : 0, Math.round((d.clicks / maxClicks) * 80));
    return `
      <td align="center" valign="bottom" style="width:${Math.floor(100/days7.length)}%;padding:0 2px">
        <div style="position:relative;height:88px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center">
          <!-- Barre impressions -->
          <div style="width:28px;height:${hImpr}px;background:${isLast ? 'rgba(33,196,123,0.35)' : 'rgba(33,196,123,0.15)'};border-radius:3px 3px 0 0;position:relative">
            ${d.clicks > 0 ? `<!-- Barre clics superposée -->
            <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:10px;height:${hClicks}px;background:#21c47b;border-radius:2px 2px 0 0"></div>` : ''}
          </div>
        </div>
        <!-- Label valeur clics -->
        <div style="font-size:10px;font-weight:${isLast ? '700' : '400'};color:${isLast ? '#21c47b' : '#888'};margin-top:3px">${d.clicks > 0 ? d.clicks : '·'}</div>
        <!-- Label date -->
        <div style="font-size:9px;color:${isLast ? '#21c47b' : '#bbb'};font-weight:${isLast ? '700' : '400'};margin-top:2px;white-space:nowrap">${shortDate(d.date)}</div>
      </td>`;
  }).join('');

  const chart7 = `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:2px solid #eee">
      <tr>${chartCols}</tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">
      <tr>
        <td style="font-size:10px;color:#999">
          <span style="display:inline-block;width:10px;height:10px;background:rgba(33,196,123,0.25);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Impressions
          &nbsp;
          <span style="display:inline-block;width:10px;height:10px;background:#21c47b;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Clics
        </td>
        <td align="right" style="font-size:10px;color:#bbb">max impr. : ${maxImpr}</td>
      </tr>
    </table>`;

  // ── Tableau 7 jours ──
  const trend7Rows = days7.map(d => `
    <tr style="border-bottom:1px solid #f0f0f0${d.date === date ? ';background:#f0fbf5' : ''}">
      <td style="padding:5px 0;font-size:12px;color:#333${d.date === date ? ';font-weight:700' : ''}">${shortDate(d.date)}</td>
      <td style="padding:5px 8px;font-size:12px;text-align:right;font-weight:600${d.date === date ? ';color:#21c47b' : ''}">${d.clicks}</td>
      <td style="padding:5px 8px;font-size:12px;text-align:right;color:#555">${d.impressions}</td>
      <td style="padding:5px 8px;font-size:12px;text-align:right;color:#555">${pct(d.ctr)}</td>
      <td style="padding:5px 0;font-size:12px;text-align:right;color:#888">${pos(d.position)}</td>
    </tr>
  `).join('');

  // ── Section helper ──
  function section(title, content) {
    return `
      <div style="margin-top:24px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#21c47b;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e8f8f0">${title}</div>
        ${content}
      </div>`;
  }

  function dataTable(headers, rows) {
    return `
      <table width="100%" cellpadding="0" cellspacing="0">
        <thead>
          <tr>${headers.map(h => `<th style="padding:4px 8px 4px 0;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:${h.align || 'left'};white-space:nowrap">${h.label}</th>`).join('')}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d1f2d 0%,#1a3a4a 100%);padding:24px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:11px;color:#21c47b;font-weight:600;letter-spacing:1px;text-transform:uppercase">Dark Massilia — GSC</div>
                  <div style="font-size:20px;font-weight:700;color:#ffffff;margin-top:4px">Rapport journalier</div>
                  <div style="font-size:13px;color:#8ab4c4;margin-top:6px">
                    Données du <span style="color:#fff;font-weight:600;text-transform:capitalize">${frDate(date)}</span>
                  </div>
                  <div style="font-size:11px;color:#5a7a8a;margin-top:4px">Généré le ${generatedAt}</div>
                </td>
                <td align="right">
                  <div style="background:rgba(33,196,123,0.15);border:1px solid rgba(33,196,123,0.3);border-radius:8px;padding:8px 14px;display:inline-block">
                    <div style="font-size:24px;font-weight:700;color:#21c47b">${lastDay.clicks}</div>
                    <div style="font-size:10px;color:#8ab4c4;text-transform:uppercase;letter-spacing:0.5px">clics</div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 28px">

            <!-- KPIs -->
            ${kpiBar}

            <!-- Réussites GSC -->
            ${(() => {
              const ms = getMilestone(clicks28.total);
              const barColor = '#21c47b';
              const incomplete = clicks28.days < 28;
              return section('Réussites — 28 jours glissants', `
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:10px 14px;background:#f8f9fa;border-radius:8px;border-left:3px solid #21c47b">
                      <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:2px">
                        Impact de la recherche Google : ${ms.total} / ${ms.next}
                      </div>
                      <div style="font-size:11px;color:#666;margin-bottom:8px">
                        Générez ${ms.next} clics depuis la recherche Google en 28 jours
                        ${incomplete ? `<span style="color:#f59e0b"> · ⚠️ ${clicks28.days}/28 jours disponibles — lancer le backfill</span>` : ''}
                      </div>
                      <div style="background:#e0e0e0;border-radius:4px;height:8px;width:100%">
                        <div style="background:${barColor};border-radius:4px;height:8px;width:${ms.pct}%"></div>
                      </div>
                      <div style="font-size:10px;color:#999;margin-top:4px;text-align:right">${ms.pct}% vers l'objectif ${ms.next}</div>
                    </td>
                  </tr>
                </table>
              `);
            })()}

            <!-- Top requêtes -->
            ${section('Top requêtes', dataTable(
              [
                { label: 'Requête' },
                { label: 'Clics', align: 'right' },
                { label: 'Impr.', align: 'right' },
                { label: 'CTR', align: 'right' },
                { label: 'Pos.', align: 'right' },
              ],
              queryRows
            ))}

            <!-- Top pages -->
            ${section('Top pages', dataTable(
              [
                { label: 'Page' },
                { label: 'Clics', align: 'right' },
                { label: 'Impr.', align: 'right' },
                { label: 'CTR', align: 'right' },
                { label: 'Pos.', align: 'right' },
              ],
              pageRows
            ))}

            <!-- Pays & Appareils côte à côte -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px">
              <tr>
                <td width="50%" valign="top" style="padding-right:16px">
                  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#21c47b;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e8f8f0">Pays</div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tbody>${countryRows}</tbody>
                  </table>
                </td>
                <td width="50%" valign="top">
                  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#21c47b;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e8f8f0">Appareils</div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tbody>${deviceRows}</tbody>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Saut de page PDF -->
            <div style="page-break-after:always"></div>

            <!-- 7 jours glissants -->
            ${section('7 jours glissants', `
              ${chart7}
              <div style="margin-top:16px">
                ${dataTable(
                  [
                    { label: 'Date' },
                    { label: 'Clics', align: 'right' },
                    { label: 'Impr.', align: 'right' },
                    { label: 'CTR', align: 'right' },
                    { label: 'Pos. moy.', align: 'right' },
                  ],
                  trend7Rows
                )}
              </div>
            `)}

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fa;padding:16px 28px;border-top:1px solid #eee">
            <p style="margin:0;font-size:11px;color:#999">
              Données Google Search Console — karimsaari.com<br>
              Généré automatiquement par Dark Massilia · <a href="https://karimsaari.com/home" style="color:#21c47b;text-decoration:none">karimsaari.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── PDF via Puppeteer ─────────────────────────────────────────────────────────

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

// ── Envoi Brevo ───────────────────────────────────────────────────────────────

async function sendEmail(html, lastDate, pdfBuffer) {
  const subject = `📊 GSC — ${frDate(lastDate)}`;
  const body = {
    sender: BREVO_FROM,
    to: [{ email: BREVO_TO }],
    subject,
    htmlContent: html,
  };
  if (pdfBuffer) {
    const dateSlug = lastDate.replace(/-/g, '');
    body.attachment = [{
      name: `gsc-rapport-${dateSlug}.pdf`,
      content: Buffer.from(pdfBuffer).toString('base64'),
    }];
  }
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Brevo: ${JSON.stringify(json)}`);
  console.log(`  ✅ Email envoyé → ${BREVO_TO} (messageId: ${json.messageId})`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  console.log('📧 Rapport GSC journalier...\n');

  const [lastDay, days7, clicks28] = await Promise.all([fetchLastDay(), fetch7Days(), fetch28DaysClicks()]);
  const date = lastDay.date;
  console.log(`📅 Dernier jour disponible : ${date}`);
  console.log(`   Clics: ${lastDay.clicks} | Impr: ${lastDay.impressions} | CTR: ${pct(lastDay.ctr)} | Pos: ${pos(lastDay.position)}`);
  console.log(`   Réussites 28j : ${clicks28.total} clics (${clicks28.days} jours) → objectif ${getMilestone(clicks28.total).next}\n`);

  const [queries, pages, countries, devices] = await Promise.all([
    fetchQueries(date),
    fetchPages(date),
    fetchCountries(date),
    fetchDevices(date),
  ]);

  console.log(`  📝 ${queries.length} requêtes, ${pages.length} pages, ${countries.length} pays, ${devices.length} appareils`);

  const now = new Date();
  const generatedAt = now.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris',
  });

  const html = buildHtml({ lastDay, days7, queries, pages, countries, devices, clicks28, generatedAt });
  if (clicks28.days < 28) console.warn(`  ⚠️  Seulement ${clicks28.days}/28 jours en base — lancer le backfill : workflow_dispatch backfill_days=28`);

  console.log('\n📄 Génération PDF...');
  const pdfBuffer = await generatePDF(html);
  console.log(`  ✅ PDF généré (${Math.round(pdfBuffer.length / 1024)} Ko)`);

  console.log('\n📨 Envoi Brevo...');
  await sendEmail(html, date, pdfBuffer);

  console.log('\n✅ Rapport envoyé.');
})().catch(e => { console.error('❌', e.message); process.exit(1); });
