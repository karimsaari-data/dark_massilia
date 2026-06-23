import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Users,
  Waves,
  Heart,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  Anchor,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InstagramStats from '../components/ui/InstagramStats';
import StatCounter from '../components/ui/StatCounter';
import { supabase } from '../lib/supabase';
import { FADE_IN_UP, STAGGER_CONTAINER, FACEBOOK_GROUP_MEMBERS, SOCIAL_STATS_DEFAULTS } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';

// ── Données statiques ───────────────────────────────────────────────────────

const IMPACT = [
  { num: 7,     suffix: ' %', labelKey: 'community.stats.microplastics', noteKey: 'community.stats.microplastics_label', icon: Waves },
  { num: 33800, suffix: '',   labelKey: 'community.stats.bottles',       noteKey: 'community.stats.bottles_label',       icon: AlertTriangle },
  { num: 80,    suffix: ' %', labelKey: 'community.stats.land_waste',    noteKey: 'community.stats.land_waste_label',    icon: Leaf },
  { num: 5,     suffix: ' g', labelKey: 'community.stats.ingested',      noteKey: 'community.stats.ingested_label',      icon: Heart },
];

const STEPS = [
  { num: '01', icon: Users,        id: 'follow'    },
  { num: '02', icon: Anchor,       id: 'material'  },
  { num: '03', icon: CheckCircle2, id: 'logistics' },
];

const PROFILES = [
  { emoji: '🛶', id: 'kayak'   },
  { emoji: '🧹', id: 'land'    },
  { emoji: '📸', id: 'photo'   },
  { emoji: '📢', id: 'digital' },
];

const FAQ = [
  { id: 'dive'     },
  { id: 'nodiver'  },
  { id: 'notify'   },
  { id: 'official' },
  { id: 'remote'   },
];

// ── Composant FAQ accordéon ─────────────────────────────────────────────────

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left text-white font-medium hover:text-ocean-teal transition-colors"
        aria-expanded={open}
      >
        <span className="text-base md:text-lg">{q}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 text-ocean-teal transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-text-secondary leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Page principale ─────────────────────────────────────────────────────────

const fmt = (value, decimals, suffix) =>
  parseFloat(value).toFixed(decimals ?? 1).replace('.', ',') + (suffix ?? '');

const Communaute = () => {
  const { t } = useTranslation();
  const [fbGroupLabel,  setFbGroupLabel]  = useState(FACEBOOK_GROUP_MEMBERS.toLocaleString('fr-FR'));
  const [totalLabel,    setTotalLabel]    = useState(SOCIAL_STATS_DEFAULTS.total_community.toLocaleString('fr-FR'));
  const [instaLabel,    setInstaLabel]    = useState(fmt(SOCIAL_STATS_DEFAULTS.instagram, 1, 'K'));
  const [tiktokLabel,   setTiktokLabel]   = useState(fmt(SOCIAL_STATS_DEFAULTS.tiktok, 1, 'K'));
  const [fbPagesLabel,  setFbPagesLabel]  = useState(Math.round(SOCIAL_STATS_DEFAULTS.facebook_pages * 1000).toLocaleString('fr-FR'));

  useEffect(() => {
    supabase
      .from('social_stats')
      .select('platform, value')
      .in('platform', ['facebook_group', 'instagram', 'tiktok', 'facebook_page',
                       'facebook_perso', 'youtube', 'x', 'pinterest', 'local_guide'])
      .then(({ data }) => {
        if (!data?.length) return;

        const map = Object.fromEntries(data.map(r => [r.platform, parseFloat(r.value)]));

        if (map.instagram != null) {
          setInstaLabel(fmt(map.instagram / 1000, 1, 'K'));
        }
        if (map.tiktok != null) {
          setTiktokLabel(fmt(map.tiktok / 1000, 1, 'K'));
        }
        if (map.facebook_group != null) {
          setFbGroupLabel(Math.round(map.facebook_group).toLocaleString('fr-FR'));
        }
        // Cumul pages Facebook (page + perso)
        const fbPages = (map.facebook_page ?? 0) + (map.facebook_perso ?? 0);
        if (fbPages > 0) {
          setFbPagesLabel(Math.round(fbPages).toLocaleString('fr-FR'));
        }
        // Total communauté : valeur arrondie saisie en backoffice (local_guide)
        if (map.local_guide != null) {
          setTotalLabel(Math.round(map.local_guide).toLocaleString('fr-FR'));
        }
      });
  }, []);

  return (
    <div className="min-h-screen pt-4 pb-16">
      <SEO {...SEO_PAGES['/communaute']} />
      <div className="container-custom pt-4">
        <Breadcrumb label={t('community.breadcrumb')} />
      </div>
      <div className="container-custom space-y-12">

        {/* ── 1. HERO — H1 + accroche + CTA ── */}
        {/* Rendu natif (pas motion) pour que le H1 et l'image soient visibles immédiatement → LCP */}
        <div
          className="p-8 md:p-12"
          style={{
            overflow: 'hidden',
            borderRadius: '24px',
            border: '2px solid rgba(0,171,168,0.55)',
            boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
            background: 'rgba(5,15,30,0.75)',
            backdropFilter: 'blur(16px)',
          }}
        >
            <div className="flex items-stretch gap-4 mb-4">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
                style={{ transformOrigin: 'top' }}
                className="w-[3px] bg-ocean-teal rounded-full flex-shrink-0"
                aria-hidden="true"
              />
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                {t('community.h1')}
              </h1>
            </div>
            <p className="text-ocean-teal text-lg md:text-xl font-semibold mb-6">
              {t('community.total_mobilized', { total: totalLabel })}
            </p>
            <div className="space-y-0 text-text-secondary leading-loose text-sm md:text-[0.95rem] mb-8">

              {/* Lead */}
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-light mb-6">
                {t('community.lead_p1_before')}{' '}
                <strong className="text-ocean-teal font-semibold">{totalLabel} {t('community.lead_p1_people')}</strong>
                {' '}{t('community.lead_p1_after')}
              </p>

              {/* Chapitre 1 */}
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-2 pb-1">
                {t('community.ch1_label')}
              </p>
              <p className="mb-4">
                <span className="float-left text-[3.2rem] leading-[0.8] font-bold text-ocean-teal mr-2 mt-1 select-none">
                  {t('community.ch1_dropcap')}
                </span>
                {t('community.ch1_after_dropcap', { instagram: instaLabel, tiktok: tiktokLabel })}
              </p>

              {/* Chapitre 2 */}
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ocean-teal/70 font-semibold pt-3 pb-1">
                {t('community.ch2_label')}
              </p>
              <p className="mb-4">
                {t('community.ch2_p', { fbGroup: fbGroupLabel, fbPages: fbPagesLabel })}
              </p>

              {/* Pull quote */}
              <blockquote className="my-5 py-4 px-5 bg-white/[0.04] border-l-2 border-ocean-teal rounded-r-lg">
                <p className="text-white/85 italic text-base leading-snug">{t('community.blockquote')}</p>
              </blockquote>
            </div>
            {/* CTA principal */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#reseaux"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                {t('community.cta_subscribe')}
              </a>
              <Link
                to="/depollution-marine"
                className="btn-secondary inline-flex items-center justify-center gap-2 group"
              >
                {t('community.cta_join')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* Photo de groupe — candidat LCP, chargée en priorité */}
            <img
              src="/images/karim-saari-marseille-130000-sentinelles-calanques-depollution.webp"
              alt={t('community.img_alt')}
              className="w-full rounded-2xl"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
        </div>

        {/* ── 2. CHIFFRES D'URGENCE — contexte pollution ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP} className="glass rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              {t('community.impact_h2')}
            </h2>
            <p className="text-text-secondary text-center mb-8 text-lg">
              {t('community.impact_subtitle')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {IMPACT.map(({ num, suffix, labelKey, noteKey, icon: Icon }) => (
                <div key={labelKey} className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-ocean-teal/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-ocean-teal" />
                  </div>
                  <div className="text-xs font-semibold text-ocean-teal/70 uppercase tracking-widest mb-1">{t(noteKey)}</div>
                  <div className="text-2xl md:text-3xl font-bold text-ocean-teal mb-1">
                    <StatCounter end={num} suffix={suffix} duration={num > 1000 ? 2500 : 1500} />
                  </div>
                  <div className="text-xs text-text-secondary leading-snug">{t(labelKey)}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── 3. COMMENT PARTICIPER — 3 étapes ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t('community.steps_h2')}
            </h2>
            <p className="text-text-secondary mb-10 text-lg">
              {t('community.steps_subtitle')}
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map(({ num, icon: Icon, id }) => (
                <div key={id} className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl font-black text-ocean-teal/30 leading-none select-none">
                      {num}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-ocean-teal/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-ocean-teal" />
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{t('community.step_' + id + '_title')}</h3>
                  <p className="text-text-secondary leading-relaxed text-sm">{t('community.step_' + id + '_desc')}</p>
                </div>
              ))}
            </div>
            {/* Vidéo — dépollution J4 avec Plastic Odyssey, 11 avril 2026 */}
            <div className="mt-10">
              <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">{t('community.video_label')}</p>
              <p className="text-white font-bold text-lg mb-1">
                {t('community.video_title')}
              </p>
              <p className="text-text-secondary text-sm mb-4">
                {t('community.video_date_venue')}{' '}
                <Link to="/blog/depollution-au-j4-quand-plastic-odyssey-reunit-marseille-pour-nettoyer-ce-qui-se-cache-sous-la-surface" className="text-ocean-teal hover:underline">
                  Plastic Odyssey
                </Link>
                {t('community.video_orgs_after')}
              </p>
              <video
                src="/assets/video/communaut%C3%A9.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full rounded-2xl"
                style={{ maxHeight: '540px', background: '#000' }}
                aria-label={t('community.video_aria')}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ── 4. PROFILS BÉNÉVOLES ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
              {t('community.profiles_h2')}
            </h2>
            <p className="text-text-secondary text-center mb-8 text-lg">
              {t('community.profiles_subtitle')}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROFILES.map(({ emoji, id }) => (
                <motion.div
                  key={id}
                  variants={FADE_IN_UP}
                  className="glass rounded-2xl p-6 text-center hover:border-ocean-teal/40 border border-white/10 transition-colors"
                >
                  <div className="text-4xl mb-3">{emoji}</div>
                  <h3 className="text-white font-bold mb-2">{t('community.profile_' + id + '_title')}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{t('community.profile_' + id + '_desc')}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── 5. RÉSEAUX & COMMUNAUTÉ (InstagramStats) ── */}
        <motion.div
          id="reseaux"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t('community.social_h2', { total: totalLabel })}
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              {t('community.social_subtitle')}
            </p>
            <InstagramStats />
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-text-secondary mb-4 font-medium text-white">{t('community.social_join_title')}</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { labelKey: 'community.social_link_fb_group', href: 'https://www.facebook.com/groups/calanque/' },
                  { label: 'Instagram @karimsaari',  href: 'https://www.instagram.com/karimsaari' },
                  { label: 'TikTok @dark.massilia',  href: 'https://www.tiktok.com/@dark.massilia' },
                  { label: 'YouTube @dark.massilia', href: 'https://www.youtube.com/@dark.massilia' },
                  { label: '500px',                  href: 'https://500px.com/p/karimsaari?view=photos' },
                ].map(({ labelKey, label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium text-sm"
                  >
                    {labelKey ? t(labelKey) : label}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── 6. FAQ BÉNÉVOLAT ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={STAGGER_CONTAINER}
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-7 h-7 text-ocean-teal flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {t('community.faq_h2')}
              </h2>
            </div>
            <div>
              {FAQ.map(({ id }) => (
                <FaqItem key={id} q={t('community.faq_' + id + '_q')} a={t('community.faq_' + id + '_a')} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── 7. CTA FINAL — double bouton ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-8 md:p-12 text-center"
        >
          <Heart className="w-10 h-10 text-ocean-teal mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t('community.cta_h2')}
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            {t('community.cta_p')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/communaute-calanques"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              {t('community.cta_group_btn')} · {fbGroupLabel} {t('community.cta_group_suffix')}
            </Link>
            <Link
              to="/contact"
              className="btn-secondary inline-flex items-center justify-center gap-2 group"
            >
              {t('community.cta_write')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {/* Lien interne Silo 2 */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/depollution-marine"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              {t('community.cta_link_missions')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/presse"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              {t('community.cta_link_media')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/photographie-sous-marine"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              {t('community.cta_link_gallery')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/communaute-calanques"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              {t('community.cta_link_group')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/local-guide-marseille"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              {t('community.cta_link_local_guide')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/blog"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              {t('community.cta_link_blog')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Communaute;
