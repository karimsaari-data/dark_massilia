import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

// Lazy-loaded pages — chargées uniquement quand l'utilisateur navigue
const Missions = lazy(() => import('./pages/Missions'));
const Medias = lazy(() => import('./pages/Medias'));
const Photos = lazy(() => import('./pages/Photos'));
const Videos = lazy(() => import('./pages/Videos'));
const Instagram = lazy(() => import('./pages/Instagram'));
const Twitter = lazy(() => import('./pages/Twitter'));
const Contact = lazy(() => import('./pages/Contact'));
const Arte = lazy(() => import('./pages/Arte'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="spinner" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="missions" element={<Missions />} />
              <Route path="medias" element={<Medias />} />
              <Route path="photos" element={<Photos />} />
              <Route path="videos" element={<Videos />} />
              <Route path="instagram" element={<Instagram />} />
              <Route path="twitter" element={<Twitter />} />
              <Route path="arte" element={<Arte />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8">Cette page n'existe pas</p>
      <a href="/" className="btn-primary">Retour à l'accueil</a>
    </div>
  );
}

export default App;
