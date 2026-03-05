/**
 * Registro centralizado de tags y sus colores.
 * Cuando agregues un nuevo tag, solo hay que agregarlo acá.
 * Si un tag no está registrado, se usa el color fallback (accent).
 */

export interface TagMeta {
  color: string;
}

export const TAGS: Record<string, TagMeta> = {
  web:         { color: '#ff4757' },
  net:         { color: '#00e5ff' },
  linux:       { color: '#ffd32a' },
  crypto:      { color: '#a29bfe' },
  osint:       { color: '#55efc4' },
  thm:         { color: '#fd79a8' },
  fundamentos: { color: '#6c5ce7' },
};

const FALLBACK_COLOR = '#00e5ff';

/**
 * Devuelve el color de un tag. Si no existe, devuelve el fallback.
 */
export function getTagColor(tag: string): string {
  return TAGS[tag.toLowerCase()]?.color ?? FALLBACK_COLOR;
}
