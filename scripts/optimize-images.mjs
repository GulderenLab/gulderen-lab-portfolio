#!/usr/bin/env node
// scripts/optimize-images.mjs
// public/images altındaki büyük PNG/JPG/WebP dosyalarını YERİNDE küçültür (dosya adı ve yolu değişmez).
//  - Genişlik en fazla MAX_WIDTH piksele indirilir (oran korunur, büyütme yapılmaz)
//  - PNG: palet tabanlı sıkıştırma (görsel kalite neredeyse aynı, boyut çok daha küçük)
//  - JPG: mozjpeg q=82, WebP: q=82
// Kullanım: npm run optimize:images  [-- --dry]  [-- --min-kb=300]
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('public/images');
const MAX_WIDTH = 1600;
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const MIN_KB = Number(args.find((a) => a.startsWith('--min-kb='))?.split('=')[1] ?? 300);

async function* walk(dir) {
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let before = 0;
let after = 0;
for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;
  const { size } = await stat(file);
  if (size < MIN_KB * 1024) continue;

  const img = sharp(file, { failOn: 'none' });
  const meta = await img.metadata();
  let pipeline = img.rotate().resize({ width: Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true });
  if (ext === '.png') pipeline = pipeline.png({ palette: true, quality: 85, effort: 10, compressionLevel: 9 });
  else if (ext === '.webp') pipeline = pipeline.webp({ quality: 82 });
  else pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });

  const out = await pipeline.toBuffer();
  if (out.length >= size) {
    console.log(`= ${path.relative(ROOT, file)} zaten optimize (${(size / 1024).toFixed(0)} KB)`);
    continue;
  }
  before += size;
  after += out.length;
  console.log(`✓ ${path.relative(ROOT, file)}: ${(size / 1024).toFixed(0)} KB → ${(out.length / 1024).toFixed(0)} KB`);
  if (!DRY) await writeFile(file, out);
}
if (before) console.log(`\nToplam: ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB${DRY ? ' (deneme, dosyalar değişmedi)' : ''}`);
else console.log('Optimize edilecek büyük görsel bulunamadı.');
