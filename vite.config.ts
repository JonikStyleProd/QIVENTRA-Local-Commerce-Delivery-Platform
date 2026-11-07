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
          'icons/qiventra-favicon-v3-32.png',
          'icons/qiventra-apple-touch-v3-180.png',
          'icons/qiventra-icon-v3-192.png',
          'icons/qiventra-icon-v3-512.png',
          'icons/qiventra-maskable-v3-192.png',
          'icons/qiventra-maskable-v3-512.png',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png'
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
          background_color: '#FFD84D',
          theme_color: '#FFF8EC',
          icons: [
            {
              src: '/icons/qiventra-icon-v3-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/qiventra-icon-v3-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/qiventra-maskable-v3-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icons/qiventra-maskable-v3-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webmanifest}', 'brand/*.webp'],
          // The interface uses WebP logos. PNGs in brand/ are sources and fallbacks; app icons live in icons/.
          globIgnores: ['brand/*.png'],
          // Photos and fonts are cached on first view rather than precached: an installed
          // PWA keeps its look offline without a 2 MB download on the first visit.
          runtimeCaching: [
            {
              urlPattern: /\/photos\/.+\.webp$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'collage-photos',
                expiration: { maxEntries: 60 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'collage-fonts',
                expiration: { maxEntries: 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          // React and the router change far less often than the app, so they get their own cached file.
          manualChunks: (id: string) =>
            /node_modules[\\/](react|react-dom|react-router|scheduler|cookie|set-cookie-parser)[\\/]/.test(id) ? 'vendor' : undefined,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
