/**
 * scripts/generate-og-image.js
 * Génère l'image Open Graph / Twitter Card 1200×630 px
 *
 * Usage : node scripts/generate-og-image.js
 * Output : public/assets/og-social-card.jpg
 */

import sharp from 'sharp';
import path  from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir   = path.resolve(__dirname, '..');

const W         = 1200;
const H         = 630;
const LOGO_SIZE = 280;
const LOGO_X    = 105;           // marge gauche
const LOGO_CX   = LOGO_X + LOGO_SIZE / 2;  // centre X = 245
const LOGO_CY   = H / 2;                   // centre Y = 315
const LOGO_Y    = LOGO_CY - LOGO_SIZE / 2; // top = 175
const DIVIDER_X = 490;

async function generate() {
  console.log('\n🎨  Génération de l\'image Open Graph (1200×630)…\n');

  // ── 1. Découpe circulaire du logo (coins transparents) ────────────────────
  const circleMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LOGO_SIZE}" height="${LOGO_SIZE}">
      <circle cx="${LOGO_SIZE / 2}" cy="${LOGO_SIZE / 2}" r="${LOGO_SIZE / 2 - 1}" fill="white"/>
    </svg>`
  );

  const logoCircular = await sharp(
    path.resolve(rootDir, 'public/assets/dark-massilia-logo.webp')
  )
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'cover', position: 'centre' })
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // ── 2. SVG : fond lumineux + texte ───────────────────────────────────────
  const svgBg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>

    <!-- Fond : gradient diagonal bleu-océan -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#1B4E72"/>
      <stop offset="45%"  stop-color="#0F3354"/>
      <stop offset="100%" stop-color="#091E35"/>
    </linearGradient>

    <!-- Halo teal autour du logo -->
    <radialGradient id="logoGlow"
      cx="${(LOGO_CX / W * 100).toFixed(1)}%"
      cy="${(LOGO_CY / H * 100).toFixed(1)}%"
      r="28%">
      <stop offset="0%"   stop-color="#00ABA8" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#00ABA8" stop-opacity="0"/>
    </radialGradient>

    <!-- Barre accent bas -->
    <linearGradient id="accentBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#00ABA8"/>
      <stop offset="45%"  stop-color="#00C5FF"/>
      <stop offset="100%" stop-color="#00ABA8"/>
    </linearGradient>

  </defs>

  <!-- Fond principal -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>

  <!-- Halo derrière le logo -->
  <circle cx="${LOGO_CX}" cy="${LOGO_CY}" r="220" fill="url(#logoGlow)"/>

  <!-- Anneau blanc autour du logo (crée le contraste) -->
  <circle cx="${LOGO_CX}" cy="${LOGO_CY}" r="${LOGO_SIZE / 2 + 14}"
          fill="white" fill-opacity="0.06"
          stroke="white" stroke-width="2.5" stroke-opacity="0.35"/>

  <!-- Séparateur vertical -->
  <line x1="${DIVIDER_X}" y1="55" x2="${DIVIDER_X}" y2="${H - 55}"
        stroke="#00C5D4" stroke-width="1.5" stroke-opacity="0.30"/>

  <!-- ── TEXTE ── -->

  <!-- Domaine -->
  <text x="532" y="152"
        font-family="Arial, Helvetica, sans-serif"
        font-size="13" font-weight="700"
        fill="#40D0CC" letter-spacing="5">KARIMSAARI.COM</text>

  <!-- Prénom + Nom -->
  <text x="532" y="244"
        font-family="Arial, Helvetica, sans-serif"
        font-size="70" font-weight="800"
        fill="#FFFFFF">Karim Saari</text>

  <!-- Brand -->
  <text x="532" y="302"
        font-family="Arial, Helvetica, sans-serif"
        font-size="30" font-weight="700"
        fill="#40D0CC">Dark Massilia</text>

  <!-- Tagline -->
  <text x="532" y="350"
        font-family="Arial, Helvetica, sans-serif"
        font-size="20" font-weight="400"
        fill="#AACEDD">Sentinelle de la M&#xe9;diterran&#xe9;e</text>

  <!-- Séparateur -->
  <rect x="532" y="378" width="608" height="1" fill="white" fill-opacity="0.12"/>

  <!-- Stats (texte clair et lisible) -->
  <text x="532" y="416"
        font-family="Arial, Helvetica, sans-serif"
        font-size="16" fill="#7EC8DC">
    5&#x202f;724 kg de d&#xe9;chets extraits des fonds marins
  </text>
  <text x="532" y="447"
        font-family="Arial, Helvetica, sans-serif"
        font-size="16" fill="#7EC8DC">
    Calanques de Marseille &#xb7; Apn&#xe9;iste &#xb7; Team Oxygen
  </text>
  <text x="532" y="478"
        font-family="Arial, Helvetica, sans-serif"
        font-size="16" fill="#7EC8DC">
    Photographe sous-marin &#xb7; &#xc9;co-acteur engag&#xe9;
  </text>

  <!-- Barre accent bas -->
  <rect x="0" y="${H - 5}" width="${W}" height="5" fill="url(#accentBar)"/>

</svg>`;

  // ── 3. SVG → buffer PNG ──────────────────────────────────────────────────
  const background = await sharp(Buffer.from(svgBg)).png().toBuffer();

  // ── 4. Composition : fond + logo circulaire ──────────────────────────────
  const outPath = path.resolve(rootDir, 'public/assets/og-social-card.jpg');

  await sharp(background)
    .composite([{ input: logoCircular, left: LOGO_X, top: Math.round(LOGO_Y) }])
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(`  ✅ og-social-card.jpg — ${meta.width}×${meta.height}px`);
  console.log(`  📁 ${outPath}\n`);
}

generate().catch((err) => {
  console.error('\n❌ Erreur :', err.message);
  process.exit(1);
});
