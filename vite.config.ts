import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-pdf': ['html2pdf.js'],
          'vendor-docx': ['docx', 'file-saver'],
          'vendor-icons': ['@phosphor-icons/react'],
          'vendor-tour': ['react-joyride'],
        },
      },
    },
  },
});
