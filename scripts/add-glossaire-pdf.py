# -*- coding: utf-8 -*-
"""
Ajoute une page Glossaire au rapport PSI Dark Massilia
Usage : python scripts/add-glossaire-pdf.py
"""

import sys
import os
from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfgen import canvas as rl_canvas
from io import BytesIO

# ── Couleurs (reprises du rapport existant) ─────────────────────────────────
TEAL       = colors.HexColor('#21c47b')
DARK_BG    = colors.HexColor('#0d1117')
DARK_CARD  = colors.HexColor('#161b22')
DARK_CARD2 = colors.HexColor('#1c2128')
TEXT_MAIN  = colors.HexColor('#e6edf3')
TEXT_SEC   = colors.HexColor('#8b949e')
TEXT_TEAL  = colors.HexColor('#21c47b')
ORANGE     = colors.HexColor('#f97316')
RED        = colors.HexColor('#ef4444')
BORDER     = colors.HexColor('#30363d')

W, H = A4  # 595.28 x 841.89 pts
MARGIN_L = 20 * mm
MARGIN_R = 20 * mm
MARGIN_T = 16 * mm
MARGIN_B = 16 * mm
COL_W = W - MARGIN_L - MARGIN_R

# ── Données du glossaire ────────────────────────────────────────────────────
SECTIONS = [
    {
        "title": "Indicateurs de Performance (Core Web Vitals & Lab Data)",
        "color": TEAL,
        "entries": [
            ("Performance (Score Global)",
             "Note calculée par Google sur 100 synthétisant la vitesse de chargement et la fluidité de la page. "
             "Ton score moyen actuel est de 67/100."),
            ("FCP — First Contentful Paint",
             "Temps écoulé avant que le premier texte ou image ne devienne visible à l'écran. "
             "Sur /actualites, il est de 2,6s."),
            ("LCP — Largest Contentful Paint",
             "Temps nécessaire pour afficher l'élément le plus volumineux de la page (souvent une photo haute résolution). "
             "C'est ton point critique, montant jusqu'à 67,1s sur /photographie-paysage-mer."),
            ("CLS — Cumulative Layout Shift",
             "Mesure la stabilité visuelle. Un score élevé (comme 0,34 sur /actualites) indique que des éléments "
             "« sautent » pendant le chargement, ce qui nuit à l'expérience utilisateur."),
            ("TBT — Total Blocking Time",
             "Temps total durant lequel la page est bloquée par des scripts, empêchant l'utilisateur "
             "d'interagir avec le site (clics, défilement)."),
        ],
    },
    {
        "title": "Qualité & Accessibilité",
        "color": ORANGE,
        "entries": [
            ("BP — Best Practices",
             "Analyse le respect des standards de développement web (sécurité HTTPS, ratio de contraste des images, "
             "bibliothèques JavaScript à jour). Ton site excelle ici avec un score de 99/100."),
            ("A11y — Accessibility",
             "Évalue la facilité d'utilisation du site pour les personnes en situation de handicap "
             "(lecteurs d'écran, navigation au clavier). Score actuel : 98/100."),
            ("SEO",
             "Vérifie la présence des éléments de base pour l'indexation (balises Title, Meta descriptions, "
             "balises H1). Score actuel : 100/100."),
        ],
    },
    {
        "title": "Lexique SEO & On-Page",
        "color": colors.HexColor('#3b82f6'),
        "entries": [
            ("E-E-A-T",
             "Acronyme pour Expérience, Expertise, Autorité et Fiabilité. C'est le critère de Google "
             "pour juger de la qualité d'un auteur sur des sujets sensibles (écologie, science)."),
            ("Ancre de lien (Anchor Text)",
             "Texte cliquable d'un lien hypertexte. Tes ancres sont actuellement majoritairement neutres "
             "(ex : « official website ») au lieu d'être thématiques."),
            ("Deep Link (Lien profond)",
             "Lien pointant vers une page interne du site plutôt que vers la page d'accueil. "
             "Ton rapport révèle une absence critique de ces liens (0%)."),
            ("CTR — Click-Through Rate",
             "Rapport entre le nombre de clics et le nombre d'impressions dans les résultats de recherche. "
             "Ton CTR moyen est de 6,5%."),
            ("Lien Orphelin",
             "Page présente sur le site mais ne recevant aucun lien interne, ce qui la rend invisible pour Google. "
             "Aucune page orpheline détectée sur ton site."),
        ],
    },
]

def draw_page(packet):
    """Dessine la page glossaire sur un canvas reportlab → BytesIO."""
    c = rl_canvas.Canvas(packet, pagesize=A4)

    # ── Fond noir ──────────────────────────────────────────────────────────
    c.setFillColor(DARK_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # ── Bandeau header ─────────────────────────────────────────────────────
    header_h = 52
    c.setFillColor(DARK_CARD)
    c.rect(0, H - header_h, W, header_h, fill=1, stroke=0)

    # Ligne déco teal en haut
    c.setFillColor(TEAL)
    c.rect(0, H - 3, W, 3, fill=1, stroke=0)

    # Badge "GLOSSAIRE"
    badge_w, badge_h = 90, 18
    bx = MARGIN_L
    by = H - header_h + (header_h - badge_h) / 2
    c.setFillColor(colors.HexColor('#162b20'))
    c.roundRect(bx, by, badge_w, badge_h, 4, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawCentredString(bx + badge_w / 2, by + 5.5, "GLOSSAIRE TECHNIQUE")

    # Titre principal
    c.setFillColor(TEXT_MAIN)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(MARGIN_L + badge_w + 14, H - header_h + 20, "Webperf & SEO — Référence des indicateurs")

    # Sous-titre droit
    c.setFillColor(TEXT_SEC)
    c.setFont("Helvetica", 8)
    c.drawRightString(W - MARGIN_R, H - header_h + 20, "Rapport Audit PageSpeed Insights — Dark Massilia")

    # ── Contenu ────────────────────────────────────────────────────────────
    y = H - header_h - 14  # curseur vertical

    for section in SECTIONS:
        sec_color = section["color"]

        # ── Titre de section ────────────────────────────────────────────
        if y < MARGIN_B + 40:
            c.showPage()
            c.setFillColor(DARK_BG)
            c.rect(0, 0, W, H, fill=1, stroke=0)
            y = H - MARGIN_T

        sec_h = 20
        c.setFillColor(DARK_CARD2)
        c.roundRect(MARGIN_L, y - sec_h, COL_W, sec_h, 4, fill=1, stroke=0)
        # Barre colorée gauche
        c.setFillColor(sec_color)
        c.roundRect(MARGIN_L, y - sec_h, 3, sec_h, 2, fill=1, stroke=0)

        c.setFillColor(sec_color)
        c.setFont("Helvetica-Bold", 8.5)
        c.drawString(MARGIN_L + 10, y - sec_h + 7, section["title"].upper())
        y -= sec_h + 6

        # ── Entrées ─────────────────────────────────────────────────────
        for term, definition in section["entries"]:
            # Estimation hauteur : terme (12pt) + définition (wrappée)
            # Wrap définition à ~COL_W - 16 pts
            max_chars = int((COL_W - 16) / 4.5)
            words = definition.split()
            lines = []
            line = ""
            for w in words:
                if len(line) + len(w) + 1 <= max_chars:
                    line = (line + " " + w).strip()
                else:
                    lines.append(line)
                    line = w
            if line:
                lines.append(line)

            entry_h = 13 + len(lines) * 9.5 + 10

            if y - entry_h < MARGIN_B + 10:
                c.showPage()
                c.setFillColor(DARK_BG)
                c.rect(0, 0, W, H, fill=1, stroke=0)
                y = H - MARGIN_T

            # Carte entrée
            c.setFillColor(DARK_CARD)
            c.roundRect(MARGIN_L, y - entry_h, COL_W, entry_h, 4, fill=1, stroke=0)
            # Bordure gauche colorée
            c.setFillColor(sec_color)
            c.rect(MARGIN_L, y - entry_h, 2, entry_h, fill=1, stroke=0)

            # Terme
            c.setFillColor(TEXT_MAIN)
            c.setFont("Helvetica-Bold", 8.5)
            c.drawString(MARGIN_L + 9, y - 11, term)

            # Définition
            c.setFillColor(TEXT_SEC)
            c.setFont("Helvetica", 7.5)
            for i, ln in enumerate(lines):
                c.drawString(MARGIN_L + 9, y - 11 - 11 - i * 9.5, ln)

            y -= entry_h + 4

        y -= 6  # espace inter-sections

    # ── Footer ─────────────────────────────────────────────────────────────
    c.setFillColor(BORDER)
    c.rect(MARGIN_L, MARGIN_B, COL_W, 0.5, fill=1, stroke=0)
    c.setFillColor(TEXT_SEC)
    c.setFont("Helvetica", 7)
    c.drawString(MARGIN_L, MARGIN_B - 8, "karimsaari.com — Dark Massilia · Karim Saari")
    c.setFillColor(TEAL)
    c.drawRightString(W - MARGIN_R, MARGIN_B - 8, "Rapport Audit PageSpeed Insights 2026")

    c.save()


def main():
    src = "C:/Users/ksaari/OneDrive - PLANETE TORTUE/Chargements OneNote/Bureau/psi-audit-2026-03-27 (1).pdf"
    dst = "C:/Users/ksaari/OneDrive - PLANETE TORTUE/Chargements OneNote/Bureau/psi-audit-2026-03-27 (1).pdf"

    # 1. Générer la page glossaire en mémoire
    packet = BytesIO()
    draw_page(packet)
    packet.seek(0)

    # 2. Lire le PDF glossaire généré
    glossaire_reader = PdfReader(packet)

    # 3. Lire le rapport existant
    rapport_reader = PdfReader(src)

    # 4. Assembler : rapport + glossaire
    writer = PdfWriter()
    for page in rapport_reader.pages:
        writer.add_page(page)
    for page in glossaire_reader.pages:
        writer.add_page(page)

    # 5. Conserver les métadonnées
    if rapport_reader.metadata:
        writer.add_metadata(dict(rapport_reader.metadata))

    # 6. Écrire le résultat
    with open(dst, "wb") as f:
        writer.write(f)

    print(f"OK — {len(rapport_reader.pages) + len(glossaire_reader.pages)} pages -> {dst}")


if __name__ == "__main__":
    main()
