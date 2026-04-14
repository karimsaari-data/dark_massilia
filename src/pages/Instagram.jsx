import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
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
import InstagramStats from '../components/ui/InstagramStats';
import { supabase } from '../lib/supabase';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

// ── Compteur animé — s'active à l'entrée dans le viewport ───────────────────
const StatCounter = ({ end, suffix = '', duration = 2000 }) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
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

// ── Données statiques ───────────────────────────────────────────────────────

const IMPACT = [
  {
    num: 7, suffix: ' %',
    label: 'des microplastiques mondiaux — pour moins de 1 % de la surface océanique',
    icon: Waves,
    note: 'Le piège méditerranéen',
  },
  {
    num: 33800, suffix: '',
    label: 'bouteilles plastique déversées chaque minute dans nos eaux',
    icon: AlertTriangle,
    note: 'Le déluge continu',
  },
  {
    num: 80, suffix: ' %',
    label: 'des déchets marins viennent de nos activités à terre — la solution est entre nos mains',
    icon: Leaf,
    note: "L'origine terrestre",
  },
  {
    num: 5, suffix: ' g',
    label: "de nanoplastiques ingérés par semaine — le poids d'une carte de crédit",
    icon: Heart,
    note: "L'impact boomerang",
  },
];

const STEPS = [
  {
    num: '01',
    icon: Users,
    title: 'Suivre et amplifier',
    desc: "Rejoignez le groupe Facebook « Amoureux des Calanques » et suivez @karimsaari sur Instagram. Partager nos posts, c'est déjà agir : chaque partage sensibilise de nouveaux publics à la cause.",
  },
  {
    num: '02',
    icon: Anchor,
    title: 'Apporter son aide matérielle',
    desc: "Vous avez un kayak, un bateau ou un véhicule utilitaire ? Contactez-nous. Nous avons besoin d'aide pour atteindre les zones isolées, transporter les déchets collectés et réaliser la caractérisation à terre.",
  },
  {
    num: '03',
    icon: CheckCircle2,
    title: 'Venir en soutien logistique',
    desc: "Le jour J, intervenez depuis le rivage ou en surface : tri, caractérisation des déchets, logistique. Les plongées sont réservées aux membres certifiés de Team Oxygen pour des raisons de sécurité et d'assurance.",
  },
];

const PROFILES = [
  {
    emoji: '🛶',
    title: 'Kayakiste / Plaisancier',
    desc: "Vous mettez votre embarcation au service de l'équipe pour atteindre les zones inaccessibles à pied et transporter les déchets récupérés.",
  },
  {
    emoji: '🧹',
    title: 'Bénévole terrestre',
    desc: "Sur le rivage, vous triez et caractérisez les déchets collectés, et vous participez à la logistique et au transport vers les filières de recyclage.",
  },
  {
    emoji: '📸',
    title: 'Photographe / Vidéaste',
    desc: "Depuis le bord ou la surface, vous documentez les missions pour amplifier leur visibilité et sensibiliser le grand public.",
  },
  {
    emoji: '📢',
    title: 'Ambassadeur digital',
    desc: "Vous suivez, aimez et partagez nos actions sur vos réseaux. La visibilité est un levier d'action concret pour changer les mentalités.",
  },
];

const FAQ = [
  {
    q: "Puis-je plonger ou faire de l'apnée lors des missions ?",
    a: "Non. Pour des raisons de sécurité et d'assurance, les plongées et l'apnée sont strictement réservées aux membres certifiés de l'association Team Oxygen. Les bénévoles extérieurs interviennent exclusivement depuis la surface, en kayak ou depuis le rivage.",
  },
  {
    q: "Comment aider concrètement sans être plongeur ?",
    a: "Il y a plusieurs façons de contribuer : mettre un kayak ou un bateau à disposition pour accéder aux zones isolées, participer au tri et à la caractérisation des déchets à terre, assurer le transport des sacs vers les filières de recyclage, ou documenter la mission avec photos et vidéos depuis le bord.",
  },
  {
    q: 'Comment être prévenu de la prochaine mission ?',
    a: "Rejoignez le groupe Facebook « Amoureux des Calanques » et suivez @karimsaari sur Instagram : nous annonçons toutes les dates sur ces canaux en priorité. Vous pouvez aussi nous contacter via la page Contact pour être ajouté à notre liste de diffusion.",
  },
  {
    q: 'Team Oxygen est-elle une association officielle ?',
    a: "Oui. Team Oxygen est une association loi 1901, dont Karim Saari est président. Les plongées sont encadrées par des membres certifiés couverts par l'assurance associative. Les bénévoles extérieurs interviennent uniquement en surface ou à terre.",
  },
  {
    q: "Comment soutenir le mouvement sans pouvoir venir physiquement ?",
    a: "Le soutien digital compte autant que la présence terrain : suivez nos comptes, partagez nos posts et nos réels, commentez, taggez vos proches sensibles à la cause. Chaque partage touche de nouveaux publics. Vous pouvez aussi soutenir l'association directement sur team-oxygen.com.",
  },
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
  const [fbGroupLabel,  setFbGroupLabel]  = useState('64\u202f700');
  const [totalLabel,    setTotalLabel]    = useState('132\u202f000');
  const [instaLabel,    setInstaLabel]    = useState('24,2K');
  const [tiktokLabel,   setTiktokLabel]   = useState('22,1K');
  const [fbPagesLabel,  setFbPagesLabel]  = useState('17\u202f800');

  useEffect(() => {
    supabase
      .from('social_stats')
      .select('platform, value, suffix, decimals')
      .in('platform', ['facebook_group', 'total_community', 'instagram', 'tiktok', 'facebook_pages'])
      .then(({ data }) => {
        if (!data) return;
        data.forEach(row => {
          const { platform, value, suffix, decimals } = row;
          if (platform === 'facebook_group')  setFbGroupLabel(fmt(value, decimals, suffix));
          if (platform === 'total_community') setTotalLabel(Math.round(parseFloat(value)).toLocaleString('fr-FR'));
          if (platform === 'instagram')       setInstaLabel(fmt(value, decimals, suffix));
          if (platform === 'tiktok')          setTiktokLabel(fmt(value, decimals, suffix));
          if (platform === 'facebook_pages')  setFbPagesLabel(Math.round(parseFloat(value) * 1000).toLocaleString('fr-FR'));
        });
      });
  }, []);

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/communaute']} />
      <div className="container-custom space-y-12">

        {/* ── 1. HERO — H1 + accroche + CTA ── */}
        {/* Rendu natif (pas motion) pour que le H1 et l'image soient visibles immédiatement → LCP */}
        <div className="glass-strong rounded-3xl p-8 md:p-12">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Suivez les missions en direct — rejoignez la communauté
            </h1>
            <p className="text-ocean-teal text-lg md:text-xl font-semibold mb-6">
              {totalLabel} personnes mobilisées pour la Méditerranée
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <p className="text-text-secondary leading-[1.8] text-lg">
                La protection de la Méditerranée repose sur une mobilisation collective et continue.
                À travers mes réseaux sociaux, je fédère aujourd'hui une communauté de plus de
                {' '}{totalLabel} personnes sensibilisées aux enjeux environnementaux du littoral marseillais.
              </p>
              <p className="text-text-secondary leading-[1.8] text-lg">
                De mes reportages en immersion sur YouTube à mes alertes environnementales sur
                Instagram ({instaLabel}), TikTok ({tiktokLabel}) et mes photographies sur 500px, cette
                audience numérique prolonge le travail de terrain en donnant de la visibilité aux
                réalités observées sous la surface.
              </p>
              <p className="text-text-secondary leading-[1.8] text-lg">
                À travers l'animation du groupe incontournable des Amoureux des Calanques (plus de
                {' '}{fbGroupLabel} membres), ma présence sur Facebook (près de {fbPagesLabel} abonnés cumulés), sur X
                et en tant que Local Guide Google Maps à Marseille, j'informe, documente et interpelle
                en temps réel.
              </p>
              <p className="text-text-secondary leading-[1.8] text-lg">
                Cette audience n'est pas un indicateur abstrait : elle représente une capacité
                concrète de sensibilisation et de mobilisation au service de la préservation de
                la Méditerranée et du littoral marseillais.
              </p>
            </div>
            {/* CTA principal */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#reseaux"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                S'abonner aux réseaux
              </a>
              <Link
                to="/depollution-marine"
                className="btn-secondary inline-flex items-center justify-center gap-2 group"
              >
                Rejoindre l'association
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* Photo de groupe — candidat LCP, chargée en priorité */}
            <img
              src="/images/karim-saari-marseille-130000-sentinelles-calanques-depollution.webp"
              alt="Karim Saari entouré des bénévoles du Projet Sentinelle — 132 000 sentinelles pour la dépollution des Calanques de Marseille"
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
              Pourquoi agir maintenant ?
            </h2>
            <p className="text-text-secondary text-center mb-8 text-lg">
              La Méditerranée est un piège à plastiques. Voici les chiffres qui rendent l'urgence impossible à ignorer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {IMPACT.map(({ num, suffix, label, note, icon: Icon }) => (
                <div key={label} className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-ocean-teal/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-ocean-teal" />
                  </div>
                  <div className="text-xs font-semibold text-ocean-teal/70 uppercase tracking-widest mb-1">{note}</div>
                  <div className="text-2xl md:text-3xl font-bold text-ocean-teal mb-1">
                    <StatCounter end={num} suffix={suffix} duration={num > 1000 ? 2500 : 1500} />
                  </div>
                  <div className="text-xs text-text-secondary leading-snug">{label}</div>
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
              Comment participer à une mission de dépollution ?
            </h2>
            <p className="text-text-secondary mb-10 text-lg">
              Trois étapes simples pour passer du spectateur au bénévole actif.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map(({ num, icon: Icon, title, desc }) => (
                <div key={num} className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl font-black text-ocean-teal/30 leading-none select-none">
                      {num}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-ocean-teal/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-ocean-teal" />
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                  <p className="text-text-secondary leading-relaxed text-sm">{desc}</p>
                </div>
              ))}
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
              Quel que soit votre profil, vous avez votre place
            </h2>
            <p className="text-text-secondary text-center mb-8 text-lg">
              Le bénévolat en dépollution marine à Marseille s'adapte à chaque niveau.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROFILES.map(({ emoji, title, desc }) => (
                <motion.div
                  key={title}
                  variants={FADE_IN_UP}
                  className="glass rounded-2xl p-6 text-center hover:border-ocean-teal/40 border border-white/10 transition-colors"
                >
                  <div className="text-4xl mb-3">{emoji}</div>
                  <h3 className="text-white font-bold mb-2">{title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
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
              {totalLabel} sentinelles déjà mobilisées
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              Une audience numérique au service d'une cause réelle. Rejoindre nos réseaux, c'est
              amplifier chaque mission de terrain.
            </p>
            <InstagramStats />
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-text-secondary mb-4 font-medium text-white">Nous rejoindre sur :</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: 'Groupe Facebook', href: 'https://www.facebook.com/groups/calanque/' },
                  { label: 'Instagram @karimsaari', href: 'https://www.instagram.com/karimsaari' },
                  { label: 'TikTok @dark.massilia', href: 'https://www.tiktok.com/@dark.massilia' },
                  { label: 'YouTube @dark.massilia', href: 'https://www.youtube.com/@dark.massilia' },
                  { label: '500px', href: 'https://500px.com/p/karimsaari?view=photos' },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium text-sm"
                  >
                    {label}
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
                Questions fréquentes — Bénévolat dépollution
              </h2>
            </div>
            <div>
              {FAQ.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
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
            Prêt à rejoindre le mouvement ?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Suivre nos actions, c'est déjà agir. Rejoignez le groupe pour être informé des prochaines missions et amplifier la cause sur vos réseaux.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.facebook.com/groups/calanque/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Suivre les missions · {fbGroupLabel} membres
            </a>
            <Link
              to="/contact"
              className="btn-secondary inline-flex items-center justify-center gap-2 group"
            >
              Nous écrire directement
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {/* Lien interne Silo 2 */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/depollution-marine"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              En savoir plus sur nos missions de dépollution
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/presse"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              Nos passages dans les médias
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/photographie-sous-marine"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              Galerie photos sous-marines
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/communaute-calanques"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              Groupe Facebook Calanques
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/local-guide-marseille"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              Local Guide Marseille
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/blog"
              className="text-text-secondary hover:text-ocean-teal transition-colors text-sm inline-flex items-center gap-1"
            >
              Actualités &amp; missions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Communaute;
