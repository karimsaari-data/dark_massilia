import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
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
            Contact
            <span className="block text-xl md:text-2xl font-medium text-ocean-teal mt-3">
              Une question, un projet de collaboration ou envie de participer à nos missions ?
            </span>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {/* Email */}
          <motion.a
            href={`mailto:${APP_CONFIG.contactEmail}`}
            variants={FADE_IN_UP}
            className="card hover:border-ocean-teal/30 hover:bg-ocean-teal/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 text-lg">Email</h3>
                <p className="text-sm text-gray-400 group-hover:text-ocean-teal transition-colors">
                  {APP_CONFIG.contactEmail}
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
            className="card hover:border-ocean-teal/30 hover:bg-ocean-teal/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 text-lg">WhatsApp</h3>
                <p className="text-sm text-gray-400 group-hover:text-ocean-teal transition-colors">
                  {APP_CONFIG.contactWhatsApp}
                </p>
              </div>
            </div>
          </motion.a>

          {/* Localisation */}
          <motion.div
            variants={FADE_IN_UP}
            className="card"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 text-lg">Localisation</h3>
                <p className="text-sm text-gray-400">Marseille, France</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Team Oxygen - Full width at bottom */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="card bg-ocean-teal/10 border-ocean-teal/20 text-center">
            <h3 className="font-semibold text-ocean-teal mb-3 text-xl">Team Oxygen</h3>
            <p className="text-gray-300 mb-4">
              Président de l'association Team Oxygen
            </p>
            <a
              href="https://www.team-oxygen.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ocean-teal hover:underline"
            >
              Découvrir Team Oxygen
              <span>→</span>
            </a>
          </div>
        </motion.div>

        {/* Carte de visite */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP}
          className="max-w-4xl mx-auto mt-12"
        >
          <img
            src="/assets/og-social-card.jpg"
            alt="Dark Massilia — Karim Saari, Sentinelle de la Méditerranée. Apnée, dépollution et documentation des pollutions sous-marines sur le littoral marseillais."
            width="1200"
            height="630"
            className="w-full rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* CTAs — Continuer la navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/depollution-marine"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Nos missions de dépollution</span>
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link
            to="/videos"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <span>Voir nos vidéos</span>
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
