import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
