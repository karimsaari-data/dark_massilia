/**
 * GA4 analytics helper — gtag direct (sans GTM)
 * Respecte le Consent Mode v2 : les appels sont mis en file
 * si l'utilisateur n'a pas encore accepté les cookies analytiques.
 */
const GA_ID = 'G-R3EY7H9Y2Z';

export function trackPageView(path, title) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('config', GA_ID, {
    page_path: path,
    page_title: title,
  });
}

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}
