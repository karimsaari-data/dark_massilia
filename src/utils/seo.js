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
  title: 'Dark Massilia · Karim Saari · Sentinelle de la Méditerranée',
  description:
    'Karim Saari, photographe et apnéiste marseillais, documente et nettoie les fonds marins des Calanques avec Team Oxygen.',
  canonical: BASE_URL,
  image: DEFAULT_IMAGE,
  siteName: SITE_NAME,
  twitterHandle: TWITTER_HANDLE,
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
    title: 'Karim Saari | Photographe & Sentinelle de la Méditerranée',
    description:
      'Photographe sous-marin et apnéiste à Marseille. Découvrez mon engagement pour la protection de la Méditerranée et la dépollution des Calanques.',
    canonical: `${BASE_URL}/`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          name: 'Karim Saari',
          alternateName: 'Dark Massilia',
          url: 'https://karimsaari.com',
          image: DEFAULT_IMAGE,
          jobTitle: 'Photographe sous-marin & Apnéiste engagé',
          description:
            'Karim Saari, photographe et apnéiste marseillais, documente et nettoie les fonds marins des Calanques avec Team Oxygen.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Marseille',
            addressRegion: 'Bouches-du-Rhône',
            addressCountry: 'FR',
          },
          sameAs: [
            'https://www.google.com/maps/contrib/114912564832630219145/photos',
            'https://www.instagram.com/karimsaari',
            'https://twitter.com/dark_massilia',
            'https://www.tiktok.com/@dark.massilia',
            'https://www.youtube.com/@dark.massilia',
            'https://www.facebook.com/Photographie.Marseille',
            'https://www.facebook.com/groups/calanque/',
            'https://500px.com/p/karimsaari',
            'https://www.linkedin.com/in/karimsaari',
          ],
          memberOf: {
            '@type': 'Organization',
            name: 'Team Oxygen',
            url: 'https://www.team-oxygen.com/',
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
          ],
        },
      ],
    },
  },
  '/depollution-marine': {
    title: 'Missions de Dépollution Marine | Team Oxygen & Karim Saari',
    description:
      "Découvrez le Projet Sentinelle et les actions de l'association Team Oxygen. Ensemble, nous nettoyons les fonds marins de la Côte Bleue aux Calanques.",
    canonical: `${BASE_URL}/depollution-marine`,
    schema: breadcrumb('Missions de Dépollution Marine', '/depollution-marine'),
  },
  '/videos': {
    title: 'Vidéos & Documentaires : Dépollution en Méditerranée',
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
  '/photographie-paysage-mer': {
    title: 'Galerie Photographie : Paysages & Fonds Marins | Karim Saari',
    description:
      "Explorez ma galerie photo sous-marine et terrestre. La beauté fragile des Calanques de Marseille capturée pour éveiller les consciences.",
    canonical: `${BASE_URL}/photographie-paysage-mer`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Galerie Photo Sous-Marine', '/photographie-paysage-mer'),
        // ImageObjects représentatifs — déclenchent les rich results Google Images
        {
          '@type': 'ImageObject',
          name: 'Dépollution en apnée — Calanques de Marseille',
          description: "Karim Saari (Dark Massilia) en action de dépollution dans les eaux des Calanques de Marseille. Mission Projet Sentinelle, Team Oxygen.",
          contentUrl: `${BASE_URL}/images/portfolio/Mer/6.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2024,
          creditText: '© Karim Saari / Dark Massilia',
        },
        {
          '@type': 'ImageObject',
          name: 'Faune marine sous-marine — Fonds des Calanques de Marseille',
          description: "Biodiversité sous-marine dans les Calanques de Marseille. Photographie immersive en apnée par Karim Saari (Dark Massilia).",
          contentUrl: `${BASE_URL}/images/portfolio/Mer/22.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2023,
          creditText: '© Karim Saari / Dark Massilia',
        },
        {
          '@type': 'ImageObject',
          name: 'Pollution plastique sur les fonds marins — Méditerranée',
          description: "Déchets plastiques sur les fonds marins des Calanques de Marseille, documentés lors du Projet Sentinelle par Karim Saari (Dark Massilia).",
          contentUrl: `${BASE_URL}/images/portfolio/Mer/54.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2024,
          creditText: '© Karim Saari / Dark Massilia',
        },
        {
          '@type': 'ImageObject',
          name: 'Apnée dans les Calanques — Vue sous-marine',
          description: "Plongée en apnée dans les eaux claires des Calanques de Marseille. Karim Saari, photographe sous-marin et sentinelle de la Méditerranée.",
          contentUrl: `${BASE_URL}/images/portfolio/Mer/66.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2023,
          creditText: '© Karim Saari / Dark Massilia',
        },
        {
          '@type': 'ImageObject',
          name: 'Paysage Côte Bleue — Marseille Provence',
          description: "Paysage photographique de la Côte Bleue près de Marseille. Collection Côté Terre par Karim Saari (Dark Massilia).",
          contentUrl: `${BASE_URL}/images/portfolio/Terre/5.webp`,
          url: `${BASE_URL}/photographie-paysage-mer`,
          creator: { '@type': 'Person', name: 'Karim Saari', alternateName: 'Dark Massilia', url: BASE_URL },
          copyrightHolder: { '@type': 'Person', name: 'Karim Saari' },
          copyrightYear: 2023,
          creditText: '© Karim Saari / Dark Massilia',
        },
      ],
    },
  },
  '/donnees-scientifiques': {
    title: 'Données Scientifiques : Pollution Plastique en Méditerranée',
    description:
      "Consultez les données scientifiques sur la pollution plastique en Méditerranée. Comprendre l'urgence écologique pour mieux agir.",
    canonical: `${BASE_URL}/donnees-scientifiques`,
    schema: breadcrumb('Données Scientifiques', '/donnees-scientifiques'),
  },
  '/presse': {
    title: 'Presse & Médias | Couverture du Projet Sentinelle',
    description:
      'Retrouvez mes passages presse et documentaires diffusés à la télévision (ARTE, Échappées Belles). Les médias s\'engagent pour la Méditerranée.',
    canonical: `${BASE_URL}/presse`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Presse & Médias', '/presse'),
        {
          '@type': 'CollectionPage',
          name: 'Presse & Médias — Karim Saari',
          description:
            'Couvertures presse et passages TV (ARTE, Échappées Belles, Yann Arthus-Bertrand, Fondation de la Mer) de Karim Saari, apnéiste et défenseur de la Méditerranée.',
          url: `${BASE_URL}/presse`,
          author: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
          },
        },
      ],
    },
  },
  '/communaute': {
    title: 'Rejoignez notre Communauté de 130 000 Sentinelles',
    description:
      'La protection de la Méditerranée repose sur une mobilisation collective. Rejoignez nos 130 000 sentinelles pour suivre nos actions en direct.',
    canonical: `${BASE_URL}/communaute`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Communauté de 130 000 Sentinelles', '/communaute'),
        {
          '@type': 'ProfilePage',
          name: 'Communauté Dark Massilia — 130 000 Sentinelles',
          description:
            'La communauté engagée de Karim Saari pour la protection de la Méditerranée. 130 000 sentinelles réunies sur Facebook, Instagram, TikTok et YouTube.',
          url: `${BASE_URL}/communaute`,
          mainEntity: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
            sameAs: [
              'https://www.facebook.com/groups/calanque/',
              'https://www.instagram.com/karimsaari/',
              'https://www.tiktok.com/@dark.massilia',
              'https://www.youtube.com/@dark.massilia',
            ],
          },
        },
      ],
    },
  },
  '/sauver-marseille-documentaire-arte': {
    title: 'Pollution : il faut sauver Marseille ! — Documentaire ARTE',
    description:
      'Visionnez "Pollution : il faut sauver Marseille !", le documentaire ARTE Regards. Plongez avec Karim Saari et Team Oxygen pour nettoyer les Calanques.',
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
    title: 'Méduses | Les souveraines des océans — Documentaire ARTE Évasion',
    description:
      'Documentaire ARTE Évasion réalisé par Sébastien Lafont (2024, 43 min). Karim Saari a fourni des images tournées en Méditerranée pour ce film sur la prolifération des méduses.',
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
  '/actualites': {
    title: 'Actualités et Alertes Environnementales | Projet Sentinelle',
    description:
      'Suivez en temps réel les actions de dépollution marine de Team Oxygen. Alertes environnementales et actualités des Calanques de Marseille en direct.',
    canonical: `${BASE_URL}/actualites`,
    noindex: true,
  },
  '/local-guide-marseille': {
    title: 'Google Local Guide à Marseille | Karim Saari',
    description:
      'Suivez mes contributions en tant que Google Local Guide à Marseille. Plus de 183 millions de vues pour valoriser notre patrimoine naturel.',
    canonical: `${BASE_URL}/local-guide-marseille`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Google Local Guides', '/local-guide-marseille'),
        {
          '@type': 'ProfilePage',
          name: 'Google Local Guides — Karim Saari',
          url: `${BASE_URL}/local-guide-marseille`,
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
    title: 'Contactez Karim Saari | Expositions, Reportages & Collabs',
    description:
      'Contactez Karim Saari pour un projet de reportage, une exposition ou une collaboration avec Team Oxygen à Marseille. Échangeons par Email ou WhatsApp.',
    canonical: `${BASE_URL}/contact`,
    schema: breadcrumb('Contact & Partenariats', '/contact'),
  },
  '/les-francais-yann-arthus-bertrand': {
    title: '« Les Français » de Yann Arthus-Bertrand — Team Oxygen à Marseille',
    description:
      'En 2024, Yann Arthus-Bertrand a photographié Team Oxygen pour son projet « Les Français ». Un portrait fort de l\'engagement de Karim Saari pour la dépollution de la Méditerranée.',
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
          url: `${BASE_URL}/les-francais-yann-arthus-bertrand`,
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
    title: 'Carte Interactive des Calanques : Dépollution & Paysages',
    description:
      'Naviguez sur notre carte interactive des Calanques de Marseille. Découvrez nos sites d\'action environnementale et mes plus beaux spots photo.',
    canonical: `${BASE_URL}/carte-calanques`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Carte des Sites', '/carte-calanques'),
        {
          '@type': 'Dataset',
          name: 'Carte des Sites — Calanques de Marseille',
          description:
            'Cartographie des sites de plongée, zones polluées et spots naturels des Calanques de Marseille et de la rade, documentés par Dark Massilia (Karim Saari) dans le cadre du Projet Sentinelle.',
          url: `${BASE_URL}/carte-calanques`,
          creator: {
            '@type': 'Person',
            name: 'Karim Saari',
            alternateName: 'Dark Massilia',
            url: BASE_URL,
          },
          spatialCoverage: {
            '@type': 'Place',
            name: 'Calanques de Marseille',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 43.2148,
              longitude: 5.4197,
            },
            containedInPlace: {
              '@type': 'AdministrativeArea',
              name: 'Marseille',
              addressCountry: 'FR',
            },
          },
          keywords: [
            'calanques de Marseille',
            'sites de plongée',
            'dépollution marine',
            'pollution plastique',
            'fonds marins Marseille',
          ],
        },
      ],
    },
  },
};
