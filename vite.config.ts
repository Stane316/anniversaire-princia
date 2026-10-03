import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Configuration PWA :
// - le manifeste est généré par vite-plugin-pwa (doc 03 §11.2) ;
// - stratégie de cache : le shell applicatif, les bundles JS/CSS, les polices
//   latines WOFF2, les icônes, la photo d'ouverture et les 21 photos de la
//   galerie Souvenirs sont précachés pour garantir un fonctionnement 100 %
//   hors ligne après la première visite (Blue Library, Enquête, Souvenirs,
//   Lettre, Volume sous scellé et Espace quotidien) ;
// - les sous-ensembles de polices non latins (cyrillic, greek, vietnamese,
//   devanagari), les fichiers .woff historiques et l'image Open Graph de
//   partage réseau (og-share.png) sont exclus du pré-cache pour alléger
//   l'installation (~1,8 Mo économisés) sans retirer aucune ressource utile ;
// - les données personnelles IndexedDB/localStorage restent 100 % locales
//   et ne transitent jamais par le cache HTTP.
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
      // nécessaires hors ligne sont captées une seule fois par globPatterns.
      includeAssets: [],
      includeManifestIcons: false,
      manifest: {
        id: "/",
        name: "PRINCIA — Chapter 18",
        short_name: "Chapter 18",
        description:
          "Une expérience anniversaire personnelle pour Princia, puis un espace quotidien à elle.",
        lang: "fr",
        dir: "ltr",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#F7FAFF",
        theme_color: "#3978D4",
        categories: ["books", "lifestyle", "education"],
        icons: [
          {
            src: "icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
        // Ne jamais intercepter les requêtes directes vers des fichiers
        // statiques (extensions explicites) ni d'éventuels endpoints /api/.
        navigateFallbackDenylist: [/^\/api\//, /\.[a-zA-Z0-9]+$/],
        // Inclut jpeg/jpg et webp : la photo d'ouverture intro (/souvenirs/…jpeg)
        // et les 21 photos de la galerie (/souvenirs-gallery/*.webp) restent
        // disponibles hors ligne comme le reste de la bibliothèque.
        globPatterns: ["**/*.{js,css,html,svg,png,webp,jpg,jpeg,woff,woff2}"],
        globIgnores: [
          "**/*.woff",
          "**/*-{cyrillic,cyrillic-ext,greek,greek-ext,vietnamese,devanagari}-*.woff2",
          "og-share.png",
        ],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
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
      devOptions: {
        enabled: false, // le service worker n'est testé qu'en build (doc 03 §11)
      },
    }),
  ],
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
