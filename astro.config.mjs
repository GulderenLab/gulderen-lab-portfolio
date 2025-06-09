// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// Markdown eklentileri
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug'; // Başlıklara ID ekler
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // Başlıklara otomatik link ekler

// Node.js modüllerini import et (HTTPS için dosya yolları)
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Dosya yollarını config dosyasına göre çözmek için helper
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  // Sitenizin canlı URL'si (build ve SSR için önemli)
  site: 'https://www.gulderenlab.com',

  // Entegrasyonlar
  integrations: [
    tailwind({
      // applyBaseStyles: false, // İhtiyacınıza göre bu ayarı kullanabilirsiniz.
    }),
    mdx(),
    sitemap(),
    react(),
  ],

  markdown: {
    remarkPlugins: [remarkMath],
    // TÜM rehype eklentilerini TEK BİR dizi içinde toplayın:
    rehypePlugins: [
      // KaTeX yapılandırması
      [rehypeKatex, {
        // Hata toleransı (bilinmeyen komutlarda hata vermez)
        strict: false,
        // \colorbox ve \fcolorbox gibi komutları etkinleştirmek için bu ayar ZORUNLUDUR.
        trust: true,
      }],
      
      // Slug ve Autolink Headings
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['anchor-link'],
            'aria-hidden': 'true',
            tabIndex: -1,
          },
        },
      ],
    ],
    // syntaxHighlight: 'shiki', // veya 'prism', kod renklendirme kullanıyorsanız ekleyin
    // shikiConfig: { theme: 'github-dark' }, // tema ayarı
  },

  // Geliştirme sunucusu ayarları
  server: {
    host: true, // Yerel ağdan erişime izin vermek için.
    https: {
      // mkcert ile oluşturulan özel anahtar dosyasının yolu
      key: path.resolve(__dirname, './localhost+3-key.pem'),

      // mkcert ile oluşturulan sertifika dosyasının yolu
      cert: path.resolve(__dirname, './localhost+3.pem'),
    },
  },

});

// ÖNEMLİ HATIRLATMALAR:
// 1. Yukarıdaki `key` ve `cert` yollarındaki dosya adlarının
//    projenizin kök dizininde oluşturulan gerçek dosya adlarıyla
//    eşleştiğinden emin olun.
// 2. Bu `.pem` dosyalarını `.gitignore` dosyanıza ekleyerek
//    Git reponuza göndermediğinizden emin olun.