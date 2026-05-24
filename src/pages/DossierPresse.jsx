import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
          className="relative rounded-3xl overflow-hidden mb-12"
          style={{ minHeight: '52vh' }}
        >
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(rgba(0,0,0,0.45) 0%, rgba(12,34,48,0.88) 100%), url(https://cms.karimsaari.com/wp-content/uploads/2026/05/fight-scaled.jpg) center/cover no-repeat',
            }}
          />
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 gap-6" style={{ minHeight: '52vh' }}>
            <motion.p variants={FADE_IN_UP} className="text-astroide text-xs font-semibold uppercase tracking-widest">
              Dark Massilia — Karim Saari
            </motion.p>
            <motion.h1 variants={FADE_IN_UP} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Dossier de Presse
            </motion.h1>
            <motion.p variants={FADE_IN_UP} className="text-text-secondary text-lg max-w-xl leading-relaxed">
              Photographe environnemental, apnéiste et militant pour la protection
              des Calanques de Marseille depuis 10 ans.
            </motion.p>
            <motion.div variants={FADE_IN_UP} className="flex flex-wrap gap-4 justify-center">
              <a
                href={PDF}
                download="Dossier-Presse-Dark-Massilia-Karim-Saari.pdf"
                className="btn-primary inline-flex items-center gap-2"
              >
                <FileDown className="w-5 h-5" />
                Télécharger le PDF
              </a>
              <a
                href="mailto:contact@karimsaari.com?subject=Demande%20presse%20—%20Dark%20Massilia"
                className="btn inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact presse
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* ── PDF viewer ──────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEW_OPTS}
          variants={FADE_IN_UP}
          className="max-w-5xl mx-auto mb-12"
        >
          <p className="text-center text-sm text-text-secondary mb-4">
            Aperçu du dossier —{' '}
            <a href={PDF} download className="text-astroide hover:underline">
              télécharger le PDF complet
            </a>
          </p>
          <div className="glass-strong rounded-2xl overflow-hidden border border-white/10 p-2">
            <iframe
              src={PDF}
              title="Dossier de presse Dark Massilia"
              className="w-full rounded-xl"
              style={{ height: 'min(85vh, 1100px)', border: 'none' }}
            />
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
