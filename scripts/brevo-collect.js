// scripts/brevo-collect.js
// ETL : Brevo REST API → Supabase
// Tables cibles : brevo_campagnes, brevo_campagne_stats
// Note : taux_ouverture et taux_clic sont des colonnes GENERATED ALWAYS — ne pas les insérer

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BREVO_KEY    = process.env.BREVO_API_KEY;
const BREVO_BASE   = 'https://api.brevo.com/v3';

if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_KEY');
if (!BREVO_KEY)                      throw new Error('Missing BREVO_API_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Helper ─────────────────────────────────────────────────────────────────────

async function brevoGet(path, params = {}) {
  const url = new URL(`${BREVO_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url.toString(), {
    headers: { 'api-key': BREVO_KEY, 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Brevo API [${path}] HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Récupère toutes les campagnes envoyées (pagination) ───────────────────────

async function fetchAllCampaigns() {
  const all = [];
  const limit = 50;
  let offset = 0;

  while (true) {
    const data = await brevoGet('/emailCampaigns', {
      status: 'sent',
      limit,
      offset,
      statistics: 'globalStats',
    });
    const batch = data.campaigns || [];
    all.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
  }
  return all;
}

// ── Extrait les stats depuis la structure Brevo ───────────────────────────────
// Les stats peuvent être dans campaignStats[0] (par liste) ou dans globalStats
// taux_ouverture et taux_clic sont calculés automatiquement par PostgreSQL (GENERATED ALWAYS)

function extractStats(c) {
  const src = c.statistics?.campaignStats?.[0] ?? c.statistics?.globalStats ?? {};

  return {
    envoyes:        src.requests        ?? 0,
    delivres:       src.delivered       ?? 0,
    soft_bounces:   src.softBounces     ?? 0,
    hard_bounces:   src.hardBounces     ?? 0,
    vues_uniques:   src.uniqueViews     ?? 0,
    vues_totales:   src.viewed          ?? 0,
    clics_uniques:  src.uniqueClicks    ?? 0,
    desabonnements: src.unsubscriptions ?? 0,
    plaintes:       src.complaints      ?? 0,
    // taux_ouverture et taux_clic : colonnes GENERATED ALWAYS, pas à insérer
  };
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`\n📧 brevo-collect — ${today}\n`);

  const campaigns = await fetchAllCampaigns();
  console.log(`📨 ${campaigns.length} campagnes récupérées depuis Brevo\n`);

  let upserted = 0;

  for (const c of campaigns) {
    const sentDate = c.sentDate ? c.sentDate.slice(0, 10) : null;
    if (!sentDate) continue; // ignore les brouillons sans date d'envoi

    // ── brevo_campagnes ──────────────────────────────────────────────────────
    const campagneRow = {
      campaign_id: c.id,
      nom:         c.name    ?? 'Sans nom',
      sujet:       c.subject ?? null,
      date_envoi:  sentDate,
      liste_id:    c.recipients?.lists?.[0] ?? null,
      statut:      c.status  ?? 'sent',
    };

    const { error: eCampagne } = await supabase
      .from('brevo_campagnes')
      .upsert(campagneRow, { onConflict: 'campaign_id' });
    if (eCampagne) throw new Error(`brevo_campagnes upsert [${c.id}]: ${eCampagne.message}`);

    // ── brevo_campagne_stats ─────────────────────────────────────────────────
    const stats = extractStats(c);
    const statsRow = { campaign_id: c.id, ...stats };

    const { error: eStats } = await supabase
      .from('brevo_campagne_stats')
      .upsert(statsRow, { onConflict: 'campaign_id' });
    if (eStats) throw new Error(`brevo_campagne_stats upsert [${c.id}]: ${eStats.message}`);

    upserted++;
    const label = c.name.slice(0, 55);
    console.log(`  ✓ [${sentDate}] ${label} — ${stats.delivres} délivrés, ${stats.vues_uniques} vues uniques`);
  }

  console.log(`\n✅ brevo-collect terminé — ${upserted} campagnes upsertées\n`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
