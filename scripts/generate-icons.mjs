// Génère les icônes PWA (192, 512, maskable 512) à partir de la géométrie
// vectorielle du livre/étoiles, sans dépendance externe (PNG écrit à la main).
// Usage : node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

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
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}
function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8 bits, RGBA
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0;
    rgba.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- helpers géométrie (espace 512×512) ----------
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (t) => Math.min(1, Math.max(0, t));

// fond : dégradé bilinéaire bleu ciel → bleu profond
const C_TL = [64, 140, 222], C_TR = [86, 168, 242], C_BL = [17, 47, 86], C_BR = [26, 82, 152];
function bgColor(u, v) {
  const top = [0, 1, 2].map((i) => lerp(C_TL[i], C_TR[i], u));
  const bot = [0, 1, 2].map((i) => lerp(C_BL[i], C_BR[i], u));
  return [0, 1, 2].map((i) => lerp(top[i], bot[i], v));
}

function rrContain(x, y, x0, y0, x1, y1, r) {
  // distance signée négative = dedans
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  if (x >= x0 + r && x <= x1 - r && y >= y0 && y <= y1) return -1;
  if (y >= y0 + r && y <= y1 - r && x >= x0 && x <= x1) return -1;
  return Math.hypot(x - cx, y - cy) - r;
}

// lignes de page : béziers quadratiques pré-échantillonnées
function quad(p0, p1, p2) {
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, m = 1 - t;
    pts.push([m * m * p0[0] + 2 * m * t * p1[0] + t * t * p2[0], m * m * p0[1] + 2 * m * t * p1[1] + t * t * p2[1]]);
  }
  return pts;
}
const PAGE_LINES = [
  quad([140, 196], [186, 186], [234, 196]),
  quad([140, 226], [186, 216], [234, 226]),
  quad([140, 256], [186, 246], [234, 256]),
  quad([140, 286], [186, 276], [234, 286]),
  quad([278, 196], [326, 184], [374, 194]),
  quad([278, 226], [326, 214], [374, 224]),
  quad([278, 256], [326, 244], [374, 254]),
  quad([278, 286], [326, 274], [374, 284]),
];
function distToLines(x, y) {
  let best = Infinity;
  for (const poly of PAGE_LINES)
    for (const [px, py] of poly) {
      const d = Math.hypot(x - px, y - py);
      if (d < best) best = d;
    }
  return best;
}

// étoile 4 branches (astroïde) la
const SPARKS = [
  { cx: 256, cy: 92, ax: 24, ay: 42 },
  { cx: 186, cy: 116, ax: 14, ay: 26 },
  { cx: 328, cy: 116, ax: 11, ay: 21 },
];
function sparkContains(x, y) {
  for (const s of SPARKS) {
    const ux = Math.abs(x - s.cx) / s.ax, uy = Math.abs(y - s.cy) / s.ay;
    const v = Math.pow(ux, 2 / 3) + Math.pow(uy, 2 / 3);
    if (v <= 1) return true;
  }
  return false;
}

// rend un pixel (coord. écran 512) → [r,g,b,255]
function shade(sx, sy) {
  const u = sx / 512, v = sy / 512;
  let [r, g, b] = bgColor(u, v);
  let a = 1;
  const blend = (cr, cg, cb, ca) => {
    r = lerp(r, cr, ca); g = lerp(g, cg, ca); b = lerp(b, cb, ca);
  };
  // halo discret derrière le livre
  const dh = Math.hypot(sx - 256, sy - 320);
  if (dh < 170) blend(142, 197, 255, 0.13 * clamp01((170 - dh) / 60));
  // ombre du livre
  if (rrContain(sx, sy, 132, 162, 404, 356, 14) < 0) blend(15, 42, 78, 0.25);
  // pages
  const inLeft = rrContain(sx, sy, 116, 146, 258, 348, 12) < 0;
  const inRight = rrContain(sx, sy, 254, 146, 396, 348, 12) < 0;
  if (inLeft || inRight) {
    const t = clamp01((sy - 146) / 202);
    blend(lerp(255, 220, t), lerp(255, 235, t), lerp(255, 255, t), 1);
    // lignes de page
    const d = distToLines(sx, sy);
    if (d < 5) blend(142, 197, 255, clamp01((5 - d) / 2.5));
    // dos central
    if (sx >= 252 && sx <= 260) blend(184, 201, 223, 0.9);
  }
  // étoiles dorées
  if (sparkContains(sx, sy)) blend(245, 198, 107, 1);
  return [r, g, b, a * 255];
}

// supersampling 3×3 + composition finale à la taille demandée
function render(size, { inset = 1 } = {}) {
  const SS = 3;
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) {
          // coordonnée dans l'espace 512 (avec marge inset pour maskable)
          const fx = ((x + (sx + 0.5) / SS) / size) * 512;
          const fy = ((y + (sy + 0.5) / SS) / size) * 512;
          const cx = inset === 1 ? fx : 256 + (fx - 256) / inset;
          const cy = inset === 1 ? fy : 256 + (fy - 256) / inset;
          const p = shade(cx, cy);
          r += p[0]; g += p[1]; b += p[2];
        }
      const n = SS * SS, i = (y * size + x) * 4;
      out[i] = Math.round(r / n); out[i + 1] = Math.round(g / n);
      out[i + 2] = Math.round(b / n); out[i + 3] = 255;
    }
  }
  return out;
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', encodePng(192, 192, render(192)));
writeFileSync('public/icons/icon-512.png', encodePng(512, 512, render(512)));
writeFileSync('public/icons/icon-maskable-512.png', encodePng(512, 512, render(512, { inset: 0.84 })));
writeFileSync('.tmp/icon-node-preview.png', encodePng(384, 384, render(384)));
console.log('icônes écrites dans public/icons/');
