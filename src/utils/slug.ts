/**
 * Convierte un string a slug URL-safe.
 * "Network Essentials" → "network-essentials"
 */
export function toSlug(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}
