/**
 * weekly-targets-report.js — Suivi hebdomadaire des requêtes cibles → PDF Brevo
 *
 * Compare la semaine courante (J-2 à J-8) vs la semaine précédente (J-9 à J-15)
 * pour 8 requêtes SEO cibles sur karimsaari.com.
 *
 * Usage : npm run weekly-targets-report
 * Variables : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, BREVO_API_KEY
 */

import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

const SUPABASE_URL  = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TO      = 'email@karimsaari.com';
const BREVO_FROM    = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ VITE_SUPABASE_URL ou SUPABASE_KEY manquant'); process.exit(1); }
if (!BREVO_API_KEY)                 { console.error('❌ BREVO_API_KEY manquant'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TARGET_QUERIES = [
  'photographe environnemental',
  'photographe environnemental marseille',
  'photographe sous marin marseille',
  'photographe calanques',
  'photographe paysages marseille',
  'dark massilia',
  'karim saari',
  'dépollution marine marseille',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoDate(d) { return d.toISOString().slice(0, 10); }

function weekRange(weeksAgo) {
  const endMs = Date.now() - (2 + weeksAgo * 7) * 86400000;
  const end   = new Date(endMs);
  const start = new Date(endMs - 6 * 86400000);
  return { start: isoDate(start), end: isoDate(end) };
}

function frDateRange(start, end) {
  const fmt = s => new Date(s + 'T12:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function posStr(v)  { return (v == null || v === 0) ? '—' : parseFloat(v).toFixed(1); }
function pctStr(v)  { return (v == null || isNaN(v)) ? '—' : (v * 100).toFixed(1) + '%'; }

function posTrend(curr, prev) {
  if (!curr || !prev) return '<span style="color:#999;font-size:16px">—</span>';
  const diff = prev - curr; // positif = rang amélioré (chiffre descendu)
  if (Math.abs(diff) < 0.5) return '<span style="color:#999;font-size:16px">→</span>';
  if (diff > 0) return `<span style="color:#21c47b;font-weight:700">▲ ${diff.toFixed(1)}</span>`;
  return `<span style="color:#e74c3c;font-weight:700">▼ ${Math.abs(diff).toFixed(1)}</span>`;
}

function posColor(v) {
  if (!v) return '#aaa';
  if (v <= 3)  return '#21c47b';
  if (v <= 10) return '#f39c12';
  return '#666';
}

// ── Fetch Supabase ────────────────────────────────────────────────────────────

async function fetchTargetQueries(start, end) {
  const { data, error } = await supabase
    .from('gsc_daily_queries')
    .select('query, clicks, impressions, position')
    .gte('date', start)
    .lte('date', end)
    .in('query', TARGET_QUERIES);
  if (error) throw new Error(`gsc_daily_queries: ${error.message}`);

  const map = {};
  for (const q of TARGET_QUERIES) {
    map[q] = { query: q, clicks: 0, impressions: 0, posSum: 0, posCount: 0 };
  }
  for (const r of (data || [])) {
    if (!map[r.query]) continue;
    map[r.query].clicks      += r.clicks;
    map[r.query].impressions += r.impressions;
    if (r.position > 0) {
      map[r.query].posSum   += r.position * r.impressions;
      map[r.query].posCount += r.impressions;
    }
  }
  return TARGET_QUERIES.map(q => ({
    query:       q,
    clicks:      map[q].clicks,
    impressions: map[q].impressions,
    ctr:         map[q].impressions > 0 ? map[q].clicks / map[q].impressions : 0,
    position:    map[q].posCount > 0 ? map[q].posSum / map[q].posCount : null,
  }));
}

async function fetchDiscoveryQueries(start, end) {
  const { data, error } = await supabase
    .from('gsc_daily_queries')
    .select('query, clicks, impressions, position')
    .gte('date', start)
    .lte('date', end)
    .not('query', 'in', `(${TARGET_QUERIES.map(q => `"${q}"`).join(',')})`);
  if (error) throw new Error(`gsc_daily_queries discovery: ${error.message}`);

  const map = {};
  for (const r of (data || [])) {
    if (!map[r.query]) map[r.query] = { query: r.query, clicks: 0, impressions: 0, posSum: 0, posCount: 0 };
    map[r.query].clicks      += r.clicks;
    map[r.query].impressions += r.impressions;
    if (r.position > 0) {
      map[r.query].posSum   += r.position * r.impressions;
      map[r.query].posCount += r.impressions;
    }
  }
  return Object.values(map)
    .map(r => ({
      query:       r.query,
      clicks:      r.clicks,
      impressions: r.impressions,
      ctr:         r.impressions > 0 ? r.clicks / r.impressions : 0,
      position:    r.posCount > 0 ? r.posSum / r.posCount : null,
    }))
    .filter(r => r.impressions > 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);
}

// ── HTML ──────────────────────────────────────────────────────────────────────

function buildHtml({ currData, prevData, currRange, prevRange, generatedAt, discoveryData }) {
  const rows = TARGET_QUERIES.map(q => {
    const c = currData.find(r => r.query === q) || { clicks: 0, impressions: 0, ctr: 0, position: null };
    const p = prevData.find(r => r.query === q) || { clicks: 0, impressions: 0, ctr: 0, position: null };

    const trend    = posTrend(c.position, p.position);
    const pc       = posColor(c.position);
    const hasData  = c.impressions > 0;

    return `
      <tr style="border-bottom:1px solid #f0f0f0;${!hasData ? 'opacity:0.5' : ''}">
        <td style="padding:10px 12px 10px 0;font-size:13px;color:#333">${q}</td>
        <td style="padding:10px 8px;text-align:center">
          <span style="font-size:20px;font-weight:700;color:${pc}">${posStr(c.position)}</span><br>
          <span style="font-size:10px;color:#bbb">${posStr(p.position)} préc.</span>
        </td>
        <td style="padding:10px 8px;text-align:center;font-size:14px">${trend}</td>
        <td style="padding:10px 8px;text-align:right;font-size:13px;font-weight:${c.impressions > 0 ? '600' : '400'};color:${c.impressions > 0 ? '#333' : '#bbb'}">${c.impressions}</td>
        <td style="padding:10px 8px;text-align:right;font-size:13px;color:${c.clicks > 0 ? '#21c47b' : '#bbb'};font-weight:${c.clicks > 0 ? '700' : '400'}">${c.clicks}</td>
        <td style="padding:10px 0;text-align:right;font-size:12px;color:#888">${pctStr(c.ctr)}</td>
      </tr>`;
  }).join('');

  const totalImpr   = currData.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = currData.reduce((s, r) => s + r.clicks, 0);
  const inTop10     = currData.filter(r => r.position && r.position <= 10).length;
  const inTop3      = currData.filter(r => r.position && r.position <= 3).length;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d1f2d 0%,#1a3a4a 100%);padding:24px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:11px;color:#21c47b;font-weight:600;letter-spacing:1px;text-transform:uppercase">Dark Massilia — GSC</div>
                  <div style="font-size:20px;font-weight:700;color:#ffffff;margin-top:4px">Suivi Requêtes Cibles</div>
                  <div style="font-size:13px;color:#8ab4c4;margin-top:6px">${frDateRange(currRange.start, currRange.end)}</div>
                  <div style="font-size:11px;color:#5a7a8a;margin-top:4px">Généré le ${generatedAt} · vs ${frDateRange(prevRange.start, prevRange.end)}</div>
                </td>
                <td align="right" valign="top">
                  <table cellpadding="0" cellspacing="4">
                    <tr>
                      <td align="center" style="background:rgba(33,196,123,0.15);border:1px solid rgba(33,196,123,0.3);border-radius:8px;padding:8px 14px;min-width:60px">
                        <div style="font-size:22px;font-weight:700;color:#21c47b">${inTop3}</div>
                        <div style="font-size:10px;color:#8ab4c4">Top 3</div>
                      </td>
                      <td align="center" style="background:rgba(243,156,18,0.12);border:1px solid rgba(243,156,18,0.3);border-radius:8px;padding:8px 14px;min-width:60px">
                        <div style="font-size:22px;font-weight:700;color:#f39c12">${inTop10}</div>
                        <div style="font-size:10px;color:#8ab4c4">Top 10</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Stats bar -->
        <tr>
          <td style="background:#f8fdfa;padding:12px 28px;border-bottom:1px solid #eafaf2">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:12px;color:#555">
                  <strong style="color:#1a1a1a">${totalImpr}</strong> impressions · <strong style="color:#21c47b">${totalClicks}</strong> clics cette semaine sur les 8 requêtes cibles
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Table -->
        <tr>
          <td style="padding:24px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <thead>
                <tr style="border-bottom:2px solid #f0f0f0">
                  <th style="padding:6px 12px 6px 0;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:left">Requête</th>
                  <th style="padding:6px 8px;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:center">Position</th>
                  <th style="padding:6px 8px;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:center">Évol.</th>
                  <th style="padding:6px 8px;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:right">Impr.</th>
                  <th style="padding:6px 8px;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:right">Clics</th>
                  <th style="padding:6px 0;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:right">CTR</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>

            <!-- Légende -->
            <div style="margin-top:20px;padding:12px 16px;background:#f8f9fa;border-radius:8px;border-left:3px solid #21c47b">
              <div style="font-size:11px;color:#777;line-height:1.8">
                <strong style="color:#21c47b">▲</strong> Position améliorée &nbsp;·&nbsp;
                <strong style="color:#e74c3c">▼</strong> Dégradée &nbsp;·&nbsp;
                <strong style="color:#999">→</strong> Stable (&lt;0.5 pt) &nbsp;·&nbsp;
                <strong style="color:#999">—</strong> Aucune donnée cette semaine<br>
                Position : <span style="color:#21c47b;font-weight:700">■</span> Top 3 &nbsp;
                <span style="color:#f39c12;font-weight:700">■</span> Top 10 &nbsp;
                <span style="color:#666">■</span> Hors top 10
              </div>
            </div>
          </td>
        </tr>

        <!-- Footer page 1 -->
        <tr>
          <td style="background:#f8f9fa;padding:16px 28px;border-top:1px solid #eee">
            <p style="margin:0;font-size:11px;color:#999">
              Données Google Search Console — karimsaari.com · Semaine : ${frDateRange(currRange.start, currRange.end)}<br>
              Généré automatiquement · <a href="https://karimsaari.com/home" style="color:#21c47b;text-decoration:none">karimsaari.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

  <!-- ══ PAGE 2 — Requêtes découvertes ══ -->
  <div style="page-break-before:always"></div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

        <!-- Header page 2 -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d1f2d 0%,#1a3a4a 100%);padding:24px 28px">
            <div style="font-size:11px;color:#21c47b;font-weight:600;letter-spacing:1px;text-transform:uppercase">Dark Massilia — GSC · Page 2</div>
            <div style="font-size:20px;font-weight:700;color:#ffffff;margin-top:4px">Requêtes Découvertes</div>
            <div style="font-size:13px;color:#8ab4c4;margin-top:6px">${frDateRange(currRange.start, currRange.end)} · Top 20 hors requêtes cibles</div>
            <div style="font-size:11px;color:#5a7a8a;margin-top:4px">Requêtes où Google t'affiche sans que tu les surveilles</div>
          </td>
        </tr>

        <!-- Table découverte -->
        <tr>
          <td style="padding:24px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <thead>
                <tr style="border-bottom:2px solid #f0f0f0">
                  <th style="padding:6px 12px 6px 0;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:left">Requête</th>
                  <th style="padding:6px 8px;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:center">Position</th>
                  <th style="padding:6px 8px;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:right">Impr.</th>
                  <th style="padding:6px 8px;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:right">Clics</th>
                  <th style="padding:6px 0;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:right">CTR</th>
                </tr>
              </thead>
              <tbody>
                ${discoveryData.length === 0
                  ? `<tr><td colspan="5" style="padding:20px 0;font-size:12px;color:#bbb;font-style:italic">Aucune donnée cette semaine</td></tr>`
                  : discoveryData.map(r => {
                      const pc = posColor(r.position);
                      const isOpportunity = r.position && r.position >= 8 && r.position <= 20 && r.impressions >= 3;
                      return `
                        <tr style="border-bottom:1px solid #f0f0f0;${isOpportunity ? 'background:#fffdf4' : ''}">
                          <td style="padding:9px 12px 9px 0;font-size:12px;color:#333">
                            ${isOpportunity ? '<span style="font-size:9px;background:#fff3cd;color:#856404;border-radius:3px;padding:1px 5px;margin-right:6px;font-weight:600">OPPORTUNITÉ</span>' : ''}
                            ${r.query}
                          </td>
                          <td style="padding:9px 8px;text-align:center;font-size:16px;font-weight:700;color:${pc}">${posStr(r.position)}</td>
                          <td style="padding:9px 8px;text-align:right;font-size:12px;font-weight:600">${r.impressions}</td>
                          <td style="padding:9px 8px;text-align:right;font-size:12px;color:${r.clicks > 0 ? '#21c47b' : '#bbb'};font-weight:${r.clicks > 0 ? '700' : '400'}">${r.clicks}</td>
                          <td style="padding:9px 0;text-align:right;font-size:12px;color:#888">${pctStr(r.ctr)}</td>
                        </tr>`;
                    }).join('')
                }
              </tbody>
            </table>

            <!-- Note opportunités -->
            <div style="margin-top:20px;padding:12px 16px;background:#fffdf4;border-radius:8px;border-left:3px solid #f39c12">
              <div style="font-size:11px;color:#856404;line-height:1.7">
                <strong>OPPORTUNITÉ</strong> = position 8–20 avec ≥3 impressions · ces requêtes sont à portée du top 10 avec une page dédiée ou un renforcement du contenu existant.
              </div>
            </div>
          </td>
        </tr>

        <!-- Footer page 2 -->
        <tr>
          <td style="background:#f8f9fa;padding:16px 28px;border-top:1px solid #eee">
            <p style="margin:0;font-size:11px;color:#999">
              Données Google Search Console — karimsaari.com · Semaine : ${frDateRange(currRange.start, currRange.end)}<br>
              Généré automatiquement · <a href="https://karimsaari.com/home" style="color:#21c47b;text-decoration:none">karimsaari.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── PDF ───────────────────────────────────────────────────────────────────────

async function generatePDF(html) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 700, height: 900 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' } });
  await browser.close();
  return pdf;
}

// ── Brevo ─────────────────────────────────────────────────────────────────────

async function sendEmail(html, currRange, pdfBuffer) {
  const subject = `🎯 Requêtes cibles — ${frDateRange(currRange.start, currRange.end)}`;
  const body = {
    sender: BREVO_FROM,
    to: [{ email: BREVO_TO }],
    subject,
    htmlContent: html,
    attachment: pdfBuffer
      ? [{ name: `requetes-cibles-${currRange.end}.pdf`, content: Buffer.from(pdfBuffer).toString('base64') }]
      : undefined,
  };
  const res  = await fetch('https://api.brevo.com/v3/smtp/email', {
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
  console.log('🎯 Suivi requêtes cibles...\n');

  const currRange = weekRange(0);
  const prevRange = weekRange(1);
  console.log(`📅 Semaine courante  : ${currRange.start} → ${currRange.end}`);
  console.log(`📅 Semaine précédente: ${prevRange.start} → ${prevRange.end}\n`);

  const [currData, prevData, discoveryData] = await Promise.all([
    fetchTargetQueries(currRange.start, currRange.end),
    fetchTargetQueries(prevRange.start, prevRange.end),
    fetchDiscoveryQueries(currRange.start, currRange.end),
  ]);
  console.log(`  ${discoveryData.length} requêtes découvertes cette semaine`);

  for (const r of currData) {
    const p    = prevData.find(x => x.query === r.query);
    const diff = p?.position && r.position ? (p.position - r.position) : null;
    const icon = diff === null ? '?' : diff > 0.5 ? '▲' : diff < -0.5 ? '▼' : '→';
    console.log(`  ${icon} "${r.query}": pos ${posStr(r.position)} (${r.impressions} impr, ${r.clicks} clics)`);
  }

  const generatedAt = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris',
  });

  const html = buildHtml({ currData, prevData, currRange, prevRange, generatedAt, discoveryData });

  console.log('\n📄 Génération PDF...');
  const pdfBuffer = await generatePDF(html);
  console.log(`  ✅ PDF généré (${Math.round(pdfBuffer.length / 1024)} Ko)`);

  console.log('\n📨 Envoi Brevo...');
  await sendEmail(html, currRange, pdfBuffer);

  console.log('\n✅ Rapport requêtes cibles envoyé.');
})().catch(e => { console.error('❌', e.message); process.exit(1); });
