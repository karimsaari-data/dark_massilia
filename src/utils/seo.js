// ============================================================
// SEO CONFIG — Dark Massilia · karimsaari.com
// Mapping centralisé : route → title + description + canonical + schema
// Utilise le hoisting natif React 19 (pas de librairie tierce)
// ============================================================

const BASE_URL = 'https://karimsaari.com';
const DEFAULT_IMAGE = `${BASE_URL}/assets/og-social-card.jpg`;
const SITE_NAME = 'Karim Saari';
const TWITTER_HANDLE = '@dark_massilia';

export const DEFAULT_SEO = {
  title: 'Dark Massilia · Karim Saari · Sentinelle des Calanques',
  description:
    'Karim Saari, photographe environnemental et sous-marin marseillais, documente et nettoie les fonds marins des Calanques.',
  canonical: BASE_URL,
  image: DEFAULT_IMAGE,
  siteName: SITE_NAME,
  twitterHandle: TWITTER_HANDLE,
};

// ── Schéma Person — Karim Saari (ancre unique, réutilisé sur / et /presse) ──
const PERSON_SCHEMA = {
  '@type': 'Person',
  '@id': 'https://karimsaari.com/#person',
  name: 'Karim Saari',
  alternateName: 'Dark Massilia',
  url: 'https://karimsaari.com',
  image: DEFAULT_IMAGE,
  jobTitle: 'Photographe Environnemental & Sous-Marin — Sentinelle des Calanques',
  description:
    'Photographe environnemental et sous-marin à Marseille. Fondateur de Dark Massilia, communauté de 130 000 personnes engagées pour les Calanques. Sentinelle des fonds marins méditerranéens. Vu sur TF1, ARTE et M6.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Marseille',
    addressRegion: 'Bouches-du-Rhône',
    addressCountry: 'FR',
  },
  sameAs: [
    'https://www.instagram.com/karimsaari',
    'https://twitter.com/dark_massilia',
    'https://www.tiktok.com/@dark.massilia',
    'https://www.youtube.com/@dark.massilia',
    'https://www.youtube.com/watch?v=cxjAQtSHHyI',
    'https://www.youtube.com/watch?v=BoqO1LVcx5A',
    'https://www.dailymotion.com/video/x8wzsm2',
    'https://www.facebook.com/EcoPlongeur/',
    'https://www.facebook.com/Photographie.Marseille',
    'https://www.facebook.com/groups/calanque/',
    'https://www.linkedin.com/in/karimsaari/',
    'https://500px.com/p/karimsaari?view=photos',
    'https://fr.pinterest.com/Photographie_Marseille/',
    'https://www.google.com/maps/contrib/114953930403565163435',
    'https://maps.app.goo.gl/UaF5o6sM2xS5Gaxr6',
    'https://share.google/VAnA0t89Jy0AaR0zC',
    'https://www.tf1info.fr/environnement-ecologie/video-greve-des-eboueurs-a-marseille-des-craintes-pour-l-environnement-2208213.html',
    'https://www.tf1info.fr/environnement-ecologie/video-le-scandale-des-decharges-sauvages-dans-les-calanques-marseillaises-2258525.html',
    'https://www.laprovence.com/video/marseille-14-tonne-de-dechets-sortie-des-eaux-du-frioul-par-des-apneistes/14871',
    'https://www.laprovence.com/article/region/1865431/le-vieux-port-de-marseille-nettoye-par-des-apneistes',
    'https://www.midilibre.fr/2024/04/02/une-maree-bleue-pourquoi-des-milliers-de-meduses-recouvrent-elles-le-littoral-a-marseille-11865324.php',
    'https://www.zero-dechet-sauvage.org/structures/dark-massilia',
    'https://www.wikidata.org/wiki/Q138808583',
    'https://commons.wikimedia.org/wiki/User:Karim_saari',
    'https://commons.wikimedia.org/wiki/User:Dark_massilia',
    'https://fr.wikipedia.org/wiki/Projet_Sentinelle',
    'https://www.france.tv/france-5/echappees-belles/saison-18/5875509-speciale-echappee-verte-les-bouches-du-rhone-en-action.html',
  ],
  knowsAbout: [
    'Protection de l\'environnement',
    'Photographie environnementale',
    'Photographie sous-marine',
    'Dépollution marine',
    'Calanques de Marseille',
    'Parc National des Calanques',
    'Apnée',
    'Freediving',
    'Pollution plastique',
    'Projet Sentinelle',
    'Méditerranée',
    'Faune marine méditerranéenne',
  ],
  hasOccupation: [
    {
      '@type': 'Occupation',
      name: 'Photographe Environnemental & Sous-Marin',
      description: 'Documentation photographique des fonds marins des Calanques de Marseille, des missions de dépollution du Projet Sentinelle et de la faune méditerranéenne.',
      occupationLocation: {
        '@type': 'City',
        name: 'Marseille',
        sameAs: 'https://www.wikidata.org/wiki/Q23482',
      },
      skills: 'Photographie sous-marine, Apnée, Freediving, Photographie de paysages, Photographie environnementale',
    },
    {
      '@type': 'Occupation',
      name: 'Militant Écologique & Apnéiste',
      description: 'Fondateur de Dark Massilia et président de Team Oxygen — organisation de missions de dépollution sous-marine dans les Calanques de Marseille, le Frioul, la Côte Bleue et La Ciotat.',
      occupationLocation: {
        '@type': 'City',
        name: 'Marseille',
        sameAs: 'https://www.wikidata.org/wiki/Q23482',
      },
      skills: 'Dépollution marine, Sensibilisation environnementale, Organisation de missions bénévoles, Apnée technique',
    },
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Team Oxygen',
    url: 'https://www.team-oxygen.com/',
    description: 'Association de dépollution sous-marine des Calanques de Marseille',
  },
  memberOf: {
    '@type': 'Organization',
    name: 'Team Oxygen',
    url: 'https://www.team-oxygen.com/',
  },
  owns: [
    {
      '@type': 'Organization',
      name: 'Dark Massilia',
      url: 'https://karimsaari.com',
    },
    {
      '@type': 'Organization',
      name: 'Groupe des Amoureux des Calanques de Marseille à Port-Cros',
      url: 'https://www.facebook.com/groups/calanque/',
    },
  ],
  sponsor: [
    { '@type': 'GovernmentOrganization', name: 'Parc national des Calanques' },
    { '@type': 'Organization', name: 'Fondation de la Mer' },
    { '@type': 'Organization', name: 'Citeo' },
    { '@type': 'GovernmentOrganization', name: 'Ville de Marseille' },
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Google Street View Trusted',
      credentialCategory: 'certification',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Google',
        url: 'https://www.google.com',
      },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Google Local Guides — Niveau 10',
      credentialCategory: 'badge',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Google Maps',
        url: 'https://maps.google.com',
      },
    },
  ],
};

// ── Helper : BreadcrumbList Schema.org ──────────────────────
const breadcrumb = (name, path) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name, item: `${BASE_URL}${path}` },
  ],
});

export const SEO_PAGES = {
  '/': {
    title: 'Photographe Marseille & Calanques — Karim Saari',
    description:
      "Karim Saari, photographe et Sentinelle des Calanques de Marseille. Découvrez mes clichés sous-marins et mon engagement pour protéger la Méditerranée.",
    keywords: 'karim saari, dark massilia, photographe environnemental marseille, sentinelle calanques, dépollution marine, projet sentinelle',
    canonical: `${BASE_URL}/`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        PERSON_SCHEMA,
        {
          '@type': 'LocalBusiness',
          additionalType: 'https://schema.org/ProfessionalService',
          '@id': `${BASE_URL}/#business`,
          name: 'Karim Saari — Photographe Environnemental & Sous-Marin Marseille',
          url: `${BASE_URL}/`,
          email: 'contact@karimsaari.com',
          telephone: '+33695331301',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '168 CHE DE MORGIOU',
            addressLocality: 'MARSEILLE',
            postalCode: '13009',
            addressCountry: 'FR',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 43.2965,
            longitude: 5.3698,
          },
          hasMap: 'https://maps.app.goo.gl/UaF5o6sM2xS5Gaxr6',
          sameAs: [
            'https://maps.app.goo.gl/UaF5o6sM2xS5Gaxr6',
            'https://share.google/VAnA0t89Jy0AaR0zC',
            'https://www.instagram.com/karimsaari',
            'https://www.facebook.com/EcoPlongeur/',
            'https://www.facebook.com/groups/calanque/',
            'https://www.tiktok.com/@dark.massilia',
            'https://www.youtube.com/@dark.massilia',
            'https://www.team-oxygen.com/',
          ],
          founder: {
            '@type': 'Person',
            name: 'Karim Saari',
            url: `${BASE_URL}/`,
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: "Qu'est-ce que le Projet Sentinelle ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Le Projet Sentinelle est l'opération annuelle structurante menée par Team Oxygen pour la protection de la Méditerranée. Tout au long de l'année, des actions de veille, de sensibilisation et d'interventions ponctuelles sont organisées sur le littoral marseillais. Chaque automne, le dispositif prend une dimension intensive : une semaine complète de dépollution sous-marine en apnée dans les Calanques de Marseille. Les équipes interviennent entre 0 et 20 mètres de profondeur, avec des sessions quotidiennes de 5 à 6 heures dans l'eau.",
              },
            },
            {
              '@type': 'Question',
              name: "Combien de déchets a collecté le Projet Sentinelle ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "En 4 éditions (2022–2025), le Projet Sentinelle et Team Oxygen ont collecté plus de 5 724 kg de déchets marins : 900 kg sur la Côte Bleue (2022), 1 357 kg à l'Archipel du Frioul (2023), 1 147 kg dans le Parc National des Calanques (2024) et 2 320 kg dans la Rade de Marseille (2025).",
              },
            },
            {
              '@type': 'Question',
              name: "Comment participer aux missions de dépollution des Calanques ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Pour participer aux missions de dépollution organisées dans les Calanques de Marseille, vous pouvez contacter Team Oxygen via la page Contact du site karimsaari.com ou rejoindre la communauté à travers le groupe Facebook « Amoureux des Calanques ». Les immersions en apnée nécessitent des compétences techniques et une pratique encadrée. Nous recherchons principalement des bénévoles pour l'appui logistique terrestre (tri, pesée, gestion du matériel, sensibilisation) ainsi que des kayakistes pour l'assistance en surface.",
              },
            },
            {
              '@type': 'Question',
              name: "Pourquoi la mer Méditerranée est-elle l'une des mers les plus polluées au monde par le plastique ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "La Méditerranée agit comme un véritable « piège à plastique » : c'est une mer semi-fermée dont les eaux mettent environ 90 ans à se renouveler. Ses côtes sont densément peuplées (150 millions d'habitants), le trafic maritime y est très intense (30 % du trafic mondial) et elle subit une pression touristique massive. Bien qu'elle ne représente que 1 % de la surface océanique mondiale, elle concentre 7 % de tous les microplastiques de la planète.",
              },
            },
            {
              '@type': 'Question',
              name: "Quelle quantité de plastique est déversée dans la Méditerranée chaque jour ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "On estime qu'entre 700 et 1 400 tonnes de plastique sont déversées chaque jour dans la mer Méditerranée, soit l'équivalent de 33 800 bouteilles en plastique jetées à la mer chaque minute. Au total, plus d'un million de tonnes de plastique se trouvent déjà dans le bassin méditerranéen.",
              },
            },
            {
              '@type': 'Question',
              name: "D'où proviennent ces déchets plastiques ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Environ 80 % des déchets marins proviennent d'activités terrestres : fleuves (Rhône, Pô, Nil), ruissellement urbain et abandons sur les littoraux. Les 20 % restants proviennent des activités maritimes telles que la pêche, l'aquaculture et le transport maritime.",
              },
            },
            {
              '@type': 'Question',
              name: "Quels sont les déchets que l'on retrouve le plus souvent en mer et sur les plages ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Le plastique représente 95 % des déchets marins en Méditerranée. Les objets les plus fréquemment retrouvés sont les emballages alimentaires, les bouteilles, les bouchons, les sacs et les équipements de pêche. Les mégots de cigarette (dont le filtre contient du plastique) constituent également une part très importante des déchets collectés sur les plages.",
              },
            },
            {
              '@type': 'Question',
              name: "Combien de temps faut-il à un déchet plastique pour se dégrader en mer ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Les plastiques persistent des centaines d'années : un sac plastique met entre 20 et 100 ans à se dégrader, une bouteille environ 450 ans, un fil de pêche jusqu'à 600 ans. La disparition « visuelle » d'un déchet est trompeuse : il se fragmente en millions de microplastiques sous l'effet du soleil et des vagues.",
              },
            },
            {
              '@type': 'Question',
              name: "Qu'est-ce qu'un microplastique et pourquoi est-ce si dangereux ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Les microplastiques sont des fragments de moins de 5 mm issus de la dégradation de déchets plus gros. En Méditerranée, le ratio microplastiques/zooplancton peut atteindre 1 pour 2, entraînant une ingestion massive par les poissons. Ils agissent également comme des éponges, concentrant des polluants chimiques et des perturbateurs endocriniens.",
              },
            },
            {
              '@type': 'Question',
              name: "Le plastique flotte-t-il toujours à la surface de l'eau ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Non : on estime que 94 % du plastique qui entre en mer Méditerranée finit par couler et sédimenter sur les fonds marins. Seuls 5 % se retrouvent sur les plages et 1 % en surface. Une fois au fond, dans l'obscurité et le froid, le plastique ne se dégrade quasiment plus.",
              },
            },
            {
              '@type': 'Question',
              name: "Quel est l'impact de cette pollution sur la faune marine ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Plus de 700 espèces marines sont impactées à l'échelle globale. Toutes les espèces de tortues marines de Méditerranée sont touchées par l'ingestion de plastique. Les grands cétacés avalent des microplastiques en filtrant l'eau, et de nombreux dauphins et oiseaux meurent d'occlusions intestinales ou en s'emmêlant dans des filets fantômes abandonnés.",
              },
            },
            {
              '@type': 'Question',
              name: "La pollution plastique marine a-t-elle des conséquences sur la santé humaine ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Oui : en mangeant des produits de la mer ou via le sel marin, nous absorbons des plastiques. On estime qu'un être humain ingère environ 5 grammes de plastiques par semaine, soit le poids d'une carte de crédit. Ces plastiques libèrent des additifs chimiques qui agissent souvent comme des perturbateurs endocriniens.",
              },
            },
            {
              '@type': 'Question',
              name: "Quel est le rôle du tourisme dans cette pollution ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Le bassin méditerranéen reçoit plus de 200 millions de touristes par an. Cette affluence saisonnière provoque une augmentation de 40 % de la production de déchets en été, saturant les infrastructures locales de gestion des déchets et entraînant l'abandon direct de nombreux déchets sur les côtes.",
              },
            },
            {
              '@type': 'Question',
              name: "Qu'est-ce que la photographie environnementale ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "La photographie environnementale se sert d'images de paysages, de plantes ou d'animaux pour éveiller chez l'observateur le désir d'en protéger l'existence — particulièrement face aux dangers auxquels la nature est confrontée. En Méditerranée, elle devient un outil de témoignage direct : chaque image des calanques de Marseille, de leurs fonds marins ou de la faune locale est une preuve visuelle de l'urgence écologique.",
              },
            },
            {
              '@type': 'Question',
              name: "Quel matériel utilisez-vous pour photographier sous l'eau dans les Calanques ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "La photographie sous-marine dans les Calanques de Marseille se pratique principalement en apnée, ce qui impose des contraintes très différentes de la plongée bouteille : aucune bulle, aucun bruit, une proximité naturelle avec la faune. J'utilise un boîtier étanche monté avec un grand angle pour capter la profondeur des fonds marins et la lumière naturelle de la Méditerranée. La transparence exceptionnelle de l'eau des Calanques — entre 15 et 30 mètres de visibilité — permet d'obtenir des images d'une clarté rare, à la fois pour les paysages sous-marins et pour la documentation des espèces comme les poulpes, les mérous et les posidonies.",
              },
            },
            {
              '@type': 'Question',
              name: "Où voir vos photographies sous-marines des Calanques de Marseille ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Mes photographies sous-marines des Calanques sont accessibles sur ce site dans la galerie dédiée à la photographie sous-marine, qui regroupe plus de 58 clichés pris lors des missions de dépollution du Projet Sentinelle (2022–2025). Vous pouvez également retrouver une sélection de paysages marins et terrestres dans la galerie de photographie de paysages, ainsi que sur mon profil 500px (karimsaari) où mes images cumulent plus de 800 000 impressions.",
              },
            },
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          name: 'Karim Saari — Dark Massilia',
          url: BASE_URL,
          inLanguage: 'fr-FR',
        },
      ],
    },
  },
  '/depollution-marine': {
    title: 'Dépollution Marine Marseille | Karim Saari — Projet Sentinelle',
    description:
      'Team Oxygen, association de dépollution marine à Marseille. Depuis 2022, 5 724 kg de déchets extraits des Calanques en apnée — Opération Sentinelle.',
    keywords: 'dépollution marine marseille, team oxygen, projet sentinelle, nettoyage sous-marin calanques, ramassage déchets mer',
    image: `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp`,
    canonical: `${BASE_URL}/depollution-marine`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Missions de Dépollution Marine', '/depollution-marine'),
        // ── Organisation NGO — signal principal "association dépollution" ──
        {
          '@type': ['Organization', 'NGO'],
          '@id': 'https://www.team-oxygen.com/#organization',
          name: 'Team Oxygen',
          alternateName: 'Association de dépollution marine Marseille',
          url: 'https://www.team-oxygen.com/',
          description:
            'Association loi 1901 de dépollution marine en apnée basée à Marseille. Depuis 2018, Team Oxygen organise des missions de nettoyage sous-marin dans les Calanques, l\'Archipel du Frioul et la Côte Bleue. Plus de 5 700 kg de déchets collectés en 4 éditions du Projet Sentinelle.',
          foundingDate: '2018',
          foundingLocation: {
            '@type': 'Place',
            name: 'Marseille',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Marseille',
              addressRegion: 'Bouches-du-Rhône',
              addressCountry: 'FR',
            },
          },
          areaServed: {
            '@type': 'Place',
            name: 'Littoral méditerranéen — Calanques, Frioul, Côte Bleue, Marseille',
          },
          knowsAbout: [
            'dépollution marine',
            'association dépollution',
            'nettoyage sous-marin',
            'apnée dépollution',
            'dépollution Calanques Marseille',
            'collecte déchets fonds marins',
            'protection Méditerranée',
          ],
          member: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
            jobTitle: 'Photographe Environnemental — Sentinelle des Calanques',
          },
          sameAs: [
            'https://www.instagram.com/karimsaari/',
            'https://www.facebook.com/EcoPlongeur/',
            'https://www.facebook.com/groups/calanque/',
            'https://www.tiktok.com/@dark.massilia',
            'https://www.youtube.com/@dark.massilia',
            'https://fr.wikipedia.org/wiki/Projet_Sentinelle',
          ],
          subjectOf: {
            '@type': 'WebPage',
            url: `${BASE_URL}/depollution-marine/`,
            name: 'Association Dépollution Marine à Marseille | Team Oxygen',
          },
        },
        // ── FAQPage — boite de réponses Google ──
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Qu\'est-ce que Team Oxygen, l\'association de dépollution marine de Marseille ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Team Oxygen est une association loi 1901 de dépollution marine basée à Marseille, fondée en 2018 et présidée par Karim Saari. Elle organise des missions de nettoyage sous-marin en apnée dans les Calanques, l\'Archipel du Frioul et la Côte Bleue. En 4 éditions du Projet Sentinelle (2022–2025), l\'association a collecté plus de 5 724 kg de déchets sur les fonds marins de Méditerranée.',
              },
            },
            {
              '@type': 'Question',
              name: 'Comment rejoindre l\'association de dépollution Team Oxygen à Marseille ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pour rejoindre Team Oxygen et participer aux missions de dépollution, suivez @karimsaari sur Instagram ou rejoignez le groupe Facebook « Amoureux des Calanques ». Les plongées en apnée sont réservées aux membres certifiés ; les bénévoles sans certification peuvent participer en surface (kayak, logistique, tri des déchets). Contactez-nous via karimsaari.com/contact.',
              },
            },
            {
              '@type': 'Question',
              name: 'Où intervient l\'association de dépollution Team Oxygen ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'L\'association de dépollution Team Oxygen intervient sur l\'ensemble du littoral marseillais : Parc National des Calanques (Sormiou, Morgiou, Sugiton, En-Vau), Archipel du Frioul, Côte Bleue (de Martigues à L\'Estaque) et Rade de Marseille. Les équipes opèrent entre 0 et 20 mètres de profondeur en apnée.',
              },
            },
            {
              '@type': 'Question',
              name: 'Combien de déchets l\'association de dépollution a-t-elle collectés ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'En 4 éditions du Projet Sentinelle, l\'association Team Oxygen a collecté plus de 5 724 kg de déchets marins : 900 kg sur la Côte Bleue (2022), 1 357 kg à l\'Archipel du Frioul (2023), 1 147 kg dans le Parc National des Calanques (2024) et 2 320 kg dans la Rade de Marseille (2025).',
              },
            },
          ],
        },
        // ── ImageObjects — documentation visuelle des missions ──
        {
          '@type': 'ImageObject',
          'name': 'Dépollution sous-marine en apnée — Team Oxygen Marseille',
          'contentUrl': `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen-freediving.webp`,
          'description': 'Équipe Team Oxygen en apnée lors d\'une mission de dépollution sous-marine dans les Calanques de Marseille — Projet Sentinelle',
          'caption': 'Équipe Team Oxygen en apnée lors d\'une mission de dépollution sous-marine dans les Calanques de Marseille — Projet Sentinelle',
          'creator': { '@type': 'Person', 'name': 'Karim Saari', 'jobTitle': 'Photographe Environnemental' },
          'encodingFormat': 'image/webp',
          'creditText': '© Karim Saari — Dark Massilia',
          'copyrightNotice': '© Karim Saari',
          'license': `${BASE_URL}/mentions-legales/`,
          'acquireLicensePage': `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          'name': 'Fonds marins pollués en Méditerranée — Projet Sentinelle Marseille',
          'contentUrl': `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-fonds-marins.webp`,
          'description': 'Fonds marins des Calanques de Marseille documentés lors d\'une mission de dépollution en apnée par Team Oxygen',
          'caption': 'Fonds marins des Calanques de Marseille documentés lors d\'une mission de dépollution en apnée par Team Oxygen',
          'creator': { '@type': 'Person', 'name': 'Karim Saari', 'jobTitle': 'Photographe Environnemental' },
          'encodingFormat': 'image/webp',
          'creditText': '© Karim Saari — Dark Massilia',
          'copyrightNotice': '© Karim Saari',
          'license': `${BASE_URL}/mentions-legales/`,
          'acquireLicensePage': `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          'name': 'Mer de plastique sous-marine — Dépollution apnée Marseille',
          'contentUrl': `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mer-de-plastique.webp`,
          'description': 'Accumulation de plastiques sur les fonds marins de Marseille documentée en apnée lors du Projet Sentinelle',
          'caption': 'Accumulation de plastiques sur les fonds marins de Marseille documentée en apnée lors du Projet Sentinelle',
          'creator': { '@type': 'Person', 'name': 'Karim Saari', 'jobTitle': 'Photographe Environnemental' },
          'encodingFormat': 'image/webp',
          'creditText': '© Karim Saari — Dark Massilia',
          'copyrightNotice': '© Karim Saari',
          'license': `${BASE_URL}/mentions-legales/`,
          'acquireLicensePage': `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          'name': 'Grotte marine Calanques — Photographie sous-marine Marseille',
          'contentUrl': `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte.webp`,
          'description': 'Plongeur en apnée dans une grotte marine des Calanques de Marseille lors d\'une mission de dépollution sous-marine',
          'caption': 'Plongeur en apnée dans une grotte marine des Calanques de Marseille lors d\'une mission de dépollution sous-marine',
          'creator': { '@type': 'Person', 'name': 'Karim Saari', 'jobTitle': 'Photographe Environnemental' },
          'encodingFormat': 'image/webp',
          'creditText': '© Karim Saari — Dark Massilia',
          'copyrightNotice': '© Karim Saari',
          'license': `${BASE_URL}/mentions-legales/`,
          'acquireLicensePage': `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          'name': 'Apnéiste dépollution Marseille — Mission Projet Sentinelle',
          'contentUrl': `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-apneiste.webp`,
          'description': 'Apnéiste de Team Oxygen en mission de dépollution sous-marine dans les Calanques de Marseille',
          'caption': 'Apnéiste de Team Oxygen en mission de dépollution sous-marine dans les Calanques de Marseille',
          'creator': { '@type': 'Person', 'name': 'Karim Saari', 'jobTitle': 'Photographe Environnemental' },
          'encodingFormat': 'image/webp',
          'creditText': '© Karim Saari — Dark Massilia',
          'copyrightNotice': '© Karim Saari',
          'license': `${BASE_URL}/mentions-legales/`,
          'acquireLicensePage': `${BASE_URL}/contact/`,
        },
        // ── EventSeries — Projet Sentinelle (entité Knowledge Graph) ──
        {
          '@type': 'EventSeries',
          '@id': `${BASE_URL}/depollution-marine#projet-sentinelle`,
          name: 'Projet Sentinelle',
          alternateName: 'Opération Sentinelle Marine',
          description:
            "Mission annuelle de dépollution sous-marine en apnée organisée par Team Oxygen sur le littoral marseillais. Chaque automne, des apnéistes interviennent entre 0 et 20 mètres de profondeur pour collecter les déchets plastiques des fonds marins de Méditerranée.",
          url: `${BASE_URL}/depollution-marine`,
          sameAs: [
            'https://fr.wikipedia.org/wiki/Projet_Sentinelle',
            'https://www.fondationdelamer.org/nos-actualites/projet-sentinelle/',
            'https://www.zero-dechet-sauvage.org/structures/dark-massilia',
          ],
          image: `${BASE_URL}/assets/og-social-card.jpg`,
          organizer: {
            '@type': 'Organization',
            '@id': 'https://www.team-oxygen.com/#organization',
            name: 'Team Oxygen',
            url: 'https://www.team-oxygen.com/',
          },
          location: {
            '@type': 'Place',
            name: 'Littoral marseillais — Calanques, Frioul, Côte Bleue',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Marseille',
              addressRegion: 'Bouches-du-Rhône',
              addressCountry: 'FR',
            },
          },
          subEvent: [
            {
              '@type': 'Event',
              '@id': `${BASE_URL}/depollution-marine#sentinelle-2022`,
              name: 'Projet Sentinelle 2022 — Côte Bleue',
              description: 'Première édition du Projet Sentinelle : dépollution sous-marine en apnée sur la Côte Bleue avec Team Oxygen. 900 kg de déchets collectés entre 0 et 20 mètres de profondeur.',
              startDate: '2022-10-01',
              endDate: '2022-10-08',
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              image: `${BASE_URL}/images/depollution-marine-dark-massilia-karimsaari-marseille-1.webp`,
              location: {
                '@type': 'Place',
                name: 'Côte Bleue, Marseille',
                address: { '@type': 'PostalAddress', addressLocality: 'Marseille', addressRegion: 'Bouches-du-Rhône', addressCountry: 'FR' },
              },
              organizer: { '@type': 'Organization', name: 'Team Oxygen', url: 'https://www.team-oxygen.com/' },
              performer: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: `${BASE_URL}` },
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/LimitedAvailability', validFrom: '2022-10-01', url: `${BASE_URL}/depollution-marine` },
              url: `${BASE_URL}/depollution-marine`,
              superEvent: { '@id': `${BASE_URL}/depollution-marine#projet-sentinelle` },
            },
            {
              '@type': 'Event',
              '@id': `${BASE_URL}/depollution-marine#sentinelle-2023`,
              name: 'Projet Sentinelle 2023 — Archipel du Frioul',
              description: 'Deuxième édition du Projet Sentinelle : dépollution sous-marine en apnée à l\'Archipel du Frioul avec Team Oxygen. 1 357 kg de déchets plastiques extraits des fonds marins de Méditerranée.',
              startDate: '2023-09-23',
              endDate: '2023-09-30',
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              image: `${BASE_URL}/images/depollution-marine-dark-massilia-karimsaari-marseille-2.webp`,
              location: {
                '@type': 'Place',
                name: 'Archipel du Frioul, Marseille',
                address: { '@type': 'PostalAddress', addressLocality: 'Marseille', addressRegion: 'Bouches-du-Rhône', addressCountry: 'FR' },
              },
              organizer: { '@type': 'Organization', name: 'Team Oxygen', url: 'https://www.team-oxygen.com/' },
              performer: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: `${BASE_URL}` },
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/LimitedAvailability', validFrom: '2023-09-23', url: `${BASE_URL}/depollution-marine` },
              url: `${BASE_URL}/depollution-marine`,
              superEvent: { '@id': `${BASE_URL}/depollution-marine#projet-sentinelle` },
            },
            {
              '@type': 'Event',
              '@id': `${BASE_URL}/depollution-marine#sentinelle-2024`,
              name: 'Projet Sentinelle 2024 — Parc National des Calanques',
              description: 'Troisième édition du Projet Sentinelle : dépollution sous-marine en apnée dans le Parc National des Calanques de Marseille à Cassis avec Team Oxygen. 1 147 kg de déchets collectés.',
              startDate: '2024-09-28',
              endDate: '2024-10-06',
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              image: `${BASE_URL}/images/depollution-marine-dark-massilia-karimsaari-marseille-3.webp`,
              location: {
                '@type': 'Place',
                name: 'Parc National des Calanques, Marseille–Cassis',
                address: { '@type': 'PostalAddress', addressLocality: 'Marseille', addressRegion: 'Bouches-du-Rhône', addressCountry: 'FR' },
              },
              organizer: { '@type': 'Organization', name: 'Team Oxygen', url: 'https://www.team-oxygen.com/' },
              performer: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: `${BASE_URL}` },
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/LimitedAvailability', validFrom: '2024-09-28', url: `${BASE_URL}/depollution-marine` },
              url: `${BASE_URL}/depollution-marine`,
              superEvent: { '@id': `${BASE_URL}/depollution-marine#projet-sentinelle` },
            },
            {
              '@type': 'Event',
              '@id': `${BASE_URL}/depollution-marine#sentinelle-2025`,
              name: 'Projet Sentinelle 2025 — Rade de Marseille',
              description: 'Quatrième édition du Projet Sentinelle : dépollution sous-marine en apnée dans la Rade de Marseille avec Team Oxygen. Édition record avec 2 320 kg de déchets collectés entre 0 et 20 mètres de profondeur.',
              startDate: '2025-10-04',
              endDate: '2025-10-11',
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              image: `${BASE_URL}/images/depollution-marine-dark-massilia-karimsaari-marseille-4.webp`,
              location: {
                '@type': 'Place',
                name: 'Rade de Marseille',
                address: { '@type': 'PostalAddress', addressLocality: 'Marseille', addressRegion: 'Bouches-du-Rhône', addressCountry: 'FR' },
              },
              organizer: { '@type': 'Organization', name: 'Team Oxygen', url: 'https://www.team-oxygen.com/' },
              performer: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: `${BASE_URL}` },
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/LimitedAvailability', validFrom: '2025-10-04', url: `${BASE_URL}/depollution-marine` },
              url: `${BASE_URL}/depollution-marine`,
              superEvent: { '@id': `${BASE_URL}/depollution-marine#projet-sentinelle` },
            },
          ],
        },
      ],
    },
  },
  '/videos': {
    title: 'Vidéos — Dépollution en Méditerranée | Karim Saari',
    description:
      "Visionnez les documentaires et reportages d'action en immersion. Dépollution marine en Méditerranée, Calanques de Marseille — diffusé sur ARTE et TF1.",
    keywords: 'documentaire dépollution marine, arte pollution marseille, vidéo sous-marine calanques, reportage méditerranée',
    canonical: `${BASE_URL}/videos`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Vidéos & Documentaires', '/videos'),
        {
          '@type': 'VideoObject',
          name: 'Documentaire ARTE — Pollution Marine Marseille',
          description:
            "Reportage ARTE 2022 sur les éco-acteurs marseillais mobilisés contre la pollution plastique en Méditerranée, avec Karim Saari (Dark Massilia) et Team Oxygen.",
          thumbnailUrl: 'https://img.youtube.com/vi/cxjAQtSHHyI/maxresdefault.jpg',
          uploadDate: '2022-06-15T00:00:00+00:00',
          duration: 'PT5M30S',
          embedUrl: 'https://www.youtube.com/embed/cxjAQtSHHyI',
          contentUrl: 'https://www.youtube.com/watch?v=cxjAQtSHHyI',
          url: 'https://www.youtube.com/watch?v=cxjAQtSHHyI',
        },
        {
          '@type': 'VideoObject',
          name: '2025, une année de dépollution en apnée à Marseille',
          description:
            "Rétrospective 2025 des actions de dépollution en apnée dans les Calanques de Marseille par Dark Massilia et Team Oxygen.",
          thumbnailUrl: 'https://img.youtube.com/vi/sseo9sf7jow/maxresdefault.jpg',
          uploadDate: '2026-01-15T00:00:00+00:00',
          duration: 'PT8M10S',
          embedUrl: 'https://www.youtube.com/embed/sseo9sf7jow',
          contentUrl: 'https://www.youtube.com/watch?v=sseo9sf7jow',
          url: 'https://www.youtube.com/watch?v=sseo9sf7jow',
        },
        {
          '@type': 'VideoObject',
          name: 'Projet Sentinelle Frioul — Mission de Dépollution 2023',
          description:
            "Mission de dépollution sous-marine en apnée dans l'archipel du Frioul à Marseille — Projet Sentinelle 2023 par Team Oxygen.",
          thumbnailUrl: 'https://img.youtube.com/vi/XHqB603STuw/maxresdefault.jpg',
          uploadDate: '2023-11-01T00:00:00+00:00',
          duration: 'PT6M20S',
          embedUrl: 'https://www.youtube.com/embed/XHqB603STuw',
          contentUrl: 'https://www.youtube.com/watch?v=XHqB603STuw',
          url: 'https://www.youtube.com/watch?v=XHqB603STuw',
        },
      ],
    },
  },
  '/photographie-sous-marine': {
    title: 'Photographe Sous-Marin Marseille | Karim Saari',
    description:
      'Galerie sous-marine de Karim Saari : dépollution, biodiversité et caractérisation des fonds des Calanques de Marseille — photographe sous-marin à Marseille.',
    keywords: 'photographie sous-marine méditerranée, photographe apnéiste marseille, dépollution marine calanques, biodiversité sous-marine méditerranée',
    image: `${BASE_URL}/images/portfolio/Mer/photographe-sous-marin-marseille-frioul-exploration-subaquatique.webp`,
    canonical: `${BASE_URL}/photographie-sous-marine`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Photographe Sous-Marin — Galerie', '/photographie-sous-marine'),
        // ── Person — défini une fois, référencé par @id dans les ImageObjects ──
        {
          '@type': 'Person',
          '@id': `${BASE_URL}/#person`,
          name: 'Karim Saari',
          alternateName: 'Dark Massilia',
          jobTitle: 'Photographe Environnemental',
          url: BASE_URL,
        },
        {
          '@type': 'ImageGallery',
          name: 'Galerie Sous-Marine — Projet Sentinelle Marseille',
          description:
            'Galerie de photographies sous-marines prises lors des missions de dépollution en apnée de Team Oxygen dans les Calanques de Marseille (2022-2025).',
          url: `${BASE_URL}/photographie-sous-marine`,
          creator: { '@id': `${BASE_URL}/#person` },
          about: [
            { '@type': 'Thing', name: 'Dépollution marine' },
            { '@type': 'Thing', name: 'Photographie sous-marine' },
            { '@type': 'Thing', name: 'Calanques de Marseille' },
          ],
        },
        // ── 12 ImageObjects représentatifs (sélection éditoriale) ──
        ...([
          { f:'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-apneiste.webp', n:'Apnéiste en mission de dépollution — Projet Sentinelle Marseille', d:'Apnéiste de Team Oxygen en pleine extraction de déchets sur les fonds marins des Calanques — Projet Sentinelle.', y:2023 },
          { f:'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mer-de-plastique.webp', n:'Mer de plastique — Pollution fonds marins Calanques', d:'Accumulation massive de déchets plastiques sur les fonds marins des Calanques de Marseille — Projet Sentinelle.', y:2023 },
          { f:'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-morgan-bourchis.webp', n:'Morgan Bourchis — Champion du monde apnée, Projet Sentinelle', d:'Morgan Bourchis, multiple champion du monde d\'apnée, en mission de dépollution Projet Sentinelle dans les Calanques de Marseille.', y:2023 },
          { f:'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp', n:'Team Oxygen — Dépollution marine Marseille', d:'L\'équipe Team Oxygen lors d\'une mission de dépollution dans les Calanques de Marseille — Projet Sentinelle.', y:2023 },
          { f:'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poulpe.webp', n:'Poulpe commun — Biodiversité Calanques Marseille', d:'Poulpe commun observé en apnée lors d\'une mission dans les Calanques de Marseille — biodiversité méditerranéenne.', y:2024 },
          { f:'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-spirographe.webp', n:'Spirographe — Biodiversité Calanques Marseille', d:'Spirographe sur les fonds marins des Calanques de Marseille — témoin de la biodiversité méditerranéenne préservée.', y:2024 },
          { f:'posidonie-calanque-sormiou-marseille.webp', n:'Herbier de Posidonie — Calanque de Sormiou', d:'Herbier de Posidonia oceanica dans les eaux claires de la Calanque de Sormiou — puits de carbone de la Méditerranée.', y:2023 },
          { f:'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-grotte-riou.webp', n:'Grotte sous-marine île de Riou — Calanques de Marseille', d:'Exploration en apnée d\'une grotte sous-marine de l\'île de Riou dans les Calanques de Marseille.', y:2023 },
          { f:'Marseille-dark-massilia-plastique-pollution-projet-sentinelle-mus%C3%A9e_subaquatique-1.webp', n:'Musée subaquatique Méditerranée — Karim Saari', d:'Le musée subaquatique de la Méditerranée photographié en apnée — œuvres immergées, Calanques de Marseille.', y:2024 },
          { f:'marseille-dark-massilia-tf1-reportage-projet-sentinelle-depollution.webp', n:'Reportage TF1 — Projet Sentinelle Dépollution Marseille', d:'Karim Saari et Team Oxygen lors du reportage TF1 sur le Projet Sentinelle — dépollution marine en apnée à Marseille.', y:2023 },
          { f:'marseille-dark-massilia-caracterisation-dechets-sentinelle-75.webp', n:'400 bouteilles extraites du Mucem — Vieux-Port Marseille', d:'Apnéiste émergeant avec des centaines de bouteilles remontées du fond du bassin du Mucem lors d\'une dépollution massive.', y:2024 },
          { f:'photographe-sous-marin-marseille-mission-depollution-projet-sentinelle.webp', n:'Mission dépollution apnée — Photographe sous-marin Marseille', d:'Karim Saari, photographe sous-marin à Marseille, lors d\'une mission de dépollution en apnée — Projet Sentinelle.', y:2024 },
        ].map(({ f, n, d, y }) => ({
          '@type': 'ImageObject',
          name: n,
          description: d,
          caption: `${n} © Karim Saari / Dark Massilia`,
          contentUrl: `${BASE_URL}/images/${f}`,
          url: `${BASE_URL}/photographie-sous-marine`,
          creator: { '@id': `${BASE_URL}/#person` },
          copyrightHolder: { '@id': `${BASE_URL}/#person` },
          copyrightYear: y,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        }))),
      ],
    },
  },
  '/photographie-paysage-mer': {
    title: 'Photographe Paysage Marseille — Calanques & Provence | Karim Saari',
    description:
      'Photographe de paysages à Marseille depuis 20 ans. Calanques, Luberon, Valensole, Camargue — Karim Saari documente la beauté méditerranéenne. Tirages disponibles.',
    keywords: 'photographe paysage marseille, photographie calanques, paysage méditerranée, photographe provence, photographie paysage marseille',
    image: `${BASE_URL}/images/portfolio/Mer/karim-saari-marseille-calanque-sauvage-pins-mediterraneens.webp`,
    canonical: `${BASE_URL}/photographie-paysage-mer`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Galerie Paysages Marseille', '/photographie-paysage-mer'),
        {
          '@type': 'ImageGallery',
          name: 'Galerie Paysages Marseille — Calanques & Méditerranée — Karim Saari',
          description:
            'Galerie de photographies de paysages de Marseille, des Calanques et de la Méditerranée par Karim Saari, photographe paysages et environnemental à Marseille.',
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: {
            '@type': 'Person',
            name: 'Karim Saari',
            jobTitle: 'Photographe Paysages Marseille',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
          },
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        // ImageObjects — Mer (Calanques & Méditerranée) — 60 images
        ...([
          { f:'karim-saari-marseille-bateau-peche-calanque-turquoise-aerien', n:"Bateau de pêche — Calanque turquoise aérienne Marseille", d:"Petit bateau de pêche blanc ancré sur l'eau turquoise cristalline d'une calanque des Calanques de Marseille — photographie aérienne.", y:2023 },
          { f:'photographe-sous-marin-marseille-mi-eau-mi-ciel-calanque-turquoise', n:"Mi-eau mi-ciel — Calanque turquoise Marseille", d:"Vue mi-eau mi-ciel d'une calanque turquoise, fonds clairs et galets sous l'eau, falaises calcaires et pin — Calanques de Marseille.", y:2023 },
          { f:'photographe-sous-marin-marseille-apnee-grotte-marine-calanques', n:"Grotte marine en apnée — Calanques de Marseille", d:"Exploration en apnée d'une grotte marine dans les Calanques de Marseille — vue subjective, mains en néoprène, eau turquoise.", y:2024 },
          { f:'karim-saari-marseille-kayakistes-calanque-falaises-calcaires', n:"Kayakistes — Calanque falaises calcaires Marseille", d:"Kayakistes sur l'eau turquoise d'une calanque encadrée de hautes falaises calcaires et de pins — Calanques de Marseille.", y:2022 },
          { f:'karim-saari-marseille-grotte-calanque-turquoise-pins-falaises', n:"Grotte calcaire — Calanque turquoise pins Marseille", d:"Vue depuis une grotte calcaire sur une calanque turquoise encadrée de pins et de falaises — Calanques de Marseille.", y:2022 },
          { f:'karim-saari-marseille-coucher-soleil-calanque-plage-galets', n:"Coucher de soleil — Calanque plage de galets Marseille", d:"Coucher de soleil sur une plage de calanque entre deux falaises, ciel dramatique, reflets dorés sur le sable mouillé — Calanques de Marseille.", y:2023 },
          { f:'karim-saari-marseille-silhouettes-notre-dame-garde-flaque', n:"Silhouettes — Notre-Dame-de-la-Garde Marseille", d:"Silhouettes de deux personnes sur un banc et leur reflet parfait dans une flaque, Notre-Dame de la Garde en arrière-plan — Marseille.", y:2022 },
          { f:'karim-saari-marseille-vallon-auffes-coucher-soleil-barques', n:"Vallon des Auffes — Coucher de soleil barques Marseille", d:"Port du Vallon des Auffes au coucher de soleil, barques colorées, pont en arches, soleil en étoile — Marseille.", y:2022 },
          { f:'karim-saari-marseille-falaises-volcaniques-rouges-cote', n:"Falaises volcaniques rouges — Côte marseillaise", d:"Femme en robe rouge sur une plage de galets face aux falaises volcaniques rouges — paysage côtier Marseille.", y:2022 },
          { f:'karim-saari-marseille-calanque-aiguilles-eau-cristalline', n:"Calanque aiguilles — Eau cristalline Marseille", d:"Calanque vue depuis une ouverture dans la roche, femme en bikini dans l'eau cristalline, aiguilles rocheuses en arrière-plan.", y:2023 },
          { f:'karim-saari-marseille-street-art-poisson-mur', n:"Street art poisson — Marseille", d:"Street art marseillais — poisson coloré peint sous le mot MARSEILLE sur un mur de béton gris.", y:2022 },
          { f:'karim-saari-marseille-fisheye-calanques-sommets-rochers', n:"Fisheye — Calanques sommets rochers Marseille", d:"Vue fisheye depuis le sommet des Calanques, femme en robe bleue sur les rochers, anse et mer en contrebas.", y:2023 },
          { f:'karim-saari-marseille-nageur-roches-rouges-anse', n:"Nageur — Roches rouges anse Marseille", d:"Nageur solitaire dans les eaux émeraude translucides d'une anse entre falaises de roches rouges — Marseille.", y:2022 },
          { f:'karim-saari-marseille-aerien-calanque-nageur-turquoise', n:"Calanque aérienne — Nageur turquoise Marseille", d:"Vue aérienne plongeante sur une calanque turquoise, falaises calcaires blanches, silhouette d'un nageur dans l'eau — Calanques de Marseille.", y:2023 },
          { f:'karim-saari-marseille-calanque-sauvage-pins-mediterraneens', n:"Calanque sauvage — Pins méditerranéens Marseille", d:"Calanque sauvage avec pins méditerranéens, eau turquoise et rochers calcaires — Calanques de Marseille.", y:2022 },
          { f:'karim-saari-marseille-femme-rocher-calcaire-calanques', n:"Femme — Rocher calcaire Calanques Marseille", d:"Femme en robe bleue les bras écartés sur un rocher calcaire en strates dans les Calanques de Marseille.", y:2023 },
          { f:'karim-saari-marseille-silhouette-flaque-plage-jetee', n:"Silhouette — Flaque plage jetée Marseille", d:"Silhouette d'une personne se reflétant dans une flaque sur la plage à côté d'une jetée en bois, ciel dramatique — Marseille.", y:2022 },
          { f:'karim-saari-marseille-kayakistes-calanque-arbre-tordu', n:"Kayakistes — Calanque arbre tordu Marseille", d:"Kayakistes sur une calanque turquoise encadrée de falaises et de pins, vue à travers un arbre tordu au premier plan.", y:2022 },
          { f:'karim-saari-marseille-aerien-vagues-littoral-mediterraneen', n:"Vagues aériennes — Littoral méditerranéen Marseille", d:"Vue aérienne de vagues blanches se brisant sur des rochers et une plage de sable — littoral méditerranéen Marseille.", y:2023 },
          { f:'karim-saari-marseille-aerien-calanque-secrete-galets-emeraude', n:"Calanque secrète aérienne — Galets émeraude Marseille", d:"Vue aérienne d'une calanque secrète, plage de galets, eau émeraude encadrée de falaises calcaires et de végétation — Calanques de Marseille.", y:2023 },
          { f:'karim-saari-marseille-falaises-calcaires-calanque-coucher-soleil', n:"Falaises calcaires — Calanque coucher de soleil Marseille", d:"Falaises calcaires dorées se reflétant dans les eaux turquoise d'une calanque au coucher de soleil — Calanques de Marseille.", y:2024 },
          { f:'karim-saari-marseille-statue-vierge-falaise-mer-vue-dessus', n:"Statue Vierge — Falaise mer Marseille", d:"Statue de la Vierge à l'Enfant au sommet d'une falaise surplombant la mer au coucher du soleil — vue du dessus, Marseille.", y:2022 },
          { f:'karim-saari-marseille-en-vau-aerien-calanque-falaises', n:"Calanque En-Vau aérienne — Falaises calcaires Marseille", d:"Vue aérienne de la calanque d'En-Vau turquoise entre falaises calcaires blanches et pins — Calanques de Marseille.", y:2023 },
          { f:'karim-saari-marseille-marquage-sol-pollution-sensibilisation', n:"Marquage sol pollution — Sensibilisation Marseille", d:'Marquage au sol "Ne rien jeter ici — La mer commence ici" sur asphalte rouge — sensibilisation à la pollution urbaine, Marseille.', y:2022 },
          { f:'karim-saari-marseille-vieux-port-arche-cadenas-notre-dame', n:"Vieux-Port arche cadenas — Notre-Dame Marseille", d:"Vieux-Port de Marseille vu à travers une arche ornée de cadenas d'amour, voiliers et Notre-Dame de la Garde.", y:2022 },
          { f:'karim-saari-marseille-poulies-voilier-notre-dame-garde', n:"Poulies voilier — Notre-Dame-de-la-Garde Marseille", d:"Détail de poulies en bois sur un mât de voilier, Notre-Dame de la Garde en arrière-plan flou — Vieux-Port Marseille.", y:2022 },
          { f:'karim-saari-marseille-pirate-vieux-port', n:"Pirate — Vieux-Port Marseille", d:"Personnage costumé en pirate avec masque et pistolet factice — Vieux-Port de Marseille.", y:2022 },
          { f:'photographe-sous-marin-marseille-sculpture-musee-subaquatique', n:"Sculpture musée subaquatique — Méditerranée Marseille", d:"Sculpture sous-marine colonisée par les algues et coraux — musée subaquatique Méditerranée — Karim Saari, photographe sous-marin Marseille.", y:2023 },
          { f:'karim-saari-marseille-vallon-auffes-nuit-pont-reflets', n:"Vallon des Auffes nuit — Pont reflets Marseille", d:"Port du Vallon des Auffes la nuit sous une arche de pont illuminée, maisons colorées et reflets dans l'eau — Marseille.", y:2022 },
          { f:'photographe-sous-marin-marseille-pollution-plastique-fond-marin', n:"Pollution plastique fond marin — Calanques Marseille", d:"Canette sur algues sous-marines avec étoile de mer orange — pollution plastique fonds marins Calanques — Karim Saari, photographe sous-marin Marseille.", y:2024 },
          { f:'karim-saari-marseille-pointu-voile-rouge-notre-dame', n:"Pointu voile rouge — Notre-Dame Marseille", d:"Pointu marseillais à voile rouge naviguant devant Marseille avec Notre-Dame de la Garde en arrière-plan.", y:2022 },
          { f:'karim-saari-marseille-bouee-bateau-notre-dame-garde', n:"Bouée bateau — Notre-Dame-de-la-Garde Marseille", d:"Bouée de sauvetage sur la proue d'un bateau bleu, Notre-Dame de la Garde floue en arrière-plan — Marseille.", y:2022 },
          { f:'karim-saari-marseille-pointu-kraken-calanques', n:"Pointu Kraken — Calanques Marseille", d:"Pointu marseillais à voile rouge et blanc croisant le grand voilier Kraken dans les Calanques de Marseille.", y:2023 },
          { f:'karim-saari-marseille-vague-mistral-tempete-mediterranee', n:"Vague mistral tempête — Méditerranée Marseille", d:"Vague du mistral s'écrasant sur le quai en Méditerranée — photographie de tempête à Marseille par Karim Saari.", y:2023 },
          { f:'karim-saari-marseille-veliplanchiste-calanques-fort', n:"Véliplanchiste — Calanques fort Marseille", d:"Véliplanchiste sur la mer agitée avec les Calanques de Marseille et le fort en arrière-plan.", y:2023 },
          { f:'karim-saari-marseille-coucher-soleil-voiliers-silhouettes', n:"Coucher de soleil voiliers — Méditerranée Marseille", d:"Coucher de soleil rouge sur la mer avec trois voiliers en silhouette — Méditerranée, Marseille.", y:2023 },
          { f:'karim-saari-marseille-panoramique-calanques-notre-dame-garde', n:"Panoramique Calanques — Notre-Dame-de-la-Garde Marseille", d:"Vue panoramique sur Marseille depuis les hauteurs des Calanques, route sinueuse, Notre-Dame de la Garde visible.", y:2023 },
          { f:'photographe-sous-marin-marseille-meduse-pelagie-faune-marine', n:"Méduse Pélagie — Faune marine Méditerranée Marseille", d:"Méduse Pélagie (Pelagia noctiluca) rose en pleine eau turquoise — faune marine Méditerranée — Karim Saari, photographe sous-marin Marseille.", y:2023 },
          { f:'karim-saari-marseille-goeland-bollard-port-turquoise', n:"Goéland bollard — Port turquoise Marseille", d:"Goéland leucophée posé sur un bollard de port devant l'eau turquoise — Marseille.", y:2022 },
          { f:'karim-saari-marseille-barques-peche-calanque-falaises', n:"Barques de pêche — Calanque falaises Marseille", d:"Barques de pêche traditionnelles amarrées dans un port de calanque sous les falaises calcaires — Marseille.", y:2022 },
          { f:'karim-saari-marseille-calanque-maisons-pecheurs-turquoise', n:"Calanque maisons pêcheurs — Turquoise Marseille", d:"Calanque sauvage aux eaux turquoise avec pin en premier plan, maisons de pêcheurs et mouette en vol — Marseille.", y:2022 },
          { f:'karim-saari-marseille-dechets-plastiques-calanques-projet-sentinelle', n:"Déchets plastiques Calanques — Projet Sentinelle", d:"Amas de déchets plastiques collectés dans les Calanques — bouteilles, canettes, emballages — Projet Sentinelle Dark Massilia.", y:2024 },
          { f:'karim-saari-marseille-port-calanque-reflets-eau-cristalline', n:"Port calanque — Reflets eau cristalline Marseille", d:"Petit port de calanque avec bateaux amarrés se reflétant dans l'eau cristalline, falaises calcaires et ciel bleu — HDR Marseille.", y:2022 },
          { f:'karim-saari-marseille-pointu-reflet-calanque-hdr', n:"Pointu reflet — Calanque HDR Marseille", d:"Proue d'un pointu marseillais se reflétant dans l'eau cristalline d'une calanque, cordages et fond marin visible — HDR Marseille.", y:2022 },
          { f:'karim-saari-marseille-bateau-calanque-turquoise-falaises', n:"Bateau calanque turquoise — Falaises Marseille", d:"Petit bateau de pêche blanc naviguant dans les eaux turquoise d'une calanque encadrée de hautes falaises calcaires — Marseille.", y:2023 },
          { f:'karim-saari-marseille-aerien-nageur-calanque-rochers', n:"Nageur aérien — Calanque rochers Marseille", d:"Vue aérienne plongeante sur un nageur solitaire dans les eaux turquoise d'une calanque entre rochers calcaires — Marseille.", y:2023 },
          { f:'photographe-sous-marin-marseille-etoile-mer-faune-marine', n:"Étoile de mer — Faune marine Méditerranée Marseille", d:"Main tenant une étoile de mer rouge sous l'eau — faune marine Méditerranée — Karim Saari, photographe sous-marin Marseille.", y:2024 },
          { f:'karim-saari-marseille-sormiou-calanque-mer-turquoise', n:"Calanque de Sormiou — Mer turquoise Marseille", d:"Mer turquoise azuréenne vue depuis la calanque de Sormiou — Marseille, Calanques de Marseille.", y:2023 },
          { f:'karim-saari-marseille-frioul-iles-sauvages-mediterranee', n:"Archipel du Frioul — Îles sauvages Méditerranée", d:"Archipel du Frioul vu de la mer — îles sauvages de Marseille en Méditerranée.", y:2022 },
          { f:'karim-saari-marseille-vue-mer-vieux-port-notre-dame-panorama', n:"Vue mer panorama — Vieux-Port Notre-Dame Marseille", d:"Marseille vue depuis la mer — panorama du littoral méditerranéen, Vieux-Port et Notre-Dame de la Garde.", y:2022 },
          { f:'photographe-sous-marin-marseille-plongee-apnee-calanques-dark-massilia', n:"Plongée apnée Calanques — Dark Massilia Marseille", d:"Plongée en apnée dans les Calanques — exploration des fonds méditerranéens — Karim Saari, photographe sous-marin Marseille.", y:2023 },
          { f:'photographe-sous-marin-marseille-faune-flore-marine-mediterranee', n:"Faune et flore marine — Méditerranée Calanques Marseille", d:"Faune et flore sous-marines des Calanques de Marseille — Karim Saari, photographe sous-marin Marseille.", y:2023 },
          { f:'photographe-sous-marin-marseille-posidonie-roches-calcaires-calanques', n:"Posidonie — Roches calcaires Calanques Marseille", d:"Posidonie et roches calcaires sous-marines — Calanques de Marseille — Karim Saari, photographe sous-marin Marseille.", y:2023 },
          { f:'photographe-sous-marin-marseille-lumiere-filtree-eau-apnee', n:"Lumière filtrée eau — Apnée Calanques Marseille", d:"Lumière filtrée sous l'eau dans les Calanques de Marseille — Karim Saari, photographe sous-marin Marseille.", y:2024 },
          { f:'photographe-sous-marin-marseille-biodiversite-fonds-marins-calanques', n:"Biodiversité fonds marins — Calanques Méditerranée Marseille", d:"Biodiversité des fonds marins méditerranéens — Calanques de Marseille — Karim Saari, photographe sous-marin Marseille.", y:2023 },
          { f:'photographe-sous-marin-marseille-frioul-exploration-subaquatique', n:"Exploration subaquatique Frioul — Calanques Marseille", d:"Fonds marins du Frioul — exploration en apnée — Karim Saari, photographe sous-marin Marseille.", y:2023 },
          { f:'karim-saari-marseille-frioul-falaises-eau-turquoise', n:"Frioul falaises — Eau turquoise Marseille", d:"Archipel du Frioul — Marseille — falaises calcaires et eau turquoise méditerranéenne.", y:2022 },
          { f:'karim-saari-marseille-gabian-ilots-roches-calcaires', n:"Îlots des Gabian — Roches calcaires Marseille", d:"Îlots des Gabian près de Marseille — végétation méditerranéenne sur roches calcaires en Méditerranée.", y:2022 },
          { f:'karim-saari-marseille-paysage-calanque-sormiou-eau-turquoise', n:"Paysage calanque Sormiou — Eau turquoise Marseille", d:"Paysage de la calanque de Sormiou, Marseille — eau turquoise et falaises calcaires méditerranéennes.", y:2023 },
          { f:'karim-saari-capbreton-cote-landaise-ocean-atlantique-paysage', n:"Côte landaise Capbreton — Océan Atlantique", d:"Côte landaise à Capbreton — paysage de l'océan Atlantique, vagues et plage de sable.", y:2023 },
          { f:'capbreton-2', n:"L'alignement des estacades — Capbreton", d:"Portrait d'une femme devant l'alignement graphique des poteaux numérotés de l'estacade de Capbreton — littoral landais.", y:2023 },
          { f:'sormiou-laurence-2021', n:"Harmonie sous la pinède côtière — Calanque de Sormiou", d:"Portrait de profil d'une femme à l'ombre d'un pin regardant vers la calanque de Sormiou, eau turquoise et falaises calcaires — Calanques de Marseille.", y:2021 },
          { f:'sugiton-3', n:"Liberté face aux falaises calcaires — Calanque de Sugiton", d:"Femme en robe bleue devant les falaises calcaires de la Calanque de Sugiton — Parc national des Calanques, Marseille.", y:2022 },
          { f:'sugiton-4', n:"Baie de Sugiton et ses falaises calcaires — Calanque de Sugiton", d:"Paysage de la calanque de Sugiton, ses falaises calcaires et les eaux de la Méditerranée le matin — photographie environnementale.", y:2022 },
          { f:'valensole-2019-3', n:"Éclat de rouge sur le plateau de Valensole — Provence", d:"Silhouette en robe rouge parmi les champs de lavande de l'arrière-pays provençal — photographie de paysage, lumière provençale.", y:2019 },
          { f:'valensole-3', n:"Harmonie rouge au cœur de la Provence — Plateau de Valensole", d:"Femme en robe rouge marchant dans les rangées d'un champ de lavande — photographie de paysage, arrière-pays provençal.", y:2022 },
          { f:'marseille-photographie-paysages-karimssari-8', n:"Le Kraken de Wings of the Ocean — Vieux-Port de Marseille", d:"Le navire de dépollution Le Kraken à quai dans le Vieux-Port, observé depuis une barquette traditionnelle de l'association Boud'mer.", y:2024 },
        ].map(({ f, n, d, y }) => ({
          '@type': 'ImageObject',
          name: `${n} © Karim Saari / Dark Massilia`,
          description: d,
          caption: `${n} © Karim Saari / Dark Massilia`,
          contentUrl: `${BASE_URL}/images/portfolio/Mer/${f}.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: y,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        }))),
        // ImageObjects — Portfolio cover
        {
          '@type': 'ImageObject',
          name: 'Portfolio sous-marin et paysages — Calanques Marseille © Karim Saari / Dark Massilia',
          description: 'Karim Saari photographe — portfolio sous-marin et paysages des Calanques de Marseille, engagement environnemental pour la Méditerranée.',
          caption: 'Portfolio sous-marin et paysages — Calanques Marseille © Karim Saari / Dark Massilia',
          contentUrl: `${BASE_URL}/images/Karimsaari-portfolio-sous-marin-paysages-calanques-marseille-photographie-photographe-environnemental.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2023,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        // ImageObjects — Terre (Provence, Maroc, Voyages) — 32 images
        ...([
          { f:'karim-saari-photographe-provence-femme-chapeau-champ-lavande-lumiere-doree', n:"Femme chapeau — Champ lavande lumière dorée Provence", d:"Femme au chapeau bleu dans un champ de lavande, lumière dorée du soir — photographe paysage Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-champ-lavande-coucher-soleil-rangees', n:"Champ lavande rangées — Coucher de soleil Valensole Provence", d:"Champ de lavande de Valensole au coucher de soleil, rangées parallèles, ciel rose — photographe Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-femme-chapeau-lavande-violette', n:"Femme chapeau — Lavande violette Provence", d:"Femme au chapeau bleu dans un vaste champ de lavande violette — photographe paysage Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-maroc-chefchaouen-ruelle-bleue-vieil-homme', n:"Ruelle bleue Chefchaouen — Maroc", d:"Ruelle bleue de Chefchaouen, vieil homme en djellaba sur des marches — photographe Maroc Karim Saari.", y:2021 },
          { f:'karim-saari-photographe-provence-femme-robe-bleue-lavande', n:"Femme robe bleue — Lavande Provence", d:"Femme en robe bleue marchant dans un champ de lavande violette — photographe Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-portrait-chapeau-blanc-lavande', n:"Portrait chapeau blanc — Lavande Valensole Provence", d:"Portrait lumière dorée dans les lavandes de Valensole, chapeau blanc, coucher de soleil — Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-marseille-carrousel-vieux-port-coucher-soleil', n:"Carrousel Vieux-Port — Coucher de soleil Marseille", d:"Carrousel flou et enfant sur la place du Vieux-Port au coucher de soleil — photographe Marseille Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-maroc-chefchaouen-chaton-roux-mur-bleu', n:"Chaton roux — Mur bleu Chefchaouen Maroc", d:"Chaton roux couché sur un pavé devant un mur bleu — Chefchaouen, photographe Maroc Karim Saari.", y:2021 },
          { f:'karim-saari-photographe-maroc-chefchaouen-femme-chapeau-ville-bleue', n:"Femme chapeau — Ville bleue Chefchaouen Maroc", d:"Femme de dos avec chapeau, ville bleue de Chefchaouen vue panoramique — photographe Maroc Karim Saari.", y:2021 },
          { f:'karim-saari-photographe-maroc-chefchaouen-chaton-blanc-escaliers-bleus', n:"Chaton blanc — Escaliers bleus Chefchaouen Maroc", d:"Chaton blanc yeux bleus contre les marches bleues de Chefchaouen — photographe Maroc Karim Saari.", y:2021 },
          { f:'karim-saari-photographe-maroc-chefchaouen-chats-ruelle-bleue', n:"Chats — Ruelle bleue Chefchaouen Maroc", d:"Deux chats dans une ruelle bleue de Chefchaouen, escaliers bleus et blancs — Karim Saari.", y:2021 },
          { f:'karim-saari-photographe-femme-robe-rouge-rochers-volcaniques-cote-sauvage', n:"Femme robe rouge — Rochers volcaniques côte sauvage", d:"Femme en robe rouge sur des rochers volcaniques noirs, côte sauvage — photographe paysage Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-dune-pilat-arcachon-silhouette-foret-landes', n:"Dune du Pilat — Silhouette forêt des Landes Arcachon", d:"Silhouette au sommet de la Dune du Pilat face à la forêt des Landes — photographe Arcachon Karim Saari.", y:2021 },
          { f:'karim-saari-photographe-provence-macro-coccinelle-lavande-pollinisateur', n:"Macro coccinelle — Lavande pollinisateur Provence", d:"Macro coccinelle rouge sur lavande en fleur, Valensole — photographe nature Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-aerien-tournesols-lavande', n:"Aérien tournesols lavande — Provence", d:"Vue aérienne femmes courant entre tournesols et lavande — photographe paysage Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-femme-short-jaune-champ-lavande', n:"Femme short jaune — Champ lavande Valensole Provence", d:"Femme en short jaune dans un champ de lavande de Provence — photographe Valensole Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-couple-champ-lavande-vue-dessus', n:"Couple — Champ lavande vue dessus Provence", d:"Couple enlacé au milieu d'un champ de lavande vu d'en haut — photographe Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-lavande-coucher-soleil-ciel-orange-rouge', n:"Lavande coucher de soleil — Ciel orange rouge Provence", d:"Champ de lavande de Valensole au coucher de soleil, ciel orange rouge — photographe Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-arbre-solitaire-lavande-ciel-dramatique', n:"Arbre solitaire lavande — Ciel dramatique Provence", d:"Arbre solitaire dans la lavande de Provence, ciel dramatique rose-orange — photographe Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-femme-chapeau-blanc-coquelicots', n:"Femme chapeau blanc — Coquelicots Provence", d:"Femme au chapeau blanc avec un coquelicot dans un champ de coquelicots — photographe Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-marseille-tour-corbusier-architecture-brutaliste', n:"Tour Corbusier — Architecture brutaliste Marseille", d:"Femme au pied de la tour du Corbusier à Marseille, architecture brutaliste — photographe Marseille Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-maroc-cigognes-nid-faune-sauvage', n:"Cigognes nid — Faune sauvage Maroc", d:"Cigognes blanches sur leur nid, reproduction faune sauvage — photographe Maroc Karim Saari.", y:2021 },
          { f:'karim-saari-photographe-maroc-femme-chapeau-ruelle-medina-ocre', n:"Femme chapeau — Ruelle médina ocre Maroc", d:"Femme au chapeau dans une ruelle de médina marocaine, murs ocre, lumière rasante — Karim Saari.", y:2021 },
          { f:'karim-saari-photographe-provence-femme-champ-tulipes-roses', n:"Femme — Champ tulipes roses Provence", d:"Femme en combinaison bleue dans un champ de tulipes roses — photographe paysage Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-femme-chapeau-paille-tulipes-multicolores', n:"Femme chapeau paille — Tulipes multicolores Provence", d:"Femme au chapeau de paille dans un champ de tulipes multicolores — photographe Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-village-femme-robe-rouge-flaque', n:"Femme robe rouge flaque — Village provençal", d:"Femme en robe rouge se reflétant dans une flaque, village provençal — photographe Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-femme-robe-rouge-lavande-crepuscule', n:"Femme robe rouge — Lavande crépuscule Provence", d:"Femme en robe rouge dans la lavande au crépuscule, lumière dorée rasante — photographe Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-geometrie-rangees-lavande-vue-dessus', n:"Géométrie rangées lavande — Vue dessus Valensole Provence", d:"Géométrie des rangées de lavande de Valensole vue d'en haut — photographe paysage Provence Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-lavande-coucher-soleil-montagnes', n:"Lavande coucher de soleil — Montagnes Provence", d:"Lavande de Provence au coucher de soleil avec montagnes en arrière-plan — photographe Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-lavande-tournesols-contraste-couleurs', n:"Lavande tournesols — Contraste couleurs Provence", d:"Champ de lavande et champ de tournesols, contraste de couleurs, Provence — photographe Karim Saari.", y:2022 },
          { f:'karim-saari-photographe-provence-paysage-mediterraneen-lumiere-doree', n:"Paysage méditerranéen — Lumière dorée Provence", d:"Paysage méditerranéen de Provence, nature sauvage et lumière dorée — photographe Karim Saari.", y:2022 },
          { f:'karim-saari-marseille-littoral-stade-panoramique', n:"Littoral stade panoramique — Marseille", d:"Vue panoramique sur le littoral méditerranéen et le stade de Marseille — Karim Saari.", y:2023 },
          { f:'marseille-velodrome-provence-photographie-paysage-karimsaari', n:"Vélodrome et panorama marseillais — Marseille", d:"Paysage urbain de Marseille avec le stade Vélodrome — photographie de paysage par Karim Saari.", y:2024 },
          { f:'provence-photographie-paysage-valensole-karimsarri-lavandes', n:"Champ de lavande à Valensole — Provence", d:"Rangées symétriques de lavande en fleur sous un ciel de fin de journée sur le plateau de Valensole — paysage emblématique de Provence.", y:2024 },
        ].map(({ f, n, d, y }) => ({
          '@type': 'ImageObject',
          name: `${n} © Karim Saari / Dark Massilia`,
          description: d,
          caption: `${n} © Karim Saari / Dark Massilia`,
          contentUrl: `${BASE_URL}/images/portfolio/Terre/${f}.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: y,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        }))),
        // ImageObjects — Horizons (Dune du Pilat, Atlantique, Madère, Biarritz) — 8 images
        ...([
          { f:'dune-2-1', n:"Échappée bleue sur la crête — Dune du Pilat", d:"Femme en longue robe bleue avançant sur la crête de la Dune du Pilat, forêt de pins en arrière-plan — Gironde.", y:2022 },
          { f:'dune-4', n:"Échappée verte face à l'océan de pins — Dune du Pilat", d:"Femme en robe d'été vert et jaune sur la crête de la Dune du Pilat regardant la forêt de pins — littoral aquitain.", y:2022 },
          { f:'dune-5', n:"Silhouette de la Dune du Pilat depuis les parcs — Cap Ferret", d:"Voilier naviguant derrière les piquets ostréicoles avec la Dune du Pilat en arrière-plan — Cap Ferret.", y:2022 },
          { f:'fanal-2', n:"Silhouette bleue face à l'océan de nuages — Fanal, Madère", d:"Femme en robe bleue contemplant une mer de nuages depuis les sommets du Fanal — horizons lointains, Madère.", y:2023 },
          { f:'praia-formosa-2', n:"Crépuscule sur le sable noir — Praia Formosa, Madère", d:"Femme seule face à l'océan sur une plage volcanique au coucher du soleil — Praia Formosa, Madère.", y:2023 },
          { f:'yellow-time-2', n:"Éclat chromatique sous le soleil de Madère — Ponta do Sol", d:"Femme souriante en tenue estivale devant un mur bicolore jaune et gris — photographie de voyage, Madère.", y:2023 },
          { f:'biarritz-cote-basque-karimsaari-1', n:"Surfeur face à l'Océan au coucher de soleil — Biarritz", d:"Surfeur attendant la vague face à l'océan au coucher de soleil à la plage d'Ilbarritz — Pays basque.", y:2023 },
          { f:'biarritz-cote-basque-karimsaari-2', n:"Autoportrait panoramique HDR — Biarritz, plage d'Ilbarritz", d:"Autoportrait frontal face à l'Océan Atlantique au crépuscule sur la plage d'Ilbarritz — horizons lointains, Biarritz.", y:2023 },
        ].map(({ f, n, d, y }) => ({
          '@type': 'ImageObject',
          name: `${n} © Karim Saari / Dark Massilia`,
          description: d,
          caption: `${n} © Karim Saari / Dark Massilia`,
          contentUrl: `${BASE_URL}/images/portfolio/Horizons/${f}.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: y,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        }))),
      ],
    },
  },
  '/donnees-scientifiques': {
    title: 'Pollution Plastique Méditerranée | Données Scientifiques',
    description:
      "7 % des microplastiques mondiaux en Méditerranée. Données scientifiques sur les rejets plastiques, l'impact sur les espèces marines et la santé humaine.",
    canonical: `${BASE_URL}/donnees-scientifiques`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Données Scientifiques', '/donnees-scientifiques'),
        {
          '@type': 'Dataset',
          '@id': `${BASE_URL}/donnees-scientifiques/#dataset`,
          name: 'Pollution Plastique en Méditerranée — Données Scientifiques',
          description:
            'Données chiffrées sur la pollution plastique en Méditerranée : concentration de microplastiques, volumes annuels rejetés, impact sur les espèces marines et la santé humaine. Sources : WWF, PNUE, Marine Pollution Bulletin, Frontiers in Marine Science.',
          url: `${BASE_URL}/donnees-scientifiques/`,
          creator: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: 'https://karimsaari.com' },
          publisher: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: 'https://karimsaari.com' },
          spatialCoverage: 'Mer Méditerranée',
          temporalCoverage: '2018/2026',
          inLanguage: 'fr',
          license: 'https://creativecommons.org/licenses/by-nc/4.0/',
          keywords: [
            'pollution plastique Méditerranée',
            'microplastiques Méditerranée',
            'nanoplastiques',
            'déchets marins données',
            'pollution plastique données scientifiques',
            'biodiversité marine Méditerranée',
            'statistiques pollution mer',
          ],
          variableMeasured: [
            { '@type': 'PropertyValue', name: 'Concentration de microplastiques en Méditerranée', unitText: 'fragments/km²' },
            { '@type': 'PropertyValue', name: 'Volume annuel de plastique rejeté en Méditerranée', unitText: 'tonnes/an' },
            { '@type': 'PropertyValue', name: 'Espèces marines impactées par la pollution plastique', unitText: 'nombre' },
            { '@type': 'PropertyValue', name: 'Ingestion de nanoplastiques par les humains', unitText: 'g/semaine' },
            { '@type': 'PropertyValue', name: 'Part de la Méditerranée dans les microplastiques mondiaux', unitText: '%' },
          ],
          about: [
            { '@type': 'Thing', name: 'Pollution plastique' },
            { '@type': 'Thing', name: 'Microplastiques' },
            { '@type': 'Place', name: 'Mer Méditerranée' },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Quelle part des microplastiques mondiaux se trouve en Méditerranée ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Bien que la Méditerranée ne représente que 1 % de la surface des océans, elle concentre environ 7 % des microplastiques de la planète. Sa densité moyenne atteint jusqu'à 1,25 million de fragments par km², soit quatre fois plus que le « 7ᵉ continent de plastique » dans le Pacifique Nord.",
              },
            },
            {
              '@type': 'Question',
              name: 'Combien de plastique est rejeté en Méditerranée chaque année ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "On estime que 229 000 tonnes de plastique finissent dans les eaux méditerranéennes chaque année, soit entre 700 et 1 400 tonnes par jour — l'équivalent d'un à deux camions-poubelles déchargés chaque heure. La France contribue seule à hauteur de 11 200 tonnes annuelles.",
              },
            },
            {
              '@type': 'Question',
              name: 'Où va le plastique dans la mer ? Est-il visible en surface ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "La pollution visible n'est que la partie émergée de l'iceberg : 94 % du plastique coule et sédimente sur les fonds marins, 5 % s'échoue sur les côtes et seulement 1 % reste en surface. Malgré ce faible pourcentage, environ 247 milliards de pièces en plastique flotteraient actuellement en Méditerranée.",
              },
            },
            {
              '@type': 'Question',
              name: "Combien d'espèces marines sont affectées par la pollution plastique en Méditerranée ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Plus de 600 espèces marines méditerranéennes sont directement affectées par la pollution plastique, par ingestion ou enchevêtrement. Toutes les espèces de tortues marines présentes en Méditerranée sont concernées : des fragments plastiques ont été retrouvés dans 100 % des tortues marines étudiées.',
              },
            },
            {
              '@type': 'Question',
              name: 'Les humains ingèrent-ils du plastique ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Oui. La contamination remonte toute la chaîne alimentaire. En moyenne, une personne ingère aujourd'hui 5 grammes de nanoplastiques par semaine, soit l'équivalent en poids d'une carte de crédit.",
              },
            },
            {
              '@type': 'Question',
              name: 'Que se passera-t-il en 2050 si rien ne change ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Si aucune mesure radicale n'est prise, les scientifiques estiment qu'en 2050, la Méditerranée contiendra plus de plastiques que de poissons en poids.",
              },
            },
            {
              '@type': 'Question',
              name: "Comment l'aquaculture devient-elle une source locale de pollution plastique ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "L'aquaculture utilise massivement des filets, bouées et cordages en plastique qui se fragmentent avec le temps. Ces matériaux libèrent des microplastiques directement dans les zones de production, contaminant les élevages eux-mêmes et les écosystèmes marins environnants.",
              },
            },
            {
              '@type': 'Question',
              name: 'Quels sont les effets des nanoplastiques sur la reproduction des huîtres ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Des études ont montré que l'exposition aux nanoplastiques perturbe la reproduction des huîtres : réduction du taux de fécondation, anomalies du développement larvaire et diminution de la capacité à former des coquilles solides. Ces effets menacent directement les filières ostréicoles méditerranéennes.",
              },
            },
            {
              '@type': 'Question',
              name: 'En quoi consiste l\'effet "Cheval de Troie" des microplastiques ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Les microplastiques agissent comme des « chevaux de Troie » : leur surface hydrophobe attire et concentre des polluants chimiques (PCB, pesticides, métaux lourds) jusqu'à un million de fois leur concentration dans l'eau ambiante. Lorsqu'ils sont ingérés par des organismes marins, ces polluants sont libérés dans les tissus, amplifiant la toxicité bien au-delà du plastique seul.",
              },
            },
          ],
        },
      ],
    },
  },
  '/presse': {
    title: 'Presse & Médias — Karim Saari | Photographe Marseille',
    description:
      "Retrouvez les reportages et documentaires (ARTE, France TV) témoignant de nos missions de dépollution et de l'urgence écologique en mer Méditerranée.",
    keywords: 'karim saari presse, dark massilia médias, reportage pollution méditerranée, arte france tv marseille',
    canonical: `${BASE_URL}/presse`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        PERSON_SCHEMA,
        breadcrumb('Presse & Médias', '/presse'),
        {
          '@type': 'CollectionPage',
          name: 'Presse & Médias — Karim Saari',
          description:
            'Couvertures presse et passages TV (ARTE, Échappées Belles, Yann Arthus-Bertrand, Fondation de la Mer) de Karim Saari, apnéiste et défenseur de la Méditerranée.',
          url: `${BASE_URL}/presse/`,
          author: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: 'https://karimsaari.com' },
        },
        // ── ItemList : passages TV & documentaires ───────────────────────────
        // Lie chaque VideoObject à l'entité Karim Saari via mentions/@id
        // → renforce le Knowledge Graph Google (entity linking)
        {
          '@type': 'ItemList',
          name: 'Passages TV & Documentaires — Karim Saari',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': 'VideoObject',
                name: 'Documentaire ARTE — Sauver Marseille (pollution marine)',
                description:
                  'Documentaire ARTE sur la pollution plastique dans les Calanques de Marseille. Karim Saari et Team Oxygen documentent et nettoient les fonds marins.',
                thumbnailUrl: `${BASE_URL}/images/karim-saari-photo-profil-arte-regard-marseille.webp`,
                uploadDate: '2022-01-17T00:00:00+01:00',
                embedUrl: 'https://www.youtube.com/embed/cxjAQtSHHyI',
                contentUrl: 'https://www.youtube.com/watch?v=cxjAQtSHHyI',
                url: `${BASE_URL}/sauver-marseille-documentaire-arte/`,
                publisher: { '@type': 'Organization', name: 'ARTE' },
                mentions: { '@id': `${BASE_URL}/#person` },
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@type': 'VideoObject',
                name: 'Méduses : les souveraines des océans — ARTE Évasion',
                description:
                  'Documentaire ARTE Évasion sur les méduses en Méditerranée. Karim Saari, apnéiste marseillais, témoigne de leur prolifération liée au réchauffement climatique.',
                thumbnailUrl: `${BASE_URL}/images/arte-meduses-souveraines-oceans-documentaire-marseille-2.webp`,
                uploadDate: '2023-06-01T00:00:00+02:00',
                embedUrl: 'https://www.youtube.com/embed/yfebiTFOq7E',
                contentUrl: 'https://www.youtube.com/watch?v=yfebiTFOq7E',
                url: `${BASE_URL}/meduses-souveraines-oceans-documentaire-arte/`,
                publisher: { '@type': 'Organization', name: 'ARTE' },
                mentions: { '@id': `${BASE_URL}/#person` },
              },
            },
            {
              '@type': 'ListItem',
              position: 3,
              item: {
                '@type': 'VideoObject',
                name: 'Échappées Belles — Karim Saari avec Ismaël Khelifa à Marseille',
                description:
                  "Reportage France Télévisions dans l'émission Échappées Belles. Karim Saari guide Ismaël Khelifa et Matthieu Witvoet dans les Calanques de Marseille.",
                thumbnailUrl: `${BASE_URL}/images/karim-saari-marseille-echappees-belles-reportage-television.webp`,
                uploadDate: '2023-04-08T00:00:00+02:00',
                embedUrl: 'https://www.dailymotion.com/embed/video/x8wzsm2',
                contentUrl: 'https://www.dailymotion.com/video/x8wzsm2',
                url: 'https://www.dailymotion.com/video/x8wzsm2',
                publisher: { '@type': 'Organization', name: 'France Télévisions' },
                mentions: { '@id': `${BASE_URL}/#person` },
              },
            },
            {
              '@type': 'ListItem',
              position: 4,
              item: {
                '@type': 'VideoObject',
                name: 'TF1 — Le scandale des décharges sauvages dans les calanques marseillaises',
                description:
                  'Reportage TF1 JT 20h sur la pollution marine dans les Calanques de Marseille. Interview de Karim Saari, apnéiste et sentinelle de la Méditerranée.',
                thumbnailUrl: `${BASE_URL}/images/JT_20H_TF1_video-dechets-ordures-marseille-le-scandale-des-decharges-sauvages-dans-les-calanques-marseillaises-journal_de_tf1_pollution_calanques_calanque_cortiou-karimsaari.webp`,
                uploadDate: '2023-05-28T00:00:00+02:00',
                contentUrl: 'https://www.tf1info.fr/environnement-ecologie/video-dechets-ordures-marseille-le-scandale-des-decharges-sauvages-dans-les-calanques-marseillaises-2258467.html',
                url: 'https://www.tf1info.fr/environnement-ecologie/video-dechets-ordures-marseille-le-scandale-des-decharges-sauvages-dans-les-calanques-marseillaises-2258467.html',
                publisher: { '@type': 'Organization', name: 'TF1 Info' },
                mentions: { '@id': `${BASE_URL}/#person` },
              },
            },
            {
              '@type': 'ListItem',
              position: 5,
              item: {
                '@type': 'VideoObject',
                name: "TF1 — Grève des éboueurs à Marseille : des craintes pour l'environnement",
                description:
                  "Reportage TF1 Info sur l'impact de la grève des éboueurs sur l'environnement marin à Marseille. Témoignage de Karim Saari, apnéiste et photographe.",
                thumbnailUrl: `${BASE_URL}/images/TF1_plongeur_karimsaari_video-greve-des-eboueurs-a-marseille-des-craintes-pour-l-environnement.webp`,
                uploadDate: '2022-09-23T00:00:00+02:00',
                contentUrl: 'https://www.tf1info.fr/environnement-ecologie/video-greve-des-eboueurs-a-marseille-des-craintes-pour-l-environnement-2208213.html',
                url: 'https://www.tf1info.fr/environnement-ecologie/video-greve-des-eboueurs-a-marseille-des-craintes-pour-l-environnement-2208213.html',
                publisher: { '@type': 'Organization', name: 'TF1 Info' },
                mentions: { '@id': `${BASE_URL}/#person` },
              },
            },
            {
              '@type': 'ListItem',
              position: 6,
              item: {
                '@type': 'VideoObject',
                name: 'La Provence — Marseille : 1,4 tonne de déchets sortie des eaux du Frioul',
                description:
                  'Reportage La Provence sur la mission de dépollution du Frioul à Marseille. Karim Saari et les apnéistes de Team Oxygen remontent 1,4 tonne de déchets.',
                thumbnailUrl: `${BASE_URL}/images/laprovence_d%C3%A9pollution_calanques_frioul_marseille_karimsaari_projet_sentinelle.webp`,
                uploadDate: '2024-09-28T00:00:00+02:00',
                contentUrl: 'https://www.laprovence.com/videos/marseille-1-4-tonne-de-dchets-sortie-des-eaux-du-frioul-par-des-apnistes/10321076',
                url: 'https://www.laprovence.com/videos/marseille-1-4-tonne-de-dchets-sortie-des-eaux-du-frioul-par-des-apnistes/10321076',
                publisher: { '@type': 'Organization', name: 'La Provence' },
                mentions: { '@id': `${BASE_URL}/#person` },
              },
            },
          ],
        },
      ],
    },
  },
  '/communaute-calanques': {
    title: 'Groupe Facebook Calanques Marseille — Plus de 65 000 membres',
    description:
      'Plus de 65 000 passionnés des Calanques de Marseille — nature, photo et protection du littoral méditerranéen. La plus grande communauté en ligne, fondée par Karim Saari.',
    keywords: 'groupe facebook calanques marseille, amoureux calanques, communauté calanques en ligne, dark massilia groupe',
    canonical: `${BASE_URL}/communaute-calanques`,
    image: `${BASE_URL}/images/groupe-des-amoureux-des-calanques_1200w.webp`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Groupe Facebook Calanques Marseille', '/communaute-calanques'),
        {
          '@type': 'WebPage',
          '@id': `${BASE_URL}/communaute-calanques`,
          url: `${BASE_URL}/communaute-calanques`,
          name: 'Groupe Facebook Calanques Marseille — Plus de 65 000 membres',
          description:
            'La plus grande communauté en ligne dédiée aux Calanques de Marseille et au littoral méditerranéen. Photos, actions environnementales, randonnées et sensibilisation à la protection de la mer.',
          isPartOf: { '@id': `${BASE_URL}/#website` },
          about: {
            '@type': 'Organization',
            name: 'Amoureux des Calanques de Marseille à Port-Cros',
            url: 'https://www.facebook.com/groups/calanque/',
            foundingDate: '2018',
            founder: {
              '@type': 'Person',
              name: 'Karim Saari',
              url: `${BASE_URL}/`,
            },
            sameAs: 'https://www.facebook.com/groups/calanque/',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Comment rejoindre le groupe Facebook des Calanques de Marseille ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Rendez-vous sur Facebook et cherchez « Amoureux des Calanques de Marseille à Port-Cros », ou cliquez sur le bouton « Rejoindre le groupe » sur cette page. L\'accès est gratuit et ouvert à tous les passionnés du littoral méditerranéen.',
              },
            },
            {
              '@type': 'Question',
              name: 'Combien de membres compte le groupe Calanques ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Le groupe réunit plus de 65 000 membres actifs, ce qui en fait la plus grande communauté en ligne dédiée aux Calanques de Marseille et au littoral de Port-Cros.',
              },
            },
            {
              '@type': 'Question',
              name: 'Quel type de contenu peut-on publier dans le groupe ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Photos de randonnée dans les Calanques, vidéos sous-marines, alertes environnementales, comptes-rendus de dépollution marine, questions sur la faune et la flore méditerranéenne.',
              },
            },
            {
              '@type': 'Question',
              name: 'Le groupe organise-t-il des sorties ou missions de nettoyage ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Le groupe n'organise pas directement de sorties, mais c'est un espace de partage des actions environnementales des différentes associations marseillaises engagées pour la protection du littoral. Team Oxygen et d'autres collectifs y annoncent leurs missions de dépollution, ramassages de déchets et initiatives éco-citoyennes.",
              },
            },
          ],
        },
      ],
    },
  },
  '/communaute': {
    title: 'Bénévolat Dépollution Marseille : Rejoignez Team Oxygen',
    description:
      "Envie d'agir pour la Méditerranée ? Rejoignez notre communauté de 132 000 sentinelles et participez à nos missions de bénévolat écologique à Marseille.",
    keywords: 'bénévolat dépollution marseille, rejoindre team oxygen, volontaire nettoyage mer, communauté calanques',
    canonical: `${BASE_URL}/communaute`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Bénévolat Dépollution Marine Marseille', '/communaute'),
        {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#team-oxygen`,
          name: 'Team Oxygen',
          url: 'https://www.team-oxygen.com/',
          description:
            'Association loi 1901 de dépollution marine en apnée à Marseille. Missions de nettoyage sous-marin dans les Calanques avec des bénévoles de tous niveaux.',
          foundingLocation: {
            '@type': 'Place',
            name: 'Marseille',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Marseille',
              addressRegion: 'Bouches-du-Rhône',
              addressCountry: 'FR',
            },
          },
          member: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
          },
          sameAs: [
            'https://www.facebook.com/EcoPlongeur/',
            'https://www.facebook.com/groups/calanque/',
            'https://www.instagram.com/karimsaari/',
            'https://www.tiktok.com/@dark.massilia',
            'https://www.youtube.com/@dark.massilia',
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: "Puis-je plonger ou faire de l'apnée lors des missions de dépollution ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Non. Pour des raisons de sécurité et d'assurance, les plongées et l'apnée sont strictement réservées aux membres certifiés de l'association Team Oxygen. Les bénévoles extérieurs interviennent exclusivement depuis la surface, en kayak ou depuis le rivage.",
              },
            },
            {
              '@type': 'Question',
              name: "Comment aider concrètement lors d'une mission sans être plongeur ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Plusieurs formes d'aide sont possibles : mettre un kayak ou un bateau à disposition pour accéder aux zones isolées, participer au tri et à la caractérisation des déchets à terre, assurer le transport des sacs vers les filières de recyclage, ou documenter la mission depuis le bord.",
              },
            },
            {
              '@type': 'Question',
              name: 'Comment être prévenu de la prochaine mission de dépollution à Marseille ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Rejoignez le groupe Facebook « Amoureux des Calanques » et suivez @karimsaari sur Instagram. Toutes les dates y sont annoncées en priorité. Vous pouvez aussi nous contacter via la page Contact pour être ajouté à la liste de diffusion.",
              },
            },
            {
              '@type': 'Question',
              name: 'Team Oxygen est-elle une association officielle ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Oui. Team Oxygen est une association loi 1901 dont Karim Saari est président. Les plongées sont encadrées par des membres certifiés couverts par l'assurance associative. Les bénévoles extérieurs interviennent uniquement en surface ou à terre.",
              },
            },
            {
              '@type': 'Question',
              name: "Comment soutenir le mouvement sans pouvoir venir physiquement à une mission ?",
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Le soutien digital est tout aussi précieux : suivez nos comptes, partagez nos posts et réels, commentez, tagguez vos proches sensibles à la cause. Chaque partage touche de nouveaux publics. Vous pouvez aussi soutenir l'association directement sur team-oxygen.com.",
              },
            },
          ],
        },
      ],
    },
  },
  '/sauver-marseille-documentaire-arte': {
    title: 'Documentaire ARTE — Sauver Marseille de la Pollution',
    description:
      'Découvrez le documentaire ARTE Regards sur la pollution à Marseille. Une immersion choc avec Karim Saari et Team Oxygen pour sauver les Calanques.',
    keywords: 'documentaire arte marseille, pollution calanques arte, karim saari arte, sauver marseille documentaire',
    canonical: `${BASE_URL}/sauver-marseille-documentaire-arte`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Documentaire ARTE', '/sauver-marseille-documentaire-arte'),
        PERSON_SCHEMA,
        {
          '@type': 'VideoObject',
          name: 'Documentaire ARTE — Karim Saari, sentinelle de la Méditerranée',
          description:
            "Reportage ARTE 2022 : Karim Saari, apnéiste et photographe sous-marin marseillais, documente et nettoie les fonds des Calanques avec Team Oxygen contre la pollution plastique en Méditerranée.",
          thumbnailUrl: 'https://img.youtube.com/vi/cxjAQtSHHyI/maxresdefault.jpg',
          uploadDate: '2022-06-15T00:00:00+00:00',
          duration: 'PT5M30S',
          embedUrl: 'https://www.youtube.com/embed/cxjAQtSHHyI',
          contentUrl: 'https://www.youtube.com/watch?v=cxjAQtSHHyI',
          url: 'https://www.youtube.com/watch?v=cxjAQtSHHyI',
          publisher: { '@type': 'Organization', name: 'ARTE', url: 'https://www.arte.tv' },
          mentions: { '@id': `${BASE_URL}/#person` },
        },
        {
          '@type': 'NewsArticle',
          headline: 'Pollution : Il faut sauver Marseille et ses Calanques — Karim Saari dans ARTE Regards',
          description: 'Karim Saari, apnéiste et fondateur de Dark Massilia, témoigne dans ce reportage ARTE sur la pollution plastique dans les Calanques de Marseille et les actions de dépollution de Team Oxygen.',
          datePublished: '2022-06-15',
          url: `${BASE_URL}/sauver-marseille-documentaire-arte`,
          publisher: { '@type': 'Organization', name: 'ARTE', url: 'https://www.arte.tv' },
          about: { '@id': `${BASE_URL}/#person` },
          mentions: { '@id': `${BASE_URL}/#person` },
          author: { '@id': `${BASE_URL}/#person` },
        },
      ],
    },
  },
  '/echappees-belles-bouches-du-rhone': {
    title: 'Échappées Belles — Spéciale Verte Bouches-du-Rhône · France 5',
    description:
      'France 5 consacre un épisode d\'Échappées Belles aux acteurs éco-citoyens des Bouches-du-Rhône : Karim Saari, apnéiste et photographe, y présente ses missions de dépollution dans les Calanques de Marseille.',
    keywords: 'échappées belles bouches-du-rhône, france 5 marseille calanques, karim saari france tv, échappée verte marseille',
    canonical: `${BASE_URL}/echappees-belles-bouches-du-rhone`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Échappées Belles — France 5', '/echappees-belles-bouches-du-rhone'),
        PERSON_SCHEMA,
        {
          '@type': 'NewsArticle',
          headline: 'Spéciale Échappée Verte — Les Bouches-du-Rhône en action · France 5',
          description:
            'Karim Saari, photographe environnemental et apnéiste, présente ses missions de dépollution marine dans les Calanques de Marseille dans cet épisode spécial Échappée Verte d\'Échappées Belles sur France 5.',
          datePublished: '2026-05-02',
          url: 'https://www.france.tv/france-5/echappees-belles/saison-18/5875509-speciale-echappee-verte-les-bouches-du-rhone-en-action.html',
          image: `${BASE_URL}/images/échappée_verte_0.jpg`,
          publisher: { '@type': 'Organization', name: 'France Télévisions', url: 'https://www.france.tv' },
          about: { '@id': `${BASE_URL}/#person` },
          mentions: { '@id': `${BASE_URL}/#person` },
        },
      ],
    },
  },
  '/meduses-souveraines-oceans-documentaire-arte': {
    title: 'Méduses Souveraines des Océans — ARTE · Karim Saari',
    description:
      'Documentaire ARTE Évasion (2024) : plongez dans la prolifération des méduses en Méditerranée. Avec les images exclusives de Karim Saari, apnéiste à Marseille.',
    keywords: 'méduses souveraines océans documentaire arte, méduses méditerranée, karim saari méduses arte évasion',
    canonical: `${BASE_URL}/meduses-souveraines-oceans-documentaire-arte`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Méduses — Documentaire ARTE', '/meduses-souveraines-oceans-documentaire-arte'),
        PERSON_SCHEMA,
        {
          '@type': 'VideoObject',
          name: 'Méduses | Les souveraines des océans — Documentaire ARTE Évasion',
          description:
            'Documentaire de Sébastien Lafont (France, 2024, 43 min). Explore la prolifération des méduses et la transformation des écosystèmes marins. Images Méditerranée fournies par Karim Saari.',
          thumbnailUrl: 'https://img.youtube.com/vi/yfebiTFOq7E/maxresdefault.jpg',
          uploadDate: '2024-01-01T00:00:00+00:00',
          duration: 'PT43M',
          embedUrl: 'https://www.youtube.com/embed/yfebiTFOq7E',
          contentUrl: 'https://www.youtube.com/watch?v=yfebiTFOq7E',
          url: 'https://youtu.be/yfebiTFOq7E',
          director: { '@type': 'Person', name: 'Sébastien Lafont' },
          publisher: { '@type': 'Organization', name: 'ARTE Évasion', url: 'https://www.arte.tv' },
          mentions: { '@id': `${BASE_URL}/#person` },
        },
        {
          '@type': 'TVEpisode',
          name: 'Méduses | Les souveraines des océans',
          description: 'Documentaire ARTE Évasion explorant la prolifération des méduses en Méditerranée. Karim Saari, apnéiste marseillais de Dark Massilia, fournit les images sous-marines des Calanques.',
          datePublished: '2024-01-01',
          url: `${BASE_URL}/meduses-souveraines-oceans-documentaire-arte`,
          partOfSeries: {
            '@type': 'TVSeries',
            name: 'ARTE Évasion',
            publisher: { '@type': 'Organization', name: 'ARTE', url: 'https://www.arte.tv' },
          },
          director: { '@type': 'Person', name: 'Sébastien Lafont' },
          about: { '@id': `${BASE_URL}/#person` },
          mentions: { '@id': `${BASE_URL}/#person` },
        },
      ],
    },
  },
  '/court-metrage-green-got-mediterranee': {
    title: 'Court-métrage Green-Got — Sous la Méditerranée · Karim Saari',
    description:
      'Court-métrage documentaire de la Fondation Green-Got tourné en apnée au large de Marseille. Karim Saari y documente une décharge sous-marine et la pollution plastique de la Méditerranée.',
    keywords: 'green-got documentaire, fondation green-got méditerranée, court-métrage pollution plastique marseille, karim saari green got, décharge sous-marine méditerranée',
    canonical: `${BASE_URL}/court-metrage-green-got-mediterranee`,
    image: `${BASE_URL}/images/Karim%20saari%20green%20got%207.jpg`,
    imageAlt: 'Karim Saari sur un ponton du Vieux-Port de Marseille, Notre-Dame de la Garde en fond — court-métrage de la Fondation Green-Got',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Court-métrage Green-Got', '/court-metrage-green-got-mediterranee'),
        PERSON_SCHEMA,
        {
          '@type': 'VideoObject',
          name: 'Sous la Méditerranée — Court-métrage documentaire de la Fondation Green-Got',
          description:
            "Court-métrage documentaire produit par la Fondation Green-Got, tourné en apnée et au large de Marseille. Avec Karim Saari (Team Oxygen), Nicolas Camo (Wings of the Ocean) et Anne-Leila Meistertzheim (Plastic At Sea), il documente une décharge sous-marine et la pollution plastique de la mer Méditerranée — la mer la plus polluée au monde.",
          thumbnailUrl: 'https://img.youtube.com/vi/BoqO1LVcx5A/maxresdefault.jpg',
          uploadDate: '2026-06-11T00:00:00+00:00',
          embedUrl: 'https://www.youtube.com/embed/BoqO1LVcx5A',
          contentUrl: 'https://www.youtube.com/watch?v=BoqO1LVcx5A',
          url: 'https://www.youtube.com/watch?v=BoqO1LVcx5A',
          publisher: { '@type': 'Organization', name: 'Fondation Green-Got', url: 'https://fondation.green-got.com/' },
          actor: [
            { '@id': `${BASE_URL}/#person` },
            { '@type': 'Person', name: 'Nicolas Camo' },
            { '@type': 'Person', name: 'Anne-Leila Meistertzheim' },
          ],
          mentions: { '@id': `${BASE_URL}/#person` },
        },
      ],
    },
  },
  '/blog': {
    title: 'Blog — Missions Dépollution Marine · Dark Massilia',
    description:
      'Suivez les dernières actions de dépollution de Team Oxygen en Méditerranée. Reportages, rencontres et coups de cœur depuis les Calanques de Marseille.',
    keywords: 'blog dépollution marine, actualités calanques marseille, missions team oxygen, dark massilia blog',
    canonical: `${BASE_URL}/blog`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Actualités', '/blog'),
        {
          '@type': 'Blog',
          name: 'Blog Dark Massilia — Actualités Méditerranée',
          description:
            'Journal de bord des missions de dépollution marine menées par Karim Saari et Team Oxygen dans les Calanques de Marseille.',
          url: `${BASE_URL}/blog/`,
          author: { '@id': `${BASE_URL}/#person` },
          publisher: {
            '@type': 'Organization',
            name: 'Dark Massilia',
            url: BASE_URL,
          },
          inLanguage: 'fr-FR',
          blogPost: [
            {
              '@type': 'BlogPosting',
              headline: 'City Nature Challenge 2026 : relevez le défi de la biodiversité avec Marseille',
              url: `${BASE_URL}/blog/city-nature-challenge-2026-relevez-le-defi-de-la-biodiversite-avec-marseille`,
              datePublished: '2026-04-19',
              dateModified: '2026-04-19',
              author: { '@id': `${BASE_URL}/#person` },
              image: `${BASE_URL}/images/biodiversite-calanques-marseille-1.webp`,
            },
            {
              '@type': 'BlogPosting',
              headline: 'Alerte dans les Calanques : l\'invasion silencieuse de l\'algue Rugulopteryx okamurae',
              url: `${BASE_URL}/blog/alerte-dans-les-calanques-linvasion-silencieuse-de-lalgue-rugulopteryx-okamurae`,
              datePublished: '2026-04-12',
              dateModified: '2026-04-12',
              author: { '@id': `${BASE_URL}/#person` },
              image: `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-fonds-marins.webp`,
            },
            {
              '@type': 'BlogPosting',
              headline: 'La Posidonie, notre meilleure arme sous-marine contre le changement climatique',
              url: `${BASE_URL}/blog/la-posidonie-notre-meilleure-arme-sous-marine-contre-le-changement-climatique`,
              datePublished: '2026-04-12',
              dateModified: '2026-04-12',
              author: { '@id': `${BASE_URL}/#person` },
              image: `${BASE_URL}/images/posidonie-calanque-sormiou-marseille.webp`,
            },
            {
              '@type': 'BlogPosting',
              headline: 'Dépollution au J4 : quand Plastic Odyssey réunit Marseille pour nettoyer ce qui se cache sous la surface',
              url: `${BASE_URL}/blog/depollution-au-j4-quand-plastic-odyssey-reunit-marseille-pour-nettoyer-ce-qui-se-cache-sous-la-surface`,
              datePublished: '2026-04-12',
              dateModified: '2026-04-12',
              author: { '@id': `${BASE_URL}/#person` },
              image: `${BASE_URL}/images/marseille-karimsaari-depollution-marine-dark-massilia-2.webp`,
            },
            {
              '@type': 'BlogPosting',
              headline: 'Méditerranée rouge sur le plastique : pourquoi il est urgent d\'agir',
              url: `${BASE_URL}/blog/mediterranee-rouge-sur-le-plastique-et-pourquoi-il-est-urgent-dagir`,
              datePublished: '2026-04-12',
              dateModified: '2026-04-12',
              author: { '@id': `${BASE_URL}/#person` },
              image: `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-soupe-plastique.webp`,
            },
          ],
        },
      ],
    },
  },
  // ✅  /actualites — page enrichie : fil @dark_massilia + RSS officiel Parc National des Calanques
  // Contenu substantiel double source → indexable.
  '/actualites': {
    title: 'Actualités Calanques — Parc National & Dark Massilia',
    description:
      'Actualités officielles du Parc National des Calanques et alertes terrain de @dark_massilia. Dépollution marine, biodiversité et protection de la Méditerranée.',
    keywords: 'actualités calanques, parc national calanques news, dark massilia actualités, dépollution marine news',
    canonical: `${BASE_URL}/actualites`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Actualités', '/actualites'),
        {
          '@type': 'CollectionPage',
          name: 'Actualités Calanques — Parc National & Dark Massilia',
          url: `${BASE_URL}/actualites`,
          description: 'Actualités officielles du Parc National des Calanques et alertes terrain de @dark_massilia. Dépollution marine, biodiversité et protection de la Méditerranée.',
          publisher: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
          },
          about: {
            '@type': 'Place',
            name: 'Parc National des Calanques',
            url: 'https://www.calanques-parcnational.fr',
            geo: { '@type': 'GeoCoordinates', latitude: 43.2137, longitude: 5.4313 },
          },
        },
      ],
    },
  },
  '/local-guide-marseille': {
    title: 'Google Local Guide à Marseille | Karim Saari',
    description:
      'Suivez mes contributions en tant que Google Local Guide à Marseille. Plus de 143 millions de vues pour valoriser notre patrimoine naturel.',
    keywords: 'google local guide marseille, karim saari google maps, google street view trusted marseille',
    canonical: `${BASE_URL}/local-guide-marseille`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Google Local Guides', '/local-guide-marseille'),
        {
          '@type': 'ProfilePage',
          name: 'Google Local Guides — Karim Saari',
          url: `${BASE_URL}/local-guide-marseille/`,
          description:
            'Profil Google Local Guides Niveau 10 de Karim Saari — contributeur actif depuis 9 ans, certifié Street View Trusted, 22 000+ contributions sur les Calanques de Marseille.',
          mainEntity: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
            sameAs: [
              'https://www.google.com/maps/contrib/114912564832630219145/photos',
              'https://www.instagram.com/karimsaari',
              'https://www.linkedin.com/in/karimsaari',
            ],
            hasCredential: [
              {
                '@type': 'EducationalOccupationalCredential',
                name: 'Google Street View Trusted',
                credentialCategory: 'certification',
                recognizedBy: {
                  '@type': 'Organization',
                  name: 'Google',
                  url: 'https://www.google.com',
                },
              },
              {
                '@type': 'EducationalOccupationalCredential',
                name: 'Google Local Guides — Niveau 10',
                credentialCategory: 'badge',
                recognizedBy: {
                  '@type': 'Organization',
                  name: 'Google Maps',
                  url: 'https://maps.google.com',
                },
              },
            ],
            knowsAbout: [
              'Cartographie 360° Calanques de Marseille',
              'Street View Trusted',
              'Google Maps contribution',
              'Documentation environnementale méditerranéenne',
            ],
          },
        },
      ],
    },
  },
  '/contact': {
    title: 'Contact — Photographe Marseille | Karim Saari',
    description:
      'Photographe environnemental & sous-marin à Marseille. Collaboration documentaire, exposition ou dépollution marine — contactez Karim Saari (Dark Massilia).',
    keywords: 'contact photographe marseille, karim saari contact, collaboration documentaire, exposition photo marseille',
    canonical: `${BASE_URL}/contact`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Contact & Partenariats', '/contact'),
        {
          '@type': 'LocalBusiness',
          additionalType: 'https://schema.org/ProfessionalService',
          '@id': `${BASE_URL}/#business`,
          name: 'Karim Saari — Photographe Environnemental & Sous-Marin Marseille',
          url: `${BASE_URL}/`,
          email: 'contact@karimsaari.com',
          telephone: '+33695331301',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '168 CHE DE MORGIOU',
            addressLocality: 'MARSEILLE',
            postalCode: '13009',
            addressCountry: 'FR',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 43.2965,
            longitude: 5.3698,
          },
          hasMap: 'https://maps.app.goo.gl/UaF5o6sM2xS5Gaxr6',
          sameAs: [
            'https://maps.app.goo.gl/UaF5o6sM2xS5Gaxr6',
            'https://share.google/VAnA0t89Jy0AaR0zC',
            'https://www.instagram.com/karimsaari',
            'https://www.facebook.com/EcoPlongeur/',
            'https://www.facebook.com/groups/calanque/',
            'https://www.tiktok.com/@dark.massilia',
            'https://www.youtube.com/@dark.massilia',
            'https://www.team-oxygen.com/',
          ],
          founder: {
            '@type': 'Person',
            name: 'Karim Saari',
            url: `${BASE_URL}/`,
          },
        },
      ],
    },
  },
  '/les-francais-yann-arthus-bertrand': {
    title: 'Les Français de Yann Arthus-Bertrand — Marseille',
    description:
      'En 2024, Yann Arthus-Bertrand a photographié Team Oxygen pour son projet « Les Français ». Portrait de l\'engagement de Karim Saari pour la Méditerranée.',
    keywords: 'yann arthus-bertrand les français, team oxygen yann arthus-bertrand, karim saari portrait marseille',
    canonical: `${BASE_URL}/les-francais-yann-arthus-bertrand`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Les Français — Yann Arthus-Bertrand', '/les-francais-yann-arthus-bertrand'),
        {
          '@type': 'ImageObject',
          name: 'Team Oxygen — Portrait par Yann Arthus-Bertrand, Marseille 2024',
          description:
            'Portrait de Team Oxygen réalisé par Yann Arthus-Bertrand en 2024 à Marseille pour le projet photographique « Les Français ».',
          contentUrl: `${BASE_URL}/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp`,
          url: `${BASE_URL}/les-francais-yann-arthus-bertrand/`,
          creator: {
            '@type': 'Person',
            name: 'Yann Arthus-Bertrand',
            url: 'https://www.yabstudio.fr',
          },
          copyrightHolder: { '@type': 'Person', name: 'Yann Arthus-Bertrand' },
          copyrightYear: 2024,
          creditText: '© Yann Arthus-Bertrand',
          about: {
            '@type': 'Organization',
            name: 'Team Oxygen',
            url: 'https://www.team-oxygen.com/',
          },
        },
      ],
    },
  },
  '/acces-massifs-calanques': {
    title: 'Accès Massifs Calanques | Risque Incendie en temps réel',
    description:
      'Carte officielle du risque incendie dans les Bouches-du-Rhône. Consultez l\'accès aux massifs forestiers des Calanques avant toute sortie.',
    keywords: 'accès massifs calanques, risque incendie bouches-du-rhône, calanques ouverture fermeture, massifs forestiers marseille',
    canonical: `${BASE_URL}/acces-massifs-calanques`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Accès Massifs Forestiers — Risque Incendie', '/acces-massifs-calanques'),
        {
          '@type': 'WebPage',
          name: 'Accès aux massifs forestiers des Calanques — Carte risque incendie',
          description:
            'Carte interactive officielle du risque incendie pour les massifs forestiers des Bouches-du-Rhône, mise à jour quotidiennement par la DFCI.',
          url: `${BASE_URL}/acces-massifs-calanques`,
          isPartOf: { '@id': `${BASE_URL}/#website` },
        },
        {
          '@type': 'WebApplication',
          name: 'Carte accès massifs forestiers Calanques — Risque incendie en temps réel',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'All',
          url: `${BASE_URL}/acces-massifs-calanques`,
          description:
            'Outil cartographique officiel de la DFCI Bouches-du-Rhône affichant en temps réel les conditions d\'accès aux massifs forestiers : Calanques, Marseilleveyre, Côte Bleue. Ouverture ou fermeture selon le niveau de risque incendie du jour.',
          featureList: [
            'Risque incendie en temps réel',
            'Ouverture et fermeture des massifs',
            'Calanques de Marseille',
            'Côte Bleue',
            'Massif de Marseilleveyre',
            'Données DFCI Bouches-du-Rhône',
          ].join(', '),
          provider: {
            '@type': 'GovernmentOrganization',
            name: 'DFCI Bouches-du-Rhône — opendfci.fr',
            url: 'https://opendfci.fr/13',
          },
          audience: {
            '@type': 'Audience',
            audienceType: 'Randonneurs, plongeurs, apnéistes et visiteurs des Calanques de Marseille',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Quand les massifs forestiers des Bouches-du-Rhône sont-ils soumis à une réglementation d\'accès ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Du 1er juin au 30 septembre inclus, l\'accès, la présence et la circulation dans les massifs forestiers font l\'objet d\'une réglementation spécifique définie par l\'arrêté préfectoral du 22 avril 2025. En dehors de cette période, l\'accès est libre mais la vigilance reste de mise toute l\'année, notamment lors de vagues de chaleur printanières ou automnales.',
              },
            },
            {
              '@type': 'Question',
              name: 'Les Calanques de Marseille peuvent-elles fermer pour risque incendie ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Oui. Le Parc National des Calanques, le massif de Marseilleveyre et la Côte Bleue sont soumis à la réglementation préfectorale des massifs forestiers. Chaque jour, selon le niveau de risque évalué par Météo France, la préfecture des Bouches-du-Rhône peut restreindre ou interdire l\'accès à tout ou partie de ces secteurs. La carte officielle de la DFCI est mise à jour quotidiennement.',
              },
            },
            {
              '@type': 'Question',
              name: 'Pourquoi les Bouches-du-Rhône sont-elles particulièrement exposées au risque incendie ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Les Bouches-du-Rhône constituent le département le plus exposé au risque feu de forêt en France métropolitaine. Cette vulnérabilité est liée à un cumul de facteurs : étés chauds et secs, mistral qui accélère la propagation des flammes, végétation de garrigue et de pins d\'Alep très inflammable, et forte densité de population. On dénombre environ 250 départs de feux par an dans le département, pour une surface brûlée d\'environ 1 900 hectares annuels, dont près de 90 % sont d\'origine humaine.',
              },
            },
            {
              '@type': 'Question',
              name: 'Quels comportements sont interdits dans les massifs en période à risque ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'En période de risque élevé, il est interdit de fumer, d\'allumer un feu ou un barbecue, de faire fonctionner des engins thermiques, d\'effectuer des travaux de débroussaillement ou tout autre travail générant des étincelles. Ces interdictions s\'appliquent aussi bien aux professionnels qu\'aux particuliers à proximité des massifs forestiers.',
              },
            },
            {
              '@type': 'Question',
              name: 'Comment vérifier si les Calanques sont ouvertes avant de partir ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'La méthode la plus fiable est de consulter la carte interactive de la DFCI Bouches-du-Rhône (opendfci.fr/13) ou le site risque-prevention-incendie.fr/13, tous deux mis à jour chaque matin. La page karimsaari.com/acces-massifs-calanques intègre directement la carte officielle et affiche en temps réel l\'état des massifs.',
              },
            },
            {
              '@type': 'Question',
              name: 'Team Oxygen peut-elle organiser des missions de dépollution en période de fermeture des massifs ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Non. Avant chaque mission de dépollution sous-marine dans les Calanques, Team Oxygen vérifie systématiquement l\'état d\'accès aux massifs. En cas de fermeture préfectorale, les sorties terrestres et les mises à l\'eau depuis les calanques sont annulées ou reportées. La sécurité des bénévoles et le respect de la réglementation sont non négociables.',
              },
            },
          ],
        },
      ],
    },
  },
  '/carte-photos': {
    title: 'Carte des photos — Lieux de prise de vue | Karim Saari',
    description:
      'Carte interactive des lieux de prise de vue de Karim Saari : paysages de Provence et Méditerranée, photographie sous-marine dans les Calanques de Marseille.',
    canonical: `${BASE_URL}/carte-photos`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Carte des photos', '/carte-photos'),
        {
          '@type': 'WebApplication',
          name: 'Carte interactive des photos — Karim Saari',
          description:
            'Carte des lieux de prise de vue de Karim Saari : photographies de paysages (Provence, littoral méditerranéen) et photographie sous-marine (Calanques de Marseille).',
          url: `${BASE_URL}/carte-photos`,
          applicationCategory: 'PhotographyApplication',
          operatingSystem: 'All',
          browserRequirements: 'Requires JavaScript',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          author: { '@id': `${BASE_URL}/#person` },
        },
      ],
    },
  },

  '/carte-calanques': {
    title: 'Carte Interactive des Calanques | Karim Saari',
    description:
      'Explorez la carte interactive des Calanques de Marseille. Localisez nos zones de dépollution avec Team Oxygen et découvrez la biodiversité à protéger.',
    canonical: `${BASE_URL}/carte-calanques`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Carte Interactive des Calanques', '/carte-calanques'),
        {
          '@type': 'WebApplication',
          name: 'Carte interactive des Calanques de Marseille — Dépollution & Biodiversité',
          description:
            "Carte interactive des zones de dépollution marine menées par Team Oxygen et des sites de photographie documentaire dans les Calanques de Marseille. Spots couverts : Sormiou, Morgiou, Sugiton, En-Vau, Callelongue, Cap Croisette, Archipel du Frioul.",
          url: `${BASE_URL}/carte-calanques`,
          applicationCategory: 'EnvironmentalApplication',
          operatingSystem: 'All',
          browserRequirements: 'Requires JavaScript',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          author: { '@id': `${BASE_URL}/#person` },
          about: {
            '@type': 'Place',
            name: 'Parc national des Calanques',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 43.2148,
              longitude: 5.4197,
            },
            containedInPlace: {
              '@type': 'AdministrativeArea',
              name: 'Marseille',
              addressRegion: 'Bouches-du-Rhône',
              addressCountry: 'FR',
            },
          },
        },
        {
          '@type': 'LandmarksOrHistoricalBuildings',
          name: 'Parc national des Calanques',
          description:
            "Parc national français créé en 2012, couvrant 20 km de côte entre Marseille et La Ciotat. Abrite plus de 140 espèces de poissons et des herbiers de posidonie protégés.",
          url: 'https://www.calanques-parcnational.fr',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 43.2148,
            longitude: 5.4197,
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Marseille',
            addressRegion: 'Bouches-du-Rhône',
            addressCountry: 'FR',
          },
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: 'Marseille',
            addressCountry: 'FR',
          },
        },
      ],
    },
  },

  '/photographe-environnemental-marseille': {
    title: 'Photographe Environnement Marseille | Karim Saari — Dark Massilia',
    description:
      'Karim Saari, photographe environnement et sous-marin à Marseille. Photographie et dépollution des Calanques depuis 2018. 132 000 personnes engagées.',
    keywords: 'photographe environnement marseille, photographe environnemental marseille, karim saari, dark massilia, photographe sous-marin calanques, dépollution marine, projet sentinelle',
    image: `${BASE_URL}/images/Karimsaari-portfolio-sous-marin-paysages-calanques-marseille-photographie-photographe-environnemental.webp`,
    canonical: `${BASE_URL}/photographe-environnemental-marseille`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Photographe Environnemental Marseille', '/photographe-environnemental-marseille'),
        {
          '@type': 'ProfilePage',
          '@id': `${BASE_URL}/photographe-environnemental-marseille`,
          name: 'Photographe Environnemental à Marseille — Karim Saari',
          description:
            'Page de présentation de Karim Saari, photographe environnemental et sous-marin à Marseille, fondateur de Dark Massilia et président de Team Oxygen.',
          mainEntity: { '@id': `${BASE_URL}/#person` },
          about: { '@id': `${BASE_URL}/#person` },
          url: `${BASE_URL}/photographe-environnemental-marseille`,
        },
        PERSON_SCHEMA,
        {
          '@type': 'NewsArticle',
          headline: 'Karim Saari, Sentinelle des Calanques : dépollution marine en apnée à Marseille',
          publisher: { '@type': 'Organization', name: 'ARTE', url: 'https://www.arte.tv' },
          url: `${BASE_URL}/sauver-marseille-documentaire-arte`,
          datePublished: '2022-06-15',
          about: { '@id': `${BASE_URL}/#person` },
          mentions: { '@id': `${BASE_URL}/#person` },
        },
        {
          '@type': 'NewsArticle',
          headline: 'Team Oxygen nettoie les fonds des Calanques de Marseille — Projet Sentinelle',
          publisher: { '@type': 'Organization', name: 'TF1', url: 'https://www.tf1.fr' },
          datePublished: '2023-01-01',
          about: { '@id': `${BASE_URL}/#person` },
          mentions: { '@id': `${BASE_URL}/#person` },
        },
        {
          '@type': 'NewsArticle',
          headline: 'Zone Interdite M6 — Dépollution marine Méditerranée, Karim Saari Dark Massilia',
          publisher: { '@type': 'Organization', name: 'M6', url: 'https://www.m6.fr' },
          datePublished: '2023-01-01',
          about: { '@id': `${BASE_URL}/#person` },
          mentions: { '@id': `${BASE_URL}/#person` },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Qu\'est-ce qu\'un photographe environnement ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Un photographe environnement — aussi appelé photographe environnemental — documente les écosystèmes naturels, la faune, la flore et les impacts humains sur la nature. À Marseille, Karim Saari combine photographie sous-marine en apnée et photographie de paysages pour témoigner de l\'état des Calanques et de la Méditerranée.',
              },
            },
            {
              '@type': 'Question',
              name: 'Que documente Karim Saari dans les Calanques de Marseille ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Karim Saari documente la biodiversité sous-marine des Calanques, la pollution plastique des fonds marins méditerranéens et les missions de dépollution en apnée menées par l\'association Team Oxygen dans le cadre du Projet Sentinelle. Ses images ont été diffusées sur TF1, ARTE et M6.',
              },
            },
            {
              '@type': 'Question',
              name: 'Comment contacter Karim Saari pour un reportage ou une collaboration ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Karim Saari est disponible pour des collaborations documentaires, institutionnelles ou médiatiques. Vous pouvez le contacter via la page contact de son site karimsaari.com ou par email à contact@karimsaari.com.',
              },
            },
            {
              '@type': 'Question',
              name: 'Qu\'est-ce que le Projet Sentinelle ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Le Projet Sentinelle est une opération annuelle de dépollution sous-marine organisée par l\'association Team Oxygen, présidée par Karim Saari. Depuis 2022, quatre éditions ont permis de collecter plus de 5 700 kg de déchets dans les Calanques, l\'Archipel du Frioul et la Côte Bleue.',
              },
            },
            {
              '@type': 'Question',
              name: 'Quelles institutions soutiennent le travail de Karim Saari ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Le travail de Karim Saari et de Team Oxygen est soutenu par le Parc National des Calanques, la Fondation de la Mer, Citeo et la Ville de Marseille. Il collabore également avec de nombreuses associations environnementales locales : Boud\'mer, Clean My Calanques, Association Merveille, 1 Déchet Par Jour, Team AVA, Sauvage Méditerranée et Mer Terre.',
              },
            },
          ],
        },
      ],
    },
  },

  '/dossier-presse': {
    title: 'Dossier Presse — Karim Saari | Dark Massilia · Photographe Marseille',
    description: 'Ressources presse de Karim Saari : biographie, angles rédactionnels, visuels HD, statistiques et contact direct. Photographe sous-marin, dépollution marine, Calanques de Marseille.',
    keywords: 'dossier presse photographe marseille, karim saari presse, dark massilia contact presse, kit média dépollution marine',
    canonical: `${BASE_URL}/dossier-presse`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Dossier Presse', '/dossier-presse'),
        PERSON_SCHEMA,
        {
          '@type': 'WebPage',
          name: 'Dossier Presse — Karim Saari · Dark Massilia',
          description: 'Page de ressources presse pour journalistes, réalisateurs et institutions souhaitant couvrir le travail de Karim Saari, photographe environnemental et sous-marin à Marseille.',
          url: `${BASE_URL}/dossier-presse`,
          about: { '@id': `${BASE_URL}/#person` },
          audience: { '@type': 'Audience', audienceType: 'Journalistes, Réalisateurs, Institutions' },
        },
      ],
    },
  },

  '/plan-du-site': {
    title: 'Plan du site | Karim Saari — Dark Massilia',
    description:
      'Naviguez dans l\'univers de karimsaari.com : portfolio, missions de dépollution, médias et blog de Karim Saari, photographe sous-marin à Marseille.',
    noindex: true,
    robots: 'noindex, follow',
    canonical: `${BASE_URL}/plan-du-site`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Plan du site', '/plan-du-site'),
      ],
    },
  },
};
