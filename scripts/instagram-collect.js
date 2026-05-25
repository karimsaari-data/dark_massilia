// scripts/instagram-collect.js
// ETL : Instagram Graph API → Supabase
// Tables cibles : instagram_compte_stats, dim_instagram_post, instagram_post_stats

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const ACCOUNT_ID   = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '17841401329930518';
const GRAPH_BASE   = 'https://graph.facebook.com/v25.0';

if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_KEY');
if (!ACCESS_TOKEN)                   throw new Error('Missing INSTAGRAM_ACCESS_TOKEN');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Helpers ────────────────────────────────────────────────────────────────────

async function igGet(path, params = {}) {
  const url = new URL(`${GRAPH_BASE}/${path}`);
  url.searchParams.set('access_token', ACCESS_TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) throw new Error(`IG API [${path}]: ${data.error.message} (code ${data.error.code})`);
  return data;
}

const toDate = iso => iso.slice(0, 10);
const captionCourt = c => c ? c.slice(0, 120).replace(/\n/g, ' ') : null;

// ── 1. Profil compte (followers) ───────────────────────────────────────────────

async function fetchProfile() {
  return igGet(ACCOUNT_ID, { fields: 'id,username,followers_count' });
}

// ── 2. Insights journaliers du compte ──────────────────────────────────────────

async function fetchAccountInsights() {
  try {
    const data = await igGet(`${ACCOUNT_ID}/insights`, {
      metric: 'reach,impressions,profile_views,website_clicks',
      period: 'day',
    });
    const out = {};
    for (const item of (data.data || [])) {
      // Selon version API : total_value.value ou values[0].value
      out[item.name] = item.total_value?.value ?? item.values?.[0]?.value ?? 0;
    }
    return out;
  } catch (err) {
    console.warn(`  ⚠️  Account insights non disponibles : ${err.message}`);
    return {};
  }
}

// ── 3. Liste des posts récents ─────────────────────────────────────────────────

async function fetchPosts(limit = 25) {
  const data = await igGet(`${ACCOUNT_ID}/media`, {
    fields: 'id,shortcode,media_type,timestamp,caption,permalink',
    limit,
  });
  return data.data || [];
}

// ── 4. Insights d'un post (reach, impressions, saved, shares) ─────────────────

async function fetchPostInsights(mediaId, mediaType) {
  const isVideo = mediaType === 'VIDEO';
  const metrics = isVideo
    ? 'reach,impressions,saved,shares,plays'
    : 'reach,impressions,saved,shares';
  try {
    const data = await igGet(`${mediaId}/insights`, { metric: metrics });
    const out = {};
    for (const item of (data.data || [])) {
      out[item.name] = item.values?.[0]?.value ?? item.value ?? 0;
    }
    return out;
  } catch (err) {
    console.warn(`  ⚠️  Post insights non disponibles [${mediaId}] : ${err.message}`);
    return {};
  }
}

// ── 5. Likes + commentaires (champs du média) ──────────────────────────────────

async function fetchPostCounts(mediaId) {
  try {
    const data = await igGet(mediaId, { fields: 'like_count,comments_count' });
    return { likes: data.like_count ?? 0, commentaires: data.comments_count ?? 0 };
  } catch {
    return { likes: 0, commentaires: 0 };
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`\n📊 instagram-collect — ${today}\n`);

  // ── Étape 1 : compte ─────────────────────────────────────────────────────────
  const [profile, insights] = await Promise.all([fetchProfile(), fetchAccountInsights()]);

  const compteRow = {
    date_stat:      today,
    followers:      profile.followers_count  ?? 0,
    impressions:    insights.impressions      ?? 0,
    portee:         insights.reach            ?? 0,
    profil_visites: insights.profile_views    ?? 0,
    clics_site_web: insights.website_clicks   ?? 0,
  };

  const { error: eCompte } = await supabase
    .from('instagram_compte_stats')
    .upsert(compteRow, { onConflict: 'date_stat' });
  if (eCompte) throw new Error(`instagram_compte_stats upsert: ${eCompte.message}`);

  console.log(`✅ Compte — followers: ${compteRow.followers}, reach: ${compteRow.portee}, impressions: ${compteRow.impressions}`);

  // ── Étape 2 : posts ───────────────────────────────────────────────────────────
  const posts = await fetchPosts(25);
  console.log(`\n📷 ${posts.length} posts à traiter…\n`);

  for (const post of posts) {
    // dim_instagram_post
    const dimRow = {
      post_id:          post.id,
      shortcode:        post.shortcode  ?? null,
      type_media:       post.media_type ?? null,
      date_publication: toDate(post.timestamp),
      caption_court:    captionCourt(post.caption),
      permalink:        post.permalink  ?? null,
    };

    const { error: eDim } = await supabase
      .from('dim_instagram_post')
      .upsert(dimRow, { onConflict: 'post_id' });
    if (eDim) throw new Error(`dim_instagram_post upsert [${post.id}]: ${eDim.message}`);

    // instagram_post_stats
    const [insightsPost, counts] = await Promise.all([
      fetchPostInsights(post.id, post.media_type),
      fetchPostCounts(post.id),
    ]);

    const statsRow = {
      post_id:      post.id,
      likes:        counts.likes,
      commentaires: counts.commentaires,
      sauvegardes:  insightsPost.saved       ?? 0,
      partages:     insightsPost.shares      ?? 0,
      portee:       insightsPost.reach       ?? 0,
      impressions:  insightsPost.impressions ?? 0,
    };

    const { error: eStats } = await supabase
      .from('instagram_post_stats')
      .upsert(statsRow, { onConflict: 'post_id' });
    if (eStats) throw new Error(`instagram_post_stats upsert [${post.id}]: ${eStats.message}`);

    console.log(`  ✓ ${post.shortcode ?? post.id} [${dimRow.date_publication}] — reach: ${statsRow.portee}, likes: ${statsRow.likes}`);
  }

  console.log(`\n✅ instagram-collect terminé — ${posts.length} posts upsertés\n`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
