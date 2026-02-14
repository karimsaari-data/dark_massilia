import { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Camera, Film } from 'lucide-react';
import { useMedia } from '../hooks/useSupabase';
import VideoPlayer from '../components/media/VideoPlayer';
import { FADE_IN_UP, STAGGER_CONTAINER, SOCIAL_LINKS } from '../utils/constants';

const Medias = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { media, loading } = useMedia({
    type: activeTab === 'all' ? null : activeTab,
  });

  const tabs = [
    { id: 'all', label: 'Tous', icon: Film },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'vimeo', label: 'Vimeo', icon: Film },
    { id: '500px', label: 'Photos', icon: Camera },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-12"
        >
          <motion.h1 variants={FADE_IN_UP} className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Médias</span> & Galeries
          </motion.h1>
          <motion.p variants={FADE_IN_UP} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Plongez dans notre collection de vidéos sous-marines, reportages et photographies des Calanques
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-ocean-teal/20 text-ocean-teal border border-ocean-teal/30 glow-teal'
                    : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Media Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton aspect-video rounded-2xl" />
            ))}
          </div>
        ) : media.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {media.map((item) => (
              <motion.div key={item.id} variants={FADE_IN_UP} className="card">
                <VideoPlayer media={item} />
                {item.title && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-400">{item.description}</p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 mb-8">Aucun média disponible pour le moment.</p>
          </motion.div>
        )}

        {/* External Links */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mt-20"
        >
          <motion.h2 variants={FADE_IN_UP} className="text-2xl font-bold text-white mb-8 text-center">
            Retrouvez-nous aussi sur
          </motion.h2>
          <motion.div variants={STAGGER_CONTAINER} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'YouTube',
                icon: Youtube,
                url: SOCIAL_LINKS.youtube,
                description: 'Chaîne officielle Dark Massilia',
                color: '#FF0000',
              },
              {
                name: 'TikTok',
                icon: Film,
                url: SOCIAL_LINKS.tiktok,
                description: 'Contenus courts et impactants',
                color: '#000000',
              },
              {
                name: '500px',
                icon: Camera,
                url: SOCIAL_LINKS.px500,
                description: 'Portfolio photographie sous-marine',
                color: '#0099E5',
              },
            ].map((platform) => (
              <motion.a
                key={platform.name}
                variants={FADE_IN_UP}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    <platform.icon
                      className="w-6 h-6"
                      style={{ color: platform.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-ocean-teal transition-colors">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-gray-400">{platform.description}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Medias;
