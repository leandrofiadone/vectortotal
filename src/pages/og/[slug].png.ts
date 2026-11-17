import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SERIES } from '../../data/series';
import { TAGS } from '../../data/tags';

export async function getStaticPaths() {
  const posts = await getCollection('posts', p => !p.data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: {
      title: post.data.title,
      excerpt: post.data.excerpt,
      tags: post.data.tags,
      series: post.data.series,
      date: post.data.date.toISOString(),
    },
  }));
}

// Fuentes locales (TTF) — sin red en build. Antes se bajaban de Google Fonts,
// que ahora responde WOFF2 y satori no lo soporta.
const fontCache = new Map<string, Buffer>();

async function loadFont(file: string): Promise<Buffer> {
  const cached = fontCache.get(file);
  if (cached) return cached;
  const buffer = await readFile(join(process.cwd(), 'src/assets/fonts', file));
  fontCache.set(file, buffer);
  return buffer;
}

type NodeChild = { type: string; props: Record<string, unknown> } | string | null | false;

function node(type: string, props: Record<string, unknown>, children?: NodeChild | NodeChild[]) {
  const cleaned = Array.isArray(children)
    ? children.filter((c): c is NonNullable<NodeChild> => Boolean(c))
    : children;
  return { type, props: { ...props, children: cleaned } };
}

export const GET: APIRoute = async ({ props }) => {
  const { title, excerpt, tags, series, date } = props as {
    title: string;
    excerpt: string;
    tags: string[];
    series?: string;
    date: string;
  };

  const [syne, mono] = await Promise.all([
    loadFont('Syne-ExtraBold.ttf'),
    loadFont('ShareTechMono-Regular.ttf'),
  ]);

  const formattedDate = new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const seriesMeta = series ? SERIES[series] : null;
  const titleSize = title.length > 70 ? 52 : title.length > 50 ? 60 : 68;

  const tagNodes = tags.slice(0, 4).map(tag => {
    const color = TAGS[tag.toLowerCase()]?.color ?? '#00e5ff';
    return node(
      'div',
      {
        style: {
          display: 'flex',
          fontSize: 18,
          color,
          fontFamily: 'Mono',
          border: `1px solid ${color}55`,
          padding: '6px 14px',
          borderRadius: 4,
          background: `${color}12`,
        },
      },
      tag,
    );
  });

  const tree = node(
    'div',
    {
      style: {
        width: 1200,
        height: 630,
        background: '#080c10',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 70px',
        fontFamily: 'Mono',
        color: '#e6e9ee',
      },
    },
    [
      // Top accent line
      node('div', {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1200,
          height: 4,
          background: '#00e5ff',
          display: 'flex',
        },
      }),
      // Brand row
      node(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            fontSize: 24,
            color: '#00e5ff',
            fontFamily: 'Mono',
            marginBottom: 36,
            letterSpacing: '0.02em',
          },
        },
        'vectortotal_',
      ),
      // Series badge
      seriesMeta
        ? node(
            'div',
            {
              style: {
                display: 'flex',
                fontSize: 18,
                color: seriesMeta.color,
                fontFamily: 'Mono',
                marginBottom: 24,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              },
            },
            `${seriesMeta.icon}  ${seriesMeta.title}`,
          )
        : null,
      // Title
      node(
        'div',
        {
          style: {
            display: 'flex',
            fontSize: titleSize,
            color: '#ffffff',
            fontFamily: 'Display',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 28,
            letterSpacing: '-0.02em',
          },
        },
        title,
      ),
      // Excerpt
      node(
        'div',
        {
          style: {
            display: 'flex',
            fontSize: 22,
            color: '#8a9bae',
            fontFamily: 'Mono',
            lineHeight: 1.4,
            marginBottom: 'auto',
          },
        },
        excerpt.length > 180 ? excerpt.slice(0, 177) + '...' : excerpt,
      ),
      // Bottom row
      node(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 40,
          },
        },
        [
          node(
            'div',
            {
              style: { display: 'flex', gap: 10, flexWrap: 'wrap' },
            },
            tagNodes,
          ),
          node(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                fontSize: 16,
                fontFamily: 'Mono',
              },
            },
            [
              node('div', { style: { display: 'flex', color: '#6a7f93' } }, formattedDate),
              node(
                'div',
                { style: { display: 'flex', color: '#3a556b', marginTop: 6 } },
                'vectortotal.vercel.app',
              ),
            ],
          ),
        ],
      ),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Display', data: syne, weight: 800, style: 'normal' },
      { name: 'Mono', data: mono, weight: 400, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
