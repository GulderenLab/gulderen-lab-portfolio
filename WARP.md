# WARP.md / AI asistan notları

Bu dosya, depoda çalışan AI kod asistanları (Warp, Claude vb.) için kısa bir rehberdir. Ayrıntılar için `README.md`.

## Özet
- **Gulderen Lab**: Türkçe teknik blog + proje vitrini + hesaplama araçları. Site: https://www.gulderenlab.com
- **Astro 7** (statik), **React 19** adaları, **Tailwind CSS 4** (`@tailwindcss/vite`, yapılandırma `src/styles/tailwind.css` içinde — `tailwind.config.js` YOK).
- Node.js ≥ 22.23.4.

## Kurallar
- İçerik koleksiyonları `src/content.config.ts` içinde (Content Layer API, `glob()` loader). `entry.slug` değil **`entry.id`**, `entry.render()` değil **`render(entry)`** kullanın.
- Taslak filtreleme ve sıralama için `src/lib/content.ts → getPublished()` kullanın.
- Site sabitleri (e-posta, sosyal, OG görseli) yalnızca `src/lib/site.ts` içinde.
- Markdown işlemcisi `astro.config.mjs` içinde `unified()` (remark-math, rehype-katex, rehype-slug, rehype-autolink-headings). Astro 7'nin varsayılan Sätteri işlemcisine geçmeden önce bu eklentilerin karşılıklarını doğrulayın.
- `compressHTML: true` bilinçli olarak ayarlı (Astro 7 varsayılanı `'jsx'` satır içi boşlukları siler).
- Yeni sayfa/yazıdan sonra: `npm run verify && npm run check:links`.
- URL'ler ve başlık id'leri SEO açısından sabit kalmalı; dosya adlarını değiştirmeyin.

## Rotalar
`/`, `/blog/`, `/blog/[slug]/`, `/projeler/`, `/projeler/[slug]/`, `/etiket/`, `/etiket/[tag]/`, `/ara/`, `/hesaplama-araclari/`, `/hakkimizda/`, `/iletisim/`, `/gizlilik-politikasi/`, `/rss.xml`, `/sitemap-index.xml` (+ `/sitemap.xml` uyumluluk dizini), `/robots.txt`, `/404`.
