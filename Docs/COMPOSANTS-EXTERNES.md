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

### Plafonds de performance (3 oct. 2026 — GPU à 100 % signalé)

Réglages intégrés dans les composants WebGL (aucune commande à taper) :
`GlowCursor` (verdict) : plan **viewport** au lieu de la section entière (~6× moins de surface), `maxDevicePixelRatio={1}`, `targetFps={30}`, sommeil complet hors écran et à l'inactivité.
`WebThreads` / `GradientWaves` : `dpr: 1`, `resolutionScale` 0.55/0.5 (≈ 4× moins de pixels, l'agrandissement CSS est invisible sur un décor flou), `targetFps={30}`, pause hors écran ; `GradientWaves detail="low"` passe de 40 à 32 étapes de raymarch.
`FoldText` : `will-change` permanent retiré (couches GPU résiduelles), GSAP gère déjà la mise en mémoire pendant l'animation.

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

## Dock du menu de l'espace (3 oct. 2026)

Composant fourni par Stane (React Bits), intégré au **menu existant**
de l'espace (« Mon espace ») — pas de menu parallèle : la liste
historique est remplacée. Mécanique spring/motion intacte
(magnification au survol, tooltip, clavier). Adaptations documentées :

- classes Tailwind → design system bleu (jamais le noir de la démo) ;
- ancrage porté par la nav parente (le Dock reste réutilisable) ;
- `showLabels` : libellés permanents sous les icônes (mobile sans
  survol, lisibilité permanente) ;
- `activeLabel` : la page courante porte `aria-current="page"` et le
  badge bleu majeur ;
- reduced-motion : magnification coupée, menu identique à tailles
  fixes.

## Enquête : retrait du fond WebThreads (3 oct. 2026, prescription)

Stane a tranché : la section enquête renonce entièrement à son fond
WebGL. Retour à l'identité « reconstruction v2 + personnalisation »
sans reculer plus loin : héros, PV, sept faits, clôture, navigation
intacts. Ont aussi été retirés : le rendu différé expérimental des
courts de chapitre (content-visibility), le calage plein-bleed du
héros sur la largeur viewport (désaxait la page avec la barre de
défilement) ; et un filet de sécurité de visibilité a été ajouté aux
révélations au scroll — le contenu prime toujours sur l'effet. Le
composant WebThreads demeure importable (ses gardes de tests restent
actives).
