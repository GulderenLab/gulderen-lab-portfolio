#!/usr/bin/env node
// scripts/check-links.mjs — dist/ içindeki HTML sayfalarında kırık İÇ bağlantıları bulur.
// Kullanım: npm run build && node scripts/check-links.mjs
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
// Bilinen eksikler: markdown-klavuzu yazısındaki örnek fotoğraflar hiç yüklenmemiş.
// Görselleri public/images/ altına ekleyince bu listeden çıkarın.
const KNOWN_MISSING = new Set(['/images/Marmaris-dalgalar.jpg', '/images/orman.jpg']);
const files = [];
async function walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
}
await walk(DIST);

const exists = async (p) => stat(p).then(() => true, () => false);
async function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (!clean || clean === '/') return true;
  const target = path.join(DIST, clean);
  return (await exists(target)) && (await stat(target)).isFile()
    ? true
    : (await exists(path.join(target, 'index.html'))) || (await exists(target + '.html'));
}

const broken = new Map();
for (const f of files) {
  const html = await readFile(f, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1];
    if (KNOWN_MISSING.has(url) || url.startsWith('//') || url.startsWith('/_astro/') || url.startsWith('/pagefind/')) continue;
    if (!(await resolve(url))) {
      const page = '/' + path.relative(DIST, f).replace(/index\.html$/, '');
      if (!broken.has(url)) broken.set(url, new Set());
      broken.get(url).add(page);
    }
  }
}

if (broken.size) {
  console.error(`✗ ${broken.size} kırık iç bağlantı bulundu:`);
  for (const [url, pages] of broken) console.error(`  ${url}\n    ← ${[...pages].slice(0, 5).join(', ')}`);
  process.exit(1);
}
console.log(`✓ ${files.length} sayfada kırık iç bağlantı yok.`);
if (KNOWN_MISSING.size) console.log(`  (bilinen ${KNOWN_MISSING.size} eksik görsel yok sayıldı — scripts/check-links.mjs)`);
