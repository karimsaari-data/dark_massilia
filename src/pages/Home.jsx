import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Waves, Trash2, Camera } from 'lucide-react';
import { useProjects } from '../hooks/useSupabase';
import ProjectCard from '../components/ui/ProjectCard';
import { FADE_IN_UP, FADE_IN, STAGGER_CONTAINER, TAGLINE, MISSION_STATEMENT } from '../utils/constants';

const Home = () => {
  const { projects: featuredProjects, loading } = useProjects({ featured: true, limit: 3 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center parallax"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-abyss" />
        </motion.div>

        {/* Hero Content */}
        <div className="container-custom relative z-10 text-center px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
            className="max-w-4xl mx-auto"
          >
            {/* Avatar */}
            <motion.div variants={FADE_IN} className="mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-white overflow-hidden animate-pulse-glow">
                <img
                  src="/dark_massilia_karim_saari.png"
                  alt="Dark Massilia - Karim Saari"
                  className="w-full h-full object-contain"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div variants={FADE_IN_UP} className="mb-6">
              <span className="inline-block px-6 py-2 glass rounded-full text-sm md:text-base font-semibold text-ocean-teal border border-ocean-teal/30 glow-teal">
                Dark Massilia · Karim Saari
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.h1
              variants={FADE_IN_UP}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="gradient-text">{TAGLINE}</span>
            </motion.h1>

            {/* Mission Statement */}
            <motion.p
              variants={FADE_IN_UP}
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              {MISSION_STATEMENT}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={FADE_IN_UP}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/missions" className="btn-primary inline-flex items-center gap-2 group">
                <span>Découvrir nos missions</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://www.facebook.com/groups/calanque/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <span>Rejoindre le groupe</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={FADE_IN}
              className="grid grid-cols-3 gap-6 md:gap-12 mt-20 max-w-2xl mx-auto"
            >
              {[
                { icon: Waves, label: 'Apnée', value: '20m' },
                { icon: Trash2, label: 'Dépollution', value: '450kg' },
                { icon: Camera, label: 'Photos', value: '500+' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-ocean-teal" />
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-ocean-teal rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section className="container-custom py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={STAGGER_CONTAINER}
        >
          {/* Section Header */}
          <motion.div variants={FADE_IN_UP} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dernières <span className="gradient-text">Missions</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Découvrez nos actions de dépollution, nos plongées en apnée et nos expéditions dans les Calanques de Marseille
            </p>
          </motion.div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-96 rounded-2xl" />
              ))}
            </div>
          ) : featuredProjects.length > 0 ? (
            <motion.div
              variants={STAGGER_CONTAINER}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  featured={featuredProjects.indexOf(project) === 0}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div variants={FADE_IN_UP} className="text-center py-12">
              <p className="text-gray-400">Aucun projet disponible pour le moment.</p>
            </motion.div>
          )}

          {/* View All Button */}
          {featuredProjects.length > 0 && (
            <motion.div variants={FADE_IN_UP} className="text-center mt-12">
              <Link to="/missions" className="btn-secondary inline-flex items-center gap-2 group">
                <span>Voir toutes les missions</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="container-custom py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-ocean-pattern" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Rejoignez l'Aventure
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Amoureux des Calanques de Marseille à Port-Cros ? Rejoignez notre communauté pour suivre nos actions et participer à la protection de la Méditerranée.
            </p>
            <a
              href="https://www.facebook.com/groups/calanque/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <span>Rejoindre le Groupe Facebook</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
