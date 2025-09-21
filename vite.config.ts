/// <reference types="node" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@core': path.resolve(__dirname, 'src/packages/core'),
      '@packages': path.resolve(__dirname, 'src/packages'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
});
