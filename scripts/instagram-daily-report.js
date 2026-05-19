/**
 * instagram-daily-report.js — Dashboard Instagram quotidien via Graph API → Brevo
 *
 * KPIs compte : abonnés, reach, profil vues, comptes engagés, clics site
 * Publications : 15 derniers posts — reach, likes, commentaires, partages, enregistrements, taux d'engagement
 * Analyse : top posts, moyennes, répartition par type, évolution
 * PDF joint en pièce jointe via Puppeteer
 *
 * Usage : npm run instagram-report
 * Secrets : INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID, BREVO_API_KEY
 */

import puppeteer from 'puppeteer';

const ACCESS_TOKEN  = process.env.INSTAGRAM_ACCESS_TOKEN;
const ACCOUNT_ID    = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '17841401329930518';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TO      = 'email@karimsaari.com';
const BREVO_FROM    = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };
const GRAPH_BASE    = 'https://graph.facebook.com/v25.0';
const NB_POSTS      = 15;

if (!ACCESS_TOKEN)  { console.error('❌ INSTAGRAM_ACCESS_TOKEN manquant'); process.exit(1); }
if (!BREVO_API_KEY) { console.error('❌ BREVO_API_KEY manquant');           process.exit(1); }

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtNum(n) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('fr-FR');
}
function fmtPct(n) {
  if (n == null || isNaN(n)) return '—';
  return parseFloat(n).toFixed(2) + '%';
}
function frDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
function shortDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}
function shortHour(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
}
function typeLabel(t) {
  return { IMAGE: '📷 Photo', VIDEO: '🎬 Reel/Vidéo', CAROUSEL_ALBUM: '🖼️ Carrousel' }[t] || t;
}
function engagementRate(likes, comments, shares, saved, reach) {
  if (!reach) return 0;
  return ((likes + comments + shares + saved) / reach) * 100;
}
function deltaArrow(curr, prev) {
  if (!prev) return '';
  const d = ((curr - prev) / prev) * 100;
  const color = d >= 0 ? '#16a34a' : '#dc2626';
  const arrow = d >= 0 ? '▲' : '▼';
  return `<span style="color:${color};font-size:11px">${arrow} ${Math.abs(d).toFixed(1)}%</span>`;
}
function rankBadge(rank) {
  return ['🥇', '🥈', '🥉'][rank] || '';
}

// ── Graph API ─────────────────────────────────────────────────────────────────

async function apiGet(path) {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${GRAPH_BASE}/${path}${sep}access_token=${ACCESS_TOKEN}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(`Graph API: ${json.error.message} (${path})`);
  return json;
}

async function fetchProfile() {
  return apiGet(`${ACCOUNT_ID}?fields=name,username,followers_count,follows_count,media_count,biography,website`);
}

async function fetchAccountInsights() {
  const now   = Math.floor(Date.now() / 1000);
  const since = now - 86400;
  const result = {};

  // reach — period=day, values[]
  try {
    const d1 = await apiGet(
      `${ACCOUNT_ID}/insights?metric=reach&period=day&since=${since}&until=${now}`
    );
    for (const item of (d1.data || [])) {
      result[item.name] = (item.values || []).reduce((s, v) => s + (v.value || 0), 0);
    }
  } catch (e) { console.warn('⚠️  reach insights:', e.message); }

  // profile_views, website_clicks, accounts_engaged — metric_type=total_value
  try {
    const d2 = await apiGet(
      `${ACCOUNT_ID}/insights?metric=profile_views,website_clicks,accounts_engaged&metric_type=total_value&period=day&since=${since}&until=${now}`
    );
    for (const item of (d2.data || [])) {
      result[item.name] = item.total_value?.value ?? 0;
    }
  } catch (e) { console.warn('⚠️  engagement insights:', e.message); }

  return result;
}

async function fetchRecentPosts() {
  const data = await apiGet(
    `${ACCOUNT_ID}/media?fields=id,media_type,caption,timestamp,like_count,comments_count,permalink,thumbnail_url,media_url&limit=${NB_POSTS}`
  );
  return data.data || [];
}

async function fetchPostInsights(mediaId, mediaType) {
  const metrics = ['reach', 'shares', 'saved'];
  if (mediaType === 'VIDEO') metrics.push('video_views');
  try {
    const data = await apiGet(`${mediaId}/insights?metric=${metrics.join(',')}`);
    const result = {};
    for (const item of (data.data || [])) {
      result[item.name] = (item.values || [{ value: 0 }])[0].value;
    }
    return result;
  } catch {
    return { reach: 0, shares: 0, saved: 0 };
  }
}

// ── PDF via Puppeteer ─────────────────────────────────────────────────────────

async function generatePDF(html) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 1100 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '8mm', bottom: '10mm', left: '8mm' },
  });
  await browser.close();
  return pdf;
}

// ── Email Brevo ───────────────────────────────────────────────────────────────

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
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ── HTML Builders ─────────────────────────────────────────────────────────────

function kpiCard(label, value, sub = '', color = '#1a1a1a') {
  return `
  <td style="padding:12px 14px;background:#f9f9f9;border:1px solid #e5e5e5;border-radius:6px;vertical-align:top;width:20%">
    <div style="font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">${label}</div>
    <div style="font-size:22px;font-weight:700;color:${color}">${value}</div>
    ${sub ? `<div style="font-size:11px;color:#666;margin-top:3px">${sub}</div>` : ''}
  </td>`;
}

function th(label, align = 'right') {
  return `<th style="padding:7px 10px;background:#1a1a1a;color:#fff;font-size:11px;font-weight:600;text-align:${align};white-space:nowrap">${label}</th>`;
}

function td(val, align = 'right', bold = false, color = '') {
  const w = bold ? 'font-weight:600;' : '';
  const c = color ? `color:${color};` : '';
  return `<td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:12px;text-align:${align};${w}${c}">${val}</td>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  console.log('📸 Récupération des données Instagram…');
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

  // Fetch parallèle
  const [profile, accountInsights, posts] = await Promise.all([
    fetchProfile(),
    fetchAccountInsights(),
    fetchRecentPosts(),
  ]);
  console.log(`✅ Profil : @${profile.username} — ${profile.followers_count} abonnés`);
  console.log(`✅ ${posts.length} posts récupérés`);

  // Insights par post (séquentiel pour éviter rate limit)
  const enrichedPosts = [];
  for (const post of posts) {
    const insights = await fetchPostInsights(post.id, post.media_type);
    const likes    = post.like_count    || 0;
    const comments = post.comments_count || 0;
    const shares   = insights.shares    || 0;
    const saved    = insights.saved     || 0;
    const reach    = insights.reach     || 0;
    const views    = insights.video_views || null;
    const er       = engagementRate(likes, comments, shares, saved, reach);
    const caption  = (post.caption || '').substring(0, 80).replace(/\n/g, ' ');
    enrichedPosts.push({ ...post, likes, comments, shares, saved, reach, views, er, caption });
    process.stdout.write('.');
  }
  console.log('\n✅ Insights posts récupérés');

  // ── Calculs agrégés ────────────────────────────────────────────────────────

  const totalReach    = enrichedPosts.reduce((s, p) => s + p.reach, 0);
  const totalLikes    = enrichedPosts.reduce((s, p) => s + p.likes, 0);
  const totalComments = enrichedPosts.reduce((s, p) => s + p.comments, 0);
  const totalShares   = enrichedPosts.reduce((s, p) => s + p.shares, 0);
  const totalSaved    = enrichedPosts.reduce((s, p) => s + p.saved, 0);
  const avgER         = enrichedPosts.reduce((s, p) => s + p.er, 0) / enrichedPosts.length;

  const byType = {};
  for (const p of enrichedPosts) {
    if (!byType[p.media_type]) byType[p.media_type] = { count: 0, reach: 0, er: 0 };
    byType[p.media_type].count++;
    byType[p.media_type].reach += p.reach;
    byType[p.media_type].er    += p.er;
  }
  for (const t of Object.keys(byType)) {
    byType[t].avgReach = Math.round(byType[t].reach / byType[t].count);
    byType[t].avgER    = byType[t].er / byType[t].count;
  }

  const topByReach   = [...enrichedPosts].sort((a, b) => b.reach   - a.reach).slice(0, 3);
  const topByER      = [...enrichedPosts].sort((a, b) => b.er      - a.er).slice(0, 3);
  const topByShares  = [...enrichedPosts].sort((a, b) => b.shares  - a.shares).slice(0, 3);

  // ── HTML ───────────────────────────────────────────────────────────────────

  const postsRows = enrichedPosts.map((p, i) => {
    const erColor = p.er >= 10 ? '#16a34a' : p.er >= 5 ? '#ca8a04' : '#dc2626';
    const caption = p.caption.length > 60 ? p.caption.substring(0, 60) + '…' : p.caption;
    return `
    <tr style="${i % 2 === 0 ? 'background:#fafafa' : ''}">
      ${td(`<a href="${p.permalink}" style="color:#0070f3;text-decoration:none" target="_blank">${shortDate(p.timestamp)}<br><span style="font-size:10px;color:#999">${shortHour(p.timestamp)}</span></a>`, 'center')}
      ${td(typeLabel(p.media_type), 'left')}
      ${td(`<span style="color:#555;font-size:11px" title="${p.caption.replace(/"/g,"'")}">${caption || '—'}</span>`, 'left')}
      ${td(fmtNum(p.reach), 'right', true)}
      ${td(fmtNum(p.likes))}
      ${td(fmtNum(p.comments))}
      ${td(fmtNum(p.shares))}
      ${td(fmtNum(p.saved))}
      ${p.views != null ? td(fmtNum(p.views)) : td('—')}
      ${td(`<span style="color:${erColor};font-weight:600">${fmtPct(p.er)}</span>`, 'right')}
    </tr>`;
  }).join('');

  const typeRows = Object.entries(byType).map(([type, stats]) => `
    <tr>
      ${td(typeLabel(type), 'left')}
      ${td(fmtNum(stats.count), 'center')}
      ${td(fmtNum(stats.avgReach), 'right', true)}
      ${td(fmtPct(stats.avgER), 'right')}
    </tr>`).join('');

  function postThumb(p) {
    const src = p.thumbnail_url || p.media_url || '';
    if (!src) return '';
    return `<a href="${p.permalink}" target="_blank">
      <img src="${src}" width="56" height="56"
        style="width:56px;height:56px;object-fit:cover;border-radius:6px;display:block;border:1px solid #ddd"
        alt="${(p.caption || '').substring(0, 40).replace(/"/g, "'")}" />
    </a>`;
  }

  const topReachRows = topByReach.map((p, i) => `
    <tr>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;font-size:16px;text-align:center;vertical-align:middle">${rankBadge(i)}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;vertical-align:middle">${postThumb(p)}</td>
      ${td(`<a href="${p.permalink}" style="color:#0070f3;text-decoration:none;font-size:11px">${(p.caption || shortDate(p.timestamp)).substring(0, 70)}…</a><br><span style="color:#999;font-size:10px">${shortDate(p.timestamp)} · ${typeLabel(p.media_type)}</span>`, 'left')}
      ${td(fmtNum(p.reach), 'right', true)}
      ${td(fmtPct(p.er))}
    </tr>`).join('');

  const topSharesRows = topByShares.map((p, i) => `
    <tr>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;font-size:16px;text-align:center;vertical-align:middle">${rankBadge(i)}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;vertical-align:middle">${postThumb(p)}</td>
      ${td(`<a href="${p.permalink}" style="color:#0070f3;text-decoration:none;font-size:11px">${(p.caption || shortDate(p.timestamp)).substring(0, 70)}…</a><br><span style="color:#999;font-size:10px">${shortDate(p.timestamp)} · ${typeLabel(p.media_type)}</span>`, 'left')}
      ${td(fmtNum(p.shares), 'right', true)}
      ${td(fmtNum(p.reach))}
    </tr>`).join('');

  const topERRows = topByER.map((p, i) => `
    <tr>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;font-size:16px;text-align:center;vertical-align:middle">${rankBadge(i)}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;vertical-align:middle">${postThumb(p)}</td>
      ${td(`<a href="${p.permalink}" style="color:#0070f3;text-decoration:none;font-size:11px">${(p.caption || shortDate(p.timestamp)).substring(0, 70)}…</a><br><span style="color:#999;font-size:10px">${shortDate(p.timestamp)} · ${typeLabel(p.media_type)}</span>`, 'left')}
      ${td(fmtPct(p.er), 'right', true)}
      ${td(fmtNum(p.reach))}
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body { margin:0; padding:24px; background:#fff; font-family:Arial,sans-serif; color:#1a1a1a; }
  table { border-collapse:collapse; width:100%; }
  a { color:#0070f3; }
</style>
</head>
<body>
<div style="max-width:760px;margin:0 auto">

  <!-- ══ EN-TÊTE ══ -->
  <table style="margin-bottom:24px">
    <tr>
      <td>
        <h1 style="margin:0 0 4px;font-size:20px;color:#1a1a1a">📸 Dashboard Instagram — @${profile.username}</h1>
        <p style="margin:0;font-size:12px;color:#666">${today} · Dark Massilia / Karim Saari</p>
      </td>
      <td style="text-align:right;vertical-align:top">
        <span style="background:#e7f5ee;color:#16a34a;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:600">
          Instagram Creator
        </span>
      </td>
    </tr>
  </table>

  <!-- ══ KPIs COMPTE ══ -->
  <h2 style="font-size:13px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px">Compte</h2>
  <table style="margin-bottom:24px;border-spacing:8px;border-collapse:separate">
    <tr>
      ${kpiCard('Abonnés', fmtNum(profile.followers_count), `${fmtNum(profile.follows_count)} abonnements`, '#0070f3')}
      ${kpiCard('Publications', fmtNum(profile.media_count), 'total')}
      ${kpiCard('Reach 24h', fmtNum(accountInsights.reach || 0), 'comptes uniques touchés', '#7c3aed')}
      ${kpiCard('Comptes engagés 24h', fmtNum(accountInsights.accounts_engaged || 0), 'interactions reçues', '#16a34a')}
      ${kpiCard('Vues profil 24h', fmtNum(accountInsights.profile_views || 0), `${fmtNum(accountInsights.website_clicks || 0)} clics site web`)}
    </tr>
  </table>

  <!-- ══ KPIs AGRÉGÉS SUR ${NB_POSTS} POSTS ══ -->
  <h2 style="font-size:13px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px">Agrégats — ${NB_POSTS} derniers posts</h2>
  <table style="margin-bottom:24px;border-spacing:8px;border-collapse:separate">
    <tr>
      ${kpiCard('Reach total', fmtNum(totalReach), `moy. ${fmtNum(Math.round(totalReach / NB_POSTS))} / post`)}
      ${kpiCard('Likes total', fmtNum(totalLikes), `moy. ${fmtNum(Math.round(totalLikes / NB_POSTS))} / post`, '#e11d48')}
      ${kpiCard('Commentaires', fmtNum(totalComments), `moy. ${fmtNum(Math.round(totalComments / NB_POSTS))} / post`)}
      ${kpiCard('Partages', fmtNum(totalShares), `moy. ${fmtNum(Math.round(totalShares / NB_POSTS))} / post`, '#ca8a04')}
      ${kpiCard('Taux d\'engagement moy.', fmtPct(avgER), 'likes+com+shares+saved / reach', avgER >= 5 ? '#16a34a' : '#ca8a04')}
    </tr>
  </table>

  <!-- ══ TABLEAU DES PUBLICATIONS ══ -->
  <h2 style="font-size:13px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px">${NB_POSTS} dernières publications</h2>
  <table style="font-size:12px;margin-bottom:28px">
    <thead>
      <tr>
        ${th('Date', 'center')}
        ${th('Type', 'left')}
        ${th('Caption', 'left')}
        ${th('Reach')}
        ${th('Likes')}
        ${th('Comm.')}
        ${th('Partages')}
        ${th('Enreg.')}
        ${th('Vues')}
        ${th('Tx. eng.')}
      </tr>
    </thead>
    <tbody>${postsRows}</tbody>
    <tfoot>
      <tr style="background:#f0f0f0;font-weight:700">
        <td colspan="3" style="padding:7px 10px;font-size:12px">TOTAL / MOYENNE</td>
        ${td(fmtNum(totalReach), 'right', true)}
        ${td(fmtNum(totalLikes), 'right', true)}
        ${td(fmtNum(totalComments), 'right', true)}
        ${td(fmtNum(totalShares), 'right', true)}
        ${td(fmtNum(totalSaved), 'right', true)}
        ${td('—')}
        ${td(fmtPct(avgER), 'right', true, avgER >= 5 ? '#16a34a' : '#ca8a04')}
      </tr>
    </tfoot>
  </table>

  <!-- ══ TOP POSTS PAR REACH ══ -->
  <table style="margin-bottom:28px">
    <tr style="vertical-align:top">
      <td style="width:50%;padding-right:12px">
        <h2 style="font-size:13px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px">🏆 Top reach</h2>
        <table>
          <thead><tr>
            ${th('', 'center')}${th('', 'center')}${th('Post', 'left')}${th('Reach')}${th('Tx. eng.')}
          </tr></thead>
          <tbody>${topReachRows}</tbody>
        </table>
      </td>
      <td style="width:50%;padding-left:12px">
        <h2 style="font-size:13px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px">🔁 Top partages (viralité)</h2>
        <table>
          <thead><tr>
            ${th('', 'center')}${th('', 'center')}${th('Post', 'left')}${th('Partages')}${th('Reach')}
          </tr></thead>
          <tbody>${topSharesRows}</tbody>
        </table>
      </td>
    </tr>
  </table>

  <!-- ══ TOP ENGAGEMENT ══ -->
  <h2 style="font-size:13px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px">💬 Top taux d'engagement</h2>
  <table style="margin-bottom:28px">
    <thead><tr>
      ${th('', 'center')}${th('', 'center')}${th('Post', 'left')}${th('Tx. eng.')}${th('Reach')}
    </tr></thead>
    <tbody>${topERRows}</tbody>
  </table>

  <!-- ══ RÉPARTITION PAR TYPE ══ -->
  <h2 style="font-size:13px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px">📊 Performance par type de contenu</h2>
  <table style="margin-bottom:28px">
    <thead><tr>
      ${th('Type', 'left')}${th('Nb posts', 'center')}${th('Reach moy.')}${th('Tx. eng. moy.')}
    </tr></thead>
    <tbody>${typeRows}</tbody>
  </table>

  <!-- ══ PIED DE PAGE ══ -->
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="font-size:11px;color:#aaa;text-align:center;margin:0">
    Dashboard généré automatiquement · Dark Massilia — Karim Saari · karimsaari.com<br>
    Données : Instagram Graph API v25 · ${NB_POSTS} derniers posts analysés
  </p>

</div>
</body></html>`;

  // ── PDF ────────────────────────────────────────────────────────────────────
  const dateShort = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const subject   = `📸 Instagram Daily — ${dateShort} · ${fmtNum(profile.followers_count)} abonnés · reach 24h: ${fmtNum(accountInsights.reach || 0)}`;
  const pdfName   = `instagram-report-${dateShort}.pdf`;

  let pdfBuffer = null;
  try {
    pdfBuffer = await generatePDF(html);
    console.log(`✅ PDF généré (${Math.round(pdfBuffer.length / 1024)} KB)`);
  } catch (err) {
    console.warn('⚠️  PDF non généré (puppeteer) :', err.message);
  }

  // ── Envoi ──────────────────────────────────────────────────────────────────
  if (BREVO_API_KEY) {
    const result = await sendEmail(html, subject, pdfBuffer, pdfName);
    if (result.messageId) {
      console.log(`✅ Email envoyé → ${BREVO_TO} (messageId: ${result.messageId})${pdfBuffer ? ' + PDF' : ''}`);
    } else {
      console.error('❌ Erreur Brevo :', JSON.stringify(result));
      process.exit(1);
    }
  } else {
    console.log('ℹ️  BREVO_API_KEY non défini — rapport généré sans envoi');
  }
})();
