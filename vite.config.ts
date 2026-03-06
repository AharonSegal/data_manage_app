/**
 * vite.config.ts — Vite build configuration.
 *
 * - @/ alias maps to ./src
 * - Manual chunk splitting keeps large vendor libraries in separate cached chunks:
 *     firebase  — Auth + Firestore SDK
 *     blocknote — editor + shadcn variant (largest single chunk)
 *     vendor    — React, React Router, Framer Motion, date-fns, sonner
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase SDK — large, rarely changes
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // BlockNote — largest single dependency
          blocknote: ['@blocknote/core', '@blocknote/react', '@blocknote/shadcn'],
          // Common vendor libs
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'date-fns', 'sonner'],
          // Phaser game engine — very large, isolated in its own chunk
          phaser: ['phaser'],
        },
      },
    },
  },
});
