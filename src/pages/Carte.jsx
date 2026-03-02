import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, FileText, Map, ArrowRight } from 'lucide-react';

const CARTES_TERRESTRES = [
  { label: 'Carte générale du Parc national des Calanques', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/thumbnails/image/carte-calanques-marseille-cassis-la-ciotat-3000x1733.jpg' },
  { label: 'Archipel du Frioul (17 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-archipel-frioul.pdf' },
  { label: 'Archipel de Riou (16 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-archipel-riou.pdf' },
  { label: 'Massif de Marseilleveyre — Les Goudes, Callelongue (10 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-marseilleveyre.pdf' },
  { label: 'Campus de Luminy — Sormiou, Morgiou, Sugiton (10 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-luminy.pdf' },
  { label: 'Route de la Gineste — mont Puget, forêt de la Gardiole (9 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-gineste.pdf' },
  { label: 'Col de la Gardiole — En-Vau, Port-Pin (9 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-gardiole.pdf' },
  { label: 'Cap Canaille — Cassis, Figuerolles, Mugel (10 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/atoms/files/carte-cassis-la-ciotat.pdf' },
  { label: 'Île Verte (10 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/thumbnails/image/carte-ile-verte.jpg' },
];

const CARTES_MARINES = [
  { label: 'Réglementation en mer — Parc national des Calanques (6 Mo)', url: 'https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/documents/downloads/plaquette-mer-2021-xs.pdf' },
];
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';

const MAP_ID = '1fu2q9DRyD80m11ejdp8Ivuj5vn2aguM';
const EMBED_URL = `https://www.google.com/maps/d/embed?mid=${MAP_ID}&ehbc=2E312F`;
const FULL_URL  = `https://www.google.com/maps/d/viewer?mid=${MAP_ID}`;

export default function Carte() {
  return (
    <>
      <SEO {...SEO_PAGES['/carte-calanques']} />

      {/* Carte plein écran — mode immersif */}
      <div style={{ position: 'relative', height: '100vh', paddingTop: '80px', overflow: 'hidden' }}>

        {/* Carte Google My Maps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', height: '100%', overflow: 'hidden' }}
        >
          <iframe
            src={EMBED_URL}
            title="Carte des sites — Dark Massilia Karim Saari"
            style={{
              position: 'absolute',
              top: '-54px',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: 'calc(100% + 54px)',
              border: 'none',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* Légende flottante — bas gauche */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10 }}
          className="glass rounded-xl border border-white/10 px-4 py-3"
        >
          <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-2">Légende</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 shadow-[0_0_5px_2px_rgba(34,197,94,0.5)]" />
              Photographies de paysage
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 shadow-[0_0_5px_2px_rgba(239,68,68,0.5)]" />
              Actions de dépollution — Team Oxygen
            </div>
          </div>
        </motion.div>

      </div>

      {/* Contenu SEO — section scrollable sous la carte */}
      <section className="container-custom py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-2xl border border-white/10 p-6 md:p-8 space-y-5 text-text-secondary leading-relaxed text-sm md:text-base"
        >
          <p>
            Explorez la carte interactive des Calanques de Marseille à Cassis, au cœur du Parc national des Calanques.
            Cette cartographie couvre l'ensemble du littoral marseillais : Sormiou, Morgiou, En-Vau, Sugiton, Callelongue,
            Cap Croisette, la Côte Bleue et les abords de Cassis.
          </p>
          <p>
            Cette carte ne se limite pas à une simple localisation géographique. Elle met en évidence un contraste structurant :
          </p>

          {/* Légende */}
          <div className="space-y-3 pl-2">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 w-3 h-3 rounded-full bg-green-500 flex-shrink-0 shadow-[0_0_6px_2px_rgba(34,197,94,0.5)]" />
              <p className="m-0">
                <strong className="text-white">Points verts</strong> — photographies de paysage documentant la beauté brute
                du massif calcaire méditerranéen, ses falaises, criques, grottes et reliefs côtiers.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 w-3 h-3 rounded-full bg-red-500 flex-shrink-0 shadow-[0_0_6px_2px_rgba(239,68,68,0.5)]" />
              <p className="m-0">
                <strong className="text-white">Points rouges</strong> — actions de dépollution menées avec Team Oxygen,
                illustrant les zones impactées par les déchets et les interventions réalisées en mer et sur le littoral.
              </p>
            </div>
          </div>

          <p>
            L'objectif est double : montrer la puissance esthétique des Calanques et rendre visible leur vulnérabilité.
            Chaque point rouge inscrit sur la carte correspond à une réalité de terrain : plastiques, filets, déchets
            immergés ou abandonnés dans des espaces naturels à haute fréquentation.
          </p>
          <p>
            Pensée comme un outil de découverte et de sensibilisation, cette cartographie s'adresse aux randonneurs,
            apnéistes, kayakistes, plongeurs et visiteurs souhaitant comprendre la géographie du territoire, mais aussi
            les enjeux environnementaux associés.
          </p>
          <p>
            Le littoral marseillais constitue un écosystème d'exception soumis à une pression humaine importante.
            En juxtaposant images de paysage et actions de dépollution, cette carte met en perspective la beauté des
            Calanques et la nécessité de les préserver durablement, dans le respect des réglementations du Parc national
            des Calanques.
          </p>
          <div className="pt-2">
            <a
              href={FULL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-text-secondary text-sm hover:text-white hover:border-white/40 transition-all duration-200"
            >
              <MapPin className="w-4 h-4" />
              Ouvrir dans Google Maps
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* CTA — Cartes officielles du Parc national des Calanques */}
      <section className="container-custom pb-16 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-2xl border border-white/10 px-6 md:px-8 py-4 md:py-5"
        >
          {/* En-tête avec logo */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
            <img
              src="/logo-parc-national.png"
              alt="Logo Parc national des Calanques"
              className="w-40 h-40 object-contain flex-shrink-0"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-0.5">Ressources officielles</p>
              <h2 className="text-white font-semibold text-base md:text-lg leading-tight">
                Cartes du Parc national des Calanques
              </h2>
              <p className="text-text-secondary text-xs mt-1">
                Téléchargez les cartes topographiques et marines publiées par le Parc national des Calanques.
              </p>
            </div>
          </div>

          {/* Cartes terrestres */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-ocean-teal flex-shrink-0" />
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">Cartes terrestres</h3>
            </div>
            <ul className="space-y-2">
              {CARTES_TERRESTRES.map(({ label, url }) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-secondary text-sm hover:text-ocean-teal transition-colors duration-150 group"
                  >
                    <FileText className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cartes marines */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-ocean-teal flex-shrink-0" />
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">Cartes marines</h3>
            </div>
            <ul className="space-y-2">
              {CARTES_MARINES.map(({ label, url }) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-secondary text-sm hover:text-ocean-teal transition-colors duration-150 group"
                  >
                    <FileText className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Lien vers le site officiel */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <a
              href="https://www.calanques-parcnational.fr/fr/cartes-plans-marseille-cassis-la-ciotat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-text-secondary hover:text-ocean-teal transition-colors duration-150"
            >
              <ExternalLink className="w-3 h-3" />
              Toutes les cartes — calanques-parcnational.fr
            </a>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 mb-8"
        >
          <Link
            to="/local-guide-marseille"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Local Guide Marseille</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            to="/#newsletter"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <span>S'inscrire à la newsletter</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </section>
    </>
  );
}
