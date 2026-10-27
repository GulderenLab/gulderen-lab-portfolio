// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site ?? 'https://www.gulderenlab.com').toString();
  const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${sitemap}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
