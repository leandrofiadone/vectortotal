import { getCollection, type CollectionEntry } from 'astro:content';
import { toSlug } from './slug';

export type Post = CollectionEntry<'posts'>;

/** Posts publicados (sin drafts). */
export async function getPublishedPosts(): Promise<Post[]> {
  return getCollection('posts', p => !p.data.draft);
}

/**
 * URL canónica de un post. Única fuente de verdad:
 * /salas/<serie>/<subsección>/<slug> si tiene subsección,
 * /salas/<serie>/<slug> si no.
 */
export function postUrl(post: Post): string {
  const { series, subsection } = post.data;
  if (series && subsection) return `/salas/${series}/${toSlug(subsection)}/${post.slug}`;
  if (series) return `/salas/${series}/${post.slug}`;
  return `/salas/${post.slug}`;
}

/**
 * Orden de lectura dentro de una serie: `order` explícito → fecha → slug.
 * El desempate por slug hace que el orden sea determinístico cuando
 * varios posts comparten fecha.
 */
export function byReadingOrder(a: Post, b: Post): number {
  const ao = a.data.order ?? Number.POSITIVE_INFINITY;
  const bo = b.data.order ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  const d = a.data.date.valueOf() - b.data.date.valueOf();
  if (d !== 0) return d;
  return a.slug.localeCompare(b.slug);
}

/** Más nuevo primero, con desempate determinístico. */
export function byNewest(a: Post, b: Post): number {
  const d = b.data.date.valueOf() - a.data.date.valueOf();
  if (d !== 0) return d;
  return a.slug.localeCompare(b.slug);
}

/** Posts de otras áreas que comparten tags, para "seguir leyendo". */
export function relatedPosts(current: Post, all: Post[], limit = 3): Post[] {
  const tags = new Set(current.data.tags.map(t => t.toLowerCase()));
  return all
    .filter(p => p.slug !== current.slug && p.data.series && p.data.series !== current.data.series)
    .map(p => ({
      post: p,
      shared: p.data.tags.filter(t => tags.has(t.toLowerCase())).length,
      distance: Math.abs(p.data.date.valueOf() - current.data.date.valueOf()),
    }))
    .filter(r => r.shared > 0)
    .sort((a, b) => b.shared - a.shared || a.distance - b.distance || a.post.slug.localeCompare(b.post.slug))
    .slice(0, limit)
    .map(r => r.post);
}

/** Títulos h2/h3 del cuerpo MDX (sin bloques de código), para el índice de búsqueda. */
export function extractHeadings(body: string): string[] {
  return body
    .replace(/```[\s\S]*?```/g, '')
    .split(/\r?\n/)
    .filter(l => /^#{2,3}\s+/.test(l))
    .map(l => l.replace(/^#{2,3}\s+/, '').replace(/[*_`]/g, '').trim());
}
