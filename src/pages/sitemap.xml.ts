// src/pages/sitemap.xml.ts
// Asıl site haritası @astrojs/sitemap tarafından otomatik üretilir (sitemap-index.xml + sitemap-0.xml).
// Search Console'da daha önce /sitemap.xml kayıtlı olabileceği için bu adres
// otomatik haritaya yönlendiren geçerli bir "sitemap index" olarak korunuyor.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://www.gulderenlab.com')).toString().replace(/\/$/, '');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${base}/sitemap-0.xml</loc></sitemap>
</sitemapindex>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
