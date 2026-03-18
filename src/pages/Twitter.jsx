import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Rss, CalendarDays, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

// ── RSS Parc National des Calanques ─────────────────────────────────────────
const RSS_PROXY = 'https://bzlllfmpojcybuyuemdx.supabase.co/functions/v1/rss-parc-calanques';

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

const useParcRss = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRss = async () => {
      try {
        const res = await fetch(RSS_PROXY, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.status !== 'ok') throw new Error(data.message || 'Flux indisponible');

        const seen = new Set();
        const unique = data.items.filter((item) => {
          if (seen.has(item.link)) return false;
          seen.add(item.link);
          return true;
        });

        const parsed = unique.slice(0, 9).map((item) => ({
          title: item.title || '',
          link: item.link,
          date: formatDate(item.pubDate),
          description: item.description || '',
          image: item.image || '',
        }));

        setItems(parsed);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRss();
  }, []);

  return { items, loading, error };
};

// ── Composant carte RSS — style Parc ─────────────────────────────────────────
const RssCard = ({ title, link, date, description, image }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-ocean-teal/30 bg-white/5 hover:bg-white/[0.08] transition-all duration-300"
  >
    {/* Image */}
    <div className="aspect-video w-full overflow-hidden bg-white/5 flex-shrink-0">
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Rss className="w-10 h-10 text-white/10" />
        </div>
      )}
    </div>

    {/* Contenu */}
    <div className="flex flex-col flex-1 p-5 gap-3">
      {date && (
        <div className="flex items-center gap-1.5 text-xs text-ocean-teal/80 font-medium">
          <CalendarDays className="w-3.5 h-3.5" />
          {date}
        </div>
      )}
      <h3 className="text-sm font-semibold text-white group-hover:text-ocean-teal transition-colors leading-snug line-clamp-3 flex-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{description}</p>
      )}
      <div className="pt-1">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-ocean-teal/20 hover:bg-ocean-teal/30 border border-ocean-teal/30 rounded-lg px-3 py-1.5 transition-colors group-hover:bg-ocean-teal/30">
          Lire la suite
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  </a>
);

// ── Page principale ──────────────────────────────────────────────────────────
const Twitter = () => {
  const { items, loading, error } = useParcRss();

  return (
    <div className="min-h-screen py-24">
      <SEO {...SEO_PAGES['/actualites']} />
      <div className="container-custom">

        {/* ── Section RSS Parc National ─────────────────────────────────── */}
        <motion.div initial="hidden" animate="visible" variants={STAGGER_CONTAINER} className="mb-10">
          <motion.div variants={FADE_IN_UP} className="glass-strong rounded-2xl p-6 md:p-8 border border-white/10">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-2">
                <Rss className="w-4 h-4 text-ocean-teal" />
                <h2 className="text-base font-semibold text-white">
                  Parc National des Calanques
                </h2>
              </div>
              <a
                href="https://calanques-parcnational.fr/fr/actualites"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-ocean-teal hover:text-white transition-colors font-medium"
              >
                Toutes les actus
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Chargement…</span>
              </div>
            )}

            {error && !loading && (
              <div className="flex items-start gap-2 text-gray-400 py-6 px-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <p className="text-sm">
                  Impossible de charger le flux pour l'instant.{' '}
                  <a
                    href="https://calanques-parcnational.fr/fr/actualites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ocean-teal underline underline-offset-2 hover:text-white"
                  >
                    Consulter directement le site du Parc
                  </a>
                  .
                </p>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, i) => (
                  <RssCard key={i} {...item} />
                ))}
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <p className="text-sm text-gray-400 py-6 text-center">Aucune actualité disponible.</p>
            )}

            <p className="text-xs text-gray-600 mt-6 text-right">
              Source :{' '}
              <a
                href="https://calanques-parcnational.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                calanques-parcnational.fr
              </a>
            </p>
          </motion.div>
        </motion.div>

        {/* Header — déplacé en bas */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mt-10 mb-8"
        >
          <motion.div variants={FADE_IN_UP} className="glass rounded-3xl p-8 md:p-10">
            <h1 className="text-lg md:text-xl font-bold text-white mb-4">
              Actualités des Calanques & veille environnementale
            </h1>
            <p className="text-text-secondary leading-relaxed text-sm">
              Deux sources en direct : le fil{' '}
              <strong className="text-ocean-teal">@dark_massilia</strong> pour les alertes terrain
              et observations sous-marines, et les actualités officielles du{' '}
              <strong className="text-white">Parc National des Calanques</strong> pour suivre la
              vie du parc — espèces protégées, réglementation, événements.
            </p>
            <div className="mt-5">
              <a
                href="https://x.com/dark_massilia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium text-sm"
              >
                Voir le profil @dark_massilia sur X
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Retour */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Link
            to="/"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'Accueil</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Twitter;
