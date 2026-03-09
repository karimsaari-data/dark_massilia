#!/usr/bin/env python3
"""
inject-exif.py — Injection XMP dans les WebP SANS ré-encodage (manipulation RIFF binaire)
Usage: python scripts/inject-exif.py
"""

import struct
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────────
BASE_DIR      = Path(__file__).parent.parent / "public"
PORTFOLIO_DIR = BASE_DIR / "images/portfolio/Mer"
MISSIONS_DIR  = BASE_DIR / "images"

CREATOR   = "Karim Saari"
COPYRIGHT = "© Karim Saari — Dark Massilia — Photographe sous-marin Marseille"

KEYWORDS_PORTFOLIO = [
    "photographe sous-marin", "marseille", "calanques", "apnée",
    "méditerranée", "dark massilia", "karim saari",
    "photographie sous-marine", "calanques de marseille",
]
KEYWORDS_MISSIONS = [
    "photographe sous-marin", "marseille", "calanques", "apnée",
    "méditerranée", "dark massilia", "karim saari",
    "dépollution marine", "pollution plastique", "projet sentinelle",
]

UNDERWATER_HINTS = [
    "fonds-marins", "nage", "grotte", "poulpe", "spirographe",
    "musée", "diving", "apneiste", "shooting", "soupe", "poseidon",
    "angel", "octopus", "paysage-sous-marin", "teamoxygen-freediving",
    "mer-de-plastique", "moyades", "mer-goudes", "freediving",
    "sous-marin", "subaquatique", "frioul",
]

# ── XMP builder ─────────────────────────────────────────────────────────────
def make_xmp(title, description, creator, copyright_str, keywords):
    kw_items = "".join(f"      <rdf:li>{kw}</rdf:li>\n" for kw in keywords)
    return f'''<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">{title}</rdf:li></rdf:Alt></dc:title>
      <dc:description><rdf:Alt><rdf:li xml:lang="x-default">{description}</rdf:li></rdf:Alt></dc:description>
      <dc:creator><rdf:Seq><rdf:li>{creator}</rdf:li></rdf:Seq></dc:creator>
      <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">{copyright_str}</rdf:li></rdf:Alt></dc:rights>
      <dc:subject>
        <rdf:Bag>
{kw_items}        </rdf:Bag>
      </dc:subject>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>'''

# ── WebP RIFF helpers ────────────────────────────────────────────────────────
def parse_chunks(data):
    """Retourne [(id_bytes, data_bytes), ...] à partir de l'offset 12 (après RIFF+size+WEBP)."""
    chunks, offset = [], 12
    while offset + 8 <= len(data):
        cid   = data[offset:offset+4]
        csize = struct.unpack_from('<I', data, offset+4)[0]
        cdata = data[offset+8:offset+8+csize]
        chunks.append((cid, cdata))
        offset += 8 + csize + (csize & 1)
    return chunks

def build_webp(chunks):
    payload = b'WEBP'
    for cid, cdata in chunks:
        payload += cid + struct.pack('<I', len(cdata)) + cdata
        if len(cdata) & 1:
            payload += b'\x00'
    return b'RIFF' + struct.pack('<I', len(payload)) + payload

def vp8_dims(d):
    if d[3:6] == b'\x9d\x01\x2a':
        return (struct.unpack_from('<H', d, 6)[0] & 0x3fff) + 1, \
               (struct.unpack_from('<H', d, 8)[0] & 0x3fff) + 1
    return None, None

def vp8l_dims(d):
    if d[0:1] == b'\x2f':
        bits = struct.unpack_from('<I', d, 1)[0]
        return (bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1
    return None, None

def inject_xmp(filepath, xmp_str):
    """Injecte XMP dans un WebP sans ré-encoder les pixels."""
    data = Path(filepath).read_bytes()
    if data[:4] != b'RIFF' or data[8:12] != b'WEBP':
        raise ValueError("Pas un fichier WebP valide")

    chunks   = parse_chunks(data)
    chunk_ids = [c[0] for c in chunks]
    xmp_bytes = xmp_str.encode('utf-8')

    if b'VP8X' in chunk_ids:
        # Format étendu — mettre à jour le flag XMP + remplacer le chunk XMP
        new_chunks = []
        for cid, cdata in chunks:
            if cid == b'VP8X':
                flags = struct.unpack_from('<I', cdata)[0] | (1 << 2)
                new_chunks.append((cid, struct.pack('<I', flags) + cdata[4:]))
            elif cid != b'XMP ':
                new_chunks.append((cid, cdata))
        new_chunks.append((b'XMP ', xmp_bytes))
    else:
        # Format simple (VP8 ou VP8L) — convertir en format étendu
        img = next(((cid, cd) for cid, cd in chunks if cid in (b'VP8 ', b'VP8L')), None)
        if not img:
            raise ValueError("Aucun chunk image trouvé")
        img_cid, img_data = img
        w, h = vp8_dims(img_data) if img_cid == b'VP8 ' else vp8l_dims(img_data)
        if w is None:
            raise ValueError("Impossible de lire les dimensions")
        vp8x_data = (
            struct.pack('<I', 1 << 2) +       # flags : XMP présent
            struct.pack('<I', w - 1)[:3] +    # canvas width - 1 (3 octets LE)
            struct.pack('<I', h - 1)[:3]      # canvas height - 1 (3 octets LE)
        )
        new_chunks = [(b'VP8X', vp8x_data), img, (b'XMP ', xmp_bytes)]

    Path(filepath).write_bytes(build_webp(new_chunks))

# ── Génération des métadonnées depuis le nom de fichier ─────────────────────
def meta_from_filename(fname, base_keywords, description_prefix):
    name  = fname.lower()
    label = fname.replace('.webp', '')

    # Retirer les préfixes répétitifs pour la description courte
    for prefix in [
        'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-',
        'photographe-sous-marin-marseille-',
        'karim-saari-marseille-',
    ]:
        if label.startswith(prefix):
            label = label[len(prefix):]
            break

    label = label.replace('-', ' ').replace('_', ' ').strip().capitalize()

    is_underwater = any(kw in name for kw in UNDERWATER_HINTS)
    if is_underwater:
        description = (
            f"Photographie sous-marine — {label}. "
            f"Dépollution sous-marine en apnée, Calanques de Marseille — "
            f"Projet Sentinelle par Karim Saari (Dark Massilia)"
        )
        keywords = base_keywords + ["dépollution sous-marine", "freediving calanques"]
    else:
        description = f"{description_prefix}{label}. Marseille et Calanques — Karim Saari (Dark Massilia)"
        keywords = base_keywords + ["calanques de marseille", "littoral méditerranéen"]

    return label[:80], description, keywords

# ── Traitement d'un répertoire ───────────────────────────────────────────────
def process(dirpath, base_keywords, description_prefix, recursive=False):
    dirpath = Path(dirpath)
    if not dirpath.exists():
        print(f"  ⚠  Dossier introuvable : {dirpath}")
        return

    pattern = "**/*.webp" if recursive else "*.webp"
    files   = sorted(dirpath.glob(pattern))
    # Exclure les variantes srcset (_400w, _800w, _1200w) — même meta que l'original
    files   = [f for f in files if not any(s in f.name for s in ('_400w', '_800w', '_1200w'))]

    print(f"\n📁 {dirpath}  ({len(files)} fichiers)")
    ok = err = 0
    for fpath in files:
        title, desc, kws = meta_from_filename(fpath.name, base_keywords, description_prefix)
        xmp = make_xmp(title, desc, CREATOR, COPYRIGHT, kws)
        try:
            inject_xmp(fpath, xmp)
            print(f"  ✓  {fpath.name}")
            ok += 1
        except Exception as e:
            print(f"  ✗  {fpath.name} → {e}")
            err += 1
    print(f"  → {ok} OK, {err} erreurs")

# ── Main ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("🔧  Injection XMP (sans ré-encodage)…\n")

    # Galerie photos (portfolio/Mer)
    process(
        PORTFOLIO_DIR,
        base_keywords=KEYWORDS_PORTFOLIO,
        description_prefix="Photographie Calanques de Marseille — ",
    )

    # Images missions (racine /images, seulement les Marseille-dark-massilia-*)
    # On exclut portfolio/ pour ne pas retraiter deux fois
    missions_files = sorted(
        f for f in MISSIONS_DIR.glob("Marseille-dark-massilia-*.webp")
        if not any(s in f.name for s in ('_400w', '_800w', '_1200w'))
    )
    print(f"\n📁 {MISSIONS_DIR}  ({len(missions_files)} fichiers missions)")
    ok = err = 0
    for fpath in missions_files:
        title, desc, kws = meta_from_filename(fpath.name, KEYWORDS_MISSIONS, "Mission dépollution — ")
        xmp = make_xmp(title, desc, CREATOR, COPYRIGHT, kws)
        try:
            inject_xmp(fpath, xmp)
            print(f"  ✓  {fpath.name}")
            ok += 1
        except Exception as e:
            print(f"  ✗  {fpath.name} → {e}")
            err += 1
    print(f"  → {ok} OK, {err} erreurs")

    print("\n✅  Terminé — relance npm run build:full + FTP")
