import { useEffect, useRef } from 'react';

// Sélecteurs d'éléments focusables selon WCAG
const FOCUSABLE_SELECTORS = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * useFocusTrap — Piège le focus dans un container (modals, menus, lightbox).
 * Restaure le focus sur l'élément précédemment actif à la fermeture.
 *
 * @param {boolean} isActive - Active ou désactive le piège
 * @returns {React.RefObject} - Ref à attacher au container
 */
const useFocusTrap = (isActive) => {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Sauvegarde / restauration du focus
  useEffect(() => {
    if (isActive) {
      // Mémorise l'élément actif avant ouverture
      previousFocusRef.current = document.activeElement;
    } else {
      // Restaure le focus à la fermeture
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        // Léger délai pour laisser l'animation de fermeture se terminer
        setTimeout(() => {
          previousFocusRef.current?.focus();
          previousFocusRef.current = null;
        }, 50);
      }
    }
  }, [isActive]);

  // Piège Tab / Shift+Tab
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab depuis le premier élément → aller au dernier
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab depuis le dernier élément → aller au premier
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
};

export default useFocusTrap;
