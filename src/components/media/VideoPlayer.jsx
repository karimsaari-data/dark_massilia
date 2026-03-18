import { useState } from 'react';
import { Play } from 'lucide-react';
import { getYouTubeId, getVimeoId, getVideoThumbnail } from '../../utils/helpers';
import VideoModal from './VideoModal';
import { trackEvent } from '../../lib/analytics';

/**
 * VideoPlayer with Facade Pattern + Modal
 * Thumbnail shown by default, video opens in a modal overlay on click.
 */
const VideoPlayer = ({ media }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { type, url, embed_id, thumbnail_url, title } = media;

  const videoId = embed_id || getYouTubeId(url) || getVimeoId(url);

  const getEmbedUrl = () => {
    switch (type) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
      case 'tiktok':
        return `https://www.tiktok.com/embed/${videoId}`;
      default:
        return null;
    }
  };

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
    <>
      {/* Thumbnail card — ouvre la modale au clic */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black group">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title || 'Video thumbnail'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ocean-teal/20 to-ocean-blue/20" />
        )}

        {/* Play Button Overlay */}
        <button
          onClick={() => { setIsModalOpen(true); trackEvent('video_play', { video_title: title }); }}
          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-all duration-300 cursor-pointer"
          aria-label={`Lire : ${title}`}
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
      </div>

      {/* Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        embedUrl={embedUrl}
        title={title}
      />
    </>
  );
};

export default VideoPlayer;
