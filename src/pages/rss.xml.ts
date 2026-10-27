// src/pages/rss.xml.ts — Blog ve projeler için RSS beslemesi
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished, entryUrl } from '../lib/content';
import { SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const [blog, projeler] = await Promise.all([getPublished('blog'), getPublished('projeler')]);
  const items = [
    ...blog.map((e) => ({ e, kind: 'blog' as const })),
    ...projeler.map((e) => ({ e, kind: 'projeler' as const })),
  ]
    .sort((a, b) => b.e.data.publishDate.valueOf() - a.e.data.publishDate.valueOf())
    .map(({ e, kind }) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.publishDate,
      link: entryUrl(kind, e),
      categories: [kind === 'blog' ? 'Blog' : 'Proje', ...(e.data.tags ?? [])],
      author: `${SITE.author.email} (${SITE.author.name})`,
    }));

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: `<language>tr-tr</language>`,
    trailingSlash: true,
  });
}
