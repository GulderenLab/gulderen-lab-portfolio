// src/pages/ads.txt.ts — Yetkili dijital satıcılar (IAB ads.txt). AdSense gelirinin
// engellenmemesi için gereklidir. Yayıncı kimliği src/lib/site.ts → ads.client'tan alınır.
import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

export const GET: APIRoute = () => {
  const pub = SITE.ads.client.replace(/^ca-/, '');
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# Reklam yayıncı kimliği henüz tanımlanmadı (src/lib/site.ts → ads.client)\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
