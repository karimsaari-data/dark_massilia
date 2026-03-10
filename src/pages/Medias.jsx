import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const Medias = () => {
  // Données extraites de l'ancien site medias.html
  const pressLinks = [
    {
      title: 'Interview Presse — Tired Earth (EN/FR)',
      url: 'https://www.tiredearth.com/interviews/interview-de-karim-saari-apneiste-et-photographe-sous-marin#',
      featured: false,
      date: '11 nov. 2025',
      image: '/images/karim-saari-interview-presse-tiredearth-photographe-sous-marin.webp'
    },
    {
      title: 'Marcelle Média — Dépolluer la mer, apnée après apnée',
      url: 'https://www.marcelle.media/depolluer-la-mer-apnee-apres-apnee/',
      featured: false,
      date: '20 oct. 2025',
      image: '/images/karim-saari-marseille-marcelle-media-depollution-mer-apnee.webp'
    },
    {
      title: 'France Bleu — Un rorqual rarissime aperçu près des côtes à Marseille',
      url: 'https://www.francebleu.fr/provence-alpes-cote-d-azur/bouches-du-rhone-13/marseille/en-images-rarissime-un-rorqual-apercu-pres-des-cotes-a-marseille-2226210',
      featured: false,
      date: '10 août 2025',
      image: '/images/karim-saari-marseille-france-bleu-rorqual-cotes-marseille.webp'
    },
    {
      title: 'Actu.fr — Dépollution des fonds marins à Marseille',
      url: 'https://actu.fr/provence-alpes-cote-d-azur/marseille_13055/marseille-ils-depolluent-les-fonds-marins-des-prises-surprenantes-on-a-deja-sorti-des-armes_62552562.html',
      featured: false,
      date: '25 avr. 2025',
      image: '/images/karim-saari-marseille-actu-depollution-fonds-marins.webp'
    },
    {
      title: 'Yann Arthus-Bertrand — « Les Français », Marseille 2024',
      url: '/les-francais-yann-arthus-bertrand',
      internal: true,
      featured: true,
      image: '/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp',
      credit: '© Yann Arthus-Bertrand'
    },
    {
      title: 'Fondation de la Mer — Projet Sentinelle dans les Calanques',
      url: 'https://www.fondationdelamer.org/nos-actualites/projet-sentinelle/',
      featured: true,
      date: '21 nov. 2024',
      image: '/images/karim-saari-marseille-fondation-mer-projet-sentinelle-calanques.webp'
    },
    {
      title: 'La Provence — Opération Sentinelle',
      url: 'https://www.laprovence.com/article/ecoplanete/1845794554454214/de-montredon-a-cassis-les-apneistes-lancent-leur-operation-sentinelle-des-samedi-et-jusquau-6-octobre',
      featured: true,
      date: '21 nov. 2024',
      image: '/images/karim-saari-marseille-la-provence-operation-sentinelle-apnee.webp'
    },
    {
      title: 'France Bleu — 328 kg de déchets récoltés aux Goudes',
      url: 'https://www.francebleu.fr/infos/environnement/328-kilos-de-dechets-recoltes-aux-goudes-par-des-apneistes-marseillais-4335756',
      featured: false,
      date: '28 sept. 2024',
      image: '/images/karim-saari-marseille-france-bleu-goudes-dechets-apneistes.webp'
    },
    {
      title: 'Ville de Marseille — Reconnaissance Officielle',
      url: 'https://www.facebook.com/marseilleville/photos/a.220707724621813/3697054720320412/?_rdr',
      featured: true,
      date: '23 nov. 2019',
      image: '/images/karim-saari-marseille-ville-reconnaissance-officielle-dark-massilia.webp'
    },
    {
      title: 'Made in Marseille — Provence, top tourisme France',
      url: 'https://madeinmarseille.net/environnement/3753-region-provence-top-tourisme-france/',
      featured: false,
      date: '18 mai 2015',
      image: '/images/karim-saari-marseille-made-in-marseille-provence-tourisme.webp'
    },
  ];

  return (
    <div className="min-h-screen py-32">
      <SEO {...SEO_PAGES['/presse']} />
      <div className="container-custom">
        {/* H1 SEO — visible, keyword-rich */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl font-bold text-white text-center mb-8 leading-tight"
        >
          Documentaires et Reportages : Témoigner de l'urgence écologique en Méditerranée
        </motion.h1>

        {/* Section: Passage TV — ARTE & Échappées Belles */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-5xl mx-auto mb-12"
        >
          <motion.h2
            variants={FADE_IN_UP}
            className="text-sm uppercase tracking-widest text-text-muted mb-8 font-semibold text-center"
          >
            Passage TV
          </motion.h2>

          <motion.div
            variants={STAGGER_CONTAINER}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* ARTE — Marseille */}
            <motion.div variants={FADE_IN_UP}>
              <Link
                to="/sauver-marseille-documentaire-arte"
                className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src="/images/karim-saari-photo-profil-arte-regard-marseille.webp"
                    alt="Documentaire ARTE — Karim Saari et Team Oxygen dans les Calanques de Marseille"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-ocean-teal/40 group-hover:border-ocean-teal/50 transition-all duration-300">
                      <Play className="w-7 h-7 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">ARTE / YouTube</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      Documentaire ARTE — Marseille contre la pollution
                    </h3>
                  </div>
                  <ArrowLeft className="w-5 h-5 rotate-180 text-gray-400 group-hover:text-ocean-teal group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                </div>
              </Link>
            </motion.div>

            {/* ARTE Évasion — Méduses */}
            <motion.div variants={FADE_IN_UP}>
              <Link
                to="/meduses-souveraines-oceans-documentaire-arte"
                className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <picture>
                    <source srcSet="/images/arte-meduses-souveraines-oceans-documentaire-marseille-2.webp" type="image/webp" />
                    <img
                      src="/images/arte-meduses-souveraines-oceans-documentaire-marseille-2.jpg"
                      alt="Méduses en Méditerranée — Documentaire ARTE Évasion avec Karim Saari"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-ocean-teal/40 group-hover:border-ocean-teal/50 transition-all duration-300">
                      <Play className="w-7 h-7 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">ARTE Évasion</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      Méduses | Les souveraines des océans
                    </h3>
                  </div>
                  <ArrowLeft className="w-5 h-5 rotate-180 text-gray-400 group-hover:text-ocean-teal group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                </div>
              </Link>
            </motion.div>

            {/* Échappées Belles */}
            <motion.div variants={FADE_IN_UP}>
              <a
                href="https://www.dailymotion.com/video/x8wzsm2"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src="/images/karim-saari-marseille-echappees-belles-reportage-television.webp"
                    alt="Échappées Belles — Karim Saari avec Ismaël Khelifa et Matthieu Witvoet au Vallon des Auffes, Marseille"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-ocean-teal/40 group-hover:border-ocean-teal/50 transition-all duration-300">
                      <Play className="w-7 h-7 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">France Télévisions</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      Échappées Belles — Karim Saari avec Ismaël Khelifa & Matthieu Witvoet
                    </h3>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-ocean-teal group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 ml-4" />
                </div>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Section: À la une */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            variants={FADE_IN_UP}
            className="text-sm uppercase tracking-widest text-text-muted mb-8 font-semibold text-center"
          >
            À la une
          </motion.h2>

          <motion.div
            variants={STAGGER_CONTAINER}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {pressLinks.map((link, index) => (
              <motion.div key={index} variants={FADE_IN_UP}>
                {link.internal ? (
                  <Link
                    to={link.url}
                    className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      <img
                        src={link.image}
                        alt={link.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {link.date && (
                        <p className="text-xs text-text-muted mb-2">{link.date}</p>
                      )}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-ocean-teal transition-colors flex items-center justify-between">
                        <span>{link.title}</span>
                        <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                      </h3>
                    </div>
                  </Link>
                ) : (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      <img
                        src={link.image}
                        alt={link.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {link.credit && (
                        <p className="absolute bottom-2 right-3 text-white/40 text-xs font-medium">{link.credit}</p>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {link.date && (
                        <p className="text-xs text-text-muted mb-2">{link.date}</p>
                      )}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-ocean-teal transition-colors flex items-center justify-between">
                        <span>{link.title}</span>
                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0 ml-2" />
                      </h3>
                    </div>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Description — bas de page */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mt-16 mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Ce que chaque parution change
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Un article dans <strong className="text-white">La Provence</strong>, une diffusion
                sur <strong className="text-ocean-teal">ARTE</strong>, un passage sur{' '}
                <strong className="text-white">France Bleu</strong>... Chaque parution n'est pas
                une fin en soi. Elle ouvre des portes : de nouveaux bénévoles pour les missions,
                des partenaires institutionnels, et un rappel constant que la pollution des fonds
                marins méditerranéens n'est pas un problème abstrait.
              </p>
              <p>
                Le reportage qui a eu le plus d'impact reste le{' '}
                <Link to="/sauver-marseille-documentaire-arte" className="text-ocean-teal hover:text-white transition-colors font-medium">
                  documentaire ARTE « Pollution : il faut sauver Marseille ! »
                </Link>{' '}
                — diffusé à l'échelle européenne en 2024, il a donné une visibilité inattendue aux
                Calanques et aux équipes qui s'y engagent au quotidien.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Section éditoriale SEO — déplacée en bas */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mt-12 mb-0"
        >
          <motion.div variants={FADE_IN_UP} className="glass rounded-3xl p-8 md:p-10">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">
              L'écho de notre engagement : Presse et Médias
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-text-secondary leading-relaxed text-sm">
              <p>
                Au fil des expéditions en apnée avec{' '}
                <strong className="text-ocean-teal">Team Oxygen</strong>, notre engagement a franchi
                les frontières des Calanques pour résonner dans l'espace public — sur{' '}
                <strong className="text-white">ARTE</strong>,{' '}
                <strong className="text-white">Échappées Belles</strong>,{' '}
                <strong className="text-white">La Provence</strong>,{' '}
                <strong className="text-white">France Bleu</strong> et{' '}
                <strong className="text-white">National Geographic</strong>.
              </p>
              <p>
                Soutenu par la{' '}
                <strong className="text-white">Fondation de la Mer</strong> et la{' '}
                <strong className="text-white">Ville de Marseille</strong>, chaque parution est une
                opportunité de mettre la préservation du littoral méditerranéen au cœur du débat public.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTAs finaux */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 mb-8"
        >
          <Link
            to="/#newsletter"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>S'inscrire à la newsletter</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            to="/"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span>Retour à l'Accueil</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Medias;
