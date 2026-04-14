import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Users, Camera, Recycle, Footprints, ExternalLink, TrendingUp } from 'lucide-react';
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
    title: 'Photos & Paysages',
    desc: 'Partagez vos plus belles photos des Calanques de Marseille jusqu\'à Port-Cros. Chaque cliché est un témoignage de la beauté de notre littoral.',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/25',
    iconColor: 'text-blue-400',
  },
  {
    icon: Recycle,
    emoji: '♻️',
    title: 'Actions environnementales',
    desc: 'Partagez vos nettoyages citoyens et vos engagements pour la mer. Ensemble, on protège ce qu\'on aime.',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/25',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Footprints,
    emoji: '🥾',
    title: 'Randonnées & Bons plans',
    desc: 'Conseils de randonnées, itinéraires respectueux et bons plans pour explorer la nature en laissant zéro trace.',
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
        .select('total_views, new_members, reactions, comments')
        .gte('date', since.toISOString().slice(0, 10))
        .order('date', { ascending: false });
      if (!data?.length) return;
      const totalViews   = data.reduce((s, r) => s + (r.total_views  ?? 0), 0);
      const totalMembers = data.reduce((s, r) => s + (r.new_members  ?? 0), 0);
      const totalReact   = data.reduce((s, r) => s + (r.reactions    ?? 0), 0);
      const totalComments= data.reduce((s, r) => s + (r.comments     ?? 0), 0);
      setStats({ totalViews, totalMembers, totalReact, totalComments, days: data.length });
    };
    load();
  }, []);

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/communaute-calanques']} />
      <div className="container-custom space-y-16">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={FADE_IN_UP} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Groupe Facebook · Depuis 2018
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={FADE_IN_UP}
            className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-3xl mx-auto"
          >
            La plus grande communauté en ligne autour des{' '}
            <span className="text-ocean-teal">Calanques de Marseille</span>
          </motion.h1>

          <motion.p variants={FADE_IN_UP} className="text-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Un espace de célébration, de partage et de protection de notre patrimoine naturel méditerranéen.
            Fondé en 2018 par Karim Saari, photographe environnemental et apnéiste marseillais.
          </motion.p>

          {/* Stat principale */}
          <motion.div variants={FADE_IN_UP} className="inline-flex flex-col items-center gap-1 mb-10">
            <span className="text-6xl md:text-7xl font-bold text-white tabular-nums">
              <StatCounter end={64700} duration={2500} />
            </span>
            <span className="text-ocean-teal font-semibold text-lg tracking-wide uppercase">membres</span>
            <span className="text-white/40 text-sm">Amoureux des Calanques de Marseille à Port-Cros</span>
          </motion.div>

          {/* CTA */}
          <motion.div variants={FADE_IN_UP} className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.facebook.com/groups/calanque/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base"
            >
              <Users className="w-4 h-4" />
              Rejoindre le groupe
            </a>
          </motion.div>
        </motion.div>

        {/* ── Image hero ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden aspect-[21/9] max-h-80"
        >
          <img
            src="/images/groupe%20des%20amoureux%20des%20calanques.webp"
            srcSet="/images/groupe%20des%20amoureux%20des%20calanques_400w.webp 400w, /images/groupe%20des%20amoureux%20des%20calanques_800w.webp 800w, /images/groupe%20des%20amoureux%20des%20calanques_1200w.webp 1200w"
            sizes="100vw"
            alt="Groupe Facebook Amoureux des Calanques de Marseille à Port-Cros"
            className="w-full h-full object-cover"
            style={{ objectPosition: '12% 25%' }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8">
            <p className="text-white/90 text-sm font-medium">
              Calanques de Marseille — Projet Sentinelle · Karim Saari
            </p>
          </div>
        </motion.div>

        {/* ── Stats 28 jours (live) ─────────────────────────────── */}
        {stats && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={STAGGER_CONTAINER}
          >
            <motion.div variants={FADE_IN_UP} className="text-center mb-6">
              <p className="text-white/40 text-sm flex items-center gap-2 justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Activité des 28 derniers jours
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Vues',       value: stats.totalViews,    color: 'text-blue-400',    bg: 'from-blue-600/15 to-indigo-600/15',   border: 'border-blue-500/20' },
                { label: 'Nouveaux membres', value: stats.totalMembers, color: 'text-emerald-400', bg: 'from-emerald-600/15 to-teal-500/15', border: 'border-emerald-500/20' },
                { label: 'Réactions',  value: stats.totalReact,    color: 'text-orange-400',  bg: 'from-orange-600/15 to-amber-500/15',  border: 'border-orange-500/20' },
                { label: 'Commentaires', value: stats.totalComments, color: 'text-purple-400', bg: 'from-purple-600/15 to-pink-500/15',   border: 'border-purple-500/20' },
              ].map(({ label, value, color, bg, border }) => (
                <motion.div key={label} variants={FADE_IN_UP}
                  className={`rounded-2xl border bg-gradient-to-br ${bg} ${border} p-5 text-center`}
                >
                  <p className={`text-2xl font-bold ${color} tabular-nums`}>
                    {value.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-white/50 text-xs mt-1">{label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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
            {PILLIERS.map(({ icon: Icon, emoji, title, desc, color, border, iconColor }) => (
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
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Règle d'or */}
          <motion.div variants={FADE_IN_UP}
            className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 flex gap-3 items-start"
          >
            <span className="text-xl leading-none flex-shrink-0">⚠️</span>
            <div>
              <p className="text-amber-300 font-semibold text-sm mb-1">Règle d'or</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Afin de préserver la qualité de notre fil d'actualité, merci d'éviter les questions touristiques "générales".
                Pensez à télécharger l'application officielle <strong className="text-white/80">Mes Calanques</strong> pour préparer vos sorties.
              </p>
            </div>
          </motion.div>
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
                src="/images/Karimsaari-portfolio-sous-marin-paysages-calanques-marseille-photographie-photographe-environnemental.webp"
                alt="Karim Saari — photographe environnemental et apnéiste à Marseille"
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

        {/* ── CTA final ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="glass-strong rounded-3xl p-10 md:p-14 max-w-2xl mx-auto">
            <p className="text-4xl mb-4">🌊</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Rejoignez les{' '}
              <span className="text-ocean-teal">64&nbsp;700 sentinelles</span>
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Ensemble, nous formons la plus grande communauté dédiée à la protection et à la célébration du littoral méditerranéen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://www.facebook.com/groups/calanque/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base"
              >
                <Users className="w-4 h-4" />
                Rejoindre le groupe Facebook
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors text-base"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
