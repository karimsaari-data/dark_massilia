import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, FileText, Map, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import FireRiskBanner from '../components/FireRiskBanner';
import { SEO_PAGES } from '../utils/seo';

const CARTES_TERRESTRES = [
  { label: 'Carte générale du Parc national des Calanques', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/thumbnails/image/carte-calanques-marseille-cassis-la-ciotat-3000x1733.jpg' },
  { label: 'Archipel du Frioul (17 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-archipel-frioul.pdf' },
  { label: 'Archipel de Riou (16 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-archipel-riou.pdf' },
  { label: 'Massif de Marseilleveyre — Les Goudes, Callelongue (10 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-marseilleveyre.pdf' },
  { label: 'Campus de Luminy — Sormiou, Morgiou, Sugiton (10 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-luminy.pdf' },
  { label: 'Route de la Gineste — mont Puget, forêt de la Gardiole (9 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-gineste.pdf' },
  { label: 'Col de la Gardiole — En-Vau, Port-Pin (9 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-gardiole.pdf' },
  { label: 'Cap Canaille — Cassis, Figuerolles, Mugel (10 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-cassis-la-ciotat.pdf' },
  { label: 'Île Verte (10 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/thumbnails/image/carte-ile-verte.jpg' },
];

const CARTES_MARINES = [
  { label: 'Réglementation en mer — Parc national des Calanques (6 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/documents/downloads/plaquette-mer-2021-xs.pdf' },
];

const MAP_ID = '1fu2q9DRyD80m11ejdp8Ivuj5vn2aguM';
const FULL_URL = `https://www.google.com/maps/d/viewer?mid=${MAP_ID}`;

export default function Carte() {
  const { t } = useTranslation();
  return (
    <>
      <SEO {...SEO_PAGES['/carte-calanques']} />
      <FireRiskBanner />

      <section className="container-custom py-8 space-y-10">

        {/* ── EN-TÊTE + LIEN CARTE ── */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('carte.h1')}
          </h1>

          {/* Bloc lien Google Maps */}
          <div className="glass rounded-2xl border border-ocean-teal/20 overflow-hidden mb-2">
            <div className="flex flex-col sm:flex-row items-center gap-5 p-5 md:p-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-ocean-teal flex-shrink-0" />
                  <span className="text-ocean-teal font-semibold text-xs uppercase tracking-widest">{t('carte.map_label')}</span>
                </div>
                <p className="text-white font-semibold text-base">{t('carte.map_title')}</p>
                <p className="text-text-secondary text-sm mt-1">
                  {t('carte.map_desc')}
                </p>
              </div>
              <a
                href={FULL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-ocean-teal hover:bg-ocean-teal/80 text-black font-bold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                <Map className="w-4 h-4" />
                {t('carte.map_open')}
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* ── BLOC ÉDITORIAL PRINCIPAL ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-strong rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t('carte.editorial_h2')}
          </h2>
          <p className="text-ocean-teal font-semibold mb-6">
            {t('carte.editorial_subtitle')}
          </p>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>{t('carte.editorial_p1')}</p>
            <p>{t('carte.editorial_p2')}</p>
          </div>

          <div className="mt-6 space-y-3 pl-2">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 w-3 h-3 rounded-full bg-green-500 flex-shrink-0 shadow-[0_0_6px_2px_rgba(34,197,94,0.5)]" />
              <p className="m-0 text-text-secondary text-sm leading-relaxed">
                <strong className="text-white">{t('carte.green_points')}</strong> — {t('carte.green_desc')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 w-3 h-3 rounded-full bg-red-500 flex-shrink-0 shadow-[0_0_6px_2px_rgba(239,68,68,0.5)]" />
              <p className="m-0 text-text-secondary text-sm leading-relaxed">
                <strong className="text-white">{t('carte.red_points')}</strong> — {t('carte.red_desc')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── GALERIE PHOTOS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <img
            src="/images/marseille-marseilleveyre-avant-rugulopteryx-biodiversite-2.webp"
            alt="Biodiversité des fonds marins du massif de Marseilleveyre avant l'algue invasive rugulopteryx"
            className="w-full h-64 object-cover rounded-2xl"
            loading="lazy"
          />
          <img
            src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-moyades.webp"
            alt="Dépollution marine aux Moyades — Projet Sentinelle Dark Massilia"
            className="w-full h-64 object-cover rounded-2xl"
            loading="lazy"
          />
        </motion.div>

        {/* ── SPOTS CLÉS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 md:p-10"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            {t('carte.spots_h2')}
          </h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            {t('carte.spots_intro')}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { nameKey: 'carte.spot_sormiou_name', descKey: 'carte.spot_sormiou_desc' },
              { nameKey: 'carte.spot_sugiton_name', descKey: 'carte.spot_sugiton_desc' },
              { nameKey: 'carte.spot_envau_name',   descKey: 'carte.spot_envau_desc' },
              { nameKey: 'carte.spot_callelongue_name', descKey: 'carte.spot_callelongue_desc' },
              { nameKey: 'carte.spot_frioul_name',  descKey: 'carte.spot_frioul_desc' },
              { nameKey: 'carte.spot_ciotat_name',  descKey: 'carte.spot_ciotat_desc' },
            ].map(({ nameKey, descKey }) => (
              <div key={nameKey} className="border border-white/10 rounded-2xl p-5 hover:border-ocean-teal/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-ocean-teal flex-shrink-0" />
                  <h3 className="text-white font-semibold">{t(nameKey)}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── BIODIVERSITÉ ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-8 md:p-10"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            {t('carte.bio_h2')}
          </h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            {t('carte.bio_subtitle')}
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { stat: '30 000 ha', labelKey: 'carte.bio_stat1' },
              { stat: '140+',      labelKey: 'carte.bio_stat2' },
              { stat: '1 000+',    labelKey: 'carte.bio_stat3' },
            ].map(({ stat, labelKey }) => (
              <div key={stat} className="text-center py-4 border border-white/10 rounded-2xl">
                <div className="text-2xl font-bold text-ocean-teal mb-1">{stat}</div>
                <div className="text-text-secondary text-sm">{t(labelKey)}</div>
              </div>
            ))}
          </div>
          <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
            <p>{t('carte.bio_p1')}</p>
            <p>{t('carte.bio_p2')}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link to="/depollution-marine" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium text-sm">
              {t('carte.bio_link_missions')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/communaute" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium text-sm">
              {t('carte.bio_link_community')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-white/8">
            <Link to="/local-guide-marseille" className="btn-primary inline-flex items-center gap-2">
              <span>{t('carte.cta_local_guide')}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link to="/#newsletter" className="btn-secondary inline-flex items-center gap-2">
              <span>{t('carte.cta_newsletter')}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* ── CARTES OFFICIELLES ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-2xl border border-white/10 px-6 md:px-8 py-4 md:py-5 mb-8"
        >
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
            <img src="/logo-parc-national.png" alt="Logo Parc national des Calanques" className="w-40 h-40 object-contain flex-shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-0.5">{t('carte.official_label')}</p>
              <h2 className="text-white font-semibold text-base md:text-lg leading-tight">
                {t('carte.official_h2')}
              </h2>
              <p className="text-text-secondary text-xs mt-1">
                {t('carte.official_desc')}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-ocean-teal flex-shrink-0" />
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">{t('carte.maps_land')}</h3>
            </div>
            <ul className="space-y-2">
              {CARTES_TERRESTRES.map(({ label, url }) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary text-sm hover:text-ocean-teal transition-colors duration-150 group">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-ocean-teal flex-shrink-0" />
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">{t('carte.maps_sea')}</h3>
            </div>
            <ul className="space-y-2">
              {CARTES_MARINES.map(({ label, url }) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary text-sm hover:text-ocean-teal transition-colors duration-150 group">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <a href="https://www.calanques-parcnational.fr/fr/cartes-plans-marseille-cassis-la-ciotat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-text-secondary hover:text-ocean-teal transition-colors duration-150">
              <ExternalLink className="w-3 h-3" />
              {t('carte.maps_all')}
            </a>
          </div>
        </motion.div>

      </section>
    </>
  );
}
