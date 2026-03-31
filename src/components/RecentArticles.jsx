/**
 * RecentArticles.jsx — Section "Derniers articles" lazy-loadée
 * Utilisé sur Home.jsx + potentiellement d'autres pages
 * Fetch les 3 derniers articles WP au montage (client) ou via prerender (SSR)
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { fetchPosts } from '../utils/api';

export default function RecentArticles({ title = 'Derniers articles', count = 3, excludeSlug = null }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts({ perPage: excludeSlug ? count + 1 : count })
      .then(({ posts: raw }) => {
        const filtered = excludeSlug ? raw.filter(p => p.slug !== excludeSlug) : raw;
        setPosts(filtered.slice(0, count));
      })
      .catch(() => {});
  }, [count, excludeSlug]);

  if (posts.length === 0) return null;

  return (
    <section className="container-custom pb-12 md:pb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
        >
          Voir tous les articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="glass-strong rounded-2xl overflow-hidden border border-white/10 hover:border-ocean-teal/40 transition-all duration-300 group flex flex-col"
          >
            {post.image && (
              <div className="aspect-video overflow-hidden flex-shrink-0">
                <img
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {new Date(post.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-ocean-teal transition-colors line-clamp-2 flex-1">
                {post.title}
              </h3>
              <p className="text-text-secondary text-sm line-clamp-2 mt-auto">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
