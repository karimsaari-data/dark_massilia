/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abyss: {
          DEFAULT: '#0B1C2D', // Deep Blue - océan profond
          light: '#0f2338',    // Légèrement plus clair
          blue: '#0d1a2d',
        },
        ocean: {
          teal: '#00ABA8',     // Turquoise - accent principal
          blue: '#0091ff',     // Bleu action (conservé)
        },
        astroide: {
          DEFAULT: '#FF7F00',  // Orange Astroïde — Astroides calycularis
          light:   '#FF9500',  // Début du gradient
          dark:    '#FF5E00',  // Hover saturé
        },
        // Palette de texte — WCAG AA sur fonds sombres (#0B1C2D)
        text: {
          primary:   '#f8fafc', // slate-50  — titres, ratio ≈ 19:1
          secondary: '#cbd5e1', // slate-300 — corps de texte, ratio ≈ 10:1
          muted:     '#94a3b8', // slate-400 — labels / captions, ratio ≈ 6:1
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'], // Pour les titres
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 4.5s ease-in-out infinite alternate',
        'scroll-left': 'scrollLeft 35s linear infinite',
      },
      keyframes: {
        scrollLeft: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%': {
            boxShadow: '0 0 26px rgba(0, 171, 168, 0.6), 0 0 20px rgba(0, 145, 255, 0.3)',
            transform: 'translateY(0)',
          },
          '100%': {
            boxShadow: '0 0 46px rgba(0, 171, 168, 1), 0 0 30px rgba(0, 145, 255, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
  plugins: [],
}
