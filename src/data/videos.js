// Liste des vidéos affichées sur /videos.
//
// Source unique partagée par la page (src/pages/Videos.jsx) et le script
// de récupération des dates (scripts/fetch-youtube-dates.mjs).
//
// Les dates de publication ne sont PAS renseignées ici : elles sont
// récupérées automatiquement via l'API YouTube Data v3 au moment du build
// et stockées dans video-dates.json (clé = id de la vidéo, valeur = date ISO).
// Pour les vidéos non-YouTube (Vimeo), la date est saisie manuellement
// directement dans video-dates.json.
export const videos = [
  {
    id: 'BoqO1LVcx5A',
    title: 'Court-métrage Fondation Green-Got — Sous la Méditerranée',
    description: 'Court-métrage documentaire produit par la Fondation Green-Got, tourné en apnée au large de Marseille avec Karim Saari',
  },
  {
    id: 'cxjAQtSHHyI',
    title: 'Documentaire ARTE',
    description: 'Reportage sur les actions de dépollution en Méditerranée',
  },
  {
    id: 'yfebiTFOq7E',
    title: 'Méduses | Les souveraines des océans — ARTE Évasion',
    description: 'Documentaire de Sébastien Lafont (2024, 43 min) — images Méditerranée fournies par Karim Saari',
  },
  {
    id: '1023375117',
    type: 'vimeo',
    title: 'Pilote Oxygen — Zekefilm',
    description: 'Film pilote réalisé par Zekefilm sur les actions de dépollution marine de Team Oxygen',
    thumbnail_url: 'https://i.vimeocdn.com/video/1959544955-a137718c8ecbdfd449d6d417581e46c618125dd3b7317fdc5a3a4bee2e95159e-d_640x360',
  },
  {
    id: '1193190954',
    type: 'vimeo',
    title: 'OXYGÈNE — Trailer VO',
    description: 'Bande-annonce du documentaire Oxygène, qui suit Team Oxygen en apnée pour dépolluer les fonds marins de Marseille (Zéké Films, soutenu par CITEO)',
    thumbnail_url: 'https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize,to_auto,s_webp:avif/cms.karimsaari.com/wp-content/uploads/2026/07/65-006A3810-1-1024x683.jpg',
  },
  {
    id: 'sseo9sf7jow',
    title: '2025, une année de dépollution en apnée à Marseille',
    description: 'Rétrospective 2025 des actions de dépollution en apnée à Marseille',
  },
  {
    id: 'XHqB603STuw',
    title: 'Projet Sentinelle Frioul',
    description: "Mission de dépollution dans l'archipel du Frioul",
  },
  {
    id: 'a3nw8N7_lhI',
    title: 'Pollution des Plages du Prado',
    description: 'Documentation de la pollution sur les plages marseillaises',
  },
  {
    id: '-EwJUePiAdk',
    title: "Une Année d'Action",
    description: 'Rétrospective de nos actions environnementales',
  },
  {
    id: 'AkOFh9rwT0g',
    title: 'Plage du Prado',
    description: 'Nettoyage et sensibilisation au Prado',
  },
  {
    id: 'rYza88fs76k',
    title: "Une Année d'Action",
    description: 'Bilan annuel de nos missions de dépollution',
  },
  {
    id: '9OEa85XS5nU',
    title: 'Quai Marcel Pagnol',
    description: 'Action de nettoyage au Quai Marcel Pagnol',
  },
  {
    id: 'oq_ACgCB53A',
    title: "Une Année d'Action 2021",
    description: 'Rétrospective 2021 de nos actions',
  },
  {
    id: '7aJ4UHEHf_A',
    title: "Embouchure de l'Huveaune",
    description: "Mission de dépollution à l'embouchure de l'Huveaune",
  },
];

export default videos;
