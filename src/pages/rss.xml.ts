import type { APIRoute } from 'astro';
import { SERIES } from '../data/series';
import { getPublishedPosts, postUrl, byNewest } from '../utils/posts';

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// Feed RSS 2.0 generado a mano (sin dependencias extra).
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? 'https://0xleandro-blog.vercel.app').replace(/\/$/, '');
  const posts = (await getPublishedPosts()).filter(p => p.data.series).sort(byNewest);

  const items = posts
    .map(post => {
      const url = `${base}${postUrl(post)}`;
      const categories = [SERIES[post.data.series!]?.title, ...post.data.tags]
        .filter((c): c is string => Boolean(c))
        .map(c => `      <category>${escapeXml(c)}</category>`)
        .join('\n');
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.excerpt)}</description>
${categories}
    </item>`;
    })
    .join('\n');

  const lastBuild = (posts[0]?.data.date ?? new Date()).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>vectortotal</title>
    <link>${base}/</link>
    <description>Apuntes de seguridad ofensiva, redes y CTFs. En español.</description>
    <language>es-AR</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
