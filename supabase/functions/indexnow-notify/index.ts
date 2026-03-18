import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const INDEXNOW_KEY      = "bd8917dee11648b28d95e98c76657f5f";
const INDEXNOW_HOST     = "karimsaari.com";
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/bd8917dee11648b28d95e98c76657f5f.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    let urlList: string[];

    // Format 1 — Appel direct : { urlList: ["https://karimsaari.com/..."] }
    if (Array.isArray(body.urlList) && body.urlList.length > 0) {
      urlList = body.urlList;

    // Format 2 — Webhook WordPress (WP Webhooks plugin)
    // Payload : { post_name: "slug", post_status: "publish", post_type: "post" }
    } else if (body.post_name && body.post_status === "publish") {
      const slug = body.post_name;
      const type = body.post_type || "post";
      // Uniquement les articles (post_type = post)
      if (type !== "post") {
        return new Response(
          JSON.stringify({ skipped: true, reason: `post_type "${type}" ignoré` }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      urlList = [
        `https://${INDEXNOW_HOST}/blog/${slug}`,
        `https://${INDEXNOW_HOST}/blog`,   // réindexer l'index aussi
      ];

    // Format 3 — Webhook Supabase DB : { type: "INSERT", record: { url: "..." } }
    } else if (body.type === "INSERT" && body.record?.url) {
      urlList = [body.record.url];

    } else {
      return new Response(
        JSON.stringify({ error: "Payload invalide. Attendu: { urlList } | WordPress { post_name, post_status } | Supabase { type, record }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filtrer les URLs appartenant à karimsaari.com
    const validUrls = urlList.filter((u) => {
      try {
        return new URL(u).hostname === INDEXNOW_HOST;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: `Toutes les URLs doivent appartenir à ${INDEXNOW_HOST}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const indexNowRes = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: validUrls,
      }),
    });

    const responseText = await indexNowRes.text();

    if (!indexNowRes.ok) {
      throw new Error(`IndexNow API error ${indexNowRes.status}: ${responseText}`);
    }

    console.log(`[IndexNow] ${validUrls.length} URL(s) soumises — status ${indexNowRes.status}`, validUrls);

    return new Response(
      JSON.stringify({ success: true, submitted: validUrls, indexNowStatus: indexNowRes.status }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[IndexNow] Erreur:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
