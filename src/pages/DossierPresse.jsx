import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Download, Camera, ExternalLink, FileText } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER, SOCIAL_STATS_DEFAULTS } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';

const STATS = [
  { value: '5 724 kg', label: 'de déchets extraits des fonds', sub: '4 éditions · 2022–2025' },
  { value: SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR'), label: 'membres dans la communauté', sub: 'Toutes plateformes confondues' },
  { value: '3 chaînes', label: 'de diffusion nationale', sub: 'ARTE · TF1 · M6' },
  { value: '170+', label: 'photographies en ligne', sub: 'Galeries sous-marine & paysages' },
];

const ANGLES = [
  {
    title: 'Dépollution marine en apnée',
    desc: 'Une méthodologie unique : plonger sans bouteilles pour atteindre les anfractuosités, caractériser les déchets, les remonter et les peser. 4 opérations dans les Calanques, le Frioul, la Côte Bleue et la Rade de Marseille.',
  },
  {
    title: 'La communauté des Sentinelles',
    desc: `${SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR')} personnes engagées autour de la protection des Calanques de Marseille. Un modèle de mobilisation citoyenne digitale au service de l'action terrain.`,
  },
  {
    title: 'Photographie environnementale & plaidoyer',
    desc: 'Rendre visible la pollution plastique subaquatique par l\'image. Une approche hybride : photographe d\'art et lanceur d\'alerte, diffusée sur ARTE, TF1 et M6.',
  },
  {
    title: 'Biodiversité méditerranéenne menacée',
    desc: 'Documentation photographique en apnée de la faune des Calanques (mérous, murènes, poulpes, gorgones) dans un contexte de réchauffement climatique et de pression touristique.',
  },
];

const MEDIA_LOGOS = [
  { name: 'TF1',         label: 'Reportages TF1',      svg: '/images/Partenaires/svg/TF1_logo_2006.svg',                  url: '/presse' },
  { name: 'ARTE',        label: 'Documentaires ARTE',   svg: '/images/Partenaires/svg/Arte-Logo.svg',                      url: '/sauver-marseille-documentaire-arte' },
  { name: 'M6',          label: 'Zone Interdite M6',    svg: '/images/Partenaires/svg/Logo_M6_(2020,_fond_clair).svg',     url: '/presse' },
  { name: 'La Provence', label: 'La Provence',          svg: '/images/Partenaires/svg/La-provence-2023.svg',               url: '/presse' },
  { name: 'France Bleu', label: 'France Bleu',          svg: '/images/Partenaires/svg/France_Bleu_2021.svg',               url: '/presse' },
  { name: 'France 5',    label: 'France 5',             svg: '/images/Partenaires/svg/France_5_-_logo_2018.svg',           url: '/presse' },
  { name: 'Midi Libre',  label: 'Midi Libre',           svg: '/images/Partenaires/svg/midi-libre-logo-vector.svg',         url: '/presse' },
  { name: 'Actu.fr',     label: 'Actu Marseille',       svg: '/images/Partenaires/svg/Actu.fr_logo_2020.svg',             url: '/presse' },
];

const DossierPresse = () => (
  <div className="min-h-screen py-20">
    <SEO {...SEO_PAGES['/dossier-presse']} />
    <div className="container-custom max-w-4xl">
      <Breadcrumb label="Dossier Presse" />

      {/* H1 */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={STAGGER_CONTAINER}
        className="mb-12"
      >
        <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-3">
          Ressources presse
        </motion.p>
        <motion.h1 variants={FADE_IN_UP} className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          Dossier Presse — Karim Saari · Dark Massilia
        </motion.h1>
        <motion.p variants={FADE_IN_UP} className="text-text-secondary text-lg leading-relaxed">
          Photographe environnemental et sous-marin à Marseille, fondateur de Dark Massilia et président de Team Oxygen. Toutes les ressources pour préparer votre reportage, documentaire ou article.
        </motion.p>
      </motion.div>

      {/* Stats clés */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {STATS.map(({ value, label, sub }) => (
          <motion.div
            key={value}
            variants={FADE_IN_UP}
            className="glass rounded-2xl p-5 text-center border border-white/8"
          >
            <p className="text-2xl md:text-3xl font-bold text-ocean-teal mb-1">{value}</p>
            <p className="text-white text-xs font-medium leading-snug mb-1">{label}</p>
            <p className="text-gray-500 text-xs">{sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Biographie courte */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
        className="mb-12"
      >
        <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-ocean-teal" aria-hidden="true" />
            Biographie courte (version presse)
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            <strong className="text-white">Karim Saari</strong>, alias <strong className="text-white">Dark Massilia</strong>, est photographe environnemental et sous-marin basé à Marseille. Depuis 2018, il documente la beauté et la fragilité des Calanques en pratiquant l'apnée, et coordonne avec son association <strong className="text-white">Team Oxygen</strong> le <strong className="text-white">Projet Sentinelle</strong> — opération annuelle de dépollution sous-marine qui a permis de retirer <strong className="text-white">5 724 kg de déchets</strong> des fonds méditerranéens en quatre éditions (2022–2025).
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Il anime la communauté Dark Massilia — plus de <strong className="text-white">{SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR')} membres</strong> engagés pour la protection des Calanques. Ses images et ses missions ont été diffusées sur <strong className="text-white">ARTE</strong> (documentaires <em>Sauver Marseille</em> et <em>Méduses, les souveraines des océans</em>), <strong className="text-white">TF1</strong> et <strong className="text-white">M6 Zone Interdite</strong>. Certifié Google Street View Trusted et Google Local Guides Level 10.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Son travail repose sur une dualité : la beauté documentée des fonds marins méditerranéens, et l'urgence écologique qui les menace. 170+ photographies accessibles en ligne, régulièrement mises à jour depuis les missions de terrain.
          </p>
        </motion.div>
      </motion.div>

      {/* Angles rédactionnels */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
        className="mb-12"
      >
        <motion.h2 variants={FADE_IN_UP} className="text-xl font-bold text-white mb-6">
          Angles rédactionnels proposés
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ANGLES.map(({ title, desc }) => (
            <motion.div
              key={title}
              variants={FADE_IN_UP}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-ocean-teal/30 transition-colors"
            >
              <p className="text-white font-semibold mb-2 text-sm">{title}</p>
              <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Visuels disponibles */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
        className="mb-12"
      >
        <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-ocean-teal" aria-hidden="true" />
            Visuels disponibles
          </h2>
          <p className="text-text-secondary mb-6">
            Les photographies ci-dessous sont disponibles en haute résolution pour usage éditorial, sous réserve de mention du crédit <strong className="text-white">© Karim Saari</strong>. Contactez-nous pour toute demande de fichiers HD.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/photographie-sous-marine" className="btn inline-flex items-center gap-2">
              <Camera className="w-4 h-4" aria-hidden="true" />
              Galerie sous-marine (101 photos)
            </Link>
            <Link to="/photographie-paysage-mer" className="btn inline-flex items-center gap-2">
              Galerie paysages (92 photos)
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Médias */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
        className="mb-12"
      >
        <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-10">
          <h2 className="text-xl font-bold text-white text-center mb-2">Couvertures médias</h2>
          <p className="text-text-secondary text-center text-sm mb-8">
            Reportages et documentaires depuis 2022.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            {MEDIA_LOGOS.map(({ name, label, svg, url }) => (
              <Link
                key={name}
                to={url}
                title={label}
                className="bg-white rounded-md px-3 py-2 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
              >
                <img src={svg} alt={label} className="h-6 md:h-8 w-auto object-contain" loading="lazy" />
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/presse" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium">
              Voir toutes les couvertures presse
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Contact presse */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={STAGGER_CONTAINER}
        className="mb-12"
      >
        <motion.div
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl p-8 md:p-10 border border-ocean-teal/20"
        >
          <h2 className="text-xl font-bold text-white mb-2">Contact presse</h2>
          <p className="text-text-secondary mb-6">
            Pour tout reportage, documentaire, interview, exposition ou partenariat institutionnel — réponse sous 48h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:email@karimsaari.com"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              email@karimsaari.com
            </a>
            <Link to="/contact" className="btn inline-flex items-center gap-2">
              Formulaire de contact
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </motion.div>

    </div>
  </div>
);

export default DossierPresse;
