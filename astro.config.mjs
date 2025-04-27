// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// Markdown eklentileri
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Node.js modüllerini import et (HTTPS için dosya yolları)
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import rehypeSlug from 'rehype-slug'; // Başlıklara ID ekler
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // Başlıklara otomatik link ekler

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
  ],

  markdown: {
    remarkPlugins: [remarkMath],
    // TÜM rehype eklentilerini TEK BİR dizi içinde toplayın:
    rehypePlugins: [
      [rehypeKatex, { strict: false }], // Katex
      rehypeSlug,                      // Slug
      [                                // Autolink Headings
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
    host: true, // Yerel ağdan erişime izin vermek için. Astro bazen bunu otomatik yapar ama belirtmek iyi olabilir.
    https: {
      // mkcert ile oluşturulan özel anahtar dosyasının yolu
      // DOSYA ADINI KONTROL EDİN! `mkcert localhost ...` komutunun çıktısındaki ada göre güncelleyin.
      key: path.resolve(__dirname, './localhost+3-key.pem'), // Örnek dosya adı, sizinki farklı olabilir

      // mkcert ile oluşturulan sertifika dosyasının yolu
      // DOSYA ADINI KONTROL EDİN! `mkcert localhost ...` komutunun çıktısındaki ada göre güncelleyin.
      cert: path.resolve(__dirname, './localhost+3.pem'),   // Örnek dosya adı, sizinki farklı olabilir
    },
  },

});

// ÖNEMLİ HATIRLATMALAR:
// 1. Yukarıdaki `key` ve `cert` yollarındaki dosya adlarının (`localhost+3-key.pem`, `localhost+3.pem`)
//    `mkcert localhost <ip-adresiniz>` komutunu çalıştırdığınızda projenizin kök dizininde
//    oluşturulan gerçek dosya adlarıyla eşleştiğinden emin olun. Eğer farklıysa, bu yolları güncelleyin.
// 2. Bu `.pem` dosyalarını `.gitignore` dosyanıza ekleyerek Git reponuza göndermediğinizden emin olun:
//    # .gitignore
//    *.pem