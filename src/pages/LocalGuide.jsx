import { motion } from 'framer-motion';
import { ExternalLink, Star, MapPin, Camera, ThumbsUp } from 'lucide-react';
import SEO from '../components/SEO';

const STATS = [
  { label: 'Avis publiés', value: '150+', icon: Star },
  { label: 'Photos ajoutées', value: '500+', icon: Camera },
  { label: 'Lieux explorés', value: '80+', icon: MapPin },
  { label: 'Points obtenus', value: '5 000+', icon: ThumbsUp },
];

const PROFILE_URL = 'https://maps.app.goo.gl/add-google-local-guide-ooodH';

const FEATURED_PLACES = [
  {
    name: 'Calanque de Sormiou',
    description: 'L\'une des plus belles calanques de Marseille. Eau cristalline, faune préservée.',
    type: 'Calanque',
    color: '#21c47b',
  },
  {
    name: 'Calanque de Morgiou',
    description: 'Site exceptionnel avec fond marin riche. Présence de mérous et d\'octopodes.',
    type: 'Plongée',
    color: '#0091ff',
  },
  {
    name: 'Île Maïre',
    description: 'Réserve marine à l\'entrée des Calanques. Biodiversité remarquable.',
    type: 'Réserve',
    color: '#21c47b',
  },
  {
    name: 'Port de Callelongue',
    description: 'Point de départ des missions Projet Sentinelle. Spot de ramassage de déchets.',
    type: 'Mission',
    color: '#f59e0b',
  },
];

export default function LocalGuide() {
  return (
    <>
      <SEO
        title="Local Guides — Dark Massilia | Karim Saari"
        description="Profil Google Local Guides de Karim Saari — avis et photos des Calanques de Marseille, spots de plongée et lieux emblématiques de la Méditerranée."
        url="https://karimsaari.com/local-guide"
      />

      <div className="min-h-screen pt-20 pb-16">
        <div className="container-custom">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#4285F4]/20 border border-[#4285F4]/30 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#4285F4]" />
              </div>
              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    Google Local Guides
                  </h1>
                  <p className="text-text-secondary text-lg">
                    Karim Saari — Marseille & Calanques
                  </p>
                </div>
                {/* Badge Niveau 10 */}
                <img
                  src="/assets/points-badges_level_ten.png"
                  alt="Google Local Guides — Niveau 10"
                  className="w-20 h-20 md:w-24 md:h-24 object-contain"
                />
              </div>
            </div>
            <p className="text-text-secondary max-w-2xl mt-4">
              Contributeur actif sur Google Maps, je documente les spots naturels, les plages,
              les calanques et les lieux liés à la préservation marine autour de Marseille.
            </p>
          </motion.div>

          {/* CTA principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #4285F4, #34A853)',
                boxShadow: '0 4px 20px rgba(66,133,244,0.3)',
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Voir mon profil Local Guides
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass rounded-xl p-5 text-center border border-white/5 hover:border-ocean-teal/20 transition-all duration-300">
                <Icon className="w-6 h-6 text-ocean-teal mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{value}</div>
                <div className="text-xs text-text-muted">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Lieux mis en avant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">
              Lieux documentés
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURED_PLACES.map((place, i) => (
                <motion.div
                  key={place.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ background: place.color, boxShadow: `0 0 8px ${place.color}88` }}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white group-hover:text-ocean-teal transition-colors">
                          {place.name}
                        </h3>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: `${place.color}22`,
                            color: place.color,
                            border: `1px solid ${place.color}44`,
                          }}
                        >
                          {place.type}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {place.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Lien vers la carte */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-text-muted text-sm mb-4">
              Tous ces lieux sont visibles sur la carte interactive
            </p>
            <a
              href="/carte"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-ocean-teal/30 text-ocean-teal text-sm font-medium hover:bg-ocean-teal/10 transition-all duration-300"
            >
              <MapPin className="w-4 h-4" />
              Voir la Carte
            </a>
          </motion.div>

        </div>
      </div>
    </>
  );
}
