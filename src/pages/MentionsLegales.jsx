import SEO from '../components/SEO';

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold text-ocean-teal mb-3 pb-2 border-b border-white/10">
      {title}
    </h2>
    <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
      {children}
    </div>
  </section>
);

const Row = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:gap-4">
    <span className="text-gray-500 shrink-0 sm:w-48">{label}</span>
    <span className="text-gray-200">{value}</span>
  </div>
);

export default function MentionsLegales() {
  return (
    <>
      <SEO
        title="Mentions légales · Dark Massilia"
        description="Mentions légales du site karimsaari.com — éditeur, hébergeur, propriété intellectuelle et responsabilité."
        canonical="https://karimsaari.com/mentions-legales"
        noindex={true}
      />

      <div className="container-custom py-16 md:py-24 max-w-3xl">

        {/* En-tête */}
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-ocean-teal/10 text-ocean-teal border border-ocean-teal/20 mb-4">
            Légal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Mentions légales
          </h1>
          <p className="text-gray-400 text-sm">
            Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
          </p>
        </div>

        <div className="glass-strong rounded-2xl border border-white/10 p-6 md:p-10 space-y-0">

          {/* 1. Éditeur */}
          <Section title="1. Éditeur du site">
            <Row label="Raison sociale"      value="SAARI KARIM" />
            <Row label="Enseigne"            value="KARIMSAARI (marque Dark Massilia)" />
            <Row label="Forme juridique"     value="Entrepreneur individuel (EI)" />
            <Row label="SIRET"               value="79279587400025" />
            <Row label="Code NAF / APE"      value="7420Z — Activités photographiques" />
            <Row label="Immatriculation"     value="29/04/2013 au RCS de Marseille" />
            <Row label="Adresse"             value="168 chemin de Morgiou, 13009 Marseille" />
            <Row label="Email"               value="email@karimsaari.com" />
          </Section>

          {/* 2. Directeur de publication */}
          <Section title="2. Directeur de la publication">
            <p>Karim Saari, en qualité d'éditeur du site karimsaari.com.</p>
          </Section>

          {/* 3. Hébergeur */}
          <Section title="3. Hébergeur">
            <Row label="Société"  value="Easy Hébergement" />
            <Row label="Site web" value="https://www.easy-hebergement.fr" />
            <p className="text-gray-400 text-xs mt-2">
              Les coordonnées complètes de l'hébergeur sont disponibles sur{' '}
              <a href="https://www.easy-hebergement.fr" target="_blank" rel="noopener noreferrer"
                className="text-ocean-teal/80 hover:text-ocean-teal transition-colors">
                easy-hebergement.fr
              </a>.
            </p>
          </Section>

          {/* 4. Propriété intellectuelle */}
          <Section title="4. Propriété intellectuelle">
            <p>
              L'ensemble des contenus présents sur ce site — textes, photographies, vidéos, graphismes,
              logos et éléments visuels — est la propriété exclusive de SAARI KARIM ou de ses partenaires,
              et est protégé par les lois françaises et internationales relatives au droit d'auteur et
              à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification ou exploitation, totale ou partielle,
              des contenus de ce site est strictement interdite sans autorisation écrite préalable de
              l'éditeur.
            </p>
          </Section>

          {/* 5. Responsabilité */}
          <Section title="5. Limitation de responsabilité">
            <p>
              L'éditeur s'efforce de maintenir les informations publiées sur ce site à jour et exactes.
              Toutefois, il ne saurait être tenu responsable des erreurs, omissions ou résultats pouvant
              être obtenus par un mauvais usage des informations publiées.
            </p>
            <p>
              L'éditeur ne peut être tenu responsable des dommages directs ou indirects résultant de
              l'accès au site ou de l'utilisation des informations qu'il contient.
            </p>
          </Section>

          {/* 6. Liens hypertextes */}
          <Section title="6. Liens hypertextes">
            <p>
              Ce site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle
              sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques en
              matière de données personnelles.
            </p>
            <p>
              Toute demande de mise en place d'un lien hypertexte vers le site karimsaari.com doit faire
              l'objet d'une autorisation préalable de l'éditeur.
            </p>
          </Section>

          {/* 7. Droit applicable */}
          <Section title="7. Droit applicable">
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige,
              les tribunaux français seront seuls compétents.
            </p>
          </Section>

          {/* Date */}
          <p className="text-xs text-gray-500 pt-4 border-t border-white/5">
            Dernière mise à jour : mars 2026
          </p>

        </div>
      </div>
    </>
  );
}
