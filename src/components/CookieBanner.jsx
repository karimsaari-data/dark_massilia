/**
 * CookieBanner — CMP conforme RGPD / Google Consent Mode v2
 *
 * Deux vues :
 *   - Bannière principale (bottom-right desktop, full-width mobile)
 *   - Panneau personnalisation (toggles par catégorie)
 *
 * Lifecycle :
 *   1. Mount → lit localStorage. Si pas de consentement : affiche la bannière.
 *   2. Écoute 'dm:open-consent-banner' → réouverture depuis le Footer.
 *   3. Choix utilisateur → saveConsent() + updateGtagConsent() → ferme.
 *
 * SSR-safe : visible=false jusqu'au mount côté client.
 */
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, BarChart2, Target, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getStoredConsent,
  saveConsent,
  updateGtagConsent,
  acceptAll,
  refuseAll,
} from '../utils/consent';
import useFocusTrap from '../hooks/useFocusTrap';

/* ─── Toggle switch accessible ──────────────────────────────────────────── */
const Toggle = ({ checked, onChange, disabled, id }) => (
  <button
    role="switch"
    aria-checked={checked}
    id={id}
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={[
      'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full',
      'transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1f2d]',
      checked ? 'bg-ocean-teal' : 'bg-white/20',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ].join(' ')}
  >
    <span
      className={[
        'inline-block h-4 w-4 rounded-full bg-white',
        'transition-transform duration-200',
        checked ? 'translate-x-6' : 'translate-x-1',
      ].join(' ')}
    />
  </button>
);

/* ─── Composant principal ─────────────────────────────────────────────────  */
export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, ads: false });

  // Focus trap actif uniquement dans la vue personnalisation
  const detailsRef = useFocusTrap(showDetails && visible);

  /* Mount client-side */
  useEffect(() => {
    setMounted(true);
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    }

    // Réouverture depuis le Footer "Gérer les cookies"
    const handleOpen = () => {
      const current = getStoredConsent();
      if (current) {
        setPrefs({ analytics: current.analytics, ads: current.ads });
        setShowDetails(true);
      } else {
        setPrefs({ analytics: false, ads: false });
        setShowDetails(false);
      }
      setVisible(true);
    };

    window.addEventListener('dm:open-consent-banner', handleOpen);
    return () => window.removeEventListener('dm:open-consent-banner', handleOpen);
  }, []);

  /* Handlers */
  const handleAcceptAll = useCallback(() => {
    acceptAll();
    setVisible(false);
    setShowDetails(false);
  }, []);

  const handleRefuseAll = useCallback(() => {
    refuseAll();
    setVisible(false);
    setShowDetails(false);
  }, []);

  const handleSavePrefs = useCallback(() => {
    saveConsent(prefs);
    updateGtagConsent(prefs);
    setVisible(false);
    setShowDetails(false);
  }, [prefs]);

  const handleOpenDetails = useCallback(() => {
    const current = getStoredConsent();
    if (current) {
      setPrefs({ analytics: current.analytics, ads: current.ads });
    }
    setShowDetails(true);
  }, []);

  // SSR-safe : ne rien rendre tant que le composant n'est pas monté côté client
  if (!mounted || !visible) return null;

  return (
    // Conteneur positionné — bottom-right desktop, full-width bottom mobile
    <div className="fixed bottom-0 left-0 right-0 z-[999] pointer-events-none md:bottom-4 md:left-auto md:right-4 md:max-w-[360px]">
      <AnimatePresence mode="wait">

        {!showDetails ? (
          /* ─── Vue principale : bannière compacte ─── */
          <motion.div
            key="banner"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto"
          >
            <div
              className="
                bg-[#0a1a26]/96 backdrop-blur-xl
                border-t border-white/10
                md:border md:border-white/10 md:rounded-2xl
                px-5 py-4 shadow-2xl
              "
            >
              {/* Icône + texte */}
              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-4 h-4 text-ocean-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold leading-tight">
                    Ce site utilise des cookies
                  </p>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    Google Analytics mesure les visites pour améliorer les missions de terrain.
                    Aucune donnée vendue.{' '}
                    <Link
                      to="/confidentialite"
                      className="underline underline-offset-2 hover:text-ocean-teal transition-colors"
                    >
                      En savoir plus
                    </Link>
                  </p>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-ocean-teal hover:bg-ocean-teal/80 text-black text-xs font-semibold py-2 px-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1a26]"
                >
                  Tout accepter
                </button>
                <button
                  onClick={handleRefuseAll}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 px-3 rounded-lg border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  Tout refuser
                </button>
                <button
                  onClick={handleOpenDetails}
                  className="text-xs text-gray-500 hover:text-ocean-teal transition-colors px-2 py-2 flex-shrink-0 focus-visible:outline-none focus-visible:text-ocean-teal"
                >
                  Gérer
                </button>
              </div>
            </div>
          </motion.div>

        ) : (
          /* ─── Vue personnalisation : toggles par catégorie ─── */
          <motion.div
            key="details"
            ref={detailsRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Paramètres des cookies"
          >
            <div
              className="
                bg-[#0a1a26]/97 backdrop-blur-xl
                border-t border-white/10
                md:border md:border-white/10 md:rounded-2xl
                px-5 py-4 shadow-2xl
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-white text-sm font-semibold">Paramètres des cookies</p>
                <button
                  onClick={() => setShowDetails(false)}
                  aria-label="Retour à la bannière"
                  className="text-gray-500 hover:text-white transition-colors p-1 -mr-1 focus-visible:outline-none focus-visible:text-ocean-teal"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-3.5 mb-4">

                {/* Strictement nécessaires — toujours ON */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Shield className="w-3.5 h-3.5 text-ocean-teal flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-white text-xs font-medium">Strictement nécessaires</p>
                      <p className="text-gray-500 text-xs">Navigation, sécurité. Toujours actifs.</p>
                    </div>
                  </div>
                  <Toggle checked={true} onChange={() => {}} disabled id="toggle-necessary" />
                </div>

                {/* Analytiques (GA4) */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <BarChart2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <label
                        htmlFor="toggle-analytics"
                        className="text-white text-xs font-medium cursor-pointer block"
                      >
                        Mesure d'audience (GA4)
                      </label>
                      <p className="text-gray-500 text-xs">Visites anonymisées via Google Analytics.</p>
                    </div>
                  </div>
                  <Toggle
                    checked={prefs.analytics}
                    onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                    id="toggle-analytics"
                  />
                </div>

                {/* Personnalisation / Google Ads */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Target className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <label
                        htmlFor="toggle-ads"
                        className="text-white text-xs font-medium cursor-pointer block"
                      >
                        Personnalisation Google
                      </label>
                      <p className="text-gray-500 text-xs">Signaux ad_user_data & ad_personalization.</p>
                    </div>
                  </div>
                  <Toggle
                    checked={prefs.ads}
                    onChange={(v) => setPrefs((p) => ({ ...p, ads: v }))}
                    id="toggle-ads"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSavePrefs}
                  className="flex-1 bg-ocean-teal hover:bg-ocean-teal/80 text-black text-xs font-semibold py-2 px-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1a26]"
                >
                  Enregistrer
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 px-3 rounded-lg border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  Tout accepter
                </button>
              </div>

              {/* Lien politique */}
              <p className="text-center mt-3">
                <Link
                  to="/confidentialite"
                  className="text-xs text-gray-600 hover:text-ocean-teal transition-colors underline underline-offset-2"
                >
                  Politique de confidentialité
                </Link>
              </p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
