/**
 * RecentArticles.jsx — Section "Derniers articles" lazy-loadée
 * Utilisé sur Home.jsx + potentiellement d'autres pages
 * Fetch les 3 derniers articles WP au montage (client) ou via prerender (SSR)
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { fetchPosts } from '../utils/api';
import { CATEGORIES } from '../pages/Blog';

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
      {/* Titre + lien "Voir tous" */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
        >
          Voir tous les articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Raccourcis catégories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.id}
            to={`/blog/categorie/${cat.slug}`}
            className="px-3 py-1 rounded-full text-xs font-semibold glass text-text-secondary hover:text-white border border-white/10 hover:border-ocean-teal/40 hover:bg-ocean-teal/10 transition-all duration-200"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="glass-strong rounded-2xl overflow-hidden border border-white/10 hover:border-ocean-teal/40 transition-all duration-300 group flex flex-col hover:shadow-[0_8px_32px_rgba(0,171,168,0.12)] hover:-translate-y-1"
          >
            {/* Thumbnail ou placeholder gradient */}
            <div className="aspect-video overflow-hidden flex-shrink-0 relative">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(0,171,168,0.18) 0%, rgba(0,60,120,0.35) 55%, rgba(11,28,45,0.6) 100%)' }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 80 40" className="w-24 opacity-20" fill="none">
                    <path d="M0 30 Q10 10 20 25 Q30 40 40 20 Q50 0 60 18 Q70 36 80 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M0 38 Q10 20 20 33 Q30 46 40 28 Q50 10 60 26 Q70 42 80 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" fill="none" opacity="0.5" />
                  </svg>
                </div>
              )}
              {/* Badge catégorie flottant sur l'image */}
              {(() => {
                const cat = CATEGORIES.find(c => post.categories?.includes(c.id));
                return cat ? (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 text-ocean-teal text-xs font-semibold">
                    {cat.name}
                  </span>
                ) : null;
              })()}
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {new Date(post.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-ocean-teal transition-colors duration-200 line-clamp-2 flex-1" style={{ fontFamily: 'Montserrat, system-ui, sans-serif', letterSpacing: '-0.01em' }}>
                {post.title}
              </h3>
              <p className="text-text-secondary text-sm line-clamp-2 mt-auto leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
