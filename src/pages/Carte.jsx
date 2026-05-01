import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, FileText, Map, ArrowRight, ChevronDown } from 'lucide-react';

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
import FireRiskBanner from '../components/FireRiskBanner';
import { SEO_PAGES } from '../utils/seo';

const MAP_ID = '1fu2q9DRyD80m11ejdp8Ivuj5vn2aguM';
const FULL_URL = `https://www.google.com/maps/d/viewer?mid=${MAP_ID}`;

export default function Carte() {
  return (
    <>
      <SEO {...SEO_PAGES['/carte-calanques']} />

      <FireRiskBanner />
      <div className="relative overflow-hidden h-[calc(100vh-70px-48px)] md:h-[calc(100vh-128px-80px-48px)] flex items-center justify-center">

        {/* Image satellite en fond */}
        <img
          src="https://www.calanques-parcnational.fr/sites/calanques-parcnational.fr/files/thumbnails/image/carte-calanques-marseille-cassis-la-ciotat-3000x1733.jpg"
          alt="Carte du Parc national des Calanques de Marseille"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(0.8)' }}
        />

        {/* Contenu centré */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', maxWidth: '520px' }}>
          <MapPin className="w-10 h-10 text-ocean-teal drop-shadow-lg mx-auto mb-4" aria-hidden="true" />
          <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: 1.3, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            Carte interactive des Calanques
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6, textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
            Spots photographiés & actions de dépollution Team Oxygen.<br />
            Ouvre directement dans Google Maps.
          </p>
          <a
            href={FULL_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'rgba(33,196,123,0.9)', color: 'black',
              padding: '0.9rem 2rem', borderRadius: '9999px',
              fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
              boxShadow: '0 0 24px rgba(33,196,123,0.4)',
            }}
          >
            <Map style={{ width: '1.1rem', height: '1.1rem' }} aria-hidden="true" />
            Ouvrir la carte dans Google Maps
            <ExternalLink style={{ width: '0.85rem', height: '0.85rem', opacity: 0.7 }} aria-hidden="true" />
          </a>
        </div>

        {/* Légende */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(8px)' }}
          className="rounded-xl border border-white/15 px-4 py-3"
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

        {/* Indicateur scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
          className="flex flex-col items-center gap-1 pointer-events-none"
        >
          <span className="text-white/70 text-xs tracking-widest uppercase font-semibold drop-shadow-lg">Voir plus</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5 text-white/70 drop-shadow-lg" />
          </motion.div>
        </motion.div>

      </div>

        {/* Bouton Google Maps — haut gauche (title centré, légende droite → gauche libre) */}
        <motion.a
          href={FULL_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10 }}
          className="glass rounded-xl border border-white/10 px-4 py-2.5 flex items-center gap-2 text-xs text-text-secondary hover:text-white hover:border-ocean-teal/40 transition-colors duration-200"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ouvrir dans Google Maps
        </motion.a>

        {/* Indicateur de scroll — bas centré */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
          className="flex flex-col items-center gap-1 pointer-events-none"
        >
          <span className="text-white/70 text-xs tracking-widest uppercase font-semibold drop-shadow-lg">Voir plus</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-white/70 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Titre flottant — haut centré */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
          className="glass rounded-xl border border-white/10 px-5 py-2.5 text-center pointer-events-none"
        >
          <p className="text-white font-bold text-sm md:text-base leading-tight">
            Carte des Calanques de Marseille
          </p>
          <p className="text-ocean-teal text-xs font-medium mt-0.5">
            Spots photographiés & actions de dépollution
          </p>
        </motion.div>

        {/* Légende flottante — haut gauche de la carte (après le panneau Google Maps ~200px) */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(8px)' }}
          className="rounded-xl border border-white/15 px-4 py-3"
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
      <section className="container-custom py-12 space-y-10">

        {/* ── BLOC ÉDITORIAL PRINCIPAL ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-strong rounded-3xl p-8 md:p-12"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Carte des Calanques de Marseille : Nos actions environnementales sur le terrain
          </h1>
          <p className="text-ocean-teal font-semibold mb-6">
            Cartographie interactive des spots de dépollution et des photographies du littoral marseillais
          </p>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Explorez la carte interactive des Calanques de Marseille à Cassis, au cœur du{' '}
              <strong className="text-white">Parc national des Calanques</strong>. Cette cartographie
              couvre l'ensemble du littoral marseillais&nbsp;: Sormiou, Morgiou, En-Vau, Sugiton,
              Callelongue, Cap Croisette, la Côte Bleue et les abords de Cassis.
            </p>
            <p>
              Chaque point inscrit sur cette carte correspond à une intervention réelle ou à une
              photographie documentaire. Loin d'une simple carte de randonnée, cet outil met en
              évidence un contraste structurant&nbsp;: la beauté préservée du massif calcaire et les
              zones où la pollution s'accumule, parfois invisibles depuis le bord mais révélées par
              les plongées en apnée.
            </p>
          </div>

          {/* Légende */}
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

          <div className="mt-6 pt-4 border-t border-white/10">
            <a
              href={FULL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-400/50 text-orange-400 text-sm font-medium hover:text-orange-300 hover:border-orange-400 transition-all duration-200"
            >
              <MapPin className="w-4 h-4" />
              Ouvrir dans Google Maps
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </motion.div>

        {/* ── SPOTS CLÉS — Guide des Calanques ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 md:p-10"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Les spots des Calanques&nbsp;: de Marseille à Cassis
          </h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Le Parc national des Calanques s'étend sur plus de{' '}
            <strong className="text-white">20 km de côte</strong>, de Marseille à La Ciotat. Voici
            les principaux secteurs documentés sur la carte&nbsp;:
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                name: 'Sormiou & Morgiou',
                desc: "Les deux calanques habitées du massif. Fond de baie sableux, posidonie dense, accès à pied ou bateau. Zones régulièrement dépollluées par Team Oxygen.",
              },
              {
                name: 'Sugiton & Pierres-Tombées',
                desc: "Accessible uniquement à pied depuis Luminy (45 min). Eaux turquoise, falaises verticales, biodiversité marine exceptionnelle. Zone à fréquentation régulée.",
              },
              {
                name: 'En-Vau & Port-Pin',
                desc: "Parmi les plus belles calanques de France. Fond sableux blanc, parois calcaires à pic, eau cristalline. Accès limité en été pour préserver l'écosystème.",
              },
              {
                name: 'Callelongue & Cap Croisette',
                desc: "Porte sud de Marseille. Zone de départ de nombreuses missions Team Oxygen. Fonds rocheux richement habités, plongées en apnée récurrentes.",
              },
              {
                name: 'Archipel du Frioul',
                desc: "Quatre îles face à Marseille. Eaux claires, posidonie protégée, gorgones. Zone de surveillance prioritaire contre le mouillage illégal et les déchets.",
              },
              {
                name: 'Côte Bleue & Carry-le-Rouet',
                desc: "Au nord-ouest de Marseille. Réserve marine de Carry, zone de reproduction pour le mérou et la denti. Plongées pédagogiques régulières.",
              },
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

        {/* ── BIODIVERSITÉ & URGENCE ── */}
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
            riches de Méditerranée — et l'une des plus fragilisées. Chaque plongée en apnée révèle
            à la fois leur richesse et leur vulnérabilité.
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
              On y trouve des herbiers de{' '}
              <strong className="text-white">posidonie</strong> (Posidonia oceanica), véritables
              poumons de la Méditerranée classés espèce protégée, des{' '}
              <strong className="text-white">gorgones rouges</strong> et ventaglio, des{' '}
              <strong className="text-white">mérous bruns</strong>, des sars, des barracudas et
              ponctuellement des grands cétacés — rorquals communs et dauphins — dans les eaux du
              large.
            </p>
            <p>
              Cette richesse est directement menacée par la pollution plastique, les ancres qui
              arrachent la posidonie, les filets de pêche abandonnés et l'augmentation de la
              fréquentation estivale. Les interventions de{' '}
              <strong className="text-white">Team Oxygen</strong> dans ces zones visent à documenter
              et à retirer physiquement ces menaces, mission après mission.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/depollution-marine"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium text-sm"
            >
              Découvrir nos missions de dépollution
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/communaute"
              className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors font-medium text-sm"
            >
              Rejoindre l'équipe en tant que bénévole
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-white/8">
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
          </div>
        </motion.div>

      </section>

      {/* CTA — Cartes officielles du Parc national des Calanques */}
      <section className="container-custom pb-16">
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

      </section>
    </>
  );
}
