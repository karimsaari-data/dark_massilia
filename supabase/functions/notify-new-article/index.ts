import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BREVO_API_KEY  = Deno.env.get("BREVO_API_KEY")  ?? "";
const BREVO_LIST_ID  = parseInt(Deno.env.get("BREVO_LIST_ID") ?? "3", 10);
const NOTIFY_SECRET  = Deno.env.get("NOTIFY_SECRET")  ?? "";
const SENDER_EMAIL   = "newsletter@karimsaari.com";
const SENDER_NAME    = "Karim Saari — Dark Massilia";

// ── Template email ────────────────────────────────────────────────────────────

function buildEmailHtml(title: string, excerpt: string, url: string, image: string | null): string {
  const imageBlock = image
    ? `<img src="${image}" alt="${title}" width="560" style="width:100%;max-width:560px;border-radius:12px;display:block;margin:0 auto 28px;">`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0B1C2D;font-family:Inter,Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:48px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:36px;">
      <img
        src="https://karimsaari.com/assets/L3r-UtHN_400x400.jpg"
        alt="Dark Massilia"
        width="64" height="64"
        style="border-radius:50%;background:#ffffff;padding:8px;display:block;margin:0 auto 14px;"
      >
      <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:0;letter-spacing:0.08em;text-transform:uppercase;">
        Nouvel article · Journal de bord
      </p>
    </div>

    <!-- Card -->
    <div style="background:rgba(255,255,255,0.06);border-radius:20px;padding:36px 32px;border:1px solid rgba(255,255,255,0.10);margin-bottom:28px;">
      ${imageBlock}
      <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.35;">
        ${title}
      </h1>
      <p style="color:rgba(255,255,255,0.70);line-height:1.75;margin:0 0 32px;font-size:15px;">
        ${excerpt}
      </p>
      <div style="text-align:center;">
        <a
          href="${url}"
          style="display:inline-block;background:linear-gradient(135deg,#00ABA8 0%,#0091ff 100%);color:#ffffff;text-decoration:none;padding:15px 40px;border-radius:50px;font-weight:600;font-size:16px;letter-spacing:0.01em;"
        >
          Lire l'article →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:0 16px;">
      <p style="color:rgba(255,255,255,0.25);font-size:12px;line-height:1.7;margin:0;">
        <a href="https://karimsaari.com" style="color:#00ABA8;text-decoration:none;">karimsaari.com</a>
        &nbsp;&middot;&nbsp; Marseille, Méditerranée
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // Auth par secret partagé
  const secret = req.headers.get("x-notify-secret");
  if (!NOTIFY_SECRET || secret !== NOTIFY_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { title, excerpt, url, image } = await req.json();

    if (!title || !url) {
      return new Response(JSON.stringify({ error: "title et url requis." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!BREVO_API_KEY) throw new Error("BREVO_API_KEY non configurée.");

    const htmlContent = buildEmailHtml(title, excerpt ?? "", url, image ?? null);

    // 1. Créer la campagne
    const createRes = await fetch("https://api.brevo.com/v3/emailCampaigns", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: `Blog — ${title.slice(0, 80)}`,
        subject: `📖 ${title}`,
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        type: "classic",
        htmlContent,
        recipients: { listIds: [BREVO_LIST_ID] },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Brevo create campaign: ${err}`);
    }

    const { id: campaignId } = await createRes.json();

    // 2. Envoyer immédiatement
    const sendRes = await fetch(
      `https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`,
      {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Accept": "application/json",
        },
      }
    );

    if (!sendRes.ok) {
      const err = await sendRes.text();
      throw new Error(`Brevo sendNow: ${err}`);
    }

    return new Response(JSON.stringify({ success: true, campaignId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
