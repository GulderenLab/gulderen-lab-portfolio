// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// 'projeler' adında bir koleksiyon tanımlıyoruz
const projelerCollection = defineCollection({
  type: 'content', // Markdown veya MDX içeriği için 'content' kullanılır
  schema: z.object({
    title: z.string(), // Proje başlığı (zorunlu)
    description: z.string(), // Kısa açıklama (zorunlu)
    publishDate: z.date(), // Yayın tarihi (zorunlu, sıralama için kullanışlı)
    tags: z.array(z.string()), // Etiketler (string dizisi, zorunlu)
    image: z.object({ // Resim bilgisi (obje olarak)
        src: z.string(), // Resim dosya yolu (public klasörüne göre, zorunlu)
        alt: z.string() // Resim alt metni (zorunlu)
    }),
    isDraft: z.boolean().optional().default(false), // Taslak mı? (opsiyonel, varsayılan: false)
    // İsterseniz başka alanlar da ekleyebilirsiniz (örn: githubLink: z.string().url().optional())
  }),
});

// === YENİ BLOG KOLEKSİYONU TANIMI ===
const blogCollection = defineCollection({
  type: 'content', // Markdown içeriği
  schema: z.object({
    title: z.string(), // Yazı başlığı
    description: z.string(), // Kısa özet/açıklama (liste ve SEO için)
    author: z.string().default('Gulderen Lab'), // Yazar (varsayılan değer atayabiliriz)
    publishDate: z.date(), // Yayın tarihi
    tags: z.array(z.string()).optional(), // Etiketler (isteğe bağlı)
    image: z.object({ // Kapak resmi (isteğe bağlı)
        src: z.string(),
        alt: z.string()
    }).optional(),
    isDraft: z.boolean().optional().default(false), // Taslak mı?
    // İsterseniz 'category: z.string().optional()' gibi alanlar ekleyebilirsiniz
  }),
});
// ===================================

// Koleksiyonu dışa aktarıyoruz
export const collections = {
  'projeler': projelerCollection,
  // İleride başka koleksiyonlar (örn: 'blog') buraya eklenebilir
  'blog': blogCollection, // <-- Blog koleksiyonunu ekle
};