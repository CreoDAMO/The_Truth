import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'web',
  base: process.env.NODE_ENV === 'production' ? '/The_Truth/' : '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './web/index.html'
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000
  }
});