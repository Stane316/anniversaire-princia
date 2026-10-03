/**
 * 5.7 — Salle des souvenirs.
 * Photos versées au fonds par Stane (dossier `souvenirs/` du dépôt,
 * optimisées pour le web dans `public/souvenirs-gallery/` — le dossier
 * source sur GitHub n'a jamais été modifié ni déplacé).
 *
 * Règle invariante : les descriptions sont strictement VISUELLES et
 * vérifiables — jamais de contexte, de sentiment ou de date inventés.
 * Elles servent d'attributs alt : c'est une exigence d'accessibilité,
 * pas un ornement.
 */

export interface SouvenirPhoto {
  src: string;
  /** Description exacte du contenu visible (alt / aria-label). */
  alt: string;
}

const BASE = "/souvenirs-gallery";

/** Ordre choisi pour la spirale (époques et tons alternés). */
export const souvenirPhotos: SouvenirPhoto[] = [
  {
    src: `${BASE}/photo-01.webp`,
    alt: "Selfie en extérieur : Princia en polo bleu clair aux côtés de Stane, lunettes de soleil et sac à dos, dans une cour ensoleillée.",
  },
  {
    src: `${BASE}/photo-14.webp`,
    alt: "Selfie complice en extérieur : Princia et Stane tirent la langue vers l'objectif, mur jaune et arbres en arrière-plan.",
  },
  {
    src: `${BASE}/photo-05.webp`,
    alt: "Princia en polo bleu ciel, un bras levé joyeusement, sous les grands arbres du campus.",
  },
  {
    src: `${BASE}/photo-02.webp`,
    alt: "Selfie en extérieur : Stane et Princia souriants, ciel nuageux, arbres et bannière dessinée derrière eux.",
  },
  {
    src: `${BASE}/photo-08.webp`,
    alt: "Princia en chemise grise, sourire, une enceinte noire tenue contre elle ; une moto rouge stationnée en arrière-plan.",
  },
  {
    src: `${BASE}/photo-21.webp`,
    alt: "Princia en robe à motifs bleus et jaunes, debout devant une haie taillée, palmier et bâtiment blanc du campus derrière.",
  },
  {
    src: `${BASE}/photo-06.webp`,
    alt: "Princia en polo bleu ciel, grand sourire, bras tendus en avant, sous les arbres.",
  },
  {
    src: `${BASE}/photo-03.webp`,
    alt: "Sur le campus : Princia aux longues tresses boit un sachet d'eau, grands arbres et chemin de terre en arrière-plan.",
  },
  {
    src: `${BASE}/photo-09.webp`,
    alt: "Portrait de Princia souriante près d'une voiture sous un auvent — photo retouchée en tons de bleu.",
  },
  {
    src: `${BASE}/photo-17.webp`,
    alt: "En blouse blanche de laboratoire, Princia sourit et fait le signe de la victoire dans une salle claire.",
  },
  {
    src: `${BASE}/photo-07.webp`,
    alt: "Portrait de Princia en polo bleu ciel, sourire doux, sous les arbres.",
  },
  {
    src: `${BASE}/photo-13.webp`,
    alt: "Princia de profil consulte son téléphone, sac à dos au dos — filtre violet et papillons virtuels sur la photo.",
  },
  {
    src: `${BASE}/photo-20.webp`,
    alt: "Selfie : Princia en casquette et lunettes bleues, la main sur le bord de la casquette, route pavée derrière.",
  },
  {
    src: `${BASE}/photo-04.webp`,
    alt: "Sur le campus : Princia en polo blanc s'arrête près d'un grand arbre, une camarade derrière elle.",
  },
  {
    src: `${BASE}/photo-15.webp`,
    alt: "Photo dans un miroir : Princia en sweat à capuche menthe, léger sourire, téléphone à quatre capteurs.",
  },
  {
    src: `${BASE}/photo-10.webp`,
    alt: "Princia et Stane côte à côte sous un auvent — portrait retouché en tons de bleu.",
  },
  {
    src: `${BASE}/photo-18.webp`,
    alt: "Princia en t-shirt blanc et jupe rouge, appuyée contre un mur, sourire, fenêtre à persiennes en arrière-plan.",
  },
  {
    src: `${BASE}/photo-11.webp`,
    alt: "Princia souriante, mains jointes, devant un car blanc — photo retouchée en tons de bleu.",
  },
  {
    src: `${BASE}/photo-16.webp`,
    alt: "Photo dans un miroir : Princia en sweat à capuche menthe, grand sourire.",
  },
  {
    src: `${BASE}/photo-19.webp`,
    alt: "Portrait de Princia : nattes et petits chignons, t-shirt blanc, fenêtre à persiennes derrière.",
  },
  {
    src: `${BASE}/photo-12.webp`,
    alt: "Princia cache son visage derrière son téléphone — photo retouchée en tons de bleu.",
  },
];

export const souvenirsContent = {
  kicker: "Salle des souvenirs",
  title: "Le fonds photographique du campus",
  lead: "Vingt-et-une photos versées au fonds — tout droit sorties des rayonnages du quotidien. Faites glisser la spirale, ou laissez-la tourner : les souvenirs n'ont jamais aimé rester en place.",
  marginNote:
    "Notice n° SOUV-21 : le service de la Grande Salle Bleue confirme — 21 pièces, toutes en bleu. Certaines étaient déjà bleues avant d'arriver ; le reste, c'est la bibliothécaire qui s'en charge.",
  note: "Faites glisser pour la faire tourner — elle s'arrête au survol.",
} as const;
