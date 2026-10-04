import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { detectInstallPlatform } from "../../src/app/PwaInstallCard";

const root = resolve(__dirname, "..", "..");
const read = (relPath: string) => readFileSync(resolve(root, relPath), "utf8");
const readBin = (relPath: string) => readFileSync(resolve(root, relPath));

function readPngDimensions(relPath: string): { width: number; height: number } {
  const buf = readBin(relPath);
  // Signature PNG : 89 50 4E 47 0D 0A 1A 0A
  expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(buf.subarray(12, 16).toString("ascii")).toBe("IHDR");
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

describe("PWA — Manifest, Service Worker et stratégie de cache", () => {
  const viteConfig = read("vite.config.ts");

  it("définit tous les champs requis du Web App Manifest", () => {
    expect(viteConfig).toContain('id: "/"');
    expect(viteConfig).toContain('name: "PRINCIA — Chapter 18"');
    expect(viteConfig).toContain('short_name: "Chapter 18"');
    expect(viteConfig).toContain('start_url: "/"');
    expect(viteConfig).toContain('scope: "/"');
    expect(viteConfig).toContain('display: "standalone"');
    expect(viteConfig).toContain('background_color: "#F7FAFF"');
    expect(viteConfig).toContain('theme_color: "#3978D4"');
    expect(viteConfig).toContain('lang: "fr"');
  });

  it("configure Workbox avec fallback SPA, denylist des fichiers statiques, zéro doublon de pré-cache et nettoyage des anciens caches", () => {
    expect(viteConfig).toContain("includeAssets: []");
    expect(viteConfig).toContain("includeManifestIcons: false");
    expect(viteConfig).toContain('navigateFallback: "index.html"');
    expect(viteConfig).toContain("navigateFallbackDenylist");
    expect(viteConfig).toContain("cleanupOutdatedCaches: true");
    expect(viteConfig).toContain("clientsClaim: true");
    expect(viteConfig).toContain("skipWaiting: true");
    expect(viteConfig).toContain("globIgnores");
  });

  it("détecte correctement la plateforme d'installation PWA sans fausse promesse", () => {
    expect(detectInstallPlatform("Mozilla/5.0 (Linux; Android 14)", true, true)).toBe(
      "installed",
    );
    expect(detectInstallPlatform("Mozilla/5.0 (Linux; Android 14)", false, true)).toBe(
      "native-prompt",
    );
    expect(
      detectInstallPlatform(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15",
        false,
        false,
      ),
    ).toBe("ios-manual");
    expect(
      detectInstallPlatform(
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36",
        false,
        false,
      ),
    ).toBe("android-manual");
    expect(
      detectInstallPlatform(
        "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
        false,
        false,
      ),
    ).toBe("browser-manual");
  });

  it("utilise des chemins d'icônes PNG absolus (/icons/...) compatibles WebAPK Android", () => {
    expect(viteConfig).toContain('src: "/icons/apple-touch-icon.png"');
    expect(viteConfig).toContain('src: "/icons/icon-192.png"');
    expect(viteConfig).toContain('src: "/icons/icon-512.png"');
    expect(viteConfig).toContain('src: "/icons/icon-maskable-512.png"');
  });
});

describe("Icônes et image Open Graph — présence, dimensions et direction artistique", () => {
  it("tous les fichiers d'icônes et l'image Open Graph existent et ont les dimensions exactes", () => {
    expect(existsSync(resolve(root, "public/favicon.svg"))).toBe(true);
    expect(readPngDimensions("public/icons/apple-touch-icon.png")).toEqual({
      width: 180,
      height: 180,
    });
    expect(readPngDimensions("public/icons/icon-192.png")).toEqual({
      width: 192,
      height: 192,
    });
    expect(readPngDimensions("public/icons/icon-512.png")).toEqual({
      width: 512,
      height: 512,
    });
    expect(readPngDimensions("public/icons/icon-maskable-512.png")).toEqual({
      width: 512,
      height: 512,
    });
    expect(readPngDimensions("public/og-share.png")).toEqual({
      width: 1200,
      height: 630,
    });
  });

  it("le favicon SVG et le générateur d'icônes représentent le livre bleu avec la lettre P au centre", () => {
    const svg = read("public/favicon.svg");
    const generator = read("scripts/generate-icons.mjs");
    expect(svg).toContain("#3978D4");
    expect(svg).toContain("#15345B");
    expect(svg).toContain("Médaillon central et lettre P");
    expect(generator).toContain("function sdLetterP");
    expect(generator).toContain("renderOgImage(1200, 630)");
  });
});

describe("Open Graph et SEO adapté au projet", () => {
  const html = read("index.html");
  const robots = read("public/robots.txt");

  it("configure les métadonnées Open Graph, Twitter et le lien canonique provisoire documenté", () => {
    expect(html).toContain('<meta property="og:type" content="website" />');
    expect(html).toContain('<meta property="og:site_name" content="PRINCIA — Chapter 18" />');
    expect(html).toContain('<meta property="og:title" content="PRINCIA — Chapter 18" />');
    expect(html).toContain('<meta property="og:image" content="/og-share.png" />');
    expect(html).toContain('<meta property="og:image:width" content="1200" />');
    expect(html).toContain('<meta property="og:image:height" content="630" />');
    expect(html).toContain('<meta property="og:url" content="https://princia-chapter18.netlify.app/" />');
    expect(html).toContain('<link rel="canonical" href="https://princia-chapter18.netlify.app/" />');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain('<meta name="twitter:image" content="/og-share.png" />');
  });

  it("protège la confidentialité contre l'indexation tout en laissant les aperçus de liens accessibles", () => {
    expect(html).toContain('<meta name="robots" content="noindex, nofollow, noarchive" />');
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    // Aucune photo personnelle de Princia ne doit être exposée en og:image
    expect(html).not.toMatch(/property="og:image"\s+content="[^"]*souvenirs/i);
  });
});

describe("Configuration Netlify — netlify.toml à la racine", () => {
  const toml = read("netlify.toml");

  it("définit la commande de build, le dossier dist et Node 22", () => {
    expect(toml).toContain('command = "npm run build"');
    expect(toml).toContain('publish = "dist"');
    expect(toml).toContain('NODE_VERSION = "22"');
  });

  it("configure le fallback SPA sans intercepter les fichiers statiques (force = false)", () => {
    expect(toml).toContain('from = "/*"');
    expect(toml).toContain('to = "/index.html"');
    expect(toml).toContain("status = 200");
    expect(toml).toContain("force = false");
  });

  it("applique des politiques de cache adaptées à la PWA (HTML/SW/manifest revalidés, assets immuables)", () => {
    expect(toml).toContain('for = "/sw.js"');
    expect(toml).toContain('for = "/manifest.webmanifest"');
    expect(toml).toContain('for = "/index.html"');
    expect(toml).toContain('Cache-Control = "public, max-age=0, must-revalidate"');
    expect(toml).toContain('for = "/assets/*"');
    expect(toml).toContain('Cache-Control = "public, max-age=31536000, immutable"');
  });
});
