# Dark Massilia - Application React

Site web moderne et ultra-performant pour Dark Massilia (Karim Saari), sentinelle de la Méditerranée.

## 🚀 Installation Rapide

```bash
npm install
cp .env.example .env
# Éditez .env avec vos clés Supabase
npm run dev
```

## 📦 Stack Technique

- React 18 + Vite
- Tailwind CSS + Framer Motion
- Supabase (PostgreSQL + RLS)
- React Router DOM
- Lucide React Icons

## 🔧 Configuration Supabase

1. Exécutez `supabase-schema.sql` dans le SQL Editor
2. Récupérez vos clés API dans Settings > API
3. Mettez à jour le fichier `.env`

## 📁 Structure

```
src/
├── components/     # Composants réutilisables
├── pages/          # Pages (Home, Missions, Medias, Contact)
├── hooks/          # Hooks Supabase
├── lib/            # Client Supabase
└── utils/          # Helpers & constantes
```

Voir documentation complète dans le projet.
