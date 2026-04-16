/**
 * fire-risk-calanques — Risque incendie pour le massif des Calanques (ID 13)
 * Source : https://www.freqsud.fr/admin/core/meteo/massif/get_massif.php
 * Mise à jour : quotidienne par la Préfecture / Frequence-sud.fr
 */

const API_URL    = 'https://www.freqsud.fr/admin/core/meteo/massif/get_massif.php';
const MASSIF_ID  = '13'; // Calanques de Marseille

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type RiskLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface RiskInfo {
  level: RiskLevel;
  label: string;
  color: string;       // couleur CSS
  authorized: boolean;
}

const RISK_MAP: Record<number, RiskInfo> = {
  0: { level: 0, label: 'Conditions normales - Accès autorisé',       color: '#22c55e', authorized: true  },
  1: { level: 1, label: 'Conditions normales - Accès autorisé',       color: '#22c55e', authorized: true  },
  2: { level: 2, label: 'Risque limité - Accès autorisé',             color: '#facc15', authorized: true  },
  3: { level: 3, label: 'Risque sévère - Accès déconseillé',          color: '#f97316', authorized: false },
  4: { level: 4, label: 'Risque très sévère - Accès interdit',        color: '#ef4444', authorized: false },
  5: { level: 5, label: 'Risque exceptionnel - Accès interdit',       color: '#111827', authorized: false },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const res = await fetch(API_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DarkMassilia/1.0)' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`API freqsud HTTP ${res.status}`);

    const data = await res.json() as { massifs?: Record<string, number> };
    const rawLevel = data?.massifs?.[MASSIF_ID] ?? 0;
    const info = RISK_MAP[rawLevel] ?? RISK_MAP[0];

    const today = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Paris',
    });

    return new Response(
      JSON.stringify({
        status:     'ok',
        massif:     'Calanques',
        date:       today,
        level:      info.level,
        label:      info.label,
        color:      info.color,
        authorized: info.authorized,
        source:     'Préfecture — Frequence-sud.fr',
      }),
      { headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: 'error', message: (err as Error).message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }
});
