import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';

/**
 * Formulaire newsletter compact à intégrer directement dans les articles.
 * Évite la friction du lien vers /#newsletter (navigation + scroll).
 */
export default function NewsletterInline({ source = 'blog_article' }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      const newStatus = data?.alreadySubscribed ? 'already' : 'success';
      if (newStatus === 'success') trackEvent('newsletter_subscribe', { source });
      setStatus(newStatus);
    } catch (err) {
      setErrorMsg(err.message || 'Une erreur est survenue, réessaie.');
      setStatus('error');
    }
  };

  return (
    <div className="mt-10 rounded-2xl bg-ocean-teal/10 border border-ocean-teal/25 p-6 md:p-8 animate-border-pulse">
      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-4">
        🎁 Offert à l'inscription
      </span>

      <h3 className="text-white font-bold text-xl md:text-2xl mb-2 leading-snug">
        Ce que la mer cache, je te le montre
      </h3>
      <p className="text-white/65 text-sm mb-5 leading-relaxed">
        Missions de dépollution, clichés inédits, plongées en apnée, faune des Calanques — et une photo exclusive offerte dès l'inscription.
      </p>

      <AnimatePresence mode="wait">
        {(status === 'idle' || status === 'error' || status === 'loading') && (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-inline-email" className="sr-only">
                Adresse email
              </label>
              <input
                id="newsletter-inline-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                disabled={status === 'loading'}
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/25 text-white placeholder-white/40 focus:outline-none focus:border-ocean-teal focus:bg-white/15 transition-all text-sm disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!consent || status === 'loading'}
                className="btn-primary flex items-center justify-center gap-2 px-5 py-3 whitespace-nowrap shrink-0 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Envoi…</span>
                  </>
                ) : (
                  <span>Recevoir mon cliché →</span>
                )}
              </button>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 flex-shrink-0 rounded border border-white/30 bg-white/10 accent-ocean-teal cursor-pointer"
                required
              />
              <span className="text-white/55 text-xs leading-relaxed group-hover:text-white/75 transition-colors">
                J'accepte de recevoir la newsletter Dark Massilia.{' '}
                <Link to="/confidentialite" className="underline underline-offset-2 hover:text-ocean-teal transition-colors">
                  Politique de confidentialité
                </Link>
                . Désinscription à tout moment.
              </span>
            </label>

            {status === 'error' && errorMsg && (
              <p role="alert" className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {errorMsg}
              </p>
            )}
          </motion.form>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ocean-teal/20 border border-ocean-teal/40 flex-shrink-0" aria-hidden="true">
              <CheckCircle className="w-6 h-6 text-ocean-teal" />
            </div>
            <div>
              <p className="text-white font-semibold mb-0.5">Vérifie ta boîte mail 🌊</p>
              <p className="text-white/60 text-sm">Ton cliché arrive dans quelques secondes. Pense à vérifier tes spams si besoin.</p>
            </div>
          </motion.div>
        )}

        {status === 'already' && (
          <motion.div
            key="already"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ocean-teal/20 border border-ocean-teal/40 flex-shrink-0" aria-hidden="true">
              <CheckCircle className="w-6 h-6 text-ocean-teal" />
            </div>
            <div>
              <p className="text-white font-semibold mb-0.5">Tu fais déjà partie de la communauté ! 🌊</p>
              <p className="text-white/60 text-sm">Tu es déjà inscrit(e) à la newsletter Dark Massilia.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
