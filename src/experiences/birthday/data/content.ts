/**
 * ============================================================
 * CONTENU ÉDITORIAL — PRINCIA · Chapter 18
 * ============================================================
 * ⚠️  Volet lettre : VALIDÉ PAR STANE le 2 octobre 2026
 *     (« la lettre est bonne, on la garde comme elle est »).
 *     Toute modification ultérieure passe par Stane, directement ici.
 *
 * Tous les textes ci-dessous sont construits UNIQUEMENT à partir
 * des faits fournis et validés par le créateur dans le document
 * 00 — Project Brief :
 *
 *   - rencontre en classe de sixième ;
 *   - nombreux échanges en quatrième et en troisième ;
 *   - déménagement de Princia après la troisième, contact interrompu ;
 *   - retrouvailles quand Stane était en Terminale ;
 *   - même campus universitaire (Abomey-Calavi), établissements
 *     différents — Princia : génie environnemental à l'EPAK ;
 *   - bleu (ciel) comme couleur identitaire partagée ;
 *   - blague : Lamborghini bleue réclamée en cadeau d'anniversaire ;
 *   - plaisanterie documentée sur le bleu jusque dans les toilettes ;
 *   - goûts : lecture, romans, séries policières/d'enquête,
 *     lectures religieuses, informatique, importance des études.
 *
 * RÈGLES ÉDITORIALES RESPECTÉES :
 *   - aucun souvenir précis, conversation, date, parole ou
 *     sentiment inventé (doc 01 §20.2) ;
 *   - amitié profonde, complice et affectueuse, SANS ambiguïté
 *     romantique (doc 00 §3.1) ;
 *   - les informations privées/confidentielles sont exclues (doc 00 §2.5) ;
 *   - aucune pression sur les études ou les objectifs (doc 00 §2.2).
 *
 * STANE : relis chaque ligne. Tout ce qui te gêne — reformule-le
 * ici même, ou demande une réécriture. L'intégration finale
 * attend ta validation.
 * ============================================================
 */

/** -- BL-01 : Entrée et invitation -- */
export const welcomeContent = {
  kicker: "Pour Princia",
  title: "Quelque chose a été écrit pour toi",
  lead: "Pas un livre ordinaire. Une bibliothèque bleue, rien qu'à toi, dont chaque chapitre raconte un morceau de notre histoire — et qui s'ouvre, à la fin, sur la suite : la tienne.",
  cta: "Ouvrir ce livre",
  footnote: "Une expérience unique, préparée pour tes dix-huit ans.",
};

/**
 * -- 5.3 : Enveloppe scellée (phase d'entrée orchestrée) --
 * Même système fictionnel que la bibliothèque : l'invitation arrive
 * scellée à la cire, cachetée PRC-18. Texte extérieur uniquement —
 * l'intérieur de l'invitation reste welcomeContent (déjà relu).
 */
export const invitationContent = {
  addressee: "À l'ouverture personnelle de Princia",
  origin: "PRC-18 · La Grande Salle Bleue",
  postage: "Affranchi en bleu, évidemment",
  sealLabel: "Briser le sceau et ouvrir l'invitation",
  sealCta: "Briser le sceau",
  skip: "Passer l'introduction",
  replay: "Refermer l'enveloppe",
  openedNote: "L'enveloppe est ouverte. Le sceau se reformera si tu veux revoir l'instant.",
} as const;

/** -- BL-02 : Couverture -- */
export const coverContent = {
  eyebrow: "Une expérience préparée pour le 4 octobre 2026",
  titleTop: "PRINCIA",
  titleBottom: "Chapter 18",
  // Signature prévue (doc 05 §02.3) — texte exact, validé par les documents.
  signature: "Une nouvelle page s'ouvre. Et cette fois, c'est elle qui écrit la suite.",
  cta: "Entrer dans la bibliothèque",
  alternative: "Si tu préfères l'enquête, elle est par ici",
};

/** -- BL-03/04 : Blue Library & chapitres -- */
export const libraryContent = {
  kicker: "Blue Library",
  title: "La bibliothèque de douze chapitres — en version courte",
  intro:
    "Ici, pas d'étagères interminables : cinq chapitres, un pour chaque grande page de notre histoire commune. Ouvre-les dans l'ordre, dans le désordre — cette bibliothèque t'appartient déjà.",
  letterTeaser: "Et au bout du rayon : la lettre. Le chapitre qui n'en est pas vraiment un.",
  caseTeaser: "Envie de jouer les détectives ? The 18th Case t'attend.",
  backToLibrary: "Retour à la bibliothèque",
};

/**
 * -- 5.1 : Système fictionnel de la bibliothèque --
 * La blue library existe comme une vraie institution : elle a un nom,
 * un règlement, des cotes de volumes, une carte de lectrice et une
 * bibliothécaire qui laisse des notes de marge.
 * Toutes les plaisanteries ci-dessous restent strictement ancrées
 * aux faits validés du document 00 (même règle que la lettre).
 */
export const libraryCaseTeaser = {
  intro:
    "Un dossier atterrit dans la salle d\u2019archives du sous-sol : cote exacte 10-04. Le service l\u2019a class\u00e9 \u00e0 part, dans le fonds des \u00e9nigmes d\u2019anniversaire.",
  title: "The 18th Case",
  line: "D\u00e9part pr\u00e9vu le 4 octobre, r\u00e9f\u00e9rence 10-04 — deux dates qui disent d\u00e9j\u00e0 presque tout. Le reste se gagne au fil du dossier.",
  cta: "S\u2019introduire dans le dossier",
} as const;

export const libraryCodex = {
  institution: "Blue Library — Grande Salle Bleue",
  collection: "Fonds Princia",
  registration: "Enregistrée sous la référence PRC-18",
  rulesTitle: "Règlement de la Grande Salle Bleue",
  rulesNote: "Affiché à l'entrée, relu chaque matin par la bibliothécaire.",
  rules: [
    "Article 1 — Le bleu ciel est la teinte officielle de l'établissement. Toute autre couleur se soumet, négocie, ou ressort.",
    "Article 2 — La lettre ne se gagne pas, ne se débloque pas. Elle se lit, quand on veut, autant de fois qu'on veut.",
    "Article 3 — L'enquête est facultative. La bibliothécaire décline toute responsabilité en cas de détective soudainement très investi.",
    "Article 4 — Aucun volume de ce fonds ne sera jamais en retard. Dans cette bibliothèque, certaines lectures attendent — elles ne s'annulent pas.",
  ],
  stampText: "EX · LIBRIS",
  stampSubline: "PRC-18 · Blue Library",
} as const;

/** Carte de lectrice — fiche d'identité de Princia, selon les faits validés. */
export const readerCard = {
  title: "Carte de lectrice",
  stamp: "Notice certifiée conforme",
  fields: [
    { label: "Titulaire", value: "Princia" },
    { label: "N° de carte", value: "PRC-18" },
    { label: "Statut", value: "Lectrice émérite — romans et enquêtes" },
    {
      label: "Rayons fréquentés",
      value: "Lecture · séries policières · informatique · génie environnemental (EPAK)",
    },
    { label: "Signe distinctif", value: "Allégeance officielle et documentée au bleu ciel" },
    { label: "Validité", value: "À vie — renouvelable à chaque chapitre" },
  ],
  footnote: "Émise par la Grande Salle Bleue, en ce mois d'octobre 2026.",
} as const;

export interface BirthdayChapter {
  id: string;
  number: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  aside?: string;
  /** Cote du volume dans le fonds (système fictionnel 5.1). */
  callNumber: string;
  /** Note de marge de la bibliothécaire (voix, pas un souvenir). */
  marginNote: string;
  /** Dégradé de la couverture du livre (tokens bleus, doc 02 §08.1). */
  gradient: { top: string; bottom: string };
}

export const birthdayChapters: BirthdayChapter[] = [
  {
    id: "premiere-page",
    number: "01",
    kicker: "Sixième",
    title: "Première page",
    paragraphs: [
      "Tout commence en classe de sixième. Rien de spectaculaire : une rentrée, des bancs, de nouvelles têtes. Et puis une amitié qui s'installe sans bruit, comme une première phrase posée sans savoir qu'elle deviendra un livre entier.",
      "Ce n'était pas encore la grande complicité de plus tard. Juste le début. Mais les débuts comptent toujours — surtout ceux qui tiennent.",
    ],
    aside: "Premier chapitre d'une très longue histoire.",
    callNumber: "PRC-18/6E·01",
    marginNote: "Volume inaugural du fonds. La bibliothécaire certifie n'avoir jamais vu une histoire commencer si discrètement pour finir en collection entière.",
    gradient: { top: "#5B9BEB", bottom: "#24559F" },
  },
  {
    id: "annees-complicite",
    number: "02",
    kicker: "Quatrième · Troisième",
    title: "Les années complicité",
    paragraphs: [
      "En quatrième et en troisième, on a vraiment appris à se connaître. C'est là que sont nées les grandes discussions — celles qui pouvaient passer de tout à rien et de rien à tout en quelques minutes.",
      "C'est là aussi que s'est installée notre manière d'être : de l'humour, du sérieux quand il le faut, et cette façon de se comprendre sans avoir besoin de tout expliquer.",
    ],
    aside: "Les années fondations de l'amitié.",
    callNumber: "PRC-18/4E-3E·02",
    marginNote: "Le service des archives a tenté d'inventorier les discussions de ce volume. Résultat officiel : « trop nombreuses ». Dossier clos, évidemment.",
    gradient: { top: "#3978D4", bottom: "#174A91" },
  },
  {
    id: "pages-tournees",
    number: "03",
    kicker: "Après la troisième",
    title: "Les pages tournées",
    paragraphs: [
      "Après la troisième, tu as déménagé. Et la vie a fait ce qu'elle fait parfois : elle éloigne les gens sans prévenir. Les nouvelles se sont raréfiées, puis le silence s'est installé.",
      "Mais certaines amitiés ne s'effacent pas. Elles se mettent en attente, comme un marque-page glissé dans un chapitre qu'on a toujours l'intention de reprendre.",
    ],
    aside: "Un intermède — pas une fin.",
    callNumber: "PRC-18/MP·03",
    marginNote: "Période dite du marque-page. Ce volume n'a jamais été mis en retour d'emprunt : dans cette bibliothèque, on savait que la lecture reprendrait.",
    gradient: { top: "#7EAFE8", bottom: "#2D65B8" },
  },
  {
    id: "retrouvailles",
    number: "04",
    kicker: "Terminale · le campus",
    title: "Les retrouvailles",
    paragraphs: [
      "Les retrouvailles sont arrivées quand j'étais en Terminale. Comme si de rien n'était, comme si le marque-page avait tenu bon pendant tout ce temps.",
      "Et puis la surprise, plus tard : réaliser qu'on arpente le même campus d'Abomey-Calavi. Toi au génie environnemental, à l'EPAK ; moi pas loin. Deux établissements différents, un même chemin qui se recroise.",
      "Cette fois, c'est reparti pour de bon.",
    ],
    aside: "La preuve que certaines histoires refusent de s'arrêter.",
    callNumber: "PRC-18/TLE·04",
    marginNote: "Notice de relocalisation : volume retrouvé sur le même campus. Deux établissements, un chemin — la bibliothécaire appelle ça un heureux classement.",
    gradient: { top: "#3978D4", bottom: "#15345B" },
  },
  {
    id: "bleu-majeur",
    number: "05",
    kicker: "La couleur de tout ça",
    title: "Bleu majeur",
    paragraphs: [
      "Impossible de parler de toi sans parler du bleu. Le bleu ciel, précisément. Une couleur qui te suit partout — jusqu'aux endroits où, entre nous, elle n'avait pas forcément besoin d'être. Tu sais de quoi je parle.",
      "Un jour, tu as réclamé une Lamborghini bleue pour ton anniversaire. Le budget de cette année se situait, disons, légèrement en dessous du prix d'une Lamborghini. Alors ça a été une bibliothèque bleue à la place. On espère que l'effort de substitution sera apprécié à sa juste valeur.",
      "Entre le bleu, les romans qui font rêver et les enquêtes qu'on collectionne — jusque dans un certain palais d'apothicaires, où l'observation reste la meilleure arme — il n'en fallait pas plus pour imaginer cette expérience : une bibliothèque qui en cache peut-être une, d'enquête…",
    ],
    aside: "Le bleu n'est pas qu'une couleur. C'est un état d'esprit.",
    callNumber: "PRC-18/BL·05",
    marginNote: "Répertorié dans toutes les nuances du bleu, y compris là où personne ne l'attendait. Dossier Lamborghini : toujours en attente de financement. Le rayon frissons reste ouvert tard — la bibliothécaire nie toute responsabilité.",
    gradient: { top: "#8EC5FF", bottom: "#24559F" },
  },
];

/** -- BL-05 : Lettre personnelle -- */
export const letterContent = {
  kicker: "La lettre",
  title: "Pour tes dix-huit ans",
  salutation: "Princia,",
  paragraphs: [
    "Certains cadeaux se choisissent en magasin. Celui-ci a mis beaucoup plus de temps à trouver sa forme — parce qu'une bibliothèque n'est pas le cadeau le plus habituel pour un dix-huitième anniversaire. Mais pour toi, c'était presque une évidence.",
    "Dix-huit ans. Quand je pense à la classe de sixième où tout a commencé, puis aux années de quatrième et de troisième où on s'est raconté le monde sans compter, je mesure la chance que c'est : une amitié qui traverse le temps. Même les années de silence ne l'ont pas effacée — les retrouvailles étaient là pour le prouver, et ce campus qu'on partage aujourd'hui le confirme chaque jour.",
    "Ta simplicité, ta détermination, ta manière d'être franche et douce à la fois : rien de tout ça n'a changé, et c'est heureusement la chose la moins négociable du monde. Tu avances avec les mêmes valeurs, le même humour, et cette couleur que tu revendiques jusque dans les lieux les plus inattendus — je n'en dirai pas plus.",
    "Alors non, ce n'est pas une Lamborghini bleue. Mais c'est un endroit à toi. Un endroit qui raconte les chapitres déjà écrits ensemble, et surtout un endroit qui t'attend pour écrire les suivants : tes lectures, tes projets, tes victoires du quotidien — petites ou grandes.",
    "Je te souhaite une année à ta hauteur : que tes études te portent sans jamais te peser, que tes rêves restent aussi grands que tu veux les faire, et que le bleu continue de te suivre partout où tu vas.",
  ],
  signatureLine: "Une nouvelle page s'ouvre. Et cette fois, c'est elle qui écrit la suite.",
  closing: "Joyeux anniversaire, Princia.",
  signature: "Stane",
  backToLibrary: "Revenir à la bibliothèque",
  continueTo: "Continuer l'expérience",
};

/** -- BL-06 : Fin du parcours principal -- */
export const finaleContent = {
  kicker: "Fin de ce chapitre",
  title: "La suite t'appartient",
  paragraphs: [
    "Tu as exploré la bibliothèque — en entier ou à ta façon, c'était exactement l'idée. Ces pages restent ouvertes pour toi, pour y revenir quand tu veux.",
    "Maintenant, deux chemins : l'enquête, si le détective en toi veut son heure de gloire… ou ton espace, qui continuera d'exister bien après le 4 octobre.",
  ],
  toDaily: "Découvrir ton espace",
  toCase: "Jouer l'enquête",
  toLetter: "Relire la lettre",
  toLibrary: "Revoir les chapitres",
};

/** -- The 18th Case (5.5 : version « vrai dossier ») -- */
export const caseContent = {
  reference: "ENQ-18/10-04",
  intro: {
    stamp: "Dossier n° 18",
    title: "The 18th Case",
    fileMeta: [
      "Retrouvé entre les rayonnages de la Grande Salle Bleue",
      "Classification : affaire de couleur — priorité absolue",
      "Restitution à la bibliothèque exigée après lecture",
    ],
    paragraphs: [
      "Une étrange affaire a été retrouvée entre les rayonnages de la Blue Library. Tout y tourne autour d'un seul et même chiffre : 18.",
      "À toi d'en découvrir la vérité, indice après indice.",
      "L'ambition était la mise en abyme du suspense — pas le cinéma d'horreur : aucun cri obligatoire ne t'attend derrière le prochain clic.",
    ],
    mention: "La bibliothécaire jure n'avoir rien à voir avec ce dossier. Personne ne l'a crue.",
    note: "Aucune obligation : la lettre et la bibliothèque te restent accessibles à tout moment.",
    start: "Ouvrir le dossier",
    back: "Retour à la bibliothèque",
  },
  conclusion: {
    stamp: "Affaire classée",
    verdictStamp: "RÉSOLUE",
    title: "Enquête résolue",
    paragraphs: [
      "Tu as résolu l'affaire n° 18 sans difficulté majeure — le doute n'était plus permis depuis longtemps.",
      "Aucun suspect n'est resté sur la touche, et la principale intéressée s'en sort magnifiquement bien. Comme toujours.",
    ],
    mentions: [
      "Pièces versées au dossier : 03 — pièces disparues : 00.",
      "Mention finale : le détective en titre du jour restera dans les annales de la Grande Salle Bleue.",
      "Recommandation d'archivage : ranger ce dossier au rayon des certitudes, sous-cote bleue.",
    ],
    toLetter: "Lire la lettre, si ce n'est pas déjà fait",
    toLibrary: "Retour à la bibliothèque",
    toDaily: "Découvrir ton espace",
  },
  restart: "Recommencer l'enquête",
};

export type CaseRiddle =
  | {
      kind: "choice";
      question: string;
      options: { id: string; label: string }[];
      correctOptionId: string;
    }
  | {
      kind: "text";
      question: string;
      acceptedAnswers: string[];
      hint: string;
      placeholder: string;
    };
const lamChoices = [
  { id: "tesla", label: "Une Tesla grise" },
  { id: "twingo", label: "Une Twingo rouge" },
  { id: "lambo-bleue", label: "Une Lamborghini bleue" },
  { id: "tricycle", label: "Un tricycle bleu" },
];

export const caseSteps = [
  {
    id: "intro",
    type: "intro" as const,
  },
  {
    id: "clue-1",
    type: "clue" as const,
    stamp: "Indice 01",
    title: "Le rêve sur quatre roues",
    body: "Premier élément du dossier : les notes mentionnent un cadeau rêvé depuis longtemps. Il roule vite, il fait tourner les têtes… et il n'existe, semble-t-il, qu'en une seule couleur acceptable.",
    mention: "Archiviste, au dossier : ce rêve est consigné depuis si longtemps qu'il possède sa propre étagère.",
    cta: "À toi de trancher",
    riddle: {
      kind: "choice",
      question: "Quelle voiture figure dans ce dossier ?",
      options: lamChoices,
      correctOptionId: "lambo-bleue",
    } satisfies CaseRiddle,
    wrongFeedback: "Raté. Mais un tricycle bleu aurait été plus raisonnable, c'est vrai.",
    hint: "Elle commence par 'Lambo' et finit par 'rghini'.",
    reveal: {
      stamp: "Élément vérifié",
      title: "La Lamborghini bleue",
      body: "Exact. Le rêve est consigné noir sur blanc : une Lamborghini, bleue naturellement. Le budget, lui, maintient qu'il manque encore quelques pièces au dossier pour applaudir.",
      mention: "Nota de l'archiviste : le tricycle bleu n'a jamais été une option sérieuse. Officiellement.",
    },
  },
  {
    id: "clue-2",
    type: "clue" as const,
    stamp: "Indice 02",
    title: "La couleur omniprésente",
    body: "Deuxième élément : le dossier rapporte une couleur qui s'est immiscée jusque dans les pièces les plus inattendues. On ne citera rien de précis. Mais certains lieux, apparemment, en disent bleu.",
    mention: "Certains lieux de ce dossier resteront volontairement flous. La couleur, elle, a été interrogée : elle a tout avoué.",
    cta: "Je sais où cela va",
    riddle: {
      kind: "text",
      question: "De quelle couleur s'agit-il ?",
      acceptedAnswers: ["bleu", "bleue", "bleu ciel", "bleuciel"],
      hint: "Il commence par « bl » et il termine par « eu ».",
      placeholder: "Écris ta réponse ici…",
    } satisfies CaseRiddle,
    wrongFeedback: "Ce n'est pas ça. Un indice supplémentaire est disponible, si tu veux.",
    hint: "Il commence par « bl » et il termine par « eu ».",
    reveal: {
      stamp: "Élément vérifié",
      title: "Le bleu, évidemment",
      body: "Dossier refermé sur la couleur : bleu, partout, toujours. Même là où personne ne soupçonnait son rôle. Le mystère était profond — enfin, disons, domestique.",
      mention: "Versement accepté : une couleur, zéro zone blanche. Le dossier est dense.",
    },
  },
  {
    id: "clue-3",
    type: "clue" as const,
    stamp: "Indice 03",
    title: "Le recoupement géographique",
    body: "Troisième élément versé : après des années sans localisation commune, le dossier note que le sujet et l'enquêteur arpentent de nouveau le même campus universitaire. Reste à le nommer.",
    mention: "Le plan joint au dossier est dessiné au stylo bleu. Évidemment.",
    cta: "Je localise l'affaire",
    riddle: {
      kind: "text",
      question: "Sur quel campus se déroule le recoupement ?",
      acceptedAnswers: ["abomey-calavi", "abomey calavi", "abomeycalavi"],
      hint: "Deux mots, un tiret : A…-C…",
      placeholder: "Nom du campus…",
    } satisfies CaseRiddle,
    wrongFeedback: "Ce n'est pas ce campus-là. Un indice supplémentaire est disponible, si tu veux.",
    hint: "Deux mots, un tiret : A…-C…",
    reveal: {
      stamp: "Élément vérifié",
      title: "Abomey-Calavi",
      body: "Localisation confirmée : même campus, deux établissements — le génie environnemental à l'EPAK d'un côté, pas loin de l'autre. La géographie de l'affaire tient en une phrase : les chemins finissent toujours par se recroiser.",
      mention: "Classée définitivement. La distance officielle entre les deux établissements : « raisonnable ».",
    },
  },
] as const;

export type CaseStep = (typeof caseSteps)[number];

/** ============================================================
 * 5.4 — LE VOLUME SOUS SCELLÉ
 * Révélation personnelle, verrouillée jusqu'au jour J.
 * ⚠️  BROUILLON POUR STANE — relis et ajuste. Construit
 * UNIQUEMENT à partir des faits du brief de mission (Stane) :
 *   - le geste du riz apporté sur le campus (acte d'attention) ;
 *   - les prises de nouvelles lors des nuits blanches/maladies ;
 *   - « elle se dit parfois méchante » → REGARD de Stane
 *     (présenté comme son regard, jamais comme un diagnostic) ;
 *   - Les Carnets de l'Apothicaire (Maomao, Jinshi) : clins d'œil.
 * Contrainte doc 00 §2.2 : encourager sans jamais faire peser
 * les études ou les objectifs.
 * ============================================================ */

export const SEALED_VOLUME_UNLOCK_ISO = "2026-10-04";

export const sealedVolume = {
  id: "volume-scelle",
  cote: "PRC-18/S∞",
  number: "S",
  kicker: "Le volume sous scellé",
  /** Affichage tant que le jour J n'est pas arrivé. */
  sealed: {
    title: "Réservé au jour J",
    line: "Ce volume est sous scellé. Il s'ouvrira de lui-même le 4 octobre — certains contenus méritent d'attendre.",
  },
  /** Après ouverture. */
  title: "Ce que les gestes disent tout bas",
  paragraphs: [
    "Il y a quelque temps, alors que les journées tiraient en longueur et que même préparer du riz me fatiguait, tu as cuisiné. Et tu as apporté. Sur le campus, sans en faire tout un événement — juste, ce jour-là, à ce moment-là. Ce n'est pas la taille du geste qui reste. C'est qu'il existait.",
    "C'est ta manière, d'ailleurs. Quand les nuits s'allongent de mon côté, ou que la forme baisse, il y a toujours ce message pour prendre des nouvelles. Une attention qui ne réclame aucun applaudissement. Une attention qui est simplement là.",
    "Parfois, tu dis en riant un peu que tu es la méchante de l'histoire. Permets à l'auteur de cette bibliothèque de corriger doucement la page — et je le signe de ma main, c'est mon regard : ce que tu appelles méchanceté, moi j'y lis quelqu'un qui sait poser ses limites, préserver son temps et son énergie. Ce n'est pas de la méchanceté. C'est du soin, qui commence par soi — et qui, très vite, rejaillit sur les autres.",
    "Pour la suite ? Avance comme tu sais le faire : sans te presser, sans te comparer. Tes dix-huit ans ne sont pas un examen à réussir. Ils sont un volume qui s'ouvre — et le lecteur de ce côté-ci a hâte de suivre la suite.",
  ],
  aside: "Versé au dossier sans mise en scène — les gestes vrais n'en ont pas besoin.",
  marginNote:
    "Classé parmi les « preuves d'attention ». Si Maomao était passée par là, ce geste serait déjà répertorié : attention déguisée en banalité. Elle ne s'y trompe jamais.",
  gradient: { top: "#2D65B8", bottom: "#0F2444" },
} as const;

/** ============================================================
 * RECONSTRUCTION THE 18TH CASE (mission du 3 oct. 2026)
 * Référence de réalisation : « Dossier 18 Jenny » (mécanismes
 * étudiés via dépôt + site live ; identité, textes et contenus
 * RECRÉÉS pour Princia — aucun texte personnel de Jenny réutilisé,
 * aucun animal en emblème, identité bleue du design system).
 * Tous les faits ci-dessous sont validés (docs 00–05, briefs Stane).
 * ============================================================ */

export const caseDossier = {
  /** Chapitrage officiel du dossier (6 chapitres, data-chapter). */
  chapters: [
    { num: "I", label: "I — Couverture" },
    { num: "II", label: "II — Rapport préliminaire" },
    { num: "III", label: "III — Les sept faits" },
    { num: "IV", label: "IV — Pièces à conviction" },
    { num: "V", label: "V — Verdict" },
    { num: "VI", label: "VI — Affaire classée" },
  ],
  cover: {
    bureau: "Grande Salle Bleue — Division des affaires extraordinaires",
    stamp: "Confidentiel",
    openLine: "Dossier ouvert le 4 octobre — ne pas classer",
    reference: "Réf. ENQ-18/10-04",
    titleLead: "The 18th Case — l'affaire",
    titleName: "Princia.",
    lead: "Dix-huit ans. Une Lamborghini bleue réclamée, et toujours due. Cinq volumes et une lettre déjà versés au fonds. Enquête ouverte aujourd'hui par la Grande Salle Bleue — pour établir, preuves à l'appui, ce que le marque-page savait depuis la classe de sixième : cette amitié-là tient en collection entière.",
    ctaOpen: "Ouvrir le dossier",
    ctaLetter: "La lettre, si tu l'as manquée",
    identification: {
      label: "Fiche d'identification",
      rows: [
        { label: "Sujet", value: "Princia" },
        { label: "Âge au moment des faits", value: "18 ans, tout juste" },
        {
          label: "Statut",
          value: "Lectrice émérite — étudiante en génie environnemental (EPAK)",
        },
        { label: "Signes particuliers", value: "Franche. Directe. Simple. Douce." },
        {
          label: "Ambition déclarée",
          value: "≈ 16/20 à fin d'année — en construction, jamais un contrat",
        },
        { label: "Allégeance", value: "Bleu ciel — toutes nuances revendiquées" },
        { label: "Dernière localisation", value: "Le campus — 4 octobre" },
      ],
      footLine: "Allégeance chromatique confirmée sur plusieurs pièces — enquête en cours.",
    },
    sealText: "DIX-HUIT ANS • 4 OCTOBRE • AFFAIRE PRINCIA • ",
    marquee: [
      "Dix-huit ans",
      "4 octobre",
      "Affaire Princia",
      "Le bleu y est obligatoire",
      "Les carnets ont été relus — deux fois",
      "Suspense sans jump scare, promis",
      "Réf. ENQ-18/10-04",
    ],
  },

  report: {
    piece: "Pièce II",
    tag: "Procès-verbal",
    title: "Rapport préliminaire",
    intro:
      "Ouverture du procès-verbal ENQ-18/10-04. La lecture de ce rapport doit être effectuée en continu, sans rire — enfin, presque.",
    stamp: "PV N°010 — certifié conforme",
    paragraphs: [
      "Prévenu : le dossier affirme cent choses vraies et aucune ne plaide en faveur de la discrétion du sujet. Une enquête devient nécessaire quand une personne atteint dix-huit ans en restant exactement elle-même — sans ciller, avec tout un plan de vie déjà esquissé au stylo bleu.",
      "Les faits, constatés ci-après au nombre de sept (F-01 à F-07), ont été recueillis au fil de plusieurs années d'amitié, de lectures communes et de discussions franches. Chacun a été vérifié deux fois par le service des archives, qui n'en est pas à sa première collecte. L'examen des pièces à conviction suit immédiatement après.",
      "Consignation immédiate : la responsabilité de l'enthousiasme engendré par ce dossier ne saurait rejeter sur l'institution. Le jury vous laisse poursuivre sans distraction plus longtemps que nécessaire.",
    ],
    conclusion:
      "Conclusion préliminaire : les sept faits suffisent pour constituer une affaire. Examine-les un par un — ce dossier ne juge jamais, il constate à l'encre bleue.",
    cta: "Poursuivre lecture des sept faits",
  },

  factsChapter: {
    piece: "Pièce III",
    tag: "Interrogatoires des faits",
    title: "Les sept faits",
    intro:
      "Sept faits, sept pièces versées. Le dossier les présente un par un, comme il se doit : à l'encre, sans détour et sans césure dans le respect qui est dû au sujet. Fais défiler — chaque fait prend la parole à son tour.",
    items: [
      {
        code: "F-01",
        title: "Une fascination pour les mystères",
        text: "Le dossier révèle une passion particulière pour « Les Carnets de l'Apothicaire ». Entre secrets, énigmes, observations et indices dissimulés, l'univers de Maomao et de Jinshi semble avoir trouvé une place de choix dans ses centres d'intérêt.",
        indice: "Lecture surveillée : tout indice finit toujours par être noté quelque part.",
      },
      {
        code: "F-02",
        title: "Une ambition universitaire définie",
        text: "L'objectif est précis : atteindre au minimum 16/20 de moyenne. Devenir major de promotion serait une belle distinction supplémentaire, mais l'ambition ne se limite pas à décrocher la première place : elle veut avant tout atteindre son propre niveau d'exigence.",
        indice: "Ambition consignée comme projet — jamais comme contrat.",
      },
      {
        code: "F-03",
        title: "L'indépendance comme objectif personnel",
        text: "Princia veut progressivement construire son indépendance financière et apprendre à compter davantage sur ses propres capacités. Ce projet demande du temps, des efforts et de la persévérance, mais il fait partie de ce qu'elle souhaite accomplir.",
        indice: "Aucune estimation de revenus n'a été versée — le dossier salue l'élan.",
      },
      {
        code: "F-04",
        title: "Une motivation qui dépasse les résultats",
        text: "Derrière ses ambitions se trouve également un souhait important : rendre son père fier. Ses efforts universitaires et son désir d'avancer ont aussi une dimension personnelle et familiale.",
        indice: "Versé avec précaution : cette pièce-là se manipule avec douceur.",
      },
      {
        code: "F-05",
        title: "Une attention à ceux qu'elle aime",
        text: "Elle peut s'inquiéter profondément pour les personnes auxquelles elle tient. Même lorsqu'elle ne le montre pas toujours de la manière la plus évidente, leur bien-être compte pour elle.",
        indice: "Nuits blanches signalées — du côté des proches, jamais les siennes.",
      },
      {
        code: "F-06",
        title: "Une détermination qui résiste",
        text: "Princia est battante et prête à traverser des périodes difficiles pour construire l'avenir qu'elle souhaite. Lorsqu'un objectif compte réellement pour elle, elle ne s'attend pas à ce que le chemin soit facile : elle est prête à faire les efforts nécessaires pour avancer.",
        indice: "Le service n'a jamais enregistré d'abandon de sa part sur un objectif sérieux.",
      },
      {
        code: "F-07",
        title: "Un caractère franc, un cœur attentif",
        text: "Elle peut se montrer franche, ferme, voire prendre un ton sévère lorsqu'elle s'inquiète pour quelqu'un ou estime qu'une situation l'exige. Cette fermeté ne résume pas sa personnalité : elle sait aussi être sympathique, attentionnée et présente pour les personnes qui comptent pour elle.",
        indice: "Les témoins anonymes confirment les deux versions — toutes deux vraies.",
      },
    ],
    outro:
      "Sept faits, zéro objection recevable. Le dossier passe maintenant aux pièces matérielles.",
  },

  evidence: {
    piece: "Pièce III",
    tag: "Inventaire scellé",
    title: "Pièces à conviction",
    stats: { lodged: "05", missing: "00", note: "Aucune preuve d'amour disparue — scandale de rigueur" },
    interrogation: {
      choiceCta: "Trancher",
      textCta: "Verser la réponse",
      solvedStamp: "Résolu",
      wrongLine: "Le greffe reste polie mais ça ne correspond pas. Réessaie — ou passe celle-ci, le dossier ne bloque pas sa propre héroïne.",
      skipCta: "Passer celle-ci",
      hintCta: "Un petit indice ?",
      placeholder: "Ta réponse…",
    },
    prose: [
      {
        id: "piece-4",
        code: "Pièce A-04",
        status: "Pièce littéraire",
        title: "Les Carnets",
        description:
          "Retrouvés sur la table de lecture du sujet : un palais rempli de fioles, de poisons élégants et de personnes qui observent mieux que tout le monde. Le sujet a un faible pour ceux qui déduisent ; les romances s'y cachent parfois — sans bruit.",
        mention: "Traces de romance soigneusement dissimulées. Le dossier fait semblant de ne pas les avoir vues.",
      },
      {
        id: "piece-5",
        code: "Pièce A-05",
        status: "Reconstitution",
        title: "Les nuits de frisson",
        description:
          "Scène récurrente constatée : écran allumé, heure qui n'existe pas, le sujet enchaîne enquêtes serrées et films d'horreur sans ciller. Ce dossier reprend le goût du suspense — jamais les cri-sauts.",
        mention: "Les cris entendus n'ont jamais provenu du sujet. Aucun jump scare n'a été versé.",
      },
    ],
    sealed: {
      code: "Pièce A-06",
      title: "Sous scellés",
      description:
        "Cette pièce attend dans la bibliothèque, au fonds des volumes qui s'ouvrent le jour J. Certains contenus méritent d'attendre — c'est écrit au dos de la scène.",
      cta: "Voir le volume sous scellé",
    },
  },

  closure: {
    piece: "Pièce VI",
    tag: "Classement",
    title: "Affaire classée",
    stamp: "AFFAIRE CLASSÉE",
    paragraphs: [
      "Le dossier ENQ-18/10-04 est clos. Verdict prononcé, faits consignés, pièces inventoriées : tout concorde vers la même conclusion, et l'institution n'a plus qu'une formalité à accomplir.",
      "Recommandation d'archivage définitive : ranger l'affaire au rayon des certitudes — sous-cote bleue, évidemment — et la rouvrir chaque année, au mois d'octobre, pour constater qu'elle n'a rien perdu de sa valeur.",
    ],
    mentions: [
      "Faits établis : 07/07 — aucune objection recevable.",
      "Pièces versées : 05 — pièces disparues : 00.",
      "Pièce A-06 : reste sous scellés jusqu'au jour J, fonds de bibliothèque.",
    ],
    note: "Cette clôture est provisoire par principe : une personne qui a dix-huit ans continue de produire des faits. Le dossier se rouvrira de lui-même.",
  },

  verdict: {
    juryLine: "Le jury — composé de toutes les encres qui signent — a délibéré",
    title: "Le verdict",
    stamp: "RÉSOLUE",
    stampLine: "d'être précieuse. C'est irréfutable.",
    sentence:
      "L'accusée est relaxée de tout doute : elle est exactement ce que sa bibliothèque disait d'elle. Dossier classé au rayon des certitudes — sous-cote bleue, évidemment.",
    messageTitle: "Pièce jointe — à garder",
    messageParagraphs: [
      "Princia, tu as tout examiné — alors une dernière pièce, la plus simple : je suis content qu'on se soit connus en sixième. Les années de silence ne l'ont pas effacé ; le campus le prouve tous les jours.",
      "Tes projets — la mention, la moyenne que tu vises, l'indépendance que tu construis petit à petit — ne sont pas des dettes, pas un contrat à honorer pour exister. Ce sont des ambitions en mouvement. Les petites victoires construisent les grandes, et un jour moins bon n'effacera jamais ça.",
      "Pour les cours, les soirs de doute, et tout ce qui demande juste à être dit : tu peux compter sur moi. Ce service-là n'a pas de date de péremption.",
    ],
    signature: "— signé à l'encre bleue, Stane",
    sealedHint: "Une toute dernière pièce t'attend au jour J, dans la bibliothèque. Tu sais laquelle.",
    ctaLetter: "Relire la lettre",
    ctaLibrary: "Retour à la bibliothèque",
    ctaDaily: "Retrouver ton espace",
    restart: "Re-examiner le dossier",
    completeNote: "Les trois interrogatoires sont signés — dossier complet.",
  },
} as const;
