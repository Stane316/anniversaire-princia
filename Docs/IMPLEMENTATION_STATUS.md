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

---

## LOT 5 (3 oct. 2026, PM) — correction BlurText + GlowCursor + Falling Rays

### A. BlurText invisible au lancement — CAUSE RACINE trouvée et corrigée
- **Diagnostic** : `motion@14` (dépendance du composant BlurText, lot 3) était déclarée dans package.json et résolue dans le lockfile… mais **physiquement absente de node_modules** (lock npm désynchronisé après le merge d'historiques). Conséquence : `import 'motion/react'` ne résolvait pas → le module BlurText (et donc le salut) ne se montait nulle part. Compagnon de défaillance : `gsap` (BubbleMenu), même cause.
- **Correction** : réinstallation complète → `npm ls` confirme motion 14.0.0 + gsap 3.15.0 + ogl 1.0.11 + animejs 4.5.0 ; Vite pré-bundle `motion_react.js` → 200 ; le bundle de production contient le texte « Joyeux anniversaire, Princia. ».
- **Bugs secondaires corrigés au passage** : `.welcome-greeting` référençait `--font-display` (token INEXISTANT du design system → dégradé CSS) → `--font-serif` ; garde ajoutée : `GreetingBoundary` (ErrorBoundary) — si le moteur d'animation venait à échouer un jour, le message s'affiche en statique avec la même typographie. Test de non-régression `tests/unit/greeting.test.ts` (5 gardes : message exact, montage dès la phase open pour tout visiteur mémorisé ou non, repli statique, reduced-motion, token réel).
- **Rappel du comportement attendu** (inchangé, voulu au lot 3) : première visite → enveloppe à briser, salut ~1 s après l'ouverture ; visites suivantes → ouverture directe, salut immédiat (+1 s). L'entrée `/` bascule vers `/app` une fois l'espace quotidien visité (doc 01 §7.4) : le salut vit sur l'accueil anniversaire, pas sur l'espace.

### B. Audit « Dossier 18 Jenny » annoncé re-joint
- Le système de pièces jointes indique `RAPPORT-audit-dossier-jenny.md` enregistré dans `/home/user/uploads/` — **le répertoire n'existe pas sur le disque** (deuxième occurrence consécutive, vérifié par find). L'audit reste indisponible ; les analyses de la reconstruction reposent donc toujours sur le dépôt cloné en lecture seule et le site live. Aucune conclusion modifiée à ce stade ; je croiserai dès que le fichier arrivera réellement.

### C. GlowCursor (source fournie) — intégré
| Registre | Détail |
|---|---|
| Dépendance | `ogl@1.0.11` (listée dans le bloc fourni) — audit 0 vulnérabilité |
| Source | `src/components/effects/GlowCursor.tsx` — shaders et moteur de traînée INCHANGÉS ; adaptations documentées : Tailwind→classes projet `.glow-cursor*`, accès uniforms par crochets (règle `noPropertyAccessFromIndexSignature` du tsconfig), gardes projet obligatoires (reduced-motion : canvas jamais monté ; try/catch WebGL→contenu seul + console.error), helpers purs hexToRgb/clamp exportés pour les tests |
| Placement | **Section verdict du dossier** (`/birthday/enquete`) — seule zone sombre où le blend `screen` reste visible ; couleurs PRINCIA #8EC5FF→#3978D4, opacity 0.85, hotspot 0.55, pulse 0.9 |
| Cohabitation | GlassCursor (global, verre) reste actif : l'effet GlowCursor est borné à son conteneur (canvas pointer-events:none), aucune interception d'événement ajoutée |
| Non-placements justifiés | couverture claire (screen laverait le texte) et spiral souvenirs (déjà dense) |

### D. Falling Rays — 3e tentative d'installation, mêmes barrières
- Commande exacte ré-exécutée : `npx shadcn@latest add @reactbits-starter/falling-rays-tw` → **même erreur réseau** : « Request to https://ui.shadcn.com/r/registries.json failed, reason: Client network socket disconnected before secure TLS connection was established ». Toujours pas de `REACTBITS_LICENSE_KEY` dans l'environnement. Aucun fichier shadcn créé.
- L'exemple d'usage fourni est `<m />` (balise incomplète, aucune configuration exploitable).
- En application de la mission d'origine, l'équivalent natif existant (`FallingRays`, 0 dépendance) est **remis en service** : scène du dossier reconstruite (`/birthday/enquete`, 12 rayons, encre bleue, reduced-motion figée). Son unique consommateur avait disparu lors de la reconstruction — l'effet retrouve une place réelle plutôt qu'un install aveugle.

### Baseline après lot
tsc 0 erreur ; build OK (114 pré-caches ≈3,4 Mo) ; **64/64 tests (10 fichiers)** ; npm audit 0 vulnérabilité ; smoke preview 4180 : GlowCursor, WelcomePage, motion/ogl pré-bundlés → 200.

---

## CHAÎNE V2 — RECONSTRUCTION COMPLÈTE « THE 18TH CASE » + RESPONSIVE GLOBAL + CORRECTIONS (3 oct. 2026, soir)

### 0. Sources (phase 1 — audit obligatoire avant modification)
- **Rapport d'audit Jenny lu INTÉGRALEMENT** (646 lignes, récupéré de `Docs/RAPPORT-audit-dossier-jenny.md` sur GitHub — la pièce jointe message n'est jamais arrivée sur le disque, deux occurrences consécutives). Copie de travail : `/home/user/jenny-audit.md` (hors repo, fichier de travail).
- Dépôt Jenny : clone ROS (/tmp/jenny, sessions précédentes) — **jamais modifié**.
- Site live Jenny : fetché (avis inchangés).
- Six docs projet relus par passages ciblés (ordre de priorité respecté : sécurité/infos > specs projet > audit Jenny > dépôt/site Jenny > code existant).

### 1. Diagnostic de l'existant (phase 2 — causes confirmées AVANT modification)
| Problème observé | Cause réelle confirmée |
|---|---|
| Dossier « étroit, centré » sur desktop | `CasePage` sur `container--readable` (720 px, token `--measure-readable`) alors que `--measure-app` 1200 px existait |
| Héros pas marquant | Hauteur non pleine écran, aucun emblème fort, fond uniforme |
| 7 faits « empilés » | Liste typewriter sans mise en scène — l'audit recense un focus scroll-driven (AN-10) comme mécanisme signature |
| Pas de chapitrage/repère de lecture | Pas de `data-chapter`, pas de barre de progression (mécanisme AN-11 absent) |
| Menu « Enquête » cassé | `GIFT_ITEMS` pointait vers `/birthday/dossier` — libellé de route hérité d'un lot précédent, jamais propagé au renommage en `/birthday/enquete` (registre lot loc : la matrice citait encore `/birthday/dossier`) ; same relic dans LibraryPage |
| Accès direct non garanti en hébergement | Aucun `netlify.toml`/`_redirects` (SPA fallback manquant) |
| PV différent de la référence | Lignes indépendantes vs bloc unique avec conclusion « récompense » |

### 2. Matrice de correspondance DÉFINITIVE (audit → PRINCIA v2)
| Élément référence (audit) | Statut v2 | Forme PRINCIA |
|---|---|---|
| Layout : skip-link (existant ✔), header progression + chapitre (AN-11), footer | **Adapté** | DossierHeader : barre scaleX rAF + chapitre courant IO (−42/−52), chips mono ; top-nav projet conservée |
| Grain photographique global feTurbulence (AN-05) | **Adapté** | GrainLayer bleu, 1,2 s steps(4), reduced-motion retiré |
| Chapitre I Couverture : min-h-svh, grille 1.15/0.85, rise-in, fiche, marquee | **Reconstruit** | Héros plein écran 100svh, grille 1120 px, Reveal cascade, fiche d'identification Princia, marquee bleu |
| Emblème chat + papillon | **Remplacé (règle absolue)** | Grand sceau N°18 en contre-jour + ex-libris en dérive 11 s (rôle exact : repère iconique non animal) |
| Chapitre II Rapport : PV typewriter BLOC unique + CTA à `done` (AN-03) | **Reconstruit** | PV 3 paragraphes joints, caret, sr-only, conclusion+CTA uniquement à la fin de la frappe |
| Chapitre III Pièces : 6 cartes photo + A-06 scellés | **Conservé** (v1 déjà fidèle à la fonction) | Exhibits + tilt + tape + mentions + fil bleu + énigmes passables (différence assumée : texte vs photos) |
| **Chapitre IV mécanisme** : focus scroll-driven (AN-10/J4) | **Reconstruit — appliqué aux 7 FAITS** | CaseFacts : remap 10→92 %, smoothstep, fenêtre 0.17, statuts, orbe bleue getPointAtLength, reduced-motion → tout net |
| Contenu témoignages humains (témoins, photos, orbe social) | **Non pertinent** | Aucun témoin documenté pour Princia ; jamais inventé |
| Chapitre V Salle de projection (films, CAM, transcriptions) | **Non pertinent** | Aucun film existant |
| Chapitre VI Verdict : fond radial, shake-once, braises canvas | **Adapté** (v1) | Slam RÉSOLUE + shake + EmberField bleu + GlowCursor (lot 5) |
| Chapitre VII Affaire classée + CTA final | **Reconstruit** | CaseClosure : tampon AFFAIRE CLASSÉE, mentions, stats réelles, 4 sorties (lettre/bibliothèque/espace/re-lecture) |
| 404 « pièce manquante » fictionnelle | **Conservé** | « Ce rayon-là n'existe pas » (fiction bibliothèque) déjà en place |
| Easing tokens réduits (2 familles) | **Adapté** | deux courbes récurrentes du dossier (ease / cubic-bezier(0.22,1,0.36,1)) ; tokens narratifs non dupliqués |
| Fraunces/IBM Plex Mono/Caveat | **Adapté partiellement** | Réutilisé via équilibre design system (IBM Plex Mono déjà présent ; Caveat → serif italique, pas de nouvelle police) |
| View Transitions API | **Non adopté** | « Fortement probable » seulement chez Jenny ; gain incertain, coût réel |
| Supabase/contributeurs/porte privée/modération/uploads | **Hors périmètre** (confirmé) | PWA 100 % locale ; doublon js13k ; la leçon sécurité « secrets côté client » ne nous expose pas : aucune zone secrète côté client chez Princia |
| En-têtes sécurité Netlify | **Non vérifiable ici** | Config hébergement absente du repo (à régler au déploiement 4.6, avec le fichier _redirects livré) |

### 3. Sept faits (phase 5) — fidélité textuelle
Textes fournis par Stane intégrés **quasi à l'identique** (F-01..F-07), mise en scène : code pièce + titre évocateur + fait + indice d'archiviste + activation au scroll + compteur. Tests objectivent : exactement 7, codes ordonnés, « serait » pour la majorité, aucune moyenne actuelle, aucun revenu, franchise avec contrepartie, zéro quiz.

### 4. Routage (phase 8) — cause réelle corrigée
- Route canonique **`/enquete`** (CasePage) ; `/birthday/enquete` → `<Navigate to="/enquete" replace />`.
- Menu cadeaux, LibraryPage, CoverPage, FinalePage, DailyHome : tous → `/enquete` (test de garde : l'ancienne route obsolète n'existe plus nulle part, `_redirects` présent).
- `public/_redirects` créé : `/*  /index.html  200` (convention Netlify — même hébergeur que la référence ; sans effet en dev).

### 5. Responsive global (phase 4)
- **Cause du confinement supprimée** : la scène du dossier utilise désormais `container` 1200 px (avec sous-zones 62ch pour les textes longs) ; hero plein-bleed viewport avec grille interne 1120 px.
- Breakpoints dédiés : ≥1024 (grille hero), 900 (report), 780 (thread facts masqué), 720/560 (emblèmes, chips).
- **Limite honnête** : aucun navigateur headless installable (Téléchargement Chromium bloqué réseau, même barrière que shadcn) — la validation des viewports 320→1920 reste à confirmer sur appareils réels ; les règles ont été écrites mobile-first avec zones tactiles ≥44 px, aucun hover requis, aucun débordement horizontal (Pas de width:100vw dangereux hors héros plein-bleed contrôlé par overflow hidden de la scène).
- Autres sections (welcome, bibliothèque, lettre, souvenirs, espace) : règles existantes revues, aucune régression introduite (aucune max-width globale modifiée — changement localisé à la scène du dossier).

### 6. Sécurité (phase 10) — bilan honnête
- **Alertes GitHub Dependabot : NON accessibles** (API 403 « Resource not accessible by integration » — le token du sandbox ne couvre pas ce périmètre). L'alerte reçue par Stane concernait probablement vitest@2.x : **corrigé au lot 4 (vitest 5.0.3)** ; à revérifier dans l'onglet Security du dépôt.
- `npm audit` (post npm install ogl) : **0 vulnérabilité**.
- Dépendances réellement utilisées : motion ✔ (BlurText), gsap ✔ (BubbleMenu), animejs ✔ (WelcomePage/ReadingBook), ogl ✔ (GlowCursor verdict) — aucune orpheline ajoutée.
- Secrets : aucune clé dans le code suivi ; `.env*` ignoré ; leçon de l'audit appliquée — **aucune zone secrète évaluée côté client** (contrairement au point faible du site Jenny, que nous ne reproduisons pas).
- Aucun `audit fix --force`, aucune alerte masquée/désactivée.

### 7. Livré — fichiers
Créés : `useScrollProgress.ts` (+smoothstep), `GrainLayer.tsx`, `DossierHeader.tsx`, `CaseFacts.tsx`, `CaseClosure.tsx`, `public/_redirects`, tests `sept-faits`, `enquete-routing`, `dossier-scene`.
Réécrits : `CaseCover.tsx`, `CaseReport.tsx`, `CasePage.tsx` (chapitrage I..VI).
Modifiés : `content.ts` (PV bloc + factsChapter 7 faits + closure), `CaseEvidence/CaseVerdict` (data-chapter, CTAs déplacés vers clôture), `App.tsx` (+ route canonique + redirect), 5 fichiers de liens, `globals.css` (bloc v2 : hero svh, PV, facts focus, nav, grain, closure).
Tests existants adaptés (case-dossier) — **jamais masqués** : l'assertion obsolète remplacée par celles de la nouvelle structure.

### Baseline après lot
tsc 0 erreur ; build OK (114 entrées de pré-couche ≈ 3,43 Mo, `_redirects` inclus) ; **88/88 tests (13 fichiers)** ; preview 4180 : `/`, `/enquete`, ancienne route, `/app`, bibliothèque, lettre, souvenirs → 200 ; modules v2 → 200.

---

## Lot « accueil, écriture et lumière » (3 oct. 2026 — retours Stane post-v2)

### 1. Bug « la lettre ne s'affiche plus ensuite » — causes et réparations
- **Cause structurelle** : après la première visite, `EntryGate` redirige `/` → `/app` et **aucun lien ne ramenait à l'accueil enveloppe** → impossible de la revoir. Réparation : route dédiée **`/birthday/accueil`** (WelcomePage, sans condition) + entrée « **l'invitation** » en tête du menu cadeaux (BubbleMenu).
- **Cause d'invisibilité potentielle** : le voile `opacity: 0` pendant la phase `opening` reposait entièrement sur le bon déroulement de la timeline animejs. Réparation : **garde absolue `setTimeout(safeFinish, 2500)`** (durée timeline ≈ 1 670 ms) + `try/catch` déjà présent — la lettre bascule en « open » dans tous les scénarios.
- **Gabarit** : carte 640 px → `min(880px, 94vw)`, marges internes fluides `clamp(2rem, 5.5vw, 4rem)`, intérieur en grille à écarts fluides (plus rien d'entassé/collé), titre borné sur petit écran.

### 2. Écriture manuscrite (Kalam) — réellement intégrée
- `@fontsource/kalam` installé (300/400/700), imports dans `main.tsx`, token `--font-hand` dans `tokens.css`.
- Appliquée : salut BlurText de l'accueil, salutation + **corps de la lettre intime** (`letter-sheet .prose > p`, interligne 1.85, corps fluide 1.06→1.2 rem), lettre manuscrite du verdict (titre, paragraphes, signature).
- Bug token corrigé en amont : `--font-display` (inexistant) → `--font-serif` sur la lettrine et le salut.

### 3. GlowCursor « jamais vu » — diagnostic et extension
- **Diagnostic** : intégré ✔ (`ogl` installé, canvas monté, pointermove écouté) mais _discret par construction_ : verdict uniquement (tout en bas de `/enquete`), blend `screen` sur fond sombre, et surtout il s'**effaçait 0,7 s après l'arrêt du pointeur** (fondu 0,9 s) → quasi invisible au premier regard.
- **Renforcement verdict** : trace 12 px, opacité 0.95, luminosité 1.35, glow 2.3, repos **2,4 s** + fondu **1,3 s**.
- **Extension** : GlowCursor enveloppe désormais toute la scène **`/souvenirs`** (fond nuit #0b1e3a — terrain idéal) ; verrou CSS `.glow-cursor.souvenirs-fullpage { height: 100dvh }` pour que le plein écran prime. Drag de la spirale préservé (canvas `pointer-events: none`, réduit-motion intact).
- Doc créée : **`Docs/COMPOSANTS-EXTERNES.md`** — tableau composant ↔ dépendance ↔ commande exacte (règle permanente Stane).

### Baseline après lot
tsc 0 erreur ; **101/101 tests (14 fichiers)** — nouveau fichier `welcome-envelope.test.ts` (11 gardes) et `greeting.test.ts` adapté à Kalam ; build OK (132 entrées de pré-couche ≈ 4,13 Mo, les 3 graisses Kalam incluses) ; preview 4180 : `/`, `/birthday/accueil`, `/souvenirs`, `/enquete`, `/app`, lettre, bibliothèque → 200. Push en fin de lot (règle Stane du 3 oct. 2026).

---

## Lot « fonds d'espaces + enquête v3 » (3 oct. 2026 — composants Stane : FoldText, WebThreads, GradientWaves)

### 1. Audit section enquête — causes de la latence et de l'affichage cassé
- **Calque grain animé en boucle** (`grain-shift` 1,2 s infini, pleine scène de ~10 000 px) → repaint permanent de toute la page. **Supprimé** : texture statique conservée (mécanisme AN-05 sans mouvement).
- **12 rayons `FallingRays` animés à l'échelle de la scène entière** (hauteurs 48–84 % de la page) → composite en continu. **Remplacés** par le fond WebThreads (GPU, pause IO).
- **`CaseFacts` : setState React par frame de scroll** (`useScrollProgress` seuil 0,001) → 7 cartes re-rendues 60×/s, orbe SVG recalculée + tampon remonté/démonté en vol → scroll saccadé, texte « éparpillé ». **Réécrit impératif** : les seules `--fact-a` + la position de l'orbe sont écrites via rAF amorti, zéro re-render ; tampon toujours monté (opacité `calc()` CSS) ; transitions/will-change permanents retirés ; mécanique AN-10 (remap 10→92 %, centres, smoothstep, getPointAtLength) strictement conservée.
- **Superposition WebGL + canvas de braises au verdict** → braises (`EmberField`) **retirées** (composant supprimé, documenté) ; GlowCursor conservé (effet signature), plafonné `maxDevicePixelRatio={1.5}`.
- **Aucune régression de contenu** : couverture, PV typewriter, sept faits, pièces A-01..A-03, verdict + lettre, clôture, nav de lecture, chapitrage I..VI — tous présents et testés.

### 2. Fonds d'espaces (un par espace, bleus PRINCIA)
- **Enquête → WebThreads** (composant Stane, `ogl`) en `lightMode` : fils tissés à l'encre bleue (#174A91 → #3E7BD9, cœur #8EC5FF) sur page claire #EEF5FF — la paperasse du dossier reste lisible ; interaction souris douce.
- **Bibliothèque + livre des chapitres → GradientWaves** (`ogl`) : vagues bleu pastel (horizon #EAF3FF, vague #7FB2F2, crête blanche), `detail="low"`.
- Adaptations communes documentées : calque `.scene-backdrop` fixe `z-index:-1` pointer-events:none ; écoute du pointeur déplacée sur `window` (passive) ; **DPR ≤ 1.5** ; reduced-motion → canvas jamais monté (fond CSS conservé) ; repli silencieux sans WebGL.

### 3. Bibliothèque : chapitres respirants + FoldText + feuillet fluide
- `ReadingBook` : marges internes fluides `clamp(1.4rem, 4.5vw, 2.75rem) × clamp(1.3rem, 5vw, 3rem)`, écart inter-pages fluide sur mobile, dates/notes compactées, tranche masquée < 780 px.
- **FoldText** (composant Stane, `gsap`) sur le **nom de chaque chapitre** (H1 du livre) : rejoué à chaque chapitre (`key={chapter.id}`), split par mots, charnière gauche, police serif du design system.
- Feuillet : `will-change: transform` pendant la rotation, suppression du `scrollIntoView` smooth concurrent du geste (recadrage instantané), durées resserrées 290/310 ms.

### Baseline après lot
tsc 0 erreur ; **122/122 tests (15 fichiers)** — `dossier-scene` réécrit (mécanique identique, implé impérative), + `scene-backgrounds` (fonds, verdict allégé, FoldText, livre) ; build OK (132 entrées ≈ 4,2 Mo) ; preview 4180 : 7 routes × 200, modules WebThreads/GradientWaves/FoldText servis.

---

## Lot « performance GPU » (3 oct. 2026 — GPU à 100 %, backgrounds invisibles)

### 1. Diagnostic (observations statiques — pas de navigateur dans le sandbox)
Code lu ligne à ligne ; les chiffres sont de l'arithmétique de surfaces
× itérations shader, pas des chronos navigateur :
- **GlowCursor du verdict** : canvas = toute la hauteur de la section (~3000 px) → ~13 Mpx avec un shader à 63 itérations/pixel, rendu 60×/s en continu → le plomb.
- **WebThreads** : 2880×1620 (DPR 1.5) en continu.
- **Backgrounds invisibles** : les voiles CSS de `.dossier-scene` et `.library-hero` étaient des gradients **opaques** peints par-dessus les fonds WebGL → masquage total.
- `FoldText` : `will-change` permanent par pièce → couches GPU résiduelles.
- Token fantôme `--font-display` encore utilisé par le ghost « CH. 18 » du héros bibliothèque.

### 2. Réparations (interaction et contenu préservés)
- **GlowCursor** : nouveau mode `viewportCanvas` — le plan lumineux est fixé à la **taille du viewport** (les coordonnées du pointeur vivent déjà dans le viewport : même traînée, même endroit, ~6× moins de surface) ; la trace n'existe que quand la section hôte est visible (IO) ; **sommeil complet** hors écran et après inactivité (réveil au mouvement) ; `targetFps={30}`, `maxDevicePixelRatio={1}`. Verdict : trace 12 px conservée.
- **WebThreads/GradientWaves** : `dpr: 1` (les fonds n'ont pas besoin de sous-pixel), `resolutionScale` 0.55/0.5 interne (canvas réduit puis agrandi par CSS — invisible sur un décor flou de nature) ≈ **4× moins de pixels par frame** ; `targetFps={30}` ; pause hors écran conservée ; `GradientWaves low` : 40 → 32 étapes de raymarch.
- **Voiles translucides** : `.dossier-scene` et `.library-hero` passent en rgba~0.5-0.68 → **les backgrounds deviennent visibles** tout en protégeant la lisibilité ; réglages couleurs renforcés (encre plus marquée, vagues plus contrastées).
- **FoldText** : `will-change` retiré du CSS interne (adaptation documentée) ; `GSAP` conserve force3D + clearProps.
- **Enquête** : `content-visibility: auto` sur les chapitres lourds (rendu différé hors écran, taille estimée = aucun saut de scroll).
- **Faits** : la variable `--fact-a` n'est écrite que si le changement > 0,004 (recalcs de style vides supprimés).
- **Bibliothèque** : page méta du livre en flex `space-between` (l'espace est distribué — fini le campé en haut à gauche) ; prose en colonne 62 ch centrée ; nav poussée en bas ; titre restauré (serif, focus-outline conservé), balance sur 22 ch.

### 3. Bilan d'engagements
- Aucun effet supprimé (sauf le canvas de braises déjà retiré au lot précédent) ; aucun contenu sacrifié (message > effet, règle respectée).
- Reduced-motion : tout WebGL reste jamais monté ; états statiques complets.
- Pas de mesure navigateur disponible dans le sandbox : les gains sont des **estimations statiques de charge GPU** (÷4 à ÷6 sur les surfaces dessinées par frame), la validation visuelle revient à Stane ; si le PC rame encore, curseurs restants documentés dans `Docs/COMPOSANTS-EXTERNES.md` (baisser `resolutionScale`, désactiver un fond).

### Baseline après lot
tsc 0 erreur ; **122/122 tests (15 fichiers)** — critères des fonds mis à jour vers les nouvelles garanties (jamais masqué un échec: anciens réglages remplacés par les nouveaux) ; build OK (132 entrées ≈ 4,2 Mo) ; preview 4180 : 8 routes × 200, moteur GlowCursor optimisé servi.
