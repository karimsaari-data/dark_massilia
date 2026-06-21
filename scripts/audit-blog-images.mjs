#!/usr/bin/env node
/**
 * Audit du poids / format des images de cartes du blog
 *
 * Vérifie, pour les derniers articles WordPress, CE QUI EST RÉELLEMENT SERVI
 * au navigateur sur /blog — et notamment si la conversion WebP du front
 * (api.js : `.replace(/\.(png|jpe?g)$/i, '.webp')`) tombe bien sur un fichier
 * existant, ou si elle 404 → fallback sur l'original lourd.
 *
 * Aucun secret requis : lecture publique de l'API REST + requêtes HEAD.
 *
 * Usage :
 *   node scripts/audit-blog-images.mjs            # 20 derniers articles
 *   node scripts/audit-blog-images.mjs --limit 40
 *   node scripts/audit-blog-images.mjs --json     # sortie machine
 *
 * ShortPixel : selon le mode, le WebP est nommé
 *   - photo.webp        (extension remplacée — ce que suppose le front)
 *   - photo.jpg.webp    (extension ajoutée — mode <picture>/fichier séparé)
 *   - photo.jpg         (même URL, WebP servi par négociation .htaccess via Accept)
 * Ce script teste les trois pour lever le doute.
 */

const WP_BASE = 'https://cms.karimsaari.com/wp-json/wp/v2';

const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) || 20 : 20;

const UA = 'dark-massilia-image-audit/1.0';
const KB = (n) => (n == null ? '—' : `${(n / 1024).toFixed(0)} Ko`);

// Reproduit la logique de src principale du front (src/utils/api.js)
function frontMainSrc(media) {
  const sizes = media?.media_details?.sizes;
  const raw =
    sizes?.medium_large?.source_url ??
    sizes?.large?.source_url ??
    media?.source_url ??
    null;
  return raw;
}

function replacedWebp(url) {
  return url ? url.replace(/\.(png|jpe?g)$/i, '.webp') : null;
}
function appendedWebp(url) {
  return url ? url.replace(/(\.(png|jpe?g))$/i, '$1.webp') : null;
}

// HEAD avec un Accept "webp" pour révéler la négociation de contenu .htaccess
async function probe(url, { acceptWebp = false } = {}) {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': UA,
        Accept: acceptWebp ? 'image/webp,image/*,*/*' : 'image/*,*/*',
      },
      redirect: 'follow',
    });
    return {
      status: res.status,
      ok: res.ok,
      type: res.headers.get('content-type'),
      length: res.headers.get('content-length')
        ? parseInt(res.headers.get('content-length'), 10)
        : null,
    };
  } catch (err) {
    return { status: 0, ok: false, error: err.message };
  }
}

async function main() {
  if (!JSON_OUT) console.log(`🔍 Audit images blog — ${LIMIT} derniers articles\n`);

  const res = await fetch(
    `${WP_BASE}/posts?per_page=${LIMIT}&_embed&_fields=id,slug,title,_links,_embedded`,
    { headers: { 'User-Agent': UA, Accept: 'application/json' } },
  );
  if (!res.ok) {
    console.error(`API WP ${res.status} — ${await res.text()}`);
    process.exit(1);
  }
  const posts = await res.json();

  const rows = [];
  for (const post of posts) {
    const media = post._embedded?.['wp:featuredmedia']?.[0];
    const slug = post.slug;
    const raw = frontMainSrc(media);

    if (!raw) {
      rows.push({ slug, status: 'NO_IMAGE' });
      continue;
    }

    const urlReplaced = replacedWebp(raw); // ce que le front demande
    const urlAppended = appendedWebp(raw); // convention ShortPixel courante

    const [orig, origWebpNeg, repl, appn] = await Promise.all([
      probe(raw),                          // original, sans Accept webp
      probe(raw, { acceptWebp: true }),    // original, AVEC Accept webp (négociation ?)
      probe(urlReplaced),                  // photo.webp  (hypothèse du front)
      probe(urlAppended),                  // photo.jpg.webp (hypothèse ShortPixel)
    ]);

    rows.push({
      slug,
      raw,
      urlReplaced,
      urlAppended,
      orig,
      origWebpNeg,
      repl,
      appn,
      // Ce que le navigateur charge VRAIMENT : si .webp existe → lui, sinon fallback original
      served: repl?.ok ? { url: urlReplaced, ...repl } : { url: raw, ...orig },
    });
  }

  if (JSON_OUT) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  // ── Rapport lisible ──────────────────────────────────────────────────────
  let webpReplacedOk = 0, webpAppendedOk = 0, negotiation = 0, heavyFallback = 0;
  const HEAVY = 200 * 1024; // seuil "lourd" pour une vignette de carte

  for (const r of rows) {
    if (r.status === 'NO_IMAGE') {
      console.log(`• ${r.slug}\n    (pas d'image à la une)\n`);
      continue;
    }
    const file = decodeURIComponent(r.raw.split('/').pop());
    const negOk = r.origWebpNeg?.type?.includes('webp');
    if (r.repl?.ok) webpReplacedOk++;
    if (r.appn?.ok) webpAppendedOk++;
    if (negOk) negotiation++;

    const servedWebp = r.served?.type?.includes('webp');
    const servedHeavy = r.served?.length && r.served.length > HEAVY;
    if (!servedWebp && servedHeavy) heavyFallback++;

    console.log(`• ${r.slug}`);
    console.log(`    src front (.webp remplacé) : ${r.repl?.ok ? '✅ 200' : `❌ ${r.repl?.status}`}  ${KB(r.repl?.length)}  ${r.repl?.type || ''}`);
    console.log(`    .jpg.webp (ShortPixel)     : ${r.appn?.ok ? '✅ 200' : `❌ ${r.appn?.status}`}  ${KB(r.appn?.length)}`);
    console.log(`    original ${file}`);
    console.log(`        sans Accept webp       : ${r.orig?.status}  ${KB(r.orig?.length)}  ${r.orig?.type || ''}`);
    console.log(`        avec Accept webp       : ${r.origWebpNeg?.status}  ${KB(r.origWebpNeg?.length)}  ${r.origWebpNeg?.type || ''}  ${negOk ? '← négociation WebP ✅' : ''}`);
    console.log(`    → SERVI au navigateur      : ${KB(r.served?.length)}  ${r.served?.type || ''}  ${servedWebp ? '✅ webp' : (servedHeavy ? '⚠️ LOURD non-webp' : '')}`);
    console.log('');
  }

  const n = rows.filter(r => r.status !== 'NO_IMAGE').length;
  console.log('═══════════════ VERDICT ═══════════════');
  console.log(`Articles audités          : ${n}`);
  console.log(`WebP "remplacé" existe     : ${webpReplacedOk}/${n}  ${webpReplacedOk === n ? '✅' : '← si bas, le front 404 puis fallback'}`);
  console.log(`WebP "ajouté" (.jpg.webp)  : ${webpAppendedOk}/${n}  ${webpAppendedOk > webpReplacedOk ? '← ShortPixel utilise CE nommage' : ''}`);
  console.log(`Négociation .htaccess WebP : ${negotiation}/${n}  ${negotiation === n ? '✅ l\'original sert déjà du WebP' : ''}`);
  console.log(`Fallback lourd (>200Ko, non-webp) : ${heavyFallback}/${n}  ${heavyFallback ? '⚠️ source de lenteur' : '✅'}`);
  console.log('');
  console.log('Lecture :');
  console.log('  - "remplacé" bas + "ajouté" haut  → corriger api.js : .jpg → .jpg.webp');
  console.log('  - "remplacé" bas + négociation OK → enlever la conversion, laisser l\'URL d\'origine');
  console.log('  - fallback lourd élevé            → c\'est la cause de la lenteur perçue');
}

main().catch((e) => {
  console.error('Erreur:', e.message);
  process.exit(1);
});
