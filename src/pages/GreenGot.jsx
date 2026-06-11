import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import YouTubeFacade from '../components/media/YouTubeFacade';
import Breadcrumb from '../components/Breadcrumb';

const HUBLOT_STYLE = {
  overflow: 'hidden',
  borderRadius: '24px',
  border: '2px solid rgba(0,171,168,0.55)',
  boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
};

// Extraits du court-métrage — images du reportage Green-Got
// Crédits : Kim Nguyen & Benoît Prabel
// (générées par scripts/convert-green-got.mjs depuis « Karim saari green got 1-7 »)
const PHOTOS = [
  { src: '/images/green-got-karim-saari-ponton-vieux-port-notre-dame-de-la-garde-marseille.webp', alt: 'Karim Saari sur un ponton du Vieux-Port de Marseille, Notre-Dame de la Garde en fond — court-métrage de la Fondation Green-Got' },
  { src: '/images/green-got-karim-saari-barque-vieux-port-marseille-team-oxygen.webp', alt: 'Karim Saari à bord d\'une barque dans le Vieux-Port de Marseille, t-shirt Team Oxygen — court-métrage de la Fondation Green-Got' },
  { src: '/images/green-got-karim-saari-interview-marseille-team-oxygen.webp', alt: 'Karim Saari, habitant de Marseille et bénévole Team Oxygen, en interview dans le court-métrage de la Fondation Green-Got' },
  { src: '/images/green-got-karim-saari-barque-profil-vieux-port-marseille.webp',  alt: 'Karim Saari sur une barque dans le Vieux-Port de Marseille — court-métrage Fondation Green-Got' },
  { src: '/images/green-got-karim-saari-quai-vieux-port-marseille.webp',          alt: 'Karim Saari sur le quai du Vieux-Port de Marseille lors du tournage du court-métrage Green-Got' },
  { src: '/images/green-got-team-oxygen-apneistes-depollution-calanques-marseille.webp', alt: 'Les apnéistes de Team Oxygen rejoignant la mer pour une mission de dépollution — court-métrage Green-Got' },
  { src: '/images/green-got-depollution-apnee-plastique-fond-marin-mediterranee.webp', alt: 'Dépollution en apnée des microplastiques au fond de la Méditerranée — court-métrage Fondation Green-Got' },
];

// Participants au court-métrage
const PARTICIPANTS = [
  {
    name: 'Karim Saari',
    role: 'Vice-président de Team Oxygen',
    href: 'https://www.team-oxygen.com/',
    desc: "Apnéiste et photographe sous-marin marseillais. Avec le Projet Sentinelle, son association a sorti plus de 5,7 tonnes de déchets des fonds marins en quatre éditions, sans bateau, en partant du bord.",
  },
  {
    name: 'Nicolas Camo',
    role: 'Wings of the Ocean',
    href: 'https://www.wingsoftheocean.com/',
    desc: "L'association qui dépollue les littoraux méditerranéens avec son trois-mâts, le Kraken, et lutte contre la pollution plastique sur trois axes : collecte, sensibilisation et science.",
  },
  {
    name: 'Anne-Leila Meistertzheim',
    role: 'Plastic At Sea',
    href: 'https://plasticatsea.com/',
    desc: 'Docteure en biologie marine, fondatrice de Plastic At Sea, qui étudie la toxicité et la fragmentation des plastiques en mer.',
  },
];

const GreenGot = () => {
  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/court-metrage-green-got-mediterranee']} preloadImage="/images/green-got-karim-saari-ponton-vieux-port-notre-dame-de-la-garde-marseille.webp" />

      {/* Breadcrumb */}
      <div className="container-custom pt-4">
        <Breadcrumb label="Court-métrage Green-Got" />
      </div>

      {/* Hero — hublot vidéo */}
      <section
        className="container-custom"
        style={{ paddingTop: '1rem', paddingBottom: '2rem' }}
      >
        <motion.div initial="hidden" animate="visible" variants={STAGGER_CONTAINER}>
          <motion.div
            variants={{ hidden: { y: 20 }, visible: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
            style={HUBLOT_STYLE}
          >
            {/* Vidéo plein-largeur dans le cadre */}
            <motion.div variants={FADE_IN_UP} className="max-h-[520px] overflow-hidden">
              <YouTubeFacade
                videoId="BoqO1LVcx5A"
                title="Court-métrage documentaire Fondation Green-Got — Sous la Méditerranée, au large de Marseille"
                aspectClass="aspect-[16/8]"
              />
            </motion.div>
            {/* Header text */}
            <div className="p-8 md:p-10 pt-6" style={{ background: 'rgba(3, 10, 28, 0.93)', backdropFilter: 'blur(12px)' }}>
              <div className="mt-4 max-w-3xl">
                <motion.p variants={FADE_IN_UP} className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">
                  Fondation Green-Got · Court-métrage documentaire
                </motion.p>
                <motion.h1
                  variants={FADE_IN_UP}
                  className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight"
                >
                  Sous la Méditerranée, on a filmé ce que les cartes postales ne montrent pas
                </motion.h1>
                <motion.p variants={FADE_IN_UP} className="text-white/70 text-base md:text-lg max-w-2xl">
                  Une décharge entière, posée au fond d'un port que des plongeurs croyaient préservé. Documenté en apnée et au large de Marseille pour la Fondation Green-Got.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="container-custom pb-12">

        {/* Résumé éditorial */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="glass-strong rounded-3xl overflow-hidden mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6">
              Le court-métrage
            </p>
            <div className="space-y-6 text-text-secondary leading-relaxed border-l-2 border-white/10 pl-6">
              <p>
                Des chaises, des tables, des bâches. Une décharge entière, posée au fond d'un port que des plongeurs croyaient préservé. C'est ce qu'on a documenté en apnée et au large de Marseille, pour ce court-métrage documentaire produit par la{' '}
                <strong className="text-ocean-teal font-semibold">Fondation Green-Got</strong>.
              </p>
              <p>
                La mer Méditerranée est la <strong className="text-white font-semibold">mer la plus polluée au monde</strong>. Mer semi-fermée, il lui faut près de 90 ans pour renouveler ses eaux : tout ce qui y entre s'y accumule. Et 80 % de ce plastique vient de la terre. Une fois fragmenté, il devient invisible. On en retrouve aujourd'hui dans le sang, le placenta, le lait maternel, le cerveau humain…
              </p>
              <p>
                Le plastique est un dérivé du pétrole. Les mêmes industriels qui le produisent sont financés par les mêmes grandes banques. La Fondation Green-Got existe pour financer ce que le marché ne paiera jamais : nettoyer une rivière, documenter une pollution, ramasser un million de mégots. Le nécessaire, sans retour financier possible.
              </p>
              <p>
                Grâce à la communauté Green-Got, des milliers de citoyens ont déjà été sensibilisés et de nouvelles missions de dépollution lancées sur les littoraux français. Chaque carte Green-Got utilisée au quotidien finance ce combat.
              </p>
              <p>
                <strong className="text-ocean-teal font-semibold">L'océan est résilient. Si on arrête la pollution maintenant, demain il sera capable de se réparer.</strong>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Galerie — extraits du court-métrage */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.p variants={FADE_IN_UP} className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6 text-center">
            Extraits du court-métrage
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHOTOS.map((photo, i) => (
              <motion.div
                key={photo.src}
                variants={FADE_IN_UP}
                className={`glass-strong rounded-2xl overflow-hidden border border-white/10 ${i === 0 ? 'sm:col-span-2' : ''}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto aspect-video object-cover"
                  loading="lazy"
                  decoding="async"
                  width="1280"
                  height="720"
                />
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-text-muted italic mt-4 text-center">
            Crédits images : Kim Nguyen &amp; Benoît Prabel
          </p>
        </motion.div>

        {/* Participants */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.p variants={FADE_IN_UP} className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-6 text-center">
            Avec la participation de
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTICIPANTS.map((p) => (
              <motion.a
                key={p.name}
                variants={FADE_IN_UP}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-strong rounded-3xl p-8 border border-white/10 hover:border-ocean-teal/50 transition-all duration-300 group flex flex-col"
              >
                <h2 className="text-lg font-bold text-white mb-1 group-hover:text-ocean-teal transition-colors">
                  {p.name}
                </h2>
                <p className="text-xs font-semibold text-ocean-teal uppercase tracking-widest mb-3 inline-flex items-center gap-1">
                  {p.role}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-text-secondary leading-relaxed text-sm">{p.desc}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bloc éditorial + photo — bas de page */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row">
            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                La Fondation Green-Got finance l'invisible
              </h2>
              <h3 className="sr-only">Court-métrage Green-Got — pollution plastique de la Méditerranée et dépollution en apnée à Marseille</h3>
              <p className="text-text-secondary leading-[1.8] text-lg mb-4">
                Pour ce court-métrage, la{' '}
                <strong className="text-white">Fondation Green-Got</strong> a suivi{' '}
                <strong className="text-ocean-teal">Karim Saari</strong>, apnéiste et photographe sous-marin
                marseillais, vice-président de <strong className="text-ocean-teal">Team Oxygen</strong>, dans
                les fonds marins que personne ne filme. Aux côtés de Wings of the Ocean et de la chercheuse
                Anne-Leila Meistertzheim, il documente une réalité brute : une décharge entière au fond d'un port.
              </p>
              <p className="text-text-secondary leading-[1.8] text-lg">
                Avec le <strong className="text-ocean-teal">Projet Sentinelle</strong>, son association a sorti
                plus de <strong className="text-white">5,7 tonnes de déchets</strong> des fonds marins en quatre
                éditions — sans bateau, en partant du bord. Une démarche que cette production aux côtés de
                Green-Got porte à l'échelle nationale pour mobiliser face à la{' '}
                <strong className="text-white">pollution plastique en Méditerranée</strong>.
              </p>
            </div>
            {/* Photo — extrait du reportage Green-Got */}
            <div className="lg:w-[42%] flex-shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden">
              <img
                src="/images/green-got-depollution-apnee-plastique-fond-marin-mediterranee.webp"
                alt="Décharge sous-marine au fond d'un port de Marseille — déchets plastiques documentés en apnée par Karim Saari pour la Fondation Green-Got"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
                width="1280"
                height="720"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* En savoir plus — partenaires */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
          className="text-center mb-4"
        >
          <motion.h2
            variants={FADE_IN_UP}
            className="text-sm uppercase tracking-widest text-text-muted mb-6 font-semibold"
          >
            Pour plus d'informations
          </motion.h2>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Fondation Green-Got', href: 'https://fondation.green-got.com/' },
              { label: 'Wings of the Ocean', href: 'https://www.wingsoftheocean.com/' },
              { label: 'Team Oxygen', href: 'https://www.team-oxygen.com/' },
              { label: 'Plastic At Sea', href: 'https://plasticatsea.com/' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn inline-flex items-center gap-2 group hover:scale-105 transition-all duration-300"
              >
                <span>{l.label}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            ))}
          </div>
          <p className="text-xs text-text-muted italic mt-8">
            Images : Kim Nguyen &amp; Benoît Prabel. Images Team Oxygen tirées du film «&nbsp;Oxygen&nbsp;» de Zéké Film — réalisation Roxane Perrot et Ugo Isoard.
          </p>
        </motion.div>

        {/* CTAs — Continuer la navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/depollution-marine"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Nos missions de dépollution</span>
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link
            to="/videos"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <span>Voir tous les documentaires</span>
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            to="/presse"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span>Retour aux Médias</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default GreenGot;
