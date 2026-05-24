import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, FileText, UserPlus, MessageCircle, X, Users, Camera } from 'lucide-react';
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

        {/* ── 3 blocs d'intention ──────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEW_OPTS}
          variants={STAGGER_CONTAINER}
          className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Presse & Médias */}
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-2xl p-7 flex flex-col gap-4 border border-white/10 hover:border-astroide/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-astroide/15 border border-astroide/25 flex items-center justify-center">
              <FileText className="w-6 h-6 text-astroide" />
            </div>
            <div>
              <p className="text-astroide text-xs font-semibold uppercase tracking-widest mb-1">Presse & Médias</p>
              <h3 className="text-white font-bold text-lg leading-tight">Journalistes & documentaristes</h3>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed flex-1">
              Reportages, interviews, cessions de droits photographiques, participation à des documentaires sur la Méditerranée.
            </p>
            <div className="flex flex-col gap-2 mt-auto pt-2">
              <Link
                to="/dossier-presse"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #21c47b, #0fa869)' }}
              >
                <FileText className="w-4 h-4" />
                Dossier de presse
              </Link>
              <a
                href="mailto:contact@karimsaari.com?subject=Demande%20presse"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
              >
                <Mail className="w-4 h-4" />
                contact@karimsaari.com
              </a>
            </div>
          </motion.div>

          {/* Partenariats */}
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-2xl p-7 flex flex-col gap-4 border border-white/10 hover:border-[#25D366]/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/25 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <p className="text-[#25D366] text-xs font-semibold uppercase tracking-widest mb-1">Partenariats</p>
              <h3 className="text-white font-bold text-lg leading-tight">Marques & institutions</h3>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed flex-1">
              Marques engagées, collectivités, associations : collaborations terrain, campagnes de sensibilisation, mécénat.
            </p>
            <div className="flex flex-col gap-2 mt-auto pt-2">
              <a
                href={`https://wa.me/${APP_CONFIG.contactWhatsApp.replace(/[\s+]/g, '')}?text=Bonjour%20Karim%2C%20je%20souhaite%20vous%20proposer%20un%20partenariat`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('contact_click', { method: 'whatsapp', source: 'intent_block' })}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'rgba(37,211,102,0.18)', border: '1px solid rgba(37,211,102,0.4)' }}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp direct
              </a>
              <a
                href="mailto:contact@karimsaari.com?subject=Proposition%20de%20partenariat"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
              >
                <Mail className="w-4 h-4" />
                contact@karimsaari.com
              </a>
            </div>
          </motion.div>

          {/* Expositions & Interventions */}
          <motion.div
            variants={FADE_IN_UP}
            className="glass-strong rounded-2xl p-7 flex flex-col gap-4 border border-white/10 hover:border-blue-400/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
              <Camera className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">Expositions & Interventions</p>
              <h3 className="text-white font-bold text-lg leading-tight">Galeries, écoles & conférences</h3>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed flex-1">
              Expositions photographiques, conférences de sensibilisation, ateliers éducatifs sur la biodiversité marine.
            </p>
            <div className="flex flex-col gap-2 mt-auto pt-2">
              <a
                href="mailto:contact@karimsaari.com?subject=Demande%20exposition%20%2F%20intervention"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.35)' }}
              >
                <Mail className="w-4 h-4 text-blue-400" />
                Envoyer une demande
              </a>
              <Link
                to="/photographie-sous-marine"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
              >
                <Camera className="w-4 h-4" />
                Voir les photos
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Section éditoriale SEO ───────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEW_OPTS}
          variants={STAGGER_CONTAINER}
          className="max-w-5xl mx-auto mt-12"
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
