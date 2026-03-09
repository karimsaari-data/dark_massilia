import SEO from '../components/SEO';

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold text-ocean-teal mb-3 pb-2 border-b border-white/10">
      {title}
    </h2>
    <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
      {children}
    </div>
  </section>
);

const SubSection = ({ title, children }) => (
  <div className="pl-4 border-l border-ocean-teal/20 space-y-2">
    <p className="font-semibold text-white/80 text-sm">{title}</p>
    {children}
  </div>
);

const Tag = ({ children }) => (
  <span className="inline-block px-2 py-0.5 rounded text-xs bg-white/5 border border-white/10 text-gray-400 mr-1 mb-1">
    {children}
  </span>
);

export default function Confidentialite() {
  return (
    <>
      <SEO
        title="Politique de confidentialité · Dark Massilia"
        description="Politique de confidentialité et protection des données personnelles du site karimsaari.com — RGPD."
        canonical="https://karimsaari.com/confidentialite"
        robots="noindex, nofollow"
      />

      <div className="container-custom py-16 md:py-24 max-w-3xl">

        {/* En-tête */}
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-ocean-teal/10 text-ocean-teal border border-ocean-teal/20 mb-4">
            RGPD
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Politique de confidentialité
          </h1>
          <p className="text-gray-400 text-sm">
            Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679)
            et à la loi Informatique et Libertés modifiée.
          </p>
        </div>

        <div className="glass-strong rounded-2xl border border-white/10 p-6 md:p-10 space-y-0">

          {/* 1. Responsable */}
          <Section title="1. Responsable du traitement">
            <p>
              <span className="text-white font-medium">SAARI KARIM</span> — Entrepreneur individuel (EI)
              <br />168 chemin de Morgiou, 13009 Marseille
              <br />
              <a href="mailto:email@karimsaari.com" className="text-ocean-teal/80 hover:text-ocean-teal transition-colors">
                email@karimsaari.com
              </a>
            </p>
          </Section>

          {/* 2. Données collectées */}
          <Section title="2. Données collectées et finalités">

            <SubSection title="a. Newsletter Dark Massilia">
              <p><Tag>Données</Tag> Adresse email.</p>
              <p><Tag>Finalité</Tag> Envoi de la lettre d'information sur les missions, photos et actualités.</p>
              <p><Tag>Base légale</Tag> Consentement explicite (art. 6.1.a RGPD) — case à cocher lors de l'inscription.</p>
              <p><Tag>Conservation</Tag> Jusqu'à désinscription. Chaque email contient un lien de désabonnement.</p>
              <p><Tag>Destinataires</Tag> Supabase (stockage), Brevo ex-Sendinblue (routage des emails).</p>
            </SubSection>

            <SubSection title="b. Carte interactive des Calanques">
              <p><Tag>Données</Tag> Photographies géolocalisées, coordonnées GPS des points de plongée.</p>
              <p><Tag>Finalité</Tag> Affichage de la carte publique des missions de dépollution.</p>
              <p>Aucune donnée personnelle de l'utilisateur n'est collectée lors de la consultation de la carte.</p>
            </SubSection>

          </Section>

          {/* 3. Cookies */}
          <Section title="3. Cookies et traceurs">

            <SubSection title="a. Cookies techniques strictement nécessaires">
              <p>
                Des cookies techniques peuvent être créés par{' '}
                <strong className="text-white">Supabase</strong> pour la gestion des sessions
                lors de l'inscription à la newsletter. Ces cookies ne nécessitent pas de
                consentement préalable (art. 82 de la loi Informatique et Libertés).
              </p>
            </SubSection>

            <SubSection title="b. Mesure d'audience — Google Analytics 4 (GA4)">
              <p>
                Ce site utilise <strong className="text-white">Google Analytics 4</strong> via
                Google Tag Manager (GTM), déployé avec le{' '}
                <strong className="text-white">Consent Mode v2 Advanced</strong>.
              </p>
              <p><Tag>Base légale</Tag> Consentement (art. 6.1.a RGPD) — recueilli via la bannière de cookies.</p>
              <p>
                <Tag>Sans consentement</Tag> GA4 opère en mode cookieless : aucun cookie de mesure
                n'est déposé, aucun identifiant persistant n'est créé. Des pings anonymisés non
                rattachables à un individu peuvent être transmis à des fins de modélisation statistique
                agrégée par Google.
              </p>
              <p>
                <Tag>Avec consentement</Tag> Collecte standard activée via les 4 signaux suivants :
              </p>
              <ul className="list-none pl-2 space-y-0.5">
                {[
                  ['analytics_storage', "Cookies d'analyse de navigation"],
                  ['ad_storage', 'Cookies publicitaires'],
                  ['ad_user_data', 'Données utilisateur à des fins publicitaires'],
                  ['ad_personalization', 'Personnalisation publicitaire'],
                ].map(([signal, desc]) => (
                  <li key={signal} className="flex gap-2 items-baseline">
                    <code className="text-ocean-teal/80 text-xs font-mono shrink-0">{signal}</code>
                    <span className="text-gray-400 text-xs">— {desc}</span>
                  </li>
                ))}
              </ul>
              <p>
                <Tag>Stockage du consentement</Tag> Vos choix sont enregistrés dans le{' '}
                <code className="text-xs font-mono text-ocean-teal/80">localStorage</code> de votre
                navigateur (clé{' '}
                <code className="text-xs font-mono text-ocean-teal/80">dm_consent</code>), valable 13 mois.
              </p>
            </SubSection>

            <SubSection title="c. Gestion de vos préférences cookies">
              <p>
                Une bannière de consentement s'affiche lors de votre première visite. Vous pouvez à
                tout moment modifier vos choix via le lien{' '}
                <strong className="text-white">"Gérer les cookies"</strong> en bas de page, ou en
                cliquant sur{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('dm:open-consent-banner'));
                    }
                  }}
                  className="text-ocean-teal/80 hover:text-ocean-teal underline underline-offset-2 transition-colors cursor-pointer"
                >
                  ce lien
                </button>.
              </p>
            </SubSection>

          </Section>

          {/* 4. Droits */}
          <Section title="4. Vos droits">
            <p>Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :</p>
            <ul className="list-none space-y-1 pl-2">
              {[
                ['Accès', "obtenir une copie de vos données"],
                ['Rectification', "corriger des données inexactes"],
                ['Suppression', "demander l'effacement de vos données"],
                ['Opposition', "vous opposer à un traitement"],
                ['Portabilité', "recevoir vos données dans un format structuré"],
                ['Limitation', "restreindre temporairement un traitement"],
              ].map(([droit, desc]) => (
                <li key={droit} className="flex gap-2">
                  <span className="text-ocean-teal font-medium shrink-0">Droit de {droit.toLowerCase()}</span>
                  <span className="text-gray-400">— {desc}</span>
                </li>
              ))}
            </ul>
            <p>
              Pour exercer ces droits, adressez votre demande par email à{' '}
              <a href="mailto:email@karimsaari.com" className="text-ocean-teal/80 hover:text-ocean-teal transition-colors">
                email@karimsaari.com
              </a>.
              Délai de réponse : 1 mois maximum.
            </p>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
              auprès de la{' '}
              <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer"
                className="text-ocean-teal/80 hover:text-ocean-teal transition-colors">
                CNIL
              </a>.
            </p>
          </Section>

          {/* 5. Sous-traitants */}
          <Section title="5. Sous-traitants et transferts">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Prestataire</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Rôle</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Politique de confidentialité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['Supabase', 'Stockage des formulaires et de la newsletter', 'supabase.com/privacy'],
                    ['Brevo (Sendinblue)', "Routage et envoi des emails newsletter", 'brevo.com/fr/mentions-legales'],
                    ['Easy Hébergement', 'Hébergement du site web', 'easy-hebergement.fr'],
                    ['Google LLC', "Mesure d'audience (Google Analytics 4) via Google Tag Manager", 'policies.google.com/privacy'],
                  ].map(([name, role, url]) => (
                    <tr key={name}>
                      <td className="py-2 pr-4 text-white/80 font-medium">{name}</td>
                      <td className="py-2 pr-4 text-gray-400">{role}</td>
                      <td className="py-2">
                        <a href={`https://${url}`} target="_blank" rel="noopener noreferrer"
                          className="text-ocean-teal/70 hover:text-ocean-teal transition-colors break-all">
                          {url}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supabase est hébergé sur AWS (eu-west-3 — Paris). Les données Supabase et Brevo restent en Europe.
              Google LLC est établi aux États-Unis ; le transfert est encadré par les Clauses Contractuelles
              Types (CCT) de la Commission européenne et le cadre EU-US Data Privacy Framework.
            </p>
          </Section>

          {/* 6. Sécurité */}
          <Section title="6. Sécurité">
            <p>
              Des mesures techniques et organisationnelles appropriées sont mises en œuvre pour
              protéger vos données contre tout accès non autorisé, perte ou divulgation :
              connexion HTTPS/TLS, accès restreint aux bases de données, clés d'API non exposées
              côté client.
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
