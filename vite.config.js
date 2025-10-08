import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-sw',
      closeBundle() {
        const swSrc = join(__dirname, 'web', 'sw.js');
        const swDest = join(__dirname, 'dist', 'sw.js');
        if (existsSync(swSrc)) {
          if (!existsSync(join(__dirname, 'dist'))) {
            mkdirSync(join(__dirname, 'dist'), { recursive: true });
          }
          copyFileSync(swSrc, swDest);
          console.log('✅ Service worker copied to dist');
        }
      }
    }
  ],
  root: 'web',
  base: '/',
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