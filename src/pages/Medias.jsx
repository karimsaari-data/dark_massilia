import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import PartnersCarousel from '../components/PartnersCarousel';
import Breadcrumb from '../components/Breadcrumb';

const Medias = () => {
  // Données extraites de l'ancien site medias.html
  const pressLinks = [
    {
      title: "France Inter — Journal de 7h : les Calanques face au protoxyde d'azote",
      url: 'https://www.radiofrance.fr/franceinter/podcasts/le-journal-de-7h',
      featured: false,
      date: '29 avr. 2026',
      image: '/images/europe1.png',
      logo: '/images/Partenaires/svg/France_Inter_logo.svg',
    },
    {
      title: "Échappées Belles — Spéciale Verte : les Bouches-du-Rhône en action",
      url: '/echappees-belles-bouches-du-rhone',
      internal: true,
      featured: true,
      date: '2 mai 2026',
      image: '/images/échappée_verte_0.jpg',
      logo: null,
    },
    {
      title: "Europe 1 — Protoxyde d'azote : des bonbonnes qui polluent les Calanques de Marseille",
      url: 'https://www.europe1.fr/societe/protoxyde-dazote-des-bonbonnes-qui-polluent-nos-rues-mais-aussi-leau-des-calanques-de-marseille-930515',
      featured: false,
      date: '2 mai 2026',
      image: '/images/europe1.png',
      logo: '/images/Partenaires/svg/Europe1-logo.svg',
    },
    {
      title: 'Interview Presse — Tired Earth (EN/FR)',
      url: 'https://www.tiredearth.com/interviews/interview-de-karim-saari-apneiste-et-photographe-sous-marin#',
      featured: false,
      date: '11 nov. 2025',
      image: '/images/karim-saari-interview-presse-tiredearth-photographe-sous-marin.webp',
      logo: null,
    },
    {
      title: 'Marcelle Média — Dépolluer la mer, apnée après apnée',
      url: 'https://www.marcelle.media/depolluer-la-mer-apnee-apres-apnee/',
      featured: false,
      date: '20 oct. 2025',
      image: '/images/karim-saari-marseille-marcelle-media-depollution-mer-apnee.webp',
      logo: null,
    },
    {
      title: 'France Bleu — Un rorqual rarissime aperçu près des côtes à Marseille',
      url: 'https://www.francebleu.fr/provence-alpes-cote-d-azur/bouches-du-rhone-13/marseille/en-images-rarissime-un-rorqual-apercu-pres-des-cotes-a-marseille-2226210',
      featured: false,
      date: '10 août 2025',
      image: '/images/karim-saari-marseille-france-bleu-rorqual-cotes-marseille.webp',
      logo: '/images/Partenaires/svg/France_Bleu_2021.svg',
    },
    {
      title: 'Actu.fr — Dépollution des fonds marins à Marseille',
      url: 'https://actu.fr/provence-alpes-cote-d-azur/marseille_13055/marseille-ils-depolluent-les-fonds-marins-des-prises-surprenantes-on-a-deja-sorti-des-armes_62552562.html',
      featured: false,
      date: '25 avr. 2025',
      image: '/images/karim-saari-marseille-actu-depollution-fonds-marins.webp',
      logo: '/images/Partenaires/svg/Actu.fr_logo_2020.svg',
    },
    {
      title: 'Yann Arthus-Bertrand — « Les Français », Marseille 2024',
      url: '/les-francais-yann-arthus-bertrand',
      internal: true,
      featured: true,
      image: '/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp',
      credit: '© Yann Arthus-Bertrand',
      logo: null,
    },
    {
      title: 'Fondation de la Mer — Projet Sentinelle dans les Calanques',
      url: 'https://www.fondationdelamer.org/nos-actualites/projet-sentinelle/',
      featured: true,
      date: '21 nov. 2024',
      image: '/images/karim-saari-marseille-fondation-mer-projet-sentinelle-calanques.webp',
      logo: '/images/Partenaires/svg/logo fondation de la mer.svg',
    },
    {
      title: "La Provence — Au fond, tout n'est pas perdu pour le littoral marseillais",
      noLink: true,
      featured: true,
      date: 'Déc. 2024',
      image: '/images/La-provence-marseille-calanques-Au-fond-tout-n-est-pas-perdu-pour-le-littoral-marseillais-karimsaari.webp',
      logo: '/images/Partenaires/svg/La-provence-2023.svg',
    },
    {
      title: 'La Provence — Opération Sentinelle',
      url: 'https://www.laprovence.com/article/ecoplanete/1845794554454214/de-montredon-a-cassis-les-apneistes-lancent-leur-operation-sentinelle-des-samedi-et-jusquau-6-octobre',
      featured: true,
      date: '21 nov. 2024',
      image: '/images/karim-saari-marseille-la-provence-operation-sentinelle-apnee.webp',
      logo: '/images/Partenaires/svg/La-provence-2023.svg',
    },
    {
      title: 'France Bleu — 328 kg de déchets récoltés aux Goudes',
      url: 'https://www.francebleu.fr/infos/environnement/328-kilos-de-dechets-recoltes-aux-goudes-par-des-apneistes-marseillais-4335756',
      featured: false,
      date: '28 sept. 2024',
      image: '/images/karim-saari-marseille-france-bleu-goudes-dechets-apneistes.webp',
      logo: '/images/Partenaires/svg/France_Bleu_2021.svg',
    },
    {
      title: 'France 3 Régions — Invasion de vélelles sur le littoral marseillais',
      url: 'https://france3-regions.franceinfo.fr/provence-alpes-cote-d-azur/bouches-du-rhone/marseille/images-surprenantes-du-littoral-apres-une-invasion-de-velelles-cousines-des-meduses-2948873.html',
      featured: false,
      date: '2 avr. 2024',
      image: '/images/karim-saari-marseille-france3-velelles-invasion-littoral-mediterranee.webp',
      logo: '/images/Partenaires/svg/France.tv_-_logo_2022.svg',
    },
    {
      title: 'Midi Libre — Marseille : invasion de vélelles',
      url: 'https://www.midilibre.fr/2024/04/02/en-images-des-colonies-de-velelles-cousines-des-meduses-sechouent-sur-des-plages-au-large-de-la-mediterranee-11864980.php',
      featured: false,
      date: '2 avr. 2024',
      image: '/images/karim-saari-midi-libre-maree-bleue-marseille-biodiversité-vélelles-Méditerranée.webp',
      logo: '/images/Partenaires/svg/midi-libre-logo-vector.svg',
    },
    {
      title: 'Actu.fr — Invasion de méduses près de Marseille',
      url: 'https://actu.fr/provence-alpes-cote-d-azur/marseille_13055/images-pres-de-marseille-pourquoi-ce-tapis-de-meduses-mortes-sur-la-cote_60242724.html',
      featured: false,
      date: '23 oct. 2023',
      image: '/images/invasion-méduses-karimsaari-actumarseille-marseille-calanques.webp',
      logo: '/images/Partenaires/svg/Actu.fr_logo_2020.svg',
    },
    {
      title: 'Ville de Marseille — Reconnaissance Officielle',
      url: 'https://www.facebook.com/marseilleville/photos/a.220707724621813/3697054720320412/?_rdr',
      featured: true,
      date: '23 nov. 2019',
      image: '/images/karim-saari-marseille-ville-reconnaissance-officielle-dark-massilia.webp',
      logo: '/images/Partenaires/svg/Ville_de_Marseille_(logo).svg',
    },
    {
      title: 'Made in Marseille — Provence, top tourisme France',
      url: 'https://madeinmarseille.net/environnement/3753-region-provence-top-tourisme-france/',
      featured: false,
      date: '18 mai 2015',
      image: '/images/karim-saari-marseille-made-in-marseille-provence-tourisme.webp',
      logo: null,
    },
  ];

  return (
    <div className="min-h-screen py-32">
      <SEO {...SEO_PAGES['/presse']} />
      <div className="container-custom">
        <Breadcrumb label="Presse & Médias" />
        {/* H1 SEO — visible, keyword-rich */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl font-bold text-white text-center mb-8 leading-tight"
        >
          Documentaires et Reportages : Témoigner de l'urgence écologique en Méditerranée
        </motion.h1>

        {/* Barre de stats — crédibilité immédiate */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { value: '6',    label: 'passages TV',          icon: '📺' },
            { value: '15+',  label: 'articles de presse',   icon: '📰' },
            { value: '10 ans', label: 'd\'engagement terrain', icon: '🤿' },
            { value: '5,7T', label: 'de déchets documentés', icon: '♻️' },
          ].map(({ value, label, icon }) => (
            <div key={label} className="glass-strong rounded-2xl p-5 text-center border border-white/10">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-bold text-ocean-teal">{value}</div>
              <div className="text-xs text-text-muted mt-1 leading-tight">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Section: Passage TV — ARTE & Échappées Belles */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16"
        >
          <motion.div variants={FADE_IN_UP} className="relative flex items-center mb-10">
            <div className="flex-1 border-t border-white/15" />
            <span className="mx-4 px-5 py-2 rounded-full glass-strong border border-white/20 text-xs uppercase tracking-widest font-bold text-white whitespace-nowrap">
              📺 Passage TV
            </span>
            <div className="flex-1 border-t border-white/15" />
          </motion.div>

          <motion.div
            variants={STAGGER_CONTAINER}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
                    <div className="mb-3 bg-white/90 rounded px-2 py-1 inline-block">
                      <img src="/images/Partenaires/svg/Arte-Logo.svg" alt="ARTE" className="h-5 w-auto max-w-[72px]" loading="lazy" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">ARTE / YouTube</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      Documentaire ARTE — Marseille contre la pollution
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-snug">Plongée documentaire au cœur des Calanques pour filmer l'invisible : déchets, pollution et vie marine menacée.</p>
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
                    <div className="mb-3 bg-white/90 rounded px-2 py-1 inline-block">
                      <img src="/images/Partenaires/svg/Logo_ARTE.TV_2020.svg" alt="ARTE Évasion" className="h-5 w-auto max-w-[72px]" loading="lazy" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">ARTE Évasion</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      Méduses | Les souveraines des océans
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-snug">Les méduses, sentinelles fragiles de la santé des océans — témoignage filmé en Méditerranée.</p>
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
                    <div className="mb-3 bg-white/90 rounded px-2 py-1 inline-block">
                      <img src="/images/Partenaires/svg/France.tv_-_logo_2022.svg" alt="France Télévisions" className="h-5 w-auto max-w-[72px]" loading="lazy" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">France Télévisions</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      Échappées Belles — Karim Saari avec Ismaël Khelifa & Matthieu Witvoet
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-snug">Marseille vue d'en bas : Ismaël Khelifa découvre les fonds des Calanques avec Karim et l'équipe Team Oxygen.</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-ocean-teal group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 ml-4" />
                </div>
              </a>
            </motion.div>

            {/* TF1 — Scandale décharges */}
            <motion.div variants={FADE_IN_UP}>
              <a
                href="https://www.tf1info.fr/environnement-ecologie/video-dechets-ordures-marseille-le-scandale-des-decharges-sauvages-dans-les-calanques-marseillaises-2258467.html"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src="/images/JT_20H_TF1_video-dechets-ordures-marseille-le-scandale-des-decharges-sauvages-dans-les-calanques-marseillaises-journal_de_tf1_pollution_calanques_calanque_cortiou-karimsaari.webp"
                    alt="TF1 — Le scandale des décharges sauvages dans les calanques marseillaises"
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
                    <div className="mb-3 bg-white/90 rounded px-2 py-1 inline-block">
                      <img src="/images/Partenaires/svg/Logo_TF1_Info.svg" alt="TF1 Info" className="h-5 w-auto max-w-[72px]" loading="lazy" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">TF1 Info</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      Le scandale des décharges sauvages dans les calanques marseillaises
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-snug">Le JT de TF1 enquête sur les dépôts sauvages qui dévastent les Calanques — avec les images sous-marines de Karim Saari.</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-ocean-teal group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 ml-4" />
                </div>
              </a>
            </motion.div>

            {/* TF1 — Grève des éboueurs */}
            <motion.div variants={FADE_IN_UP}>
              <a
                href="https://www.tf1info.fr/environnement-ecologie/video-greve-des-eboueurs-a-marseille-des-craintes-pour-l-environnement-2208213.html"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src="/images/TF1_plongeur_karimsaari_video-greve-des-eboueurs-a-marseille-des-craintes-pour-l-environnement.webp"
                    alt="TF1 — Grève des éboueurs à Marseille : des craintes pour l'environnement"
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
                    <div className="mb-3 bg-white/90 rounded px-2 py-1 inline-block">
                      <img src="/images/Partenaires/svg/Logo_TF1_Info.svg" alt="TF1 Info" className="h-5 w-auto max-w-[72px]" loading="lazy" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">TF1 Info</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      Grève des éboueurs à Marseille : l'impact sous-marin
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-snug">Quand les ordures non collectées finissent sous la mer : Karim documente l'impact en direct pour TF1.</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-ocean-teal group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 ml-4" />
                </div>
              </a>
            </motion.div>

            {/* Novo19 — La Méditerranée, la mer la plus polluée du monde */}
            <motion.div variants={FADE_IN_UP}>
              <a
                href="https://www.ouest-france.fr/medias/novo19/video-la-mediterranee-la-mer-la-plus-polluee-du-monde-1b92d963-4a84-4bed-95ce-093b6595b564"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src="/images/op%C3%A9ration-catalan-depollution-marine-marseille-karimsaari-team-oxygen-novo19.webp"
                    alt="Novo19 — La Méditerranée, la mer la plus polluée du monde — opération de dépollution marine à Marseille avec Karim Saari et Team Oxygen"
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
                    <div className="mb-3 bg-white/90 rounded px-2 py-1 inline-block">
                      <img src="/images/Partenaires/svg/Logo_NOVO19_-_2025.svg" alt="Novo19" className="h-5 w-auto max-w-[72px]" loading="lazy" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">Novo19</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      VIDÉO. La Méditerranée, la mer la plus polluée du monde
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-snug">Reportage Novo19 : chiffres, images et témoignage de terrain sur l'état alarmant de la Méditerranée.</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-ocean-teal group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 ml-4" />
                </div>
              </a>
            </motion.div>

            {/* La Provence — Frioul vidéo */}
            <motion.div variants={FADE_IN_UP}>
              <a
                href="https://www.laprovence.com/videos/marseille-1-4-tonne-de-dchets-sortie-des-eaux-du-frioul-par-des-apnistes/10321076"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src="/images/laprovence_dépollution_calanques_frioul_marseille_karimsaari_projet_sentinelle.webp"
                    alt="La Provence — Marseille : 1,4 tonnes de déchets sorties des eaux du Frioul par des apnéistes"
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
                    <div className="mb-3 bg-white/90 rounded px-2 py-1 inline-block">
                      <img src="/images/Partenaires/svg/La-provence-2023.svg" alt="La Provence" className="h-5 w-auto max-w-[72px]" loading="lazy" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">La Provence</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-ocean-teal transition-colors">
                      Marseille : 1,4 tonnes de déchets sorties des eaux du Frioul par des apnéistes
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-snug">La Provence couvre la plus grande opération de dépollution de l'archipel du Frioul par Team Oxygen.</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-ocean-teal group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 ml-4" />
                </div>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Section: Revue de presse */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mt-20"
        >
          <motion.div variants={FADE_IN_UP} className="relative flex items-center mb-10">
            <div className="flex-1 border-t border-white/15" />
            <span className="mx-4 px-5 py-2 rounded-full glass-strong border border-ocean-teal/40 text-xs uppercase tracking-widest font-bold text-ocean-teal whitespace-nowrap">
              📰 Revue de presse
            </span>
            <div className="flex-1 border-t border-white/15" />
          </motion.div>

          <motion.div
            variants={STAGGER_CONTAINER}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {pressLinks.map((link, index) => (
              <motion.div key={index} variants={FADE_IN_UP}>
                {link.noLink ? (
                  <div className="glass-strong rounded-xl overflow-hidden border border-white/10 block h-full">
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-abyss overflow-hidden">
                      <img
                        src={link.image}
                        alt={link.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                    </div>
                    <div className="p-4">
                      {link.logo && (
                        <div className="mb-2 bg-white/90 rounded px-2 py-1 inline-block">
                          <img src={link.logo} alt={link.title?.split(/\s*[—–-]\s*/)[0]?.trim() ?? ''} className="h-4 w-auto max-w-[64px]" loading="lazy" />
                        </div>
                      )}
                      {link.date && (
                        <p className="text-xs text-text-muted mb-1">{link.date}</p>
                      )}
                      <h3 className="text-sm font-bold text-white mb-1 flex items-start justify-between gap-1">
                        <span>{link.title}</span>
                        <span className="text-xs text-text-muted flex-shrink-0 italic">papier</span>
                      </h3>
                    </div>
                  </div>
                ) : link.internal ? (
                  <Link
                    to={link.url}
                    className="glass-strong rounded-xl overflow-hidden border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group block h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-abyss overflow-hidden">
                      <img
                        src={link.image}
                        alt={link.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {link.logo && (
                        <div className="mb-2 bg-white/90 rounded px-2 py-1 inline-block">
                          <img src={link.logo} alt={link.title?.split(/\s*[—–-]\s*/)[0]?.trim() ?? ''} className="h-4 w-auto max-w-[64px]" loading="lazy" />
                        </div>
                      )}
                      {link.date && (
                        <p className="text-xs text-text-muted mb-1">{link.date}</p>
                      )}
                      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-ocean-teal transition-colors flex items-start justify-between gap-1">
                        <span>{link.title}</span>
                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-0.5" />
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
                    <div className="relative aspect-[4/3] bg-abyss overflow-hidden">
                      <img
                        src={link.image}
                        alt={link.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                      {link.credit && (
                        <p className="absolute bottom-2 right-3 text-white/40 text-xs font-medium">{link.credit}</p>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {link.logo && (
                        <div className="mb-2 bg-white/90 rounded px-2 py-1 inline-block">
                          <img src={link.logo} alt={link.title?.split(/\s*[—–-]\s*/)[0]?.trim() ?? ''} className="h-4 w-auto max-w-[64px]" loading="lazy" />
                        </div>
                      )}
                      {link.date && (
                        <p className="text-xs text-text-muted mb-1">{link.date}</p>
                      )}
                      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-ocean-teal transition-colors flex items-start justify-between gap-1">
                        <span>{link.title}</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0 mt-0.5" />
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
          className="mx-auto mt-16 mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Ce que chaque parution change
            </h2>
            <div className="space-y-5 text-text-secondary leading-relaxed">
              <p>
                Un reportage au <strong className="text-white">JT de 20h de TF1</strong>, une immersion dans{' '}
                <strong className="text-white">Échappées Belles</strong>, ou des enquêtes de terrain pour{' '}
                <strong className="text-white">La Provence</strong>... Chaque parution n'est pas une fin en soi.
                Elle ouvre des portes : de <strong className="text-ocean-teal">nouveaux bénévoles</strong>, des{' '}
                <strong className="text-ocean-teal">partenaires institutionnels</strong>, et un rappel constant
                que la <strong className="text-white">pollution des fonds marins méditerranéens</strong> n'est
                pas un problème abstrait.
              </p>
              <p className="font-semibold text-white">Trois piliers médiatiques portent aujourd'hui cet engagement :</p>
              <ul className="space-y-3 pl-1">
                <li className="flex gap-3">
                  <span className="text-ocean-teal mt-1 flex-shrink-0">▸</span>
                  <span>
                    <strong className="text-white">Échappées Belles (France 5) & ARTE</strong> — Le rayonnement
                    national et européen pour sensibiliser à <strong className="text-ocean-teal">l'urgence écologique</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-ocean-teal mt-1 flex-shrink-0">▸</span>
                  <span>
                    <strong className="text-white">La Provence</strong> — L'écho de nos actions locales,
                    documentant l'extraction de <strong className="text-white">tonnes de déchets au Vieux-Port et au Frioul</strong>,
                    confirmant Karim Saari comme une <strong className="text-ocean-teal">sentinelle incontournable du littoral marseillais</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-ocean-teal mt-1 flex-shrink-0">▸</span>
                  <span>
                    <strong className="text-white">TF1 Info</strong> — La reconnaissance de notre expertise
                    lors des <strong className="text-white">grands enjeux d'actualité environnementale</strong>.
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Section éditoriale SEO — déplacée en bas */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mt-12 mb-0"
        >
          <motion.div variants={FADE_IN_UP} className="glass rounded-3xl p-8 md:p-10">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">
              L'écho d'un engagement : Presse et Médias
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-sm mb-8">
              <p>
                Mon parcours d'<strong className="text-white">apnéiste et de photographe</strong> a trouvé
                un écho dans les médias nationaux et internationaux, validant une démarche qui lie{' '}
                <strong className="text-ocean-teal">l'art à l'alerte environnementale</strong>. Que ce soit
                pour mon expertise de terrain sur <strong className="text-white">TF1</strong> et{' '}
                <strong className="text-white">ARTE</strong>, mes expéditions dans{' '}
                <strong className="text-white">Échappées Belles (France 5)</strong>, ou mon regard
                artistique salué par <strong className="text-white">National Geographic</strong>, chaque
                parution est une tribune pour la{' '}
                <strong className="text-ocean-teal">préservation du littoral</strong>.
              </p>
              <p>
                Mon travail et mes actions, portés individuellement ou via la{' '}
                <strong className="text-white">Team Oxygen</strong>, bénéficient de la reconnaissance
                d'institutions majeures : le{' '}
                <strong className="text-white">Parc national des Calanques</strong>, la{' '}
                <strong className="text-white">Fondation de la Mer</strong> (programme{' '}
                <em>Un Geste pour la Mer</em>), <strong className="text-white">Citeo</strong> et la{' '}
                <strong className="text-white">Ville de Marseille</strong>. Chaque témoignage médiatique —
                de <strong className="text-white">La Provence</strong> au{' '}
                <strong className="text-white">Midi Libre</strong> — porte la voix des fonds marins
                au cœur du <strong className="text-ocean-teal">débat public</strong>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/8">
              <Link
                to="/#newsletter"
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>S'inscrire à la newsletter</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/blog"
                className="btn-secondary inline-flex items-center gap-2 group"
              >
                <span>Lire le blog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
              <Link
                to="/"
                className="btn-secondary inline-flex items-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                <span>Retour à l'Accueil</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Carrousel partenaires / médias */}
        <PartnersCarousel />
      </div>
    </div>
  );
};

export default Medias;
