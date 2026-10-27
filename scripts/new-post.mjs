#!/usr/bin/env node
// scripts/new-post.mjs — Yeni blog yazısı veya proje iskeleti oluşturur.
// Kullanım:
//   npm run new:post -- "Yazının Başlığı"              → src/content/blog/yazinin-basligi.mdx
//   npm run new:post -- "Proje Adı" --proje            → src/content/projeler/proje-adi.mdx
// Dosya isDraft: true ile oluşur; yayınlamak için false yapın.
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const isProject = args.includes('--proje');
const title = args.filter((a) => !a.startsWith('--')).join(' ').trim();
if (!title) {
  console.error('Başlık gerekli: npm run new:post -- "Yazının Başlığı" [--proje]');
  process.exit(1);
}

const trMap = { ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', Ö: 'o', Ş: 's', Ü: 'u' };
const slug = title
  .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => trMap[c])
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const dir = path.resolve('src/content', isProject ? 'projeler' : 'blog');
const file = path.join(dir, `${slug}.mdx`);
if (existsSync(file)) {
  console.error(`Zaten var: ${path.relative(process.cwd(), file)}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const body = `---
title: "${title.replace(/"/g, '\\"')}"
description: "TODO: 150-160 karakterlik, arama sonuçlarında görünecek kısa açıklama."
publishDate: ${today}
# updatedDate: ${today}   # içeriği güncellediğinizde açın
tags: []
${isProject ? '' : '# Seri yazısı ise:\n# seriesSlug: "seri-adi"\n# part: 1\n# totalPages: 3\n'}image:
  src: "/images/og-default.png"   # 1200×630 kapak görseli önerilir
  alt: "TODO: görselin kısa açıklaması"
isDraft: true
---

import { ImageWithCaption } from '@/components/ImageWithCaption.jsx';

## Giriş

Yazınız burada başlıyor. Satır içi formül: $E = mc^2$

$$
V_{out} = V_{in} \\cdot \\frac{R_2}{R_1 + R_2}
$$
`;

await writeFile(file, body, 'utf8');
console.log(`✓ Oluşturuldu: ${path.relative(process.cwd(), file)}  (taslak — yayınlamak için isDraft: false)`);
