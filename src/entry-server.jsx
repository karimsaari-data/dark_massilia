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
import Home       from './pages/Home';
import Blog       from './pages/Blog';
import BlogPost   from './pages/BlogPost';
import Missions   from './pages/Missions';
import Medias     from './pages/Medias';
import Photos     from './pages/Photos';
import Videos     from './pages/Videos';
import Instagram  from './pages/Instagram';
import Twitter    from './pages/Twitter';
import Contact    from './pages/Contact';
import Arte       from './pages/Arte';
import Meduses    from './pages/Meduses';
import Sources    from './pages/Sources';
// CarteSSR = version sans Leaflet (pas de window en Node)
import CarteSSR      from './pages/CarteSSR';
import LocalGuide    from './pages/LocalGuide';
// AdminCarteSSR = version statique (pas de sessionStorage en Node)
import AdminCarteSSR from './pages/AdminCarteSSR';
import Yab          from './pages/Yab';
import PhotoSousMarine from './pages/PhotoSousMarine';
import BlogCategory    from './pages/BlogCategory';

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
            <Route path="depollution-marine"                 element={<Missions />} />
            <Route path="presse"                             element={<Medias />} />
            <Route path="photographie-paysage-mer"           element={<Photos />} />
            <Route path="photographie-sous-marine"           element={<PhotoSousMarine />} />
            <Route path="videos"                             element={<Videos />} />
            <Route path="communaute"                         element={<Instagram />} />
            <Route path="actualites"                         element={<Twitter />} />
            <Route path="sauver-marseille-documentaire-arte" element={<Arte />} />
            <Route path="meduses-souveraines-oceans-documentaire-arte" element={<Meduses />} />
            <Route path="donnees-scientifiques"              element={<Sources />} />
            <Route path="contact"                            element={<Contact />} />
            <Route path="carte-calanques"                    element={<CarteSSR />} />
            <Route path="local-guide-marseille"              element={<LocalGuide />} />
            <Route path="admin"                              element={<AdminCarteSSR />} />
            <Route path="les-francais-yann-arthus-bertrand" element={<Yab />} />
            <Route path="blog"                               element={<Blog />} />
            <Route path="blog/categorie/:slug"               element={<BlogCategory />} />
            <Route path="blog/:slug"                         element={<BlogPost />} />
            <Route path="home"                               element={<Navigate to="/" replace />} />
            <Route path="*"         element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </StaticRouter>
  );
  return { html };
}
