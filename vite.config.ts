import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Configuration PWA (doc 03 §11.2 & mission de stabilisation PWA mobile) :
// - chemins d'icônes absolus (/icons/...) et uniquement en PNG raster dans le
//   manifeste pour garantir la génération WebAPK sur Android Chrome sans blocage
//   sur « Installation en cours… » (le favicon SVG reste référencé dans index.html) ;
// - pré-cache initial (precacheAndRoute) léger (~1,2 Mo, 31 fichiers) limité au
//   shell HTML, bundles JS/CSS, polices latines WOFF2, icônes et photo d'ouverture
//   pour que l'événement `install` du Service Worker s'achève rapidement sur mobile ;
// - les 21 photos de la galerie Souvenirs (/souvenirs-gallery/*.webp) sont mises
//   en cache via runtimeCaching (CacheFirst) et préchargées en tâche de fond après
//   l'activation du Service Worker pour rester disponibles hors ligne ;
// - les données personnelles IndexedDB/localStorage restent 100 % séparées du cache
//   Workbox et ne sont jamais supprimées lors d'une mise à jour.
export default defineConfig({
  // host:true + allowedHosts:true : accès possible depuis l'extérieur
  // (preview en ligne, test sur téléphone du même réseau local…).
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Pas de duplication avec globPatterns : toutes les ressources de public/
      // nécessaires au pré-cache initial sont captées une seule fois.
      includeAssets: [],
      includeManifestIcons: false,
      manifest: {
        id: "/",
        name: "PRINCIA — Chapter 18",
        short_name: "Chapter 18",
        description:
          "Une expérience anniversaire personnelle pour Princia, puis un espace quotidien à elle.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#F7FAFF",
        theme_color: "#3978D4",
        lang: "fr",
        dir: "ltr",
        categories: ["books", "lifestyle", "education"],
        icons: [
          {
            src: "/icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2}"],
        globIgnores: [
          "**/og-share.png",
          "**/souvenirs-gallery/*.webp",
          "**/*-cyrillic-*.woff2",
          "**/*-greek-*.woff2",
          "**/*-vietnamese-*.woff2",
          "**/*-devanagari-*.woff2",
        ],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [
          /^\/api\//,
          /\.[a-zA-Z0-9]+$/,
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/souvenirs-gallery\/.*\.webp$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "princia-souvenirs-gallery",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https?:\/\/.*\/assets\/.*\.(?:woff2?|ttf|otf)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "princia-fonts-runtime",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
