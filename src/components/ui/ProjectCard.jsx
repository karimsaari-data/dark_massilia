import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { formatDate, truncate } from '../../utils/helpers';
import { FADE_IN_UP } from '../../utils/constants';

const ProjectCard = ({ project, featured = false }) => {
  const { title, slug, description, featured_image, location, date, category, tags } = project;

  return (
    <motion.div
      variants={FADE_IN_UP}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`group ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <Link to={`/missions/${slug}`} className="block h-full">
        <div className="card h-full overflow-hidden">
          {/* Image */}
          <div className="relative aspect-video md:aspect-[16/10] overflow-hidden rounded-lg mb-4">
            {featured_image ? (
              <img
                src={featured_image}
                alt={title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-ocean-teal/20 to-ocean-blue/20 flex items-center justify-center">
                <span className="text-6xl opacity-20">🌊</span>
              </div>
            )}

            {/* Category Badge */}
            {category && (
              <div
                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold glass backdrop-blur-md"
                style={{
                  backgroundColor: `${category.color}20`,
                  borderColor: `${category.color}40`,
                }}
              >
                <span style={{ color: category.color }}>
                  {category.name}
                </span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div>
            <h3 className={`font-bold text-white mb-2 group-hover:text-ocean-teal transition-colors ${
              featured ? 'text-2xl' : 'text-xl'
            }`}>
              {title}
            </h3>

            {description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {truncate(description, featured ? 200 : 120)}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(date, 'short')}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{location}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-400 glass rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
