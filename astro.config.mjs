// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from '@astrojs/mdx';

// Markdown eklentileri
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Tailwind typography eklentisi (genellikle tailwind.config.mjs içinde kullanılır)
// Eğer tailwind.config.mjs dosyanızda `require('@tailwindcss/typography')` şeklinde
// ekli değilse, burada import etmenizin doğrudan bir etkisi olmayabilir.
// import typography from '@tailwindcss/typography'; // <-- Bu satır muhtemelen gereksizdir eğer Tailwind config içindeyse.

// https://astro.build/config
export default defineConfig({
  // Sitenizin canlı URL'si
  site: 'https://www.gulderenlab.com',

  // Entegrasyonlar
  integrations: [
    tailwind({
      // `applyBaseStyles: false` ayarı genellikle Tailwind typography eklentisiyle
      // birlikte kullanılır. Eğer tailwind.config.mjs içinde typography ayarlıysa
      // bu ayar burada kalabilir veya kaldırılabilir, duruma göre deneyin.
      // applyBaseStyles: false,
    }),
    mdx(),
    // Tailwind'in kendi eklentileri (typography gibi) genellikle Astro integrasyonlarına değil,
    // doğrudan tailwind.config.mjs içindeki `plugins` dizisine eklenir.
    // Bu yüzden `typography()` burada çağrılmamalıdır.
  ],

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
  }
});