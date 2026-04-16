/**
 * rss-parc-calanques — Proxy RSS Parc National des Calanques
 * Source : https://calanques-parcnational.fr/fr/flux/rss.xml (actualités)
 * Retourne les 9 articles les plus récents, dédupliqués, triés par date.
 */

const RSS_URL = 'https://calanques-parcnational.fr/fr/flux/rss.xml';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Extrait la première URL d'image depuis le HTML encodé de la description */
function extractImage(description: string): string {
  const m = description.match(/src=["']([^"']+calanques-parcnational\.fr[^"']+\.(jpg|jpeg|png|webp)[^"']*)["']/i);
  return m ? m[1] : '';
}

/** Parse un flux RSS/XML brut en tableau d'items */
function parseRss(xml: string) {
  const items: Array<{
    title: string;
    link: string;
    pubDate: string;
    description: string;
    image: string;
  }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title   = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)   || block.match(/<title>(.*?)<\/title>/))?.[1]?.trim()   ?? '';
    const link    = (block.match(/<link>(.*?)<\/link>/)                      )?.[1]?.trim()   ?? '';
    const pubDate = (block.match(/<pubDate>(.*?)<\/pubDate>/)                )?.[1]?.trim()   ?? '';
    const descRaw = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || block.match(/<description>([\s\S]*?)<\/description>/))?.[1] ?? '';

    items.push({ title, link, pubDate, description: '', image: extractImage(descRaw) });
  }

  return items;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const res = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (DarkMassilia RSS Bot)' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`RSS fetch failed: HTTP ${res.status}`);

    const xml = await res.text();
    const raw = parseRss(xml);

    // Déduplique par lien
    const seen = new Set<string>();
    const unique = raw.filter((item) => {
      if (!item.link || seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    });

    // Trie par date décroissante
    unique.sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return db - da;
    });

    const items = unique.slice(0, 9);

    return new Response(JSON.stringify({ status: 'ok', items }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: 'error', message: (err as Error).message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }
});
