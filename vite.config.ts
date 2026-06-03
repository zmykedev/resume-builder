import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Only stable, always-needed libs get named chunks for long-lived caching.
          // Heavy export libs (html2pdf, docx) are now dynamic imports — Vite
          // auto-splits them into separate async chunks loaded on demand.
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['@phosphor-icons/react'],
        },
      },
    },
  },
});
