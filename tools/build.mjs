// Generates every SVG in /assets plus README.md. No dependencies.
//
//   node tools/build.mjs
//
// Edit the CONTENT block or the PALETTE, re-run, commit. README.md is generated
// from the same content so image alt text never drifts from what the image shows.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ICONS = JSON.parse(readFileSync(join(ROOT, 'tools/icons.json'), 'utf8'));
const OUT = join(ROOT, 'assets');
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ PALETTE */
const C = {
  bg: '#0d1014',
  card: '#1a1d20',
  tile: '#22262a',
  line: '#30353a',
  band: '#111417',
  text: '#d9d6cb',
  white: '#f4f1e6',
  muted: '#8b9199',
  cream: '#e4dfd2',
  blue: '#8ec5f0',
  orange: '#e8742c',
  accent: '#6cc24a',
};
// darkest -> lightest; the mosaic and heading fragments draw from these
const G = ['#1d4a1f', '#2c7a2a', '#45a336', '#6cc24a', '#9be36f'];

/* ------------------------------------------------------------------ CONTENT */
const CONTENT = {
  name: 'ABHISHEK LIMBACHIYA',
  role: 'FOUNDER / AI ENGINEER',
  tagline: 'building production AI systems — routing, agents, automation',
  about: [
    {
      h: 'WHO I AM',
      t: "Hey, I'm Abhishek — an AI/ML student and full-stack web developer from Ahmedabad, India. I turn ideas into working products: LLM-powered applications, multi-model routing, AI agents and intelligent automation, built to operate at scale.",
    },
    {
      h: 'WHAT I DO',
      t: 'My engineering work focuses on the layer most teams skip: reliable LLM routing with provider fallback chains, AI agent orchestration, structured tool calling, retrieval-augmented generation, and the backend infrastructure needed to keep these systems stable under real-world conditions.',
    },
    {
      h: 'HOW I WORK',
      t: 'I operate at the intersection of AI engineering and scalable software architecture — where language models, APIs and business logic converge into production-grade software. Not research prototypes. Not demos. Systems that ship and stay running.',
    },
  ],
  links: [
    { key: 'linkedin', label: 'LINKEDIN', name: 'LinkedIn', handle: 'in/abhishek-limbachiya-18mar02', href: 'https://www.linkedin.com/in/abhishek-limbachiya-18mar02/' },
    { key: 'gmail', label: 'GMAIL', name: 'Email', handle: 'abhishek.limbachiya.edu@gmail.com', href: 'mailto:abhishek.limbachiya.edu@gmail.com' },
    { key: 'github', label: 'GITHUB', name: 'GitHub', handle: 'github.com/AbhishekLim17', href: 'https://github.com/AbhishekLim17' },
  ],
  focusIntro:
    'Building production-ready AI systems that combine LLMs, AI agents, automation and scalable backend architecture.',
  focus: [
    'AI Agents', 'Multi-Model Systems', 'LLM Engineering', 'Agentic Workflows',
    'AI Automation', 'Enterprise Chatbots', 'AI SaaS Platforms', 'Backend Infrastructure',
  ],
  systems: [
    { t: 'AI Customer Support Platform', s: 'RAG · Routing · Memory' },
    { t: 'AI Lead Intelligence Platform', s: 'LLMs · APIs · Pipelines' },
    { t: 'Enterprise AI Dashboard', s: 'Auth · RBAC · Analytics' },
    { t: 'Workflow Automation Engine', s: 'LLMs · Events · APIs' },
  ],
  principles: [
    ['Reliable over clever', "A boring system that stays up beats a clever one that doesn't."],
    ['Architecture before features', 'Decide how components talk to each other before deciding what they do.'],
    ['Automation first', 'If I do it twice by hand, the third time is scripted.'],
    ['Design for maintainability', "Code is read far more often than it's written — optimize for that."],
    ['Measure before optimizing', 'No tuning without a number to tune against.'],
    ['Production > prototype', 'A demo proves an idea works. A production system proves it keeps working.'],
  ],
  // icon: key into tools/icons.json, or `mono` for a pixel-font monogram when no brand glyph exists
  skills: [
    { n: 'OpenAI', icon: 'openai' }, { n: 'Gemini', icon: 'googlegemini' },
    { n: 'Claude', icon: 'claude' }, { n: 'Groq', mono: 'GQ', color: '#f55036' },
    { n: 'Node.js', icon: 'nodedotjs' }, { n: 'Express', icon: 'express' },
    { n: 'Python', icon: 'python' }, { n: 'REST APIs', mono: 'API', color: '#9be36f' },
    { n: 'JavaScript', icon: 'javascript' }, { n: 'React', icon: 'react' },
    { n: 'Next.js', icon: 'nextdotjs' }, { n: 'HTML5', icon: 'html5' },
    { n: 'CSS3', icon: 'css3' }, { n: 'SVG', icon: 'svg' },
    { n: 'Vercel', icon: 'vercel' }, { n: 'Git', icon: 'git' },
    { n: 'GH Actions', icon: 'githubactions' }, { n: 'Linux', icon: 'linux' },
    { n: 'Supabase', icon: 'supabase' }, { n: 'PostgreSQL', icon: 'postgresql' },
    { n: 'VS Code', mono: 'VS', color: '#2f9bdc' }, { n: 'Postman', icon: 'postman' },
    { n: 'Cursor', mono: 'CU', color: '#e4dfd2' }, { n: 'Windsurf', mono: 'WS', color: '#3fd0c9' },
  ],
  footer: 'Designed, built and maintained by Abhishek Limbachiya',
};

/* ------------------------------------------------------------------ HELPERS */
const W = 830;
const PAD = 28;
const IW = W - PAD * 2;
const MONO = "ui-monospace,'SFMono-Regular','JetBrains Mono',Menlo,Consolas,'Liberation Mono',monospace";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (v) => Math.round(v * 10) / 10;

function seeded(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// weighted pick: mostly greens, a rare light/cream/blue/orange pixel
function shade(r) {
  const v = r();
  if (v < 0.3) return G[0];
  if (v < 0.58) return G[1];
  if (v < 0.8) return G[2];
  if (v < 0.92) return G[3];
  if (v < 0.955) return G[4];
  if (v < 0.975) return C.cream;
  if (v < 0.99) return C.blue;
  return C.orange;
}

// 5x7 pixel font — covers what the headings and labels need
const FONT = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  3: ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  4: ['#...#', '#...#', '#...#', '#####', '....#', '....#', '....#'],
  5: ['#####', '#....', '#....', '####.', '....#', '....#', '####.'],
  6: ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '..#..', '..#..', '..#..'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  9: ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  '&': ['.##..', '#..#.', '#.#..', '.#...', '#.#.#', '#..#.', '.##.#'],
  '-': ['.....', '.....', '.....', '.###.', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.....', '..#..'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

const pixelWidth = (text, s) => text.length * 6 * s - s;

function pixelPath(text, x, y, s) {
  let d = '';
  let cx = x;
  for (const ch of text.toUpperCase()) {
    const g = FONT[ch] || FONT[' '];
    for (let r = 0; r < 7; r++) {
      let c = 0;
      while (c < 5) {
        if (g[r][c] === '#') {
          let e = c;
          while (e < 5 && g[r][e] === '#') e++;
          d += `M${cx + c * s} ${y + r * s}h${(e - c) * s}v${s}h${-(e - c) * s}z`;
          c = e;
        } else c++;
      }
    }
    cx += 6 * s;
  }
  return d;
}

const pixelText = (text, x, y, s, fill) =>
  `<path shape-rendering="crispEdges" fill="${fill}" d="${pixelPath(text, x, y, s)}"/>`;

// collects square cells and emits one <path> per colour
class Cells {
  constructor() { this.m = new Map(); }
  add(x, y, s, color) {
    this.m.set(color, (this.m.get(color) || '') + `M${x} ${y}h${s}v${s}h${-s}z`);
  }
  svg() {
    return [...this.m].map(([c, d]) => `<path shape-rendering="crispEdges" fill="${c}" d="${d}"/>`).join('');
  }
}

function wrap(text, max) {
  const out = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { out.push(cur); cur = w; }
  }
  if (cur) out.push(cur);
  return out;
}

// monospace lines pinned to an exact width so layout is identical on every OS/font
function lines(arr, x, y, { size = 13, cw = 7.8, lh = 19, fill = C.text, weight, anchor } = {}) {
  return arr
    .map((l, i) => {
      const tx = anchor === 'middle' ? ' text-anchor="middle"' : '';
      const fw = weight ? ` font-weight="${weight}"` : '';
      return `<text x="${num(x)}" y="${num(y + i * lh)}" font-size="${size}" fill="${fill}"${fw}${tx} textLength="${num(l.length * cw)}" lengthAdjust="spacingAndGlyphs">${esc(l)}</text>`;
    })
    .join('');
}

// pixel-font title with the fragmented mosaic strip trailing to the right edge
const HEAD_H = 21;
function heading(title, x, y, w) {
  const s = 3;
  const r = seeded('heading:' + title);
  const cells = new Cells();
  const x0 = x + pixelWidth(title, s) + 20;
  const n = Math.floor((x + w - x0) / 6);
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    const p = 0.08 + 0.85 * t * t;
    for (let row = 0; row < 2; row++) {
      if (r() < p * (row ? 0.85 : 0.7)) cells.add(x0 + i * 6, y + 4 + row * 6, 6, shade(r));
    }
  }
  return pixelText(title, x, y, s, C.white) + cells.svg();
}

const svgDoc = (w, h, title, desc, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d"><title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>${body}</svg>\n`;

const frame = (w, h, fill = C.card) =>
  `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" fill="${fill}" stroke="${C.line}"/>`;

const out = {}; // filename -> { svg, alt }
const emit = (file, w, h, title, alt, body) => {
  out[file] = { svg: svgDoc(w, h, title, alt, body), alt };
};

/* ------------------------------------------------------------------- BANNER */
function banner() {
  const H = 230, S = 10, cols = W / S, top0 = 5, last = 18;
  const r = seeded('banner');
  const grid = new Map();
  const nameCols = Math.ceil((24 + CONTENT.name.length * 30) / S);

  for (let c = 0; c < cols; c++) {
    const wave = 0.5 + 0.5 * Math.sin(c * 0.23 + 1.1) * Math.cos(c * 0.07 + 0.4);
    // keep the mosaic clear of the name; let it climb higher on the right
    const top = c <= nameCols ? 6 + Math.round(wave * 2) : top0 + Math.round(wave * 4) - (r() < 0.15 ? 1 : 0);
    for (let row = top; row <= last; row++) {
      const depth = (row - top) / Math.max(1, last - top);
      if (r() > 0.28 + 0.68 * Math.pow(depth, 0.7)) continue;
      grid.set(`${c},${row}`, shade(r));
    }
  }
  // the cream stair-step block, like the reference: a staircase climbing to the right
  for (let c = 47; c <= 58; c++) {
    for (let row = 12 - Math.floor((c - 47) / 2); row <= 15; row++) {
      grid.set(`${c},${row}`, r() < 0.9 ? C.cream : '#cfc9b8');
    }
  }
  const greens = [...grid].filter(([, col]) => G.includes(col)).map(([k]) => k);
  const twinkle = new Set();
  while (twinkle.size < 18) twinkle.add(greens[Math.floor(r() * greens.length)]);

  const cells = new Cells();
  let live = '';
  for (const [k, color] of grid) {
    const [c, row] = k.split(',').map(Number);
    if (twinkle.has(k)) {
      live += `<rect shape-rendering="crispEdges" x="${c * S}" y="${row * S}" width="${S}" height="${S}" fill="${color}"><animate attributeName="opacity" values="1;.25;1" dur="${num(3 + r() * 4)}s" begin="${num(r() * 5)}s" repeatCount="indefinite"/></rect>`;
    } else cells.add(c * S, row * S, S, color);
  }

  const tag = CONTENT.tagline;
  const body =
    frame(W, H, C.card) +
    cells.svg() + live +
    `<rect x="1" y="190" width="${W - 2}" height="39" fill="${C.band}"/><path d="M1 190.5H${W - 1}" stroke="${C.line}"/>` +
    pixelText(CONTENT.name, 24, 18, 5, C.white) +
    `<g font-family="${MONO}">${lines([tag], 24, 214, { size: 12.5, cw: 7.5, fill: C.muted })}</g>` +
    `<rect x="${24 + tag.length * 7.5 + 8}" y="203" width="8" height="14" fill="${C.accent}"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1.1s" repeatCount="indefinite"/></rect>` +
    pixelText(CONTENT.role, W - 24 - pixelWidth(CONTENT.role, 2), 203, 2, C.cream);
  emit('banner.svg', W, H, `${CONTENT.name} — ${CONTENT.role}`, `${CONTENT.name} — ${CONTENT.role}. ${tag}.`, body);
}

/* -------------------------------------------------------------- ABOUT CARD */
function about() {
  const maxChars = 92, cw = 7.8, lh = 19;
  let y = PAD;
  let body = '';
  const alt = [];
  CONTENT.about.forEach((b, i) => {
    body += heading(b.h, PAD, y, IW);
    const ls = wrap(b.t, maxChars);
    const base = y + HEAD_H + 26;
    body += `<g font-family="${MONO}">${lines(ls, PAD, base, { cw, lh })}</g>`;
    y = base + (ls.length - 1) * lh + (i < CONTENT.about.length - 1 ? 34 : 0);
    alt.push(`${b.h}: ${b.t}`);
  });
  const H = y + PAD - 4;
  emit('about.svg', W, H, 'About Abhishek', alt.join(' '), frame(W, H) + body);
}

/* ---------------------------------------------------------- HEADING CARDS */
function headingCard(file, title, alt) {
  const H = PAD * 2 + HEAD_H;
  emit(file, W, H, title, alt, frame(W, H) + heading(title, PAD, PAD, IW));
}

/* --------------------------------------------------------------- LINK TILES */
function linkTiles() {
  const w = 270, h = 132;
  for (const l of CONTENT.links) {
    const ic = ICONS[l.key];
    const col = luminance(ic.hex) < 0.28 ? C.cream : `#${ic.hex}`;
    const body =
      frame(w, h, C.tile) +
      `<rect x="1" y="1" width="${w - 2}" height="30" fill="${C.band}"/><path d="M1 31.5H${w - 1}" stroke="${C.line}"/>` +
      pixelText(l.label, Math.round((w - pixelWidth(l.label, 2)) / 2), 9, 2, C.cream) +
      `<g transform="translate(${w / 2 - 22} 46) scale(${44 / 24})"><path fill="${col}" d="${ic.path}"/></g>` +
      `<g font-family="${MONO}">${lines([l.handle], w / 2, 116, { size: 11, cw: 6.6, fill: C.muted, anchor: 'middle' })}</g>`;
    emit(`link-${l.key}.svg`, w, h, l.name, `${l.name} link`, body);
  }
}

/* ------------------------------------------------------------ FOCUS + CHIPS */
function focus() {
  const ls = wrap(CONTENT.focusIntro, 92);
  const base = PAD + HEAD_H + 26;
  let body = heading('CURRENTLY ENGINEERING', PAD, PAD, IW);
  body += `<g font-family="${MONO}">${lines(ls, PAD, base, { cw: 7.8, lh: 19 })}</g>`;

  const cols = 4, gap = 14, cw = (IW - gap * (cols - 1)) / cols, ch = 40;
  const y0 = base + (ls.length - 1) * 19 + 26;
  let chips = '';
  CONTENT.focus.forEach((label, i) => {
    const x = PAD + (i % cols) * (cw + gap);
    const y = y0 + Math.floor(i / cols) * (ch + gap);
    chips +=
      `<rect x="${num(x) + .5}" y="${y + .5}" width="${num(cw) - 1}" height="${ch - 1}" fill="${C.tile}" stroke="${C.line}"/>` +
      `<rect x="${num(x) + 1}" y="${y + 1}" width="3" height="${ch - 2}" fill="${G[2]}"/>` +
      `<rect shape-rendering="crispEdges" x="${num(x) + 16}" y="${y + ch / 2 - 3}" width="6" height="6" fill="${C.accent}"><animate attributeName="opacity" values="1;.3;1" dur="2.6s" begin="${num(i * 0.35)}s" repeatCount="indefinite"/></rect>` +
      lines([label], x + 30, y + ch / 2 + 4, { size: 12, cw: 7, fill: C.text });
  });
  const rows = Math.ceil(CONTENT.focus.length / cols);
  const H = y0 + rows * ch + (rows - 1) * gap + PAD;
  emit('focus.svg', W, H, 'Currently engineering', `Currently engineering: ${CONTENT.focusIntro} Active focus: ${CONTENT.focus.join(', ')}.`,
    frame(W, H) + body + `<g font-family="${MONO}">${chips}</g>`);
}

/* ------------------------------------------------------------------ SYSTEMS */
function systems() {
  const gap = 14, cw = (IW - gap) / 2, ch = 96;
  const y0 = PAD + HEAD_H + 26;
  let cards = '';
  CONTENT.systems.forEach((s, i) => {
    const x = PAD + (i % 2) * (cw + gap);
    const y = y0 + Math.floor(i / 2) * (ch + gap);
    cards +=
      `<rect x="${x + .5}" y="${y + .5}" width="${cw - 1}" height="${ch - 1}" fill="${C.tile}" stroke="${C.line}"/>` +
      `<rect x="${x + 1}" y="${y + 1}" width="3" height="${ch - 2}" fill="${C.accent}"/>` +
      pixelText('PRODUCTION SYSTEM', x + 20, y + 16, 2, G[3]) +
      `<g font-family="${MONO}">${lines([s.t], x + 20, y + 56, { size: 15, cw: 9, weight: 'bold', fill: C.white })}${lines([s.s], x + 20, y + 78, { size: 12, cw: 7.2, fill: C.muted })}</g>`;
  });
  const H = y0 + 2 * ch + gap + PAD;
  emit('systems.svg', W, H, 'Selected systems', `Selected systems: ${CONTENT.systems.map((s) => `${s.t} (${s.s})`).join('; ')}.`,
    frame(W, H) + heading('SELECTED SYSTEMS', PAD, PAD, IW) + cards);
}

/* --------------------------------------------------------------- PRINCIPLES */
function principles() {
  const gap = 14, cw = (IW - gap) / 2, textX = 62, maxChars = Math.floor((cw - textX - 12) / 7.2);
  const y0 = PAD + HEAD_H + 26;
  const items = CONTENT.principles.map(([t, d]) => ({ t, ls: wrap(d, maxChars) }));
  const rowH = [0, 1, 2].map((r) => Math.max(...items.slice(r * 2, r * 2 + 2).map((i) => 46 + i.ls.length * 17 + 8)));
  let body = '';
  let y = y0;
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 2; k++) {
      const idx = r * 2 + k, it = items[idx];
      const x = PAD + k * (cw + gap);
      body +=
        `<rect x="${x + .5}" y="${y + .5}" width="${cw - 1}" height="${rowH[r] - 1}" fill="${C.tile}" stroke="${C.line}"/>` +
        pixelText(String(idx + 1).padStart(2, '0'), x + 14, y + 14, 3, G[3]) +
        `<g font-family="${MONO}">${lines([it.t], x + textX, y + 24, { size: 13.5, cw: 8.1, weight: 'bold', fill: C.white })}${lines(it.ls, x + textX, y + 46, { size: 12, cw: 7.2, lh: 17, fill: C.muted })}</g>`;
    }
    y += rowH[r] + gap;
  }
  const H = y - gap + PAD;
  emit('principles.svg', W, H, 'Engineering principles',
    `Engineering principles: ${CONTENT.principles.map(([t, d]) => `${t} — ${d}`).join(' ')}`,
    frame(W, H) + heading('ENGINEERING PRINCIPLES', PAD, PAD, IW) + body);
}

/* ------------------------------------------------------------------- SKILLS */
function luminance(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

function skills() {
  const cols = 8, gap = 10, tw = (IW - gap * (cols - 1)) / cols, th = 78;
  const y0 = PAD + HEAD_H + 24;
  let tiles = '';
  CONTENT.skills.forEach((s, i) => {
    const x = PAD + (i % cols) * (tw + gap);
    const y = y0 + Math.floor(i / cols) * (th + gap);
    const cx = x + tw / 2;
    let icon;
    if (s.mono) {
      icon = pixelText(s.mono, Math.round(cx - pixelWidth(s.mono, 3) / 2), y + 14, 3, s.color);
    } else {
      const ic = ICONS[s.icon];
      const col = luminance(ic.hex) < 0.28 ? C.cream : `#${ic.hex}`;
      icon = `<g transform="translate(${num(cx - 14)} ${y + 12}) scale(${28 / 24})"><path fill="${col}" d="${ic.path}"/></g>`;
    }
    tiles +=
      `<rect x="${num(x) + .5}" y="${y + .5}" width="${num(tw) - 1}" height="${th - 1}" fill="${C.tile}" stroke="${C.line}"/>` +
      icon +
      `<g font-family="${MONO}">${lines([s.n], cx, y + 64, { size: 10, cw: 6, fill: C.text, anchor: 'middle' })}</g>`;
  });
  const rows = Math.ceil(CONTENT.skills.length / cols);
  const H = y0 + rows * th + (rows - 1) * gap + PAD;
  emit('skills.svg', W, H, 'Skill set', `Skill set: ${CONTENT.skills.map((s) => s.n).join(', ')}.`,
    frame(W, H) + heading('SKILL SET', PAD, PAD, IW) + tiles);
}

/* ------------------------------------------------------------------- FOOTER */
function footer() {
  const H = 76;
  const r = seeded('footer');
  const cells = new Cells();
  const n = Math.floor((W - 2) / 6);
  for (let i = 0; i < n; i++) {
    for (let row = 0; row < 2; row++) {
      // sparse in the middle, dense at both edges — frames the text
      const edge = Math.abs(i - n / 2) / (n / 2);
      if (r() < 0.05 + 0.8 * edge * edge * (row ? 1 : 0.7)) cells.add(1 + i * 6, H - 13 + row * 6, 6, shade(r));
    }
  }
  const body =
    frame(W, H) + cells.svg() +
    `<g font-family="${MONO}">${lines([CONTENT.footer], W / 2, 28, { size: 12.5, cw: 7.5, fill: C.text, anchor: 'middle' })}${lines(['github.com/AbhishekLim17'], W / 2, 48, { size: 11, cw: 6.6, fill: C.muted, anchor: 'middle' })}</g>`;
  emit('footer.svg', W, H, 'Footer', `${CONTENT.footer}. github.com/AbhishekLim17`, body);
}

/* -------------------------------------------------------------------- BUILD */
banner();
about();
headingCard('connect.svg', 'CONNECT', 'Connect');
linkTiles();
headingCard('contrib.svg', 'CONTRIBUTIONS', 'Contributions');
focus();
systems();
principles();
skills();
footer();

for (const [file, { svg }] of Object.entries(out)) writeFileSync(join(OUT, file), svg);

/* ------------------------------------------------------------------- README */
const a = (s) => esc(s);
const img = (file, extra = '') => `<img src="./assets/${file}" alt="${a(out[file].alt)}" width="100%"${extra} />`;

const readme = `<!-- Generated by tools/build.mjs — edit that file and re-run \`node tools/build.mjs\`, not this one. -->
<div align="center">
  ${img('banner.svg')}
</div>


${img('about.svg')}


${img('connect.svg')}

<p align="center">
${CONTENT.links.map((l) => `  <a href="${l.href}"><img src="./assets/link-${l.key}.svg" alt="${a(l.name)}" width="32.6%" /></a>`).join('\n')}
</p>


${img('contrib.svg')}

<img src="./profile-3d-contrib/profile-night-green.svg" alt="3D contribution graph, top languages and activity radar for AbhishekLim17" width="100%" />


${img('focus.svg')}


${img('systems.svg')}


${img('principles.svg')}


${img('skills.svg')}


<div align="center">
  ${img('footer.svg')}
  <img src="https://komarev.com/ghpvc/?username=AbhishekLim17&color=6cc24a&style=flat-square&label=PROFILE+VIEWS" alt="Profile views" />
</div>
`;
writeFileSync(join(ROOT, 'README.md'), readme.replace(/\n{3,}/g, '\n\n'));

console.log(`wrote ${Object.keys(out).length} SVGs + README.md`);
