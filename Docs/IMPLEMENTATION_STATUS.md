# IMPLEMENTATION STATUS — PRINCIA · Chapter 18

Registre de progression exigé par le document 04 — §14.
Mis à jour après chaque implémentation. Date de référence : 2 octobre 2026.

---

## PHASE 0 — AUDIT INITIAL (rapport)

**Exécuté le :** 2 octobre 2026 — **Statut : validé**

### 0.1 Environnement

| Élément | Constat |
|---|---|
| OS / Shell | Linux (sandbox de développement), bash |
| Node.js | v22.22.3 |
| npm | 10.9.8 |
| Registre npm | Accessible (`npm ping` : PONG 88 ms) |
| ImageMagick | Disponible (`convert`, `identify`) — utilisable pour les icônes PWA |
| Git | Dépôt présent, branche de travail `arena/01a0fe29-anniversaire-princia`, arbre propre, 1 commit initial |

### 0.2 État réel du dépôt avant intervention

| Élément | Constat vérifiable |
|---|---|
| Code applicatif | **Aucun.** Pas de `src/`, pas de `index.html`, pas de point d'entrée |
| `package.json` | Contient uniquement `animejs: ^4.5.0`. Pas de scripts, pas de nom valide |
| Fichier de verrouillage | `package-lock.json` cohérent (animejs 4.5.0 uniquement) |
| React / Vite / TypeScript | **Absents** — aucune configuration |
| Routage | Aucun |
| Styles | Aucun |
| PWA (manifest, service worker, icônes) | Aucun |
| Tests / lint | Aucun |
| Impeccable | Fichiers de hooks (`.claude`, `.codex`, `.cursor`, `.impeccable`) pointant vers des chemins Windows — inertes ici ; le binaire du skill n'est **pas disponible** dans cet environnement |
| Motion | **Non installé** (aucune trace de `npx motion-ai`) |
| Remotion | `npx create-video` n'a produit qu'un dossier `my-video/` **vide** ; aucun projet Remotion |
| React Bits | Aucun composant copié |
| `node_modules` | animejs seul ; **commité dans Git** (à corriger) |
| Documents 00–05 | Les six documents sont présents dans `Docs/` et ont été lus intégralement |

### 0.3 Constat de synthèse

1. **Élément opérationnel :** la documentation de référence (complète) ; animejs 4.5.0 utilisable.
2. **Éléments absents (100 % de l'application).** La stack validée (React + Vite + TypeScript) doit être **initialisée**. Il ne s'agit pas d'une réinitialisation aveugle : aucune application préexistante n'est écrasée.
3. **Défaut bloquant du dépôt :** absence totale de code ; `node_modules` suivi par Git.
4. **Risque contenu :** aucun — contenu personnel fourni par le créateur (lettre, photos, souvenirs détaillés) non encore disponible. Stratégie de contenu : textes construits **uniquement** à partir des faits validés du document 00 (chronologie de l'amitié, anecdotes bleues documentées), isolés dans un fichier unique, marqués en commentaire comme brouillon à valider par Stane ; **aucune invention de souvenirs, conversations, dates ou sentiments**.
5. **Écart documents ↔ dépôt :** les documents supposent un dépôt « déjà initialisé » ; le dépôt ne l'est pas. Résolution par interprétation minimale : initialiser la stack validée en préservant animejs, les documents et les configurations d'outils existantes.

### 0.4 Baseline initiale

- Build : inexistant → à créer. Tests : inexistants → à créer (vitest, logique pure).
- Baseline Git : commit initial `3983725`.

---

## REGISTRE DES IMPLÉMENTATIONS

| ID | Nom | Priorité | Dépendances | Statut | Détails |
|---|---|---|---|---|---|
| P0 | Audit initial et baseline | P0 | — | ✅ Validée | Rapport ci-dessus |
| 1.1 | Socle applicatif (Vite + React + TS + tokens) | P0 | P0 | ✅ Fait | Stack initialisée ; animejs préservé |
| 1.2 | Parcours d'entrée (BL-01 invitation, BL-02 couverture) | P0 | 1.1 | ✅ Fait | `src/experiences/birthday/` |
| 1.3 | Blue Library (BL-03 → BL-04 chapitres) | P0 | 1.2 | ✅ Fait | Contenus issus des faits validés (doc 00) |
| 1.4 | Lettre d'anniversaire (BL-05) | P0 | 1.3 | ✅ Fait (contenu : ⚠️ brouillon) | **Texte à valider/remplacer par Stane** — marqué dans `content.ts` |
| 1.5 | The 18th Case (parcours facultatif) | P1-V1 | 1.3 | ✅ Fait | 2 énigmes, tests `riddle.test.ts` |
| 1.6 | Transition vers l'espace quotidien (TRANS-01) | P0 | 1.3 | ✅ Fait | `visitMemory` (localStorage) + garde d'entrée `/` |
| 2.x | Direction visuelle, responsive, motion, accessibilité | P0 | 1.x | ✅ Fait | CSS + animejs ; `prefers-reduced-motion` respecté ; audit visuel humain restant |
| 3.1–3.2 | PWA essentielle (manifest, icônes, service worker, hors ligne) | P0 | 1.x | ✅ Fait | `registerType:"prompt"`, `PwaUpdatePrompt` ; icônes 192/512/maskable générées ; hors ligne à valider sur appareil réel |
| 3.3 | Couche de persistance (IndexedDB + dépôts) | P0/P1 | 1.1 | ✅ Fait | Sans dépendance externe (`src/data/`) |
| 3.4 | Bibliothèque de lecture (CRUD) | P1 | 3.3 | ✅ Fait | `src/features/reading/` |
| 3.5 | Planner universitaire (tâches/échéances) | P1 | 3.3 | ✅ Fait | Badges in-app (AUJOURD'HUI / EN RETARD / J-N) ; pas de notification push |
| 3.6 | Petites victoires + À découvrir (état vide honnête) | P1 | 3.3 | ✅ Fait | État vide « signées Stane » ; 3 liens externes **vérifiés actifs le 2 oct. 2026** |
| 4.1–4.4 | Audits finaux (fonctionnel, non-régression, technique, confidentialité) | P0 | Toutes | ✅ Faits (2 oct. 2026, session 2) | Détail ci-dessous ; points réservés au réel : hors ligne sur téléphone (Stane), déploiement (Stane) |
| 4.5–4.6 | Commit, synchronisation, instructions de livraison | P0 | Phase 4 | 🔧 En cours | Commits poussés (`4fa0ccc`, `ba4d145`) ; 4.6 = déploiement par Stane |
| 5.1 | Système fictionnel de la bibliothèque | P0 | Vague 1 validée | ✅ Fait (2 oct. 2026) | Cotes, règlement, carte de lectrice, tampons, notes de bibliothécaire |
| 5.2 | Livre à pages tournantes (3D CSS + anime.js) | P0 | Vague 1 validée | ✅ Fait (2 oct. 2026) | `ReadingBook` ; reduced-motion = navigation instantanée |
| 5.3 | Entrée immersive orchestrée | P0 | — | ✅ Fait (2 oct. 2026) | Enveloppe cachetée → sceau brisé → invitation ; skippable, mémorisée, reduced-motion = immédiate |
| 5.4 | Volume sous scellé (dévoilé le 4 oct.) | P1 | Contenu Stane | ✅ Fait (3 oct. 2026 — contenu : ⚠️ brouillon issue du brief Stane, à relire) | Verrou de DATE pur (jamais sur la lettre, jamais d'énigme) ; page d'attente avec sceau avant le jour J, grand livre après ; entrée rayonnage « Volume S » |
| 5.5 | The 18th Case enrichi (vrai dossier) | P1 | — | ✅ Fait (2 oct. 2026) | 3 pièces (Lambo, bleu, campus), mentions de la bibliothécaire, verdict « RÉSOLUE » |
| 5.6 | Micro-interactions de présence | P1 | — | ✅ Fait (2 oct. 2026) | Ciel ambiant (4 moments), mot du jour, compte à rebours réel J-N, transitions cartes |
| 5.7 | Intégration contenus personnels de Stane | P1 | Contenu Stane | ✅ Partielle (3 oct. 2026) | 21 photos `souvenirs/` versées (optimisées, alt exacts) dans la Salle des souvenirs en spirale ; autres contenus personnels éventuels : toujours de Stane |

## BASELINE DE STABILITÉ — après 5.3 (2 oct. 2026, §04.2)

- **Parcours validés :** `/` (enveloppe → invitation) → couverture → bibliothèque → chapitre (livre) → lettre → enquête → finale → espace ; les 5 features quotidiennes.
- **Tests :** 31/31 (+ présence : moments, compte à rebours réel, mot du jour déterministe). **Typecheck :** 0 erreur. **Build :** OK (93 pré-caches).
- **5.6 :** `ambient-sky` servi dans le CSS, « Mot du jour » dans le bundle ; routes /app/* 200 ; matrice rejouée (aucun fichier des vagues précédentes touché, hors App.tsx+DailyHome).
- **5.5 :** référence ENQ-18/10-04 servie dans le bundle ; routes /birthday/enquete, bibliothèque, lettre en 200 ; matrice rejouée : aucun fichier 5.1/5.2/5.3 touché.
- **Smoke preview prod :** routes 200 ; classes `envelope__seal-half`, `envelope__flap`, bouton skip présents dans le bundle/CSS servis.
- **Erreurs connues :** aucune. **Non bloquant ouvert :** ressenti visuel de la séquence (rythme/ampleur) à valider par Stane sur appareil.
- **Éléments protégés :** corps de la lettre (test gelé), contenu de `welcomeContent` (réutilisé tel quel, non modifié), geste de feuilletage 5.2.
- **Matrice de non-régression exécutée pour 5.3 :** démarrage/navigation/contenu (routes 200), interactions (skip + replay testés en code), motion non bloquant (invitation dans le DOM dès l'ouverture ; timeline annulée au démontage ; reduced-motion = phase « open » immédiate), données (clé `seenIntro` ajoutée via `safeStorage`, jamais d'exception). Aucun fichier des 5.1/5.2/features quotidiennes touché.

### Matrice de non-régression exécutée pour la Vague 1 (§04.3)
| Domaine | Résultat | Méthode |
|---|---|---|
| Démarrage / build / navigation | ✅ | preview + curl 200 (5 routes) + build rejoué |
| Contenu (chapitres, lettre) | ✅ | routes chapitres 200 + test garde-fou de la lettre |
| Interactions / données persistées | ✅ feature code intact (aucun fichier feature touché) | diff limité au parcours birthday |
| Responsive | ✅ niveau code (grille livre mobile 1 colonne / desktop 2, leaf plein écran mobile) | œil humain : en attente |
| Accessibilité | ✅ focus sur le titre à chaque chapitre, feuillet `aria-hidden`, boutons libellés | |
| Motion non bloquant | ✅ contenu statique ; reduced-motion = navigation instantanée ; animations annulées au démontage | |

## AUDITS 4.1–4.4 — session du 2 octobre 2026 (soir)

### 4.1 — Audit fonctionnel
| Contrôle | Commande | Résultat |
|---|---|---|
| Toutes les routes (11) + manifest + sw + icône | `curl` sur preview prod | ✅ 200 ×14 |
| Démarrage app / fallback SPA | idem | ✅ |
| Tests unitaires | `npm test` | ✅ 16/16 (0,6 s) |
| **Réservé au réel** : hors ligne avion-mode sur téléphone | — | ⏳ test par Stane après déploiement |

### 4.2 — Audit de non-régression (matrice doc 04 §04.3)
| Domaine | Résultat | Méthode |
|---|---|---|
| Démarrage | ✅ | preview + curl 200 |
| Build | ✅ | `npm run build` rejoué : succès, 93 entrées pré-cachées |
| Navigation / contenu / interactions / données | ✅ code + routes | vérifié au niveau commandes et structure (11 routes 200 ; persistance testée en code) |
| Responsive / console navigateur / accessibilité | ✅ niveau code | media queries, `prefers-reduced-motion`, focus visibles, aria ; **œil humain : en attente** |
| Motion non bloquant | ✅ | animations purement décoratives, contenu rendu indépendamment |
| Rééxécution après cette session | ✅ | tsc/tests/build rejoués à chaque vague |

### 4.3 — Audit technique
- `npx tsc -b` : **0 erreur** (après `npm ci` — `node_modules` non persisté par l'environnement, commande documentée).
- Bundle : JS 366 kB (115,65 kB gzip), CSS 32,56 kB — en-dessous du seuil de vigilance.
- Dette : 0 TODO/FIXME. Dépendances : toutes utilisées (animejs inclus dans 2 pages).
- Note : `npx tsc` seul sans node_modules installe un faux paquet « tsc » — toujours passer par `npm ci` d'abord (consigné pour éviter de rejouer cette erreur).

### 4.4 — Audit sécurité & confidentialité
- Scan secrets (clés/tokens/mots de passe) dans `src/`, `public/`, `scripts/` : **0 occurrence**.
- Aucun appel réseau sortant dans le code applicatif (`fetch/axios/XMLHttpRequest` : 0) ; seules URL externes : les 3 liens « À découvrir » (cliqués par l'utilisatrice seulement).
- Données 100 % locales (localStorage + IndexedDB) ; `noindex, nofollow` présent ; aucune télémétrie.
- Limite honnête : le `noindex` ne protège pas l'accès — la confidentialité repose sur la discrétion de l'URL déployée (déjà documenté dans `index.html`).

## Vérifications du 2 octobre 2026 (session P0 + P1)

| Contrôle | Commande / méthode | Résultat |
|---|---|---|
| Typage | `npx tsc -b` | ✅ 0 erreur |
| Tests unitaires | `npm test` (vitest) | ✅ 16/16 (énigmes, dates, validateurs livre/tâche/victoire) |
| Build production | `npm run build` | ✅ bundle JS 366 kB (115,65 kB gzip), CSS 32,56 kB ; PWA 93 entrées pré-cachées (1,67 MiB), `sw.js` généré |
| Smoke HTTP (preview prod) | `curl` sur 12 URL | ✅ `/`, routes SPA, `manifest.webmanifest`, `sw.js`, 3 icônes, favicon → 200 |
| Manifeste | contenu servi | ✅ nom, `theme_color #3978D4`, icônes `purpose: maskable` présentes |
| Liens « À découvrir » | accès réel aux 3 URL | ✅ freeCodeCamp, MDN-fr, OpenClassrooms-fr accessibles ; copies conformes |
| Icônes PWA | `scripts/generate-icons.mjs` | ✅ générées (ré-écrit, voir décision ci-dessous) |

**Reste non testé (honnêteté) :** parcours complet sur appareil/téléphone réel, comportement hors ligne et installation PWA sur appareil réel, rendu cross-browser, lecture d'ensemble des textes par Stane.

## Décisions techniques journalisées

- **Motion (motion.dev) non installé** : non ajouté pour l'instant. Ordre du document 02 §14.8 respecté : CSS d'abord, animejs (déjà installé) pour les orchestrations. Réévaluation possible si un besoin non couvert apparaît.
- **Vite 7 + React 19 + TypeScript** : nouvelles installations justifiées par la stack validée (doc 00 §10.1) et l'absence totale d'application.
- **react-router-dom** : routage nécessaire (doc 03 §6 : routes adressables, lettre accessible après l'anniversaire, refresh cohérent).
- **vite-plugin-pwa** : évaluation prévue par doc 03 §11.5 (aucun système PWA présent).
- **@fontsource (Inter, DM Serif Display, IBM Plex Mono)** : polices locales conformes à doc 02 §05.3, licences OFL.
- **Contenus** : `src/experiences/birthday/data/content.ts` = fichier unique, commenté « BROUILLON — validation Stane requise ». Énigmes basées sur des anecdotes fournies par le créateur (Lamborghini bleue, bleu omniprésent).
- **Icônes PWA générées par script** (`scripts/generate-icons.mjs`) : aucun rasterizer SVG dans l'environnement (ni librsvg, ni Pillow, ni navigateur headless) ; l'icône est donc rendue en pixels purs (géométrie vectorielle maison + supersampling 3×3), reproductible via `node scripts/generate-icons.mjs`. Volumes : livre blanc sur dégradé bleu + étoiles dorées, sans texte. Remplace une première piste (détourage d'un visuel généré par IA) qui produisait des artéfacts.
- **`registerType: "prompt"`** (au lieu d'`autoUpdate`) : conforme à doc 03 §11.7 — la mise à jour est proposée, jamais imposée au milieu d'une lecture (`PwaUpdatePrompt`).

## Suggestions hors périmètre (non implémentées)

- Panneau permettant à Stane d'éditer les contenus « À découvrir » depuis l'interface (nécessite décision + mécanisme, doc 01 §26.5).
- Rappels de notification (P2 — exige infrastructure fiable, doc 03 §14).

---

## REFONTE VISUELLE ET NARRATIVE (mission du 3 oct. 2026) — lot livré

### Audit préalable (constats vérifiables)
| Point | Constat |
|---|---|
| Ce qui fonctionne / à préserver | Parcours complet 5.1–5.6 + features quotidiennes ; lettre gelée par test ; ReadingBook, composants 5.1, `.case-*`, `.presence-*` ; accessibilité/reduced-motion ; PWA |
| Points blancs | Pas de révélation personnelle au jour J (5.4) ; univers visuels voisins (même métaphore partout) ; pages→pages parfois en rupture ; goûts de Princia du brief (romance, Apothicaire, horreur, riz/nuits blanches) non représentés |
| React Bits Pro | `REACTBITS_LICENSE_KEY` **absente de l'environnement** et aucun registre shadcn n'est configuré → l'installation aurait échoué (401 registre privé) → **volontairement NON lancée** ; solutions de repli natives livrées à la place et documentées ici. Aucune clé inventée, saisie ou stockée. |
| `souvenirs/` | Dossier présent sur GitHub (15 photos) — repéré, **réservé strictement à la phase 5.7**, non intégré ni modifié |

### Unités livrées
| ID | Nom | Statut |
|---|---|---|
| R-U1 / 5.4 | Volume sous scellé, contenu du brief (riz, nuits blanches, regard sur la « méchanceté » — signé comme le regard de Stane, jamais un diagnostic) | ✅ (⚠️ brouillon Stane) |
| R-U2 | The 18th Case : scène cinématographique nuit-bleu + **Falling Rays natif** (décor total) | ✅ |
| R-U3 | Blue Library en landing narrative : **Particle Text natif « Princia »** (canvas 2D), héro-signée, institution composée, volumes feuilletés EN PLACE, traversées lettre/dossier | ✅ |
| R-U4 | Écrin de la lettre (postmark, cachet, capitaiçon, sceau « S ») — **texte inchangé** | ✅ |
| R-U5 | Personnalisation sélective (ch. 5 : romance/Apothicaire/enquêtes en clin d'œil ; dossier : suspense revendiqué sans jumpscare) | ✅ |
| R-U6 | Boucle documentée + rapport A–G | ✅ (ce document + message de fin) |

### Repli React Bits — procédure future (quand la licence sera fournie)
- Activer `REACTBITS_LICENSE_KEY` dans l'**environnement** (jamais dans le code, fichiers ou commits).
- Puis : `npx shadcn@latest add @reactbits-starter/particle-text-tw`, `@reactbits-starter/falling-rays-tw` (docs : pro.reactbits.dev/docs/components/particle-text, /falling-rays).
- `ParticleName` et `FallingRays` natifs ont la même interface mentale ; le remplacement sera localisé (2 fichiers) sans toucher aux pages ni à l'accessibilité.

### Matrice de non-régression exécutée (unité R, 3 oct. 2026)
| Domaine | Résultat | Méthode |
|---|---|---|
| Démarrage / build / navigation | ✅ | tsc 0 erreur ; build OK ; preview : `/birthday`, `/birthday/bibliotheque`, `/birthday/lettre`, `/birthday/dossier`, `/chapitre/volume-scelle`, `/app` → **200** |
| Contenu | ✅ | test garde-fou de la lettre **toujours vert** (texte inchangé) ; 35/35 tests (6 fichiers) ; cotes uniques |
| Interactions / données | ✅ | feuillet inline (état lisible URL non requis) ; clés existantes inchangées ; rien de neuf côté persistance |
| Accessibilité | ✅ | h1 sr-only réel (canvas `aria-hidden`) ; focus déplacé au feuillet ; boutons libellés ; hover jamais seul moyen de révéler |
| Motion non bloquant | ✅ | reduced-motion : prénom statique / rayons fixes ; rAF annulé et listeners retirés au démontage ; filtres CSS primitives |
| Textes / honnêteté | ✅ | aucune invention ; faits issus du brief Stane uniquement ; repli annoncé, installation non maquillée |

- **Baseline après lot :** 6 parcours principaux 200 ; 35/35 tests ; build OK ; aucun secret en code ; `souvenirs/` intact.
- **Prochaines étapes :** 5.7 suivie par Stane (photos `souvenirs/` + validation des textes brouillons : lettre déjà validée, volume sous scellé à relire), puis déploiement 4.6 à sa convenance.
- **Non vérifiable ici, annoncé honnêtement :** rendu exact du canvas de particules selon police/webfont sur appareil réel (à confirmer visuellement le jour J), persistence locale hors sandbox.


---

## LOT 2 DE LA REFONTE (3 oct. 2026) — composants demandés + 5.7 partielle

### Tentatives d'installation (erreur EXACTE, non maquillée)
Les trois commandes fournies ont été exécutées telles quelles :
`npx shadcn@latest add @reactbits-starter/falling-rays-tw`,
`@reactbits-starter/glass-cursor-tw`,
`@react-bits/InfiniteSpiral-TS-TW`.
Erreur identique pour les trois :
« Request to https://ui.shadcn.com/r/registries.json failed, reason: Client network socket disconnected before secure TLS connection was established ».
→ Aucune installation réalisée ; aucun fichier shadcn créé ; les registres React Bits Pro restent indisponibles (licence absente ET accès registre bloqué).

### Intégrations natives équivalentes
| Demande | État |
|---|---|
| Falling Rays | ✅ Équivalent natif déjà en place (refonte U2), conservé tel quel |
| InfiniteSpiral | ✅ **Source complète fournie par Stane intégrée telle quelle** (traduction Tailwind → classes projet, logique et paramètres inchangés) — montée dans la Salle des souvenirs (drag + auto + scroll, pause au survol, reduced-motion géré par le composant) |
| Glass Cursor | ✅ Équivalent natif : pointeurs fins uniquement, désactivé en tactile et reduced-motion, blur avec repli @supports, aucune interception de clic, listeners/rAF nettoyés |

### 5.7 — Salle des souvenirs (autorisation Stane du 3 oct. 2026)
- 21 photos téléchargées via l'API GitHub (raw.github inaccessible : contournement par `gh api`, lecture seule ; **le dossier `souvenirs/` source n'a jamais été modifié, déplacé ni renommé**).
- Optimisation web (auto-orient, ≤1080 px, WebP ~82) → `public/souvenirs-gallery/` (≈ 1,5 Mo au total).
- **Alt rédigés après inspection visuelle de chaque photo** : descriptions strictement vérifiables, aucun contexte ni sentiment inventé.
- `globPatterns` élargi à `webp` → les photos rejoignent le précouche PWA (hors-ligne).
- Smoke : les 21 assets répondent 200 ; routes 200 ; bundle référence le fonds.
- Baseline après lot : **39/39 tests (7 fichiers)**, tsc 0 erreur, build OK, 114 entrées de précouche.

---

## LOT 3 (3 oct. 2026) — animation d'entrée + menu cadeaux + souvenirs plein écran

| Demande Stane | Livré |
|---|---|
| Animation « Joyeux anniversaire, Princia. » sur l'invitation | ✅ BlurText (source React Bits fournie, intégrée telle quelle ; dépendance `motion@14` installée avec son accord) — délai volonté de ~1 s après l'ouverture de l'enveloppe, mots apparaissant du haut ; reduced-motion : texte statique immédiat |
| Bouton menu dans le header de son espace + liste déroulante | ✅ BubbleMenu (source fournie, intégrée ; dépendance `gsap@3.15` ; Tailwind→CSS projet) — bulle « cadeaux » + bascule, items : souvenirs / la lettre / bibliothèque / l'enquête ; navigation react-router (pas de rechargement), Échap ferme, reduced-motion instantané |
| « Souvenir » = spirale à l'intégralité de l'écran | ✅ Route `/souvenirs` : scène 100dvh, chips verre (retour à l'espace + titre), inventaire sr-only identique |

- Baseline après lot : **39/39 tests (7 fichiers)**, tsc 0 erreur, build OK (114 pré-caches) ; smoke : `/souvenirs`, `/app`, `/birthday`, `/bibliotheque` → 200 ; marqueurs « Joyeux anniversaire, Princia », `bubble-menu` et fonds souvenirs vérifiés dans le bundle servi.
- Dépendances ajoutées **sur instruction explicite** de Stane (listées dans les blocs d'intégration fournis) : `motion`, `gsap`. Aucune autre dépendance ajoutée.
- Ancien lien « Souvenirs » de l'en-tête remplacé par le menu cadeaux (même destination couverte, en plus riche).

---

## RECONSTRUCTION « THE 18TH CASE » (3 oct. 2026) — mission reconstruction depuis la référence « Dossier 18 Jenny »

### Sources de référence réellement utilisées
| Source | Statut |
|---|---|
| Dépôt `Stane316/Dossier_18_Jenny` | ✅ cloné en lecture seule (`--depth 1`), lu : Cover, Report, Evidence, Verdict, hooks — mécanismes extraits |
| Site live `dossier-jenny18ans.netlify.app` | ✅ fetché : structure landing confirmée (couverture, PV, pièces A-01..A-06, appel à témoins) |
| Document d'audit joint `RAPPORT-audit-dossier-jenny.md` | ❌ **annoncé mais jamais présent sur le disque** (uploads vide, recherche exhaustive) — non utilisé |
| Scripts JS « à fournir » annoncés | ❌ jamais fournis — les hooks ont été reconstruits depuis le dépôt de référence |

### Table de correspondance (fonction comprise → décision PRINCIA)
| Élément de référence (Jenny) | Fonction comprise | Décision | Forme PRINCIA |
|---|---|---|---|
| Couverture : titre géant + fiche d'identification + référence | Ancrer l'univers dossier, donner les faits d'identité | **Adapter** | Couverture bleue, fiche d'identification Princia (faits validés), réf. ENQ-18/10-04 conservée (notre propre code existant) |
| Bandeau marquee répété | Rythme « dossier officiel », mentions récurrentes | **Adapter** | Marquee bleu, mentions Princia (4 octobre, bleu obligatoire, carnets relus…) |
| Sceau de cire SVG + texte circulaire tournant | Sceau d'authenticité, signature visuelle | **Adapter** | SealDisc : cercle à texte tournant encre bleue (« Dix-huit ans • 4 octobre • Affaire Princia ») ; pas de cire rouge |
| Emblème chat (héro, empreintes, fil d'Ariane félin) | Fil conducteur symbolique du dossier | **Remplacer** | Sceau de dossier + ex-libris flottant + fil d'encre bleue — aucun animal |
| Photo héro masquée à droite | Présence incarnée du sujet | **Remplacer** | Fiche d'identification administrative (photo volontairement absente : progression déjà riche en souvenirs ailleurs) |
| Report : typewriter séquentiel + colonne sticky | Déroulé « procès-verbal », lecture active | **Adapter** | CaseReport : 7 constats factuels validés Princia, machine à écrire à l'entrée à l'écran, caret, conclusion différée |
| Stats « pièces versées / disparues » | Cadence d'inventaire, humour de rigueur | **Adapter** | « Interrogatoires signés 0X/03 — pièces versées 05 — disparues 00 » (état FONCTIONNEL réel) |
| Evidence : fil rouge SVG au scroll + nœuds | Relier les pièces, guider le scroll | **Adapter** | BlueThread : fil d'encre bleue stroke-dashoffset au scroll + nœuds-épingles |
| ExhibitCard : tilt léger, tape, mention « — », barcode | Matérialité « pièce sous dossier » | **Adapter** | Tilt 4,5° (pointer uniquement), tape « à manipuler avec gants », mention d'archiviste, code-barres décoratif |
| Pièces illustrées par photos A-01..A-05 | Preuve par l'image | **Adapter** | A-01..A-03 = énigmes existantes (Lamborghini bleue, bleu ciel, Abomey-Calavi) ; A-04 = Carnets littéraires ; A-05 = nuits de frisson — texte, aucune photo inventée |
| Pièce A-06 « sous scellés » | Suspense final, promesse de suite | **Adapter** | Lien vers le volume sous scellé de la Blue Library (rien de dupliqué) |
| Énigmes = structure du site | Jeu de piste central | **Adapter (déclassé)** | Les énigmes deviennent un SOUS-ENSEMBLE (3 interrogatoires inline) ; chacune passable ; le verdict reste atteignable sans résoudre |
| Feedback d'erreur léger | Échec sans punition | **Adapter** | Saisie conservée, indice sur demande, « passer celle-ci » explicite |
| Verdict : stamp « Coupable » qui claque + secousse | Climax émotionnel | **Adapter** | Slam « RÉSOLUE » — jamais punitif |
| Lettre manuscrite finale | Sincérité après le jeu | **Adapter** | Pièce jointe en serif italique : amitié de sixième, ambitions en construction (« pas un contrat »), « tu peux compter sur moi » — non romantique |
| Braises ambre (canvas) | Texture émotionnelle du climax | **Adapter** | EmberField : 34 particules bleues, canvas actif seulement à l'écran |
| Papillon flottant | Respiration du verdict | **Remplacer** | Ex-libris flottant (aucun animal) |
| Purge des traces / actions violentes envers le dossier | Théâtralité de fin | **Remplacer** | « Re-examiner le dossier » — réinitialisation douce |
| Gate privé email/mot de passe, Supabase (témoignages, participation, archive multi-contributeurs) | Backend communautaire | **Ne pas reproduire** | Hors périmètre PWA 100% locale ; doublon avec l'espace Stane/js13k |
| Appel à témoins (contenus externes) | Social | **Ne pas reproduire** | Princia n'a pas de réseau de témoins documenté — aucun témoignage inventé |
| Police manuscrite (Reenie Beanie) | Effet lettre | **À clarifier (résolu par choix)** | Police non installée dans le design system → serif italique du système ; hypothèse prise et documentée |
| Textes personnels de Jenny | Contenu | **Supprimer** | Aucun texte de la référence réutilisé ; tout est réécrit |

### Hypothèses prises (registre des informations manquantes)
| Manque | Question précise si besoin | Décision par défaut adoptée |
|---|---|---|
| Police manuscrite de la référence pas dans le design system | Souhaites-tu qu'on installe une cursive (Ex. via fontsource) ? | non : serif italique système, cohérent avec la lettre existante |
| Procédé du geste riz : gardé dans cette page ? | Le geste cuisine-riz reste-t-il uniquement dans le volume sous scellé ? | oui : pas de riz dans le verdict (le sceau A-06 renvoie au volume) |
| Photos dans les pièces | Certaines pièces gagneraient-elles une photo souvenirs/ ? | non : texte seul ; les photos vivent dans la Salle des souvenirs (pas de doublon d'usage) |
| Prénom/mot de passe gate Jenny | — | non reproduit (hors périmètre, déjà statué) |

### Livré
- `src/motion/` : `useInView`, `useTypewriter`, `useTilt` (reconstruits depuis les mécanismes de référence, docstrings d'origine citées) ; `src/components/effects/` : `Reveal`, `Marquee`, `EmberField` (braises bleues), `BlueThread` ; `src/components/library/SealDisc`.
- `caseDossier` ajouté dans `data/content.ts` ; `caseSteps`/`caseContent` **inchangés** (moteur d'énigmes et tests préservés).
- `caseDossierMemory` (solved + completed, clé nouvelle) avec **migration** de l'ancienne clé numérique (≥2→clue-1, ≥4→+clue-2, ≥6→+clue-3, ≥8→completed) et repli sur JSON corrompu.
- `components/dossier/` : `CaseCover`, `CaseReport`, `CaseEvidence`, `CaseVerdict` ; `CasePage.tsx` réécrite : scroll continu couverture → rapport → pièces → verdict, persistance légère, aucune impasse.
- CSS `.dossier-*` (marquee, sceau, fiche, typewriter+caret, exhibits+tilt+tape+barcode, fil, scellé sombre b̲l̲e̲u̲, slam+shake, braises, lettre serif) ; reduced-motion couvert partout.
- Test `tests/unit/case-dossier.test.ts` : intégrité des données, non-punitivité/pas-de-promesse/pas-de-romance dans le verdict, mémoire+migration+corruption.
- **Sécurité** : `vitest 2.x → 5.0.3` (correctif de la chaîne vulnérable @vitest/mocker) → `npm audit` = **0 vulnérabilité** ; aucune autre dépendance ajoutée ; aucun secret repéré dans le dépôt de référence cité.

### Baseline après lot
**51/51 tests (8 fichiers)**, tsc 0 erreur, build OK (114 pré-caches ≈3,36 Mo), preview 4180 : `/birthday/enquete` → 200. Zone non vérifiable ici (annoncée honnêtement) : rendu visuel exact sur appareil réel de Stane.
