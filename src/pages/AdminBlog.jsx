import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock, LogOut, Eye, EyeOff, Search, RefreshCw,
  CheckCircle, XCircle, AlertCircle, Clock, ArrowLeft,
  FileText, Bell, BellOff, Calendar,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'darkm';

/* ── Helpers ──────────────────────────────────────────────────── */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
    .replace(/&hellip;/g, '…').replace(/&nbsp;/g, ' ')
    .replace(/&eacute;/g, 'é').replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à').replace(/&ccedil;/g, 'ç');
}

function fmtDate(iso, opts = {}) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      ...opts,
    });
  } catch {
    return '—';
  }
}

function fmtDateLong(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return '—';
  }
}

/* ── Toast ────────────────────────────────────────────────────── */
const Toast = ({ toasts }) => (
  <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none">
    {toasts.map(t => (
      <div
        key={t.id}
        className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl border transition-all ${
          t.type === 'success'
            ? 'bg-[#21c47b]/15 border-[#21c47b]/40 text-[#21c47b]'
            : 'bg-red-500/15 border-red-500/40 text-red-400'
        }`}
      >
        {t.msg}
      </div>
    ))}
  </div>
);

/* ── StatCard ─────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, label, accent }) => (
  <div
    className="rounded-2xl border border-white/10 p-5 flex items-center gap-4"
    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${accent}22`, border: `1px solid ${accent}40` }}
    >
      <Icon className="w-5 h-5" style={{ color: accent }} />
    </div>
    <div>
      <p className="text-2xl font-bold text-white leading-none">{value ?? '—'}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
    </div>
  </div>
);

/* ── ArticleRow ───────────────────────────────────────────────── */
const ArticleRow = ({ article, onNotify, onUnnotify }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (fn) => {
    setLoading(true);
    await fn();
    setLoading(false);
  };

  return (
    <tr className="border-t border-white/5 hover:bg-white/3 transition-colors">
      {/* Miniature */}
      <td className="px-3 py-3 w-16">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title || ''}
            className="w-12 h-12 object-cover rounded-lg bg-white/5"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white/20" />
          </div>
        )}
      </td>

      {/* Titre + slug */}
      <td className="px-3 py-3 min-w-0">
        <Link
          to={`/blog/${article.slug}`}
          className="text-sm font-medium text-white hover:text-[#21c47b] transition-colors line-clamp-2 leading-snug"
          target="_blank"
          rel="noopener noreferrer"
        >
          {article.title || article.slug}
        </Link>
        <p className="text-[11px] text-white/30 font-mono mt-0.5 truncate">{article.slug}</p>
      </td>

      {/* Date publication */}
      <td className="px-3 py-3 text-sm text-white/60 whitespace-nowrap hidden sm:table-cell">
        {fmtDateLong(article.date)}
      </td>

      {/* Modifié WP */}
      <td className="px-3 py-3 text-xs text-white/40 whitespace-nowrap hidden md:table-cell">
        {fmtDate(article.modified)}
      </td>

      {/* Notification */}
      <td className="px-3 py-3 whitespace-nowrap">
        {article.notified_at ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#21c47b]/15 text-[#21c47b] border border-[#21c47b]/30">
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            {fmtDate(article.notified_at)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            À notifier
          </span>
        )}
      </td>

      {/* Synced */}
      <td className="px-3 py-3 text-xs text-white/30 whitespace-nowrap hidden lg:table-cell">
        {fmtDate(article.synced_at)}
      </td>

      {/* Actions */}
      <td className="px-3 py-3 whitespace-nowrap">
        {article.notified_at ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction(() => onUnnotify(article.slug))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
          >
            {loading
              ? <span className="w-3 h-3 border border-white/30 border-t-transparent rounded-full animate-spin" />
              : <XCircle className="w-3 h-3" />
            }
            Annuler
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction(() => onNotify(article.slug))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-black transition-colors disabled:opacity-50"
            style={{ background: loading ? 'rgba(33,196,123,0.5)' : 'linear-gradient(135deg, #21c47b, #1aaa6a)' }}
          >
            {loading
              ? <span className="w-3 h-3 border border-black/30 border-t-transparent rounded-full animate-spin" />
              : <CheckCircle className="w-3 h-3" />
            }
            Notifier
          </button>
        )}
      </td>
    </tr>
  );
};

/* ── Page principale ──────────────────────────────────────────── */
export default function AdminBlog() {
  /* Auth */
  const [auth, setAuth] = useState(() => {
    try { return sessionStorage.getItem('admin_blog_auth') === '1'; } catch { return false; }
  });
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [authError, setAuthError] = useState('');

  /* Data */
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Sync */
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState('');

  /* Filters */
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'notified'

  /* Toasts */
  const [toasts, setToasts] = useState([]);

  /* ── Toast helpers ── */
  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  /* ── Auth ── */
  const login = () => {
    if (password === ADMIN_PASSWORD) {
      try { sessionStorage.setItem('admin_blog_auth', '1'); } catch {}
      setAuth(true);
    } else {
      setAuthError('Mot de passe incorrect');
    }
  };

  const logout = () => {
    try { sessionStorage.removeItem('admin_blog_auth'); } catch {}
    setAuth(false);
  };

  /* ── Fetch articles ── */
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, wp_id, slug, title, excerpt, date, modified, date_formatted, image, notified_at, synced_at, author')
      .order('date', { ascending: false });
    if (error) {
      addToast('Erreur lors du chargement des articles', 'error');
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  }, [addToast]);

  useEffect(() => {
    if (auth) fetchArticles();
  }, [auth, fetchArticles]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total = articles.length;
    const notified = articles.filter(a => a.notified_at).length;
    const pending = total - notified;
    const lastSync = articles.reduce((max, a) => {
      if (!a.synced_at) return max;
      return !max || a.synced_at > max ? a.synced_at : max;
    }, null);
    return { total, notified, pending, lastSync };
  }, [articles]);

  /* ── Filtered articles ── */
  const filtered = useMemo(() => {
    let list = articles;
    if (filter === 'pending') list = list.filter(a => !a.notified_at);
    if (filter === 'notified') list = list.filter(a => a.notified_at);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.slug || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, filter, search]);

  /* ── Notify / Unnotify ── */
  const handleNotify = useCallback(async (slug) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({ notified_at: new Date().toISOString() })
      .eq('slug', slug);
    if (error) {
      addToast(`Erreur : ${error.message}`, 'error');
    } else {
      addToast('Article marqué comme notifié ✓');
      await fetchArticles();
    }
  }, [addToast, fetchArticles]);

  const handleUnnotify = useCallback(async (slug) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({ notified_at: null })
      .eq('slug', slug);
    if (error) {
      addToast(`Erreur : ${error.message}`, 'error');
    } else {
      addToast('Notification annulée');
      await fetchArticles();
    }
  }, [addToast, fetchArticles]);

  /* ── Sync depuis WordPress ── */
  const handleSync = async () => {
    setSyncing(true);
    setSyncProgress('Connexion à WordPress…');

    try {
      const WP_BASE = 'https://cms.karimsaari.com/wp-json/wp/v2/posts';
      const PER_PAGE = 100;

      /* 1. Récupérer tous les posts (pagination) */
      const allPosts = [];
      let page = 1;
      let totalPages = 1;

      do {
        setSyncProgress(`Récupération page ${page}/${totalPages}…`);
        const res = await fetch(
          `${WP_BASE}?per_page=${PER_PAGE}&_embed&status=publish&page=${page}`,
          { signal: AbortSignal.timeout(20000) }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
        const posts = await res.json();
        allPosts.push(...posts);
        page++;
      } while (page <= totalPages);

      setSyncProgress(`${allPosts.length} articles récupérés — synchronisation…`);

      /* 2. Récupérer les notified_at existants pour les préserver */
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('wp_id, notified_at');
      const notifiedMap = {};
      (existing || []).forEach(r => { notifiedMap[r.wp_id] = r.notified_at; });

      /* 3. Mapper WP → Supabase */
      const rows = allPosts.map(post => {
        const dateObj = new Date(post.date);
        const media = post._embedded?.['wp:featuredmedia']?.[0];
        const imageOg = media?.source_url || null;
        const imageWebp = imageOg
          ? imageOg.replace(/\.(jpg|jpeg|png)(\?.*)?$/, '.webp')
          : null;
        const imageAlt = media?.alt_text || media?.title?.rendered || null;

        return {
          wp_id: post.id,
          slug: post.slug,
          title: decodeEntities(post.title?.rendered || ''),
          excerpt: stripHtml(post.excerpt?.rendered || ''),
          date: post.date,
          modified: post.modified,
          date_formatted: dateObj.toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric',
          }),
          image_og: imageOg,
          image: imageWebp,
          image_alt: imageAlt,
          author: post._embedded?.author?.[0]?.name || 'Dark Massilia',
          synced_at: new Date().toISOString(),
          // Préserver notified_at existant
          notified_at: notifiedMap[post.id] ?? null,
        };
      });

      /* 4. Upsert */
      const { error: upsertErr } = await supabase
        .from('blog_posts')
        .upsert(rows, { onConflict: 'wp_id' });

      if (upsertErr) throw new Error(upsertErr.message);

      addToast(`${rows.length} articles synchronisés avec succès ✓`);
      await fetchArticles();
    } catch (err) {
      const isCors =
        err.name === 'TypeError' ||
        err.message?.toLowerCase().includes('cors') ||
        err.message?.toLowerCase().includes('failed to fetch') ||
        err.message?.toLowerCase().includes('network');

      if (isCors) {
        addToast(
          'WordPress inaccessible depuis le navigateur — lancez `npm run wp:sync` localement',
          'error'
        );
      } else {
        addToast(`Erreur sync : ${err.message}`, 'error');
      }
    } finally {
      setSyncing(false);
      setSyncProgress('');
    }
  };

  /* ── Fond ── */
  const BG = (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0a1628 50%, #060d1a 100%)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#060d1a]/70 to-[#060d1a]/95" />
    </div>
  );

  /* ── Login screen ── */
  if (!auth) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {BG}
        <div className="relative z-10 w-full max-w-sm">
          <div
            className="rounded-2xl p-8 border border-white/10"
            style={{ background: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(33,196,123,0.2)', border: '1px solid rgba(33,196,123,0.3)' }}>
                <Lock className="w-4 h-4 text-[#21c47b]" />
              </div>
              <h1 className="text-white font-bold text-lg">Admin Blog — Dark Massilia</h1>
            </div>
            <p className="text-white/30 text-xs mb-6 ml-12">Gestion des articles WordPress</p>
            <div className="relative mb-3">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="Mot de passe"
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-11 text-white placeholder-white/30 focus:outline-none focus:border-[#21c47b]/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                aria-label={showPwd ? 'Masquer' : 'Afficher'}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}
            <button
              type="button"
              onClick={login}
              className="w-full font-semibold py-3 rounded-lg transition-opacity hover:opacity-90 text-black"
              style={{ background: 'linear-gradient(135deg, #21c47b, #1aaa6a)' }}
            >
              Connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── App ── */
  return (
    <div className="relative min-h-screen text-white">
      {BG}
      <Toast toasts={toasts} />

      {/* ── Header ── */}
      <header
        className="relative z-10 sticky top-0 border-b border-white/8 px-4 py-3"
        style={{ background: 'rgba(6,13,26,0.92)', backdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <div className="mr-auto min-w-0">
            <h1 className="font-bold text-[#21c47b] tracking-wide text-sm sm:text-base truncate">
              Dark Massilia — Admin Blog
            </h1>
            <p className="text-white/40 text-xs hidden sm:block">
              Gestion des articles WordPress et des notifications Brevo
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/admin/galerie"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Galerie
            </Link>

            <button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #21c47b, #1aaa6a)' }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              Syncer WP
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Barre de progression sync */}
        {syncing && syncProgress && (
          <div className="max-w-7xl mx-auto mt-2 flex items-center gap-2 text-xs text-[#21c47b]/80">
            <span className="w-3 h-3 border border-[#21c47b] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            {syncProgress}
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={FileText}
            value={stats.total}
            label="Total articles"
            accent="#0091ff"
          />
          <StatCard
            icon={Bell}
            value={stats.notified}
            label="Notifiés"
            accent="#21c47b"
          />
          <StatCard
            icon={BellOff}
            value={stats.pending}
            label="À notifier"
            accent="#f97316"
          />
          <StatCard
            icon={Clock}
            value={stats.lastSync ? fmtDate(stats.lastSync, { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}
            label="Dernière sync"
            accent="#a78bfa"
          />
        </div>

        {/* ── Barre de recherche + filtres ── */}
        <div
          className="rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row gap-3"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
        >
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un titre ou slug…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#21c47b]/50 transition-colors"
            />
          </div>

          {/* Filtres */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 flex-shrink-0">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'pending', label: 'À notifier' },
              { key: 'notified', label: 'Notifiés' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'text-black'
                    : 'text-white/50 hover:text-white'
                }`}
                style={filter === key ? { background: 'linear-gradient(135deg, #21c47b, #1aaa6a)' } : {}}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-white/40">
              <span className="w-5 h-5 border-2 border-[#21c47b] border-t-transparent rounded-full animate-spin" />
              Chargement…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-white/30">
              <FileText className="w-8 h-8 opacity-40" />
              <p className="text-sm">
                {search || filter !== 'all' ? 'Aucun article trouvé' : 'Aucun article — lancez une synchronisation'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="text-xs text-white/40 uppercase tracking-wider">
                    <th className="px-3 py-3 text-left font-semibold w-14">Img</th>
                    <th className="px-3 py-3 text-left font-semibold w-[35%]">Titre / Slug</th>
                    <th className="px-3 py-3 text-left font-semibold hidden sm:table-cell w-32">Publication</th>
                    <th className="px-3 py-3 text-left font-semibold hidden md:table-cell w-24">Modifié</th>
                    <th className="px-3 py-3 text-left font-semibold w-36">Notification</th>
                    <th className="px-3 py-3 text-left font-semibold hidden lg:table-cell w-24">Sync</th>
                    <th className="px-3 py-3 text-left font-semibold w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(article => (
                    <ArticleRow
                      key={article.id}
                      article={article}
                      onNotify={handleNotify}
                      onUnnotify={handleUnnotify}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer compteur */}
          {!loading && filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-white/5 text-xs text-white/30 flex items-center justify-between">
              <span>{filtered.length} article{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}</span>
              {filter !== 'all' || search ? (
                <button
                  type="button"
                  onClick={() => { setFilter('all'); setSearch(''); }}
                  className="text-[#21c47b]/60 hover:text-[#21c47b] transition-colors"
                >
                  Effacer les filtres
                </button>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
