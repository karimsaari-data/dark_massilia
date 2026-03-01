import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Remet le scroll en haut de page à chaque changement de route.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
