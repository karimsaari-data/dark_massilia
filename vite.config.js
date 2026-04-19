import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

/** Plugin local : POST /api/import-photos → lance scripts/import-photos.js */
const importPhotosPlugin = {
  name: 'import-photos-api',
  configureServer(server) {
    server.middlewares.use('/api/import-photos', async (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
      const { spawn } = await import('node:child_process');
      res.setHeader('Content-Type', 'application/json');
      let output = '';
      const child = spawn('node', ['scripts/import-photos.js'], {
        cwd: process.cwd(),
        env: process.env,
      });
      child.stdout.on('data', d => { output += d.toString(); });
      child.stderr.on('data', d => { output += d.toString(); });
      child.on('close', code => {
        res.end(JSON.stringify({ success: code === 0, logs: output }));
      });
    });

    server.middlewares.use('/api/delete-photo', async (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
      const chunks = [];
      req.on('data', d => chunks.push(d));
      req.on('end', async () => {
        const { path: filePath } = JSON.parse(Buffer.concat(chunks).toString());
        const { unlink } = await import('node:fs/promises');
        const { resolve } = await import('node:path');
        const abs = resolve(process.cwd(), 'public', filePath.replace(/^\//, ''));
        res.setHeader('Content-Type', 'application/json');
        try {
          await unlink(abs);
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
    });

    server.middlewares.use('/api/indexnow', async (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
      const { spawn } = await import('node:child_process');
      res.setHeader('Content-Type', 'application/json');
      let output = '';
      const child = spawn('node', ['scripts/notify-indexnow.js'], {
        cwd: process.cwd(),
        env: process.env,
      });
      child.stdout.on('data', d => { output += d.toString(); });
      child.stderr.on('data', d => { output += d.toString(); });
      child.on('close', code => {
        res.end(JSON.stringify({ success: code === 0, logs: output }));
      });
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    importPhotosPlugin,
    // Brotli — prégénère .br pour CSS/JS uniquement (images exclues explicitement)
    compression({
      algorithm: 'brotliCompress',
      include: /\.(js|css|html|json|xml|txt)$/i,
      threshold: 1024,
    }),
    // Gzip en fallback
    compression({
      algorithm: 'gzip',
      include: /\.(js|css|html|json|xml|txt)$/i,
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
