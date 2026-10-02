# PRINCIA — Chapter 18

> **Une nouvelle page s’ouvre. Et cette fois, c’est elle qui écrit la suite.**

`Anniversaire Principal` est un projet personnel de création numérique conçu pour célébrer les 18 ans de Princia, le **4 octobre 2026**.

Le projet vise à transformer un simple message d’anniversaire en une expérience web personnelle, interactive et mémorable. L’expérience anniversaire constitue le point d’entrée vers un espace numérique plus durable, pensé pour accompagner le quotidien de Princia.

Le produit est conçu comme une **Progressive Web App (PWA)**, avec une approche mobile-first, une direction artistique bleue et lumineuse, une narration soignée et une attention particulière portée à l’expérience utilisateur, à la performance et à la qualité technique.

> **Statut :** spécifications documentées — implémentation à suivre selon la roadmap du projet.

---

## 1. Vision du projet

Le projet repose sur deux dimensions complémentaires.

### 1.1. L’expérience anniversaire

Créer une expérience numérique qui donne à Princia le sentiment d’entrer dans un univers conçu spécialement pour elle.

Cette expérience peut notamment comprendre :

- une entrée immersive dans l’univers du projet ;
- une direction artistique inspirée d’une bibliothèque personnelle ;
- une lettre d’anniversaire ;
- des souvenirs et des photographies ;
- des transitions visuelles et des animations maîtrisées ;
- une transition naturelle entre l’expérience anniversaire et l’espace quotidien.

L’expérience doit rester accessible et agréable. Les éléments narratifs facultatifs ne doivent jamais empêcher l’accès à la lettre ou à l’espace quotidien.

### 1.2. L’espace personnel quotidien

L’expérience anniversaire ouvre sur un espace personnel destiné à conserver une utilité après le 4 octobre 2026.

Les fonctionnalités envisagées comprennent :

- **Bibliothèque de lecture :** organiser les livres et les lectures personnelles.
- **Planning universitaire :** centraliser les tâches, échéances et activités académiques.
- **Petites victoires :** garder une trace des progrès et des accomplissements.
- **Découvertes :** enregistrer les idées, ressources et découvertes intéressantes.
- **Rituel hebdomadaire :** prendre du recul sur la semaine et préparer la suivante.
- **Coin informatique :** espace complémentaire éventuel pour les intérêts numériques.

Les fonctionnalités avancées, notamment l’assistance par IA et la synchronisation cloud, restent des possibilités futures. Elles ne doivent pas être présentées comme opérationnelles tant qu’elles ne sont pas réellement implémentées et vérifiées.

---

## 2. Identité de l’expérience

### Nom du projet

**PRINCIA — Chapter 18**

### Concept principal

**Blue Library**

Une bibliothèque personnelle, lumineuse et contemporaine, qui évoque les souvenirs, la lecture, les possibilités et l’ouverture d'un nouveau chapitre.

### Concept alternatif

**The 18th Case**

Une variante narrative facultative, construite autour d'une approche plus mystérieuse. Elle ne doit pas compromettre l’accès aux contenus essentiels.

### Signature

> Une nouvelle page s’ouvre. Et cette fois, c’est elle qui écrit la suite.

### Ton et intention

L’expérience doit être :

- personnelle et authentique ;
- chaleureuse, affectueuse et légèrement ludique ;
- élégante sans être excessivement formelle ;
- immersive sans devenir compliquée ;
- expressive sans tomber dans une esthétique enfantine ;
- affectueuse sans suggérer une intention romantique.

L’ensemble doit évoquer une attention sincère portée à une amie proche.

---

## 3. Objectifs du produit

Le projet doit répondre à plusieurs objectifs :

1. **Créer un moment mémorable** pour les 18 ans de Princia.
2. **Présenter les contenus personnels** dans une expérience cohérente et agréable.
3. **Prolonger l’utilité du projet** au-delà de la date anniversaire.
4. **Offrir une expérience adaptée au mobile**, sans négliger l’ordinateur.
5. **Permettre l’installation de l’application** lorsque le navigateur le prend en charge.
6. **Préserver les données personnelles** et éviter les fonctionnalités inutiles ou intrusives.
7. **Maintenir une architecture évolutive**, sans complexifier prématurément le MVP.

---

## 4. Documents de référence

Le dossier `Docs/` contient les six documents qui encadrent le projet. Ils constituent la référence fonctionnelle, visuelle et technique pour l’implémentation.

| Document | Rôle |
|---|---|
| `00 — Project Brief` | Présente la vision, le périmètre, les objectifs et les contraintes du projet. |
| `01 — Experience & UX Specification` | Décrit les parcours utilisateurs, les interactions et les exigences d’expérience. |
| `02 — Visual & Motion Direction` | Définit l’identité visuelle, la direction artistique et les principes d’animation. |
| `03 — Technical Architecture` | Cadre les choix techniques, l’organisation du code, les données et l’architecture. |
| `04 — Implementation Roadmap` | Définit les phases d’implémentation, leur ordre et le mécanisme de suivi et de validation. |
| `05 — AI Development Prompts` | Fournit les prompts spécialisés pour piloter l’agent de développement selon les besoins de chaque tâche. |

**Ordre de consultation recommandé :** lire le Document 00 pour comprendre le projet, consulter les Documents 01 à 03 pour ses spécifications, puis utiliser le Document 04 comme référence opérationnelle et le Document 05 pour sélectionner le prompt adapté à la tâche.

Les prompts du Document 05 complètent la roadmap : ils ne remplacent pas son mécanisme de boucle, de suivi et de validation.

En cas d’ambiguïté ou de contradiction, l’agent doit identifier précisément le problème et demander une clarification lorsque celle-ci affecte une décision importante. Il ne doit pas inventer silencieusement une nouvelle spécification.

---

## 5. Principes d’implémentation

Le développement doit respecter les principes suivants.

### Respect de l’existant

Avant toute modification, l’agent doit examiner le dépôt, sa structure, les fichiers de configuration, les dépendances, les scripts, les styles, les routes éventuelles et les tests existants.

La stack réellement présente dans le dépôt doit être vérifiée avant toute décision technique. Les technologies mentionnées dans les documents ne justifient pas, à elles seules, une réinitialisation du projet.

### Architecture maîtrisée

Le code doit conserver une séparation claire entre :

- présentation et composants d’interface ;
- navigation et parcours ;
- logique métier ;
- état de l’application ;
- accès aux données et persistance ;
- intégrations externes ;
- animations et effets visuels.

Les abstractions doivent répondre à un besoin réel. Le projet ne doit pas devenir inutilement complexe pour anticiper des fonctionnalités encore hypothétiques.

### Expérience utilisateur

L’application doit être mobile-first et responsive, avec une navigation compréhensible, des interactions cohérentes et des états de chargement, d’erreur et de contenu vide lorsque cela est nécessaire.

Les animations doivent servir la narration et l’orientation de l’utilisateur plutôt que ralentir son parcours.

### Performance et accessibilité

L’implémentation doit notamment prendre en compte :

- les préférences de réduction des animations (`prefers-reduced-motion`) ;
- la navigation au clavier et la visibilité du focus ;
- le contraste et la lisibilité ;
- des zones tactiles adaptées ;
- le chargement raisonnable des images et des ressources ;
- les performances sur les appareils mobiles.

### Données et confidentialité

Les données personnelles doivent être traitées avec prudence. L’authentification, la synchronisation cloud et l’assistance par IA ne doivent être ajoutées que si elles sont justifiées et conformes aux spécifications.

Aucune clé secrète ou clé privée ne doit être exposée dans le code client. Les contenus personnels et les éventuels secrets de configuration ne doivent pas être publiés sans vérification préalable.

### PWA et fonctionnement hors ligne

L’application doit viser une installation fiable sur les navigateurs compatibles. Les éléments essentiels de l’expérience anniversaire doivent pouvoir rester accessibles hors ligne lorsque cela est prévu et techniquement réalisable.

Le comportement hors ligne, le service worker, le manifeste et les icônes doivent être vérifiés : leur simple présence dans le code ne suffit pas à démontrer que la PWA fonctionne correctement.

---

## 6. Priorités du produit

Les priorités sont organisées pour préserver l’objectif anniversaire sans perdre de vue l’utilité quotidienne.

### P0 — MVP anniversaire

- accès à l’expérience principale ;
- univers Blue Library ;
- lettre d’anniversaire ;
- souvenirs et photographies prévus ;
- navigation fluide vers l’espace quotidien ;
- mise en page responsive ;
- installation PWA et fonctionnement hors ligne essentiel, dans la mesure définie par les spécifications.

Le concept alternatif The 18th Case reste facultatif si son développement risque de retarder ou de fragiliser les éléments essentiels.

### P1 — Espace quotidien

- bibliothèque de lecture ;
- planning universitaire ;
- suivi des petites victoires ;
- liste de découvertes ;
- rituel hebdomadaire, si retenu dans le périmètre.

### P2 — Évolutions futures

- assistant personnel utilisant l’IA ;
- synchronisation cloud et authentification ;
- fonctionnalités avancées de notification ;
- outils complémentaires et autres extensions.

Les éléments P2 ne doivent pas retarder la livraison du périmètre prioritaire.

---

## 7. Technologies et décisions techniques

La stack définitive doit être confirmée à partir des fichiers du dépôt et du Document 03 — Technical Architecture.

Les décisions techniques doivent respecter les règles suivantes :

- conserver la configuration existante lorsqu’elle est adaptée ;
- éviter les dépendances supplémentaires sans justification ;
- ne pas remplacer l’architecture pour des raisons purement esthétiques ;
- privilégier une solution simple, testable et maintenable ;
- utiliser une persistance locale adaptée aux données réellement nécessaires ;
- n’introduire un service externe que si le besoin est établi ;
- ne jamais exposer de secrets dans le frontend.

Toute modification importante de l’architecture doit être justifiée et soumise à validation avant d’être appliquée lorsqu’elle dépasse le périmètre autorisé.

---

## 8. Organisation du dépôt

La structure initiale attendue est la suivante :

```text
Anniversaire Principal/
├── Docs/
│   ├── 00 — Project Brief
│   ├── 01 — Experience & UX Specification
│   ├── 02 — Visual & Motion Direction
│   ├── 03 — Technical Architecture
│   ├── 04 — Implementation Roadmap
│   └── 05 — AI Development Prompts
├── README.md
└── [fichiers de l’application à examiner ou à créer selon la roadmap]
```

Cette représentation est indicative. Les noms et extensions exacts des six documents doivent correspondre aux fichiers réellement présents dans `Docs/`. L’agent doit examiner la structure existante avant de créer ou déplacer des fichiers.

Le code de l’application peut se trouver à la racine ou dans un sous-dossier, selon l’architecture définie et l’état réel du dépôt.

---

## 9. Workflow de développement

L’implémentation suit la roadmap du Document 04.

Pour chaque phase, l’agent doit :

1. consulter les documents applicables ;
2. identifier le périmètre exact de la phase ;
3. examiner l’état actuel du dépôt ;
4. définir les fichiers et composants concernés ;
5. réaliser uniquement les changements autorisés ;
6. vérifier le résultat à l’aide des contrôles adaptés ;
7. signaler les limites, erreurs et décisions en attente ;
8. fournir un compte rendu factuel avant de passer à la suite.

Le mécanisme détaillé de boucle, de validation et de progression est défini dans le Document 04. Il doit être suivi plutôt que reproduit ou remplacé par ce README.

Le Document 05 sert à sélectionner le prompt spécialisé correspondant à la tâche : audit initial, implémentation, interface, architecture, persistance, PWA, accessibilité, tests, livraison ou reprise après interruption.

Aucun résultat ne doit être déclaré réussi sans preuve suffisante. En particulier, les tests, le build, le déploiement et le push GitHub ne doivent être déclarés réussis que s’ils ont réellement été exécutés et vérifiés.

---

## 10. Confidentialité et sécurité

Ce projet contient ou pourra contenir des contenus personnels. Avant toute publication du dépôt, vérifier les éléments suivants :

- absence de clés API, tokens, mots de passe et fichiers `.env` ;
- absence de données personnelles inutiles ;
- contrôle des photographies et des contenus destinés à être publiés ;
- vérification des informations personnelles présentes dans les documents ;
- choix conscient entre dépôt public et dépôt privé.

Un dépôt public facilite le partage avec un agent de développement, mais rend les fichiers accessibles à toute personne. **Si les documents ou le contenu du projet contiennent des informations personnelles qui ne doivent pas être publiques, privilégier un dépôt privé ou retirer ces éléments avant publication.**

Le contenu du README ne doit pas être considéré comme une garantie de sécurité : les fichiers effectivement commités doivent être vérifiés.

---

## 11. Critères de réussite

Le projet sera considéré comme prêt pour sa livraison lorsque les critères définis dans les documents de référence seront satisfaits, notamment :

- l’expérience anniversaire essentielle est accessible et cohérente ;
- les parcours principaux fonctionnent sur mobile et ordinateur ;
- la lettre et les contenus prévus sont accessibles ;
- la navigation vers l’espace quotidien fonctionne ;
- les fonctionnalités annoncées correspondent aux fonctionnalités réellement disponibles ;
- l’installation PWA a été vérifiée sur les environnements ciblés ;
- le comportement hors ligne prévu a été testé ;
- les contrôles techniques pertinents ont été exécutés ;
- les problèmes connus et les fonctionnalités restantes sont documentés ;
- aucun secret ou contenu privé non autorisé n’a été publié.

Les critères détaillés et leur ordre de validation restent ceux des Documents 01, 03 et 04.

---

## 12. État et évolutions

Ce README présente la vision et les règles générales du projet. Il ne remplace ni les spécifications détaillées ni la roadmap.

Il devra être mis à jour lorsque des changements importants affecteront :

- le périmètre fonctionnel ;
- l’architecture technique ;
- les fonctionnalités réellement disponibles ;
- les instructions de lancement ;
- les tests et contrôles ;
- les modalités de déploiement.

Les instructions d’installation et de lancement seront ajoutées après vérification des scripts et de la configuration réels du projet.

---

## 13. Principe directeur

> Construire une expérience personnelle, élégante et mémorable, puis prolonger cette expérience par un espace quotidien réellement utile — sans sacrifier la simplicité, la performance, la confidentialité ou la qualité technique.

**La priorité est de respecter la vision documentée, de suivre la roadmap et de livrer progressivement une application fonctionnelle, vérifiable et cohérente.**