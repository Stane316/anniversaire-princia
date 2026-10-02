# 02 — VISUAL & MOTION DIRECTION
## PRINCIA — Chapter 18

**Type de document :** Direction artistique, identité visuelle, design system et ingénierie du mouvement  
**Version :** 1.0  
**Statut :** Référence de conception pour l’implémentation  
**Projet :** Anniversaire de Princia — expérience interactive et PWA personnelle  
**Document précédent :** `01 — EXPERIENCE & UX SPECIFICATION`  
**Document suivant :** `03 — TECHNICAL ARCHITECTURE`

---

# 00 — OBJECTIF DU DOCUMENT

Ce document définit précisément le langage visuel et le système de mouvement de PRINCIA — Chapter 18.

Il transforme les parcours fonctionnels établis dans le document 01 en une identité visuelle cohérente, reconnaissable et techniquement exploitable.

Il définit notamment :

- la philosophie artistique ;
- l’identité visuelle de l’expérience ;
- les palettes et leurs rôles ;
- la typographie et sa hiérarchie ;
- les tokens du Design System ;
- les grilles et les règles de mise en page ;
- les composants et leurs variantes visuelles ;
- les traitements des images et des illustrations ;
- l’atmosphère de Blue Library ;
- l’identité graphique de The 18th Case ;
- la transition vers l’espace quotidien ;
- les principes de motion design ;
- les responsabilités de Motion, Anime.js, React Bits, Impeccable et Remotion ;
- les règles de responsive design ;
- l’accessibilité visuelle et la réduction des animations ;
- les critères de contrôle de la qualité visuelle.

Ce document constitue une référence de conception pour l’agent IA chargé du développement.

Il ne lui donne pas l’autorisation de modifier les parcours, les règles fonctionnelles, les données ou les comportements validés dans les documents précédents.

## 00.1 — Résultat attendu

L’application doit donner l’impression d’un produit personnel conçu avec intention, et non d’un assemblage de composants, de templates et d’effets visuels.

L’expérience doit être :

- élégante sans être froide ;
- émotionnelle sans être mélodramatique ;
- immersive sans désorienter ;
- ludique sans devenir enfantine ;
- sophistiquée sans être inutilement complexe ;
- personnelle sans exposer des informations privées ;
- animée sans ralentir l’accès au contenu ;
- fonctionnelle au quotidien sans perdre son identité.

Le niveau de finition visé est celui d’une expérience numérique éditoriale et interactive, avec une direction artistique reconnaissable.

L’objectif n’est pas de reproduire mécaniquement une référence externe. Il s’agit de créer une identité propre à Princia et à cette expérience.

---

# 01 — DOCUMENTS DE RÉFÉRENCE ET ORDRE DE PRIORITÉ

L’agent doit consulter les documents du projet avant toute modification du code.

## 01.1 — Références

| Document | Responsabilité |
|---|---|
| `00 — Project Brief` | Vision, objectifs, contexte, périmètre et décisions fondamentales |
| `01 — EXPERIENCE & UX SPECIFICATION` | Parcours, navigation, écrans, interactions et comportements attendus |
| `02 — VISUAL & MOTION DIRECTION` | Identité visuelle, composants, mise en page et mouvement |
| `03 — TECHNICAL ARCHITECTURE` | Architecture logicielle et choix techniques |
| `04 — IMPLEMENTATION ROADMAP` | Phases, dépendances, tâches et critères de livraison |
| `05 — AI DEVELOPMENT PROMPTS` | Instructions d’exécution et de contrôle pour l’agent de développement |

## 01.2 — Règle de priorité

En cas de conflit :

1. Les objectifs et contraintes fondamentaux du document 00 prévalent.
2. Les parcours et comportements fonctionnels du document 01 restent la référence pour l’expérience utilisateur.
3. Le présent document détermine leur traduction visuelle et animée.
4. Les documents techniques précisent comment implémenter cette direction sans contredire les précédentes décisions.

Une animation ne doit jamais modifier la logique d’une interaction.

Une composition visuelle ne doit jamais supprimer une fonctionnalité validée.

Un effet immersif ne doit jamais rendre un contenu essentiel inaccessible.

## 01.3 — Suggestions et modifications

L’agent peut identifier des améliorations possibles.

Il doit cependant :

- les présenter séparément des tâches prévues ;
- expliquer leur intérêt et leurs conséquences ;
- distinguer les améliorations visuelles des changements fonctionnels ;
- attendre l’approbation explicite de l’utilisateur avant de mettre en œuvre une proposition qui n’a pas été validée.

Aucune liberté artistique ne doit être interprétée comme une autorisation de réinventer le produit.

---

# 02 — CREATIVE DIRECTION

## 02.1 — Concept central

L’expérience repose sur une idée :

**Une bibliothèque bleue dans laquelle chaque chapitre révèle une partie de l’histoire, avant de s’ouvrir sur un espace personnel qui accompagne la suite de la vie de Princia.**

Le concept associe trois expressions visuelles complémentaires.

### A. Blue Library — l’expérience principale

Une bibliothèque littéraire contemporaine, intime, lumineuse et immersive.

Elle évoque :

- les romans ;
- les chapitres ;
- les pages ;
- les souvenirs ;
- les lettres ;
- la découverte ;
- le passage vers une nouvelle étape de vie.

Le bleu constitue la couleur identitaire principale.

La bibliothèque ne doit pas ressembler à une vieille bibliothèque sombre ou à une interface scolaire. Elle doit être interprétée de façon contemporaine, raffinée et chaleureuse.

### B. The 18th Case — l’expérience alternative

Un univers d’enquête élégant, inspiré des dossiers de détective, des archives, des indices et des révélations.

Il reprend les couleurs et les fondations typographiques de Blue Library, tout en introduisant des éléments graphiques spécifiques :

- fiches ;
- annotations ;
- numéros de dossier ;
- indices ;
- lignes de connexion ;
- fragments de texte ;
- tampons graphiques ;
- révélations visuelles.

Cette expérience reste une alternative facultative. Elle ne doit jamais être nécessaire pour accéder à la lettre d’anniversaire ou aux fonctionnalités quotidiennes.

### C. A Little Space of Her Own — l’espace quotidien

Un espace personnel calme, clair et organisé.

Il accueille notamment :

- la bibliothèque de lecture ;
- les priorités universitaires ;
- les tâches et les échéances ;
- les petites victoires ;
- les découvertes ;
- les ressources facultatives ;
- les contenus personnels.

Son apparence doit être plus fonctionnelle que celle de Blue Library.

Il conserve néanmoins les mêmes couleurs, la même typographie, les mêmes composants fondamentaux et la même qualité de finition.

## 02.2 — Signature émotionnelle

La direction artistique doit produire une progression émotionnelle :

```text
CURIOSITÉ
    ↓
DÉCOUVERTE
    ↓
COMPLICITÉ
    ↓
ÉMOTION
    ↓
CÉLÉBRATION
    ↓
OUVERTURE
    ↓
SÉRÉNITÉ
```

Cette progression ne doit pas dépendre exclusivement des animations.

Elle doit être portée par le contenu, la hiérarchie, les images, les couleurs et le rythme de l’expérience.

## 02.3 — Principes non négociables

1. Le bleu est la couleur identitaire dominante.
2. La lisibilité prévaut sur les effets.
3. Le contenu personnel reste au centre.
4. Le mouvement accompagne une intention.
5. Les écrans quotidiens privilégient l’efficacité.
6. L’expérience fonctionne sans 3D.
7. Les animations peuvent être réduites ou désactivées.
8. Les interactions essentielles restent accessibles au clavier et au toucher.
9. Le mobile constitue le format de conception prioritaire.
10. Les trois univers appartiennent à un seul système visuel.

---

# 03 — IDENTITÉ VISUELLE

## 03.1 — Mots-clés artistiques

L’identité doit s’appuyer sur les notions suivantes :

- bleu céleste ;
- lumière douce ;
- papier ;
- encre ;
- pages ;
- profondeur ;
- élégance éditoriale ;
- intimité ;
- découverte ;
- détails raffinés ;
- mouvement fluide ;
- calme ;
- chaleur humaine.

## 03.2 — Ce que l’identité doit éviter

Ne pas transformer le projet en :

- dashboard SaaS générique ;
- interface entièrement sombre ;
- site de mariage ;
- carte romantique ;
- interface enfantine ;
- escape game agressif ;
- interface surchargée de verre dépoli ;
- galerie de gradients sans structure ;
- démonstration technique d’animations ;
- copie visuelle d’un template existant.

Les symboles romantiques explicites, les cœurs omniprésents et les codes visuels pouvant suggérer une relation amoureuse ne doivent pas constituer le langage principal de l’application.

L’identité doit évoquer l’affection, la complicité, l’amitié et la célébration sans ambiguïté romantique.

---

# 04 — SYSTÈME DE COULEURS

Les couleurs sont organisées par fonction. Les noms des tokens doivent exprimer leur rôle et non simplement leur teinte.

Les valeurs ci-dessous constituent la palette de référence initiale. Elles doivent être centralisées dans le système de tokens et contrôlées pour leur contraste réel avant livraison.

## 04.1 — Palette principale

| Token | Valeur | Usage |
|---|---|---|
| `--color-background` | `#F7FAFF` | Fond général clair |
| `--color-surface` | `#FFFFFF` | Cartes, panneaux et surfaces principales |
| `--color-surface-soft` | `#EDF4FF` | Surfaces légèrement teintées |
| `--color-surface-blue` | `#DCEBFF` | Sections de mise en valeur |
| `--color-primary` | `#3978D4` | Actions principales et éléments actifs |
| `--color-primary-hover` | `#2D65B8` | Survol de l’action principale |
| `--color-primary-active` | `#24559F` | État actif |
| `--color-primary-strong` | `#174A91` | Liens et éléments nécessitant un contraste plus fort |
| `--color-blue-deep` | `#15345B` | Titres, détails éditoriaux et profondeur |
| `--color-accent` | `#8EC5FF` | Accentuation décorative mesurée |
| `--color-accent-soft` | `#D8E9FF` | Mise en évidence douce |

## 04.2 — Couleurs neutres

| Token | Valeur | Usage |
|---|---|---|
| `--color-text` | `#17263D` | Texte principal |
| `--color-text-secondary` | `#52627A` | Texte secondaire |
| `--color-text-muted` | `#687991` | Métadonnées suffisamment lisibles |
| `--color-border` | `#DCE5F0` | Bordures standard |
| `--color-border-strong` | `#B8C9DF` | Séparateurs et contours plus visibles |
| `--color-overlay` | `rgba(15, 35, 65, 0.48)` | Superposition sur un écran |

Les textes importants ne doivent pas utiliser un bleu très clair sur un fond blanc.

La couleur `--color-accent` sert principalement aux surfaces, aux illustrations, aux reflets et aux détails décoratifs. Elle ne doit pas être utilisée automatiquement pour les textes de petite taille.

## 04.3 — Couleurs sémantiques

| Token | Valeur indicative | Fonction |
|---|---|---|
| `--color-success` | `#247A55` | Action accomplie, tâche terminée |
| `--color-warning` | `#946000` | Échéance proche ou attention |
| `--color-error` | `#B42335` | Erreur nécessitant une action |
| `--color-info` | `#245FA8` | Information contextuelle |

Chaque état doit également disposer d’un libellé ou d’un symbole explicite lorsque nécessaire.

La couleur ne doit jamais être le seul indicateur d’une erreur, d’une échéance ou d’une validation.

## 04.4 — Répartition indicative

Pour les écrans fonctionnels, la composition doit rester majoritairement claire.

Répartition de départ indicative :

- 65 à 75 % de surfaces blanches ou presque blanches ;
- 15 à 25 % de surfaces bleutées et de variations de fond ;
- 5 à 10 % de bleu primaire, de détails et d’accents.

Il ne s’agit pas d’une contrainte mathématique par écran. C’est un garde-fou pour éviter une interface saturée de bleu.

Les écrans narratifs peuvent employer une composition différente si elle améliore l’atmosphère.

## 04.5 — Dégradés

Les dégradés sont autorisés lorsqu’ils renforcent la lumière, la profondeur ou l’identité.

Exemple de dégradé d’ambiance :

```css
background:
  radial-gradient(
    circle at 18% 12%,
    rgba(216, 233, 255, 0.72),
    transparent 42%
  ),
  linear-gradient(
    145deg,
    #F7FAFF 0%,
    #EDF4FF 58%,
    #FFFFFF 100%
  );
```

Règles :

- un dégradé doit avoir une fonction identifiable ;
- il ne doit pas réduire le contraste du texte ;
- il ne doit pas être appliqué à chaque composant ;
- il ne doit pas remplacer une bonne hiérarchie visuelle ;
- les dégradés animés ne doivent pas tourner en boucle sans raison.

## 04.6 — Fonds narratifs

Blue Library peut utiliser des fonds légèrement plus profonds, par exemple un bleu nuit doux, pour encadrer un moment de révélation.

Cette variation ne doit pas transformer toute l’application en interface sombre.

The 18th Case peut utiliser un fond bleu-gris ou des surfaces de type papier pour évoquer les dossiers et les archives.

L’espace quotidien reste principalement clair.

## 04.7 — Validation des contrastes

Avant livraison, l’agent doit vérifier les combinaisons réellement utilisées.

Objectifs de référence :

- texte courant : contraste d’au moins 4,5:1 ;
- texte large : contraste d’au moins 3:1 ;
- composants graphiques essentiels et indicateurs d’état : contraste d’au moins 3:1 lorsque les critères applicables l’exigent.

Une couleur de palette n’est pas automatiquement conforme dans toutes ses utilisations.

Si une combinaison échoue, l’agent doit corriger la combinaison ou proposer une variante accessible, sans supprimer l’identité bleue.

---

# 05 — TYPOGRAPHIE

## 05.1 — Intention typographique

La typographie doit rappeler l’univers éditorial des livres tout en conservant la lisibilité d’une application moderne.

Le système associe deux familles principales :

1. Une serif éditoriale pour les titres narratifs et les moments émotionnels.
2. Une sans-serif pour les interfaces, les informations fonctionnelles et la lecture courante.

Une troisième famille monospace n’est autorisée que pour certains détails de The 18th Case.

## 05.2 — Familles de référence

### Titres éditoriaux : `DM Serif Display`

Utilisation :

- titre principal de Blue Library ;
- titres de chapitres ;
- titre de la lettre ;
- grandes phrases narratives ;
- titre principal de The 18th Case, avec modération.

### Interface et texte courant : `Inter`

Utilisation :

- navigation ;
- boutons ;
- formulaires ;
- cartes ;
- descriptions ;
- tâches ;
- échéances ;
- métadonnées ;
- contenus fonctionnels.

### Détails d’enquête : `IBM Plex Mono`

Utilisation limitée :

- numéros de dossier ;
- identifiants d’indices ;
- étiquettes techniques ;
- petites annotations de The 18th Case.

La police monospace ne doit pas devenir une police de lecture courante.

## 05.3 — Gestion des polices

L’agent doit vérifier les polices et les mécanismes de chargement disponibles dans le projet.

Privilégier :

- des fichiers de police locaux lorsqu’ils sont disponibles et correctement licenciés ;
- des variantes limitées aux graisses réellement utilisées ;
- des polices système de secours ;
- un chargement qui ne bloque pas le contenu principal.

Ne pas multiplier les familles ou télécharger de nouvelles ressources sans nécessité.

Si les polices de référence ne peuvent pas être intégrées proprement, l’agent doit proposer une substitution cohérente et documenter ce choix.

## 05.4 — Échelle typographique

Échelle de départ :

| Token | Taille indicative | Usage |
|---|---:|---|
| `--text-display` | `clamp(2.8rem, 7vw, 5.5rem)` | Grande introduction narrative |
| `--text-h1` | `clamp(2.25rem, 5vw, 4rem)` | Titre principal d’écran |
| `--text-h2` | `clamp(1.8rem, 3.5vw, 2.8rem)` | Titre de section |
| `--text-h3` | `1.4rem` à `1.75rem` | Sous-section |
| `--text-h4` | `1.125rem` à `1.375rem` | Carte ou sous-titre |
| `--text-body-lg` | `1.125rem` | Texte narratif important |
| `--text-body` | `1rem` | Texte courant |
| `--text-body-sm` | `0.875rem` | Informations secondaires |
| `--text-caption` | `0.8125rem` | Métadonnées |
| `--text-label` | `0.875rem` | Labels de formulaire et de composants |

Ces tailles sont des références, pas des valeurs à appliquer aveuglément. L’agent doit vérifier le rendu sur de vrais écrans.

## 05.5 — Hauteur de ligne

Valeurs indicatives :

- grands titres : 1,05 à 1,15 ;
- titres de section : 1,15 à 1,3 ;
- texte courant : 1,5 à 1,75 ;
- petites métadonnées : 1,35 à 1,5.

Les paragraphes de la lettre doivent bénéficier d’une largeur et d’une hauteur de ligne adaptées à une lecture confortable.

## 05.6 — Largeur des lignes

Pour les contenus narratifs, viser une largeur de lecture d’environ 55 à 75 caractères par ligne sur desktop.

Sur mobile, utiliser la largeur disponible sans coller le texte aux bords de l’écran.

Les titres peuvent être plus larges ou plus étroits selon la composition, mais ne doivent pas provoquer de débordement horizontal.

## 05.7 — Règles éditoriales

- Les grandes phrases sont réservées aux moments importants.
- Les titres doivent être courts et expressifs.
- Les textes fonctionnels restent directs.
- Les capitales intégrales sont réservées aux petites étiquettes.
- Les paragraphes ne doivent pas être transformés en animations caractère par caractère par défaut.
- Le texte doit rester du véritable texte HTML, sélectionnable et lisible par les technologies d’assistance.

---

# 06 — DESIGN TOKENS ET SYSTÈME D’ESPACEMENT

## 06.1 — Principes

Toutes les décisions récurrentes doivent être centralisées dans le système de tokens.

Les composants ne doivent pas inventer leurs propres couleurs, rayons, ombres et espacements sans justification.

## 06.2 — Échelle d’espacement

Échelle recommandée :

| Token | Valeur |
|---|---:|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |
| `--space-20` | `80px` |
| `--space-24` | `96px` |

Les espaces les plus grands sont destinés aux respirations entre sections et aux moments narratifs, et non à toutes les cartes.

## 06.3 — Rayons

| Token | Valeur indicative | Usage |
|---|---:|---|
| `--radius-sm` | `8px` | Petits éléments |
| `--radius-md` | `12px` | Champs et boutons |
| `--radius-lg` | `18px` | Cartes standard |
| `--radius-xl` | `24px` | Grandes surfaces |
| `--radius-2xl` | `32px` | Composition éditoriale particulière |
| `--radius-full` | `999px` | Pills et éléments circulaires |

La bibliothèque doit conserver une personnalité éditoriale. Les angles arrondis ne doivent pas devenir excessifs ou uniformes sur tous les éléments.

## 06.4 — Ombres

Prévoir trois niveaux au maximum :

- `--shadow-soft` : séparation discrète des surfaces ;
- `--shadow-card` : profondeur d’une carte surélevée ;
- `--shadow-overlay` : séparation d’un panneau temporaire.

Les ombres doivent rester douces, légèrement teintées de bleu lorsque cela convient.

Ne pas appliquer simultanément ombre importante, bordure forte, glow et flou à un même composant.

## 06.5 — Largeurs de contenu

Références de départ :

- lecture longue : `max-width: 720px` ;
- contenu éditorial : `max-width: 960px` ;
- espace quotidien : `max-width: 1200px` ;
- contenu large ou composition de bibliothèque : jusqu’à `max-width: 1360px`.

Les valeurs peuvent varier selon l’écran et le parcours.

Le contenu ne doit jamais s’étendre sur toute la largeur d’un écran très large si cela nuit à la lisibilité.

## 06.6 — Conteneur global

Le conteneur doit gérer :

- une largeur maximale ;
- des marges horizontales responsives ;
- des espaces cohérents ;
- les zones de sécurité des écrans mobiles ;
- la prévention des débordements.

Les paddings doivent être définis à l’aide de tokens ou de règles responsives centralisées.

## 06.7 — Bordures

Les bordures doivent être discrètes.

Utiliser principalement :

- des bordures neutres pour les cartes ;
- des bordures renforcées pour le focus et les états actifs ;
- des séparateurs pour structurer les listes ;
- des bordures spécifiques pour les fiches d’enquête.

Ne pas entourer chaque groupe de texte d’une carte.

L’espace et la typographie doivent assurer une partie importante de la hiérarchie.

---

# 07 — SYSTÈME DE MISE EN PAGE RESPONSIVE

## 07.1 — Mobile First

Le développement visuel doit commencer par les petits écrans.

L’agent ne doit pas concevoir une interface desktop puis tenter de la compresser sur mobile.

La progression recommandée est :

```text
MOBILE
  ↓
GRAND MOBILE
  ↓
TABLETTE
  ↓
DESKTOP
  ↓
GRAND DESKTOP
```

## 07.2 — Breakpoints indicatifs

| Contexte | Largeur indicative | Adaptation |
|---|---:|---|
| Petit mobile | jusqu’à `359px` | Mise en page compacte |
| Mobile | `360–599px` | Parcours principal |
| Tablette | `600–899px` | Colonnes limitées |
| Desktop | `900–1199px` | Navigation et grilles étendues |
| Grand desktop | `1200px` et plus | Contenu plafonné |

Les breakpoints définitifs doivent être cohérents avec le projet existant et les composants réellement utilisés.

Il ne faut pas ajouter un breakpoint simplement pour corriger un composant mal conçu.

## 07.3 — Mobile

Sur mobile :

- les contenus essentiels restent immédiatement identifiables ;
- les cartes s’empilent lorsque nécessaire ;
- les commandes restent accessibles au pouce ;
- les titres se redimensionnent sans être coupés ;
- les boutons principaux peuvent occuper toute la largeur disponible ;
- les animations sont simplifiées lorsqu’elles deviennent coûteuses ou encombrantes ;
- les interactions au survol sont remplacées par des interactions tactiles explicites ;
- les contenus ne dépendent pas d’un curseur personnalisé ;
- les zones interactives doivent viser au moins 44 × 44 CSS pixels lorsque possible.

Le scroll doit rester naturel. Le site ne doit pas enfermer inutilement l’utilisateur dans des sections plein écran.

## 07.4 — Desktop

Sur desktop :

- les compositions éditoriales peuvent devenir asymétriques ;
- les livres peuvent être présentés en rangées ou en étagères ;
- les fiches d’enquête peuvent utiliser une disposition en deux colonnes ;
- les panneaux fonctionnels peuvent exploiter davantage l’espace ;
- les animations au survol peuvent enrichir les composants interactifs.

L’interface doit conserver une largeur de lecture maîtrisée.

## 07.5 — Tablette

La tablette doit être traitée comme un contexte réel, et non comme un desktop réduit.

Les grilles doivent passer progressivement de trois ou quatre colonnes à deux colonnes, puis à une colonne.

Les interactions doivent fonctionner aussi bien au toucher qu’au clavier.

## 07.6 — Orientation et hauteur

L’interface ne doit pas supposer une hauteur d’écran fixe.

Les écrans d’introduction peuvent être visuellement immersifs, mais doivent rester utilisables lorsque :

- le clavier virtuel est ouvert ;
- l’écran est en mode paysage ;
- la hauteur disponible est faible ;
- le navigateur affiche ses barres d’interface.

Éviter de bloquer les contenus importants dans une zone fixe de `100vh` sans solution de défilement.

---

# 08 — ARCHITECTURE VISUELLE DES TROIS UNIVERS

## 08.1 — Blue Library

Blue Library est l’univers principal et la première expérience visible.

### Atmosphère

- claire ;
- littéraire ;
- lumineuse ;
- calme ;
- personnelle ;
- légèrement magique ;
- contemporaine.

### Éléments graphiques

- livres ;
- pages ;
- signets ;
- lignes éditoriales ;
- chapitres numérotés ;
- annotations ;
- petits détails lumineux ;
- compositions de papier ;
- éléments évoquant une bibliothèque.

Les livres peuvent être stylisés, mais leur représentation doit rester élégante et immédiatement compréhensible.

### Profondeur

La profondeur peut être construite avec :

- plusieurs plans de contenu ;
- des ombres douces ;
- des différences d’échelle ;
- une légère perspective ;
- des illustrations en couches ;
- un mouvement de caméra simulé ou une scène 3D légère si cela apporte une valeur réelle.

Une véritable scène 3D n’est pas obligatoire.

### Règle de composition

Le titre, l’action principale et le contenu narratif doivent rester dominants.

Les décorations ne doivent jamais concurrencer les mots ou les souvenirs.

## 08.2 — The 18th Case

The 18th Case constitue une expérience visuellement distincte, mais rattachée à la même identité.

### Atmosphère

- intrigante ;
- élégante ;
- ludique ;
- précise ;
- narrative ;
- accessible.

### Éléments graphiques

- cartes de dossier ;
- numéros d’indices ;
- fiches ;
- notes ;
- lignes de liaison ;
- marqueurs de progression ;
- enveloppes ;
- fragments de texte ;
- révélations.

Les éléments doivent évoquer une enquête légère, pas une affaire criminelle réaliste ou anxiogène.

### Palette

Conserver :

- le fond clair ;
- les bleus identitaires ;
- les textes bleu profond ;
- les neutres de la bibliothèque.

Introduire au besoin des fonds de type papier et des accents contrastés, mais ne pas créer une nouvelle palette indépendante.

### Progression visuelle

Chaque indice doit posséder des états distincts :

1. disponible ;
2. consulté ;
3. résolu, si l’interaction le prévoit ;
4. révélation affichée.

La progression visuelle doit correspondre à l’état fonctionnel réel.

Aucune animation ne doit marquer un indice comme résolu si la logique applicative ne l’a pas confirmé.

### Lisibilité

Le texte des indices doit rester lisible sans zoom ni manipulation complexe.

L’interface ne doit pas exiger une observation précise d’un détail visuel pour accéder à un contenu essentiel, sauf si le document 01 définit explicitement cette observation comme une interaction, auquel cas une alternative accessible doit être prévue.

## 08.3 — Espace quotidien

L’espace quotidien est une application personnelle avant d’être une expérience narrative.

### Atmosphère

- claire ;
- organisée ;
- rassurante ;
- simple ;
- personnelle ;
- durable.

### Règles

- moins d’effets décoratifs que dans Blue Library ;
- titres plus fonctionnels ;
- informations hiérarchisées ;
- actions identifiables ;
- listes faciles à parcourir ;
- états vides accueillants ;
- feedback visible ;
- navigation constante.

La bibliothèque quotidienne peut conserver des détails littéraires. Le tableau de bord universitaire ne doit pas être décoré au point de compliquer la consultation rapide des tâches.

---

# 09 — SYSTÈME DE COMPOSANTS VISUELS

Les composants doivent être réutilisables et cohérents.

L’agent doit vérifier l’existence des composants avant d’en créer de nouveaux.

## 09.1 — Boutons

Variantes :

- `PrimaryButton` ;
- `SecondaryButton` ;
- `TextButton` ;
- `IconButton` ;
- `DestructiveButton`, uniquement lorsqu’une action destructive existe réellement.

Chaque bouton doit prévoir :

- état normal ;
- survol ;
- focus ;
- état actif ;
- état désactivé ;
- état de chargement, lorsque nécessaire.

Les états doivent être visuellement distincts.

Un bouton désactivé ne doit pas être le seul moyen de communiquer une erreur ou une condition manquante.

Les actions principales de chaque écran doivent être immédiatement reconnaissables.

## 09.2 — Cartes

Composants possibles :

- `ChapterCard` ;
- `BookCard` ;
- `MemoryCard` ;
- `DiscoveryCard` ;
- `VictoryCard` ;
- `TaskCard` ;
- `CaseFileCard`.

Ces composants peuvent partager les mêmes fondations, tout en disposant de variantes adaptées à leur rôle.

Une carte interactive doit avoir un indicateur clair de son caractère cliquable.

Ne pas rendre toute la carte interactive si elle contient plusieurs actions indépendantes qui risquent d’entrer en conflit.

## 09.3 — Navigation

La navigation doit rester reconnaissable dans l’ensemble de l’espace quotidien.

Elle peut changer de disposition entre mobile et desktop, mais ses libellés et ses comportements doivent rester cohérents.

La navigation de l’expérience anniversaire peut être plus discrète et contextuelle.

Elle doit toutefois offrir un moyen clair de revenir, de fermer une vue ou de rejoindre une autre partie du parcours lorsque le document 01 le prévoit.

## 09.4 — Dialogues et panneaux

Les modales et panneaux temporaires doivent :

- se distinguer clairement du fond ;
- conserver un titre ou un contexte ;
- proposer une fermeture identifiable ;
- gérer le focus ;
- être utilisables au clavier ;
- s’adapter à la hauteur mobile ;
- ne pas masquer durablement un contenu essentiel.

Une animation d’ouverture ne doit pas empêcher la fermeture immédiate.

## 09.5 — Champs et formulaires

Les champs doivent comporter :

- un label explicite ;
- un état normal ;
- un état de focus ;
- un état d’erreur ;
- un message de validation lorsque nécessaire ;
- un indicateur de champ obligatoire lorsque pertinent.

Les placeholders ne remplacent pas les labels.

## 09.6 — États de progression

Les indicateurs de progression peuvent prendre la forme de :

- chapitres ;
- étapes ;
- compteur ;
- barre discrète ;
- marqueurs d’indices.

Ils doivent refléter la progression réelle du parcours.

La progression ne doit pas créer de pression inutile. Les éléments facultatifs ne doivent pas être présentés comme des étapes obligatoires.

## 09.7 — Icônes

Utiliser une seule famille d’icônes cohérente.

Les icônes doivent être simples, lisibles et cohérentes en taille et en épaisseur.

Les icônes décoratives ne doivent pas être confondues avec des commandes.

Toute icône seule doit avoir un nom accessible lorsqu’elle représente une action.

## 09.8 — États vides

Les états vides font partie du design.

Exemples :

- aucune tâche ajoutée ;
- bibliothèque encore vide ;
- aucune petite victoire enregistrée ;
- aucune découverte consultée ;
- aucun indice encore ouvert.

Ils doivent expliquer ce que représente l’espace et, lorsque cela est utile, proposer une action simple.

Ne pas inventer de données personnelles pour remplir artificiellement l’interface.

## 09.9 — Feedback

Toute action significative doit produire un feedback adapté :

- ajout ;
- modification ;
- suppression ;
- validation ;
- sauvegarde ;
- changement d’état ;
- erreur ;
- action en cours.

Le feedback peut être visuel, textuel ou sonore si un son est explicitement contrôlé par l’utilisateur.

Aucun son ne doit être lancé automatiquement pour créer un effet émotionnel.

---

# 10 — TRAITEMENT DES IMAGES ET DU CONTENU PERSONNEL

## 10.1 — Principe

Les images et les souvenirs réels constituent une partie importante de la personnalisation.

Le système doit être prêt à accueillir les photos et les textes que l’utilisateur fournira.

L’agent ne doit pas inventer de souvenirs, de photographies, de dates ou d’anecdotes personnelles.

## 10.2 — Style des images

Les photographies doivent rester naturelles.

Les traitements autorisés peuvent inclure :

- recadrage ;
- ajustement de luminosité ;
- bordure discrète ;
- masque doux ;
- ombre légère ;
- reveal à l’ouverture ;
- composition éditoriale.

Les filtres lourds, les effets de distorsion et les modifications qui altèrent l’apparence des personnes sont à éviter.

## 10.3 — Cadres et ratios

Définir des ratios selon le contenu :

- portrait pour une photographie individuelle ;
- paysage pour une scène ou un souvenir collectif ;
- carré pour une petite vignette ;
- ratio libre pour un document ou une composition narrative particulière.

Le ratio ne doit pas couper systématiquement les visages.

## 10.4 — Images absentes

Si une photo n’est pas encore fournie :

- utiliser un emplacement réservé cohérent ;
- conserver les dimensions attendues ;
- ne pas afficher une fausse photographie personnelle ;
- ne pas casser la composition ;
- ne pas laisser apparaître une image brisée.

## 10.5 — Chargement

Les images doivent être optimisées et chargées selon leur priorité.

Le premier écran ne doit pas attendre le chargement de toutes les photographies du parcours.

Les médias décoratifs peuvent être chargés progressivement.

---

# 11 — MOTION DESIGN : PHILOSOPHIE GÉNÉRALE

## 11.1 — Le mouvement fait partie de l’expérience

Chaque animation doit servir au moins une fonction :

- orientation ;
- continuité ;
- feedback ;
- révélation ;
- hiérarchie ;
- narration ;
- profondeur ;
- découverte.

Une animation sans fonction claire doit être supprimée ou simplifiée.

## 11.2 — Hiérarchie du mouvement

Le système distingue six niveaux :

```text
MICRO MOTION
    ↓
COMPONENT MOTION
    ↓
SECTION MOTION
    ↓
PAGE MOTION
    ↓
SCENE MOTION
    ↓
EXPERIENCE MOTION
```

Les animations de grande ampleur sont rares et réservées aux moments narratifs importants.

Les interactions fonctionnelles doivent utiliser des mouvements courts.

## 11.3 — Hiérarchie de l’attention

À chaque instant :

1. le contenu principal attire l’attention ;
2. l’action ou l’interaction disponible vient ensuite ;
3. l’ambiance visuelle reste secondaire.

Une animation de fond ne doit pas détourner continuellement l’attention d’un texte.

## 11.4 — Mouvement narratif

Les animations doivent traduire une intention.

Exemples :

- un livre s’ouvre pour introduire un chapitre ;
- une page se révèle pour afficher un souvenir ;
- un dossier se déploie pour révéler un indice ;
- une transition douce accompagne le passage vers l’espace quotidien ;
- une coche apparaît pour confirmer une tâche terminée.

Ces exemples décrivent des intentions visuelles. Ils ne constituent pas une autorisation de modifier les parcours du document 01.

## 11.5 — Mouvement interruptible

L’utilisateur doit pouvoir poursuivre son action sans attendre inutilement une séquence décorative.

L’agent doit éviter les transitions qui bloquent la navigation, le retour ou la fermeture d’un panneau.

Lorsqu’une animation est interrompue, l’interface doit rester dans un état cohérent.

## 11.6 — Pas de mouvement permanent obligatoire

Les animations ambiantes doivent rester discrètes.

Les effets permanents, parallax continu et rotations automatiques ne doivent pas être indispensables à l’expérience.

Une interface statique doit conserver sa valeur narrative et fonctionnelle.

---

# 12 — TOKENS DE MOTION

Les valeurs ci-dessous sont des valeurs de départ. Elles doivent être centralisées et ajustées après vérification sur les appareils cibles.

## 12.1 — Durées

| Token | Valeur indicative | Usage |
|---|---:|---|
| `--motion-instant` | `100ms` | Feedback très bref |
| `--motion-fast` | `160ms` | Hover et micro-interaction |
| `--motion-standard` | `240ms` | Transition d’un composant |
| `--motion-emphasis` | `360ms` | Révélation d’une carte |
| `--motion-narrative` | `520ms` | Transition narrative |
| `--motion-scene` | `700ms` | Transition de scène particulière |

Les durées supérieures doivent être justifiées.

Une animation ne doit pas retarder une action essentielle uniquement pour conserver un effet esthétique.

## 12.2 — Courbes d’accélération

Définir des courbes réutilisables :

```css
:root {
  --ease-standard: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-balanced: cubic-bezier(0.65, 0, 0.35, 1);
}
```

Ces courbes doivent être utilisées selon l’intention du mouvement.

## 12.3 — Transformations privilégiées

Privilégier, lorsque possible :

- `transform` ;
- `opacity`.

Ces propriétés permettent généralement de réaliser des animations simples avec moins de travail de mise en page.

Les animations de propriétés coûteuses doivent être évaluées et limitées.

Les effets utilisant blur, clip-path ou filtres ne doivent pas être employés partout.

## 12.4 — Stagger

Le stagger peut être utilisé pour :

- les chapitres ;
- les livres ;
- les cartes ;
- les éléments d’un dossier ;
- les paragraphes d’une introduction courte.

Règles :

- les groupes apparaissent dans un ordre compréhensible ;
- le décalage entre éléments reste discret ;
- le contenu principal ne doit pas attendre inutilement la fin du groupe ;
- le stagger est réduit sur mobile si nécessaire ;
- le contenu reste accessible si l’animation est désactivée.

---

# 13 — CATALOGUE D’ANIMATIONS PAR UNIVERS

## 13.1 — Entrée dans Blue Library

**Intention :** créer un sentiment de découverte.

Séquence indicative :

1. le fond apparaît ;
2. le titre et l’introduction deviennent visibles ;
3. la composition de bibliothèque se révèle ;
4. l’action principale devient clairement identifiable.

Le contenu essentiel doit rester disponible rapidement.

L’agent ne doit pas imposer un écran de chargement artificiel avant chaque entrée.

## 13.2 — Ouverture d’un chapitre

**Intention :** matérialiser le passage vers une nouvelle partie de l’histoire.

Le livre ou la carte sélectionnée peut :

- gagner légèrement en importance ;
- se déplacer vers une position de lecture ;
- révéler le contenu associé.

Le mouvement doit être fluide et lisible.

Si une animation partagée entre carte et contenu est trop coûteuse ou fragile, une transition plus simple est acceptable.

## 13.3 — Révélation d’un souvenir

**Intention :** donner au contenu un rythme de lecture.

Le souvenir peut apparaître par un léger reveal de contenu, suivi de la photographie lorsqu’elle existe.

Éviter de masquer le texte pendant une longue séquence.

Les photographies ne doivent pas être déformées par un effet de transition.

## 13.4 — The 18th Case

**Intention :** transformer une interaction de découverte en petite révélation.

Un indice peut se déployer, un document s’ouvrir ou un élément visuel changer d’état.

Le feedback doit confirmer clairement l’action.

Les indices facultatifs doivent rester identifiés comme tels.

Aucune animation ne doit faire croire qu’une énigme est obligatoire si elle ne l’est pas.

## 13.5 — Lettre d’anniversaire

**Intention :** ralentir le rythme et favoriser la lecture.

La lettre doit privilégier :

- un cadre visuel calme ;
- une largeur de lecture maîtrisée ;
- une typographie éditoriale ;
- des espacements généreux ;
- une transition douce vers le contenu.

Éviter :

- les textes qui s’écrivent trop lentement ;
- les effets qui empêchent de sélectionner le texte ;
- les animations permanentes derrière les paragraphes ;
- les effets de particules qui détournent l’attention.

L’émotion doit venir principalement du contenu réel de la lettre.

## 13.6 — Transition vers l’espace quotidien

**Intention :** marquer un changement de contexte.

Le passage doit relier l’univers narratif à l’espace personnel sans créer l’impression d’une rupture entre deux applications indépendantes.

La transition peut réutiliser un élément visuel commun, comme une page, un livre ou un motif bleu.

La navigation et les états fonctionnels doivent néanmoins rester explicites.

L’utilisateur ne doit pas avoir l’impression d’avoir perdu son parcours ou ses repères.

## 13.7 — Espace quotidien

Les animations sont principalement fonctionnelles :

- une carte apparaît après une création ;
- une tâche change d’état ;
- une entrée de bibliothèque est ajoutée ;
- un message confirme une sauvegarde ;
- un panneau s’ouvre ou se ferme.

Les interactions quotidiennes doivent être plus rapides que les transitions narratives.

---

# 14 — STRATÉGIE TECHNOLOGIQUE : QUI FAIT QUOI ?

Plusieurs outils ont déjà été envisagés ou exécutés dans le terminal du projet. Le système doit les utiliser avec discernement.

La présence d’une bibliothèque ne justifie pas son utilisation partout.

## 14.1 — CSS et animations natives

**Rôle : première option pour les mouvements simples.**

Utiliser CSS pour :

- hover ;
- focus ;
- changement de couleur ;
- transitions simples ;
- apparition légère ;
- états actifs ;
- petites transformations ;
- décorations statiques ou peu animées.

Avantages :

- simplicité ;
- bonne intégration au DOM ;
- maintenance facile ;
- faible dépendance à une bibliothèque externe.

Si CSS suffit, ne pas ajouter un moteur JavaScript.

## 14.2 — Motion

Référence : https://motion.dev/

Motion est destiné aux animations de composants React et aux transitions liées à l’état de l’interface.

Usages possibles :

- entrée et sortie de composants ;
- transition entre états ;
- présence conditionnelle ;
- animation de cartes ;
- animation de navigation ;
- gestes simples ;
- coordination de transitions entre composants.

L’agent doit vérifier le nom exact du package installé et son API dans le projet. Il ne doit pas confondre documentation actuelle, ancienne API ou exemple provenant d’une autre version.

Motion est privilégié lorsque le mouvement est directement lié au cycle de vie d’un composant React.

## 14.3 — Anime.js

Référence : https://animejs.com/

Anime.js peut servir aux séquences qui nécessitent une orchestration précise d’éléments DOM ou de propriétés animées.

Usages possibles :

- séquences narratives ;
- animation coordonnée de plusieurs éléments ;
- séquences typographiques ponctuelles ;
- effets visuels contrôlés ;
- orchestration d’une révélation complexe.

Anime.js ne doit pas devenir un second système général de transitions React si Motion couvre déjà le besoin.

L’agent doit choisir le moteur adapté à chaque responsabilité et éviter les animations concurrentes sur les mêmes éléments.

## 14.4 — React Bits

Référence : https://www.reactbits.dev/

React Bits constitue une source de composants et d’expérimentations visuelles React.

Il peut servir à identifier des idées pour :

- des éléments interactifs ;
- des traitements visuels ;
- des effets de profondeur ;
- des composants animés ;
- des motifs graphiques réutilisables.

Règles d’utilisation :

1. vérifier l’adéquation du composant avec l’identité de Princia ;
2. vérifier la licence et les conditions de réutilisation applicables ;
3. examiner ses dépendances ;
4. vérifier sa compatibilité avec la version de React et la configuration existantes ;
5. simplifier le composant si nécessaire ;
6. respecter l’accessibilité et le responsive ;
7. éviter de copier une démonstration complète sans adaptation.

Les composants React Bits ne doivent pas imposer une identité étrangère au projet.

Un effet qui ne correspond pas à Blue Library ou The 18th Case doit être écarté, même s’il est techniquement impressionnant.

## 14.5 — Impeccable

Référence : https://impeccable.style/

Impeccable peut être utilisé comme ressource de conception et d’amélioration de l’interface, selon les capacités réellement disponibles dans l’environnement.

Il doit aider à renforcer :

- la cohérence ;
- la hiérarchie ;
- la finition des composants ;
- l’alignement ;
- la qualité des états ;
- le respect du Design System.

Il ne doit pas servir à réinventer l’identité visuelle à chaque écran.

Toute proposition produite avec cet outil doit être confrontée aux tokens et aux règles du présent document.

## 14.6 — Remotion

Référence : https://www.remotion.dev/

Remotion est principalement destiné à la création de vidéos programmatiques avec React.

Il n’est pas le moteur d’animation par défaut de l’application web interactive.

Usages éventuels :

- création d’une courte vidéo de présentation ;
- export vidéo d’une composition narrative ;
- production d’un média de célébration ;
- génération d’un asset animé autonome.

Remotion ne doit être introduit dans le parcours utilisateur que si un besoin vidéo concret est validé.

Il ne doit pas être utilisé pour simuler des interactions qui seraient plus simplement réalisées dans le DOM.

Son ajout peut être reporté à une phase ultérieure.

## 14.7 — 3D et WebGL

La 3D n’est pas obligatoire dans la première version.

Si une scène 3D est réellement utile, l’agent doit d’abord vérifier les dépendances et la structure existantes avant d’introduire Three.js ou React Three Fiber.

Les responsabilités doivent rester séparées :

- interface et texte : DOM React ;
- objets 3D : scène dédiée ;
- interactions : contrôleurs explicites ;
- animations : système d’orchestration défini ;
- alternatives accessibles : contenu DOM équivalent.

Une scène 3D ne doit pas contenir exclusivement une information essentielle.

## 14.8 — Règle de sélection

Ordre de décision recommandé :

```text
Besoin visuel
    ↓
CSS suffit ?
    ├── Oui → CSS
    └── Non
         ↓
Animation d’un composant React ?
    ├── Oui → Motion, si adapté
    └── Non
         ↓
Orchestration complexe d’éléments ?
    ├── Oui → Évaluer Anime.js
    └── Non
         ↓
Besoin 3D réel ?
    ├── Oui → Évaluer une solution 3D dédiée
    └── Non → Simplifier
```

React Bits est une source de composants possibles, et non un moteur d’animation universel.

Impeccable est une ressource de conception.

Remotion est une solution de production vidéo.

Ces outils ne sont pas interchangeables.

## 14.9 — Un système d’orchestration cohérent

Le projet doit éviter la multiplication des moteurs pour des effets similaires.

Avant d’ajouter une dépendance, l’agent doit répondre à ces questions :

- Le besoin est-il réel ?
- Une solution existe-t-elle déjà ?
- L’outil est-il compatible avec l’environnement ?
- Le bénéfice justifie-t-il la complexité ?
- La solution est-elle accessible ?
- Peut-elle être désactivée ou simplifiée ?
- Quel sera son coût sur mobile ?

La simplicité technique reste préférable à une accumulation de bibliothèques.

---

# 15 — RÈGLES D’IMPLÉMENTATION DES ANIMATIONS

## 15.1 — Chaque animation doit être documentée

Pour toute animation non triviale, préciser :

- identifiant ;
- objectif ;
- élément concerné ;
- déclencheur ;
- état initial ;
- état final ;
- durée ;
- courbe d’accélération ;
- comportement mobile ;
- comportement avec réduction du mouvement ;
- possibilité d’interruption.

## 15.2 — Coordination avec les états React

Les animations doivent suivre les états réels de l’application.

Exemple conceptuel :

```text
CLOSED
  ↓ ouverture demandée
OPENING
  ↓ transition terminée
OPEN
  ↓ fermeture demandée
CLOSING
  ↓ transition terminée
CLOSED
```

Cette représentation ne signifie pas qu’il faut créer systématiquement quatre états React.

L’agent doit choisir la solution la plus simple qui garantit une transition cohérente.

## 15.3 — Éviter les conflits

Ne pas laisser plusieurs systèmes modifier simultanément la même propriété du même élément sans coordination explicite.

Les animations doivent avoir une responsabilité claire.

Éviter les boucles d’effets React qui relancent continuellement des animations.

Les animations déclenchées par le scroll doivent être robustes lorsque l’utilisateur fait défiler rapidement ou revient en arrière.

## 15.4 — Nettoyage

Toute animation JavaScript qui crée des abonnements, des observateurs ou des timelines doit être correctement nettoyée lorsque le composant est démonté ou que l’animation n’est plus nécessaire.

Les animations ne doivent pas continuer à consommer des ressources dans une page inactive.

## 15.5 — Scroll

Le scroll doit rester sous le contrôle de l’utilisateur.

Éviter :

- le verrouillage prolongé du défilement ;
- le scroll-jacking ;
- les sections épinglées trop longues ;
- les transitions qui empêchent de revenir en arrière ;
- les animations qui dépendent d’une vitesse de scroll très précise.

Les transitions au scroll sont facultatives et doivent pouvoir être remplacées par une présentation statique.

---

# 16 — ACCESSIBILITÉ VISUELLE ET MOTION

## 16.1 — Principe général

L’expérience doit rester utilisable lorsque les animations sont réduites ou absentes.

La réduction du mouvement ne doit pas supprimer un contenu, une interaction ou une information.

## 16.2 — Préférence système

L’implémentation doit respecter :

```css
@media (prefers-reduced-motion: reduce) {
  /* Réduire les mouvements non essentiels. */
}
```

Le comportement précis doit être défini de façon cohérente dans le système de motion.

Il ne suffit pas de raccourcir toutes les animations à une durée identique.

Les animations décoratives continues doivent être supprimées ou rendues statiques lorsque nécessaire.

Les transitions fonctionnelles peuvent être remplacées par des changements d’état immédiats ou très courts.

## 16.3 — Contrôle du mouvement

Si l’expérience propose des animations continues ou des effets particulièrement marqués, elle doit offrir un moyen compréhensible de les réduire ou de les désactiver lorsque cela est pertinent.

Ne pas ajouter un panneau de réglages complexe si une simple préférence suffit.

## 16.4 — Clavier et focus

Les interactions doivent être accessibles avec :

- Tab ;
- Shift + Tab ;
- Entrée ;
- Espace ;
- Échap lorsque pertinent.

Le focus doit être visible.

Une animation de focus ne doit jamais rendre son emplacement ambigu.

## 16.5 — Mouvement et lisibilité

Éviter :

- les clignotements rapides ;
- les rotations incessantes ;
- les mouvements de caméra agressifs ;
- les textes qui se déplacent pendant la lecture ;
- les effets de distorsion sur les contenus importants ;
- les changements visuels trop rapides.

## 16.6 — Contraste et information

Le contraste doit rester suffisant sur tous les fonds.

Les informations ne doivent pas dépendre uniquement :

- d’une couleur ;
- d’un effet lumineux ;
- d’un mouvement ;
- d’une animation ;
- d’une scène 3D ;
- d’une indication sonore.

## 16.7 — Taille et espacement du texte

Le texte doit pouvoir être agrandi sans casser les parcours.

Les cartes, boutons et formulaires doivent accepter les contenus plus longs et les retours à la ligne.

Ne pas imposer une hauteur fixe aux zones contenant du texte variable, sauf nécessité clairement justifiée.

---

# 17 — RESPONSIVE MOTION

## 17.1 — Mobile

Les animations doivent être plus sobres sur les petits écrans lorsque leur coût ou leur complexité augmente.

Privilégier :

- opacity ;
- petites translations ;
- reveals simples ;
- transitions courtes ;
- transformations limitées.

Éviter les scènes qui dépendent de la position du curseur.

Toute interaction visuelle doit disposer d’un équivalent tactile clair.

## 17.2 — Desktop

Les écrans larges peuvent accueillir :

- des transitions plus amples ;
- des interactions au survol ;
- des compositions asymétriques ;
- des couches de profondeur ;
- des animations de scène plus élaborées.

Ces possibilités ne sont pas obligatoires.

## 17.3 — Appareils moins puissants

L’expérience doit rester utilisable lorsque le rendu graphique est plus lent.

L’agent doit prévoir une version simplifiée des effets coûteux lorsque nécessaire.

La 3D et les effets complexes ne doivent pas bloquer l’accès au texte, aux boutons ou à la navigation.

## 17.4 — Pas de détection arbitraire

Ne pas supposer qu’un utilisateur mobile possède un appareil peu puissant ni qu’un ordinateur possède un GPU performant.

Les simplifications doivent reposer sur des critères techniques raisonnables, les préférences d’accessibilité ou les capacités réellement disponibles.

---

# 18 — ÉTATS VISUELS ET FEEDBACK

Le Design System doit couvrir les états suivants.

| État | Traitement attendu |
|---|---|
| Normal | Présentation standard |
| Hover | Réponse subtile, sur les appareils compatibles |
| Focus | Contour ou indicateur clairement visible |
| Active | Confirmation visuelle de l’activation |
| Disabled | Apparence non interactive clairement identifiable |
| Loading | Indication de progression lorsque nécessaire |
| Success | Confirmation lisible et non ambiguë |
| Error | Message explicite et indication visuelle |
| Empty | Explication et action éventuelle |
| Offline | État compréhensible et adapté aux capacités disponibles |

Les états ne doivent pas être uniquement décoratifs.

Ils doivent refléter le comportement réel du système.

Une animation de sauvegarde ne doit pas annoncer une sauvegarde réussie avant que l’application dispose d’une confirmation fiable.

---

# 19 — PWA ET CONTINUITÉ VISUELLE

## 19.1 — Identité de l’application

L’icône, le nom et les éléments de lancement doivent appartenir à la même identité visuelle.

Ils doivent rester reconnaissables dans le navigateur, sur l’écran d’accueil et dans l’interface installée.

Le détail de l’implémentation relève du document 03.

## 19.2 — Écran de lancement

Si un écran de lancement personnalisé est utilisé, il doit être léger et ne pas retarder l’accès au contenu.

Éviter les loaders artificiels qui attendent une durée fixe alors que l’application est prête.

## 19.3 — Hors ligne

Les états hors ligne doivent conserver le même langage visuel.

Si un contenu est disponible hors ligne, il doit rester présenté normalement.

Si une action nécessite le réseau, l’interface doit indiquer clairement la limitation.

Ne pas afficher une fausse confirmation de synchronisation.

## 19.4 — Installabilité

Les éléments d’installation doivent être présentés de façon discrète et contextuelle.

L’application ne doit pas interrompre l’expérience anniversaire avec une demande d’installation non sollicitée.

---

# 20 — PRIVACY ET SÉCURITÉ : CONSÉQUENCES VISUELLES

Ce document ne définit pas la sécurité technique, qui relève de l’architecture.

Il définit les règles d’affichage associées à la confidentialité.

- Les écrans privés ne doivent pas exposer inutilement des informations personnelles.
- Les contenus personnels ne doivent pas apparaître dans une notification visible sans que cela ait été explicitement prévu.
- Les messages d’erreur ne doivent pas révéler des détails techniques sensibles.
- Les dialogues de confirmation doivent être clairs.
- Les éléments de verrouillage ou de protection doivent être visuellement distincts des actions ordinaires.
- Les indicateurs de sauvegarde doivent refléter l’état réel.

Les informations personnelles ne doivent pas être affichées dans des animations décoratives, des éléments de fond ou des aperçus qui apparaissent sans action explicite.

---

# 21 — COHÉRENCE ENTRE LES ÉCRANS

L’agent doit construire un système commun plutôt qu’une collection de pages indépendantes.

Les éléments partagés doivent conserver :

- les mêmes couleurs fonctionnelles ;
- les mêmes styles typographiques ;
- les mêmes espacements ;
- les mêmes règles de focus ;
- les mêmes comportements de boutons ;
- les mêmes principes de feedback ;
- les mêmes règles de responsive ;
- la même logique de mouvement.

Les trois univers peuvent se différencier par leurs compositions, leurs éléments décoratifs et leur densité, mais pas par des comportements arbitraires.

## 21.1 — Éléments communs

- palette et tokens ;
- boutons ;
- icônes ;
- composants de formulaire ;
- navigation fonctionnelle ;
- états de feedback ;
- règles d’accessibilité ;
- conventions d’animation.

## 21.2 — Éléments spécifiques

Blue Library :

- livres ;
- chapitres ;
- pages ;
- compositions éditoriales.

The 18th Case :

- dossiers ;
- indices ;
- annotations ;
- progression d’enquête.

Espace quotidien :

- listes ;
- tâches ;
- bibliothèque personnelle ;
- priorités ;
- cartes fonctionnelles.

## 21.3 — Pas de divergence accidentelle

Si un composant partagé nécessite un nouveau style, l’agent doit déterminer s’il s’agit :

- d’une variante légitime ;
- d’une composition propre à un univers ;
- d’une exception temporaire ;
- d’un doublon à éviter.

Les exceptions récurrentes doivent être examinées avant de devenir une nouvelle règle.

---

# 22 — CONTENUS VARIABLES ET ROBUSTESSE VISUELLE

Le système doit être testé avec des contenus réels et des contenus incomplets.

Les cas suivants doivent être couverts :

- titre court ;
- titre long ;
- paragraphe court ;
- lettre longue ;
- photo absente ;
- photo portrait ;
- photo paysage ;
- absence de tâches ;
- nombreuses tâches ;
- aucune lecture enregistrée ;
- titre de livre très long ;
- message d’erreur ;
- chargement ;
- contenu disponible hors ligne.

Aucun écran ne doit dépendre d’un contenu parfaitement calibré pour rester utilisable.

Éviter les hauteurs fixes qui coupent les textes.

Les ellipses et troncatures ne doivent être utilisées que lorsque la perte d’information reste acceptable et qu’un accès au contenu complet existe.

---

# 23 — PRISE EN COMPTE DE L’ÉTAT DU PROJET EXISTANT

Cette section est obligatoire pour la reprise du travail par l’agent IA.

Plusieurs commandes ont déjà été exécutées dans le terminal du projet :

```bash
npx impeccable install
npm i animejs
npx create-video@latest
npx motion-ai
```

Ces commandes représentent l’historique de configuration fourni par le propriétaire du projet. Elles ne prouvent pas, à elles seules, que chaque outil a été installé avec succès, qu’il est configuré ou qu’il doit être utilisé.

L’agent doit vérifier l’état réel du dépôt avant de poursuivre.

## 23.1 — Inspection initiale obligatoire

Avant toute modification, l’agent doit :

1. identifier le dossier racine réel ;
2. examiner l’arborescence existante ;
3. lire `package.json` ;
4. examiner le fichier de verrouillage du gestionnaire de paquets présent ;
5. examiner la configuration Vite et TypeScript ;
6. vérifier les dépendances installées ;
7. examiner les scripts disponibles ;
8. identifier les fichiers et composants déjà implémentés ;
9. vérifier l’état Git et les modifications non validées ;
10. identifier les fichiers de configuration ou instructions déjà présents.

L’agent doit préserver les modifications existantes qui n’ont pas été validées ou sauvegardées.

## 23.2 — Vérification des outils

L’agent doit établir un état réel pour chaque outil :

| Outil | Vérification attendue |
|---|---|
| Impeccable | Installation, fichiers générés, configuration et usage possible |
| Anime.js | Présence dans les dépendances, version et API disponible |
| Motion | Présence réelle, package et version |
| React Bits | Composants déjà copiés ou intégrés, dépendances associées |
| Remotion | Présence de fichiers ou dépendances liés à la vidéo |
| `motion-ai` | Vérification de ce que la commande a réellement produit |
| React et Vite | Versions et configuration actuelles |

Ne pas supposer que l’exécution de `npx motion-ai` signifie que Motion est correctement installé.

Ne pas supposer que `npx create-video@latest` signifie qu’un projet Remotion est intégré à l’application.

Ne pas créer un second projet dans le projet existant sans décision explicite.

## 23.3 — Règles de modification

- Ne pas réinitialiser le dépôt.
- Ne pas recréer le projet Vite.
- Ne pas supprimer les dépendances existantes sans raison.
- Ne pas réinstaller une bibliothèque déjà présente et fonctionnelle.
- Ne pas remplacer le gestionnaire de paquets existant.
- Ne pas modifier les scripts sans nécessité.
- Ne pas ajouter une bibliothèque simplement parce qu’elle est citée dans ce document.
- Ne pas introduire Remotion dans l’application interactive sans besoin validé.
- Ne pas réorganiser toute l’architecture au cours d’une tâche limitée au Design System.

Si une dépendance est manquante, incompatible ou mal configurée, l’agent doit expliquer le problème et proposer une correction limitée.

## 23.4 — Préservation de l’environnement

Les modifications doivent s’intégrer à l’environnement existant.

L’agent doit consigner :

- les dépendances déjà disponibles ;
- les outils effectivement configurés ;
- les éventuels outils inutilisés ;
- les changements nécessaires ;
- les problèmes restant à résoudre.

Il ne doit jamais annoncer qu’un outil est prêt sans avoir vérifié sa disponibilité réelle.

---

# 24 — PÉRIMÈTRE VISUEL PAR ÉTAPE

La direction artistique décrit le produit complet, mais elle ne signifie pas que tous les éléments doivent être implémentés simultanément.

## 24.1 — Priorité : expérience anniversaire

La première version visuelle doit couvrir :

- identité principale ;
- entrée dans Blue Library ;
- présentation des chapitres ;
- ouverture et consultation des contenus ;
- accès facultatif à The 18th Case ;
- affichage de la lettre ;
- transition vers l’espace quotidien selon le parcours validé ;
- comportement responsive ;
- états de chargement et erreurs nécessaires ;
- réduction du mouvement ;
- cohérence des composants.

La priorité est de livrer une expérience anniversaire complète, utilisable et cohérente.

## 24.2 — Espace quotidien

L’espace quotidien doit reprendre le même système visuel.

Son implémentation fonctionnelle doit cependant suivre le périmètre et l’ordre définis dans la roadmap.

La conception de ses composants ne doit pas entraîner l’implémentation prématurée de toutes les fonctionnalités futures.

## 24.3 — Fonctionnalités futures

Les animations et composants destinés à des fonctionnalités futures peuvent être documentés, mais ne doivent pas être présentés comme terminés s’ils ne le sont pas.

Une fonction future ne doit pas apparaître dans l’interface comme si elle était pleinement disponible.

---

# 25 — CRITÈRES DE VALIDATION VISUELLE

Un écran ne peut pas être considéré comme terminé uniquement parce qu’il s’affiche correctement.

## 25.1 — Identité

- [ ] L’écran appartient clairement à l’identité de PRINCIA — Chapter 18.
- [ ] Le bleu conserve son rôle identitaire.
- [ ] La composition correspond à l’univers concerné.
- [ ] Les éléments décoratifs ne concurrencent pas le contenu.
- [ ] L’écran ne ressemble pas à un assemblage de composants génériques.

## 25.2 — Typographie

- [ ] La hiérarchie est immédiatement compréhensible.
- [ ] Les titres ne débordent pas.
- [ ] Les textes longs restent lisibles.
- [ ] Les polices sont correctement chargées ou disposent de solutions de secours.
- [ ] La taille du texte reste confortable sur mobile.

## 25.3 — Mise en page

- [ ] Les alignements sont cohérents.
- [ ] Les espacements respectent les tokens.
- [ ] Les cartes ont des proportions adaptées.
- [ ] Le contenu reste dans les limites de lecture définies.
- [ ] Aucun débordement horizontal non intentionnel n’apparaît.
- [ ] Les écrans étroits restent utilisables.

## 25.4 — Couleurs

- [ ] Les tokens sont utilisés de manière cohérente.
- [ ] Les combinaisons de texte et de fond sont lisibles.
- [ ] Les états d’erreur et de succès sont identifiables.
- [ ] La couleur ne constitue pas l’unique moyen de communiquer une information.

## 25.5 — Composants

- [ ] Les boutons disposent de leurs états.
- [ ] Les champs possèdent des labels.
- [ ] Les cartes interactives sont reconnaissables.
- [ ] Les icônes seules possèdent un nom accessible lorsque nécessaire.
- [ ] Les états vides et les erreurs sont prévus.
- [ ] Les composants partagés ne sont pas dupliqués sans justification.

## 25.6 — Motion

- [ ] Chaque animation possède une intention identifiable.
- [ ] Les durées correspondent au niveau d’interaction.
- [ ] Les animations ne bloquent pas les actions essentielles.
- [ ] Les animations ne se concurrencent pas.
- [ ] Le mouvement reste cohérent entre les écrans.
- [ ] La réduction du mouvement est prise en compte.
- [ ] Les transitions peuvent être interrompues lorsque nécessaire.
- [ ] L’expérience reste compréhensible sans animation.

## 25.7 — Responsive

- [ ] Le mobile a été vérifié en premier.
- [ ] Les boutons restent accessibles au toucher.
- [ ] Les interactions au survol ont un équivalent adapté.
- [ ] Les compositions desktop s’adaptent aux écrans étroits.
- [ ] Les contenus longs restent accessibles.
- [ ] Les modales restent utilisables avec une faible hauteur d’écran.

## 25.8 — Contrôle sur appareils réels ou émulation

Tester au minimum :

- un petit viewport mobile ;
- un viewport mobile courant ;
- une tablette ou largeur intermédiaire ;
- un desktop ;
- une largeur desktop importante.

Vérifier également le clavier, le focus visible, la réduction du mouvement et les principaux états interactifs.

---

# 26 — RÈGLES DE QUALITÉ POUR L’AGENT IA

L’agent doit suivre les règles suivantes pendant l’implémentation.

### Règle 1 — Lire avant de modifier

Lire les documents de référence et examiner le code existant avant de commencer.

### Règle 2 — Respecter le périmètre

Ne pas ajouter de nouvelles fonctionnalités ou de nouveaux parcours sous prétexte d’améliorer l’expérience visuelle.

### Règle 3 — Réutiliser avant de créer

Inspecter les composants, les tokens et les dépendances avant de créer une nouvelle solution.

### Règle 4 — Préserver le projet

Ne pas recréer l’application, remplacer sa configuration ou écraser les changements existants sans justification et approbation.

### Règle 5 — Concevoir pour le mobile

Vérifier les petits écrans avant d’ajouter les optimisations desktop.

### Règle 6 — Justifier les effets

Chaque effet important doit être lié à une intention narrative ou fonctionnelle.

### Règle 7 — Vérifier les résultats

L’agent doit lancer les vérifications adaptées au projet et examiner le rendu réel lorsque les outils disponibles le permettent.

### Règle 8 — Distinguer réalisé et restant

Ne pas prétendre qu’un écran, une animation, un outil ou une fonctionnalité est terminé si son implémentation n’a pas été vérifiée.

### Règle 9 — Proposer sans imposer

Les suggestions hors périmètre doivent être présentées séparément et attendre l’approbation de l’utilisateur.

### Règle 10 — Documenter la livraison

À la fin de chaque tâche, l’agent doit préciser :

- les fichiers modifiés ;
- les composants créés ou réutilisés ;
- les tokens ajoutés ou ajustés ;
- les dépendances réellement modifiées ;
- les vérifications exécutées ;
- les résultats observés ;
- les limites connues ;
- les décisions restant à prendre.

---

# 27 — DÉFINITION DE « TERMINÉ »

Le système visuel est considéré comme suffisamment établi pour poursuivre l’implémentation lorsque :

1. les tokens de couleur, de typographie, d’espacement, de rayons et de motion sont centralisés ;
2. les fondations des composants sont définies ;
3. Blue Library possède une identité reconnaissable ;
4. The 18th Case possède une variation cohérente de cette identité ;
5. l’espace quotidien conserve les mêmes fondations ;
6. les règles de responsive sont appliquées ;
7. les états principaux sont couverts ;
8. les animations essentielles respectent les intentions du document 01 ;
9. la réduction du mouvement est prise en compte ;
10. les principales combinaisons de couleurs ont été vérifiées ;
11. le rendu a été contrôlé sur plusieurs largeurs ;
12. les outils et dépendances existants ont été examinés avant toute modification ;
13. les vérifications pertinentes ont été exécutées ;
14. les limites connues ont été documentées.

Une animation sophistiquée ou une scène 3D non essentielle ne constitue pas un prérequis à cette validation.

---

# 28 — SYNTHÈSE DE LA DIRECTION ARTISTIQUE

PRINCIA — Chapter 18 doit réunir une bibliothèque littéraire bleue, une petite expérience d’enquête et un espace quotidien personnel dans un même système visuel.

Blue Library donne à l’expérience anniversaire son identité émotionnelle.

The 18th Case propose une autre façon de découvrir les souvenirs et les surprises, sans devenir un passage obligatoire.

L’espace quotidien prolonge l’expérience dans une interface claire, fonctionnelle et durable.

Le système de couleurs, la typographie éditoriale, les composants et les règles de mouvement relient ces trois univers.

Les animations, les outils de création et les éventuels effets 3D doivent renforcer cette identité, jamais la remplacer.

**La règle fondamentale est la suivante : l’émotion vient d’abord de l’intention, du contenu et de la cohérence. Le mouvement et la technologie viennent ensuite les servir.**

---

# 29 — PROCHAINE ÉTAPE DOCUMENTAIRE

Le document suivant est :

**`03 — TECHNICAL ARCHITECTURE`**

Il devra traduire les décisions du Project Brief, du document 01 et du présent document en architecture technique concrète, en tenant compte de l’environnement réellement présent dans le dépôt, des dépendances déjà installées et des contraintes de livraison.

Il devra notamment définir les responsabilités des composants, l’organisation des fichiers, la gestion des états, la PWA, la stratégie de données, les limites de sécurité, les intégrations éventuelles et la façon de maintenir une séparation nette entre l’interface, les parcours et les effets visuels.

Aucune modification de l’architecture ne doit être engagée sur la seule base d’une préférence esthétique : elle devra répondre aux besoins fonctionnels et aux contraintes vérifiées du projet.
