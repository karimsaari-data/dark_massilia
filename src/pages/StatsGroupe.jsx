/**
 * StatsGroupe — Statistiques du Groupe Facebook "Amoureux des Calanques"
 * Route : /stats-groupe-facebook
 *
 * Données : table Supabase `facebook_group_insights`
 * Import  : node scripts/import-facebook-insights.js
 */

import { useEffect, useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt  = n => n?.toLocaleString('fr-FR') ?? '—';
const fmtK = n => n >= 1000 ? `${(n / 1000).toFixed(1).replace('.', ',')}K` : String(n);

const FADE = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ── Tooltip personnalisé ──────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 border border-white/10 text-sm">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name} : {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

// ── KPI card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, color = 'text-white' }) => (
  <div className="glass-strong rounded-2xl p-6 border border-white/10 flex flex-col gap-2">
    <p className="text-xs text-gray-400 uppercase tracking-widest">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-500">{sub}</p>}
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
export default function StatsGroupe() {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [window28, setWindow28] = useState(28); // nb jours affichés

  useEffect(() => {
    supabase
      .from('facebook_group_insights')
      .select('date, participants, active_members, views, publications, comments, reactions')
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setRows(data);
        setLoading(false);
      });
  }, []);

  // ── Métriques globales ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!rows.length) return null;
    const totalViews     = rows.reduce((s, r) => s + r.views, 0);
    const totalReactions = rows.reduce((s, r) => s + r.reactions, 0);
    const avgViews       = Math.round(totalViews / rows.length);
    const peak           = rows.reduce((b, r) => r.views > b.views ? r : b, rows[0]);
    const last28         = rows.slice(-28);
    const views28        = last28.reduce((s, r) => s + r.views, 0);
    const reactions28    = last28.reduce((s, r) => s + r.reactions, 0);
    const active28       = last28.reduce((s, r) => s + r.active_members, 0);
    return { totalViews, totalReactions, avgViews, peak, views28, reactions28, active28, last28 };
  }, [rows]);

  // ── Données graphiques ─────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const slice = rows.slice(-window28);
    return slice.map(r => ({
      ...r,
      label: r.date.slice(5), // MM-DD
    }));
  }, [rows, window28]);

  return (
    <>
      <SEO pageKey="/stats-groupe-facebook" />

      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner" />
        </div>
      )}
      {!loading && <>

      <div className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* ── En-tête ── */}
          <motion.div initial="hidden" animate="visible" variants={FADE}>
            <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-2">
              Groupe Facebook · Amoureux des Calanques
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Statistiques de la communauté
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Données issues des exports Facebook Admin — mise à jour manuelle.
              {rows.length > 0 && (
                <> Période couverte : <span className="text-white">{rows[0].date}</span> → <span className="text-white">{rows[rows.length - 1].date}</span> ({rows.length} jours).</>
              )}
            </p>
          </motion.div>

          {/* ── KPIs globaux ── */}
          {stats && (
            <motion.div
              initial="hidden" animate="visible" variants={FADE}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <KpiCard
                label="Vues totales"
                value={fmt(stats.totalViews)}
                sub={`moy. ${fmt(stats.avgViews)} / jour`}
                color="text-ocean-teal"
              />
              <KpiCard
                label="Vues — 28 derniers jours"
                value={fmt(stats.views28)}
                sub={`${fmt(Math.round(stats.views28 / 28))} / jour en moy.`}
                color="text-blue-300"
              />
              <KpiCard
                label="Membres actifs — 28j"
                value={fmt(stats.active28)}
                sub="ayant publié ou commenté"
                color="text-emerald-400"
              />
              <KpiCard
                label="Pic de vues"
                value={fmtK(stats.peak.views)}
                sub={stats.peak.date}
                color="text-astroide"
              />
            </motion.div>
          )}

          {/* ── Sélecteur période ── */}
          <div className="flex gap-2">
            {[28, 60, 90, rows.length].map(n => (
              <button
                key={n}
                onClick={() => setWindow28(n)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  window28 === n
                    ? 'bg-ocean-teal text-black'
                    : 'glass border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {n === rows.length ? 'Tout' : `${n}j`}
              </button>
            ))}
          </div>

          {/* ── Graphique vues ── */}
          <motion.div
            initial="hidden" animate="visible" variants={FADE}
            className="glass-strong rounded-2xl border border-white/10 p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">
              Personnes ayant vu — {window28 === rows.length ? 'toute la période' : `${window28} derniers jours`}
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00ABA8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00ABA8" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={fmtK} />
                <Tooltip content={<CustomTooltip />} />
                {stats?.peak && window28 >= rows.length && (
                  <ReferenceLine x={stats.peak.date.slice(5)} stroke="#f97316" strokeDasharray="4 2" label={{ value: 'Pic', fill: '#f97316', fontSize: 11 }} />
                )}
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Vues"
                  stroke="#00ABA8"
                  strokeWidth={2}
                  fill="url(#gradViews)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#00ABA8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* ── Graphique engagement (réactions + commentaires) ── */}
          <motion.div
            initial="hidden" animate="visible" variants={FADE}
            className="glass-strong rounded-2xl border border-white/10 p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Engagement — réactions & commentaires</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="reactions" name="Réactions" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="comments"  name="Commentaires" fill="#6366f1" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* ── Tableau derniers 28 jours ── */}
          <motion.div
            initial="hidden" animate="visible" variants={FADE}
            className="glass-strong rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Détail journalier — 28 derniers jours</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-white/10">
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-right px-4 py-3">Vues</th>
                    <th className="text-right px-4 py-3">Actifs</th>
                    <th className="text-right px-4 py-3">Publications</th>
                    <th className="text-right px-4 py-3">Commentaires</th>
                    <th className="text-right px-6 py-3">Réactions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(-28).reverse().map((r, i) => (
                    <tr key={r.date} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === 0 ? 'text-white' : 'text-gray-300'}`}>
                      <td className="px-6 py-3 font-medium">{r.date}</td>
                      <td className="text-right px-4 py-3 text-ocean-teal font-semibold">{fmt(r.views)}</td>
                      <td className="text-right px-4 py-3">{fmt(r.active_members)}</td>
                      <td className="text-right px-4 py-3">{fmt(r.publications)}</td>
                      <td className="text-right px-4 py-3">{fmt(r.comments)}</td>
                      <td className="text-right px-6 py-3 text-amber-400">{fmt(r.reactions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
      </>}
    </>
  );
}
