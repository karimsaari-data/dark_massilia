import { motion } from 'framer-motion';
import { useCardHover } from '../hooks/useCardHover';
import { ArrowLeft, ArrowRight, ExternalLink, Camera, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER, SOCIAL_STATS_DEFAULTS } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';
import StatCounter from '../components/ui/StatCounter';

const EDITIONS = [
  { year: '2022', waste: 900,  duration: '8 jours', location: 'Côte Bleue, de Martigues à l\'Estaque', color: '#21c47b' },
  { year: '2023', waste: 1357, duration: '7 jours', location: 'Archipel du Frioul',                     color: '#0091ff' },
  { year: '2024', waste: 1147, duration: '9 jours', location: 'Parc National des Calanques',            color: '#ff6b35' },
  { year: '2025', waste: 2320, duration: '7 jours', location: 'Rade de Marseille',                      color: '#ffd93d' },
];

const Missions = () => {
  const cardHover = useCardHover();
  return (
    <div className="min-h-screen pt-8 pb-24">
      <SEO {...SEO_PAGES['/depollution-marine']} />
      <div className="container-custom">
        <Breadcrumb label="Missions de Dépollution Marine" />

        {/* H1 SEO */}
        <div className="flex items-stretch gap-4 mb-3">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
            style={{ transformOrigin: 'top' }}
            className="w-[3px] bg-ocean-teal rounded-full flex-shrink-0"
            aria-hidden="true"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-2xl font-bold text-white leading-tight"
          >
            Team Oxygen : Association d'apnéistes engagés pour la mer Méditerranée à Marseille
          </motion.h1>
        </div>
        <p className="text-center text-xs text-gray-500 mb-8">
          Mis à jour le <time dateTime="2026-03-19">19 mars 2026</time>
        </p>

        {/* Mission Description */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(10, 20, 40, 0.45)',
              backdropFilter: 'blur(14px)',
              borderRadius: '24px',
              padding: 'clamp(32px, 5vw, 72px)',
              border: '2px solid rgba(0,171,168,0.55)',
              boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
              minHeight: '360px',
            }}>
            {/* Vidéo fond */}
            <video
              autoPlay muted loop playsInline preload="none"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
              poster="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-v%C3%A9lo-m%C3%A9tropole.webp"
            >
              <source src="/assets/video/pollution-hero.mp4" type="video/mp4" />
            </video>
            {/* Contenu */}
            <div className="relative p-8 md:p-12 flex flex-col justify-center" style={{ zIndex: 1 }}>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Notre mission sur le littoral méditerranéen
              </h2>
              <div className="rounded-xl px-5 py-4" style={{ background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(8px)' }}>
                <div className="space-y-4 text-white/90 leading-[1.8]">
                  <p className="font-medium">
                    Association d'apnéistes éco-engagés basée à Marseille — documentation, dépollution et sensibilisation sur l'ensemble du littoral : Calanques, Frioul, Côte Bleue et jusqu'à La Ciotat.
                  </p>
                  <p>
                    De la surface à 20 mètres de profondeur, <strong className="text-ocean-teal">Team Oxygen</strong> conduit des opérations structurées de dépollution sous-marine en apnée, combinant extraction de déchets, <Link to="/photographie-sous-marine" className="text-ocean-teal hover:text-white transition-colors">documentation photographique des fonds marins des Calanques</Link> et collecte de données environnementales sur les fonds marins de Méditerranée.
                  </p>
                  <p>
                    L'association est aujourd'hui présidée par <strong className="text-white font-semibold">Karim Saari</strong>, apnéiste et photographe engagé à Marseille, impliqué dans les actions de dépollution du littoral méditerranéen depuis 10 ans.
                  </p>
                </div>
              </div>
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

        {/* Lien Wikipedia Projet Sentinelle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mb-6 text-center"
        >
          <a
            href="https://fr.wikipedia.org/wiki/Projet_Sentinelle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zm-.75 3.5v1.25H9.5v1.5h1.75v5.5H9.5v1.5h5v-1.5h-1.75V7h-1.5z"/>
            </svg>
            Projet Sentinelle — article Wikipédia
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </motion.div>

        {/* 5ème édition — Annonce octobre 2026 + lien Team Oxygen */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-12"
        >
          <motion.div
            {...cardHover}
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
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
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
              <div className="mt-6 flex flex-wrap gap-6">
                <Link
                  to="/donnees-scientifiques"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
                >
                  Sources scientifiques
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  to="/photographie-paysage-mer"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
                >
                  Paysages des Calanques
                  <ArrowRight className="w-4 h-4" />
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
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row-reverse">
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
              Team Oxygen — association loi 1901 pour la mer
            </h2>
            <div className="space-y-4 text-text-secondary leading-[1.8]">
              <p>
                <strong className="text-ocean-teal">Team Oxygen</strong> est une{' '}
                <strong className="text-white">association d'apnéistes éco-engagés</strong> déclarée
                sous la loi 1901, fondée en 2018 à Marseille. À but non lucratif, elle réunit
                bénévoles, plongeurs et photographes autour d'une mission commune&nbsp;: documenter,
                nettoyer et protéger les fonds marins méditerranéens.
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
                { value: SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR'), label: 'Sentinelles en ligne' },
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

        {/* Section ramassage fonds marins — SEO "ramassage déchets mer Marseille" */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="glass rounded-2xl px-8 py-6 border border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">
              Comment se déroule le ramassage de déchets sur les fonds marins à Marseille ?
            </h2>
            <p className="text-text-secondary leading-[1.8]">
              Chaque opération de <strong className="text-white">ramassage de déchets en mer</strong> combine
              plongée en apnée et logistique de surface. Les apnéistes descendent entre 0 et 20 mètres pour
              collecter plastiques, métaux et déchets divers déposés sur les{' '}
              <strong className="text-white">fonds marins des Calanques</strong>. Les sacs remontés sont triés
              à bord, pesés et acheminés vers des filières de traitement adaptées. Cette méthode de{' '}
              <strong className="text-white">nettoyage sous-marin</strong> à Marseille permet d'atteindre des
              zones inaccessibles aux dispositifs classiques de ramassage en mer.
            </p>
          </div>
        </motion.div>

        {/* Types de déchets — impact écologique */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Quels déchets menacent les Calanques ? Types de pollution marine
            </h2>
            <div className="space-y-4 text-text-secondary leading-[1.8]">
              <p>
                Les missions de nettoyage sous-marin révèlent une pollution marine d'une grande
                diversité. Les déchets les plus fréquemment remontés des fonds des Calanques de
                Marseille comprennent les{' '}
                <strong className="text-white">plastiques fragmentés</strong> (sacs, emballages,
                bouteilles), les{' '}
                <strong className="text-white">engins de pêche abandonnés</strong> (filets fantômes,
                hameçons, fils nylon), mais aussi des objets encombrants&nbsp;: scooters, vélos,
                bouteilles de gaz, mobilier urbain charié par les crues des cours d'eau côtiers.
              </p>
              <p>
                L'impact sur la faune méditerranéenne est documenté à chaque plongée. Les{' '}
                <strong className="text-white">filets fantômes</strong> continuent de capturer des
                poissons, des poulpes et des langoustes longtemps après avoir été abandonnés — c'est
                ce que les biologistes appellent la «&nbsp;pêche fantôme&nbsp;». Le nylon prend{' '}
                <strong className="text-white">400 à 600 ans pour se dégrader</strong>, relâchant des
                microplastiques qui intègrent la chaîne alimentaire marine. Les{' '}
                <strong className="text-white">herbiers de Posidonie</strong>, classés habitat
                prioritaire par l'Union Européenne, sont étouffés sous les déchets lourds qui
                bloquent la photosynthèse et accélèrent leur régression.
              </p>
              <p>
                Chaque déchet extrait est <strong className="text-white">pesé, trié et
                caractérisé</strong>&nbsp;: plastique rigide, film plastique, métal, verre, textile,
                caoutchouc. Ces données alimentent les rapports scientifiques partenaires et
                contribuent à la cartographie de la pollution marine dans le Parc National des
                Calanques. Les missions de Team Oxygen permettent également d'alerter les autorités
                maritimes sur les zones de dépôt les plus critiques, pour prioriser les interventions
                futures et mesurer l'efficacité des actions de sensibilisation auprès du grand public.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Rejoindre une mission — bénévolat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Comment participer à une mission de dépollution sous-marine ?
            </h2>
            <div className="space-y-4 text-text-secondary leading-[1.8]">
              <p>
                Team Oxygen accueille chaque année des bénévoles motivés lors des grandes éditions du{' '}
                <strong className="text-white">Projet Sentinelle</strong>. La pratique de l'apnée
                n'est pas obligatoire pour participer&nbsp;: les missions mobilisent également des
                équipes de surface chargées de la logistique, du tri des déchets, de la pesée et de
                la documentation visuelle.
              </p>
              <p>
                Pour les <strong className="text-white">plongeurs et apnéistes</strong>, les
                interventions se déroulent entre 0 et 20 mètres, en binôme, avec un briefing de
                sécurité systématique avant chaque immersion. Aucun équipement spécifique n'est
                requis au-delà du matériel standard d'apnée (masque, palmes, combinaison). Team
                Oxygen fournit les sacs de collecte, les filets de surface et l'organisation
                logistique complète. Les sessions durent entre 4 et 6 heures et se déroulent chaque
                matin pendant toute la durée de l'édition.
              </p>
              <p>
                Les candidatures pour la{' '}
                <strong className="text-ocean-teal">5ème édition — octobre 2026</strong> seront
                ouvertes prochainement. Inscris-toi à la newsletter pour recevoir le formulaire en
                avant-première, les dates exactes et les lieux de rendez-vous. Les 130&nbsp;000
                membres de la communauté Dark Massilia sont la première force de mobilisation
                citoyenne pour la protection des Calanques de Marseille — chaque bénévole compte,
                que tu sois apnéiste confirmé ou simple citoyen engagé.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/#newsletter"
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>S'inscrire pour participer</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/communaute"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <span>Rejoindre la communauté</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Accès aux massifs forestiers — risque incendie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="glass rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-orange-500/20">
            <div>
              <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Avant chaque mission
              </p>
              <p className="text-white font-semibold text-lg leading-snug">
                Accès aux massifs forestiers des Calanques
              </p>
              <p className="text-text-secondary text-sm mt-1">
                Carte officielle du risque incendie en temps réel — consultez avant toute sortie.
              </p>
            </div>
            <Link
              to="/acces-massifs-calanques"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-orange-500/40 text-orange-400 text-sm font-semibold hover:bg-orange-500/10 transition-colors whitespace-nowrap flex-shrink-0"
            >
              <Flame className="w-4 h-4" />
              Voir la carte risque
            </Link>
          </div>
        </motion.div>

        {/* Dernières actualités — maillage interne blog */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="glass rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/5">
            <div>
              <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-1">
                Journal de bord
              </p>
              <p className="text-white font-semibold text-lg leading-snug">
                Actualités &amp; comptes rendus de mission
              </p>
              <p className="text-text-secondary text-sm mt-1">
                Reportages terrain, faune observée et bilans de dépollution depuis les Calanques.
              </p>
            </div>
            <Link
              to="/blog"
              className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <span>Lire le blog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
