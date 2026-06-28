/**
 * weekly-targets-report.js — Suivi mensuel glissant des requêtes cibles → PDF 3 pages Brevo
 *
 * Page 1 : Dashboard (KPIs + graphiques positions + impressions)
 * Page 2 : Tableau détaillé requêtes cibles (30j vs 30j précédents)
 * Page 3 : Requêtes découvertes (top 20 hors cibles)
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
  'photographie environnementale',
  'photographie environnementale marseille',
  'photographe sous marin marseille',
  'photographe calanques',
  'photographe paysages marseille',
  'dark massilia',
  'karim saari',
  'dépollution marine marseille',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoDate(d) { return d.toISOString().slice(0, 10); }

function rollingRange(periodsAgo, days = 30) {
  const endMs = Date.now() - (2 + periodsAgo * days) * 86400000;
  const end   = new Date(endMs);
  const start = new Date(endMs - (days - 1) * 86400000);
  return { start: isoDate(start), end: isoDate(end) };
}

function frDateRange(start, end) {
  const fmt = s => new Date(s + 'T12:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function posStr(v)  { return (v == null || v === 0) ? '—' : parseFloat(v).toFixed(1); }
function pctStr(v)  { return (v == null || isNaN(v)) ? '—' : (v * 100).toFixed(1) + '%'; }

function posTrend(curr, prev) {
  if (!curr || !prev) return '<span style="color:#999">—</span>';
  const diff = prev - curr;
  if (Math.abs(diff) < 0.5) return '<span style="color:#999">→</span>';
  if (diff > 0) return `<span style="color:#21c47b;font-weight:700">▲ ${diff.toFixed(1)}</span>`;
  return `<span style="color:#e74c3c;font-weight:700">▼ ${Math.abs(diff).toFixed(1)}</span>`;
}

function posColor(v) {
  if (!v) return '#ddd';
  if (v <= 3)  return '#21c47b';
  if (v <= 10) return '#f39c12';
  return '#94a3b8';
}

function deltaHtml(curr, prev, invert = false) {
  if (!curr || !prev || prev === 0) return '';
  const d = invert
    ? Math.round(((prev - curr) / prev) * 100)
    : Math.round(((curr - prev) / prev) * 100);
  if (d === 0) return '';
  const color = d > 0 ? '#21c47b' : '#e74c3c';
  const sign  = d > 0 ? '+' : '';
  return `<span style="font-size:10px;color:${color};margin-left:4px">${sign}${d}%</span>`;
}

// ── Fetch Supabase ────────────────────────────────────────────────────────────

async function fetchTargetQueries(start, end) {
  const { data, error } = await supabase
    .from('gsc_daily_queries')
    .select('query, clicks, impressions, position')
    .gte('date', start).lte('date', end)
    .in('query', TARGET_QUERIES);
  if (error) throw new Error(`gsc_daily_queries: ${error.message}`);

  const map = {};
  for (const q of TARGET_QUERIES) map[q] = { clicks: 0, impressions: 0, posSum: 0, posCount: 0 };
  for (const r of (data || [])) {
    if (!map[r.query]) continue;
    map[r.query].clicks      += r.clicks;
    map[r.query].impressions += r.impressions;
    if (r.position > 0) { map[r.query].posSum += r.position * r.impressions; map[r.query].posCount += r.impressions; }
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
    .gte('date', start).lte('date', end);
  if (error) throw new Error(`gsc_daily_queries discovery: ${error.message}`);

  const targetSet = new Set(TARGET_QUERIES);
  const map = {};
  for (const r of (data || [])) {
    if (targetSet.has(r.query)) continue;
    if (!map[r.query]) map[r.query] = { clicks: 0, impressions: 0, posSum: 0, posCount: 0 };
    map[r.query].clicks      += r.clicks;
    map[r.query].impressions += r.impressions;
    if (r.position > 0) { map[r.query].posSum += r.position * r.impressions; map[r.query].posCount += r.impressions; }
  }
  return Object.entries(map).map(([query, r]) => ({
    query,
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

const PAGE_BREAK = `style="page-break-before:always;break-before:page"`;

function card(label, value, delta = '') {
  return `
    <td align="center" width="25%" style="padding:4px">
      <div style="background:#f8f9fa;border-radius:8px;padding:12px 6px;border-top:3px solid #21c47b">
        <div style="font-size:22px;font-weight:700;color:#1a1a1a">${value}${delta}</div>
        <div style="font-size:10px;color:#888;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px">${label}</div>
      </div>
    </td>`;
}

function pageHeader(tag, title, subtitle, note) {
  return `
    <tr>
      <td style="background:linear-gradient(135deg,#0d1f2d 0%,#1a3a4a 100%);padding:22px 28px">
        <div style="font-size:10px;color:#21c47b;font-weight:600;letter-spacing:1px;text-transform:uppercase">${tag}</div>
        <div style="font-size:19px;font-weight:700;color:#fff;margin-top:3px">${title}</div>
        <div style="font-size:12px;color:#8ab4c4;margin-top:5px">${subtitle}</div>
        ${note ? `<div style="font-size:10px;color:#5a7a8a;margin-top:3px">${note}</div>` : ''}
      </td>
    </tr>`;
}

function pageFooter(range) {
  return `
    <tr>
      <td style="background:#f8f9fa;padding:14px 28px;border-top:1px solid #eee">
        <p style="margin:0;font-size:10px;color:#aaa">
          Google Search Console — karimsaari.com · ${frDateRange(range.start, range.end)} · <a href="https://karimsaari.com/home" style="color:#21c47b;text-decoration:none">karimsaari.com</a>
        </p>
      </td>
    </tr>`;
}

function buildHtml({ currData, prevData, currRange, prevRange, generatedAt, discoveryData }) {

  // ── KPIs ──
  const totalImpr   = currData.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = currData.reduce((s, r) => s + r.clicks, 0);
  const prevImpr    = prevData.reduce((s, r) => s + r.impressions, 0);
  const prevClicks  = prevData.reduce((s, r) => s + r.clicks, 0);
  const inTop3      = currData.filter(r => r.position && r.position <= 3).length;
  const inTop10     = currData.filter(r => r.position && r.position <= 10).length;
  const prevTop3    = prevData.filter(r => r.position && r.position <= 3).length;
  const prevTop10   = prevData.filter(r => r.position && r.position <= 10).length;
  const avgPos      = (() => { const d = currData.filter(r => r.position); return d.length ? d.reduce((s, r) => s + r.position, 0) / d.length : null; })();
  const prevAvgPos  = (() => { const d = prevData.filter(r => r.position); return d.length ? d.reduce((s, r) => s + r.position, 0) / d.length : null; })();

  // ── Chart 1 : Positions (barres horizontales, meilleure pos = barre plus longue) ──
  const posData = currData.filter(r => r.position).sort((a, b) => a.position - b.position);
  const maxBarPos = 20;
  const posRows = currData.map(r => {
    const p    = prevData.find(x => x.query === r.query);
    const barW = r.position ? Math.max(4, Math.round((maxBarPos - r.position) / (maxBarPos - 1) * 100)) : 0;
    const prevBarW = p?.position ? Math.max(4, Math.round((maxBarPos - p.position) / (maxBarPos - 1) * 100)) : 0;
    const pc   = posColor(r.position);
    const trend = posTrend(r.position, p?.position);
    const label = r.query.length > 32 ? r.query.slice(0, 30) + '…' : r.query;
    return `
      <tr>
        <td style="padding:5px 10px 5px 0;font-size:11px;color:#444;width:220px;white-space:nowrap">${label}</td>
        <td style="padding:5px 0;width:100%">
          <div style="position:relative;height:14px;background:#f0f0f0;border-radius:3px;overflow:hidden">
            ${p?.position ? `<div style="position:absolute;top:0;left:0;height:14px;width:${prevBarW}%;background:rgba(148,163,184,0.3);border-radius:3px"></div>` : ''}
            ${r.position ? `<div style="position:absolute;top:0;left:0;height:14px;width:${barW}%;background:${pc};border-radius:3px;opacity:0.9"></div>` : ''}
          </div>
        </td>
        <td style="padding:5px 0 5px 10px;font-size:12px;font-weight:700;color:${pc};width:32px;text-align:right">${posStr(r.position)}</td>
        <td style="padding:5px 0 5px 8px;font-size:11px;width:60px;text-align:left">${trend}</td>
      </tr>`;
  }).join('');

  // ── Chart 2 : Impressions (barres horizontales) ──
  const maxImpr = Math.max(...currData.map(r => r.impressions), 1);
  const imprRows = [...currData].sort((a, b) => b.impressions - a.impressions).map(r => {
    const p     = prevData.find(x => x.query === r.query);
    const barW  = Math.max(r.impressions > 0 ? 2 : 0, Math.round(r.impressions / maxImpr * 100));
    const prevBW = p ? Math.max(p.impressions > 0 ? 2 : 0, Math.round(p.impressions / maxImpr * 100)) : 0;
    const label = r.query.length > 32 ? r.query.slice(0, 30) + '…' : r.query;
    return `
      <tr>
        <td style="padding:5px 10px 5px 0;font-size:11px;color:#444;width:220px;white-space:nowrap">${label}</td>
        <td style="padding:5px 0;width:100%">
          <div style="position:relative;height:14px;background:#f0f0f0;border-radius:3px;overflow:hidden">
            ${prevBW > 0 ? `<div style="position:absolute;top:0;left:0;height:14px;width:${prevBW}%;background:rgba(33,196,123,0.2);border-radius:3px"></div>` : ''}
            ${barW > 0 ? `<div style="position:absolute;top:0;left:0;height:14px;width:${barW}%;background:#21c47b;border-radius:3px;opacity:0.85"></div>` : ''}
          </div>
        </td>
        <td style="padding:5px 0 5px 10px;font-size:12px;font-weight:700;color:${r.impressions > 0 ? '#1a1a1a' : '#bbb'};width:32px;text-align:right">${r.impressions}</td>
        <td style="padding:5px 0 5px 8px;font-size:10px;color:#aaa;width:60px">${p ? deltaHtml(r.impressions, p.impressions) : ''}</td>
      </tr>`;
  }).join('');

  // ── Table requêtes cibles (page 2) ──
  const targetRows = TARGET_QUERIES.map(q => {
    const c = currData.find(r => r.query === q) || { clicks: 0, impressions: 0, ctr: 0, position: null };
    const p = prevData.find(r => r.query === q) || { clicks: 0, impressions: 0, ctr: 0, position: null };
    const pc = posColor(c.position);
    return `
      <tr style="border-bottom:1px solid #f0f0f0;${c.impressions === 0 ? 'opacity:0.45' : ''}">
        <td style="padding:9px 12px 9px 0;font-size:12px;color:#333">${q}</td>
        <td style="padding:9px 8px;text-align:center">
          <span style="font-size:18px;font-weight:700;color:${pc}">${posStr(c.position)}</span><br>
          <span style="font-size:10px;color:#bbb">${posStr(p.position)} préc.</span>
        </td>
        <td style="padding:9px 8px;text-align:center;font-size:13px">${posTrend(c.position, p.position)}</td>
        <td style="padding:9px 8px;text-align:right;font-size:12px;font-weight:600;color:${c.impressions > 0 ? '#333' : '#ccc'}">${c.impressions}</td>
        <td style="padding:9px 8px;text-align:right;font-size:12px;color:${c.clicks > 0 ? '#21c47b' : '#ccc'};font-weight:${c.clicks > 0 ? '700' : '400'}">${c.clicks}</td>
        <td style="padding:9px 0;text-align:right;font-size:11px;color:#888">${pctStr(c.ctr)}</td>
      </tr>`;
  }).join('');

  // ── Table découvertes (page 3) ──
  const discRows = discoveryData.length === 0
    ? `<tr><td colspan="5" style="padding:20px 0;font-size:12px;color:#bbb;font-style:italic">Aucune donnée sur cette période</td></tr>`
    : discoveryData.map(r => {
        const pc = posColor(r.position);
        const isOpp = r.position && r.position >= 8 && r.position <= 20 && r.impressions >= 5;
        return `
          <tr style="border-bottom:1px solid #f0f0f0;${isOpp ? 'background:#fffdf4' : ''}">
            <td style="padding:8px 12px 8px 0;font-size:12px;color:#333">
              ${isOpp ? '<span style="font-size:9px;background:#fff3cd;color:#856404;border-radius:3px;padding:1px 5px;margin-right:5px;font-weight:600">OPPORT.</span>' : ''}${r.query}
            </td>
            <td style="padding:8px 8px;text-align:center;font-size:15px;font-weight:700;color:${pc}">${posStr(r.position)}</td>
            <td style="padding:8px 8px;text-align:right;font-size:12px;font-weight:600">${r.impressions}</td>
            <td style="padding:8px 8px;text-align:right;font-size:12px;color:${r.clicks > 0 ? '#21c47b' : '#bbb'};font-weight:${r.clicks > 0 ? '700' : '400'}">${r.clicks}</td>
            <td style="padding:8px 0;text-align:right;font-size:11px;color:#888">${pctStr(r.ctr)}</td>
          </tr>`;
      }).join('');

  const th = (label, align = 'left') => `<th style="padding:5px 8px 5px 0;font-size:9px;text-transform:uppercase;color:#999;font-weight:600;text-align:${align};white-space:nowrap">${label}</th>`;
  const section = t => `<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#21c47b;margin:20px 0 8px;padding-bottom:4px;border-bottom:1px solid #e8f8f0">${t}</div>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8">
<style>
  * { box-sizing: border-box; }
  body { margin:0; padding:0; background:#f4f4f4; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
  .page { padding:20px 16px; background:#f4f4f4; }
  .card { max-width:640px; width:100%; margin:0 auto; background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
  .page-break { page-break-before:always; break-before:page; height:0; overflow:hidden; }
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 1 — DASHBOARD
════════════════════════════════════════════════════════════════ -->
<div class="page">
<div class="card">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0d1f2d 0%,#1a3a4a 100%);padding:22px 28px;border-radius:12px 12px 0 0">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td>
        <div style="font-size:10px;color:#21c47b;font-weight:600;letter-spacing:1px;text-transform:uppercase">Dark Massilia — GSC · Page 1/3</div>
        <div style="font-size:19px;font-weight:700;color:#fff;margin-top:3px">Dashboard Requêtes Cibles</div>
        <div style="font-size:12px;color:#8ab4c4;margin-top:5px">30 jours glissants · ${frDateRange(currRange.start, currRange.end)}</div>
        <div style="font-size:10px;color:#5a7a8a;margin-top:3px">Généré le ${generatedAt} · vs ${frDateRange(prevRange.start, prevRange.end)}</div>
      </td>
      <td align="right" valign="top">
        <table cellpadding="0" cellspacing="4"><tr>
          <td align="center" style="background:rgba(33,196,123,0.15);border:1px solid rgba(33,196,123,0.3);border-radius:8px;padding:8px 14px;min-width:56px">
            <div style="font-size:20px;font-weight:700;color:#21c47b">${inTop3}<span style="font-size:11px;color:#5a9a7a;margin-left:2px">${inTop3 !== prevTop3 ? (inTop3 > prevTop3 ? '▲' : '▼') : ''}</span></div>
            <div style="font-size:10px;color:#8ab4c4">Top 3</div>
          </td>
          <td align="center" style="background:rgba(243,156,18,0.12);border:1px solid rgba(243,156,18,0.3);border-radius:8px;padding:8px 14px;min-width:56px">
            <div style="font-size:20px;font-weight:700;color:#f39c12">${inTop10}<span style="font-size:11px;color:#b87a10;margin-left:2px">${inTop10 !== prevTop10 ? (inTop10 > prevTop10 ? '▲' : '▼') : ''}</span></div>
            <div style="font-size:10px;color:#8ab4c4">Top 10</div>
          </td>
        </tr></table>
      </td>
    </tr></table>
  </div>

  <!-- KPIs -->
  <div style="padding:16px 28px 0">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      ${card('Impressions', totalImpr, deltaHtml(totalImpr, prevImpr))}
      ${card('Clics', totalClicks, deltaHtml(totalClicks, prevClicks))}
      ${card('Position moy.', posStr(avgPos), avgPos && prevAvgPos ? deltaHtml(prevAvgPos, avgPos) : '')}
      ${card('Requêtes actives', currData.filter(r => r.impressions > 0).length + '/8', '')}
    </tr></table>
  </div>

  <div style="padding:4px 28px 20px">

    <!-- Légende charts -->
    <div style="margin-top:16px;font-size:10px;color:#aaa;text-align:right">
      <span style="display:inline-block;width:28px;height:6px;background:#21c47b;border-radius:2px;vertical-align:middle;opacity:0.85"></span> Période actuelle &nbsp;
      <span style="display:inline-block;width:28px;height:6px;background:rgba(148,163,184,0.4);border-radius:2px;vertical-align:middle"></span> Période précédente
    </div>

    <!-- Chart positions -->
    ${section('Positions — meilleure position = barre plus longue')}
    <table width="100%" cellpadding="0" cellspacing="0">
      <tbody>${posRows}</tbody>
    </table>
    <div style="margin-top:6px;font-size:9px;color:#ccc">
      <span style="color:#21c47b;font-weight:700">■</span> Top 3 &nbsp;
      <span style="color:#f39c12;font-weight:700">■</span> Top 10 &nbsp;
      <span style="color:#94a3b8;font-weight:700">■</span> Hors top 10 &nbsp;·&nbsp; ▲▼ évolution vs période précédente
    </div>

    <!-- Chart impressions -->
    ${section('Impressions 30 jours — classé par volume')}
    <table width="100%" cellpadding="0" cellspacing="0">
      <tbody>${imprRows}</tbody>
    </table>

  </div>

  <!-- Footer -->
  <div style="background:#f8f9fa;padding:12px 28px;border-top:1px solid #eee">
    <p style="margin:0;font-size:10px;color:#aaa">Google Search Console — karimsaari.com · ${frDateRange(currRange.start, currRange.end)} · <a href="https://karimsaari.com/home" style="color:#21c47b;text-decoration:none">karimsaari.com</a></p>
  </div>

</div>
</div>

<div class="page-break"></div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 2 — TABLEAU REQUÊTES CIBLES
════════════════════════════════════════════════════════════════ -->
<div class="page">
<div class="card">

  <div style="background:linear-gradient(135deg,#0d1f2d 0%,#1a3a4a 100%);padding:22px 28px;border-radius:12px 12px 0 0">
    <div style="font-size:10px;color:#21c47b;font-weight:600;letter-spacing:1px;text-transform:uppercase">Dark Massilia — GSC · Page 2/3</div>
    <div style="font-size:19px;font-weight:700;color:#fff;margin-top:3px">Suivi Requêtes Cibles — Détail</div>
    <div style="font-size:12px;color:#8ab4c4;margin-top:5px">${frDateRange(currRange.start, currRange.end)} · vs ${frDateRange(prevRange.start, prevRange.end)}</div>
  </div>

  <div style="padding:20px 28px">
    <table width="100%" cellpadding="0" cellspacing="0">
      <thead>
        <tr style="border-bottom:2px solid #f0f0f0">
          ${th('Requête')}${th('Position', 'center')}${th('Évol.', 'center')}${th('Impr.', 'right')}${th('Clics', 'right')}${th('CTR', 'right')}
        </tr>
      </thead>
      <tbody>${targetRows}</tbody>
    </table>

    <div style="margin-top:16px;padding:10px 14px;background:#f8f9fa;border-radius:8px;border-left:3px solid #21c47b">
      <div style="font-size:10px;color:#777;line-height:1.8">
        <strong style="color:#21c47b">▲</strong> Position améliorée &nbsp;·&nbsp;
        <strong style="color:#e74c3c">▼</strong> Dégradée &nbsp;·&nbsp;
        <strong style="color:#999">→</strong> Stable (&lt;0.5 pt) &nbsp;·&nbsp;
        <strong style="color:#999">—</strong> Pas de données sur la période<br>
        Position : <span style="color:#21c47b;font-weight:700">■</span> Top 3 &nbsp;
        <span style="color:#f39c12;font-weight:700">■</span> Top 10 &nbsp;
        <span style="color:#94a3b8;font-weight:700">■</span> Hors top 10
      </div>
    </div>
  </div>

  <div style="background:#f8f9fa;padding:12px 28px;border-top:1px solid #eee">
    <p style="margin:0;font-size:10px;color:#aaa">Google Search Console — karimsaari.com · ${frDateRange(currRange.start, currRange.end)} · <a href="https://karimsaari.com/home" style="color:#21c47b;text-decoration:none">karimsaari.com</a></p>
  </div>

</div>
</div>

<div class="page-break"></div>

<!-- ══════════════════════════════════════════════════════════════
     PAGE 3 — REQUÊTES DÉCOUVERTES
════════════════════════════════════════════════════════════════ -->
<div class="page">
<div class="card">

  <div style="background:linear-gradient(135deg,#0d1f2d 0%,#1a3a4a 100%);padding:22px 28px;border-radius:12px 12px 0 0">
    <div style="font-size:10px;color:#21c47b;font-weight:600;letter-spacing:1px;text-transform:uppercase">Dark Massilia — GSC · Page 3/3</div>
    <div style="font-size:19px;font-weight:700;color:#fff;margin-top:3px">Requêtes Découvertes</div>
    <div style="font-size:12px;color:#8ab4c4;margin-top:5px">${frDateRange(currRange.start, currRange.end)} · Top 20 hors requêtes cibles</div>
    <div style="font-size:10px;color:#5a7a8a;margin-top:3px">Requêtes où Google t'affiche sans que tu les surveilles</div>
  </div>

  <div style="padding:20px 28px">
    <table width="100%" cellpadding="0" cellspacing="0">
      <thead>
        <tr style="border-bottom:2px solid #f0f0f0">
          ${th('Requête')}${th('Position', 'center')}${th('Impr.', 'right')}${th('Clics', 'right')}${th('CTR', 'right')}
        </tr>
      </thead>
      <tbody>${discRows}</tbody>
    </table>

    <div style="margin-top:16px;padding:10px 14px;background:#fffdf4;border-radius:8px;border-left:3px solid #f39c12">
      <div style="font-size:10px;color:#856404;line-height:1.7">
        <strong>OPPORT.</strong> = position 8–20 avec ≥5 impressions · à portée du top 10 avec une page dédiée ou un renforcement du contenu existant.
      </div>
    </div>
  </div>

  <div style="background:#f8f9fa;padding:12px 28px;border-top:1px solid #eee">
    <p style="margin:0;font-size:10px;color:#aaa">Google Search Console — karimsaari.com · ${frDateRange(currRange.start, currRange.end)} · <a href="https://karimsaari.com/home" style="color:#21c47b;text-decoration:none">karimsaari.com</a></p>
  </div>

</div>
</div>

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
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
    preferCSSPageSize: false,
  });
  await browser.close();
  return pdf;
}

// ── Brevo ─────────────────────────────────────────────────────────────────────

async function sendEmail(html, currRange, pdfBuffer) {
  const subject = `🎯 Requêtes cibles 30j — ${frDateRange(currRange.start, currRange.end)}`;
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
  console.log('🎯 Suivi requêtes cibles — 30 jours glissants...\n');

  const currRange = rollingRange(0);
  const prevRange = rollingRange(1);
  console.log(`📅 Période courante  : ${currRange.start} → ${currRange.end}`);
  console.log(`📅 Période précédente: ${prevRange.start} → ${prevRange.end}\n`);

  const [currData, prevData, discoveryData] = await Promise.all([
    fetchTargetQueries(currRange.start, currRange.end),
    fetchTargetQueries(prevRange.start, prevRange.end),
    fetchDiscoveryQueries(currRange.start, currRange.end),
  ]);

  console.log(`  ${discoveryData.length} requêtes découvertes sur la période`);
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
