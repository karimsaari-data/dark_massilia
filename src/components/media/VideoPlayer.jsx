import { useState } from 'react';
import { Play } from 'lucide-react';
import { getYouTubeId, getVimeoId, getVideoThumbnail } from '../../utils/helpers';

/**
 * VideoPlayer with Facade Pattern
 * Only loads iframe when user clicks to play (performance optimization)
 */
const VideoPlayer = ({ media, autoplay = false }) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const { type, url, embed_id, thumbnail_url, title } = media;

  const videoId = embed_id || getYouTubeId(url) || getVimeoId(url);

  // Generate embed URL based on platform
  const getEmbedUrl = () => {
    switch (type) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
      case 'tiktok':
        return `https://www.tiktok.com/embed/${videoId}`;
      default:
        return null;
    }
  };

  // Generate thumbnail
  const getThumbnail = () => {
    if (thumbnail_url) return thumbnail_url;
    if (type === 'youtube' && videoId) {
      return getVideoThumbnail('youtube', videoId);
    }
    return null;
  };

  const thumbnail = getThumbnail();
  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 text-sm">Format vidéo non supporté</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-black group">
      {!isPlaying ? (
        <>
          {/* Thumbnail with Play Button (Facade) */}
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ocean-teal/20 to-ocean-blue/20" />
          )}

          {/* Play Button Overlay */}
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-all duration-300 cursor-pointer group"
            aria-label="Play video"
          >
            <div className="w-20 h-20 rounded-full bg-ocean-teal/90 hover:bg-ocean-teal flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 glow-teal">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </button>

          {/* Title Overlay */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-semibold">{title}</p>
            </div>
          )}
        </>
      ) : (
        /* Iframe - Only loaded when playing */
        <iframe
          src={embedUrl}
          title={title || 'Video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
