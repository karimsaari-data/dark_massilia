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

// Timeline parcours — données centralisées
const TIMELINE_ENTRIES = [
  {
    period: '1971–1997',
    label: 'Les premières images',
    title: 'La côte basque, l\'océan et l\'argentique',
    text: 'Né en 1971, j\'arrive sur la côte basque en 1977 — Bayonne, Biarritz, Capbreton, la dune du Pilat, cet Atlantique qui sculpte le paysage autant que les gens. C\'est ici que s\'installe le rapport à l\'eau, à la lumière rasante, à l\'horizon. Adolescent, les étés m\'emmènent dans les Alpes — et c\'est là que je découvre la photographie de paysage et acquiers mon premier reflex argentique.',
    img: '/images/portfolio/Horizons/biarritz-cote-basque-karimsaari-1.webp',
    alt: 'Côte basque — Biarritz, Karim Saari',
    side: 'left',
  },
  {
    period: '1997–2001',
    label: 'Toulouse',
    title: 'Entre Pyrénées et Atlantique',
    text: 'Quatre ans à Toulouse, à portée des Pyrénées d\'un côté, de la côte basque le week-end. Je continue de photographier les paysages que j\'ai toujours connus — l\'océan, les dunes, la lumière atlantique — avant que la Méditerranée ne change tout.',
    img: null,
    side: null,
  },
  {
    period: '2001–2017',
    label: 'Aix-en-Provence puis Marseille',
    title: 'La Provence, et les quartiers nord de Marseille',
    text: 'Juin 2001 : j\'arrive en Provence. D\'abord à Aix-en-Provence, puis à Marseille dès 2006. Je m\'installe dans les quartiers nord — à Sainte-Marthe, quartier historique de la famille Ricard, chargé d\'une mémoire populaire et industrielle. J\'y découvre une autre Marseille : les collines, les calanques vues de loin, la lumière blanche sur le calcaire.',
    img: '/images/portfolio/Mer/karim-saari-marseille-vieux-port-arche-cadenas-notre-dame.webp',
    alt: 'Marseille — Vieux-Port, arche et Notre-Dame-de-la-Garde',
    side: 'right',
  },
  {
    period: 'Juin 2015',
    label: 'La photographie de paysage',
    title: 'Valensole — National Geographic Hors-Série n°183 Provence',
    text: 'Un cliché des lavandes de Valensole sélectionné et publié dans le hors-série n°183 spécial Provence de National Geographic. Une reconnaissance par l\'une des références mondiales de la photographie de paysage — et un tournant dans la confiance portée à l\'image comme outil de narration.',
    img: '/images/portfolio/Mer/karim-saari-valensole-lavandes-national-geographic-provence.webp',
    imgSrcSet: '/images/portfolio/Mer/karim-saari-valensole-lavandes-national-geographic-provence_400w.webp 400w, /images/portfolio/Mer/karim-saari-valensole-lavandes-national-geographic-provence_800w.webp 800w, /images/portfolio/Mer/karim-saari-valensole-lavandes-national-geographic-provence_1200w.webp 1200w',
    alt: 'Champ de lavandes de Valensole, Provence — photographie de paysage Karim Saari publiée dans National Geographic hors-série Provence',
    side: 'left',
  },
  {
    period: '2017',
    label: 'Le basculement',
    title: 'Chemin de Morgiou, l\'apnée et les fonds',
    text: 'En 2017, je déménage chemin de Morgiou, dans les quartiers sud — au bord des Calanques. Je découvre l\'apnée. Je plonge dans les fonds pour la première fois — et je comprends que l\'urgence n\'est pas en surface. Pneus, cordages, filets fantômes : un silence que personne ne voit depuis la surface. La photographie devient un acte de témoignage. Je remonte les déchets d\'une main, l\'appareil de l\'autre.',
    img: '/images/portfolio/Mer/karim-saari-marseille-aerien-calanque-nageur-turquoise.webp',
    alt: 'Calanque de Marseille vue du ciel — nageur dans les eaux turquoise',
    imgScale: 'scale-[1.18]',
    side: 'left',
  },
  {
    period: '2019',
    label: 'Commande institutionnelle',
    title: 'Carrousel au Vieux-Port — Ville de Marseille',
    text: 'La Ville de Marseille me commande un cliché de la Canebière pour célébrer sa piétonisation. La photo est tirée en grand format sur bâche, place Saint-Louis, façade de l\'Espace Culture — une reconnaissance publique ancrée dans l\'identité marseillaise.',
    img: '/images/800w/karim-saari-marseille-ville-reconnaissance-officielle-dark-massilia.webp',
    alt: 'Karim Saari — bâche grand format Canebière, Ville de Marseille, Espace Culture place Saint-Louis',
    badge: '/images/Partenaires/svg/Armoiries_de_Marseille.svg',
    badgeAlt: 'Armoiries de la Ville de Marseille',
    side: 'right',
  },
  {
    period: '2022–2026',
    label: 'L\'action collective',
    title: 'Team Oxygen et le Projet Sentinelle',
    text: 'En 2022, je rejoins Team Oxygen comme simple apnéiste lors de la première édition du Projet Sentinelle. Je m\'investis progressivement, prends la vice-présidence, puis la présidence en janvier 2026. Quatre éditions, 5 724 kg de déchets remontés des fonds méditerranéens.',
    img: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp',
    alt: 'Team Oxygen — Projet Sentinelle, dépollution marine Marseille',
    quote: '« Photographier les Calanques, c\'est les défendre. »',
    imgScale: 'scale-[1.18]',
    side: 'left',
  },
  {
    period: '2026',
    label: 'Le film',
    title: 'Oxygène — documentaire 52 min',
    text: 'Produit par Transfuges et Zéké Film, réalisé par Roxane Perrot et Ugo Isoard, Oxygène raconte une semaine de tournage en apnée dans les Calanques — sans équipement lourd, juste en retenant notre souffle. Soutenu par Citeo. Présenté au FIFES Cannes, à Nausicaá et à Marseille.',
    img: 'https://cms.karimsaari.com/wp-content/uploads/2026/05/Screenshot-2026-05-19-123022_edited-3.webp',
    alt: 'Oxygène — documentaire dépollution Méditerranée, tournage en apnée dans les Calanques',
    imgFit: 'object-contain',
    link: '/blog/oxygene-le-documentaire-sur-la-depollution-de-la-mediterranee',
    linkLabel: 'Lire l\'article',
    side: 'right',
    future: true,
  },
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
  { name: 'TF1',                 label: 'Reportages TF1',                      svg: '/images/Partenaires/svg/TF1_logo_2006.svg',                    url: '/presse' },
  { name: 'ARTE',                label: 'Documentaires ARTE',                   svg: '/images/Partenaires/svg/Arte-Logo.svg',                        url: '/sauver-marseille-documentaire-arte' },
  { name: 'M6',                  label: 'Zone Interdite M6',                    svg: '/images/Partenaires/svg/Logo_M6_(2020,_fond_clair).svg',       url: '/presse' },
  { name: 'La Provence',         label: 'La Provence',                          svg: '/images/Partenaires/svg/La-provence-2023.svg',                 url: '/presse' },
  { name: 'France Bleu',         label: 'France Bleu',                          svg: '/images/Partenaires/svg/France_Bleu_2021.svg',                 url: '/presse', darkBg: true },
  { name: 'Actu.fr',             label: 'Actu Marseille',                       svg: '/images/Partenaires/svg/Actu.fr_logo_2020.svg',               url: '/presse' },
  { name: 'France 5',            label: 'France 5',                             svg: '/images/Partenaires/svg/France_5_-_logo_2018.svg',             url: '/presse' },
  { name: 'Midi Libre',          label: 'Midi Libre',                           svg: '/images/Partenaires/svg/midi-libre-logo-vector.svg',          url: '/presse', darkBg: true },
  { name: 'National Geographic', label: 'National Geographic — Hors-Série n°183 Provence', svg: '/images/Partenaires/svg/National-Geographic-Logo.svg', url: '/presse' },
  { name: 'Ville de Marseille',  label: 'Ville de Marseille — Commande officielle',        svg: '/images/Partenaires/svg/Armoiries_de_Marseille.svg',  url: '/presse' },
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

            {/* Lead */}
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-light mb-6">
              Je suis <strong className="text-ocean-teal font-semibold">Karim Saari</strong>, photographe environnemental basé à Marseille — <Link to="/photographie-paysage-mer" className="text-ocean-teal hover:underline">paysages</Link>, <Link to="/photographie-sous-marine" className="text-ocean-teal hover:underline">photographie sous-marine</Link> en apnée, et documentation des opérations de dépollution avec Team Oxygen depuis 2018.
            </p>

            {/* Chapitre 1 */}
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-2 pb-1">La démarche</p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              <span className="float-left text-[3.2rem] leading-[0.8] font-bold text-ocean-teal mr-2 mt-1 select-none">C</span>ette démarche repose sur une <strong className="text-ocean-teal font-semibold">dualité assumée</strong>. D'un côté, des images de beauté — biodiversité sous-marine, paysages des Calanques, Provence, Atlantique. De l'autre, sur ces mêmes sites : les opérations de dépollution, l'inventaire des déchets remontés, la réalité brute des fonds. Les deux faces d'un même territoire — et les deux raisons d'agir.
            </p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              Je photographie les fonds de la même manière que je les nettoie — en <strong className="text-ocean-teal font-semibold">immersion totale</strong>, au plus près des espèces et des déchets, en rétention de souffle entre 0 et 20 mètres.
            </p>

            {/* Chapitre 2 */}
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-3 pb-1">L'engagement</p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              Président de l'association <strong className="text-ocean-teal font-semibold">Team Oxygen</strong> depuis janvier 2026, je pilote le <strong className="text-ocean-teal font-semibold">Projet Sentinelle</strong>, opération annuelle de dépollution sous-marine en apnée. Quatre éditions (2022, 2023, 2024, 2025) ont mobilisé des dizaines de bénévoles dans les Calanques, l'Archipel du Frioul, la Côte Bleue et la Rade de Marseille, pour un bilan de <strong className="text-ocean-teal font-semibold">5 724 kg de déchets remontés des fonds</strong>.
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

            {/* Chapitre 3 */}
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-1 pb-1">La communauté</p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              <strong className="text-ocean-teal font-semibold">Dark Massilia</strong>, c'est aussi une présence en ligne. Sur Facebook, le groupe « Amoureux des Calanques de Marseille à Port-Cros » rassemble plus de <strong className="text-ocean-teal font-semibold">{SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR')} membres engagés</strong>, également actifs sur Instagram, TikTok et YouTube. Ils relayent les missions, signalent les dépôts sauvages et constituent un vivier de bénévoles pour chaque édition du Projet Sentinelle.
            </p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              Mon équipement : appareils photo en caissons étanches et GoPro, descendus en apnée jusqu'à 20 mètres. Mes sujets varient des <strong className="text-ocean-teal font-semibold">macro-déchets</strong> coincés dans les anfractuosités aux espèces méditerranéennes (mérous, murènes, poulpes, girelles), en passant par les paysages des Calanques depuis les hauteurs ou par drone. Mes photographies cumulent plus de <strong className="text-ocean-teal font-semibold">800 000 impressions</strong> sur 500px.
            </p>

            {/* Chapitre 4 */}
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-3 pb-1">La reconnaissance</p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              Mon travail est régulièrement couvert par les médias nationaux. En 2022, <strong className="text-ocean-teal font-semibold">ARTE</strong> me consacre un reportage dans <em>Pollution : Il faut sauver Marseille et ses Calanques</em>. <strong className="text-ocean-teal font-semibold">TF1</strong> suit les opérations à plusieurs reprises depuis 2022. <strong className="text-ocean-teal font-semibold">M6</strong> me reçoit dans <em>Zone Interdite</em>. France 5, France Bleu, La Provence, Midi Libre et Actu.fr relayent régulièrement les missions.
            </p>

            {/* Pull quote */}
            <blockquote className="my-6 py-4 px-5 bg-white/[0.04] border-l-2 border-ocean-teal rounded-r-lg">
              <p className="text-white/85 italic text-base leading-snug">« Une image qui émeut change plus de comportements qu'un chiffre statistique. Photographier les Calanques, c'est les défendre. »</p>
            </blockquote>

            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-8">
              Si vous êtes journaliste, réalisateur, institution ou marque engagée pour le littoral méditerranéen, je suis disponible pour collaborer — reportage, exposition, intervention terrain, mission documentaire.
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

        {/* Parcours — de la photographie de paysages à la photographie engagée */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              De la photographie de paysages à la photographie engagée
            </h2>
            <p className="text-text-secondary text-sm mb-8 italic">
              Un parcours en trois actes — la montagne, la mer, les fonds.
            </p>

            <div className="relative">
              {/* Barre verticale centrale — desktop uniquement */}
              <div
                className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, rgba(0,171,168,0.6), rgba(0,171,168,0.25), transparent)' }}
                aria-hidden="true"
              />

              <div className="space-y-16 md:space-y-24">
                {TIMELINE_ENTRIES.map((entry, i) => {
                  const dotClass = `rounded-full ring-4 z-10 ${entry.future ? 'bg-white/40 ring-white/10' : 'bg-ocean-teal ring-ocean-teal/20'}`;

                  if (!entry.img) {
                    return (
                      <div key={i} className="relative flex gap-4 md:block">
                        <div className="md:hidden flex-shrink-0 pt-1.5">
                          <div className={`w-2.5 h-2.5 ${dotClass}`} aria-hidden="true" />
                        </div>
                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 w-3.5 h-3.5 ${dotClass}" aria-hidden="true" />
                        <div className="md:max-w-sm md:mx-auto md:text-center">
                          <p className="text-ocean-teal text-xs font-semibold uppercase tracking-widest mb-1">{entry.label}</p>
                          <p className="text-white font-bold text-2xl mb-2">{entry.period}</p>
                          {entry.badge && (
                            <img src={entry.badge} alt={entry.badgeAlt} className="h-8 w-auto mb-2" loading="lazy" />
                          )}
                          <p className="text-white font-semibold text-sm mb-2">{entry.title}</p>
                          <p className="text-text-secondary text-sm leading-relaxed">{entry.text}</p>
                        </div>
                      </div>
                    );
                  }

                  const textLeft = entry.side === 'left';

                  const textBlock = (
                    <div className={textLeft ? 'md:pr-10 md:text-right' : 'md:pl-10'}>
                      <p className="text-ocean-teal text-xs font-semibold uppercase tracking-widest mb-1">{entry.label}</p>
                      <p className="text-white font-bold text-3xl md:text-4xl mb-3 leading-tight">{entry.period}</p>
                      {entry.badge && (
                        <img src={entry.badge} alt={entry.badgeAlt} className={`h-10 w-auto mb-2 ${textLeft ? 'ml-auto' : ''}`} loading="lazy" />
                      )}
                      <p className="text-white font-semibold text-sm mb-2">{entry.title}</p>
                      <p className="text-text-secondary text-sm leading-relaxed">{entry.text}</p>
                      {entry.quote && (
                        <p className={`mt-3 text-white/60 italic text-sm ${textLeft ? 'border-r-2 border-ocean-teal pr-4' : 'border-l-2 border-ocean-teal pl-4'}`}>
                          {entry.quote}
                        </p>
                      )}
                      {entry.link && (
                        <Link
                          to={entry.link}
                          className={`inline-flex items-center gap-1.5 mt-3 text-ocean-teal hover:text-white transition-colors text-xs font-medium ${textLeft ? 'justify-end' : ''}`}
                        >
                          {entry.linkLabel} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  );

                  const photoBlock = (
                    <div className="aspect-square overflow-hidden ring-1 ring-white/10 bg-black/40">
                      <img
                        src={entry.img}
                        srcSet={entry.imgSrcSet}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        alt={entry.alt}
                        className={`w-full h-full ${entry.imgFit || 'object-cover'}${entry.imgScale ? ` ${entry.imgScale}` : ''}`}
                        loading="lazy"
                      />
                    </div>
                  );

                  return (
                    <div key={i} className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Dot central — desktop */}
                      <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${dotClass}`} aria-hidden="true" />

                      {/* Mobile : texte puis photo */}
                      <div className="md:hidden col-span-1 flex gap-4">
                        <div className="flex-shrink-0 pt-1.5">
                          <div className={`w-2.5 h-2.5 ${dotClass}`} aria-hidden="true" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <p className="text-ocean-teal text-xs font-semibold uppercase tracking-widest mb-0.5">{entry.label}</p>
                            <p className="text-white font-bold text-2xl mb-1">{entry.period}</p>
                            <p className="text-white font-semibold text-sm mb-2">{entry.title}</p>
                            <p className="text-text-secondary text-sm leading-relaxed">{entry.text}</p>
                            {entry.quote && <p className="mt-2 text-white/60 italic text-sm border-l-2 border-ocean-teal pl-3">{entry.quote}</p>}
                            {entry.link && (
                              <Link to={entry.link} className="inline-flex items-center gap-1.5 mt-2 text-ocean-teal text-xs font-medium">
                                {entry.linkLabel} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                              </Link>
                            )}
                          </div>
                          <div className="aspect-square overflow-hidden ring-1 ring-white/10 bg-black/40">
                            <img src={entry.img} srcSet={entry.imgSrcSet} sizes="100vw" alt={entry.alt} className={`w-full h-full ${entry.imgFit || 'object-cover'}${entry.imgScale ? ` ${entry.imgScale}` : ''}`} loading="lazy" />
                          </div>
                        </div>
                      </div>

                      {/* Desktop colonne gauche */}
                      <div className="hidden md:block">
                        {textLeft ? textBlock : photoBlock}
                      </div>

                      {/* Desktop colonne droite */}
                      <div className="hidden md:block">
                        {textLeft ? photoBlock : textBlock}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/photographie-paysage-mer" className="btn inline-flex items-center gap-2">
                <Camera className="w-4 h-4" aria-hidden="true" />
                Photographie de paysages
              </Link>
              <Link to="/photographie-sous-marine" className="btn inline-flex items-center gap-2">
                <Camera className="w-4 h-4" aria-hidden="true" />
                Photographie sous-marine
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
              {MEDIA_LOGOS.map(({ name, label, svg, url, darkBg }) => (
                <Link
                  key={name}
                  to={url}
                  title={label}
                  className={`${darkBg ? 'bg-gray-800' : 'bg-white'} rounded-md px-3 py-2 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300`}
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
