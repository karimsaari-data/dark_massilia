import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import { MapPin, Trash2, Plus, Eye, Lock, LogOut } from 'lucide-react';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'darkm';
const MARSEILLE = [43.2965, 5.3698];

const landscapeIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background:#21c47b;border:2px solid white;border-radius:50%;box-shadow:0 0 8px rgba(33,196,123,0.8)"></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

const wasteIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background:#ef4444;border:2px solid white;border-radius:50%;box-shadow:0 0 8px rgba(239,68,68,0.8)"></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

const pendingPinIcon = L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background:#f59e0b;border:3px solid white;border-radius:50%;box-shadow:0 0 12px rgba(245,158,11,0.9);animation:pulse 1s infinite"></div>`,
  iconSize: [24, 24], iconAnchor: [12, 12],
});

function ClickMarker({ onPlacePin, pendingPin }) {
  useMapEvents({
    click(e) {
      onPlacePin({ lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
    },
  });
  return pendingPin
    ? <Marker position={[pendingPin.lat, pendingPin.lng]} icon={pendingPinIcon} />
    : null;
}

const EMPTY_FORM = { title: '', description: '', type: 'landscape', lat: '', lng: '', photo_url: '' };

export default function AdminCarte() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('admin_auth') === '1');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingPin, setPendingPin] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      setAuth(true);
    } else {
      setAuthError('Mot de passe incorrect');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_auth');
    setAuth(false);
  }

  async function fetchEntries() {
    setLoading(true);
    const { data } = await supabase
      .from('map_photos')
      .select('*')
      .order('created_at', { ascending: false });
    setEntries(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (auth) fetchEntries();
  }, [auth]);

  function handlePlacePin(latlng) {
    setPendingPin(latlng);
    setForm(f => ({ ...f, lat: latlng.lat, lng: latlng.lng }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setErrorMsg('Le titre est obligatoire'); return; }
    if (!form.lat || !form.lng) { setErrorMsg('Clique sur la carte pour placer un pin'); return; }

    setSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase.from('map_photos').insert([{
      title: form.title.trim(),
      description: form.description.trim() || null,
      type: form.type,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      photo_url: form.photo_url.trim() || null,
    }]);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('✓ Site ajouté avec succès');
      setForm(EMPTY_FORM);
      setPendingPin(null);
      fetchEntries();
      setTimeout(() => setSuccessMsg(''), 3000);
    }
    setSubmitting(false);
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Supprimer "${title}" ?`)) return;
    const { error } = await supabase.from('map_photos').delete().eq('id', id);
    if (!error) fetchEntries();
  }

  // ── Gate login ────────────────────────────────────────────────────────────
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080d1a]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 p-8 rounded-2xl border border-white/10"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-ocean-teal/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-ocean-teal" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin — Carte des Sites</h1>
              <p className="text-xs text-text-muted">Dark Massilia</p>
            </div>
          </div>

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-ocean-teal/50 transition-colors"
            autoFocus
          />
          {authError && <p className="text-red-400 text-sm">{authError}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #21c47b, #0091ff)' }}
          >
            Accéder
          </button>
        </form>
      </div>
    );
  }

  // ── Admin UI ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      {/* Top bar */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-ocean-teal" />
          <span className="font-semibold text-white">Admin — Carte des Sites</span>
          <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-full">
            {entries.length} site{entries.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/carte"
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-ocean-teal transition-colors"
          >
            <Eye className="w-4 h-4" /> Voir la carte
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Colonne gauche : Carte + Formulaire ── */}
          <div className="lg:col-span-3 space-y-4">
            {/* Instructions */}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">1</span>
              Clique sur la carte pour placer un pin (point jaune)
            </div>

            {/* Carte Leaflet */}
            <div className="rounded-2xl overflow-hidden border border-white/8" style={{ height: '380px' }}>
              <MapContainer center={MARSEILLE} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickMarker onPlacePin={handlePlacePin} pendingPin={pendingPin} />
                {entries.map(entry => (
                  <Marker
                    key={entry.id}
                    position={[entry.lat, entry.lng]}
                    icon={entry.type === 'landscape' ? landscapeIcon : wasteIcon}
                    opacity={0.6}
                  />
                ))}
              </MapContainer>
            </div>

            {/* Instructions step 2 */}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="w-5 h-5 rounded-full bg-ocean-teal/20 flex items-center justify-center text-ocean-teal text-xs font-bold flex-shrink-0">2</span>
              Remplis le formulaire et valide
            </div>

            {/* Formulaire */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-5 space-y-3 border border-white/8"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {/* Coordonnées */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Latitude</label>
                  <input
                    type="text"
                    value={form.lat}
                    onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                    placeholder="43.2965"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:border-ocean-teal/50 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Longitude</label>
                  <input
                    type="text"
                    value={form.lng}
                    onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
                    placeholder="5.3698"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:border-ocean-teal/50 font-mono"
                  />
                </div>
              </div>

              {/* Titre */}
              <div>
                <label className="text-xs text-text-muted mb-1 block">Titre *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: Calanque de Sormiou"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:border-ocean-teal/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-text-muted mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Site de plongée, mission de dépollution..."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:border-ocean-teal/50 resize-none"
                />
              </div>

              {/* URL Photo */}
              <div>
                <label className="text-xs text-text-muted mb-1 block">URL Photo (optionnel)</label>
                <input
                  type="url"
                  value={form.photo_url}
                  onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-text-muted focus:outline-none focus:border-ocean-teal/50"
                />
              </div>

              {/* Type */}
              <div className="flex gap-6">
                {[
                  { value: 'landscape', label: '🟢 Paysage / Faune' },
                  { value: 'waste', label: '🔴 Pollution / Déchet' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={value}
                      checked={form.type === value}
                      onChange={() => setForm(f => ({ ...f, type: value }))}
                      className="accent-ocean-teal"
                    />
                    <span className="text-sm text-text-secondary">{label}</span>
                  </label>
                ))}
              </div>

              {/* Feedback */}
              {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
              {successMsg && <p className="text-green-400 text-sm font-medium">{successMsg}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !form.lat}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                style={{ background: 'linear-gradient(135deg, #21c47b, #0091ff)' }}
              >
                <Plus className="w-4 h-4" />
                {submitting ? 'Ajout en cours...' : 'Ajouter ce site'}
              </button>
            </form>
          </div>

          {/* ── Colonne droite : Liste des entrées ── */}
          <div className="lg:col-span-2">
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              Sites enregistrés
              <span className="text-xs font-normal text-text-muted bg-white/5 px-2 py-0.5 rounded-full">
                {entries.length}
              </span>
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-ocean-teal/30 border-t-ocean-teal rounded-full animate-spin" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-sm">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-20" />
                Aucun site enregistré.<br />Clique sur la carte pour commencer.
              </div>
            ) : (
              <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
                {entries.map(entry => (
                  <div
                    key={entry.id}
                    className="rounded-xl p-3.5 flex items-start justify-between gap-3 border border-white/5 hover:border-white/10 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{entry.type === 'landscape' ? '🟢' : '🔴'}</span>
                        <span className="font-medium text-white text-sm truncate">{entry.title}</span>
                      </div>
                      {entry.description && (
                        <p className="text-xs text-text-muted line-clamp-1">{entry.description}</p>
                      )}
                      <p className="text-xs text-text-muted/60 mt-1 font-mono">
                        {entry.lat}, {entry.lng}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id, entry.title)}
                      className="flex-shrink-0 p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
