// src/lib/content.ts — İçerik koleksiyonları için ortak yardımcılar
import { getCollection, type CollectionEntry } from 'astro:content';

export type ContentKind = 'blog' | 'projeler';
export type AnyEntry = CollectionEntry<'blog'> | CollectionEntry<'projeler'>;

/** Taslak olmayan (ve üretimde) içerikleri yeniden eskiye sıralı döndürür. */
export async function getPublished<C extends ContentKind>(collection: C): Promise<CollectionEntry<C>[]> {
  const entries = (await getCollection(collection, ({ data }) =>
    import.meta.env.PROD ? !data.isDraft : true,
  )) as CollectionEntry<C>[];
  return entries.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

/** İçeriğin site içindeki adresi (sonunda / ile). */
export function entryUrl(kind: ContentKind, entry: { id: string }): string {
  return `/${kind}/${entry.id}/`;
}

/** Ortalama 200 kelime/dk okuma hızıyla tahmini okuma süresi (dakika). */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const text = body
    .replace(/```[\s\S]*?```/g, ' ') // kod bloklarını sayma
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`$\[\]()!-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Seri navigasyonu: önce `seriesSlug` + `part` ile otomatik bulmaya çalışır,
 * bulunamazsa frontmatter'daki prev/nextPageSlug alanlarını (yalnızca var olan yazılar için) kullanır.
 */
export function getSeriesNav<T extends AnyEntry>(entry: T, all: T[]) {
  const data = entry.data as Record<string, any>;
  const ids = new Set(all.map((e) => e.id));
  let prev: T | undefined;
  let next: T | undefined;
  let series: T[] = [];

  if (data.seriesSlug && typeof data.part === 'number') {
    series = all
      .filter((e) => (e.data as any).seriesSlug === data.seriesSlug && typeof (e.data as any).part === 'number')
      .sort((a, b) => (a.data as any).part - (b.data as any).part);
    const i = series.findIndex((e) => e.id === entry.id);
    prev = i > 0 ? series[i - 1] : undefined;
    next = i >= 0 && i < series.length - 1 ? series[i + 1] : undefined;
  }
  if (!prev && data.prevPageSlug && ids.has(data.prevPageSlug)) prev = all.find((e) => e.id === data.prevPageSlug);
  if (!next && data.nextPageSlug && ids.has(data.nextPageSlug)) next = all.find((e) => e.id === data.nextPageSlug);
  return { prev, next, series };
}

/** Etiket benzerliğine göre ilgili içerikler. */
export function getRelated<T extends AnyEntry>(entry: T, all: T[], limit = 3): T[] {
  const tags = new Set((entry.data.tags ?? []).map((t) => t.toLowerCase()));
  const seriesSlug = (entry.data as any).seriesSlug;
  return all
    .filter((e) => e.id !== entry.id)
    .map((e) => {
      let score = (e.data.tags ?? []).filter((t) => tags.has(t.toLowerCase())).length;
      if (seriesSlug && (e.data as any).seriesSlug === seriesSlug) score -= 0.5; // seri zaten navigasyonda
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.e.data.publishDate.valueOf() - a.e.data.publishDate.valueOf())
    .slice(0, limit)
    .map((x) => x.e);
}

/** Etiketi URL'de kullanılabilir hale getirir (Türkçe karakterler korunur). */
export function tagSlug(tag: string): string {
  return tag
    .toLocaleLowerCase('tr-TR')
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
