/**
 * Consent Mode v2 — Gestion du consentement utilisateur
 * Conforme RGPD · Google Consent Mode v2 (Advanced)
 *
 * Signaux gérés :
 *   - analytics_storage   → Google Analytics / GA4
 *   - ad_storage          → Cookies Google Ads
 *   - ad_user_data        → Partage des données utilisateur avec Google
 *   - ad_personalization  → Personnalisation publicitaire Google
 *
 * Flux :
 *   1. index.html injecte gtag('consent','default',{...}) AVANT GTM
 *      → lecture localStorage pour les visites de retour (wait_for_update: 0)
 *      → 'denied' + wait_for_update: 500 pour les premières visites
 *   2. La bannière appelle updateGtagConsent() → gtag('consent','update',{...})
 *   3. GTM/GA4 applique les nouveaux signaux en temps réel
 */

export const CONSENT_STORAGE_KEY = 'dm_consent';
export const CONSENT_VERSION = '1';

/**
 * Lit les préférences stockées en localStorage.
 * Retourne null si absent, invalide ou version différente.
 * @returns {{ analytics: boolean, ads: boolean, timestamp: number, version: string } | null}
 */
export function getStoredConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Sauvegarde les préférences en localStorage.
 * @param {{ analytics: boolean, ads: boolean }} preferences
 * @returns {{ analytics: boolean, ads: boolean, timestamp: number, version: string }}
 */
export function saveConsent(preferences) {
  const data = {
    analytics: !!preferences.analytics,
    ads: !!preferences.ads,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
      // Notifie les overlays (ex : popup newsletter) qu'un choix cookie a été fait,
      // pour éviter qu'ils s'affichent par-dessus la bannière de consentement.
      window.dispatchEvent(new CustomEvent('dm:consent-resolved'));
    }
  } catch {
    // localStorage indisponible (mode navigation privée, quota dépassé)
  }
  return data;
}

/**
 * Met à jour les signaux Consent Mode v2 dans GTM/GA4.
 * Appelle gtag('consent', 'update', {...}) — nécessite que le 'default' ait déjà été émis.
 * @param {{ analytics: boolean, ads: boolean }} preferences
 */
export function updateGtagConsent(preferences) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: preferences.analytics ? 'granted' : 'denied',
    ad_storage: preferences.ads ? 'granted' : 'denied',
    ad_user_data: preferences.ads ? 'granted' : 'denied',
    ad_personalization: preferences.ads ? 'granted' : 'denied',
  });
}

/**
 * Accepte tous les cookies, sauvegarde et notifie GTM.
 * @returns {{ analytics: boolean, ads: boolean }}
 */
export function acceptAll() {
  const prefs = { analytics: true, ads: true };
  saveConsent(prefs);
  updateGtagConsent(prefs);
  return prefs;
}

/**
 * Refuse tous les cookies optionnels, sauvegarde et notifie GTM.
 * @returns {{ analytics: boolean, ads: boolean }}
 */
export function refuseAll() {
  const prefs = { analytics: false, ads: false };
  saveConsent(prefs);
  updateGtagConsent(prefs);
  return prefs;
}

/**
 * Ouvre la bannière de consentement depuis n'importe où (ex : Footer).
 * Utilise un CustomEvent sur window.
 */
export function openConsentBanner() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dm:open-consent-banner'));
  }
}
