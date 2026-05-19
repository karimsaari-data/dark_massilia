/**
 * instagram-daily-report.js — Dashboard Instagram + Facebook Page quotidien → Brevo
 *
 * INSTAGRAM : abonnés, reach, profil vues, comptes engagés, clics site,
 *             15 derniers posts (reach, likes, commentaires, partages, enregistrements, taux d'engagement),
 *             top posts (reach / viralité / engagement), répartition par type
 *
 * FACEBOOK PAGE : fans, reach, impressions, engagement,
 *                 10 derniers posts avec stats détaillées, top posts
 *
 * PDF joint en pièce jointe via Puppeteer
 *
 * Usage   : npm run instagram-report
 * Secrets : INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID, BREVO_API_KEY
 */

import puppeteer from 'puppeteer';

const ACCESS_TOKEN  = process.env.INSTAGRAM_ACCESS_TOKEN;
const ACCOUNT_ID    = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '17841401329930518';
const FB_PAGE_ID    = '106714679360900'; // Karim Saari - Dark Massilia - Photographe & Vidéaste Marseille
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TO      = 'email@karimsaari.com';
const BREVO_FROM    = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };
const GRAPH_BASE    = 'https://graph.facebook.com/v25.0';
const NB_POSTS_IG   = 15;
const NB_POSTS_FB   = 10;

if (!ACCESS_TOKEN)  { console.error('❌ INSTAGRAM_ACCESS_TOKEN manquant'); process.exit(1); }
if (!BREVO_API_KEY) { console.error('❌ BREVO_API_KEY manquant');           process.exit(1); }

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtNum  = n  => (n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('fr-FR');
const fmtPct  = n  => (n == null || isNaN(n)) ? '—' : parseFloat(n).toFixed(2) + '%';
const frDate  = iso => new Date(iso).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
const shortDate = iso => new Date(iso).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit' });
const shortHour = iso => new Date(iso).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit', timeZone:'Europe/Paris' });
const typeLabel = t => ({ IMAGE:'📷 Photo', VIDEO:'🎬 Reel/Vidéo', CAROUSEL_ALBUM:'🖼️ Carrousel' }[t] || t);
const rankBadge = i => (['🥇','🥈','🥉'][i] || '');
const engRate   = (l,c,s,sv,r) => r ? ((l+c+s+sv)/r)*100 : 0;

function th(label, align='right') {
  return `<th style="padding:7px 10px;background:#1a1a1a;color:#fff;font-size:11px;font-weight:600;text-align:${align};white-space:nowrap">${label}</th>`;
}
function thFb(label, align='right') {
  return `<th style="padding:7px 10px;background:#1877f2;color:#fff;font-size:11px;font-weight:600;text-align:${align};white-space:nowrap">${label}</th>`;
}
function td(val, align='right', bold=false, color='') {
  return `<td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:12px;text-align:${align};${bold?'font-weight:600;':''}${color?`color:${color};`:''}">${val}</td>`;
}
function kpiCard(label, value, sub='', color='#1a1a1a', bg='#f9f9f9', border='#e5e5e5') {
  return `<td style="padding:12px 14px;background:${bg};border:1px solid ${border};border-radius:6px;vertical-align:top;width:20%">
    <div style="font-size:10px;color:#888;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">${label}</div>
    <div style="font-size:20px;font-weight:700;color:${color}">${value}</div>
    ${sub ? `<div style="font-size:10px;color:#666;margin-top:3px">${sub}</div>` : ''}
  </td>`;
}
function sectionTitle(emoji, title, color='#1a1a1a') {
  return `<h2 style="font-size:13px;border-bottom:2px solid ${color};padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px;color:${color}">${emoji} ${title}</h2>`;
}
function postThumb(url, permalink, caption='') {
  if (!url) return '';
  return `<a href="${permalink}" target="_blank"><img src="${url}" width="52" height="52"
    style="width:52px;height:52px;object-fit:cover;border-radius:5px;display:block;border:1px solid #ddd"
    alt="${caption.substring(0,40).replace(/"/g,"'")}"/></a>`;
}

// ── Graph API ─────────────────────────────────────────────────────────────────

async function apiGet(path, token=ACCESS_TOKEN) {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${GRAPH_BASE}/${path}${sep}access_token=${token}`;
  const res  = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(`Graph API: ${json.error.message}`);
  return json;
}

// ── INSTAGRAM ─────────────────────────────────────────────────────────────────

async function fetchIgProfile() {
  return apiGet(`${ACCOUNT_ID}?fields=name,username,followers_count,follows_count,media_count,biography,website`);
}

async function fetchIgAccountInsights() {
  const now = Math.floor(Date.now()/1000), since = now - 86400;
  const result = {};
  try {
    const d = await apiGet(`${ACCOUNT_ID}/insights?metric=reach&period=day&since=${since}&until=${now}`);
    for (const i of (d.data||[])) result[i.name] = (i.values||[]).reduce((s,v)=>s+(v.value||0),0);
  } catch(e) { console.warn('⚠️  IG reach:', e.message); }
  try {
    const d = await apiGet(`${ACCOUNT_ID}/insights?metric=profile_views,website_clicks,accounts_engaged&metric_type=total_value&period=day&since=${since}&until=${now}`);
    for (const i of (d.data||[])) result[i.name] = i.total_value?.value ?? 0;
  } catch(e) { console.warn('⚠️  IG engagement insights:', e.message); }
  return result;
}

async function fetchIgPosts() {
  const data = await apiGet(`${ACCOUNT_ID}/media?fields=id,media_type,caption,timestamp,like_count,comments_count,permalink,thumbnail_url,media_url&limit=${NB_POSTS_IG}`);
  return data.data || [];
}

async function fetchIgPostInsights(mediaId, mediaType) {
  const metrics = ['reach','shares','saved'];
  if (mediaType === 'VIDEO') metrics.push('video_views');
  try {
    const data = await apiGet(`${mediaId}/insights?metric=${metrics.join(',')}`);
    const r = {};
    for (const i of (data.data||[])) r[i.name] = (i.values||[{value:0}])[0].value;
    return r;
  } catch { return {reach:0,shares:0,saved:0}; }
}

// ── FACEBOOK PAGE ─────────────────────────────────────────────────────────────

async function fetchFbPageToken() {
  const data = await apiGet(`me/accounts?fields=id,access_token`);
  const page = (data.data||[]).find(p => p.id === FB_PAGE_ID);
  if (!page) throw new Error(`Page ${FB_PAGE_ID} introuvable dans me/accounts`);
  return page.access_token;
}

async function fetchFbProfile(pageToken) {
  return apiGet(`${FB_PAGE_ID}?fields=name,fan_count,followers_count,category,about,website,picture`, pageToken);
}

async function fetchFbPageInsights(pageToken) {
  const now   = Math.floor(Date.now()/1000);
  const since = now - 86400;
  const metrics = [
    'page_impressions','page_impressions_unique',
    'page_engaged_users','page_post_engagements',
    'page_views_total','page_fans_adds_unique',
  ].join(',');
  const result = {};
  try {
    const data = await apiGet(`${FB_PAGE_ID}/insights?metric=${metrics}&period=day&since=${since}&until=${now}`, pageToken);
    for (const item of (data.data||[])) {
      const vals = item.values || [];
      result[item.name] = vals.reduce((s,v) => s + (typeof v.value==='number' ? v.value : 0), 0);
    }
  } catch(e) { console.warn('⚠️  FB insights:', e.message); }
  return result;
}

async function fetchFbPosts(pageToken) {
  try {
    const data = await apiGet(
      `${FB_PAGE_ID}/published_posts?fields=id,message,created_time,full_picture,permalink_url,attachments{media_type}&limit=${NB_POSTS_FB}`,
      pageToken
    );
    return data.data || [];
  } catch(e) { console.warn('⚠️  FB posts:', e.message); return []; }
}

async function fetchFbPostInsights(postId, pageToken) {
  const metrics = 'post_impressions_unique,post_engaged_users,post_reactions_by_type_total,post_clicks,post_shares';
  try {
    const data = await apiGet(`${postId}/insights?metric=${metrics}`, pageToken);
    const r = {};
    for (const item of (data.data||[])) {
      if (item.name === 'post_reactions_by_type_total') {
        const v = (item.values||[])[0]?.value || {};
        r.reactions = Object.values(v).reduce((s,n)=>s+n, 0);
      } else {
        r[item.name] = (item.values||[{value:0}])[0].value || 0;
      }
    }
    return r;
  } catch { return {}; }
}

// ── PDF + Email ───────────────────────────────────────────────────────────────

async function generatePDF(html) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width:800, height:1100 });
  await page.setContent(html, { waitUntil:'networkidle0' });
  const pdf = await page.pdf({
    format:'A4', printBackground:true,
    margin:{ top:'10mm', right:'8mm', bottom:'10mm', left:'8mm' },
  });
  await browser.close();
  return pdf;
}

async function sendEmail(html, subject, attachments = []) {
  const body = {
    sender: BREVO_FROM,
    to: [{ email: BREVO_TO }],
    subject,
    htmlContent: html,
  };
  if (attachments.length) {
    body.attachment = attachments.map(({ name, buffer }) => ({
      name,
      content: Buffer.from(buffer).toString('base64'),
    }));
  }
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method:'POST',
    headers:{ 'api-key': BREVO_API_KEY, 'Content-Type':'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

(async () => {
  console.log('📸 Récupération des données Instagram + Facebook…');
  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric', timeZone:'Europe/Paris' });

  // ── Fetch parallèle Instagram ──
  const [igProfile, igInsights, igRawPosts] = await Promise.all([
    fetchIgProfile(), fetchIgAccountInsights(), fetchIgPosts(),
  ]);
  console.log(`✅ Instagram @${igProfile.username} — ${igProfile.followers_count} abonnés`);

  // ── Fetch Page Token + Facebook ──
  let fbToken, fbProfile, fbInsights, fbRawPosts;
  try {
    fbToken    = await fetchFbPageToken();
    [fbProfile, fbInsights, fbRawPosts] = await Promise.all([
      fetchFbProfile(fbToken), fetchFbPageInsights(fbToken), fetchFbPosts(fbToken),
    ]);
    console.log(`✅ Facebook "${fbProfile.name}" — ${fbProfile.fan_count} fans`);
  } catch(e) {
    console.warn('⚠️  Facebook page non disponible:', e.message);
    fbProfile = null; fbInsights = {}; fbRawPosts = [];
  }

  // ── Enrichissement posts Instagram ──
  const igPosts = [];
  for (const post of igRawPosts) {
    const ins  = await fetchIgPostInsights(post.id, post.media_type);
    const likes = post.like_count||0, comments = post.comments_count||0;
    const shares = ins.shares||0, saved = ins.saved||0, reach = ins.reach||0;
    const er = engRate(likes, comments, shares, saved, reach);
    igPosts.push({ ...post, likes, comments, shares, saved, reach, views: ins.video_views??null, er,
      caption: (post.caption||'').substring(0,80).replace(/\n/g,' ') });
    process.stdout.write('·');
  }
  console.log(`\n✅ ${igPosts.length} posts Instagram enrichis`);

  // ── Enrichissement posts Facebook ──
  const fbPosts = [];
  for (const post of fbRawPosts) {
    const ins = fbToken ? await fetchFbPostInsights(post.id, fbToken) : {};
    const reach    = ins.post_impressions_unique || 0;
    const engaged  = ins.post_engaged_users      || 0;
    const clicks   = ins.post_clicks             || 0;
    const shares   = ins.post_shares             || 0;
    const reactions= ins.reactions               || 0;
    const er       = reach ? (engaged/reach)*100 : 0;
    const msg = (post.message||'').substring(0,80).replace(/\n/g,' ');
    fbPosts.push({ ...post, reach, engaged, clicks, shares, reactions, er, msg });
    process.stdout.write('·');
  }
  if (fbPosts.length) console.log(`\n✅ ${fbPosts.length} posts Facebook enrichis`);

  // ── Calculs Instagram ──
  const igTotalReach    = igPosts.reduce((s,p)=>s+p.reach,0);
  const igTotalLikes    = igPosts.reduce((s,p)=>s+p.likes,0);
  const igTotalComments = igPosts.reduce((s,p)=>s+p.comments,0);
  const igTotalShares   = igPosts.reduce((s,p)=>s+p.shares,0);
  const igTotalSaved    = igPosts.reduce((s,p)=>s+p.saved,0);
  const igAvgER         = igPosts.reduce((s,p)=>s+p.er,0) / igPosts.length;
  const igByType        = {};
  for (const p of igPosts) {
    if (!igByType[p.media_type]) igByType[p.media_type] = {count:0,reach:0,er:0};
    igByType[p.media_type].count++; igByType[p.media_type].reach+=p.reach; igByType[p.media_type].er+=p.er;
  }
  for (const t of Object.keys(igByType)) {
    igByType[t].avgReach = Math.round(igByType[t].reach/igByType[t].count);
    igByType[t].avgER    = igByType[t].er/igByType[t].count;
  }
  const igTopReach  = [...igPosts].sort((a,b)=>b.reach  -a.reach ).slice(0,3);
  const igTopShares = [...igPosts].sort((a,b)=>b.shares -a.shares).slice(0,3);
  const igTopER     = [...igPosts].sort((a,b)=>b.er     -a.er    ).slice(0,3);

  // ── Calculs Facebook ──
  const fbTotalReach    = fbPosts.reduce((s,p)=>s+p.reach,0);
  const fbTotalEngaged  = fbPosts.reduce((s,p)=>s+p.engaged,0);
  const fbTotalReact    = fbPosts.reduce((s,p)=>s+p.reactions,0);
  const fbTotalShares   = fbPosts.reduce((s,p)=>s+p.shares,0);
  const fbTotalClicks   = fbPosts.reduce((s,p)=>s+p.clicks,0);
  const fbAvgER         = fbPosts.length ? fbPosts.reduce((s,p)=>s+p.er,0)/fbPosts.length : 0;
  const fbTopReach      = [...fbPosts].sort((a,b)=>b.reach   -a.reach  ).slice(0,3);
  const fbTopEngaged    = [...fbPosts].sort((a,b)=>b.engaged -a.engaged).slice(0,3);

  // ── HTML Rows ─────────────────────────────────────────────────────────────

  // Instagram posts table
  const igPostsRows = igPosts.map((p,i) => {
    const erColor = p.er>=10?'#16a34a':p.er>=5?'#ca8a04':'#dc2626';
    const cap = p.caption.length>55 ? p.caption.substring(0,55)+'…' : p.caption;
    return `<tr style="${i%2===0?'background:#fafafa':''}">
      ${td(`<a href="${p.permalink}" style="color:#0070f3;text-decoration:none">${shortDate(p.timestamp)}<br><span style="font-size:10px;color:#999">${shortHour(p.timestamp)}</span></a>`,'center')}
      ${td(typeLabel(p.media_type),'left')}
      ${td(`<span style="color:#555;font-size:11px">${cap||'—'}</span>`,'left')}
      ${td(fmtNum(p.reach),'right',true)}
      ${td(fmtNum(p.likes))}
      ${td(fmtNum(p.comments))}
      ${td(fmtNum(p.shares))}
      ${td(fmtNum(p.saved))}
      ${p.views!=null?td(fmtNum(p.views)):td('—')}
      ${td(`<span style="color:${erColor};font-weight:600">${fmtPct(p.er)}</span>`,'right')}
    </tr>`;
  }).join('');

  // Instagram podium helper
  const igPodiumRow = (p, i, col1, col2) => `
    <tr>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;font-size:16px;text-align:center;vertical-align:middle">${rankBadge(i)}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;vertical-align:middle">${postThumb(p.thumbnail_url||p.media_url, p.permalink, p.caption)}</td>
      ${td(`<a href="${p.permalink}" style="color:#0070f3;text-decoration:none;font-size:11px">${(p.caption||shortDate(p.timestamp)).substring(0,65)}…</a><br><span style="color:#999;font-size:10px">${shortDate(p.timestamp)} · ${typeLabel(p.media_type)}</span>`,'left')}
      ${td(fmtNum(col1),'right',true)}
      ${td(fmtPct(col2))}
    </tr>`;

  // Instagram type rows
  const igTypeRows = Object.entries(igByType).map(([type,s]) => `<tr>
    ${td(typeLabel(type),'left')} ${td(fmtNum(s.count),'center')} ${td(fmtNum(s.avgReach),'right',true)} ${td(fmtPct(s.avgER),'right')}
  </tr>`).join('');

  // Facebook posts table
  const fbPostsRows = fbPosts.map((p,i) => {
    const erColor = p.er>=5?'#16a34a':p.er>=2?'#ca8a04':'#dc2626';
    const msg = p.msg.length>55 ? p.msg.substring(0,55)+'…' : p.msg;
    return `<tr style="${i%2===0?'background:#f0f6ff':''}">
      ${td(`<a href="${p.permalink_url||'#'}" style="color:#1877f2;text-decoration:none">${shortDate(p.created_time)}<br><span style="font-size:10px;color:#999">${shortHour(p.created_time)}</span></a>`,'center')}
      ${td(`<span style="color:#555;font-size:11px">${msg||'—'}</span>`,'left')}
      ${td(fmtNum(p.reach),'right',true)}
      ${td(fmtNum(p.reactions))}
      ${td(fmtNum(p.engaged))}
      ${td(fmtNum(p.shares))}
      ${td(fmtNum(p.clicks))}
      ${td(`<span style="color:${erColor};font-weight:600">${fmtPct(p.er)}</span>`,'right')}
    </tr>`;
  }).join('');

  // Facebook podium
  const fbPodiumRow = (p, i, col1, label) => `
    <tr>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;font-size:16px;text-align:center;vertical-align:middle">${rankBadge(i)}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #eee;vertical-align:middle">${postThumb(p.full_picture, p.permalink_url||'#', p.msg)}</td>
      ${td(`<a href="${p.permalink_url||'#'}" style="color:#1877f2;text-decoration:none;font-size:11px">${(p.msg||shortDate(p.created_time)).substring(0,70)}…</a><br><span style="color:#999;font-size:10px">${shortDate(p.created_time)}</span>`,'left')}
      ${td(fmtNum(col1),'right',true)}
      ${td(fmtPct(p.er))}
    </tr>`;

  // ── HTML commun ──────────────────────────────────────────────────────────
  const htmlStyles = `<style>
    body { margin:0; padding:20px; background:#fff; font-family:Arial,sans-serif; color:#1a1a1a; }
    table { border-collapse:collapse; width:100%; }
  </style>`;

  // ── HTML INSTAGRAM ────────────────────────────────────────────────────────

  const htmlIG = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">${htmlStyles}</head><body>
<div style="max-width:780px;margin:0 auto">

  <!-- ══ EN-TÊTE ══ -->
  <table style="margin-bottom:20px"><tr>
    <td>
      <h1 style="margin:0 0 3px;font-size:18px">📸 Dashboard Instagram — Dark Massilia</h1>
      <p style="margin:0;font-size:11px;color:#666">${today} · @${igProfile.username} · karimsaari.com</p>
    </td>
    <td style="text-align:right;vertical-align:top">
      <span style="background:#e7f5ee;color:#16a34a;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600">Instagram Creator</span>
    </td>
  </tr></table>

  <div style="background:#e7f5ee;border-left:4px solid #16a34a;padding:8px 14px;margin-bottom:14px;border-radius:0 6px 6px 0">
    <strong style="color:#16a34a;font-size:13px">@${igProfile.username}</strong>
    <span style="color:#555;font-size:11px;margin-left:12px">${fmtNum(igProfile.followers_count)} abonnés · ${fmtNum(igProfile.media_count)} publications</span>
  </div>

  <!-- ══════════════════════════════════════════════ -->
  <!-- ══            SECTION INSTAGRAM             ══ -->
  <!-- ══════════════════════════════════════════════ -->

  <div style="background:#e7f5ee;border-left:4px solid #16a34a;padding:8px 14px;margin-bottom:14px;border-radius:0 6px 6px 0">
    <strong style="color:#16a34a;font-size:13px">📸 INSTAGRAM — @${igProfile.username}</strong>
    <span style="color:#555;font-size:11px;margin-left:12px">${fmtNum(igProfile.followers_count)} abonnés · ${fmtNum(igProfile.media_count)} publications</span>
  </div>

  ${sectionTitle('', 'Compte Instagram — 24h', '#16a34a')}
  <table style="margin-bottom:20px;border-spacing:6px;border-collapse:separate">
    <tr>
      ${kpiCard('Abonnés', fmtNum(igProfile.followers_count), `${fmtNum(igProfile.follows_count)} abonnements`, '#0070f3', '#f0f9ff', '#bfdbfe')}
      ${kpiCard('Publications', fmtNum(igProfile.media_count), 'total', '#1a1a1a')}
      ${kpiCard('Reach 24h', fmtNum(igInsights.reach||0), 'comptes uniques touchés', '#7c3aed', '#faf5ff', '#ddd6fe')}
      ${kpiCard('Comptes engagés 24h', fmtNum(igInsights.accounts_engaged||0), 'interactions reçues', '#16a34a', '#f0fdf4', '#bbf7d0')}
      ${kpiCard('Vues profil 24h', fmtNum(igInsights.profile_views||0), `${fmtNum(igInsights.website_clicks||0)} clics site`, '#ea580c', '#fff7ed', '#fed7aa')}
    </tr>
  </table>

  ${sectionTitle('', `Agrégats — ${NB_POSTS_IG} derniers posts`, '#16a34a')}
  <table style="margin-bottom:20px;border-spacing:6px;border-collapse:separate">
    <tr>
      ${kpiCard('Reach total', fmtNum(igTotalReach), `moy. ${fmtNum(Math.round(igTotalReach/NB_POSTS_IG))}/post`)}
      ${kpiCard('Likes total', fmtNum(igTotalLikes), `moy. ${fmtNum(Math.round(igTotalLikes/NB_POSTS_IG))}/post`, '#e11d48', '#fff1f2', '#fecdd3')}
      ${kpiCard('Commentaires', fmtNum(igTotalComments), `moy. ${fmtNum(Math.round(igTotalComments/NB_POSTS_IG))}/post`)}
      ${kpiCard('Partages', fmtNum(igTotalShares), `moy. ${fmtNum(Math.round(igTotalShares/NB_POSTS_IG))}/post`, '#ca8a04', '#fefce8', '#fef08a')}
      ${kpiCard('Tx. engagement moy.', fmtPct(igAvgER), 'likes+com+shares+saved/reach', igAvgER>=5?'#16a34a':'#ca8a04')}
    </tr>
  </table>

  ${sectionTitle('', `${NB_POSTS_IG} dernières publications Instagram`, '#16a34a')}
  <table style="font-size:12px;margin-bottom:24px">
    <thead><tr>
      ${th('Date','center')}${th('Type','left')}${th('Caption','left')}
      ${th('Reach')}${th('Likes')}${th('Comm.')}${th('Partages')}${th('Enreg.')}${th('Vues')}${th('Tx.eng.')}
    </tr></thead>
    <tbody>${igPostsRows}</tbody>
    <tfoot><tr style="background:#e7f5ee;font-weight:700">
      <td colspan="3" style="padding:7px 10px;font-size:11px">TOTAL / MOYENNE</td>
      ${td(fmtNum(igTotalReach),'right',true)} ${td(fmtNum(igTotalLikes),'right',true)}
      ${td(fmtNum(igTotalComments),'right',true)} ${td(fmtNum(igTotalShares),'right',true)}
      ${td(fmtNum(igTotalSaved),'right',true)} ${td('—')}
      ${td(fmtPct(igAvgER),'right',true,igAvgER>=5?'#16a34a':'#ca8a04')}
    </tr></tfoot>
  </table>

  <!-- Podiums Instagram -->
  <table style="margin-bottom:24px">
    <tr style="vertical-align:top">
      <td style="width:50%;padding-right:10px">
        ${sectionTitle('🏆','Top Reach Instagram','#16a34a')}
        <table><thead><tr>${th('','center')}${th('','center')}${th('Post','left')}${th('Reach')}${th('Tx.eng.')}</tr></thead>
        <tbody>${igTopReach.map((p,i)=>igPodiumRow(p,i,p.reach,p.er)).join('')}</tbody></table>
      </td>
      <td style="width:50%;padding-left:10px">
        ${sectionTitle('🔁','Top Partages Instagram','#16a34a')}
        <table><thead><tr>${th('','center')}${th('','center')}${th('Post','left')}${th('Partages')}${th('Reach')}</tr></thead>
        <tbody>${igTopShares.map((p,i)=>igPodiumRow(p,i,p.shares,p.er)).join('')}</tbody></table>
      </td>
    </tr>
  </table>

  <table style="margin-bottom:24px">
    <tr style="vertical-align:top">
      <td style="width:50%;padding-right:10px">
        ${sectionTitle('💬','Top Engagement Instagram','#16a34a')}
        <table><thead><tr>${th('','center')}${th('','center')}${th('Post','left')}${th('Tx.eng.')}${th('Reach')}</tr></thead>
        <tbody>${igTopER.map((p,i)=>igPodiumRow(p,i,p.er,p.er)).join('')}</tbody></table>
      </td>
      <td style="width:50%;padding-left:10px">
        ${sectionTitle('📊','Performance par type','#16a34a')}
        <table><thead><tr>${th('Type','left')}${th('Posts','center')}${th('Reach moy.')}${th('Tx.eng.moy.')}</tr></thead>
        <tbody>${igTypeRows}</tbody></table>
      </td>
    </tr>
  </table>

  <!-- ══ PIED DE PAGE ══ -->
  <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
  <p style="font-size:10px;color:#aaa;text-align:center;margin:0">
    Dashboard Instagram · Dark Massilia — Karim Saari · karimsaari.com<br>
    Instagram Graph API v25 · ${NB_POSTS_IG} posts analysés
  </p>
</div></body></html>`;

  // ── HTML FACEBOOK PAGE ────────────────────────────────────────────────────

  const htmlFB = fbProfile ? `<!DOCTYPE html>
<html><head><meta charset="UTF-8">${htmlStyles}</head><body>
<div style="max-width:780px;margin:0 auto">

  <!-- ══ EN-TÊTE ══ -->
  <table style="margin-bottom:20px"><tr>
    <td>
      <h1 style="margin:0 0 3px;font-size:18px">👤 Dashboard Facebook — Dark Massilia</h1>
      <p style="margin:0;font-size:11px;color:#666">${today} · ${fbProfile.name} · karimsaari.com</p>
    </td>
    <td style="text-align:right;vertical-align:top">
      <span style="background:#e7f0ff;color:#1877f2;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600">Facebook Page</span>
    </td>
  </tr></table>

  <div style="background:#e7f0ff;border-left:4px solid #1877f2;padding:8px 14px;margin-bottom:14px;border-radius:0 6px 6px 0">
    <strong style="color:#1877f2;font-size:13px">${fbProfile.name}</strong>
    <span style="color:#555;font-size:11px;margin-left:12px">${fmtNum(fbProfile.fan_count)} fans · ${fbProfile.category||''}</span>
  </div>

  ${sectionTitle('', 'Page Facebook — 24h', '#1877f2')}
  <table style="margin-bottom:20px;border-spacing:6px;border-collapse:separate"><tr>
    ${kpiCard('Fans (abonnés)', fmtNum(fbProfile.fan_count), `${fmtNum(fbProfile.followers_count||fbProfile.fan_count)} followers`, '#1877f2', '#eff6ff', '#bfdbfe')}
    ${kpiCard('Impressions 24h', fmtNum(fbInsights.page_impressions||0), 'total vues', '#7c3aed', '#faf5ff', '#ddd6fe')}
    ${kpiCard('Reach 24h', fmtNum(fbInsights.page_impressions_unique||0), 'comptes uniques', '#0ea5e9', '#f0f9ff', '#bae6fd')}
    ${kpiCard('Utilisateurs engagés 24h', fmtNum(fbInsights.page_engaged_users||0), 'interactions', '#16a34a', '#f0fdf4', '#bbf7d0')}
    ${kpiCard('Nouveaux fans 24h', fmtNum(fbInsights.page_fans_adds_unique||0), 'nouveaux abonnés', '#ea580c', '#fff7ed', '#fed7aa')}
  </tr></table>

  ${sectionTitle('', `Agrégats — ${NB_POSTS_FB} derniers posts Facebook`, '#1877f2')}
  <table style="margin-bottom:20px;border-spacing:6px;border-collapse:separate"><tr>
    ${kpiCard('Reach total', fmtNum(fbTotalReach), `moy. ${fmtNum(Math.round(fbTotalReach/(fbPosts.length||1)))}/post`)}
    ${kpiCard('Réactions total', fmtNum(fbTotalReact), `moy. ${fmtNum(Math.round(fbTotalReact/(fbPosts.length||1)))}/post`, '#e11d48', '#fff1f2', '#fecdd3')}
    ${kpiCard('Engagés total', fmtNum(fbTotalEngaged), `moy. ${fmtNum(Math.round(fbTotalEngaged/(fbPosts.length||1)))}/post`, '#16a34a', '#f0fdf4', '#bbf7d0')}
    ${kpiCard('Partages total', fmtNum(fbTotalShares), `moy. ${fmtNum(Math.round(fbTotalShares/(fbPosts.length||1)))}/post`, '#ca8a04', '#fefce8', '#fef08a')}
    ${kpiCard('Tx. engagement moy.', fmtPct(fbAvgER), 'engagés / reach', fbAvgER>=3?'#16a34a':'#ca8a04')}
  </tr></table>

  ${sectionTitle('', `${NB_POSTS_FB} dernières publications Facebook`, '#1877f2')}
  <table style="font-size:12px;margin-bottom:24px">
    <thead><tr>
      ${thFb('Date','center')}${thFb('Message','left')}
      ${thFb('Reach')}${thFb('Réactions')}${thFb('Engagés')}${thFb('Partages')}${thFb('Clics')}${thFb('Tx.eng.')}
    </tr></thead>
    <tbody>${fbPostsRows}</tbody>
    <tfoot><tr style="background:#e7f0ff;font-weight:700">
      <td colspan="2" style="padding:7px 10px;font-size:11px">TOTAL / MOYENNE</td>
      ${td(fmtNum(fbTotalReach),'right',true)} ${td(fmtNum(fbTotalReact),'right',true)}
      ${td(fmtNum(fbTotalEngaged),'right',true)} ${td(fmtNum(fbTotalShares),'right',true)}
      ${td(fmtNum(fbTotalClicks),'right',true)}
      ${td(fmtPct(fbAvgER),'right',true,fbAvgER>=3?'#16a34a':'#ca8a04')}
    </tr></tfoot>
  </table>

  <table style="margin-bottom:24px"><tr style="vertical-align:top">
    <td style="width:50%;padding-right:10px">
      ${sectionTitle('🏆','Top Reach Facebook','#1877f2')}
      <table><thead><tr>${thFb('','center')}${thFb('','center')}${thFb('Post','left')}${thFb('Reach')}${thFb('Tx.eng.')}</tr></thead>
      <tbody>${fbTopReach.map((p,i)=>fbPodiumRow(p,i,p.reach,'Reach')).join('')}</tbody></table>
    </td>
    <td style="width:50%;padding-left:10px">
      ${sectionTitle('💬','Top Engagement Facebook','#1877f2')}
      <table><thead><tr>${thFb('','center')}${thFb('','center')}${thFb('Post','left')}${thFb('Engagés')}${thFb('Tx.eng.')}</tr></thead>
      <tbody>${fbTopEngaged.map((p,i)=>fbPodiumRow(p,i,p.engaged,'Engagés')).join('')}</tbody></table>
    </td>
  </tr></table>

  <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
  <p style="font-size:10px;color:#aaa;text-align:center;margin:0">
    Dashboard Facebook · Dark Massilia — Karim Saari · karimsaari.com<br>
    Facebook Graph API v25 · ${NB_POSTS_FB} posts analysés
  </p>
</div></body></html>` : null;

  // ── PDFs + Envoi ───────────────────────────────────────────────────────────
  const dateShort = new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'-');
  const subject   = `📊 Social Media Daily — ${dateShort} · IG: ${fmtNum(igProfile.followers_count)} abonnés · FB: ${fmtNum(fbProfile?.fan_count||0)} fans`;

  // Générer les deux PDFs en parallèle
  const [pdfIG, pdfFB] = await Promise.all([
    generatePDF(htmlIG).then(b => { console.log(`✅ PDF Instagram (${Math.round(b.length/1024)} KB)`); return b; }).catch(e => { console.warn('⚠️ PDF IG:', e.message); return null; }),
    htmlFB ? generatePDF(htmlFB).then(b => { console.log(`✅ PDF Facebook (${Math.round(b.length/1024)} KB)`); return b; }).catch(e => { console.warn('⚠️ PDF FB:', e.message); return null; }) : Promise.resolve(null),
  ]);

  // Email de synthèse (corps simple avec résumé)
  const emailBody = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a">
    <h1 style="font-size:16px;margin:0 0 16px">📊 Social Media Daily — ${today}</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr style="background:#e7f5ee">
        <td style="padding:10px 14px;font-weight:600;color:#16a34a">📸 Instagram @${igProfile.username}</td>
        <td style="padding:10px 14px;text-align:right">${fmtNum(igProfile.followers_count)} abonnés · reach 24h : ${fmtNum(igInsights.reach||0)}</td>
      </tr>
      <tr style="background:#e7f0ff">
        <td style="padding:10px 14px;font-weight:600;color:#1877f2">👤 Facebook ${fbProfile?.name||'Page'}</td>
        <td style="padding:10px 14px;text-align:right">${fmtNum(fbProfile?.fan_count||0)} fans · reach 24h : ${fmtNum(fbInsights.page_impressions_unique||0)}</td>
      </tr>
    </table>
    <p style="font-size:12px;color:#666">Les rapports détaillés sont joints en pièces jointes PDF.</p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
    <p style="font-size:10px;color:#aaa;text-align:center">Dark Massilia — Karim Saari · karimsaari.com</p>
  </body></html>`;

  const attachments = [];
  if (pdfIG) attachments.push({ name: `instagram-report-${dateShort}.pdf`, buffer: pdfIG });
  if (pdfFB) attachments.push({ name: `facebook-report-${dateShort}.pdf`,  buffer: pdfFB });

  const result = await sendEmail(emailBody, subject, attachments);
  if (result.messageId) {
    console.log(`✅ Email envoyé → ${BREVO_TO} (${attachments.length} PDF${attachments.length>1?'s':''})`);
  } else {
    console.error('❌ Brevo:', JSON.stringify(result));
    process.exit(1);
  }
})();
