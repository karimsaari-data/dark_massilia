import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, AlertTriangle } from 'lucide-react';
import { useProjects } from '../hooks/useSupabase';
import ProjectCard from '../components/ui/ProjectCard';
import { FADE_IN_UP, FADE_IN, STAGGER_CONTAINER, TAGLINE, MISSION_STATEMENT, FACEBOOK_GROUP_MEMBERS } from '../utils/constants';
import { useState, useEffect } from 'react';

// Phrases choc sur la pollution marine
const IMPACT_FACTS = [
  "8 millions de tonnes de plastique sont déversées chaque année dans l'océan.",
  "80 % des déchets marins proviennent d'activités terrestres.",
  "95 % des déchets flottants en Méditerranée sont des plastiques.",
  "Plus de 90 % des oiseaux marins ont déjà ingéré du plastique.",
  "La Méditerranée est l'une des mers les plus polluées au monde en concentration de microplastiques.",
  "La Méditerranée concentre 7 % des microplastiques mondiaux pour moins de 1 % de la surface océanique.",
  "Un sac plastique peut persister plusieurs centaines d'années en mer.",
  "Plus de 600 espèces marines méditerranéennes sont affectées par les déchets plastiques.",
];

const Home = () => {
  const { projects: featuredProjects, loading } = useProjects({ featured: true, limit: 3 });
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Auto-rotation des phrases choc
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % IMPACT_FACTS.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

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
                  src="/assets/dark-massilia-logo.webp"
                  alt="Logo Dark Massilia - Karim Saari éco-acteur et apnéiste"
                  className="w-full h-full object-contain"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
            </motion.div>

            {/* Tagline - Accroche principale avec animations modernes */}
            <motion.h1
              variants={FADE_IN_UP}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight perspective-1000"
            >
              {/* Une Mer - Gradient animé bleu océan */}
              <motion.span
                className="block relative py-2 cursor-pointer"
                style={{
                  background: 'linear-gradient(90deg, #21c47b, #0091ff, #21c47b, #0091ff)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                whileHover={{
                  scale: 1.05,
                  rotateX: 8,
                  y: -5,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                Une Mer
              </motion.span>

              {/* Une Ville - Gradient animé vert/cyan */}
              <motion.span
                className="block relative py-2 cursor-pointer"
                style={{
                  background: 'linear-gradient(90deg, #0091ff, #21c47b, #00d4ff, #21c47b)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5
                }}
                whileHover={{
                  scale: 1.08,
                  rotateY: 8,
                  x: 10,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                Une Ville
              </motion.span>

              {/* Une Mission - Gradient animé avec effet glow */}
              <motion.span
                className="block relative py-2 cursor-pointer"
                style={{
                  background: 'linear-gradient(90deg, #21c47b, #ffd93d, #0091ff, #21c47b)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(33, 196, 123, 0.4))',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  filter: [
                    'drop-shadow(0 0 20px rgba(33, 196, 123, 0.4))',
                    'drop-shadow(0 0 40px rgba(0, 145, 255, 0.6))',
                    'drop-shadow(0 0 20px rgba(33, 196, 123, 0.4))'
                  ]
                }}
                transition={{
                  backgroundPosition: {
                    duration: 7,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1
                  },
                  filter: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                whileHover={{
                  scale: 1.1,
                  rotateZ: 2,
                  y: -8,
                  filter: 'drop-shadow(0 0 60px rgba(33, 196, 123, 0.9))',
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                Une Mission
              </motion.span>
            </motion.h1>

            {/* Bio / Mission Statement */}
            <motion.p
              variants={FADE_IN_UP}
              className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Apnéiste engagé depuis plus de 10 ans pour la préservation de la Méditerranée, je suis président de l'association éco-engagée <strong className="text-ocean-teal">Team Oxygen</strong> depuis cette année.
              Photographe de paysages basé à Marseille, je documente les calanques et le littoral méditerranéen, en surface comme sous l'eau, pour rendre visible l'impact des pollutions marines et témoigner de l'état réel des écosystèmes.
            </motion.p>

            {/* Signature */}
            <motion.div
              variants={FADE_IN_UP}
              className="flex justify-center"
            >
              <img
                src="/images/Karim-SAARI-white-low-res.webp"
                alt="Signature Karim Saari"
                className="h-36 md:h-48 lg:h-56 opacity-90"
                decoding="async"
              />
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* Section Phrases choc - Impact environnemental */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl border border-ocean-teal/20 p-8 md:p-12 shadow-lg shadow-ocean-teal/10 mb-16"
        >
          <div className="min-h-[100px] flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFactIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed"
              >
                {IMPACT_FACTS[currentFactIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Indicateurs de progression */}
          <div className="flex justify-center gap-2 mt-8">
            {IMPACT_FACTS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFactIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentFactIndex
                    ? 'w-8 bg-ocean-teal'
                    : 'w-1.5 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Afficher le fait ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
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
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp"
                alt="Team Oxygen - Projet Sentinelle Marseille"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '12% 25%' }}
                loading="lazy"
                decoding="async"
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
                src="/images/groupe%20des%20amoureux%20des%20calanques.webp"
                alt="Groupe Facebook Amoureux des Calanques de Marseille à Port-Cros"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '12% 25%' }}
                loading="lazy"
                decoding="async"
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
