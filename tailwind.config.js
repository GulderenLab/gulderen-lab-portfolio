// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // <-- Eklentiyi import et
// Gerekirse: import plugin from 'tailwindcss/plugin'; // Genelde inline fonksiyon için gerekmez

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      // Kendi özel renklerimizi buraya ekliyoruz
      colors: {
        // global.css'teki değişkenleri buraya taşıyoruz
        // İsimlendirme size kalmış, kısa ve anlaşılır olması iyi olur
        'accent': 'rgb(var(--accent-rgb))', // RGB formatını kullanmak için değişken tanımlayacağız
        'accent-light': 'rgb(var(--accent-light-rgb))',
        'accent-dark': 'rgb(var(--accent-dark-rgb))',
        'brand': '#40E0D0', // Turquoise renginin HEX kodu

        // Veya doğrudan değerleri verebilirsiniz (opacity ile kullanılamaz)
        // 'accent': '#883aea', // 136, 58, 234'ün HEX karşılığı (yaklaşık)
        // 'accent-light': '#e0cafa', // 224, 204, 250'nin HEX karşılığı (yaklaşık)
        // 'accent-dark': '#310a65', // 49, 10, 101'in HEX karşılığı (yaklaşık)
      },
      // RGB değerlerini CSS değişkeni olarak tanımlayalım (opacity ile kullanmak için)
      // Bu kısım doğrudan theme.extend altına, colors ile aynı seviyede
      rgb: {
         'accent-rgb': '136, 58, 234',
         'accent-light-rgb': '224, 204, 250',
         'accent-dark-rgb': '49, 10, 101',
         'brand-rgb': '64, 224, 208', // Turquoise RGB
      }
    },
  },
  plugins: [
    typography(), // <-- Mevcut eklenti

    // --- YENİ EKLENEN KISIM ---
    // KaTeX display stilleri için özel eklenti
    function({ addComponents }) {
      addComponents({
        '.katex-display': {
          margin: '1rem 0',       // margin-top ve margin-bottom 1rem
          overflowX: 'auto',    // Yatay taşma olursa scroll bar göster
          // Not: CSS özelliklerini JS objelerinde camelCase (overflowX)
          // veya tırnak içinde kebab-case ('overflow-x') olarak yazabilirsiniz.
        }
        // Başka özel component stilleri de buraya ekleyebilirsiniz
        // '.baska-bir-sinif': { ... }
      })
    }
    // --- YENİ EKLENEN KISIM SONU ---
  ],
}

