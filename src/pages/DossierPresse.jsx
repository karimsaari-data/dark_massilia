import { motion } from 'framer-motion';
import { FileDown, Mail, MessageCircle } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import Breadcrumb from '../components/Breadcrumb';

const VIEW_OPTS = { once: true, margin: '-80px' };
const PDF = '/assets/Dossier_presse_karim-saari-dark-massilia-marseille.pdf';

export default function DossierPresse() {
  return (
    <div className="min-h-screen pt-4 pb-16">
      <SEO {...SEO_PAGES['/dossier-presse']} />
      <div className="container-custom">
        <Breadcrumb label="Dossier de Presse" />

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="relative rounded-3xl overflow-hidden mb-10"
          style={{ minHeight: '60vh' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(rgba(0,0,0,0.45) 0%, rgba(12,34,48,0.88) 100%), url(/images/fond%20m%C3%A9diterran%C3%A9e.png) center/cover no-repeat',
            }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 gap-6" style={{ minHeight: '60vh' }}>
            <motion.p variants={FADE_IN_UP} className="text-astroide text-xs font-semibold uppercase tracking-widest">
              Dark Massilia — Karim Saari
            </motion.p>
            <motion.h1 variants={FADE_IN_UP} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Dossier de Presse
            </motion.h1>
            <motion.div variants={FADE_IN_UP} className="flex flex-wrap gap-4 justify-center">
              <a
                href={PDF}
                download="Dossier-Presse-Dark-Massilia-Karim-Saari.pdf"
                className="btn-primary inline-flex items-center gap-2"
              >
                <FileDown className="w-5 h-5" />
                Télécharger le PDF
              </a>
            </motion.div>

            {/* Séparateur + bio */}
            <motion.div variants={FADE_IN_UP} className="w-full max-w-2xl mt-4">
              <div className="border-t border-white/20 pt-8">
                <p className="text-white/75 text-base md:text-lg leading-relaxed">
                  Photographe environnemental, apnéiste et militant pour la protection
                  des Calanques de Marseille depuis 10 ans. Membre de{' '}
                  <span className="text-astroide font-semibold">Team Oxygen</span> depuis 5 ans,
                  président depuis 2026. Participant au{' '}
                  <span className="text-white font-semibold">Projet Sentinelle</span> depuis
                  sa première édition — 5ème édition prévue en octobre 2026.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Contact presse ──────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEW_OPTS}
          variants={FADE_IN_UP}
          className="max-w-5xl mx-auto"
        >
          <div
            className="glass-strong rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{ border: '1px solid rgba(33,196,123,0.3)' }}
          >
            <div>
              <p className="text-astroide text-xs font-semibold uppercase tracking-widest mb-2">Contact presse</p>
              <h2 className="text-2xl font-bold text-white mb-2">Pour toute demande médiatique</h2>
              <p className="text-text-secondary text-sm">
                Interviews, reportages, cessions de droits, partenariats documentaires.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="mailto:contact@karimsaari.com"
                className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Mail className="w-4 h-4" />
                contact@karimsaari.com
              </a>
              <a
                href="https://wa.me/33695331301"
                target="_blank"
                rel="noopener noreferrer"
                className="btn inline-flex items-center gap-2 whitespace-nowrap"
                style={{ borderColor: 'rgba(37,211,102,0.4)', color: '#25D366' }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
