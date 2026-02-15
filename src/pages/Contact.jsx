import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER, APP_CONFIG } from '../utils/constants';

const Contact = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="text-center mb-16"
        >
          <motion.h1 variants={FADE_IN_UP} className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Contact</span>
          </motion.h1>
          <motion.p variants={FADE_IN_UP} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Une question, un projet de collaboration ou envie de participer à nos missions ? Contactez-nous !
          </motion.p>
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
      </div>
    </div>
  );
};

export default Contact;
