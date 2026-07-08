import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const rawApiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3001';
  const apiBaseUrl = rawApiBaseUrl.startsWith('http')
    ? new URL(rawApiBaseUrl).origin
    : 'http://localhost:3001';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/documents': {
          target: 'http://localhost:3002',
          changeOrigin: true,
        },
        '/api/pipeline/import': {
          target: 'http://localhost:3002',
          changeOrigin: true,
        },
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
  };
});
