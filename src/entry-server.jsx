/**
 * Entry point SSR (Server-Side Rendering / prerendering)
 *
 * Utilisé uniquement par scripts/prerender.js pendant le build.
 * N'est PAS inclus dans le bundle client final.
 *
 * Différences vs App.jsx (client) :
 *   - StaticRouter au lieu de BrowserRouter
 *   - Imports eagerly (pas de lazy) pour que renderToString fonctionne
 *   - Pas de BrowserRouter (incompatible serveur)
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';

// Imports EAGERLY (pas de lazy — nécessaire pour renderToString)
import Home      from './pages/Home';
import Missions  from './pages/Missions';
import Medias    from './pages/Medias';
import Photos    from './pages/Photos';
import Videos    from './pages/Videos';
import Instagram from './pages/Instagram';
import Twitter   from './pages/Twitter';
import Contact   from './pages/Contact';
import Arte      from './pages/Arte';
import Sources   from './pages/Sources';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8">Cette page n'existe pas</p>
      <a href="/" className="btn-primary">Retour à l'accueil</a>
    </div>
  );
}

/**
 * Rendu SSR d'une URL donnée
 * @param {string} url - L'URL à rendre (ex: "/", "/missions")
 * @returns {{ html: string }} - HTML rendu
 */
export function render(url) {
  const html = renderToString(
    <StaticRouter location={url}>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="missions"  element={<Missions />} />
            <Route path="medias"    element={<Medias />} />
            <Route path="photos"    element={<Photos />} />
            <Route path="videos"    element={<Videos />} />
            <Route path="instagram" element={<Instagram />} />
            <Route path="twitter"   element={<Twitter />} />
            <Route path="arte"      element={<Arte />} />
            <Route path="sources"   element={<Sources />} />
            <Route path="contact"   element={<Contact />} />
            <Route path="home"      element={<Navigate to="/" replace />} />
            <Route path="*"         element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </StaticRouter>
  );
  return { html };
}
