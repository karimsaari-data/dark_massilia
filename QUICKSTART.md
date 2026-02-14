# 🚀 Quick Start - Dark Massilia

## Démarrage Rapide en 3 Étapes

### 1️⃣ Installation

```bash
cd dark-massilia-react
npm install
```

### 2️⃣ Configuration Supabase

**A. Exécuter le schéma SQL**
- Allez sur https://supabase.com/dashboard/project/bzlllfmpojcybuyuemdx/sql
- Copiez-collez `supabase-schema.sql`
- Cliquez **Run**

**B. Récupérer les clés API**
- Allez dans Settings > API
- Copiez Project URL et anon key

**C. Créer votre .env**

```bash
cp .env.example .env
```

Éditez `.env` :
```env
VITE_SUPABASE_URL=https://bzlllfmpojcybuyuemdx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_ici
```

### 3️⃣ Lancer

```bash
npm run dev
```

Ouvrez http://localhost:5173 🎉

## ✅ Vérification

- [ ] Page Home s'affiche
- [ ] Navigation fonctionne
- [ ] Projet d'exemple visible
- [ ] Formulaire contact fonctionne

## 📚 Documentation Complète

Voir `INSTALLATION.md` pour le guide détaillé.

## 🆘 Problème ?

```bash
# Vérifier que les dépendances sont installées
npm install

# Reconstruire
rm -rf node_modules package-lock.json
npm install

# Vérifier le .env
cat .env
```
