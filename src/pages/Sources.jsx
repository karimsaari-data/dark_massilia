import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Globe, FileText } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';

const Sources = () => {
  const sources = [
    {
      category: "Données Globales et Flux",
      icon: Globe,
      image: "/images/portfolio/44.webp", // Image illustrative
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
      image: "/images/portfolio/27.webp",
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
      image: "/images/portfolio/23.webp",
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
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mb-16 text-center"
        >
          <motion.h1
            variants={FADE_IN_UP}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-ocean-teal to-blue-400 bg-clip-text text-transparent"
          >
            Sources Documentaires
          </motion.h1>
          <motion.p
            variants={FADE_IN_UP}
            className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
          >
            Références scientifiques et études sur la pollution plastique en Méditerranée et dans les océans.
            Toutes les données utilisées sur ce site proviennent de sources vérifiées et reconnues.
          </motion.p>
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
                {/* Category Header with Image */}
                <div className="grid md:grid-cols-[1fr_300px] gap-0">
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

                  {/* Image */}
                  <motion.div
                    variants={FADE_IN_UP}
                    className="relative h-64 md:h-full order-first md:order-last"
                  >
                    <img
                      src={section.image}
                      alt={`Illustration ${section.category}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background-primary/80 to-transparent md:from-transparent md:to-background-primary/80" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="mt-16 glass-strong rounded-2xl p-8 border border-ocean-teal/20 text-center"
        >
          <p className="text-gray-300 leading-relaxed">
            Ces sources constituent la base scientifique de notre action. Elles démontrent l'urgence d'agir
            pour la préservation de la Méditerranée et de ses écosystèmes marins. Les données présentées sur
            ce site sont issues de publications scientifiques peer-reviewed et de rapports d'organisations
            internationales reconnues.
          </p>
          <p className="text-ocean-teal font-semibold mt-4">
            Dernière mise à jour : Février 2025
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Sources;
