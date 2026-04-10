/**
 * cloudflare-report.js — Rapport hebdomadaire Cloudflare → Brevo
 *
 * Données : Supabase (cf_daily, cf_daily_countries, cf_hourly, cf_daily_bots)
 * Graphiques : Chart.js via Puppeteer (line chart, bar chart 24h, doughnut bots)
 * Sortie : email HTML + PDF en pièce jointe via Brevo
 *
 * Usage : npm run cloudflare-report
 * Variables : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, BREVO_API_KEY
 */

import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname    = dirname(fileURLToPath(import.meta.url));
const CHART_JS     = readFileSync(resolve(__dirname, '../node_modules/chart.js/dist/chart.umd.min.js'), 'utf-8');

const SUPABASE_URL  = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TO      = 'email@karimsaari.com';
const BREVO_FROM    = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant'); process.exit(1); }
if (!BREVO_API_KEY) { console.error('❌ BREVO_API_KEY manquant'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d) { return d.toISOString().slice(0, 10); }

function dateRange(startOffset, endOffset) {
  const end   = new Date(); end.setUTCDate(end.getUTCDate() - startOffset);
  const start = new Date(); start.setUTCDate(start.getUTCDate() - endOffset);
  return { from: formatDate(start), to: formatDate(end) };
}

function shortDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

function frDateRange(from, to) {
  const opts = { day: 'numeric', month: 'long' };
  const f = new Date(from + 'T12:00:00Z').toLocaleDateString('fr-FR', opts);
  const t = new Date(to   + 'T12:00:00Z').toLocaleDateString('fr-FR', { ...opts, year: 'numeric' });
  return `${f} – ${t}`;
}

function fmtBytes(b) {
  if (!b) return '0 MB';
  if (b >= 1024 * 1024 * 1024) return (b / 1024 / 1024 / 1024).toFixed(1) + ' GB';
  return (b / 1024 / 1024).toFixed(1) + ' MB';
}

function fmtNum(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('fr-FR').format(n);
}

function delta(curr, prev) {
  if (!prev || prev === 0) return null;
  return Math.round(((curr - prev) / prev) * 100);
}

function deltaHtml(pct) {
  if (pct == null) return '<span style="color:#bbb;font-size:10px">—</span>';
  const color = pct >= 0 ? '#21c47b' : '#e85555';
  const arrow = pct >= 0 ? '▲' : '▼';
  return `<span style="color:${color};font-size:10px;font-weight:600">${arrow} ${Math.abs(pct)}%</span>`;
}

const CF_COUNTRY_NAMES = {
  'France':'France','Belgium':'Belgique','Switzerland':'Suisse','Canada':'Canada',
  'Germany':'Allemagne','United Kingdom':'Royaume-Uni','United States':'États-Unis',
  'Spain':'Espagne','Italy':'Italie','Portugal':'Portugal','Netherlands':'Pays-Bas',
  'Morocco':'Maroc','Tunisia':'Tunisie','Algeria':'Algérie','Luxembourg':'Luxembourg',
  'Brazil':'Brésil','Mexico':'Mexique','Australia':'Australie','Japan':'Japon',
  'Reunion':'La Réunion','Unknown':'—',
};
function cfCountryLabel(n) { return CF_COUNTRY_NAMES[n] || n || '—'; }

// ── Fetch Supabase ────────────────────────────────────────────────────────────

async function fetchWeek(from, to) {
  const { data, error } = await supabase
    .from('cf_daily').select('*')
    .gte('date', from).lte('date', to).order('date', { ascending: true });
  if (error) throw new Error(`cf_daily: ${error.message}`);
  return data || [];
}

async function fetchCountriesForWeek(from, to) {
  const { data } = await supabase
    .from('cf_daily_countries').select('country, requests, bytes, threats')
    .gte('date', from).lte('date', to);
  const map = {};
  for (const r of (data || [])) {
    if (!map[r.country]) map[r.country] = { country: r.country, requests: 0, bytes: 0, threats: 0 };
    map[r.country].requests += r.requests || 0;
    map[r.country].bytes    += r.bytes    || 0;
    map[r.country].threats  += r.threats  || 0;
  }
  return Object.values(map).sort((a, b) => b.requests - a.requests).slice(0, 8);
}

async function fetchHourlyData(from, to) {
  const { data } = await supabase
    .from('cf_hourly').select('hour, unique_visitors, requests')
    .gte('date', from).lte('date', to);
  if (!data || !data.length) return null;
  const byHour = Array.from({ length: 24 }, (_, h) => ({ hour: h, requests: 0, uniques: 0 }));
  for (const r of data) {
    byHour[r.hour].requests += r.requests        || 0;
    byHour[r.hour].uniques  += r.unique_visitors || 0;
  }
  return byHour;
}

async function fetchBotData(from, to) {
  const { data } = await supabase
    .from('cf_daily_bots').select('human_requests, crawler_requests, bot_requests')
    .gte('date', from).lte('date', to);
  if (!data || !data.length) return null;
  const totals = data.reduce((acc, r) => ({
    human:   acc.human   + (r.human_requests   || 0),
    crawler: acc.crawler + (r.crawler_requests || 0),
    bot:     acc.bot     + (r.bot_requests     || 0),
  }), { human: 0, crawler: 0, bot: 0 });
  const total = totals.human + totals.crawler + totals.bot || 1;
  return {
    human:   { count: totals.human,   pct: Math.round((totals.human   / total) * 100) },
    crawler: { count: totals.crawler, pct: Math.round((totals.crawler / total) * 100) },
    bot:     { count: totals.bot,     pct: Math.round((totals.bot     / total) * 100) },
  };
}

function sumWeek(rows) {
  return rows.reduce((acc, r) => ({
    unique_visitors:  acc.unique_visitors  + (r.unique_visitors  || 0),
    page_views:       acc.page_views       + (r.page_views       || 0),
    requests:         acc.requests         + (r.requests         || 0),
    cached_requests:  acc.cached_requests  + (r.cached_requests  || 0),
    bytes:            acc.bytes            + (r.bytes            || 0),
    cached_bytes:     acc.cached_bytes     + (r.cached_bytes     || 0),
    threats:          acc.threats          + (r.threats          || 0),
  }), { unique_visitors:0, page_views:0, requests:0, cached_requests:0, bytes:0, cached_bytes:0, threats:0 });
}

// ── HTML Email ────────────────────────────────────────────────────────────────

function buildHtml({ thisWeek, thisSum, prevSum, countries, hourly, bots, fromDate, toDate }) {

  function section(title, content) {
    return `
      <div style="margin-top:28px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#21c47b;margin-bottom:12px;padding-bottom:4px;border-bottom:1px solid #e8f8f0">${title}</div>
        ${content}
      </div>`;
  }

  function dataTable(headers, rows) {
    return `
      <table width="100%" cellpadding="0" cellspacing="0">
        <thead><tr>${headers.map(h => `<th style="padding:4px 8px 4px 0;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:${h.align||'left'};white-space:nowrap">${h.label}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  const cacheRate = thisSum.requests > 0
    ? ((thisSum.cached_requests / thisSum.requests) * 100).toFixed(1) + '%' : '—';

  // ── KPI bar ──
  const kpis = [
    { label: 'Visiteurs uniques', curr: thisSum.unique_visitors, prev: prevSum?.unique_visitors, fmt: fmtNum },
    { label: 'Pages vues',        curr: thisSum.page_views,      prev: prevSum?.page_views,      fmt: fmtNum },
    { label: 'Bande passante',    curr: thisSum.bytes,           prev: prevSum?.bytes,           fmt: fmtBytes },
    { label: 'Menaces bloquées',  curr: thisSum.threats,         prev: prevSum?.threats,         fmt: fmtNum },
  ];

  const kpiBar = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">
      <tr>
        ${kpis.map(k => `
          <td align="center" width="25%" style="padding:8px 4px">
            <div style="background:#f8f9fa;border-radius:8px;padding:12px 8px;border-top:3px solid #21c47b">
              <div style="font-size:20px;font-weight:700;color:#1a1a1a">${k.fmt(k.curr)}</div>
              <div style="font-size:10px;color:#666;margin-top:2px">${k.label}</div>
              <div style="margin-top:4px">${deltaHtml(delta(k.curr, k.prev))}</div>
            </div>
          </td>`).join('')}
      </tr>
    </table>`;

  const secondaryBar = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0">
      <tr>
        ${[
          ['Requêtes totales',   fmtNum(thisSum.requests),      delta(thisSum.requests,     prevSum?.requests)],
          ['Cache rate',         cacheRate,                      null],
          ['BP mise en cache',   fmtBytes(thisSum.cached_bytes), delta(thisSum.cached_bytes, prevSum?.cached_bytes)],
        ].map(([label, value, d]) => `
          <td align="center" width="33%" style="padding:6px 4px">
            <div style="background:#f8f9fa;border-radius:6px;padding:10px 8px">
              <div style="font-size:15px;font-weight:600;color:#333">${value}</div>
              <div style="font-size:10px;color:#999;margin-top:2px">${label}</div>
              ${d != null ? `<div style="margin-top:3px">${deltaHtml(d)}</div>` : ''}
            </div>
          </td>`).join('')}
      </tr>
    </table>`;

  // ── Données JSON pour Chart.js ──
  const chartLabels7d  = JSON.stringify(thisWeek.map(d => shortDate(d.date)));
  const chartVisitors  = JSON.stringify(thisWeek.map(d => d.unique_visitors || 0));
  const chartPageViews = JSON.stringify(thisWeek.map(d => d.page_views || 0));
  const chartRequests  = JSON.stringify(thisWeek.map(d => d.requests || 0));

  const hourlyReq  = hourly ? JSON.stringify(hourly.map(h => h.requests)) : 'null';
  const hourLabels = JSON.stringify(Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2,'0')}h`));

  const botsData = bots
    ? JSON.stringify([bots.human.pct, bots.crawler.pct, bots.bot.pct])
    : 'null';

  // ── Chart 1 : Line chart 7 jours ──
  const chart7d = `
    <div style="background:#fff;border-radius:8px;padding:4px 0 0">
      <canvas id="chart7d" width="540" height="200" style="display:block"></canvas>
    </div>
    <script>
    (function() {
      var ctx = document.getElementById('chart7d').getContext('2d');
      var grad = ctx.createLinearGradient(0, 0, 0, 200);
      grad.addColorStop(0, 'rgba(33,196,123,0.35)');
      grad.addColorStop(1, 'rgba(33,196,123,0.02)');
      var grad2 = ctx.createLinearGradient(0, 0, 0, 200);
      grad2.addColorStop(0, 'rgba(0,145,255,0.18)');
      grad2.addColorStop(1, 'rgba(0,145,255,0.0)');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ${chartLabels7d},
          datasets: [
            {
              label: 'Visiteurs uniques',
              data: ${chartVisitors},
              borderColor: '#21c47b',
              backgroundColor: grad,
              borderWidth: 2.5,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#21c47b',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
            {
              label: 'Pages vues',
              data: ${chartPageViews},
              borderColor: '#0091ff',
              backgroundColor: grad2,
              borderWidth: 1.5,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#0091ff',
              pointBorderColor: '#fff',
              pointBorderWidth: 1,
              pointRadius: 3,
              borderDash: [4, 3],
            }
          ]
        },
        options: {
          responsive: false,
          animation: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              labels: { font: { size: 10 }, boxWidth: 12, padding: 12, color: '#666' }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 }, color: '#888' },
              border: { display: false }
            },
            y: {
              grid: { color: '#f0f0f0', drawBorder: false },
              ticks: { font: { size: 10 }, color: '#aaa', maxTicksLimit: 5 },
              border: { display: false },
              beginAtZero: true,
            }
          }
        }
      });
    })();
    </script>`;

  // ── Chart 2 : Bar chart 24h ──
  const chart24h = hourly ? `
    <div style="background:#fff;border-radius:8px;padding:4px 0 0">
      <canvas id="chart24h" width="540" height="160" style="display:block"></canvas>
    </div>
    <script>
    (function() {
      var data = ${hourlyReq};
      if (!data) return;
      var sorted = data.slice().sort(function(a,b){return b-a;});
      var top3vals = sorted.slice(0,3);
      var ctx = document.getElementById('chart24h').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ${hourLabels},
          datasets: [{
            data: data,
            backgroundColor: data.map(function(v) {
              return top3vals.includes(v) ? '#21c47b' : 'rgba(33,196,123,0.2)';
            }),
            borderRadius: 3,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: false,
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 8 }, color: '#aaa', maxRotation: 0 },
              border: { display: false }
            },
            y: {
              grid: { color: '#f0f0f0' },
              ticks: { font: { size: 9 }, color: '#aaa', maxTicksLimit: 4 },
              border: { display: false },
              beginAtZero: true,
            }
          }
        }
      });
      var peakH = data.indexOf(Math.max.apply(null, data));
      document.getElementById('peakHour').textContent = String(peakH).padStart(2,'0') + 'h UTC';
    })();
    </script>
    <div style="margin-top:8px;font-size:11px;color:#555">
      🕐 Pic principal : <strong style="color:#21c47b" id="peakHour">—</strong>
      <span style="color:#bbb;font-size:10px"> · cumulé sur 7 jours</span>
    </div>` : `<p style="color:#999;font-size:12px;font-style:italic">Données non disponibles (backfill en attente)</p>`;

  // ── Chart 3 : Doughnut bots ──
  const chartBots = bots ? `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="180" valign="middle">
          <canvas id="chartBots" width="160" height="160" style="display:block"></canvas>
        </td>
        <td valign="middle" style="padding-left:24px">
          ${[
            { label: '👤 Trafic humain',        color: '#21c47b', pct: bots.human.pct },
            { label: '🔍 Moteurs & monitoring', color: '#0091ff', pct: bots.crawler.pct },
            { label: '⚠️ Bots / Scanners',       color: '#e85555', pct: bots.bot.pct },
          ].map(c => `
            <div style="margin-bottom:12px">
              <div style="display:flex;align-items:center;margin-bottom:4px">
                <span style="display:inline-block;width:10px;height:10px;background:${c.color};border-radius:2px;margin-right:8px;flex-shrink:0"></span>
                <span style="font-size:12px;color:#333">${c.label}</span>
                <span style="font-size:13px;font-weight:700;color:${c.color};margin-left:auto">${c.pct}%</span>
              </div>
              <div style="background:#f0f0f0;border-radius:4px;height:6px">
                <div style="background:${c.color};border-radius:4px;height:6px;width:${c.pct}%"></div>
              </div>
            </div>`).join('')}
          <div style="font-size:10px;color:#bbb;margin-top:8px">Données échantillonnées · CF Adaptive</div>
        </td>
      </tr>
    </table>
    <script>
    (function() {
      var ctx = document.getElementById('chartBots').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Humain', 'Crawlers', 'Bots'],
          datasets: [{
            data: ${botsData},
            backgroundColor: ['#21c47b', '#0091ff', '#e85555'],
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 4,
          }]
        },
        options: {
          responsive: false,
          animation: false,
          cutout: '68%',
          plugins: { legend: { display: false } }
        }
      });
    })();
    </script>` : `<p style="color:#999;font-size:12px;font-style:italic">Données non disponibles (backfill en attente)</p>`;

  // ── Tableau détaillé 7 jours ──
  const weekRows = thisWeek.map(d => {
    const cr = (d.requests||0) > 0 ? (((d.cached_requests||0) / d.requests) * 100).toFixed(0) + '%' : '—';
    return `
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:5px 0;font-size:12px;color:#333;white-space:nowrap">${shortDate(d.date)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right;font-weight:600;color:#21c47b">${fmtNum(d.unique_visitors||0)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right">${fmtNum(d.page_views||0)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right;color:#555">${fmtNum(d.requests||0)}</td>
        <td style="padding:5px 8px;font-size:12px;text-align:right;color:#888">${cr}</td>
        <td style="padding:5px 0;font-size:12px;text-align:right;color:#aaa">${fmtBytes(d.bytes||0)}</td>
      </tr>`;
  }).join('');

  // ── Top pays ──
  const totalReqCountry = countries.reduce((a, r) => a + r.requests, 0) || 1;
  const countryRows = countries.length === 0
    ? `<tr><td colspan="4" style="color:#999;font-size:12px;padding:8px 0;font-style:italic">Aucune donnée pays disponible</td></tr>`
    : countries.map(r => {
        const barW = Math.round((r.requests / totalReqCountry) * 100);
        const threat = r.threats > 0 ? ` <span style="color:#e85555;font-size:10px">(${r.threats} ⚠)</span>` : '';
        return `
          <tr style="border-bottom:1px solid #f0f0f0">
            <td style="padding:5px 0;font-size:12px;width:130px">${cfCountryLabel(r.country)}${threat}</td>
            <td style="padding:5px 8px;font-size:12px;text-align:right;font-weight:600;width:60px">${fmtNum(r.requests)}</td>
            <td style="padding:5px 8px;font-size:12px;text-align:right;color:#888;width:60px">${fmtBytes(r.bytes)}</td>
            <td style="padding:5px 0">
              <div style="background:#e8f8f0;border-radius:3px;height:6px">
                <div style="background:#21c47b;border-radius:3px;height:6px;width:${barW}%"></div>
              </div>
            </td>
          </tr>`;
      }).join('');

  const generatedAt = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <script>${CHART_JS}<\/script>
</head>
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
                  <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-bottom:4px">Rapport Hebdomadaire · Cloudflare</div>
                  <div style="font-size:22px;font-weight:700;color:#ffffff">☁️ Trafic du site</div>
                  <div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px">${frDateRange(fromDate, toDate)}</div>
                </td>
                <td align="right" valign="top">
                  <div style="background:rgba(33,196,123,0.15);border:1px solid rgba(33,196,123,0.3);border-radius:8px;padding:10px 16px;text-align:center">
                    <div style="font-size:28px;font-weight:800;color:#21c47b">${fmtNum(thisSum.unique_visitors)}</div>
                    <div style="font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px">visiteurs</div>
                    <div style="margin-top:4px">${deltaHtml(delta(thisSum.unique_visitors, prevSum?.unique_visitors))}</div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 28px">

            ${kpiBar}
            ${secondaryBar}

            ${section('Évolution sur 7 jours', chart7d)}

            ${section('Heures de pointe (UTC)', chart24h)}

            ${section('Bots vs Humains', chartBots)}

            <!-- Saut de page PDF -->
            <div style="page-break-before:always"></div>

            ${section('Détail quotidien', dataTable(
              [
                { label: 'Date' },
                { label: 'Visiteurs', align: 'right' },
                { label: 'Pages vues', align: 'right' },
                { label: 'Requêtes', align: 'right' },
                { label: 'Cache', align: 'right' },
                { label: 'Bande passante', align: 'right' },
              ],
              weekRows
            ))}

            ${section('Top pays (requêtes)', dataTable(
              [
                { label: 'Pays' },
                { label: 'Requêtes', align: 'right' },
                { label: 'Bande passante', align: 'right' },
                { label: '' },
              ],
              countryRows
            ))}

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fa;padding:16px 28px;border-top:1px solid #f0f0f0">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:10px;color:#bbb">Généré le ${generatedAt} · karimsaari.com</td>
                <td align="right" style="font-size:10px;color:#bbb">Dark Massilia · Cloudflare Analytics</td>
              </tr>
            </table>
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
  // Attendre que les canvas Chart.js soient rendus
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  });
  await browser.close();
  return pdf;
}

// ── Envoi Brevo ───────────────────────────────────────────────────────────────

async function sendEmail(html, fromDate, pdfBuffer) {
  const subject = `☁️ Cloudflare — Semaine du ${fromDate}`;
  const body = {
    sender: BREVO_FROM,
    to: [{ email: BREVO_TO }],
    subject,
    htmlContent: html,
  };
  if (pdfBuffer) {
    body.attachment = [{
      name: `cloudflare-rapport-${fromDate.replace(/-/g, '')}.pdf`,
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
  console.log('☁️  Rapport hebdomadaire Cloudflare\n');

  const { from: thisFrom, to: thisTo } = dateRange(1, 7);
  const { from: prevFrom, to: prevTo } = dateRange(8, 14);

  console.log(`📅 Cette semaine : ${thisFrom} → ${thisTo}`);
  console.log(`📅 Semaine préc. : ${prevFrom} → ${prevTo}\n`);

  const [thisWeek, prevWeek, countries, hourly, bots] = await Promise.all([
    fetchWeek(thisFrom, thisTo),
    fetchWeek(prevFrom, prevTo),
    fetchCountriesForWeek(thisFrom, thisTo),
    fetchHourlyData(thisFrom, thisTo),
    fetchBotData(thisFrom, thisTo),
  ]);

  if (thisWeek.length === 0) {
    console.warn('⚠️  Aucune donnée Cloudflare pour cette semaine. Abandon.');
    process.exit(0);
  }

  const thisSum = sumWeek(thisWeek);
  const prevSum = prevWeek.length > 0 ? sumWeek(prevWeek) : null;

  console.log(`✅ ${thisWeek.length} jours — ${fmtNum(thisSum.unique_visitors)} visiteurs, ${fmtBytes(thisSum.bytes)}`);
  if (prevSum) {
    const d = delta(thisSum.unique_visitors, prevSum.unique_visitors);
    console.log(`   vs semaine préc. : ${d != null ? (d >= 0 ? '+' : '') + d + '%' : '—'} visiteurs`);
  }
  if (hourly) {
    const peak = [...hourly].sort((a, b) => b.requests - a.requests)[0];
    console.log(`   ⏰ Pic de trafic : ${String(peak.hour).padStart(2,'0')}h UTC (${fmtNum(peak.requests)} req.)`);
  }
  if (bots) {
    console.log(`   🤖 Humain : ${bots.human.pct}% · crawlers : ${bots.crawler.pct}% · bots : ${bots.bot.pct}%`);
  }

  const html = buildHtml({ thisWeek, thisSum, prevSum, countries, hourly, bots, fromDate: thisFrom, toDate: thisTo });

  console.log('\n📄 Génération PDF (Chart.js + Puppeteer)...');
  const pdfBuffer = await generatePDF(html);
  console.log(`  ✅ PDF généré (${Math.round(pdfBuffer.length / 1024)} Ko)`);

  console.log('\n📧 Envoi email Brevo...');
  await sendEmail(html, thisFrom, pdfBuffer);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
