# Guide d'Installation - Dark Massilia React

Guide complet pour installer et configurer l'application Dark Massilia.

## 📋 Prérequis

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **npm** (inclus avec Node.js)
- Compte **Supabase** gratuit ([S'inscrire](https://supabase.com))
- Éditeur de code (VS Code recommandé)

## 🎯 Étape 1 : Installation des dépendances

```bash
cd dark-massilia-react
npm install
```

Cette commande installera :
- React, React Router DOM
- Tailwind CSS, Framer Motion
- Supabase Client
- Lucide React (icônes)

## 🗄️ Étape 2 : Configuration de la Base de Données Supabase

### A. Accéder au projet Supabase

1. Rendez-vous sur : https://supabase.com/dashboard/project/bzlllfmpojcybuyuemdx
2. Connectez-vous avec votre compte

### B. Créer les tables et politiques

1. Dans le menu latéral, cliquez sur **SQL Editor**
2. Cliquez sur **New Query**
3. Ouvrez le fichier `supabase-schema.sql` dans votre éditeur de code
4. **Copiez tout le contenu** du fichier
5. **Collez** dans l'éditeur SQL de Supabase
6. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

✅ Vous devriez voir :
```
Success. No rows returned
```

Cela a créé :
- 4 tables (`categories`, `projects`, `media_links`, `contact_submissions`)
- Politiques RLS (sécurité)
- Données d'exemple (3 catégories, 1 projet test)

### C. Vérifier la création

1. Allez dans **Table Editor** (menu latéral)
2. Vous devriez voir vos 4 nouvelles tables
3. Cliquez sur `categories` → vous devriez voir 4 lignes de données

## 🔑 Étape 3 : Récupérer les Clés API

### A. Trouver vos clés

1. Dans Supabase, allez dans **Settings** (⚙️ en bas du menu)
2. Cliquez sur **API**
3. Vous verrez deux sections importantes :

**Project URL** :
```
https://bzlllfmpojcybuyuemdx.supabase.co
```

**API Keys** → Copiez la clé **anon / public** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **NE PARTAGEZ JAMAIS** la clé `service_role` !

### B. Configurer les variables d'environnement

1. Dans le dossier du projet, copiez le fichier exemple :

```bash
cp .env.example .env
```

2. Éditez le fichier `.env` avec votre éditeur de code

3. Remplacez les valeurs :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://bzlllfmpojcybuyuemdx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.votre_vraie_clé_ici

# Le reste est déjà configuré, vous pouvez le laisser tel quel
VITE_APP_NAME=Dark Massilia
VITE_APP_URL=https://karimsaari.com
# ...
```

4. **Sauvegardez** le fichier

## 🚀 Étape 4 : Lancer l'Application

```bash
npm run dev
```

Vous devriez voir :

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Ouvrez votre navigateur** et allez sur : **http://localhost:5173**

## ✅ Vérification

Vous devriez voir :

1. ✅ **Page d'accueil** avec le Hero section "Une Mer · Une Ville · Une Mission"
2. ✅ **Navigation** en haut (Home, Missions, Médias, Contact)
3. ✅ Section **"Dernières Missions"** avec le projet d'exemple
4. ✅ **Footer** avec liens sociaux

### Test de la navigation

Cliquez sur chaque lien :
- **Missions** → Grille de projets avec filtres par catégorie
- **Médias** → Onglets (Tous, YouTube, Vimeo, Photos)
- **Contact** → Formulaire de contact

### Test du formulaire de contact

1. Allez sur **Contact**
2. Remplissez le formulaire avec :
   - Nom : Test User
   - Email : test@example.com
   - Message : Test de contact
3. Cliquez sur **Envoyer**
4. Vous devriez voir : **"Message envoyé !"**

5. Vérifiez dans Supabase :
   - Allez dans **Table Editor** → `contact_submissions`
   - Votre message test devrait apparaître

## 🎨 Personnalisation

### Ajouter votre logo

1. Placez votre image `dark_massilia_karim_saari.png` dans `public/`
2. L'image sera automatiquement utilisée dans le Hero

### Ajouter des données

#### Ajouter un projet

1. Dans Supabase, allez dans **Table Editor** → `projects`
2. Cliquez sur **Insert** → **Insert row**
3. Remplissez les champs :
   - title : "Ma nouvelle mission"
   - slug : "ma-nouvelle-mission"
   - description : "Description courte"
   - status : "published" ⚠️ Important
   - category_id : (sélectionnez dans la liste)
   - date : 2025-02-14
   - location : "Calanques de Marseille"
4. **Save**

Le projet apparaîtra immédiatement sur le site !

#### Ajouter une vidéo

1. Table Editor → `media_links`
2. Insert row :
   - type : "youtube" (ou "vimeo", "tiktok")
   - title : "Titre de la vidéo"
   - url : "https://www.youtube.com/watch?v=VIDEO_ID"
   - embed_id : "VIDEO_ID"
3. Save

La vidéo apparaîtra dans la page Médias.

## 🔧 Commandes Utiles

```bash
# Développement (avec hot reload)
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Vérifier le code (ESLint)
npm run lint
```

## 🐛 Problèmes Courants

### Erreur "Supabase credentials not found"

**Solution** : Vérifiez que votre fichier `.env` existe et contient les bonnes clés

### Les données ne s'affichent pas

**Solution** :
1. Vérifiez que le schéma SQL a bien été exécuté
2. Vérifiez que vos projets ont `status = 'published'`
3. Ouvrez la console du navigateur (F12) pour voir les erreurs

### Erreur CORS / API

**Solution** : Vérifiez que la `VITE_SUPABASE_URL` dans `.env` est correcte

### Le formulaire de contact ne fonctionne pas

**Solution** :
1. Vérifiez la table `contact_submissions` existe
2. Vérifiez les politiques RLS (doivent permettre INSERT public)

## 📚 Prochaines Étapes

1. **Ajouter vos vraies données** (projets, médias, catégories)
2. **Personnaliser les couleurs** dans `tailwind.config.js`
3. **Ajouter vos images** dans Supabase Storage (optionnel)
4. **Déployer en production** (voir DEPLOYMENT.md)

## 🆘 Support

En cas de problème :

1. Vérifiez la console du navigateur (F12 → Console)
2. Vérifiez les logs Supabase (Dashboard → Logs)
3. Consultez la documentation Supabase : https://supabase.com/docs

---

**Félicitations ! Votre application Dark Massilia est opérationnelle ! 🌊**
