import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Remet le scroll en haut de page à chaque changement de route.
 * Gère les ancres (#hash) avec retry pour les pages lazy-loadées via Suspense.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // Retry jusqu'à ce que l'élément soit dans le DOM (Suspense peut retarder le rendu)
      let attempts = 0;
      const maxAttempts = 20; // 20 × 100 ms = 2 s max
      const tryScroll = () => {
        const el = document.getElementById(hash.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      setTimeout(tryScroll, 100);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
