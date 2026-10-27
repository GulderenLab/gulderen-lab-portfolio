// src/content.config.ts — Astro Content Layer API
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 'projeler' adında bir koleksiyon tanımlıyoruz
const projelerCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projeler' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    image: z.object({
        src: z.string(),
        alt: z.string()
    }),
    isDraft: z.boolean().optional().default(false),
  }),
});

// === BLOG KOLEKSİYONU TANIMI (GÜNCELLENDİ) ===
const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Abdullah Gülderen'),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(), // Son güncelleme tarihi (SEO: dateModified)
    tags: z.array(z.string()).default([]),
    image: z.object({
        src: z.string(),
        alt: z.string()
    }).optional(),
    isDraft: z.boolean().optional().default(false),

    // --- SAYFALAMA İÇİN EKLENEN ALANLAR ---
    part: z.number().optional(),               // Bölüm numarası (sayı, isteğe bağlı)
    totalPages: z.number().optional(),         // Toplam bölüm sayısı (sayı, isteğe bağlı)
    seriesSlug: z.string().optional(),         // Serinin anahtar kelimesi (isteğe bağlı)
    prevPageSlug: z.string().nullable().optional(), // Önceki sayfa slug'ı (string, null olabilir, isteğe bağlı)
    nextPageSlug: z.string().nullable().optional(), // Sonraki sayfa slug'ı (string, null olabilir, isteğe bağlı)
    // --------------------------------------

    // 3D Model için özel alan
    modelPath: z.string().optional(), // Modelin public klasöründeki yolu (örn: /models/my_model.glb)
    modelHeight: z.string().optional().default('600px'), // Model görüntüleyici yüksekliği
  }),
});
// ==========================================




// Koleksiyonları dışa aktarıyoruz
export const collections = {
  'projeler': projelerCollection,
  'blog': blogCollection, // Blog koleksiyonu zaten ekliydi

};
