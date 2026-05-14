import { useReducedMotion } from 'framer-motion';

export function useCardHover() {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion
    ? {}
    : { whileHover: { y: -4, transition: { type: 'spring', stiffness: 300, damping: 25 } } };
}
