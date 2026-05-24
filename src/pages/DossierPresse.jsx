import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mail, ArrowRight, Camera, ExternalLink,
  Anchor, Users, Image, MapPin, ChevronRight, MessageCircle,
} from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';

/* ─── Données ──────────────────────────────────────────────────── */

const STATS_MISSIONS = [
  { value: '5 724 kg', label: 'de déchets extraits', detail: '4 éditions · 2022–2025' },
  { value: '132 000', label: 'membres engagés', detail: 'Toutes plateformes' },
  { value: '3 chaînes', label: 'nationales', detail: 'ARTE · TF1 · M6' },
];

const STATS_AUDIENCE = [
  { value: '185 M', label: 'vues sur Google Maps', detail: 'Photos en ligne' },
  { value: '800 K+', label: 'vues sur 500px', detail: 'Portfolio photo' },
  { value: '23,8 K', label: 'abonnés Instagram', detail: '@karimsaari' },
  { value: '22,3 K', label: 'abonnés TikTok', detail: '@dark.massilia' },
];

const MISSIONS = [
  { year: '2022', title: 'Opération Sentinelle #1', lieu: 'Calanques de Marseille', poids: '1 200 kg' },
  { year: '2023', title: 'Opération Sentinelle #2', lieu: 'Frioul & Côte Bleue',   poids: '1 450 kg' },
  { year: '2024', title: 'Opération Sentinelle #3', lieu: 'Rade de Marseille',     poids: '1 680 kg' },
  { year: '2025', title: 'Opération Sentinelle #4', lieu: 'Calanques & Sormiou',   poids: '1 394 kg' },
];

const ANGLES = [
  {
    num: '01',
    title: 'Dépollution marine en apnée',
    desc: 'Une méthodologie unique : plonger sans bouteilles pour atteindre les anfractuosités, caractériser les déchets, les remonter et les peser. Quatre opérations menées dans les Calanques, le Frioul, la Côte Bleue et la Rade de Marseille.',
    icon: Anchor,
  },
  {
    num: '02',
    title: 'La communauté des Sentinelles',
    desc: '132 000 personnes engagées autour de la protection des Calanques. Karim Saari a créé le groupe Facebook « Amoureux des Calanques de Marseille à Port-Cros », qui rassemble près de 65 000 membres — un modèle de mobilisation citoyenne digitale au service de l\'action de terrain.',
    icon: Users,
  },
  {
    num: '03',
    title: 'Photographie environnementale & plaidoyer',
    desc: "Rendre visible la pollution plastique subaquatique par l'image. Une approche hybride : photographe d'art et lanceur d'alerte, diffusée sur ARTE, TF1 et M6.",
    icon: Camera,
  },
  {
    num: '04',
    title: 'Biodiversité méditerranéenne menacée',
    desc: 'Documentation photographique en apnée de la faune des Calanques (mérous, murènes, poulpes, gorgones) dans un contexte de réchauffement climatique et de pression touristique.',
    icon: Image,
  },
  {
    num: '05',
    title: 'Une dynamique collective inter-associative',
    desc: 'Karim Saari et Team Oxygen mènent leurs opérations en lien étroit avec un large réseau d\'associations — Boud\'mer, Mer Terre, Merveille, Un déchet par jour, Team AVA, Clean my Calanque, Wings of the Ocean, Sauvage, Recyclop et bien d\'autres. Une coopération de terrain qui démultiplie l\'impact de chaque action.',
    icon: Users,
  },
];

const MEDIA_ITEMS = [
  { name: 'ARTE',            svg: '/images/Partenaires/svg/Arte-Logo.svg',
    items: [
      { label: 'Sauver Marseille',                       url: 'https://karimsaari.com/sauver-marseille-documentaire-arte' },
      { label: 'Méduses, les souveraines des océans',    url: 'https://karimsaari.com/meduses-souveraines-oceans-documentaire-arte' },
    ]},
  { name: 'TF1',             svg: '/images/Partenaires/svg/TF1_logo_2006.svg',
    items: [{ label: 'Reportage dépollution marine', url: 'https://www.tf1info.fr/environnement-ecologie/video-dechets-ordures-marseille-le-scandale-des-decharges-sauvages-dans-les-calanques-marseillaises-2258467.html' }]},
  { name: 'M6',              svg: '/images/Partenaires/svg/Logo_M6_(2020,_fond_clair).svg',
    items: [{ label: 'Zone Interdite', url: null }]},
  { name: 'France 5',        svg: '/images/Partenaires/svg/France_5_-_logo_2018.svg',
    items: [{ label: 'Échappées Belles — Bouches-du-Rhône', url: 'https://karimsaari.com/echappees-belles-bouches-du-rhone' }]},
  { name: 'La Provence',     svg: '/images/Partenaires/svg/La-provence-2023.svg',
    items: [{ label: 'Opération Sentinelle', url: 'https://www.laprovence.com/article/ecoplanete/1845794554454214/de-montredon-a-cassis-les-apneistes-lancent-leur-operation-sentinelle-des-samedi-et-jusquau-6-octobre' }]},
  { name: 'France Bleu',     svg: '/images/Partenaires/svg/France_Bleu_2021.svg',
    items: [{ label: 'Interviews radio', url: 'https://www.francebleu.fr/infos/environnement/328-kilos-de-dechets-recoltes-aux-goudes-par-des-apneistes-marseillais-4335756' }]},
  { name: 'Midi Libre',      svg: '/images/Partenaires/svg/midi-libre-logo-vector.svg',
    items: [{ label: 'Vélelles en Méditerranée', url: 'https://www.midilibre.fr/2024/04/02/en-images-des-colonies-de-velelles-cousines-des-meduses-sechouent-sur-des-plages-au-large-de-la-mediterranee-11864980.php' }]},
  { name: 'Actu Marseille',  svg: '/images/Partenaires/svg/Actu.fr_logo_2020.svg',
    items: [{ label: 'Dépollution fonds marins', url: 'https://actu.fr/provence-alpes-cote-d-azur/marseille_13055/marseille-ils-depolluent-les-fonds-marins-des-prises-surprenantes-on-a-deja-sorti-des-armes_62552562.html' }]},
  { name: 'Ville de Marseille', svg: null,
    items: [{ label: 'Reconnaissance officielle', url: 'https://www.facebook.com/marseilleville/photos/a.220707724621813/3697054720320412/' }]},
];

const GALLERY = [
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/03/61-scaled.webp',                                                          alt: 'Canette Coca-Cola rouillée et étoile de mer sur les fonds marins — © Karim Saari' },
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/03/IMG_0723-scaled.jpg',                                                     alt: 'Deux apnéistes explorent une épave immergée — Calanques de Marseille — © Karim Saari' },
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/04/photographe-sous-marin-marseille-mission-depollution-projet-sentinelle.webp', alt: 'Poulpe dans une anfractuosité rocheuse — Calanques de Marseille — © Karim Saari' },
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/03/sormiou-depoll-4-scaled.jpg',                                             alt: 'Dépollution sous-marine à Sormiou — © Karim Saari' },
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/03/Calanques-propres-26_10-scaled.jpg',                                      alt: 'Bouteille plastique colonisée par les organismes marins — © Karim Saari' },
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/05/679404653_10242599585668429_677954145904663777_n.jpg',                    alt: 'Bénévoles Team Oxygen lors d\'une opération de nettoyage — © Karim Saari' },
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/05/fond-huveaunne-1-scaled.jpg',                                             alt: 'Canettes accumulées sur le fond marin — pollution Calanques — © Karim Saari' },
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/04/20250517_113448-scaled.jpg',                                              alt: 'Bonbonnes protoxyde d\'azote récupérées sur les fonds — © Karim Saari' },
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/04/668596762_10242412713596744_7275470257623305784_n.jpg',                   alt: 'Bénévoles et Plastic Odyssey — dépollution Vieux-Port de Marseille — © Karim Saari' },
  { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/04/biodiversite-calanques-marseille-2.webp',                                 alt: 'Poulpe gris dans une fissure rocheuse — Calanques de Marseille — © Karim Saari' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram',               href: 'https://www.instagram.com/karimsaari' },
  { label: 'TikTok',                  href: 'https://www.tiktok.com/@dark.massilia' },
  { label: 'YouTube',                 href: 'https://www.youtube.com/@dark.massilia' },
  { label: 'X / Twitter',            href: 'https://x.com/dark_massilia' },
  { label: 'Facebook',               href: 'https://www.facebook.com/Photographie.Marseille' },
  { label: 'LinkedIn',               href: 'https://www.linkedin.com/in/karimsaari/' },
  { label: '500px',                  href: 'https://500px.com/p/karimsaari' },
  { label: 'Groupe Amoureux des Calanques', href: 'https://www.facebook.com/groups/calanque' },
];

/* ─── Sous-composants ──────────────────────────────────────────── */

const SectionLabel = ({ num, children }) => (
  <div className="flex items-center gap-4 mb-8">
    <span className="text-[10px] font-bold tracking-[0.3em] text-ocean-teal uppercase tabular-nums">{num}</span>
    <div className="flex-1 h-px bg-white/10" />
    <span className="text-[10px] font-bold tracking-[0.25em] text-white/30 uppercase">{children}</span>
  </div>
);

/* ─── Composant principal ──────────────────────────────────────── */

const DossierPresse = () => (
  <div className="min-h-screen">
    <SEO {...SEO_PAGES['/dossier-presse']} />

    {/* ── Hero pleine largeur ───────────────────────────────────── */}
    <div className="relative min-h-[480px] md:min-h-[580px] flex items-end overflow-hidden">
      <img
        src="https://cms.karimsaari.com/wp-content/uploads/2026/05/fight-scaled.jpg"
        alt="Trois plongeurs de Team Oxygen en intervention sur les fonds marins — Calanques de Marseille"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="relative container-custom max-w-5xl py-12 md:py-16">
        <Breadcrumb label="Dossier Presse" />
        <motion.div
          initial="hidden" animate="visible" variants={STAGGER_CONTAINER}
          className="mt-6 grid md:grid-cols-[1fr_auto] gap-8 items-end"
        >
          <div>
            <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-[11px] font-bold uppercase tracking-[0.3em] mb-3">
              Dossier de presse
            </motion.p>
            <motion.h1 variants={FADE_IN_UP} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-4">
              Karim Saari<br />
              <span className="text-ocean-teal">Dark Massilia</span>
            </motion.h1>
            <motion.p variants={FADE_IN_UP} className="text-white/70 text-lg">
              Photographe environnemental &amp; sous-marin · Marseille
            </motion.p>
          </div>
          <motion.div variants={FADE_IN_UP} className="hidden md:block glass rounded-2xl p-6 border border-white/10 min-w-[220px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-3">Contact presse</p>
            <p className="text-white font-semibold text-sm mb-1">Karim Saari</p>
            <a href="mailto:contact@karimsaari.com" className="text-ocean-teal text-sm hover:text-white transition-colors block mb-4">
              contact@karimsaari.com
            </a>
            <div className="h-px bg-white/10 mb-3" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-1">Réponse sous</p>
            <p className="text-white font-bold text-2xl">48h</p>
          </motion.div>
        </motion.div>
      </div>
    </div>

    {/* ── Intro ─────────────────────────────────────────────────── */}
    <div className="border-b border-white/8 bg-white/[0.02]">
      <div className="container-custom max-w-5xl py-8">
        <p className="text-text-secondary leading-relaxed text-base max-w-3xl">
          Bienvenue dans l'espace presse de <strong className="text-white">Karim Saari — Dark Massilia</strong>, photographe
          environnemental et sous-marin à Marseille, président de Team Oxygen, engagé depuis plus de dix ans dans la
          dépollution marine. Vous trouverez ici toutes les ressources pour préparer votre reportage, documentaire,
          interview ou article. Pour toute demande de visuels haute définition, contactez-nous directement.
        </p>
      </div>
    </div>

    {/* ── Chiffres clés ─────────────────────────────────────────── */}
    <div className="border-b border-white/8" style={{ background: '#0c2230' }}>
      <div className="container-custom max-w-5xl py-12">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_IN_UP}
          className="text-white font-bold text-xl text-center mb-8"
        >
          Chiffres clés
        </motion.h2>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER_CONTAINER}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {STATS_MISSIONS.map(({ value, label, detail }) => (
            <motion.div key={value} variants={FADE_IN_UP}
              className="rounded-2xl p-6 text-center border border-white/8"
              style={{ background: '#173a4f' }}
            >
              <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#21c47b' }}>{value}</p>
              <p className="text-white/60 text-sm leading-snug">{label}</p>
              <p className="text-white/30 text-xs mt-1">{detail}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_IN_UP}
          className="text-white font-bold text-xl text-center mb-6"
        >
          Rayonnement &amp; audience
        </motion.h2>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER_CONTAINER}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS_AUDIENCE.map(({ value, label, detail }) => (
            <motion.div key={value} variants={FADE_IN_UP}
              className="rounded-2xl p-5 text-center border border-white/8"
              style={{ background: '#173a4f' }}
            >
              <p className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#21c47b' }}>{value}</p>
              <p className="text-white/60 text-xs leading-snug">{label}</p>
              <p className="text-white/30 text-[10px] mt-1">{detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>

    {/* ── Corps ─────────────────────────────────────────────────── */}
    <div className="container-custom max-w-5xl py-16 md:py-20 space-y-20">

      {/* ── 01 · Biographie ──────────────────────────────────────── */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER_CONTAINER}>
        <motion.div variants={FADE_IN_UP}><SectionLabel num="01">Biographie</SectionLabel></motion.div>

        <div className="grid md:grid-cols-[42%_1fr] gap-8 items-start">
          {/* Photo */}
          <motion.div variants={FADE_IN_UP} className="rounded-3xl overflow-hidden">
            <img
              src="https://cms.karimsaari.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-04-25-at-19.02.01-1.jpeg"
              alt="Bénévoles et plongeurs de Team Oxygen lors de l'opération Calanques Propres 2026 dans les Calanques de Marseille"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <p className="text-[10px] text-white/30 italic mt-2 px-1">Photo : opération Calanques Propres 2026 — © Karim Saari</p>
          </motion.div>

          {/* Texte */}
          <div className="space-y-4">
            <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 border border-white/8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ocean-teal mb-5">Biographie courte (version presse)</p>
              <p className="text-text-secondary leading-relaxed mb-4">
                <strong className="text-white">Karim Saari</strong>, alias <strong className="text-white">Dark Massilia</strong>,
                est photographe environnemental et sous-marin basé à Marseille. Engagé depuis plus de dix ans dans des actions
                de dépollution marine, il documente la beauté et la fragilité des Calanques en pratiquant l'apnée. Il a rejoint
                l'association <strong className="text-white">Team Oxygen</strong> dès la première édition du{' '}
                <strong className="text-white">Projet Sentinelle</strong> — opération annuelle de dépollution sous-marine qui a
                permis de retirer <strong className="text-white">5 724 kg de déchets</strong> des fonds méditerranéens en quatre
                éditions (2022–2025) — et en est aujourd'hui le président.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                Il anime la communauté Dark Massilia — plus de <strong className="text-white">132 000 membres</strong> engagés
                pour la protection des Calanques, dont le groupe Facebook « Amoureux des Calanques de Marseille à Port-Cros »
                qu'il a créé et qui rassemble près de <strong className="text-white">65 000 personnes</strong>. Ses images et
                ses missions ont été diffusées sur <strong className="text-white">ARTE</strong>,{' '}
                <strong className="text-white">TF1</strong> et <strong className="text-white">M6 Zone Interdite</strong>. Il est
                par ailleurs certifié Google Street View Trusted et Google Local Guides niveau 10.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Son travail repose sur une dualité : la beauté documentée des fonds marins méditerranéens, et l'urgence
                écologique qui les menace. Un rayonnement photographique considérable — ses images cumulent plus de{' '}
                <strong className="text-white">185 millions de vues</strong> sur Google Maps et dépassent les{' '}
                <strong className="text-white">800 000 vues</strong> sur 500px.
              </p>
            </motion.div>

            <motion.div variants={FADE_IN_UP} className="glass rounded-2xl p-6 border border-white/8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-4">Identité</p>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Nom',         val: 'Karim Saari' },
                  { label: 'Alias',       val: 'Dark Massilia' },
                  { label: 'Ville',       val: 'Marseille, France' },
                  { label: 'Association', val: 'Team Oxygen (Pdt)' },
                  { label: 'Discipline',  val: 'Apnée · Photographie' },
                ].map(({ label, val }) => (
                  <li key={label} className="flex justify-between gap-4">
                    <span className="text-white/30 shrink-0">{label}</span>
                    <span className="text-white font-medium text-right">{val}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={FADE_IN_UP} className="glass rounded-2xl p-5 border border-white/8">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-ocean-teal shrink-0" />
                <span>Calanques de Marseille · Méditerranée</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── 02 · Projet Sentinelle ───────────────────────────────── */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER_CONTAINER}>
        <motion.div variants={FADE_IN_UP}><SectionLabel num="02">Projet Sentinelle</SectionLabel></motion.div>
        <motion.p variants={FADE_IN_UP} className="text-text-secondary leading-relaxed max-w-2xl mb-8">
          Opération annuelle de dépollution sous-marine en apnée dans les eaux marseillaises.
          Une méthodologie unique pour atteindre les zones inaccessibles aux plongeurs bouteilles.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MISSIONS.map(({ year, title, lieu, poids }, i) => (
            <motion.div key={year} variants={FADE_IN_UP}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-ocean-teal/30 transition-colors relative overflow-hidden"
            >
              <span className="absolute right-4 top-3 text-6xl font-black text-white/[0.04] select-none leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-ocean-teal text-[10px] font-bold uppercase tracking-[0.3em] mb-3">{year}</p>
              <p className="text-white font-semibold text-sm mb-1 leading-snug">{title}</p>
              <p className="text-white/40 text-xs mb-4 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{lieu}
              </p>
              <div className="h-px bg-white/8 mb-4" />
              <p className="text-2xl font-bold text-white tabular-nums">{poids}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">de déchets extraits</p>
            </motion.div>
          ))}
        </div>

        {/* Photos de mission */}
        <motion.div variants={FADE_IN_UP} className="mt-6 grid grid-cols-3 gap-2 rounded-3xl overflow-hidden">
          {[
            { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/05/fight-scaled.jpg', alt: 'Team Oxygen en intervention sur les fonds marins — © Karim Saari' },
            { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/03/sormiou-depoll-4-scaled.jpg', alt: 'Dépollution sous-marine à Sormiou — © Karim Saari' },
            { src: 'https://cms.karimsaari.com/wp-content/uploads/2026/05/679404653_10242599585668429_677954145904663777_n.jpg', alt: 'Bénévoles lors d\'une opération de nettoyage — © Karim Saari' },
          ].map(({ src, alt }) => (
            <div key={src} className="aspect-[4/3] overflow-hidden">
              <img src={src} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── 03 · Angles rédactionnels ────────────────────────────── */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER_CONTAINER}>
        <motion.div variants={FADE_IN_UP}><SectionLabel num="03">Angles rédactionnels proposés</SectionLabel></motion.div>
        <motion.p variants={FADE_IN_UP} className="text-text-secondary mb-8 max-w-2xl">
          Cinq axes narratifs disponibles pour structurer votre sujet — du grand reportage au portrait.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-4">
          {ANGLES.map(({ num, title, desc, icon: Icon }) => (
            <motion.div key={num} variants={FADE_IN_UP}
              className="glass rounded-2xl p-7 border border-white/8 hover:border-ocean-teal/20 transition-all"
            >
              <div className="flex items-start gap-5">
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <span className="text-[10px] font-black tracking-[0.2em] text-ocean-teal">{num}</span>
                  <div className="w-px flex-1 bg-white/10 min-h-[60px]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-ocean-teal" aria-hidden="true" />
                    <p className="text-white font-semibold text-sm leading-snug">{title}</p>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── 04 · Couvertures médias ──────────────────────────────── */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER_CONTAINER}>
        <motion.div variants={FADE_IN_UP}><SectionLabel num="04">Couvertures médias</SectionLabel></motion.div>
        <motion.p variants={FADE_IN_UP} className="text-text-secondary mb-10 max-w-2xl">
          Reportages, documentaires et articles depuis 2022 — presse nationale, régionale et audiovisuelle.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEDIA_ITEMS.map(({ name, svg, items }) => (
            <motion.div key={name} variants={FADE_IN_UP}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-white/16 transition-colors"
            >
              <div className="mb-5 h-8 flex items-center">
                {svg
                  ? <img src={svg} alt={name} className="h-6 w-auto object-contain object-left brightness-0 invert opacity-70" loading="lazy" />
                  : <span className="text-white/60 font-bold text-sm">{name}</span>
                }
              </div>
              <div className="h-px bg-white/8 mb-4" />
              <ul className="space-y-2">
                {items.map(({ label, url }) => (
                  <li key={label}>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-text-secondary hover:text-ocean-teal transition-colors flex items-start gap-2 group"
                      >
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-ocean-teal/50 group-hover:text-ocean-teal transition-colors" />
                        <span>{label}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                      </a>
                    ) : (
                      <span className="text-sm text-white/25 flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/15" />
                        <span>{label}</span>
                        <span className="ml-auto text-[10px] font-medium text-white/20 bg-white/5 px-2 py-0.5 rounded-full shrink-0">bientôt</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div variants={FADE_IN_UP} className="mt-6 text-right">
          <Link to="/presse" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium">
            Voir la revue de presse complète
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.section>

      {/* ── 05 · Visuels disponibles ─────────────────────────────── */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER_CONTAINER}>
        <motion.div variants={FADE_IN_UP}><SectionLabel num="05">Visuels disponibles</SectionLabel></motion.div>
        <motion.p variants={FADE_IN_UP} className="text-text-secondary mb-8 max-w-2xl">
          Les photographies de Karim Saari sont disponibles en haute résolution pour un usage éditorial,
          sous réserve de la mention du crédit <strong className="text-white">© Karim Saari</strong>.
          Contactez-nous pour recevoir une sélection de fichiers HD adaptés à votre publication.
        </motion.p>

        {/* Grille galerie */}
        <motion.div variants={FADE_IN_UP}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 rounded-3xl overflow-hidden mb-6"
        >
          {GALLERY.map(({ src, alt }) => (
            <div key={src} className="aspect-square overflow-hidden">
              <img src={src} alt={alt} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
            </div>
          ))}
        </motion.div>

        <motion.div variants={FADE_IN_UP} className="glass rounded-2xl p-5 border border-amber-500/10 bg-amber-500/[0.03] flex items-start gap-3">
          <span className="text-amber-400 text-lg shrink-0 mt-0.5">ℹ</span>
          <p className="text-sm text-white/50 leading-relaxed">
            Pour toute demande de fichiers en haute résolution ou de visuels spécifiques, contactez directement{' '}
            <a href="mailto:contact@karimsaari.com" className="text-ocean-teal hover:text-white transition-colors">contact@karimsaari.com</a>.
          </p>
        </motion.div>

        <motion.div variants={FADE_IN_UP} className="mt-4 flex flex-wrap gap-3">
          <Link to="/photographie-sous-marine" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium group">
            <Camera className="w-4 h-4" /> Galerie sous-marine (101 photos)
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-white/20">·</span>
          <Link to="/photographie-paysage-mer" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium group">
            <Image className="w-4 h-4" /> Galerie paysage (92 photos)
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.section>

      {/* ── 06 · Réseaux sociaux ─────────────────────────────────── */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER_CONTAINER}>
        <motion.div variants={FADE_IN_UP}><SectionLabel num="06">Réseaux sociaux</SectionLabel></motion.div>
        <motion.div variants={FADE_IN_UP} className="flex flex-wrap gap-3">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="btn inline-flex items-center gap-2 text-sm"
            >
              {label}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          ))}
        </motion.div>
      </motion.section>

    </div>

    {/* ── Contact presse (fond vert) ────────────────────────────── */}
    <div style={{ background: '#21c47b' }} className="py-14 px-4">
      <div className="container-custom max-w-5xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#06231a' }}>Contact presse</h2>
        <p className="mb-8 text-base" style={{ color: '#06231a' }}>
          Pour tout reportage, documentaire, interview, exposition ou partenariat institutionnel — réponse sous 48 h.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="mailto:contact@karimsaari.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#06231a', color: '#fff' }}
          >
            <Mail className="w-4 h-4" />
            contact@karimsaari.com
          </a>
          <a href="https://wa.me/33695331301" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#06231a', color: '#fff' }}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp · +33 6 95 33 13 01
          </a>
        </div>
        <p className="mt-6 text-xs" style={{ color: '#06231a', opacity: 0.6 }}>
          168 Chemin Vicinal de Morgiou, 13009 Marseille · Organisation : Team Oxygen (président)
        </p>
      </div>
    </div>

    {/* ── Closing cover ─────────────────────────────────────────── */}
    <div className="relative min-h-[320px] md:min-h-[380px] flex items-center justify-center overflow-hidden">
      <img
        src="https://cms.karimsaari.com/wp-content/uploads/2026/03/12062022-IMG_9696-scaled.jpg"
        alt="Herbier de posidonie et banc de poissons argentés dans les eaux des Calanques de Marseille"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Une Mer · Une ville · Une mission</h2>
        <p className="text-white/60 text-sm">
          Les herbiers de posidonie des Calanques de Marseille — l'écosystème que ces missions s'attachent à préserver.
          © Karim Saari
        </p>
      </div>
    </div>

  </div>
);

export default DossierPresse;
