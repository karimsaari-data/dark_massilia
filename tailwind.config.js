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
          DEFAULT: '#050505',
          light: '#0a0a0a',
          blue: '#0d1a2d',
        },
        ocean: {
          teal: '#21c47b',
          blue: '#0091ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 4.5s ease-in-out infinite alternate',
      },
      keyframes: {
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
            boxShadow: '0 0 26px rgba(33, 196, 123, 0.6), 0 0 20px rgba(0, 145, 255, 0.3)',
            transform: 'translateY(0)',
          },
          '100%': {
            boxShadow: '0 0 46px rgba(33, 196, 123, 1), 0 0 30px rgba(0, 145, 255, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
  plugins: [],
}
