/**
 * Point d'entrée (doc 03 §5.1 — src/main.tsx).
 * Polices locales auto-hébergées via @fontsource (doc 02 §5.3) :
 * uniquement les graisses réellement utilisées.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/dm-serif-display/400.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/kalam/300.css";
import "@fontsource/kalam/400.css";
import "@fontsource/kalam/700.css";

import "./styles/globals.css";
import { App } from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
