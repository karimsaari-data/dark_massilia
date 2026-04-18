/**
 * AccesMassifs — Carte en temps réel des accès aux massifs forestiers
 * Route : /acces-massifs-calanques
 * Source : opendfci.fr — carte Lizmap officielle DFCI Bouches-du-Rhône
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Info, ChevronDown, Flame, AlertTriangle, ShieldCheck, TreePine } from 'lucide-react';
import SEO from '../components/SEO';
import { SEO_PAGES } from '../utils/seo';
import FireRiskBanner from '../components/FireRiskBanner';

const IFRAME_URL =
  'https://opendfci.fr/13/index.php/view/map?repository=openmassifs&project=open_massifs';

const NIVEAUX_RISQUE = [
  {
    color: '#22c55e',
    label: 'Faible',
    text: 'Accès libre. Toutes les activités sont autorisées dans les massifs.',
  },
  {
    color: '#eab308',
    label: 'Limité',
    text: 'Accès autorisé. Vigilance renforcée conseillée — évitez tout comportement à risque (feu, mégot, barbecue).',
  },
  {
    color: '#f97316',
    label: 'Modéré',
    text: 'Accès autorisé avec restrictions. Certains travaux peuvent être encadrés ou limités.',
  },
  {
    color: '#ef4444',
    label: 'Sévère',
    text: 'Accès restreint ou interdit selon les secteurs. Les massifs les plus exposés peuvent être fermés.',
  },
  {
    color: '#7f1d1d',
    label: 'Très sévère / Extrême',
    text: 'Fermeture totale des massifs. Tous travaux et activités extérieures interdits dans les zones à risque.',
  },
];

const FAQ_ACCES = [
  {
    q: 'Quand les massifs forestiers des Bouches-du-Rhône sont-ils soumis à une réglementation d\'accès ?',
    a: 'Du 1er juin au 30 septembre inclus, l\'accès, la présence et la circulation dans les massifs forestiers font l\'objet d\'une réglementation spécifique définie par l\'arrêté préfectoral du 22 avril 2025. En dehors de cette période, l\'accès est libre mais la vigilance reste de mise toute l\'année, notamment lors de vagues de chaleur printanières ou automnales.',
  },
  {
    q: 'Les Calanques de Marseille peuvent-elles fermer pour risque incendie ?',
    a: 'Oui. Le Parc National des Calanques, le massif de Marseilleveyre et la Côte Bleue sont soumis à la réglementation préfectorale des massifs forestiers. Chaque jour, selon le niveau de risque évalué par Météo France, la préfecture des Bouches-du-Rhône peut restreindre ou interdire l\'accès à tout ou partie de ces secteurs. La carte officielle de la DFCI est mise à jour quotidiennement.',
  },
  {
    q: 'Pourquoi les Bouches-du-Rhône sont-elles particulièrement exposées au risque incendie ?',
    a: 'Les Bouches-du-Rhône constituent le département le plus exposé au risque feu de forêt en France métropolitaine. Cette vulnérabilité est liée à un cumul de facteurs : des étés chauds et secs, le mistral qui accélère la propagation des flammes, une végétation de garrigue et de pins très inflammable, et une forte densité de population et de fréquentation touristique. On dénombre environ 250 départs de feux par an dans le département, pour une surface brûlée d\'environ 1 900 ha par an, dont près de 90 % sont d\'origine humaine.',
  },
  {
    q: 'Quels comportements sont interdits dans les massifs en période à risque ?',
    a: 'En période de risque élevé, il est interdit de fumer, d\'allumer un feu ou un barbecue, de faire fonctionner des engins thermiques, d\'effectuer des travaux de débroussaillement ou tout autre travail générant des étincelles. Ces interdictions s\'appliquent aussi bien aux professionnels qu\'aux particuliers à proximité des massifs forestiers.',
  },
  {
    q: 'Comment vérifier si les Calanques sont ouvertes avant de partir ?',
    a: 'La méthode la plus fiable est de consulter la carte interactive de la DFCI Bouches-du-Rhône (opendfci.fr/13) ou le site risque-prevention-incendie.fr/13, tous deux mis à jour chaque matin. Cette page karimsaari.com/acces-massifs-calanques intègre directement la carte officielle et affiche en temps réel l\'état des massifs.',
  },
  {
    q: 'Team Oxygen peut-elle organiser des missions de dépollution en période de fermeture des massifs ?',
    a: 'Non. Avant chaque mission de dépollution sous-marine dans les Calanques, Team Oxygen vérifie systématiquement l\'état d\'accès aux massifs. En cas de fermeture préfectorale, les sorties terrestres et les mises à l\'eau depuis les calanques sont annulées ou reportées. La sécurité des bénévoles et le respect de la réglementation sont non négociables.',
  },
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-4 group py-1"
        aria-expanded={isOpen}
      >
        <span className="text-white font-semibold text-base group-hover:text-ocean-teal transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-ocean-teal flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] mt-3' : 'max-h-0'}`}
        aria-hidden={!isOpen}
      >
        <p className="text-text-secondary leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default function AccesMassifs() {
  return (
    <>
      <SEO {...SEO_PAGES['/acces-massifs-calanques']} />

      {/* Bande statut pleine largeur */}
      <FireRiskBanner />

      {/* Carte pleine largeur */}
      <div className="relative overflow-hidden h-[calc(100vh-70px-48px)] md:h-[calc(100vh-128px-80px-48px)]">
        <iframe
          src={IFRAME_URL}
          title="Carte des accès aux massifs forestiers — DFCI Bouches-du-Rhône"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          loading="lazy"
          allowFullScreen
        />
      </div>

      {/* Info + navigation */}
      <div className="container-custom py-6">
        <div className="glass rounded-2xl p-5 border border-white/8 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-ocean-teal flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary leading-relaxed">
              En période estivale (juin–septembre), la préfecture peut fermer les massifs selon le niveau de risque incendie.
              Avant chaque mission <strong className="text-ocean-teal">Team Oxygen</strong>, nous vérifions l'état des massifs —
              Calanques, Côte Bleue, Marseilleveyre. Sources :&nbsp;
              <a href="https://www.risque-prevention-incendie.fr/13" target="_blank" rel="noopener noreferrer"
                className="text-ocean-teal hover:text-white transition-colors font-medium">
                risque-prevention-incendie.fr/13
              </a>
              {' · '}
              <a href="https://opendfci.fr/13" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-text-muted hover:text-white transition-colors">
                opendfci.fr/13
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-16">
          <Link to="/depollution-marine"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Nos missions de dépollution
          </Link>
          <Link to="/carte-calanques"
            className="inline-flex items-center gap-2 text-ocean-teal hover:text-white transition-colors text-sm font-medium">
            Carte de nos interventions
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* ── SECTION 1 : Contexte ── */}
        <section className="mb-16">
          <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden">
            <div className="grid md:grid-cols-[auto_1fr] gap-0">
              {/* Bande colorée latérale */}
              <div className="hidden md:block w-1.5 bg-gradient-to-b from-orange-500 via-red-500 to-red-800" />

              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Le département le plus exposé de France métropolitaine
                  </h2>
                </div>

                <div className="space-y-4 text-text-secondary text-lg leading-relaxed">
                  <p>
                    Les Bouches-du-Rhône cumulent les conditions les plus défavorables face au risque incendie :
                    étés chauds et secs, mistral qui transforme les flammes en torrent,{' '}
                    <strong className="text-white">végétation de garrigue et de pins d'Alep</strong> qui s'embrase au
                    moindre contact. Résultat : ce territoire est reconnu comme le département de France métropolitaine
                    le plus exposé au feu de forêt.
                  </p>
                  <p>
                    Les chiffres parlent d'eux-mêmes :{' '}
                    <strong className="text-white">environ 250 départs de feux par an</strong>, pour une surface
                    brûlée d'environ <strong className="text-white">1 900 hectares annuels</strong>. Et le plus
                    troublant : <strong className="text-ocean-teal">près de 90 % de ces incendies sont d'origine humaine</strong>.
                    Un mégot jeté par la vitre, une étincelle de meuleuse, un barbecue improvisé — chacun de ces
                    gestes peut déclencher une catastrophe irréversible en quelques minutes.
                  </p>
                  <p>
                    Ce que je documente sous l'eau depuis dix ans — la biodiversité des Calanques, les posidonies,
                    les mérous, les grottes marines — peut disparaître à jamais en quelques heures si le feu atteint
                    les versants. La mer et la forêt forment un seul écosystème. Protéger l'un, c'est protéger l'autre.
                  </p>
                </div>

                {/* Stats en ligne */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                  {[
                    { value: '~250', label: 'départs de feux par an dans les Bouches-du-Rhône' },
                    { value: '~1 900 ha', label: 'brûlés en moyenne chaque année' },
                    { value: '90 %', label: 'des incendies sont d\'origine humaine' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-ocean-teal">{stat.value}</p>
                      <p className="text-xs text-text-muted mt-1 leading-snug">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2 : Réglementation ── */}
        <section className="mb-16">
          <div className="glass-strong rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                La réglementation saisonnière : du 1er juin au 30 septembre
              </h2>
            </div>

            <div className="space-y-4 text-text-secondary text-lg leading-relaxed mb-8">
              <p>
                Chaque année, par arrêté préfectoral, l'accès, la présence et la circulation dans les massifs
                forestiers des Bouches-du-Rhône sont soumis à une{' '}
                <strong className="text-white">réglementation spécifique du 1er juin au 30 septembre inclus</strong>,
                définie par l'arrêté préfectoral du 22 avril 2025.
                L'objectif est clair : réduire les risques de départ de feu, protéger les personnes et permettre
                aux services de secours d'intervenir sans obstacle.
              </p>
              <p>
                Chaque matin, Météo France évalue le niveau de risque pour chaque massif. En fonction de ce niveau,
                la préfecture autorise, restreint ou interdit l'accès aux zones concernées. Cette décision est
                publiée avant 6h et s'applique pour toute la journée.
              </p>
              <p>
                La réglementation s'applique également aux{' '}
                <strong className="text-white">travaux dans et à proximité des massifs</strong> :
                débroussaillement, engins thermiques, travaux agricoles. En cas de risque très sévère ou extrême,
                même les professionnels doivent cesser toute activité susceptible de provoquer une étincelle.
              </p>
            </div>

            {/* Niveaux de risque */}
            <h3 className="text-lg font-semibold text-white mb-4">Les 5 niveaux de risque et leurs conséquences</h3>
            <div className="space-y-3">
              {NIVEAUX_RISQUE.map(niveau => (
                <div key={niveau.label} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/8">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0 mt-1.5"
                    style={{ backgroundColor: niveau.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-white text-sm">{niveau.label}</p>
                    <p className="text-text-secondary text-sm mt-0.5">{niveau.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3 : Angle Team Oxygen ── */}
        <section className="mb-16">
          <div className="glass-strong rounded-3xl border border-ocean-teal/20 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-ocean-teal flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Avant chaque mission Team Oxygen : le réflexe obligatoire
              </h2>
            </div>

            <div className="space-y-4 text-text-secondary text-lg leading-relaxed">
              <p>
                Chaque intervention de{' '}
                <strong className="text-ocean-teal">Team Oxygen dans les Calanques</strong>{' '}
                — qu'il s'agisse d'une session de dépollution sous-marine, d'une sortie photo ou d'une reconnaissance
                de zone — commence par une vérification systématique de l'état d'accès aux massifs.
              </p>
              <p>
                En cas de fermeture préfectorale, toutes nos sorties terrestres depuis les massifs et les mises à
                l'eau depuis les calanques sont annulées ou reportées, sans exception. La réglementation n'est pas
                une contrainte administrative : c'est une protection pour nos bénévoles, pour les secours, et pour
                la forêt elle-même.
              </p>
              <p>
                Si vous souhaitez participer à l'une de nos missions, vérifiez systématiquement cette carte avant
                de vous déplacer. <strong className="text-white">Un massif fermé, c'est une sortie reportée —
                jamais annulée définitivement.</strong> La Méditerranée sera encore là quand les conditions
                seront réunies.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/depollution-marine"
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>Nos missions de dépollution</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="btn-ghost inline-flex items-center gap-2"
              >
                <span>Nous contacter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 4 : Bons gestes ── */}
        <section className="mb-16">
          <div className="glass-strong rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <TreePine className="w-6 h-6 text-green-400 flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Prévenir l'incendie, c'est l'affaire de tous
              </h2>
            </div>

            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              Derrière cette réglementation, il n'y a pas une volonté d'interdire, mais une ambition de
              préserver. Nos forêts méditerranéennes sont parmi les plus riches en biodiversité d'Europe.
              Les femmes et les hommes qui combattent les flammes chaque été le font parfois au péril de
              leur vie. Chaque visiteur qui respecte les consignes est un maillon de cette chaîne de protection.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: '🚬', title: 'Ne jamais fumer', text: 'Ni dans les massifs, ni depuis un véhicule à proximité. Un mégot peut déclencher un incendie des heures après avoir été jeté.' },
                { icon: '🔥', title: 'Aucun feu, aucun barbecue', text: 'Même dans les zones de pique-nique, toute flamme nue est interdite en période de risque. Les réchauds à gaz sont à éviter également.' },
                { icon: '🛠️', title: 'Travaux et engins thermiques', text: 'Tronçonneuses, meuleuses, débroussailleuses — tout outil générant des étincelles est interdit en période de risque sévère.' },
                { icon: '📱', title: 'Signaler un départ de feu', text: 'Appelez le 18 (pompiers) ou le 112 immédiatement. Ne tentez pas d\'éteindre seul et éloignez-vous rapidement du secteur.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/8">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5 : FAQ ── */}
        <section className="mb-16">
          <div className="glass-strong rounded-3xl border border-white/10 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Questions fréquentes sur l'accès aux massifs
            </h2>
            <div className="space-y-4 max-w-3xl">
              {FAQ_ACCES.map((item, i) => (
                <FaqItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
