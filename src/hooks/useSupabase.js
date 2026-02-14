import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook personnalisé pour récupérer les projets depuis Supabase
 * @param {Object} options - Options de filtrage
 * @param {string} options.category - Slug de la catégorie
 * @param {boolean} options.featured - Filtrer les projets mis en avant
 * @param {number} options.limit - Nombre maximum de résultats
 */
export const useProjects = ({ category = null, featured = false, limit = null } = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('projects')
          .select(`
            *,
            category:categories(name, slug, icon, color)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (category) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', category)
            .single();

          if (categoryData) {
            query = query.eq('category_id', categoryData.id);
          }
        }

        if (featured) {
          query = query.eq('is_featured', true);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setProjects(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category, featured, limit]);

  return { projects, loading, error };
};

/**
 * Hook pour récupérer les catégories
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .order('order_index', { ascending: true });

        if (fetchError) throw fetchError;
        setCategories(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

/**
 * Hook pour récupérer un projet spécifique par son slug
 */
export const useProject = (slug) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select(`
            *,
            category:categories(name, slug, icon, color),
            media:media_links(*)
          `)
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (fetchError) throw fetchError;
        setProject(data);

        // Incrémenter le compteur de vues (optionnel)
        if (data) {
          await supabase
            .from('projects')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  return { project, loading, error };
};

/**
 * Hook pour récupérer les médias
 */
export const useMedia = ({ type = null, featured = false, limit = null } = {}) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('media_links')
          .select(`
            *,
            project:projects(title, slug)
          `)
          .order('order_index', { ascending: true });

        if (type) {
          query = query.eq('type', type);
        }

        if (featured) {
          query = query.eq('is_featured', true);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setMedia(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching media:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [type, featured, limit]);

  return { media, loading, error };
};

/**
 * Hook pour soumettre le formulaire de contact
 */
export const useContactSubmit = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const submitContact = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      const { error: submitError } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (submitError) throw submitError;

      setSuccess(true);
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error submitting contact form:', err);
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  return { submitContact, submitting, success, error };
};
