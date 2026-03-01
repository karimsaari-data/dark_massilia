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
    <section id="newsletter" className="container-custom py-8 md:py-12">
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

        <div className="relative z-10 grid md:grid-cols-[1.4fr_1fr] min-h-[380px]">

          {/* Contenu — colonne gauche */}
          <div className="flex flex-col justify-center p-8 md:p-10 text-center md:text-left">

            {/* Icône */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ocean-teal/15 border border-ocean-teal/30 mb-5 mx-auto md:mx-0">
              <Mail className="w-5 h-5 text-ocean-teal" />
            </div>

            {/* Titre */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              Un cliché des profondeurs,{' '}
              <span className="text-ocean-teal">rien que pour toi</span>
            </h2>

            {/* Sous-titre */}
            <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
              Pour remercier celles et ceux qui soutiennent mon travail, j'offre un cliché exclusif issu des fonds marins marseillais.
              Un fragment du royaume de Poséidon, saisi en apnée, là où la lumière se dissout dans le silence.
              Inscris-toi à la newsletter et reçois cette image des profondeurs, réservée aux abonnés.
            </p>

            {/* Formulaire / États */}
            <AnimatePresence mode="wait">

              {(status === 'idle' || status === 'error' || status === 'loading') && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
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

              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ocean-teal/20 border border-ocean-teal/40 flex-shrink-0">
                    <CheckCircle className="w-7 h-7 text-ocean-teal" />
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
                className="flex items-center gap-2 text-red-400 text-sm mt-3"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </motion.p>
            )}

            {/* Mention RGPD */}
            {status !== 'success' && (
              <p className="text-white/30 text-xs mt-4">
                Pas de spam. Désinscription à tout moment. Conforme RGPD.
              </p>
            )}

          </div>

          {/* Image Poséidon — colonne droite */}
          <div className="relative h-56 md:h-auto order-first md:order-last">
            <img
              src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-pos%C3%A9idon.webp"
              alt="Cliché exclusif des fonds marins marseillais — Dark Massilia"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient desktop : fondu depuis le bord gauche (côté contenu) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2D]/80 to-transparent pointer-events-none hidden md:block" />
            {/* Gradient mobile : fondu bas → transparent */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/80 to-transparent pointer-events-none md:hidden" />
            {/* Badge offert — centré, hors des bords */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ocean-teal/20 border border-ocean-teal/40 text-ocean-teal text-xs font-semibold whitespace-nowrap backdrop-blur-sm">
              🎁 Offert à l'inscription
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
