import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { supabase } from '../lib/supabase';
import {
  Lock, LogOut, Search, Save, Eye, EyeOff,
  ChevronDown, ChevronUp, MapPin, ExternalLink, ArrowUp, X, Upload, Rss, Trash2, Download,
  FileText, Bell, BellOff, AlertCircle, CheckCircle, XCircle, RefreshCw, Clock,
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


/* ── Modal import photos ────────────────────────────────────── */
const INBOX_FOLDERS = [
  'public/images/portfolio/New/photos_paysages/Mer/',
  'public/images/portfolio/New/photos_paysages/Terre/',
  'public/images/portfolio/New/photos_paysages/Horizons/',
  'public/images/portfolio/New/photos_sous_marine/Dépollution/',
  'public/images/portfolio/New/photos_sous_marine/Biodiversité/',
  'public/images/portfolio/New/photos_sous_marine/Caractérisation/',
];

const ImportModal = ({ onClose, onDone }) => {
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [logs, setLogs] = useState('');

  const runImport = async () => {
    setStatus('running');
    setLogs('');
    try {
      const res = await fetch('/api/import-photos', { method: 'POST' });
      const data = await res.json();
      setLogs(data.logs || '');
      setStatus(data.success ? 'done' : 'error');
      if (data.success) onDone?.();
    } catch (e) {
      setLogs("Erreur : impossible de contacter /api/import-photos\n(le serveur de dev doit être actif)");
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 p-6 space-y-4"
        style={{ background: 'rgba(6,13,26,0.97)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#21c47b]" />
            Importer de nouvelles photos
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {status === 'idle' && (
          <div className="space-y-3">
            <p className="text-sm text-white/50">Dépose tes fichiers dans le bon dossier, puis lance l'import :</p>
            <ul className="space-y-1">
              {INBOX_FOLDERS.map(f => (
                <li key={f} className="text-xs font-mono text-[#21c47b]/70 bg-white/3 rounded px-3 py-1.5 border border-white/5">{f}</li>
              ))}
            </ul>
            <p className="text-xs text-white/30">Le script convertit en WebP, crée les entrées Supabase (visible=false) et déplace les originaux dans <code className="text-white/50">done/</code>.</p>
          </div>
        )}

        {status === 'running' && (
          <div className="flex items-center gap-3 py-4 text-white/60">
            <div className="w-5 h-5 border-2 border-[#21c47b] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            Import en cours…
          </div>
        )}

        {(status === 'done' || status === 'error') && logs && (
          <pre className={`text-xs rounded-xl p-4 overflow-auto max-h-64 border whitespace-pre-wrap ${
            status === 'done' ? 'bg-[#21c47b]/5 border-[#21c47b]/20 text-[#21c47b]/80' : 'bg-red-500/5 border-red-500/20 text-red-400/80'
          }`}>{logs}</pre>
        )}

        <div className="flex gap-2 pt-1">
          {status === 'idle' && (
            <button type="button" onClick={runImport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #21c47b, #1aaa6a)' }}
            >
              <Upload className="w-4 h-4" />
              Lancer l'import
            </button>
          )}
          {status === 'done' && (
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-black"
              style={{ background: 'linear-gradient(135deg, #21c47b, #1aaa6a)' }}
            >
              Fermer — voir les nouvelles photos dans "Incomplet"
            </button>
          )}
          {status === 'error' && (
            <button type="button" onClick={runImport}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/15 transition-colors"
            >
              Réessayer
            </button>
          )}
          {status !== 'idle' && status !== 'running' && (
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
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
const PhotoRow = ({ photo, onSave, onToggleVisible, onPreview, onDelete, showCategorie, categorieOptions }) => {
  const [draft, setDraft]       = useState({ title: photo.title, alt: photo.alt, lieu: photo.lieu, lat: photo.lat ?? null, lng: photo.lng ?? null, categorie: photo.categorie ?? null });
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);

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

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer "${photo.title || photo.uid}" ?\n\nCette action supprime la photo de la base et le fichier image.`)) return;
    setDeleting(true);
    await supabase.from(photo._table || 'photos_paysage').delete().eq('id', photo.id);
    try {
      await fetch('/api/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: photo.src }),
      });
    } catch { /* en prod, le fichier reste — pas grave */ }
    onDelete(photo.id);
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${expanded ? 'border-white/20 bg-white/5' : 'border-white/8 hover:border-white/15'}`}>
      <button type="button" className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setExpanded(e => !e)}>
        <div
          className="relative w-48 h-32 flex-shrink-0 cursor-zoom-in group"
          onClick={e => { e.stopPropagation(); onPreview(photo); }}
        >
          <img
            src={photo.src}
            alt=""
            className={`w-full h-full object-cover rounded-lg bg-white/5 group-hover:brightness-75 transition-all ${imgBroken ? 'opacity-0' : ''}`}
            loading="lazy"
            onError={() => setImgBroken(true)}
          />
          {imgBroken && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 gap-1.5 pointer-events-none">
              <span className="text-lg">⚠️</span>
              <span className="text-[10px] font-semibold text-red-400 text-center px-1 leading-tight">image manquante</span>
            </div>
          )}
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
                className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#21c47b]/60 transition-colors"
                style={{ backgroundColor: '#1a1f2e', colorScheme: 'dark' }}
              >
                <option value="" style={{ backgroundColor: '#1a1f2e', color: '#fff' }}>— Non classée —</option>
                {categorieOptions.map(({ value, label }) => (
                  <option key={value} value={value} style={{ backgroundColor: '#1a1f2e', color: '#fff' }}>{label}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Chemin fichier</label>
            <p className="text-xs font-mono text-white/30 bg-white/3 rounded-lg px-3 py-2 border border-white/5 break-all select-all">{photo.src}</p>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Suppression…' : 'Supprimer'}
            </button>
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
  const [hiddenOnly,     setHiddenOnly]     = useState(false);
  const [noTitleOnly,    setNoTitleOnly]    = useState(false);
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
    if (hiddenOnly && p.visible !== false) return false;
    if (noTitleOnly && p.title) return false;
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
    <div className="space-y-3">
      {/* Ligne 1 : recherche + catégories */}
      <div className="flex gap-3 flex-wrap items-center">
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
            {[
              { key: 'all',      label: 'Tout' },
              { key: 'mer',      label: 'Littoral' },
              { key: 'terre',    label: 'Provence' },
              { key: 'horizons', label: 'Horizons' },
            ].map(({ key, label }) => (
              <button key={key} type="button" onClick={() => setCatFilter(key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${catFilter === key ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'}`}
              >{label}</button>
            ))}
          </div>
        )}
        {isSousMarine && (
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {[{ key: 'all', label: 'Tout' }, { key: 'depollution', label: 'Dépollution' }, { key: 'biodiversite', label: 'Biodiversité' }, { key: 'caracterisation', label: 'Caractérisation' }].map(({ key, label }) => (
              <button key={key} type="button" onClick={() => setCatFilter(key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${catFilter === key ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'}`}
              >{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Ligne 2 : filtres statut + compteur */}
      <div className="flex gap-2 flex-wrap items-center">
        <button type="button" onClick={() => setIncompleteOnly(v => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            incompleteOnly ? 'bg-orange-500/20 border border-orange-500/50 text-orange-300' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
          }`}
        >
          ⚠ Incomplet {incompleteOnly && `(${filtered.length})`}
        </button>
        <button type="button" onClick={() => setHiddenOnly(v => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            hiddenOnly ? 'bg-white/15 border border-white/30 text-white' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5" />
          Masquées {hiddenOnly && `(${filtered.length})`}
        </button>
        <button type="button" onClick={() => setNoTitleOnly(v => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            noTitleOnly ? 'bg-blue-500/20 border border-blue/50 text-blue-300' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
          }`}
        >
          Sans titre {noTitleOnly && `(${filtered.length})`}
        </button>
        <span className="ml-auto text-xs text-white/30">{loading ? 'Chargement…' : `${filtered.length} photo${filtered.length > 1 ? 's' : ''}`}</span>
      </div>

      {loadError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
          Erreur Supabase : {loadError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#21c47b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (() => {
        const catOptions = isSousMarine
          ? [{ value: 'depollution', label: 'Dépollution' }, { value: 'biodiversite', label: 'Biodiversité' }, { value: 'caracterisation', label: 'Caractérisation' }]
          : [{ value: 'mer', label: 'Littoral Marseillais & Calanques' }, { value: 'terre', label: 'Terres de Provence & Camargue' }, { value: 'horizons', label: 'Explorations & Horizons Lointains' }];

        const handleDelete = (id) => setPhotos(prev => prev.filter(p => p.id !== id));

        const renderRow = (photo) => (
          <PhotoRow
            key={photo.id}
            photo={{ ...photo, _table: tableName }}
            onSave={handleSave}
            onToggleVisible={handleToggleVisible}
            onPreview={setPreview}
            onDelete={handleDelete}
            showCategorie={isPaysage || isSousMarine}
            categorieOptions={catOptions}
          />
        );

        if (catFilter !== 'all' || !(isPaysage || isSousMarine)) {
          return (
            <div className="space-y-2">
              {filtered.map(renderRow)}
              {filtered.length === 0 && <p className="text-center text-white/30 py-12">Aucune photo trouvée</p>}
            </div>
          );
        }

        // Groupé par catégorie
        const groups = catOptions.map(({ value, label }) => ({
          value,
          label,
          photos: filtered.filter(p => p.categorie === value),
        }));
        const uncategorized = filtered.filter(p => !p.categorie || !catOptions.find(c => c.value === p.categorie));

        return (
          <div className="space-y-8">
            {groups.map(({ value, label, photos: groupPhotos }) => (
              <div key={value}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">{label}</h3>
                  <span className="text-xs text-white/30 bg-white/5 rounded-full px-2 py-0.5">{groupPhotos.length}</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>
                {groupPhotos.length > 0
                  ? <div className="space-y-2">{groupPhotos.map(renderRow)}</div>
                  : <p className="text-xs text-white/20 italic pl-1">Aucune photo dans cette catégorie</p>
                }
              </div>
            ))}
            {uncategorized.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Non classées</h3>
                  <span className="text-xs text-white/30 bg-white/5 rounded-full px-2 py-0.5">{uncategorized.length}</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>
                <div className="space-y-2">{uncategorized.map(renderRow)}</div>
              </div>
            )}
            {filtered.length === 0 && <p className="text-center text-white/30 py-12">Aucune photo trouvée</p>}
          </div>
        );
      })()}
      {preview && <PhotoPreviewModal photo={preview} onClose={() => setPreview(null)} />}
    </div>
  );
};

/* ── Métadonnées plateformes ────────────────────────────────── */
const PLATFORM_META = {
  facebook_group:            { label: 'Facebook — Amoureux des Calanques', unit: 'membres' },
  instagram:                 { label: 'Instagram',                          unit: 'abonnés' },
  tiktok:                    { label: 'TikTok',                             unit: 'abonnés' },
  facebook_pages:            { label: 'Facebook — Pages (pro & perso)',     unit: 'K abonnés' },
  youtube:                   { label: 'YouTube',                            unit: 'abonnés' },
  facebook_perso:            { label: 'Facebook Perso',                     unit: 'abonnés' },
  facebook_page:             { label: 'Facebook Page — Dark Massilia',      unit: 'abonnés' },
  pinterest:                 { label: 'Pinterest',                          unit: 'abonnés' },
  x:                         { label: 'X / Twitter',                        unit: 'abonnés' },
  local_guides:              { label: 'Local Guides — Card Communauté (vues)', unit: 'M vues' },
  local_guide_contributions: { label: 'Local Guide — Contributions',           unit: 'contributions' },
  local_guide_points:        { label: 'Local Guide — Points',                  unit: 'pts' },
  local_guide_views_m:       { label: 'Local Guide — Vues générées (Home)',    unit: 'millions' },
  local_guide_level:         { label: 'Local Guide — Niveau',                  unit: 'niveau' },
  '500px_impressions':       { label: '500px — Impressions photos',         unit: 'K impressions' },
};

/* ── Tab Blog ────────────────────────────────────────────────── */
const blogFmtDate = (iso, opts = {}) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', ...opts }); }
  catch { return '—'; }
};
const blogFmtLong = iso => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch { return '—'; }
};
const blogDecode = s => s
  .replace(/&rsquo;/g, ''').replace(/&lsquo;/g, ''').replace(/&hellip;/g, '…')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
  .replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const blogStrip = h => h.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const BlogStatCard = ({ icon: Icon, value, label, accent }) => (
  <div className="rounded-2xl border border-white/10 p-5 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}22`, border: `1px solid ${accent}40` }}>
      <Icon className="w-5 h-5" style={{ color: accent }} />
    </div>
    <div>
      <p className="text-2xl font-bold text-white leading-none">{value ?? '—'}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
    </div>
  </div>
);

const BlogArticleRow = ({ article, onNotify, onUnnotify }) => {
  const [loading, setLoading] = useState(false);
  const act = async fn => { setLoading(true); await fn(); setLoading(false); };
  return (
    <tr className="border-t border-white/5 hover:bg-white/[0.03] transition-colors">
      <td className="px-3 py-3 w-14">
        {article.image
          ? <img src={article.image} alt="" className="w-11 h-11 object-cover rounded-lg bg-white/5" loading="lazy" onError={e => { e.target.style.display = 'none'; }} />
          : <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center"><FileText className="w-4 h-4 text-white/20" /></div>}
      </td>
      <td className="px-3 py-3 min-w-0">
        <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-[#21c47b] transition-colors line-clamp-2 leading-snug block">
          {article.title || article.slug}
        </a>
        <p className="text-[11px] text-white/30 font-mono mt-0.5 truncate">{article.slug}</p>
      </td>
      <td className="px-3 py-3 text-sm text-white/60 whitespace-nowrap hidden sm:table-cell">{blogFmtLong(article.date)}</td>
      <td className="px-3 py-3 text-xs text-white/40 whitespace-nowrap hidden md:table-cell">{blogFmtDate(article.modified)}</td>
      <td className="px-3 py-3 whitespace-nowrap">
        {article.notified_at
          ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#21c47b]/15 text-[#21c47b] border border-[#21c47b]/30"><CheckCircle className="w-3 h-3" />{blogFmtDate(article.notified_at)}</span>
          : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400 border border-orange-500/30"><AlertCircle className="w-3 h-3" />À notifier</span>}
      </td>
      <td className="px-3 py-3 text-xs text-white/30 whitespace-nowrap hidden lg:table-cell">{blogFmtDate(article.synced_at)}</td>
      <td className="px-3 py-3 whitespace-nowrap">
        {article.notified_at
          ? <button type="button" disabled={loading} onClick={() => act(() => onUnnotify(article.slug))} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50">
              {loading ? <span className="w-3 h-3 border border-white/30 border-t-transparent rounded-full animate-spin" /> : <XCircle className="w-3 h-3" />}Annuler
            </button>
          : <button type="button" disabled={loading} onClick={() => act(() => onNotify(article.slug))} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-black disabled:opacity-50 transition-opacity hover:opacity-90" style={{ background: 'linear-gradient(135deg,#21c47b,#1aaa6a)' }}>
              {loading ? <span className="w-3 h-3 border border-black/30 border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-3 h-3" />}Notifier
            </button>}
      </td>
    </tr>
  );
};

const TabBlog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id,wp_id,slug,title,date,modified,image,notified_at,synced_at')
      .order('date', { ascending: false });
    if (error) addToast('Erreur chargement articles', 'error');
    else setArticles(data || []);
    setLoading(false);
  }, [addToast]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const stats = useMemo(() => {
    const total = articles.length;
    const notified = articles.filter(a => a.notified_at).length;
    const lastSync = articles.reduce((m, a) => (!a.synced_at ? m : (!m || a.synced_at > m ? a.synced_at : m)), null);
    return { total, notified, pending: total - notified, lastSync };
  }, [articles]);

  const filtered = useMemo(() => {
    let list = articles;
    if (filter === 'pending') list = list.filter(a => !a.notified_at);
    if (filter === 'notified') list = list.filter(a => a.notified_at);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(a => (a.title || '').toLowerCase().includes(q) || (a.slug || '').toLowerCase().includes(q)); }
    return list;
  }, [articles, filter, search]);

  const handleNotify = useCallback(async slug => {
    const { error } = await supabase.from('blog_posts').update({ notified_at: new Date().toISOString() }).eq('slug', slug);
    error ? addToast(`Erreur : ${error.message}`, 'error') : addToast('Marqué comme notifié ✓');
    await fetchArticles();
  }, [addToast, fetchArticles]);

  const handleUnnotify = useCallback(async slug => {
    const { error } = await supabase.from('blog_posts').update({ notified_at: null }).eq('slug', slug);
    error ? addToast(`Erreur : ${error.message}`, 'error') : addToast('Notification annulée');
    await fetchArticles();
  }, [addToast, fetchArticles]);

  const handleSync = async () => {
    setSyncing(true); setSyncMsg('Connexion à WordPress…');
    try {
      const WP = 'https://cms.karimsaari.com/wp-json/wp/v2/posts';
      const allPosts = []; let page = 1, totalPages = 1;
      do {
        setSyncMsg(`Page ${page}/${totalPages}…`);
        const res = await fetch(`${WP}?per_page=100&_embed&status=publish&page=${page}`, { signal: AbortSignal.timeout(20000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
        allPosts.push(...await res.json());
        page++;
      } while (page <= totalPages);
      setSyncMsg(`${allPosts.length} articles récupérés…`);
      const { data: existing } = await supabase.from('blog_posts').select('wp_id,notified_at');
      const notifiedMap = Object.fromEntries((existing || []).map(r => [r.wp_id, r.notified_at]));
      const rows = allPosts.map(p => {
        const media = p._embedded?.['wp:featuredmedia']?.[0];
        const og = media?.source_url || null;
        return {
          wp_id: p.id, slug: p.slug,
          title: blogDecode(p.title?.rendered || ''),
          excerpt: blogStrip(p.excerpt?.rendered || ''),
          date: p.date, modified: p.modified,
          date_formatted: new Date(p.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
          image_og: og, image: og ? og.replace(/\.(jpg|jpeg|png)(\?.*)?$/, '.webp') : null,
          image_alt: media?.alt_text || null,
          author: p._embedded?.author?.[0]?.name || 'Dark Massilia',
          synced_at: new Date().toISOString(),
          notified_at: notifiedMap[p.id] ?? null,
        };
      });
      const { error } = await supabase.from('blog_posts').upsert(rows, { onConflict: 'wp_id' });
      if (error) throw new Error(error.message);
      addToast(`${rows.length} articles synchronisés ✓`);
      await fetchArticles();
    } catch (err) {
      const isCors = err.name === 'TypeError' || /cors|failed to fetch|network/i.test(err.message || '');
      addToast(isCors ? 'WordPress inaccessible — lancez `npm run wp:sync` localement' : `Erreur : ${err.message}`, 'error');
    } finally { setSyncing(false); setSyncMsg(''); }
  };

  return (
    <div className="space-y-5">
      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${t.type === 'success' ? 'bg-[#21c47b]/15 border-[#21c47b]/40 text-[#21c47b]' : 'bg-red-500/15 border-red-500/40 text-red-400'}`}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BlogStatCard icon={FileText} value={stats.total} label="Total articles" accent="#0091ff" />
        <BlogStatCard icon={Bell} value={stats.notified} label="Notifiés" accent="#21c47b" />
        <BlogStatCard icon={BellOff} value={stats.pending} label="À notifier" accent="#f97316" />
        <BlogStatCard icon={Clock} value={stats.lastSync ? blogFmtDate(stats.lastSync) : '—'} label="Dernière sync" accent="#a78bfa" />
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row gap-3" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un titre ou slug…" className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#21c47b]/50 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {[['all','Tous'],['pending','À notifier'],['notified','Notifiés']].map(([k,l]) => (
              <button key={k} type="button" onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === k ? 'text-black' : 'text-white/50 hover:text-white'}`} style={filter === k ? { background: 'linear-gradient(135deg,#21c47b,#1aaa6a)' } : {}}>
                {l}
              </button>
            ))}
          </div>
          <button type="button" onClick={handleSync} disabled={syncing} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-black disabled:opacity-60 transition-opacity hover:opacity-90 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#21c47b,#1aaa6a)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? syncMsg || 'Sync…' : 'Sync WP'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-white/40">
            <span className="w-5 h-5 border-2 border-[#21c47b] border-t-transparent rounded-full animate-spin" />Chargement…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-white/30">
            <FileText className="w-8 h-8 opacity-40" />
            <p className="text-sm">{search || filter !== 'all' ? 'Aucun article trouvé' : 'Aucun article — lancez une synchronisation'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/40 uppercase tracking-wider">
                  <th className="px-3 py-3 text-left font-semibold w-14">Img</th>
                  <th className="px-3 py-3 text-left font-semibold">Titre / Slug</th>
                  <th className="px-3 py-3 text-left font-semibold hidden sm:table-cell">Publication</th>
                  <th className="px-3 py-3 text-left font-semibold hidden md:table-cell">Modifié</th>
                  <th className="px-3 py-3 text-left font-semibold">Notification</th>
                  <th className="px-3 py-3 text-left font-semibold hidden lg:table-cell">Sync</th>
                  <th className="px-3 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <BlogArticleRow key={a.id} article={a} onNotify={handleNotify} onUnnotify={handleUnnotify} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-white/5 text-xs text-white/30 flex items-center justify-between">
            <span>{filtered.length} article{filtered.length > 1 ? 's' : ''}</span>
            {(filter !== 'all' || search) && (
              <button type="button" onClick={() => { setFilter('all'); setSearch(''); }} className="text-[#21c47b]/60 hover:text-[#21c47b] transition-colors">Effacer les filtres</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Tab Stats FB ────────────────────────────────────────────── */
const fmt  = n => n?.toLocaleString('fr-FR') ?? '—';
const fmtK = n => n >= 1000 ? `${(n / 1000).toFixed(1).replace('.', ',')}K` : String(n);

const FbTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 border border-white/10 text-sm" style={{ background: 'rgba(10,20,44,0.95)' }}>
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name} : {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

const KpiCard = ({ label, value, sub, color = 'text-white' }) => (
  <div className="rounded-2xl p-5 border border-white/10 flex flex-col gap-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
    <p className="text-xs text-gray-400 uppercase tracking-widest">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-500">{sub}</p>}
  </div>
);

const TabStatsFB = () => {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [win,     setWin]     = useState(28);

  useEffect(() => {
    supabase
      .from('facebook_group_insights')
      .select('date, participants, active_members, views, publications, comments, reactions')
      .order('date', { ascending: true })
      .then(({ data }) => { if (data) setRows(data); setLoading(false); });
  }, []);

  const stats = useMemo(() => {
    if (!rows.length) return null;
    const totalViews  = rows.reduce((s, r) => s + r.views, 0);
    const avgViews    = Math.round(totalViews / rows.length);
    const peak        = rows.reduce((b, r) => r.views > b.views ? r : b, rows[0]);
    const last28      = rows.slice(-28);
    const views28     = last28.reduce((s, r) => s + r.views, 0);
    const active28    = last28.reduce((s, r) => s + r.active_members, 0);
    return { totalViews, avgViews, peak, views28, active28 };
  }, [rows]);

  const chartData = useMemo(() =>
    rows.slice(-win).map(r => ({ ...r, label: r.date.slice(5) })),
    [rows, win]);

  if (loading) return <div className="flex items-center justify-center py-24"><div className="spinner" /></div>;
  if (!rows.length) return (
    <div className="text-center py-24 text-gray-400">
      <p className="mb-2">Aucune donnée dans <code>facebook_group_insights</code>.</p>
      <p className="text-sm">Lance <code>node scripts/import-facebook-insights.js</code></p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/8 p-6 space-y-8" style={{ background: 'rgba(6,13,26,0.75)', backdropFilter: 'blur(12px)' }}>
      <div>
        <p className="text-xs text-gray-400 mb-1">
          Période : <span className="text-white">{rows[0].date}</span> → <span className="text-white">{rows[rows.length - 1].date}</span> ({rows.length} jours)
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Vues totales"       value={fmt(stats.totalViews)}  sub={`moy. ${fmt(stats.avgViews)} / j`}         color="text-ocean-teal" />
          <KpiCard label="Vues 28j"           value={fmt(stats.views28)}     sub={`${fmt(Math.round(stats.views28/28))} / j`} color="text-blue-300" />
          <KpiCard label="Membres actifs 28j" value={fmt(stats.active28)}    sub="ayant publié / commenté"                   color="text-emerald-400" />
          <KpiCard label="Pic de vues"        value={fmtK(stats.peak.views)} sub={stats.peak.date}                           color="text-astroide" />
        </div>
      )}

      <div className="flex gap-2">
        {[28, 60, 90, rows.length].map(n => (
          <button key={n} onClick={() => setWin(n)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              win === n ? 'bg-ocean-teal text-black border-ocean-teal' : 'border-white/10 text-gray-400 hover:text-white'
            }`}>
            {n === rows.length ? 'Tout' : `${n}j`}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-sm font-semibold text-white mb-4">Personnes ayant vu</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00ABA8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#00ABA8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={fmtK} />
            <Tooltip content={<FbTooltip />} />
            {stats?.peak && win >= rows.length && (
              <ReferenceLine x={stats.peak.date.slice(5)} stroke="#f97316" strokeDasharray="4 2" label={{ value: 'Pic', fill: '#f97316', fontSize: 11 }} />
            )}
            <Area type="monotone" dataKey="views" name="Vues" stroke="#00ABA8" strokeWidth={2} fill="url(#gV)" dot={false} activeDot={{ r: 4, fill: '#00ABA8' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-sm font-semibold text-white mb-4">Engagement — réactions & commentaires</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<FbTooltip />} />
            <Bar dataKey="reactions" name="Réactions"    fill="#f59e0b" radius={[2,2,0,0]} />
            <Bar dataKey="comments"  name="Commentaires" fill="#6366f1" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-sm font-semibold text-white px-5 py-4 border-b border-white/10">Détail — 28 derniers jours</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 uppercase tracking-widest border-b border-white/10">
                <th className="text-left px-5 py-2">Date</th>
                <th className="text-right px-4 py-2">Vues</th>
                <th className="text-right px-4 py-2">Actifs</th>
                <th className="text-right px-4 py-2">Publications</th>
                <th className="text-right px-4 py-2">Commentaires</th>
                <th className="text-right px-5 py-2">Réactions</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(-28).reverse().map((r, i) => (
                <tr key={r.date} className={`border-b border-white/5 hover:bg-white/5 ${i === 0 ? 'text-white' : 'text-gray-300'}`}>
                  <td className="px-5 py-2 font-medium">{r.date}</td>
                  <td className="text-right px-4 py-2 text-ocean-teal font-semibold">{fmt(r.views)}</td>
                  <td className="text-right px-4 py-2">{fmt(r.active_members)}</td>
                  <td className="text-right px-4 py-2">{fmt(r.publications)}</td>
                  <td className="text-right px-4 py-2">{fmt(r.comments)}</td>
                  <td className="text-right px-5 py-2 text-amber-400">{fmt(r.reactions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ── Composants utilitaires EXIF (module-level pour ExifRow) ── */
const ExifBadge = ({ ok, label }) => (
  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono ${
    ok === true  ? 'bg-[#21c47b]/15 text-[#21c47b]' :
    ok === false ? 'bg-red-500/15 text-red-400' :
                   'bg-white/5 text-white/30'
  }`}>
    {ok === true ? '✓' : ok === false ? '✗' : '—'} {label}
  </span>
);

const ExifDetailRow = ({ label, val, ok, dbVal, colSpan }) => (
  <div className={colSpan ? 'md:col-span-2' : ''}>
    <span className={`text-white/30 mr-2 ${dbVal ? 'text-[#21c47b]/50' : ''}`}>{label} :</span>
    {val != null && val !== ''
      ? <span className={ok === true ? 'text-[#21c47b]' : ok === false ? 'text-red-400' : 'text-white/70'}>{val}</span>
      : <span className="text-white/20 italic">vide</span>
    }
  </div>
);

/* ── Ligne EXIF avec détection image cassée ─────────────────── */
const ExifRow = ({ db, exif, c, isOpen, onToggle, onBroken, children }) => {
  const [imgBroken, setImgBroken] = useState(false);
  const filename = db.src.split('/').pop();
  // Miniature 800w : on insère /800w/ avant le nom de fichier
  const thumbSrc = db.src.replace(/\/([^/]+\.webp)$/, '/800w/$1');
  return (
    <div className={`border rounded-lg overflow-hidden ${
      imgBroken ? 'border-red-500/40 bg-red-500/5' :
      !exif ? 'border-red-500/20 bg-red-500/5' : isOpen ? 'border-[#21c47b]/40 bg-white/5' : 'border-white/8 bg-white/3'
    }`}>
      <div
        className="px-3 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        <div className="relative w-20 h-14 flex-shrink-0">
          <img
            src={thumbSrc}
            alt=""
            className={`w-20 h-14 rounded object-cover bg-white/5 ${imgBroken ? 'opacity-0' : ''}`}
            onError={() => { setImgBroken(true); onBroken?.(db.src); }}
          />
          {imgBroken && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded bg-red-500/15 border border-red-500/40 gap-0.5">
              <span className="text-sm">⚠️</span>
              <span className="text-[9px] font-semibold text-red-400 text-center leading-tight">image<br/>manquante</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/80 font-medium truncate">
            {db.title || <span className="text-white/30 italic">sans titre</span>}
          </p>
          <p className="text-xs text-white/25 font-mono truncate">{filename}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {imgBroken && <span className="text-[10px] font-semibold text-red-400 font-mono">fichier KO</span>}
          <ExifBadge ok={exif ? c.titleOk : null}                      label="titre" />
          <ExifBadge ok={c.gpsDb ? (exif ? c.gpsOk : null) : undefined} label="gps" />
          <ExifBadge ok={exif ? c.kwOk : null}                         label="kw" />
          {!exif && <span className="text-xs text-red-400 font-mono">non audité</span>}
          <span className="text-white/20 text-xs ml-1">{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>
      {children}
    </div>
  );
};

/* ── Tab Contrôle EXIF ─────────────────────────────────────── */
const TabExif = () => {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all'); // all | non_audit | title_ko | gps_ko | keywords_ko | fichier_ko
  const [expanded, setExpanded] = useState(null); // src de la ligne ouverte
  const [brokenSrcs, setBrokenSrcs] = useState(new Set());
  const handleBroken = useCallback((src) => {
    setBrokenSrcs(prev => { const next = new Set(prev); next.add(src); return next; });
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: paysage }, { data: sousMarine }, { data: exifData }] = await Promise.all([
        supabase.from('photos_paysage').select('src,title,lat,lng,lieu').eq('visible', true),
        supabase.from('photos_sous_marine').select('src,title,lat,lng,lieu').eq('visible', true),
        supabase.from('photos_exif').select('src,xmp_title,xmp_description,xmp_creator,xmp_rights,xmp_keywords,iptc_city,iptc_country,iptc_state,gps_lat,gps_lng,exif_artist,exif_copyright,file_exists,checked_at'),
      ]);
      const exifMap = new Map((exifData || []).map(e => [e.src, e]));
      const merged = [...(paysage || []), ...(sousMarine || [])].map(db => ({
        db,
        exif: exifMap.get(db.src) || null,
      }));
      setRows(merged);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const check = (db, exif) => ({
    titleOk: exif != null && db.title === exif.xmp_title,
    gpsDb:   db.lat != null,
    gpsOk:   db.lat != null && exif != null && Math.abs(db.lat - exif.gps_lat) < 0.001,
    kwOk:    exif != null && Array.isArray(exif.xmp_keywords) && exif.xmp_keywords.length > 0
             && new Set(exif.xmp_keywords).size === exif.xmp_keywords.length,
  });

  const stats = rows.reduce((acc, { db, exif }) => {
    const c = check(db, exif);
    acc.total++;
    if (c.titleOk)                      acc.titleOk++;
    if (c.gpsDb && c.gpsOk)             acc.gpsOk++;
    if (c.kwOk)                         acc.kwOk++;
    if (exif?.file_exists === false || brokenSrcs.has(db.src)) acc.fileKo++;
    return acc;
  }, { total: 0, titleOk: 0, gpsOk: 0, kwOk: 0, fileKo: 0 });

  const filtered = rows.filter(({ db, exif }) => {
    const c = check(db, exif);
    if (filter === 'non_audit')   return exif === null;
    if (filter === 'title_ko')    return exif != null && !c.titleOk;
    if (filter === 'gps_ko')      return exif != null && c.gpsDb && !c.gpsOk;
    if (filter === 'keywords_ko') return exif != null && !c.kwOk;
    if (filter === 'fichier_ko')  return exif?.file_exists === false || brokenSrcs.has(db.src);
    return true;
  });


  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#21c47b] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const gpsKoCount    = rows.filter(({ db, exif }) => { const c = check(db, exif); return exif != null && c.gpsDb && !c.gpsOk; }).length;
  const nonAuditCount = rows.filter(({ exif }) => exif === null).length;
  const fichierKoCount = rows.filter(({ db, exif }) => exif?.file_exists === false || brokenSrcs.has(db.src)).length;

  const FILTERS = [
    { key: 'all',         label: `Tout (${rows.length})` },
    { key: 'non_audit',   label: `Non audité (${nonAuditCount})` },
    { key: 'title_ko',    label: `Titre KO (${rows.filter(({ db, exif }) => exif != null && !check(db, exif).titleOk).length})` },
    { key: 'gps_ko',      label: `GPS KO (${gpsKoCount})` },
    { key: 'keywords_ko', label: `Keywords KO (${rows.filter(({ db, exif }) => exif != null && !check(db, exif).kwOk).length})` },
    { key: 'fichier_ko',  label: `Fichier KO (${fichierKoCount})`, danger: true },
  ];

  return (
    <div>
      {/* Rappel workflow */}
      <div className="mb-5 border border-amber-500/30 bg-amber-500/5 rounded-xl px-4 py-3 text-xs text-amber-300/80 font-mono">
        <span className="font-semibold text-amber-300">Workflow après modification GPS / titre / lieu en DB&nbsp;:</span>
        <br />
        <span className="select-all text-amber-200">node scripts/inject-exif.js &amp;&amp; node scripts/audit-exif.js</span>
        <span className="ml-3 text-amber-300/50">→ injecte les EXIF physiques puis met à jour cette table</span>
      </div>

      {/* Synthèse */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Titres OK',   val: stats.titleOk, total: stats.total, danger: false },
          { label: 'GPS OK',      val: stats.gpsOk,   total: stats.total, danger: false },
          { label: 'Keywords OK', val: stats.kwOk,    total: stats.total, danger: false },
          { label: 'Fichiers KO', val: stats.fileKo,  total: stats.total, danger: true  },
        ].map(({ label, val, total, danger }) => {
          const pct = total ? Math.round(val / total * 100) : 0;
          return (
            <div key={label} className={`border rounded-xl p-4 ${danger ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-white/3'}`}>
              <p className={`text-xs mb-1 ${danger ? 'text-red-400/70' : 'text-white/40'}`}>{label}</p>
              <p className={`text-2xl font-bold ${danger && val > 0 ? 'text-red-400' : 'text-white'}`}>
                {val}<span className="text-sm text-white/30">/{total}</span>
              </p>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${danger ? 'bg-red-500' : 'bg-[#21c47b]'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map(({ key, label, danger }) => (
          <button key={key} type="button" onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              filter === key
                ? danger
                  ? 'border-red-500/60 text-red-400 bg-red-500/10'
                  : 'border-[#21c47b]/60 text-[#21c47b] bg-[#21c47b]/10'
                : danger
                  ? 'border-red-500/30 text-red-400/60 hover:text-red-400 hover:border-red-500/50'
                  : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-1">
        {filtered.map(({ db, exif }) => {
          const c = check(db, exif);
          const isOpen = expanded === db.src;
          return (
            <ExifRow
              key={db.src}
              db={db}
              exif={exif}
              c={c}
              isOpen={isOpen}
              onToggle={() => setExpanded(isOpen ? null : db.src)}
              onBroken={handleBroken}
            >
              {/* Panneau de détail EXIF */}
              {isOpen && (
                <div className="border-t border-white/8 px-4 py-3 bg-black/20 text-xs font-mono">
                  {!exif ? (
                    <p className="text-red-400">Aucune entrée dans photos_exif — lance <code className="bg-white/10 px-1 rounded">node scripts/audit-exif.js</code></p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
                      {/* ── Titre ── */}
                      <ExifDetailRow label="DB title"        val={db.title}      dbVal ok={c.titleOk} />
                      <ExifDetailRow label="XMP title"        val={exif.xmp_title}       ok={c.titleOk} />
                      {/* ── Description ── */}
                      <ExifDetailRow label="XMP description"  val={exif.xmp_description} colSpan />
                      {/* ── GPS ── */}
                      <ExifDetailRow label="DB lat/lng"       val={db.lat != null ? `${db.lat}, ${db.lng}` : null} dbVal ok={c.gpsOk || !c.gpsDb} />
                      <ExifDetailRow label="EXIF lat/lng"     val={exif.gps_lat != null ? `${exif.gps_lat}, ${exif.gps_lng}` : null} ok={c.gpsOk || !c.gpsDb} />
                      {/* ── Lieu ── */}
                      <ExifDetailRow label="DB lieu"          val={db.lieu}       dbVal />
                      <ExifDetailRow label="IPTC city"        val={exif.iptc_city || null} />
                      <ExifDetailRow label="IPTC country"     val={exif.iptc_country || null} />
                      <ExifDetailRow label="IPTC state"       val={exif.iptc_state || null} />
                      {/* ── Keywords ── */}
                      <ExifDetailRow label="XMP keywords"     val={Array.isArray(exif.xmp_keywords) && exif.xmp_keywords.length ? exif.xmp_keywords.join(', ') : null} ok={c.kwOk} colSpan />
                      {/* ── Auteur / droits ── */}
                      <ExifDetailRow label="XMP creator"      val={exif.xmp_creator} />
                      <ExifDetailRow label="XMP rights"       val={exif.xmp_rights} />
                      <ExifDetailRow label="EXIF artist"      val={exif.exif_artist} />
                      <ExifDetailRow label="EXIF copyright"   val={exif.exif_copyright} />
                      {/* ── Fichier ── */}
                      <ExifDetailRow label="file_exists"      val={exif.file_exists === true ? 'oui' : exif.file_exists === false ? 'non ⚠️' : null} ok={exif.file_exists !== false} />
                      <ExifDetailRow label="Vérifié le"       val={exif.checked_at ? new Date(exif.checked_at).toLocaleString('fr-FR') : null} />
                    </div>
                  )}
                </div>
              )}
            </ExifRow>
          );
        })}
      </div>
    </div>
  );
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
  const [tab, setTab]               = useState('paysage');
  const [showImport, setShowImport] = useState(false);
  const [indexNowStatus, setIndexNowStatus] = useState('idle'); // idle | running | done | error

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
    { key: 'blog',        label: 'Blog' },
    { key: 'reseaux',     label: 'Réseaux' },
    { key: 'exif',        label: 'Contrôle EXIF' },
    { key: 'stats_fb',    label: 'Stats FB' },
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
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#21c47b] border border-[#21c47b]/30 hover:border-[#21c47b]/60 hover:bg-[#21c47b]/10 transition-colors"
            title="Importer de nouvelles photos"
          >
            <Upload className="w-3.5 h-3.5" />
            Importer
          </button>

          <button
            type="button"
            disabled={indexNowStatus === 'running'}
            onClick={async () => {
              setIndexNowStatus('running');
              try {
                const res = await fetch('/api/indexnow', { method: 'POST' });
                const data = await res.json();
                setIndexNowStatus(data.success ? 'done' : 'error');
              } catch {
                setIndexNowStatus('error');
              }
              setTimeout(() => setIndexNowStatus('idle'), 4000);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              indexNowStatus === 'running' ? 'text-white/30 border-white/10 cursor-wait' :
              indexNowStatus === 'done'    ? 'text-[#21c47b] border-[#21c47b]/60 bg-[#21c47b]/10' :
              indexNowStatus === 'error'   ? 'text-red-400 border-red-400/30' :
              'text-white/50 border-white/15 hover:text-white hover:border-white/30'
            }`}
            title="Soumettre les URLs à IndexNow (Bing)"
          >
            {indexNowStatus === 'running'
              ? <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
              : <Rss className="w-3.5 h-3.5" />
            }
            {indexNowStatus === 'done' ? 'Soumis ✓' : indexNowStatus === 'error' ? 'Erreur' : 'IndexNow'}
          </button>

          <button
            type="button"
            onClick={async () => {
              const tableName = tab === 'paysage' ? 'photos_paysage' : tab === 'sous_marine' ? 'photos_sous_marine' : null;
              if (!tableName) return;
              const { data } = await supabase.from(tableName).select('uid,src,title,alt,lieu,lat,lng,categorie,visible').order('uid');
              if (!data?.length) return;
              const cols = ['uid','src','title','alt','lieu','lat','lng','categorie','visible'];
              const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
              const csv = [cols.join(','), ...data.map(r => cols.map(c => escape(r[c])).join(','))].join('\n');
              const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `${tableName}_${new Date().toISOString().slice(0,10)}.csv`;
              a.click();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-colors"
            title="Exporter en CSV"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>

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
        {tab === 'blog'        && <TabBlog />}
        {tab === 'reseaux'     && <TabReseaux />}
        {tab === 'exif'        && <TabExif />}
        {tab === 'stats_fb'    && <TabStatsFB />}
      </main>

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onDone={() => { setShowImport(false); window.location.reload(); }}
        />
      )}

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
