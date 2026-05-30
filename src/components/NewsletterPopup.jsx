import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';
import { getStoredConsent } from '../utils/consent';

const STORAGE_KEY = 'dm_newsletter_popup';
const SUBSCRIBED_KEY = 'dm_subscribed';
const COOLDOWN_DAYS = 7;
const DELAY_MS = 20000;
const SCROLL_THRESHOLD = 0.6;

function shouldShow() {
  if (typeof window === 'undefined') return false;
  // Tant que l'utilisateur n'a pas répondu à la bannière cookies, on n'empile pas
  // le popup par-dessus : il s'affichera une fois le choix de consentement fait.
  if (!getStoredConsent()) return false;
  if (localStorage.getItem(SUBSCRIBED_KEY)) return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return true;
  const { dismissedAt } = JSON.parse(stored);
  const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return daysSince >= COOLDOWN_DAYS;
}

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState('idle');
  const triggered = useRef(false);

  const trigger = () => {
    if (triggered.current) return;
    // On ne consomme le déclencheur que si le popup peut réellement s'afficher
    // (sinon un timer écoulé avant le choix cookies le neutraliserait définitivement).
    if (!shouldShow()) return;
    triggered.current = true;
    setVisible(true);
  };

  useEffect(() => {
    const timer = setTimeout(trigger, DELAY_MS);

    const onScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled >= SCROLL_THRESHOLD) trigger();
    };

    // Si le consentement est donné après l'écoulement du timer initial, on relance
    // un court délai pour laisser le popup apparaître (sans empiéter sur la bannière).
    let consentTimer;
    const onConsentResolved = () => {
      consentTimer = setTimeout(trigger, 1200);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('dm:consent-resolved', onConsentResolved);
    return () => {
      clearTimeout(timer);
      clearTimeout(consentTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('dm:consent-resolved', onConsentResolved);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now() }));
    trackEvent('newsletter_popup_dismiss');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setStatus('success');
      localStorage.setItem(SUBSCRIBED_KEY, '1');
      trackEvent('newsletter_subscribe', { source: 'popup' });
      setTimeout(() => setVisible(false), 3000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nl-popup"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(11,28,45,0.98) 0%, rgba(6,18,30,0.99) 100%)',
            border: '1px solid rgba(0,171,168,0.35)',
            boxShadow: '0 0 40px rgba(0,171,168,0.15), 0 20px 60px rgba(0,0,0,0.5)',
          }}
          role="dialog"
          aria-label="Inscription à la newsletter"
        >
          {/* Bande couleur haut */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #00ABA8, #0091ff)' }} />

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-ocean-teal text-xs font-semibold uppercase tracking-widest mb-1">
                  🎁 Photo offerte à l'inscription
                </p>
                <h3 className="text-white font-bold text-base leading-snug">
                  Ce que la mer cache,{' '}
                  <span className="text-ocean-teal">je te le montre</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={dismiss}
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0 mt-0.5"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Missions de dépollution, clichés inédits, faune des Calanques.
            </p>

            {/* Formulaire / États */}
            <AnimatePresence mode="wait">
              {status !== 'success' ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-2.5"
                >
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      required
                      disabled={status === 'loading'}
                      className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-ocean-teal transition-all text-sm disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={!consent || status === 'loading'}
                      className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {status === 'loading'
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : 'S\'inscrire →'}
                    </button>
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 text-xs">Une erreur est survenue, réessaie.</p>
                  )}

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 rounded border border-white/30 bg-white/10 accent-ocean-teal"
                      required
                    />
                    <span className="text-white/45 text-[11px] leading-relaxed">
                      J'accepte de recevoir la newsletter.{' '}
                      <Link to="/confidentialite" className="underline hover:text-ocean-teal" onClick={dismiss}>
                        Confidentialité
                      </Link>
                    </span>
                  </label>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 py-1"
                >
                  <CheckCircle className="w-6 h-6 text-ocean-teal flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">Vérifie ta boîte mail 🌊</p>
                    <p className="text-white/50 text-xs">Ton cliché arrive dans quelques secondes.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
