import { motion } from 'framer-motion';
import { useCardHover } from '../hooks/useCardHover';
import { ArrowRight, ExternalLink, Camera, Mail } from 'lucide-react';
import StatCounter from '../components/ui/StatCounter';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER, SOCIAL_STATS_DEFAULTS } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';
import PartnersCarousel from '../components/PartnersCarousel';
import { useTranslation } from 'react-i18next';

// Cadre photo « presse premium » — hairline clair + passe-partout teal + ombre portée profonde
const PHOTO_FRAME =
  'shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_0_0_5px_rgba(0,171,168,0.10),0_20px_50px_-14px_rgba(0,0,0,0.78)]';

// Photo portrait — bloc intro
const PARTNER_PHOTO_INTRO = {
  src: '/images/Partenaires/partenaires-1dpj-10ans-notre-dame-marseille.webp',
  creditUrl: 'https://www.sebanado.com/',
};

// Photos partenariats terrain — Mer Terre (2) + PNC (3)
const PARTNER_PHOTOS_MERTERR = [
  {
    src: '/images/Partenaires/partenaires-mer-terre-calanques-propres-2024.webp',
    creditUrl: 'https://www.fouguephotographie.fr/',
  },
  {
    src: '/images/Partenaires/partenaires-pnc-pirates-plastique-calanques-3.webp',
    creditUrl: 'https://calanques-parcnational.fr/fr',
  },
];

const PARTNER_PHOTOS_PNC = [
  {
    src: '/images/Partenaires/partenaires-pnc-pirates-plastique-calanques-1.webp',
    creditUrl: 'https://calanques-parcnational.fr/fr',
  },
  {
    src: '/images/Partenaires/partenaires-pnc-pirates-plastique-calanques-2.webp',
    creditUrl: 'https://calanques-parcnational.fr/fr',
  },
  {
    src: '/images/Partenaires/partenaires-karim-saari-mer-terre-calanques-propres-2024.webp',
    creditUrl: 'https://www.fouguephotographie.fr/',
  },
];

// Soirée CITEO — Villa Cosquer Méditerranée (projection d'Oxygène)
const PARTNER_PHOTOS_CITEO = [
  { src: '/images/Partenaires/partenaires-citeo-villa-cosquer-oxygene-1.webp', creditUrl: 'https://zartfilmsproduction.com/' },
  { src: '/images/Partenaires/partenaires-citeo-villa-cosquer-oxygene-2.webp', creditUrl: 'https://zartfilmsproduction.com/' },
  { src: '/images/Partenaires/partenaires-citeo-villa-cosquer-oxygene-3.webp', creditUrl: 'https://zartfilmsproduction.com/' },
];

// Associations partenaires
const ASSOCIATIONS = [
  { name: "Boud'mer",            url: 'https://www.boudmer.org/' },
  { name: 'Clean My Calanques',   url: 'https://cleanmycalanques.fr/' },
  { name: 'Association Merveille', url: 'https://www.assomerveille.fr/' },
  { name: '1 Déchet Par Jour',    url: 'https://www.1dechetparjour.com/' },
  { name: 'Team AVA',             url: 'https://www.instagram.com/team.a.v.a/' },
  { name: 'Sauvage Méditerranée', url: 'https://sauvage-med.fr/' },
  { name: 'Mer Terre',            url: 'https://mer-terre.org/' },
  { name: 'Recyclop',             url: 'https://recyclop.fr/' },
  { name: 'Wings of the Ocean',   url: 'https://www.wingsoftheocean.com/' },
];

// Institutions partenaires
const INSTITUTIONS = [
  { name: 'Parc National des Calanques', url: 'https://calanques-parcnational.fr/fr', logo: '/images/Partenaires/svg/logo-pncal.jpg' },
  { name: 'Fondation de la Mer',         url: 'https://www.fondationdelamer.org/',    logo: '/images/Partenaires/svg/logo-fondation-de-la-mer.svg' },
  { name: 'Citeo',                       url: 'https://www.citeo.com/',               logo: '/images/Partenaires/svg/Logo_Citeo.png' },
  { name: 'Ville de Marseille',          url: 'https://www.marseille.fr/',            logo: '/images/Partenaires/svg/Ville_de_Marseille_(logo).svg' },
];

// Timeline parcours — données centralisées (text fields come from i18n)
const TIMELINE_ENTRIES = [
  {
    period: '1971',
    img: '/images/portfolio/Horizons/biarritz-cote-basque-karimsaari-1.webp',
    side: 'left',
  },
  {
    period: '1997–2001',
    img: null,
    side: null,
  },
  {
    period: '2001–2017',
    stat: '800K+',
    img: '/images/portfolio/Mer/karim-saari-marseille-vieux-port-arche-cadenas-notre-dame.webp',
    link: 'https://500px.com/p/karimsaari',
    external: true,
    side: 'right',
  },
  {
    period: 'Juin 2015',
    badge: '/images/Partenaires/svg/national-geographic-logo.svg',
    img: '/images/portfolio/Mer/karim-saari-valensole-lavandes-national-geographic-provence.webp',
    imgSrcSet: '/images/portfolio/Mer/karim-saari-valensole-lavandes-national-geographic-provence_400w.webp 400w, /images/portfolio/Mer/karim-saari-valensole-lavandes-national-geographic-provence_800w.webp 800w, /images/portfolio/Mer/karim-saari-valensole-lavandes-national-geographic-provence_1200w.webp 1200w',
    side: 'left',
  },
  {
    period: '2017',
    img: '/images/portfolio/Mer/karim-saari-marseille-aerien-calanque-nageur-turquoise.webp',
    imgScale: 'scale-[1.18]',
    side: 'left',
  },
  {
    period: '2018',
    img: '/images/groupe-des-amoureux-des-calanques.webp',
    imgPosition: 'object-left',
    link: '/communaute-calanques',
    external: false,
    side: 'right',
  },
  {
    period: '2018',
    img: '/images/2018-premi%C3%A8res_d%C3%A9pollutions_vallon_des_auffes_la-provence.jpg',
    side: 'left',
  },
  {
    period: '2019',
    img: '/images/800w/karim-saari-marseille-ville-reconnaissance-officielle-dark-massilia.webp',
    badge: '/images/Partenaires/svg/Armoiries_de_Marseille.svg',
    link: 'https://www.facebook.com/marseilleville/photos/a.220707724621813/3697054720320412/',
    external: true,
    side: 'right',
  },
  {
    period: '2021',
    img: '/images/pirates-du-plastique.jpg',
    link: 'https://www.calanques-parcnational.fr/fr/actualites/lancement-de-la-campagne-les-pirates-du-plastique-rejoignez-laventure-zero-dechet',
    external: true,
    side: 'left',
  },
  {
    period: '2021–2022',
    stat: true,
    statTranslatable: true,
    img: '/images/TF1_plongeur_karimsaari_video-greve-des-eboueurs-a-marseille-des-craintes-pour-l-environnement.webp',
    side: 'right',
  },
  {
    period: '2022',
    stat: '900 kg',
    img: '/images/Projet_sentinelle_1.jpg',
    link: 'https://fr.wikipedia.org/wiki/Projet_Sentinelle',
    external: true,
    side: 'left',
  },
  {
    period: '2023',
    stat: '1 357 kg',
    img: '/images/projet_sentinelle_2_frioul.png',
    link: 'https://www.laprovence.com/videos/marseille-1-4-tonne-de-dchets-sortie-des-eaux-du-frioul-par-des-apnistes/10321076',
    external: true,
    side: 'right',
  },
  {
    period: '2024',
    stat: '1 147 kg',
    img: '/images/marseille-dark-massilia-port-goudes-depollution-apnee-projet-sentinelle.webp',
    link: 'https://www.fondationdelamer.org/nos-actualites/projet-sentinelle/',
    external: true,
    side: 'left',
  },
  {
    period: 'Juin 2024',
    img: '/images/contact-karim-saari.webp',
    imgFit: 'object-contain',
    link: '/sauver-marseille-documentaire-arte',
    external: false,
    side: 'right',
  },
  {
    period: 'Décembre 2024',
    img: '/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand.webp',
    imgSrcSet: '/images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_400w.webp 400w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_800w.webp 800w, /images/Marseille-2024-342-Les-Francais-copyright-Yann-Arthus-Bertrand_1200w.webp 1200w',
    imgPosition: 'object-[80%_50%]',
    link: '/les-francais-yann-arthus-bertrand',
    external: false,
    side: 'left',
  },
  {
    period: '2025',
    stat: '2 320 kg',
    img: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-teamoxygen.webp',
    link: 'https://www.marcelle.media/depolluer-la-mer-apnee-apres-apnee/',
    external: true,
    imgScale: 'scale-[1.18]',
    side: 'right',
    hasQuote: true,
  },
  {
    period: 'Juin 2026',
    img: '/images/karim-saari-running-minds-kilian-jornet-foundation-calanques-marseille.webp',
    badge: '/images/Partenaires/logo-kilian-jornet-foundation.png',
    link: '/blog/running-minds-parc-national-des-calanques',
    external: false,
    side: 'right',
  },
  {
    period: '2026',
    img: 'https://cms.karimsaari.com/wp-content/uploads/2026/05/Screenshot-2026-05-19-123022_edited-3.webp',
    imgFit: 'object-contain',
    link: '/blog/oxygene-le-documentaire-sur-la-depollution-de-la-mediterranee',
    external: false,
    side: 'left',
    future: true,
  },
  {
    period: '2026',
    img: '/images/green-got-mosaique-court-metrage-mediterranee.webp',
    link: '/court-metrage-green-got-mediterranee',
    external: false,
    side: 'right',
    future: true,
  },
];

// Blocs galeries — 2 univers × 3 sous-sections
const UNIVERSES = [
  {
    id: 'sous-marin',
    galleries: [
      { to: '/photographie-sous-marine#depollution', img: '/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-goudes-esprit-equipe-fight.webp' },
      { to: '/photographie-sous-marine#biodiversite', img: '/images/biodiversite-calanques-marseille-1.webp' },
      { to: '/photographie-sous-marine#caracterisation', img: '/images/marseille-dark-massilia-depollution-pneu-port-goudes-projet-sentinelle.webp' },
    ],
  },
  {
    id: 'paysages',
    galleries: [
      { to: '/photographie-paysage-mer#littoral', img: '/images/portfolio/Mer/karim-saari-marseille-en-vau-aerien-calanque-falaises.webp', srcset: '/images/portfolio/Mer/karim-saari-marseille-en-vau-aerien-calanque-falaises_400w.webp 400w, /images/portfolio/Mer/karim-saari-marseille-en-vau-aerien-calanque-falaises_800w.webp 800w, /images/portfolio/Mer/karim-saari-marseille-en-vau-aerien-calanque-falaises_1200w.webp 1200w', sizes: '(max-width: 640px) 100vw, 33vw' },
      { to: '/photographie-paysage-mer#provence', img: '/images/portfolio/Terre/karim-saari-photographe-provence-lavande-coucher-soleil-ciel-orange-rouge.webp' },
      { to: '/photographie-paysage-mer#horizons', img: '/images/portfolio/Terre/karim-saari-photographe-femme-robe-rouge-rochers-volcaniques-cote-sauvage.webp' },
    ],
  },
];

// Chiffres clés
const HERO_STATS = [
  { end: 5724, suffix: ' kg', duration: 2500 },
  { end: 185,  suffix: ' M',  duration: 2000 },
  { end: 132,  suffix: ' K',  duration: 2000 },
  { end: 4,    suffix: '',    duration: 1000 },
];


const PhotographeEnvironnemental = () => {
  const cardHover = useCardHover();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-4 pb-16">
      <SEO {...SEO_PAGES['/photographe-environnemental-marseille']} />
      <div className="container-custom">
        <Breadcrumb label={t('photographeEnv.breadcrumb')} />

        {/* H1 + tagline */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-6"
        >
          <motion.h1
            variants={FADE_IN_UP}
            className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2"
          >
            {t('photographeEnv.h1')}
          </motion.h1>
          <motion.p variants={FADE_IN_UP} className="text-base md:text-lg text-ocean-teal font-medium">
            {t('photographeEnv.tagline')}
          </motion.p>
        </motion.div>

        {/* Bloc définition — texte visible ciblant l'extrait optimisé « photographe environnemental » */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-3xl mx-auto mb-10"
        >
          <motion.div variants={FADE_IN_UP} className="glass rounded-2xl border border-white/8 p-6 md:p-7">
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">
              {t('photographeEnv.def_q')}
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-[0.95rem]">
              {t('photographeEnv.def_a')}
            </p>
          </motion.div>
        </motion.div>

        {/* Cadre hublot — 6 blocs galeries */}
        <div
          className="p-6 md:p-8 mb-12"
          style={{
            overflow: 'hidden',
            borderRadius: '24px',
            border: '2px solid rgba(0,171,168,0.55)',
            boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
            background: 'rgba(5,15,30,0.75)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER_CONTAINER}
            className="space-y-5"
          >
            {UNIVERSES.map(({ id, galleries }, uIdx) => (
              <motion.div key={id} variants={FADE_IN_UP}>
                <p className="text-xs font-semibold uppercase tracking-widest text-ocean-teal mb-3">
                  {t('photographeEnv.uni_' + uIdx + '_title')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {galleries.map(({ to, img, srcset, sizes }, gIdx) => (
                    <Link
                      key={to}
                      to={to}
                      className="group block relative rounded-sm overflow-hidden ring-1 ring-white/10 hover:ring-ocean-teal/40 transition-all duration-300"
                    >
                      <div className="aspect-[16/9] relative">
                        <img
                          src={img}
                          srcSet={srcset}
                          sizes={sizes}
                          alt={t('photographeEnv.uni_' + uIdx + '_gal_' + gIdx + '_alt')}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                          <h3 className="text-sm font-bold text-white mb-0.5">
                            {t('photographeEnv.uni_' + uIdx + '_gal_' + gIdx + '_label')}
                          </h3>
                          <p className="text-white/70 text-xs mb-2 leading-snug">
                            {t('photographeEnv.uni_' + uIdx + '_gal_' + gIdx + '_desc')}
                          </p>
                          <span className="inline-flex items-center gap-2 text-ocean-teal text-xs font-medium group-hover:gap-3 transition-all">
                            {t('photographeEnv.uni_' + uIdx + '_gal_' + gIdx + '_cta')} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bloc biographie — 600+ mots, E-E-A-T */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">

            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              {t('photographeEnv.bio_h2')}
            </h2>

            {/* Stats pleine largeur sous le H2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              {HERO_STATS.map(({ end, suffix, duration }, idx) => (
                <div key={idx} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                  <p className="text-sm md:text-base font-bold text-ocean-teal leading-tight tabular-nums">
                    <StatCounter end={end} suffix={suffix} duration={duration} />
                  </p>
                  <p className="text-[10px] text-text-secondary mt-0.5 leading-snug">
                    {t('photographeEnv.stat_' + idx + '_label')}
                  </p>
                </div>
              ))}
            </div>

            {/* Portrait flottant — le texte enveloppe naturellement */}
            <div className="hidden md:block float-right ml-6 mb-4 w-44">
              <div
                className={`relative rounded-lg overflow-hidden ${PHOTO_FRAME}`}
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src="/images/Partenaires/partenaires-karim-saari-mer-terre-calanques-propres-2024.webp"
                  alt="Karim Saari — Calanques Propres 2024, opération Mer Terre"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: '50% 15%' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-medium">Karim Saari</p>
                  <p className="text-white/50 text-[10px]">© Fougue Photographie</p>
                </div>
              </div>
            </div>

            {/* Lead */}
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-light mb-6">
              {t('photographeEnv.bio_lead_a')}{' '}
              <strong className="text-ocean-teal font-semibold">Karim Saari</strong>
              {t('photographeEnv.bio_lead_b')}{' '}
              <Link to="/photographie-paysage-mer" className="text-ocean-teal hover:underline">
                {t('photographeEnv.bio_lead_landscapes')}
              </Link>
              {', '}
              <Link to="/photographie-sous-marine" className="text-ocean-teal hover:underline">
                {t('photographeEnv.bio_lead_underwater')}
              </Link>
              {' '}{t('photographeEnv.bio_lead_c')}
            </p>

            {/* Chapitre 1 */}
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-2 pb-1">
              {t('photographeEnv.bio_ch1_label')}
            </p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              <span className="float-left text-[3.2rem] leading-[0.8] font-bold text-ocean-teal mr-2 mt-1 select-none">
                {t('photographeEnv.bio_ch1_dropcap')}
              </span>
              {t('photographeEnv.bio_ch1_a')}
              <strong className="text-ocean-teal font-semibold">{t('photographeEnv.bio_ch1_strong')}</strong>
              {t('photographeEnv.bio_ch1_b')}
            </p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              {t('photographeEnv.bio_ch1_p2_a')}
              <strong className="text-ocean-teal font-semibold">{t('photographeEnv.bio_ch1_p2_strong')}</strong>
              {t('photographeEnv.bio_ch1_p2_b')}
            </p>

            {/* Chapitre 2 */}
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-3 pb-1">
              {t('photographeEnv.bio_ch2_label')}
            </p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              {t('photographeEnv.bio_ch2_a')}{' '}
              <strong className="text-ocean-teal font-semibold">Team Oxygen</strong>{' '}
              {t('photographeEnv.bio_ch2_b')}{' '}
              <strong className="text-ocean-teal font-semibold">Projet Sentinelle</strong>
              {t('photographeEnv.bio_ch2_c')}{' '}
              <strong className="text-ocean-teal font-semibold">5 724 kg {t('photographeEnv.bio_ch2_waste')}</strong>
              {'.'}
            </p>

            <div className="clear-both" />

            {/* Stat callout */}
            <div className="flex items-center gap-5 bg-ocean-teal/8 border border-ocean-teal/20 rounded-xl p-4 mb-5">
              <div className="flex-shrink-0 text-center">
                <p className="text-2xl md:text-3xl font-bold text-ocean-teal">5 724 kg</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                  {t('photographeEnv.bio_stat_editions')}
                </p>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t('photographeEnv.bio_stat_desc')}
              </p>
            </div>

            {/* Chapitre 3 */}
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-1 pb-1">
              {t('photographeEnv.bio_ch3_label')}
            </p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              <strong className="text-ocean-teal font-semibold">Dark Massilia</strong>
              {t('photographeEnv.bio_ch3_p1_a')}{' '}
              <strong className="text-ocean-teal font-semibold">
                {SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR')}{' '}
                {t('photographeEnv.bio_ch3_p1_b')}
              </strong>
              {t('photographeEnv.bio_ch3_p1_c')}
            </p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              {t('photographeEnv.bio_ch3_p2')}
            </p>

            {/* Chapitre 4 */}
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-3 pb-1">
              {t('photographeEnv.bio_ch4_label')}
            </p>
            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-4">
              {t('photographeEnv.bio_ch4_a')}{' '}
              <strong className="text-ocean-teal font-semibold">ARTE</strong>{' '}
              {t('photographeEnv.bio_ch4_b')}{' '}
              <em>{t('photographeEnv.bio_ch4_arte_doc')}</em>
              {'. '}
              <strong className="text-ocean-teal font-semibold">TF1</strong>{' '}
              {t('photographeEnv.bio_ch4_c')}{' '}
              <strong className="text-ocean-teal font-semibold">M6</strong>{' '}
              {t('photographeEnv.bio_ch4_d')}{' '}
              <em>{t('photographeEnv.bio_ch4_m6_show')}</em>
              {'. '}
              {t('photographeEnv.bio_ch4_e')}
            </p>

            {/* Pull quote */}
            <blockquote className="my-6 py-4 px-5 bg-white/[0.04] border-l-2 border-ocean-teal rounded-r-lg">
              <p className="text-white/85 italic text-base leading-snug">
                {t('photographeEnv.bio_quote')}
              </p>
            </blockquote>

            <p className="text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-8">
              {t('photographeEnv.bio_cta_p')}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/photographie-sous-marine" className="btn inline-flex items-center gap-2">
                <Camera className="w-4 h-4" aria-hidden="true" />
                {t('photographeEnv.bio_btn_underwater')}
              </Link>
              <Link to="/photographie-paysage-mer" className="btn inline-flex items-center gap-2">
                <Camera className="w-4 h-4" aria-hidden="true" />
                {t('photographeEnv.bio_btn_landscapes')}
              </Link>
              <Link to="/depollution-marine" className="btn-primary inline-flex items-center gap-2">
                {t('photographeEnv.bio_btn_sentinelle')}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Parcours — de la photographie de paysages à la photographie engagée */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              {t('photographeEnv.timeline_h2')}
            </h2>
            <p className="text-text-secondary text-sm mb-8 italic">
              {t('photographeEnv.timeline_subtitle')}
            </p>

            <div className="relative">
              {/* Barre verticale centrale — desktop uniquement */}
              <div
                className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,171,168,0.65) 3%, rgba(0,171,168,0.65) 100%)',
                  boxShadow: '0 0 8px rgba(0,171,168,0.35)',
                }}
                aria-hidden="true"
              />
              {/* Flèche de fin de frise */}
              <div
                className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '10px solid rgba(0,171,168,0.85)',
                  filter: 'drop-shadow(0 0 5px rgba(0,171,168,0.5))',
                }}
                aria-hidden="true"
              />

              <div className="space-y-16 md:space-y-24">
                {TIMELINE_ENTRIES.map((entry, i) => {
                  const dotClass = `rounded-full ring-4 z-10 ${entry.future ? 'bg-white/40 ring-white/10' : 'bg-ocean-teal ring-ocean-teal/20'}`;
                  const tlLabel = t('photographeEnv.tl_' + i + '_label');
                  const tlTitle = t('photographeEnv.tl_' + i + '_title');
                  const tlText = t('photographeEnv.tl_' + i + '_text');
                  const tlAlt = entry.img ? t('photographeEnv.tl_' + i + '_alt') : '';
                  const tlStat = entry.statTranslatable ? t('photographeEnv.tl_' + i + '_stat') : (entry.stat || null);
                  const tlStatLabel = entry.stat ? t('photographeEnv.tl_' + i + '_statLabel') : null;
                  const tlBadgeAlt = entry.badge ? t('photographeEnv.tl_' + i + '_badgeAlt') : null;
                  const tlQuote = entry.hasQuote ? t('photographeEnv.tl_' + i + '_quote') : null;
                  const tlLinkLabel = entry.link ? t('photographeEnv.tl_' + i + '_linkLabel') : null;

                  if (!entry.img) {
                    return (
                      <div key={i} className="relative flex gap-4 md:block">
                        <div className="md:hidden flex-shrink-0 pt-1.5">
                          <div className={`w-2.5 h-2.5 ${dotClass}`} aria-hidden="true" />
                        </div>
                        <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 w-3.5 h-3.5 ${dotClass}`} aria-hidden="true" />
                        <div className="md:max-w-sm md:mx-auto md:text-center">
                          <p className="text-ocean-teal text-xs font-semibold uppercase tracking-widest mb-1">{tlLabel}</p>
                          <p className="text-white font-bold text-2xl mb-2">{entry.period}</p>
                          <p className="text-white font-semibold text-sm mb-2">{tlTitle}</p>
                          <p className="text-text-secondary text-sm leading-relaxed">{tlText}</p>
                        </div>
                      </div>
                    );
                  }

                  const textLeft = entry.side === 'left';

                  const textBlock = (
                    <div className={textLeft ? 'md:pr-10 md:text-right' : 'md:pl-10'}>
                      <p className="text-ocean-teal text-xs font-semibold uppercase tracking-widest mb-1">{tlLabel}</p>
                      <p className="text-white font-bold text-3xl md:text-4xl mb-3 leading-tight">{entry.period}</p>
                      {entry.stat && (
                        <p className="mb-3 -mt-1">
                          <span className="text-2xl md:text-3xl font-bold text-ocean-teal tabular-nums">{tlStat}</span>
                          {tlStatLabel && <span className="text-text-muted text-xs ml-2">{tlStatLabel}</span>}
                        </p>
                      )}
                      {entry.badge && (
                        <img src={entry.badge} alt={tlBadgeAlt} className={`h-10 w-auto mb-2 ${textLeft ? 'ml-auto' : ''}`} loading="lazy" />
                      )}
                      <p className="text-white font-semibold text-sm mb-2">{tlTitle}</p>
                      <p className="text-text-secondary text-sm leading-relaxed">{tlText}</p>
                      {tlQuote && (
                        <p className={`mt-3 text-white/60 italic text-sm ${textLeft ? 'border-r-2 border-ocean-teal pr-4' : 'border-l-2 border-ocean-teal pl-4'}`}>
                          {tlQuote}
                        </p>
                      )}
                      {entry.link && (entry.external ? (
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 mt-3 text-ocean-teal hover:text-white transition-colors text-xs font-medium ${textLeft ? 'justify-end' : ''}`}
                        >
                          {tlLinkLabel} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </a>
                      ) : (
                        <Link
                          to={entry.link}
                          className={`inline-flex items-center gap-1.5 mt-3 text-ocean-teal hover:text-white transition-colors text-xs font-medium ${textLeft ? 'justify-end' : ''}`}
                        >
                          {tlLinkLabel} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  );

                  const photoBlock = (
                    <div className={`aspect-square overflow-hidden rounded-xl bg-black/40 ${PHOTO_FRAME}`}>
                      <img
                        src={entry.img}
                        srcSet={entry.imgSrcSet}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        alt={tlAlt}
                        className={`w-full h-full ${entry.imgFit || 'object-cover'}${entry.imgScale ? ` ${entry.imgScale}` : ''}${entry.imgPosition ? ` ${entry.imgPosition}` : ''}`}
                        loading="lazy"
                      />
                    </div>
                  );

                  return (
                    <div key={i} className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Dot central — desktop */}
                      <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${dotClass}`} aria-hidden="true" />

                      {/* Mobile : texte puis photo */}
                      <div className="md:hidden col-span-1 flex gap-4">
                        <div className="flex-shrink-0 pt-1.5">
                          <div className={`w-2.5 h-2.5 ${dotClass}`} aria-hidden="true" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <p className="text-ocean-teal text-xs font-semibold uppercase tracking-widest mb-0.5">{tlLabel}</p>
                            <p className="text-white font-bold text-2xl mb-1">{entry.period}</p>
                            {entry.stat && (
                              <p className="mb-1.5">
                                <span className="text-xl font-bold text-ocean-teal tabular-nums">{tlStat}</span>
                                {tlStatLabel && <span className="text-text-muted text-[11px] ml-1.5">{tlStatLabel}</span>}
                              </p>
                            )}
                            {entry.badge && (
                              <img src={entry.badge} alt={tlBadgeAlt} className="h-8 w-auto mb-2" loading="lazy" />
                            )}
                            <p className="text-white font-semibold text-sm mb-2">{tlTitle}</p>
                            <p className="text-text-secondary text-sm leading-relaxed">{tlText}</p>
                            {tlQuote && <p className="mt-2 text-white/60 italic text-sm border-l-2 border-ocean-teal pl-3">{tlQuote}</p>}
                            {entry.link && (entry.external ? (
                              <a href={entry.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-ocean-teal text-xs font-medium">
                                {tlLinkLabel} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                              </a>
                            ) : (
                              <Link to={entry.link} className="inline-flex items-center gap-1.5 mt-2 text-ocean-teal text-xs font-medium">
                                {tlLinkLabel} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                              </Link>
                            ))}
                          </div>
                          <div className={`aspect-square overflow-hidden rounded-xl bg-black/40 ${PHOTO_FRAME}`}>
                            <img src={entry.img} srcSet={entry.imgSrcSet} sizes="100vw" alt={tlAlt} className={`w-full h-full ${entry.imgFit || 'object-cover'}${entry.imgScale ? ` ${entry.imgScale}` : ''}${entry.imgPosition ? ` ${entry.imgPosition}` : ''}`} loading="lazy" />
                          </div>
                        </div>
                      </div>

                      {/* Desktop colonne gauche */}
                      <div className="hidden md:block">
                        {textLeft ? textBlock : photoBlock}
                      </div>

                      {/* Desktop colonne droite */}
                      <div className="hidden md:block">
                        {textLeft ? photoBlock : textBlock}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                <Mail className="w-4 h-4" aria-hidden="true" />
                {t('photographeEnv.timeline_contact_btn')}
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* H2 — Médias & Reconnaissances */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-3">
              {t('photographeEnv.media_h2')}
            </h2>
            <p className="text-text-secondary text-center mb-8 max-w-xl mx-auto">
              {t('photographeEnv.media_subtitle')}
            </p>
            <PartnersCarousel />
            <div className="text-center mb-8">
              <Link
                to="/presse"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium"
              >
                {t('photographeEnv.media_link')}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Contact presse */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-base font-semibold text-white mb-2">{t('photographeEnv.press_h3')}</h3>
              <p className="text-text-secondary text-sm mb-4">
                {t('photographeEnv.press_p')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm text-ocean-teal hover:text-white transition-colors font-medium"
                >
                  {t('photographeEnv.press_link')}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* H2 — Associations partenaires */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
              {t('photographeEnv.assoc_h2')}
            </h2>
            <p className="text-text-secondary text-center mb-1 text-sm">
              {t('photographeEnv.assoc_subtitle')}
            </p>
            <p className="text-ocean-teal text-sm italic text-center mb-8">
              {t('photographeEnv.assoc_quote')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ASSOCIATIONS.map(({ name, url }, idx) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl p-4 border border-white/8 hover:border-ocean-teal/30 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <p className="text-white font-semibold text-sm group-hover:text-ocean-teal transition-colors">{name}</p>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-ocean-teal transition-colors flex-shrink-0 mt-0.5" aria-hidden="true" />
                  </div>
                  <p className="text-text-secondary text-xs leading-snug">
                    {t('photographeEnv.assoc_' + idx + '_desc')}
                  </p>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Galerie photos partenariats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          {/* Ligne 1 : portrait 1dpj (span 2 lignes) + 2 × MerTerre */}
          <motion.div variants={FADE_IN_UP} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* Portrait — s'étire sur la hauteur des 2 cartes de droite (desktop) */}
            <div className="sm:row-span-2 aspect-[3/4] sm:aspect-auto relative rounded-2xl overflow-hidden group ring-1 ring-white/8">
              <img
                src={PARTNER_PHOTO_INTRO.src}
                alt={t('photographeEnv.photo_intro_alt')}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs font-medium leading-snug mb-0.5">
                  {t('photographeEnv.photo_intro_caption')}
                </p>
                <a
                  href={PARTNER_PHOTO_INTRO.creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white/80 text-xs block transition-colors"
                >
                  {t('photographeEnv.photo_intro_credit')}
                </a>
              </div>
            </div>
            {/* 2 × MerTerre empilées */}
            {PARTNER_PHOTOS_MERTERR.map(({ src, creditUrl }, idx) => (
              <div key={src} className="relative rounded-2xl overflow-hidden group ring-1 ring-white/8">
                <div className="aspect-[4/3]">
                  <img
                    src={src}
                    alt={t('photographeEnv.photo_merterr_' + idx + '_alt')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-medium leading-snug">
                      {t('photographeEnv.photo_merterr_' + idx + '_caption')}
                    </p>
                    <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 text-xs mt-0.5 block transition-colors">
                      {t('photographeEnv.photo_merterr_' + idx + '_credit')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Ligne 2 : 3 × PNC */}
          <motion.div variants={FADE_IN_UP} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PARTNER_PHOTOS_PNC.map(({ src, creditUrl }, idx) => (
              <div key={src} className="relative rounded-2xl overflow-hidden group ring-1 ring-white/8">
                <div className="aspect-[4/3]">
                  <img
                    src={src}
                    alt={t('photographeEnv.photo_pnc_' + idx + '_alt')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-medium leading-snug">
                      {t('photographeEnv.photo_pnc_' + idx + '_caption')}
                    </p>
                    <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 text-xs mt-0.5 block transition-colors">
                      {t('photographeEnv.photo_pnc_' + idx + '_credit')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Ligne 3 : 3 × Soirée CITEO — Villa Cosquer Méditerranée (projection d'Oxygène) */}
          <motion.div variants={FADE_IN_UP} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {PARTNER_PHOTOS_CITEO.map(({ src, creditUrl }, idx) => (
              <div key={src} className="relative rounded-2xl overflow-hidden group ring-1 ring-white/8">
                <div className="aspect-[4/3]">
                  <img
                    src={src}
                    alt={t('photographeEnv.photo_citeo_' + idx + '_alt')}
                    className={`w-full h-full object-cover ${idx === 0 ? 'object-top' : ''} group-hover:scale-105 transition-transform duration-500`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-medium leading-snug">
                      {t('photographeEnv.photo_citeo_' + idx + '_caption')}
                    </p>
                    <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/80 text-xs mt-0.5 block transition-colors">
                      {t('photographeEnv.photo_citeo_' + idx + '_credit')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* H2 — Institutions partenaires */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div {...cardHover} variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
              {t('photographeEnv.inst_h2')}
            </h2>
            <p className="text-text-secondary text-center mb-8 max-w-xl mx-auto text-sm">
              {t('photographeEnv.inst_subtitle')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INSTITUTIONS.map(({ name, url, logo }, idx) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl p-5 border border-white/8 hover:border-ocean-teal/30 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    {logo ? (
                      <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center" style={{ minWidth: '80px', maxWidth: '140px' }}>
                        <img
                          src={logo}
                          alt={name}
                          className="h-7 w-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <p className="text-white font-semibold group-hover:text-ocean-teal transition-colors">{name}</p>
                    )}
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-ocean-teal transition-colors flex-shrink-0 mt-0.5" aria-hidden="true" />
                  </div>
                  <p className="text-white/70 text-xs font-medium mb-1 group-hover:text-ocean-teal transition-colors">{name}</p>
                  <p className="text-text-secondary text-sm leading-snug">
                    {t('photographeEnv.inst_' + idx + '_desc')}
                  </p>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>


        {/* FAQ sémantique */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.h2 variants={FADE_IN_UP} className="text-xl md:text-2xl font-bold text-white text-center mb-8">
            {t('photographeEnv.faq_h2')}
          </motion.h2>
          <motion.div variants={FADE_IN_UP} className="space-y-4 max-w-3xl mx-auto">
            {[0, 7, 8, 9, 1, 2, 3, 4, 5, 6].map((i) => (
              <details key={i} className="glass rounded-2xl border border-white/8 group">
                <summary className="p-5 cursor-pointer text-white font-medium list-none flex items-center justify-between hover:text-ocean-teal transition-colors">
                  {t('photographeEnv.faq_' + i + '_q')}
                  <ArrowRight className="w-4 h-4 flex-shrink-0 rotate-90 group-open:-rotate-90 transition-transform text-ocean-teal" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed">
                  {i === 6 ? (
                    <>
                      {t('photographeEnv.faq_6_a')}{' '}
                      <Link to="/contact" className="text-ocean-teal hover:text-white transition-colors">
                        {t('photographeEnv.faq_6_link')}
                      </Link>
                    </>
                  ) : t('photographeEnv.faq_' + i + '_a')}
                </div>
              </details>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default PhotographeEnvironnemental;
