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
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
const Arte           = lazy(() => import('./pages/Arte'));
const EchappeesBelles = lazy(() => import('./pages/EchappeesBelles'));
const GreenGot        = lazy(() => import('./pages/GreenGot'));
const Meduses    = lazy(() => import('./pages/Meduses'));
const Sources    = lazy(() => import('./pages/Sources'));
const Carte      = lazy(() => import('./pages/Carte'));
const LocalGuide = lazy(() => import('./pages/LocalGuide'));
const Admin     = lazy(() => import('./pages/AdminGalerie'));
const AdminBlog = lazy(() => import('./pages/AdminBlog'));
const Yab             = lazy(() => import('./pages/Yab'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const Confidentialite    = lazy(() => import('./pages/Confidentialite'));
const PlanDuSite         = lazy(() => import('./pages/PlanDuSite'));
const PhotoSousMarine    = lazy(() => import('./pages/PhotoSousMarine'));
const PhotographeEnvironnemental = lazy(() => import('./pages/PhotographeEnvironnemental'));
const DossierPresse              = lazy(() => import('./pages/DossierPresse'));
const BlogCategory               = lazy(() => import('./pages/BlogCategory'));
const GroupeFacebook             = lazy(() => import('./pages/GroupeFacebook'));
const AccesMassifs               = lazy(() => import('./pages/AccesMassifs'));
const CartePhotos                = lazy(() => import('./pages/CartePhotos'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="spinner" />
  </div>
);

function NotFound() {
  const { t } = useTranslation();
  const location = useLocation();
  const homeUrl = location.pathname.startsWith('/en') ? '/en' : '/';
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="glass-strong rounded-3xl border border-white/10 p-12 md:p-16 max-w-lg w-full">
        <p className="text-ocean-teal text-sm font-semibold uppercase tracking-widest mb-4">{t('notFound.label')}</p>
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-white font-semibold mb-3">{t('notFound.title')}</p>
        <p className="text-gray-400 mb-10 leading-relaxed">{t('notFound.desc')}</p>
        <Link to={homeUrl} className="btn-primary inline-flex items-center gap-2">
          {t('notFound.cta')}
        </Link>
      </div>
    </div>
  );
}

function renderSharedRoutes() {
  return [
    <Route key="index" index element={<Home />} />,
    <Route key="blog" path="blog" element={<Blog />} />,
    <Route key="blog-cat" path="blog/categorie/:slug" element={<BlogCategory />} />,
    <Route key="blog-post" path="blog/:slug" element={<BlogPost />} />,
    <Route key="depollution" path="depollution-marine" element={<Missions />} />,
    <Route key="presse" path="presse" element={<Medias />} />,
    <Route key="photos" path="photographie-paysage-mer" element={<Photos />} />,
    <Route key="sous-marine" path="photographie-sous-marine" element={<PhotoSousMarine />} />,
    <Route key="env-photo" path="photographe-environnemental-marseille" element={<PhotographeEnvironnemental />} />,
    <Route key="dossier-presse" path="dossier-presse" element={<DossierPresse />} />,
    <Route key="videos" path="videos" element={<Videos />} />,
    <Route key="communaute" path="communaute" element={<Instagram />} />,
    <Route key="communaute-cal" path="communaute-calanques" element={<GroupeFacebook />} />,
    <Route key="actualites" path="actualites" element={<Twitter />} />,
    <Route key="arte" path="sauver-marseille-documentaire-arte" element={<Arte />} />,
    <Route key="echappees" path="echappees-belles-bouches-du-rhone" element={<EchappeesBelles />} />,
    <Route key="green-got" path="court-metrage-green-got-mediterranee" element={<GreenGot />} />,
    <Route key="meduses" path="meduses-souveraines-oceans-documentaire-arte" element={<Meduses />} />,
    <Route key="sources" path="donnees-scientifiques" element={<Sources />} />,
    <Route key="contact" path="contact" element={<Contact />} />,
    <Route key="carte-cal" path="carte-calanques" element={<Carte />} />,
    <Route key="carte-photos" path="carte-photos" element={<CartePhotos />} />,
    <Route key="acces" path="acces-massifs-calanques" element={<AccesMassifs />} />,
    <Route key="local-guide" path="local-guide-marseille" element={<LocalGuide />} />,
    <Route key="yab" path="les-francais-yann-arthus-bertrand" element={<Yab />} />,
    <Route key="mentions" path="mentions-legales" element={<MentionsLegales />} />,
    <Route key="confidentialite" path="confidentialite" element={<Confidentialite />} />,
    <Route key="plan" path="plan-du-site" element={<PlanDuSite />} />,
    <Route key="not-found" path="*" element={<NotFound />} />,
  ];
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
          <Route path="admin-blog"    element={<AdminBlog />} />

          {/* Routes françaises (/) */}
          <Route path="/" element={<Layout />}>
            {renderSharedRoutes()}
            {/* Redirections legacy — anciennes URLs FR uniquement */}
            <Route path="home"        element={<Navigate to="/" replace />} />
            <Route path="missions"    element={<Navigate to="/depollution-marine" replace />} />
            <Route path="medias"      element={<Navigate to="/presse" replace />} />
            <Route path="photos"      element={<Navigate to="/photographie-paysage-mer" replace />} />
            <Route path="reseaux"     element={<Navigate to="/communaute" replace />} />
            <Route path="instagram"   element={<Navigate to="/communaute" replace />} />
            <Route path="twitter"     element={<Navigate to="/actualites" replace />} />
            <Route path="actu-x"      element={<Navigate to="/actualites" replace />} />
            <Route path="arte"        element={<Navigate to="/sauver-marseille-documentaire-arte" replace />} />
            <Route path="sources"     element={<Navigate to="/donnees-scientifiques" replace />} />
            <Route path="carte"       element={<Navigate to="/carte-calanques" replace />} />
            <Route path="local-guide" element={<Navigate to="/local-guide-marseille" replace />} />
          </Route>

          {/* Routes anglaises (/en) */}
          <Route path="/en" element={<Layout />}>
            {renderSharedRoutes()}
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
