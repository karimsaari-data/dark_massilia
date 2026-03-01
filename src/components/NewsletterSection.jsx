import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FADE_IN_UP } from '../utils/constants';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
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

      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Une erreur est survenue, réessaie.');
      setStatus('error');
    }
  };

  return (
    <section className="container-custom py-8 md:py-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={FADE_IN_UP}
        className="relative rounded-3xl overflow-hidden border border-ocean-teal/30 mb-16"
        style={{
          background: 'linear-gradient(135deg, rgba(0,171,168,0.12) 0%, rgba(0,145,255,0.08) 50%, rgba(11,28,45,0.95) 100%)',
        }}
      >
        {/* Glow décoratif */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,171,168,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 p-8 md:p-12 max-w-2xl mx-auto text-center">

          {/* Icône */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ocean-teal/15 border border-ocean-teal/30 mb-6">
            <Mail className="w-6 h-6 text-ocean-teal" />
          </div>

          {/* Titre */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
            Un cliché des profondeurs,{' '}
            <span className="text-ocean-teal">rien que pour toi</span>
          </h2>

          {/* Photo Poséidon */}
          <div className="relative mx-auto mb-6 max-w-sm rounded-2xl overflow-hidden border border-ocean-teal/20 shadow-lg">
            <img
              src="/images/portfolio/Mer/12.webp"
              alt="Cliché exclusif des fonds marins marseillais — Dark Massilia"
              className="w-full object-cover"
              style={{ maxHeight: '260px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/60 to-transparent pointer-events-none" />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap">
              Cliché offert aux abonnés
            </span>
          </div>

          {/* Sous-titre */}
          <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Pour remercier celles et ceux qui soutiennent mon travail, j'offre un cliché exclusif issu des fonds marins marseillais.
            Un fragment du royaume de Poséidon, saisi en apnée, là où la lumière se dissout dans le silence.
            Inscris-toi à la newsletter et reçois cette image des profondeurs, réservée aux abonnés.
          </p>

          {/* Formulaire / États */}
          <AnimatePresence mode="wait">

            {/* État idle / error → formulaire */}
            {(status === 'idle' || status === 'error' || status === 'loading') && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  disabled={status === 'loading'}
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-ocean-teal focus:bg-white/15 transition-all text-base disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary flex items-center justify-center gap-2 px-7 py-3.5 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Envoi…</span>
                    </>
                  ) : (
                    <span>Recevoir mon cliché</span>
                  )}
                </button>
              </motion.form>
            )}

            {/* État success */}
            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ocean-teal/20 border border-ocean-teal/40">
                  <CheckCircle className="w-8 h-8 text-ocean-teal" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg mb-1">
                    Vérifie ta boîte mail 🌊
                  </p>
                  <p className="text-text-secondary text-sm">
                    Ton cliché arrive dans quelques secondes. Pense à vérifier tes spams si besoin.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Message d'erreur */}
          {status === 'error' && errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-red-400 text-sm mt-3"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMsg}
            </motion.p>
          )}

          {/* Mention RGPD */}
          {status !== 'success' && (
            <p className="text-white/30 text-xs mt-5">
              Pas de spam. Désinscription à tout moment. Conforme RGPD.
            </p>
          )}

        </div>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
