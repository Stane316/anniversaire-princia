# 03 — TECHNICAL ARCHITECTURE
## PRINCIA — Chapter 18

**Type :** Spécification d’architecture technique  
**Version :** 1.0  
**Statut :** Référence de conception et d’implémentation  
**Projet :** Expérience anniversaire privée et PWA personnelle  
**Document de référence :** `03-TECHNICAL-ARCHITECTURE.md`

---

# 00 — PURPOSE & SCOPE

## 00.1 — Objectif du document

Ce document traduit les décisions fonctionnelles, expérientielles et visuelles des documents précédents en une architecture technique cohérente, maintenable et adaptée aux contraintes réelles du projet.

Il définit :

- l’architecture générale de l’application ;
- les responsabilités des différentes couches ;
- l’organisation logique du code ;
- les règles de composition des composants React ;
- la gestion des états et des parcours ;
- la gestion des données locales et distantes ;
- la stratégie PWA et hors ligne ;
- la séparation entre interface, logique métier et effets visuels ;
- la stratégie de sécurité et de confidentialité ;
- les intégrations facultatives ;
- les contraintes de performance, d’accessibilité et de qualité ;
- les règles de vérification de l’environnement existant ;
- les critères permettant de considérer l’architecture comme correctement implémentée.

Le document doit servir de référence à l’agent IA de développement pendant toutes les phases techniques du projet.

## 00.2 — Documents de référence

L’agent doit lire les documents du projet avant toute intervention.

| Document | Responsabilité |
|---|---|
| `00 — Project Brief` | Vision, objectifs, public, contraintes et périmètre du projet |
| `01 — Experience & UX Specification` | Parcours, écrans, navigation, interactions et comportements fonctionnels |
| `02 — Visual & Motion Direction` | Identité visuelle, composants visuels, animations et direction artistique |
| `03 — Technical Architecture` | Architecture, responsabilités techniques, données, sécurité et intégrations |
| `04 — Implementation Roadmap` | Phases, ordre d’implémentation, livrables et critères de validation |
| `05 — AI Development Prompts` | Protocole de travail et instructions opérationnelles destinées à l’agent IA |

Les noms exacts et le contenu des documents présents dans le dépôt doivent être vérifiés. Le tableau ci-dessus décrit leur rôle attendu ; il ne constitue pas une affirmation selon laquelle tous les fichiers existent déjà sous ces noms.

## 00.3 — Hiérarchie des décisions

L’agent doit distinguer trois catégories :

1. **Décisions validées :** exigences et choix explicitement établis dans les documents approuvés par le propriétaire du projet.
2. **Décisions techniques d’implémentation :** choix internes nécessaires pour mettre en œuvre les exigences sans les modifier.
3. **Suggestions :** améliorations ou changements possibles qui nécessitent une validation explicite avant leur adoption lorsqu’ils touchent au périmètre, à l’architecture, aux dépendances ou au comportement fonctionnel.

Une décision technique interne ne peut pas modifier silencieusement une décision validée.

## 00.4 — Principe fondamental : préserver l’existant

Le dépôt n’est pas considéré comme un projet vierge.

Le propriétaire a déjà exécuté plusieurs commandes dans le terminal, notamment :

- `npx impeccable install`
- `npm i animejs`
- `npx create-video@latest`
- `npx motion-ai`

Les ressources suivantes ont également été identifiées :

- Motion : `https://motion.dev/`
- Remotion : `https://www.remotion.dev/`
- Anime.js : `https://animejs.com/`
- Impeccable : `https://impeccable.style/`
- React Bits : `https://www.reactbits.dev/`

**Important :** ces commandes et ressources sont des éléments connus de l’historique du projet. Leur présence ne prouve ni que toutes les installations ont réussi, ni que toutes les dépendances sont encore présentes, ni que leurs configurations sont opérationnelles.

L’agent doit vérifier l’état réel du dépôt avant de décider quoi que ce soit.

---

# 01 — ARCHITECTURAL PRINCIPLES

## 01.1 — Architecture au service de l’expérience

L’architecture doit répondre aux besoins du projet, et non aux possibilités théoriques des bibliothèques disponibles.

La séquence de décision est :

```text
BESOIN UTILISATEUR
        ↓
COMPORTEMENT VALIDÉ
        ↓
RESPONSABILITÉ FONCTIONNELLE
        ↓
CONCEPTION TECHNIQUE
        ↓
CHOIX DE L'OUTIL
        ↓
IMPLÉMENTATION
        ↓
VÉRIFICATION
```

Il ne faut pas partir d’une bibliothèque pour lui chercher artificiellement une utilité.

## 01.2 — Séparation des responsabilités

L’application doit séparer clairement :

- la présentation ;
- les parcours et transitions fonctionnelles ;
- la logique métier ;
- la gestion des données ;
- les effets visuels ;
- les intégrations externes.

Un composant ne doit pas simultanément gérer toute une page, les données, les règles métier, la navigation et une timeline d’animation complexe.

## 01.3 — Architecture progressive

Le projet doit évoluer par étapes.

La première livraison vise une expérience anniversaire complète, stable et accessible. Les fonctionnalités quotidiennes sont développées dans le respect de cette priorité.

Les fonctionnalités futures ne doivent pas entraîner prématurément l’ajout de systèmes complexes qui ne sont pas nécessaires à la première livraison.

## 01.4 — Simplicité et évolutivité

L’architecture doit être suffisamment structurée pour évoluer, sans introduire une complexité disproportionnée.

Éviter notamment :

- les abstractions génériques sans besoin concret ;
- les couches de services qui ne font qu’envelopper un appel trivial ;
- les bibliothèques concurrentes ayant la même responsabilité ;
- la duplication de la logique métier ;
- les dépendances ajoutées uniquement pour produire un effet décoratif ;
- les systèmes d’authentification, de synchronisation ou d’IA non nécessaires au périmètre courant.

## 01.5 — L’architecture n’est pas modifiée sur une simple référence esthétique

Une capture d’écran, un site d’inspiration, une animation de référence ou une démonstration 3D ne justifie pas automatiquement :

- l’adoption d’un nouveau framework ;
- le remplacement du routeur ;
- l’introduction de Three.js ;
- l’ajout d’un backend ;
- le remplacement du système de styles ;
- la multiplication des moteurs d’animation ;
- une refonte complète de l’organisation des fichiers.

L’agent doit d’abord déterminer si le résultat recherché peut être obtenu avec les outils et l’architecture déjà en place.

Tout changement architectural significatif doit être présenté comme une proposition distincte, avec ses avantages, ses coûts, ses risques et ses alternatives. Il attend la validation du propriétaire avant de l’appliquer.

---

# 02 — ENVIRONMENT AUDIT BEFORE IMPLEMENTATION

## 02.1 — Objectif

Avant toute modification, l’agent doit établir un état des lieux fiable du projet local.

Cet audit est obligatoire lors de la reprise du travail, et particulièrement avant la première phase d’implémentation technique.

## 02.2 — Éléments à examiner

L’agent doit inspecter :

1. la structure actuelle du dépôt ;
2. le contenu de `package.json` ;
3. le fichier de verrouillage des dépendances ;
4. la version de Node.js ;
5. le gestionnaire de paquets effectivement utilisé ;
6. les scripts de développement, de build et de test ;
7. les configurations TypeScript, Vite, Tailwind ou CSS ;
8. les éventuels fichiers PWA, manifestes et service workers ;
9. les routes et composants existants ;
10. les fichiers de configuration des outils installés ;
11. l’état Git, la branche active et les modifications non commitées ;
12. les variables d’environnement et leurs fichiers d’exemple, sans afficher les secrets ;
13. les tests existants et leur état ;
14. les éventuels composants ou configurations générés par Impeccable, Motion AI ou d’autres outils.

L’agent ne doit pas considérer une bibliothèque comme absente simplement parce qu’elle n’est pas utilisée dans le premier composant inspecté.

## 02.3 — Commandes de diagnostic indicatives

Sous Windows, dans le terminal du dépôt, l’agent peut utiliser les commandes compatibles avec l’environnement présent :

```bash
git status --short
git branch --show-current
node --version
npm --version
npm ls --depth=0
```

Puis examiner les fichiers existants, notamment :

```text
package.json
package-lock.json
vite.config.*
tsconfig*.json
index.html
src/
public/
```

Ces chemins sont des exemples à vérifier, pas une obligation de créer les fichiers manquants à ce stade.

L’agent doit adapter les commandes au gestionnaire de paquets et à la structure effectivement détectés.

## 02.4 — Vérification des commandes déjà exécutées

L’agent doit notamment déterminer :

- si Anime.js figure dans les dépendances ;
- si Motion est installé, et sous quel nom de paquet ;
- si Impeccable a généré des fichiers, une configuration ou des instructions ;
- si `create-video` a produit des fichiers dans le dépôt, un sous-dossier ou un autre emplacement ;
- si `motion-ai` a généré des éléments utilisables ;
- si les outils ont modifié `package.json`, le verrouillage ou les configurations ;
- si les installations ont laissé des modifications non commitées.

Il ne faut pas exécuter à nouveau ces commandes uniquement pour s’assurer qu’elles « sont passées ».

## 02.5 — Rapport d’audit obligatoire

Avant de toucher à l’architecture, l’agent doit présenter un résumé structuré :

| Élément | Informations attendues |
|---|---|
| Environnement | OS, versions disponibles et gestionnaire de paquets |
| Application | Framework, langage, point d’entrée et structure actuelle |
| Dépendances | Paquets présents, versions et responsabilités |
| Outils de création | Fichiers et configurations effectivement générés |
| PWA | Éléments présents, absents ou incomplets |
| Tests | Scripts disponibles et résultat des vérifications exécutées |
| Git | Branche, modifications locales et risques d’écrasement |
| Écarts | Différences entre l’état réel et l’architecture cible |
| Prochaine action | Intervention minimale nécessaire à la phase courante |

Si le dépôt n’est pas accessible à l’agent, celui-ci doit le signaler et demander l’accès ou les éléments manquants. Il ne doit pas prétendre avoir inspecté l’environnement local.

## 02.6 — Règle de préservation

L’agent ne doit jamais :

- écraser un fichier existant sans en examiner le contenu ;
- supprimer une dépendance parce qu’elle semble inutile à première vue ;
- remplacer un fichier de verrouillage sans justification ;
- réinitialiser le dépôt Git ;
- écraser des modifications locales non commitées ;
- réinstaller globalement les outils déjà présents sans besoin vérifié ;
- remplacer toute la configuration par un modèle neuf ;
- effectuer une migration architecturale en dehors du périmètre de la phase active.

Si une modification risque d’effacer le travail existant, l’agent doit s’arrêter et demander une décision.

---

# 03 — TARGET ARCHITECTURE

## 03.1 — Vue d’ensemble

L’architecture cible repose sur une application web React, Vite et TypeScript, installable sous forme de PWA.

La structure logique recommandée est la suivante :

```text
┌─────────────────────────────────────────────┐
│                 EXPERIENCE                  │
│                                             │
│  Birthday Experience     Daily Workspace    │
│  ├─ Blue Library         ├─ Dashboard       │
│  ├─ The 18th Case        ├─ Reading Library │
│  ├─ Birthday Letter      ├─ Planner         │
│  └─ Memories             ├─ Small Wins      │
│                          └─ Discovery       │
├─────────────────────────────────────────────┤
│             PRESENTATION LAYER              │
│                                             │
│  Pages / Layouts / UI Components            │
│  Responsive Layout / Accessibility          │
├─────────────────────────────────────────────┤
│            EXPERIENCE CONTROLLERS           │
│                                             │
│  Flow State / Navigation / Progress         │
│  UI Feedback / Motion Coordination          │
├─────────────────────────────────────────────┤
│               DOMAIN LAYER                  │
│                                             │
│  Birthday Content / Books / Tasks            │
│  Goals / Small Wins / Preferences           │
│  Validation / Domain Rules                  │
├─────────────────────────────────────────────┤
│               DATA LAYER                    │
│                                             │
│  Repositories / Local Storage / IndexedDB   │
│  Optional Remote Adapter                    │
├─────────────────────────────────────────────┤
│             PLATFORM SERVICES               │
│                                             │
│  PWA / Cache / Network Status               │
│  Notifications / Optional Integrations      │
└─────────────────────────────────────────────┘
```

Ce schéma définit des responsabilités logiques. Il n’impose pas que chaque bloc devienne un dossier, un paquet ou un service indépendant.

## 03.2 — Frontend principal

Le frontend doit prendre en charge :

- l’affichage de tous les écrans ;
- la navigation entre les expériences ;
- les interactions utilisateur ;
- les états des parcours ;
- la validation des formulaires ;
- la présentation des contenus ;
- les préférences d’interface ;
- l’accès aux données à travers une couche dédiée ;
- l’adaptation aux différents écrans ;
- les interactions avec les fonctionnalités PWA.

React gère la composition des interfaces et leur mise à jour en fonction des états. Vite assure l’environnement de développement et la construction du frontend. TypeScript permet de définir les contrats de données et de réduire certaines erreurs d’intégration.

Ces responsabilités ne doivent pas être confondues avec celles d’un backend.

## 03.3 — Absence de backend obligatoire pour l’expérience anniversaire

L’expérience anniversaire peut fonctionner sans backend applicatif si les contenus sont fournis avec l’application et si les fonctionnalités requises ne dépendent pas d’un compte distant.

Cette approche permet de limiter les dépendances et les risques pour la livraison initiale.

Un backend ne doit être introduit que lorsqu’une fonctionnalité validée nécessite réellement un traitement ou une donnée distante, par exemple une synchronisation entre appareils ou un service d’IA.

## 03.4 — Modèle de déploiement

L’application doit pouvoir être construite sous forme de fichiers web statiques et hébergée sur une plateforme compatible avec le déploiement du frontend.

Le fournisseur d’hébergement et les éventuels services complémentaires doivent être confirmés en fonction de la configuration réelle du projet.

L’agent ne doit pas imposer une migration d’hébergement dans le cadre de la seule implémentation de l’interface.

---

# 04 — RESPONSIBILITIES & BOUNDARIES

## 04.1 — Couche de présentation

Responsabilités :

- afficher les données ;
- rendre les composants interactifs ;
- appliquer les règles visuelles ;
- présenter les erreurs et confirmations ;
- exposer les commandes disponibles à l’utilisateur ;
- respecter les états de chargement, de désactivation et de vide.

Elle ne doit pas contenir directement les détails d’accès à Supabase, les appels à un modèle d’IA ou des requêtes SQL.

## 04.2 — Couche des parcours

Responsabilités :

- connaître l’étape active d’un parcours ;
- répondre aux actions utilisateur ;
- déterminer les transitions autorisées ;
- suivre la progression lorsqu’elle doit être conservée ;
- gérer le retour à une étape précédente ;
- permettre de quitter ou de reprendre un parcours ;
- transmettre à l’interface l’état à afficher.

Exemple :

```text
WELCOME
   ↓
BLUE_LIBRARY
   ↓
CHAPTER
   ↓
LETTER
   ↓
DAILY_SPACE
```

Le parcours alternatif `The 18th Case` possède sa propre logique de progression. Il ne doit pas devenir une condition obligatoire pour accéder à la lettre ou à l’espace quotidien.

## 04.3 — Couche métier

Responsabilités :

- définir les règles des tâches ;
- gérer les statuts des livres ;
- valider les changements d’état ;
- traiter les objectifs et les petites victoires ;
- garantir la cohérence des données ;
- centraliser les transformations métier réutilisées par plusieurs écrans.

Les règles métier doivent être indépendantes des détails de mise en page.

## 04.4 — Couche de données

Responsabilités :

- lire et enregistrer les données ;
- gérer les identifiants ;
- convertir les données stockées en modèles applicatifs ;
- traiter les erreurs d’accès au stockage ;
- gérer les éventuelles migrations de données locales ;
- offrir une interface stable au reste de l’application.

Les composants React ne doivent pas accéder directement à IndexedDB à travers des appels dispersés dans plusieurs écrans.

## 04.5 — Couche visuelle et motion

Responsabilités :

- animations d’entrée et de sortie ;
- révélations de contenu ;
- transitions entre scènes ;
- mouvements des composants ;
- interactions visuelles ;
- états visuels actifs ;
- effets décoratifs et ambiance.

Cette couche ne décide pas si un chapitre est terminé, si un livre est lu ou si une tâche est échue. Elle représente visuellement des états décidés par les couches fonctionnelles.

## 04.6 — Services de plateforme

Ils regroupent les interactions avec les capacités du navigateur :

- état du réseau ;
- cache applicatif ;
- installation PWA ;
- notifications, lorsqu’elles sont prises en charge ;
- préférences de réduction du mouvement ;
- capacités de stockage ;
- disponibilité des APIs du navigateur.

Chaque service doit prévoir les cas où la capacité n’existe pas ou n’est pas autorisée.

---

# 05 — RECOMMENDED PROJECT STRUCTURE

## 05.1 — Principe

La structure doit refléter les responsabilités réelles du projet, tout en restant adaptée à son volume.

L’organisation suivante constitue une **structure cible indicative**. Elle ne doit pas être créée en bloc si le dépôt possède déjà une structure équivalente ou plus adaptée.

```text
project-root/
│
├── public/
│   ├── icons/
│   ├── images/
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers/
│   │
│   ├── experiences/
│   │   ├── birthday/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── flows/
│   │   │   ├── data/
│   │   │   └── types.ts
│   │   │
│   │   └── daily/
│   │       ├── pages/
│   │       ├── components/
│   │       └── types.ts
│   │
│   ├── features/
│   │   ├── reading/
│   │   ├── planner/
│   │   ├── small-wins/
│   │   ├── discovery/
│   │   ├── preferences/
│   │   └── notifications/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── feedback/
│   │
│   ├── domain/
│   │   ├── models/
│   │   ├── rules/
│   │   └── validation/
│   │
│   ├── data/
│   │   ├── repositories/
│   │   ├── local/
│   │   ├── remote/
│   │   └── migrations/
│   │
│   ├── services/
│   │   ├── pwa/
│   │   ├── network/
│   │   └── notifications/
│   │
│   ├── motion/
│   │   ├── presets/
│   │   ├── transitions/
│   │   └── hooks/
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── globals.css
│   │   └── ...
│   │
│   ├── lib/
│   │   └── ...
│   │
│   └── main.tsx
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── index.html
├── package.json
├── ...
└── README.md
```

## 05.2 — Règles d’organisation

- `app/` : assemblage de l’application, configuration et navigation globale.
- `experiences/birthday/` : parcours anniversaire et contenus propres à cette expérience.
- `experiences/daily/` : espace quotidien et écrans de synthèse.
- `features/` : fonctionnalités métier réutilisables et relativement indépendantes.
- `components/ui/` : primitives et composants visuels génériques.
- `domain/` : modèles et règles métier sans dépendance à l’interface.
- `data/` : persistance locale, accès distant et conversions de données.
- `services/` : intégrations avec les capacités du navigateur et services externes.
- `motion/` : conventions et utilitaires d’animation réutilisables.
- `styles/` : tokens et styles globaux.

## 05.3 — Ne pas sur-segmenter

Cette organisation ne doit pas conduire à créer des dizaines de dossiers vides ou de fichiers ne contenant qu’une ligne.

Un fichier doit exister lorsqu’il représente une responsabilité réelle.

L’agent peut conserver une organisation plus simple pour la première version, tant que les frontières entre responsabilités restent claires.

## 05.4 — Convention de nommage

Les noms doivent être cohérents avec le code existant.

Exemples indicatifs :

- composants React : `BirthdayWelcome.tsx` ;
- hooks : `useBirthdayFlow.ts` ;
- fonctions métier : `completeChapter.ts` ;
- types : `Book.ts` ou types regroupés dans `types.ts` ;
- tests : `useBirthdayFlow.test.ts` ;
- utilitaires : noms explicites, sans abréviations opaques.

Ne pas renommer l’ensemble du projet uniquement pour uniformiser une convention mineure.

---

# 06 — ROUTING & NAVIGATION ARCHITECTURE

## 06.1 — Principe

La navigation doit distinguer les grandes zones de l’application :

1. expérience anniversaire ;
2. espace quotidien ;
3. vues et fonctionnalités internes à cet espace ;
4. préférences et paramètres, lorsqu’ils sont implémentés.

Le système de navigation doit rester cohérent avec le document 01.

## 06.2 — Choix du routeur

L’agent doit vérifier si un routeur est déjà installé.

Si un routeur est présent et adapté, il doit être conservé.

Si aucun routeur n’existe, le choix d’en ajouter un doit être proportionné au besoin réel de navigation.

Le projet ne doit pas changer de routeur en raison d’une préférence esthétique.

## 06.3 — Routes conceptuelles

Les chemins suivants sont des exemples de convention, pas des routes déjà implémentées :

```text
/                         Entrée de l'expérience
/birthday                 Expérience anniversaire
/birthday/library         Blue Library
/birthday/case            The 18th Case
/birthday/letter          Lettre d'anniversaire
/app                      Espace quotidien
/app/reading              Bibliothèque personnelle
/app/planner              Organisation universitaire
/app/victories            Petites victoires
/app/discover             À découvrir
/app/settings             Préférences
```

L’agent doit reprendre les routes existantes lorsqu’elles correspondent déjà au parcours validé.

## 06.4 — État de navigation et URL

L’URL doit représenter les vues que l’utilisateur peut raisonnablement ouvrir, actualiser ou partager au sein de l’application.

En revanche, les détails temporaires d’une animation ou d’un élément décoratif ne doivent pas être ajoutés à l’URL.

L’état d’un parcours peut être :

- local à la page ;
- conservé dans un état applicatif ;
- persisté localement si la reprise est nécessaire.

Le choix dépend du comportement défini dans le document 01.

## 06.5 — Actualisation et navigation directe

Une actualisation ne doit pas provoquer une page blanche ou un parcours incohérent.

Les routes applicatives doivent fonctionner en accès direct lorsque la plateforme d’hébergement le permet et que cette possibilité est prévue.

Le comportement de retour du navigateur doit rester compréhensible.

## 06.6 — Sortie des parcours

L’utilisateur doit pouvoir quitter un parcours narratif et revenir à une zone connue.

Une animation ne doit jamais être la seule manière de quitter une scène.

L’accès à la lettre d’anniversaire et à l’espace quotidien ne doit pas dépendre de la résolution des énigmes facultatives.

---

# 07 — STATE MANAGEMENT

## 07.1 — Catégories d’état

L’application doit distinguer quatre grandes catégories.

### A. État local d’interface

Exemples :

- menu ouvert ;
- modal visible ;
- champ en cours d’édition ;
- onglet actif ;
- carte développée ;
- état temporaire d’un bouton.

Cet état doit rester au plus près du composant qui en a besoin.

### B. État d’expérience

Exemples :

- parcours actif ;
- chapitre sélectionné ;
- indice découvert ;
- étape actuelle ;
- progression d’une expérience ;
- écran de destination.

Il appartient à la couche qui coordonne le parcours.

### C. État métier persistant

Exemples :

- livres et statuts de lecture ;
- tâches et échéances ;
- objectifs ;
- petites victoires ;
- préférences utilisateur ;
- progression que l’utilisateur doit pouvoir retrouver.

Cet état doit passer par la couche de données.

### D. État de plateforme

Exemples :

- connexion disponible ou non ;
- permission de notification ;
- application installée ou non ;
- mise à jour du service worker disponible ;
- stockage indisponible.

Cet état doit être exposé à l’interface par des services ou hooks adaptés.

## 07.2 — Choix du mécanisme

L’agent doit privilégier les mécanismes déjà présents dans le projet lorsqu’ils conviennent.

- État local React pour les interactions simples.
- Context React pour les états réellement partagés dans une partie de l’arbre.
- Un outil de gestion d’état global uniquement si la complexité et le partage de l’état le justifient.
- Une couche de requêtes distantes uniquement lorsqu’il existe des données distantes à charger et à synchroniser.

Ne pas introduire une bibliothèque globale de gestion d’état par automatisme.

## 07.3 — Éviter les états redondants

Une donnée ne doit pas être dupliquée sans raison.

Par exemple, si l’état d’un livre est `reading`, le nombre de livres en cours doit être calculé à partir de la collection, et non maintenu séparément si cela crée un risque d’incohérence.

Privilégier les valeurs dérivées lorsque c’est possible.

## 07.4 — Machine à états des parcours

Les parcours narratifs doivent être modélisés avec des états explicites.

Exemple conceptuel :

```text
NOT_STARTED
     ↓
WELCOME
     ↓
LIBRARY_ACTIVE
     ↓
CHAPTER_OPEN
     ↓
LETTER_AVAILABLE
     ↓
DAILY_SPACE
```

L’expérience alternative possède ses propres états, par exemple :

```text
CASE_INTRO
     ↓
CLUE_AVAILABLE
     ↓
CLUE_REVEALED
     ↓
CASE_COMPLETE
```

Ces exemples ne remplacent pas la séquence exacte définie dans le document 01.

## 07.5 — Transitions valides

Chaque transition doit être provoquée par une action ou un événement identifiable.

L’agent doit éviter les changements d’état implicites déclenchés uniquement par le rendu d’un composant.

Une transition doit :

1. vérifier que l’action est autorisée ;
2. mettre à jour l’état fonctionnel ;
3. déclencher le feedback visuel correspondant ;
4. permettre à l’utilisateur de poursuivre son action.

## 07.6 — Persistance de la progression

L’agent doit déterminer, selon le document 01, quelles progressions doivent survivre à une actualisation ou à une fermeture de l’application.

Les informations non nécessaires à une reprise ne doivent pas être persistées artificiellement.

La persistance ne doit jamais bloquer la lecture de la lettre ou l’accès à l’espace quotidien.

---

# 08 — DATA ARCHITECTURE

## 08.1 — Classification des données

Les données doivent être classées selon leur fonction et leur besoin de persistance.

| Catégorie | Exemples | Traitement initial recommandé |
|---|---|---|
| Contenu anniversaire statique | Lettre, textes, chapitres, indices | Fichiers du projet |
| Médias | Photos, illustrations, icônes | Fichiers statiques optimisés |
| Préférences | Réduction du mouvement, options d’interface | Stockage local si nécessaire |
| Progression | Chapitres ouverts, indices découverts | État local ou persistance légère selon besoin |
| Données personnelles quotidiennes | Livres, notes, tâches, petites victoires | Persistance locale |
| Données distantes | Synchronisation future, données de compte | Service distant facultatif |
| Secrets | Clés API, clés privées, identifiants sensibles | Jamais intégrés dans le bundle frontend |

## 08.2 — Contenu anniversaire

La lettre et les textes de l’expérience anniversaire doivent être séparés du code de présentation lorsque cela facilite leur maintenance.

L’agent doit permettre de modifier les contenus sans réécrire la logique de navigation.

Un contenu peut être décrit par des données typées, par exemple :

```ts
type BirthdayChapter = {
  id: string;
  title: string;
  introduction?: string;
  body: string;
  image?: string;
  order: number;
};
```

Ce type est un exemple de contrat. Il doit être adapté au contenu et à la structure déjà validés.

Les souvenirs personnels ne doivent pas être inventés par l’agent. Les textes, photos et anecdotes doivent provenir du propriétaire du projet ou être explicitement approuvés.

## 08.3 — Bibliothèque de lecture

Modèle conceptuel :

```ts
type ReadingStatus = "to-read" | "reading" | "completed";

type Book = {
  id: string;
  title: string;
  author?: string;
  category?: string;
  status: ReadingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

Les champs définitifs doivent suivre les besoins du document 01 et l’implémentation réelle.

Les opérations métier comprennent :

- créer une entrée ;
- modifier ses informations ;
- changer son statut ;
- enregistrer ou modifier une note ;
- supprimer une entrée après confirmation lorsque nécessaire ;
- filtrer les livres par statut ou catégorie.

Une entrée ne doit pas disparaître à la suite d’un simple changement de filtre.

## 08.4 — Planificateur universitaire

Modèle conceptuel :

```ts
type PlannerTask = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};
```

Le modèle final peut intégrer des priorités, catégories ou rappels si ces éléments sont prévus dans le document 01.

Règles :

- une tâche peut être créée et modifiée ;
- une tâche peut être terminée puis, si nécessaire, rouverte ;
- une échéance absente doit être autorisée lorsqu’elle n’est pas obligatoire ;
- une tâche échue ne doit pas être confondue avec une tâche terminée ;
- une erreur d’enregistrement doit être visible ;
- les dates doivent être traitées de manière cohérente avec le fuseau horaire de l’utilisateur.

## 08.5 — Petites victoires

Une petite victoire doit pouvoir être enregistrée comme une entrée personnelle indépendante.

Le modèle peut contenir :

- un identifiant ;
- un texte ;
- une date ;
- une catégorie facultative.

Cette fonctionnalité ne doit pas imposer de score, de classement, de série obligatoire ou de comparaison entre semaines, sauf décision ultérieure explicite.

## 08.6 — Liste « À découvrir »

Les suggestions de livres, ressources ou expériences doivent être distinguées des éléments déjà enregistrés dans la bibliothèque personnelle.

Le modèle peut contenir :

- un identifiant ;
- un titre ;
- une description ;
- un type de ressource ;
- un lien facultatif ;
- un état de consultation.

L’utilisateur doit pouvoir comprendre qu’une suggestion est proposée, et non imposée.

## 08.7 — Identifiants et dates

- Chaque entrée persistante doit avoir un identifiant stable.
- Les dates de création et de modification doivent être normalisées.
- Les identifiants ne doivent pas dépendre de la position d’un élément dans un tableau.
- Le code ne doit pas supposer qu’un titre est unique.
- Les changements de structure des données doivent être traités explicitement.

## 08.8 — Validation

Les données doivent être validées avant leur persistance.

La validation doit couvrir les champs obligatoires, les formats, les longueurs raisonnables et les états autorisés.

Si Zod est déjà installé et adapté, il peut être utilisé. Son ajout n’est pas obligatoire en l’absence de besoin démontré.

La validation côté frontend améliore la qualité des données, mais ne remplace jamais une validation côté serveur lorsqu’un backend est introduit.

---

# 09 — PERSISTENCE STRATEGY

## 09.1 — Principe

La première version doit éviter de dépendre d’un service distant pour les fonctionnalités qui peuvent fonctionner localement.

La stratégie de persistance doit être adaptée à la nature des données, et non choisie uniquement parce qu’une technologie est disponible.

## 09.2 — Contenu statique

Les textes et médias de l’expérience anniversaire peuvent être intégrés aux ressources de l’application.

Avantages :

- disponibilité sans requête métier ;
- comportement prévisible ;
- simplicité de maintenance ;
- possibilité de mise en cache ;
- absence de dépendance à une base distante pour afficher le contenu.

## 09.3 — Préférences et petits états

Pour des préférences simples et non sensibles, `localStorage` peut être suffisant.

Exemples :

- préférence de réduction des animations, si l’application propose un réglage interne ;
- préférence d’affichage ;
- préférence d’interface non critique.

Les appels au stockage doivent être protégés contre les erreurs et l’indisponibilité du navigateur.

## 09.4 — Données structurées

IndexedDB est la cible recommandée pour les données quotidiennes structurées lorsque leur volume, leur organisation ou leurs besoins d’évolution dépassent ceux d’un simple stockage clé-valeur.

Elle convient notamment aux tâches, livres, notes et petites victoires.

Une bibliothèque d’abstraction telle que Dexie ne doit être ajoutée que si elle est utile et compatible avec l’environnement existant.

## 09.5 — Ne pas utiliser localStorage comme base de données générale

Éviter de stocker toutes les collections métier dans un unique objet JSON global.

Cette stratégie complique les mises à jour, augmente le risque de perte de données et rend les évolutions plus fragiles.

## 09.6 — Interface de dépôt de données

Les fonctionnalités métier doivent utiliser des fonctions ou interfaces de dépôt.

Exemple conceptuel :

```ts
interface BookRepository {
  getAll(): Promise<Book[]>;
  getById(id: string): Promise<Book | null>;
  create(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
  delete(id: string): Promise<void>;
}
```

Le composant qui affiche la bibliothèque ne doit pas connaître les détails d’IndexedDB.

Cette abstraction permet de faire évoluer la persistance sans réécrire les composants de présentation.

## 09.7 — Gestion des erreurs de stockage

L’application doit prévoir :

- l’échec d’une lecture ;
- l’échec d’une écriture ;
- une base indisponible ;
- une migration échouée ;
- un espace de stockage insuffisant ;
- des données locales invalides ou anciennes.

L’interface doit informer l’utilisateur lorsque ses modifications n’ont pas été enregistrées.

Elle ne doit pas afficher une confirmation de sauvegarde avant que l’opération ait réussi.

## 09.8 — Effacement des données

Toute fonctionnalité de suppression des données personnelles doit :

1. expliquer ce qui sera supprimé ;
2. demander une confirmation lorsque l’action est destructive ;
3. effectuer la suppression ;
4. afficher le résultat ;
5. gérer les erreurs.

L’agent ne doit pas ajouter silencieusement une fonction de réinitialisation globale accessible par un bouton ambigu.

---

# 10 — OPTIONAL REMOTE BACKEND

## 10.1 — Positionnement

Un backend distant n’est pas une dépendance obligatoire de la première expérience anniversaire.

Il pourra être envisagé si le propriétaire valide des besoins tels que :

- synchronisation entre appareils ;
- sauvegarde distante ;
- compte utilisateur ;
- données partagées ;
- traitement serveur ;
- service d’IA.

## 10.2 — Supabase

Supabase peut être étudié si une persistance distante ou une authentification deviennent nécessaires.

Avant de l’intégrer, l’agent doit vérifier :

- si le projet Supabase existe déjà ;
- si le client est déjà installé ;
- si des variables d’environnement sont configurées ;
- si le schéma de données existe ;
- si les politiques d’accès sont définies ;
- si les besoins justifient réellement le coût et la complexité.

L’agent ne doit pas créer une nouvelle configuration Supabase ou un nouveau projet sans validation lorsque cela implique des changements externes ou des coûts potentiels.

## 10.3 — Architecture de synchronisation

Si la synchronisation est approuvée, l’architecture doit distinguer :

- données locales ;
- données distantes ;
- état de synchronisation ;
- erreurs de synchronisation ;
- conflits de modification.

La synchronisation ne doit pas être ajoutée sous la forme d’une série d’appels directs dispersés dans les composants.

Le modèle de données doit définir comment traiter les modifications simultanées et les données supprimées.

## 10.4 — Pas de promesse de synchronisation implicite

Une donnée présente sur un appareil ne doit pas être présentée comme sauvegardée dans le cloud si aucune synchronisation distante n’a été implémentée et vérifiée.

L’interface doit distinguer, si nécessaire :

- enregistré sur cet appareil ;
- synchronisation en cours ;
- synchronisé ;
- échec de synchronisation.

## 10.5 — Stratégie de remplacement

La couche de dépôt doit permettre de faire évoluer la persistance sans coupler toutes les fonctionnalités à un fournisseur particulier.

Cela ne signifie pas qu’il faut créer dès maintenant plusieurs implémentations complètes et inutilisées. Une seule implémentation fonctionnelle peut suffire pour la première version.

---

# 11 — PWA ARCHITECTURE

## 11.1 — Objectifs

La PWA doit permettre :

- l’installation sur un appareil compatible ;
- un lancement dans une fenêtre d’application lorsque la plateforme le permet ;
- le chargement rapide de l’interface ;
- l’accès au contenu essentiel déjà mis en cache ;
- un comportement compréhensible lorsque le réseau est indisponible ;
- une évolution progressive vers l’usage quotidien.

Une PWA installable n’est pas automatiquement une application entièrement fonctionnelle hors ligne. Le comportement hors ligne doit être conçu et testé.

## 11.2 — Web App Manifest

Le manifeste doit définir les métadonnées nécessaires à l’installation :

- nom de l’application ;
- nom court ;
- icônes adaptées ;
- couleurs du thème ;
- mode d’affichage ;
- URL de démarrage ;
- éventuels paramètres de présentation.

Les valeurs doivent correspondre à l’identité validée dans le document 02.

L’agent doit vérifier le manifeste existant avant d’en créer un autre.

## 11.3 — Service worker

Le service worker doit gérer les ressources qui peuvent être mises en cache et les règles de mise à jour.

Il ne doit pas être utilisé pour contourner la sécurité, masquer des erreurs réseau ou mettre en cache aveuglément toutes les réponses.

## 11.4 — Stratégie de cache

La stratégie doit différencier les types de ressources.

| Ressource | Stratégie cible |
|---|---|
| Shell applicatif | Cache contrôlé |
| CSS, JavaScript et ressources de build | Cache versionné |
| Icônes et illustrations statiques | Cache contrôlé |
| Lettre et contenus anniversaire statiques | Disponibilité hors ligne après mise en cache |
| Données personnelles locales | IndexedDB, indépendamment du cache HTTP |
| Réponses d’API distantes | Politique explicite selon le service |
| Données sensibles ou privées distantes | Pas de cache générique sans analyse spécifique |

L’implémentation doit tenir compte de la configuration réelle de Vite et du service worker déjà présent.

## 11.5 — Outil PWA

Si aucun système PWA n’est présent, `vite-plugin-pwa` peut être évalué.

Il ne doit pas être ajouté automatiquement si le dépôt possède déjà une solution fonctionnelle ou si une autre approche est déjà validée.

L’agent doit vérifier la compatibilité de la version retenue avec la version actuelle de Vite et la configuration du projet.

## 11.6 — Installation

L’interface peut présenter une invitation à installer l’application lorsque le navigateur permet de détecter ou de proposer cette possibilité.

Règles :

- ne pas afficher une invitation à l’installation à chaque visite ;
- ne pas prétendre que l’installation est disponible sur tous les navigateurs ;
- ne pas bloquer l’accès au contenu si l’utilisateur refuse ;
- prévoir un état de repli lorsque l’installation doit être effectuée manuellement.

## 11.7 — Mises à jour

Une nouvelle version du service worker peut nécessiter un rechargement.

L’application doit éviter de remplacer silencieusement une version en cours d’utilisation lorsque cela risque de perturber une opération.

Si une action explicite est nécessaire, l’interface doit l’expliquer simplement.

## 11.8 — Mode hors ligne

Le mode hors ligne doit présenter un comportement utile, et non une page d’erreur générique.

Il faut distinguer :

- interface disponible et données locales accessibles ;
- contenu statique disponible depuis le cache ;
- fonctionnalité nécessitant le réseau ;
- action qui n’a pas pu être enregistrée ;
- service externe temporairement inaccessible.

L’interface ne doit pas annoncer que toutes les fonctionnalités sont disponibles hors ligne si certaines nécessitent un réseau.

---

# 12 — VISUAL LAYER & MOTION ENGINEERING

## 12.1 — Principe de séparation

L’interface et la logique fonctionnelle doivent rester indépendantes des effets visuels.

L’architecture doit permettre de désactiver, réduire ou remplacer une animation sans supprimer la fonctionnalité associée.

Exemple :

```text
User clicks "Open chapter"
            ↓
Functional action
            ↓
Chapter state updated
            ↓
Visual transition triggered
            ↓
Chapter content displayed
```

L’animation accompagne la transition. Elle ne constitue pas la source de vérité de l’état du chapitre.

## 12.2 — Hiérarchie du mouvement

Les animations doivent être classées selon leur portée :

1. micro-interactions ;
2. composants ;
3. sections ;
4. pages ;
5. scènes narratives ;
6. expérience globale.

Chaque niveau doit avoir une responsabilité claire.

Les effets globaux ne doivent pas être pilotés indépendamment par plusieurs composants qui tentent de contrôler simultanément les mêmes propriétés.

## 12.3 — Choix des outils

Les outils suivants ont été identifiés dans le projet :

- **Motion** : animations et transitions d’interface React ;
- **Anime.js** : animations ciblées et séquences ;
- **CSS** : transitions simples, états visuels et animations légères ;
- **Impeccable** : assistance à la conception et à l’amélioration de l’interface selon les capacités effectivement présentes ;
- **React Bits** : références ou composants visuels à examiner selon leur pertinence ;
- **Remotion** : création de vidéos programmatiques.

La présence de ces outils ne signifie pas qu’ils doivent tous être utilisés.

## 12.4 — Règle de non-concurrence

Le projet doit éviter de faire coexister plusieurs moteurs pour exécuter les mêmes animations sans justification.

L’agent doit identifier les outils réellement installés, les usages existants et les capacités nécessaires.

Il doit ensuite conserver une approche cohérente.

Si Motion est déjà utilisé pour les transitions React, l’agent ne doit pas réimplémenter les mêmes transitions dans Anime.js uniquement pour multiplier les technologies.

Anime.js peut être conservé pour un besoin distinct et justifié, à condition que les deux systèmes n’entrent pas en conflit.

## 12.5 — CSS pour les effets simples

CSS est privilégié pour les interactions simples telles que :

- changement de couleur ;
- opacité ;
- soulignement ;
- transition de bordure ;
- léger déplacement ;
- état actif ;
- animation décorative simple.

Une bibliothèque d’animation n’est pas nécessaire pour chaque interaction.

## 12.6 — Motion pour les transitions d’interface

Motion peut être utilisé lorsque l’interface nécessite :

- une entrée ou sortie coordonnée ;
- une transition entre états ;
- une révélation progressive ;
- une animation liée à la présence d’un composant ;
- une séquence cohérente dans un parcours React.

Les composants animés doivent rester accessibles et contrôlables.

## 12.7 — Anime.js

Anime.js ne doit être utilisé que pour des séquences dont les besoins correspondent réellement à ses capacités.

Toute animation créée avec Anime.js doit avoir un cycle de vie maîtrisé :

- création ;
- déclenchement ;
- interruption éventuelle ;
- nettoyage ;
- suppression des références lors du démontage du composant.

Les animations ne doivent pas continuer à manipuler des éléments DOM après leur démontage.

## 12.8 — Remotion

Remotion est destiné à la génération de vidéos avec React.

Il n’est pas nécessaire pour les transitions interactives ordinaires du site.

Son installation éventuelle, sa configuration et son utilisation doivent rester séparées de l’application web principale si la production d’une vidéo devient un objectif validé.

L’agent ne doit pas introduire une pipeline vidéo dans le bundle principal uniquement pour animer une scène du site.

## 12.9 — WebGL et 3D

Three.js, React Three Fiber et les shaders ne sont pas des dépendances obligatoires de l’architecture cible.

Ils ne doivent être ajoutés que si une scène 3D validée exige réellement leurs capacités.

Avant de les proposer, l’agent doit évaluer :

- la valeur apportée à l’expérience ;
- l’impact sur les performances ;
- la compatibilité mobile ;
- le coût de maintenance ;
- la possibilité d’obtenir un résultat satisfaisant en CSS, SVG ou DOM ;
- l’existence d’une solution alternative accessible.

## 12.10 — Mouvement interrompable

Une animation ne doit pas empêcher l’utilisateur de poursuivre son action, sauf nécessité explicitement justifiée par le parcours.

Les animations longues doivent être interrompables ou se terminer rapidement lorsqu’une nouvelle action est reçue.

Les événements répétés ne doivent pas créer plusieurs timelines concurrentes incontrôlées.

## 12.11 — Respect de la préférence de mouvement réduit

Le système doit respecter `prefers-reduced-motion`.

Lorsque la réduction du mouvement est demandée :

- supprimer ou réduire les mouvements décoratifs ;
- éviter les déplacements importants ;
- remplacer les transitions longues par des transitions simples ;
- conserver les informations et les actions essentielles ;
- éviter les animations continues non nécessaires.

La réduction du mouvement ne doit pas empêcher l’accès à une lettre, à un chapitre ou à une fonctionnalité.

## 12.12 — Accessibilité de la 3D et des effets

Aucune information essentielle ne doit être accessible uniquement à travers un effet visuel, une scène 3D ou une animation.

Les textes doivent rester du véritable contenu HTML lorsqu’ils sont destinés à être lus.

Les contrôles doivent rester utilisables au clavier et au tactile.

---

# 13 — SECURITY & PRIVACY ARCHITECTURE

## 13.1 — Modèle de confidentialité

Le projet est destiné à une personne précise et contient potentiellement des contenus personnels.

La confidentialité doit être traitée comme une exigence fonctionnelle.

L’agent doit distinguer :

- confidentialité de l’URL ;
- protection d’accès à l’interface ;
- protection des données stockées ;
- protection des échanges réseau ;
- sécurité d’un éventuel backend.

Ces protections ne sont pas équivalentes.

## 13.2 — Lien discret et limites de sécurité

Une URL difficile à deviner peut réduire les accès accidentels, mais elle ne constitue pas à elle seule une authentification robuste.

Si les contenus sont publiés dans les fichiers statiques d’un site public, un visiteur capable de retrouver ces fichiers peut potentiellement accéder aux contenus, même si une interface affiche un écran d’accès.

L’agent ne doit donc pas présenter une simple page de mot de passe côté client comme une protection serveur.

## 13.3 — Protection supplémentaire

Si le propriétaire demande une protection par code ou mot de passe, l’agent doit expliquer les possibilités et leurs limites avant l’implémentation.

Une véritable protection de contenu privé peut nécessiter un backend qui vérifie les autorisations avant de délivrer les ressources.

Si aucune authentification serveur n’est prévue, le niveau de confidentialité réel doit être décrit sans exagération.

## 13.4 — Pas de compte obligatoire par défaut

L’expérience anniversaire ne doit pas imposer la création d’un compte si les parcours validés n’en ont pas besoin.

L’ajout d’un compte utilisateur doit correspondre à un besoin explicite, par exemple une synchronisation distante.

## 13.5 — Secrets et variables d’environnement

Les clés privées et secrets ne doivent jamais être intégrés au code frontend ou exposés dans le bundle.

Les variables préfixées par `VITE_` sont destinées à être accessibles au code client lorsqu’elles sont utilisées par Vite. Elles ne doivent donc pas contenir de secrets.

Une clé publique explicitement conçue pour être exposée peut être utilisée selon les recommandations du service, avec les règles d’accès nécessaires.

## 13.6 — Protection des données locales

L’application doit limiter les données personnelles collectées à ce qui est nécessaire.

Elle ne doit pas envoyer automatiquement les notes, les tâches ou les petites victoires à un service externe.

Les données locales doivent être supprimables par une procédure claire lorsque cette fonctionnalité est prévue.

## 13.7 — Validation et affichage du contenu

Les données saisies par l’utilisateur doivent être traitées comme des données non fiables.

Éviter d’injecter du HTML arbitraire dans le DOM.

Si un rendu HTML enrichi devient nécessaire, il doit reposer sur une solution contrôlée et une stratégie de nettoyage adaptée.

## 13.8 — Sécurité des dépendances

L’agent doit :

- limiter les dépendances à celles réellement nécessaires ;
- éviter les installations de paquets non maintenus sans justification ;
- vérifier la compatibilité des versions ;
- examiner les alertes pertinentes ;
- éviter les mises à jour majeures automatiques ;
- ne pas modifier aveuglément le fichier de verrouillage.

## 13.9 — Pas de télémétrie implicite

L’agent ne doit pas ajouter de système d’analytics, de suivi publicitaire ou de collecte de données personnelles sans décision explicite.

Les éventuels journaux techniques doivent éviter les contenus privés.

---

# 14 — NOTIFICATIONS ARCHITECTURE

## 14.1 — Positionnement

Les rappels doivent rester facultatifs et configurables.

La demande fonctionnelle prévoit des rappels à plusieurs échéances, par exemple J-7, J-3 et J-1, selon les préférences de l’utilisateur.

Cela définit le comportement attendu, mais ne garantit pas que le navigateur puisse déclencher tous les rappels de façon fiable en arrière-plan.

## 14.2 — Séparation des responsabilités

La fonctionnalité doit distinguer :

- la configuration des rappels ;
- les échéances des tâches ;
- les permissions du navigateur ;
- le calcul des dates de rappel ;
- le mécanisme de déclenchement ;
- la présentation des résultats.

La logique métier des rappels ne doit pas être enfermée dans un composant d’interface.

## 14.3 — Permission de notification

L’application ne doit pas demander la permission de notification dès la première ouverture.

La demande doit être déclenchée à la suite d’une action explicite de l’utilisateur, après une explication de l’utilité de cette permission.

Si la permission est refusée, l’application doit rester utilisable.

## 14.4 — Contraintes des navigateurs

Les timers JavaScript d’une page ne garantissent pas l’exécution d’un rappel lorsque la page est fermée.

Le service worker ne constitue pas non plus, à lui seul, une garantie de planification durable des notifications.

Une notification fiable lorsque l’application est fermée peut nécessiter une infrastructure de notifications push et un service serveur.

Cette infrastructure ne doit pas être introduite sans validation.

## 14.5 — Solution de repli

Si les rappels en arrière-plan ne sont pas pris en charge, l’application doit l’expliquer et proposer une solution réaliste, par exemple :

- rappels disponibles lorsque l’application est active ;
- rappels visuels dans le tableau de bord ;
- instructions pour utiliser les capacités de rappel du système, si pertinentes.

Ne pas annoncer une fonctionnalité de rappel en arrière-plan tant qu’elle n’a pas été implémentée et testée dans l’environnement cible.

---

# 15 — OPTIONAL AI INTEGRATION

## 15.1 — Statut

L’assistant IA est une fonctionnalité future et facultative.

Il ne fait pas partie des conditions nécessaires à la livraison de l’expérience anniversaire.

Son éventuelle intégration doit suivre une phase dédiée et validée.

## 15.2 — Usages envisagés

L’assistant pourrait notamment aider à :

- expliquer un concept informatique ;
- démarrer un exercice ;
- structurer un petit projet ;
- suggérer des livres selon des préférences ;
- orienter vers des ressources légales de lecture ;
- organiser une idée d’apprentissage.

Il doit respecter le caractère volontaire de cet espace de découverte.

## 15.3 — Architecture requise

Si l’IA est activée, le frontend doit passer par une interface de service contrôlée.

```text
User
 ↓
AI Interface
 ↓
Frontend Service
 ↓
Server-side Function
 ↓
AI Provider
 ↓
Validated Response
 ↓
User Interface
```

Le frontend ne doit pas appeler directement un fournisseur avec une clé privée intégrée au code.

## 15.4 — Erreurs et disponibilité

L’interface doit gérer :

- absence de connexion ;
- service indisponible ;
- délai dépassé ;
- réponse invalide ;
- limite d’utilisation atteinte ;
- absence de configuration ;
- erreur du fournisseur.

L’assistant doit indiquer clairement lorsqu’il ne peut pas répondre.

## 15.5 — Confidentialité des échanges

L’application doit expliquer, avant l’activation du service, que les messages envoyés à l’IA peuvent être traités par un fournisseur externe.

Les données personnelles des tâches, notes ou petites victoires ne doivent pas être envoyées automatiquement au modèle.

L’envoi d’un contexte personnel doit être limité à ce qui est nécessaire et contrôlé par l’utilisateur.

## 15.6 — Ressources de lecture

L’assistant peut recommander des ressources légales, gratuites ou accessibles lorsque cela est pertinent.

Il ne doit pas présenter un ouvrage protégé comme librement téléchargeable sans fondement.

La fonctionnalité doit être conçue pour être ajoutée ultérieurement sans réorganiser toute l’application.

---

# 16 — RESPONSIVE & DEVICE ARCHITECTURE

## 16.1 — Mobile first

L’interface doit être conçue d’abord pour les petits écrans, puis adaptée aux tablettes et aux ordinateurs.

Le mobile n’est pas une version réduite du desktop : les interactions et la densité doivent être adaptées.

## 16.2 — Adaptation des interactions

Les composants interactifs doivent fonctionner avec :

- le toucher ;
- le clavier ;
- la souris ;
- les technologies d’assistance compatibles.

Les interactions au survol ne doivent jamais être le seul moyen de révéler une action.

## 16.3 — Capacités variables

L’application ne doit pas supposer que tous les appareils possèdent :

- une grande mémoire disponible ;
- un GPU performant ;
- une connexion stable ;
- une prise en charge identique des notifications ;
- les mêmes capacités d’installation PWA.

## 16.4 — Adaptation des effets

Sur mobile ou sur un appareil peu performant, il peut être nécessaire de réduire les effets coûteux.

L’application doit privilégier la stabilité, la lisibilité et l’interactivité.

Les animations doivent pouvoir être simplifiées sans modifier le comportement fonctionnel.

## 16.5 — Clavier et focus

Les modales, menus et parcours doivent conserver une gestion cohérente du focus.

Le focus ne doit pas disparaître dans un élément visuellement masqué.

Après la fermeture d’une modale, le focus doit revenir à un emplacement logique.

---

# 17 — PERFORMANCE ARCHITECTURE

## 17.1 — Objectif

L’application doit rester fluide sur les appareils mobiles courants et les connexions variables.

La sophistication visuelle ne doit pas provoquer une dégradation importante de la lisibilité ou de la réactivité.

## 17.2 — Chargement initial

Le chargement initial doit privilégier :

- le shell de l’application ;
- les styles essentiels ;
- le contenu immédiatement nécessaire ;
- les ressources critiques.

Les fonctionnalités futures et les scènes non nécessaires au premier écran ne doivent pas être chargées prématurément si une séparation efficace est possible.

## 17.3 — Chargement différé

Le lazy loading peut être utilisé pour :

- les vues rarement ouvertes ;
- les modules optionnels ;
- les ressources lourdes ;
- les fonctionnalités futures ;
- les scènes visuelles coûteuses.

Il ne doit pas retarder artificiellement la lettre ou le contenu essentiel du parcours anniversaire.

## 17.4 — Images et médias

Les images doivent être optimisées et adaptées à leur utilisation.

L’agent doit examiner :

- dimensions ;
- format ;
- poids ;
- recadrage ;
- chargement différé ;
- taille des icônes ;
- éventuelles images dupliquées.

Les photos personnelles doivent être traitées avec une attention particulière à la confidentialité et à la qualité d’affichage.

## 17.5 — Animations

Les animations doivent privilégier les propriétés qui peuvent être animées efficacement.

Éviter les recalculs de mise en page répétés et les effets lourds sans bénéfice clair.

Les animations continues doivent être rares et justifiées.

## 17.6 — Mesure

Les performances doivent être évaluées sur une version de production lorsque cela est possible.

Les observations doivent être distinguées des mesures. L’agent ne doit pas affirmer que le site est performant sans avoir effectué de vérification pertinente.

---

# 18 — ACCESSIBILITY & ERROR HANDLING

## 18.1 — Accessibilité structurelle

L’application doit utiliser :

- des éléments HTML sémantiques ;
- une hiérarchie de titres cohérente ;
- des labels explicites ;
- des boutons et liens adaptés à leur fonction ;
- des textes alternatifs pertinents pour les images informatives ;
- des attributs accessibles pour les contrôles personnalisés.

## 18.2 — Clavier

Les fonctions essentielles doivent être accessibles sans souris.

Les états de focus doivent rester visibles.

Les interactions basées uniquement sur le clic ou le survol doivent disposer d’un équivalent approprié.

## 18.3 — Contraste et lisibilité

Le contraste doit être vérifié pour le texte, les boutons, les formulaires et les états interactifs.

Les effets visuels ne doivent pas masquer les informations.

La couleur ne doit pas être l’unique moyen de communiquer une erreur, un état ou une progression.

## 18.4 — Erreurs applicatives

L’application doit distinguer :

- erreur de validation ;
- erreur de persistance ;
- erreur réseau ;
- fonctionnalité indisponible ;
- contenu absent ;
- erreur inattendue.

Les messages doivent être compréhensibles et indiquer, lorsque c’est possible, l’action suivante.

## 18.5 — États vides

Chaque fonctionnalité quotidienne doit disposer d’un état vide utile.

Exemples :

- aucune tâche enregistrée ;
- aucun livre dans une catégorie ;
- aucune petite victoire enregistrée ;
- aucune suggestion disponible.

L’état vide doit expliquer ce que la section permet de faire et proposer une action appropriée sans culpabiliser l’utilisateur.

## 18.6 — Chargement et erreurs

L’agent doit prévoir les états nécessaires :

```text
IDLE
LOADING
SUCCESS
EMPTY
ERROR
UNAVAILABLE
```

Toutes les fonctionnalités n’ont pas besoin de tous ces états, mais les états pertinents doivent être explicitement traités.

## 18.7 — Gestion des erreurs globales

Une erreur dans une fonctionnalité facultative ne doit pas empêcher l’accès à l’ensemble de l’application.

Si un service d’IA est indisponible, la bibliothèque de lecture et le planificateur doivent rester utilisables.

Si une animation échoue, le contenu doit rester accessible.

---

# 19 — TESTING STRATEGY

## 19.1 — Objectif

Les tests doivent vérifier les comportements fonctionnels et les frontières entre les couches, pas seulement la présence visuelle des composants.

## 19.2 — Tests unitaires

Les tests unitaires doivent couvrir en priorité :

- transitions des parcours ;
- règles métier ;
- validation des données ;
- calcul des échéances ;
- changements de statut ;
- fonctions de transformation des données.

Ils ne doivent pas dépendre d’une animation visuelle réelle pour vérifier une règle métier.

## 19.3 — Tests des composants

Les tests de composants doivent vérifier :

- les actions principales ;
- l’affichage des états ;
- les formulaires ;
- les messages d’erreur ;
- les états vides ;
- les comportements de navigation accessibles.

## 19.4 — Tests d’intégration

Les tests d’intégration doivent vérifier les interactions entre :

- composants et état ;
- fonctionnalités et dépôts ;
- formulaires et validation ;
- parcours et navigation ;
- données persistantes et interface.

## 19.5 — Tests end-to-end

Lorsque l’outillage le permet, les tests de bout en bout doivent couvrir les parcours critiques.

### Parcours anniversaire

- ouverture de l’application ;
- arrivée dans Blue Library ;
- exploration des chapitres ;
- accès à la lettre ;
- accès à l’espace quotidien ;
- ouverture facultative de The 18th Case ;
- possibilité de quitter le parcours alternatif.

### Espace quotidien

- création et modification d’un livre ;
- changement de statut ;
- création et clôture d’une tâche ;
- ajout d’une petite victoire ;
- rechargement de l’application ;
- vérification de la persistance attendue.

## 19.6 — Tests PWA

Vérifier, selon les capacités de l’environnement :

- chargement du manifeste ;
- validité des icônes ;
- enregistrement du service worker ;
- chargement après mise en cache ;
- comportement hors ligne ;
- gestion d’une mise à jour ;
- absence de cache obsolète bloquant le contenu.

## 19.7 — Tests responsive

Les parcours essentiels doivent être vérifiés sur :

- petit mobile ;
- mobile courant ;
- tablette ;
- desktop.

La vérification doit inclure les débordements, les boutons, la lisibilité, le focus, les transitions et les états de chargement.

## 19.8 — Tests de mouvement réduit

Lorsque le système d’animation le permet, vérifier que la réduction du mouvement ne masque aucun contenu et ne bloque aucune action.

## 19.9 — Tests de sécurité

Vérifier notamment :

- absence de secrets dans le bundle ;
- gestion des erreurs d’accès ;
- absence d’injection HTML non contrôlée ;
- règles d’accès d’un éventuel backend ;
- absence de fausse promesse de protection par simple écran côté client.

## 19.10 — Vérification des résultats

L’agent doit exécuter les tests disponibles et rapporter les résultats exacts.

Il doit distinguer :

- tests exécutés et réussis ;
- tests exécutés et échoués ;
- tests non exécutés ;
- fonctionnalités vérifiées manuellement ;
- limitations de l’environnement.

Un test non exécuté ne doit jamais être présenté comme réussi.

---

# 20 — ENVIRONMENT AND DEPENDENCY CHANGE POLICY

## 20.1 — Principe

Toute modification des dépendances ou de la configuration doit être motivée par un besoin identifié dans la phase active.

## 20.2 — Avant d’ajouter un paquet

L’agent doit :

1. vérifier si une solution équivalente est déjà installée ;
2. déterminer si l’outil existant répond au besoin ;
3. vérifier la compatibilité avec les versions actuelles ;
4. évaluer l’impact sur le build et le bundle ;
5. identifier les éventuels conflits ;
6. justifier l’ajout dans son rapport de phase.

## 20.3 — Avant de supprimer un paquet

L’agent doit vérifier :

- ses usages dans le code ;
- ses usages dans les scripts ;
- ses dépendances indirectes ;
- ses fichiers de configuration ;
- les éventuels outils générés qui l’utilisent.

Il ne doit pas supprimer une dépendance simplement parce qu’elle n’apparaît pas dans un écran.

## 20.4 — Mise à jour de versions

Les mises à jour majeures ne doivent pas être incluses automatiquement dans une phase fonctionnelle.

Si une mise à jour est nécessaire, elle doit être isolée autant que possible et validée par des tests.

## 20.5 — Modifications architecturales

Une modification est considérée comme significative lorsqu’elle change notamment :

- le framework principal ;
- le système de navigation ;
- le système de gestion d’état ;
- le mode de persistance ;
- le fournisseur backend ;
- le système d’animation principal ;
- la structure fondamentale du projet ;
- le mode de déploiement ;
- le modèle de sécurité.

Une telle modification nécessite une proposition et une validation explicites avant application.

---

# 21 — IMPLEMENTATION BOUNDARIES

## 21.1 — Ce que l’agent peut faire dans une phase autorisée

Dans les limites de la phase active, l’agent peut :

- inspecter le dépôt ;
- réutiliser les dépendances présentes ;
- créer les composants nécessaires ;
- implémenter les comportements validés ;
- ajouter les tests pertinents ;
- corriger les erreurs directement liées au travail ;
- améliorer l’accessibilité et la robustesse sans changer le comportement attendu ;
- documenter les limitations constatées.

## 21.2 — Ce qu’il ne doit pas faire sans validation

L’agent ne doit pas :

- changer un parcours approuvé ;
- supprimer une fonctionnalité prévue ;
- ajouter une fonctionnalité majeure non prévue ;
- transformer une expérience facultative en passage obligatoire ;
- introduire une authentification non approuvée ;
- ajouter une base distante sans besoin validé ;
- intégrer une IA avant la phase correspondante ;
- changer de technologie principale sur une préférence personnelle ;
- refondre toute l’architecture pour répondre à une référence visuelle ;
- réécrire des contenus personnels sans validation ;
- ajouter des mécanismes de suivi ou de collecte de données non prévus.

## 21.3 — Suggestions

Lorsqu’il détecte une amélioration possible, l’agent doit la présenter séparément :

```text
SUGGESTION
- Problème observé
- Amélioration proposée
- Bénéfice attendu
- Coût et risques
- Impact sur l'architecture
- Alternative minimale
- Décision requise
```

Il doit poursuivre le travail autorisé lorsque cela reste possible, sans appliquer silencieusement la suggestion.

---

# 22 — ARCHITECTURE ACCEPTANCE CRITERIA

L’architecture sera considérée comme suffisamment en place lorsque les critères suivants seront satisfaits.

## 22.1 — Structure et responsabilités

- [ ] Le dépôt réel a été inspecté avant modification.
- [ ] Les fichiers et dépendances existants ont été préservés lorsqu’ils étaient utiles.
- [ ] Les responsabilités de l’interface, des parcours, du métier et des données sont distinguées.
- [ ] Les composants n’intègrent pas toute la logique de l’application.
- [ ] La couche visuelle ne constitue pas la source de vérité des états métier.
- [ ] La structure est cohérente avec la taille réelle du projet.

## 22.2 — Parcours

- [ ] Blue Library est accessible comme expérience principale.
- [ ] The 18th Case reste facultatif.
- [ ] L’accès à la lettre ne dépend pas de la résolution des énigmes.
- [ ] La transition vers l’espace quotidien suit le document 01.
- [ ] Les parcours restent utilisables sans animations avancées.
- [ ] Les états de progression sont cohérents.

## 22.3 — Données

- [ ] Les contenus statiques sont séparés de la logique d’affichage lorsque cela est pertinent.
- [ ] Les données quotidiennes disposent d’une stratégie de persistance définie.
- [ ] Les opérations de création, modification et suppression sont cohérentes.
- [ ] Les erreurs de persistance sont traitées.
- [ ] Aucune synchronisation distante n’est annoncée sans implémentation réelle.

## 22.4 — PWA

- [ ] Le manifeste est valide et cohérent avec l’identité du projet.
- [ ] Les icônes sont présentes et adaptées.
- [ ] Le service worker, s’il est utilisé, a une responsabilité claire.
- [ ] La stratégie de cache est définie.
- [ ] Le comportement hors ligne est testé.
- [ ] Les limitations des navigateurs sont documentées.

## 22.5 — Motion et interface

- [ ] Les outils d’animation réellement présents ont été identifiés.
- [ ] Les moteurs d’animation ne se concurrencent pas inutilement.
- [ ] Les animations peuvent être interrompues lorsque nécessaire.
- [ ] La préférence de mouvement réduit est respectée.
- [ ] Les effets visuels ne bloquent pas les actions essentielles.
- [ ] Les performances mobiles ont été prises en compte.

## 22.6 — Sécurité

- [ ] Aucun secret privé n’est exposé dans le frontend.
- [ ] Les limites d’une protection côté client sont documentées.
- [ ] Les données personnelles ne sont pas envoyées automatiquement à un service externe.
- [ ] Les fonctionnalités distantes disposent de contrôles adaptés lorsqu’elles sont activées.
- [ ] Les opérations destructives sont explicites.

## 22.7 — Qualité

- [ ] Les scripts de build disponibles ont été exécutés.
- [ ] Les tests pertinents ont été exécutés.
- [ ] Les résultats réels sont documentés.
- [ ] Les limitations restantes sont identifiées.
- [ ] Les modifications sont limitées au périmètre autorisé.

---

# 23 — NON-GOALS

Les éléments suivants ne font pas partie des obligations de l’architecture initiale :

- création obligatoire d’un backend ;
- authentification complète par compte ;
- synchronisation cloud ;
- assistant IA opérationnel ;
- infrastructure de notifications push ;
- scène 3D utilisant obligatoirement WebGL ;
- production vidéo avec Remotion ;
- analytics ou télémétrie ;
- architecture microservices ;
- refonte totale du dépôt ;
- remplacement des dépendances déjà installées sans justification.

Ces fonctionnalités peuvent être étudiées ultérieurement, mais uniquement si elles répondent à un besoin validé.

---

# 24 — REQUIRED AGENT REPORT

À la fin d’une phase technique, l’agent doit fournir un rapport contenant les informations suivantes.

## 24.1 — Modifications

- fichiers créés ;
- fichiers modifiés ;
- fichiers supprimés, avec justification ;
- dépendances ajoutées, retirées ou mises à jour ;
- modifications de configuration.

## 24.2 — Vérifications

- commandes de build exécutées ;
- tests exécutés ;
- résultats exacts ;
- contrôles manuels réalisés ;
- contrôles non réalisés.

## 24.3 — Architecture

- responsabilités implémentées ;
- choix techniques effectués ;
- éléments de l’architecture existante préservés ;
- écarts éventuels avec la cible ;
- raisons de ces écarts.

## 24.4 — Limitations

L’agent doit signaler :

- les fonctionnalités incomplètes ;
- les limitations du navigateur ;
- les dépendances non configurées ;
- les tests impossibles à exécuter ;
- les problèmes de sécurité restant à résoudre ;
- les points nécessitant une décision du propriétaire.

## 24.5 — Étape suivante

Le rapport doit terminer par :

- la phase actuellement terminée ;
- les critères validés ;
- les critères encore non satisfaits ;
- la prochaine phase prévue dans le document 04 ;
- les décisions nécessaires avant de continuer.

L’agent ne doit pas commencer la phase suivante de sa propre initiative si le workflow du projet exige une validation du propriétaire.

---

# 25 — FINAL ARCHITECTURAL DECISION

L’architecture de PRINCIA — Chapter 18 doit rester progressive, modulaire dans la mesure nécessaire, centrée sur React/Vite/TypeScript et compatible avec une livraison PWA.

Le principe directeur est le suivant :

**L’interface présente l’expérience. La logique fonctionnelle contrôle les parcours. La couche métier garantit la cohérence. La couche de données assure la persistance. Les moteurs d’animation enrichissent l’expérience sans en contrôler le fonctionnement. Les services externes ne sont ajoutés que lorsqu’un besoin validé les justifie.**

L’architecture doit s’adapter au dépôt réel, et non forcer le dépôt à correspondre aveuglément à un schéma théorique.

Aucune dépendance, migration ou modification architecturale importante ne doit être engagée sur la seule base d’une référence esthétique.

Le respect des documents approuvés, la préservation du travail existant, la vérification des comportements et la transparence sur les limites constituent des exigences permanentes.

---

**Fin du document 03 — Technical Architecture**

**Document suivant : `04 — Implementation Roadmap`.**