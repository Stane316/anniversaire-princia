// Génère les icônes PWA (192, 512, maskable 512, apple-touch-icon 180)
// ainsi que l'image de partage Open Graph (public/og-share.png, 1200×630)
// selon la direction artistique :
// « Un livre bleu, ouvert ou fermé, avec la lettre "P" au centre. »
// Sans dépendance externe (PNG encodé directement via node:zlib).
// Usage : node scripts/generate-icons.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

// ---------- encodage PNG minimal ----------
const CRC_TABLE = (() => {
  const t = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(4 + 4 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // 8 bits, RGBA
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0;
    rgba.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------- helpers géométrie ----------
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (t) => Math.min(1, Math.max(0, t));

const C_TL = [57, 120, 212];
const C_TR = [78, 148, 235];
const C_BL = [18, 44, 82];
const C_BR = [23, 74, 145];

function bgColor(u, v) {
  const top = [0, 1, 2].map((i) => lerp(C_TL[i], C_TR[i], u));
  const bot = [0, 1, 2].map((i) => lerp(C_BL[i], C_BR[i], u));
  return [0, 1, 2].map((i) => lerp(top[i], bot[i], v));
}

function sdBox(x, y, x0, y0, x1, y1) {
  const dx = Math.max(x0 - x, x - x1, 0);
  const dy = Math.max(y0 - y, y - y1, 0);
  const outside = Math.hypot(dx, dy);
  const inside = Math.min(Math.max(x0 - x, x - x1), 0) + Math.min(Math.max(y0 - y, y - y1), 0);
  return outside > 0 ? outside : Math.max(x0 - x, x - x1, y0 - y, y - y1);
}

function sdRoundedRect(x, y, x0, y0, x1, y1, r) {
  return sdBox(x, y, x0 + r, y0 + r, x1 - r, y1 - r) - r;
}

function sdSegment(px, py, ax, ay, bx, by) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = clamp01((pax * bax + pay * bay) / (bax * bax + bay * bay || 1));
  return Math.hypot(pax - bax * h, pay - bay * h);
}

/**
 * Distance signée vers le glyphe « P » centré dans l'espace 512×512.
 * Jonction droite → demi-cercle parfaitement tangente (sans encoche).
 */
function sdLetterP(x, y) {
  // Fût vertical gauche : x ∈ [212, 242], y ∈ [180, 320]
  const stem = sdRoundedRect(x, y, 212, 180, 242, 320, 3);

  // Panse du P : rectangle [212, 266] × [180, 262] prolongé par demi-disque (266, 221, R=41)
  const outerBowl =
    x <= 266
      ? sdBox(x, y, 212, 180, 266, 262)
      : Math.hypot(x - 266, y - 221) - 41;

  // Contreforme intérieure : rectangle [242, 265] × [206, 236] + demi-disque (265, 221, r=15)
  const hole =
    x <= 265
      ? sdBox(x, y, 242, 206, 265, 236)
      : Math.hypot(x - 265, y - 221) - 15;

  const bowl = Math.max(outerBowl, -hole);

  // Empattements éditoriaux (haut et pied du fût)
  const topSerif = sdRoundedRect(x, y, 201, 180, 244, 194, 3);
  const botSerif = sdRoundedRect(x, y, 201, 306, 255, 320, 3);

  return Math.min(stem, bowl, topSerif, botSerif);
}

// Rend un pixel dans l'espace canonique 512×512 → [r, g, b, 255]
function shadeIcon(sx, sy) {
  const u = clamp01(sx / 512);
  const v = clamp01(sy / 512);
  let [r, g, b] = bgColor(u, v);

  const blend = (cr, cg, cb, ca) => {
    const a = clamp01(ca);
    r = lerp(r, cr, a);
    g = lerp(g, cg, a);
    b = lerp(b, cb, a);
  };

  // Halo lumineux subtil derrière le livre
  const dh = Math.hypot(sx - 256, sy - 256);
  if (dh < 225) {
    blend(142, 197, 255, 0.2 * clamp01((225 - dh) / 115));
  }

  // Courbure légère des pages vers la reliure centrale (effet livre ouvert)
  const distSpine = Math.abs(sx - 256);
  const arch = 10 * (1 - Math.pow(clamp01(distSpine / 180), 1.4));
  const by = sy - arch;

  // Ombre portée du livre ouvert
  const dShadow = sdRoundedRect(sx, by, 66, 120, 446, 412, 28);
  if (dShadow < 14) {
    blend(10, 26, 52, 0.36 * clamp01((14 - dShadow) / 15));
  }

  // Couverture bleue du livre ouvert (#8EC5FF bordure claire + #174A91 couverture)
  const dCover = sdRoundedRect(sx, by, 62, 106, 450, 396, 26);
  if (dCover < 1) {
    blend(142, 197, 255, clamp01(1 - dCover));
  }

  const dCoverInner = sdRoundedRect(sx, by, 72, 116, 440, 386, 20);
  if (dCoverInner < 1) {
    blend(23, 74, 145, clamp01(1 - dCoverInner));
  }

  // Pages gauche et droite du livre ouvert (ivoire bleuté)
  const dLeftPage = sdRoundedRect(sx, by, 84, 124, 254, 374, 14);
  const dRightPage = sdRoundedRect(sx, by, 258, 124, 428, 374, 14);
  const dPages = Math.min(dLeftPage, dRightPage);
  if (dPages < 1) {
    const pageGrad = clamp01((by - 124) / 250);
    const spineShade = clamp01((32 - distSpine) / 32) * 0.08;
    const pr = lerp(255, 224, pageGrad) * (1 - spineShade);
    const pg = lerp(255, 238, pageGrad) * (1 - spineShade * 0.7);
    const pb = 255 * (1 - spineShade * 0.3);
    blend(pr, pg, pb, clamp01(1 - dPages));
  }

  // Reliure centrale du livre
  if (by >= 122 && by <= 378 && distSpine < 4.5) {
    blend(164, 188, 218, clamp01(1 - distSpine / 4.5) * 0.9);
  }

  // Signet bleu en bas de la reliure
  const dRibbon = sdRoundedRect(sx, sy, 248, 370, 264, 412, 3);
  if (dRibbon < 1) {
    blend(57, 120, 212, clamp01(1 - dRibbon));
  }

  // Disque médaillon bleu profond au centre du livre (porte la lettre P)
  const dDisc = Math.hypot(sx - 256, sy - 250) - 104;
  if (dDisc < 7) {
    blend(15, 36, 68, 0.22 * clamp01((7 - dDisc) / 8));
  }
  if (dDisc < 1) {
    blend(142, 197, 255, clamp01(1 - dDisc));
  }
  const dDiscInner = Math.hypot(sx - 256, sy - 250) - 95;
  if (dDiscInner < 1) {
    const tDisc = clamp01((sy - 155) / 190);
    blend(
      lerp(32, 21, tDisc),
      lerp(92, 52, tDisc),
      lerp(174, 91, tDisc),
      clamp01(1 - dDiscInner),
    );
  }

  // Lettre « P » blanche au centre avec contraste maximal
  const dP = sdLetterP(sx, sy);
  if (dP < 1.2) {
    blend(255, 255, 255, clamp01(1 - dP));
  }

  return [r, g, b, 255];
}

function renderIcon(size, { inset = 1 } = {}) {
  const SS = 3;
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const fx = ((x + (sx + 0.5) / SS) / size) * 512;
          const fy = ((y + (sy + 0.5) / SS) / size) * 512;
          const cx = inset === 1 ? fx : 256 + (fx - 256) / inset;
          const cy = inset === 1 ? fy : 256 + (fy - 256) / inset;
          const p = shadeIcon(cx, cy);
          r += p[0];
          g += p[1];
          b += p[2];
        }
      }
      const n = SS * SS;
      const i = (y * size + x) * 4;
      out[i] = Math.round(r / n);
      out[i + 1] = Math.round(g / n);
      out[i + 2] = Math.round(b / n);
      out[i + 3] = 255;
    }
  }
  return out;
}

// ---------- Mini moteur vectoriel pour le titrage de l'image Open Graph ----------
// Glyphes géométriques vectoriels (segments + arcs) dans une boîte [0..w] × [0..100]
function sdStrokeGlyph(ch, gx, gy, stroke) {
  let d = Infinity;
  const seg = (x0, y0, x1, y1) => {
    d = Math.min(d, sdSegment(gx, gy, x0, y0, x1, y1) - stroke);
  };
  const arc = (cx, cy, rad, a0, a1) => {
    const ang = Math.atan2(gy - cy, gx - cx);
    let inArc = false;
    if (a0 <= a1) {
      inArc = ang >= a0 && ang <= a1;
    } else {
      inArc = ang >= a0 || ang <= a1;
    }
    if (inArc) {
      d = Math.min(d, Math.abs(Math.hypot(gx - cx, gy - cy) - rad) - stroke);
    } else {
      const p0x = cx + rad * Math.cos(a0);
      const p0y = cy + rad * Math.sin(a0);
      const p1x = cx + rad * Math.cos(a1);
      const p1y = cy + rad * Math.sin(a1);
      d = Math.min(
        d,
        Math.hypot(gx - p0x, gy - p0y) - stroke,
        Math.hypot(gx - p1x, gy - p1y) - stroke,
      );
    }
  };

  switch (ch) {
    case "P":
      seg(10, 8, 10, 92);
      seg(10, 8, 38, 8);
      seg(10, 52, 38, 52);
      arc(38, 30, 22, -Math.PI / 2, Math.PI / 2);
      break;
    case "R":
      seg(10, 8, 10, 92);
      seg(10, 8, 36, 8);
      seg(10, 50, 36, 50);
      arc(36, 29, 21, -Math.PI / 2, Math.PI / 2);
      seg(32, 50, 58, 92);
      break;
    case "I":
      seg(22, 8, 22, 92);
      seg(10, 8, 34, 8);
      seg(10, 92, 34, 92);
      break;
    case "N":
      seg(10, 8, 10, 92);
      seg(10, 8, 60, 92);
      seg(60, 8, 60, 92);
      break;
    case "C":
      arc(42, 50, 40, 0.55, -0.55);
      break;
    case "A":
      seg(36, 8, 8, 92);
      seg(36, 8, 64, 92);
      seg(17, 64, 55, 64);
      break;
    case "H":
      seg(10, 8, 10, 92);
      seg(58, 8, 58, 92);
      seg(10, 50, 58, 50);
      break;
    case "T":
      seg(6, 8, 58, 8);
      seg(32, 8, 32, 92);
      break;
    case "E":
      seg(10, 8, 10, 92);
      seg(10, 8, 54, 8);
      seg(10, 50, 46, 50);
      seg(10, 92, 54, 92);
      break;
    case "1":
      seg(26, 8, 26, 92);
      seg(12, 22, 26, 8);
      seg(12, 92, 40, 92);
      break;
    case "8":
      arc(34, 29, 20, -Math.PI, Math.PI);
      arc(34, 70, 23, -Math.PI, Math.PI);
      break;
    default:
      break;
  }
  return d;
}

const GLYPH_ADVANCE = {
  P: 72,
  R: 74,
  I: 50,
  N: 78,
  C: 76,
  A: 78,
  H: 76,
  T: 70,
  E: 68,
  " ": 38,
  "1": 56,
  "8": 74,
};

function sdWord(word, px, py, x0, y0, scale, stroke, tracking = 8) {
  let cursor = 0;
  let best = Infinity;
  for (const ch of word) {
    const adv = GLYPH_ADVANCE[ch] ?? 64;
    if (ch !== " ") {
      const gx = (px - x0) / scale - cursor;
      const gy = (py - y0) / scale;
      if (gx >= -20 && gx <= adv + 20 && gy >= -20 && gy <= 120) {
        best = Math.min(best, sdStrokeGlyph(ch, gx, gy, stroke) * scale);
      }
    }
    cursor += adv + tracking;
  }
  return best;
}

// ---------- Image Open Graph 1200×630 (public/og-share.png) ----------
function renderOgImage(width = 1200, height = 630) {
  const out = Buffer.alloc(width * height * 4);
  const SS = 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x + (sx + 0.5) / SS;
          const py = y + (sy + 0.5) / SS;
          const u = px / width;
          const v = py / height;

          // Fond bleu nuit → bleu primaire
          let cr = lerp(15, 38, u * 0.7 + (1 - v) * 0.3);
          let cg = lerp(36, 92, u * 0.7 + (1 - v) * 0.3);
          let cb = lerp(68, 172, u * 0.7 + (1 - v) * 0.3);

          const blend = (nr, ng, nb, na) => {
            const a = clamp01(na);
            cr = lerp(cr, nr, a);
            cg = lerp(cg, ng, a);
            cb = lerp(cb, nb, a);
          };

          // Halo clair autour du centre
          const dGlow = Math.hypot(px - 600, py - 315);
          if (dGlow < 460) {
            blend(142, 197, 255, 0.16 * clamp01((460 - dGlow) / 320));
          }

          // Cadre éditorial extérieur
          const dOuterFrame = sdRoundedRect(px, py, 44, 44, width - 44, height - 44, 24);
          if (Math.abs(dOuterFrame) < 1.5) {
            blend(142, 197, 255, 0.38 * clamp01(1.5 - Math.abs(dOuterFrame)));
          }

          // Carte centrale claire (style couverture Blue Library)
          const dCardShadow = sdRoundedRect(px, py, 86, 86, width - 86, height - 74, 28);
          if (dCardShadow < 16) {
            blend(8, 20, 40, 0.32 * clamp01((16 - dCardShadow) / 16));
          }
          const dCard = sdRoundedRect(px, py, 84, 78, width - 84, height - 78, 26);
          if (dCard < 1) {
            const ct = clamp01((py - 78) / (height - 156));
            blend(lerp(247, 232, ct), lerp(250, 242, ct), 255, clamp01(1 - dCard));
          }

          // Médaillon icône 360×360 à gauche
          const iconCx = 320;
          const iconCy = 315;
          const iconSize = 350;
          const ix = ((px - (iconCx - iconSize / 2)) / iconSize) * 512;
          const iy = ((py - (iconCy - iconSize / 2)) / iconSize) * 512;
          const dBadge = sdRoundedRect(
            px,
            py,
            iconCx - iconSize / 2,
            iconCy - iconSize / 2,
            iconCx + iconSize / 2,
            iconCy + iconSize / 2,
            56,
          );
          if (dBadge < 1) {
            const ip = shadeIcon(ix, iy);
            blend(ip[0], ip[1], ip[2], clamp01(1 - dBadge));
          }

          // Partie droite : titrage « PRINCIA » et « CHAPTER 18 »
          // Pilule supérieure bleue
          const dPill = sdRoundedRect(px, py, 545, 165, 725, 195, 15);
          if (dPill < 1) {
            blend(216, 233, 255, clamp01(1 - dPill));
          }
          const dPillDot = Math.hypot(px - 567, py - 180) - 5.5;
          if (dPillDot < 1) {
            blend(57, 120, 212, clamp01(1 - dPillDot));
          }
          const dPillLine = sdRoundedRect(px, py, 584, 176, 704, 184, 4);
          if (dPillLine < 1) {
            blend(23, 74, 145, 0.75 * clamp01(1 - dPillLine));
          }

          // Mot « PRINCIA » en grand bleu profond (#15345B)
          const dPrincia = sdWord("PRINCIA", px, py, 545, 224, 0.86, 10.5, 10);
          if (dPrincia < 1) {
            blend(21, 52, 91, clamp01(1 - dPrincia));
          }

          // Sous-titre « CHAPTER 18 » en bleu primaire (#3978D4)
          const dChapter = sdWord("CHAPTER 18", px, py, 548, 336, 0.44, 9.5, 14);
          if (dChapter < 1) {
            blend(57, 120, 212, clamp01(1 - dChapter));
          }

          // Filet éditorial bleu ciel
          const dRule = sdRoundedRect(px, py, 548, 404, 720, 409, 2.5);
          if (dRule < 1) {
            blend(142, 197, 255, clamp01(1 - dRule));
          }

          // Lignes éditoriales sobres en bas à droite
          const dLine1 = sdRoundedRect(px, py, 548, 432, 950, 444, 6);
          const dLine2 = sdRoundedRect(px, py, 548, 458, 860, 470, 6);
          const dLines = Math.min(dLine1, dLine2);
          if (dLines < 1) {
            blend(104, 121, 145, 0.38 * clamp01(1 - dLines));
          }

          r += cr;
          g += cg;
          b += cb;
        }
      }
      const n = SS * SS;
      const i = (y * width + x) * 4;
      out[i] = Math.round(r / n);
      out[i + 1] = Math.round(g / n);
      out[i + 2] = Math.round(b / n);
      out[i + 3] = 255;
    }
  }
  return out;
}

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/apple-touch-icon.png", encodePng(180, 180, renderIcon(180)));
writeFileSync("public/icons/icon-192.png", encodePng(192, 192, renderIcon(192)));
writeFileSync("public/icons/icon-512.png", encodePng(512, 512, renderIcon(512)));
writeFileSync(
  "public/icons/icon-maskable-512.png",
  encodePng(512, 512, renderIcon(512, { inset: 0.82 })),
);
writeFileSync("public/og-share.png", encodePng(1200, 630, renderOgImage(1200, 630)));
console.log("Icônes et image Open Graph générées dans public/icons/ et public/og-share.png");
