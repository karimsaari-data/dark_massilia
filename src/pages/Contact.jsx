import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Newspaper } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER, APP_CONFIG } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const Contact = () => {
  return (
    <div className="min-h-screen py-20">
      <SEO {...SEO_PAGES['/contact']} />
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-16"
        >
          <motion.h1 variants={FADE_IN_UP} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Collaborons pour la Méditerranée : Reportages, Expositions et Actions sur le terrain
          </motion.h1>
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

        {/* Contact Cards - Centered */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          id="contact-buttons"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* Email */}
          <motion.a
            href={`mailto:${APP_CONFIG.contactEmail}`}
            variants={FADE_IN_UP}
            className="card hover:border-astroide/30 hover:bg-astroide/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center gap-6 py-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-astroide to-astroide-dark flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 text-lg">Email</h3>
                <p className="text-sm text-gray-400 group-hover:text-astroide transition-colors">
                  Écrire un message
                </p>
              </div>
            </div>
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href={`https://wa.me/${APP_CONFIG.contactWhatsApp.replace(/\s/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            variants={FADE_IN_UP}
            className="card hover:border-astroide/30 hover:bg-astroide/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center gap-6 py-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-astroide to-astroide-dark flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 text-lg">WhatsApp</h3>
                <p className="text-sm text-gray-400 group-hover:text-astroide transition-colors">
                  Envoyer un message
                </p>
              </div>
            </div>
          </motion.a>

          {/* Localisation */}
          <motion.a
            href="https://maps.app.goo.gl/UaF5o6sM2xS5Gaxr6"
            target="_blank"
            rel="noopener noreferrer"
            variants={FADE_IN_UP}
            className="card hover:border-astroide/30 hover:bg-astroide/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center gap-6 py-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-astroide to-astroide-dark flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 text-lg">Localisation</h3>
                <p className="text-sm text-gray-400 group-hover:text-astroide transition-colors">Marseille, France</p>
              </div>
            </div>
          </motion.a>

          {/* Newsletter */}
          <motion.div
            variants={FADE_IN_UP}
            className="card hover:border-astroide/30 hover:bg-astroide/5 transition-all duration-300 group cursor-pointer"
            onClick={() => { window.location.href = '/#newsletter'; }}
          >
            <div className="flex flex-col items-center text-center gap-6 py-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-astroide to-astroide-dark flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 text-lg">Newsletter</h3>
                <p className="text-sm text-gray-400 group-hover:text-astroide transition-colors">
                  S'inscrire aux alertes terrain
                </p>
              </div>
            </div>
          </motion.div>
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
                Apnéiste, photographe et président de{' '}
                <strong className="text-ocean-teal">Team Oxygen</strong>, Karim Saari documente et
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
