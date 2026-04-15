/**
 * agenda-parc-calanques — Scrape de l'agenda du Parc National des Calanques
 * Source : https://calanques-parcnational.fr/fr/agenda
 * Retourne les prochains événements avec image, titre, date, lieu, lien.
 */

const AGENDA_URL = 'https://calanques-parcnational.fr/fr/agenda';
const BASE_URL   = 'https://calanques-parcnational.fr';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function parseAgenda(html: string) {
  const items: Array<{
    title: string;
    link: string;
    day: string;
    month: string;
    adverb: string;
    location: string;
    image: string;
    category: string;
  }> = [];

  const articleRegex = /<div[^>]+views-row[^>]*>([\s\S]*?)<\/article>/g;
  let match;

  while ((match = articleRegex.exec(html)) !== null) {
    const block = match[1];

    const linkMatch     = block.match(/href="(\/fr\/agenda\/[^"]+)"/);
    const titleMatch    = block.match(/<h3[^>]*class="card-title"[^>]*>\s*([\s\S]*?)\s*<\/h3>/);
    const imageMatch    = block.match(/<img[^>]+src="([^"]+)"[^>]*class="figure-img/);
    const dayMatch      = block.match(/<div[^>]*class="event-date-day"[^>]*>\s*(\d+)\s*<\/div>/);
    const monthMatch    = block.match(/<div[^>]*class="event-date-month"[^>]*>\s*(\w+)\s*<\/div>/);
    const adverbMatch   = block.match(/<div[^>]*class="event-date-adverb"[^>]*>\s*([\s\S]*?)\s*<\/div>/);
    const locationMatch = block.match(/<div[^>]*class="event-location"[^>]*>\s*([\s\S]*?)\s*<\/div>/);
    const categoryMatch = block.match(/<div[^>]*class="event-category"[^>]*>\s*([\s\S]*?)\s*<\/div>/);

    if (!linkMatch || !titleMatch) continue;

    const link = `${BASE_URL}${linkMatch[1]}`;
    items.push({
      title:    titleMatch[1].replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(),
      link,
      day:      dayMatch?.[1]?.trim() ?? '',
      month:    monthMatch?.[1]?.trim() ?? '',
      adverb:   adverbMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '',
      location: locationMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '',
      image:    imageMatch?.[1] ?? '',
      category: categoryMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '',
    });
  }

  // Déduplique par lien
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  }).slice(0, 6);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const res = await fetch(AGENDA_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DarkMassilia/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status}`);

    const html = await res.text();
    const items = parseAgenda(html);

    if (items.length === 0) throw new Error('Aucun événement trouvé dans le HTML');

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
