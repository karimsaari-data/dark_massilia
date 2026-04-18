import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Rss, CalendarDays, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FADE_IN_UP, STAGGER_CONTAINER } from '../utils/constants';
import SEO from '../components/SEO';
import FireRiskBanner from '../components/FireRiskBanner';
import { SEO_PAGES } from '../utils/seo';

// ── RSS Actualités Parc National ────────────────────────────────────────────
const RSS_PROXY    = 'https://bzlllfmpojcybuyuemdx.supabase.co/functions/v1/rss-parc-calanques';
const AGENDA_PROXY = 'https://bzlllfmpojcybuyuemdx.supabase.co/functions/v1/agenda-parc-calanques';

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short', // "avr." au lieu de "avril" — cohérent avec les badges Agenda
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

// Convertit un item agenda { day, month } en timestamp pour le tri
// month = "AVR", "MAI", etc. — on reconstruit une Date pour l'année en cours ou l'année suivante
const MONTH_ABR = {
  JAN: 1, FEV: 2, MAR: 3, AVR: 4, MAI: 5, JUN: 6,
  JUI: 7, AOU: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};
const agendaTimestamp = (item) => {
  const now = new Date();
  const m = MONTH_ABR[(item.month || '').toUpperCase().slice(0, 3)] || 0;
  const d = parseInt(item.day, 10) || 0;
  if (!m || !d) return Infinity;
  const year = now.getFullYear();
  const candidate = new Date(year, m - 1, d);
  // Si la date est passée, on la projette à l'année suivante
  return candidate.getTime() < now.getTime()
    ? new Date(year + 1, m - 1, d).getTime()
    : candidate.getTime();
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

        const sorted = unique.sort((a, b) => {
          const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
          const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
          return db - da;
        });

        const parsed = sorted.slice(0, 9).map((item) => ({
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

// ── Hook Agenda ──────────────────────────────────────────────────────────────
const useAgenda = () => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetch(AGENDA_PROXY, { signal: AbortSignal.timeout(10000), cache: 'no-store' })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        if (data.status !== 'ok') throw new Error(data.message || 'Indisponible');
        // Tri croissant : événement le plus proche en premier
        const sorted = [...data.items].sort(
          (a, b) => agendaTimestamp(a) - agendaTimestamp(b)
        );
        setItems(sorted);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
};

// ── Composant carte Agenda ───────────────────────────────────────────────────
const AgendaCard = ({ title, link, day, month, adverb, location, image }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-ocean-teal/30 bg-white/5 hover:bg-white/[0.08] transition-all duration-300"
  >
    <div className="relative aspect-video w-full overflow-hidden bg-white/5 flex-shrink-0">
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <CalendarDays className="w-10 h-10 text-white/10" />
        </div>
      )}
      {/* Badge date */}
      {(day || month) && (
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center bg-ocean-teal text-white rounded-xl px-2.5 py-1.5 text-center shadow-lg min-w-[44px]">
          <span className="text-lg font-bold leading-none">{day}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide leading-none mt-0.5">{month}</span>
        </div>
      )}
    </div>
    <div className="flex flex-col flex-1 p-4 gap-2">
      <h3 className="text-sm font-semibold text-white group-hover:text-ocean-teal transition-colors leading-snug line-clamp-2 flex-1">
        {title}
      </h3>
      {location && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <span>📍</span>{location}
        </p>
      )}
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-ocean-teal/20 border border-ocean-teal/30 rounded-lg px-3 py-1.5 w-fit group-hover:bg-ocean-teal/30 transition-colors">
        Lire la suite <ExternalLink className="w-3 h-3" />
      </span>
    </div>
  </a>
);

// ── Composant carte RSS — style Parc ─────────────────────────────────────────
const RssCard = ({ title, link, date, description, image, priority }) => (
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
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
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
  const { items, loading, error }                     = useParcRss();
  const { items: agendaItems, loading: agendaLoading, error: agendaError } = useAgenda();

  return (
    <div className="min-h-screen">
      <SEO {...SEO_PAGES['/actualites']} />
      <FireRiskBanner />
      <div className="py-24">
      <div className="container-custom">

        {/* ── Titre + bloc X en avant ──────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="mx-auto mb-10"
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

        {/* ── Section RSS Parc National ─────────────────────────────────── */}
        <div className="mb-10">
          <div className="glass-strong rounded-2xl p-6 md:p-8 border border-white/10">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-2">
                <Rss className="w-4 h-4 text-ocean-teal" />
                <h2 className="text-base font-semibold text-white">Parc National des Calanques</h2>
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
              <div className="flex items-center justify-center text-gray-400" style={{ minHeight: '420px' }}>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: '420px' }}>
                {items.map((item, i) => (
                  <RssCard key={i} {...item} priority={i === 0} />
                ))}
                {/* CTA card pour combler le trou si nombre impair */}
                {items.length % 3 !== 0 && (
                  <a
                    href="https://calanques-parcnational.fr/fr/actualites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-center rounded-2xl border border-ocean-teal/20 border-dashed bg-ocean-teal/5 hover:bg-ocean-teal/10 hover:border-ocean-teal/40 transition-all duration-300 p-8 text-center gap-3"
                  >
                    <Rss className="w-8 h-8 text-ocean-teal/60 group-hover:text-ocean-teal transition-colors" />
                    <p className="text-sm font-semibold text-white group-hover:text-ocean-teal transition-colors">
                      Toutes les actualités
                    </p>
                    <p className="text-xs text-gray-500">
                      calanques-parcnational.fr
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-ocean-teal border border-ocean-teal/30 rounded-lg px-3 py-1.5 group-hover:bg-ocean-teal/20 transition-colors">
                      Voir le site <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                )}
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
          </div>
        </div>

        {/* ── Section Agenda ────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="glass-strong rounded-2xl p-6 md:p-8 border border-white/10">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-ocean-teal" />
                <h2 className="text-base font-semibold text-white">Agenda</h2>
              </div>
              <a
                href="https://calanques-parcnational.fr/fr/agenda"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-ocean-teal hover:text-white transition-colors font-medium"
              >
                Tous les événements
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {agendaLoading && (
              <div className="flex items-center justify-center text-gray-400" style={{ minHeight: '200px' }}>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Chargement…</span>
              </div>
            )}

            {agendaError && !agendaLoading && (
              <div className="flex items-start gap-2 text-gray-400 py-6 px-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <p className="text-sm">
                  Impossible de charger l'agenda.{' '}
                  <a href="https://calanques-parcnational.fr/fr/agenda" target="_blank" rel="noopener noreferrer"
                    className="text-ocean-teal underline underline-offset-2 hover:text-white">
                    Consulter directement le site du Parc
                  </a>.
                </p>
              </div>
            )}

            {!agendaLoading && !agendaError && agendaItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {agendaItems.map((item, i) => (
                  <AgendaCard key={i} {...item} />
                ))}
                {agendaItems.length % 3 !== 0 && (
                  <a
                    href="https://calanques-parcnational.fr/fr/agenda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-center rounded-2xl border border-ocean-teal/20 border-dashed bg-ocean-teal/5 hover:bg-ocean-teal/10 hover:border-ocean-teal/40 transition-all duration-300 p-8 text-center gap-3"
                  >
                    <CalendarDays className="w-8 h-8 text-ocean-teal/60 group-hover:text-ocean-teal transition-colors" />
                    <p className="text-sm font-semibold text-white group-hover:text-ocean-teal transition-colors">
                      Tous les événements
                    </p>
                    <p className="text-xs text-gray-500">
                      calanques-parcnational.fr
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-ocean-teal border border-ocean-teal/30 rounded-lg px-3 py-1.5 group-hover:bg-ocean-teal/20 transition-colors">
                      Voir l'agenda <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                )}
              </div>
            )}

            <p className="text-xs text-gray-600 mt-6 text-right">
              Source :{' '}
              <a href="https://calanques-parcnational.fr" target="_blank" rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors">
                calanques-parcnational.fr
              </a>
            </p>
          </div>
        </div>

        {/* ── Cluster interne ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 text-sm"
        >
          <Link to="/communaute" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
            Rejoindre la communauté <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/#newsletter" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
            S'inscrire à la newsletter <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/depollution-marine" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
            Nos missions de dépollution <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/carte-calanques" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
            Carte interactive des Calanques <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/" className="text-text-secondary hover:text-ocean-teal transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Accueil
          </Link>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default Twitter;
