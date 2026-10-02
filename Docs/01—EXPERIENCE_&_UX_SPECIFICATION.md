# 01 — EXPERIENCE & UX SPECIFICATION

## PRINCIAS — Personal Birthday Experience & Progressive PWA

**Projet :** Anniversaire.princia  
**Document :** 01 — Experience & UX Specification  
**Version :** 1.0  
**Statut :** Spécification UX de référence  
**Document parent :** `00 — PROJECT BRIEF`  
**Destinataire principal :** Princia  
**Plateformes :** Android et ordinateur  
**Approche :** Mobile-first, responsive, progressive et centrée sur l'utilisatrice  
**Langue initiale de l'interface :** Français  
**Date de référence :** 2 octobre 2026

---

# 1. Objet du document

## 1.1. Objectif

Ce document définit l'expérience utilisateur et les comportements fonctionnels attendus pour Anniversaire.princia.

Il transforme la vision du document `00 — PROJECT BRIEF` en spécifications destinées à guider directement l'implémentation.

Il précise :

- les parcours utilisateurs ;
- les points d'entrée et de sortie ;
- la structure de navigation ;
- les écrans et leur contenu ;
- les actions disponibles ;
- les transitions entre les expériences ;
- les états d'interface ;
- les comportements attendus ;
- les règles de confidentialité visibles dans l'expérience ;
- les critères de validation UX ;
- les limites de l'implémentation et les décisions nécessitant une validation.

Ce document décrit le comportement attendu du produit, indépendamment de la manière dont le code sera organisé. Les décisions d'architecture, de stockage, de sécurité technique et de déploiement seront approfondies dans `03 — TECHNICAL ARCHITECTURE`.

## 1.2. Relation avec les autres documents

L'agent de développement devra lire le présent document conjointement avec :

- `00 — PROJECT BRIEF` : vision, destinataire, décisions validées et périmètre ;
- `02 — VISUAL & MOTION DIRECTION` : identité visuelle, composants et règles d'animation ;
- `03 — TECHNICAL ARCHITECTURE` : architecture, données, sécurité et intégrations ;
- `04 — IMPLEMENTATION ROADMAP` : phases, dépendances et critères de livraison ;
- `05 — AI DEVELOPMENT PROMPTS` : cadre de travail et instructions destinées à l'agent.

Le présent document ne remplace pas ces références.

En cas de contradiction, l'agent devra signaler le conflit et demander une décision au créateur lorsqu'il affecte une exigence importante. Il ne devra pas arbitrer silencieusement entre deux spécifications.

## 1.3. Règle de conformité

Les comportements décrits comme obligatoires dans ce document devront être implémentés conformément à leur définition.

L'agent ne pourra pas :

- supprimer un parcours parce qu'il le juge inutile ;
- remplacer une direction créative par une autre ;
- modifier le ton de l'expérience ;
- ajouter des fonctionnalités non validées ;
- transformer une action facultative en obligation ;
- introduire des éléments de gamification non prévus ;
- inventer des souvenirs ou des textes personnels ;
- modifier le périmètre d'une fonctionnalité sans approbation.

Une amélioration identifiée pendant le développement devra être présentée séparément, avec sa justification, son impact et les éventuelles conséquences sur le calendrier.

Elle ne sera intégrée qu'après validation explicite du créateur.

---

# 2. Principes UX fondamentaux

## 2.1. Une expérience conçue pour une personne

L'application est conçue pour Princia.

Elle ne doit pas ressembler à un tableau de bord SaaS générique, à une application de productivité standard ou à un site d'anniversaire interchangeable.

Chaque choix d'interface doit contribuer à au moins l'un des objectifs suivants :

- raconter votre histoire ;
- mettre en valeur ses centres d'intérêt ;
- faciliter une action utile ;
- préserver son confort et son autonomie ;
- renforcer la cohérence de l'univers.

La personnalisation devra être réelle, mais elle ne devra pas conduire à exposer des informations privées ou à supposer des préférences qu'elle n'a pas exprimées.

## 2.2. Deux expériences anniversaire, une seule identité

Les deux parcours narratifs coexistent :

- **Blue Library** : parcours principal, présenté en premier ;
- **The 18th Case** : parcours alternatif, accessible depuis Blue Library.

Ces parcours ne sont pas deux applications indépendantes. Ils partagent la même identité générale, les mêmes principes de navigation et le même objectif : offrir une expérience personnelle, mémorable et facile à parcourir.

## 2.3. Une transition naturelle vers l'espace quotidien

L'expérience anniversaire constitue le point d'entrée du produit.

L'espace quotidien doit ensuite être accessible sans obliger Princia à recommencer l'expérience anniversaire à chaque visite.

La lettre, les souvenirs et les chapitres doivent rester consultables après l'anniversaire.

L'expérience quotidienne devra progressivement devenir autonome : elle ne doit pas nécessiter de rejouer l'enquête ou de relire tous les chapitres pour accéder à ses lectures ou à ses tâches.

## 2.4. Une interface sans pression

L'application accompagne Princia ; elle ne la surveille pas et ne la juge pas.

Les principes suivants sont obligatoires :

- elle choisit ses propres objectifs ;
- elle peut modifier ou supprimer ses tâches ;
- elle peut ignorer une suggestion ;
- elle peut désactiver les notifications ;
- elle peut utiliser une fonctionnalité sans en utiliser les autres ;
- elle ne perd pas l'accès à ses données parce qu'elle n'a pas utilisé l'application pendant plusieurs jours ;
- elle n'est jamais comparée à d'autres personnes.

Aucun message ne devra la culpabiliser parce qu'elle n'a pas terminé une tâche, lu un livre ou effectué son rituel hebdomadaire.

## 2.5. Une priorité à la compréhension

L'interface doit permettre de comprendre rapidement :

- où l'on se trouve ;
- ce que l'on peut faire ;
- ce qui se produira après une action ;
- comment revenir en arrière ;
- si une donnée a été enregistrée ;
- si une fonctionnalité nécessite une connexion ou une autorisation.

Les effets visuels ne devront jamais masquer une action importante ni retarder inutilement la navigation.

---

# 3. Utilisatrice principale et contexte d'utilisation

## 3.1. Utilisatrice principale

Princia est l'utilisatrice principale de la PWA.

Le créateur, Stane, intervient principalement dans la préparation de l'expérience anniversaire et dans l'ajout de propositions à la section « À découvrir », selon le mécanisme qui sera défini.

L'interface ne doit pas laisser entendre que Stane peut consulter automatiquement les tâches, les notes, les objectifs ou les lectures personnelles de Princia.

Si une fonctionnalité future nécessite un accès du créateur à des données de l'utilisatrice, elle devra faire l'objet d'une décision et d'une spécification explicites.

## 3.2. Contextes d'utilisation

Le produit devra prendre en compte plusieurs contextes.

### Sur Android

Princia pourra :

- découvrir le cadeau ;
- lire la lettre ;
- parcourir les chapitres ;
- résoudre une énigme ;
- consulter sa bibliothèque ;
- ajouter une tâche ;
- noter une victoire ;
- consulter une proposition ;
- accéder à ses ressources.

Les interactions devront être adaptées au tactile. Les actions essentielles ne devront pas dépendre du survol de la souris.

### Sur ordinateur

Elle devra pouvoir retrouver les mêmes fonctions essentielles avec une interface adaptée à la largeur de l'écran.

La mise en page pourra exploiter l'espace supplémentaire pour afficher davantage de contenu, mais ne devra pas créer une expérience différente ou contradictoire.

Les actions, les données et la navigation devront rester cohérentes entre les deux plateformes.

## 3.3. Hypothèses d'usage à ne pas transformer en faits

Le produit est conçu pour une utilisatrice principale, mais le document ne présume pas :

- qu'elle souhaite un compte ;
- qu'elle souhaite une synchronisation distante ;
- qu'elle souhaite activer les notifications ;
- qu'elle souhaite utiliser l'assistant IA ;
- qu'elle souhaite remplir toutes les sections ;
- qu'elle préfère une interface très animée à une interface plus calme.

Les choix qui affectent ces comportements devront rester explicites et réversibles.

---

# 4. Architecture générale de l'expérience

## 4.1. Organisation des espaces

L'application s'organise autour de trois espaces logiques.

### Espace A — Expérience anniversaire

Il comprend :

1. l'entrée et l'accueil ;
2. Blue Library ;
3. les chapitres et les souvenirs ;
4. la lettre personnelle ;
5. l'accès à The 18th Case ;
6. l'expérience interactive et ses surprises ;
7. la transition vers l'espace quotidien.

### Espace B — Espace personnel quotidien

Il comprend progressivement :

1. l'accueil personnel ;
2. la bibliothèque personnelle ;
3. le carnet universitaire ;
4. Mes petites victoires ;
5. À découvrir ;
6. le coin de découverte informatique ;
7. le rituel hebdomadaire ;
8. l'assistant IA, lorsqu'il sera implémenté.

### Espace C — Préférences et contrôle

Il comprend les paramètres nécessaires aux fonctionnalités effectivement disponibles :

- préférences d'affichage, si elles sont implémentées ;
- notifications et rappels ;
- état de connexion ;
- informations relatives au stockage ;
- protection d'accès, selon le mécanisme retenu ;
- gestion ou export des données, lorsqu'ils seront implémentés.

Cet espace ne doit pas devenir un panneau d'administration complexe.

## 4.2. Carte de navigation

La structure logique est la suivante :

```text
Application
│
├── Expérience anniversaire
│   ├── Entrée / Accueil
│   ├── Blue Library
│   │   ├── Couverture
│   │   ├── Chapitres
│   │   ├── Souvenirs
│   │   ├── Lettre personnelle
│   │   └── Accès à The 18th Case
│   │
│   └── The 18th Case
│       ├── Introduction
│       ├── Indices
│       ├── Énigmes
│       ├── Révélations
│       └── Retour à Blue Library
│
├── Espace quotidien
│   ├── Accueil personnel
│   ├── Bibliothèque
│   ├── Carnet universitaire
│   ├── Mes petites victoires
│   ├── À découvrir
│   ├── Découverte informatique
│   └── Rituel hebdomadaire
│
├── Assistant IA [version ultérieure]
│
└── Préférences
    ├── Notifications
    ├── Stockage et données
    └── Protection d'accès [selon configuration]
```

Cette carte définit les espaces et leurs relations. Elle ne signifie pas que toutes les pages doivent être visibles dans la première livraison.

## 4.3. Navigation entre les espaces

Les règles suivantes s'appliquent :

- Blue Library constitue le parcours anniversaire principal.
- The 18th Case est accessible depuis Blue Library.
- La sortie de l'expérience anniversaire conduit vers l'espace quotidien lorsque celui-ci est disponible.
- L'accès à l'espace quotidien ne dépend pas de la réussite des énigmes.
- La lettre reste accessible après l'anniversaire.
- Les sections quotidiennes ne doivent pas être imbriquées dans le parcours narratif.
- L'utilisatrice doit pouvoir revenir à l'accueil de l'espace dans lequel elle se trouve.
- Aucun écran ne doit créer une impasse de navigation.

L'agent déterminera la meilleure implémentation technique de ces règles conformément au document d'architecture.

---

# 5. Parcours utilisateur principal — Blue Library

## 5.1. Objectif du parcours

Blue Library est la première expérience présentée à Princia.

Elle doit lui faire découvrir le cadeau progressivement, à travers une métaphore littéraire cohérente avec son goût pour les livres.

Le parcours doit être émotionnel sans être excessivement solennel, interactif sans être compliqué et suffisamment court pour rester agréable sur mobile.

## 5.2. Vue d'ensemble du parcours

```text
Entrée dans l'application
          |
          v
Invitation / couverture
          |
          v
Ouverture de Blue Library
          |
          v
Présentation de la bibliothèque
          |
          v
Exploration des chapitres
          |
          v
Souvenirs, photos et messages
          |
          v
Lettre personnelle
          |
          v
Proposition de poursuivre l'exploration
          |
          +---------------------+
          |                     |
          v                     v
The 18th Case             Espace quotidien
(parcours facultatif)     (si disponible)
          |                     |
          v                     v
Retour à Blue Library     Accueil personnel
```

Le parcours pourra être adapté lorsque les contenus réels seront disponibles, mais les relations fonctionnelles devront être conservées.

## 5.3. Écran BL-01 — Entrée et invitation

### Objectif

Créer un premier contact avec l'expérience et faire comprendre qu'il s'agit d'un cadeau personnel.

### Contenu attendu

- le prénom « Princia » ;
- un titre ou une phrase d'accueil ;
- un élément visuel évoquant un livre, une couverture ou une bibliothèque ;
- une invitation claire à ouvrir l'expérience ;
- une animation d'entrée discrète, si elle est retenue dans la direction artistique.

Le texte définitif sera fourni ou validé par le créateur.

### Actions

Action principale : ouvrir l'expérience.

L'utilisatrice ne doit pas être obligée de regarder une animation complète avant de pouvoir poursuivre.

### Comportements

- Le bouton d'entrée doit être immédiatement identifiable.
- L'action doit fonctionner au toucher et au clavier.
- Une activation répétée ne doit pas créer plusieurs transitions concurrentes.
- Si une animation échoue, l'accès au contenu doit rester possible.
- L'écran ne doit pas exiger l'autorisation de notifications ou la création d'un compte.

### Critères de validation

- L'identité du cadeau est compréhensible.
- L'action principale est visible.
- L'écran fonctionne sur téléphone et ordinateur.
- Le contenu reste accessible si l'animation est désactivée ou indisponible.

## 5.4. Écran BL-02 — Couverture de Blue Library

### Objectif

Présenter la direction créative principale et inviter Princia à entrer dans la bibliothèque narrative.

### Contenu attendu

- une couverture visuelle ;
- le titre de l'expérience ;
- un texte court d'introduction ;
- une action permettant d'ouvrir la bibliothèque.

L'utilisation de « Chapter 18 » reste provisoire jusqu'à confirmation du nom final.

### Interactions

- Ouvrir la bibliothèque.
- Revenir à l'écran d'entrée, si une navigation arrière est prévue.

### Comportement attendu

La couverture doit constituer une introduction, pas une page de présentation longue.

L'animation d'ouverture d'un livre peut être utilisée si elle reste fluide, rapide et accessible.

Elle ne doit pas retarder inutilement l'accès aux chapitres.

## 5.5. Écran BL-03 — Vue principale de la bibliothèque

### Objectif

Présenter les chapitres et donner à Princia un point de repère pour explorer l'histoire.

### Contenu attendu

- une représentation visuelle de la bibliothèque ;
- les chapitres disponibles ;
- un titre ou une courte introduction ;
- un accès visible à The 18th Case ;
- une indication permettant de retrouver la lettre, si elle est disponible depuis cet écran.

Les chapitres devront être organisés selon la narration validée par le créateur.

### Interactions

- Ouvrir un chapitre.
- Revenir à la bibliothèque depuis un chapitre.
- Accéder à The 18th Case.
- Accéder à la lettre, lorsque le lien est affiché.

### Règles

La navigation ne doit pas obliger Princia à ouvrir les chapitres dans un ordre artificiel, sauf si une dépendance narrative a été explicitement validée.

Si certains chapitres sont présentés dans un ordre recommandé, celui-ci doit être visuellement compréhensible sans bloquer l'exploration.

L'agent ne devra pas inventer des chapitres supplémentaires pour remplir l'espace.

## 5.6. Écran BL-04 — Lecture d'un chapitre

### Objectif

Présenter un souvenir, un message ou une étape de votre histoire.

### Contenu possible

Selon les matériaux validés :

- un titre ;
- un texte narratif ;
- une photographie ;
- une légende ;
- un détail humoristique ;
- un message personnel ;
- une action pour poursuivre la lecture.

Tous ces éléments ne sont pas obligatoires dans chaque chapitre.

### Interactions

- Lire le contenu.
- Consulter une photographie.
- Passer au chapitre suivant, si cela est pertinent.
- Revenir à la liste des chapitres.
- Accéder à la lettre, lorsque le parcours le prévoit.

### Comportements

- Le texte doit rester lisible sans animation.
- Les photographies doivent conserver un affichage adapté à l'écran.
- Une image absente ne doit pas faire échouer le chapitre.
- Le retour à la bibliothèque doit être simple.
- Les transitions ne doivent pas effacer le contenu déjà consulté.

### Règle éditoriale

L'agent ne devra pas inventer le souvenir, sa date, les personnes présentes ou les paroles prononcées.

Si le contenu nécessaire n'est pas disponible, il devra laisser un emplacement clairement identifié dans le travail de préparation et signaler le contenu manquant.

Un texte de remplacement générique ne pourra être intégré à la version finale sans validation.

## 5.7. Écran BL-05 — Lettre personnelle

### Objectif

Permettre à Princia de lire le message principal du cadeau et de le retrouver après l'anniversaire.

### Contenu attendu

- un titre ou une introduction discrète ;
- la lettre validée par le créateur ;
- une mise en page adaptée à la lecture ;
- un moyen de revenir à la bibliothèque ;
- un accès ultérieur depuis l'espace anniversaire ou un espace souvenir.

### Interactions

- Lire la lettre.
- Revenir à la bibliothèque.
- Reprendre la lecture si le texte est long, sans perdre sa position pendant la navigation courante lorsque cela est raisonnablement possible.

### Règles

La lettre ne devra pas être remplacée par un texte généré automatiquement au moment de l'ouverture.

La version affichée doit être celle qui a été validée.

Elle ne devra pas disparaître lorsque l'expérience anniversaire est terminée.

L'accès à la lettre ne doit pas dépendre de la réussite d'une énigme.

## 5.8. Écran BL-06 — Fin du parcours principal

### Objectif

Marquer la fin de l'expérience narrative sans donner l'impression que le cadeau est terminé ou que l'utilisatrice doit effectuer une action supplémentaire.

### Contenu attendu

- un message de conclusion ;
- une possibilité de revenir à la bibliothèque ;
- un accès à The 18th Case ;
- un accès à l'espace quotidien, lorsqu'il est disponible.

### Comportement

L'utilisatrice peut quitter cet écran, revenir aux chapitres ou accéder à l'espace quotidien.

Aucun message ne doit exiger qu'elle explore toutes les sections.

La conclusion doit fonctionner même si elle n'a consulté qu'une partie de la bibliothèque.

---

# 6. Parcours alternatif — The 18th Case

## 6.1. Objectif

The 18th Case est une expérience d'enquête facultative qui met en valeur l'intérêt de Princia pour les séries policières.

Elle doit proposer une autre manière de découvrir les souvenirs et les surprises, sans remplacer Blue Library.

L'enquête ne doit pas devenir un examen, une compétition ou une épreuve obligatoire pour obtenir le cadeau.

## 6.2. Vue d'ensemble

```text
Blue Library
     |
     v
Présentation de The 18th Case
     |
     v
Introduction de l'enquête
     |
     v
Découverte d'un indice
     |
     v
Énigme facultative
     |
     v
Vérification de la réponse
     |
     +--------------------+
     |                    |
     v                    v
Réponse correcte      Réponse incorrecte
     |                    |
     v                    v
Révélation            Indice supplémentaire
     |                    |
     +---------+----------+
               |
               v
        Souvenir / surprise
               |
               v
       Conclusion de l'enquête
               |
               v
       Retour à Blue Library
```

Le nombre exact d'étapes et d'énigmes sera limité par le contenu validé et le périmètre de la version anniversaire.

## 6.3. Écran CASE-01 — Présentation de l'enquête

### Contenu

- le nom « The 18th Case » ;
- une courte introduction ;
- une indication du caractère facultatif du parcours ;
- une action pour commencer ;
- un moyen de revenir à Blue Library.

### Comportement

La présentation doit indiquer clairement qu'il s'agit d'un parcours alternatif.

Princia ne doit pas avoir l'impression qu'elle doit terminer l'enquête pour accéder à la lettre ou aux autres souvenirs.

## 6.4. Écran CASE-02 — Introduction narrative

### Objectif

Installer l'ambiance de l'enquête et expliquer le principe de l'interaction.

### Contenu

- une courte mise en situation ;
- le contexte de l'enquête ;
- une instruction compréhensible ;
- une action pour découvrir le premier indice.

Le scénario doit rester léger et cohérent avec l'amitié.

L'agent ne devra pas créer un scénario inquiétant, un conflit fictif intense ou une intrigue impliquant de véritables personnes comme suspectes sans validation du créateur.

## 6.5. Écran CASE-03 — Indice

### Contenu

- un indice textuel ou visuel ;
- une courte instruction ;
- une action permettant de répondre ou de poursuivre.

Un indice peut faire référence à un souvenir réel ou à un élément de l'univers narratif.

Si un indice dépend d'une anecdote privée, celle-ci devra avoir été fournie et validée.

### Comportement

L'indice doit être compréhensible sur mobile.

Les éléments essentiels ne doivent pas dépendre uniquement d'une couleur, d'un effet au survol ou d'une interaction difficile à découvrir.

## 6.6. Écran CASE-04 — Énigme

### Objectif

Permettre à Princia de répondre à une question ou de résoudre une énigme simple.

### Interactions possibles

Selon le contenu validé :

- sélectionner une réponse ;
- saisir une réponse courte ;
- choisir entre quelques éléments.

Le type d'interaction devra être cohérent avec l'énigme. Il ne faut pas ajouter plusieurs mécanismes si un seul suffit.

### Règles

- La consigne doit être explicite.
- La réponse doit pouvoir être modifiée avant validation.
- Le bouton de validation doit être identifiable.
- Une erreur ne doit pas effacer les informations déjà saisies.
- L'utilisatrice doit pouvoir demander un indice supplémentaire si ce mécanisme est prévu.
- La résolution ne doit pas être bloquée par une erreur de saisie mineure lorsque plusieurs formulations sont acceptables.

L'agent devra implémenter la logique de réponse à partir des énigmes validées. Il ne devra pas inventer des réponses qui modifient le sens de l'histoire.

## 6.7. Écran CASE-05 — Réponse incorrecte

### Objectif

Permettre à Princia de poursuivre sans frustration.

### Comportement

Une réponse incorrecte devra produire un retour neutre et encourageant.

L'interface pourra proposer :

- de réessayer ;
- de revoir l'indice ;
- de demander une aide, si cette option est prévue.

Elle ne devra pas employer de message humiliant, culpabilisant ou compétitif.

Le nombre de tentatives ne devra pas être limité, sauf décision explicite ultérieure.

## 6.8. Écran CASE-06 — Réponse correcte et révélation

### Objectif

Confirmer la résolution et révéler le contenu prévu.

### Contenu

- un retour confirmant la résolution ;
- un souvenir, un message ou une surprise ;
- une action pour continuer.

### Règles

La révélation doit correspondre à l'énigme.

La progression devra être cohérente : une réponse correcte ne doit pas révéler un contenu sans rapport.

La logique de déblocage doit rester simple et testable.

Si l'énigme est facultative, l'accès au contenu principal de l'anniversaire ne devra pas en dépendre.

## 6.9. Écran CASE-07 — Conclusion

### Objectif

Terminer l'enquête et ramener Princia vers l'expérience principale.

### Actions

- revenir à Blue Library ;
- consulter la lettre si elle n'a pas encore été lue ;
- accéder à l'espace quotidien, si celui-ci est disponible.

La conclusion doit être compréhensible même si l'utilisatrice a utilisé des indices supplémentaires.

## 6.10. Persistance de la progression

Le produit devra préserver la cohérence de l'expérience lorsque l'utilisatrice revient en arrière ou actualise la page.

Le niveau de persistance de la progression de l'enquête sera déterminé par l'architecture technique.

Au minimum, une actualisation ne devra pas produire une situation incohérente dans laquelle une révélation est affichée alors que son contexte est absent.

La conservation de la progression entre plusieurs appareils ne sera pas considérée comme disponible sans mécanisme de synchronisation effectivement implémenté.

---

# 7. Transition entre l'anniversaire et l'espace quotidien

## 7.1. Objectif

L'expérience anniversaire doit donner accès à un espace qui conserve une utilité après le 4 octobre.

Cette transition ne doit pas ressembler à une publicité pour une autre application.

Elle doit présenter l'espace quotidien comme une continuation facultative de l'univers construit autour de Princia.

## 7.2. Écran TRANS-01 — Passage vers l'espace personnel

### Contenu

- une courte conclusion de l'expérience anniversaire ;
- une présentation de l'espace personnel ;
- une action pour découvrir cet espace ;
- la possibilité de rester dans la bibliothèque.

Le texte définitif sera rédigé à partir de la direction éditoriale validée.

### Règles

- L'accès à l'espace quotidien doit être facultatif.
- L'utilisatrice peut revenir à Blue Library.
- L'accès ne doit pas être conditionné à l'accomplissement de l'enquête.
- L'écran ne doit pas demander immédiatement de renseigner des objectifs universitaires.

## 7.3. Première visite de l'espace quotidien

Lors de sa première visite, Princia devra comprendre les principales possibilités offertes par l'application.

L'accueil pourra présenter les sections disponibles et une invitation à commencer par celle qui l'intéresse.

L'interface ne devra pas exiger qu'elle remplisse toutes les sections avant de pouvoir utiliser l'application.

Si une fonctionnalité n'est pas encore implémentée, elle ne devra pas être présentée comme pleinement disponible.

L'agent devra privilégier l'affichage des fonctions effectivement livrées plutôt qu'une interface remplie de boutons inactifs.

## 7.4. Visites ultérieures

Lors des visites ultérieures, l'application devra privilégier un accès direct à l'espace quotidien.

Elle ne devra pas rejouer automatiquement l'introduction de l'anniversaire.

La lettre et les souvenirs resteront accessibles depuis un espace clairement identifiable.

La manière exacte de mémoriser le contexte de visite sera définie dans le document d'architecture.

---

# 8. Accueil de l'espace quotidien

## 8.1. Objectif

L'accueil quotidien sert de point de départ aux fonctionnalités personnelles.

Il doit donner une vue simple de ce qui est disponible sans devenir un tableau de bord surchargé.

## 8.2. Contenu attendu

Selon les fonctionnalités réellement implémentées, l'accueil pourra présenter :

- un message de bienvenue discret ;
- les accès à la bibliothèque et au carnet universitaire ;
- les tâches ou échéances pertinentes ;
- un accès à Mes petites victoires ;
- les nouvelles propositions de la section À découvrir ;
- un accès au coin de découverte informatique ;
- un accès à la lettre et aux souvenirs.

Les données personnelles ne devront être affichées que si elles existent et sont disponibles.

L'agent ne devra pas remplir l'accueil avec des statistiques artificielles ou des données fictives pour donner l'impression d'une application active.

## 8.3. États de l'accueil

### Première visite

Présenter les sections disponibles et permettre de commencer sans configuration obligatoire.

### Aucune donnée personnelle

Afficher un état vide utile, avec une invitation facultative à ajouter un premier élément.

### Données présentes

Afficher les informations utiles de manière concise.

### Fonctionnalité non disponible

Ne pas présenter une action comme fonctionnelle si son implémentation n'existe pas encore.

### Données momentanément indisponibles

Expliquer le problème et permettre de réessayer lorsque cela est possible.

## 8.4. Critères de validation

- Les sections disponibles sont identifiables.
- L'accueil reste lisible sur mobile.
- Les informations importantes ne sont pas noyées dans des cartes décoratives.
- Les états vides sont compréhensibles.
- L'utilisatrice peut accéder directement à une fonctionnalité sans devoir suivre un parcours imposé.

---

# 9. Bibliothèque personnelle

## 9.1. Objectif

La bibliothèque personnelle permet à Princia de suivre ses lectures et de conserver des notes.

Elle est distincte de Blue Library :

- Blue Library raconte l'histoire du cadeau.
- La bibliothèque personnelle organise ses propres lectures.

Les deux espaces partagent une identité visuelle, mais doivent rester clairement différenciés dans leur fonction.

## 9.2. Écran LIB-01 — Vue générale

### Contenu

- un titre ;
- les catégories ou états de lecture disponibles ;
- une liste des livres ;
- une action pour ajouter un livre ;
- un accès aux recommandations, si cette fonctionnalité est disponible.

### États de lecture

Les états initiaux prévus sont :

- À lire ;
- En cours ;
- Terminé.

Les états ne devront pas être confondus avec les catégories de genre.

## 9.3. Écran LIB-02 — Ajouter un livre

### Informations envisagées

- titre ;
- auteur, si connu ;
- genre ou catégorie ;
- état de lecture ;
- note personnelle facultative.

Le formulaire devra rester court.

Les champs non indispensables ne devront pas empêcher l'enregistrement.

### Interactions

- ajouter le livre ;
- annuler ;
- corriger les informations ;
- choisir l'état de lecture.

### Validation

Après un enregistrement réussi, le livre doit apparaître dans la liste correspondante.

En cas d'erreur, les informations saisies doivent être préservées autant que possible.

## 9.4. Écran LIB-03 — Détail d'un livre

### Contenu

- titre ;
- auteur, si renseigné ;
- genre ;
- état de lecture ;
- notes personnelles ;
- accès aux actions disponibles.

### Actions

- modifier les informations ;
- changer l'état de lecture ;
- ajouter ou modifier une note ;
- supprimer le livre après confirmation.

La suppression devra être explicite. Elle ne devra pas résulter d'un simple geste ambigu.

## 9.5. Écran LIB-04 — Recommandations

Cette section dépend de la disponibilité du mécanisme de recommandation.

Elle pourra proposer des titres à partir des préférences que Princia a déclarées.

Chaque recommandation devra présenter, lorsque l'information est disponible :

- le titre ;
- l'auteur ;
- le genre ;
- une explication courte de la recommandation ;
- une source ou un lien pertinent ;
- une action pour conserver le titre dans la bibliothèque.

Une recommandation IA ne devra pas être présentée comme une vérité sur ses goûts.

Elle devra pouvoir être ignorée sans conséquence.

## 9.6. Écran LIB-05 — Disponibilité d'un livre

Lorsque la recherche de sources sera implémentée, l'interface devra distinguer :

- les informations relatives au livre ;
- les sources où il a été repéré ;
- les possibilités de lecture ou d'obtention ;
- les éventuelles conditions d'accès.

Les liens externes devront être identifiables.

L'application ne devra pas prétendre qu'un livre est disponible gratuitement sans preuve suffisante.

Les liens devront mener vers des sources pertinentes et légales. Si aucune source fiable n'a été trouvée, l'interface devra le signaler plutôt que d'inventer un lien.

## 9.7. États et erreurs

La bibliothèque devra gérer :

- une liste vide ;
- une liste contenant des livres ;
- un formulaire incomplet ;
- une erreur d'enregistrement ;
- une recherche sans résultat, si la recherche est implémentée ;
- une recommandation indisponible ;
- une connexion absente lorsqu'une fonctionnalité dépend d'un service distant.

Les données locales déjà enregistrées ne devront pas être effacées par un échec de recherche ou d'appel IA.

---

# 10. Carnet universitaire

## 10.1. Objectif

Le carnet universitaire aide Princia à organiser ses tâches, ses échéances et ses priorités.

Il doit fonctionner comme un outil flexible, et non comme un système de contrôle.

## 10.2. Écran UNI-01 — Vue d'ensemble

### Contenu

- les priorités de la semaine ;
- les tâches à venir ;
- les échéances ;
- une action pour ajouter une tâche ;
- un accès à la gestion des priorités.

La vue ne doit pas devenir un calendrier complexe si les besoins peuvent être satisfaits par une liste claire.

## 10.3. Écran UNI-02 — Ajouter ou modifier une tâche

### Informations envisagées

- titre de la tâche ;
- échéance, facultative ;
- priorité, si cette notion est retenue ;
- statut ;
- note facultative ;
- préférences de rappel, si les notifications sont disponibles.

Le formulaire doit être suffisamment simple pour créer une tâche en quelques secondes.

Les champs facultatifs ne devront pas bloquer la création.

### Actions

- enregistrer ;
- annuler ;
- modifier ;
- supprimer après confirmation.

## 10.4. Écran UNI-03 — Priorités hebdomadaires

### Objectif

Permettre à Princia de définir ce qu'elle souhaite privilégier pendant la semaine.

Elle doit pouvoir :

- ajouter une priorité ;
- modifier une priorité ;
- la retirer ;
- réorganiser ses priorités, si cette interaction est prévue ;
- terminer la semaine sans avoir rempli toute la liste.

L'application ne doit pas imposer un nombre minimum de priorités.

Si une limite d'affichage ou de quantité est nécessaire pour des raisons techniques ou de lisibilité, elle devra être justifiée et documentée.

## 10.5. Écran UNI-04 — Échéances et rappels

Lorsqu'une tâche possède une échéance, l'utilisatrice pourra configurer des rappels si la fonctionnalité est disponible.

Les intervalles proposés pourront inclure J-7, J-3 et J-1, conformément au document fondateur.

### Règles

- Aucun rappel ne doit être créé silencieusement.
- Les rappels doivent être désactivables.
- Une tâche sans échéance ne doit pas recevoir de rappel d'échéance.
- La modification d'une échéance doit être prise en compte dans les rappels associés.
- La suppression d'une tâche doit supprimer ou désactiver les rappels qui lui sont liés.
- Les rappels déjà passés ne doivent pas être envoyés rétroactivement comme s'ils étaient encore à venir.

Le mécanisme précis de planification dépendra de l'architecture technique et des capacités des plateformes.

## 10.6. Écran UNI-05 — Tâche terminée

Lorsqu'une tâche est marquée comme terminée :

- son statut doit être mis à jour ;
- l'interface doit confirmer le changement ;
- la tâche doit rester consultable selon l'organisation retenue ;
- ses rappels futurs doivent être traités conformément à la règle de notification définie.

Le message de confirmation doit rester sobre.

Il ne doit pas présenter la tâche comme une preuve de valeur personnelle ou établir un classement de productivité.

## 10.7. États de la fonctionnalité

La fonctionnalité devra gérer :

- aucune tâche ;
- tâches en cours ;
- tâches terminées ;
- tâches avec échéance ;
- tâches sans échéance ;
- erreur d'enregistrement ;
- absence de permission de notification ;
- notifications désactivées ;
- données momentanément indisponibles.

L'absence de permission de notification ne doit pas empêcher l'utilisation du carnet universitaire.

---

# 11. Mes petites victoires

## 11.1. Objectif

Cette section permet à Princia de noter les progrès qu'elle souhaite retenir.

Elle doit être positive, discrète et sans pression.

## 11.2. Écran VIC-01 — Vue générale

### Contenu

- un titre ;
- une courte explication ;
- la liste des victoires enregistrées ;
- une action pour en ajouter une.

Les victoires peuvent concerner les études, la lecture, l'apprentissage, un projet ou une autre réalisation personnelle.

L'interface ne devra pas limiter leur valeur à une catégorie particulière.

## 11.3. Écran VIC-02 — Ajouter une victoire

### Informations

- texte décrivant la victoire ;
- date, si elle est renseignée automatiquement ou choisie ;
- catégorie facultative, si cette fonctionnalité est retenue.

Le texte doit pouvoir rester libre.

### Comportement

- L'ajout est facultatif.
- Une victoire peut être modifiée ou supprimée.
- Aucune série quotidienne ou obligation de publication ne doit être imposée.
- L'interface ne doit pas présenter l'absence de nouvelles victoires comme un problème.

## 11.4. États

La section doit prévoir :

- une première visite sans victoire ;
- une liste contenant des éléments ;
- un formulaire en cours ;
- une confirmation d'enregistrement ;
- une erreur de sauvegarde.

Le contenu des victoires doit rester privé selon les règles de stockage et d'accès du projet.

---

# 12. Section « À découvrir »

## 12.1. Objectif

Cette section constitue un espace de propositions personnelles préparées pour Princia.

Elle peut accueillir des livres, des ressources, des projets, des idées ou des découvertes.

Elle permet au créateur de partager des suggestions dans l'application sans devoir les présenter comme des notifications obligatoires.

## 12.2. Écran DISC-01 — Liste des propositions

### Contenu

Chaque proposition pourra comporter :

- un titre ;
- une courte description ;
- une catégorie ;
- un lien ou une ressource, si nécessaire ;
- une indication de provenance lorsqu'elle est utile.

La liste devra distinguer les propositions personnelles du créateur des recommandations automatiques de l'IA.

## 12.3. Écran DISC-02 — Détail d'une proposition

L'utilisatrice pourra consulter le contenu et ouvrir le lien associé, si disponible.

Le lien externe devra être identifiable avant son ouverture.

L'interface ne devra pas prétendre que le lien a été vérifié récemment si cela n'a pas été fait.

## 12.4. Comportement

Princia pourra consulter une proposition sans être obligée de l'accepter, de la terminer ou d'y répondre.

Le mécanisme d'ajout de contenu par le créateur reste à définir dans les documents suivants.

Aucun espace d'administration visible dans la PWA ne devra être ajouté sans décision explicite.

---

# 13. Coin de découverte informatique

## 13.1. Objectif

Permettre à Princia d'explorer l'informatique à son rythme.

Cet espace doit être accueillant pour une personne qui découvre la programmation et ne doit pas présumer de connaissances avancées.

## 13.2. Écran CODE-01 — Vue générale

### Contenu

- une introduction courte ;
- des catégories de ressources ;
- des liens vers des ressources pédagogiques ;
- des idées de mini-projets, lorsque disponibles ;
- un accès à l'assistant IA, si celui-ci est implémenté.

L'interface devra clairement distinguer les ressources externes des contenus hébergés dans l'application.

## 13.3. Écran CODE-02 — Détail d'une ressource

Chaque ressource pourra présenter :

- son titre ;
- son objectif ;
- son niveau indicatif, si celui-ci est connu ;
- une description courte ;
- un lien ;
- une indication de provenance.

L'agent ne devra pas inventer un niveau, une certification ou une promesse de résultat.

## 13.4. Règles

- L'accès à cet espace est facultatif.
- Aucune progression obligatoire n'est imposée.
- Aucun objectif informatique ne doit être créé automatiquement.
- Les ressources doivent être compréhensibles et pertinentes.
- Les liens externes doivent être présentés honnêtement.
- L'absence de l'assistant IA ne doit pas empêcher la consultation des ressources.

---

# 14. Rituel hebdomadaire facultatif

## 14.1. Objectif

Le rituel hebdomadaire permet à Princia de prendre quelques minutes pour revoir ses tâches et choisir ses priorités.

Il doit l'aider à organiser sa semaine sans devenir une contrainte.

## 14.2. Parcours

```text
Ouvrir le rituel
       |
       v
Consulter les tâches
       |
       v
Revoir les priorités
       |
       v
Choisir les priorités suivantes
       |
       v
Enregistrer les changements
       |
       v
Terminer ou quitter
```

## 14.3. Comportement

Le rituel doit permettre de consulter et modifier les informations existantes sans créer automatiquement de nouvelles tâches.

L'utilisatrice doit pouvoir quitter le parcours à tout moment.

Si elle ne termine pas le rituel, les données déjà enregistrées doivent rester cohérentes.

Aucun message ne devra lui reprocher de ne pas avoir effectué le rituel.

## 14.4. État de disponibilité

Le rituel ne devra être affiché comme disponible que lorsque son parcours fonctionnel est implémenté.

Il ne doit pas être présenté comme obligatoire à l'ouverture de l'application.

---

# 15. Assistant IA personnel

## 15.1. Objectif

L'assistant IA devra aider Princia à accomplir des tâches précises, notamment autour de la lecture et de la découverte informatique.

Il ne devra pas être le centre obligatoire de l'expérience.

## 15.2. Cas d'usage prévus

### Lecture

- proposer des titres selon les préférences déclarées ;
- expliquer pourquoi un livre pourrait correspondre à ses intérêts ;
- suggérer des livres similaires ;
- aider à retrouver des sources légales de lecture.

### Informatique

- expliquer une notion ;
- clarifier un concept ;
- aider à comprendre un exercice ;
- proposer une première démarche ;
- décomposer un projet en étapes accessibles.

## 15.3. Interface conversationnelle

Lorsque l'assistant sera implémenté, l'interface devra comprendre :

- un champ de saisie ;
- une action pour envoyer la demande ;
- une indication de traitement ;
- une zone d'affichage de la réponse ;
- un retour en cas d'erreur ;
- une possibilité de poursuivre la conversation.

Les éléments précis dépendront du fournisseur et de l'architecture validés.

## 15.4. États

### Prêt

L'assistant peut recevoir une demande.

### En cours

L'interface indique qu'une réponse est en préparation. L'envoi ne doit pas créer plusieurs requêtes identiques à la suite d'activations accidentelles.

### Réponse disponible

La réponse est affichée clairement et reste lisible.

### Erreur

L'interface indique que la réponse n'a pas pu être obtenue et permet de réessayer lorsque cela est possible.

### Hors ligne

L'interface signale que l'assistant nécessite une connexion ou un service distant.

Elle ne doit pas simuler une réponse provenant du modèle.

## 15.5. Confidentialité et transparence

L'assistant ne devra pas recevoir automatiquement l'intégralité des données de Princia.

Seules les informations nécessaires à la demande devront être transmises.

L'interface devra informer l'utilisatrice des traitements externes pertinents.

L'assistant ne devra pas prétendre avoir effectué une recherche en ligne s'il n'a pas accès à un outil de recherche et ne l'a pas réellement utilisé.

Les recommandations de livres devront distinguer une suggestion de la disponibilité réelle d'une œuvre.

## 15.6. Disponibilité

L'assistant IA est une fonctionnalité évolutive.

Il ne fait pas partie des dépendances obligatoires de la version anniversaire. Son absence ne doit pas affecter le fonctionnement des autres sections.

---

# 16. Préférences, notifications et données

## 16.1. Écran SET-01 — Préférences

L'écran de préférences devra regrouper les contrôles réellement disponibles.

Il ne devra pas afficher de paramètres qui ne correspondent à aucune fonctionnalité implémentée.

Les réglages pourront comprendre :

- notifications ;
- rappels ;
- préférences de stockage ou de synchronisation ;
- protection d'accès ;
- export ou suppression des données, lorsque ces fonctions existent.

## 16.2. Notifications

Avant de demander une permission système, l'interface devra expliquer à quoi serviront les notifications.

La demande de permission devra résulter d'une action compréhensible de l'utilisatrice, et non apparaître sans contexte dès la première visite.

Si elle refuse les notifications :

- le carnet universitaire reste utilisable ;
- les échéances restent consultables ;
- l'application ne doit pas répéter constamment la demande de permission ;
- elle doit pouvoir retrouver les informations utiles dans l'interface.

Le contrôle interne de l'application et la permission du navigateur sont deux états différents. L'interface devra les traiter correctement.

## 16.3. Données et sauvegarde

Les informations créées par Princia doivent être conservées selon le mécanisme de stockage effectivement implémenté.

Si une sauvegarde ou un export est disponible, l'interface devra expliquer ce qui sera exporté.

Si les données sont uniquement locales, l'application ne devra pas laisser croire qu'elles sont automatiquement disponibles sur un autre appareil.

Si une synchronisation distante est introduite, son état et ses éventuelles erreurs devront être présentés de manière compréhensible.

## 16.4. Suppression

Toute action de suppression importante devra être explicite.

L'interface devra distinguer la suppression d'un élément individuel de la suppression de l'ensemble des données.

La confirmation devra préciser ce qui sera supprimé.

L'agent ne devra pas présenter une action comme réversible si aucune possibilité de restauration n'existe.

---

# 17. Système général de navigation

## 17.1. Principes

La navigation doit rester simple et cohérente sur Android et ordinateur.

Les mécanismes précis — barre inférieure, menu, navigation latérale ou autre — seront définis dans le document `02 — VISUAL & MOTION DIRECTION`, en tenant compte des écrans et de la taille disponible.

Le présent document impose les comportements, pas un composant visuel particulier.

## 17.2. Règles de navigation

- Les sections principales doivent être identifiables.
- L'utilisatrice doit pouvoir revenir à l'écran précédent.
- La navigation ne doit pas effacer une saisie sans avertissement.
- Un lien externe doit être identifiable.
- Les actions principales ne doivent pas dépendre du survol.
- Les changements de section doivent préserver les données déjà enregistrées.
- Le retour à l'accueil quotidien ne doit pas renvoyer systématiquement vers l'introduction anniversaire.
- Les pages d'erreur doivent permettre de retrouver un chemin fonctionnel.

## 17.3. Boutons et actions

Chaque contrôle interactif doit correspondre à une action réelle.

Les boutons qui ne sont pas encore fonctionnels ne devront pas être présentés comme disponibles.

Les actions principales devront être visuellement distinguées des actions secondaires, sans multiplier les boutons concurrents.

## 17.4. Retour arrière

Le comportement du retour arrière devra être cohérent avec le contexte.

Lorsqu'une page est ouverte depuis une liste, le retour doit permettre de retrouver cette liste.

Lorsqu'une modification est en cours, l'application devra éviter de perdre silencieusement la saisie.

Si le retour ne peut pas restaurer exactement l'état précédent, l'agent devra appliquer un comportement prévisible et le documenter.

---

# 18. États d'interface transversaux

Toutes les fonctionnalités devront gérer leurs états de manière explicite.

## 18.1. État normal

Le contenu est disponible et les actions sont utilisables.

L'interface doit afficher les données réelles, sans contenu fictif destiné à remplir l'espace.

## 18.2. État vide

Aucune donnée n'est disponible.

L'interface doit expliquer simplement ce que l'utilisatrice peut faire, avec une action facultative lorsqu'elle est pertinente.

L'état vide ne doit pas ressembler à une erreur.

## 18.3. État de chargement

Une opération est en cours.

L'interface doit donner un retour visuel adapté sans bloquer toute l'application si cela n'est pas nécessaire.

Une opération ne doit pas pouvoir être déclenchée plusieurs fois accidentellement.

## 18.4. État de succès

L'action a réussi.

L'interface doit confirmer le résultat de façon sobre et compréhensible.

Le message ne doit pas apparaître avant que l'action ait réellement réussi.

## 18.5. État d'erreur

Une action a échoué.

L'interface doit expliquer ce qui n'a pas fonctionné, sans exposer de détails techniques sensibles.

Lorsque cela est possible, elle doit permettre de réessayer ou de corriger les données.

## 18.6. État hors ligne

L'application doit distinguer les fonctions disponibles localement de celles qui nécessitent une connexion.

Les contenus essentiels mis en cache pourront rester accessibles.

Les fonctions distantes devront signaler leur indisponibilité plutôt que simuler une réponse.

## 18.7. État de permission refusée

Le refus d'une permission, notamment celle des notifications, ne doit pas provoquer de panne générale.

L'application doit expliquer les conséquences et permettre de poursuivre avec les fonctionnalités restantes.

## 18.8. État de contenu absent

Lorsqu'un souvenir, une photo, une lettre ou une ressource n'a pas encore été fourni, l'agent ne devra pas inventer un contenu personnel.

Pendant le développement, l'absence devra être visible dans les outils de travail ou les rapports. Elle ne devra pas apparaître comme un emplacement technique brut dans l'expérience finale livrée.

---

# 19. Responsive design et interactions

## 19.1. Mobile-first

Les écrans devront être conçus d'abord pour les petits écrans, puis adaptés aux écrans plus larges.

Sur mobile :

- les contenus doivent être lisibles sans zoom ;
- les boutons doivent être facilement accessibles au toucher ;
- les formulaires doivent rester courts ;
- les éléments interactifs ne doivent pas être trop rapprochés ;
- les transitions ne doivent pas bloquer les gestes ou les actions ;
- les contenus longs doivent pouvoir être parcourus naturellement.

## 19.2. Ordinateur

Sur ordinateur :

- les contenus peuvent utiliser une largeur plus importante ;
- les chapitres et les listes peuvent bénéficier d'une mise en page plus aérée ;
- la navigation doit rester cohérente ;
- les interactions au clavier doivent être prises en charge ;
- aucun élément essentiel ne doit dépendre exclusivement de la souris.

L'agent ne devra pas simplement étirer l'interface mobile pour remplir l'écran.

## 19.3. Clavier et focus

Les contrôles doivent pouvoir être parcourus au clavier lorsque cela est pertinent.

Le focus doit rester visible.

Les dialogues et les fenêtres superposées devront avoir un comportement de focus cohérent.

## 19.4. Réduction des animations

Les animations devront respecter les préférences de réduction des mouvements lorsque cela est applicable.

Une animation essentielle à la compréhension devra disposer d'une alternative qui permet d'accéder au même contenu.

Les effets de mouvement ne devront pas être indispensables pour comprendre une consigne ou résoudre une énigme.

---

# 20. Contenu éditorial et gestion des médias

## 20.1. Source des contenus personnels

Le créateur fournit les éléments personnels qui serviront à la narration.

L'agent devra s'appuyer sur ces éléments pour intégrer :

- la lettre ;
- les souvenirs ;
- les photos ;
- les anecdotes ;
- les chapitres ;
- les messages ;
- les énigmes.

## 20.2. Règles d'authenticité

L'agent ne devra pas inventer :

- des conversations ;
- des dates précises ;
- des souvenirs ;
- des promesses ;
- des événements ;
- des réactions de Princia ;
- des sentiments qu'elle n'a pas exprimés.

Il pourra améliorer la formulation des textes fournis, mais toute modification substantielle du sens devra être validée par le créateur.

## 20.3. Photographies

Les photographies devront être fournies ou explicitement validées par le créateur.

L'interface devra prévoir des dimensions adaptées et une présentation qui ne déforme pas les images.

L'agent devra éviter d'intégrer des fichiers trop lourds sans optimisation.

Les images ne devront pas être publiées ailleurs que dans les emplacements prévus.

## 20.4. Contenus externes

Les ressources externes devront être identifiables.

L'agent devra vérifier les liens qu'il ajoute lorsqu'il dispose des moyens nécessaires.

Il ne devra pas inventer des URL ou déclarer un lien fonctionnel sans vérification.

---

# 21. Confidentialité visible dans l'expérience

Les exigences de sécurité détaillées seront définies dans le document technique. Le présent document précise ce que l'utilisatrice doit comprendre.

## 21.1. Accès privé

L'interface ne doit pas laisser croire que le contenu est protégé simplement parce que le lien est discret.

Le mécanisme réel de protection devra être cohérent avec la configuration retenue.

Si une authentification ou un code d'accès est ajouté, le parcours devra rester simple et compréhensible.

## 21.2. Données personnelles

Les tâches, les objectifs, les notes et les victoires de Princia ne doivent pas être présentés comme visibles par Stane par défaut.

L'interface ne doit pas promettre une confidentialité technique qui n'a pas été mise en place.

## 21.3. Services externes

Lorsqu'une fonction transmet des données à un service externe, cette transmission devra être prise en compte dans les spécifications et dans les informations présentées à l'utilisatrice.

L'assistant IA ne devra pas recevoir automatiquement toutes ses données personnelles.

## 21.4. Actions sensibles

Les actions de suppression, de déconnexion ou de modification importante de la protection d'accès devront être explicites.

L'interface devra éviter les actions irréversibles déclenchées par un seul clic ambigu.

---

# 22. Priorités UX par version

Les fonctionnalités décrites dans ce document ne sont pas toutes obligatoires pour la version anniversaire.

## 22.1. V1 — Expérience anniversaire

Le parcours doit privilégier :

- l'entrée dans l'expérience ;
- Blue Library ;
- les chapitres et souvenirs validés ;
- la lettre personnelle ;
- l'accès facultatif à The 18th Case ;
- la navigation et les retours ;
- l'adaptation mobile et ordinateur ;
- l'accès ultérieur à l'expérience anniversaire.

La qualité du parcours principal prime sur l'accumulation d'effets ou de fonctionnalités secondaires.

La mise en production ne doit pas dépendre de l'assistant IA, de la synchronisation distante ou de toutes les fonctions quotidiennes.

## 22.2. V1.1 — Espace quotidien

Le périmètre pourra ensuite intégrer :

- l'accueil quotidien ;
- la bibliothèque personnelle ;
- le carnet universitaire ;
- Mes petites victoires ;
- À découvrir ;
- le coin de découverte informatique ;
- les premières préférences ;
- les rappels, si leur faisabilité est confirmée.

Le périmètre final sera défini par la roadmap.

## 22.3. V2 — Fonctionnalités avancées

Les fonctions suivantes seront étudiées pour une évolution ultérieure :

- assistant IA ;
- recommandations de lecture assistées par IA ;
- recherche de sources de lecture ;
- aide à l'apprentissage informatique ;
- synchronisation distante ;
- personnalisation supplémentaire ;
- fonctionnalités avancées de sauvegarde et d'export.

Aucune de ces fonctions ne doit être affichée comme opérationnelle avant son implémentation et sa validation.

---

# 23. Critères de validation UX

Chaque parcours devra être validé sur la base de comportements observables.

## 23.1. Blue Library

- L'entrée dans l'expérience est compréhensible.
- Blue Library est le premier parcours présenté.
- Les chapitres sont identifiables.
- Les souvenirs affichés correspondent aux contenus fournis et validés.
- La lettre est accessible et lisible.
- Le retour à la bibliothèque fonctionne.
- L'utilisatrice peut terminer le parcours sans avoir ouvert tous les chapitres.
- L'expérience ne dépend pas d'une animation pour rester utilisable.

## 23.2. The 18th Case

- L'accès à l'enquête est facultatif.
- Le retour à Blue Library est toujours possible.
- Les consignes sont compréhensibles.
- Les énigmes fonctionnent au tactile et au clavier lorsque cela est pertinent.
- Une réponse incorrecte ne bloque pas l'expérience.
- Les indices supplémentaires sont accessibles si cette option a été implémentée.
- La résolution produit la révélation prévue.
- L'enquête ne conditionne pas l'accès à la lettre.

## 23.3. Transition vers l'espace quotidien

- La transition est compréhensible.
- L'accès à l'espace quotidien est facultatif.
- La lettre et les souvenirs restent accessibles.
- Les visites suivantes ne forcent pas la répétition de l'introduction.
- Les fonctionnalités non disponibles ne sont pas présentées comme opérationnelles.

## 23.4. Bibliothèque personnelle

Lorsque cette fonctionnalité est livrée :

- un livre peut être ajouté ;
- ses informations peuvent être modifiées ;
- son état de lecture peut changer ;
- une note peut être enregistrée ;
- un livre peut être supprimé après confirmation ;
- les états vides et les erreurs sont gérés ;
- les données persistent conformément à l'architecture.

## 23.5. Carnet universitaire

Lorsque cette fonctionnalité est livrée :

- une tâche peut être créée, modifiée et supprimée ;
- une échéance peut être renseignée ;
- les priorités peuvent être modifiées ;
- une tâche peut être marquée comme terminée ;
- l'absence de permission de notification n'empêche pas l'utilisation ;
- les rappels correspondent aux échéances configurées ;
- aucune tâche n'est créée automatiquement sans action de l'utilisatrice.

## 23.6. Mes petites victoires et À découvrir

Lorsque ces fonctionnalités sont livrées :

- une victoire peut être ajoutée et modifiée ;
- l'absence de contenu est gérée ;
- les propositions peuvent être consultées ;
- les liens externes sont identifiables ;
- les suggestions restent facultatives ;
- les données personnelles ne sont pas exposées involontairement.

## 23.7. Responsive et accessibilité

- Les parcours principaux fonctionnent sur Android et ordinateur.
- Les contenus restent lisibles sur les écrans étroits.
- Les boutons restent accessibles au toucher.
- Le clavier permet d'utiliser les contrôles pertinents.
- Les animations ne bloquent pas la navigation.
- Les préférences de réduction des mouvements sont prises en compte lorsque cela est applicable.
- Les états de chargement et d'erreur sont compréhensibles.

---

# 24. Protocole de validation des parcours

Avant de considérer une fonctionnalité comme terminée, l'agent devra effectuer des tests correspondant à son comportement réel.

## 24.1. Parcours anniversaire

1. Ouvrir l'application.
2. Entrer dans Blue Library.
3. Ouvrir un chapitre.
4. Consulter son contenu.
5. Revenir à la bibliothèque.
6. Ouvrir la lettre.
7. Revenir à l'expérience principale.
8. Accéder à The 18th Case.
9. Résoudre une énigme ou demander une aide, si disponible.
10. Revenir à Blue Library.
11. Vérifier que l'accès à la lettre ne dépend pas de la réussite de l'enquête.

## 24.2. Parcours quotidien

Lorsque l'espace quotidien est livré :

1. Accéder à l'accueil personnel.
2. Ouvrir une fonctionnalité.
3. Créer un élément.
4. Vérifier qu'il apparaît dans la liste.
5. Modifier cet élément.
6. Quitter la section.
7. Revenir à la section.
8. Vérifier la persistance des données selon le stockage retenu.
9. Vérifier le comportement en cas d'erreur ou d'absence de connexion, lorsque cela est pertinent.

## 24.3. Notifications

Lorsque les notifications sont livrées :

1. Vérifier l'explication préalable.
2. Tester l'activation.
3. Tester le refus.
4. Vérifier que le carnet reste utilisable après un refus.
5. Créer une tâche avec échéance.
6. Configurer les rappels.
7. Modifier ou supprimer la tâche.
8. Vérifier la cohérence des rappels associés.

Les tests devront tenir compte des limitations de la plateforme. Une notification planifiée ne sera pas considérée comme validée sur Android ou ordinateur uniquement parce qu'un enregistrement existe dans l'application.

## 24.4. Test sur plusieurs tailles d'écran

Les parcours principaux devront être vérifiés sur :

- un écran mobile étroit ;
- un écran Android de taille courante ;
- un écran d'ordinateur.

Les résultats, problèmes et limites devront être consignés dans le rapport de fin de tâche.

---

# 25. Règles de travail de l'agent IA

## 25.1. Avant l'implémentation

L'agent devra :

1. lire `00 — PROJECT BRIEF` ;
2. lire intégralement le présent document ;
3. lire les autres documents de référence disponibles ;
4. inspecter le dépôt existant ;
5. identifier la phase active dans la roadmap ;
6. vérifier les composants et dépendances déjà présents ;
7. identifier les contenus manquants ;
8. établir les tests nécessaires à la tâche.

## 25.2. Pendant l'implémentation

L'agent devra :

- respecter le périmètre autorisé ;
- utiliser les composants existants lorsqu'ils conviennent ;
- consulter les documentations officielles des bibliothèques utilisées ;
- préserver le travail existant ;
- éviter les dépendances redondantes ;
- ne pas inventer de contenus personnels ;
- ne pas implémenter de suggestion non validée ;
- garder une cohérence entre les écrans ;
- traiter les états vides, les erreurs et les retours de navigation ;
- signaler les dépendances ou contenus manquants.

## 25.3. En cas d'ambiguïté

Si une décision nécessaire n'est pas définie dans les documents, l'agent devra :

1. identifier précisément le point ambigu ;
2. expliquer pourquoi il bloque ou affecte l'implémentation ;
3. présenter une proposition distincte, si une proposition est utile ;
4. indiquer les conséquences des choix possibles ;
5. attendre la validation du créateur lorsque le choix modifie une exigence ou une décision importante.

Il ne devra pas interpréter l'absence d'une décision comme une autorisation générale d'ajouter des fonctionnalités.

## 25.4. Après l'implémentation

L'agent devra fournir un rapport indiquant :

- les parcours implémentés ;
- les écrans créés ou modifiés ;
- les fichiers concernés ;
- les interactions validées ;
- les tests exécutés ;
- les résultats observés ;
- les tests non exécutés ;
- les contenus manquants ;
- les problèmes connus ;
- les améliorations proposées mais non intégrées ;
- le statut réel de la livraison.

Il devra attendre la validation requise avant de passer à la phase suivante.

---

# 26. Points restant à confirmer

Les éléments suivants ne doivent pas être considérés comme définitivement décidés par le présent document.

## 26.1. Nom final de l'expérience

« Princia — Chapter 18 » est provisoire. Le nom final devra être confirmé avant la finalisation des éléments visuels.

## 26.2. Nombre et contenu des chapitres

Le nombre de chapitres et leur contenu exact dépendront des souvenirs fournis et validés par le créateur.

L'agent ne devra pas créer des chapitres fictifs pour atteindre un nombre prédéfini.

## 26.3. Contenu de l'enquête

Le scénario, les indices, les réponses et les révélations devront être définis à partir des éléments validés.

Le nombre exact d'énigmes dépendra du temps et de la complexité réelle de l'implémentation.

## 26.4. Mécanisme d'accès privé

Le niveau de protection de l'application devra être confirmé dans le document technique.

Le présent document ne présume pas qu'un simple lien discret suffit.

## 26.5. Mécanisme d'ajout dans « À découvrir »

Le mode de publication des propositions par Stane devra être défini avant l'implémentation de cette fonctionnalité.

## 26.6. Notifications et synchronisation

Le fonctionnement des notifications et le choix entre stockage local et synchronisation distante dépendront de l'architecture retenue et des tests sur les plateformes ciblées.

## 26.7. Assistant IA

Le fournisseur, les capacités de recherche, le traitement des données, les coûts et le périmètre de la première intégration restent à confirmer.

## 26.8. Composants visuels

Les composants React précis, les effets et les exemples de référence seront validés dans le document `02 — VISUAL & MOTION DIRECTION`.

---

# 27. Résumé des règles non négociables

L'agent de développement doit retenir les règles suivantes :

1. Blue Library est le parcours anniversaire par défaut.
2. The 18th Case est une alternative facultative.
3. A Little Space of Her Own inspire l'espace personnel quotidien.
4. L'expérience doit rester cohérente avec une amitié profonde, affectueuse, complice et non romantique.
5. Les souvenirs et les textes personnels doivent provenir des éléments fournis et validés.
6. La lettre doit rester accessible après l'anniversaire.
7. Les énigmes ne doivent pas bloquer l'accès à la lettre.
8. Les objectifs, les rappels et le rituel hebdomadaire sont facultatifs et contrôlés par Princia.
9. Les données personnelles doivent être traitées selon les règles de confidentialité du projet.
10. L'interface doit être mobile-first et adaptée à l'ordinateur.
11. Les animations ne doivent jamais compromettre la lisibilité ou l'accès au contenu.
12. Les états vides, erreurs, chargements et situations hors ligne doivent être pris en compte.
13. Les fonctionnalités non implémentées ne doivent pas être présentées comme opérationnelles.
14. Les améliorations non validées ne doivent pas être intégrées.
15. Les documents de référence doivent être consultés avant chaque phase de développement.
16. Les tests et les limites doivent être rapportés honnêtement.

---

# 28. Prochaine étape

Le document `01 — EXPERIENCE & UX SPECIFICATION` définit les parcours et comportements attendus.

La prochaine étape sera :

**`02 — VISUAL & MOTION DIRECTION`**

Ce document définira précisément l'identité visuelle, la palette, la typographie, la hiérarchie des composants, les règles de mise en page, les animations, les transitions, l'accessibilité visuelle et l'utilisation cohérente de React Bits, Motion, Anime.js, Impeccable et, si nécessaire, Remotion.

Il devra traduire les parcours définis ici en un système visuel cohérent, sans modifier les comportements fonctionnels validés.

**Fin du document `01 — EXPERIENCE & UX SPECIFICATION`.**