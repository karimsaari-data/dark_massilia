import { useState } from 'react';

/**
 * VimeoFacade — Équivalent de YouTubeFacade pour Vimeo.
 * Vimeo n'offrant pas d'URL de miniature statique prévisible (contrairement à
 * YouTube), la vignette est fournie en prop (photo du tournage). L'iframe
 * (et le SDK Vimeo) ne se charge qu'au clic utilisateur.
 */
export default function VimeoFacade({ videoId, title, poster, aspectClass = 'aspect-video' }) {
  const [loaded, setLoaded] = useState(false);

  const launch = () => setLoaded(true);

  if (loaded) {
    return (
      <div className={`relative ${aspectClass} bg-black`}>
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${aspectClass} bg-black cursor-pointer group`}
      onClick={launch}
      onKeyDown={e => e.key === 'Enter' && launch()}
      role="button"
      tabIndex={0}
      aria-label={`Lancer la vidéo : ${title}`}
    >
      <img
        src={poster}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        width="1280"
        height="720"
      />
      {/* Bouton Play */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
        <div className="w-16 h-16 rounded-full bg-astroide flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-xl">
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
