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
const Missions   = lazy(() => import('./pages/Missions'));
const Medias     = lazy(() => import('./pages/Medias'));
const Photos     = lazy(() => import('./pages/Photos'));
const Videos     = lazy(() => import('./pages/Videos'));
const Instagram  = lazy(() => import('./pages/Instagram'));
const Twitter    = lazy(() => import('./pages/Twitter'));
const Contact    = lazy(() => import('./pages/Contact'));
const Arte       = lazy(() => import('./pages/Arte'));
const Sources    = lazy(() => import('./pages/Sources'));
const Carte      = lazy(() => import('./pages/Carte'));
const LocalGuide = lazy(() => import('./pages/LocalGuide'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="spinner" />
  </div>
);

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8">Cette page n'existe pas</p>
      <a href="/" className="btn-primary">Retour à l'accueil</a>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="missions"  element={<Missions />} />
            <Route path="medias"    element={<Medias />} />
            <Route path="photos"    element={<Photos />} />
            <Route path="videos"    element={<Videos />} />
            <Route path="reseaux" element={<Instagram />} />
            <Route path="twitter"   element={<Twitter />} />
            <Route path="arte"      element={<Arte />} />
            <Route path="sources"   element={<Sources />} />
            <Route path="contact"    element={<Contact />} />
            <Route path="carte"      element={<Carte />} />
            <Route path="local-guide" element={<LocalGuide />} />
            {/* Redirections legacy — anciennes URLs de l'ex-site statique */}
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="*"    element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
