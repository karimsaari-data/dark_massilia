import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects, useCategories } from '../hooks/useSupabase';
import ProjectCard from '../components/ui/ProjectCard';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import * as LucideIcons from 'lucide-react';

const Missions = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categories } = useCategories();
  const { projects, loading } = useProjects({ category: selectedCategory });

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
            Nos <span className="gradient-text">Missions</span>
          </motion.h1>
          <motion.p variants={FADE_IN_UP} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Découvrez toutes nos actions de dépollution, plongées en apnée et expéditions pour protéger la Méditerranée
          </motion.p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-ocean-teal/20 text-ocean-teal border border-ocean-teal/30 glow-teal'
                : 'glass text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Toutes
          </button>
          {categories.map((category) => {
            const IconComponent = LucideIcons[category.icon];
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'border'
                    : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                style={
                  selectedCategory === category.slug
                    ? {
                        backgroundColor: `${category.color}20`,
                        borderColor: `${category.color}40`,
                        color: category.color,
                        boxShadow: `0 0 20px ${category.color}30`,
                      }
                    : {}
                }
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                <span>{category.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-96 rounded-2xl" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <LucideIcons.Inbox className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucune mission trouvée</h3>
            <p className="text-gray-500">
              {selectedCategory
                ? 'Essayez de sélectionner une autre catégorie'
                : 'Les missions seront bientôt disponibles'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Missions;
