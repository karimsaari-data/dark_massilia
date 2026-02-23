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
    title: 'Karim Saari | Photographe Sous-Marin & Apnéiste Engagé Marseille',
    description:
      'Découvrez Dark Massilia, sentinelle de la Méditerranée. Photographe et président de Team Oxygen, engagé contre la pollution marine dans les Calanques.',
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
  '/missions': {
    title: 'Projet Sentinelle — Dépollution en Apnée | Calanques de Marseille',
    description:
      "Projet Sentinelle : 5 724 kg de déchets extraits des Calanques de Marseille en apnée depuis 2022. Découvrez les missions de dépollution de Team Oxygen.",
    canonical: `${BASE_URL}/missions`,
    schema: breadcrumb('Projet Sentinelle', '/missions'),
  },
  '/videos': {
    title: 'Documentaires & Vidéos Dépollution Méditerranée | Dark Massilia',
    description:
      "Visionnez nos reportages (ARTE) et documentaires immersifs sur l'état des fonds marins à Marseille et nos missions d'extraction de plastique.",
    canonical: `${BASE_URL}/videos`,
    schema: breadcrumb('Vidéos & Documentaires', '/videos'),
  },
  '/photos': {
    title: 'Galerie Photo Sous-Marine & Paysages | Karim Saari Marseille',
    description:
      "Collections Côté Mer et Côté Terre. Explorez la beauté de la biodiversité méditerranéenne et l'impact de la pollution à travers l'objectif de Dark Massilia.",
    canonical: `${BASE_URL}/photos`,
    schema: breadcrumb('Galerie Photo Sous-Marine', '/photos'),
  },
  '/sources': {
    title: 'Données Scientifiques Pollution Plastique | Projet Sentinelle',
    description:
      "Sources et études scientifiques (PNAS, WWF, Nature) documentant l'urgence de la pollution plastique en Méditerranée et justifiant nos actions de terrain.",
    canonical: `${BASE_URL}/sources`,
    schema: breadcrumb('Sources Scientifiques', '/sources'),
  },
  '/medias': {
    title: 'Couverture Médiatique & Presse | Team Oxygen & Dark Massilia',
    description:
      'Fondation de la Mer, ARTE, France Bleu, La Provence, Actu.fr… Retrouvez toute la couverture institutionnelle et presse du Projet Sentinelle de Dark Massilia à Marseille.',
    canonical: `${BASE_URL}/medias`,
    schema: breadcrumb('Presse & Médias', '/medias'),
  },
  '/reseaux': {
    title: 'Réseaux Sociaux — Dark Massilia & Projet Sentinelle | 130 000 sentinelles',
    description:
      'Suivez Dark Massilia sur Instagram, TikTok, YouTube, Facebook et X. Une communauté de plus de 130 000 citoyens engagés pour la protection de la Méditerranée.',
    canonical: `${BASE_URL}/reseaux`,
    noindex: true,
  },
  '/arte': {
    title: 'Documentaire ARTE — Découverte en Méditerranée | Dark Massilia',
    description:
      "Regardez le documentaire ARTE avec Karim Saari et Team Oxygen lors d'une mission de dépollution dans les Calanques de Marseille.",
    canonical: `${BASE_URL}/arte`,
    schema: breadcrumb('Documentaire ARTE', '/arte'),
  },
  '/twitter': {
    title: 'Actualités & Actions en Direct | @dark_massilia',
    description:
      'Suivez en temps réel les actualités du Projet Sentinelle et les missions de dépollution marine dans les Calanques. Dark Massilia sur X.',
    canonical: `${BASE_URL}/twitter`,
    noindex: true,
  },
  '/local-guide': {
    title: 'Google Local Guides Niveau 10 — Karim Saari | Marseille & Calanques',
    description:
      'Karim Saari, Local Guide Niveau 10 sur Google Maps — 22 000+ contributions, 118 000+ points, 183 millions de vues. Cartographie des Calanques de Marseille et documentation environnementale.',
    canonical: `${BASE_URL}/local-guide`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumb('Google Local Guides', '/local-guide'),
        {
          '@type': 'ProfilePage',
          name: 'Google Local Guides — Karim Saari',
          url: `${BASE_URL}/local-guide`,
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
    title: 'Contact & Partenariats | Dark Massilia · Team Oxygen',
    description:
      'Rejoindre une mission, proposer un partenariat ou couvrir nos actions ? Contactez Karim Saari (Dark Massilia) et Team Oxygen à Marseille.',
    canonical: `${BASE_URL}/contact`,
    schema: breadcrumb('Contact & Partenariats', '/contact'),
  },
};
