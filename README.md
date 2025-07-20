# Gulderen Lab - Teknik Blog ve Proje Sitesi

🚀 **Modern web teknolojileri ile geliştirilmiş Türkçe teknik blog ve proje sergileme sitesi**

Elektronik, gömülü sistemler, web geliştirme ve CAD tasarım konularında teknik içerikler paylaşan kişisel site.

## ✨ Özellikler

- 🌐 **Modern Tech Stack**: Astro, React, TailwindCSS, TypeScript
- 📝 **Teknik Blog**: MDX desteği ile matematik formülleri, kod örnekleri
- 🎯 **3D Model Görüntüleme**: CAD Query projeleri için interaktif 3D modeller
- 📱 **Responsive Design**: Mobil-first yaklaşım
- 🔍 **Arama Özelliği**: Blog yazıları ve projeler için gelişmiş arama
- ⚡ **Performance**: Optimized asset loading ve lazy loading
- 🎨 **Interaktif Bileşenler**: P5.js, GSAP, Framer Motion animasyonları
- 🧮 **Matematik Desteği**: KaTeX ile matematiksel formüller
- 🌙 **Dark Theme**: Geliştirici dostu karanlık tema

## 🛠️ Teknolojiler

### Frontend
- **Astro 5.11**: Static Site Generation
- **React 19**: Interaktif bileşenler
- **TailwindCSS 3.4**: Utility-first CSS framework
- **TypeScript**: Type safety

### Content  Styling
- **MDX**: Markdown with React components
- **KaTeX**: Mathematical expressions
- **Shiki**: Syntax highlighting
- **Tailwind Typography**: Beautiful prose styling

### 3D  Animation
- **Model Viewer**: 3D model display
- **Three.js**: Advanced 3D graphics
- **GSAP**: Professional animations
- **Framer Motion**: React animations
- **P5.js**: Creative coding

## 📁 Proje Yapısı

```text
/
├── public/
│   ├── images/           # Blog ve proje görselleri
│   ├── models/           # 3D modeller (GLTF, GLB, STEP)
│   └── p5/               # P5.js sketch dosyaları
├── src/
│   ├── components/       # Yeniden kullanılabilir bileşenler
│   │   ├── i2c/          # I2C protokolü için özel bileşenler
│   │   └── OrtakModBobinleri/ # Elektronik projeler
│   ├── content/
│   │   ├── blog/         # Blog yazıları (MDX)
│   │   └── projeler/     # Proje koleksiyonu
│   ├── layouts/          # Sayfa şablonları
│   ├── pages/            # Sayfa rotaları
│   └── styles/           # Global stiller
├── scripts/              # Utility ve optimizasyon scriptleri
├── astro.config.mjs      # Astro yapılandırması
└── tailwind.config.js    # Tailwind yapılandırması
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Kurulum
```bash
# Projeyi klonla
git clone https://github.com/GulderenLab/web-page-design.git
cd web-page-design

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

### Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusunu başlat (localhost:4321) |
| `npm run build` | Production build oluştur |
| `npm run preview` | Build'i önizle |
| `npm run clean` | Cache'i temizle |
| `npm run analyze` | Performance analizi yap |
| `npm run optimize` | Tam optimizasyon süreci |

## 📊 Performance Optimizasyonu

### Analiz Çalıştırma
```bash
npm run analyze
```

### Öneriler
1. **Görsel Optimizasyonu**
   - WebP/AVIF formatlarını kullan
   - Lazy loading uygula
   - Responsive images

2. **3D Model Optimizasyonu**
   - GLTF/GLB sıkıştırma
   - Draco compression
   - Progressive loading

3. **Genel Optimizasyon**
   - Service Worker
   - CDN kullanımı
   - Brotli compression

## 🎯 İçerik Yönetimi

### Blog Yazısı Ekleme
```bash
# src/content/blog/ dizinine yeni .mdx dosyası ekle
```

### MDX Frontmatter Örneği
```yaml
---
title: "Yazı Başlığı"
description: "Yazı açıklaması"
publishDate: 2025-01-01
tags: ["elektronik", "programming"]
image:
  src: "/images/kapak.jpg"
  alt: "Kapak görseli"
isDraft: false
---
```

### Proje Ekleme
```bash
# src/content/projeler/ dizinine yeni .md dosyası ekle
```

## 🔧 Geliştirme Notları

### Yeni Bileşen Ekleme
1. `src/components/` altında oluştur
2. TypeScript interface'lerini tanımla
3. Responsive design uygula
4. Accessibility standartlarına uy

### 3D Model Entegrasyonu
1. Model'i `public/models/` dizinine koy
2. GLTF/GLB formatını tercih et
3. Model-viewer component'ini kullan

### Matematik Formülleri
```markdown
# Inline: $E = mc^2$
# Block:
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

## 📱 Mobil Optimizasyon

- Responsive breakpoints
- Touch-friendly interface
- Optimized image loading
- Reduced motion preferences

## 🌐 SEO ve Performans

- Lighthouse score: 95+
- SEO-friendly URLs
- Open Graph metadata
- Sitemap auto-generation
- Fast loading times

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Commit'lerinizi yapın
4. Pull request gönderin

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakınız.

## 🔗 Bağlantılar

- **Site**: [gulderenlab.com](https://gulderenlab.com)
- **GitHub**: [GulderenLab](https://github.com/GulderenLab)
- **LinkedIn**: [Abdullah Gülderen](https://linkedin.com/in/abdullah-gülderen-31120b35b/)

---

⭐ **Projeyi beğendiyseniz star vermeyi unutmayın!**
