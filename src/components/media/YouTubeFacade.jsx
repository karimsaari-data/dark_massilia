import { useState } from 'react';

/**
 * YouTubeFacade — Remplace l'iframe YouTube par une miniature statique.
 * L'iframe (et ses ~500 KB de scripts) ne se charge qu'au clic utilisateur.
 * Gain : supprime l'impact YouTube sur les Core Web Vitals (Perf + BP).
 */
export default function YouTubeFacade({ videoId, title }) {
  const [loaded, setLoaded] = useState(false);

  const launch = () => setLoaded(true);

  if (loaded) {
    return (
      <div className="relative aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video bg-black cursor-pointer group"
      onClick={launch}
      onKeyDown={e => e.key === 'Enter' && launch()}
      role="button"
      tabIndex={0}
      aria-label={`Lancer la vidéo : ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        width="480"
        height="360"
      />
      {/* Bouton Play */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-xl">
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
