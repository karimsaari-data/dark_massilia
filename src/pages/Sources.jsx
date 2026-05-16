import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Globe, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import VideoPlayer from '../components/media/VideoPlayer';
import Breadcrumb from '../components/Breadcrumb';

const RecentArticles = lazy(() => import('../components/RecentArticles'));

const Sources = () => {
  const sources = [
    {
      category: "Données Globales et Flux",
      icon: Globe,
      image: "/images/Marseille-dark-massilia-plastique-polluttion-projet-sentinelle-huveaune.webp",
      references: [
        {
          authors: "Jambeck, J. R., et al.",
          year: "2015",
          title: "Plastic waste inputs from land into the ocean",
          journal: "Science",
          links: [
            {
              label: "PubMed",
              url: "https://pubmed.ncbi.nlm.nih.gov/25678662/"
            },
            {
              label: "PDF SPREP",
              url: "https://png-data.sprep.org/system/files/Science_Plastics_Jambeck_2015.pdf"
            }
          ]
        },
        {
          authors: "Wilcox, C., et al.",
          year: "2015",
          title: "Threat of plastic pollution to seabirds is global, pervasive, and increasing",
          journal: "PNAS",
          links: [
            {
              label: "PNAS",
              url: "https://www.pnas.org/doi/10.1073/pnas.1502108112"
            },
            {
              label: "PubMed",
              url: "https://pubmed.ncbi.nlm.nih.gov/26324886/"
            }
          ]
        },
        {
          authors: "NOAA Marine Debris Program",
          year: "",
          title: "The Mystery: How Long Until It's Gone?",
          journal: "Dégradation et persistance des déchets marins",
          links: [
            {
              label: "NOAA",
              url: "https://marinedebris.noaa.gov/discover-marine-debris/mystery-how-long-until-it-s-gone"
            }
          ]
        }
      ]
    },
    {
      category: "Méditerranée : Concentrations et Impacts",
      icon: FileText,
      image: "/images/portfolio/Mer/photographe-sous-marin-marseille-depollution-posidonie-apnee-projet-sentinelle.webp",
      references: [
        {
          authors: "Cózar, A., et al.",
          year: "2015",
          title: "Plastic Accumulation in the Mediterranean Sea",
          journal: "PLoS ONE",
          links: [
            {
              label: "Article complet",
              url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0121762"
            }
          ]
        },
        {
          authors: "IUCN",
          year: "2020",
          title: "The Mediterranean: Mare Plasticum",
          journal: "Rapport sur les 7% de microplastiques mondiaux",
          links: [
            {
              label: "PDF IUCN",
              url: "https://portals.iucn.org/library/sites/library/files/documents/2020-030-en.pdf"
            },
            {
              label: "IUCN Mediterranean",
              url: "https://iucn.org/our-work/region/mediterranean/our-work/marine-biodiversity-and-blue-economy/plastics-mediterranean"
            }
          ]
        },
        {
          authors: "WWF",
          year: "2018",
          title: "Out of the Plastic Trap: Saving the Mediterranean from plastic pollution",
          journal: "Données sur les 95% de plastique flottant",
          links: [
            {
              label: "Rapport PDF",
              url: "https://www.wwf.nl/globalassets/pdf/rapport-plastic-vervuiling-middellandse-zee-2018.pdf"
            },
            {
              label: "WWF EU",
              url: "https://www.wwf.eu/?329100/Plastic-pollution-in-Mediterranean-Sea-threatens-the-health-of-our-ocean"
            }
          ]
        },
        {
          authors: "Suaria, G., et al.",
          year: "2016",
          title: "The Mediterranean Plastic Soup",
          journal: "VLIZ Marine Sciences",
          links: [
            {
              label: "PDF",
              url: "https://www.vliz.be/imisdocs/publications/ocrd/350464.pdf"
            }
          ]
        }
      ]
    },
    {
      category: "Focus Local : Marseille et Calanques",
      icon: BookOpen,
      image: "/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-vélo-métropole.webp",
      references: [
        {
          authors: "Association MerTerre",
          year: "2023",
          title: "Bilan Calanques Propres 2023",
          journal: "Collecte et analyse des déchets littoraux",
          links: [
            {
              label: "Bilan PDF",
              url: "https://mer-terre.org/wp-content/uploads/2023/11/Bilan-Calanques-Propres-2023.pdf"
            }
          ]
        },
        {
          authors: "Parc National des Calanques",
          year: "2022",
          title: "Rapport d'activité 2022",
          journal: "Protection et préservation des Calanques",
          links: [
            {
              label: "Rapport PDF",
              url: "https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/documents/downloads/rapport_dactivite_2022.pdf"
            }
          ]
        },
        {
          authors: "Citeo & Métropole Aix-Marseille-Provence",
          year: "",
          title: "Marseille : Actions pour une meilleure gestion des déchets",
          journal: "Gestion des déchets littoraux",
          links: [
            {
              label: "Article Citeo",
              url: "https://www.citeo.com/le-mag/marseille-la-cite-redynamise-les-actions-pour-une-meilleure-gestion-des-dechets-et-preserver/"
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/donnees-scientifiques']} />
      <div className="container-custom">
        <Breadcrumb label="Données Scientifiques" />
        {/* H1 SEO — visible, keyword-rich */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4 leading-tight"
        >
          Sources Scientifiques —
          <span className="block text-xl md:text-2xl font-medium text-ocean-teal mt-3">
            Pollution Plastique en Méditerranée & espèces invasives
          </span>
        </motion.h1>
        <p className="text-center text-xs text-gray-500 mb-10">
          Mis à jour le <time dateTime="2026-03-19">19 mars 2026</time>
        </p>

        {/* Section éditoriale SEO — chiffres de l'urgence */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Les chiffres de l'urgence environnementale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-text-secondary leading-[1.8] text-lg">
              <div className="space-y-4">
                <p>
                  Notre action de terrain repose sur des données scientifiques solides et convergentes.
                  Chaque année, environ <strong className="text-white">570&nbsp;000 tonnes de plastique</strong> sont
                  déversées en Méditerranée, soit l'équivalent de <strong className="text-white">33&nbsp;800 bouteilles par minute</strong>.
                  Mer semi-fermée représentant moins de 1&nbsp;% de la surface océanique mondiale, la Méditerranée
                  concentre près de <strong className="text-white">7&nbsp;% des microplastiques marins</strong>.
                </p>
                <p>
                  Ces plastiques se fragmentent en micro- et nanoplastiques persistants, intégrés à la colonne
                  d'eau, aux sédiments et aux chaînes trophiques. Ils constituent également un support biologique&nbsp;:
                  la <em className="text-white">plastisphère</em>, écosystème microbien colonisant les débris flottants,
                  favorise la dispersion d'agents pathogènes et d'espèces exotiques.
                </p>
                <p>
                  Parallèlement, la Méditerranée subit une pression croissante liée aux <strong className="text-white">espèces invasives</strong>.
                  Plus de <strong className="text-white">1&nbsp;000 espèces non indigènes</strong> y ont été recensées,
                  introduites principalement via le transport maritime et le canal de Suez.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Parmi elles, <em className="text-ocean-teal">Rugulopteryx okamurae</em>, algue brune originaire du
                  Pacifique nord-ouest, connaît depuis 2015 une expansion rapide en Méditerranée occidentale. Elle
                  colonise les fonds rocheux jusqu'à 30 mètres de profondeur, forme des tapis denses, modifie les
                  habitats benthiques et entre en compétition avec les espèces locales. Son accumulation massive sur
                  les côtes perturbe également les écosystèmes littoraux et les usages humains.
                </p>
                <p>
                  Pollution plastique et invasions biologiques sont liées&nbsp;: les déchets flottants facilitent le
                  transport d'organismes exotiques, tandis que le réchauffement climatique accroît leur capacité
                  d'implantation.
                </p>
                <p className="text-white font-medium border-l-2 border-ocean-teal pl-4">
                  Face à ces dynamiques combinées — pollution, artificialisation du littoral, surpêche,
                  réchauffement — la Méditerranée devient un laboratoire avancé des déséquilibres globaux.
                  Documenter, alerter et agir ne relève plus du militantisme, mais de la nécessité écologique.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Categories */}
        <div className="space-y-16">
          {sources.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.category}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={STAGGER_CONTAINER}
                className="glass-strong rounded-3xl overflow-hidden border border-white/10"
              >
                {/* Image pleine largeur en haut */}
                <motion.div variants={FADE_IN_UP} className="relative h-80 md:h-96 overflow-hidden">
                  <img
                    src={section.image}
                    alt={`Illustration ${section.category}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-primary/90" />
                </motion.div>

                {/* Contenu */}
                <div className="p-8 md:p-10">
                  <motion.div variants={FADE_IN_UP} className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-teal to-blue-500 flex items-center justify-center shadow-lg shadow-ocean-teal/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {section.category}
                    </h2>
                  </motion.div>

                  {/* References List */}
                  <div className="space-y-6">
                    {section.references.map((ref, refIndex) => (
                      <motion.div
                        key={refIndex}
                        variants={FADE_IN_UP}
                        whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                        className="glass rounded-2xl p-6 border border-white/5 hover:border-ocean-teal/30 transition-all duration-300"
                      >
                        <div className="mb-3">
                          <p className="text-ocean-teal font-semibold text-sm mb-1">
                            {ref.authors} {ref.year && `(${ref.year})`}
                          </p>
                          <h3 className="text-white font-semibold text-lg mb-1">
                            {ref.title}
                          </h3>
                          <p className="text-gray-400 text-sm italic">
                            {ref.journal}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                          {ref.links.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocean-teal/10 border border-ocean-teal/30 text-ocean-teal hover:bg-ocean-teal/20 hover:border-ocean-teal hover:scale-105 transition-all duration-200 text-sm font-medium"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bloc Rugulopteryx okamurae */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden border border-white/10 mt-16"
        >
          {/* Header */}
          <div className="p-8 md:p-10 border-b border-white/10">
            <motion.div variants={FADE_IN_UP} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                L'invasion de l'algue <em className="text-ocean-teal not-italic">Rugulopteryx okamurae</em> dans les Calanques
              </h2>
            </motion.div>
          </div>

          <div className="p-8 md:p-10 space-y-8">
            {/* Description */}
            <motion.div variants={FADE_IN_UP} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-text-secondary leading-[1.8] text-lg">
              <div className="space-y-4">
                <p>
                  Le Parc national des Calanques à Marseille fait face à une crise biologique sans précédent : la prolifération foudroyante d'une macroalgue brune exotique originaire d'Asie, <em className="text-white">Rugulopteryx okamurae</em>.
                </p>
                <div className="flex gap-3">
                  <span className="text-ocean-teal font-bold shrink-0 mt-1">▸</span>
                  <span><strong className="text-white">Une colonisation éclair :</strong> Introduite accidentellement via le commerce des produits de la mer, cette algue a rapidement tapissé plus de 9,5 km de côtes dans le parc depuis 2018. Elle domine aujourd'hui massivement les fonds rocheux entre 0 et 20 mètres de profondeur, y compris dans les zones de protection stricte où tout prélèvement est interdit.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-ocean-teal font-bold shrink-0 mt-1">▸</span>
                  <span><strong className="text-white">Un désastre écologique :</strong> En formant d'épais tapis continus, elle monopolise l'espace, étouffe la flore locale et provoque le déclin des invertébrés benthiques. Cette altération profonde des habitats menace les herbiers, les récifs coralligènes et toute la chaîne alimentaire locale.</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-ocean-teal font-bold shrink-0 mt-1">▸</span>
                  <span><strong className="text-white">Des impacts socio-économiques et sanitaires lourds :</strong> Les fragments d'algues s'accrochent massivement dans les filets, paralysant l'activité des pêcheurs artisans. Sur le littoral, les énormes quantités d'algues qui s'échouent (notamment à la calanque de Callelongue) dégagent en pourrissant des gaz toxiques (H₂S), générant de graves nuisances olfactives et des risques pour la santé publique.</span>
                </div>
                <p>
                  Cette invasion foudroyante complexifie grandement la gestion du Parc national, dont les écosystèmes marins sont par ailleurs déjà fortement mis à l'épreuve par le réchauffement climatique et une fréquentation touristique massive.
                </p>
              </div>
            </motion.div>

            {/* Avant / Après */}
            <motion.div variants={FADE_IN_UP}>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                {/* Colonne Avant */}
                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30">
                    <span className="text-blue-300 font-bold text-sm md:text-base tracking-widest uppercase">Avant</span>
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[4/3]">
                    <img
                      src="/images/marseille-marseilleveyre-avant-rugulopteryx-fonds-marins.webp"
                      alt="Marseilleveyre avant l'invasion de Rugulopteryx okamurae — fonds rocheux naturels"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[4/3]">
                    <img
                      src="/images/marseille-marseilleveyre-avant-rugulopteryx-biodiversite-2.webp"
                      alt="Marseilleveyre avant l'invasion de Rugulopteryx okamurae — biodiversité locale"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                {/* Colonne Après */}
                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/20 border border-red-400/30">
                    <span className="text-red-300 font-bold text-sm md:text-base tracking-widest uppercase">Après</span>
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[4/3]">
                    <img
                      src="/images/marseille-marseilleveyre-apres-rugulopteryx-algue-invasive.webp"
                      alt="Marseilleveyre après l'invasion de Rugulopteryx okamurae — fonds recouverts par l'algue"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[4/3]">
                    <img
                      src="/images/marseille-marseilleveyre-apres-rugulopteryx-tapis-algues-2.webp"
                      alt="Marseilleveyre après l'invasion de Rugulopteryx okamurae — tapis d'algues invasives"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Références */}
            <motion.div variants={FADE_IN_UP} className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3">
                Pour aller plus loin — 4 références scientifiques
              </h3>
              <div className="space-y-4">
                {[
                  {
                    num: "1",
                    title: "Rapid Spread of the Invasive Brown Alga Rugulopteryx okamurae in a National Park in Provence",
                    journal: "MDPI, 2021 — première apparition et étendue de l'invasion dans le Parc des Calanques",
                    url: "https://www.mdpi.com/2073-4441/13/16/2306",
                    label: "MDPI"
                  },
                  {
                    num: "2",
                    title: "Impact of the invasive brown alga Rugulopteryx okamurae on the benthic communities in the Northwestern Mediterranean Sea",
                    journal: "ResearchGate, 2024 — conséquences écologiques locales sur le littoral de Marseille",
                    url: "https://www.researchgate.net/publication/385389989_Impact_of_the_invasive_brown_alga_Rugulopteryx_okamurae_on_the_benthic_communities_in_the_Northwestern_Mediterranean_Sea",
                    label: "ResearchGate"
                  },
                  {
                    num: "3",
                    title: "Diagnostic de territoire du Parc national des Calanques",
                    journal: "Parc national des Calanques, 2024 — état des milieux naturels et pression des espèces envahissantes",
                    url: "https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/2024-08/Diagnostic%20de%20territoire%2C%20pr%C3%A9alable%20%C3%A0%20l%E2%80%99%C3%A9valuation.pdf",
                    label: "PDF Officiel"
                  },
                  {
                    num: "4",
                    title: "Rapport d'activité 2022 du Parc national des Calanques",
                    journal: "Parc national des Calanques — actions de protection, surveillance scientifique et gestion",
                    url: "https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/documents/downloads/rapport_dactivite_2022.pdf",
                    label: "Rapport PDF"
                  }
                ].map((ref) => (
                  <div
                    key={ref.num}
                    className="glass rounded-2xl p-6 border border-white/5 hover:border-ocean-teal/30 transition-all duration-300"
                  >
                    <div className="mb-3">
                      <p className="text-ocean-teal font-semibold text-sm mb-1">
                        Référence {ref.num}
                      </p>
                      <h4 className="text-white font-semibold text-base mb-1">{ref.title}</h4>
                      <p className="text-gray-400 text-sm italic">{ref.journal}</p>
                    </div>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 bg-ocean-teal/10 border border-ocean-teal/30 text-ocean-teal hover:bg-ocean-teal/20 hover:border-ocean-teal"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {ref.label}
                    </a>
                  </div>
                ))}
              </div>

              {/* Documentaire vidéo */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3 mb-4">
                  🎬 Documentaire — Marseille sous les algues
                </h3>
                <p className="text-gray-400 text-sm italic mb-4">
                  L'invasion de la Rugulopteryx okamurae vue depuis les Calanques
                </p>
                <VideoPlayer
                  media={{
                    type: 'youtube',
                    url: 'https://www.youtube.com/watch?v=PHP4AYpCEUk',
                    embed_id: 'PHP4AYpCEUk',
                    title: 'Marseille sous les algues',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Description — bas de page */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mt-16"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Les Références Scientifiques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-text-secondary leading-[1.8] text-lg">
              <div className="space-y-4">
                <p>
                  Chaque donnée présentée sur ce site, qu'elle concerne la pollution plastique, la{' '}
                  <em className="text-white">plastisphère</em> ou les espèces invasives comme{' '}
                  <em className="text-ocean-teal">Rugulopteryx okamurae</em>, s'appuie sur des publications
                  scientifiques vérifiées.
                </p>
                <p>
                  Cette page regroupe les études qui documentent l'état réel des écosystèmes méditerranéens&nbsp;:
                  concentration de macro- et microplastiques, impacts écotoxicologiques, dynamiques d'introduction
                  d'espèces exotiques, modifications des habitats benthiques et interactions avec le réchauffement
                  climatique.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Les sources citées proviennent de revues à comité de lecture (
                  <em>Science</em>, <em>Nature</em>, <em>PNAS</em>, <em>Marine Pollution Bulletin</em>,{' '}
                  <em>Frontiers in Marine Science</em>), d'organismes internationaux (WWF, PNUE, FAO, Commission
                  européenne), ainsi que de travaux académiques et institutionnels spécifiquement consacrés à la
                  Méditerranée et au littoral marseillais.
                </p>
                <p className="text-white font-medium border-l-2 border-ocean-teal pl-4">
                  L'objectif est double&nbsp;: garantir la traçabilité des informations diffusées et fonder
                  l'action de terrain sur un socle scientifique robuste. Découvrez comment ces données guident
                  nos opérations concrètes sur nos{' '}
                  <Link to="/depollution-marine" className="text-ocean-teal hover:text-white transition-colors">
                    missions de dépollution marine
                  </Link>, et explorez leur réalité visuelle dans la{' '}
                  <Link to="/photographie-sous-marine" className="text-ocean-teal hover:text-white transition-colors">
                    galerie de photographies sous-marines des Calanques
                  </Link>.
                </p>
              </div>
            </div>
            {/* Articles liés — maillage interne */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <Suspense fallback={null}>
                <RecentArticles title="Articles sur ce thème" count={3} />
              </Suspense>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-white/8">
              <Link
                to="/sauver-marseille-documentaire-arte"
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>Documentaire ARTE</span>
                <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
              </Link>
              <Link
                to="/videos"
                className="btn-secondary inline-flex items-center gap-2 group"
              >
                <span>Voir nos vidéos</span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default Sources;
