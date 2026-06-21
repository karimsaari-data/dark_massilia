/**
 * ga-health-check.js — Sentinelle anti-panne GA4
 *
 * Détecte les arrêts SILENCIEUX de collecte GA4 (tag bloqué par une CSP /
 * Cloudflare, conteneur GTM cassé, balise retirée…). Envoie un email Brevo
 * UNIQUEMENT en cas d'anomalie. Aucun bruit quand tout va bien.
 *
 * Logique : si le nombre d'utilisateurs actifs sur la fenêtre récente est
 * exactement 0 ALORS QUE la période de référence en avait → alerte. Le garde
 * « baseline > seuil » évite les faux positifs sur un site à faible trafic ou
 * une propriété neuve.
 *
 * Usage : npm run ga-health
 * Variables : GSC_CLIENT_ID, GSC_CLIENT_SECRET, GSC_REFRESH_TOKEN, GA_PROPERTY_ID, BREVO_API_KEY
 * Options (env, facultatives) :
 *   GA_HEALTH_WINDOW_DAYS   (def. 5)  — taille de la fenêtre récente analysée
 *   GA_HEALTH_BASELINE_DAYS (def. 28) — taille de la période de référence
 *   GA_HEALTH_MIN_BASELINE  (def. 5)  — utilisateurs mini sur la référence pour armer l'alerte
 */

const BREVO_TO   = 'email@karimsaari.com';
const BREVO_FROM = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

const GA_PROPERTY = process.env.GA_PROPERTY_ID; // ex: "properties/123456789"

const WINDOW_DAYS   = Number(process.env.GA_HEALTH_WINDOW_DAYS   ?? 5);
const BASELINE_DAYS = Number(process.env.GA_HEALTH_BASELINE_DAYS ?? 28);
const MIN_BASELINE  = Number(process.env.GA_HEALTH_MIN_BASELINE  ?? 5);

// ── Auth OAuth2 (mêmes credentials que GSC / ga-report.js) ───────────────────
async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GSC_CLIENT_ID,
      client_secret: process.env.GSC_CLIENT_SECRET,
      refresh_token: process.env.GSC_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token OAuth2 : ${JSON.stringify(data)}`);
  return data.access_token;
}

// ── GA4 Data API ──────────────────────────────────────────────────────────────
async function activeUsersBetween(token, startDate, endDate) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${GA_PROPERTY}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'activeUsers' }],
      }),
    },
  );
  const json = await res.json();
  if (json.error) throw new Error(`GA4 API: ${json.error.message}`);
  return Number(json.rows?.[0]?.metricValues?.[0]?.value ?? 0);
}

// ── Brevo (email d'alerte uniquement) ────────────────────────────────────────
async function sendAlert(subject, html) {
  if (!process.env.BREVO_API_KEY) {
    console.log('ℹ️  BREVO_API_KEY absent — alerte non envoyée (mode console).');
    return;
  }
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: BREVO_FROM, to: [{ email: BREVO_TO }], subject, htmlContent: html }),
  });
  const out = await res.json();
  if (out.messageId) console.log(`✅ Alerte envoyée (messageId: ${out.messageId})`);
  else console.error('❌ Erreur Brevo:', JSON.stringify(out));
}

// ── Helpers dates ─────────────────────────────────────────────────────────────
const fmt = (d) => d.toISOString().split('T')[0];
const daysAgo = (n) => fmt(new Date(Date.now() - n * 86400000));

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  if (!GA_PROPERTY) {
    console.error('❌ GA_PROPERTY_ID manquant (ex: properties/123456789)');
    process.exit(1);
  }

  // Décalage de 1 j : les données GA4 de la veille sont quasi complètes.
  const recentEnd     = daysAgo(1);
  const recentStart   = daysAgo(WINDOW_DAYS);
  const baselineEnd   = daysAgo(WINDOW_DAYS + 1);
  const baselineStart = daysAgo(WINDOW_DAYS + BASELINE_DAYS);

  console.log(`🩺 GA4 health-check — propriété ${GA_PROPERTY}`);
  console.log(`   Fenêtre récente : ${recentStart} → ${recentEnd} (${WINDOW_DAYS} j)`);
  console.log(`   Référence       : ${baselineStart} → ${baselineEnd} (${BASELINE_DAYS} j)`);

  const token = await getAccessToken();
  const [recent, baseline] = await Promise.all([
    activeUsersBetween(token, recentStart, recentEnd),
    activeUsersBetween(token, baselineStart, baselineEnd),
  ]);

  const baselineDaily = baseline / BASELINE_DAYS;
  console.log(`   Utilisateurs récents : ${recent}`);
  console.log(`   Utilisateurs réf.    : ${baseline} (~${baselineDaily.toFixed(1)}/j)`);

  const flatline = recent === 0 && baseline >= MIN_BASELINE;

  if (!flatline) {
    console.log('✅ Collecte GA4 nominale — aucune alerte.');
    return;
  }

  // ── Anomalie : collecte à plat ─────────────────────────────────────────────
  console.warn('🚨 ANOMALIE : 0 utilisateur sur la fenêtre récente alors que la référence en avait.');

  const subject = `🚨 ALERTE GA4 — aucune donnée depuis ${WINDOW_DAYS} jours (karimsaari.com)`;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;color:#1a1a1a;line-height:1.5">
    <h2 style="color:#c0392b;margin:0 0 12px">🚨 GA4 ne collecte plus de données</h2>
    <p>La sentinelle a détecté un <strong>arrêt de collecte Google Analytics 4</strong> sur
    <strong>karimsaari.com</strong>.</p>
    <table style="border-collapse:collapse;margin:12px 0;font-size:14px">
      <tr><td style="padding:4px 16px 4px 0;color:#555">Fenêtre récente (${recentStart} → ${recentEnd})</td>
          <td style="font-weight:700;color:#c0392b">${recent} utilisateur(s)</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#555">Référence ${BASELINE_DAYS} j (avant)</td>
          <td style="font-weight:700">${baseline} utilisateur(s) · ~${baselineDaily.toFixed(1)}/j</td></tr>
    </table>
    <p><strong>Causes probables :</strong> balise GA4/GTM bloquée par une CSP ou une règle Cloudflare,
    conteneur GTM cassé, ou tag retiré du site.</p>
    <p><strong>À vérifier :</strong></p>
    <ol style="margin:0 0 12px;padding-left:20px">
      <li>GA4 → <em>Aperçu en temps réel</em> : recharge le site, est-ce qu'un utilisateur apparaît ?</li>
      <li>Console du navigateur sur le site : une erreur <code>Content Security Policy</code> sur
          <code>googletagmanager.com</code> ?</li>
      <li>Cloudflare → Rules → Transform Rules : la CSP autorise-t-elle toujours
          <code>googletagmanager.com</code> et <code>google-analytics.com</code> ?</li>
    </ol>
    <p style="font-size:12px;color:#888;margin-top:16px">Sentinelle GA4 automatique · Dark Massilia ·
    seuil d'armement : référence ≥ ${MIN_BASELINE} utilisateurs.</p>
  </div>`;

  await sendAlert(subject, html);
  // Sortie 1 pour que l'anomalie soit visible dans l'historique GitHub Actions.
  process.exit(1);
})().catch((err) => {
  console.error('Erreur health-check:', err.message);
  process.exit(1);
});
