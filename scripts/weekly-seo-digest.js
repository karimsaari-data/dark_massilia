/**
 * weekly-seo-digest.js — Digest SEO hebdomadaire via Google Search Console + Brevo
 * Usage : npm run seo-digest
 */

const GSC_SITE     = 'sc-domain:karimsaari.com';
const BREVO_TO     = 'email@karimsaari.com';
const BREVO_FROM   = { email: 'contact@karimsaari.com', name: 'Dark Massilia' };

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
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function fetchGSCData(token, startDate, endDate) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 10,
        orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
      }),
    }
  );
  return res.json();
}

async function fetchGSCQueries(token, startDate, endDate) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 10,
        orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
      }),
    }
  );
  return res.json();
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function pageLabel(url) {
  return url.replace('https://karimsaari.com/', '/') || '/';
}

async function sendEmail(html, subject) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: BREVO_FROM,
      to: [{ email: BREVO_TO }],
      subject,
      htmlContent: html,
    }),
  });
  return res.json();
}

(async () => {
  const now        = new Date();
  const endDate    = formatDate(new Date(now - 2 * 86400000)); // J-2 (GSC lag)
  const startDate  = formatDate(new Date(now - 9 * 86400000)); // 7 jours
  const prevStart  = formatDate(new Date(now - 16 * 86400000));
  const prevEnd    = formatDate(new Date(now - 9 * 86400000));

  console.log(`📊 Récupération GSC du ${startDate} au ${endDate}...`);

  const token       = await getAccessToken();
  const [curr, prev, queries] = await Promise.all([
    fetchGSCData(token, startDate, endDate),
    fetchGSCData(token, prevStart, prevEnd),
    fetchGSCQueries(token, startDate, endDate),
  ]);

  // Totaux globaux
  const totals = (curr.rows || []).reduce((a, r) => ({
    clicks: a.clicks + r.clicks,
    impressions: a.impressions + r.impressions,
  }), { clicks: 0, impressions: 0 });

  const prevTotals = (prev.rows || []).reduce((a, r) => ({
    clicks: a.clicks + r.clicks,
    impressions: a.impressions + r.impressions,
  }), { clicks: 0, impressions: 0 });

  const clicksDiff = totals.clicks - prevTotals.clicks;
  const clicksArrow = clicksDiff >= 0 ? '▲' : '▼';
  const clicksColor = clicksDiff >= 0 ? '#21c47b' : '#e74c3c';

  // HTML email
  const pagesRows = (curr.rows || []).slice(0, 10).map(r => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #2a3a4a;color:#94a3b8;font-size:13px">${pageLabel(r.keys[0])}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a3a4a;text-align:center;font-weight:600">${r.clicks}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a3a4a;text-align:center;color:#94a3b8">${r.impressions}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a3a4a;text-align:center;color:#94a3b8">${(r.ctr * 100).toFixed(1)}%</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a3a4a;text-align:center;color:#94a3b8">${r.position.toFixed(1)}</td>
    </tr>`).join('');

  const queriesRows = (queries.rows || []).slice(0, 10).map(r => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #2a3a4a;color:#94a3b8;font-size:13px">${r.keys[0]}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a3a4a;text-align:center;font-weight:600">${r.clicks}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a3a4a;text-align:center;color:#94a3b8">${r.impressions}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a3a4a;text-align:center;color:#94a3b8">${r.position.toFixed(1)}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a1628;font-family:system-ui,sans-serif;color:#e2e8f0">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">

    <div style="text-align:center;margin-bottom:32px">
      <div style="font-size:13px;letter-spacing:2px;color:#21c47b;text-transform:uppercase;margin-bottom:8px">Rapport SEO hebdomadaire</div>
      <h1 style="margin:0;font-size:24px;color:#fff">Dark Massilia</h1>
      <div style="font-size:13px;color:#64748b;margin-top:4px">${startDate} → ${endDate}</div>
    </div>

    <!-- KPIs -->
    <div style="display:flex;gap:12px;margin-bottom:24px">
      <div style="flex:1;background:#0f2035;border-radius:12px;padding:20px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:#fff">${totals.clicks}</div>
        <div style="font-size:12px;color:#64748b;margin-top:4px">Clics</div>
        <div style="font-size:12px;color:${clicksColor};margin-top:4px">${clicksArrow} ${Math.abs(clicksDiff)} vs sem. préc.</div>
      </div>
      <div style="flex:1;background:#0f2035;border-radius:12px;padding:20px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:#fff">${totals.impressions}</div>
        <div style="font-size:12px;color:#64748b;margin-top:4px">Impressions</div>
      </div>
      <div style="flex:1;background:#0f2035;border-radius:12px;padding:20px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:#fff">${totals.clicks > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(1) : 0}%</div>
        <div style="font-size:12px;color:#64748b;margin-top:4px">CTR moyen</div>
      </div>
    </div>

    <!-- Top pages -->
    <div style="background:#0f2035;border-radius:12px;padding:20px;margin-bottom:16px">
      <h2 style="margin:0 0 16px;font-size:15px;color:#21c47b">Top 10 pages</h2>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="font-size:11px;color:#64748b;text-transform:uppercase">
            <th style="padding:8px 12px;text-align:left">Page</th>
            <th style="padding:8px 12px">Clics</th>
            <th style="padding:8px 12px">Impr.</th>
            <th style="padding:8px 12px">CTR</th>
            <th style="padding:8px 12px">Pos.</th>
          </tr>
        </thead>
        <tbody>${pagesRows}</tbody>
      </table>
    </div>

    <!-- Top requêtes -->
    <div style="background:#0f2035;border-radius:12px;padding:20px;margin-bottom:24px">
      <h2 style="margin:0 0 16px;font-size:15px;color:#21c47b">Top 10 requêtes</h2>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="font-size:11px;color:#64748b;text-transform:uppercase">
            <th style="padding:8px 12px;text-align:left">Requête</th>
            <th style="padding:8px 12px">Clics</th>
            <th style="padding:8px 12px">Impr.</th>
            <th style="padding:8px 12px">Pos.</th>
          </tr>
        </thead>
        <tbody>${queriesRows}</tbody>
      </table>
    </div>

    <div style="text-align:center;font-size:12px;color:#334155">
      Généré automatiquement chaque lundi · Dark Massilia
    </div>
  </div>
</body></html>`;

  const weekNum = Math.ceil((now.getDate() - now.getDay() + 1) / 7);
  const subject = `📊 SEO Digest — semaine du ${startDate}`;

  console.log('📧 Envoi email Brevo...');
  const result = await sendEmail(html, subject);
  if (result.messageId) {
    console.log(`✅ Email envoyé (messageId: ${result.messageId})`);
  } else {
    console.error('❌ Erreur Brevo:', JSON.stringify(result));
    process.exit(1);
  }
})();
