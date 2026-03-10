import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE    = path.join(__dirname, 'public', 'images');
const NEW_DIR = path.join(BASE, 'New');
const MER_DIR = path.join(BASE, 'portfolio', 'Mer');

const merImages = [
  {
    src: path.join(NEW_DIR, 'Galerie paysages', 'Mer', 'Photo de paysage calanque de sormiou.jpg'),
    dst: path.join(MER_DIR, 'karim-saari-marseille-paysage-calanque-sormiou-eau-turquoise.webp'),
  },
  {
    src: path.join(NEW_DIR, 'Galerie paysages', 'Mer', 'Photo paysage capbreton cote landaise ocean.jpg'),
    dst: path.join(MER_DIR, 'karim-saari-capbreton-cote-landaise-ocean-atlantique-paysage.webp'),
  },
];

const sousMarineImages = [
  {
    src: path.join(NEW_DIR, 'Galerie sous marine', 'dépollution maritime dans les calanques.JPG'),
    dst: path.join(BASE, 'marseille-dark-massilia-depollution-maritime-calanques-projet-sentinelle.webp'),
  },
  {
    src: path.join(NEW_DIR, 'Galerie sous marine', 'dépollution pneu port des goudes.JPG'),
    dst: path.join(BASE, 'marseille-dark-massilia-depollution-pneu-port-goudes-projet-sentinelle.webp'),
  },
  {
    src: path.join(NEW_DIR, 'Galerie sous marine', 'opération sentinelle 3 kayak déchets.JPG'),
    dst: path.join(BASE, 'marseille-dark-massilia-operation-sentinelle-kayak-dechets-calanques.webp'),
  },
  {
    src: path.join(NEW_DIR, 'Galerie sous marine', 'Photo sous marine dépollution team oxygen.jpg'),
    dst: path.join(BASE, 'marseille-dark-massilia-photo-sous-marine-depollution-team-oxygen.webp'),
  },
  {
    src: path.join(NEW_DIR, 'Galerie sous marine', 'port des goudes dépollution.JPG'),
    dst: path.join(BASE, 'marseille-dark-massilia-port-goudes-depollution-apnee-projet-sentinelle.webp'),
  },
  {
    src: path.join(NEW_DIR, 'Galerie sous marine', 'Projet sentinelle caractérisation.jpg'),
    dst: path.join(BASE, 'marseille-dark-massilia-projet-sentinelle-caracterisation-dechets.webp'),
  },
  {
    src: path.join(NEW_DIR, 'Galerie sous marine', 'TF1 projet sentinelle.jpg'),
    dst: path.join(BASE, 'marseille-dark-massilia-tf1-reportage-projet-sentinelle-depollution.webp'),
  },
];

async function convertAll() {
  console.log('=== Conversion WebP ===\n');
  for (const img of [...merImages, ...sousMarineImages]) {
    try {
      await sharp(img.src)
        .rotate()           // auto-appliquer la rotation EXIF et supprimer le tag EXIF
        .webp({ quality: 85 })
        .toFile(img.dst);
      const meta = await sharp(img.dst).metadata();
      console.log(`✓ ${path.basename(img.dst)}  →  ${meta.width}x${meta.height}`);
    } catch (e) {
      console.error(`✗ ${path.basename(img.dst)}  →  ${e.message}`);
    }
  }
  console.log('\nTerminé.');
}

convertAll();
