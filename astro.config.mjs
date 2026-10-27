// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';

// Markdown eklentileri
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Yerel HTTPS sertifikaları (mkcert) varsa geliştirme sunucusunda kullan,
// yoksa düz HTTP ile çalış. Böylece proje başka bir bilgisayarda da sorunsuz açılır.
const certKey = path.resolve(__dirname, './localhost+3-key.pem');
const certFile = path.resolve(__dirname, './localhost+3.pem');
const https = existsSync(certKey) && existsSync(certFile) ? { key: certKey, cert: certFile } : undefined;

export default defineConfig({
  site: 'https://www.gulderenlab.com',
  trailingSlash: 'ignore',

  // Astro 7 varsayılanı ('jsx') satır içi öğeler arasındaki boşlukları silebiliyor;
  // mevcut içeriğin görünümünü korumak için HTML kuralları kullanılıyor.
  compressHTML: true,

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'tr', locales: { tr: 'tr-TR' } },
      filter: (page) => !page.includes('/api/'),
    }),
    react({
      include: ['**/*.jsx', '**/*.tsx'],
    }),
  ],

  markdown: {
    // Astro 7 varsayılan olarak Sätteri kullanır; remark/rehype eklentilerimiz
    // (KaTeX, başlık bağlantıları) için unified işlemcisini açıkça seçiyoruz.
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [
          rehypeKatex,
          {
            strict: false,
            trust: true,
            output: 'htmlAndMathml',
            macros: {
              '\\iç': '\\text{iç}',
            },
          },
        ],
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              className: ['anchor-link'],
              ariaHidden: 'true',
              tabIndex: -1,
            },
          },
        ],
      ],
    }),
    shikiConfig: {
      theme: 'github-dark',
    },
  },

  server: {
    host: true,
  },

  vite: {
    plugins: [tailwindcss()],
    server: https ? { https } : {},
  },
});
