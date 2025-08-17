// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || 'https://www.gulderenlab.com';
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow all search engines to access images
User-agent: Googlebot-Image
Allow: /images/
Allow: /models/

# Block access to admin or private areas (if any)
Disallow: /admin/
Disallow: /private/
Disallow: /.well-known/
Disallow: /api/

# Allow access to important resources
Allow: /scripts/
Allow: /styles/
Allow: /_astro/

# Host directive (helps with canonicalization)
Host: ${siteUrl.replace(/^https?:\/\//, '')}
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
