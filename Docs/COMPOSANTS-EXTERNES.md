# Composants externes intégrés — dépendances et commandes

> **Règle permanente (demande Stane, 3 oct. 2026)** : tout composant
> intégré qui dépend d'un paquet npm doit être listé ici, avec la
> commande d'installation exacte. Toutes ces dépendances sont **déjà
> dans `package.json`** — un simple `npm install` les récupère — mais
> elles sont rappelées pour une installation manuelle au besoin.

## Tableau des intégrations

| Composant (chemin) | Rôle | Dépendance npm | Commande exacte |
|---|---|---|---|
| `BlurText` (`src/components/text/BlurText.tsx`) | Salut « Joyeux anniversaire, Princia. » lettre par lettre à l'accueil | `motion` | `npm install motion` |
| `GlowCursor` (`src/components/effects/GlowCursor.tsx`) | Traînée lumineuse bleue — verdict de l'enquête **et** galerie souvenirs | `ogl` | `npm install ogl` |
| `BubbleMenu` (`src/components/menu/BubbleMenu.tsx`) | Bouton cadeaux dans l'en-tête de l'espace (menu déroulant bulle) | `gsap` | `npm install gsap` |
| Ouverture de l'enveloppe (`WelcomePage`) | Timeline d'ouverture scellés → rabat → invitation | `animejs` | `npm install animejs` |
| Police manuscrite des lettres (accueil, lettre intime, lettre du verdict) | Écriture cursive lisible des textes intimes | `@fontsource/kalam` | `npm install @fontsource/kalam` |
| `WebThreads` (`src/components/backgrounds/WebThreads.tsx`) | Fond de la section **enquête** : fils tissés à l'encre bleue sur la page (lightMode) | `ogl` | `npm install ogl` |
| `GradientWaves` (`src/components/backgrounds/GradientWaves.tsx`) | Fond de la **bibliothèque** et du **livre des chapitres** : vagues bleu pastel | `ogl` | `npm install ogl` |
| `FoldText` (`src/components/text/FoldText.tsx`) | Nom de chaque **chapitre** déplié panneau par panneau à l'ouverture | `gsap` | `npm install gsap` |

## Composants artistiques sans dépendance externe

Ces pièces sont en CSS/React natif (aucun paquet à installer) :
`FallingRays`, `GlassCursor` (= curseur de la spirale), `InfiniteSpiral`
(galerie souvenirs), `GrainLayer` (grain statique du dossier),
`ParticleName`, `BlueThread`, `Marquee`, `Reveal`,
`ExLibrisStamp`, `SealDisc`, `ReaderCard`, `MarginNote`, `RulesBoard`.

> Retiré au lot du 3 oct. 2026 : `EmberField` (braises du verdict) —
> supprimé pour la fluidité de la section enquête (trois surfaces
> animées superposées : le verdict conserve la traînée GlowCursor et
> le fond WebThreads suffit à l'atmosphère).

## Bases du projet (déjà installées depuis le départ)

- `react`, `react-dom`, `react-router-dom` — application et routage ;
- `@fontsource/inter`, `@fontsource/dm-serif-display`,
  `@fontsource/ibm-plex-mono` — typographies du design system ;
- `vite`, `@vitejs/plugin-react`, `typescript`, `vitest`,
  `vite-plugin-pwa` — outillage (devDependencies).

## Procédure locale (rappel)

```bash
npm install     # récupère TOUT, y compris les dépendances ci-dessus
npm run dev     # lance le serveur local
npm test        # vérifie que toutes les pièces sont en place (122 tests)
npm run build   # génère la version à publier
```
