/**
 * Estima el tiempo de lectura de un post MDX en minutos.
 * Limpia frontmatter, HTML, bloques de código y código inline
 * antes de contar palabras (200 wpm).
 */
export function readingTime(body: string): number {
  const text = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
