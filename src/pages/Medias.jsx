import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const Medias = () => {
  // Données extraites de l'ancien site medias.html
  const pressLinks = [
    {
      title: 'Yann Arthus-Bertrand — « Les Français », Marseille 2024',
      url: 'https://www.yabstudio.fr/portfolio/marseille-2024/',
      featured: true,
      image: '/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp',
      credit: '© Yann Arthus-Bertrand'
    },
    {
      title: 'Fondation de la Mer — Projet Sentinelle dans les Calanques',
      url: 'https://www.fondationdelamer.org/nos-actualites/projet-sentinelle/',
      featured: true,
      image: '/images/fondation%20de%20la%20mer.webp'
    },
    {
      title: 'La Provence — Opération Sentinelle',
      url: 'https://www.laprovence.com/article/ecoplanete/1845794554454214/de-montredon-a-cassis-les-apneistes-lancent-leur-operation-sentinelle-des-samedi-et-jusquau-6-octobre',
      featured: true,
      image: '/images/la provence.webp'
    },
    {
      title: 'Interview Presse — Tired Earth (EN/FR)',
      url: 'https://www.tiredearth.com/interviews/interview-de-karim-saari-apneiste-et-photographe-sous-marin#',
      featured: false,
      image: '/images/tiredearth.webp'
    },
    {
      title: 'Actu.fr — Dépollution des fonds marins à Marseille',
      url: 'https://actu.fr/provence-alpes-cote-d-azur/marseille_13055/marseille-ils-depolluent-les-fonds-marins-des-prises-surprenantes-on-a-deja-sorti-des-armes_62552562.html',
      featured: false,
      image: '/images/actu marseille.webp'
    },
    {
      title: 'France Bleu — Un rorqual rarissime aperçu près des côtes à Marseille',
      url: 'https://www.francebleu.fr/provence-alpes-cote-d-azur/bouches-du-rhone-13/marseille/en-images-rarissime-un-rorqual-apercu-pres-des-cotes-a-marseille-2226210',
      featured: false,
      image: '/images/france bleu rorqual.webp'
    },
    {
      title: 'Marcelle Média — Dépolluer la mer, apnée après apnée',
      url: 'https://www.marcelle.media/depolluer-la-mer-apnee-apres-apnee/',
      featured: false,
      image: '/images/marcelle media.webp'
    },
    {
      title: 'France Bleu — 328 kg de déchets récoltés aux Goudes',
      url: 'https://www.francebleu.fr/infos/environnement/328-kilos-de-dechets-recoltes-aux-goudes-par-des-apneistes-marseillais-4335756',
      featured: false,
      image: '/images/france bleu.webp'
    },
    {
      title: 'Ville de Marseille — Reconnaissance Officielle',
      url: 'https://www.facebook.com/marseilleville/photos/a.220707724621813/3697054720320412/?_rdr',
      featured: true,
      image: '/images/ville de marseille.webp'
    },
    {
      title: 'Made in Marseille — Provence, top tourisme France',
      url: 'https://madeinmarseille.net/environnement/3753-region-provence-top-tourisme-france/',
      featured: false,
      image: '/images/made in marseille provence.webp'
    },
  ];

  return (
    <div className="min-h-screen py-32">
      <SEO {...SEO_PAGES['/medias']} />
      <div className="container-custom">
        {/* H1 SEO — visible, keyword-rich */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-12 leading-tight"
        >
          Presse &amp; Médias
          <span className="block text-xl md:text-2xl font-medium text-ocean-teal mt-3">
            Couverture médiatique du Projet Sentinelle
          </span>
        </motion.h1>

        {/* Section éditoriale SEO — notoriété médiatique & E-E-A-T */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              L'écho de notre engagement : Presse et Médias
            </h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              La lutte contre la pollution plastique en Méditerranée nécessite une visibilité
              maximale pour éveiller les consciences à grande échelle. Au fil des expéditions en
              apnée et des actions de dépollution avec{' '}
              <strong className="text-ocean-teal">Team Oxygen</strong>, notre engagement a franchi
              les frontières des Calanques pour résonner dans l'espace public. Du documentaire
              diffusé à l'échelle européenne sur{' '}
              <strong className="text-white">ARTE</strong> aux reportages d'{' '}
              <strong className="text-white">Échappées Belles</strong> et de{' '}
              <strong className="text-white">Green Got</strong>, en passant par les articles de
              presse locale et nationale comme{' '}
              <strong className="text-white">La Provence</strong>,{' '}
              <strong className="text-white">France Bleu</strong>,{' '}
              <strong className="text-white">Actu.fr</strong> et{' '}
              <strong className="text-white">Marcelle Média</strong>, le travail de{' '}
              <strong className="text-ocean-teal">Dark Massilia</strong> bénéficie d'une
              couverture médiatique forte. Cette reconnaissance s'étend jusqu'aux sphères
              institutionnelles, avec le soutien de la{' '}
              <strong className="text-white">Fondation de la Mer</strong> dans le cadre de son
              Programme Un Geste Pour La Mer, le soutien officiel de la{' '}
              <strong className="text-white">Ville de Marseille</strong> et l'attention prestigieuse
              de <strong className="text-white">National Geographic</strong>. Chaque parution,
              chaque interview, est une opportunité de mettre la préservation de notre littoral au
              cœur du débat public.
            </p>
          </motion.div>
        </motion.div>

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
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* ARTE */}
            <motion.div variants={FADE_IN_UP}>
              <Link
                to="/arte"
                className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src="/images/photo profil Arte.webp"
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
                    src="/images/%C3%A9chapp%C3%A9es%20belles.webp"
                    alt="Échappées Belles — Karim Saari et Team Oxygen dans les Calanques de Marseille"
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
                      Échappées Belles — Karim Saari & Team Oxygen dans les Calanques
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
              Couverture Médiatique
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Du documentaire <strong className="text-ocean-teal">ARTE</strong> diffusé à l'échelle européenne aux articles de{' '}
                <strong className="text-white">La Provence</strong>,{' '}
                <strong className="text-white">France Bleu</strong>,{' '}
                <strong className="text-white">Actu.fr</strong> et{' '}
                <strong className="text-white">Marcelle Média</strong>, en passant par la reconnaissance institutionnelle de la{' '}
                <strong className="text-white">Fondation de la Mer</strong> et de la Ville de Marseille, le travail de Dark Massilia et du Projet Sentinelle est relayé par de nombreux médias régionaux et nationaux.
              </p>
              <p>
                Ces couvertures témoignent de l'impact concret de nos missions et contribuent à sensibiliser le grand public à la pollution des fonds marins méditerranéens.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            to="/"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'Accueil</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Medias;
