// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || 'https://www.gulderenlab.com';
  
  // Get all blog posts
  const blogPosts = await getCollection('blog');
  const publishedBlogPosts = blogPosts.filter(post => !post.data.isDraft);
  
  // Get all projects
  const projects = await getCollection('projeler');
  const publishedProjects = projects.filter(project => !project.data.isDraft);
  
  // Get all radiology posts
  const radyolojiPosts = await getCollection('radyoloji');
  const publishedRadyolojiPosts = radyolojiPosts.filter(post => !post.data.isDraft);
  
  // Static pages
  const staticPages = [
    {
      url: '',
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: new Date().toISOString()
    },
    {
      url: 'projeler',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: new Date().toISOString()
    },
    {
      url: 'blog',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: new Date().toISOString()
    },
    {
      url: 'radyoloji',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: new Date().toISOString()
    },
    {
      url: 'hesaplama-araclari',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: new Date().toISOString()
    },
    {
      url: 'hakkimizda',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: new Date().toISOString()
    },
    {
      url: 'iletisim',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: new Date().toISOString()
    },
    {
      url: 'gizlilik-politikasi',
      changefreq: 'yearly',
      priority: '0.3',
      lastmod: new Date().toISOString()
    }
  ];
  
  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticPages.map(page => `  <url>
    <loc>${siteUrl}${page.url ? `/${page.url}` : ''}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${publishedBlogPosts.map(post => `  <url>
    <loc>${siteUrl}/blog/${post.slug}/</loc>
    <lastmod>${post.data.publishDate.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${publishedProjects.map(project => `  <url>
    <loc>${siteUrl}/projeler/${project.slug}/</loc>
    <lastmod>${project.data.publishDate.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${publishedRadyolojiPosts.map(post => `  <url>
    <loc>${siteUrl}/radyoloji/${post.slug}/</loc>
    <lastmod>${post.data.publishDate.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
