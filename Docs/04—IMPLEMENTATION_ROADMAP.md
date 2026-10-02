# 04 — IMPLEMENTATION ROADMAP

**Projet :** PRINCIA — Chapter 18  
**Document :** 04 — Implementation Roadmap  
**Version :** 1.0  
**Statut :** Spécification d’exécution pour l’IA de développement  
**Échéance cible :** 3 octobre 2026 à 23 h 59  
**Application :** `Anniversaire.princia`

---

# 00 — OBJECTIF DU DOCUMENT

## 00.1 — Mission

Ce document transforme les décisions du Project Brief, les spécifications d’expérience utilisateur, la direction visuelle et l’architecture technique en un plan d’implémentation exécutable par une IA de développement.

Il ne s’agit pas simplement d’énumérer des fonctionnalités ou de fournir une série de prompts indépendants.

Il s’agit de définir un **processus de développement itératif, séquentiel, vérifiable et auto-correctif**, dans lequel l’IA :

1. inspecte l’environnement réel du projet ;
2. identifie le travail nécessaire ;
3. implémente une unité de travail précise ;
4. vérifie le résultat obtenu ;
5. compare objectivement ce résultat aux critères de validation ;
6. identifie les défauts, oublis, régressions et écarts ;
7. corrige les problèmes détectés ;
8. recommence les vérifications ;
9. valide l’implémentation lorsque les critères sont satisfaits ;
10. passe à l’implémentation suivante.

Le cycle se répète jusqu’à ce que le périmètre prioritaire soit terminé ou qu’un blocage réel empêche de continuer en toute sécurité.

L’IA ne doit pas s’arrêter après avoir simplement écrit du code. Elle doit démontrer que le code produit satisfait les exigences de l’implémentation.

## 00.2 — Résultat attendu

À l’échéance, le projet doit disposer d’une version livrable, testée et accessible, présentant une expérience anniversaire fonctionnelle et cohérente avec les spécifications.

Les fonctionnalités secondaires ne doivent pas compromettre cette livraison.

La qualité finale repose sur cinq exigences :

- **Conformité :** le résultat respecte les spécifications approuvées.
- **Fonctionnement :** les parcours prioritaires fonctionnent réellement.
- **Qualité visuelle :** le résultat correspond à la direction artistique définie.
- **Stabilité :** les fonctionnalités déjà validées continuent de fonctionner.
- **Livrabilité :** le projet peut être construit, exécuté, déployé et récupéré depuis GitHub selon les capacités réelles de l’environnement.

Une fonctionnalité visuellement impressionnante mais défectueuse ne constitue pas une implémentation réussie.

---

# 01 — DOCUMENTS DE RÉFÉRENCE ET ORDRE DE PRIORITÉ

L’IA doit lire les documents de référence disponibles avant toute modification du code.

| Référence | Responsabilité |
|---|---|
| 00 — Project Brief | Objectifs, destinataire, contexte, contraintes et périmètre |
| 01 — Experience & UX Specification | Parcours, écrans, comportements et règles fonctionnelles |
| 02 — Visual & Motion Direction | Identité visuelle, composition, animations et ambiance |
| 03 — Technical Architecture | Architecture, composants, données, états, PWA, sécurité et intégrations |
| 04 — Implementation Roadmap | Ordre d’exécution, boucles de contrôle et critères de livraison |

Les noms exacts des fichiers peuvent différer. L’IA doit retrouver les documents existants dans le dépôt ou dans les ressources fournies, puis vérifier leur contenu.

## 01.1 — Règle de cohérence

Chaque document possède une responsabilité spécifique.

L’IA ne doit pas utiliser une référence visuelle pour réécrire arbitrairement l’architecture, ni utiliser une préférence technique pour modifier le parcours utilisateur.

En particulier :

- le document 00 définit pourquoi le produit existe ;
- le document 01 définit ce que l’utilisateur doit pouvoir faire ;
- le document 02 définit comment l’expérience doit être perçue visuellement ;
- le document 03 définit comment la construire techniquement ;
- le document 04 définit comment l’implémenter et vérifier le résultat.

**Une référence esthétique ne constitue jamais, à elle seule, une justification suffisante pour modifier l’architecture.**

Si une incompatibilité réelle est découverte entre les documents et le dépôt, l’IA doit décrire le conflit, ses conséquences et les options possibles. Elle ne doit pas effectuer silencieusement une refonte structurelle.

## 01.2 — Règle de non-invention

Les décisions déjà approuvées doivent être conservées.

L’IA ne doit pas inventer de nouveaux parcours, de nouvelles dépendances, de nouveaux services distants ou de nouvelles fonctionnalités simplement parce qu’ils lui semblent intéressants.

Toute amélioration non nécessaire au périmètre approuvé doit être placée dans une liste distincte intitulée `Suggestions hors périmètre`.

Elle ne doit pas être implémentée sans autorisation.

---

# 02 — CONTRAINTE DE LIVRAISON

## 02.1 — Échéance

La cible de livraison est le **3 octobre 2026 à 23 h 59**, heure du Bénin.

L’échéance ne justifie ni la suppression des tests essentiels ni une réécriture risquée de l’application.

Elle impose de limiter le périmètre, de réduire les dépendances inutiles et de privilégier les fonctionnalités qui contribuent directement à l’expérience anniversaire.

L’IA doit travailler dans cet ordre :

1. comprendre l’environnement ;
2. sécuriser l’état initial ;
3. rendre le parcours anniversaire fonctionnel ;
4. vérifier le rendu visuel et le responsive ;
5. corriger les défauts et les régressions ;
6. préparer et vérifier la livraison ;
7. compléter uniquement les fonctionnalités secondaires compatibles avec le temps restant.

## 02.2 — Trois niveaux de priorité

### P0 — Indispensable à la livraison anniversaire

- Démarrage et chargement corrects de l’application.
- Écran d’entrée et accès à l’expérience.
- Expérience principale « Blue Library ».
- Navigation entre les chapitres prévus.
- Affichage des souvenirs et des contenus disponibles.
- Lettre d’anniversaire.
- Transition vers l’espace quotidien si celle-ci est prévue dans le parcours approuvé.
- Interface responsive, particulièrement sur mobile.
- Gestion des erreurs bloquantes.
- Construction de production fonctionnelle.
- Contrôle des régressions sur les parcours prioritaires.

Le parcours principal doit rester accessible même si une animation échoue, si une image manque ou si le navigateur ne prend pas en charge une fonctionnalité secondaire.

### P1 — Compléments utiles

À traiter uniquement après la stabilisation du périmètre P0 :

- première version du catalogue de lecture ;
- tâches et priorités du planner ;
- liste des petites victoires ;
- liste « À découvrir » ;
- persistance locale des données correspondantes ;
- amélioration de l’expérience installable et hors ligne si le socle le permet.

Ces fonctionnalités ne doivent pas retarder la livraison de l’expérience anniversaire.

### P2 — Évolutions futures

À ne pas implémenter dans le cadre de la livraison urgente, sauf décision explicite contraire :

- assistant IA ;
- synchronisation cloud ;
- authentification complète ;
- notifications push distantes ;
- panneau d’administration avancé ;
- analytics personnalisés ;
- fonctionnalités sociales ;
- expérience 3D complexe nécessitant une infrastructure supplémentaire.

Une fonctionnalité P2 non implémentée ne doit pas apparaître comme fonctionnelle dans l’interface.

## 02.3 — Principe de livraison progressive

L’application doit être livrable même si certaines fonctionnalités P1 ou P2 restent incomplètes.

L’IA doit donc maintenir une version fonctionnelle après chaque étape majeure.

Elle ne doit jamais attendre la fin de toutes les fonctionnalités pour vérifier si le projet peut être construit et exécuté.

---

# 03 — MODÈLE D’EXÉCUTION : IMPLEMENTATION LOOP

## 03.1 — Principe général

Une implémentation est une unité de travail autonome possédant :

- un objectif ;
- un périmètre précis ;
- des prérequis ;
- des tâches ;
- un livrable ;
- des critères de validation ;
- une procédure de vérification ;
- une boucle de correction ;
- une condition de sortie.

Elle ne doit pas être assimilée à un prompt ponctuel qui demande à l’IA de produire du code puis de s’arrêter.

Le prompt constitue uniquement le moyen de lancer ou de cadrer le travail. **La boucle de réflexion, d’implémentation, de vérification et de correction constitue le mécanisme principal.**

## 03.2 — Cycle obligatoire

Pour chaque implémentation, l’IA suit ce cycle :

```text
LECTURE DES EXIGENCES
        ↓
INSPECTION DE L'ÉTAT RÉEL
        ↓
PLAN D'EXÉCUTION LIMITÉ
        ↓
IMPLÉMENTATION
        ↓
VÉRIFICATION AUTOMATIQUE
        ↓
VÉRIFICATION FONCTIONNELLE
        ↓
ÉVALUATION DES CRITÈRES
        ↓
DÉTECTION DES ÉCARTS
        ↓
CORRECTION CIBLÉE
        ↓
NOUVELLE VÉRIFICATION
        ↓
VALIDATION DE L'IMPLÉMENTATION
        ↓
POINT DE CONTRÔLE / COMMIT
        ↓
IMPLÉMENTATION SUIVANTE
```

Si une vérification échoue, l’IA revient à l’étape de correction.

Elle ne doit pas poursuivre comme si l’implémentation était terminée.

## 03.3 — Définition d’un écart

Un écart existe notamment lorsque :

- une exigence n’est pas satisfaite ;
- un élément demandé est absent ;
- une interaction ne produit pas le résultat attendu ;
- le rendu diffère de la spécification approuvée ;
- une erreur apparaît dans la console ;
- une erreur TypeScript ou de build est introduite ;
- un écran devient inutilisable sur mobile ;
- une fonctionnalité déjà opérationnelle cesse de fonctionner ;
- une donnée n’est pas persistée alors qu’elle devrait l’être ;
- une animation empêche l’accès au contenu ;
- le résultat dépend d’une API ou d’une dépendance qui n’existe pas dans le dépôt ;
- un comportement annoncé dans l’interface n’est pas réellement implémenté.

L’IA doit corriger les écarts constatés plutôt que simplement les mentionner dans son rapport.

## 03.4 — Boucle de correction

Après chaque vérification, l’IA doit répondre à ces questions :

1. Quel critère a échoué ?
2. Quelle preuve permet de confirmer cet échec ?
3. Quelle est la cause probable ?
4. Quelle est la correction minimale qui traite la cause ?
5. Quels composants ou parcours risquent d’être affectés par cette correction ?
6. Quels tests doivent être rejoués ?
7. Le défaut est-il effectivement résolu après correction ?

La correction doit être aussi localisée que possible.

L’IA ne doit pas réécrire un composant complet lorsqu’une modification ciblée suffit.

Elle doit éviter les corrections cosmétiques qui masquent un défaut fonctionnel sans le résoudre.

## 03.5 — Limite de la boucle

Une boucle ne doit pas tourner indéfiniment.

Pour chaque implémentation :

- effectuer une première passe complète ;
- corriger les défauts détectés ;
- effectuer les vérifications de nouveau ;
- si un défaut persiste après trois cycles de correction ciblée, analyser la cause plus profondément.

Si la correction exige une modification architecturale, un accès externe absent, une décision produit ou une action que l’IA ne peut pas effectuer, elle doit documenter le blocage.

Elle peut continuer les tâches indépendantes et sûres, mais ne doit pas déclarer le périmètre concerné comme validé.

La limite de trois cycles est une règle d’escalade, pas une permission d’accepter un défaut critique.

---

# 04 — PROTECTION CONTRE LES RÉGRESSIONS

## 04.1 — Principe fondamental

**Une nouvelle implémentation ne doit pas dégrader une fonctionnalité déjà validée.**

La qualité du produit est cumulative : chaque implémentation doit conserver les acquis précédents et améliorer uniquement les éléments concernés.

Si une version possède un design satisfaisant, un fonctionnement correct et des performances acceptables, une nouvelle implémentation ne doit pas sacrifier ces qualités pour ajouter une fonctionnalité.

Une régression est considérée comme un défaut de l’implémentation en cours.

## 04.2 — Référence de stabilité

Après chaque implémentation validée, l’IA doit enregistrer un point de référence contenant au minimum :

- la liste des parcours déjà validés ;
- les tests disponibles et leur résultat ;
- le résultat du build ;
- les erreurs connues, si elles existent ;
- les problèmes non bloquants restant ouverts ;
- le commit correspondant, lorsque Git est disponible ;
- les fonctionnalités qui ne doivent pas être modifiées sans justification.

Ce point constitue la **baseline de stabilité** de l’implémentation suivante.

## 04.3 — Matrice de non-régression

Avant de commencer une nouvelle implémentation, l’IA doit identifier les tests de régression correspondant aux fonctionnalités déjà terminées.

Après l’implémentation, elle doit les exécuter de nouveau.

| Domaine | Contrôle obligatoire |
|---|---|
| Démarrage | L’application se lance toujours |
| Build | Le build de production reste valide |
| Navigation | Les parcours précédemment validés fonctionnent |
| Contenu | Les chapitres, souvenirs et la lettre restent accessibles |
| Responsive | Les écrans principaux restent utilisables sur mobile |
| Interactions | Les boutons et contrôles existants fonctionnent toujours |
| Données | Les données persistées restent accessibles |
| Console | Aucun nouveau problème critique n’est introduit |
| Accessibilité | Les interactions clavier et les états de focus restent utilisables |
| Motion | Les animations ne bloquent pas le parcours ou l’accès au contenu |

Les tests non pertinents pour une modification donnée peuvent être omis uniquement si cette décision est explicitement justifiée.

## 04.4 — Règle d’acceptation

Une implémentation ne peut pas être considérée comme validée si elle introduit une régression critique.

Si une régression apparaît :

1. identifier la modification responsable ;
2. corriger cette modification ;
3. restaurer le comportement attendu ;
4. rejouer les tests de la fonctionnalité affectée ;
5. rejouer les tests de régression associés ;
6. comparer le résultat à la baseline.

Si la correction n’est pas possible sans remettre en cause une décision d’architecture ou une spécification approuvée, l’IA doit isoler le changement problématique et documenter le blocage.

Elle ne doit pas masquer la régression en supprimant le test ou en abaissant silencieusement le critère de qualité.

## 04.5 — Mesures de protection

- Vérifier `git status` avant toute modification.
- Ne pas écraser les changements préexistants de l’utilisateur.
- Ne pas réinitialiser arbitrairement le dépôt.
- Ne pas supprimer des fichiers simplement parce qu’ils semblent inutilisés.
- Ne pas remplacer toute l’architecture pour simplifier une tâche.
- Ne pas modifier les versions des dépendances sans nécessité démontrée.
- Ne pas désactiver un test pour faire passer artificiellement la validation.
- Ne pas intégrer une fonctionnalité non terminée dans le parcours principal.
- Préserver un commit stable avant une modification risquée lorsque Git est disponible.

---

# 05 — PHASE 0 : AUDIT INITIAL ET PRÉPARATION

**Priorité : P0 — Prérequis de toutes les implémentations**

## Objectif

Établir la situation réelle du dépôt avant de décider comment intervenir.

L’architecture décrite dans le document 03 constitue une référence de conception, mais elle ne prouve pas que les fichiers, dépendances ou configurations correspondants existent déjà.

L’IA doit donc vérifier l’environnement réel avant toute intervention.

## Tâches

### 0.1 — Lire les documents

- Lire les documents 00 à 03 disponibles.
- Extraire les fonctionnalités obligatoires pour la livraison.
- Identifier les parcours principaux.
- Identifier les contraintes visuelles et techniques.
- Noter les éventuelles contradictions.

### 0.2 — Inspecter le dépôt

- Vérifier le répertoire courant et la structure des fichiers.
- Lire `package.json`.
- Identifier le gestionnaire de paquets et le fichier de verrouillage.
- Vérifier les scripts disponibles.
- Vérifier les versions et dépendances réellement déclarées.
- Vérifier la configuration TypeScript.
- Vérifier la configuration Vite.
- Vérifier le système CSS et les éventuelles configurations Tailwind.
- Vérifier le système de routage existant.
- Vérifier les composants et les pages déjà présents.
- Vérifier l’existence d’un manifest PWA et d’un service worker.
- Vérifier les assets disponibles.
- Vérifier les tests, le lint et les outils de formatage existants.
- Vérifier la branche Git, les changements locaux et l’état des commits.
- Vérifier si le dépôt distant GitHub est configuré et accessible.

### 0.3 — Vérifier les outils déjà utilisés

Les commandes précédemment exécutées autour d’Impeccable, Anime.js, Remotion et Motion AI sont des informations à vérifier, et non la preuve que ces outils sont installés ou utilisés dans l’application.

L’IA doit distinguer :

- les dépendances du projet ;
- les outils CLI ;
- les fichiers générés par un assistant ;
- les projets séparés éventuellement créés ;
- les ressources simplement consultées.

Elle ne doit pas réinstaller ces outils par réflexe.

### 0.4 — Établir le diagnostic initial

Exécuter les vérifications possibles sans modifier inutilement le projet :

- installation ou vérification des dépendances selon l’état du dépôt ;
- vérification TypeScript ;
- lint si disponible ;
- tests existants ;
- build ;
- lancement local et contrôle des écrans principaux lorsque l’environnement le permet.

Ne pas considérer une commande absente comme un échec du produit. Documenter les outils et scripts réellement disponibles.

## Livrables

- Un rapport d’audit initial.
- Une liste des fonctionnalités déjà présentes.
- Une liste des fonctionnalités manquantes ou défectueuses.
- Une baseline initiale des tests.
- Une liste des risques techniques.
- Une proposition de modifications strictement nécessaires.
- Un état Git initial.

## Critères de validation

- Les fichiers de configuration ont été inspectés.
- Les dépendances sont identifiées à partir du dépôt réel.
- L’état Git et les modifications préexistantes sont connus.
- Les possibilités de build et de test sont établies.
- Les écarts entre l’architecture cible et le dépôt sont documentés.
- Aucune refonte architecturale n’a été effectuée au cours de l’audit.

**Condition de sortie :** l’IA peut identifier le travail à accomplir sans supposer l’existence de fonctionnalités, de fichiers ou de dépendances non vérifiés.

---

# 06 — PHASE 1 : SÉCURISATION DU SOCLE ET DU PARCOURS ANNIVERSAIRE

**Priorité : P0 — Critique**

## Objectif

Obtenir une première version cohérente, navigable et exécutable de l’expérience anniversaire.

Cette phase ne cherche pas à terminer toutes les fonctionnalités du produit quotidien. Elle doit garantir que l’expérience principale fonctionne avant l’ajout de complexité.

## Implémentation 1.1 — Stabiliser le démarrage

### Tâches

- Corriger les erreurs bloquant le lancement.
- Corriger les erreurs de compilation existantes qui empêchent le travail.
- Vérifier les imports et les composants réellement utilisés.
- Vérifier que les scripts de développement et de build correspondent au projet.
- Conserver la configuration et les dépendances existantes lorsqu’elles sont adaptées.
- Éviter toute réorganisation globale des fichiers qui ne serait pas nécessaire.

### Livrables

- Application démarrable.
- Build de production valide, si l’environnement le permet.
- Liste des erreurs bloquantes corrigées.

### Validation

- L’application démarre.
- Les écrans existants peuvent être chargés.
- Aucun nouveau défaut critique n’est introduit.
- Le build passe ou les blocages restants sont précisément identifiés.

### Boucle

En cas d’échec, examiner les messages d’erreur, corriger leur cause, puis relancer les vérifications concernées. Ne pas masquer les erreurs de compilation.

## Implémentation 1.2 — Construire le parcours d’entrée

### Tâches

- Implémenter l’écran d’entrée conformément aux spécifications approuvées.
- Afficher le nom et le contenu d’accueil prévus.
- Permettre à l’utilisateur de commencer l’expérience.
- Prévoir un état de chargement uniquement si nécessaire.
- Prévoir un état de repli si un élément visuel échoue.
- Éviter qu’une animation retarde excessivement l’accès au contenu.

### Livrables

- Écran d’entrée opérationnel.
- Action principale fonctionnelle.
- États de chargement et d’erreur pertinents.

### Validation

- L’utilisateur comprend comment commencer.
- L’action principale fonctionne.
- Le contenu reste accessible si les effets visuels ne se chargent pas.
- Le parcours est utilisable sur un écran mobile.

## Implémentation 1.3 — Construire la Blue Library

### Tâches

- Implémenter la structure de la bibliothèque.
- Afficher les chapitres définis dans les spécifications.
- Permettre d’ouvrir et de consulter un chapitre.
- Afficher les souvenirs et messages associés lorsqu’ils sont disponibles.
- Prévoir un retour à la bibliothèque.
- Préserver l’ordre narratif prévu.
- Gérer les chapitres sans contenu ou les assets manquants sans faire planter l’écran.

### Livrables

- Bibliothèque navigable.
- Chapitres consultables.
- Affichage des contenus associés.
- Navigation aller-retour cohérente.

### Validation

- Chaque chapitre prévu peut être ouvert.
- L’utilisateur peut revenir à la bibliothèque.
- Aucun chapitre ne conduit à un écran bloqué.
- Les interactions fonctionnent au clavier et sur écran tactile.
- Le contenu demeure lisible sans animation.

## Implémentation 1.4 — Intégrer la lettre d’anniversaire

### Tâches

- Intégrer le texte approuvé de la lettre.
- Respecter la hiérarchie typographique et la direction artistique.
- Prévoir une lecture confortable sur mobile.
- Éviter les effets qui masquent ou coupent le texte.
- Permettre d’accéder à la lettre selon le parcours défini.
- Vérifier que le contenu ne dépend pas du succès d’une animation.

### Livrables

- Lettre intégrée.
- Écran de lecture fonctionnel.
- Navigation vers et depuis la lettre selon le parcours prévu.

### Validation

- Le texte complet est accessible.
- La lecture ne nécessite pas une interaction difficile à découvrir.
- Le texte ne déborde pas de son conteneur.
- La lettre reste accessible si les animations sont désactivées.

## Implémentation 1.5 — Prévoir le parcours alternatif

### Tâches

- Vérifier si « The 18th Case » fait partie du périmètre réalisable.
- Si le parcours est déjà prévu et réalisable, implémenter ses indices et interactions essentiels.
- S’assurer qu’un indice ou une interaction incorrecte ne bloque pas toute l’expérience.
- Prévoir un retour ou un moyen de continuer.
- Maintenir l’accès à la lettre sans obliger l’utilisateur à terminer le parcours alternatif.

Si le temps disponible ne permet pas de réaliser ce parcours correctement, conserver une entrée discrète uniquement si elle correspond aux spécifications et ne prétend pas proposer une expérience complète.

### Livrables

- Parcours alternatif fonctionnel dans le périmètre retenu, ou état de périmètre explicitement documenté.
- Aucun blocage du parcours principal.

### Validation

- L’utilisateur peut poursuivre sans résoudre tous les indices.
- Aucun lien ou bouton ne mène vers une fonctionnalité inexistante.
- Le parcours principal reste accessible.

## Implémentation 1.6 — Transition vers l’espace quotidien

### Tâches

- Implémenter la transition prévue après l’expérience anniversaire.
- Afficher clairement l’accès à l’espace quotidien.
- Éviter que la transition devienne un écran bloquant.
- Permettre de revenir à l’expérience anniversaire si cela est prévu dans les spécifications.

### Livrables

- Transition fonctionnelle.
- Point d’entrée vers l’espace quotidien.

### Validation de la phase 1

Le parcours prioritaire suivant doit être testable de bout en bout :

```text
Entrée
  ↓
Blue Library
  ↓
Ouverture d'un chapitre
  ↓
Consultation du contenu
  ↓
Lettre d'anniversaire
  ↓
Transition prévue
  ↓
Accès à l'espace quotidien
```

Les étapes facultatives ne doivent pas être obligatoires pour terminer ce parcours.

**Condition de sortie :** le parcours anniversaire principal est fonctionnel, lisible, navigable et ne présente aucun défaut critique connu.

---

# 07 — PHASE 2 : QUALITÉ VISUELLE, RESPONSIVE ET MOTION

**Priorité : P0 — Obligatoire avant la livraison**

## Objectif

Améliorer la qualité de l’expérience sans modifier arbitrairement l’architecture ni introduire des effets qui fragilisent les fonctionnalités.

Cette phase doit respecter les documents de design, d’UX et de motion.

## Implémentation 2.1 — Appliquer la direction visuelle

### Tâches

- Comparer les écrans existants à la direction artistique approuvée.
- Corriger les écarts de composition, de hiérarchie, de typographie et d’espacement.
- Utiliser les tokens et styles existants lorsqu’ils conviennent.
- Harmoniser les boutons, surfaces, cartes, titres et états interactifs.
- Vérifier la lisibilité du contenu.
- Limiter les valeurs arbitraires et les styles contradictoires.
- Ne pas reconstruire l’ensemble du système de styles uniquement pour se rapprocher d’une référence visuelle.

### Livrables

- Interface cohérente avec la direction visuelle.
- Composants réutilisables harmonisés lorsque cela est nécessaire.

### Validation

- Les écrans principaux ont une hiérarchie claire.
- Les composants partagés sont visuellement cohérents.
- Le texte est lisible.
- Aucun élément interactif essentiel n’est masqué ou confondu avec de la décoration.

## Implémentation 2.2 — Vérifier le responsive

### Tâches

- Vérifier les petits écrans mobiles.
- Vérifier les formats mobiles plus larges.
- Vérifier les écrans intermédiaires et desktop.
- Corriger les débordements horizontaux.
- Adapter les grilles, colonnes, espacements et médias.
- Vérifier les textes longs et les chapitres.
- Vérifier les contrôles tactiles.

### Livrables

- Mise en page responsive.
- Liste des formats vérifiés.

### Validation

- Aucun débordement horizontal non intentionnel.
- Aucun texte essentiel coupé.
- Les boutons sont utilisables sur écran tactile.
- Les chapitres et la lettre restent confortablement lisibles.
- La navigation reste compréhensible à toutes les tailles testées.

## Implémentation 2.3 — Implémenter les effets visuels nécessaires

### Tâches

- Classer les animations selon leur fonction : entrée, révélation, feedback, transition ou mouvement ambiant.
- Utiliser CSS ou les outils déjà disponibles pour les effets simples.
- Réutiliser une bibliothèque de motion déjà installée lorsqu’elle est adaptée.
- Éviter d’introduire plusieurs moteurs d’animation pour des besoins équivalents.
- Isoler les effets visuels dans des composants ou utilitaires dédiés.
- Respecter `prefers-reduced-motion`.
- Prévoir un rendu acceptable sans animation.
- Éviter les animations continues coûteuses.
- Ne pas utiliser Remotion pour piloter l’interface interactive de l’application.
- Ne pas introduire de WebGL ou de 3D complexe sans besoin fonctionnel démontré.

### Livrables

- Animations intégrées et maîtrisées.
- Comportement alternatif en réduction de mouvement.

### Validation

- Les animations n’empêchent pas l’accès au contenu.
- Les actions restent utilisables pendant et après les transitions.
- Les états visuels correspondent aux états fonctionnels.
- La réduction de mouvement ne rend pas le parcours incompréhensible.
- Aucun effet ne provoque de régression majeure sur mobile.

## Implémentation 2.4 — Accessibilité et états de l’interface

### Tâches

- Vérifier les titres et la structure sémantique.
- Vérifier les labels des contrôles.
- Vérifier le focus clavier.
- Vérifier les contrastes du contenu essentiel.
- Prévoir des états de chargement, d’erreur et de contenu vide pertinents.
- Vérifier les interactions sans pointeur lorsque cela s’applique.

### Livrables

- Parcours principaux accessibles au clavier.
- États de l’interface cohérents.

### Validation de la phase 2

Les écrans principaux respectent la direction artistique, restent utilisables sur mobile et conservent leur fonctionnalité lorsque les animations sont réduites ou désactivées.

**Condition de sortie :** aucun défaut visuel ou responsive critique ne subsiste sur les parcours P0 vérifiés.

---

# 08 — PHASE 3 : PWA, PERSISTANCE ET ESPACE QUOTIDIEN

**Priorité : P0 pour les éléments essentiels de livraison ; P1 pour les outils quotidiens**

## Objectif

Finaliser les capacités techniques nécessaires à une expérience web installable, puis compléter les fonctionnalités quotidiennes dans la limite du temps disponible.

Cette phase doit s’adapter à l’architecture réellement présente. Elle ne doit pas imposer une migration de données ou un nouveau backend sans justification.

## Implémentation 3.1 — Finaliser les capacités PWA essentielles

### Tâches

- Vérifier l’existence du manifest.
- Vérifier le nom, les couleurs et les icônes disponibles.
- Vérifier les chemins des assets.
- Vérifier la configuration du service worker.
- Vérifier le comportement d’installation dans les navigateurs pris en charge.
- Prévoir une interface de repli si l’installation n’est pas disponible.
- Vérifier la stratégie de cache des ressources statiques.
- Vérifier la mise à jour de l’application après un nouveau déploiement.

### Livrables

- Manifest cohérent.
- Icônes correctement référencées.
- Service worker configuré si le projet le permet.
- Comportement d’installation vérifié sur les navigateurs disponibles.

### Validation

- Les ressources PWA sont correctement référencées.
- Le navigateur ne signale pas d’erreur bloquante de manifest ou de service worker.
- L’application fonctionne sans afficher une fausse confirmation d’installation.
- Le comportement de mise à jour est documenté.

## Implémentation 3.2 — Vérifier l’expérience hors ligne

### Tâches

- Identifier les ressources essentielles au parcours anniversaire.
- Mettre en cache les ressources statiques nécessaires selon la stratégie retenue.
- Vérifier le comportement lors d’une perte de connexion.
- Distinguer les ressources disponibles hors ligne des fonctionnalités dépendantes d’Internet.
- Éviter de mettre en cache de manière trop large des données privées ou des réponses dynamiques.
- Prévoir un message clair lorsqu’une fonctionnalité nécessite une connexion.

### Livrables

- Stratégie de cache documentée.
- Parcours hors ligne testé dans les limites de l’environnement.

### Validation

- Le comportement hors ligne correspond à la stratégie annoncée.
- L’application ne prétend pas être totalement hors ligne si certaines fonctions ne le sont pas.
- Les ressources essentielles déjà mises en cache restent accessibles dans les conditions testées.

## Implémentation 3.3 — Construire la couche de persistance

### Tâches

- Identifier les données qui doivent réellement être persistées.
- Distinguer le contenu statique de l’expérience des données personnelles créées par l’utilisateur.
- Utiliser la couche de données prévue dans le document 03.
- Utiliser IndexedDB pour les données locales structurées si cette stratégie est confirmée et compatible avec le dépôt.
- Limiter `localStorage` aux préférences simples qui ne nécessitent pas une base structurée.
- Isoler les accès aux données dans une couche dédiée.
- Gérer les erreurs de lecture et d’écriture.
- Prévoir des états de chargement, d’erreur et de données vides.

### Livrables

- Couche de persistance cohérente avec l’architecture.
- Types et fonctions nécessaires.
- Gestion des erreurs de persistance.

### Validation

- Les données sont enregistrées dans le stockage prévu.
- Les données persistent après un rechargement lorsque cela est attendu.
- Une erreur de stockage n’entraîne pas un écran blanc.
- Les composants de présentation ne contiennent pas une logique de stockage dispersée.

## Implémentation 3.4 — Catalogue de lecture

À traiter après la stabilisation des capacités P0.

### Tâches

- Afficher les entrées de lecture.
- Gérer les statuts prévus.
- Permettre de consulter une entrée.
- Permettre de modifier les notes si cette fonctionnalité est incluse dans le périmètre.
- Persister les modifications.
- Prévoir des états vides et des erreurs.

### Livrables

- Catalogue de lecture fonctionnel dans le périmètre implémenté.

### Validation

- Les statuts peuvent être modifiés.
- Les modifications persistent après rechargement.
- Les contrôles correspondent aux actions réellement disponibles.

## Implémentation 3.5 — Planner universitaire

### Tâches

- Afficher les tâches et priorités.
- Implémenter les actions essentielles prévues.
- Gérer les échéances si elles font partie du périmètre.
- Persister les modifications locales.
- Vérifier le format et l’affichage des dates.
- Prévoir les états vides.

### Livrables

- Première version du planner.

### Validation

- Les tâches peuvent être consultées et modifiées selon le périmètre retenu.
- Les données restent disponibles après rechargement.
- Les échéances sont compréhensibles.
- Aucun contrôle ne prétend enregistrer une action qui échoue silencieusement.

## Implémentation 3.6 — Petites victoires et découvertes

### Tâches

- Implémenter les éléments de consultation et de saisie prévus.
- Persister les données nécessaires.
- Garder une interface simple.
- Vérifier que ces modules ne perturbent pas la navigation principale.

### Livrables

- Modules fonctionnels selon le périmètre P1 retenu.

### Validation

- Les actions disponibles fonctionnent.
- Les données sont conservées lorsque cela est attendu.
- Les modules restent indépendants du parcours anniversaire.

### Validation de la phase 3

- Les capacités PWA annoncées ont été vérifiées.
- Le comportement hors ligne est décrit honnêtement.
- Les fonctionnalités de persistance implémentées fonctionnent.
- Les modules P1 incomplets sont masqués ou clairement laissés hors périmètre.

**Condition de sortie :** les fonctions P0 de cette phase sont validées. Les fonctions P1 peuvent rester différées si leur implémentation menace la stabilité ou l’échéance.

---

# 09 — PHASE 4 : VALIDATION FINALE, LIVRAISON ET GITHUB

**Priorité : P0 — Obligatoire**

## Objectif

Vérifier l’ensemble du produit, corriger les derniers défauts et préparer une version récupérable et exploitable.

## Implémentation 4.1 — Audit fonctionnel de bout en bout

### Tâches

- Rejouer le parcours principal depuis l’entrée jusqu’à la lettre.
- Vérifier la navigation entre les chapitres.
- Vérifier le retour vers les écrans précédents.
- Vérifier les interactions principales.
- Vérifier l’accès à l’espace quotidien.
- Vérifier les liens et boutons.
- Vérifier les comportements d’erreur pertinents.
- Vérifier les fonctions facultatives pour lesquelles une fonctionnalité complète est annoncée.

### Livrables

- Rapport de test fonctionnel.
- Liste des défauts corrigés.
- Liste des défauts résiduels non bloquants, s’il en existe.

### Validation

Le parcours principal peut être exécuté sans blocage critique.

## Implémentation 4.2 — Audit de non-régression

### Tâches

- Rejouer les tests de la baseline.
- Vérifier les interactions existantes.
- Comparer les résultats au dernier point de contrôle.
- Vérifier les principaux écrans après les dernières modifications.
- Corriger les régressions détectées.
- Rejouer les tests après correction.

### Livrables

- Résultat des tests de non-régression.
- État final de la baseline.

### Validation

Aucune régression critique connue ne subsiste dans le périmètre livré.

## Implémentation 4.3 — Audit technique final

### Tâches

Exécuter les vérifications disponibles dans le dépôt :

- vérification TypeScript ;
- lint ;
- tests automatisés ;
- build de production ;
- contrôle des assets et imports ;
- contrôle de la console lors du parcours principal ;
- vérification des ressources PWA si elles sont configurées ;
- contrôle des variables d’environnement et des secrets ;
- vérification de l’absence de dépendances inutiles ajoutées au cours du travail.

L’IA ne doit pas inventer des scripts absents. Si une commande n’existe pas, elle doit utiliser les contrôles disponibles et documenter la limitation.

### Livrables

- Rapport technique final.
- Résultats réels des commandes exécutées.
- Liste des éventuels contrôles impossibles.

### Validation

Le build de production passe. Les tests disponibles passent, à l’exception d’éventuels problèmes préexistants explicitement identifiés et évalués.

Un test impossible à exécuter ne doit pas être présenté comme réussi.

## Implémentation 4.4 — Vérification de sécurité et de confidentialité

### Tâches

- Vérifier qu’aucune clé secrète n’est exposée dans le code client.
- Vérifier les variables d’environnement utilisées.
- Vérifier les liens et ressources externes.
- Vérifier qu’aucune collecte analytique non approuvée n’a été ajoutée.
- Vérifier les limites de confidentialité de l’accès à l’application.
- Vérifier que l’interface ne prétend pas offrir une protection que l’architecture ne fournit pas.

Si le contenu privé est inclus dans le code client, ne pas présenter une URL discrète ou un écran de code côté client comme une protection forte.

### Livrables

- Résumé des vérifications de confidentialité.
- Limites de sécurité documentées.

### Validation

Aucun secret ne doit être ajouté au dépôt ou exposé volontairement dans le client. Les limites de confidentialité sont comprises et documentées.

## Implémentation 4.5 — Commit et synchronisation GitHub

### Tâches

- Vérifier `git status`.
- Vérifier la branche active.
- Vérifier le diff final.
- Vérifier les fichiers supprimés ou modifiés de manière inattendue.
- Exclure les secrets, fichiers locaux sensibles et artefacts inutiles.
- Vérifier `.gitignore`.
- Créer un commit clair lorsque Git est disponible.
- Vérifier la configuration du dépôt distant.
- Pousser le commit vers GitHub uniquement si le dépôt distant est configuré, si les permissions sont disponibles et si le push est autorisé.
- Vérifier le résultat du push.
- Ne pas annoncer un push réussi sans preuve de réussite.

### Livrables

- Commit final identifiable.
- Code synchronisé avec GitHub lorsque possible.
- Liste des fichiers modifiés.
- Instructions de récupération et d’exécution.

### Validation

Le commit contient les modifications attendues. Le dépôt distant reflète le commit si le push a réussi. Sinon, le rapport indique clairement ce qui manque pour terminer la synchronisation.

## Implémentation 4.6 — Préparation de la livraison

### Tâches

- Vérifier la commande de lancement.
- Vérifier la commande de build.
- Documenter les variables d’environnement nécessaires sans exposer leurs valeurs secrètes.
- Vérifier les instructions d’installation.
- Vérifier les étapes de déploiement disponibles.
- Identifier les fonctionnalités terminées, différées et non disponibles.
- Ne pas effectuer un déploiement externe si les autorisations ou accès nécessaires ne sont pas disponibles.

### Livrables

- Version finale vérifiée.
- Instructions d’exécution.
- État de livraison.
- Liste des limitations restantes.

### Validation de la phase 4

Une autre personne doit pouvoir récupérer le code, installer les dépendances selon le projet, lancer l’application et comprendre ce qui est effectivement opérationnel.

---

# 10 — CONTRAT DE VALIDATION COMMUN À TOUTES LES IMPLÉMENTATIONS

Chaque implémentation doit être évaluée selon les critères suivants.

| Critère | Question de contrôle |
|---|---|
| Conformité | Les exigences de l’implémentation sont-elles satisfaites ? |
| Fonctionnement | Les actions produisent-elles le résultat attendu ? |
| Visuel | Le résultat respecte-t-il la direction artistique approuvée ? |
| UX | Le parcours reste-t-il compréhensible et fluide ? |
| Responsive | L’interface fonctionne-t-elle sur les formats concernés ? |
| Performance | La modification introduit-elle une dégradation évitable ? |
| Accessibilité | Les interactions restent-elles accessibles ? |
| Architecture | La séparation des responsabilités est-elle conservée ? |
| Non-régression | Les fonctionnalités déjà validées fonctionnent-elles toujours ? |
| Livrabilité | Le code reste-t-il exécutable et constructible ? |

## 10.1 — Évaluation par preuve

L’IA doit distinguer trois types de preuves :

**Preuve automatisée :** résultat d’un test, du compilateur, du lint ou du build.

**Preuve fonctionnelle :** résultat d’une interaction réellement exécutée, d’un parcours parcouru ou d’une donnée relue après enregistrement.

**Preuve visuelle :** inspection réelle du rendu à une taille d’écran déterminée, lorsque les outils le permettent.

Une affirmation comme « le responsive est correct » n’est pas suffisante si aucun écran n’a été inspecté.

Si l’environnement ne permet pas une vérification visuelle réelle, l’IA doit le préciser et effectuer les contrôles alternatifs possibles.

## 10.2 — Statuts de validation

Chaque critère reçoit l’un des statuts suivants :

- `PASS` : vérifié et conforme ;
- `FAIL` : vérifié et non conforme ;
- `BLOCKED` : impossible à vérifier à cause d’une limitation identifiée ;
- `NOT APPLICABLE` : sans rapport avec l’implémentation, avec justification.

Une implémentation ne peut pas être déclarée entièrement validée si un critère critique est en `FAIL` ou `BLOCKED`.

Les critères non critiques bloqués doivent être documentés avant de poursuivre.

## 10.3 — Conditions minimales de sortie

Une implémentation est terminée uniquement lorsque :

- ses tâches sont exécutées ;
- ses livrables existent ;
- ses critères critiques sont en `PASS` ;
- les défauts détectés ont été corrigés ou explicitement isolés ;
- les tests de régression pertinents passent ;
- aucun nouveau défaut critique n’est connu ;
- le résultat est documenté.

---

# 11 — GESTION DES RISQUES ET DES BLOCAGES

## 11.1 — Découverte d’un problème d’architecture

Si l’IA découvre que l’architecture actuelle empêche réellement de satisfaire une exigence :

1. décrire le problème ;
2. identifier les exigences affectées ;
3. expliquer pourquoi une correction locale est insuffisante ;
4. proposer la modification minimale ;
5. évaluer les risques de régression ;
6. présenter les alternatives ;
7. demander une validation avant toute modification architecturale non approuvée.

Une simple préférence de style, une nouvelle référence esthétique ou l’existence d’une bibliothèque plus moderne ne suffit pas.

## 11.2 — Dépendance manquante

Si une dépendance nécessaire est absente :

- vérifier si une solution déjà présente permet de répondre au besoin ;
- évaluer le coût de l’ajout ;
- vérifier la compatibilité avec l’environnement ;
- éviter les installations redondantes ;
- ne pas modifier le fichier de verrouillage sans nécessité ;
- documenter l’ajout envisagé.

L’ajout d’une dépendance indispensable et compatible peut être proposé dans le cadre de l’implémentation. Une modification structurelle plus importante doit être justifiée et soumise à validation.

## 11.3 — Accès externe indisponible

Si l’IA ne dispose pas d’un accès effectif à GitHub, au déploiement ou à un service externe :

- continuer les tâches locales indépendantes ;
- produire le code et les instructions nécessaires ;
- identifier l’action impossible ;
- indiquer précisément l’accès requis ;
- ne pas prétendre que l’action a été effectuée.

## 11.4 — Arbitrage en cas de manque de temps

Si le temps restant devient insuffisant, appliquer cet ordre :

1. corriger les défauts bloquants ;
2. préserver le parcours anniversaire ;
3. garantir un build livrable ;
4. vérifier le responsive et la lisibilité ;
5. vérifier les interactions et la non-régression ;
6. terminer les éléments PWA essentiels ;
7. ajouter les fonctionnalités P1 si elles restent compatibles avec les points précédents.

Une fonctionnalité secondaire doit être différée plutôt que livrée dans un état qui dégrade le produit.

---

# 12 — GESTION DU TEMPS JUSQU’À L’ÉCHÉANCE

Le planning est organisé par blocs de travail et non par durée fixe de chaque tâche, car le temps réel dépend de l’état du dépôt.

L’IA doit estimer la durée de chaque bloc après l’audit initial, puis réviser l’ordre d’exécution sans modifier les priorités.

| Bloc | Travail | Résultat attendu |
|---|---|---|
| A | Audit et baseline | État réel connu |
| B | Socle et parcours anniversaire | Parcours principal opérationnel |
| C | Direction visuelle, responsive et motion | Expérience cohérente et utilisable |
| D | PWA et persistance essentielle | Capacités essentielles vérifiées |
| E | Fonctions P1 si le temps le permet | Compléments fonctionnels |
| F | Tests finaux, non-régression et GitHub | Livraison vérifiée |

## 12.1 — Règle d’allocation

L’IA doit réserver du temps pour les tests et la livraison.

Elle ne doit pas consacrer la totalité du temps disponible à l’implémentation des fonctionnalités, puis traiter les tests comme une activité facultative.

Si une phase prend plus de temps que prévu, les tâches secondaires sont réduites avant de supprimer les vérifications essentielles.

## 12.2 — Gel fonctionnel

À l’approche de la livraison, toute nouvelle fonctionnalité non essentielle doit être gelée.

Après ce gel, seules les modifications qui :

- corrigent un défaut ;
- résolvent un problème de livraison ;
- améliorent la stabilité sans risque disproportionné ;
- rétablissent une conformité approuvée ;

peuvent être intégrées.

Toute modification de dernière minute doit déclencher les tests de régression correspondants.

---

# 13 — RAPPORT OBLIGATOIRE APRÈS CHAQUE IMPLÉMENTATION

À la fin de chaque boucle validée, l’IA doit produire un rapport court mais vérifiable.

Le rapport doit contenir :

### A. Identification

- Numéro et nom de l’implémentation.
- Objectif.
- Statut final.

### B. Modifications

- Fichiers créés.
- Fichiers modifiés.
- Fichiers supprimés, avec justification.
- Dépendances ajoutées ou modifiées.

### C. Vérifications

- Commandes réellement exécutées.
- Résultats obtenus.
- Tests fonctionnels réalisés.
- Contrôles visuels réalisés.
- Résultats de non-régression.

### D. Écarts et corrections

- Défauts identifiés.
- Corrections appliquées.
- Vérifications effectuées après correction.
- Défauts résiduels.

### E. Livraison

- Commit réalisé, si applicable.
- Push effectué ou non.
- Motif d’un éventuel blocage.
- État de la baseline.

### F. Suite

- Prochaine implémentation.
- Dépendances satisfaites.
- Risques à surveiller.

L’IA ne doit pas produire uniquement un résumé positif. Le rapport doit refléter les résultats réels, y compris les échecs et les limites.

---

# 14 — REGISTRE DE PROGRESSION

L’IA doit maintenir un registre unique dans la documentation du projet, par exemple `Docs/IMPLEMENTATION_STATUS.md`, si ce chemin est compatible avec la structure existante.

Elle ne doit pas créer un second système de suivi redondant si un registre équivalent existe déjà.

Le registre doit contenir :

| Champ | Description |
|---|---|
| ID | Identifiant unique de l’implémentation |
| Nom | Nom de l’unité de travail |
| Priorité | P0, P1 ou P2 |
| Dépendances | Implémentations préalables |
| Statut | À faire, en cours, à corriger, validée, bloquée ou différée |
| Critères | Résultat de chaque critère de validation |
| Tests | Résultats des vérifications |
| Baseline | Commit ou état de référence |
| Risques | Problèmes connus |
| Prochaine étape | Travail autorisé à poursuivre |

Le registre doit être mis à jour après chaque implémentation.

Une tâche ne doit jamais être marquée comme terminée uniquement parce que son code a été écrit.

---

# 15 — AUTONOMIE DE L’IA ET LIMITES D’INTERVENTION

## 15.1 — Ce que l’IA doit faire sans demander une validation à chaque étape

Lorsque le périmètre est clair et que les actions sont réversibles, l’IA doit :

- analyser le code ;
- établir un plan local ;
- implémenter les tâches approuvées ;
- exécuter les tests disponibles ;
- corriger les erreurs ;
- répéter les vérifications ;
- protéger les fonctionnalités existantes ;
- mettre à jour le registre ;
- créer des commits de travail si les règles Git le permettent ;
- poursuivre avec l’implémentation suivante après validation.

Elle ne doit pas demander à l’utilisateur de valider chaque petit choix technique déjà couvert par les documents.

## 15.2 — Ce qui nécessite une validation

Une intervention humaine est requise lorsqu’il faut :

- modifier une décision produit approuvée ;
- engager une refonte architecturale non prévue ;
- supprimer ou remplacer une fonctionnalité validée sans solution équivalente ;
- utiliser un service payant ou une ressource externe non autorisée ;
- accéder à un compte ou obtenir une permission manquante ;
- effectuer une action externe non autorisée ;
- arbitrer une contradiction importante entre les spécifications.

L’IA doit poursuivre les tâches indépendantes et sûres au lieu d’arrêter tout le projet pour un blocage local.

## 15.3 — GitHub

Le fait que l’IA puisse effectuer des commits ou des pushes dépend des outils, permissions, identifiants et accès réellement disponibles.

Le dépôt GitHub doit être considéré comme un mécanisme de sauvegarde et de transfert du travail, pas comme une preuve de qualité.

Chaque push doit correspondre à un état cohérent du projet. Il ne doit pas remplacer la validation locale.

L’IA ne doit jamais exposer de token GitHub, de clé privée ou de secret dans le code, les commits ou les rapports.

---

# 16 — DÉFINITION DE « TERMINÉ »

Le projet n’est pas terminé lorsque toutes les fonctionnalités imaginées ont été codées.

Il est terminé pour la livraison anniversaire lorsque les conditions suivantes sont satisfaites :

- le parcours anniversaire principal est complet ;
- la lettre et les contenus essentiels sont accessibles ;
- les écrans principaux sont utilisables sur mobile ;
- le design respecte la direction approuvée ;
- les animations restent fonctionnelles et non bloquantes ;
- le build de production passe ;
- les vérifications disponibles ont été exécutées ;
- aucune régression critique connue ne subsiste ;
- les fonctionnalités incomplètes ne sont pas présentées comme terminées ;
- l’état Git et la livraison sont documentés ;
- les limitations connues sont explicites.

La PWA, les données locales et les fonctionnalités quotidiennes doivent être évaluées selon le périmètre réellement livré. Une fonctionnalité différée ne doit pas invalider la livraison du parcours anniversaire si elle n’appartient pas au périmètre P0.

---

# 17 — PROMPT D’EXÉCUTION INITIAL

Le bloc ci-dessous sert à lancer le travail de l’IA de développement. Il ne remplace pas les boucles définies dans ce document.

**Instruction :**

Tu es l’agent de développement chargé de l’implémentation du projet `Anniversaire.princia`.

Lis intégralement les documents 00, 01, 02, 03 et 04 disponibles avant de commencer. Respecte leurs responsabilités respectives et conserve les décisions déjà approuvées.

Ta mission consiste à exécuter la roadmap de manière séquentielle, avec une boucle de vérification et de correction après chaque implémentation.

Commence par la phase 0 : audit du dépôt et établissement de la baseline. Inspecte les fichiers, les dépendances, les scripts, les tests, la configuration et l’état Git réels. Ne déduis pas qu’une dépendance est installée à partir d’une ancienne commande. Ne modifie pas l’architecture pendant l’audit.

Après l’audit, commence la première implémentation dont les prérequis sont satisfaits.

Pour chaque implémentation :

1. lis son objectif et ses critères ;
2. inspecte les composants concernés ;
3. établis un plan limité ;
4. effectue l’implémentation ;
5. exécute les vérifications disponibles ;
6. compare les résultats aux critères ;
7. identifie les défauts et régressions ;
8. corrige les défauts dans le périmètre autorisé ;
9. relance les vérifications ;
10. valide l’implémentation uniquement lorsque les critères critiques sont satisfaits ;
11. mets à jour le registre de progression ;
12. enregistre un point de contrôle cohérent si Git est disponible ;
13. passe à l’implémentation suivante.

Ne t’arrête pas après avoir écrit le code. Ne demande pas une validation humaine pour chaque tâche technique déjà spécifiée.

N’engage aucune modification architecturale non approuvée. Une référence esthétique, à elle seule, ne justifie jamais une telle modification.

Ne sacrifie jamais une fonctionnalité validée pour ajouter une nouvelle fonctionnalité. Toute régression introduite par une implémentation doit être corrigée avant sa validation.

Priorise le parcours anniversaire P0 et la livraison du 3 octobre 2026 à 23 h 59. Diffère les fonctionnalités secondaires plutôt que de compromettre la stabilité.

Poursuis automatiquement les implémentations indépendantes lorsque cela est sûr. Si un blocage réel exige une permission, une décision produit ou une modification architecturale non approuvée, documente-le précisément et continue les tâches indépendantes.

À la fin de chaque implémentation, produis le rapport défini dans le document 04. Ne déclare jamais un test, un commit, un push, un build ou un déploiement réussi sans preuve réelle.

À la fin du travail, fournis un rapport final indiquant les fonctionnalités livrées, les vérifications effectuées, les résultats de non-régression, le commit et l’état GitHub, les limitations restantes et les éventuelles tâches différées.

Commence maintenant par l’audit initial. Ne commence pas par une refonte visuelle ou architecturale.

---

# 18 — DOCUMENT SUIVANT

Le document 04 — Implementation Roadmap définit désormais le processus d’exécution, les priorités, les boucles de correction et les critères de livraison.

Le document suivant est :

**05 — AI Development Prompts**

Il devra fournir les instructions spécialisées nécessaires pour lancer et piloter l’IA de développement, en s’appuyant sur la roadmap, sans remplacer le mécanisme de boucle de validation défini ici.
