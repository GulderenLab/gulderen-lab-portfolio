# Gulderen Lab — Teknik Blog ve Proje Sitesi

Elektronik, gömülü sistemler, CAD ve yazılım üzerine Türkçe teknik içerikler: <https://www.gulderenlab.com>

## Teknoloji

| Katman | Kullanılan |
| --- | --- |
| Çatı | **Astro 7** (statik site, Content Layer API) |
| Etkileşim | React 19 adaları (`client:*`) |
| Stil | **Tailwind CSS 4** (`@tailwindcss/vite`, CSS-first `@theme`) + Typography |
| İçerik | Markdown / MDX, KaTeX (derleme zamanında), Shiki |
| Arama | Pagefind (sunucusuz tam metin arama, `/ara/`) |
| 3B | `@google/model-viewer` (yalnızca `<model-viewer>` içeren sayfalarda yüklenir) |
| SEO | Sitemap, RSS (`/rss.xml`, abone rehberi `/abone/`), Open Graph, JSON-LD (WebSite, Person, BlogPosting, BreadcrumbList) |

Gereksinim: **Node.js 22.23.4 veya üstü** (`.nvmrc`). npm kayıt adresi `.npmrc` ile `registry.npmjs.org` olarak sabitlenmiştir.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm install` | Bağımlılıkları kurar |
| `npm run dev` | Geliştirme sunucusu (`localhost:4321`; `localhost+3*.pem` varsa HTTPS) |
| `npm run build` | Üretim derlemesi → `dist/` (Pagefind indeksi dahil) |
| `npm run preview` | Derlenmiş siteyi yerelde önizler |
| `npm run check` | TypeScript / Astro tip kontrolü |
| `npm run verify` | Tip kontrolü + derleme (CI ile aynı) |
| `npm run check:links` | `dist/` içinde kırık iç bağlantıları arar |
| `npm run new:post -- "Başlık"` | Yeni blog taslağı oluşturur (`--proje` ile proje) |
| `npm run optimize:images` | `public/images` altındaki büyük görselleri yerinde küçültür |
| `npm run clean` | `dist` ve önbellekleri siler |

## Proje yapısı

```text
src/
├── content.config.ts     # Koleksiyon şemaları (blog, projeler)
├── content/
│   ├── blog/             # Blog yazıları (.md / .mdx)
│   └── projeler/         # Proje yazıları (.mdx)
├── layouts/
│   ├── Layout.astro      # Temel iskelet: SEO, meta, OG, JSON-LD, header/footer
│   └── PostLayout.astro  # Yazı/proje detay şablonu (TOC, seri, ilgili içerik, paylaşım)
├── lib/
│   ├── site.ts           # Site adı, e-posta, sosyal bağlantılar — TEK KAYNAK
│   └── content.ts        # getPublished, okuma süresi, seri ve ilgili içerik yardımcıları
├── components/           # Header, Footer, TableOfContents, i2c/, OrtakModBobinleri/ ...
├── pages/
│   ├── blog/, projeler/  # Liste + [slug] detay sayfaları
│   ├── etiket/           # Etiket dizini ve etiket sayfaları
│   ├── ara.astro         # Pagefind arama sayfası
│   ├── hesaplama-araclari.astro
│   ├── rss.xml.ts, robots.txt.ts, sitemap.xml.ts, 404.astro
└── styles/tailwind.css   # Tailwind 4 tema belirteçleri ve içerik stilleri
public/
├── images/  models/  p5/  scripts/image-modal.js
scripts/                  # new-post, optimize-images, check-links, performance-analysis
```

## İçerik ekleme

```bash
npm run new:post -- "LM317 ile Ayarlı Güç Kaynağı"          # blog
npm run new:post -- "Mini Osiloskop" --proje                 # proje
```

Frontmatter alanları:

```yaml
---
title: "Yazı Başlığı"
description: "Arama sonuçlarında görünecek 150-160 karakterlik açıklama"
publishDate: 2026-01-15
updatedDate: 2026-02-01        # isteğe bağlı — SEO'da 'dateModified' olur
tags: ["elektronik", "stm32"]
image: { src: "/images/kapak.png", alt: "Kapak açıklaması" }
isDraft: false                 # true ise yalnızca `npm run dev` sırasında görünür
# Seri yazıları (önceki/sonraki bağlantıları otomatik hesaplanır):
seriesSlug: "cad-query-klavuzu"
part: 2
totalPages: 8
---
```

- Seri gezinmesi `seriesSlug` + `part` ile otomatik bulunur; `prevPageSlug`/`nextPageSlug` hâlâ desteklenir ama artık yalnızca var olan yazılara bağlantı verilir.
- Matematik: satır içi `$E = mc^2$`, blok `$$ ... $$` (derleme zamanında KaTeX ile işlenir, tarayıcıda ek betik yüklenmez).
- 3B model: içeriğe `<model-viewer src="/models/x.gltf" ...>` eklemeniz yeterli; kütüphane otomatik yüklenir.

## Site bilgilerini değiştirme

E-posta, sosyal bağlantılar, varsayılan OG görseli gibi bilgiler `src/lib/site.ts` dosyasındadır.

## Sürekli entegrasyon

`.github/workflows/ci.yml` her push / PR'da `npm ci → astro check → build → check-links` çalıştırır.
`.github/dependabot.yml` bağımlılık güncellemeleri için haftalık PR açar.

## Bağlantılar

- Site: [gulderenlab.com](https://www.gulderenlab.com)
- GitHub: [GulderenLab](https://github.com/GulderenLab)
- LinkedIn: [Abdullah Gülderen](https://linkedin.com/in/abdullah-gülderen-31120b35b/)
