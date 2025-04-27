// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        'accent': 'rgb(var(--accent-rgb))',
        'accent-light': 'rgb(var(--accent-light-rgb))',
        'accent-dark': 'rgb(var(--accent-dark-rgb))',
        'brand': '#40E0D0',
      },
      rgb: {
         'accent-rgb': '136, 58, 234',
         'accent-light-rgb': '224, 204, 250',
         'accent-dark-rgb': '49, 10, 101',
         'brand-rgb': '64, 224, 208',
      },
      // --- YENİ EKLENEN/GÜNCELLENEN TYPOGRAPHY KISMI ---
      typography: (theme) => ({
        DEFAULT: { // Varsayılan 'prose' sınıfı için stiller
          css: {
            // ... (typography eklentisinin diğer varsayılan stilleri burada geçerli olur)

            // Tablolar için özelleştirme
            'table': {
              display: 'block',        // Tabloyu blok seviyesine getir
              overflowX: 'auto',     // Yatay taşma olursa kaydır
              whiteSpace: 'nowrap',    // Hücre içeriğinin alta kaymasını engelle (önerilir)
              maxWidth: '100%',      // Kapsayıcının genişliğini aşmasın
              borderCollapse: 'collapse', // Kenarlıkları birleştir
              marginTop: theme('spacing.6'), // Üst boşluk (isteğe bağlı, temanıza göre ayarlayın)
              marginBottom: theme('spacing.6'),// Alt boşluk (isteğe bağlı)
              // İsteğe bağlı: Tabloya hafif bir kenarlık ekleyebilirsiniz
              // borderWidth: '1px',
              // borderColor: theme('colors.gray.200', 'currentColor'), // Temanızdan renk alın
              // borderRadius: theme('borderRadius.md'), // Köşe yuvarlatma (isteğe bağlı)
            },
            // İsteğe bağlı: typography'nin varsayılan hücre stillerini koru/ayarla
            'thead': {
               borderBottomWidth: '1px', // Başlık altı çizgisi (typography zaten ekleyebilir)
               borderColor: theme('colors.gray.300', 'currentColor'),
            },
            'td, th': {
               // typography eklentisi zaten dolgu ve hizalama verir,
               // ama isterseniz burada üzerine yazabilirsiniz.
               paddingTop: theme('spacing.2'),
               paddingBottom: theme('spacing.2'),
               paddingLeft: theme('spacing.3'),
               paddingRight: theme('spacing.3'),
               verticalAlign: 'baseline', // Hizalama (varsayılan genellikle iyidir)
               // Kenarlıklar (typography zaten ekleyebilir)
               // borderBottomWidth: '1px',
               // borderColor: theme('colors.gray.200', 'currentColor'),
            },
            // KaTeX için varsayılan stilleri korumak önemli olabilir (eğer kullanılıyorsa)
            '.katex-display > .katex': {
              'text-align': 'center', // Örnek KaTeX stili
            },
            // --- Tablo özelleştirme sonu ---

            // Mevcut KaTeX display stiliniz burada da tanımlanabilir
            // Ancak eklenti olarak eklemek de geçerli bir yöntemdir.
            // '.katex-display': {
            //   margin: '1rem 0',
            //   overflowX: 'auto',
            // }
          },
        },
        // İsterseniz 'prose-sm', 'prose-lg' gibi diğer boyutlar için de
        // farklı tablo stilleri tanımlayabilirsiniz.
        // lg: { css: { table: { ... } } },
      }),
      // --- TYPOGRAPHY KISMI SONU ---
    },
  },
  plugins: [
    typography(), // <-- Mevcut eklenti

    // KaTeX display stilleri için özel eklentiniz (Bu kalabilir, çalışır)
    function({ addComponents }) {
      addComponents({
        '.katex-display': {
          display: 'block', // Katex'in düzgün çalışması için block olabilir
          margin: '1rem 0',
          overflowX: 'auto',
          '-webkit-overflow-scrolling': 'touch', // iOS için akıcı kaydırma
        }
      })
    }
  ],
}