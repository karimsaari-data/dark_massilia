/**
 * gsc-28day-report.js — Rapport GSC 28 jours glissants via Supabase → Brevo
 *
 * Agrège les 28 derniers jours et compare aux 28 jours précédents :
 *   · KPIs globaux avec delta J-28 vs J-56
 *   · Top 20 requêtes (agrégées sur 28j)
 *   · Top 10 pages avec top 3 requêtes associées
 *   · Breakdown pays & appareils
 *   · Graphique 28 jours
 *   · Réussites (progression vers le prochain palier)
 *
 * Usage : npm run gsc-28day-report
 * Variables : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, BREVO_API_KEY
 */

import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

const SUPABASE_URL  = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TO      = 'email@karimsaari.com';
const BREVO_FROM    = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant'); process.exit(1); }
if (!BREVO_API_KEY)                 { console.error('❌ BREVO_API_KEY manquant'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoDate(d) { return d.toISOString().slice(0, 10); }

function dateRange(daysAgo, windowDays) {
  const end   = new Date(Date.now() - daysAgo * 86400000);
  const start = new Date(end.getTime() - (windowDays - 1) * 86400000);
  return { start: isoDate(start), end: isoDate(end) };
}

const COUNTRY_NAMES = {
  fra: 'France', bel: 'Belgique', che: 'Suisse', can: 'Canada',
  deu: 'Allemagne', gbr: 'Royaume-Uni', usa: 'États-Unis', esp: 'Espagne',
  ita: 'Italie', prt: 'Portugal', nld: 'Pays-Bas', mar: 'Maroc',
  tun: 'Tunisie', dza: 'Algérie', lux: 'Luxembourg', bra: 'Brésil',
  mex: 'Mexique', reu: 'La Réunion', aus: 'Australie', jpn: 'Japon',
};
function countryLabel(code) { return COUNTRY_NAMES[code?.toLowerCase()] || (code || '').toUpperCase(); }
const DEVICE_LABELS = { mobile: '📱 Mobile', desktop: '🖥️ Desktop', tablet: '📲 Tablette' };
function deviceLabel(d) { return DEVICE_LABELS[d?.toLowerCase()] || d; }
function pageLabel(url) { return (url || '').replace('https://karimsaari.com', '') || '/'; }
function pct(v) { if (v == null || isNaN(v)) return '—'; return (v * 100).toFixed(1) + '%'; }
function pos(v) { if (v == null || isNaN(v) || v === 0) return '—'; return parseFloat(v).toFixed(1); }
function shortDate(s) {
  const d = new Date(s + 'T12:00:00Z');
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}
function frDateRange(start, end) {
  const fmt = s => new Date(s + 'T12:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  return `${fmt(start)} – ${fmt(end)}`;
}
function delta(curr, prev) {
  if (!prev || prev === 0) return null;
  return Math.round(((curr - prev) / prev) * 100);
}
function deltaHtml(d) {
  if (d === null) return '';
  const color = d > 0 ? '#21c47b' : d < 0 ? '#e74c3c' : '#999';
  const sign  = d > 0 ? '+' : '';
  return `<span style="font-size:10px;color:${color};margin-left:4px">${sign}${d}%</span>`;
}

// ── Paliers Réussites ─────────────────────────────────────────────────────────
const MILESTONES = [10, 25, 50, 100, 120, 150, 200, 300, 500, 750, 1000];
function getMilestone(total) {
  const next = MILESTONES.find(m => m > total) || MILESTONES[MILESTONES.length - 1];
  const pct  = Math.min(100, Math.round((total / next) * 100));
  return { total, next, pct };
}

// ── Fetch Supabase ────────────────────────────────────────────────────────────

async function fetchDailyRows(start, end) {
  const { data, error } = await supabase
    .from('gsc_daily')
    .select('date, clicks, impressions, ctr, position')
    .gte('date', start).lte('date', end)
    .order('date', { ascending: true });
  if (error) throw new Error(`gsc_daily: ${error.message}`);
  return data || [];
}

async function fetchQueries(start, end) {
  const { data, error } = await supabase
    .from('gsc_daily_queries')
    .select('query, clicks, impressions, ctr, position')
    .gte('date', start).lte('date', end);
  if (error) throw new Error(`gsc_daily_queries: ${error.message}`);
  // Agréger par requête
  const map = {};
  for (const r of (data || [])) {
    if (!map[r.query]) map[r.query] = { query: r.query, clicks: 0, impressions: 0, posSum: 0, count: 0 };
    map[r.query].clicks      += r.clicks;
    map[r.query].impressions += r.impressions;
    map[r.query].posSum      += r.position * r.impressions;
    map[r.query].count       += r.impressions;
  }
  return Object.values(map)
    .map(r => ({ ...r, ctr: r.impressions > 0 ? r.clicks / r.impressions : 0, position: r.count > 0 ? r.posSum / r.count : 0 }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);
}

async function fetchPages(start, end) {
  const { data, error } = await supabase
    .from('gsc_daily_pages')
    .select('page, clicks, impressions, ctr, position')
    .gte('date', start).lte('date', end);
  if (error) throw new Error(`gsc_daily_pages: ${error.message}`);
  const map = {};
  for (const r of (data || [])) {
    if (!map[r.page]) map[r.page] = { page: r.page, clicks: 0, impressions: 0, posSum: 0, count: 0 };
    map[r.page].clicks      += r.clicks;
    map[r.page].impressions += r.impressions;
    map[r.page].posSum      += r.position * r.impressions;
    map[r.page].count       += r.impressions;
  }
  return Object.values(map)
    .map(r => ({ ...r, ctr: r.impressions > 0 ? r.clicks / r.impressions : 0, position: r.count > 0 ? r.posSum / r.count : 0 }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);
}

async function fetchPageQueries(start, end) {
  const { data, error } = await supabase
    .from('gsc_daily_page_queries')
    .select('page, query, clicks, impressions, position')
    .gte('date', start).lte('date', end);
  if (error) throw new Error(`gsc_daily_page_queries: ${error.message}`);
  const map = {};
  for (const r of (data || [])) {
    const key = `${r.page}|||${r.query}`;
    if (!map[key]) map[key] = { page: r.page, query: r.query, clicks: 0, impressions: 0, posSum: 0, count: 0 };
    map[key].clicks      += r.clicks;
    map[key].impressions += r.impressions;
    map[key].posSum      += r.position * r.impressions;
    map[key].count       += r.impressions;
  }
  // Grouper par page → top 3 requêtes par impressions
  const byPage = {};
  for (const r of Object.values(map)) {
    if (!byPage[r.page]) byPage[r.page] = [];
    byPage[r.page].push({ ...r, position: r.count > 0 ? r.posSum / r.count : 0, ctr: r.impressions > 0 ? r.clicks / r.impressions : 0 });
  }
  for (const page of Object.keys(byPage)) {
    byPage[page] = byPage[page].sort((a, b) => b.impressions - a.impressions).slice(0, 3);
  }
  return byPage;
}

async function fetchCountries(start, end) {
  const { data, error } = await supabase
    .from('gsc_daily_countries')
    .select('country, clicks, impressions')
    .gte('date', start).lte('date', end);
  if (error) throw new Error(`gsc_daily_countries: ${error.message}`);
  const map = {};
  for (const r of (data || [])) {
    if (!map[r.country]) map[r.country] = { country: r.country, clicks: 0, impressions: 0 };
    map[r.country].clicks      += r.clicks;
    map[r.country].impressions += r.impressions;
  }
  return Object.values(map).sort((a, b) => b.impressions - a.impressions).slice(0, 8);
}

async function fetchDevices(start, end) {
  const { data, error } = await supabase
    .from('gsc_daily_devices')
    .select('device, clicks, impressions')
    .gte('date', start).lte('date', end);
  if (error) throw new Error(`gsc_daily_devices: ${error.message}`);
  const map = {};
  for (const r of (data || [])) {
    if (!map[r.device]) map[r.device] = { device: r.device, clicks: 0, impressions: 0 };
    map[r.device].clicks      += r.clicks;
    map[r.device].impressions += r.impressions;
  }
  return Object.values(map).sort((a, b) => b.impressions - a.impressions);
}

// ── HTML ──────────────────────────────────────────────────────────────────────

function buildHtml({ curr, prev, days, queries, pages, pageQueries, countries, devices, range, generatedAt }) {

  // KPIs agrégés
  const totalClicks = curr.reduce((s, d) => s + d.clicks, 0);
  const totalImpr   = curr.reduce((s, d) => s + d.impressions, 0);
  const avgCtr      = totalImpr > 0 ? totalClicks / totalImpr : 0;
  const avgPos      = curr.filter(d => d.position > 0).reduce((s, d, _, a) => s + d.position / a.length, 0);

  const prevClicks  = prev.reduce((s, d) => s + d.clicks, 0);
  const prevImpr    = prev.reduce((s, d) => s + d.impressions, 0);
  const prevCtr     = prevImpr > 0 ? prevClicks / prevImpr : 0;
  const prevPos     = prev.filter(d => d.position > 0).reduce((s, d, _, a) => s + d.position / a.length, 0);

  const ms = getMilestone(totalClicks);

  // ── Graphique 4 semaines (agrégation hebdomadaire) ──
  const weeks = [0, 1, 2, 3].map(i => {
    const chunk = days.slice(i * 7, (i + 1) * 7);
    return {
      clicks:      chunk.reduce((s, d) => s + d.clicks, 0),
      impressions: chunk.reduce((s, d) => s + d.impressions, 0),
      label:       chunk.length ? `S${i + 1}` : '',
      dateStart:   chunk[0]?.date || '',
      dateEnd:     chunk[chunk.length - 1]?.date || '',
    };
  }).filter(w => w.dateStart);
  const maxWImpr   = Math.max(...weeks.map(w => w.impressions), 1);
  const maxWClicks = Math.max(...weeks.map(w => w.clicks), 1);
  const chartCols = weeks.map((w, i) => {
    const isLast  = i === weeks.length - 1;
    const hImpr   = Math.max(8, Math.round((w.impressions / maxWImpr) * 100));
    const hClicks = Math.max(w.clicks > 0 ? 6 : 0, Math.round((w.clicks / maxWClicks) * 100));
    return `
      <td align="center" valign="bottom" width="25%" style="padding:0 8px">
        <div style="height:108px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center">
          <div style="width:48px;height:${hImpr}px;background:${isLast ? 'rgba(33,196,123,0.4)' : 'rgba(33,196,123,0.15)'};border-radius:4px 4px 0 0;position:relative">
            ${w.clicks > 0 ? `<div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:18px;height:${hClicks}px;background:#21c47b;border-radius:3px 3px 0 0"></div>` : ''}
          </div>
        </div>
        <div style="font-size:12px;font-weight:700;color:${isLast ? '#21c47b' : '#555'};margin-top:4px">${w.clicks}</div>
        <div style="font-size:10px;color:#999;margin-top:2px">${w.label}</div>
        <div style="font-size:9px;color:#ccc;margin-top:1px;white-space:nowrap">${shortDate(w.dateStart)}–${shortDate(w.dateEnd)}</div>
      </td>`;
  }).join('');

  // ── Helpers HTML ──
  function section(title, content) {
    return `<div style="margin-top:24px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#21c47b;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e8f8f0">${title}</div>
      ${content}
    </div>`;
  }

  function tableHead(headers) {
    return `<thead><tr>${headers.map(h => `<th style="padding:4px 8px 4px 0;font-size:10px;text-transform:uppercase;color:#999;font-weight:600;text-align:${h.align || 'left'};white-space:nowrap">${h.label}</th>`).join('')}</tr></thead>`;
  }

  // ── KPI bar ──
  const kpiBar = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">
      <tr>
        ${[
          ['Clics', totalClicks, delta(totalClicks, prevClicks)],
          ['Impressions', totalImpr, delta(totalImpr, prevImpr)],
          ['CTR moy.', pct(avgCtr), delta(avgCtr * 100, prevCtr * 100)],
          ['Position moy.', pos(avgPos), avgPos > 0 && prevPos > 0 ? -delta(avgPos, prevPos) : null],
        ].map(([label, value, d]) => `
          <td align="center" width="25%" style="padding:12px 4px">
            <div style="background:#f8f9fa;border-radius:8px;padding:12px 8px;border-top:3px solid #21c47b">
              <div style="font-size:20px;font-weight:700;color:#1a1a1a">${value}${deltaHtml(d)}</div>
              <div style="font-size:11px;color:#666;margin-top:2px">${label}</div>
            </div>
          </td>
        `).join('')}
      </tr>
    </table>`;

  // ── Top requêtes ──
  const queryRows = queries.length === 0
    ? `<tr><td colspan="5" style="color:#999;font-size:12px;padding:8px 0;font-style:italic">Aucune donnée</td></tr>`
    : queries.map(r => `
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:6px 0;font-size:12px;color:#333;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.query}</td>
        <td style="padding:6px 8px;font-size:12px;text-align:right;font-weight:600">${r.clicks}</td>
        <td style="padding:6px 8px;font-size:12px;text-align:right;color:#555">${r.impressions}</td>
        <td style="padding:6px 8px;font-size:12px;text-align:right;color:#555">${pct(r.ctr)}</td>
        <td style="padding:6px 0;font-size:12px;text-align:right;color:#888">${pos(r.position)}</td>
      </tr>`).join('');

  // ── Top pages + requêtes ──
  const pageRowsHtml = pages.length === 0
    ? `<tr><td colspan="5" style="color:#999;font-size:12px;padding:8px 0;font-style:italic">Aucune donnée</td></tr>`
    : pages.map(r => {
        const subQueries = pageQueries[r.page] || [];
        const subRows = subQueries.map(q => `
          <tr style="background:#f9fffe">
            <td style="padding:4px 0 4px 16px;font-size:11px;color:#555;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
              <span style="color:#bbb;margin-right:4px">└</span>${q.query}
            </td>
            <td style="padding:4px 8px;font-size:11px;text-align:right;color:${q.clicks > 0 ? '#21c47b' : '#999'};font-weight:${q.clicks > 0 ? '600' : '400'}">${q.clicks}</td>
            <td style="padding:4px 8px;font-size:11px;text-align:right;color:#999">${q.impressions}</td>
            <td style="padding:4px 8px;font-size:11px;text-align:right;color:#999">${pct(q.ctr)}</td>
            <td style="padding:4px 0;font-size:11px;text-align:right;color:#bbb">${pos(q.position)}</td>
          </tr>`).join('');
        return `
          <tr style="border-bottom:${subQueries.length ? 'none' : '1px solid #f0f0f0'}">
            <td style="padding:6px 0;font-size:11px;color:#0066cc;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${pageLabel(r.page)}</td>
            <td style="padding:6px 8px;font-size:12px;text-align:right;font-weight:600">${r.clicks}</td>
            <td style="padding:6px 8px;font-size:12px;text-align:right;color:#555">${r.impressions}</td>
            <td style="padding:6px 8px;font-size:12px;text-align:right;color:#555">${pct(r.ctr)}</td>
            <td style="padding:6px 0;font-size:12px;text-align:right;color:#888">${pos(r.position)}</td>
          </tr>
          ${subRows}
          ${subQueries.length ? '<tr><td colspan="5" style="border-bottom:1px solid #f0f0f0;padding:0"></td></tr>' : ''}`;
      }).join('');

  // ── Pays ──
  const totalImprCountry = countries.reduce((a, r) => a + r.impressions, 0) || 1;
  const countryRows = countries.map(r => {
    const barW = Math.round((r.impressions / totalImprCountry) * 100);
    return `<tr>
      <td style="padding:5px 0;font-size:12px;width:120px">${countryLabel(r.country)}</td>
      <td style="padding:5px 8px;font-size:12px;text-align:right;font-weight:600;width:40px">${r.clicks}</td>
      <td style="padding:5px 0;font-size:12px;color:#555;width:50px;text-align:right">${r.impressions}</td>
      <td style="padding:5px 0 5px 8px;width:80px">
        <div style="background:#e8f8f0;border-radius:3px;height:6px;width:100%">
          <div style="background:#21c47b;border-radius:3px;height:6px;width:${barW}%"></div>
        </div>
      </td>
    </tr>`;
  }).join('');

  // ── Appareils ──
  const totalImprDevice = devices.reduce((a, r) => a + r.impressions, 0) || 1;
  const deviceRows = devices.map(r => {
    const barW = Math.round((r.impressions / totalImprDevice) * 100);
    return `<tr>
      <td style="padding:5px 0;font-size:12px;width:120px">${deviceLabel(r.device)}</td>
      <td style="padding:5px 8px;font-size:12px;text-align:right;font-weight:600;width:40px">${r.clicks}</td>
      <td style="padding:5px 0;font-size:12px;color:#555;width:50px;text-align:right">${r.impressions}</td>
      <td style="padding:5px 0 5px 8px;width:80px">
        <div style="background:#e8f8f0;border-radius:3px;height:6px;width:100%">
          <div style="background:#21c47b;border-radius:3px;height:6px;width:${barW}%"></div>
        </div>
      </td>
    </tr>`;
  }).join('');

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
                  <div style="font-size:20px;font-weight:700;color:#ffffff;margin-top:4px">Rapport 28 jours glissants</div>
                  <div style="font-size:13px;color:#8ab4c4;margin-top:6px">${frDateRange(range.start, range.end)}</div>
                  <div style="font-size:11px;color:#5a7a8a;margin-top:4px">Généré le ${generatedAt} · comparaison vs période précédente</div>
                </td>
                <td align="right">
                  <div style="background:rgba(33,196,123,0.15);border:1px solid rgba(33,196,123,0.3);border-radius:8px;padding:8px 14px;display:inline-block">
                    <div style="font-size:24px;font-weight:700;color:#21c47b">${totalClicks}${deltaHtml(delta(totalClicks, prevClicks))}</div>
                    <div style="font-size:10px;color:#8ab4c4;text-transform:uppercase;letter-spacing:0.5px">clics 28j</div>
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

            <!-- Réussites -->
            ${section('Réussites — 28 jours glissants', `
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 14px;background:#f8f9fa;border-radius:8px;border-left:3px solid #21c47b">
                    <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:2px">
                      Impact de la recherche Google : ${ms.total} / ${ms.next}
                    </div>
                    <div style="font-size:11px;color:#666;margin-bottom:8px">Générez ${ms.next} clics depuis la recherche Google en 28 jours</div>
                    <div style="background:#e0e0e0;border-radius:4px;height:8px;width:100%">
                      <div style="background:#21c47b;border-radius:4px;height:8px;width:${ms.pct}%"></div>
                    </div>
                    <div style="font-size:10px;color:#999;margin-top:4px;text-align:right">${ms.pct}% vers l'objectif ${ms.next}</div>
                  </td>
                </tr>
              </table>
            `)}

            <!-- Graphique 28j -->
            ${section('Évolution 28 jours', `
              <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:2px solid #eee">
                <tr>${chartCols}</tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px">
                <tr>
                  <td style="font-size:10px;color:#999">
                    <span style="display:inline-block;width:10px;height:10px;background:rgba(33,196,123,0.25);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Impressions
                    &nbsp;
                    <span style="display:inline-block;width:10px;height:10px;background:#21c47b;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Clics
                  </td>
                  <td align="right" style="font-size:10px;color:#bbb">${days.length} jours · max impr./sem. : ${Math.max(...weeks.map(w => w.impressions))}</td>
                </tr>
              </table>
            `)}

            <!-- Top requêtes -->
            ${section('Top requêtes (28j)', `
              <table width="100%" cellpadding="0" cellspacing="0">
                ${tableHead([{ label: 'Requête' }, { label: 'Clics', align: 'right' }, { label: 'Impr.', align: 'right' }, { label: 'CTR', align: 'right' }, { label: 'Pos.', align: 'right' }])}
                <tbody>${queryRows}</tbody>
              </table>
            `)}

            <!-- Top pages -->
            ${section('Top pages (28j)', `
              <table width="100%" cellpadding="0" cellspacing="0">
                ${tableHead([{ label: 'Page' }, { label: 'Clics', align: 'right' }, { label: 'Impr.', align: 'right' }, { label: 'CTR', align: 'right' }, { label: 'Pos.', align: 'right' }])}
                <tbody>${pageRowsHtml}</tbody>
              </table>
            `)}

            <!-- Pays & Appareils -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px">
              <tr>
                <td width="50%" valign="top" style="padding-right:16px">
                  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#21c47b;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e8f8f0">Pays</div>
                  <table width="100%" cellpadding="0" cellspacing="0"><tbody>${countryRows}</tbody></table>
                </td>
                <td width="50%" valign="top">
                  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#21c47b;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e8f8f0">Appareils</div>
                  <table width="100%" cellpadding="0" cellspacing="0"><tbody>${deviceRows}</tbody></table>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fa;padding:16px 28px;border-top:1px solid #eee">
            <p style="margin:0;font-size:11px;color:#999">
              Données Google Search Console — karimsaari.com · Période : ${frDateRange(range.start, range.end)}<br>
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

async function sendEmail(html, range, pdfBuffer) {
  const subject = `📈 GSC 28j — ${frDateRange(range.start, range.end)}`;
  const body = {
    sender: BREVO_FROM,
    to: [{ email: BREVO_TO }],
    subject,
    htmlContent: html,
  };
  if (pdfBuffer) {
    body.attachment = [{ name: `gsc-28j-${range.end}.pdf`, content: Buffer.from(pdfBuffer).toString('base64') }];
  }
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
  console.log('📈 Rapport GSC 28 jours glissants...\n');

  // Fenêtres : J-2 à J-29 (curr) et J-30 à J-57 (prev)
  const curr28 = dateRange(2, 28);
  const prev28 = dateRange(30, 28);
  console.log(`📅 Période courante  : ${curr28.start} → ${curr28.end}`);
  console.log(`📅 Période précédente: ${prev28.start} → ${prev28.end}\n`);

  const [currDays, prevDays, queries, pages, pageQueries, countries, devices] = await Promise.all([
    fetchDailyRows(curr28.start, curr28.end),
    fetchDailyRows(prev28.start, prev28.end),
    fetchQueries(curr28.start, curr28.end),
    fetchPages(curr28.start, curr28.end),
    fetchPageQueries(curr28.start, curr28.end),
    fetchCountries(curr28.start, curr28.end),
    fetchDevices(curr28.start, curr28.end),
  ]);

  const totalClicks = currDays.reduce((s, d) => s + d.clicks, 0);
  const prevClicks  = prevDays.reduce((s, d) => s + d.clicks, 0);
  console.log(`  Clics 28j : ${totalClicks} (vs ${prevClicks} période précédente)`);
  console.log(`  ${queries.length} requêtes, ${pages.length} pages, ${currDays.length} jours de données`);

  const generatedAt = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris',
  });

  const html = buildHtml({ curr: currDays, prev: prevDays, days: currDays, queries, pages, pageQueries, countries, devices, range: curr28, generatedAt });

  console.log('\n📄 Génération PDF...');
  const pdfBuffer = await generatePDF(html);
  console.log(`  ✅ PDF généré (${Math.round(pdfBuffer.length / 1024)} Ko)`);

  console.log('\n📨 Envoi Brevo...');
  await sendEmail(html, curr28, pdfBuffer);

  console.log('\n✅ Rapport 28j envoyé.');
})().catch(e => { console.error('❌', e.message); process.exit(1); });
