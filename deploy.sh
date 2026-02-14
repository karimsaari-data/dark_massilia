#!/bin/bash

# Script de déploiement automatique pour Dark Massilia
# Usage: ./deploy.sh "Message de commit"

echo "🌊 Dark Massilia - Déploiement GitHub"
echo "======================================"
echo ""

# Vérifier que Git est initialisé
if [ ! -d .git ]; then
    echo "❌ Erreur: Git n'est pas initialisé"
    echo "Exécutez: git init"
    exit 1
fi

# Vérifier que .env n'est pas tracké
if git ls-files | grep -q "^\.env$"; then
    echo "❌ ATTENTION: Le fichier .env est tracké par Git!"
    echo "Ceci expose vos clés secrètes."
    echo "Pour le retirer: git rm --cached .env"
    exit 1
fi

# Vérifier qu'un message de commit est fourni
if [ -z "$1" ]; then
    echo "❌ Erreur: Message de commit requis"
    echo "Usage: ./deploy.sh \"Votre message de commit\""
    exit 1
fi

COMMIT_MSG="$1"

echo "✅ Vérifications OK"
echo ""

# Build test
echo "🔨 Build de test..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur: Le build a échoué"
    exit 1
fi

echo "✅ Build réussi"
echo ""

# Git add
echo "📦 Ajout des fichiers..."
git add .

# Git commit
echo "💾 Commit: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# Git push
echo "⬆️ Push vers GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Déploiement réussi!"
    echo "🚀 Vercel va déployer automatiquement"
    echo "📍 Vérifiez: https://github.com/karimsaari-data/dark_massilia"
else
    echo ""
    echo "❌ Erreur lors du push"
    echo "Vérifiez vos identifiants GitHub"
fi
