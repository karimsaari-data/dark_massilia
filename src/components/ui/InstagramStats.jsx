import { useState, useEffect } from 'react';
import { Users, Image } from 'lucide-react';

const InstagramStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstagramStats();
  }, []);

  const fetchInstagramStats = async () => {
    try {
      const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

      if (!ACCESS_TOKEN) {
        console.error('Token Instagram non configuré');
        setLoading(false);
        return;
      }

      // Récupérer les informations du compte Instagram
      const url = `https://graph.instagram.com/me?fields=id,username,followers_count,follows_count,media_count&access_token=${ACCESS_TOKEN}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error('Erreur API Instagram:', data.error);
        setLoading(false);
        return;
      }

      setStats({
        followers: data.followers_count,
        following: data.follows_count,
        posts: data.media_count,
        username: data.username,
      });
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des stats Instagram:', err);
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num?.toLocaleString('fr-FR') || '0';
  };

  if (loading) {
    return (
      <div className="glass-strong rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center gap-8">
          <div className="skeleton h-16 w-32 rounded-xl" />
          <div className="skeleton h-16 w-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="glass-strong rounded-2xl p-6 mb-8 border border-white/10">
      <div className="flex items-center justify-center gap-8 md:gap-12">
        {/* Abonnés */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-ocean-teal" />
            <span className="text-2xl md:text-3xl font-bold text-white">
              {formatNumber(stats.followers)}
            </span>
          </div>
          <span className="text-sm text-gray-400">Abonnés</span>
        </div>

        {/* Séparateur */}
        <div className="h-12 w-px bg-white/20" />

        {/* Posts */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-ocean-teal" />
            <span className="text-2xl md:text-3xl font-bold text-white">
              {formatNumber(stats.posts)}
            </span>
          </div>
          <span className="text-sm text-gray-400">Publications</span>
        </div>
      </div>
    </div>
  );
};

export default InstagramStats;
