import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Heart, MessageCircle } from 'lucide-react';

const InstagramFeed = ({ limit = 9 }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async () => {
    try {
      setLoading(true);

      // Récupération du token depuis les variables d'environnement
      const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

      if (!ACCESS_TOKEN) {
        console.error('Token Instagram non configuré');
        // Fallback sur les données de démonstration si le token n'est pas configuré
        const demoData = generateDemoPosts(limit);
        setPosts(demoData);
        setLoading(false);
        return;
      }

      // Appel à l'API Instagram Graph
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${ACCESS_TOKEN}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error('Erreur API Instagram:', data.error);
        throw new Error(data.error.message);
      }

      // Traiter les données reçues
      const processedPosts = data.data.map(post => ({
        id: post.id,
        media_type: post.media_type,
        // Utiliser thumbnail_url pour les vidéos, sinon media_url
        media_url: post.media_type === 'VIDEO' && post.thumbnail_url
          ? post.thumbnail_url
          : post.media_url,
        permalink: post.permalink,
        caption: post.caption || '',
        timestamp: post.timestamp,
        like_count: post.like_count || 0,
        comments_count: post.comments_count || 0,
      }));

      setPosts(processedPosts);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des posts Instagram:', err);
      setError('Impossible de charger les posts Instagram');

      // Fallback sur les données de démonstration en cas d'erreur
      const demoData = generateDemoPosts(limit);
      setPosts(demoData);
      setLoading(false);
    }
  };

  // Données de démonstration (à remplacer par les vraies données)
  const generateDemoPosts = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `demo_${i + 1}`,
      media_type: i % 3 === 0 ? 'VIDEO' : 'IMAGE',
      media_url: `/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-${['apneiste', 'frioul-1', 'grotte', 'moyades', 'musée', 'poulpe', 'shooting', 'vélo', 'angel'][i] || 'apneiste'}.webp`,
      permalink: 'https://www.instagram.com/karimsaari',
      caption: `Projet Sentinelle - Mission ${i + 1} 🌊 Dépollution des Calanques de Marseille`,
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      like_count: Math.floor(Math.random() * 500) + 100,
      comments_count: Math.floor(Math.random() * 50) + 5,
    }));
  };

  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const FADE_IN_UP = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="skeleton aspect-square rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Instagram className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <p className="text-text-muted">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Instagram className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <p className="text-text-muted">Aucun post Instagram disponible</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={STAGGER_CONTAINER}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {posts.map((post) => (
        <motion.a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          variants={FADE_IN_UP}
          whileHover={{ y: -8, scale: 1.02 }}
          className="group relative aspect-square rounded-2xl overflow-hidden glass-strong hover:ring-2 hover:ring-ocean-teal/50 transition-all duration-300"
        >
          {/* Image de fond */}
          <div className="absolute inset-0 bg-abyss">
            <img
              src={post.media_url}
              alt={post.caption?.substring(0, 100) || 'Instagram post'}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge VIDEO si applicable */}
          {post.media_type === 'VIDEO' && (
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full text-xs font-semibold text-white flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>VIDÉO</span>
              </div>
            </div>
          )}

          {/* Contenu au hover */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {/* Stats */}
            <div className="flex items-center space-x-4 mb-3">
              {post.like_count && (
                <div className="flex items-center space-x-1.5 text-white">
                  <Heart className="w-4 h-4 fill-white" />
                  <span className="text-sm font-semibold">{post.like_count}</span>
                </div>
              )}
              {post.comments_count && (
                <div className="flex items-center space-x-1.5 text-white">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">{post.comments_count}</span>
                </div>
              )}
            </div>

            {/* Caption (tronquée) */}
            {post.caption && (
              <p className="text-sm text-white line-clamp-2 mb-3">
                {post.caption}
              </p>
            )}

            {/* Bouton "Voir sur Instagram" */}
            <div className="flex items-center space-x-2 text-ocean-teal font-semibold text-sm">
              <span>Voir sur Instagram</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>

          {/* Instagram icon badge (toujours visible en haut à gauche) */}
          <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
              <Instagram className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
};

export default InstagramFeed;
