import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const BREVO_LIST_ID = Deno.env.get("BREVO_LIST_ID");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const PHOTO_URL = "https://karimsaari.com/home/Welcome%20Pack.jpg";
const SENDER_EMAIL = "newsletter@karimsaari.com";
const SENDER_NAME = "Karim Saari — Dark Massilia";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildEmailHtml(photoUrl: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Ton cliché offert — Dark Massilia</title>
</head>
<body style="margin:0;padding:0;background-color:#0B1C2D;font-family:Inter,Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:48px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <img
        src="https://karimsaari.com/assets/L3r-UtHN_400x400.jpg"
        alt="Dark Massilia"
        width="72" height="72"
        style="border-radius:50%;background:#ffffff;padding:8px;display:block;margin:0 auto 16px;"
      >
      <h1 style="color:#00ABA8;font-size:22px;font-weight:700;margin:0 0 4px;letter-spacing:-0.01em;">
        Dark Massilia
      </h1>
      <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">
        Karim Saari &middot; Marseille, Méditerranée
      </p>
    </div>

    <!-- Card principale -->
    <div style="background:rgba(255,255,255,0.06);border-radius:20px;padding:36px 32px;border:1px solid rgba(255,255,255,0.10);margin-bottom:28px;">
      <h2 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 20px;line-height:1.3;">
        Ton cliché est là 🌊
      </h2>
      <p style="color:rgba(255,255,255,0.72);line-height:1.75;margin:0 0 16px;font-size:15px;">
        Merci de rejoindre la communauté Dark Massilia. Tu recevras désormais mes actualités :
        missions de dépollution, coulisses des Calanques, et actions de Team Oxygen pour la Méditerranée.
      </p>
      <p style="color:rgba(255,255,255,0.72);line-height:1.75;margin:0 0 32px;font-size:15px;">
        En cadeau de bienvenue, voici ton cliché exclusif — une image des fonds de la Méditerranée
        à télécharger et à conserver.
      </p>
      <div style="text-align:center;">
        <a
          href="${photoUrl}"
          style="display:inline-block;background:linear-gradient(135deg,#00ABA8 0%,#0091ff 100%);color:#ffffff;text-decoration:none;padding:15px 40px;border-radius:50px;font-weight:600;font-size:16px;letter-spacing:0.01em;"
        >
          ↓ &nbsp;Télécharger mon cliché
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:0 16px;">
      <p style="color:rgba(255,255,255,0.25);font-size:12px;line-height:1.7;margin:0;">
        <a href="https://karimsaari.com/home" style="color:#00ABA8;text-decoration:none;">karimsaari.com</a>
        &nbsp;&middot;&nbsp; Marseille, Méditerranée
      </p>
    </div>

  </div>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    // Validation email basique
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Adresse email invalide." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY non configurée.");
    }

    // 1. Ajouter le contact à Brevo
    const contactBody: Record<string, unknown> = {
      email,
      updateEnabled: true,
    };
    if (BREVO_LIST_ID) {
      contactBody.listIds = [parseInt(BREVO_LIST_ID, 10)];
    }

    const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(contactBody),
    });

    // 409 = contact déjà existant (pas une erreur pour nous)
    if (!contactRes.ok && contactRes.status !== 409) {
      const errText = await contactRes.text();
      throw new Error(`Brevo contacts: ${errText}`);
    }

    // 2. Envoyer l'email de bienvenue avec le lien de téléchargement
    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email }],
        subject: "Ton cliché offert — Dark Massilia 🌊",
        htmlContent: buildEmailHtml(PHOTO_URL),
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      throw new Error(`Brevo email: ${errText}`);
    }

    // 3. Backup dans newsletter_subscribers (ignore les doublons)
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=ignore-duplicates",
        },
        body: JSON.stringify({ email }),
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
