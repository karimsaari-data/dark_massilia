import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Newspaper, UserPlus, MessageCircle, X } from 'lucide-react';
import QRCodeLib from 'react-qr-code';
const QRCode = QRCodeLib?.default ?? QRCodeLib;
import { useState } from 'react';
import { FADE_IN_UP, STAGGER_CONTAINER, APP_CONFIG } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import { trackEvent } from '../lib/analytics';
import Breadcrumb from '../components/Breadcrumb';

const VCARD_URL = 'https://karimsaari.com/karim-saari.vcf';

const VIEW_OPTS = { once: true, margin: '-80px' };

const CONTACT_ROWS = [
  {
    href: (cfg) => `https://wa.me/${cfg.contactWhatsApp.replace(/[\s+]/g, '')}?text=Bonjour%20Karim%2C%20`,
    icon: MessageCircle,
    label: 'WhatsApp',
    event: { method: 'whatsapp', source: 'business_card' },
    external: true,
    highlight: true,
  },
  {
    href: () => 'mailto:contact@karimsaari.com',
    icon: Mail,
    label: 'Email',
    event: { method: 'email', source: 'business_card' },
    external: false,
  },
  {
    href: () => 'https://maps.app.goo.gl/UaF5o6sM2xS5Gaxr6',
    icon: MapPin,
    label: 'Marseille, France',
    event: { method: 'gmaps', source: 'business_card' },
    external: true,
  },
];

const Contact = () => {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-screen pt-4 pb-16">
      <SEO {...SEO_PAGES['/contact']} />
      <div className="container-custom">
        <Breadcrumb label="Contact & Partenariats" />

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-10"
        >
          <motion.h1
            variants={FADE_IN_UP}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Collaborons pour la Méditerranée : Reportages, Expositions et Actions sur le terrain
          </motion.h1>
        </motion.div>

        {/* ── Carte de visite digitale ─────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP}
          className="max-w-5xl mx-auto mb-16"
          style={{
            overflow: 'hidden',
            borderRadius: '24px',
            border: '2px solid rgba(0,171,168,0.55)',
            boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
          }}
        >
          <div
            className="flex flex-col lg:flex-row"
            style={{ background: 'linear-gradient(160deg, rgba(11,28,45,0.97) 0%, rgba(6,18,30,0.99) 100%)' }}
          >
            {/* Colonne gauche — photo carrée */}
            <motion.div
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
              className="lg:w-72 lg:border-r border-white/10 overflow-hidden flex-shrink-0"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-full h-full"
              >
                <img
                  src="/images/karim-saari-photo-profil-arte-regard-marseille_300w.webp"
                  alt="Karim Saari"
                  width="224"
                  height="224"
                  className="w-full h-full object-cover aspect-square lg:aspect-auto"
                  style={{ minHeight: '200px' }}
                />
              </motion.div>
            </motion.div>

            {/* Colonne centre — identité + coordonnées */}
            <motion.div
              variants={STAGGER_CONTAINER}
              className="flex flex-col justify-center gap-2 p-8 flex-1 border-t lg:border-t-0 lg:border-r border-white/10 text-sm"
            >
              <motion.div variants={FADE_IN_UP} className="mb-2">
                <p className="text-white font-bold text-xl leading-tight">Karim Saari</p>
                <p className="text-astroide text-sm font-medium">Dark Massilia</p>
                <p className="text-gray-500 text-xs mt-0.5">Photographe environnemental · Marseille</p>
              </motion.div>
              {CONTACT_ROWS.map(({ href, icon: Icon, label, event, external, highlight }) => (
                <motion.a
                  key={label}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                  }}
                  href={href(APP_CONFIG)}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  onClick={() => trackEvent('contact_click', event)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
                  style={highlight
                    ? { background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)' }
                    : { background: 'rgba(255,255,255,0.04)' }
                  }
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${highlight ? 'text-[#25D366]' : 'text-astroide'}`} />
                  <span className={highlight ? 'text-white font-medium' : 'text-gray-300'}>{label}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Colonne droite — QR vCard */}
            <motion.div
              variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
              className="flex flex-col items-center justify-center gap-3 p-8 lg:w-64 border-t lg:border-t-0"
            >
              <motion.button
                type="button"
                onClick={() => { setShowQR(true); trackEvent('contact_click', { method: 'vcard', source: 'qr_code' }); }}
                className="p-3 rounded-2xl bg-white shadow-xl cursor-pointer"
                aria-label="Agrandir le QR code"
                whileHover={{ scale: 1.08, boxShadow: '0 0 24px rgba(0,171,168,0.5)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <QRCode
                  value={VCARD_URL}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#0B1C2D"
                  level="M"
                />
              </motion.button>
              <p className="text-gray-400 text-xs text-center leading-relaxed">
                Appuyer pour agrandir · Scanner pour ajouter
              </p>
              <motion.a
                href="/karim-saari.vcf"
                download="karim-saari.vcf"
                onClick={() => trackEvent('contact_click', { method: 'vcard', source: 'button' })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'rgba(0,171,168,0.85)', boxShadow: '0 0 16px rgba(0,171,168,0.35)' }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(0,171,168,0.55)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <UserPlus className="w-4 h-4" />
                Ajouter aux contacts
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Section éditoriale SEO ───────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEW_OPTS}
          variants={STAGGER_CONTAINER}
          className="max-w-5xl mx-auto mb-12"
        >
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Contact direct : Expositions, Interventions et Reportages
            </h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              Vous souhaitez organiser une{' '}
              <strong className="text-white">exposition photographique</strong>, planifier une{' '}
              <strong className="text-white">intervention de sensibilisation</strong> sur la
              pollution marine, ou proposer une collaboration avec l'association{' '}
              <strong className="text-ocean-teal">Team Oxygen</strong>&nbsp;? Basé à{' '}
              <strong className="text-white">Marseille</strong>, je privilégie l'échange direct
              et sans intermédiaire. Que ce soit pour la réalisation de{' '}
              <strong className="text-white">reportages documentaires</strong> sur le littoral
              méditerranéen, l'acquisition de tirages d'art, ou une demande de presse (interviews,
              cessions de droits), vous pouvez me joindre instantanément par{' '}
              <strong className="text-white">email</strong> ou via{' '}
              <strong className="text-white">WhatsApp</strong>. Discutons de vos projets pour
              amplifier ensemble l'impact du{' '}
              <strong className="text-ocean-teal">Projet Sentinelle</strong>.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Newsletter CTA ───────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEW_OPTS}
          variants={FADE_IN_UP}
          className="max-w-5xl mx-auto"
        >
          <motion.div
            className="rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, rgba(33,196,123,0.12) 0%, rgba(0,145,255,0.10) 100%)', border: '1px solid rgba(33,196,123,0.25)' }}
            onClick={() => { navigate('/'); setTimeout(() => { document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}
            whileHover={{ scale: 1.01, borderColor: 'rgba(33,196,123,0.5)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center gap-5">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-astroide to-astroide-dark flex items-center justify-center flex-shrink-0"
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Newspaper className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-xl mb-1">Alertes terrain — Newsletter</h3>
                <p className="text-gray-400 text-sm">Missions de dépollution, reportages et actualités des Calanques directement dans ta boîte mail.</p>
              </div>
            </div>
            <span className="btn-primary whitespace-nowrap flex-shrink-0">
              S'inscrire gratuitement →
            </span>
          </motion.div>
        </motion.div>

        {/* ── Card engagement ──────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEW_OPTS}
          variants={FADE_IN_UP}
          className="max-w-6xl mx-auto mt-16"
        >
          <div className="glass-strong rounded-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Texte */}
            <motion.div
              className="flex flex-col gap-6 p-8 lg:p-12 lg:flex-1 justify-center"
              variants={STAGGER_CONTAINER}
            >
              <motion.p variants={FADE_IN_UP} className="text-astroide text-sm font-semibold uppercase tracking-widest">
                Un engagement à 360°
              </motion.p>
              <motion.h2 variants={FADE_IN_UP} className="text-2xl md:text-3xl font-bold text-white leading-tight">
                La Méditerranée pour bureau, l'action pour moteur
              </motion.h2>
              <motion.p variants={FADE_IN_UP} className="text-text-secondary leading-relaxed">
                Photographe environnemental et sous-marin, Karim Saari documente et
                combat la pollution marine depuis plus de dix ans sur le littoral marseillais. Chaque
                plongée est une mission : collecter les données, ramener les déchets, alerter le public.
                Que vous soyez journaliste, institution, marque engagée ou simple passionné de la mer —
                il y a une place pour vous dans ce combat.
              </motion.p>
            </motion.div>
            {/* Photo + boutons */}
            <div className="lg:w-[42%] flex-shrink-0 flex flex-col items-stretch gap-3 p-6 lg:p-8 justify-center">
              <Link
                to="/depollution-marine"
                className="btn-secondary inline-flex items-center justify-center gap-2 w-full"
              >
                Nos missions de dépollution
              </Link>
              <Link
                to="/dossier-presse"
                className="btn-secondary inline-flex items-center justify-center gap-2 w-full"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Dossier de presse
              </Link>
              <motion.picture
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="overflow-hidden rounded-xl"
              >
                <source srcSet="/images/contact-karim-saari.webp" type="image/webp" />
                <img
                  src="/images/contact-karim-saari.webp"
                  alt="Karim Saari en action lors d'une mission de dépollution sous-marine dans les Calanques de Marseille avec Team Oxygen"
                  width="1440"
                  height="1212"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </motion.picture>
              <a
                href="https://www.team-oxygen.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 w-full"
              >
                Soutenir Team Oxygen
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── Modal QR plein écran ─────────────────────────────────────── */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            key="qr-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6"
            style={{ background: 'rgba(0,8,24,0.95)', backdropFilter: 'blur(12px)' }}
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="p-6 rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <QRCode
                value={VCARD_URL}
                size={260}
                bgColor="#ffffff"
                fgColor="#0B1C2D"
                level="M"
              />
            </motion.div>
            <p className="text-white text-center text-lg font-semibold">Karim Saari — Dark Massilia</p>
            <p className="text-gray-400 text-sm text-center">Scannez pour ajouter aux contacts</p>
            <motion.button
              type="button"
              onClick={() => setShowQR(false)}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <X className="w-4 h-4" />
              Fermer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;
