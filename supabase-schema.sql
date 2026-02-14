-- =====================================================
-- DARK MASSILIA - Schéma SQL Supabase
-- Base de données PostgreSQL avec Row Level Security
-- =====================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: categories
-- Gestion des catégories de projets/missions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50), -- Nom de l'icône Lucide React
  color VARCHAR(7) DEFAULT '#21c47b', -- Couleur hex pour la catégorie
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index pour les requêtes par slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- =====================================================
-- TABLE: projects
-- Missions, expéditions, et actions de dépollution
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  content TEXT, -- Contenu détaillé en Markdown
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  featured_image VARCHAR(500), -- URL de l'image principale
  location VARCHAR(200), -- ex: "Calanques de Marseille"
  date DATE, -- Date de la mission
  status VARCHAR(50) DEFAULT 'published', -- published, draft, archived
  tags TEXT[], -- Array de tags pour le filtrage
  metadata JSONB, -- Données supplémentaires (poids déchets, durée, participants, etc.)
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false, -- Mettre en avant sur la home
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_projects_tags ON public.projects USING GIN(tags);

-- =====================================================
-- TABLE: media_links
-- Liens vers vidéos et photos externes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.media_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- youtube, tiktok, vimeo, 500px, instagram
  title VARCHAR(255),
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  embed_id VARCHAR(200), -- ID pour les embeds (ex: YouTube video ID)
  description TEXT,
  duration INTEGER, -- Durée en secondes pour les vidéos
  platform_data JSONB, -- Métadonnées spécifiques à la plateforme
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_media_project ON public.media_links(project_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media_links(type);
CREATE INDEX IF NOT EXISTS idx_media_featured ON public.media_links(is_featured) WHERE is_featured = true;

-- =====================================================
-- TABLE: contact_submissions
-- Formulaire de contact
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'new', -- new, read, replied, archived
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_submissions(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES: categories
-- Public Read / Admin Write
-- =====================================================

-- Lecture publique
CREATE POLICY "Public can read categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Création (Admin uniquement)
CREATE POLICY "Admin can insert categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Mise à jour (Admin uniquement)
CREATE POLICY "Admin can update categories"
  ON public.categories
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Suppression (Admin uniquement)
CREATE POLICY "Admin can delete categories"
  ON public.categories
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- POLICIES: projects
-- Public Read (published only) / Admin Write
-- =====================================================

-- Lecture publique des projets publiés
CREATE POLICY "Public can read published projects"
  ON public.projects
  FOR SELECT
  USING (status = 'published');

-- Admin peut tout lire
CREATE POLICY "Admin can read all projects"
  ON public.projects
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Création (Admin uniquement)
CREATE POLICY "Admin can insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Mise à jour (Admin uniquement)
CREATE POLICY "Admin can update projects"
  ON public.projects
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Suppression (Admin uniquement)
CREATE POLICY "Admin can delete projects"
  ON public.projects
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- POLICIES: media_links
-- Public Read / Admin Write
-- =====================================================

-- Lecture publique des médias liés à des projets publiés
CREATE POLICY "Public can read media of published projects"
  ON public.media_links
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = media_links.project_id
      AND projects.status = 'published'
    )
    OR project_id IS NULL
  );

-- Admin peut tout lire
CREATE POLICY "Admin can read all media"
  ON public.media_links
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Création (Admin uniquement)
CREATE POLICY "Admin can insert media"
  ON public.media_links
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Mise à jour (Admin uniquement)
CREATE POLICY "Admin can update media"
  ON public.media_links
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Suppression (Admin uniquement)
CREATE POLICY "Admin can delete media"
  ON public.media_links
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- POLICIES: contact_submissions
-- Insert Only (pas de lecture publique)
-- =====================================================

-- Tout le monde peut soumettre un message
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Admin peut tout lire
CREATE POLICY "Admin can read submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin peut mettre à jour le statut
CREATE POLICY "Admin can update submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- FUNCTIONS
-- Trigger pour updated_at automatique
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur toutes les tables avec updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.media_links
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- DONNÉES D'EXEMPLE (Seed Data)
-- =====================================================

-- Catégories par défaut
INSERT INTO public.categories (name, slug, description, icon, color, order_index) VALUES
  ('Dépollution', 'depollution', 'Missions de nettoyage des fonds marins', 'Trash2', '#21c47b', 1),
  ('Apnée', 'apnee', 'Plongées en apnée et exploration sous-marine', 'Waves', '#0091ff', 2),
  ('Expéditions', 'expeditions', 'Grandes expéditions et projets Sentinelle', 'Map', '#ff6b35', 3),
  ('Sensibilisation', 'sensibilisation', 'Actions de sensibilisation et éducation', 'MessageCircle', '#ffd93d', 4)
ON CONFLICT (slug) DO NOTHING;

-- Projet d'exemple
INSERT INTO public.projects (
  title,
  slug,
  description,
  content,
  category_id,
  featured_image,
  location,
  date,
  status,
  tags,
  metadata,
  is_featured,
  published_at
) VALUES (
  'Projet Sentinelle 2024',
  'projet-sentinelle-2024',
  'Une semaine de dépollution intensive dans les Calanques de Marseille, de 0 à 20 mètres de profondeur.',
  '# Projet Sentinelle 2024\n\nUne fois par an, à l''automne, nous organisons une grande dépollution d''une semaine en apnée...',
  (SELECT id FROM public.categories WHERE slug = 'depollution'),
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
  'Calanques de Marseille',
  '2024-10-01',
  'published',
  ARRAY['dépollution', 'calanques', 'team oxygen', 'sentinelle'],
  '{"waste_collected_kg": 450, "duration_hours": 35, "participants": 12, "depth_max_m": 20}'::jsonb,
  true,
  TIMEZONE('utc', NOW())
)
ON CONFLICT (slug) DO NOTHING;

-- Média d'exemple
INSERT INTO public.media_links (
  project_id,
  type,
  title,
  url,
  embed_id,
  description,
  is_featured
) VALUES (
  (SELECT id FROM public.projects WHERE slug = 'projet-sentinelle-2024'),
  'vimeo',
  'Documentaire Projet Sentinelle',
  'https://vimeo.com/1023375117',
  '1023375117',
  'Ce documentaire retrace le tournage effectué durant Sentinelle 3 dans le Parc National des Calanques.',
  true
);

-- =====================================================
-- VUES UTILES (Optionnel mais recommandé)
-- =====================================================

-- Vue pour les projets avec leurs catégories
CREATE OR REPLACE VIEW public.projects_with_categories AS
SELECT
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  c.icon as category_icon,
  c.color as category_color
FROM public.projects p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.status = 'published';

-- Vue pour les projets featured avec comptage de médias
CREATE OR REPLACE VIEW public.featured_projects AS
SELECT
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  COUNT(m.id) as media_count
FROM public.projects p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.media_links m ON m.project_id = p.id
WHERE p.status = 'published' AND p.is_featured = true
GROUP BY p.id, c.name, c.slug
ORDER BY p.published_at DESC;

COMMENT ON SCHEMA public IS 'Dark Massilia - Application de gestion de projets écologiques';
COMMENT ON TABLE public.projects IS 'Table principale des missions et projets de dépollution';
COMMENT ON TABLE public.categories IS 'Catégories de classification des projets';
COMMENT ON TABLE public.media_links IS 'Liens vers contenus multimédias externes (YouTube, Vimeo, 500px, etc.)';
COMMENT ON TABLE public.contact_submissions IS 'Soumissions du formulaire de contact';
