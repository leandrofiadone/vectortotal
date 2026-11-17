/**
 * Progreso de lectura, guardado solo en el navegador (localStorage).
 * Cualquier elemento con `data-read-slug="<slug>"` recibe la clase `is-read`
 * cuando ese post ya fue leído hasta el final.
 */
const KEY = 'vt:read';

export function getRead(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter(s => typeof s === 'string') : []);
  } catch {
    return new Set();
  }
}

export function applyReadState(root: ParentNode = document): void {
  const read = getRead();
  root.querySelectorAll<HTMLElement>('[data-read-slug]').forEach(el => {
    el.classList.toggle('is-read', read.has(el.dataset.readSlug ?? ''));
  });

  // Contadores "leídas X/Y": <span data-read-count="slug1,slug2,...">
  root.querySelectorAll<HTMLElement>('[data-read-count]').forEach(el => {
    const slugs = (el.dataset.readCount ?? '').split(',').filter(Boolean);
    const done = slugs.filter(s => read.has(s)).length;
    el.textContent = done > 0 ? `${done}/${slugs.length} leídas` : '';
    el.hidden = done === 0;
  });
}

export function markRead(slug: string): void {
  const read = getRead();
  if (read.has(slug)) return;
  read.add(slug);
  try {
    localStorage.setItem(KEY, JSON.stringify([...read]));
  } catch {
    // Storage bloqueado o lleno: el sitio funciona igual, solo no recuerda.
    return;
  }
  applyReadState();
}
