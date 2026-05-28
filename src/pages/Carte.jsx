import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, FileText, Map, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import FireRiskBanner from '../components/FireRiskBanner';
import { SEO_PAGES } from '../utils/seo';

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

const MAP_ID = '1fu2q9DRyD80m11ejdp8Ivuj5vn2aguM';
const FULL_URL = `https://www.google.com/maps/d/viewer?mid=${MAP_ID}`;

export default function Carte() {
  return (
    <>
      <SEO {...SEO_PAGES['/carte-calanques']} />
      <FireRiskBanner />

      <section className="container-custom py-8 space-y-10">

        {/* ── EN-TÊTE + LIEN CARTE ── */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Carte des Calanques de Marseille
          </h1>

          {/* Bloc lien Google Maps */}
          <div className="glass rounded-2xl border border-ocean-teal/20 overflow-hidden mb-2">
            <div className="flex flex-col sm:flex-row items-center gap-5 p-5 md:p-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-ocean-teal flex-shrink-0" />
                  <span className="text-ocean-teal font-semibold text-xs uppercase tracking-widest">Google My Maps</span>
                </div>
                <p className="text-white font-semibold text-base">Carte interactive — Spots & actions de dépollution</p>
                <p className="text-text-secondary text-sm mt-1">
                  Points verts : photographies de paysage &nbsp;·&nbsp; Points rouges : dépollution Team Oxygen
                </p>
              </div>
              <a
                href={FULL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-ocean-teal hover:bg-ocean-teal/80 text-black font-bold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                <Map className="w-4 h-4" />
                Ouvrir la carte
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* ── BLOC ÉDITORIAL PRINCIPAL ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-strong rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Nos actions environnementales sur le terrain
          </h2>
          <p className="text-ocean-teal font-semibold mb-6">
            Cartographie des spots de dépollution et des photographies du littoral marseillais
          </p>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Explorez la carte interactive des Calanques de Marseille à La Ciotat, au cœur du{' '}
              <strong className="text-white">Parc national des Calanques</strong>. Cette cartographie
              couvre l'ensemble du littoral marseillais&nbsp;: Sormiou, Morgiou, En-Vau, Sugiton,
              Callelongue, Cap Croisette, Cassis et les Calanques de La Ciotat.
            </p>
            <p>
              Chaque point inscrit sur cette carte correspond à une intervention réelle ou à une
              photographie documentaire. Loin d'une simple carte de randonnée, cet outil met en
              évidence un contraste structurant&nbsp;: la beauté préservée du massif calcaire et les
              zones où la pollution s'accumule, parfois invisibles depuis le bord mais révélées par
              les plongées en apnée.
            </p>
          </div>

          <div className="mt-6 space-y-3 pl-2">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 w-3 h-3 rounded-full bg-green-500 flex-shrink-0 shadow-[0_0_6px_2px_rgba(34,197,94,0.5)]" />
              <p className="m-0 text-text-secondary text-sm leading-relaxed">
                <strong className="text-white">Points verts</strong> — photographies de paysage
                documentant la beauté brute du massif calcaire méditerranéen&nbsp;: falaises, criques,
                grottes sous-marines et reliefs côtiers uniques.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 w-3 h-3 rounded-full bg-red-500 flex-shrink-0 shadow-[0_0_6px_2px_rgba(239,68,68,0.5)]" />
              <p className="m-0 text-text-secondary text-sm leading-relaxed">
                <strong className="text-white">Points rouges</strong> — actions de dépollution
                marine menées avec <strong className="text-white">Team Oxygen</strong>&nbsp;:
                plastiques, filets abandonnés et déchets immergés retirés des fonds des Calanques.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── GALERIE PHOTOS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <img
            src="/images/marseille-marseilleveyre-avant-rugulopteryx-biodiversite-2.webp"
            alt="Biodiversité des fonds marins du massif de Marseilleveyre avant l'algue invasive rugulopteryx"
            className="w-full h-64 object-cover rounded-2xl"
            loading="lazy"
          />
          <img
            src="/images/Marseille-dark-massilia-plastique-pollution-projet-sentinelle-moyades.webp"
            alt="Dépollution marine aux Moyades — Projet Sentinelle Dark Massilia"
            className="w-full h-64 object-cover rounded-2xl"
            loading="lazy"
          />
        </motion.div>

        {/* ── SPOTS CLÉS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 md:p-10"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Les spots des Calanques&nbsp;: de Marseille à La Ciotat
          </h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Le Parc national des Calanques s'étend sur plus de{' '}
            <strong className="text-white">20 km de côte</strong>, de Marseille à La Ciotat. Voici
            les principaux secteurs documentés sur la carte&nbsp;:
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { name: 'Sormiou & Morgiou', desc: "Les deux calanques habitées du massif. Fond de baie sableux, posidonie dense, accès à pied ou bateau. Zones régulièrement dépollluées par Team Oxygen." },
              { name: 'Sugiton & Pierres-Tombées', desc: "Accessible uniquement à pied depuis Luminy (45 min). Eaux turquoise, falaises verticales, biodiversité marine exceptionnelle. Zone à fréquentation régulée." },
              { name: 'En-Vau & Port-Pin', desc: "Parmi les plus belles calanques de France. Fond sableux blanc, parois calcaires à pic, eau cristalline. Accès limité en été pour préserver l'écosystème." },
              { name: 'Callelongue & Cap Croisette', desc: "Porte sud de Marseille. Zone de départ de nombreuses missions Team Oxygen. Fonds rocheux richement habités, plongées en apnée récurrentes." },
              { name: 'Archipel du Frioul', desc: "Quatre îles face à Marseille. Eaux claires, posidonie protégée, gorgones. Zone de surveillance prioritaire contre le mouillage illégal et les déchets." },
              { name: 'Calanques de La Ciotat', desc: "À l'est de Cassis. Calanques sauvages peu fréquentées, fonds riches en gorgones et mérous. Zone de plongée et de dépollution en extension." },
            ].map(({ name, desc }) => (
              <div key={name} className="border border-white/10 rounded-2xl p-5 hover:border-ocean-teal/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-ocean-teal flex-shrink-0" />
                  <h3 className="text-white font-semibold">{name}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── BIODIVERSITÉ ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-8 md:p-10"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Biodiversité des Calanques&nbsp;: un écosystème menacé à protéger
          </h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Les fonds marins des Calanques de Marseille abritent l'une des biodiversités les plus
            riches de Méditerranée — et l'une des plus fragilisées.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { stat: '30 000 ha', label: "de zone maritime protégée" },
              { stat: '140+', label: "espèces de poissons recensées" },
              { stat: '1 000+', label: "espèces marines inventoriées" },
            ].map(({ stat, label }) => (
              <div key={stat} className="text-center py-4 border border-white/10 rounded-2xl">
                <div className="text-2xl font-bold text-ocean-teal mb-1">{stat}</div>
                <div className="text-text-secondary text-sm">{label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
            <p>
              On y trouve des herbiers de <strong className="text-white">posidonie</strong>, des{' '}
              <strong className="text-white">gorgones rouges</strong>, des{' '}
              <strong className="text-white">mérous bruns</strong>, des sars, des barracudas et
              ponctuellement des grands cétacés dans les eaux du large.
            </p>
            <p>
              Cette richesse est directement menacée par la pollution plastique, les ancres qui
              arrachent la posidonie et les filets abandonnés. Les interventions de{' '}
              <strong className="text-white">Team Oxygen</strong> visent à documenter et retirer
              physiquement ces menaces, mission après mission.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link to="/depollution-marine" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium text-sm">
              Découvrir nos missions de dépollution <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/communaute" className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium text-sm">
              Rejoindre l'équipe en tant que bénévole <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-white/8">
            <Link to="/local-guide-marseille" className="btn-primary inline-flex items-center gap-2">
              <span>Local Guide Marseille</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link to="/#newsletter" className="btn-secondary inline-flex items-center gap-2">
              <span>S'inscrire à la newsletter</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* ── CARTES OFFICIELLES ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-2xl border border-white/10 px-6 md:px-8 py-4 md:py-5 mb-8"
        >
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
            <img src="/logo-parc-national.png" alt="Logo Parc national des Calanques" className="w-40 h-40 object-contain flex-shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-ocean-teal font-semibold mb-0.5">Ressources officielles</p>
              <h2 className="text-white font-semibold text-base md:text-lg leading-tight">
                Cartes du Parc national des Calanques
              </h2>
              <p className="text-text-secondary text-xs mt-1">
                Téléchargez les cartes topographiques et marines publiées par le Parc national.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-ocean-teal flex-shrink-0" />
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">Cartes terrestres</h3>
            </div>
            <ul className="space-y-2">
              {CARTES_TERRESTRES.map(({ label, url }) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary text-sm hover:text-ocean-teal transition-colors duration-150 group">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-ocean-teal flex-shrink-0" />
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">Cartes marines</h3>
            </div>
            <ul className="space-y-2">
              {CARTES_MARINES.map(({ label, url }) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary text-sm hover:text-ocean-teal transition-colors duration-150 group">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <a href="https://www.calanques-parcnational.fr/fr/cartes-plans-marseille-cassis-la-ciotat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-text-secondary hover:text-ocean-teal transition-colors duration-150">
              <ExternalLink className="w-3 h-3" />
              Toutes les cartes — calanques-parcnational.fr
            </a>
          </div>
        </motion.div>

      </section>
    </>
  );
}
