import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, Camera, Recycle, Footprints, Smartphone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FADE_IN_UP, STAGGER_CONTAINER, FACEBOOK_GROUP_MEMBERS } from '../utils/constants';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import FireRiskBanner from '../components/FireRiskBanner';
import { SEO_PAGES } from '../utils/seo';
import { supabase } from '../lib/supabase';
import StatCounter from '../components/ui/StatCounter';

/* ── Bloc App Mes Calanques — texte gauche / vidéo droite ───── */
const AppMesCalanques = ({ videoId }) => {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  return (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[260px]">

        {/* Gauche — infos app */}
        <div className="md:w-[42%] shrink-0 p-7 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-white/8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base leading-tight">App Mes Calanques</h3>
              <p className="text-emerald-400 text-xs mt-0.5">{t('groupeFacebook.app_free')}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/60 leading-relaxed">
            {t('groupeFacebook.app_desc')}
          </p>

          {/* Features */}
          <ul className="space-y-2.5 flex-1">
            {[1, 2, 3, 4, 5].map(i => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white/65">
                <span className="text-emerald-400 shrink-0 mt-0.5 text-base leading-none">✓</span>
                {t('groupeFacebook.app_feature_' + i)}
              </li>
            ))}
          </ul>

          {/* Store buttons */}
          <div className="flex gap-2">
            <a href="https://apps.apple.com/fr/app/mes-calanques/id1418542125"
              target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl bg-white/6 border border-white/12 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
              App Store
            </a>
            <a href="https://play.google.com/store/apps/details?id=fr.setavoo.infoparcpnc&hl=fr"
              target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl bg-white/6 border border-white/12 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
              Google Play
            </a>
          </div>
        </div>

        {/* Droite — vidéo plein panneau */}
        <div
          className="flex-1 relative cursor-pointer group"
          style={{ minHeight: '220px' }}
          onClick={() => setPlaying(true)}
        >
          {playing ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={t('groupeFacebook.app_video_title')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={t('groupeFacebook.app_video_thumb_alt')}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              {/* Overlay sombre */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              {/* Bouton play centré */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-transform duration-200">
                  <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-white/80 text-xs font-medium uppercase tracking-widest">{t('groupeFacebook.app_watch')}</p>
              </div>
              {/* Titre en bas */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white/50 text-[10px] uppercase tracking-wider mb-1">{t('groupeFacebook.app_video_tag')}</p>
                <p className="text-white text-sm font-medium leading-snug">{t('groupeFacebook.app_video_title')}</p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

/* ── Pilliers du groupe ─────────────────────────────────────── */
const PILLIERS = [
  {
    icon: Camera,    emoji: '📸', id: 'photos',
    color: 'from-blue-500/20 to-cyan-500/20',     border: 'border-blue-500/25',    iconColor: 'text-blue-400',
  },
  {
    icon: Recycle,   emoji: '♻️', id: 'eco',
    color: 'from-emerald-500/20 to-teal-500/20',  border: 'border-emerald-500/25', iconColor: 'text-emerald-400',
  },
  {
    icon: Footprints, emoji: '🥾', id: 'hike',
    color: 'from-orange-500/20 to-amber-500/20',  border: 'border-orange-500/25',  iconColor: 'text-orange-400',
  },
];

const FAQ_GRP = [
  { id: 'join'     },
  { id: 'members'  },
  { id: 'content'  },
  { id: 'missions' },
  { id: 'hike'     },
];

/* ── Page principale ─────────────────────────────────────────── */
export default function GroupeFacebook() {
  const { t } = useTranslation();
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
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/communaute-calanques']} />
      <FireRiskBanner />
      <div className="container-custom pt-4">
        <Breadcrumb label={t('groupeFacebook.breadcrumb')} />
      </div>
      <div className="container-custom space-y-16 pt-4 pb-16">

        {/* ── Hero CTA card ─────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
        >
          <motion.div
            variants={FADE_IN_UP}
            style={{
              overflow: 'hidden',
              borderRadius: '24px',
              border: '2px solid rgba(0,171,168,0.55)',
              boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
            }}
          >
            <div className="grid md:grid-cols-[1fr_1.1fr] gap-0">

              {/* Contenu gauche */}
              <div className="p-8 md:p-12 flex flex-col justify-start order-2 md:order-1 bg-black/55 backdrop-blur-sm">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6 w-fit">
                  <Users className="w-3.5 h-3.5" />
                  {t('groupeFacebook.badge')}
                </div>

                {/* H1 */}
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
                  {t('groupeFacebook.h1_prefix')}{' '}
                  <span className="text-ocean-teal">{t('groupeFacebook.calanques_name')}</span>
                </h1>

                <div className="space-y-3 text-text-secondary text-sm leading-relaxed mb-8">
                  <p>{t('groupeFacebook.intro_p')}</p>
                </div>

                {/* Titre stats */}
                <div className="flex items-baseline gap-3 mb-3">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                    {t('groupeFacebook.stats_title')}
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
                      <StatCounter end={FACEBOOK_GROUP_MEMBERS} duration={2000} />
                    </p>
                    <p className="text-ocean-teal text-xs font-semibold uppercase tracking-wide mt-0.5">{t('groupeFacebook.stat_members_label')}</p>
                    <p className="text-white/35 text-xs mt-0.5">
                      {t('groupeFacebook.stat_members_desc')}
                    </p>
                  </div>
                  {/* Stats live Supabase */}
                  {stats ? (
                    <>
                      <div className="rounded-xl border border-blue-500/20 bg-blue-600/10 p-3 text-center">
                        <p className="text-xl font-bold text-blue-400 tabular-nums">{stats.totalViews.toLocaleString('fr-FR')}</p>
                        <p className="text-white/40 text-xs mt-0.5">{t('groupeFacebook.stat_views_label')}</p>
                      </div>
                      <div className="rounded-xl border border-amber-500/20 bg-amber-600/10 p-3 text-center">
                        <p className="text-xl font-bold text-amber-400 tabular-nums">{stats.totalReact.toLocaleString('fr-FR')}</p>
                        <p className="text-white/40 text-xs mt-0.5">{t('groupeFacebook.stat_reactions_label')}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-xl border border-blue-500/20 bg-blue-600/10 p-3 text-center">
                        <p className="text-xl font-bold text-blue-400">789K</p>
                        <p className="text-white/40 text-xs mt-0.5">{t('groupeFacebook.stat_views_fallback_label')}</p>
                      </div>
                      <div className="rounded-xl border border-amber-500/20 bg-amber-600/10 p-3 text-center">
                        <p className="text-xl font-bold text-amber-400">11 793</p>
                        <p className="text-white/40 text-xs mt-0.5">{t('groupeFacebook.stat_reactions_label')}</p>
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
                    {t('groupeFacebook.cta_join')}
                  </a>
                  <a
                    href="https://www.facebook.com/groups/calanque/announcements"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors text-sm font-medium"
                  >
                    📌 {t('groupeFacebook.cta_featured')}
                  </a>
                </div>
              </div>

              {/* Image droite */}
              <div className="relative h-72 md:h-auto min-h-[420px] order-1 md:order-2">
                <img
                  src="/images/groupe-des-amoureux-des-calanques.webp"
                  srcSet="/images/groupe-des-amoureux-des-calanques_400w.webp 400w, /images/groupe-des-amoureux-des-calanques_800w.webp 800w, /images/groupe-des-amoureux-des-calanques_1200w.webp 1200w"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={t('groupeFacebook.hero_img_alt')}
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
            {t('groupeFacebook.pilliers_h2')}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PILLIERS.map(({ icon: Icon, emoji, id, color, border, iconColor }) => (
              <motion.div
                key={id}
                variants={FADE_IN_UP}
                className={`rounded-2xl border bg-gradient-to-br ${color} ${border} p-7 flex flex-col gap-4`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl leading-none">{emoji}</span>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="text-white font-semibold text-lg">{t('groupeFacebook.pillar_' + id + '_title')}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{t('groupeFacebook.pillar_' + id + '_text')}</p>
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
                alt={t('groupeFacebook.why_img_alt')}
                className="w-full h-full object-cover absolute inset-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
            </div>

            {/* Texte */}
            <div className="p-8 md:p-12 lg:flex-1 flex flex-col justify-center">
              <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>🌊</span> {t('groupeFacebook.why_badge')}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight">
                {t('groupeFacebook.why_h2')}
              </h2>
              <div className="space-y-4 text-text-secondary leading-[1.8]">
                <p>{t('groupeFacebook.why_p1')}</p>
                <p>{t('groupeFacebook.why_p2')}</p>
                <p>
                  {t('groupeFacebook.why_p3_a')}
                  <Link to="/photographe-environnemental-marseille" className="text-ocean-teal hover:text-white transition-colors">
                    {t('groupeFacebook.why_p3_link1')}
                  </Link>
                  {t('groupeFacebook.why_p3_b')}
                  <Link to="/depollution-marine" className="text-ocean-teal hover:text-white transition-colors">
                    {t('groupeFacebook.why_p3_link2')}
                  </Link>
                  {t('groupeFacebook.why_p3_c')}
                  <strong className="text-white/80">Team Oxygen</strong>.
                </p>
              </div>

              <p className="mt-6 text-white/50 text-sm italic">
                {t('groupeFacebook.why_signature')}
              </p>
            </div>
          </motion.div>
        </motion.div>


        {/* ── Ressources pratiques ─────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={STAGGER_CONTAINER}
        >
          <motion.h2 variants={FADE_IN_UP} className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            {t('groupeFacebook.resources_h2')}
          </motion.h2>
          {/* App Mes Calanques */}
          <motion.div variants={FADE_IN_UP}>
            <AppMesCalanques videoId="WMuqAqOvXMA" />
          </motion.div>

          {/* Lien utile — accès aux Calanques */}
          <motion.div variants={FADE_IN_UP} className="mt-6 text-center">
            <a
              href="https://www.marseille-tourisme.com/decouvrez-marseille/calanques-plages-et-nature/les-calanques-de-marseille/comment-acceder-aux-calanques/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ocean-teal hover:text-ocean-teal/80 transition-colors duration-200 underline underline-offset-4 decoration-ocean-teal/40 hover:decoration-ocean-teal/70"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {t('groupeFacebook.access_link_text')}
            </a>
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
            {t('groupeFacebook.faq_h2')}
          </motion.h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {FAQ_GRP.map(({ id }) => (
              <motion.details
                key={id}
                variants={FADE_IN_UP}
                className="glass rounded-2xl border border-white/8 overflow-hidden group"
              >
                <summary className="px-6 py-5 cursor-pointer text-white font-semibold text-sm md:text-base flex items-center justify-between gap-4 select-none list-none">
                  {t('groupeFacebook.faq_' + id + '_q')}
                  <span className="text-ocean-teal text-xl shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="px-6 pb-5 text-text-secondary text-sm leading-relaxed border-t border-white/8 pt-4">
                  {t('groupeFacebook.faq_' + id + '_a')}
                </p>
              </motion.details>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
