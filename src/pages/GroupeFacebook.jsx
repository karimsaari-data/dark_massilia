import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Users, Camera, Recycle, Footprints, TrendingUp } from 'lucide-react';
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
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                  Groupe des Amoureux des{' '}
                  <span className="text-ocean-teal">Calanques de Marseille</span>{' '}
                  à Port-Cros
                </h1>

                <p className="text-white/70 text-base mb-4">
                  La plus grande communauté en ligne autour des Calanques de Marseille
                </p>

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
            Un espace pour célébrer et protéger notre littoral
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
                On ne protège bien que ce que l'on aime
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


      </div>
    </div>
  );
}
