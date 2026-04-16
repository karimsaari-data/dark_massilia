import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, ChevronDown, Camera, MapPin } from 'lucide-react';

import { FADE_IN_UP, STAGGER_CONTAINER, FACEBOOK_GROUP_MEMBERS } from '../utils/constants';
import { trackEvent } from '../lib/analytics';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import FireRiskBadge from '../components/FireRiskBadge';

// Lazy-loaded — rompt la chaîne statique Home → supabase → @supabase/supabase-js
// Supabase ne sera chargé qu'après le premier rendu de la page (chunk async)
const NewsletterSection = lazy(() => import('../components/NewsletterSection'));
const RecentArticles    = lazy(() => import('../components/RecentArticles'));

// Chiffres clés — impact terrain (valeurs statiques de base)
// La valeur end de la stat 500px est remplacée dynamiquement via Supabase (site_config)
const KEY_STATS_BASE = [
  {
    end: 132000,
    suffix: '',
    label: 'Abonnés passionnés par les Calanques',
    sub: 'sur l\'ensemble des réseaux sociaux',
    detail: `dont ${FACEBOOK_GROUP_MEMBERS.toLocaleString('fr-FR')} sur le groupe Facebook`,
    href: '/communaute',
  },
  {
    end: 5724,
    suffix: ' kg',
    label: 'Déchets collectés dans les fonds marins marseillais',
    sub: 'jusqu\'à 20 m de profondeur',
    detail: '900 + 1 357 + 1 147 + 2 320 kg · 4 éditions',
    href: '/depollution-marine',
  },
  {
    end: 143,
    suffix: ' M',
    label: 'Vues Google Maps sur Marseille et ses environs',
    sub: '9 ans de contributions Local Guide',
    detail: 'Photos et avis sur les Calanques de Marseille',
    href: '/local-guide-marseille',
  },
  {
    key: 'impressions_500px',   // valeur chargée depuis Supabase site_config
    end: 800,
    suffix: ' K',
    label: 'Impressions photos sur 500px',
    sub: 'photographie underwater & paysage',
    detail: '798 K impressions · 29,4 K photo likes · 667 followers',
  },
];

// Composant compteur animé — s'active à l'entrée dans le viewport
const StatCounter = ({ end, suffix = '', duration = 2000, prefersReduced }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReduced) { setCount(end); return; }
    let startTime = null;
    let raf;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3; // ease-out cubic
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration, prefersReduced]);

  return (
    <span ref={ref}>
      {count.toLocaleString('fr-FR')}{suffix}
    </span>
  );
};

// Phrases choc sur la pollution marine
const IMPACT_FACTS = [
  "Une concentration disproportionnée : La mer Méditerranée ne représente que 1 % de la surface océanique mondiale, mais elle concentre pourtant 7 % de tous les microplastiques de la planète.",
  "L'absurdité de l'usage unique : Il faut environ 1 seconde pour fabriquer un sac plastique et son utilisation moyenne ne dure que 20 minutes, alors qu'il lui faudra plus d'un siècle pour se dégrader dans le milieu naturel.",
  "Une persistance millénaire : Si un mégot de cigarette met environ 10 ans à se dégrader en mer, une ligne de pêche en plastique peut mettre jusqu'à 600 ans pour disparaître.",
  "L'ampleur mondiale : On estime à 5 250 milliards le nombre de particules plastiques qui flottent actuellement à la surface des océans, ce qui équivaut à un poids de près de 269 000 tonnes.",
  "L'omniprésence en Méditerranée : La densité moyenne de plastique en Méditerranée (1 objet tous les 4 m²) est comparable à celle des zones d'accumulation des cinq grands gyres océaniques subtropicaux, souvent qualifiés de « continents de plastique ».",
  "Un piège mortel pour la faune : Les tortues marines confondent les plastiques transparents avec des méduses, ce qui provoque des lésions graves ou la mort, tandis que des dauphins peuvent mourir la mâchoire bloquée par des anneaux en plastique avec lesquels ils tentaient de jouer.",
  "Une contamination massive des oiseaux : On estime aujourd'hui que plus de 90 % des oiseaux marins ont déjà ingéré du plastique, et les projections indiquent que 99 % des espèces seront touchées d'ici 2050.",
  "Le flux incessant : Les populations côtières déversent environ 8 millions de tonnes de déchets plastiques dans les océans chaque année, un chiffre qui pourrait doubler en une décennie sans amélioration de la gestion des déchets.",
  "Le fléau des mégots : Lors de la seule opération « Calanques Propres » en 2023, plus de 70 000 mégots ont été ramassés, soulignant une pollution locale massive et préoccupante.",
  "Une pollution inévitable : Lors d'une vaste campagne d'échantillonnage à travers le bassin méditerranéen, des débris plastiques flottants ont été retrouvés dans 100 % des sites analysés.",
];

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que le Projet Sentinelle ?",
    a: "Le Projet Sentinelle est l'opération annuelle structurante menée par Team Oxygen pour la protection de la Méditerranée. Tout au long de l'année, des actions de veille, de sensibilisation et d'interventions ponctuelles sont organisées sur le littoral marseillais. Chaque automne, le dispositif prend une dimension intensive : une semaine complète de dépollution sous-marine en apnée dans les Calanques de Marseille. Les équipes interviennent entre 0 et 20 mètres de profondeur, avec des sessions quotidiennes de 5 à 6 heures dans l'eau. Les déchets collectés — principalement plastiques et macro-déchets — sont remontés, triés et quantifiés afin de documenter l'état réel des fonds marins.",
  },
  {
    q: "Combien de déchets a collecté le Projet Sentinelle ?",
    a: "En 4 éditions (2022–2025), le Projet Sentinelle et Team Oxygen ont collecté plus de 5 724 kg de déchets marins : 900 kg sur la Côte Bleue (2022), 1 357 kg à l'Archipel du Frioul (2023), 1 147 kg dans le Parc National des Calanques (2024) et 2 320 kg dans la Rade de Marseille (2025).",
  },
  {
    q: "Comment participer aux missions de dépollution des Calanques ?",
    a: "Pour participer aux missions de dépollution organisées dans les Calanques de Marseille, vous pouvez contacter Team Oxygen via la page Contact du site karimsaari.com ou rejoindre la communauté à travers le groupe Facebook « Amoureux des Calanques ». Les immersions en apnée nécessitent des compétences techniques et une pratique encadrée. Nous recherchons principalement des bénévoles pour l'appui logistique terrestre (tri, pesée, gestion du matériel, sensibilisation) ainsi que des kayakistes pour l'assistance en surface et la sécurisation des zones d'intervention. Ces rôles sont essentiels au bon déroulement des opérations et accessibles à un plus grand nombre.",
  },
  {
    q: "Pourquoi la mer Méditerranée est-elle l'une des mers les plus polluées au monde par le plastique ?",
    a: "La Méditerranée agit comme un véritable « piège à plastique » en raison de sa géographie : c'est une mer semi-fermée dont les eaux mettent environ 90 ans à se renouveler, alors que la durée de vie des plastiques dépasse largement un siècle. De plus, ses côtes sont densément peuplées (150 millions d'habitants), le trafic maritime y est très intense (30 % du trafic mondial) et elle subit une pression touristique massive. Conséquence : bien qu'elle ne représente que 1 % de la surface océanique mondiale, elle concentre 7 % de tous les microplastiques de la planète.",
  },
  {
    q: "Quelle quantité de plastique est déversée dans la Méditerranée chaque jour ?",
    a: "On estime qu'entre 700 et 1 400 tonnes de plastique sont déversées chaque jour dans la mer Méditerranée, ce qui équivaut à un ou deux camions poubelles par heure. À une autre échelle, cela représente l'équivalent de 33 800 bouteilles en plastique jetées à la mer chaque minute. Au total, plus d'un million de tonnes de plastique se trouvent déjà dans le bassin méditerranéen.",
  },
  {
    q: "D'où proviennent ces déchets plastiques ?",
    a: "Environ 80 % des déchets marins proviennent d'activités terrestres. Ils sont transportés par les fleuves (comme le Rhône, le Pô ou le Nil) qui agissent comme des tapis roulants, par le ruissellement urbain (pluies entraînant les déchets des rues vers la mer), ou sont directement abandonnés sur les littoraux. Les 20 % restants proviennent des activités maritimes telles que la pêche, l'aquaculture et le transport maritime.",
  },
  {
    q: "Quels sont les déchets que l'on retrouve le plus souvent en mer et sur les plages ?",
    a: "Le plastique représente 95 % des déchets marins en Méditerranée. Les objets les plus fréquemment retrouvés sont les emballages alimentaires, les bouteilles en plastique, les bouchons, les sacs et les équipements de pêche. Les mégots de cigarette (dont le filtre contient du plastique) sont également un fléau majeur, constituant une part très importante des déchets collectés sur les plages.",
  },
  {
    q: "Combien de temps faut-il à un déchet plastique pour se dégrader en mer ?",
    a: "Les plastiques ne se biodégradent quasiment pas à l'échelle d'une vie humaine ; ils persistent des centaines d'années. Par exemple, un sac plastique met entre 20 et plus de 100 ans à se dégrader, une bouteille en plastique environ 450 ans, et un fil de pêche jusqu'à 600 ans. De plus, la disparition « visuelle » d'un déchet est trompeuse : il ne fait que se fragmenter en millions de microplastiques sous l'effet du soleil et des vagues.",
  },
  {
    q: "Qu'est-ce qu'un microplastique et pourquoi est-ce si dangereux ?",
    a: "Les microplastiques sont de minuscules fragments de plastique mesurant moins de 5 millimètres, issus de la dégradation de déchets plus gros. Ils sont particulièrement dangereux car leur taille est similaire à celle du plancton. En Méditerranée, le ratio entre microplastiques et zooplancton peut atteindre 1 pour 2, ce qui entraîne une ingestion massive par les poissons et autres prédateurs marins. De plus, ils agissent comme des éponges, concentrant des polluants chimiques et toxiques à leur surface.",
  },
  {
    q: "Le plastique flotte-t-il toujours à la surface de l'eau ?",
    a: "Non, ce que l'on voit à la surface n'est que la partie émergée de l'iceberg. On estime que 94 % du plastique qui entre en mer Méditerranée finit par couler et sédimenter sur les fonds marins. Les 6 % restants se répartissent entre les plages (5 %) et la surface (1 %). Une fois au fond de l'eau, dans l'obscurité, le froid et le manque d'oxygène, le plastique ne se dégrade quasiment plus.",
  },
  {
    q: "Quel est l'impact de cette pollution sur la faune marine ?",
    a: "Les conséquences sont catastrophiques : plus de 700 espèces marines sont impactées à l'échelle globale, et toutes les espèces de tortues marines de Méditerranée sont touchées par l'ingestion de plastique. Les tortues confondent souvent les sacs plastiques avec des méduses. Les grands cétacés, comme les rorquals, avalent des microplastiques en filtrant l'eau, tandis que de nombreux oiseaux, poissons et dauphins meurent d'occlusions intestinales ou en s'emmêlant dans des filets fantômes abandonnés.",
  },
  {
    q: "La pollution plastique marine a-t-elle des conséquences sur la santé humaine ?",
    a: "Oui, la chaîne alimentaire humaine est directement contaminée. En mangeant des produits de la mer (comme les poissons, les moules ou les huîtres) ou même via le sel marin, nous absorbons des plastiques. À l'heure actuelle, on estime qu'un être humain ingère environ 5 grammes de plastiques par semaine, ce qui représente le poids d'une carte de crédit. Ces plastiques contiennent et libèrent des additifs chimiques qui agissent souvent comme des perturbateurs endocriniens, favorisant diverses maladies.",
  },
  {
    q: "Quel est le rôle du tourisme dans cette pollution ?",
    a: "Le bassin méditerranéen reçoit plus de 200 millions de touristes par an, ce qui exerce une pression gigantesque sur le littoral. Durant les mois d'été, cette affluence saisonnière provoque une augmentation de 40 % de la production de déchets. Les infrastructures locales de gestion des déchets sont souvent saturées, ce qui entraîne des débordements et l'abandon direct de nombreux déchets (bouteilles, emballages, objets de plage) sur les côtes.",
  },
  {
    q: "Qu'est-ce que la photographie environnementale ?",
    a: "La photographie environnementale se sert d'images de paysages, de plantes ou d'animaux pour éveiller chez l'observateur le désir d'en protéger l'existence — particulièrement face aux dangers auxquels la nature est confrontée. En Méditerranée, elle devient un outil de témoignage direct : chaque image des calanques de Marseille, de leurs fonds marins ou de la faune locale est une preuve visuelle de l'urgence écologique. La photographie environnementale que je pratique n'est pas simplement esthétique : chaque cliché est un document, une preuve, un appel à l'action.",
  },
  {
    q: "Quel matériel utilisez-vous pour photographier sous l'eau dans les Calanques ?",
    a: "La photographie sous-marine dans les Calanques de Marseille se pratique principalement en apnée, ce qui impose des contraintes très différentes de la plongée bouteille : aucune bulle, aucun bruit, une proximité naturelle avec la faune. J'utilise un boîtier étanche monté avec un grand angle pour capter la profondeur des fonds marins et la lumière naturelle de la Méditerranée. La transparence exceptionnelle de l'eau des Calanques — entre 15 et 30 mètres de visibilité — permet d'obtenir des images d'une clarté rare, à la fois pour les paysages sous-marins et pour la documentation des espèces comme les poulpes, les mérous et les posidonies.",
  },
  {
    q: "Où voir vos photographies sous-marines des Calanques de Marseille ?",
    a: "Mes photographies sous-marines des Calanques sont accessibles sur ce site dans la galerie dédiée à la photographie sous-marine, qui regroupe plus de 58 clichés pris lors des missions de dépollution du Projet Sentinelle (2022–2025). Vous pouvez également retrouver une sélection de paysages marins et terrestres dans la galerie de photographie de paysages, ainsi que sur mon profil 500px (karimsaari) où mes images cumulent plus de 800 000 impressions. Pour les expositions et demandes de tirage, n'hésitez pas à me contacter directement.",
  },
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="text-white font-semibold text-base md:text-lg group-hover:text-ocean-teal transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-ocean-teal flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Contenu toujours dans le DOM pour le SEO — max-h-0 quand fermé */}
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px] mt-4' : 'max-h-0'}`}
        aria-hidden={!isOpen}
      >
        <p className="text-text-secondary leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const Home = () => {
  const prefersReducedMotion = useReducedMotion();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Stats réseaux — valeurs dynamiques depuis Supabase (fallback sur KEY_STATS_BASE)
  const [communityEnd, setCommunityEnd]       = useState(KEY_STATS_BASE[0].end);
  const [communityDetail, setCommunityDetail] = useState(KEY_STATS_BASE[0].detail);
  const [localGuidesEnd, setLocalGuidesEnd]   = useState(KEY_STATS_BASE[2].end);
  const [fbGroupMembers, setFbGroupMembers]   = useState(FACEBOOK_GROUP_MEMBERS);
  const [impressions500px, setImpressions500px] = useState(KEY_STATS_BASE[3].end);

  useEffect(() => {
    import('../lib/supabase').then(({ supabase }) => {
      supabase
        .from('social_stats')
        .select('platform, value, note')
        .in('platform', ['total_community', 'local_guide_views_m', 'facebook_group', '500px_impressions'])
        .then(({ data }) => {
          data?.forEach(row => {
            if (row.platform === 'total_community') {
              setCommunityEnd(parseFloat(row.value));
              if (row.note) setCommunityDetail(row.note);
            } else if (row.platform === 'local_guide_views_m') {
              setLocalGuidesEnd(parseFloat(row.value));
            } else if (row.platform === 'facebook_group') {
              const v = parseFloat(row.value);
              if (v > 100) setFbGroupMembers(v);
              else setFbGroupMembers(Math.round(v * 1000));
            } else if (row.platform === '500px_impressions') {
              setImpressions500px(parseFloat(row.value));
            }
          });
        });
    });
  }, []);

  const KEY_STATS = [
    { ...KEY_STATS_BASE[0], end: communityEnd, detail: `dont ${fbGroupMembers.toLocaleString('fr-FR')} sur le groupe Facebook` },
    KEY_STATS_BASE[1],
    { ...KEY_STATS_BASE[2], end: localGuidesEnd },
    { ...KEY_STATS_BASE[3], end: impressions500px, href: 'https://500px.com/p/karimsaari' },
  ];
  const [factsPaused, setFactsPaused] = useState(false);
  const [factsTimerKey, setFactsTimerKey] = useState(0);

  // Auto-rotation des phrases choc — pause au hover, reset au clic
  useEffect(() => {
    if (factsPaused) return;
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % IMPACT_FACTS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [factsPaused, factsTimerKey]);

  const goToFact = (index) => {
    setCurrentFactIndex(index);
    setFactsTimerKey((k) => k + 1); // reset le timer
  };

  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/']} />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Pas d'overlay supplémentaire ici — géré dans Layout.jsx */}

        {/* Hero Content — layout 2 colonnes desktop, empilé mobile */}
        <div className="container-custom relative z-10 w-full px-4 py-16 md:py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
          >
            <motion.div
              variants={{
                hidden: { y: 20 },
                visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
              }}
              style={{
                background: 'rgba(10, 20, 40, 0.75)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                padding: 'clamp(40px, 5vw, 72px)',
              }}
            >
              {/* Photo profil — Mobile uniquement (au-dessus du texte) */}
              <div className="flex justify-center mb-6 md:hidden">
                <img
                  src="/images/karim-saari-photo-profil-arte-regard-marseille.webp"
                  srcSet="/images/karim-saari-photo-profil-arte-regard-marseille_300w.webp 300w, /images/karim-saari-photo-profil-arte-regard-marseille.webp 472w"
                  sizes="192px"
                  alt="Karim Saari - Apnéiste et photographe à Marseille"
                  width="472"
                  height="488"
                  className="h-48 w-auto rounded-xl border border-white/20 shadow-lg shadow-ocean-teal/20"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                />
              </div>

              {/* Grille 2 colonnes desktop : texte gauche, photo droite */}
              <div className="md:grid md:grid-cols-[1fr_auto] md:gap-12 md:items-center">
                {/* Bloc texte */}
                <div className="text-center md:text-left">
                  {/* Trait vertical + titre — style Fondation de la Mer */}
                  <div className="flex items-stretch gap-5 mb-8">
                    <div className="w-[3px] bg-ocean-teal rounded-full flex-shrink-0" aria-hidden="true" />
                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-[0.08em] leading-[1.15]">
                      Photographie &amp; Engagement : Révéler et Protéger les Calanques de Marseille
                    </h1>
                  </div>

                  <p className="font-display text-base md:text-lg font-normal text-text-secondary leading-[1.85] mb-10">
                    <strong className="text-ocean-teal font-semibold">Rendre visible l'invisible.</strong>{' '}
                    Entre photographie d'art et exploration en apnée, je documente la beauté brute du littoral marseillais pour témoigner de l'urgence écologique. En tant que Sentinelle des Calanques, j'allie le pouvoir de l'image aux actions de terrain avec{' '}
                    <strong className="text-ocean-teal font-semibold">Team Oxygen</strong>{' '}
                    pour préserver durablement la biodiversité de notre Méditerranée.
                  </p>

                  {/* Hero CTAs */}
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-2">
                    <a
                      href="#galerie"
                      className="btn-primary inline-flex items-center gap-2"
                      title="Voir les photographies des Calanques de Marseille par Karim Saari"
                      onClick={() => trackEvent('cta_click', { button_name: 'Découvrir les Calanques' })}
                    >
                      <span>Découvrir les Calanques</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                    <Link
                      to="/communaute"
                      className="btn-ghost inline-flex items-center gap-2"
                      title="Rejoindre la communauté Dark Massilia — Calanques de Marseille"
                      onClick={() => trackEvent('cta_click', { button_name: 'Rejoindre la communauté' })}
                    >
                      <span>Rejoindre la communauté</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                {/* Photo profil — Desktop uniquement (colonne droite) */}
                <div className="hidden md:flex items-center justify-center">
                  <img
                    src="/images/karim-saari-photo-profil-arte-regard-marseille.webp"
                    srcSet="/images/karim-saari-photo-profil-arte-regard-marseille_300w.webp 300w, /images/karim-saari-photo-profil-arte-regard-marseille_400w.webp 400w, /images/karim-saari-photo-profil-arte-regard-marseille.webp 472w"
                    sizes="(max-width: 1024px) 280px, 360px"
                    alt="Karim Saari - Apnéiste et photographe à Marseille"
                    width="472"
                    height="488"
                    className="h-[380px] lg:h-[460px] w-auto rounded-xl border border-white/20 shadow-lg shadow-ocean-teal/20"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* Section bio — identité & engagement */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu — Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Karim Saari — Photographe environnemental &amp; Apnéiste
              </h2>
              <div className="text-lg text-text-secondary leading-relaxed space-y-4">
                <p>
                  De la <strong className="text-white font-semibold">photographie de paysages littoraux</strong> aux <strong className="text-white font-semibold">images sous-marines</strong>, j'utilise l'objectif pour porter la voix de <strong className="text-white font-semibold">Marseille, des Calanques</strong> et de ceux qui les protègent.
                </p>
                <p>
                  En tant que <strong className="text-white font-semibold">photographe environnemental en Méditerranée</strong>, je capture la beauté de nos côtes, en surface comme en apnée, pour témoigner de l'état réel de nos écosystèmes. La photographie environnementale que je pratique n'est pas simplement esthétique : <strong className="text-ocean-teal font-semibold">chaque image est un document, une preuve, un appel à l'action.</strong>
                </p>
                <p>
                  <strong className="text-white font-semibold">Apnéiste engagé depuis plus de 10 ans</strong> et président de <strong className="text-ocean-teal">Team Oxygen</strong>, ma mission se vit sur le terrain et à l'écran.
                </p>
                <p>
                  Pour rendre visible l'<strong className="text-white font-semibold">impact de la pollution plastique</strong>, je participe à des <strong className="text-white font-semibold">documentaires et reportages</strong> sur l'environnement marin, je conçois des <strong className="text-white font-semibold">expositions photos engagées</strong> et je mène des <strong className="text-white font-semibold">missions de dépollution sous-marine</strong> avec mon association.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  to="/photographe-environnemental-marseille"
                  className="btn-ghost inline-flex items-center gap-2"
                  title="Photographe environnemental Marseille — démarche, associations et engagements"
                  onClick={() => trackEvent('cta_click', { button_name: 'En savoir plus sur ma démarche' })}
                >
                  <span>En savoir plus sur ma démarche</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>

            {/* Image — Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique.webp"
                srcSet="/images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique_400w.webp 400w, /images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique_800w.webp 800w, /images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique_1200w.webp 1200w, /images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Karim Saari, photographe sous-marin Marseille — apnéiste en exploration subaquatique au Frioul © Karim Saari"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section Newsletter — lazy (supabase hors bundle initial) */}
      {/* Placée tôt pour capter les visiteurs après la découverte de Karim */}
      <Suspense fallback={
        <section className="container-custom py-8 md:py-12">
          <div className="rounded-3xl border border-ocean-teal/30 mb-16 min-h-[420px] md:min-h-[480px]" />
        </section>
      }>
        <NewsletterSection />
      </Suspense>

      {/* Section Phrases choc - Impact environnemental */}
      <section className="container-custom py-8 md:py-12">
        {/* Label de section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="text-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ocean-teal/30 bg-ocean-teal/10 text-ocean-teal text-xs font-semibold uppercase tracking-widest">
            <span>🌊</span> Le saviez-vous ?
          </span>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl border border-ocean-teal/20 p-8 md:p-12 shadow-lg shadow-ocean-teal/10 mb-16"
          onMouseEnter={() => setFactsPaused(true)}
          onMouseLeave={() => setFactsPaused(false)}
        >
          {/* Compteur discret */}
          <p className="text-center text-xs text-text-muted mb-6 tabular-nums">
            {currentFactIndex + 1} / {IMPACT_FACTS.length}
          </p>

          <div className="min-h-[180px] md:min-h-[140px] flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFactIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-lg md:text-xl lg:text-2xl font-semibold text-white leading-relaxed max-w-5xl"
              >
                {IMPACT_FACTS[currentFactIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Indicateurs de progression — dots plus grands + pause indicator */}
          <div className="flex justify-center items-center gap-0 mt-8">
            {IMPACT_FACTS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToFact(index)}
                className="inline-flex items-center justify-center p-2"
                aria-label={`Afficher le fait ${index + 1}`}
              >
                <span className={`rounded-full transition-all duration-300 ${
                  index === currentFactIndex
                    ? 'w-8 h-2.5 bg-ocean-teal'
                    : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                }`} />
              </button>
            ))}
            {factsPaused && (
              <span className="ml-3 text-xs text-text-muted italic">En pause</span>
            )}
          </div>
        </motion.div>
      </section>

      {/* Missions Section - Card moderne */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu - Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Agir pour la Méditerranée.
              </h2>

              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                À Marseille avec Team Oxygen, nous intervenons en apnée de la surface à 20 mètres pour dépolluer les fonds marins, documenter les déchets et protéger la biodiversité locale. Calanques, Frioul, Côte Bleue, La Ciotat : chaque mission est une action concrète pour notre littoral.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/depollution-marine"
                  className="btn-primary inline-flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { button_name: 'Découvrir nos missions' })}
                >
                  <span>Découvrir nos missions</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/presse"
                  className="btn-ghost inline-flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { button_name: 'Couverture médiatique' })}
                >
                  <span>Couverture médiatique</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Image Team Oxygen - Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp"
                srcSet="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen_400w.webp 400w, /images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen_800w.webp 800w, /images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen_1200w.webp 1200w, /images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Team Oxygen - Projet Sentinelle Marseille"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '12% 25%' }}
                loading="lazy"
                decoding="async"
              />
              {/* Overlay subtil */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Vidéos */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            {/* Image - Gauche */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1">
              <img
                src="/images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques.webp"
                srcSet="/images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques_400w.webp 400w, /images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques_800w.webp 800w, /images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques_1200w.webp 1200w, /images/portfolio/Mer/photographe-sous-marin-marseille-apnee-grotte-marine-calanques.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Photographe sous-marin Marseille — apnée en grotte marine Calanques de Marseille © Karim Saari"
                width="800"
                height="534"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
            </div>

            {/* Contenu - Droite */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Les Vidéos des Missions
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                Documentaires ARTE, reportages de dépollution en apnée, rétrospectives annuelles… Vivez nos missions depuis les profondeurs des Calanques de Marseille.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/videos"
                  className="btn-primary inline-flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { button_name: 'Voir les vidéos' })}
                >
                  <span>Voir les vidéos</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/presse"
                  className="btn-ghost inline-flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { button_name: 'Couverture médiatique' })}
                >
                  <span>Couverture médiatique</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Photos */}
      <section id="galerie" className="container-custom py-8 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu - Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Deux univers, un même engagement
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                Des falaises calcaires du littoral marseillais aux profondeurs de la Méditerranée, découvrez un témoignage visuel unique. Entre la splendeur des paysages de Provence et l'urgence écologique des fonds marins, chaque image raconte l'équilibre fragile de notre écosystème.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/photographie-paysage-mer"
                  className="btn-primary inline-flex items-center justify-between gap-2 w-full"
                  title="Voir les photographies de paysages et du littoral marseillais par Karim Saari"
                >
                  <span>Galerie Paysages &amp; Littoral</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/photographie-sous-marine"
                  className="btn-ghost inline-flex items-center justify-between gap-2 w-full"
                  title="Voir les photographies sous-marines et les actions de dépollution par Karim Saari"
                >
                  <span>Galerie Sous-marine &amp; Dépollution</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Image - Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/Karimsaari-portfolio-sous-marin-paysages-calanques-marseille-photographie-photographe-environnemental.webp"
                alt="Karim Saari — portfolio photographie sous-marine et paysages des Calanques de Marseille, photographe environnemental"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Fond distinct : gradient radial teal */}
        <div className="absolute inset-0 bg-gradient-to-b from-abyss via-abyss-light to-abyss pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,171,168,0.08),transparent)] pointer-events-none" />

        <div className="container-custom relative">
          {/* Titre */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_IN_UP}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-ocean-teal/10 text-ocean-teal border border-ocean-teal/20 mb-4">
              Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              10 ans d'engagement — Marseille & Calanques
            </h2>

            {/* Badge accès massifs — signal frais quotidien + cohérence inter-pages */}
            <div className="flex justify-center mt-5">
              <FireRiskBadge />
            </div>
          </motion.div>

          {/* Grille 4 chiffres */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {KEY_STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={FADE_IN_UP}
                className="relative rounded-2xl border border-ocean-teal/20 bg-white/[0.04] p-6 md:p-8 text-center group hover:border-ocean-teal/40 hover:bg-white/[0.07] transition-all duration-300"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 30px rgba(0,171,168,0.06)' }} />

                {/* Lien pleine carte — interne (Link) ou externe (a) */}
                {stat.href && (
                  stat.href.startsWith('http')
                    ? <a href={stat.href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 rounded-2xl z-10" aria-label={stat.label} />
                    : <Link to={stat.href} className="absolute inset-0 rounded-2xl z-10" aria-label={stat.label} />
                )}

                {/* Valeur animée */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-1 tabular-nums pb-1">
                  <StatCounter
                    end={stat.end}
                    suffix={stat.suffix}
                    prefersReduced={prefersReducedMotion}
                  />
                </div>

                {/* Label principal */}
                <p className="text-sm md:text-base font-semibold text-white/90 mt-2 mb-1">
                  {stat.label}
                </p>

                {/* Sous-titre */}
                <p className="text-xs text-gray-400 leading-snug">
                  {stat.sub}
                </p>

                {/* Détail au survol (desktop) */}
                <p className="hidden md:block text-xs text-ocean-teal/70 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Lien discret vers la page missions */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_IN_UP}
            className="text-center mt-10"
          >
            <Link
              to="/depollution-marine"
              className="inline-flex items-center gap-2 text-sm text-ocean-teal/80 hover:text-ocean-teal transition-colors duration-200"
            >
              <span>Voir toutes nos missions Projet Sentinelle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Carte Interactive */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            {/* Image - Gauche */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1">
              <img
                src="/images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises.webp"
                srcSet="/images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises_400w.webp 400w, /images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises_800w.webp 800w, /images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises_1200w.webp 1200w, /images/portfolio/Mer/karim-saari-marseille-grotte-calanque-turquoise-pins-falaises.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Karim Saari photographe Marseille — grotte calanque eau turquoise pins et falaises calcaires"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>

            {/* Contenu - Droite */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2">
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-ocean-teal/10 rounded-full border border-ocean-teal/30 w-fit">
                <MapPin className="w-5 h-5 text-ocean-teal" />
                <span className="text-sm font-semibold text-ocean-teal">Calanques · Côte Bleue · Frioul</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Carte interactive des Calanques de Marseille & du littoral marseillais
              </h2>

              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                Explorez les Calanques de Marseille via une carte interactive présentant paysages, spots de plongée et actions de dépollution menées avec Team Oxygen sur le littoral marseillais.
              </p>

              <Link
                to="/carte-calanques"
                className="btn-primary inline-flex items-center gap-2 w-fit"
              >
                <span>Explorer la carte</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action Section - Card moderne */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
            {/* Contenu - Gauche */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Rejoignez l'Aventure
              </h2>

              {/* Badge nombre de membres */}
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-ocean-teal/10 rounded-full border border-ocean-teal/30 w-fit">
                <Users className="w-5 h-5 text-ocean-teal" />
                <span className="text-xl font-bold text-white">
                  {fbGroupMembers.toLocaleString('fr-FR')}
                </span>
                <span className="text-gray-300">membres</span>
              </div>

              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                Amoureux des Calanques de Marseille à Port-Cros ? Rejoignez notre communauté pour suivre nos actions et participer à la protection de la Méditerranée.
              </p>

              <Link
                to="/communaute-calanques"
                className="btn-primary inline-flex items-center gap-2 w-fit"
                onClick={() => trackEvent('cta_click', { button_name: 'Rejoindre le Groupe Facebook' })}
              >
                <span>Rejoindre le Groupe Facebook</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Image du groupe Facebook - Droite */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1 md:order-2">
              <img
                src="/images/groupe%20des%20amoureux%20des%20calanques.webp"
                srcSet="/images/groupe%20des%20amoureux%20des%20calanques_400w.webp 400w, /images/groupe%20des%20amoureux%20des%20calanques_800w.webp 800w, /images/groupe%20des%20amoureux%20des%20calanques_1200w.webp 1200w, /images/groupe%20des%20amoureux%20des%20calanques.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Groupe Facebook Amoureux des Calanques de Marseille à Port-Cros"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '12% 25%' }}
                loading="lazy"
                decoding="async"
              />
              {/* Overlay subtil */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Derniers articles du blog — maillage interne + contenu frais */}
      <Suspense fallback={<section className="container-custom py-8 md:py-12" />}>
        <RecentArticles title="Derniers articles" count={3} />
      </Suspense>

      {/* Card Yann Arthus-Bertrand — Les Français */}
      <section className="container-custom py-8 md:py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            {/* Photo YAB - Gauche */}
            <div className="relative h-64 md:h-auto min-h-[400px] order-1">
              <img
                src="/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp"
                srcSet="/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_400w.webp 400w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_800w.webp 800w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_1200w.webp 1200w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Team Oxygen photographié par Yann Arthus-Bertrand — projet Les Français, Marseille 2024"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
                loading="lazy"
                decoding="async"
                width="1365"
                height="910"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              {/* Copyright watermark */}
              <p className="absolute bottom-3 right-3 text-white/40 text-xs font-medium">
                © Yann Arthus-Bertrand
              </p>
            </div>

            {/* Contenu - Droite */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2">

              {/* Badge photographe */}
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-ocean-teal/10 rounded-full border border-ocean-teal/30 w-fit">
                <Camera className="w-5 h-5 text-ocean-teal" />
                <span className="text-sm font-semibold text-ocean-teal">
                  Les Français — Yann Arthus-Bertrand
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Photographiés par Yann Arthus-Bertrand
              </h2>

              <p className="text-gray-300 text-lg mb-8 leading-[1.8]">
                Team Oxygen et Dark Massilia ont été sélectionnés par Yann Arthus-Bertrand pour son projet <strong className="text-white">« Les Français »</strong> — une galerie photographique portrait de celles et ceux qui font la France, à Marseille en 2024.
              </p>

              <Link
                to="/les-francais-yann-arthus-bertrand"
                className="btn-primary inline-flex items-center gap-2 w-fit"
              >
                <span>Voir le projet</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section FAQ — rich results FAQPage + contenu statique pour crawlers */}
      <section className="container-custom pb-12 md:pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl border border-white/10 p-8 md:p-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Questions Fréquentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem key={index} question={item.q} answer={item.a} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section éditoriale SEO — contexte Méditerranée (après FAQ) */}
      <section className="container-custom pb-12 md:pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10"
        >
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            {/* Image — Gauche */}
            <div className="relative h-64 md:h-auto min-h-[400px]">
              <img
                src="/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-huveaune.webp"
                srcSet="/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-huveaune_400w.webp 400w, /images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-huveaune_800w.webp 800w, /images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-huveaune_1200w.webp 1200w, /images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-huveaune.webp 1920w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Pollution plastique dans l'Huveaune à Marseille - Projet Sentinelle Dark Massilia"
                width="1200"
                height="800"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
            </div>

            {/* Contenu — Droite */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                La Méditerranée : Un écosystème en péril
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                Bien qu'elle ne représente que 1&nbsp;% des eaux mondiales, la mer Méditerranée concentre{' '}
                <strong className="text-white">7&nbsp;% de tous les microplastiques de la planète</strong>.
                Mer semi-fermée, le renouvellement de ses eaux prend environ 90&nbsp;ans — emprisonnant
                durablement les déchets. À Marseille et dans le monde, plus de{' '}
                <strong className="text-white">600 espèces marines</strong> sont impactées
                par l'ingestion de plastique ou l'enchevêtrement.
                À travers mes images et mon engagement en apnée dans les Calanques, je documente cette
                urgence pour rendre l'invisible, visible.
              </p>
              <div className="mt-6">
                <Link
                  to="/donnees-scientifiques"
                  className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
                >
                  Consulter les sources scientifiques
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
