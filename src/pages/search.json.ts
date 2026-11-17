import type { APIRoute } from 'astro';
import { SERIES } from '../data/series';
import { getPublishedPosts, postUrl, byNewest, extractHeadings } from '../utils/posts';

// Índice de búsqueda estático. Lo consume Search.astro (lazy, al abrir el buscador).
export const GET: APIRoute = async () => {
  const posts = (await getPublishedPosts()).filter(p => p.data.series).sort(byNewest);

  const index = posts.map(post => ({
    slug: post.slug,
    title: post.data.title,
    excerpt: post.data.excerpt,
    url: postUrl(post),
    tags: post.data.tags,
    area: SERIES[post.data.series!]?.title ?? post.data.series,
    sub: post.data.subsection ?? null,
    headings: extractHeadings(post.body),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
