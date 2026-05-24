import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mail, ArrowRight, Camera, ExternalLink,
  FileText, Anchor, Users, Tv, Image, MapPin, ChevronRight,
} from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER, SOCIAL_STATS_DEFAULTS } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';

/* ─── Données ──────────────────────────────────────────────────── */

const STATS = [
  { value: '5 724 kg', label: 'de déchets extraits', detail: '4 éditions · 2022–2025' },
  { value: '132 000', label: 'membres engagés', detail: 'Toutes plateformes' },
  { value: '3', label: 'chaînes nationales', detail: 'ARTE · TF1 · M6' },
  { value: '170+', label: 'photographies', detail: 'Sous-marine & paysages' },
  { value: '4', label: 'missions Sentinelle', detail: 'Calanques · Frioul · Rade' },
  { value: '10+', label: "années d'apnée", detail: 'Méditerranée' },
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
    desc: 'Une méthodologie unique : plonger sans bouteilles pour atteindre les anfractuosités inaccessibles, caractériser les déchets, les remonter et les peser. 4 opérations, 5 724 kg extraits des fonds méditerranéens.',
    icon: Anchor,
  },
  {
    num: '02',
    title: 'Mobilisation citoyenne digitale',
    desc: `${SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR')} personnes engagées autour de la protection des Calanques de Marseille. Un modèle de mobilisation hybride : communauté en ligne, action terrain, partenariats institutionnels.`,
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
    desc: 'Documentation photographique en apnée de la faune des Calanques — mérous, murènes, poulpes, gorgones — dans un contexte de réchauffement climatique et de pression touristique croissante.',
    icon: Image,
  },
];

const MEDIA_ITEMS = [
  {
    name: 'ARTE',
    svg: '/images/Partenaires/svg/Arte-Logo.svg',
    items: [
      { label: 'Sauver Marseille', url: 'https://karimsaari.com/sauver-marseille-documentaire-arte' },
      { label: 'Méduses, les souveraines des océans', url: 'https://karimsaari.com/meduses-souveraines-oceans-documentaire-arte' },
    ],
  },
  {
    name: 'TF1',
    svg: '/images/Partenaires/svg/TF1_logo_2006.svg',
    items: [
      { label: 'Reportage dépollution marine', url: 'https://www.tf1info.fr/environnement-ecologie/video-dechets-ordures-marseille-le-scandale-des-decharges-sauvages-dans-les-calanques-marseillaises-2258467.html' },
    ],
  },
  {
    name: 'M6',
    svg: '/images/Partenaires/svg/Logo_M6_(2020,_fond_clair).svg',
    items: [
      { label: 'Zone Interdite', url: null },
    ],
  },
  {
    name: 'France 5',
    svg: '/images/Partenaires/svg/France_5_-_logo_2018.svg',
    items: [
      { label: 'Échappées Belles — Bouches-du-Rhône', url: 'https://karimsaari.com/echappees-belles-bouches-du-rhone' },
    ],
  },
  {
    name: 'La Provence',
    svg: '/images/Partenaires/svg/La-provence-2023.svg',
    items: [
      { label: 'Opération Sentinelle', url: 'https://www.laprovence.com/article/ecoplanete/1845794554454214/de-montredon-a-cassis-les-apneistes-lancent-leur-operation-sentinelle-des-samedi-et-jusquau-6-octobre' },
    ],
  },
  {
    name: 'France Bleu',
    svg: '/images/Partenaires/svg/France_Bleu_2021.svg',
    items: [
      { label: 'Interviews radio', url: 'https://www.francebleu.fr/infos/environnement/328-kilos-de-dechets-recoltes-aux-goudes-par-des-apneistes-marseillais-4335756' },
    ],
  },
  {
    name: 'Midi Libre',
    svg: '/images/Partenaires/svg/midi-libre-logo-vector.svg',
    items: [
      { label: 'Vélelles en Méditerranée', url: 'https://www.midilibre.fr/2024/04/02/en-images-des-colonies-de-velelles-cousines-des-meduses-sechouent-sur-des-plages-au-large-de-la-mediterranee-11864980.php' },
    ],
  },
  {
    name: 'Actu Marseille',
    svg: '/images/Partenaires/svg/Actu.fr_logo_2020.svg',
    items: [
      { label: 'Dépollution fonds marins', url: 'https://actu.fr/provence-alpes-cote-d-azur/marseille_13055/marseille-ils-depolluent-les-fonds-marins-des-prises-surprenantes-on-a-deja-sorti-des-armes_62552562.html' },
    ],
  },
  {
    name: 'Ville de Marseille',
    svg: null,
    items: [
      { label: 'Reconnaissance officielle', url: 'https://www.facebook.com/marseilleville/photos/a.220707724621813/3697054720320412/' },
    ],
  },
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

    {/* ── Hero ──────────────────────────────────────────────────── */}
    <div className="border-b border-white/8">
      <div className="container-custom max-w-5xl py-16 md:py-24">
        <Breadcrumb label="Dossier Presse" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mt-8 grid md:grid-cols-[1fr_auto] gap-10 items-end"
        >
          <div>
            <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-[11px] font-bold uppercase tracking-[0.3em] mb-4">
              Ressources presse · Dark Massilia
            </motion.p>
            <motion.h1 variants={FADE_IN_UP} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              Dossier de<br />
              <span className="text-ocean-teal">Presse</span>
            </motion.h1>
            <motion.p variants={FADE_IN_UP} className="text-text-secondary text-lg leading-relaxed max-w-xl">
              Karim Saari · photographe environnemental et sous-marin · fondateur de Dark Massilia · président de Team Oxygen · Marseille
            </motion.p>
          </div>

          {/* Bloc identité */}
          <motion.div
            variants={FADE_IN_UP}
            className="hidden md:block glass rounded-2xl p-6 border border-white/8 min-w-[220px]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-4">Contact presse</p>
            <p className="text-white font-semibold text-sm mb-1">Karim Saari</p>
            <a
              href="mailto:email@karimsaari.com"
              className="text-ocean-teal text-sm hover:text-white transition-colors block mb-4"
            >
              email@karimsaari.com
            </a>
            <div className="h-px bg-white/8 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-2">Réponse sous</p>
            <p className="text-white font-bold text-2xl">48h</p>
          </motion.div>
        </motion.div>
      </div>
    </div>

    {/* ── Metrics strip ─────────────────────────────────────────── */}
    <div className="border-b border-white/8 bg-white/[0.02]">
      <div className="container-custom max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        >
          {STATS.map(({ value, label, detail }, i) => (
            <motion.div
              key={value}
              variants={FADE_IN_UP}
              className={`py-8 px-5 text-center ${i < STATS.length - 1 ? 'border-r border-white/8' : ''}`}
            >
              <p className="text-2xl md:text-3xl font-bold text-white tabular-nums leading-none mb-2">{value}</p>
              <p className="text-[11px] font-semibold text-ocean-teal uppercase tracking-wider leading-snug mb-1">{label}</p>
              <p className="text-[10px] text-white/30">{detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>

    {/* ── Corps ─────────────────────────────────────────────────── */}
    <div className="container-custom max-w-5xl py-16 md:py-20 space-y-20">

      {/* ── 01 · Biographie ──────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
      >
        <motion.div variants={FADE_IN_UP}>
          <SectionLabel num="01">Biographie</SectionLabel>
        </motion.div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
          {/* Bio longue */}
          <motion.div variants={FADE_IN_UP} className="space-y-4">
            {/* Portrait */}
            <div className="rounded-3xl overflow-hidden aspect-[4/3]">
              <img
                src="/images/karim-saari-marseille-dark-massilia-portrait-2024.jpg"
                alt="Karim Saari — Dark Massilia, photographe environnemental et sous-marin à Marseille"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="glass-strong rounded-3xl p-8 md:p-10 border border-white/8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ocean-teal mb-6">Version longue</p>
              <p className="text-text-secondary leading-relaxed mb-4">
                <strong className="text-white">Karim Saari</strong>, alias <strong className="text-white">Dark Massilia</strong>,
                est photographe environnemental et sous-marin basé à Marseille. Depuis 2018, il documente la beauté et la
                fragilité des Calanques en pratiquant l'apnée, et coordonne avec son association{' '}
                <strong className="text-white">Team Oxygen</strong> le{' '}
                <strong className="text-white">Projet Sentinelle</strong> — opération annuelle de dépollution sous-marine.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                Depuis 2022, quatre éditions ont permis de retirer{' '}
                <strong className="text-white">5 724 kg de déchets</strong> des fonds méditerranéens dans les Calanques,
                le Frioul, la Côte Bleue et la Rade de Marseille. La communauté Dark Massilia fédère aujourd'hui plus de{' '}
                <strong className="text-white">{SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR')} membres</strong>{' '}
                engagés pour la protection des Calanques.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                Ses images et ses missions ont été diffusées sur <strong className="text-white">ARTE</strong>{' '}
                (documentaires <em>Sauver Marseille</em> et <em>Méduses, les souveraines des océans</em>),{' '}
                <strong className="text-white">TF1</strong> et <strong className="text-white">M6 Zone Interdite</strong>.
                Certifié Google Street View Trusted et Google Local Guides Level&nbsp;10.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Son travail repose sur une dualité : la beauté documentée des fonds marins méditerranéens, et l'urgence
                écologique qui les menace. 170+ photographies accessibles en ligne, régulièrement mises à jour depuis
                les missions de terrain.
              </p>
            </div>
          </motion.div>

          {/* Bio courte + identité */}
          <div className="space-y-4">
            <motion.div variants={FADE_IN_UP} className="glass rounded-2xl p-6 border border-white/8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ocean-teal mb-4">Version courte</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Karim Saari (Dark Massilia) — photographe environnemental & sous-marin à Marseille. Fondateur du Projet
                Sentinelle, 5 724 kg de déchets marins extraits. ARTE, TF1, M6.
              </p>
            </motion.div>

            <motion.div variants={FADE_IN_UP} className="glass rounded-2xl p-6 border border-white/8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-4">Identité</p>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Nom', val: 'Karim Saari' },
                  { label: 'Alias', val: 'Dark Massilia' },
                  { label: 'Ville', val: 'Marseille, France' },
                  { label: 'Association', val: 'Team Oxygen (Pdt)' },
                  { label: 'Discipline', val: 'Apnée · Photographie' },
                ].map(({ label, val }) => (
                  <li key={label} className="flex justify-between gap-4">
                    <span className="text-white/30 shrink-0">{label}</span>
                    <span className="text-white font-medium text-right">{val}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={FADE_IN_UP} className="glass rounded-2xl p-6 border border-white/8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-4">Localisation</p>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-ocean-teal shrink-0" />
                <span>Calanques de Marseille · Méditerranée</span>
              </div>
            </motion.div>

            {/* Photo profil secondaire */}
            <motion.div variants={FADE_IN_UP} className="rounded-2xl overflow-hidden aspect-square">
              <img
                src="/images/karim-saari-photographe-sous-marin-marseille-dark-massilia.webp"
                alt="Karim Saari en apnée dans les Calanques de Marseille"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── 02 · Projet Sentinelle ───────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
      >
        <motion.div variants={FADE_IN_UP}>
          <SectionLabel num="02">Projet Sentinelle</SectionLabel>
        </motion.div>

        <motion.div variants={FADE_IN_UP} className="mb-6">
          <p className="text-text-secondary leading-relaxed max-w-2xl">
            Opération annuelle de dépollution sous-marine en apnée dans les eaux marseillaises.
            Une méthodologie unique pour atteindre les zones inaccessibles aux plongeurs bouteilles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MISSIONS.map(({ year, title, lieu, poids }, i) => (
            <motion.div
              key={year}
              variants={FADE_IN_UP}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-ocean-teal/30 transition-colors group relative overflow-hidden"
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
            { src: '/images/marseille-dark-massilia-port-goudes-depollution-apnee-projet-sentinelle.webp', alt: 'Dépollution en apnée — Port des Goudes' },
            { src: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp', alt: 'Team Oxygen — Opération Sentinelle' },
            { src: '/images/marseille-dark-massilia-depollution-maritime-calanques-projet-sentinelle.webp', alt: 'Dépollution maritime — Calanques de Marseille' },
          ].map(({ src, alt }) => (
            <div key={src} className="aspect-[4/3] overflow-hidden">
              <img src={src} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── 03 · Angles rédactionnels ────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
      >
        <motion.div variants={FADE_IN_UP}>
          <SectionLabel num="03">Angles rédactionnels</SectionLabel>
        </motion.div>
        <motion.p variants={FADE_IN_UP} className="text-text-secondary mb-8 max-w-2xl">
          Quatre axes narratifs disponibles pour structurer votre sujet — du grand reportage au portrait.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-4">
          {ANGLES.map(({ num, title, desc, icon: Icon }) => (
            <motion.div
              key={num}
              variants={FADE_IN_UP}
              className="glass rounded-2xl p-7 border border-white/8 hover:border-ocean-teal/20 transition-all group"
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
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
      >
        <motion.div variants={FADE_IN_UP}>
          <SectionLabel num="04">Couvertures médias</SectionLabel>
        </motion.div>
        <motion.p variants={FADE_IN_UP} className="text-text-secondary mb-10 max-w-2xl">
          Reportages, documentaires et articles depuis 2022 — presse nationale, régionale et audiovisuelle.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEDIA_ITEMS.map(({ name, svg, items }) => (
            <motion.div
              key={name}
              variants={FADE_IN_UP}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-white/16 transition-colors"
            >
              {/* Logo ou nom */}
              <div className="mb-5 h-8 flex items-center">
                {svg ? (
                  <img
                    src={svg}
                    alt={name}
                    className="h-6 w-auto object-contain object-left brightness-0 invert opacity-70"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-white/60 font-bold text-sm">{name}</span>
                )}
              </div>
              <div className="h-px bg-white/8 mb-4" />
              <ul className="space-y-2">
                {items.map(({ label, url }) => (
                  <li key={label}>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
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
          <Link
            to="/presse"
            className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
          >
            Voir la revue de presse complète
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.section>

      {/* ── 05 · Visuels disponibles ─────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
      >
        <motion.div variants={FADE_IN_UP}>
          <SectionLabel num="05">Visuels disponibles</SectionLabel>
        </motion.div>

        <div className="space-y-6">
          {/* Sous-marine */}
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl border border-white/8 overflow-hidden">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-0.5">
              {[
                { src: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poulpe.webp', alt: 'Poulpe — Calanques de Marseille' },
                { src: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-spirographe.webp', alt: 'Spirographes sous-marins' },
                { src: '/images/le-maitre-du-camouflage-rascasse-brune-sur-recif-corallien.webp', alt: 'Rascasse brune sur récif corallien' },
                { src: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte.webp', alt: 'Grotte sous-marine Calanques' },
                { src: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-paysage-sous-marin.webp', alt: 'Paysage sous-marin Méditerranée' },
                { src: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-octopus.webp', alt: 'Pieuvre — fonds marins Marseille' },
              ].map(({ src, alt }) => (
                <div key={src} className="aspect-square overflow-hidden">
                  <img src={src} alt={alt} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Camera className="w-5 h-5 text-ocean-teal" />
                    <h2 className="text-white font-semibold">Photographie sous-marine</h2>
                  </div>
                  <p className="text-text-secondary text-sm">101 photographies HR · mérous, murènes, poulpes, gorgones, pollution plastique</p>
                </div>
                <Link to="/photographie-sous-marine" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium group shrink-0">
                  Voir la galerie <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <p className="mt-3 text-[11px] text-white/30">Usage éditorial · Crédit obligatoire : <strong className="text-white/50">© Karim Saari</strong></p>
            </div>
          </motion.div>

          {/* Paysage */}
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl border border-white/8 overflow-hidden">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-0.5">
              {[
                { src: '/images/biodiversite-calanques-marseille-1.webp', alt: 'Biodiversité — Calanques de Marseille' },
                { src: '/images/biodiversite-calanques-marseille-2.webp', alt: 'Faune des Calanques' },
                { src: '/images/biodiversite-calanques-marseille-3.webp', alt: 'Calanques de Marseille' },
                { src: '/images/acces-massifs-calanques_1.webp', alt: 'Massifs des Calanques' },
                { src: '/images/posidonie-calanque-sormiou-marseille.webp', alt: 'Posidonie — Calanque de Sormiou' },
                { src: '/images/acces-massifs-calanques_2.webp', alt: 'Falaises des Calanques' },
              ].map(({ src, alt }) => (
                <div key={src} className="aspect-square overflow-hidden">
                  <img src={src} alt={alt} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Image className="w-5 h-5 text-ocean-teal" />
                    <h2 className="text-white font-semibold">Photographie de paysage</h2>
                  </div>
                  <p className="text-text-secondary text-sm">92 photographies HR · Calanques, Méditerranée, Provence — lumière naturelle</p>
                </div>
                <Link to="/photographie-paysage-mer" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium group shrink-0">
                  Voir la galerie <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <p className="mt-3 text-[11px] text-white/30">Usage éditorial · Crédit obligatoire : <strong className="text-white/50">© Karim Saari</strong></p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={FADE_IN_UP} className="mt-4 glass rounded-2xl p-5 border border-amber-500/10 bg-amber-500/[0.03] flex items-start gap-3">
          <span className="text-amber-400 text-lg shrink-0 mt-0.5">ℹ</span>
          <p className="text-sm text-white/50 leading-relaxed">
            Pour toute demande de fichiers en haute résolution ou de visuels spécifiques non disponibles en ligne, contactez directement{' '}
            <a href="mailto:email@karimsaari.com" className="text-ocean-teal hover:text-white transition-colors">email@karimsaari.com</a>.
          </p>
        </motion.div>
      </motion.section>

      {/* ── 06 · Contact presse ──────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
      >
        <motion.div variants={FADE_IN_UP}>
          <SectionLabel num="06">Contact presse</SectionLabel>
        </motion.div>

        <motion.div
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl p-10 md:p-14 border border-ocean-teal/15 relative overflow-hidden"
        >
          {/* Fond décoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-teal/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <p className="text-ocean-teal text-[11px] font-bold uppercase tracking-[0.3em] mb-3">Disponible pour</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                Reportages · Documentaires<br />Interviews · Expositions · Partenariats
              </h2>
              <p className="text-text-secondary leading-relaxed max-w-lg">
                Pour tout projet éditorial, institutionnel ou artistique — Karim Saari répond à chaque demande sous 48h.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                  Formulaire de contact
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:email@karimsaari.com"
                  className="btn inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  email@karimsaari.com
                </a>
              </div>
            </div>

            {/* Bloc délai */}
            <div className="hidden md:flex flex-col items-center gap-2 glass rounded-2xl px-8 py-6 border border-white/8 shrink-0">
              <p className="text-5xl font-black text-white">48h</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Délai de réponse</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

    </div>
  </div>
);

export default DossierPresse;
