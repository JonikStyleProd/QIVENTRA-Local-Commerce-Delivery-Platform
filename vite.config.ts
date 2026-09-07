import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icons/*.png',
          'icons/qiventra-favicon-v2-32.png',
          'icons/qiventra-apple-touch-v2-180.png',
          'icons/qiventra-icon-v2-192.png',
          'icons/qiventra-icon-v2-512.png',
          'icons/qiventra-maskable-v2-192.png',
          'icons/qiventra-maskable-v2-512.png',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'icon.svg',
          'logo.svg'
        ],
        manifest: {
          id: '/',
          name: 'QIVENTRA',
          short_name: 'QIVENTRA',
          description: 'Local commerce and delivery platform for Israel',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait-primary',
          background_color: '#F3F1EA',
          theme_color: '#123B35',
          icons: [
            {
              src: '/icons/qiventra-icon-v2-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/qiventra-icon-v2-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/qiventra-maskable-v2-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icons/qiventra-maskable-v2-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webmanifest}'],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
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
