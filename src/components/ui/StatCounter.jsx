import { useState, useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

const StatCounter = ({ end, suffix = '', decimals = 0, duration = 2000, amount = 0.5 }) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) { setCount(end); return; }
    let startTime = null;
    let raf;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration, decimals, prefersReducedMotion]);

  const display = decimals > 0
    ? count.toFixed(decimals).replace('.', ',')
    : count.toLocaleString('fr-FR');

  return <span ref={ref}>{display}{suffix}</span>;
};

export default StatCounter;
