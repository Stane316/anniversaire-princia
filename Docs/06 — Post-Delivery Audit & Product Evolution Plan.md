# 06 — Audit post-livraison & plan d'évolution produit

**Projet :** PRINCIA — Chapter 18
**Production :** https://princia-chapter18.netlify.app/
**Dépôt :** `Stane316/anniversaire-princia` — branche de travail `arena/01a10406-anniversaire-princia`
**Date de l'audit :** 4 octobre 2026
**Nature du document :** audit + cadrage. **Aucune implémentation des phases C→H n'a été démarrée.**

> **Convention de lecture**
> `[VÉRIFIÉ]` = constaté par inspection du code, exécution d'une commande ou requête HTTP réelle sur la production.
> `[HYPOTHÈSE]` = déduction cohérente mais non prouvée.
> `[À VÉRIFIER PAR STANE]` = nécessite un appareil réel, un compte ou une décision humaine.
> `[RECOMMANDATION]` = proposition d'architecture ou de produit, non implémentée.

---

## 1. Résumé exécutif

### 1.1. Ce qui est réellement en place

PRINCIA — Chapter 18 est **une application React 19 + Vite 7 + React Router 7, 100 % frontend, sans backend**, déployée en statique sur Netlify. `[VÉRIFIÉ : package.json, vite.config.ts, netlify.toml]`

Les deux expériences d'anniversaire (Blue Library / lettre / souvenirs, et l'enquête « The 18th Case ») sont terminées, stables, couvertes par des tests, et **ne doivent pas être retouchées**. L'espace quotidien (Lectures, Carnet, Victoires, Découvrir) fonctionne, mais **toutes ses données vivent exclusivement dans l'IndexedDB du navigateur de l'appareil** (`princia-chapter-18`, v2, stores `books`/`tasks`/`wins`/`proposals`), avec repli `localStorage`. `[VÉRIFIÉ : src/data/db.ts]`

### 1.2. Le verrou central

**Il n'existe aujourd'hui aucune source de données partagée entre ton appareil et celui de Princia, et aucune authentification.** Le code de la section QG (`src/features/qg/qgService.ts`) a été écrit pour parler à Supabase — mais Supabase **n'est pas configuré** : aucune variable `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` n'existe, aucun projet n'est créé, et la migration `supabase/migrations/001_qg_proposals.sql` **n'a jamais été appliquée**. Le service tourne donc en mode local dégradé, honnêtement signalé dans l'UI. `[VÉRIFIÉ : grep import.meta.env, absence de .env, supabase/migrations/]`

Conséquence directe : **tout ce que tu demandes au §3 à §6 de ta mission (dashboard admin, publication de ressources, exercices, soumissions, corrections, IA) est strictement impossible sans backend.** Ce n'est pas un choix d'architecture « préférable » : c'est une dépendance bloquante.

### 1.3. Direction recommandée

1. **Ne rien reconstruire.** Les expériences anniversaire, le design system, la PWA et les composants React Bits restent intacts.
2. **Brancher Supabase comme source de vérité partagée** (base Postgres + Auth + Storage + Edge Functions). C'est la seule option du marché qui couvre d'un coup les 4 besoins (données, comptes/rôles, fichiers, couche serveur pour l'IA) avec un palier gratuit suffisant pour 2 utilisateurs. `[RECOMMANDATION]`
3. **Deux rôles, une seule application.** Pas de second site admin : un espace `/admin/*` protégé par Supabase Auth + RLS, dans le même bundle.
4. **L'IA en dernier, derrière une Edge Function.** Jamais de clé API dans le frontend. Fournisseur à choisir après un test de qualité en français — et **ton abonnement ChatGPT ne paiera pas ces appels** (voir §8.4).
5. **Garder le local comme cache, pas comme vérité.** Les données déjà saisies par Princia doivent être migrées, pas effacées.

### 1.4. Les 3 risques les plus sérieux aujourd'hui

| # | Risque | Gravité | Preuve |
|---|---|---|---|
| R1 | **Perte définitive des données de Princia.** Tout est dans l'IndexedDB de son téléphone. Si elle vide les données du navigateur, change de téléphone, ou si iOS évince le stockage d'une PWA inutilisée ~7 jours, ses livres, tâches et victoires disparaissent sans sauvegarde possible. | **Critique** | `[VÉRIFIÉ : src/data/db.ts — aucune synchronisation distante ; navigator.storage.persist() est demandé mais n'est jamais garanti]` |
| R2 | **Le code `041026` n'est pas une sécurité.** C'est un rideau d'ambiance côté client (digest FNV-1a dans le bundle). Il ne protégera jamais un espace d'administration. | **Critique si réutilisé pour l'admin** | `[VÉRIFIÉ : src/features/access/accessSession.ts]` |
| R3 | **Le QG promet un partage qu'il ne peut pas tenir** si Supabase n'est jamais branché. Le code est honnête (il affiche « mode local »), mais le besoin produit n'est pas couvert. | Élevée | `[VÉRIFIÉ : qgService.ts L.120-140]` |

---

## 2. État réel du dépôt

### 2.1. Pile technique `[VÉRIFIÉ : package.json]`

| Couche | Choix | Version |
|---|---|---|
| Framework | React + React DOM | 19.1.1 |
| Build | Vite | 7.1.7 |
| Routage | react-router-dom | 7.9.1 |
| Langage | TypeScript | ~5.9.2 |
| Tests | Vitest + Testing Library + jsdom | 5.0.3 / 16.3.3 / 30.1.1 |
| PWA | vite-plugin-pwa (Workbox, `generateSW`, `autoUpdate`) | 1.0.3 |
| Animation | motion 14, gsap 3.15, animejs 4.5, ogl 1.0.11 | — |
| Icônes | @hugeicons/react + core-free-icons | 1.1.10 / 4.3.5 |
| Typographies | @fontsource inter / dm-serif-display / ibm-plex-mono / kalam | 5.x |

**Aucune dépendance backend, aucun client Supabase, aucun SDK IA, aucune librairie d'état global, aucun ORM.** `[VÉRIFIÉ]`
**`npm audit --omit=dev` → `found 0 vulnerabilities`.** `[VÉRIFIÉ, exécuté]`

### 2.2. Scripts disponibles `[VÉRIFIÉ : package.json]`

```
dev        vite
build      tsc -b && vite build
preview    vite preview
typecheck  tsc -b --pretty
test       vitest run
```

**Lacune constatée : il n'existe aucun script `lint`, aucune configuration ESLint, et aucun workflow CI (`.github/` absent).** Rien ne bloque donc un commit qui casse le build avant que Netlify ne le découvre. `[VÉRIFIÉ]`

### 2.3. Routage `[VÉRIFIÉ : src/app/App.tsx]`

- `/` → `EntryGate` : première visite → `WelcomePage` (enveloppe) ; visites suivantes → redirection `/app`.
- `/birthday/*` → accueil, lettre, bibliothèque, chapitre, volume scellé, finale.
- `/souvenirs`, `/enquete` → galerie plein écran, dossier d'enquête.
- `/app/*` (layout `DailyLayout` + `Dock` + `BubbleMenu`) → `/app` (accueil), `/app/lectures`, `/app/carnet`, `/app/victoires`, `/app/decouvrir`.
- `*` → page 404 maison.

L'ensemble des routes est enveloppé par `<AccessCodeGate>` (code `041026`). **Aucune route protégée par un rôle. Aucune route `/admin`.** `[VÉRIFIÉ]`

### 2.4. Données et persistance `[VÉRIFIÉ : src/data/db.ts, src/data/repositories.ts]`

- Base IndexedDB maison, sans dépendance : `princia-chapter-18`, `DB_VERSION = 2`.
- Stores : `books`, `tasks`, `wins`, `proposals`.
- Migrations de version non destructives, repli `localStorage` sous préfixe `princia.chapter18.fallback.`, détection explicite de `QuotaExceededError`, classe `StorageError` typée (`QUOTA_EXCEEDED` / `INVALID_KEY` / `UNAVAILABLE` / `IO_ERROR`).
- `navigator.storage.persist()` est demandé lorsqu'il est disponible.

**C'est une couche locale de bonne facture. Elle n'est pas, et ne peut pas devenir, une solution de partage multi-appareils.**

### 2.5. Variables d'environnement `[VÉRIFIÉ]`

Trois variables sont **lues par le code mais n'existent nulle part** :

| Variable | Lue dans | Effet actuel |
|---|---|---|
| `VITE_SUPABASE_URL` | `src/features/qg/qgService.ts:80` | absente → mode local |
| `VITE_SUPABASE_ANON_KEY` | `src/features/qg/qgService.ts:81` | absente → mode local |
| `VITE_BOOK_AI_ENDPOINT` | `src/features/reading/recommendations/recommendationEngine.ts` | absente → `configured: false`, aucun appel |

Aucun fichier `.env` n'est présent ni suivi par Git. `.gitignore` exclut correctement `.env` et `.env.*` (sauf `.env.example`, lui-même absent). **Aucun secret exposé dans le dépôt.** `[VÉRIFIÉ]`

### 2.6. État Git `[VÉRIFIÉ]`

Branche active `arena/01a10406-anniversaire-princia`, synchronisée avec `origin`. Dernier commit : `1b91b48` (intégration React Bits `CodeSlots`). Historique récent : `5409bad` (PWA mobile, gate 041026, QG, moteur de recommandation), `f7db39d` (restauration assets PWA/SEO/netlify.toml).

> ⚠️ **Note importante sur l'état du dépôt** : `git status` signale de nombreux fichiers modifiés/non suivis par rapport au commit greffé `a55fbf9`. Il s'agit d'un artefact du *shallow clone* de la session (historique greffé), **pas** de travail non sauvegardé : les commits `5409bad`, `f7db39d` et `1b91b48` sont bien poussés sur `origin/arena/01a10406-anniversaire-princia`. **Avant la Phase B, il faut confirmer que cette branche a bien été fusionnée dans `main` et que c'est bien `main` que Netlify déploie.** `[À VÉRIFIER PAR STANE]`

### 2.7. Déploiement Netlify `[VÉRIFIÉ : netlify.toml]`

- `command = npm run build`, `publish = dist`, `NODE_VERSION = 22`.
- Fallback SPA `/* → /index.html 200` avec `force = false` (les fichiers statiques réels passent avant — correct).
- En-têtes de sécurité : `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictive, `X-Robots-Tag: noindex, nofollow, noarchive` (site privé — cohérent).
- `/` en `max-age=0, must-revalidate` → les nouvelles versions du SW sont bien détectées.

**Absent : aucun en-tête `Content-Security-Policy`.** Non bloquant aujourd'hui (pas de contenu tiers injecté), mais à ajouter avant d'introduire des appels IA et des pièces jointes utilisateur. `[RECOMMANDATION]`

---

## 3. Inventaire des fonctionnalités

Classement demandé au §2.2 de la mission. **Aucune fonctionnalité n'est déclarée opérationnelle sur la seule foi de son interface.**

### A. Implémentées et vérifiées (code + tests automatisés exécutés)

| Fonctionnalité | Emplacement | Preuve |
|---|---|---|
| Expérience anniversaire complète (enveloppe, lettre, bibliothèque, chapitres, volume scellé, finale) | `src/experiences/birthday/pages/*` | `welcome-envelope.test.ts`, `library-codex.test.ts`, `sealed-volume.test.ts` (passants) |
| Enquête « The 18th Case » (héros, PV, sept faits, verdict) | `src/experiences/birthday/pages/CasePage.tsx` | `case-dossier.test.ts`, `case-dossier-dom.test.tsx`, `case-dossier-computed.test.tsx`, `sept-faits.test.ts`, `enquete-routing.test.ts` |
| Galerie souvenirs en spirale + intro photo | `SouvenirsGalleryPage`, `SouvenirPhotoIntro` | `souvenirs.test.ts`, `souvenir-photo-intro.test.ts`, `enquete-galerie-layout.test.ts` |
| Carnet universitaire (CRUD tâches, échéances locales, priorités de la semaine) | `src/features/planner/*` | `datetime.test.ts`, `local-storage-persistence.test.ts` |
| Petites victoires (CRUD) | `src/features/wins/*` | `local-storage-persistence.test.ts` |
| Lectures / livres (CRUD, statuts) | `src/features/reading/*` | `local-storage-persistence.test.ts` |
| Résilience du stockage (IndexedDB → localStorage, quota, migration v1→v2 non destructive) | `src/data/db.ts` | `local-storage-persistence.test.ts` |
| Code d'accès `041026` (gate, session, drain d'erreur, succès) | `src/features/access/*`, `src/components/code/CodeSlots.tsx` | `access-code-slots.test.tsx` |
| Manifeste, icônes, SEO, netlify.toml | `public/`, `index.html` | `pwa-netlify-seo.test.ts` |
| Navigation Dock + BubbleMenu | `src/experiences/daily/DailyLayout.tsx` | `volume-sheet-and-dock.test.ts` |

**Résultat d'exécution réel de la suite, ce jour : `Test Files 25 passed (25)`, `Tests 206 passed (206)`. `npm run typecheck` : 0 erreur. `npm run build` : succès, `precache 31 entries (1620.31 KiB)`.** `[VÉRIFIÉ, exécuté]`

### B. Implémentées mais insuffisamment testées

| Fonctionnalité | Lacune |
|---|---|
| `PwaInstallCard` (invite d'installation, `beforeinstallprompt`) | Aucun test ne couvre le cas « l'utilisateur refuse » ni le blocage iOS (pas de `beforeinstallprompt` sur Safari). Le comportement réel n'est vérifiable que sur un téléphone. `[À VÉRIFIER PAR STANE]` |
| `PwaUpdatePrompt` (cycle de mise à jour) | Pas de test du scénario « SW en attente puis rechargement ». |
| Moteur de recommandation local (`recommendationEngine.ts`, 369 lignes) | Testé pour sa partie déterministe via `discover-qg-books-ai.test.tsx`, mais la branche réseau (`requestRecommendations`) n'est jamais exercée : aucun endpoint n'existe. |

### C. Partiellement fonctionnelles

| Fonctionnalité | État réel |
|---|---|
| **Propositions du QG** (`qgService.ts`, 614 l. + `QgProposalsSection.tsx`, 1150 l.) | Le code REST Supabase, l'auth par mot de passe, l'upload vers le bucket privé `qg-attachments` et le marquage `syncOrigin: "remote"` sont écrits. **Rien n'est actif** : sans variables d'env, le service tombe en `mode: "local"` (IndexedDB store `proposals`) avec export/import JSON manuel comme palliatif. C'est honnête, mais ce n'est pas le partage attendu. |
| **Recommandations de livres** | Analyse locale des genres/statuts/préférences = réelle et déterministe. Couche IA = contrat d'interface + garde `verifiedFreeLegal` seulement. `getStatus()` renvoie `configured: false`. Aucun faux bouton « IA » : conforme à ta consigne. |
| **Échéances du Carnet** | Date limite stockée, `dueStatus()`/`dueLabel()` calculent *aujourd'hui / bientôt / en retard*, badge affiché. **Mais : aucune notion de fuseau horaire explicite (dates ISO `YYYY-MM-DD` comparées en heure locale de l'appareil), et aucun rappel d'aucune sorte.** |

### D. Interface sans persistance ni logique complète

**Aucune constatée.** Chaque écran visible est relié à un repository réel. C'est un point fort du dépôt. `[VÉRIFIÉ]`

### E. Prévues mais pas développées — tout le périmètre de ta nouvelle mission

Authentification · rôles `admin`/`learner` · dashboard d'administration · création/publication de ressources (brouillon→publié→archivé) · upload de fichiers/PDF · matières, modules · exercices · soumissions · brouillons de réponse · corrections et commentaires · progression pédagogique · assistant IA pédagogique · appel IA réel pour les livres · retours sur recommandations · notifications et rappels · CSP · ESLint · CI.

### F. Nécessitent une action de ta part

Création du projet Supabase · création des deux comptes · choix et financement du fournisseur IA · variables d'environnement Netlify · tests d'installation PWA sur le téléphone de Princia · confirmation de la branche déployée.

### G. Nécessitent une décision d'architecture ou de produit

Devenir du code `041026` après l'arrivée de l'auth (§7.3) · périmètre du MVP e-learning · types de réponse d'exercice retenus · politique de notation (note chiffrée ou non) · stratégie de migration des données locales existantes · fournisseur IA.

---

## 4. Écarts entre les spécifications et le code

> **Avertissement de méthode** : les documents `Docs/00` à `Docs/05` décrivent le périmètre *anniversaire + espace quotidien*. **Ils ne contiennent aucune spécification de dashboard admin, d'e-learning, d'exercices ou d'assistant IA** — ces besoins apparaissent pour la première fois dans la présente mission. Les lignes ci-dessous marquées « non spécifié » ne sont donc pas des oublis de réalisation, mais des besoins nouveaux. Je ne leur invente aucun historique.

| Fonctionnalité | État spécifié | État réel | Écart constaté | Action requise |
|---|---|---|---|---|
| Expériences anniversaire | Doc 01 §4–§7, Doc 02 | Livrées, testées | Aucun | Ne pas toucher |
| Carnet / Victoires / Lectures | Doc 01 §10–§11 | Livrés, locaux | Aucun sur le périmètre spécifié | Conserver, brancher plus tard au distant |
| Notifications d'échéance | Doc 03 §14.5 : « V1 n'active pas de notifications système, repli honnête » | Conforme : aucune notification, échéances visibles dans l'UI uniquement | **Aucun écart** — la spec interdisait la promesse | Décision nouvelle requise (§9) |
| Section « Découvrir » | Doc 01 §12–§13 : liens vers ressources informatiques | 5 ressources **codées en dur** dans `CODE_RESOURCES` (`DiscoverPage.tsx:24`) | Conforme à la spec, **mais incompatible avec ta nouvelle exigence §4.2** (« le contenu publié doit provenir d'une source centralisée, pas d'une liste codée en dur ») | Migrer vers table `resources` en Phase C |
| Propositions du QG | Mission §9 précédente : Supabase + mode local honnête | Code complet, **backend jamais configuré** | Écart d'activation, pas de code | Phase B/C : créer le projet Supabase, appliquer `001_qg_proposals.sql` |
| Recommandations de livres | Mission §10 précédente : architecture sans fausse IA | Analyse locale + contrat IA non branché | Écart d'activation | Phase F |
| Code d'accès `041026` | Mission §6/§7 précédente : jamais en clair, jamais comme autorisation serveur | Conforme (digest FNV-1a `e6ec91e0`, `sessionStorage`) | Aucun | **Ne jamais le réutiliser pour l'admin** |
| PWA mobile | Doc 03 §14 | Manifeste, icônes PNG, SW `autoUpdate`, precache 1,6 Mo | Aucun écart de code | Installation réelle `[À VÉRIFIER PAR STANE]` |
| Authentification / rôles | **Non spécifié dans Docs/00–05** | Inexistant | Besoin nouveau | Phase B/C |
| Dashboard admin, e-learning, assistants IA | **Non spécifié dans Docs/00–05** | Inexistant | Besoin nouveau | Phases C→F |
| Lint / CI | **Non spécifié** | Inexistant | Lacune qualité | Phase B (effort faible) |

---

## 5. Audit PWA et production

### 5.1. Vérifications réelles effectuées sur la production

J'ai interrogé https://princia-chapter18.netlify.app/ directement. `[VÉRIFIÉ, requêtes HTTP réelles]`

**`/manifest.webmanifest` servi correctement :**
`name: "PRINCIA — Chapter 18"`, `short_name: "Chapter 18"`, `start_url: "/"`, `scope: "/"`, `id: "/"`, `display: "standalone"`, `orientation: "portrait-primary"`, `theme_color: "#3978D4"`, `background_color: "#F7FAFF"`, `lang: "fr"`, 4 icônes PNG en URL racine (`/icons/apple-touch-icon.png` 180, `/icons/icon-192.png`, `/icons/icon-512.png` en `purpose: any`, `/icons/icon-maskable-512.png` en `purpose: maskable`).

→ **Tous les critères Android/Chrome d'installabilité WebAPK sont réunis** : HTTPS, manifeste valide, `start_url` dans le `scope`, icône ≥192 `any`, icône 512 `maskable`, `display: standalone`, service worker avec gestionnaire de navigation. `[VÉRIFIÉ au niveau des critères techniques]`

**`/sw.js` servi correctement :** `skipWaiting()` + `clientsClaim()` (stratégie `autoUpdate`), **31 entrées préchargées**, `cleanupOutdatedCaches()`, `NavigationRoute` vers `index.html` avec `denylist: [/^\/api\//, /\.[a-zA-Z0-9]+$/]`, et deux caches runtime `CacheFirst` : `princia-souvenirs-gallery` (30 entrées max, 1 an, `CacheableResponsePlugin` statuts [0,200]) et `princia-fonts-runtime` (30 entrées, 1 an).

### 5.2. Analyse

**Points sains :**
- La `denylist` sur `/^\/api\//` est **déjà prête pour un backend** : les futurs appels `/api/*` ne seront pas interceptés par le fallback SPA du SW. Excellent présage pour les Edge Functions.
- `autoUpdate` + `/` en `must-revalidate` ⇒ **risque faible de servir un ancien bundle**. Pas de mélange JS/CSS de versions différentes.
- `cleanupOutdatedCaches()` empêche l'accumulation de caches morts.
- Le precache est passé de ~6,2 Mo à ~1,6 Mo (74 % de réduction) : l'installation du SW sur mobile en data limitée n'est plus bloquée par 6 Mo de photos.
- **Aucune donnée privée n'est mise en cache HTTP** : tout le contenu personnel est en IndexedDB, hors du périmètre Workbox. Le risque « exposer les données d'un utilisateur à un autre via le cache » n'existe pas aujourd'hui. `[VÉRIFIÉ]`

**Risques identifiés :**

| # | Risque | Niveau | Mesure recommandée |
|---|---|---|---|
| P1 | **Un déploiement n'efface pas IndexedDB** (le SW ne touche qu'au cache HTTP) → pas de perte de données au déploiement. **Mais une montée de `DB_VERSION` mal écrite, elle, peut détruire.** Le code actuel est non destructif ; cette discipline doit être maintenue. | Moyen | Test de migration obligatoire à chaque changement de `DB_VERSION` |
| P2 | **Dès l'arrivée de l'authentification, `CacheFirst` deviendra dangereux** sur toute réponse authentifiée. | Élevé (futur) | Règle à graver : **jamais de cache Workbox sur `/rest/v1/*`, `/auth/v1/*`, `/functions/v1/*`, ni sur les URL signées de Storage.** `NetworkOnly` explicite. |
| P3 | **iOS/Safari** : pas de `beforeinstallprompt`, installation uniquement via « Partager → Sur l'écran d'accueil », et éviction possible du stockage après ~7 jours d'inactivité. | Élevé si Princia est sur iPhone | `[À VÉRIFIER PAR STANE]` : quel téléphone utilise Princia ? Réponse déterminante pour R1. |
| P4 | Pas de `Content-Security-Policy`. | Faible aujourd'hui, moyen après l'IA | Ajouter en Phase C |
| P5 | Bundle JS principal : **854,57 kB (281,67 kB gzip)** en un seul chunk, avertissement Rollup présent. | Moyen | Code-splitting par route (`React.lazy`) : les expériences anniversaire et leurs libs WebGL (ogl/gsap/animejs) n'ont pas à être chargées pour ouvrir le carnet. Gain estimé important sur mobile. |

### 5.3. Ce qui ne peut pas être vérifié depuis ici `[À VÉRIFIER PAR STANE]`

Installation WebAPK effective sur le téléphone de Princia · icône correcte sur l'écran d'accueil · absence de barre d'URL en mode standalone · comportement hors ligne réel · persistance après une semaine · fonctionnement du bouton d'installation sans rester bloqué sur « Installation en cours ».
**Je ne déclare aucun de ces points validé.**

---

## 6. Architecture cible

### 6.1. Principe directeur

Une seule application, trois périmètres d'accès, une source de vérité distante, un cache local.

```
                 ┌──────────────────────────────────────────┐
   Navigateur    │  PWA React (bundle unique, Netlify)      │
                 │                                          │
                 │  /            expérience anniversaire    │  ← inchangé, public (gate 041026)
                 │  /app/*       espace de Princia          │  ← rôle learner
                 │  /admin/*     ton dashboard              │  ← rôle admin
                 │                                          │
                 │  couche data : repositories              │
                 │   ├─ local  (IndexedDB, cache + offline) │
                 │   └─ remote (Supabase REST / Storage)    │
                 └───────────────┬──────────────────────────┘
                                 │ HTTPS + JWT utilisateur
                 ┌───────────────┴──────────────────────────┐
                 │  Supabase                                │
                 │   Auth      (2 comptes, rôle en JWT)     │
                 │   Postgres  (RLS sur chaque table)       │
                 │   Storage   (buckets privés, URL signées)│
                 │   Edge Fn   (proxy IA — détient la clé)  │
                 └───────────────┬──────────────────────────┘
                                 │ clé API serveur, jamais exposée
                           ┌─────┴──────┐
                           │ Fournisseur│
                           │     IA     │
                           └────────────┘
```

### 6.2. Règles d'architecture non négociables

1. **Le frontend ne décide jamais d'un droit.** Le rôle lu côté React sert uniquement à *afficher ou masquer* ; l'autorisation réelle est appliquée par les politiques RLS Postgres. Princia pourra taper `/admin` dans l'URL : elle verra un écran « accès refusé », et surtout **la base lui renverra zéro ligne** même si elle forge une requête à la main.
2. **Le rôle vit dans le JWT, pas dans une colonne lisible côté client.** Stocké dans `auth.users.raw_app_meta_data` (modifiable uniquement par le service, pas par l'utilisateur) et lu en SQL via `auth.jwt()`. Un rôle placé dans `user_metadata` serait modifiable par l'utilisateur lui-même : **à proscrire.**
3. **`service_role` n'existe que dans les variables d'environnement serveur des Edge Functions.** Jamais dans `VITE_*` (tout ce qui est préfixé `VITE_` est inlining dans le bundle public).
4. **Le code `041026` reste un rituel d'ambiance** pour l'entrée de l'expérience. Il n'est plus jamais présenté ni utilisé comme un contrôle d'accès. Décision à trancher (§15, D1).
5. **Modularité mesurée.** Un seul admin, une seule apprenante : pas de CQRS, pas de state machine globale, pas de monorepo. On conserve le pattern existant `repository → hook → page`, qui fonctionne déjà bien, en ajoutant une implémentation distante derrière la même interface.

### 6.3. Arborescence cible proposée

```
src/
  app/            routage, providers, garde de rôle
  auth/           session Supabase, useAuth, RequireRole      ← nouveau
  data/
    db.ts         IndexedDB (cache local)                     ← conservé
    supabase.ts   client unique                               ← nouveau
    repositories/ interface + impl locale + impl distante     ← refactor léger
  features/
    reading/ planner/ wins/ discover/ qg/ access/             ← conservés
    resources/   catalogue + lecture apprenante               ← nouveau
    learning/    matières, exercices, soumissions, progrès    ← nouveau
    ai/          hooks d'appel aux Edge Functions             ← nouveau
  admin/         dashboard, éditeurs, corrections             ← nouveau
  experiences/   anniversaire                                 ← INTOUCHÉ
supabase/
  migrations/    001_qg_proposals.sql (existant) + suite
  functions/     ai-tutor/ , ai-books/                        ← nouveau
```

### 6.4. Compromis assumé

| Option | Pour | Contre | Verdict |
|---|---|---|---|
| Rester 100 % local | Zéro coût, zéro compte | **Ne répond à aucun besoin de la mission** ; R1 non traité | Rejeté |
| Supabase | Couvre data + auth + fichiers + serveur IA ; palier gratuit ; SQL standard donc portable | Projet gratuit mis en pause après 7 j d'inactivité ; dépendance à un fournisseur | **Retenu** `[RECOMMANDATION]` |
| Backend maison (Node/Fastify + Postgres managé) | Contrôle total | Hébergement, auth, stockage, sauvegardes à écrire et maintenir seul | Rejeté : coût d'effort disproportionné pour 2 utilisateurs |
| Netlify Functions + base tierce | Reste chez Netlify | Pas d'auth ni de storage intégrés ; recompose Supabase à la main | Rejeté |

> **Point d'attention sur Supabase gratuit** : les projets gratuits sont mis en pause après ~7 jours d'inactivité `[VÉRIFIÉ via sources publiques, voir §13]`. Avec une utilisation régulière de Princia ce cas ne se présentera pas, mais pendant les périodes creuses, une pause nécessite une réactivation manuelle depuis le tableau de bord. À connaître avant de s'engager.

---

## 7. Spécification du MVP e-learning

### 7.1. Ce que le MVP fait — et surtout ne fait pas

**Fait :** je publie une ressource ou un exercice depuis `/admin` → il apparaît chez Princia → elle le lit, rédige une réponse texte ou code, enregistre un brouillon, soumet → je vois la soumission, j'écris un commentaire → elle le lit. Avec une échéance affichée honnêtement.

**Ne fait pas (volontairement, en V1) :** QCM, upload de fichiers par Princia, exécution de code, notation chiffrée automatique, séries d'exercices, modules, statistiques de maîtrise, audio, notifications push.

Justification : ces éléments multiplient l'effort sans être nécessaires pour valider que la boucle pédagogique fonctionne entre deux personnes.

### 7.2. Chaîne de statuts

**Ressource / exercice (côté admin) :** `draft` → `published` → `archived`.
Règle dure : `draft` et `archived` sont **invisibles** chez Princia — garanti par RLS, pas par un filtre React.

**Soumission (côté apprenante) :**

```
à faire ──(ouvre, sauvegarde)──> commencé ──(soumet)──> soumis
                                                          │
                                       (je commence)      ▼
                                             en cours de correction
                                                          │
                                                          ▼
                                                      corrigé
```
État dérivé, non stocké : **en retard** = `deadline < maintenant` ET statut ∈ {à faire, commencé}.

Règles explicites :
- Une soumission n'est **jamais** marquée corrigée automatiquement. Le passage à `corrigé` est une action humaine de ta part.
- Les soumissions tardives sont **acceptées par défaut** et simplement horodatées + marquées « remis après l'échéance ». Pas de blocage, pas de ton culpabilisant — cohérent avec le ton du Carnet (Doc 01 §2.4). `[DÉCISION À CONFIRMER, §15 D5]`

### 7.3. Échéances et fuseaux horaires

**Problème réel à traiter :** le Carnet actuel compare des dates `YYYY-MM-DD` en heure locale de l'appareil. Pour un devoir, c'est insuffisant.

Règle MVP :
- Stockage en `timestamptz` (UTC) dans Postgres.
- Saisie et affichage dans le fuseau de référence **Africa/Lagos (UTC+1)**, déclaré explicitement et constant pour le projet.
- Le retard est calculé **côté serveur** (`now() > deadline`), jamais sur l'horloge du téléphone, qui peut être fausse ou décalée.
- Modifier une échéance après publication est autorisé, **horodaté et visible par Princia** (« échéance modifiée le … »), pour éviter l'effet « on a changé les règles sans me le dire ».

### 7.4. Types de réponse — MVP

| Type | V1 | Justification |
|---|---|---|
| Texte libre (`text`) | ✅ | Couvre l'essentiel |
| Code source (`code`, avec langage déclaré) | ✅ | Besoin explicite Python/JS. Textarea monospace + coloration légère ; **aucune exécution de code** |
| Fichier joint | ❌ V2 | Nécessite Storage + quotas + antivirus ; reportable |
| QCM / questions structurées | ❌ V2 | Demande un éditeur de questions complet |
| Audio | ❌ V3 | — |

### 7.5. Champs d'un exercice

**V1 (obligatoires)** : titre, instructions (markdown léger), matière, type de réponse, statut de publication.
**V1 (facultatifs)** : niveau, objectifs pédagogiques (liste), ressources associées, date limite.
**V2** : date de début, barème, critères de correction, mode de correction, indices autorisés.

Les champs V2 seront prévus dans le schéma (colonnes nullables) pour éviter une migration ultérieure, mais **absents de l'interface V1**.

### 7.6. Progression — règle d'honnêteté

Le dashboard et l'espace de Princia n'afficheront **que des comptages réels** : nombre d'exercices publiés / commencés / soumis / en attente de correction / corrigés / en retard, et les prochaines échéances.

**Interdit** : pourcentage de maîtrise, score global, « niveau », série de jours, détection automatique de « difficultés récurrentes » — aucune de ces métriques ne serait fondée sur des données suffisantes avec un seul apprenant et quelques exercices. Elles seraient inventées.

---

## 8. Spécification des assistants IA

### 8.1. Assistant pédagogique — aide graduée

Le principe que je recommande : **l'assistance monte d'un cran à chaque demande**, et le niveau atteint est enregistré par exercice.

| Niveau | Nom | Ce que l'IA fait | Ce qu'elle ne fait pas |
|---|---|---|---|
| 1 | Comprendre | Reformule la consigne, explique la notion, pose une question de relance | Ne donne aucune piste de solution |
| 2 | Indice | Un seul indice ciblé | Ne donne pas la démarche complète |
| 3 | Démarche | Décompose en étapes, explique un message d'erreur, propose des pistes de débogage | Ne donne pas le code final |
| 4 | Solution expliquée | Solution détaillée et commentée | — |

Le niveau 4 est **verrouillé par défaut** et déverrouillable depuis ton dashboard, globalement ou par exercice. `[RECOMMANDATION — décision §15 D6]`

**Contexte transmis au modèle — liste fermée, principe du minimum :**
✅ énoncé de l'exercice, matière, niveau, objectifs, titres des ressources associées, **la réponse en cours de Princia**, le message d'erreur qu'elle colle, le niveau d'aide demandé, l'historique du fil **de cet exercice uniquement**.
❌ ses livres, ses tâches, ses victoires, ses autres exercices, ses notes personnelles, la lettre d'anniversaire, son adresse e-mail, son identifiant. **Rien de son journal intime numérique ne part vers un fournisseur tiers.**

### 8.2. Assistant de recommandation de livres

Déjà à moitié construit : `recommendationEngine.ts` produit une analyse **locale et déterministe** (genres, statuts, préférences déclarées). L'IA viendra enrichir, pas remplacer.

Règles :
- Distinguer visuellement les recommandations **fondées sur ses lectures réelles** de celles issues de **culture générale du modèle**. Deux libellés distincts dans l'UI.
- **Ne jamais prétendre analyser le catalogue de Wattpad** ou d'un autre site : il n'y a ni API autorisée ni mécanisme vérifié. Le modèle ne fait que citer des titres de mémoire — ce qui implique un risque réel d'**invention de titres inexistants**. Chaque recommandation doit donc porter une mention du type « à vérifier sur la plateforme ».
- La garde existante est bonne et doit être conservée : `verifiedFreeLegal` ne vaut `true` que si le service l'affirme **et** que `sourceAccessType === "free-reading"` (`recommendationEngine.ts`). `[VÉRIFIÉ]`
- Retours : sauvegarder / lu / ignorer / noter — stockés et réinjectés comme contexte négatif (« ne propose plus ceci »).

### 8.3. Architecture d'intégration — comparatif des fournisseurs

| Critère | Google Gemini | OpenAI | Anthropic Claude | Mistral | OpenRouter (agrégateur) |
|---|---|---|---|---|---|
| Palier gratuit | **Oui**, limité par modèle `[VÉRIFIÉ : ai.google.dev/gemini-api/docs/billing]` | Non, usage payant dès le départ | Non | Oui, limité | Variable |
| Français | Bon | Bon | Très bon | Natif, très bon | Dépend du modèle |
| Code (Python/JS) | Bon | Très bon | Très bon | Bon | Dépend |
| Facilité | REST simple | REST simple | REST simple | REST simple | REST unique, multi-modèles |
| Sortie de secours | Facile (REST) | Facile | Facile | Facile | **Par construction** |
| Tarifs exacts | **À vérifier le jour du choix** | idem | idem | idem | idem |

**Recommandation :** démarrer sur **Gemini** pour son palier gratuit (coût initial nul, suffisant pour une apprenante), **derrière une abstraction `AiProvider`** permettant de basculer vers OpenAI, Claude ou Mistral en changeant une variable d'environnement serveur. Si la qualité en français ou sur le code déçoit à l'usage, le changement coûte une journée, pas une réécriture. `[RECOMMANDATION]`

> ⚠️ **Les prix au token changent souvent. Je ne fige aucun montant dans ce document : ils devront être relus sur la page de tarification officielle le jour de la décision.** `[À VÉRIFIER]`

**Contrat obligatoire de la couche serveur (Edge Function) :**
authentification du JWT appelant · vérification du rôle · validation et bornage de la taille des entrées · **quota par jour et par utilisateur, compté en base** · timeout (~20 s) · gestion explicite des erreurs 429/5xx avec message lisible en français · journal minimal (horodatage, utilisateur, exercice, niveau, tokens consommés — **jamais le contenu des échanges**) · contexte limité à la liste fermée du §8.1 · message clair et non anxiogène quand le service est indisponible.

### 8.4. Compte ChatGPT : la mise au point nécessaire

Ces quatre choses sont **différentes** et souvent confondues :

| | Ce que c'est | Coût | Permet un assistant intégré ? |
|---|---|---|---|
| **ChatGPT (site/app)** | Tu discutes toi-même avec l'IA dans ton navigateur | Gratuit ou abonnement | **Non** |
| **Abonnement ChatGPT Plus/Pro** | Plus de capacités dans l'app ChatGPT | Mensuel | **Non** |
| **API OpenAI** | Ton application appelle le modèle par programme avec une clé | **Facturation séparée à l'usage**, sur un autre compte de facturation | **Oui** |
| **OAuth « Se connecter avec… »** | Identifier un utilisateur | — | Non, sans rapport |

> **Point crucial, source vérifiée :** les abonnements grand public (Plus, Pro, Business, Enterprise) et l'usage de l'API OpenAI fonctionnent sur **des systèmes de facturation totalement séparés**. Un abonnement ChatGPT **n'offre aucun crédit API, aucune remise, aucun accès programmatique**. `[VÉRIFIÉ : documentation de facturation OpenAI relayée par plusieurs sources comparatives, 2026]`

**Ce que cela implique concrètement :** si tu paies déjà ChatGPT, cela **ne financera pas** l'assistant de Princia. Si tu veux un coût initial nul, le palier gratuit de Gemini est la bonne porte d'entrée.

### 8.5. Pilotage de l'IA depuis ton dashboard

Modifiable par toi : activation/désactivation de chaque assistant · niveaux d'aide autorisés (dont le verrou du niveau 4) · quota journalier de Princia · consigne pédagogique générale (*system prompt*) · suivi de consommation (nombre d'appels, tokens — dans la mesure où le fournisseur les expose).

**Non modifiable depuis l'interface, par conception : la clé API et l'URL du fournisseur.** Elles ne vivent que dans les variables d'environnement de la Edge Function. Une interface d'admin qui pourrait réécrire un secret serveur serait une faille.

---

## 9. Modèle de données proposé

> Proposition de schéma. **Aucune migration ne sera écrite ni appliquée avant ta validation** (§15).
> Chaque table correspond à un besoin identifié au §3–§8. Tout ce qui n'était pas justifié a été écarté (pas de table `modules`, pas de table `notes`, pas de table `badges` en V1).

### 9.1. Tables

| Table | Rôle | Champs essentiels | Accès (RLS) |
|---|---|---|---|
| `profiles` | 1 ligne par compte | `id` (=`auth.users.id`), `display_name`, `role` ∈ {admin, learner}, `created_at` | lecture : soi-même + admin ; **écriture de `role` : personne via l'API** (service uniquement) |
| `subjects` | Matières (Python, HTML/CSS, JS, …) extensibles | `id`, `name`, `slug`, `color`, `position`, `archived` | lecture : tous authentifiés ; écriture : admin |
| `resources` | Remplace `CODE_RESOURCES` codé en dur | `id`, `type` ∈ {link, article, note, file, sheet, reading}, `title`, `description`, `url?`, `storage_path?`, `subject_id?`, `level?`, `estimated_minutes?`, `status` ∈ {draft, published, archived}, `published_at`, `created_by` | lecture : admin = tout ; learner = `status='published'` **uniquement** ; écriture : admin |
| `resource_progress` | « j'ai terminé cette ressource » | `resource_id`, `user_id`, `completed_at` | chacun ses lignes ; admin en lecture |
| `exercises` | Exercices | `id`, `title`, `instructions`, `subject_id`, `level?`, `objectives[]`, `answer_type` ∈ {text, code}, `code_language?`, `opens_at?`, `deadline?` (timestamptz), `status`, `ai_help_max_level`, `created_by` | idem `resources` |
| `exercise_resources` | Liaison N-N exercice ↔ ressources | `exercise_id`, `resource_id` | suit l'exercice |
| `submissions` | **Une ligne par exercice et par apprenante** (brouillon et soumission dans la même ligne) | `id`, `exercise_id`, `user_id`, `content`, `status` ∈ {in_progress, submitted, grading, graded}, `submitted_at?`, `is_late`, `updated_at` | learner : **les siennes uniquement**, et modification **bloquée après `submitted`** ; admin : lecture totale, écriture du seul `status` |
| `feedback` | Corrections et commentaires | `id`, `submission_id`, `author_id`, `body`, `score?`, `created_at` | learner : lecture seule et **uniquement si la soumission est `graded`** ; admin : écriture |
| `reading_preferences` | Goûts de lecture (aujourd'hui local) | `user_id`, `genres[]`, `themes[]`, `avoid[]` | propriétaire |
| `recommendations` | Recommandations produites | `id`, `user_id`, `title`, `author`, `why`, `source_url?`, `source_access_type`, `verified_free_legal`, `origin` ∈ {local, ai}, `created_at` | propriétaire ; admin en lecture |
| `recommendation_feedback` | Retours (sauvegardé / lu / ignoré / noté) | `recommendation_id`, `user_id`, `action`, `rating?` | propriétaire |
| `ai_usage` | Quotas et suivi de consommation | `id`, `user_id`, `assistant` ∈ {tutor, books}, `exercise_id?`, `help_level?`, `tokens_in`, `tokens_out`, `created_at` | **écriture : Edge Function seule** ; lecture : admin |
| `app_settings` | Réglages pilotables (clé/valeur JSON) | `key`, `value`, `updated_at` | lecture : tous ; écriture : admin. **Ne contient aucun secret.** |
| `qg_proposals` | **Existe déjà** (`001_qg_proposals.sql`, non appliquée) | — | à relire et aligner avec `profiles.role` avant application |

Les livres (`books`), tâches (`tasks`) et victoires (`wins`) restent **locaux en Phase C** et ne montent au distant qu'en Phase G, après que la boucle admin/apprenant ait fait ses preuves. C'est volontaire : on ne risque pas les données existantes de Princia dès la première migration.

### 9.2. Relations

```
profiles 1─n resources (created_by)
profiles 1─n submissions (user_id)
subjects 1─n resources
subjects 1─n exercises
exercises n─n resources  (exercise_resources)
exercises 1─n submissions
submissions 1─n feedback
profiles 1─1 reading_preferences
profiles 1─n recommendations 1─n recommendation_feedback
profiles 1─n ai_usage
```

### 9.3. Contraintes et index

Clés étrangères avec `on delete` explicite partout (`cascade` pour `exercise_resources` et `feedback`, `restrict` pour une matière encore utilisée) · `check` sur chaque énumération · **unicité `(exercise_id, user_id)` sur `submissions`** · `published_at` non nul dès que `status='published'` · index sur `resources(status, published_at)`, `exercises(status, deadline)`, `submissions(user_id, status)`, `ai_usage(user_id, created_at)`.

### 9.4. Esprit des politiques RLS

RLS **activée sur toutes les tables, sans exception**, avec une fonction `is_admin()` lisant le rôle depuis `auth.jwt() -> 'app_metadata' -> 'role'`.

Les quatre garanties que ces politiques doivent produire, et qui seront testées :
1. Princia ne lit **aucune** ressource ni exercice en `draft` ou `archived`.
2. Princia ne lit **aucune** soumission qui n'est pas la sienne.
3. Princia ne peut **pas** modifier une soumission déjà envoyée, ni écrire dans `feedback`, ni changer son propre `role`.
4. Une correction n'est visible qu'une fois la soumission passée en `graded`.

---

## 10. Stratégie de sécurité et de persistance

### 10.1. Sécurité

| Règle | Application |
|---|---|
| Autorisation en base, pas dans React | RLS sur 100 % des tables |
| Rôle non falsifiable | `app_metadata` dans le JWT, jamais `user_metadata`, jamais une valeur envoyée par le client |
| `service_role` | Variables d'environnement des Edge Functions **uniquement**. Jamais `VITE_*`, jamais dans Git, jamais dans le chat |
| Fichiers | Buckets **privés**, accès par URL signée à durée courte, types MIME et taille bornés |
| `041026` | Rituel d'ambiance. Plus jamais présenté comme une sécurité, jamais utilisé côté serveur |
| Secrets | `.gitignore` couvre déjà `.env*`. Ajouter un `.env.example` **sans valeurs** |
| Cache | Jamais de `CacheFirst` sur une réponse authentifiée (voir P2, §5.2) |
| En-têtes | Ajouter une `Content-Security-Policy` avant l'ouverture de l'IA |
| Journalisation IA | Métadonnées seulement, jamais le contenu des conversations |

### 10.2. Persistance et conservation des données

Principe : **le distant devient la vérité, le local devient un cache. Rien n'est effacé.**

1. **Avant toute migration** : export JSON complet de l'IndexedDB (livres, tâches, victoires, propositions) depuis l'appareil de Princia, conservé hors application. Non négociable.
2. **Montées de schéma IndexedDB** : toujours additives, jamais de `deleteObjectStore`, chaque montée de `DB_VERSION` accompagnée d'un test de migration qui part d'une base v(n-1) peuplée et vérifie que rien n'a disparu.
3. **Anti-doublons à la synchronisation** : chaque enregistrement local porte déjà un identifiant stable (`createId()`) — il devient la clé distante. Une remontée est idempotente : même id = mise à jour, pas insertion.
4. **Conflits** : avec un seul auteur par donnée, le modèle « dernière écriture gagne, horodatée » suffit. On ne construit pas de résolution de conflit complexe pour deux utilisateurs.
5. **Soumissions et corrections** : jamais supprimées, seulement archivées.
6. **Sauvegardes** : le palier gratuit Supabase n'inclut **pas** de sauvegarde automatique `[VÉRIFIÉ via sources publiques]`. Il faudra donc un export manuel périodique (ou le passage au palier payant si les données deviennent précieuses).

> **Engagement de langage** : tant que la synchronisation n'est pas écrite **et testée**, l'interface ne doit jamais écrire ni laisser entendre que les données sont synchronisées entre appareils. Le mode local doit rester explicitement nommé, comme le fait déjà `qgService.ts`.

---

## 11. Notifications et rappels — évaluation honnête

| # | Mécanisme | Faisable ? | Prérequis | Limites | Coût |
|---|---|---|---|---|---|
| 1 | **Rappels dans l'interface** (badge « 2 échéances cette semaine », liste des retards) | ✅ **Oui, tout de suite** | Aucun | Visible seulement quand l'app est ouverte | 0 |
| 2 | **Rappels dans ton dashboard** (soumissions en attente) | ✅ Oui, après Phase C | Backend | idem | 0 |
| 3 | **Notification locale du navigateur**, app ouverte (`Notification`) | ✅ Oui | Permission accordée sur un geste volontaire | Ne fonctionne **pas** si l'app est fermée. **Non supportée sur iOS hors PWA installée** | 0 |
| 4 | **Push en arrière-plan** (Web Push + VAPID) | ⚠️ Techniquement possible, **non implémenté** | SW avec gestionnaire `push`, clés VAPID, table d'abonnements, serveur d'envoi, tâche planifiée | **Android/Chrome : correct. iOS : uniquement si la PWA est installée sur l'écran d'accueil, iOS ≥16.4, et la permission est fragile.** Fiabilité **non garantie** | 0 à faible |
| 5 | **Rappel par e-mail** via un service tiers | ⚠️ Possible | Compte fournisseur d'e-mail, tâche planifiée | Risque de spam, compte à créer | Palier gratuit souvent suffisant `[À VÉRIFIER]` |

**Recommandation :** livrer 1 et 2 dans le MVP. **Ne rien promettre sur 4** tant que ce n'est pas testé sur le téléphone réel de Princia. Aucune permission de notification ne sera demandée sans une action volontaire et une explication claire de ce qu'elle apporte.

---

## 12. Plan de tests et de non-régression

### 12.1. État de référence — mesuré ce jour `[VÉRIFIÉ, exécuté]`

| Vérification | Commande | Résultat |
|---|---|---|
| Tests | `npm test` | **25 fichiers, 206 tests — tous passants** |
| Types | `npm run typecheck` | **0 erreur** |
| Build | `npm run build` | **Succès** — JS 854,57 kB (281,67 gzip), CSS 101,59 kB (18,19 gzip), precache 31 entrées / 1620,31 KiB |
| Dépendances | `npm audit --omit=dev` | **0 vulnérabilité** |
| Lint | — | **Aucun script, aucune config ESLint** |
| CI | — | **Aucun workflow** |
| Manifeste prod | HTTP | Servi, valide, 4 icônes PNG |
| SW prod | HTTP | Servi, `autoUpdate`, 31 entrées, 2 caches runtime |

**Cet état est la ligne de référence. Toute phase future doit le retrouver intact.**

### 12.2. Lacunes de test à combler

Avant Phase C : installer ESLint + `typescript-eslint` et ajouter un script `lint` · ajouter un workflow GitHub Actions (`lint` + `typecheck` + `test` + `build`) sur la branche de travail · tester le cycle complet du `PwaUpdatePrompt` · tester le refus d'installation PWA.

### 12.3. Plan de tests fonctionnels des phases à venir

**Sécurité — tests exécutés directement contre la base, avec un vrai jeton de Princia, pas via l'UI :**
1. Lecture d'une ressource `draft` → **0 ligne**.
2. Lecture d'une soumission qui n'est pas la sienne → **0 ligne**.
3. `UPDATE` sur une soumission déjà `submitted` → **refusé**.
4. `INSERT` dans `feedback` → **refusé**.
5. `UPDATE profiles.role = 'admin'` sur soi-même → **refusé**.
6. Ouverture de `/admin` dans l'URL → écran refus **et** zéro donnée renvoyée.
7. Recherche dans `dist/` d'une occurrence de `service_role` ou d'une clé IA → **aucune**.

**Parcours produit :** création → brouillon → publication → visibilité chez Princia → modification d'une ressource publiée → création d'exercice → brouillon de réponse → soumission → confirmation → correction → lecture du retour → échéance dépassée correctement signalée.

**Robustesse :** réseau coupé · erreur serveur 5xx · quota de stockage dépassé · fournisseur IA indisponible · quota IA dépassé · jeton expiré · données conservées après actualisation et après réinstallation de la PWA.

**Appareils `[À VÉRIFIER PAR STANE]` :** téléphone de Princia (installation, mode hors ligne, affichage), ton ordinateur (dashboard), navigation clavier et contrastes sur les nouveaux écrans.

---

## 13. Budget et effort

### 13.1. Services — tarifs vérifiés ce jour

| Service | Palier gratuit | Carte bancaire exigée ? | À surveiller |
|---|---|---|---|
| **Netlify** | Déjà en place, suffisant | Non | Bande passante mensuelle |
| **Supabase** | Base 500 Mo, stockage fichiers 1 Go, 50 000 utilisateurs actifs/mois, 5 Go d'egress, 500 000 invocations de fonctions, **2 projets actifs max**, **pause après ~7 j d'inactivité**, **pas de sauvegarde automatique**. Palier Pro ≈ 25 $/mois `[VÉRIFIÉ, sources publiques 2026]` | Non pour le gratuit | La pause par inactivité et l'absence de sauvegarde |
| **Gemini API** | Oui, variable selon le modèle `[VÉRIFIÉ : ai.google.dev/gemini-api/docs/billing]` | Non pour le palier gratuit ; oui pour passer en payant (Prepay, minimum documenté autour de 10 $) | Limites de requêtes par minute |
| **OpenAI API** | **Aucun** — payant dès le premier appel, **facturation distincte de ChatGPT Plus** `[VÉRIFIÉ]` | Oui | Coût au token |

> Les montants évoluent. **À relire sur les pages officielles le jour de la décision.** Pour deux utilisateurs, le palier gratuit Supabase est, d'après ces chiffres, largement dimensionné `[HYPOTHÈSE raisonnable]`.

### 13.2. Effort par phase

Fourchettes en journées de développement, **hypothèses** : un seul développeur, périmètre tel que décrit, pas d'imprévu majeur, tests et documentation inclus. **Ce ne sont pas des engagements de délai.**

| Phase | Effort | Coût récurrent | Reportable ? |
|---|---|---|---|
| A — Audit | **Fait** (ce document) | 0 | — |
| B — Décisions + Supabase + lint/CI | 1 – 2 j | 0 | Non (bloquant) |
| C — Auth, rôles, RLS, dashboard, ressources | 5 – 8 j | 0 | Non |
| D — MVP e-learning | 6 – 10 j | 0 | Non |
| E — IA pédagogique | 4 – 6 j | variable à l'usage | **Oui** |
| F — IA livres | 2 – 4 j | variable | **Oui** |
| G — Notifications, remontée des données locales, code-splitting | 3 – 6 j | 0 | **Oui** |
| H — Validation finale | 2 – 3 j | 0 | Non |

**MVP utile et complet = B + C + D + H ≈ 14 à 23 jours, à coût de service nul.**

### 13.3. Coûts évitables

Rester sur le palier gratuit Supabase tant que les volumes le permettent · démarrer l'IA sur un palier gratuit · reporter E, F et G sans gêner l'usage quotidien · ne pas souscrire d'abonnement IA grand public en croyant financer l'application (§8.4).

---

## 14. Roadmap par phases

### Phase A — Audit *(terminée : ce document)*
**Livrable :** `Docs/06 — Post-Delivery Audit & Product Evolution Plan.md`.
**Critère d'acceptation :** tu disposes d'une vision fiable de l'existant et de la liste des décisions à prendre.

### Phase B — Décisions, fondations techniques
**Dépend de :** tes réponses au §15.
**Contenu :** création du projet Supabase · création des deux comptes et attribution des rôles · variables d'environnement locales et Netlify · ESLint + script `lint` · workflow CI (lint + typecheck + test + build) · `.env.example` sans valeurs · **export de sauvegarde de l'IndexedDB de Princia**.
**Livrables :** projet Supabase opérationnel, CI verte, sauvegarde archivée.
**Critères :** `npm run lint` existe et passe · la CI bloque un commit cassé · la sauvegarde est restaurable.
**Risques :** mauvaise configuration des rôles → tout l'édifice RLS devient faux. À vérifier par test, pas par confiance.

### Phase C — Fondations administratives
**Dépend de :** B.
**Contenu :** client Supabase + session · `useAuth` + `RequireRole` · migrations `profiles`, `subjects`, `resources`, `resource_progress` + RLS · `/admin` (vue d'ensemble, CRUD ressources, brouillon/publié/archivé) · migration de `CODE_RESOURCES` vers la table `resources` · affichage côté Princia depuis le distant · relecture et application de `001_qg_proposals.sql`.
**Critères :** une ressource publiée depuis ton ordinateur apparaît sur le téléphone de Princia **sans redéploiement** · les 7 tests de sécurité du §12.3 passent · les 206 tests existants passent toujours.
**Risques :** régression sur la section Découvrir — à couvrir par test.

### Phase D — MVP e-learning
**Dépend de :** C.
**Contenu :** `exercises`, `exercise_resources`, `submissions`, `feedback` + RLS · éditeur d'exercice · vue exercice chez Princia · brouillon + soumission · calcul du retard **côté serveur** · correction et commentaires · compteurs de progression réels.
**Critères :** boucle complète publication → soumission → correction → lecture, validée sur deux appareils distincts · une soumission n'est jamais corrigée automatiquement · aucune métrique inventée affichée.

### Phase E — IA pédagogique *(reportable)*
**Dépend de :** D + choix du fournisseur.
**Contenu :** Edge Function `ai-tutor` · abstraction `AiProvider` · aide graduée 1→4 · table `ai_usage` + quotas · réglages dans le dashboard.
**Critères :** aucune clé dans `dist/` (vérifié par recherche textuelle) · le niveau 4 reste verrouillé tant que tu ne l'ouvres pas · le quota bloque réellement · panne fournisseur = message clair, pas d'écran cassé.

### Phase F — IA de recommandation *(reportable)*
**Dépend de :** E.
**Contenu :** Edge Function `ai-books` · `reading_preferences`, `recommendations`, `recommendation_feedback` distantes · séparation visuelle recommandations locales / IA · retours.
**Critères :** aucune affirmation de disponibilité gratuite sans preuve · aucune prétention d'analyse de catalogue Wattpad.

### Phase G — Notifications, synchronisation, performance *(reportable)*
**Contenu :** rappels in-app · remontée de `books`/`tasks`/`wins` vers le distant avec anti-doublons · code-splitting par route (réduction du bundle de 854 kB) · évaluation du Web Push **sur appareil réel**.
**Critères :** aucune donnée locale perdue à la remontée · pas de doublon · aucune promesse de push non testée.

### Phase H — Validation finale
**Contenu :** non-régression complète · tests de sécurité rejoués · parcours mobile et ordinateur · vérification de l'intégrité des données · audit de performance · contrôle du déploiement.
**Critères :** suite verte · 7 tests de sécurité passants · aucun secret dans le bundle · PWA installable et fonctionnelle hors ligne sur le téléphone de Princia.

---

## 15. Décisions à soumettre avant toute implémentation

| # | Décision | Options | Ma recommandation |
|---|---|---|---|
| **D1** | Devenir du code `041026` après l'arrivée de l'authentification | (a) le garder comme rituel avant l'expérience anniversaire ; (b) le limiter à `/birthday/*` ; (c) le retirer | **(b)** — il garde sa valeur d'ambiance là où elle a du sens, et ne brouille pas la vraie connexion |
| **D2** | Mode de connexion | (a) e-mail + mot de passe ; (b) lien magique par e-mail ; (c) Google | **(a)** — simple, sans dépendance e-mail, adapté à 2 comptes |
| **D3** | Supabase confirmé comme backend | oui / non / autre | **Oui** — seule option couvrant data + auth + fichiers + serveur IA sur un palier gratuit |
| **D4** | Périmètre du MVP e-learning | tel que décrit au §7 / plus réduit / plus large | **Tel que décrit** — texte + code uniquement, pas de fichier ni de QCM en V1 |
| **D5** | Soumissions en retard | acceptées et signalées / bloquées | **Acceptées et signalées**, sans ton culpabilisant |
| **D6** | Notation chiffrée | note sur barème / commentaires seuls | **Commentaires seuls en V1**, colonne `score` prévue mais masquée |
| **D7** | Fournisseur IA | Gemini / OpenAI / Claude / Mistral / plus tard | **Gemini d'abord**, derrière une abstraction permettant d'en changer |
| **D8** | Niveau 4 (solution complète) | ouvert / verrouillé par défaut | **Verrouillé**, déverrouillable par toi |
| **D9** | Remontée des données locales de Princia | dès la Phase C / en Phase G / jamais | **Phase G** — on ne risque pas ses données existantes dans la première migration |
| **D10** | Notifications push | tenter en Phase G / renoncer | **Évaluer en G, ne rien promettre avant un test sur son téléphone** |

---

## 16. Checklist de tes interventions

Colonne « Préparable par moi » : ce que je peux écrire et tester **avant** que tu interviennes.

### A. Obligatoire avant le développement

| Action requise | Pourquoi | Où intervenir | Informations nécessaires | Coût | Moment | Préparable par moi | Statut |
|---|---|---|---|---|---|---|---|
| Répondre aux décisions D1→D10 | Elles conditionnent le schéma et les droits | Ici, en conversation | Tes préférences | 0 | **Maintenant** | Non | ⬜ |
| Confirmer que `main` est bien la branche déployée par Netlify et qu'elle contient le travail récent | Éviter d'auditer un code qui n'est pas en ligne | Tableau de bord Netlify | — | 0 | Maintenant | Non | ⬜ |
| Indiquer le téléphone de Princia (Android ou iPhone) et sa version | Détermine la faisabilité du push et le risque d'éviction du stockage | — | Modèle / version OS | 0 | Maintenant | Non | ⬜ |
| **Exporter une sauvegarde des données actuelles de Princia** | Protection contre R1, irréversible si omis | Son téléphone, bouton d'export | — | 0 | **Avant toute migration** | **Oui** — je peux écrire le bouton d'export | ⬜ |
| Valider le périmètre du MVP | Cadrer l'effort | Ici | — | 0 | Maintenant | Non | ⬜ |

### B. Obligatoire avant l'activation d'un service

| Action requise | Pourquoi | Où intervenir | Informations nécessaires | Coût | Moment | Préparable par moi | Statut |
|---|---|---|---|---|---|---|---|
| Créer le projet Supabase (région proche, ex. Europe) | Source de vérité partagée | supabase.com | Nom du projet, région, mot de passe base | **Gratuit**, pas de CB `[VÉRIFIÉ]` | Phase B | Non (compte personnel) | ⬜ |
| Créer les 2 comptes et attribuer les rôles | Séparer admin et apprenante | Tableau de bord Supabase | Les deux e-mails | 0 | Phase B | **Oui** — je fournis le script SQL exact | ⬜ |
| Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` | Brancher le frontend | `.env` local + variables Netlify | Depuis le tableau de bord Supabase | 0 | Phase B | **Oui** — je prépare `.env.example` et la doc | ⬜ |
| Créer le bucket **privé** des pièces jointes | Fichiers non exposés | Supabase Storage | Nom, limite de taille | 0 | Phase C/D | **Oui** — politiques fournies | ⬜ |
| Créer le compte du fournisseur IA et la clé | Assistants | Console du fournisseur | — | Gemini : palier gratuit sans CB. OpenAI : CB obligatoire `[VÉRIFIÉ]` | Phase E | Non | ⬜ |
| Déposer la clé IA **dans les secrets de la Edge Function** | Ne jamais l'exposer | Supabase → Edge Functions → Secrets | — | 0 | Phase E | **Oui** — la fonction est prête à la lire | ⬜ |
| Confirmer les tarifs du jour | Éviter une surprise | Pages officielles | — | 0 | Avant E | Non | ⬜ |

> 🔒 **Je ne te demanderai jamais une clé ou un mot de passe dans cette conversation, et aucun secret ne sera écrit dans le dépôt.**

### C. Obligatoire avant la mise en production

| Action requise | Pourquoi | Où intervenir | Coût | Moment | Préparable par moi | Statut |
|---|---|---|---|---|---|---|
| Renseigner les variables d'environnement de production | Sinon l'application reste en mode local | Netlify → Environment variables | 0 | Avant déploiement | Oui (documentation) | ⬜ |
| Appliquer les migrations SQL | Créer le schéma | Supabase SQL / CLI | 0 | Avant déploiement | **Oui** — migrations versionnées fournies | ⬜ |
| **Vérifier les règles de sécurité avec le vrai compte de Princia** | Preuve que l'admin est inatteignable | Son téléphone / un navigateur dédié | 0 | Avant d'ouvrir l'accès | **Oui** — je fournis les 7 tests | ⬜ |
| Tester l'installation PWA sur son téléphone | Aucun test automatisé ne peut le remplacer | Son téléphone | 0 | Avant annonce | Non | ⬜ |
| Confirmer que les données existantes sont intactes | Non-régression des données | Son appareil | 0 | Après migration | Oui (écran de contrôle) | ⬜ |

### D. Facultatif ou ultérieur

| Action | Quand | Coût |
|---|---|---|
| Passer Supabase en palier payant (sauvegardes automatiques, pas de pause) | Si les données deviennent précieuses | ≈ 25 $/mois `[À VÉRIFIER]` |
| Activer la facturation IA au-delà du palier gratuit | Si l'usage dépasse les quotas | Variable |
| Service d'e-mail pour les rappels | Phase G | Palier gratuit fréquent `[À VÉRIFIER]` |
| Web Push | Phase G, après test sur appareil | 0 |
| Upload de fichiers par Princia, QCM, audio | V2 | 0 |
| Nom de domaine personnalisé | Quand tu veux | ≈ 10–15 €/an `[À VÉRIFIER]` |

---

## 17. Conclusion — ce que j'attends de toi

### 17.1. Les constats qui comptent vraiment

1. **L'application est saine.** 206 tests passants, 0 erreur de type, 0 vulnérabilité, build correct, PWA conforme, aucun secret exposé, aucun écran « vide » qui ferait semblant de fonctionner. C'est une base sur laquelle on peut construire sereinement.
2. **Il n'y a pas de backend.** Tout ce que tu demandes — dashboard, publication, exercices, soumissions, corrections, IA — en dépend intégralement. C'est le seul vrai verrou.
3. **Le code Supabase existe déjà mais n'est pas branché.** Une partie du travail de la Phase C est donc déjà écrite et attend un projet et deux variables d'environnement.
4. **Les données de Princia ne sont nulle part sauvegardées.** C'est le risque le plus urgent, et il est indépendant de toute nouvelle fonctionnalité.
5. **`041026` ne protégera jamais ton espace d'administration.** Il faut une vraie authentification avec des règles appliquées en base.
6. **Ton abonnement ChatGPT ne financera pas l'assistant.** L'API est facturée séparément ; le palier gratuit de Gemini est la porte d'entrée à coût nul.

### 17.2. Les décisions dont j'ai besoin

Les dix décisions **D1 à D10** du §15. Les plus bloquantes : **D3** (Supabase), **D2** (mode de connexion), **D4** (périmètre du MVP).

### 17.3. Ce que tu dois faire, dans l'ordre

1. Répondre à D1→D10.
2. Confirmer la branche déployée par Netlify.
3. M'indiquer le téléphone de Princia.
4. **Me laisser préparer le bouton d'export, puis faire la sauvegarde de ses données.**
5. Créer le projet Supabase et les deux comptes.
6. Me transmettre l'URL du projet et la clé **anon** — qui est publique par conception — en les déposant dans les variables d'environnement, **pas dans cette conversation**.

### 17.4. Première phase recommandée

**Phase B — Décisions et fondations techniques (1 à 2 jours, coût nul).**

Je peux commencer **immédiatement** la partie qui ne dépend d'aucun compte :
- ESLint + script `lint` + workflow CI (lint, typecheck, test, build) ;
- `.env.example` documenté, sans aucune valeur ;
- **bouton d'export complet des données locales de Princia** — la protection la plus urgente contre R1 ;
- migrations SQL et politiques RLS rédigées, versionnées, **non appliquées**, prêtes pour ta relecture.

Rien de tout cela ne touche à l'application en production ni aux expériences d'anniversaire.

---

**🛑 Point d'arrêt. Conformément au §16 de ta mission, je m'arrête ici et n'engage aucun développement du dashboard, du système e-learning, des assistants IA, des migrations ou des notifications. J'attends ton feu vert explicite, décision par décision.**
