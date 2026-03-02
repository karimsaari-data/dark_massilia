import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Brotli — prégénère .br pour CSS/JS (servi par .htaccess si dispo)
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i],
      threshold: 1024,           // ne compresse pas les fichiers < 1 kB
    }),
    // Gzip en fallback (navigateurs sans Brotli — très rares aujourd'hui)
    compression({
      algorithm: 'gzip',
      exclude: [/\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i],
      threshold: 1024,
    }),
  ],
  build: {
    // Séparer les gros vendors dans leurs propres chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // Activer la compression des assets
    cssMinify: true,
    minify: 'esbuild',
    // Taille d'avertissement augmentée pour les images
    chunkSizeWarningLimit: 600,
  },
  // Configuration SSR — utilisé par scripts/prerender.js
  ssr: {
    noExternal: ['react-dom'],
  },
})
