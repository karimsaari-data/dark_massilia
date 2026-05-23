/**
 * AdminBlogSSR — version statique pour le prérendu SSR de /admin/blog
 * Affiche uniquement le formulaire de login (pas de sessionStorage, pas de Supabase)
 * Le client prend le relais avec AdminBlog.jsx complet via hydratation
 */
import { Lock } from 'lucide-react';

export default function AdminBlogSSR() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080d1a]">
      <div
        className="w-full max-w-sm space-y-4 p-8 rounded-2xl border border-white/10"
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(33,196,123,0.2)', border: '1px solid rgba(33,196,123,0.3)' }}
          >
            <Lock className="w-5 h-5 text-[#21c47b]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Admin Blog — Dark Massilia</h1>
            <p className="text-xs text-white/30 mt-0.5">Gestion des articles WordPress</p>
          </div>
        </div>
        <input
          type="password"
          placeholder="Mot de passe"
          disabled
          className="w-full rounded-xl px-4 py-3 text-white border border-white/10"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
        <button
          disabled
          className="w-full py-3 rounded-xl font-semibold text-black"
          style={{ background: 'linear-gradient(135deg, #21c47b, #1aaa6a)' }}
        >
          Connexion
        </button>
      </div>
    </div>
  );
}
