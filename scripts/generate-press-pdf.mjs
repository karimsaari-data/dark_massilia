/**
 * Génère dossier-presse.pdf depuis la page WordPress publique
 * Usage: node scripts/generate-press-pdf.mjs
 */
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, '..', 'public', 'dossier-presse.pdf');
const URL = 'https://cms.karimsaari.com/dossier-presse/';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.setViewport({ width: 1200, height: 900 });
console.log('Chargement de la page WP…');
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });

// Masquer les éléments non imprimables (header nav, footer, admin bar)
await page.addStyleTag({ content: `
  #wpadminbar, .site-header, .site-footer, nav, .wp-block-navigation,
  .entry-footer, .post-navigation, header.wp-block-template-part,
  footer.wp-block-template-part { display: none !important; }
  body { margin: 0 !important; }
` });

// Attendre que les images lazy soient chargées
await page.evaluate(() => {
  window.scrollTo(0, document.body.scrollHeight);
  return new Promise(r => setTimeout(r, 2000));
});

console.log('Génération du PDF…');
await page.pdf({
  path: OUTPUT,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  scale: 0.85,
});

await browser.close();
console.log(`PDF généré : ${OUTPUT}`);
