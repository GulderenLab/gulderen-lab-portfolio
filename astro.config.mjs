import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Markdown eklentileri
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://www.gulderenlab.com',

  integrations: [
    tailwind(),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: { theme: 'github-dark' },
      gfm: true,
    }),
    sitemap(),
    react({
      include: ['**/react/*', '**/*.jsx', '**/*.tsx']
    }),
  ],

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeKatex, {
        strict: false,
        trust: true,
      }],
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
  },

  server: {
    host: true,
    https: {
      key: path.resolve(__dirname, './localhost+3-key.pem'),
      cert: path.resolve(__dirname, './localhost+3.pem'),
    },
  },
});
