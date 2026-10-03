import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Configuration PWA :
// - le manifeste est généré par vite-plugin-pwa (doc 03 §11.2) ;
// - stratégie de cache : le shell applicatif et les ressources statiques
//   (polices locales, icônes, JSON de build) sont précachés — c'est ce qui
//   garantit l'accès hors ligne au parcours anniversaire (letize comprise) ;
// - les données personnelles IndexedDB ne transitent jamais par le cache HTTP.
export default defineConfig({
  // host:true + allowedHosts:true : accès possible depuis l'extérieur
  // (preview en ligne, test sur téléphone du même réseau local…).
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "PRINCIA — Chapter 18",
        short_name: "Chapter 18",
        description:
          "Une expérience anniversaire personnelle pour Princia, puis un espace quotidien à elle.",
        lang: "fr",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#F7FAFF",
        theme_color: "#3978D4",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
        // Les photos personnelles futures restent hors cache agressif :
        // runtime uniquement à la demande, jamais de pré-cache aveugle.
        globPatterns: ["**/*.{js,css,html,svg,png,webp,woff,woff2}"],
        cleanupOutdatedCaches: true,
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
