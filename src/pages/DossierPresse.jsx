export default function DossierPresse() {
  return (
    <>
      {/* Hero */}
      <section style={{
        minHeight: '55vh',
        background: 'linear-gradient(rgba(0,0,0,0.55) 0%, rgba(12,34,48,0.85) 100%), url(https://cms.karimsaari.com/wp-content/uploads/2026/05/fight-scaled.jpg) center/cover no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 60px',
        gap: '24px',
      }}>
        <p style={{ color: '#21c47b', letterSpacing: '0.2em', fontSize: '0.85rem', textTransform: 'uppercase', margin: 0 }}>
          Dark Massilia — Karim Saari
        </p>
        <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, color: '#fff' }}>
          Dossier de Presse
        </h1>
        <p style={{ margin: 0, maxWidth: '540px', color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Photographe environnemental, apnéiste et fondateur du Projet Sentinelle —
          dépollution des Calanques de Marseille depuis 2018.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="/dossier-presse.pdf"
            download="Dossier-Presse-Dark-Massilia-Karim-Saari.pdf"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #21c47b, #0fa869)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(33,196,123,0.4)',
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 15V3m0 12-4-4m4 4 4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"/>
            </svg>
            Télécharger le PDF
          </a>
          <a
            href="mailto:contact@karimsaari.com?subject=Demande%20presse%20—%20Dark%20Massilia"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '50px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            Contact presse
          </a>
        </div>
      </section>

      {/* PDF viewer intégré */}
      <section style={{ background: '#0d1b27', padding: '40px 24px 60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontSize: '0.85rem', marginBottom: '20px' }}>
            Aperçu du dossier —{' '}
            <a href="/dossier-presse.pdf" download style={{ color: '#21c47b' }}>télécharger le PDF complet</a>
          </p>
          <iframe
            src="/dossier-presse.pdf"
            title="Dossier de presse Dark Massilia"
            style={{
              width: '100%',
              height: 'min(85vh, 1100px)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              background: '#fff',
            }}
          />
        </div>
      </section>

      {/* Contact */}
      <section style={{
        background: 'linear-gradient(135deg, #21c47b 0%, #0fa869 100%)',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#fff', margin: '0 0 8px', fontSize: '1.6rem', fontWeight: 700 }}>
          Contact presse
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', margin: '0 0 24px', fontSize: '1rem' }}>
          Pour toute demande d'interview, reportage ou partenariat médiatique
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:contact@karimsaari.com" style={{
            color: '#fff', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none',
            background: 'rgba(0,0,0,0.15)', padding: '10px 24px', borderRadius: '50px',
          }}>
            contact@karimsaari.com
          </a>
          <a href="https://wa.me/33695331301" target="_blank" rel="noopener noreferrer" style={{
            color: '#fff', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none',
            background: 'rgba(0,0,0,0.15)', padding: '10px 24px', borderRadius: '50px',
          }}>
            WhatsApp +33 6 95 33 13 01
          </a>
        </div>
      </section>
    </>
  );
}
