import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'MindTrail',
        short_name: 'MindTrail',
        description: 'Organize and resume multiple creative or technical projects with ease.',
        theme_color: '#8b5cf6',
        background_color: '#0a0a0f',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
    // Sentry plugin must be last
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      // Auth tokens can be obtained from your Sentry organization settings.
      // Do not commit this to your repository.
      // Set it as an environment variable in your CI/CD environment.
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  
  build: {
    sourcemap: true,
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
