import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCardHover } from '../hooks/useCardHover';
import { ArrowLeft, ArrowRight, Trash2, Fish, ClipboardList } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
// Référence Fancybox — peuplée dynamiquement côté client uniquement
let _FB = null;
const getFB = () => _FB;
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import { supabase } from '../lib/supabase';
import Breadcrumb from '../components/Breadcrumb';

const depollutionPaths = [
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-apneiste.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-1.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-2.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-3.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-4.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-6.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-8.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bache.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-barrière.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bateau.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bouteille.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-canette.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-déchets.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-escargot.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-fonds-marins.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-1.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-4.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-8.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-goudes-esprit-equipe-fight.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte-riou.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-huveaune.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-kayak-boudmer.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mer-de-plastique.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-morgan-bourchis.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-moyades-romuald.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-moyades.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-1.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-2.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-vie-marine.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-nage-calanque.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-nage.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-plaque-immatriculation.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-pollution-huveaune.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poséidon.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-shooting-cave.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-shooting.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-soupe-plastique.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen-freediving.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-vélo-métropole.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-vélo.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-angel.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-7.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-diving.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-7.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-9.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mer-goudes.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée-subaquatique.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-3.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-octopus.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-paysage-sous-marin.webp",
  "/images/photographe-sous-marin-marseille-depollution-posidonie-apnee-projet-sentinelle.webp",
  "/images/photographe-sous-marin-marseille-mission-depollution-projet-sentinelle.webp",
  "/images/photographe-sous-marin-marseille-fonds-marins-calanques-apnee.webp",
  "/images/photographe-sous-marin-marseille-apneiste-competition-certification.webp",
  "/images/photographe-sous-marin-marseille-morgan-bourchis-triple-champion-monde-apnee-depollution-sentinelle.webp",
  "/images/photographe-sous-marin-marseille-plongeurs-fonds-marins-mediterranee.webp",
  "/images/photographe-sous-marin-marseille-apneiste-exploration-fonds-marins.webp",
  "/images/marseille-dark-massilia-depollution-maritime-calanques-projet-sentinelle.webp",
  "/images/marseille-dark-massilia-depollution-pneu-port-goudes-projet-sentinelle.webp",
  "/images/marseille-dark-massilia-operation-sentinelle-kayak-dechets-calanques.webp",
  "/images/marseille-dark-massilia-photo-sous-marine-depollution-team-oxygen.webp",
  "/images/marseille-dark-massilia-port-goudes-depollution-apnee-projet-sentinelle.webp",
  "/images/marseille-dark-massilia-projet-sentinelle-caracterisation-dechets.webp",
  "/images/marseille-dark-massilia-tf1-reportage-projet-sentinelle-depollution.webp",
];

const biodiversitePaths = [
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-5.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-spirographe.webp",
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poulpe.webp",
];

const getAltText = (src) => {
  const filename = src.split('/').pop().replace('.webp', '');
  const descriptor = filename
    .replace('Marseille-dark-massilia-plastique-pollution-projet-sentinelle-', '')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ');
  const cap = descriptor.charAt(0).toUpperCase() + descriptor.slice(1);
  return `Mission Projet Sentinelle Marseille — ${cap} — © Karim Saari, photographe sous-marin Marseille`;
};

const getLieu = (src) => {
  if (/frioul/i.test(src))               return 'Archipel du Frioul, Marseille';
  if (/goudes/i.test(src))               return 'Les Goudes, Marseille';
  if (/riou/i.test(src))                 return 'Île de Riou, Marseille';
  if (/subaquatique|mus.e/i.test(src))   return 'Musée Subaquatique Méditerranée';
  if (/huveaune/i.test(src))             return 'Huveaune, Marseille';
  if (/boudmer/i.test(src))              return 'Calanque de Boudmer';
  if (/moyades/i.test(src))              return 'Îles des Moyades';
  if (/sormiou/i.test(src))              return 'Calanque de Sormiou';
  if (/vallon/i.test(src))               return 'Vallon des Auffes, Marseille';
  return 'Calanques de Marseille';
};

/* ─── URL Google Maps : coordonnées exactes ou recherche textuelle ─── */
const mapsUrl = ({ lat, lng, lieu }) => {
  if (lat && lng) return `https://maps.google.com/?q=${lat},${lng}&z=13`;
  const q = lieu ? `${lieu}, Marseille, France` : 'Calanques de Marseille, France';
  return `https://maps.google.com/?q=${encodeURIComponent(q)}`;
};

const depollDims = {
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-apneiste.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-1.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-2.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-3.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-4.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-6.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-8.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bache.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-barrière.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bateau.webp":[1920,1105],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-bouteille.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-canette.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-déchets.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-escargot.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-fonds-marins.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-1.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-4.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-8.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-goudes-esprit-equipe-fight.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte-riou.webp":[1920,1155],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte.webp":[1920,1105],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-huveaune.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-kayak-boudmer.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mer-de-plastique.webp":[1920,1105],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-morgan-bourchis.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-moyades-romuald.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-moyades.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée.webp":[1920,1247],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-1.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-2.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-vie-marine.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-nage-calanque.webp":[1920,1105],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-nage.webp":[1920,1105],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-plaque-immatriculation.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-pollution-huveaune.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poséidon.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-shooting-cave.webp":[1920,1155],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-shooting.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-soupe-plastique.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen-freediving.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-vélo-métropole.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-vélo.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-angel.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-7.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-diving.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-7.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-frioul-9.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mer-goudes.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée-subaquatique.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-musée_subaquatique-3.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-octopus.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-paysage-sous-marin.webp":[1920,1105],
  "/images/photographe-sous-marin-marseille-depollution-posidonie-apnee-projet-sentinelle.webp":[3000,1750],
  "/images/photographe-sous-marin-marseille-mission-depollution-projet-sentinelle.webp":[1920,1440],
  "/images/photographe-sous-marin-marseille-fonds-marins-calanques-apnee.webp":[1920,1440],
  "/images/photographe-sous-marin-marseille-apneiste-competition-certification.webp":[3000,1750],
  "/images/photographe-sous-marin-marseille-morgan-bourchis-triple-champion-monde-apnee-depollution-sentinelle.webp":[3000,1970],
  "/images/photographe-sous-marin-marseille-plongeurs-fonds-marins-mediterranee.webp":[3000,1750],
  "/images/photographe-sous-marin-marseille-apneiste-exploration-fonds-marins.webp":[1920,1440],
  "/images/marseille-dark-massilia-depollution-maritime-calanques-projet-sentinelle.webp":[2048,1536],
  "/images/marseille-dark-massilia-depollution-pneu-port-goudes-projet-sentinelle.webp":[2048,1152],
  "/images/marseille-dark-massilia-operation-sentinelle-kayak-dechets-calanques.webp":[2048,1152],
  "/images/marseille-dark-massilia-photo-sous-marine-depollution-team-oxygen.webp":[1152,2048],
  "/images/marseille-dark-massilia-port-goudes-depollution-apnee-projet-sentinelle.webp":[2048,1536],
  "/images/marseille-dark-massilia-projet-sentinelle-caracterisation-dechets.webp":[3884,2136],
  "/images/marseille-dark-massilia-tf1-reportage-projet-sentinelle-depollution.webp":[4000,2252],
};

const biodivDims = {
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-archipel-frioul-barquette-5.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-spirographe.webp":[1920,1312],
  "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poulpe.webp":[1920,1216],
};

const baseDepollution = depollutionPaths.map((src, i) => {
  const lieu = getLieu(src);
  const [width, height] = depollDims[src] || [1920, 1312];
  return { uid: `depoll-${i}`, src, alt: getAltText(src), lieu, maps: mapsUrl({ lieu }), width, height };
});

const baseBiodiversite = biodiversitePaths.map((src, i) => {
  const lieu = getLieu(src);
  const [width, height] = biodivDims[src] || [1920, 1312];
  return { uid: `biodiv-${i}`, src, alt: getAltText(src), lieu, maps: mapsUrl({ lieu }), width, height };
});

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ─── Modal de partage centré ──────────────────────────────── */
const SHARE_ICONS = {
  facebook:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  twitter:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  pinterest: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>`,
  whatsapp:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
  copy:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
};

function showShareMenu(_triggerEl, slide) {
  document.querySelector('.fb-share-overlay')?.remove();
  if (!slide) return;

  const uid  = slide.triggerEl?.getAttribute('data-uid')  || '';
  const slug = slide.triggerEl?.getAttribute('data-slug') || uid;
  const alt  = slide.alt || slide.triggerEl?.getAttribute('data-caption') || '';
  const src  = slide.src || '';

  const relayUrl    = `https://karimsaari.com/p/${encodeURIComponent(slug)}`;
  const imageAbsUrl = `https://karimsaari.com${src}`;
  const shareText   = `📸 ${alt} — Karim Saari, photographe Marseille`;
  const enc = (s) => encodeURIComponent(s);

  const overlay = document.createElement('div');
  overlay.className = 'fb-share-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '99999',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
    fontFamily: 'system-ui, sans-serif',
  });

  const box = document.createElement('div');
  Object.assign(box.style, {
    background: '#faf8f4', border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '20px', padding: '32px 32px 28px',
    width: '340px', maxWidth: 'calc(100vw - 32px)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.7)', position: 'relative',
  });

  const header = document.createElement('div');
  Object.assign(header.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' });
  const titleEl = document.createElement('p');
  titleEl.textContent = 'Partager';
  Object.assign(titleEl.style, { color: '#1a1a2e', fontWeight: '700', fontSize: '16px', margin: '0' });
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  Object.assign(closeBtn.style, { background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(0,0,0,0.5)', flexShrink: '0' });
  closeBtn.addEventListener('click', () => overlay.remove());
  header.appendChild(titleEl); header.appendChild(closeBtn);
  box.appendChild(header);

  const grid = document.createElement('div');
  Object.assign(grid.style, { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '18px' });

  const socialItems = [
    { label: 'Facebook',    icon: SHARE_ICONS.facebook,  bg: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${enc(relayUrl)}` },
    { label: 'X',           icon: SHARE_ICONS.twitter,   bg: '#000000', url: `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(relayUrl)}&via=dark_massilia` },
    { label: 'Pinterest',   icon: SHARE_ICONS.pinterest, bg: '#E60023', url: `https://pinterest.com/pin/create/button/?url=${enc(relayUrl)}&media=${enc(imageAbsUrl)}&description=${enc(shareText)}` },
  ];

  socialItems.forEach(({ label, icon, bg, url }) => {
    const btn = document.createElement('a');
    btn.href = url; btn.target = '_blank'; btn.rel = 'noopener noreferrer';
    btn.innerHTML = icon;
    btn.title = label;
    Object.assign(btn.style, {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '52px', height: '52px', borderRadius: '12px', background: bg,
      color: '#fff', textDecoration: 'none', transition: 'opacity 0.15s',
    });
    btn.addEventListener('mouseover', () => { btn.style.opacity = '0.85'; });
    btn.addEventListener('mouseout',  () => { btn.style.opacity = '1'; });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(url, '_blank', 'noopener,noreferrer');
      overlay.remove();
    });
    grid.appendChild(btn);
  });
  box.appendChild(grid);

  const copyRow = document.createElement('div');
  Object.assign(copyRow.style, { display: 'flex', gap: '8px', alignItems: 'center' });
  const urlInput = document.createElement('input');
  urlInput.value = relayUrl; urlInput.readOnly = true;
  Object.assign(urlInput.style, {
    flex: '1', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.10)',
    borderRadius: '10px', padding: '8px 12px', color: 'rgba(0,0,0,0.45)',
    fontSize: '11px', fontFamily: 'monospace', outline: 'none',
  });
  urlInput.addEventListener('click', () => urlInput.select());
  const copyBtn = document.createElement('button');
  copyBtn.innerHTML = `${SHARE_ICONS.copy}<span>Copier</span>`;
  Object.assign(copyBtn.style, {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '10px', background: 'rgba(33,196,123,0.15)',
    border: '1px solid rgba(33,196,123,0.4)', color: '#21c47b',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer', flexShrink: '0', whiteSpace: 'nowrap',
  });
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(relayUrl); }
    catch {
      const t = document.createElement('textarea');
      t.value = relayUrl; document.body.appendChild(t); t.select();
      document.execCommand('copy'); document.body.removeChild(t);
    }
    copyBtn.innerHTML = `${SHARE_ICONS.copy}<span>Copié !</span>`;
    copyBtn.style.color = '#fff';
    setTimeout(() => overlay.remove(), 1200);
  });
  copyRow.appendChild(urlInput); copyRow.appendChild(copyBtn);
  box.appendChild(copyRow);

  overlay.appendChild(box);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  const fbContainer = getFB()?.getInstance?.()?.getContainer?.();
  (fbContainer || document.body).appendChild(overlay);
}

/* ─── Config Fancybox ──────────────────────────────────────── */
const buildOpts = () => ({
  Hash: false,
  on: {
    initSlides(fancybox) {
      const opts = fancybox.getOptions();
      if (!opts.Carousel) opts.Carousel = {};
      opts.Carousel.captionEl = null;
      // Caption formatée : info gauche (titre + lieu) + bouton Commander droite
      opts.Carousel.formatCaption = (_fb, slide) => {
        const lieu    = slide.caption || '';
        const title   = slide.triggerEl?.dataset?.title || '';
        const mapsHref = slide.triggerEl?.dataset?.maps || '';
        const pin = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
        const uid       = slide.triggerEl?.dataset?.uid || '';
        const titleHtml = title ? `<span class="fb-caption-title">${title}</span>` : '';
        const lieuHtml  = lieu
          ? mapsHref
            ? `<a class="fb-caption-lieu fb-caption-maps" href="${mapsHref}" target="_blank" rel="noopener" title="Voir sur Google Maps">${pin}${lieu}</a>`
            : `<span class="fb-caption-lieu">${pin}${lieu}</span>`
          : '';
        const cartIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
        const buyBtn = `<button class="fb-caption-buy" data-uid="${uid}" data-title="${title}" title="Demander l'utilisation">${cartIcon}<span>Demander l'utilisation</span></button>`;
        const mapIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`;
        const mapBtn = uid ? `<button class="fb-caption-map" data-map-uid="${uid}" title="Voir sur la carte">${mapIcon}<span>Voir sur la carte</span></button>` : '';
        return `<span class="fb-caption-wrapper"><span class="fb-caption-info">${titleHtml}${lieuHtml}</span><span style="display:inline-flex;gap:6px;align-items:center;flex-shrink:0">${mapBtn}${buyBtn}</span></span>`;
      };
    },
    initLayout(fancybox) {
      const c = fancybox.getContainer();
      if (!c) return;
      // Clic sur l'icône panier dans la caption
      c.addEventListener('click', (e) => {
        const mapBtn = e.target.closest('.fb-caption-map');
        if (mapBtn) {
          e.stopPropagation();
          e.preventDefault();
          const uid = mapBtn.dataset.mapUid || '';
          if (uid) window.dispatchEvent(new CustomEvent('carte-navigate', { detail: `/carte-photos?photo=${encodeURIComponent(uid)}` }));
          return;
        }
        const btn = e.target.closest('.fb-caption-buy');
        if (!btn) return;
        const uid   = btn.dataset.uid || '';
        const title = btn.dataset.title || '';
        const [cat, num] = uid.split('-');
        const parts = [`catégorie ${cat || uid}`, num ? `numéro ${num}` : null, title || null].filter(Boolean);
        const subject = encodeURIComponent(`Demande d'utilisation : ${parts.join(' - ')}`);
        window.location.href = `mailto:commande@karimsaari.com?subject=${subject}`;
      });
      // Protection clic droit sur les images
      c.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.fancybox__slide')) e.preventDefault();
      });
    },
  },
  Carousel: {
    Thumbs: false,
    Autoplay: {
      playOnStart: false,
      timeout: 3000,
    },
    Toolbar: {
      display: {
        left:   ['counter'],
        middle: [],
        right:  ['autoplay', 'share', 'fullscreen', 'close'],
      },
      items: {
        share: {
          tpl: `<button class="f-button" title="Partager">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>`,
          click: (carousel, event) => {
            const slide = getFB()?.getSlide?.() || carousel.getPage()?.slides?.[0];
            showShareMenu(event?.currentTarget || event?.target?.closest('.f-button'), slide);
          },
        },
        fullscreen: {
          tpl: `<button class="f-button" title="Plein écran" data-fullscreen-action="toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <g class="full-exit"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></g>
              <g class="full-enter"><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g>
            </svg>
          </button>`,
        },
      },
    },
  },
  l10n: {
    CLOSE:  'Fermer',
    NEXT:   'Suivant',
    PREV:   'Précédent',
    TOGGLE_FS:      'Plein écran',
    TOGGLE_SIDEBAR: 'Vignettes',
  },
});

/* ─── Composants utilitaires ───────────────────────────────── */
const SectionTitle = ({ icon: Icon, title, count }) => (
  <motion.div variants={FADE_IN_UP} className="flex items-center gap-3 mb-8">
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6 text-ocean-teal" aria-hidden="true" />
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <span className="text-sm text-white/70 font-medium">({count})</span>
    </div>
    <div className="flex-1 h-px bg-white/10 ml-2" />
  </motion.div>
);

/* ─── Thumbnail 800px pour la grille ──────────────────────── */
const toThumbSrc = (src) => {
  if (!src) return src;
  // /images/portfolio/New/foo.webp → /images/portfolio/New/800w/foo.webp
  if (src.startsWith('/images/portfolio/New/')) {
    return src.replace('/images/portfolio/New/', '/images/portfolio/New/800w/');
  }
  // /images/foo.webp → /images/800w/foo.webp
  return src.replace(/^\/images\/([^/]+\.webp)$/, '/images/800w/$1');
};

/* ─── Grille photos ────────────────────────────────────────── */
const PhotoGrid = ({ images, gallery }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
  <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
    {images.filter(image => image.src).map((image, index) => {
      const thumbSrc = toThumbSrc(image.src) || image.src;
      const thumbW = Math.min(image.width || 800, 800);
      const thumbH = image.height ? Math.round(image.height * (thumbW / (image.width || 800))) : undefined;
      // Titre descriptif en priorité sur le lieu pour le SEO et l'overlay
      const caption = image.title || null;
      // Entrance animation uniquement sur les 12 premières images (fold visible)
      const Tag = (!prefersReducedMotion && index < 12) ? motion.figure : 'figure';
      const motionProps = (!prefersReducedMotion && index < 12) ? {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.1 },
        transition: { duration: 0.4, ease: 'easeOut', delay: (index % 4) * 0.06 },
      } : {};
      return (
      <Tag key={image.uid} className="break-inside-avoid mb-4" {...motionProps}>
        <a
          href={image.src}
          data-fancybox={gallery}
          data-caption={image.lieu || image.alt}
          data-title={image.title || ''}
          data-uid={image.uid}
          data-slug={image.slug || image.uid}
          data-maps={image.maps}
          data-thumb={thumbSrc}
          className="block w-full cursor-pointer relative overflow-hidden rounded-xl focus-ring group"
          aria-label={`Ouvrir la photo : ${image.alt}`}
        >
          <img
            src={thumbSrc}
            srcSet={`${thumbSrc} 800w`}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            alt={image.alt}
            width={thumbW}
            height={thumbH}
            className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading={index < 4 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
            decoding="async"
          />
          {/* Overlay au survol — gradient + titre, tronqué à 2 lignes max */}
          {caption && (
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none"
              aria-hidden="true"
            >
              <span className="text-white text-[11px] font-medium leading-snug line-clamp-2">
                {caption}
              </span>
            </div>
          )}
        </a>
        {/* Figcaption : titre descriptif pour le SEO, tronqué à 1 ligne */}
        {caption && (
          <figcaption
            className="text-xs text-gray-500 mt-1 px-1 truncate"
            title={caption}
          >
            {caption}
          </figcaption>
        )}
      </Tag>
      );
    })}
  </div>
  );
};

/* ─── Composant principal ─────────────────────────────────── */
const PhotoSousMarine = () => {
  const cardHover = useCardHover();
  const navigate = useNavigate();
  const [depollImages, setDepollImages] = useState(baseDepollution);
  const [biodivImages, setBiodivImages] = useState(baseBiodiversite);
  const [caracImages, setCaracImages] = useState([]);
  const [searchParams] = useSearchParams();
  const deepLinkDone = useRef(false);

  // Écoute le custom event émis depuis le handler Fancybox (hors contexte React)
  useEffect(() => {
    const handler = (e) => {
      getFB()?.close();
      navigate(e.detail, { replace: false });
    };
    window.addEventListener('carte-navigate', handler);
    return () => window.removeEventListener('carte-navigate', handler);
  }, [navigate]);

  // Fetch Supabase — remplace les données statiques si disponible
  useEffect(() => {
    supabase
      .from('photos_sous_marine')
      .select('uid, src, alt, title, lieu, lat, lng, slug, categorie, visible')
      .eq('visible', true)
      .order('uid')
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const withMaps = data
          .filter(p => p.src && p.src.trim())
          .map(p => ({ ...p, maps: mapsUrl({ lat: p.lat, lng: p.lng, lieu: p.lieu }) }));
        const depoll = withMaps.filter(p => p.categorie === 'depollution');
        const biodiv = withMaps.filter(p => p.categorie === 'biodiversite');
        const carac  = withMaps.filter(p => p.categorie === 'caracterisation');
        if (depoll.length) setDepollImages(shuffle(depoll));
        if (biodiv.length) setBiodivImages(shuffle(biodiv));
        if (carac.length)  setCaracImages(shuffle(carac));
      });
  }, []);

  // Shuffle côté client uniquement (après hydration SSR)
  useEffect(() => {
    setDepollImages(shuffle(baseDepollution));
    setBiodivImages(shuffle(baseBiodiversite));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bind / unbind Fancybox (import dynamique — SSR safe)
  useEffect(() => {
    let FB;
    Promise.all([
      import('@fancyapps/ui'),
      import('@fancyapps/ui/dist/fancybox/fancybox.css'),
    ]).then(([mod]) => {
      FB = mod.Fancybox;
      _FB = FB;
      FB.bind('[data-fancybox="gallery-depollution"]', buildOpts());
      FB.bind('[data-fancybox="gallery-biodiversite"]', buildOpts());
      FB.bind('[data-fancybox="gallery-caracterisation"]', buildOpts());
    }).catch(err => console.error('[Fancybox] Erreur chargement galerie sous-marine :', err));
    return () => {
      FB?.unbind('[data-fancybox="gallery-depollution"]');
      FB?.unbind('[data-fancybox="gallery-biodiversite"]');
      FB?.unbind('[data-fancybox="gallery-caracterisation"]');
      FB?.close();
    };
  }, []);

  // Deep-link : ouvre directement la photo ciblée via ?photo=uid (partage Pinterest / Facebook)
  useEffect(() => {
    const uid = searchParams.get('photo');
    if (!uid || deepLinkDone.current) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-uid="${uid}"]`);
      if (el) {
        deepLinkDone.current = true;
        el.click();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchParams, depollImages, biodivImages, caracImages]);

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/photographie-sous-marine']} />
      <div className="container-custom">
        <Breadcrumb label="Photographe Sous-Marin — Galerie" />

        {/* H1 SEO */}
        <div className="flex items-stretch gap-4 mb-6">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
            style={{ transformOrigin: 'top' }}
            className="w-[3px] bg-ocean-teal rounded-full flex-shrink-0"
            aria-hidden="true"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-2xl font-bold text-white leading-tight"
          >
            Photographe sous-marin à Marseille — Documenter pour alerter
          </motion.h1>
        </div>

        {/* Raccourcis catégories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {[
            { href: '#depollution', icon: <Trash2 className="w-4 h-4" />, label: 'Actions de dépollution' },
            { href: '#biodiversite', icon: <Fish className="w-4 h-4" />, label: 'Biodiversité' },
            { href: '#caracterisation', icon: <ClipboardList className="w-4 h-4" />, label: 'Caractérisation' },
          ].map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                         bg-white/5 border border-white/15 text-text-secondary
                         hover:bg-ocean-teal/10 hover:border-ocean-teal/40 hover:text-ocean-teal
                         transition-colors duration-200"
            >
              {icon}
              {label}
            </a>
          ))}
        </motion.div>

        {/* Section Actions de dépollution */}
        <motion.div
          id="depollution"
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16 scroll-mt-8"
        >
          <SectionTitle icon={Trash2} title="Actions de dépollution" count={depollImages.length} />
          <PhotoGrid images={depollImages} gallery="gallery-depollution" />
        </motion.div>

        {/* Section Biodiversité */}
        <motion.div
          id="biodiversite"
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16 scroll-mt-8"
        >
          <SectionTitle icon={Fish} title="Biodiversité" count={biodivImages.length} />
          <PhotoGrid images={biodivImages} gallery="gallery-biodiversite" />
        </motion.div>

        {/* Section Caractérisation */}
        {caracImages.length > 0 && (
          <motion.div
            id="caracterisation"
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
            className="mb-16 scroll-mt-8"
          >
            <SectionTitle icon={ClipboardList} title="Caractérisation" count={caracImages.length} />
            <PhotoGrid images={caracImages} gallery="gallery-caracterisation" />
          </motion.div>
        )}

        {/* Bloc éditorial principal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                La photographie sous-marine au service de l'engagement
              </h2>
              <p className="text-ocean-teal font-semibold text-sm uppercase tracking-widest mb-6">
                Comprendre ma démarche : de l'image à l'impact
              </p>

              {/* Liens d'ancres */}
              <div className="flex flex-wrap gap-2 mb-7">
                {[
                  { href: '#depollution', label: '🤿 Actions de dépollution' },
                  { href: '#biodiversite', label: '🐟 Biodiversité' },
                  { href: '#caracterisation', label: '🔬 Caractérisation' },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                               bg-white/5 border border-white/10 text-text-secondary
                               hover:bg-ocean-teal/10 hover:border-ocean-teal/40 hover:text-ocean-teal
                               transition-colors duration-200"
                  >
                    {label}
                  </a>
                ))}
              </div>

              <p className="text-text-secondary leading-[1.8] mb-6">
                Mon travail photographique s'articule autour de trois axes complémentaires qui forment
                un cycle complet de préservation marine. Chaque rubrique de cette galerie répond à un
                besoin spécifique de l'engagement environnemental.
              </p>

              <div className="space-y-5 text-text-secondary leading-[1.8]">
                <div>
                  <p className="font-semibold text-white mb-1">
                    1. <a href="#depollution" className="hover:text-ocean-teal transition-colors">Actions de dépollution</a>
                    {' '}<span className="text-text-secondary font-normal">— L'urgence de l'intervention</span>
                  </p>
                  <p>
                    Extraire un pneu, un filet fantôme ou des batteries à 15 mètres de profondeur en apnée
                    demande une logistique précise. Ces images servent de{' '}
                    <strong className="text-white">preuves visuelles</strong> pour alerter l'opinion publique
                    et montrer que chaque déchet retiré est une victoire immédiate pour l'écosystème local.
                    Les chiffres derrière ces images sont disponibles dans les{' '}
                    <Link to="/donnees-scientifiques" className="text-ocean-teal hover:text-white transition-colors">
                      données scientifiques sur la pollution plastique en Méditerranée
                    </Link>.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white mb-1">
                    2. <a href="#biodiversite" className="hover:text-ocean-teal transition-colors">Biodiversité</a>
                    {' '}<span className="text-text-secondary font-normal">— Ce que nous protégeons</span>
                  </p>
                  <p>
                    On ne protège bien que ce que l'on aime, et on n'aime que ce que l'on connaît.
                    Malgré la proximité des zones urbaines, coralligène, herbiers de posidonie, mérous et
                    nudibranches colorés{' '}
                    <strong className="text-white">luttent et s'épanouissent</strong>. Ces clichés visent
                    à recréer un lien émotionnel entre le public et la mer.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white mb-1">
                    3. <a href="#caracterisation" className="hover:text-ocean-teal transition-colors">Caractérisation</a>
                    {' '}<span className="text-text-secondary font-normal">— Transformer l'image en donnée scientifique</span>
                  </p>
                  <p>
                    En identifiant la nature des matériaux, les marques et l'état de dégradation, nous
                    transformons une action citoyenne en{' '}
                    <strong className="text-white">information exploitable</strong>. Toutes les données
                    sont reportées sur la plateforme{' '}
                    <strong className="text-ocean-teal">ReMed Zéro Déchet Sauvage</strong>, alimentant
                    une base nationale pour chercheurs et décideurs.
                  </p>
                </div>
              </div>

              <p className="text-text-secondary leading-[1.8] mt-6 text-sm border-t border-white/10 pt-5">
                Au-delà du cadre technique ou esthétique, chaque plongée, chaque cliché et chaque donnée
                reportée est une brique supplémentaire pour la préservation de ce bien commun.
                L'objectif reste le même&nbsp;:{' '}
                <strong className="text-white">transformer le regard en action et l'indignation en solution durable</strong>.
              </p>
            </div>
            {/* Photo */}
            <div className="lg:w-[38%] flex-shrink-0 min-h-[320px] lg:min-h-0 overflow-hidden">
              <img
                src="/images/558580014-1379392530856377-5985320880881967901-n.webp"
                alt="Karim Saari, photographe sous-marin et apnéiste — Projet Sentinelle, dépollution marine Calanques de Marseille"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Bloc éditorial bas */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass rounded-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Photo — gauche */}
            <div className="lg:w-[40%] flex-shrink-0 min-h-[280px] lg:min-h-0 overflow-hidden order-last lg:order-first">
              <img
                src="/images/portfolio/Mer/photographe-sous-marin-marseille-pollution-plastique-fond-marin.webp"
                alt="Pollution plastique au fond de la mer — fonds marins des Calanques de Marseille documentés par Karim Saari, photographe sous-marin"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Texte */}
            <div className="p-6 md:p-8 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                Apnée et photographie engagée — au cœur des Calanques de Marseille
              </h2>
              <div className="space-y-4 text-text-secondary leading-[1.8]">
                <p>
                  Karim Saari plonge en{' '}
                  <strong className="text-white">apnée</strong> dans les eaux de Marseille avec un
                  double impératif&nbsp;: extraire les déchets <em>et</em> documenter l'agonie comme
                  la beauté des fonds marins. Contrairement à la majorité des photographes
                  sous-marins qui travaillent en bouteille, chaque image est prise en rétention de
                  souffle, le matériel de dépollution dans les mains, au milieu des déchets, entre 0
                  et 20 mètres de profondeur.
                </p>
                <p>
                  Chaque photo est un témoignage brut — un{' '}
                  <strong className="text-white">électrochoc visuel</strong> pour alerter le public
                  et convaincre les institutions. Ce regard sans filtre a trouvé un écho auprès de{' '}
                  <strong className="text-white">ARTE, M6, France Télévisions</strong> et d'autres
                  médias qui ont relayé le combat pour la Méditerranée.{' '}
                  <Link to="/presse" className="text-ocean-teal hover:underline">
                    Voir toute la revue de presse →
                  </Link>
                </p>
                <p>
                  Cette galerie rassemble des images de missions{' '}
                  <strong className="text-white">Team Oxygen</strong> et de l'
                  <strong className="text-white">Opération Sentinelle</strong>, et s'enrichit au fil
                  des éditions. Des{' '}
                  <strong className="text-ocean-teal">abysses pollués</strong> à la résilience de la
                  vie sauvage — poulpes, spirographes, méduses, fonds rocheux — des images qui
                  témoignent à la fois de l'urgence et de la beauté de ce qui reste à protéger.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mt-8 pt-6 border-t border-white/8">
                <Link
                  to="/depollution-marine"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <span>Découvrir les missions de dépollution</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/photographie-paysage-mer"
                  className="btn-secondary inline-flex items-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                  <span>Galerie paysages &amp; littoral</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default PhotoSousMarine;
