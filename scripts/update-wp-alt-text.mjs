/**
 * update-wp-alt-text.mjs
 * Met à jour les alt text des images WordPress via l'API REST.
 *
 * Critères de mise à jour :
 *  - alt_text vide ou absent
 *  - alt_text commençant par "Image -" (généré par ShortPixel, trop générique)
 *  - nom de fichier de type Facebook (chiffres_chiffres) ou WhatsApp
 *
 * Usage :
 *   node scripts/update-wp-alt-text.mjs          → dry-run (affiche sans modifier)
 *   node scripts/update-wp-alt-text.mjs --apply  → applique les modifications
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Charge .env.local depuis la racine du projet (deux niveaux au-dessus du worktree)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '../../../..');
const envPaths  = [
  path.join(root, '.env.local'),
  path.join(root, '.env'),
  path.resolve(__dirname, '..', '.env.local'),
  path.resolve(__dirname, '..', '.env'),
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf-8').replace(/\r/g, '').split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
    console.log(`  📄 env chargé depuis ${envPath}`);
  }
}

const WP_BASE   = 'https://cms.karimsaari.com/wp-json/wp/v2';
const WP_USER   = process.env.WP_USER;
const WP_PASS   = (process.env.WP_APP_PASSWORD || '').replace(/\s/g, '');
const AUTH      = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
const DRY_RUN   = !process.argv.includes('--apply');

if (!WP_USER || !WP_PASS) {
  console.error('❌  WP_USER ou WP_APP_PASSWORD manquant dans .env.local');
  process.exit(1);
}

// ── Alt text manuels par slug d'article ──────────────────────────────────────
// Format : [Ce qu'on voit] — [Contexte/lieu] — © Karim Saari
const ALT_BY_POST_SLUG = {
  'calanques-propres-2026-un-elan-collectif-exceptionnel-pour-proteger-notre-littoral':
    'Équipe Team Oxygen et bénévoles avec équipements de plongée — Calanques Propres 2026, Marseille — © Karim Saari',

  'le-fleau-des-bonbonnes-de-protoxyde-dazote-une-menace-sous-estimee-pour-notre-sante-et-nos-espaces-naturels':
    'Bonbonnes de protoxyde d\'azote abandonnées sur le sol — Calanques de Marseille — © Karim Saari',

  'city-nature-challenge-2026-relevez-le-defi-de-la-biodiversite-avec-marseille':
    'Observation d\'espèces sauvages en bord de mer — City Nature Challenge 2026, Marseille — © Karim Saari',

  'balades-et-travaux-en-foret-dans-les-bouches-du-rhone-tout-savoir-sur-la-reglementation-estivale':
    'Panneau d\'interdiction d\'accès aux massifs forestiers risque incendie — Bouches-du-Rhône — © Karim Saari',

  'depollution-au-j4-quand-plastic-odyssey-reunit-marseille-pour-nettoyer-ce-qui-se-cache-sous-la-surface':
    'Plongeurs récupérant des déchets sous-marins au pied du J4 — Vieux-Port de Marseille — © Karim Saari',

  'le-poulpe-des-calanques-lanimal-le-plus-intelligent-que-vous-croiserez-sous-leau':
    'Poulpe commun posé sur les rochers en apnée — Calanques de Marseille — © Karim Saari',

  'a-la-decouverte-des-parcs-nationaux-de-france-sanctuaires-de-nature-et-territoires-de-vie':
    'Falaises calcaires et mer turquoise du Parc national — Calanques de Marseille — © Karim Saari',

  'decouverte-des-sentiers-les-especes-communes-qui-parfument-et-colorent-les-calanques':
    'Fleurs sauvages et garrigue en fleur sur les sentiers — Calanques de Marseille — © Karim Saari',

  'proteger-notre-grande-bleue-4-gestes-simples-pour-sauver-la-mediterranee':
    'Déchets plastiques flottant en surface de mer — Méditerranée, Marseille — © Karim Saari',

  'tresors-caches-et-perils-la-biodiversite-des-calanques-sous-haute-surveillance':
    'Faune marine colorée sur les fonds rocheux — Calanques de Marseille — © Karim Saari',

  'le-sanglier-des-calanques-un-acteur-discret-mais-central-de-lecosysteme':
    'Sanglier dans la garrigue du massif — Parc national des Calanques, Marseille — © Karim Saari',

  'calanques-propres-2026-cap-sur-la-23eme-edition-du-grand-nettoyage-citoyen-et-scientifique':
    'Bénévoles ramassant des déchets sur le littoral — Calanques de Marseille, 23ème édition — © Karim Saari',

  'alerte-dans-les-calanques-linvasion-silencieuse-de-lalgue-rugulopteryx-okamurae':
    'Tapis d\'algues invasives Rugulopteryx okamurae sur les fonds — Calanques de Marseille — © Karim Saari',

  'de-cortiou-a-epluchures-beach-pourquoi-la-plage-de-lhuveaune-ferme-ses-portes-pour-un-an':
    'Plage polluée de l\'Huveaune à Cortiou avec déchets en bord de mer — Marseille — © Karim Saari',

  'le-paradoxe-de-cortiou-une-calanque-au-bout-du-tuyau-de-la-ville':
    'Eaux troubles et déchets au débouché de l\'Huveaune — Calanque de Cortiou, Marseille — © Karim Saari',

  'la-posidonie-notre-meilleure-arme-sous-marine-contre-le-changement-climatique':
    'Herbier de posidonie ondulant sous l\'eau en apnée — Méditerranée, Calanques de Marseille — © Karim Saari',

  'le-demarketing-ou-comment-le-parc-des-calanques-vous-incite-a-ne-pas-venir':
    'Sentier du Parc national des Calanques avec panneau de gestion des flux — Marseille — © Karim Saari',

  'mediterranee-rouge-sur-le-plastique-et-pourquoi-il-est-urgent-dagir':
    'Déchets plastiques et emballages flottant en mer — Méditerranée, Marseille — © Karim Saari',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function needsUpdate(media, newAlt) {
  // Met à jour toutes les images qui ont un mapping ET dont l'alt diffère déjà
  if (!newAlt) return false;
  return (media.alt_text || '').trim() !== newAlt.trim();
}

async function wpGet(path) {
  const res = await fetch(`${WP_BASE}${path}`, {
    headers: { Authorization: `Basic ${AUTH}` },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

async function wpPatch(id, data) {
  const res = await fetch(`${WP_BASE}/media/${id}`, {
    method:  'POST',
    headers: {
      Authorization:  `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH media/${id} → ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Récupère le slug de l'article parent d'un média ──────────────────────────
const postSlugCache = new Map();
async function getPostSlug(postId) {
  if (!postId) return null;
  if (postSlugCache.has(postId)) return postSlugCache.get(postId);
  try {
    const post = await wpGet(`/posts/${postId}?_fields=slug`);
    postSlugCache.set(postId, post.slug);
    return post.slug;
  } catch {
    return null;
  }
}

// ── Récupère tous les médias (pagination) ────────────────────────────────────
async function fetchAllMedia() {
  const all = [];
  let page  = 1;
  while (true) {
    const items = await wpGet(`/media?per_page=100&page=${page}&_fields=id,alt_text,source_url,post,title`);
    if (!items.length) break;
    all.push(...items);
    if (items.length < 100) break;
    page++;
  }
  return all;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🖼  Mise à jour alt text WordPress — ${DRY_RUN ? 'DRY RUN (--apply pour appliquer)' : 'MODE APPLY'}\n`);

  const allMedia = await fetchAllMedia();
  console.log(`  📦 ${allMedia.length} médias récupérés\n`);

  let updated = 0, skipped = 0, noMatch = 0;

  for (const media of allMedia) {
    const postSlug = await getPostSlug(media.post);
    const newAlt   = postSlug ? ALT_BY_POST_SLUG[postSlug] : null;

    if (!needsUpdate(media, newAlt)) { skipped++; continue; }

    if (!newAlt) {
      noMatch++;
      continue;
    }

    const filename = media.source_url.split('/').pop();
    console.log(`  ${DRY_RUN ? '🔍' : '✅'} media ${media.id} (${filename})`);
    console.log(`     ancien : "${media.alt_text || '(vide)'}"`);
    console.log(`     nouveau: "${newAlt}"\n`);

    if (!DRY_RUN) {
      await wpPatch(media.id, { alt_text: newAlt });
      updated++;
    } else {
      updated++;
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`  À mettre à jour : ${updated}`);
  console.log(`  Déjà OK         : ${skipped}`);
  console.log(`  Sans mapping    : ${noMatch}`);
  if (DRY_RUN) console.log(`\n  👆 Relance avec --apply pour appliquer.`);
  console.log('');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
