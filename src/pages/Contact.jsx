import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Newspaper } from 'lucide-react';
import QRCodeLib from 'react-qr-code';
const QRCode = QRCodeLib?.default ?? QRCodeLib;
import { FADE_IN_UP, STAGGER_CONTAINER, APP_CONFIG } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import { trackEvent } from '../lib/analytics';
import Breadcrumb from '../components/Breadcrumb';

const VCARD_URL = 'https://karimsaari.com/karim-saari.vcf';

const Contact = () => {
  const navigate = useNavigate();

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
          <motion.h1 variants={FADE_IN_UP} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Collaborons pour la Méditerranée : Reportages, Expositions et Actions sur le terrain
          </motion.h1>
        </motion.div>

        {/* Carte de visite digitale — carte horizontale unifiée */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP}
          className="max-w-4xl mx-auto mb-16"
          style={{
            overflow: 'hidden',
            borderRadius: '24px',
            border: '2px solid rgba(0,171,168,0.55)',
            boxShadow: '0 0 0 6px rgba(0,8,24,0.88), 0 0 0 8px rgba(0,171,168,0.35), 0 0 40px rgba(0,171,168,0.18), 0 0 80px rgba(0,120,180,0.10)',
          }}
        >
          <div className="flex flex-col lg:flex-row"
            style={{ background: 'linear-gradient(160deg, rgba(11,28,45,0.97) 0%, rgba(6,18,30,0.99) 100%)' }}
          >
              {/* Colonne gauche — identité */}
              <div className="flex flex-col items-center justify-center gap-4 p-8 lg:w-56 lg:border-r border-white/10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-2 ring-astroide/40 ring-offset-2 ring-offset-transparent">
                    <img
                      src="/images/karim-saari-photo-profil-arte-regard-marseille_300w.webp"
                      alt="Karim Saari"
                      width="128"
                      height="128"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-white">Karim Saari</h2>
                  <p className="text-astroide text-sm font-medium mt-0.5">Dark Massilia</p>
                  <p className="text-gray-400 text-xs mt-1">Photographe environnemental · Marseille</p>
                </div>
              </div>

              {/* Colonne centre — coordonnées */}
              <div className="flex flex-col justify-center gap-2 p-8 flex-1 border-t lg:border-t-0 lg:border-r border-white/10 text-sm">
                <a
                  href={`https://wa.me/${APP_CONFIG.contactWhatsApp.replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('contact_click', { method: 'whatsapp', source: 'business_card' })}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-astroide/10"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <Phone className="w-4 h-4 text-astroide flex-shrink-0" />
                  <span className="text-gray-300">+33 6 95 33 13 01</span>
                </a>
                <a
                  href="mailto:contact@karimsaari.com"
                  onClick={() => trackEvent('contact_click', { method: 'email', source: 'business_card' })}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-astroide/10"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <Mail className="w-4 h-4 text-astroide flex-shrink-0" />
                  <span className="text-gray-300">contact@karimsaari.com</span>
                </a>
                <a
                  href="https://maps.app.goo.gl/UaF5o6sM2xS5Gaxr6"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('contact_click', { method: 'gmaps', source: 'business_card' })}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-astroide/10"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <MapPin className="w-4 h-4 text-astroide flex-shrink-0" />
                  <span className="text-gray-300">Marseille, France</span>
                </a>
              </div>

              {/* Colonne droite — QR vCard */}
              <div className="flex flex-col items-center justify-center gap-3 p-8 lg:w-56 border-t lg:border-t-0">
                <a
                  href="/karim-saari.vcf"
                  download="karim-saari.vcf"
                  onClick={() => trackEvent('contact_click', { method: 'vcard', source: 'qr_code' })}
                  className="p-3 rounded-2xl bg-white shadow-xl hover:scale-110 transition-transform duration-200"
                  aria-label="Télécharger la carte de contact"
                >
                  <QRCode
                    value={VCARD_URL}
                    size={120}
                    bgColor="#ffffff"
                    fgColor="#0B1C2D"
                    level="M"
                  />
                </a>
                <p className="text-gray-400 text-xs text-center leading-relaxed">Scanner pour ajouter aux contacts<br/>ou cliquer pour télécharger</p>
              </div>
            </div>
        </motion.div>

        {/* Section éditoriale SEO — intentions de contact & mots-clés transactionnels */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto mb-12"
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

        {/* Newsletter CTA */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP}
          className="max-w-4xl mx-auto"
        >
          <div
            className="rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group"
            style={{ background: 'linear-gradient(135deg, rgba(33,196,123,0.12) 0%, rgba(0,145,255,0.10) 100%)', border: '1px solid rgba(33,196,123,0.25)' }}
            onClick={() => { navigate('/'); setTimeout(() => { document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-astroide to-astroide-dark flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Newspaper className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-1">Alertes terrain — Newsletter</h3>
                <p className="text-gray-400 text-sm">Missions de dépollution, reportages et actualités des Calanques directement dans ta boîte mail.</p>
              </div>
            </div>
            <span className="btn-primary whitespace-nowrap flex-shrink-0">
              S'inscrire gratuitement →
            </span>
          </div>
        </motion.div>

        {/* Card engagement — texte + photo côte à côte dans la card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP}
          className="max-w-5xl mx-auto mt-16"
        >
          <div className="glass-strong rounded-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Texte */}
            <div className="flex flex-col gap-6 p-8 lg:flex-1 justify-center">
              <p className="text-astroide text-sm font-semibold uppercase tracking-widest">
                Un engagement à 360°
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                La Méditerranée pour bureau, l'action pour moteur
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Photographe environnemental et sous-marin, Karim Saari documente et
                combat la pollution marine depuis plus de dix ans sur le littoral marseillais. Chaque
                plongée est une mission : collecter les données, ramener les déchets, alerter le public.
                Que vous soyez journaliste, institution, marque engagée ou simple passionné de la mer —
                il y a une place pour vous dans ce combat.
              </p>
            </div>
            {/* Photo + boutons */}
            <div className="lg:w-[45%] flex-shrink-0 flex flex-col items-stretch gap-3 p-6 lg:p-8 justify-center">
              <Link
                to="/depollution-marine"
                className="btn-secondary inline-flex items-center justify-center gap-2 w-full"
              >
                Nos missions de dépollution
              </Link>
              <picture>
                <source srcSet="/images/contact-karim-saari.webp" type="image/webp" />
                <img
                  src="/images/contact-karim-saari.webp"
                  alt="Karim Saari en action lors d'une mission de dépollution sous-marine dans les Calanques de Marseille avec Team Oxygen"
                  width="1440"
                  height="1212"
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                />
              </picture>
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

    </div>
  );
};

export default Contact;
