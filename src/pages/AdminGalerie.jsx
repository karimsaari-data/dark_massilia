import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  Lock, LogOut, Search, Save, Eye, EyeOff,
  ChevronDown, ChevronUp, MapPin, ExternalLink, ArrowUp, X,
} from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'darkm';


/* ── Galerie : champs éditables ─────────────────────────────── */
const GALERIE_FIELDS = [
  { key: 'title', label: 'Titre',  type: 'text',     placeholder: 'Titre affiché (optionnel)' },
  { key: 'alt',   label: 'Alt',    type: 'textarea',  placeholder: 'Texte alternatif SEO' },
  { key: 'lieu',  label: 'Lieu',   type: 'text',      placeholder: 'Ex: Calanques de Marseille' },
];

/* ── Coordonnées : parse "lat, lng" depuis une URL Google Maps ou texte brut ── */
function parseCoords(raw) {
  if (!raw) return null;
  // URL Google Maps : @43.2965,5.3698 ou ?q=43.2965,5.3698
  const urlMatch = raw.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || raw.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (urlMatch) return { lat: parseFloat(urlMatch[1]), lng: parseFloat(urlMatch[2]) };
  // Texte brut "43.2965, 5.3698" ou "43.2965,5.3698"
  const plainMatch = raw.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (plainMatch) return { lat: parseFloat(plainMatch[1]), lng: parseFloat(plainMatch[2]) };
  return null;
}

/* ── Champ coordonnées ───────────────────────────────────────── */
const CoordField = ({ draft, setDraft }) => {
  const [input, setInput] = useState(
    draft.lat && draft.lng ? `${draft.lat}, ${draft.lng}` : ''
  );
  const [error, setError] = useState('');

  const handleBlur = () => {
    if (!input.trim()) {
      setDraft(d => ({ ...d, lat: null, lng: null }));
      setError('');
      return;
    }
    const parsed = parseCoords(input);
    if (parsed) {
      setDraft(d => ({ ...d, lat: parsed.lat, lng: parsed.lng }));
      setInput(`${parsed.lat}, ${parsed.lng}`);
      setError('');
    } else {
      setError('Format invalide. Ex : 43.2965, 5.3698 ou colle une URL Google Maps');
    }
  };

  const mapsUrl = draft.lat && draft.lng
    ? `https://www.google.com/maps?q=${draft.lat},${draft.lng}`
    : null;

  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-[#21c47b]" />
        Coordonnées GPS
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onBlur={handleBlur}
          placeholder="43.2965, 5.3698 — ou colle une URL Google Maps"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#21c47b]/60 transition-colors font-mono"
        />
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:border-[#21c47b]/40 transition-colors flex-shrink-0"
            title="Vérifier sur Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Maps
          </a>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {draft.lat && draft.lng && (
        <p className="text-[10px] text-white/30 mt-1 font-mono">lat {draft.lat} · lng {draft.lng}</p>
      )}
    </div>
  );
};


/* ── Modal preview plein écran ──────────────────────────────── */
const PhotoPreviewModal = ({ photo, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={photo.src}
        alt={photo.alt || photo.title || ''}
        className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
      <div className="mt-4 text-center" onClick={e => e.stopPropagation()}>
        {photo.title && (
          <p className="text-white font-semibold text-lg leading-tight">{photo.title}</p>
        )}
        {photo.lieu && (
          <p className="text-white/60 text-sm mt-1.5 flex items-center justify-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF7F00] flex-shrink-0" />
            {photo.lieu}
          </p>
        )}
      </div>
    </div>
  );
};

/* ── PhotoRow (galerie) ─────────────────────────────────────── */
const PhotoRow = ({ photo, onSave, onToggleVisible, onPreview, showCategorie, categorieOptions }) => {
  const [draft, setDraft]       = useState({ title: photo.title, alt: photo.alt, lieu: photo.lieu, lat: photo.lat ?? null, lng: photo.lng ?? null, categorie: photo.categorie ?? null });
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [expanded, setExpanded] = useState(false);

  const dirty = GALERIE_FIELDS.some(f => draft[f.key] !== photo[f.key])
    || draft.lat !== (photo.lat ?? null)
    || draft.lng !== (photo.lng ?? null)
    || draft.categorie !== (photo.categorie ?? null);

  const handleSave = async () => {
    setSaving(true);
    await onSave(photo.id, draft);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${expanded ? 'border-white/20 bg-white/5' : 'border-white/8 hover:border-white/15'}`}>
      <button type="button" className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setExpanded(e => !e)}>
        <div
          className="relative w-48 h-32 flex-shrink-0 cursor-zoom-in group"
          onClick={e => { e.stopPropagation(); onPreview(photo); }}
        >
          <img src={photo.src} alt="" className="w-full h-full object-cover rounded-lg bg-white/5 group-hover:brightness-75 transition-all" loading="lazy" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>
          {photo.lat && photo.lng && (
            <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#21c47b]/90 flex items-center justify-center" title={`${photo.lat}, ${photo.lng}`}>
              <MapPin className="w-2.5 h-2.5 text-black" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {photo.title || <span className="text-white/30 italic">Sans titre</span>}
          </p>
          <p className="text-xs text-white/40 truncate mt-0.5">{photo.uid}</p>
          {photo.lieu && (
            <p className="text-xs text-white/50 truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-white/25 flex-shrink-0" />
              {photo.lieu}
            </p>
          )}
          {photo.alt && (
            <p className="text-[11px] text-white/25 truncate mt-0.5 italic">{photo.alt}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleVisible(photo.id, photo.visible); }}
            className={`p-1.5 rounded-lg transition-colors ${photo.visible ? 'text-green-400 hover:bg-green-400/10' : 'text-white/30 hover:bg-white/10'}`}
            title={photo.visible ? 'Masquer' : 'Afficher'}
          >
            {photo.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-white/8 pt-3 space-y-3">
          {GALERIE_FIELDS.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  value={draft[key]}
                  onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                  placeholder={placeholder}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 resize-y focus:outline-none focus:border-[#21c47b]/60 transition-colors"
                />
              ) : (
                <input
                  type="text"
                  value={draft[key]}
                  onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#21c47b]/60 transition-colors"
                />
              )}
            </div>
          ))}
          <CoordField draft={draft} setDraft={setDraft} />
          {showCategorie && categorieOptions && (
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Catégorie</label>
              <select
                value={draft.categorie || ''}
                onChange={e => setDraft(d => ({ ...d, categorie: e.target.value || null }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#21c47b]/60 transition-colors"
                style={{ colorScheme: 'dark' }}
              >
                <option value="">— Non classée —</option>
                {categorieOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                saved ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : dirty ? 'bg-[#21c47b] text-black hover:bg-[#1aab6a]'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? 'Sauvegardé !' : saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Tab Galerie ────────────────────────────────────────────── */
const TabGalerie = ({ tableName }) => {
  const [catFilter,      setCatFilter]      = useState('all');
  const [incompleteOnly, setIncompleteOnly] = useState(false);
  const [search, setSearch]                = useState('');
  const [photos, setPhotos]                = useState([]);
  const [loading, setLoading]              = useState(false);
  const [loadError, setLoadError]          = useState(null);
  const [preview, setPreview]              = useState(null);

  const isIncomplete = (p) =>
    !p.title || !p.alt || !p.lieu || !p.lat || !p.lng;
  const isPaysage    = tableName === 'photos_paysage';
  const isSousMarine = tableName === 'photos_sous_marine';

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase.from(tableName).select('*').order('uid');
    if (error) setLoadError(error.message);
    setPhotos(data || []);
    setLoading(false);
  }, [tableName]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (id, draft) => {
    await supabase.from(tableName).update(draft).eq('id', id);
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...draft } : p));
  };

  const handleToggleVisible = async (id, current) => {
    const next = !current;
    await supabase.from(tableName).update({ visible: next }).eq('id', id);
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, visible: next } : p));
  };

  const filtered = photos.filter(p => {
    if ((isPaysage || isSousMarine) && catFilter !== 'all' && p.categorie !== catFilter) return false;
    if (incompleteOnly && !isIncomplete(p)) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      p.uid.includes(q) ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.alt   || '').toLowerCase().includes(q) ||
      (p.lieu  || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher (uid, titre, lieu…)"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#21c47b]/60"
          />
        </div>
        {isPaysage && (
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {[{ key: 'all', label: 'Tout' }, { key: 'mer', label: 'Mer' }, { key: 'terre', label: 'Terre' }].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setCatFilter(key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${catFilter === key ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        {isSousMarine && (
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {[{ key: 'all', label: 'Tout' }, { key: 'depollution', label: 'Dépollution' }, { key: 'biodiversite', label: 'Biodiversité' }, { key: 'caracterisation', label: 'Caractérisation' }].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setCatFilter(key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${catFilter === key ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setIncompleteOnly(v => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            incompleteOnly
              ? 'bg-orange-500/20 border border-orange-500/50 text-orange-300'
              : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
          }`}
        >
          ⚠ Incomplet {incompleteOnly && `(${filtered.length})`}
        </button>
      </div>

      <p className="text-xs text-white/30">{loading ? 'Chargement…' : `${filtered.length} photo${filtered.length > 1 ? 's' : ''}`}</p>

      {loadError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
          Erreur Supabase : {loadError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#21c47b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(photo => (
            <PhotoRow
              key={photo.id}
              photo={photo}
              onSave={handleSave}
              onToggleVisible={handleToggleVisible}
              onPreview={setPreview}
              showCategorie={isPaysage || isSousMarine}
              categorieOptions={
                isSousMarine
                  ? [{ value: 'depollution', label: 'Dépollution' }, { value: 'biodiversite', label: 'Biodiversité' }, { value: 'caracterisation', label: 'Caractérisation' }]
                  : [{ value: 'mer', label: 'Mer' }, { value: 'terre', label: 'Terre' }]
              }
            />
          ))}
          {filtered.length === 0 && <p className="text-center text-white/30 py-12">Aucune photo trouvée</p>}
        </div>
      )}
      {preview && <PhotoPreviewModal photo={preview} onClose={() => setPreview(null)} />}
    </div>
  );
};

/* ── Métadonnées plateformes ────────────────────────────────── */
const PLATFORM_META = {
  facebook_group:            { label: 'Facebook — Amoureux des Calanques', unit: 'membres' },
  instagram:                 { label: 'Instagram',                          unit: 'abonnés' },
  tiktok:                    { label: 'TikTok',                             unit: 'abonnés' },
  youtube:                   { label: 'YouTube',                            unit: 'abonnés' },
  facebook_perso:            { label: 'Facebook Perso',                     unit: 'abonnés' },
  facebook_page:             { label: 'Facebook Page — Dark Massilia',      unit: 'abonnés' },
  pinterest:                 { label: 'Pinterest',                          unit: 'abonnés' },
  x:                         { label: 'X / Twitter',                        unit: 'abonnés' },
  local_guide_contributions: { label: 'Local Guide — Contributions',        unit: 'contributions' },
  local_guide_points:        { label: 'Local Guide — Points',               unit: 'pts' },
  local_guide_views_m:       { label: 'Local Guide — Vues générées',        unit: 'millions' },
  local_guide_level:         { label: 'Local Guide — Niveau',               unit: 'niveau' },
};

/* ── Tab Réseaux ────────────────────────────────────────────── */
const TabReseaux = () => {
  const [stats, setStats]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState(null);
  const [saved, setSaved]   = useState(null);

  useEffect(() => {
    supabase.from('social_stats').select('*').order('sort_order').then(({ data }) => {
      setStats(data || []);
      const d = {};
      (data || []).forEach(row => {
        d[row.platform] = { value: String(row.value), note: row.note || '' };
      });
      setDrafts(d);
      setLoading(false);
    });
  }, []);

  const handleSave = async (platform) => {
    setSaving(platform);
    const draft = drafts[platform];
    const updates = { value: parseFloat(draft.value), note: draft.note || null };
    await supabase.from('social_stats').update(updates).eq('platform', platform);
    setStats(prev => prev.map(s => s.platform === platform ? { ...s, ...updates } : s));
    setSaving(null);
    setSaved(platform);
    setTimeout(() => setSaved(null), 2000);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-astroide border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/40 mb-6">
        Mets à jour les chiffres de tes réseaux sociaux. Les modifications sont reflétées en direct sur le site.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {stats.map(stat => {
        const meta  = PLATFORM_META[stat.platform] || { label: stat.platform, unit: '' };
        const draft = drafts[stat.platform] || { value: String(stat.value), note: stat.note || '' };
        const isDirty = parseFloat(draft.value) !== parseFloat(stat.value) || (draft.note || '') !== (stat.note || '');
        const isSaving = saving === stat.platform;
        const isSaved  = saved  === stat.platform;
        return (
          <div key={stat.platform} className="border border-white/10 hover:border-astroide/30 rounded-xl p-4 transition-colors bg-white/3">
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-sm font-semibold text-white leading-tight">{meta.label}</p>
              <button
                type="button"
                onClick={() => handleSave(stat.platform)}
                disabled={!isDirty || isSaving}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                  isSaved   ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : isDirty ? 'bg-astroide text-black hover:bg-astroide-dark'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                {isSaved ? 'OK !' : isSaving ? '…' : 'Sauv.'}
              </button>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-white/40 mb-1">Valeur</label>
                <input
                  type="number"
                  step="0.01"
                  value={draft.value}
                  onChange={e => setDrafts(d => ({ ...d, [stat.platform]: { ...d[stat.platform], value: e.target.value } }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-astroide/60 transition-colors font-mono"
                />
              </div>
              <div className="w-24 flex-shrink-0">
                <label className="block text-xs text-white/40 mb-1">Unité</label>
                <div className="bg-white/3 border border-white/5 rounded-lg px-3 py-2 text-xs text-white/40 h-[38px] flex items-center">
                  {meta.unit}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs text-white/40 mb-1">Note</label>
              <input
                type="text"
                value={draft.note}
                onChange={e => setDrafts(d => ({ ...d, [stat.platform]: { ...d[stat.platform], note: e.target.value } }))}
                placeholder="Ex : @karimsaari"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-astroide/60 transition-colors"
              />
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

/* ── Page principale ────────────────────────────────────────── */
export default function Admin() {
  const [auth, setAuth]           = useState(() => localStorage.getItem('admin_auth') === '1');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [authError, setAuthError] = useState('');
  const [tab, setTab]             = useState('paysage');

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', '1');
      setAuth(true);
    } else {
      setAuthError('Mot de passe incorrect');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_auth');
    setAuth(false);
  };

  const TABS = [
    { key: 'paysage',     label: 'Galerie Paysage' },
    { key: 'sous_marine', label: 'Galerie Sous-marine' },
    { key: 'reseaux',     label: 'Réseaux' },
  ];

  /* ── Fond commun (login + app) ── */
  const BG = (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-hero-ocean" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#060d1a]/80 to-[#060d1a]/95" />
    </div>
  );

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
              <div className="w-9 h-9 rounded-full bg-astroide/20 border border-astroide/30 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-astroide" />
              </div>
              <h1 className="text-white font-bold text-lg">Backoffice — Dark Massilia</h1>
            </div>
            <p className="text-white/30 text-xs mb-6 ml-12">Administration sécurisée</p>
            <div className="relative mb-3">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="Mot de passe"
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-11 text-white placeholder-white/30 focus:outline-none focus:border-astroide/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}
            <button
              type="button"
              onClick={login}
              className="w-full font-semibold py-3 rounded-lg transition-colors text-white"
              style={{ background: 'linear-gradient(135deg, #FF7F00, #FF5E00)' }}
            >
              Connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      {BG}
      {/* Header */}
      <header className="relative z-10 sticky top-0 border-b border-white/8 px-4 py-3" style={{ background: 'rgba(6,13,26,0.92)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <h1 className="font-bold text-astroide mr-auto tracking-wide">Backoffice — Dark Massilia</h1>

          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  tab === key
                    ? 'text-black font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
                style={tab === key ? { background: 'linear-gradient(135deg, #FF7F00, #FF5E00)' } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {tab === 'paysage'     && <TabGalerie tableName="photos_paysage" />}
        {tab === 'sous_marine' && <TabGalerie tableName="photos_sous_marine" />}
        {tab === 'reseaux'     && <TabReseaux />}
      </main>

      {/* ── Bouton retour en haut ── */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Retour en haut"
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #FF7F00, #FF5E00)' }}
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
