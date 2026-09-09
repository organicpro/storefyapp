import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import { PHYSICAL_PRODUCTS_ENABLED } from './src/config/features';

function copyVisiblePublicAssets() {
  const publicRoot = path.resolve(__dirname, 'public');
  const outputRoot = path.resolve(__dirname, 'dist');

  return {
    name: 'copy-visible-public-assets',
    apply: 'build' as const,
    closeBundle() {
      for (const entry of fs.readdirSync(publicRoot, { withFileTypes: true })) {
        if (entry.name === 'velods') continue;
        fs.cpSync(
          path.join(publicRoot, entry.name),
          path.join(outputRoot, entry.name),
          { recursive: true }
        );
      }
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(!PHYSICAL_PRODUCTS_ENABLED ? [copyVisiblePublicAssets()] : [])
    ],
    build: {
      copyPublicDir: PHYSICAL_PRODUCTS_ENABLED
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
