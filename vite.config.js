import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Output directory for production build (Vercel reads from 'dist')
    outDir: 'dist',

    // Disable source maps in production to reduce bundle size
    sourcemap: false,

    // Raise the chunk size warning threshold (our bundle is ~500kb, acceptable)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks for better browser caching.
        // When app code changes, users don't re-download React/axios/etc.
        // Vite 8 (rolldown) requires manualChunks as a function, not an object.
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor';
          }
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark') || id.includes('node_modules/react-icons')) {
            return 'ui';
          }
          if (id.includes('node_modules/axios')) {
            return 'http';
          }
        },
      },
    },
  },
})
