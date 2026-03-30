#!/usr/bin/env node
/**
 * WordPress Image SEO Optimizer
 *
 * Audits and optimizes image alt tags and titles on a WordPress site
 * via the REST API.
 *
 * Usage:
 *   node scripts/wp-optimize-images.mjs --audit          # List images missing alt/title
 *   node scripts/wp-optimize-images.mjs --fix             # Generate and apply SEO alt tags
 *   node scripts/wp-optimize-images.mjs --fix --dry-run   # Preview changes without applying
 *
 * Environment variables (in .env):
 *   WP_URL=https://cms.karimsaari.com
 *   WP_USER=karimsaari
 *   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Load .env manually (no external dep)
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = resolve(__dirname, '..', '.env');
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

if (!WP_URL || !WP_USER || !WP_APP_PASSWORD) {
  console.error('Missing environment variables. Set WP_URL, WP_USER, WP_APP_PASSWORD in .env');
  process.exit(1);
}

const AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
const args = process.argv.slice(2);
const MODE_AUDIT = args.includes('--audit');
const MODE_FIX = args.includes('--fix');
const DRY_RUN = args.includes('--dry-run');

if (!MODE_AUDIT && !MODE_FIX) {
  console.log('Usage: node scripts/wp-optimize-images.mjs --audit | --fix [--dry-run]');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// WP REST API helpers
// ---------------------------------------------------------------------------
async function wpFetch(endpoint, options = {}) {
  const url = `${WP_URL}/wp-json/wp/v2${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: AUTH,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP API ${res.status}: ${text}`);
  }
  return res.json();
}

async function getAllMedia() {
  const allMedia = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const batch = await wpFetch(`/media?per_page=${perPage}&page=${page}&media_type=image`);
    allMedia.push(...batch);
    if (batch.length < perPage) break;
    page++;
  }
  return allMedia;
}

async function getPost(postId) {
  try {
    return await wpFetch(`/posts/${postId}`);
  } catch {
    // Could be a page instead
    try {
      return await wpFetch(`/pages/${postId}`);
    } catch {
      return null;
    }
  }
}

async function updateMedia(mediaId, data) {
  return wpFetch(`/media/${mediaId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// SEO Alt Tag Generation
// ---------------------------------------------------------------------------
function cleanFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, '')           // remove extension
    .replace(/[-_]+/g, ' ')            // dashes/underscores to spaces
    .replace(/\b(img|dsc|dscn|photo|image|pic|screenshot)\b/gi, '')
    .replace(/\b\d{4,}\b/g, '')        // remove long numbers (timestamps, IDs)
    .replace(/\s+/g, ' ')
    .trim();
}

function generateAltText(media, parentPost = null) {
  // Priority 1: If media already has a meaningful alt_text, keep it
  const currentAlt = media.alt_text?.trim();
  if (currentAlt && currentAlt.length > 10 && !/^(img|image|photo|dsc)/i.test(currentAlt)) {
    return null; // no change needed
  }

  // Priority 2: Use cleaned caption if available
  const caption = media.caption?.rendered?.replace(/<[^>]+>/g, '').trim();
  if (caption && caption.length > 10) {
    return caption;
  }

  // Priority 3: Use media title if it's descriptive (not just a filename slug)
  const title = media.title?.rendered?.trim();
  const cleanedTitle = title ? cleanFilename(title) : '';

  // Priority 4: Use cleaned filename
  const sourceUrl = media.source_url || '';
  const filename = sourceUrl.split('/').pop() || '';
  const cleanedFilename = cleanFilename(decodeURIComponent(filename));

  // Priority 5: Add parent post context
  const postTitle = parentPost?.title?.rendered?.replace(/<[^>]+>/g, '').trim() || '';

  // Build the alt text
  let altText = cleanedTitle || cleanedFilename;

  if (!altText || altText.length < 5) {
    altText = postTitle ? `Image - ${postTitle}` : 'Image';
  }

  // Add post context if alt is generic
  if (postTitle && altText.length < 30 && !altText.toLowerCase().includes(postTitle.toLowerCase().slice(0, 15))) {
    altText = `${altText} - ${postTitle}`;
  }

  // Capitalize first letter
  altText = altText.charAt(0).toUpperCase() + altText.slice(1);

  // Truncate if too long
  if (altText.length > 125) {
    altText = altText.slice(0, 122) + '...';
  }

  return altText;
}

function generateSeoTitle(media) {
  const currentTitle = media.title?.rendered?.trim();
  const sourceUrl = media.source_url || '';
  const filename = sourceUrl.split('/').pop() || '';
  const cleaned = cleanFilename(decodeURIComponent(filename));

  // If title looks like a raw filename slug, improve it
  if (!currentTitle || /^(img|dsc|dscn|photo|image|screenshot)/i.test(currentTitle) || /^\d+$/.test(currentTitle)) {
    if (cleaned && cleaned.length > 3) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
  }
  return null; // no change needed
}

// ---------------------------------------------------------------------------
// Audit Mode
// ---------------------------------------------------------------------------
async function audit() {
  console.log('🔍 Audit des images WordPress...\n');

  const media = await getAllMedia();
  console.log(`Total images: ${media.length}\n`);

  const issues = {
    noAlt: [],
    genericAlt: [],
    noTitle: [],
    genericFilename: [],
  };

  for (const m of media) {
    const alt = m.alt_text?.trim();
    const title = m.title?.rendered?.trim();
    const filename = (m.source_url || '').split('/').pop() || '';

    if (!alt) {
      issues.noAlt.push({ id: m.id, filename, title });
    } else if (alt.length < 5 || /^(img|image|photo|dsc)/i.test(alt)) {
      issues.genericAlt.push({ id: m.id, filename, title, alt });
    }

    if (!title || /^(img|dsc|dscn|photo|image|screenshot)/i.test(title)) {
      issues.noTitle.push({ id: m.id, filename });
    }

    if (/^(IMG|DSC|DSCN|Photo|Screenshot|Capture|image)[-_]?\d/i.test(decodeURIComponent(filename))) {
      issues.genericFilename.push({ id: m.id, filename });
    }
  }

  console.log('=== IMAGES SANS ALT TEXT ===');
  console.log(`Count: ${issues.noAlt.length}`);
  issues.noAlt.forEach(i => console.log(`  [${i.id}] ${i.filename}`));

  console.log('\n=== IMAGES AVEC ALT GENERIQUE ===');
  console.log(`Count: ${issues.genericAlt.length}`);
  issues.genericAlt.forEach(i => console.log(`  [${i.id}] ${i.filename} → alt: "${i.alt}"`));

  console.log('\n=== IMAGES AVEC TITRE GENERIQUE ===');
  console.log(`Count: ${issues.noTitle.length}`);
  issues.noTitle.forEach(i => console.log(`  [${i.id}] ${i.filename}`));

  console.log('\n=== FICHIERS MAL NOMMES (SEO) ===');
  console.log(`Count: ${issues.genericFilename.length}`);
  issues.genericFilename.forEach(i => console.log(`  [${i.id}] ${i.filename}`));

  console.log('\n=== RESUME ===');
  const total = media.length;
  const ok = total - issues.noAlt.length - issues.genericAlt.length;
  console.log(`✅ Images avec alt OK: ${ok}/${total}`);
  console.log(`⚠️  Sans alt: ${issues.noAlt.length}`);
  console.log(`⚠️  Alt générique: ${issues.genericAlt.length}`);
  console.log(`⚠️  Titre générique: ${issues.noTitle.length}`);
  console.log(`⚠️  Nom de fichier non SEO: ${issues.genericFilename.length}`);

  if (issues.noAlt.length + issues.genericAlt.length > 0) {
    console.log(`\n→ Lance: node scripts/wp-optimize-images.mjs --fix --dry-run`);
  }
}

// ---------------------------------------------------------------------------
// Fix Mode
// ---------------------------------------------------------------------------
async function fix() {
  console.log(DRY_RUN ? '🔧 Mode FIX (dry-run, aucune modification)\n' : '🔧 Mode FIX (application des modifications)\n');

  const media = await getAllMedia();
  console.log(`Total images: ${media.length}\n`);

  // Cache parent posts
  const postCache = new Map();
  let updated = 0;
  let skipped = 0;

  for (const m of media) {
    const parentId = m.post;
    let parentPost = null;

    if (parentId && parentId > 0) {
      if (!postCache.has(parentId)) {
        postCache.set(parentId, await getPost(parentId));
      }
      parentPost = postCache.get(parentId);
    }

    const newAlt = generateAltText(m, parentPost);
    const newTitle = generateSeoTitle(m);

    if (!newAlt && !newTitle) {
      skipped++;
      continue;
    }

    const changes = {};
    if (newAlt) changes.alt_text = newAlt;
    if (newTitle) changes.title = newTitle;

    const filename = (m.source_url || '').split('/').pop() || '';

    if (DRY_RUN) {
      console.log(`[${m.id}] ${decodeURIComponent(filename)}`);
      if (newAlt) console.log(`  alt: "${m.alt_text || '(vide)'}" → "${newAlt}"`);
      if (newTitle) console.log(`  title: "${m.title?.rendered || '(vide)'}" → "${newTitle}"`);
      console.log('');
      updated++;
    } else {
      try {
        await updateMedia(m.id, changes);
        console.log(`✅ [${m.id}] ${decodeURIComponent(filename)}`);
        if (newAlt) console.log(`   alt → "${newAlt}"`);
        if (newTitle) console.log(`   title → "${newTitle}"`);
        updated++;
      } catch (err) {
        console.error(`❌ [${m.id}] ${decodeURIComponent(filename)}: ${err.message}`);
      }
    }
  }

  console.log(`\n=== RESUME ===`);
  console.log(`${DRY_RUN ? 'À modifier' : 'Modifiées'}: ${updated}`);
  console.log(`Déjà OK: ${skipped}`);

  if (DRY_RUN && updated > 0) {
    console.log(`\n→ Pour appliquer: node scripts/wp-optimize-images.mjs --fix`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
try {
  if (MODE_AUDIT) await audit();
  else if (MODE_FIX) await fix();
} catch (err) {
  console.error('Erreur:', err.message);
  process.exit(1);
}
