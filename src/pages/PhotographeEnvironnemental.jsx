import { motion } from 'framer-motion';
import { useCardHover } from '../hooks/useCardHover';
import { ArrowRight, ExternalLink, Camera, Mail } from 'lucide-react';
import StatCounter from '../components/ui/StatCounter';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER, SOCIAL_STATS_DEFAULTS } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';

// Photo portrait — bloc intro
const PARTNER_PHOTO_INTRO = {
  src: '/images/Partenaires/partenaires-1dpj-10ans-notre-dame-marseille.webp',
  alt: 'Karim Saari aux 10 ans de 1 Déchet Par Jour — Notre-Dame-de-la-Garde, Marseille',
  caption: '10 ans de 1 Déchet Par Jour',
  credit: '© SEBANADO Photographies',
  creditUrl: 'https://www.sebanado.com/',
};

// Photos partenariats terrain — Mer Terre (2) + PNC (3)
const PARTNER_PHOTOS_MERTERR = [
  {
    src: '/images/Partenaires/partenaires-mer-terre-calanques-propres-2024.webp',
    alt: 'Karim Saari avec l\'équipe Mer Terre lors de l\'opération Calanques Propres 2024',
    caption: 'Calanques Propres 2024 — Mer Terre',
    credit: '© Fougue Photographie',
    creditUrl: 'https://www.fouguephotographie.fr/',
  },
  {
    src: '/images/Partenaires/partenaires-pnc-pirates-plastique-calanques-3.webp',
    alt: 'Barquette de dépollution — Campagne Pirates du Plastique dans les Calanques de Marseille',
    caption: 'Campagne Pirates du Plastique — PNC, Boud\'mer & Merveille',
    credit: '© Parc National des Calanques',
    creditUrl: 'https://calanques-parcnational.fr/fr',
  },
];

const PARTNER_PHOTOS_PNC = [
  {
    src: '/images/Partenaires/partenaires-pnc-pirates-plastique-calanques-1.webp',
    alt: 'Opération Pirates du Plastique — Parc National des Calanques, apnéistes en mission',
    caption: 'Campagne Pirates du Plastique — PNC, Boud\'mer & Merveille',
    credit: '© Parc National des Calanques',
    creditUrl: 'https://calanques-parcnational.fr/fr',
  },
  {
    src: '/images/Partenaires/partenaires-pnc-pirates-plastique-calanques-2.webp',
    alt: 'Dépollution marine opération Pirates du Plastique — Parc National des Calanques',
    caption: 'Campagne Pirates du Plastique — PNC, Boud\'mer & Merveille',
    credit: '© Parc National des Calanques',
    creditUrl: 'https://calanques-parcnational.fr/fr',
  },
  {
    src: '/images/Partenaires/partenaires-karim-saari-mer-terre-calanques-propres-2024.webp',
    alt: 'Karim Saari et membres de l\'association Mer Terre — opération Calanques Propres 2024',
    caption: 'Calanques Propres 2024 — Mer Terre',
    credit: '© Fougue Photographie',
    creditUrl: 'https://www.fouguephotographie.fr/',
  },
];

// Associations partenaires
const ASSOCIATIONS = [
  { name: 'Boud\'mer',            url: 'https://www.boudmer.org/',              desc: 'Support maritime lors des missions de dépollution dans les Calanques de Marseille' },
  { name: 'Clean My Calanques',   url: 'https://cleanmycalanques.fr/',          desc: 'Nettoyages mensuels des Calanques et sensibilisation scolaire à la pollution' },
  { name: 'Association Merveille',url: 'https://www.assomerveille.fr/',          desc: 'Dépollution des fonds marins marseillais, spécialiste de l\'extraction de pneus et macro-déchets' },
  { name: '1 Déchet Par Jour',    url: 'https://www.1dechetparjour.com/',        desc: 'Mouvement citoyen de ramassage collectif de déchets sauvages en nature' },
  { name: 'Team AVA',             url: 'https://www.instagram.com/team.a.v.a/', desc: 'Nettoyages littoraux réguliers centrés sur le Vallon des Auffes, Marseille' },
  { name: 'Sauvage Méditerranée', url: 'https://sauvage-med.fr/',               desc: 'Collecte de déchets de plage et transformation artisanale en produits éco-conçus' },
  { name: 'Mer Terre',            url: 'https://mer-terre.org/',                desc: 'Réduction des déchets terrestres atteignant la mer — programme national Zéro Déchet Sauvage' },
  { name: 'Recyclop',             url: 'https://recyclop.fr/',                  desc: 'Collecte et valorisation énergétique des mégots de cigarette pour lutter contre la pollution urbaine' },
  { name: 'Wings of the Ocean',   url: 'https://www.wingsoftheocean.com/',      desc: 'Ramassage de déchets sauvages et sensibilisation à la pollution plastique sur les littoraux atlantique et méditerranéen' },
];

// Institutions partenaires
const INSTITUTIONS = [
  { name: 'Parc National des Calanques', url: 'https://calanques-parcnational.fr/fr', desc: 'Parc national marin et terrestre, Marseille — La Ciotat', logo: '/images/Partenaires/svg/logo-pncal.jpg' },
  { name: 'Fondation de la Mer',         url: 'https://www.fondationdelamer.org/',    desc: 'Fondation nationale pour la protection des océans',        logo: '/images/Partenaires/svg/logo fondation de la mer.svg' },
  { name: 'Citeo',                       url: 'https://www.citeo.com/',              desc: 'Organisme agréé pour le recyclage des emballages et papiers', logo: '/images/Partenaires/svg/Logo_Citeo.png' },
  { name: 'Ville de Marseille',          url: 'https://www.marseille.fr/',           desc: 'Collectivité territoriale, soutien aux projets environnementaux', logo: '/images/Partenaires/svg/Ville_de_Marseille_(logo).svg' },
];

// Blocs galeries — 2 univers × 3 sous-sections
const UNIVERSES = [
  {
    id: 'sous-marin',
    title: 'Univers Sous-Marin',
    galleries: [
      {
        to: '/photographie-sous-marine#depollution',
        label: 'Dépollution',
        desc: 'Retirer les déchets plastiques des fonds en apnée et documenter l\'urgence écologique.',
        cta: 'Voir les photos',
        img: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-goudes-esprit-equipe-fight.webp',
        alt: 'Mission de dépollution sous-marine dans les Calanques de Marseille — Karim Saari',
      },
      {
        to: '/photographie-sous-marine#biodiversite',
        label: 'Biodiversité',
        desc: 'La vie marine des Calanques — faune, flore, et fragilité des écosystèmes méditerranéens.',
        cta: 'Voir les photos',
        img: '/images/biodiversite-calanques-marseille-1.webp',
        alt: 'Murène dans les fonds marins des Calanques de Marseille — Karim Saari photographe sous-marin',
      },
      {
        to: '/photographie-sous-marine#caracterisation',
        label: 'Caractérisation',
        desc: 'Identifier, mesurer et cartographier les déchets pour guider les actions de nettoyage.',
        cta: 'Voir les photos',
        img: '/images/marseille-dark-massilia-depollution-pneu-port-goudes-projet-sentinelle.webp',
        alt: 'Opération de dépollution en apnée au Port des Goudes — Team Oxygen, Projet Sentinelle Marseille',
      },
    ],
  },
  {
    id: 'paysages',
    title: 'Univers Paysages',
    galleries: [
      {
        to: '/photographie-paysage-mer#littoral',
        label: 'Littoral',
        desc: 'Calanques, falaises calcaires et eaux turquoise — le littoral marseillais vu du ciel et de l\'eau.',
        cta: 'Voir les photos',
        img: '/images/portfolio/Mer/karim-saari-marseille-en-vau-aerien-calanque-falaises.webp',
        srcset: '/images/portfolio/Mer/karim-saari-marseille-en-vau-aerien-calanque-falaises_400w.webp 400w, /images/portfolio/Mer/karim-saari-marseille-en-vau-aerien-calanque-falaises_800w.webp 800w, /images/portfolio/Mer/karim-saari-marseille-en-vau-aerien-calanque-falaises_1200w.webp 1200w',
        sizes: '(max-width: 640px) 100vw, 33vw',
        alt: 'Vue aérienne de la calanque d\'En-Vau, eaux turquoise et falaises calcaires — Karim Saari',
      },
      {
        to: '/photographie-paysage-mer#provence',
        label: 'Provence',
        desc: 'Lavande, lumière dorée et Méditerranée — la Provence photographiée depuis les airs et le sol.',
        cta: 'Voir les photos',
        img: '/images/portfolio/Terre/karim-saari-photographe-provence-lavande-coucher-soleil-ciel-orange-rouge.webp',
        alt: 'Champs de lavande de Valensole au coucher du soleil — Karim Saari photographe Provence',
      },
      {
        to: '/photographie-paysage-mer#horizons',
        label: 'Horizons',
        desc: 'Dunes, océan Atlantique et grands espaces — portraits de paysages hors des sentiers battus.',
        cta: 'Voir les photos',
        img: '/images/portfolio/Terre/karim-saari-photographe-femme-robe-rouge-rochers-volcaniques-cote-sauvage.webp',
        alt: 'Harmonie minérale en rouge — femme sur les rochers volcaniques de la Ponta de São Lourenço, Madère — Karim Saari',
      },
    ],
  },
];

// Chiffres clés
const HERO_STATS = [
  { end: 5724, suffix: ' kg', label: 'déchets remontés',   duration: 2500 },
  { end: 185,  suffix: ' M',  label: 'vues Google Maps',   duration: 2000 },
  { end: 132,  suffix: ' K',  label: 'communauté',         duration: 2000 },
  { end: 4,    suffix: '',    label: 'éditions Sentinelle', duration: 1000 },
];

// Médias
const MEDIA_LOGOS = [
  { name: 'TF1',         label: 'Reportages TF1',      svg: '/images/Partenaires/svg/TF1_logo_2006.svg',                    url: '/presse' },
  { name: 'ARTE',        label: 'Documentaires ARTE',   svg: '/images/Partenaires/svg/Arte-Logo.svg',                        url: '/sauver-marseille-documentaire-arte' },
  { name: 'M6',          label: 'Zone Interdite M6',    svg: '/images/Partenaires/svg/Logo_M6_(2020,_fond_clair).svg',       url: '/presse' },
  { name: 'La Provence', label: 'La Provence',          svg: '/images/Partenaires/svg/La-provence-2023.svg',                 url: '/presse' },
  { name: 'France Bleu', label: 'France Bleu',          svg: '/images/Partenaires/svg/France_Bleu_2021.svg',                 url: '/presse' },
  { name: 'Actu.fr',     label: 'Actu Marseille',       svg: '/images/Partenaires/svg/Actu.fr_logo_2020.svg',               url: '/presse' },
  { name: 'France 5',    label: 'France 5',             svg: '/images/Partenaires/svg/France_5_-_logo_2018.svg',             url: '/presse' },
  { name: 'Midi Libre',  label: 'Midi Libre',           svg: '/images/Partenaires/svg/midi-libre-logo-vector.svg',          url: '/presse' },
];

const PhotographeEnvironnemental = () => {
  const cardHover = useCardHover();
  return (
    <div className="min-h-screen pt-4 pb-16">
      <SEO {...SEO_PAGES['/photographe-environnemental-marseille']} />
      <div className="container-custom">
        <Breadcrumb label="Photographe Environnemental Marseille" />

        {/* H1 + tagline */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-6"
        >
          <motion.h1
            variants={FADE_IN_UP}
            className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2"
          >
            Photographe Environnemental à Marseille
          </motion.h1>
          <motion.p variants={FADE_IN_UP} className="text-base md:text-lg text-ocean-teal font-medium">
            Documenter l'urgence, célébrer la beauté
          </motion.p>
        </motion.div>

        {/* Cadre hublot — 6 blocs galeries */}
        <div
          className="p-6 md:p-8 mb-12"
          style={{
            overflow: 'hidden',
            borderRadius: '24px',
            border: '2px solid rgba(0,171,168,0.55)',
            boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
            background: 'rgba(5,15,30,0.75)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER_CONTAINER}
            className="space-y-5"
          >
            {UNIVERSES.map(({ id, title, galleries }) => (
              <motion.div key={id} variants={FADE_IN_UP}>
                <p className="text-xs font-semibold uppercase tracking-widest text-ocean-teal mb-3">{title}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {galleries.map(({ to, label, desc, cta, img, srcset, sizes, alt }) => (
                    <Link
                      key={to}
                      to={to}
                      className="group block relative rounded-sm overflow-hidden ring-1 ring-white/10 hover:ring-ocean-teal/40 transition-all duration-300"
                    >
                      <div className="aspect-[16/9] relative">
                        <img
                          src={img}
                          srcSet={srcset}
                          sizes={sizes}
                          alt={alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                          <h3 className="text-sm font-bold text-white mb-0.5">{label}</h3>
                          <p className="text-white/70 text-xs mb-2 leading-snug">{desc}</p>
                          <span className="inline-flex items-center gap-2 text-ocean-teal text-xs font-medium group-hover:gap-3 transition-all">
                            {cta} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bloc biographie — 600+ mots, E-E-A-T */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">

            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Photographe environnemental à Marseille — Qui suis-je ?
            </h2>

            {/* Stats pleine largeur sous le H2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              {HERO_STATS.map(({ end, suffix, label, duration }) => (
                <div key={label} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                  <p className="text-sm md:text-base font-bold text-ocean-teal leading-tight tabular-nums">
                    <StatCounter end={end} suffix={suffix} duration={duration} />
                  </p>
                  <p className="text-[10px] text-text-secondary mt-0.5 leading-snug">{label}</p>
                </div>
              ))}
            </div>

            {/* Portrait flottant — le texte enveloppe naturellement */}
            <div className="hidden md:block float-right ml-6 mb-4 w-44">
              <div
                className="relative rounded-sm overflow-hidden ring-1 ring-ocean-teal/40"
                style={{ aspectRatio: '3/4', boxShadow: '0 0 24px rgba(0,171,168,0.18)' }}
              >
                <img
                  src="/images/Partenaires/partenaires-karim-saari-mer-terre-calanques-propres-2024.webp"
                  alt="Karim Saari — Calanques Propres 2024, opération Mer Terre"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: '50% 15%' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-medium">Karim Saari</p>
                  <p className="text-white/50 text-[10px]">© Fougue Photographie</p>
                </div>
              </div>
            </div>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-5">
              Je suis <strong className="text-white">Karim Saari</strong>, photographe environnemental et sous-marin basé à Marseille. Depuis 2018, mon travail documente le littoral méditerranéen avec un double regard : la beauté brute des Calanques et l'urgence écologique qui les menace. Apnéiste, je photographie les fonds de la même manière que je les nettoie — en immersion totale, au plus près des espèces et des déchets.
            </p>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-5">
              Cette démarche repose sur une dualité assumée. D'un côté, des images de beauté — biodiversité sous-marine, paysages des Calanques, Provence, Atlantique. De l'autre, sur ces mêmes sites : les opérations de dépollution, l'inventaire des déchets remontés, la réalité brute des fonds que nous nettoyons. Les deux faces d'un même territoire — et les deux raisons d'agir.
            </p>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-5">
              Président de l'association <strong className="text-white">Team Oxygen</strong> depuis janvier 2026 — après en avoir été vice-président depuis ses débuts — je pilote le <strong className="text-white">Projet Sentinelle</strong>, opération annuelle de dépollution sous-marine en apnée. Quatre éditions (2022, 2023, 2024, 2025) ont mobilisé des dizaines de bénévoles dans les Calanques, l'Archipel du Frioul, la Côte Bleue et la Rade de Marseille, pour un bilan de <strong className="text-white">5 724 kg de déchets remontés des fonds</strong>.
            </p>

            <div className="clear-both" />

            {/* Stat callout */}
            <div className="flex items-center gap-5 bg-ocean-teal/8 border border-ocean-teal/20 rounded-xl p-4 mb-5">
              <div className="flex-shrink-0 text-center">
                <p className="text-2xl md:text-3xl font-bold text-ocean-teal">5 724 kg</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">en 4 éditions</p>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                pneus, cordages, filets fantômes, plastiques de toutes tailles — caractérisés, pesés et restitués aux autorités. La méthodologie de caractérisation sert aujourd'hui de référence nationale.
              </p>
            </div>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-5">
              <strong className="text-white">Dark Massilia</strong>, c'est aussi une présence en ligne. Sur Facebook, le groupe « Amoureux des Calanques de Marseille à Port-Cros » rassemble plus de <strong className="text-white">{SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR')} membres engagés</strong>, également actifs sur Instagram, TikTok et YouTube. Ils relayent les missions, signalent les dépôts sauvages et constituent un vivier de bénévoles pour chaque édition du Projet Sentinelle.
            </p>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-5">
              Mon équipement : appareils photo en caissons étanches et GoPro, descendus en apnée jusqu'à 20 mètres. Mes sujets varient des macro-déchets coincés dans les anfractuosités aux espèces méditerranéennes (mérous, murènes, poulpes, girelles), en passant par les paysages des Calanques depuis les hauteurs ou par drone. Mes photographies cumulent plus de 800 000 impressions sur 500px.
            </p>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-5">
              Mon travail est régulièrement couvert par les médias nationaux. En 2022, <strong className="text-white">ARTE</strong> me consacre un reportage dans <em>Pollution : Il faut sauver Marseille et ses Calanques</em> et m'associe à <em>Méduses, les souveraines des océans</em>. <strong className="text-white">TF1</strong> suit les opérations de dépollution à plusieurs reprises depuis 2022. <strong className="text-white">M6</strong> me reçoit dans <em>Zone Interdite</em>. France 5, France Bleu, La Provence, Midi Libre et Actu.fr relayent régulièrement les missions.
            </p>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
              La conviction reste la même : une image qui émeut change plus de comportements qu'un chiffre statistique. Photographier les Calanques, c'est les défendre. Si vous êtes journaliste, réalisateur, institution ou marque engagée pour le littoral méditerranéen, je suis disponible pour collaborer — reportage, exposition, intervention terrain, mission documentaire.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/photographie-sous-marine" className="btn inline-flex items-center gap-2">
                <Camera className="w-4 h-4" aria-hidden="true" />
                Photos sous-marines — Calanques
              </Link>
              <Link to="/photographie-paysage-mer" className="btn inline-flex items-center gap-2">
                <Camera className="w-4 h-4" aria-hidden="true" />
                Photos de paysages
              </Link>
              <Link to="/depollution-marine" className="btn inline-flex items-center gap-2">
                Projet Sentinelle
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* H2 — Médias & Reconnaissances */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-3">
              Reconnu par les médias et les institutions
            </h2>
            <p className="text-text-secondary text-center mb-8 max-w-xl mx-auto">
              Reportages, documentaires et couvertures presse depuis plus de 10 ans sur le terrain.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              {MEDIA_LOGOS.map(({ name, label, svg, url }) => (
                <Link
                  key={name}
                  to={url}
                  title={label}
                  className="bg-white rounded-md px-3 py-2 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300"
                >
                  <img src={svg} alt={label} className="h-6 md:h-8 w-auto object-contain" loading="lazy" />
                </Link>
              ))}
            </div>
            <div className="text-center mb-8">
              <Link
                to="/presse"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
              >
                Voir toutes les couvertures médias
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Contact presse */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-base font-semibold text-white mb-2">Contact presse</h3>
              <p className="text-text-secondary text-sm mb-4">
                Pour tout reportage, documentaire, exposition ou partenariat institutionnel :
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm text-ocean-teal hover:text-white transition-colors font-medium"
                >
                  Formulaire de contact
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* H2 — Associations partenaires */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
              Partenaires associatifs — agir ensemble sur le terrain
            </h2>
            <p className="text-text-secondary text-center mb-1 text-sm whitespace-nowrap">
              Des années de collaborations avec les acteurs de la protection du littoral méditerranéen.
            </p>
            <p className="text-ocean-teal text-sm italic text-center mb-8">
              « Seul on va plus vite, ensemble on va plus loin »
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ASSOCIATIONS.map(({ name, url, desc }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl p-4 border border-white/8 hover:border-ocean-teal/30 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <p className="text-white font-semibold text-sm group-hover:text-ocean-teal transition-colors">{name}</p>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-ocean-teal transition-colors flex-shrink-0 mt-0.5" aria-hidden="true" />
                  </div>
                  <p className="text-text-secondary text-xs leading-snug">{desc}</p>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Galerie photos partenariats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          {/* Ligne 1 : portrait 1dpj (span 2 lignes) + 2 × MerTerre */}
          <motion.div variants={FADE_IN_UP} className="grid grid-cols-2 gap-3 mb-3">
            {/* Portrait — s'étire sur la hauteur des 2 cartes de droite */}
            <div className="row-span-2 relative rounded-2xl overflow-hidden group ring-1 ring-white/8">
              <img
                src={PARTNER_PHOTO_INTRO.src}
                alt={PARTNER_PHOTO_INTRO.alt}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs font-medium leading-snug mb-0.5">{PARTNER_PHOTO_INTRO.caption}</p>
                <a
                  href={PARTNER_PHOTO_INTRO.creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white/80 text-xs block transition-colors"
                >
                  {PARTNER_PHOTO_INTRO.credit}
                </a>
              </div>
            </div>
            {/* 2 × MerTerre empilées */}
            {PARTNER_PHOTOS_MERTERR.map(({ src, alt, caption, credit, creditUrl }) => (
              <div key={src} className="relative rounded-2xl overflow-hidden group ring-1 ring-white/8">
                <div className="aspect-[4/3]">
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-medium leading-snug">{caption}</p>
                    <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 text-xs mt-0.5 block transition-colors">{credit}</a>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Ligne 2 : 3 × PNC */}
          <motion.div variants={FADE_IN_UP} className="grid grid-cols-3 gap-3">
            {PARTNER_PHOTOS_PNC.map(({ src, alt, caption, credit, creditUrl }) => (
              <div key={src} className="relative rounded-2xl overflow-hidden group ring-1 ring-white/8">
                <div className="aspect-[4/3]">
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-medium leading-snug">{caption}</p>
                    <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 text-xs mt-0.5 block transition-colors">{credit}</a>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* H2 — Institutions partenaires */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
              Soutiens institutionnels
            </h2>
            <p className="text-text-secondary text-center mb-8 max-w-xl mx-auto text-sm">
              Via Team Oxygen, des collaborations avec les organismes engagés pour la Méditerranée.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INSTITUTIONS.map(({ name, url, desc, logo }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl p-5 border border-white/8 hover:border-ocean-teal/30 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    {logo ? (
                      <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center" style={{ minWidth: '80px', maxWidth: '140px' }}>
                        <img
                          src={logo}
                          alt={name}
                          className="h-7 w-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <p className="text-white font-semibold group-hover:text-ocean-teal transition-colors">{name}</p>
                    )}
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-ocean-teal transition-colors flex-shrink-0 mt-0.5" aria-hidden="true" />
                  </div>
                  <p className="text-white/70 text-xs font-medium mb-1 group-hover:text-ocean-teal transition-colors">{name}</p>
                  <p className="text-text-secondary text-sm leading-snug">{desc}</p>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>


        {/* FAQ sémantique */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.h2 variants={FADE_IN_UP} className="text-xl md:text-2xl font-bold text-white text-center mb-8">
            Questions fréquentes
          </motion.h2>
          <motion.div variants={FADE_IN_UP} className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'Qu\'est-ce que la photographie environnementale marine et côtière ?',
                a: 'La photographie environnementale marine utilise l\'image pour documenter la beauté des écosystèmes sous-marins et des paysages côtiers, tout en illustrant l\'impact, souvent destructeur, de l\'activité humaine sur ces milieux. C\'est un art engagé qui vise à transformer la contemplation esthétique en une véritable prise de conscience et un appel à l\'action. Elle est particulièrement vitale pour révéler la fragilité d\'espaces sous pression comme la mer Méditerranée.',
              },
              {
                q: 'Quel est le rôle d\'un photographe engagé dans la préservation de la Méditerranée ?',
                a: 'Le photographe agit comme un témoin direct et un lanceur d\'alerte face à l\'urgence écologique. En documentant les paysages, les fonds marins et les opérations de dépollution, il rend tangibles les impacts parfois invisibles de l\'activité humaine sur la biosphère. Son objectif est de donner une voix aux écosystèmes fragiles, de dénoncer la pollution, et de mettre en lumière les initiatives porteuses d\'espoir pour créer une connexion émotionnelle puissante avec le public.',
              },
              {
                q: 'Pourquoi la mer Méditerranée est-elle un sujet photographique si crucial ?',
                a: 'La Méditerranée est une mer au destin unique : berceau de nombreuses civilisations, elle est aujourd\'hui soumise à une pression immense, bordée par 24 pays et 427 millions d\'habitants. Des photographes contemporains primés, comme Angel Fitor, dédient leur travail à la révélation des créatures et écosystèmes marins méditerranéens pour montrer les fils cachés et fragiles qui lient notre existence à celle de cette mer.',
              },
              {
                q: 'Comment la photographie permet-elle de lutter contre la pollution marine ?',
                a: 'L\'image a le pouvoir de traduire des statistiques abstraites sur la pollution en réalités visuelles mémorables. Le photographe Chris Jordan, par exemple, a illustré la tragédie de la pollution plastique des océans en photographiant des oiseaux l\'estomac rempli de déchets. En photographiant les actions de dépollution, on documente non seulement les conséquences de la surconsommation, mais on montre aussi la résilience de la nature et les solutions actives déployées sur le terrain.',
              },
              {
                q: 'La photographie peut-elle vraiment aider à la protection des espaces naturels et côtiers ?',
                a: 'Absolument. Historiquement, la photographie a prouvé la valeur des écosystèmes et a joué un rôle déterminant pour justifier la sanctuarisation de territoires et la création de parcs nationaux. Aujourd\'hui, des pionnières comme la biologiste Cristina Mittermeier utilisent l\'image spécifiquement pour la conservation des océans. Le suivi photographique à intervalles réguliers est également un outil précieux pour évaluer l\'évolution des littoraux et sensibiliser les élus à l\'aménagement du territoire.',
              },
              {
                q: 'Quelles sont les règles éthiques à respecter en photographie sous-marine et environnementale ?',
                a: 'L\'éthique est primordiale : le bien-être de la faune marine et la préservation de son habitat doivent toujours primer sur l\'obtention d\'une image. Le photographe éco-responsable doit garder une distance de sécurité pour ne pas stresser les animaux, ne jamais utiliser d\'appâts pour les attirer, et limiter les lumières artificielles perturbatrices. Il est essentiel de faire preuve d\'honnêteté en refusant toute manipulation numérique trompeuse afin de maintenir la crédibilité du message de conservation.',
              },
              {
                q: 'Comment contacter Karim Saari pour un reportage ou une collaboration ?',
                a: 'Karim Saari est disponible pour des collaborations documentaires, institutionnelles ou médiatiques.',
                link: true,
              },
            ].map(({ q, a, link }, i) => (
              <details key={i} className="glass rounded-2xl border border-white/8 group">
                <summary className="p-5 cursor-pointer text-white font-medium list-none flex items-center justify-between hover:text-ocean-teal transition-colors">
                  {q}
                  <ArrowRight className="w-4 h-4 flex-shrink-0 rotate-90 group-open:-rotate-90 transition-transform text-ocean-teal" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed">
                  {link ? (
                    <>
                      {a}{' '}
                      <Link to="/contact" className="text-ocean-teal hover:text-white transition-colors">
                        Accéder à la page contact.
                      </Link>
                    </>
                  ) : a}
                </div>
              </details>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default PhotographeEnvironnemental;
