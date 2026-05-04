import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb visible (Fil d'Ariane) — Home > Page courante
 * Renforce le schema BreadcrumbList déjà présent en JSON-LD.
 * label : nom affiché de la page courante (doit correspondre au label schema)
 */
const Breadcrumb = ({ label }) => (
  <nav aria-label="Fil d'Ariane" className="mb-6">
    <ol className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
      <li>
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-ocean-teal transition-colors"
          aria-label="Accueil"
        >
          <Home size={12} aria-hidden="true" />
          <span>Accueil</span>
        </Link>
      </li>
      <li aria-hidden="true">
        <ChevronRight size={12} className="text-gray-600" />
      </li>
      <li aria-current="page" className="text-gray-300">
        {label}
      </li>
    </ol>
  </nav>
);

export default Breadcrumb;
