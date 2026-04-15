import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Users, Camera, Recycle, Footprints, TrendingUp, Map, Car, AlertTriangle, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import { supabase } from '../lib/supabase';

/* ── Compteur animé ─────────────────────────────────────────── */
const StatCounter = ({ end, suffix = '', duration = 2000 }) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) { setCount(end); return; }
    let startTime = null;
    let raf;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration, prefersReducedMotion]);

  return <span ref={ref}>{count.toLocaleString('fr-FR')}{suffix}</span>;
};

/* ── Pilliers du groupe ─────────────────────────────────────── */
const PILLIERS = [
  {
    icon: Camera,
    emoji: '📸',
    title: 'Vos plus belles captures et rencontres sauvages',
    node: <>
      Des falaises majestueuses des <Link to="/photographie-paysage-mer" className="text-blue-300 hover:text-white transition-colors font-medium">Calanques de Marseille</Link> jusqu'aux eaux cristallines du parc national de Port-Cros, montrez-nous ce qui vous émerveille. Partagez vos{' '}
      <Link to="/photographie-sous-marine" className="text-blue-300 hover:text-white transition-colors font-medium">photos et vidéos sous-marines</Link>, mais aussi vos rencontres avec la riche{' '}
      <Link to="/donnees-scientifiques" className="text-blue-300 hover:text-white transition-colors font-medium">biodiversité de notre littoral</Link>{' '}
      — <strong className="text-white/80">herbiers de posidonie</strong>, mérous, oiseaux marins. Chaque image partagée est un rappel de la beauté de ce que nous devons protéger.
    </>,
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/25',
    iconColor: 'text-blue-400',
  },
  {
    icon: Recycle,
    emoji: '♻️',
    title: 'Vos actions éco-citoyennes et initiatives de terrain',
    node: <>
      L'engagement est le cœur battant de cette communauté. Mettez en lumière vos actions concrètes pour la Méditerranée : ramassage de déchets sur les plages,{' '}
      <Link to="/depollution-marine" className="text-emerald-300 hover:text-white transition-colors font-medium">dépollution sous-marine</Link>,{' '}
      campagnes de sensibilisation ou <strong className="text-white/80">alertes environnementales</strong>. Partagez vos retours d'expérience, mobilisez des bonnes volontés et inspirez les autres membres à agir à leur échelle.
    </>,
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/25',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Footprints,
    emoji: '🥾',
    title: 'Vos échappées sauvages et bonnes pratiques',
    node: <>
      Partagez vos idées d'<Link to="/local-guide-marseille" className="text-orange-300 hover:text-white transition-colors font-medium">itinéraires de randonnée</Link>, vos parcours d'exploration en mer et vos conseils pour profiter du littoral dans le plus strict respect de la nature. Approche <strong className="text-white/80">"zéro trace"</strong>, zones fragiles à éviter, bonnes pratiques en période de nidification, équipements éco-responsables... Ensemble, promouvons une manière éthique et durable de vivre notre passion pour la{' '}
      <Link to="/carte-calanques" className="text-orange-300 hover:text-white transition-colors font-medium">côte marseillaise</Link>.
    </>,
    color: 'from-orange-500/20 to-amber-500/20',
    border: 'border-orange-500/25',
    iconColor: 'text-orange-400',
  },
];

/* ── Page principale ─────────────────────────────────────────── */
export default function GroupeFacebook() {
  const [stats, setStats] = useState(null);

  /* Récupère les 28 derniers jours depuis Supabase */
  useEffect(() => {
    const load = async () => {
      const since = new Date();
      since.setDate(since.getDate() - 28);
      const { data } = await supabase
        .from('facebook_group_insights')
        .select('date, views, active_members, reactions, comments')
        .gte('date', since.toISOString().slice(0, 10))
        .order('date', { ascending: true });
      if (!data?.length) return;
      const totalViews    = data.reduce((s, r) => s + (r.views          ?? 0), 0);
      const totalMembers  = data.reduce((s, r) => s + (r.active_members ?? 0), 0);
      const totalReact    = data.reduce((s, r) => s + (r.reactions      ?? 0), 0);
      const totalComments = data.reduce((s, r) => s + (r.comments       ?? 0), 0);
      const dateFrom      = data[0].date;
      const dateTo        = data[data.length - 1].date;
      setStats({ totalViews, totalMembers, totalReact, totalComments, days: data.length, dateFrom, dateTo });
    };
    load();
  }, []);

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/communaute-calanques']} />
      <div className="container-custom space-y-16">

        {/* ── Hero CTA card ─────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl overflow-hidden border border-white/10">
            <div className="grid md:grid-cols-[1fr_1.1fr] gap-0">

              {/* Contenu gauche */}
              <div className="p-8 md:p-12 flex flex-col justify-start order-2 md:order-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6 w-fit">
                  <Users className="w-3.5 h-3.5" />
                  Groupe Facebook · Depuis 2018
                </div>

                {/* H1 */}
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
                  La plus grande communauté en ligne autour des{' '}
                  <span className="text-ocean-teal">Calanques de Marseille</span>
                </h1>

                <div className="space-y-3 text-text-secondary text-sm leading-relaxed mb-8">
                  <p>
                    Plus qu'un simple groupe sur les réseaux sociaux, cet espace est devenu depuis sa création en 2018 le point de rassemblement incontournable de tous les passionnés du littoral méditerranéen. Un véritable écosystème digital fondé sur trois piliers : la <strong className="text-white/80">célébration de la beauté sauvage</strong> de nos côtes, le partage d'expériences authentiques et la <strong className="text-white/80">protection active de notre patrimoine naturel</strong>.
                  </p>
                </div>

                {/* Titre stats */}
                <div className="flex items-baseline gap-3 mb-3">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                    Une force collective en quelques chiffres
                  </p>
                  {stats?.dateFrom && (
                    <p className="text-white/30 text-xs">
                      {stats.dateFrom} → {stats.dateTo} ({stats.days} j)
                    </p>
                  )}
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {/* Membres — stat principale */}
                  <div className="col-span-2 rounded-2xl border border-ocean-teal/25 bg-ocean-teal/8 p-4">
                    <p className="text-3xl font-bold text-white tabular-nums">
                      <StatCounter end={64700} duration={2000} />
                    </p>
                    <p className="text-ocean-teal text-xs font-semibold uppercase tracking-wide mt-0.5">Membres</p>
                    <p className="text-white/35 text-xs mt-0.5">
                      Une famille immense d'amoureux de la nature, des Calanques de Marseille jusqu'au joyau de Port-Cros
                    </p>
                  </div>
                  {/* Stats live Supabase */}
                  {stats ? (
                    <>
                      <div className="rounded-xl border border-blue-500/20 bg-blue-600/10 p-3 text-center">
                        <p className="text-xl font-bold text-blue-400 tabular-nums">{stats.totalViews.toLocaleString('fr-FR')}</p>
                        <p className="text-white/40 text-xs mt-0.5">Vues · 28j</p>
                      </div>
                      <div className="rounded-xl border border-amber-500/20 bg-amber-600/10 p-3 text-center">
                        <p className="text-xl font-bold text-amber-400 tabular-nums">{stats.totalReact.toLocaleString('fr-FR')}</p>
                        <p className="text-white/40 text-xs mt-0.5">Réactions · 28j</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-xl border border-blue-500/20 bg-blue-600/10 p-3 text-center">
                        <p className="text-xl font-bold text-blue-400">789K</p>
                        <p className="text-white/40 text-xs mt-0.5">Vues totales</p>
                      </div>
                      <div className="rounded-xl border border-amber-500/20 bg-amber-600/10 p-3 text-center">
                        <p className="text-xl font-bold text-amber-400">11 793</p>
                        <p className="text-white/40 text-xs mt-0.5">Réactions · 28j</p>
                      </div>
                    </>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/groups/calanque/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Rejoindre le groupe
                  </a>
                  <a
                    href="https://www.facebook.com/groups/calanque/announcements"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors text-sm font-medium"
                  >
                    📌 À la une
                  </a>
                </div>
              </div>

              {/* Image droite */}
              <div className="relative h-72 md:h-auto min-h-[420px] order-1 md:order-2">
                <img
                  src="/images/groupe%20des%20amoureux%20des%20calanques.webp"
                  srcSet="/images/groupe%20des%20amoureux%20des%20calanques_400w.webp 400w, /images/groupe%20des%20amoureux%20des%20calanques_800w.webp 800w, /images/groupe%20des%20amoureux%20des%20calanques_1200w.webp 1200w"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="Groupe des Amoureux des Calanques de Marseille à Port-Cros"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: '0% 50%' }}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent md:bg-gradient-to-l" />
              </div>

            </div>
          </motion.div>
        </motion.div>

        {/* ── Ce que vous pouvez partager ──────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={STAGGER_CONTAINER}
        >
          <motion.h2 variants={FADE_IN_UP} className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
            Que partager dans le groupe Calanques de Marseille ?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PILLIERS.map(({ icon: Icon, emoji, title, node, color, border, iconColor }) => (
              <motion.div
                key={title}
                variants={FADE_IN_UP}
                className={`rounded-2xl border bg-gradient-to-br ${color} ${border} p-7 flex flex-col gap-4`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl leading-none">{emoji}</span>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="text-white font-semibold text-lg">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{node}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Pourquoi ce groupe / Histoire de Karim ───────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP}
            className="glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Image */}
            <div className="lg:w-2/5 relative min-h-64 lg:min-h-0">
              <img
                src="/images/biodiversite-calanques-marseille-2.webp"
                alt="Poulpe en mode camouflage — Parc national des Calanques de Marseille"
                className="w-full h-full object-cover absolute inset-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
            </div>

            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>🌊</span> Pourquoi ce groupe ?
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight">
                Pourquoi ce groupe sur les Calanques de Marseille ?
              </h2>
              <div className="space-y-4 text-text-secondary leading-[1.8]">
                <p>
                  J'ai fondé cet espace en <strong className="text-white/80">2018</strong> avec une conviction simple :
                  en parcourant nos côtes, j'ai été frappé par la beauté incroyable de notre patrimoine, mais aussi par
                  son extrême fragilité face à la pollution.
                </p>
                <p>
                  J'ai voulu créer un lieu d'échange et de sensibilisation pour tous ceux qui chérissent et défendent la Méditerranée.
                </p>
                <p>
                  En tant que <Link to="/photographe-environnemental-marseille" className="text-ocean-teal hover:text-white transition-colors">photographe environnemental</Link> et
                  apnéiste, je plonge au plus près de la vie marine pour témoigner de cette urgence écologique.
                  Un engagement qui se traduit aussi en actions concrètes de <Link to="/depollution-marine" className="text-ocean-teal hover:text-white transition-colors">dépollution sur le terrain</Link> avec
                  notre association <strong className="text-white/80">Team Oxygen</strong>.
                </p>
              </div>

              <p className="mt-6 text-white/50 text-sm italic">
                — Karim Saari, Photographe environnemental
              </p>
            </div>
          </motion.div>
        </motion.div>


        {/* ── Ressources pratiques ─────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={STAGGER_CONTAINER}
        >
          <motion.h2 variants={FADE_IN_UP} className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            Ressources pratiques pour visiter les Calanques
          </motion.h2>
          <motion.p variants={FADE_IN_UP} className="text-text-secondary text-center text-sm mb-10 max-w-xl mx-auto">
            Les outils et infos indispensables avant de partir — régulièrement partagés dans le groupe.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* App PNC */}
            <motion.div variants={FADE_IN_UP}
              className="glass-strong rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-teal-500/8 p-7 flex flex-col gap-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">App officielle du Parc National</h3>
                  <p className="text-emerald-400 text-xs font-medium">Mes Calanques — gratuite</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                L'application officielle du <strong className="text-white/80">Parc National des Calanques</strong> regroupe toutes les randonnées balisées, les zones réglementées, les espèces protégées à observer et les alertes en temps réel (fermetures, risque incendie).
              </p>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Carte hors-ligne des sentiers GR® et chemins côtiers</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Signalement d'espèces et points d'intérêt naturaliste</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Alertes fermetures et conditions météo</li>
              </ul>
              <div className="flex flex-wrap gap-3 mt-auto pt-2">
                <a
                  href="https://apps.apple.com/fr/app/rando-calanques/id1448768736"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/25 transition-colors text-xs font-medium"
                >
                  <Map className="w-3.5 h-3.5" /> App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=fr.calanques.randonnee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/25 transition-colors text-xs font-medium"
                >
                  <Map className="w-3.5 h-3.5" /> Google Play
                </a>
              </div>
            </motion.div>

            {/* Accès routier */}
            <motion.div variants={FADE_IN_UP}
              className="glass-strong rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-orange-500/8 p-7 flex flex-col gap-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">Accès routier & restrictions</h3>
                  <p className="text-amber-400 text-xs font-medium">Vérifier avant de partir</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                La <strong className="text-white/80">route des Calanques (D559a)</strong> entre Marseille et Cassis est régulièrement fermée en période estivale et par grand vent. Certaines calanques imposent une <strong className="text-white/80">réservation obligatoire</strong> en haute saison.
              </p>
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-500/15 bg-amber-500/8 p-3.5">
                  <p className="text-amber-300 text-xs font-semibold mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Calanque de Sugiton — quota visiteurs
                  </p>
                  <p className="text-white/55 text-xs leading-relaxed">Réservation obligatoire de mai à septembre via le site du PNC. Places limitées à 400 personnes/jour.</p>
                </div>
                <div className="rounded-xl border border-orange-500/15 bg-orange-500/8 p-3.5">
                  <p className="text-orange-300 text-xs font-semibold mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Risque incendie — fermetures préfectorales
                  </p>
                  <p className="text-white/55 text-xs leading-relaxed">Entre juin et septembre, les massifs peuvent être fermés selon le niveau de risque. Vérifier le matin même sur le site de la Préfecture 13.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-auto pt-2">
                <a
                  href="https://www.calanques-parcnational.fr/fr/venir-dans-le-parc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-300 hover:bg-amber-500/25 transition-colors text-xs font-medium"
                >
                  <Car className="w-3.5 h-3.5" /> Site officiel PNC
                </a>
                <a
                  href="https://share.google/mufwnPbFpp2le3m8k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-300 hover:bg-amber-500/25 transition-colors text-xs font-medium"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Calanques ouvertes ?
                </a>
              </div>
            </motion.div>

          </div>

          {/* ── Vidéo présentation app ─────────────────────────── */}
          <motion.div variants={FADE_IN_UP} className="mt-8">
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/WMuqAqOvXMA"
                title="Application Mes Calanques — Parc National des Calanques de Marseille"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <p className="text-white/35 text-xs text-center mt-3">
              Présentation de l'application officielle <strong className="text-white/50">Mes Calanques</strong> du Parc National
            </p>
          </motion.div>

        </motion.div>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={STAGGER_CONTAINER}
        >
          <motion.h2 variants={FADE_IN_UP} className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
            Questions fréquentes sur le groupe Calanques
          </motion.h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'Comment rejoindre le groupe Facebook des Calanques de Marseille ?',
                a: `Rendez-vous sur Facebook et cherchez « Amoureux des Calanques de Marseille à Port-Cros », ou cliquez directement sur le bouton « Rejoindre le groupe » sur cette page. L'accès est gratuit et ouvert à tous les passionnés du littoral méditerranéen.`,
              },
              {
                q: 'Combien de membres compte le groupe Calanques ?',
                a: 'Le groupe réunit plus de 64 700 membres actifs, ce qui en fait la plus grande communauté en ligne dédiée aux Calanques de Marseille et au littoral de Port-Cros.',
              },
              {
                q: 'Quel type de contenu peut-on publier dans le groupe ?',
                a: 'Photos de randonnée dans les Calanques, vidéos sous-marines, alertes environnementales, comptes-rendus de dépollution marine, questions sur la faune et la flore méditerranéenne. Tout contenu qui célèbre ou protège notre littoral est le bienvenu.',
              },
              {
                q: 'Le groupe organise-t-il des sorties ou missions de nettoyage ?',
                a: `Le groupe n'organise pas directement de sorties, mais c'est un espace de partage des actions environnementales des différentes associations marseillaises engagées pour la protection du littoral. Team Oxygen, mais aussi d'autres collectifs, y annoncent leurs missions de dépollution, ramassages de déchets et initiatives éco-citoyennes.`,
              },
              {
                q: 'Peut-on proposer des randonnées ou itinéraires dans les Calanques ?',
                a: `Absolument. Le partage d'itinéraires, de sentiers de randonnée et de bonnes pratiques pour explorer les Calanques dans le respect de la nature est une des valeurs fondatrices du groupe.`,
              },
            ].map(({ q, a }) => (
              <motion.details
                key={q}
                variants={FADE_IN_UP}
                className="glass rounded-2xl border border-white/8 overflow-hidden group"
              >
                <summary className="px-6 py-5 cursor-pointer text-white font-semibold text-sm md:text-base flex items-center justify-between gap-4 select-none list-none">
                  {q}
                  <span className="text-ocean-teal text-xl shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="px-6 pb-5 text-text-secondary text-sm leading-relaxed border-t border-white/8 pt-4">{a}</p>
              </motion.details>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
