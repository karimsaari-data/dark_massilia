import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FADE_IN_UP } from '../utils/constants';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | already | error
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

      setStatus(data?.alreadySubscribed ? 'already' : 'success');
    } catch (err) {
      setErrorMsg(err.message || 'Une erreur est survenue, réessaie.');
      setStatus('error');
    }
  };

  return (
    <section id="newsletter" className="container-custom py-8 md:py-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={FADE_IN_UP}
        className="relative rounded-3xl overflow-hidden border border-ocean-teal/30 mb-16 min-h-[420px] md:min-h-[480px] flex items-center justify-center"
      >
        {/* Image plein fond */}
        <div className="absolute inset-0">
          <img
            src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-pos%C3%A9idon.webp"
            alt="Cliché exclusif des fonds marins marseillais — Dark Massilia"
            className="w-full h-full object-cover"
            style={{
              transform: 'scale(1.3) translateX(-9%)',
              transformOrigin: 'center center',
            }}
          />
          {/* Overlay : sombre en bas (form), lumineux en haut (image) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C2D]/30 via-[#0B1C2D]/60 to-[#0B1C2D]/90" aria-hidden="true" />
        </div>

        {/* Contenu centré */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 py-16 md:py-20 w-full md:max-w-lg md:ml-auto md:pr-16 md:text-left md:items-start">

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-semibold mb-6 backdrop-blur-sm">
            🎁 Offert à l'inscription
          </span>

          {/* Titre */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Un cliché des profondeurs,{' '}
            <span className="text-ocean-teal">rien que pour toi</span>
          </h2>

          {/* Sous-titre */}
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            Un fragment du royaume de Poséidon, capturé en apnée dans les fonds marins marseillais.
          </p>

          {/* Formulaire / États */}
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">

              {(status === 'idle' || status === 'error' || status === 'loading') && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3"
                >
                  {/* Champ email + bouton */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Adresse email
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      required
                      disabled={status === 'loading'}
                      aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                      className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/25 text-white placeholder-white/40 focus:outline-none focus:border-ocean-teal focus:bg-white/15 transition-all text-base disabled:opacity-60 backdrop-blur-sm"
                    />
                    <button
                      type="submit"
                      disabled={!consent || status === 'loading'}
                      aria-busy={status === 'loading'}
                      className="btn-primary flex items-center justify-center gap-2 px-7 py-3.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          <span>Envoi…</span>
                        </>
                      ) : (
                        <span>OK →</span>
                      )}
                    </button>
                  </div>

                  {/* Consentement RGPD */}
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 flex-shrink-0 rounded border border-white/30 bg-white/10 accent-ocean-teal cursor-pointer"
                    />
                    <span className="text-white/45 text-xs leading-relaxed group-hover:text-white/60 transition-colors">
                      J'accepte de recevoir la newsletter Dark Massilia et les actualités de Karim Saari.{' '}
                      <Link to="/confidentialite" className="underline underline-offset-2 hover:text-ocean-teal transition-colors">
                        Politique de confidentialité
                      </Link>
                      . Désinscription à tout moment.
                    </span>
                  </label>
                </motion.form>
              )}

              {status === 'success' && (
                <motion.div
                  key="success"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-4"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ocean-teal/20 border border-ocean-teal/40 flex-shrink-0" aria-hidden="true">
                    <CheckCircle className="w-7 h-7 text-ocean-teal" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg mb-1">
                      Vérifie ta boîte mail 🌊
                    </p>
                    <p className="text-white/60 text-sm">
                      Ton cliché arrive dans quelques secondes. Pense à vérifier tes spams si besoin.
                    </p>
                  </div>
                </motion.div>
              )}

              {status === 'already' && (
                <motion.div
                  key="already"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-4"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ocean-teal/20 border border-ocean-teal/40 flex-shrink-0" aria-hidden="true">
                    <CheckCircle className="w-7 h-7 text-ocean-teal" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg mb-1">
                      Tu fais déjà partie de la communauté ! 🌊
                    </p>
                    <p className="text-white/60 text-sm">
                      Tu es déjà inscrit(e) à la newsletter Dark Massilia.
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Message d'erreur */}
            {status === 'error' && errorMsg && (
              <motion.p
                id="newsletter-error"
                role="alert"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-red-400 text-sm mt-3"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {errorMsg}
              </motion.p>
            )}
          </div>


        </div>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
