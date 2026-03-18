import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

// Compteur animé — s'active à l'entrée dans le viewport
const StatCounter = ({ end, suffix = ' kg', duration = 2000 }) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) { setCount(end); return; }
    let startTime = null;
    let raf;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration, prefersReducedMotion]);

  return <span ref={ref}>{count.toLocaleString('fr-FR')}{suffix}</span>;
};

const EDITIONS = [
  { year: '2022', waste: 900,  duration: '8 jours', location: 'Côte Bleue, de Martigues à l\'Estaque', color: '#21c47b' },
  { year: '2023', waste: 1357, duration: '7 jours', location: 'Archipel du Frioul',                     color: '#0091ff' },
  { year: '2024', waste: 1147, duration: '9 jours', location: 'Parc National des Calanques',            color: '#ff6b35' },
  { year: '2025', waste: 2320, duration: '7 jours', location: 'Rade de Marseille',                      color: '#ffd93d' },
];

const Missions = () => {
  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/depollution-marine']} />
      <div className="container-custom">

        {/* H1 SEO */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl font-bold text-white text-center mb-8 leading-tight"
        >
          Team Oxygen : Association de dépollution marine et nettoyage sous-marin à Marseille
        </motion.h1>

        {/* Mission Description */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Notre mission sur le littoral méditerranéen
              </h2>
              <div className="space-y-4 text-text-secondary leading-[1.8]">
                <p className="font-medium text-white/80">
                  Association d'apnéistes éco-engagés basée à Marseille et intervenant sur l'ensemble du littoral marseillais : plages, ports, îles du Frioul, Calanques, Côte Bleue et jusqu'à La Ciotat.
                </p>
                <p>
                  De la surface à 20 mètres de profondeur, <strong className="text-ocean-teal">Team Oxygen</strong> conduit des opérations structurées de dépollution sous-marine en apnée, combinant extraction de déchets, documentation visuelle et collecte de données environnementales sur les fonds marins de Méditerranée.
                </p>
                <p>
                  L'association est aujourd'hui présidée par <strong className="text-white">Karim Saari</strong>, apnéiste et photographe engagé à Marseille, impliqué dans les actions de dépollution du littoral méditerranéen depuis 10 ans.
                </p>
              </div>
            </div>
            {/* Photo */}
            <div className="lg:w-[40%] flex-shrink-0 min-h-[260px] lg:min-h-0">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-v%C3%A9lo-m%C3%A9tropole.webp"
                alt="Mission de dépollution Projet Sentinelle — vélo métropole récupéré par Team Oxygen dans les fonds marins de Marseille"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Éditions — 4 années avec compteurs animés */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDITIONS.map((edition, index) => (
              <div key={index} className="glass-strong rounded-2xl p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: edition.color }}
                  >
                    {edition.year}
                  </h3>
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      <StatCounter end={edition.waste} suffix=" kg" />
                    </p>
                    <p className="text-sm text-text-muted">déchets collectés</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium">{edition.duration} d'aventure</p>
                  <p className="text-text-secondary text-sm">{edition.location}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 5ème édition — Annonce octobre 2026 + lien Team Oxygen */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-3xl p-8 md:p-12 border border-ocean-teal/30 text-center"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ocean-teal/15 border border-ocean-teal/30 text-ocean-teal text-xs font-semibold mb-6">
              📅 Prochaine édition
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              5ème édition — Octobre 2026
            </h3>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
              La prochaine grande mission de dépollution se prépare. Inscris-toi à la newsletter pour être informé en avant-première du lancement.
            </p>
            <a
              href="https://www.team-oxygen.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-base font-medium"
            >
              Voir sur Team Oxygen
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>

        {/* Photo hero — lien vers /photographie-sous-marine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mb-12"
        >
          <Link to="/photographie-sous-marine" className="group block relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <div className="aspect-[16/7] relative">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen_1200w.webp"
                alt="Team Oxygen en apnée lors d'une mission de dépollution sous-marine dans les Calanques de Marseille — Karim Saari photographe sous-marin"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">Galerie photographique</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  Une décennie de missions sous-marines en images
                </h2>
                <p className="text-white/70 text-base mb-4 max-w-xl">
                  Dépollution documentée en apnée — fonds marins, vie marine et déchets collectés dans les Calanques.
                </p>
                <span className="inline-flex items-center gap-2 text-ocean-teal font-medium group-hover:gap-3 transition-all">
                  <Camera className="w-4 h-4" aria-hidden="true" />
                  Voir la galerie sous-marine
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Section éditoriale SEO — après le hero photo */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Agir à la source : Les Calanques et la Côte Bleue
              </h2>
              <p className="text-text-secondary leading-[1.8] text-lg">
                L'urgence est à nos portes&nbsp;: 80&nbsp;% des déchets marins proviennent de la terre.
                L'impact sur notre littoral est massif. À titre d'exemple, lors du bilan 2023 de
                l'opération Calanques Propres, 119&nbsp;m³ de déchets ont été récoltés sur le seul
                littoral marseillais. Parmi les polluants les plus présents dans nos filets&nbsp;: les
                bouteilles en verre, les canettes, les bouteilles en plastique et divers emballages.
                Avec <strong className="text-ocean-teal">Team Oxygen</strong>, chaque immersion en
                apnée est une action directe pour soustraire ces polluants de notre biodiversité locale.
              </p>
              <div className="mt-6">
                <Link
                  to="/donnees-scientifiques"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
                >
                  Sources scientifiques
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="lg:w-[38%] flex-shrink-0 min-h-[260px] lg:min-h-0">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-plaque-immatriculation.webp"
                alt="Plaque d'immatriculation récupérée lors d'une mission de dépollution sous-marine Projet Sentinelle dans les Calanques de Marseille"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* À propos de l'association — section sémantique SEO */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row-reverse">
            <div className="lg:w-[38%] flex-shrink-0 min-h-[260px] lg:min-h-0">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen-freediving.webp"
                alt="Apnéiste Team Oxygen en freediving lors d'une mission de dépollution sous-marine dans les Calanques de Marseille"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Team Oxygen — association de dépollution loi 1901
            </h2>
            <div className="space-y-4 text-text-secondary leading-[1.8]">
              <p>
                <strong className="text-ocean-teal">Team Oxygen</strong> est une{' '}
                <strong className="text-white">association de dépollution marine</strong> déclarée
                sous la loi 1901, fondée en 2018 à Marseille. En tant qu'association à but non
                lucratif, elle mobilise des bénévoles et des apnéistes certifiés autour d'un
                objectif commun&nbsp;: extraire les déchets des fonds marins méditerranéens et
                documenter l'état de la pollution sous-marine.
              </p>
              <p>
                L'association intervient sur des zones inaccessibles aux ramassages de surface&nbsp;:
                entre 0 et 20 mètres de profondeur, là où 94&nbsp;% du plastique marin se dépose et
                ne se dégrade plus. Chaque mission de l'<strong className="text-white">association
                dépollution</strong> associe extraction physique des déchets, tri et caractérisation
                scientifique, et production d'images documentaires diffusées pour sensibiliser le
                grand public.
              </p>
              <p>
                Présidée par Karim Saari, l'association dépollution Team Oxygen est également
                partenaire du <strong className="text-white">Parc National des Calanques</strong> et
                travaille en lien avec la{' '}
                <strong className="text-white">Fondation de la Mer</strong>. Ses missions sont
                couvertes par ARTE, M6, France Télévisions, La Provence, la Fondation de la Mer et bien d'autres médias.
              </p>
            </div>

            {/* Chiffres clés association */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '2018', label: 'Année de fondation' },
                { value: '5 724 kg', label: 'Déchets collectés' },
                { value: '4', label: 'Éditions du Projet Sentinelle' },
                { value: '130 000', label: 'Sentinelles en ligne' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xl md:text-2xl font-bold text-ocean-teal">{stat.value}</p>
                  <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                to="/communaute"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
              >
                Rejoindre l'association
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Voir aussi — maillage interne vidéos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="glass rounded-2xl px-8 py-6 flex flex-col gap-6 border border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">
                  Nos missions en images et en vidéo
                </p>
                <p className="text-white font-semibold text-lg leading-snug">
                  Documentaires &amp; vidéos de mission
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  ARTE, M6, France Télévisions, reportages terrain — retrouvez toutes nos productions.
                </p>
              </div>
              <Link
                to="/videos"
                className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0"
              >
                <span>Voir les vidéos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 border-t border-white/8">
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
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Missions;
