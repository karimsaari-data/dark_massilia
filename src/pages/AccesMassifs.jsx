/**
 * AccesMassifs — Carte en temps réel des accès aux massifs forestiers
 * Route : /acces-massifs-calanques
 * Source : opendfci.fr — carte Lizmap officielle DFCI Bouches-du-Rhône
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronDown, Flame, AlertTriangle, TreePine, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import FireRiskBanner from '../components/FireRiskBanner';
import Breadcrumb from '../components/Breadcrumb';

const IFRAME_URL =
  'https://opendfci.fr/13/index.php/view/map?repository=openmassifs&project=open_massifs';

const NIVEAUX_RISQUE = [
  { color: '#22c55e', id: 'faible'  },
  { color: '#eab308', id: 'limite'  },
  { color: '#f97316', id: 'modere'  },
  { color: '#ef4444', id: 'severe'  },
  { color: '#7f1d1d', id: 'extreme' },
];

const FAQ_ACCES = [
  { id: 'season'   },
  { id: 'close'    },
  { id: 'why'      },
  { id: 'forbidden'},
  { id: 'check'    },
  { id: 'team'     },
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-4 group py-1"
        aria-expanded={isOpen}
      >
        <span className="text-white font-semibold text-base group-hover:text-ocean-teal transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-ocean-teal flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] mt-3' : 'max-h-0'}`}
        aria-hidden={!isOpen}
      >
        <p className="text-text-secondary leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default function AccesMassifs() {
  const { t } = useTranslation();
  return (
    <>
      <SEO {...SEO_PAGES['/acces-massifs-calanques']} />

      {/* Bande statut pleine largeur */}
      <FireRiskBanner />

      <div className="container-custom py-6">
        <Breadcrumb label={t('accesMassifs.breadcrumb')} />

        <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-6">
          {t('accesMassifs.h1')}
        </h1>

        {/* ── BLOC DFCI — lien direct ── */}
        <div className="glass rounded-2xl border border-orange-500/20 overflow-hidden mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-5 p-5 md:p-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-orange-400 font-semibold text-xs uppercase tracking-widest">{t('accesMassifs.dfci_label')}</span>
              </div>
              <p className="text-white font-semibold text-base">{t('accesMassifs.dfci_title')}</p>
              <p className="text-text-secondary text-sm mt-1">
                {t('accesMassifs.dfci_desc')}
              </p>
            </div>
            <a
              href={IFRAME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              <Map className="w-4 h-4" />
              {t('accesMassifs.dfci_btn')}
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* ── SECTION 1 : Contexte ── */}
        <section className="mb-16">
          <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden">
            <div className="grid md:grid-cols-[auto_1fr] gap-0">
              {/* Bande colorée latérale */}
              <div className="hidden md:block w-1.5 bg-gradient-to-b from-orange-500 via-red-500 to-red-800" />

              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {t('accesMassifs.context_h2')}
                  </h2>
                </div>

                <div className="space-y-4 text-text-secondary text-lg leading-relaxed">
                  <p>{t('accesMassifs.context_p1')}</p>
                  <p>{t('accesMassifs.context_p2')}</p>
                  <p>{t('accesMassifs.context_p3')}</p>
                </div>

                {/* Stats en ligne */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                  {[
                    { valueKey: 'accesMassifs.stat1_value', labelKey: 'accesMassifs.stat1_label' },
                    { valueKey: 'accesMassifs.stat2_value', labelKey: 'accesMassifs.stat2_label' },
                    { valueKey: 'accesMassifs.stat3_value', labelKey: 'accesMassifs.stat3_label' },
                  ].map(({ valueKey, labelKey }) => (
                    <div key={labelKey} className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-ocean-teal">{t(valueKey)}</p>
                      <p className="text-xs text-text-muted mt-1 leading-snug">{t(labelKey)}</p>
                    </div>
                  ))}
                </div>

                {/* Photos terrain — pompiers SDIS 13 */}
                <div className="grid grid-cols-2 gap-3 mt-8">
                  <img
                    src="/images/acces-massifs-calanques_2.webp"
                    srcSet="/images/acces-massifs-calanques_2_400w.webp 400w, /images/acces-massifs-calanques_2_800w.webp 800w, /images/acces-massifs-calanques_2.webp 4000w"
                    sizes="(max-width: 640px) calc(50vw - 24px), (max-width: 1024px) 380px, 480px"
                    alt="Véhicules 4x4 du SDIS 13 en patrouille dans les massifs forestiers des Bouches-du-Rhône — surveillance incendie Calanques"
                    width="4000"
                    height="2252"
                    className="rounded-xl w-full object-cover aspect-video"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    src="/images/acces-massifs-calanques_3.webp"
                    srcSet="/images/acces-massifs-calanques_3_400w.webp 400w, /images/acces-massifs-calanques_3_800w.webp 800w, /images/acces-massifs-calanques_3.webp 4000w"
                    sizes="(max-width: 640px) calc(50vw - 24px), (max-width: 1024px) 380px, 480px"
                    alt="Sapeur-pompier guidant un camion de secours — intervention des pompiers de Marseille face au risque incendie"
                    width="4000"
                    height="1848"
                    className="rounded-xl w-full object-cover aspect-video"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2 : Réglementation ── */}
        <section className="mb-16">
          <div className="glass-strong rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {t('accesMassifs.regulation_h2')}
              </h2>
            </div>

            <div className="space-y-4 text-text-secondary text-lg leading-relaxed mb-8">
              <p>{t('accesMassifs.regulation_p1')}</p>
              <p>{t('accesMassifs.regulation_p2')}</p>
              <p>{t('accesMassifs.regulation_p3')}</p>
            </div>

            {/* Panneau fermeture — illustration terrain */}
            <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
              <img
                src="/images/acces-massifs-calanques_1.webp"
                srcSet="/images/acces-massifs-calanques_1_400w.webp 400w, /images/acces-massifs-calanques_1_800w.webp 800w, /images/acces-massifs-calanques_1.webp 1080w"
                sizes="(max-width: 640px) 100vw, 280px"
                alt="Panneau rouge officiel — Accès au Parc National des Calanques interdit, risque incendie, PV 135 €"
                width="1080"
                height="1080"
                className="rounded-xl w-full sm:w-[280px] flex-shrink-0 object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="text-text-secondary text-base leading-relaxed space-y-3">
                <p>{t('accesMassifs.sign_caption1')}</p>
                <p>{t('accesMassifs.sign_caption2')}</p>
                <p>
                  {t('accesMassifs.sign_caption3')}{' '}
                  <a href="https://www.risque-prevention-incendie.fr/13" target="_blank" rel="noopener noreferrer"
                    className="text-ocean-teal hover:text-white transition-colors font-medium">
                    risque-prevention-incendie.fr/13
                  </a>.
                </p>
              </div>
            </div>

            {/* Niveaux de risque */}
            <h3 className="text-lg font-semibold text-white mb-4">{t('accesMassifs.risk_levels_h3')}</h3>
            <div className="space-y-3">
              {NIVEAUX_RISQUE.map(niveau => (
                <div key={niveau.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/8">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0 mt-1.5"
                    style={{ backgroundColor: niveau.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-white text-sm">{t('accesMassifs.risk_' + niveau.id + '_label')}</p>
                    <p className="text-text-secondary text-sm mt-0.5">{t('accesMassifs.risk_' + niveau.id + '_text')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3 : Bons gestes ── */}
        <section className="mb-16">
          <div className="glass-strong rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <TreePine className="w-6 h-6 text-green-400 flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {t('accesMassifs.prevention_h2')}
              </h2>
            </div>

            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              {t('accesMassifs.prevention_intro')}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: '🚬', titleKey: 'accesMassifs.geste_smoking_title', textKey: 'accesMassifs.geste_smoking_text' },
                { icon: '🔥', titleKey: 'accesMassifs.geste_fire_title',    textKey: 'accesMassifs.geste_fire_text'    },
                { icon: '🛠️', titleKey: 'accesMassifs.geste_tools_title',   textKey: 'accesMassifs.geste_tools_text'   },
                { icon: '📱', titleKey: 'accesMassifs.geste_report_title',  textKey: 'accesMassifs.geste_report_text'  },
              ].map(({ icon, titleKey, textKey }) => (
                <div key={titleKey} className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/8">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <p className="font-semibold text-white mb-1">{t(titleKey)}</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{t(textKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4 : FAQ ── */}
        <section className="mb-16">
          <div className="glass-strong rounded-3xl border border-white/10 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              {t('accesMassifs.faq_h2')}
            </h2>
            <div className="space-y-4 max-w-3xl">
              {FAQ_ACCES.map(({ id }) => (
                <FaqItem key={id} question={t('accesMassifs.faq_' + id + '_q')} answer={t('accesMassifs.faq_' + id + '_a')} />
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
