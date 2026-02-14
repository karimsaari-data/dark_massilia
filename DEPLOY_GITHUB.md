# 🚀 Guide de Déploiement GitHub

Guide pour publier le projet Dark Massilia sur GitHub et le déployer en production.

## 📋 Prérequis

- Compte GitHub : https://github.com
- Git installé sur votre machine
- Projet configuré et testé localement

## 🔐 Étape 1 : Vérifier que .env n'est PAS committé

**IMPORTANT** : Ne JAMAIS commiter le fichier `.env` avec vos clés Supabase !

Vérifiez que `.gitignore` contient bien :
```
.env
.env.*
```

Test :
```bash
git status
# Le fichier .env ne doit PAS apparaître dans la liste
```

✅ Si `.env` n'apparaît pas, c'est bon !  
❌ Si `.env` apparaît, ajoutez-le au `.gitignore`

## 📦 Étape 2 : Préparer le premier commit

```bash
# Dans le dossier dark-massilia-react/

# 1. Ajouter tous les fichiers
git add .

# 2. Créer le premier commit
git commit -m "Initial commit: Dark Massilia React Application

- Application React moderne avec Vite
- Design system glassmorphism
- Supabase backend (PostgreSQL + RLS)
- Pages: Home, Missions, Médias, Contact
- Optimisations performances (LCP, Lazy loading)
- Documentation complète

Stack: React 18, Tailwind CSS, Framer Motion, Supabase
"

# 3. Renommer la branche en main
git branch -M main
```

## 🌐 Étape 3 : Créer le repository GitHub

### Option A : Via l'interface GitHub

1. Allez sur https://github.com/karimsaari-data
2. Cliquez sur **"New repository"** (bouton vert)
3. Remplissez :
   - Repository name : `dark_massilia`
   - Description : `Site web Dark Massilia - Sentinelle de la Méditerranée`
   - Visibilité : **Public** (ou Private si vous préférez)
   - ❌ **NE COCHEZ PAS** "Add a README" (on a déjà le nôtre)
4. Cliquez **"Create repository"**

### Option B : Via GitHub CLI (si installé)

```bash
gh repo create karimsaari-data/dark_massilia --public --source=. --remote=origin
```

## 🔗 Étape 4 : Lier le repository local à GitHub

Si vous avez utilisé l'Option A, ajoutez le remote :

```bash
git remote add origin https://github.com/karimsaari-data/dark_massilia.git
```

Vérifiez :
```bash
git remote -v
# Devrait afficher :
# origin  https://github.com/karimsaari-data/dark_massilia.git (fetch)
# origin  https://github.com/karimsaari-data/dark_massilia.git (push)
```

## ⬆️ Étape 5 : Pusher le code

```bash
git push -u origin main
```

Lors du premier push, Git vous demandera vos identifiants GitHub.

✅ **Succès !** Votre code est maintenant sur GitHub !

Vérifiez : https://github.com/karimsaari-data/dark_massilia

## 🌍 Étape 6 : Déployer en Production (Vercel)

### Configuration Vercel

1. Allez sur https://vercel.com
2. Connectez-vous avec votre compte GitHub
3. Cliquez **"Add New Project"**
4. Importez `karimsaari-data/dark_massilia`
5. Configurez :
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

6. **Variables d'environnement** - Ajoutez :
   ```
   VITE_SUPABASE_URL=https://bzlllfmpojcybuyuemdx.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_clé_anon_ici
   VITE_APP_NAME=Dark Massilia
   VITE_APP_URL=https://dark-massilia.vercel.app
   VITE_CONTACT_EMAIL=email@karimsaari.com
   VITE_CONTACT_WHATSAPP=+33695331301
   ```

7. Cliquez **"Deploy"**

⏱️ Le déploiement prend ~2 minutes.

✅ Une fois terminé, vous aurez une URL : `https://dark-massilia.vercel.app`

### Déploiement automatique

Chaque fois que vous pushez sur `main`, Vercel redéploiera automatiquement ! 🚀

## 🔄 Workflow de développement

### Faire des modifications

```bash
# 1. Modifier vos fichiers
# 2. Tester localement
npm run dev

# 3. Builder pour vérifier
npm run build

# 4. Commiter
git add .
git commit -m "Description de vos changements"

# 5. Pusher
git push origin main

# 6. Vercel déploie automatiquement !
```

### Créer une branche de développement

```bash
# Créer une branche
git checkout -b dev

# Faire vos modifications...

# Commiter
git add .
git commit -m "Ajout nouvelle fonctionnalité"

# Pusher la branche
git push origin dev

# Sur GitHub, créer une Pull Request dev -> main
```

## 📝 Bonnes Pratiques

### Messages de commit

```bash
# ✅ Bon
git commit -m "Ajout page détail projet avec galerie photos"

# ✅ Bon
git commit -m "Fix: Correction affichage mobile sur page Contact"

# ❌ Mauvais
git commit -m "update"
```

### Avant chaque push

```bash
# Vérifier que ça compile
npm run build

# Vérifier les fichiers à commiter
git status

# Vérifier que .env n'est PAS listé
```

## 🆘 Problèmes Courants

### Erreur : "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/karimsaari-data/dark_massilia.git
```

### Erreur : "failed to push"

```bash
# Pull d'abord
git pull origin main --rebase

# Puis push
git push origin main
```

### Le déploiement Vercel échoue

1. Vérifiez les logs dans Vercel Dashboard
2. Vérifiez que toutes les variables d'env sont définies
3. Vérifiez que le build passe localement : `npm run build`

## 🎯 Prochaines Étapes

- [ ] Configurer un domaine personnalisé (karimsaari.com)
- [ ] Ajouter GitHub Actions pour CI/CD
- [ ] Configurer Lighthouse CI pour monitoring performance
- [ ] Ajouter des tests (Vitest + React Testing Library)

## 🔗 Liens Utiles

- **Repository** : https://github.com/karimsaari-data/dark_massilia
- **Documentation Vercel** : https://vercel.com/docs
- **Documentation Git** : https://git-scm.com/doc

---

**Votre site est maintenant en ligne ! 🌊**
