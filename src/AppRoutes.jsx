/**
 * AppRoutes — Routes React Router découplées du Router provider
 *
 * Utilisé par :
 *   - App.jsx (client) → wrappé dans <BrowserRouter>
 *   - entry-server.jsx (SSR prerender) → wrappé dans <StaticRouter>
 *
 * En mode SSR les imports sont eagerly chargés (pas de lazy).
 * En mode client ils restent lazy pour le code-splitting.
 */
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';

// Lazy-loaded pages — code splitting pour le client
const Blog       = lazy(() => import('./pages/Blog'));
const BlogPost   = lazy(() => import('./pages/BlogPost'));
const Missions   = lazy(() => import('./pages/Missions'));
const Medias     = lazy(() => import('./pages/Medias'));
const Photos     = lazy(() => import('./pages/Photos'));
const Videos     = lazy(() => import('./pages/Videos'));
const Instagram  = lazy(() => import('./pages/Instagram'));
const Twitter    = lazy(() => import('./pages/Twitter'));
const Contact    = lazy(() => import('./pages/Contact'));
const Arte       = lazy(() => import('./pages/Arte'));
const Meduses    = lazy(() => import('./pages/Meduses'));
const Sources    = lazy(() => import('./pages/Sources'));
const Carte      = lazy(() => import('./pages/Carte'));
const LocalGuide = lazy(() => import('./pages/LocalGuide'));
const Admin = lazy(() => import('./pages/AdminGalerie'));
const Yab             = lazy(() => import('./pages/Yab'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const Confidentialite    = lazy(() => import('./pages/Confidentialite'));
const PhotoSousMarine    = lazy(() => import('./pages/PhotoSousMarine'));
const PhotographeEnvironnemental = lazy(() => import('./pages/PhotographeEnvironnemental'));
const BlogCategory               = lazy(() => import('./pages/BlogCategory'));
const GroupeFacebook             = lazy(() => import('./pages/GroupeFacebook'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="spinner" />
  </div>
);

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="glass-strong rounded-3xl border border-white/10 p-12 md:p-16 max-w-lg w-full">
        <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-4">Erreur</p>
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-white font-semibold mb-3">Page introuvable</p>
        <p className="text-gray-400 mb-10 leading-relaxed">
          Cette page n'existe pas ou a été déplacée. Les fonds marins sont mieux cartographiés que ça.
        </p>
        <a href="/" className="btn-primary inline-flex items-center gap-2">
          ← Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Backoffice unifié */}
          <Route path="admin"         element={<Admin />} />
          <Route path="admin-galerie" element={<Navigate to="/admin" replace />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* Blog WordPress Headless */}
            <Route path="blog"                      element={<Blog />} />
            <Route path="blog/categorie/:slug"  element={<BlogCategory />} />
            <Route path="blog/:slug"            element={<BlogPost />} />
            <Route path="depollution-marine"              element={<Missions />} />
            <Route path="presse"                         element={<Medias />} />
            <Route path="photographie-paysage-mer"       element={<Photos />} />
            <Route path="photographie-sous-marine"       element={<PhotoSousMarine />} />
            <Route path="photographe-environnemental-marseille" element={<PhotographeEnvironnemental />} />
            <Route path="videos"                         element={<Videos />} />
            <Route path="communaute"                     element={<Instagram />} />
            <Route path="communaute-calanques"              element={<GroupeFacebook />} />
            <Route path="actualites"                     element={<Twitter />} />
            <Route path="sauver-marseille-documentaire-arte" element={<Arte />} />
            <Route path="meduses-souveraines-oceans-documentaire-arte" element={<Meduses />} />
            <Route path="donnees-scientifiques"          element={<Sources />} />
            <Route path="contact"                        element={<Contact />} />
            <Route path="carte-calanques"                element={<Carte />} />
            <Route path="local-guide-marseille"          element={<LocalGuide />} />
            <Route path="les-francais-yann-arthus-bertrand" element={<Yab />} />
            <Route path="mentions-legales"                element={<MentionsLegales />} />
            <Route path="confidentialite"                 element={<Confidentialite />} />
            {/* Redirections legacy — anciennes URLs */}
            <Route path="home"        element={<Navigate to="/" replace />} />
            <Route path="missions"    element={<Navigate to="/depollution-marine" replace />} />
            <Route path="medias"      element={<Navigate to="/presse" replace />} />
            <Route path="photos"      element={<Navigate to="/photographie-paysage-mer" replace />} />
            <Route path="reseaux"     element={<Navigate to="/communaute" replace />} />
            <Route path="twitter"     element={<Navigate to="/actualites" replace />} />
            <Route path="arte"        element={<Navigate to="/sauver-marseille-documentaire-arte" replace />} />
            <Route path="sources"     element={<Navigate to="/donnees-scientifiques" replace />} />
            <Route path="carte"       element={<Navigate to="/carte-calanques" replace />} />
            <Route path="local-guide" element={<Navigate to="/local-guide-marseille" replace />} />
            <Route path="*"    element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
