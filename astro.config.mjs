// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import typography from '@tailwindcss/typography';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.gulderenlab.com', // <-- Sitenizin canlı URL'sini buraya ekleyin!
  integrations: [
    tailwind({
         // applyBaseStyles: false, // Eğer typography eklentisi ile çakışma olursa bunu deneyebilirsiniz
    }),
    // typography() // Tailwind config içindeyse burada olmasına gerek yok, ama zarar vermez
  ]
});