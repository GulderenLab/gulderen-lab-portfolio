// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // <-- Eklentiyi import et

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
    typography(), // <-- Eklentiyi buraya ekle
  ],
}