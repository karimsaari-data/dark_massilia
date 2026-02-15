import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { useProjects } from '../hooks/useSupabase';
import ProjectCard from '../components/ui/ProjectCard';
import { FADE_IN_UP, FADE_IN, STAGGER_CONTAINER, TAGLINE, MISSION_STATEMENT, FACEBOOK_GROUP_MEMBERS } from '../utils/constants';

const Home = () => {
  const { projects: featuredProjects, loading } = useProjects({ featured: true, limit: 3 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient overlay seulement (l'image de fond vient du Layout) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />

        {/* Hero Content */}
        <div className="container-custom relative z-10 text-center px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
            className="max-w-4xl mx-auto"
          >
            {/* Logo */}
            <motion.div variants={FADE_IN} className="mb-12">
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-white overflow-hidden animate-pulse-glow">
                <img
                  src="/assets/dark-massilia-logo.png"
                  alt="Logo Dark Massilia - Karim Saari éco-acteur et apnéiste"
                  className="w-full h-full object-contain"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
            </motion.div>

            {/* Tagline - Accroche principale */}
            <motion.h1
              variants={FADE_IN_UP}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="gradient-text block">Une Mer</span>
              <span className="gradient-text block">Une Ville</span>
              <span className="gradient-text block">Une Mission</span>
            </motion.h1>

            {/* Bio / Mission Statement */}
            <motion.p
              variants={FADE_IN_UP}
              className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Éco-acteur basé à Marseille, apnéiste engagé pour la préservation de la Méditerranée. Je documente les zones immergées des Calanques pour rendre visible l'impact des pollutions sous-marines. Avec <strong className="text-ocean-teal">Team Oxygen</strong>, chaque immersion est structurée comme une opération de dépollution et de collecte de données environnementales.
            </motion.p>

            {/* Signature */}
            <motion.div
              variants={FADE_IN_UP}
              className="flex justify-center"
            >
              <img
                src="/images/Karim-SAARI-white-low-res.png"
                alt="Signature Karim Saari"
                className="h-32 md:h-40 lg:h-48 opacity-90"
              />
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* Missions Section - Card moderne */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu - Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Découvrir nos Missions
              </h2>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Explorez nos actions de dépollution des Calanques de Marseille. De la protection de la faune marine au nettoyage des fonds, chaque mission contribue à préserver notre Méditerranée.
              </p>

              <Link
                to="/missions"
                className="btn-primary inline-flex items-center gap-2 w-fit"
              >
                <span>Découvrir nos missions</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Image Team Oxygen - Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.jpg"
                alt="Team Oxygen - Projet Sentinelle Marseille"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '12% 25%' }}
              />
              {/* Overlay subtil */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action Section - Card moderne */}
      <section className="container-custom pb-8 md:pb-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu - Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Rejoignez l'Aventure
              </h2>

              {/* Badge nombre de membres */}
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-ocean-teal/10 rounded-full border border-ocean-teal/30 w-fit">
                <Users className="w-5 h-5 text-ocean-teal" />
                <span className="text-xl font-bold text-white">
                  {FACEBOOK_GROUP_MEMBERS.toLocaleString('fr-FR')}
                </span>
                <span className="text-gray-300">membres</span>
              </div>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Amoureux des Calanques de Marseille à Port-Cros ? Rejoignez notre communauté pour suivre nos actions et participer à la protection de la Méditerranée.
              </p>

              <a
                href="https://www.facebook.com/groups/calanque/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 w-fit"
              >
                <span>Rejoindre le Groupe Facebook</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Image du groupe Facebook - Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/groupe%20des%20amoureux%20des%20calanques.jpg"
                alt="Groupe Facebook Amoureux des Calanques de Marseille à Port-Cros"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '12% 25%' }}
              />
              {/* Overlay subtil */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
