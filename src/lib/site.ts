// src/lib/site.ts — Site genelinde kullanılan tek kaynak (single source of truth)
export const SITE = {
  name: 'Gulderen Lab',
  title: 'Gulderen Lab',
  description:
    'Elektronik, gömülü sistemler, CAD ve yazılım üzerine Türkçe teknik yazılar, projeler ve hesaplama araçları.',
  url: 'https://www.gulderenlab.com',
  locale: 'tr_TR',
  lang: 'tr',
  author: {
    name: 'Abdullah Gülderen',
    email: 'gulderenabdullah@gmail.com',
    jobTitle: 'Elektronik & Yazılım Geliştirici',
  },
  social: {
    github: 'https://github.com/GulderenLab',
    linkedin: 'https://linkedin.com/in/abdullah-gülderen-31120b35b/',
  },
  defaultOgImage: '/images/og-default.png',
  themeColor: '#0f172a',

  /**
   * Reklam ayarları (Google AdSense).
   * 1) AdSense hesabınızdaki yayıncı kimliğini `client` alanına yazın: 'ca-pub-1234567890123456'
   * 2) AdSense > Reklamlar > "Reklam birimine göre" bölümünde her yerleşim için bir
   *    "Görüntülü reklam" birimi oluşturup veri-reklam-alanı (data-ad-slot) numarasını aşağıya yazın.
   * `client` boşken sitede hiçbir reklam kodu yüklenmez; `npm run dev` sırasında yalnızca
   * reklamların duracağı yerler kesikli çerçeveyle gösterilir.
   */
  ads: {
    enabled: true,
    client: 'ca-pub-9326448562655435',
    slots: {
      /** Yazı/proje sayfası — geniş ekranlarda sağ boşlukta, kaydırırken sabit kalan dikey alan */
      sidebar: '',
      /** Uzun yazıların ortasında, iki ana başlık arasında (yalnızca ≥ 4 ana başlıklı yazılar) */
      inArticle: '',
      /** Yazı/proje bitiminde, "İlgili yazılar" bölümünden önce */
      afterArticle: '',
      /** Blog / proje / etiket listelerinin altında */
      listing: '',
      /** Hesaplama araçları sayfasının altında */
      tools: '',
    },
  },
} as const;

export type AdSlotName = keyof typeof SITE.ads.slots;
