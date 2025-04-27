// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      // Kendi özel renk ve rgb tanımlamalarınız
      colors: {
        'accent': 'rgb(var(--accent-rgb))',
        'accent-light': 'rgb(var(--accent-light-rgb))',
        'accent-dark': 'rgb(var(--accent-dark-rgb))',
        'brand': '#40E0D0', // Turquoise rengi
      },
      rgb: {
         'accent-rgb': '136, 58, 234',
         'accent-light-rgb': '224, 204, 250',
         'accent-dark-rgb': '49, 10, 101',
         'brand-rgb': '64, 224, 208', // Turquoise RGB
      },
      // Typography eklentisi için özelleştirmeler
      typography: (theme) => ({
        DEFAULT: { // Varsayılan 'prose' sınıfı için stiller
          css: {
            // --- RENK AYARLAMALARI (İsteğe bağlı - Ana metin vb. için) ---
            // Eğer tüm prose metinlerini de ayarlamak isterseniz buraya
            // '--tw-prose-body': theme('colors.gray.700'),
            // '--tw-prose-headings': theme('colors.gray.900'),
            // vb. ekleyebilirsiniz. Şimdilik sadece tabloyu etkiliyoruz.
            // --- RENK AYARLAMALARI SONU ---

            // --- Tablo Stilleri (Kaydırma Aktif, Başlık ve Hücre Yazısı Beyaz) ---
            'table': {
              overflowX: 'auto',    // Yatay kaydırmayı etkinleştir
              maxWidth: '100%',     // Kapsayıcıdan taşmasını önle
              borderCollapse: 'collapse', // Kenarlıkları birleştir
              marginTop: theme('spacing.6'), // Üst ve alt boşluk
              marginBottom: theme('spacing.6'),
              // Önemli: Beyaz yazının görünmesi için koyu arka plan gerekebilir.
              // backgroundColor: theme('colors.gray.800'), // Örnek koyu arka plan
              // color: theme('colors.white'), // Alternatif: Tüm tabloya varsayılan beyaz renk
            },
            'thead': { // Tablo başlık satırı (thead) için genel stiller
              borderBottomWidth: '1px', // Başlık altı çizgisi
              borderColor: theme('colors.gray.600'), // Koyu arka plan için kenarlık rengi örneği
            },
            'th': { // Başlık Hücreleri (th) için stiller
              paddingTop: theme('spacing.2'), // Hücre içi boşluklar
              paddingBottom: theme('spacing.2'),
              paddingLeft: theme('spacing.3'),
              paddingRight: theme('spacing.3'),
              verticalAlign: 'baseline', // Dikey hizalama
              whiteSpace: 'normal',    // Metnin hücre içinde alt satıra kaymasına izin ver
              color: theme('colors.white'), // <-- BAŞLIK METİN RENGİ BEYAZ
              fontWeight: theme('fontWeight.semibold'), // Başlıkları biraz kalın yapalım
              textAlign: 'left', // Başlıkları sola hizala
              // Kenarlık rengi thead'den veya table'dan miras alınabilir
              // veya özel olarak ayarlanabilir:
              // borderColor: theme('colors.gray.600'),
            },
            'td': { // Normal Hücreler (td) için stiller
              paddingTop: theme('spacing.2'), // Hücre içi boşluklar
              paddingBottom: theme('spacing.2'),
              paddingLeft: theme('spacing.3'),
              paddingRight: theme('spacing.3'),
              verticalAlign: 'baseline', // Dikey hizalama
              whiteSpace: 'normal',    // Metnin hücre içinde alt satıra kaymasına izin ver
              color: theme('colors.white'), // <-- NORMAL HÜCRE METİN RENGİ DE BEYAZ
              borderBottomWidth: '1px', // Hücrelerin altına çizgi (isteğe bağlı)
              borderColor: theme('colors.gray.700'), // Koyu arka plan için hücre altı çizgi rengi örneği
            },
            // --- Tablo Stilleri Sonu ---

            // --- Diğer Prose Stilleri (Varsayılanlar geçerli) ---
            // ...
            // --- Diğer Prose Stilleri Sonu ---

            // --- KaTeX Stilleri ---
            // Eğer KaTeX kullanıyorsanız ve onun da renklerini ayarlamak isterseniz:
            // '.katex': { color: theme('colors.white'), /* veya başka bir renk */ },
            '.katex-display > .katex': {
              'textAlign': 'center',
            },
            // --- KaTeX Stilleri Sonu ---
          },
        },
        // İsterseniz 'prose-sm', 'prose-lg', 'prose-xl' gibi diğer boyutlar için
        // farklı CSS kuralları tanımlayabilirsiniz.
        // lg: { css: { ... } },
      }),
    },
  },
  plugins: [
    // Tailwind Typography Eklentisi
    typography(),

    // KaTeX display stilleri için özel eklentiniz
    function({ addComponents }) {
      addComponents({
        '.katex-display': {
          display: 'block',
          margin: '1rem 0',
          overflowX: 'auto',
          '-webkit-overflow-scrolling': 'touch',
        }
      })
    }
  ],
}