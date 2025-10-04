
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'web',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: false,
    hmr: {
      clientPort: 443
    },
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:5000',
        changeOrigin: true
      }
    }
  }
});
