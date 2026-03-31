// ============================================================
// SEO CONFIG — Dark Massilia · karimsaari.com
// Mapping centralisé : route → title + description + canonical + schema
// Utilise le hoisting natif React 19 (pas de librairie tierce)
// ============================================================

const BASE_URL = 'https://karimsaari.com';
const DEFAULT_IMAGE = `${BASE_URL}/assets/og-social-card.jpg`;
const SITE_NAME = 'Dark Massilia';
const TWITTER_HANDLE = '@dark_massilia';

export const DEFAULT_SEO = {
  title: 'Dark Massilia · Karim Saari · Sentinelle des Calanques',
  description:
    'Karim Saari, photographe et apnéiste marseillais, documente et nettoie les fonds marins des Calanques avec Team Oxygen.',
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
  jobTitle: ['Photographe de paysages à Marseille', 'Photographe environnemental à Marseille', 'Apnéiste', 'Expert environnemental'],
  description:
    'Photographe environnemental à Marseille, apnéiste engagé et photographe de paysages salué par National Geographic. Interventions sur TF1, ARTE et Échappées Belles.',
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
    'https://www.dailymotion.com/video/x8wzsm2',
    'https://www.facebook.com/Photographie.Marseille',
    'https://www.facebook.com/groups/calanque/',
    'https://www.linkedin.com/in/karimsaari/',
    'https://500px.com/p/karimsaari?view=photos',
    'https://fr.pinterest.com/Photographie_Marseille/',
    'https://www.google.com/maps/contrib/114953930403565163435',
    'https://www.tf1info.fr/environnement-ecologie/video-greve-des-eboueurs-a-marseille-des-craintes-pour-l-environnement-2208213.html',
    'https://www.tf1info.fr/environnement-ecologie/video-le-scandale-des-decharges-sauvages-dans-les-calanques-marseillaises-2258525.html',
    'https://www.laprovence.com/video/marseille-14-tonne-de-dechets-sortie-des-eaux-du-frioul-par-des-apneistes/14871',
    'https://www.laprovence.com/article/region/1865431/le-vieux-port-de-marseille-nettoye-par-des-apneistes',
    'https://www.midilibre.fr/2024/04/02/une-maree-bleue-pourquoi-des-milliers-de-meduses-recouvrent-elles-le-littoral-a-marseille-11865324.php',
    'https://www.zero-dechet-sauvage.org/structures/dark-massilia',
    'https://www.wikidata.org/wiki/Q138808583',
  ],
  knowsAbout: [
    'Protection de l\'environnement',
    'Photographie environnementale',
    'Photographie sous-marine',
    'Dépollution marine',
    'Calanques de Marseille',
  ],
  memberOf: {
    '@type': 'Organization',
    name: 'Team Oxygen',
    url: 'https://www.team-oxygen.com/',
  },
  sponsor: [
    { '@type': 'GovernmentOrganization', name: 'Parc national des Calanques' },
    { '@type': 'Organization', name: 'Fondation de la Mer' },
    { '@type': 'Organization', name: 'Citeo' },
    { '@type': 'GovernmentOrganization', name: 'Ville de Marseille' },
  ],
};

// ── Helper : BreadcrumbList Schema.org ──────────────────────
const breadcrumb = (name, path) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name, item: `${BASE_URL}${path}` },
  ],
});

export const SEO_PAGES = {
  '/': {
    title: 'Karim Saari — Photographe & Sentinelle des Calanques',
    description:
      "Karim Saari, photographe et Sentinelle des Calanques de Marseille. Découvrez mes clichés sous-marins et mon engagement pour protéger la Méditerranée.",
    canonical: `${BASE_URL}/`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        PERSON_SCHEMA,
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
          ],
        },
      ],
    },
  },
  '/depollution-marine': {
    title: 'Dépollution Marine Marseille — Team Oxygen | Karim Saari',
    description:
      'Team Oxygen, association de dépollution marine à Marseille. Depuis 2022, 5 724 kg de déchets extraits des Calanques en apnée — Opération Sentinelle.',
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
            jobTitle: 'Président — Apnéiste & Photographe engagé',
          },
          sameAs: [
            'https://www.instagram.com/karimsaari/',
            'https://www.facebook.com/groups/calanque/',
            'https://www.tiktok.com/@dark.massilia',
            'https://www.youtube.com/@dark.massilia',
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
      ],
    },
  },
  '/videos': {
    title: 'Vidéos — Dépollution en Méditerranée | Karim Saari',
    description:
      "Visionnez mes documentaires et reportages d'action en immersion. Plongez au cœur des missions de dépollution marine en Méditerranée.",
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
    title: 'Photographe Sous-Marin Marseille — Galerie | Karim Saari',
    description:
      'Galerie de 58 photographies sous-marines de missions de dépollution en apnée dans les Calanques de Marseille — Projet Sentinelle, Team Oxygen.',
    canonical: `${BASE_URL}/photographie-sous-marine`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Photographe Sous-Marin — Galerie', '/photographie-sous-marine'),
        {
          '@type': 'ImageGallery',
          name: '58 Photos de Missions Sous-Marines — Projet Sentinelle',
          description:
            'Galerie de 58 photographies sous-marines prises lors des missions de dépollution en apnée de Team Oxygen dans les Calanques de Marseille (2022-2025).',
          url: `${BASE_URL}/photographie-sous-marine`,
          creator: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
          },
          about: [
            { '@type': 'Thing', name: 'Dépollution marine' },
            { '@type': 'Thing', name: 'Photographie sous-marine' },
            { '@type': 'Thing', name: 'Calanques de Marseille' },
          ],
        },
        {
          '@type': 'ImageObject',
          name: 'Apnéiste en mission de dépollution — Projet Sentinelle Marseille',
          description:
            "Apnéiste de Team Oxygen en pleine extraction de déchets sur les fonds marins des Calanques — Projet Sentinelle.",
          caption: "Apnéiste de Team Oxygen en pleine extraction de déchets sur les fonds marins des Calanques — Projet Sentinelle.",
          contentUrl: `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-apneiste.webp`,
          url: `${BASE_URL}/photographie-sous-marine`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Environnemental', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2023,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          name: 'Poulpe sur fonds marins des Calanques — Projet Sentinelle',
          description:
            "Poulpe observé en apnée lors d'une mission de dépollution de Team Oxygen dans les Calanques de Marseille.",
          caption: "Poulpe observé en apnée lors d'une mission de dépollution de Team Oxygen dans les Calanques de Marseille.",
          contentUrl: `${BASE_URL}/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-poulpe.webp`,
          url: `${BASE_URL}/photographie-sous-marine`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Environnemental', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2024,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
      ],
    },
  },
  '/photographie-paysage-mer': {
    title: 'Photographe Paysage Marseille | Calanques & Méditerranée',
    description:
      'Galerie photo de paysages des Calanques de Marseille, Méditerranée et Provence. Lumière naturelle, apnée, nature sauvage. Par le photographe Karim Saari.',
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
        // ImageObjects représentatifs — déclenchent les rich results Google Images
        {
          '@type': 'ImageObject',
          name: 'Photographe paysages Marseille — Calanque En-Vau vue aérienne — Karim Saari',
          description: "Karim Saari, photographe paysages à Marseille, capture la calanque d'En-Vau depuis les airs — eaux turquoise et falaises calcaires blanches des Calanques.",
          caption: "Karim Saari, photographe paysages à Marseille, capture la calanque d'En-Vau depuis les airs — eaux turquoise et falaises calcaires blanches des Calanques.",
          contentUrl: `${BASE_URL}/images/portfolio/Mer/karim-saari-marseille-en-vau-aerien-calanque-falaises.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2023,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          name: 'Photographe paysages Marseille — Panoramique Calanques Notre-Dame-de-la-Garde — Karim Saari',
          description: "Vue panoramique des Calanques de Marseille avec Notre-Dame-de-la-Garde en arrière-plan, photographiée par Karim Saari, photographe paysages environnemental à Marseille.",
          caption: "Vue panoramique des Calanques de Marseille avec Notre-Dame-de-la-Garde en arrière-plan, photographiée par Karim Saari, photographe paysages environnemental à Marseille.",
          contentUrl: `${BASE_URL}/images/portfolio/Mer/karim-saari-marseille-panoramique-calanques-notre-dame-garde.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2023,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          name: 'Photographe paysages Marseille — Coucher de soleil calanque plage de galets — Karim Saari',
          description: "Karim Saari, photographe paysages à Marseille, capture un coucher de soleil doré sur une calanque aux eaux turquoise et plage de galets des Calanques.",
          caption: "Karim Saari, photographe paysages à Marseille, capture un coucher de soleil doré sur une calanque aux eaux turquoise et plage de galets des Calanques.",
          contentUrl: `${BASE_URL}/images/portfolio/Mer/karim-saari-marseille-coucher-soleil-calanque-plage-galets.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2023,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          name: 'Photographe paysages Marseille — Calanque de Sormiou eau turquoise — Karim Saari',
          description: "Paysage de la calanque de Sormiou, eaux turquoise et falaises calcaires, photographié par Karim Saari, photographe paysages et environnemental à Marseille.",
          caption: "Paysage de la calanque de Sormiou, eaux turquoise et falaises calcaires, photographié par Karim Saari, photographe paysages et environnemental à Marseille.",
          contentUrl: `${BASE_URL}/images/portfolio/Mer/karim-saari-marseille-paysage-calanque-sormiou-eau-turquoise.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2023,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          name: 'Photographe paysages Marseille — Falaises calcaires calanque coucher de soleil — Karim Saari',
          description: "Falaises calcaires des Calanques de Marseille au coucher du soleil, photographiées par Karim Saari, photographe paysages environnemental basé à Marseille.",
          caption: "Falaises calcaires des Calanques de Marseille au coucher du soleil, photographiées par Karim Saari, photographe paysages environnemental basé à Marseille.",
          contentUrl: `${BASE_URL}/images/portfolio/Mer/karim-saari-marseille-falaises-calcaires-calanque-coucher-soleil.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2024,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        // Provence
        {
          '@type': 'ImageObject',
          name: 'Photographe paysages Provence — Champ de lavande Valensole coucher de soleil — Karim Saari',
          description: "Rangées de lavande de Valensole au coucher du soleil, photographiées par Karim Saari, photographe paysages basé à Marseille spécialisé en nature et Provence.",
          caption: "Rangées de lavande de Valensole au coucher du soleil, photographiées par Karim Saari, photographe paysages basé à Marseille spécialisé en nature et Provence.",
          contentUrl: `${BASE_URL}/images/portfolio/Terre/karim-saari-photographe-provence-champ-lavande-coucher-soleil-rangees.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2022,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          name: 'Photographe paysages Provence — Vue aérienne tournesols et lavande — Karim Saari',
          description: "Vue aérienne de champs de tournesols et de lavande en Provence, photographiée par Karim Saari, photographe paysages et environnemental basé à Marseille.",
          caption: "Vue aérienne de champs de tournesols et de lavande en Provence, photographiée par Karim Saari, photographe paysages et environnemental basé à Marseille.",
          contentUrl: `${BASE_URL}/images/portfolio/Terre/karim-saari-photographe-provence-aerien-tournesols-lavande.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2022,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        // Voyages
        {
          '@type': 'ImageObject',
          name: 'Photographe voyage — Chefchaouen ruelle bleue Maroc — Karim Saari',
          description: "Ruelle bleue de Chefchaouen et ses escaliers, photographiée par Karim Saari, photographe de voyage et paysages basé à Marseille.",
          caption: "Ruelle bleue de Chefchaouen et ses escaliers, photographiée par Karim Saari, photographe de voyage et paysages basé à Marseille.",
          contentUrl: `${BASE_URL}/images/portfolio/Terre/karim-saari-photographe-maroc-chefchaouen-ruelle-bleue-vieil-homme.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2021,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
        {
          '@type': 'ImageObject',
          name: 'Photographe voyage — Dune du Pilat silhouette forêt des Landes — Karim Saari',
          description: "Silhouette au sommet de la Dune du Pilat face à la forêt des Landes, photographiée par Karim Saari, photographe de voyage et paysages basé à Marseille.",
          caption: "Silhouette au sommet de la Dune du Pilat face à la forêt des Landes, photographiée par Karim Saari, photographe de voyage et paysages basé à Marseille.",
          contentUrl: `${BASE_URL}/images/portfolio/Terre/karim-saari-photographe-dune-pilat-arcachon-silhouette-foret-landes.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', jobTitle: 'Photographe Paysages Marseille', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2021,
          creditText: '© Karim Saari / Dark Massilia',
          copyrightNotice: '© Karim Saari / Dark Massilia — Tous droits réservés',
          license: `${BASE_URL}/mentions-legales/`,
          acquireLicensePage: `${BASE_URL}/contact/`,
        },
      ],
    },
  },
  '/donnees-scientifiques': {
    title: 'Pollution Plastique Méditerranée — Données Scientifiques',
    description:
      "7 % des microplastiques mondiaux en Méditerranée. Données scientifiques sur les rejets plastiques, l'impact sur les espèces marines et la santé humaine.",
    canonical: `${BASE_URL}/donnees-scientifiques`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Données Scientifiques', '/donnees-scientifiques'),
        {
          '@type': 'Dataset',
          name: 'Pollution Plastique en Méditerranée — Données Scientifiques',
          description:
            'Données chiffrées sur la pollution plastique en Méditerranée : concentration de microplastiques, volumes annuels rejetés, impact sur les espèces marines et la santé humaine.',
          url: `${BASE_URL}/donnees-scientifiques/`,
          creator: { '@id': 'https://karimsaari.com/#person' },
          spatialCoverage: 'Mer Méditerranée',
          keywords: [
            'pollution plastique',
            'microplastiques',
            'nanoplastiques',
            'Méditerranée',
            'déchets marins',
            'biodiversité marine',
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
    title: 'Documentaires & Reportages Environnement Marin | Karim Saari',
    description:
      "Retrouvez les reportages et documentaires (ARTE, France TV) témoignant de nos missions de dépollution et de l'urgence écologique en mer Méditerranée.",
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
          author: { '@id': 'https://karimsaari.com/#person' },
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
                uploadDate: '2022-01-17',
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
                uploadDate: '2023-06-01',
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
                uploadDate: '2023-04-08',
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
                uploadDate: '2023-05-28',
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
                uploadDate: '2022-09-23',
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
                uploadDate: '2024-09-28',
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
  '/communaute': {
    title: 'Bénévolat Dépollution Marseille : Rejoignez Team Oxygen',
    description:
      "Envie d'agir pour la Méditerranée ? Rejoignez notre communauté de 130 000 sentinelles et participez à nos missions de bénévolat écologique à Marseille.",
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
    canonical: `${BASE_URL}/sauver-marseille-documentaire-arte`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Documentaire ARTE', '/sauver-marseille-documentaire-arte'),
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
          publisher: {
            '@type': 'Organization',
            name: 'ARTE',
            url: 'https://www.arte.tv',
          },
        },
      ],
    },
  },
  '/meduses-souveraines-oceans-documentaire-arte': {
    title: 'Méduses Souveraines des Océans — Documentaire ARTE',
    description:
      'Documentaire ARTE Évasion (2024, 43 min) de Sébastien Lafont. Karim Saari a fourni des images de Méditerranée sur la prolifération des méduses.',
    canonical: `${BASE_URL}/meduses-souveraines-oceans-documentaire-arte`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Méduses — Documentaire ARTE', '/meduses-souveraines-oceans-documentaire-arte'),
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
          director: {
            '@type': 'Person',
            name: 'Sébastien Lafont',
          },
          publisher: {
            '@type': 'Organization',
            name: 'ARTE Évasion',
            url: 'https://www.arte.tv',
          },
        },
      ],
    },
  },
  '/blog': {
    title: 'Blog — Missions Dépollution Marine · Dark Massilia',
    description:
      'Suivez les dernières actions de dépollution de Team Oxygen en Méditerranée. Reportages, rencontres et coups de cœur depuis les Calanques de Marseille.',
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
          author: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Dark Massilia',
            url: BASE_URL,
          },
          inLanguage: 'fr-FR',
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
    canonical: `${BASE_URL}/actualites`,
  },
  '/local-guide-marseille': {
    title: 'Google Local Guide à Marseille | Karim Saari',
    description:
      'Suivez mes contributions en tant que Google Local Guide à Marseille. Plus de 143 millions de vues pour valoriser notre patrimoine naturel.',
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
    title: 'Contact Karim Saari | Reportages, Expositions & Dépollution',
    description:
      'Contactez Karim Saari pour une intervention dans un documentaire, une exposition photo engagée ou une mission de dépollution à Marseille.',
    canonical: `${BASE_URL}/contact`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Contact & Partenariats', '/contact'),
        {
          '@type': 'PhotographyBusiness',
          '@id': `${BASE_URL}/#business`,
          name: 'Karim SAARI - Photographe Calanques & Marseille',
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
  '/carte-calanques': {
    title: 'Carte des Calanques : Dépollution & Biodiversité',
    description:
      'Explorez la carte interactive des Calanques de Marseille. Localisez nos zones de dépollution avec Team Oxygen et découvrez la biodiversité à protéger.',
    canonical: `${BASE_URL}/carte-calanques`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Carte Interactive des Calanques', '/carte-calanques'),
        {
          '@type': 'Dataset',
          name: 'Carte interactive — Calanques de Marseille : Dépollution & Photographie',
          description:
            "Cartographie des zones de dépollution marine menées par Team Oxygen et des sites de photographie documentaire dans les Calanques de Marseille. Spots couverts : Sormiou, Morgiou, Sugiton, En-Vau, Callelongue, Cap Croisette, Archipel du Frioul.",
          url: `${BASE_URL}/carte-calanques`,
          creator: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
          },
          spatialCoverage: {
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
          keywords: [
            'carte calanques Marseille',
            'spots dépollution marine',
            'biodiversité Calanques',
            'Team Oxygen missions',
            'posidonie Méditerranée',
            'photographie sous-marine Marseille',
          ],
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
};
