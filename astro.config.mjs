// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readdirSync, readFileSync } from 'node:fs';

// Rutas que solo redirigen: no van al sitemap.
// - /posts/*, /notas, /writeups → URLs viejas
// - /salas/<serie>/<slug> de posts con subsección → redirigen a /salas/<serie>/<subsección>/<slug>
const redirectOnly = new Set();
for (const file of readdirSync('./src/content/posts')) {
  if (!/\.mdx?$/.test(file)) continue;
  const fm = readFileSync(`./src/content/posts/${file}`, 'utf8').split(/^---\s*$/m)[1] ?? '';
  const series = fm.match(/^series:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]?.trim();
  const hasSubsection = /^subsection:\s*\S/m.test(fm);
  if (series && hasSubsection) redirectOnly.add(`/salas/${series}/${file.replace(/\.mdx?$/, '')}/`);
}

const inSitemap = (page) => {
  const { pathname } = new URL(page);
  if (/^\/(posts|notas|writeups)(\/|$)/.test(pathname)) return false;
  return !redirectOnly.has(pathname.endsWith('/') ? pathname : `${pathname}/`);
};

export default defineConfig({
  site: 'https://0xleandro-blog.vercel.app',
  integrations: [
    expressiveCode({
      themes: ['github-dark'],
      styleOverrides: {
        borderColor: 'var(--border, #1e3040)',
        borderRadius: '8px',
        codeFontFamily: "'Share Tech Mono', monospace",
        codeFontSize: '0.85rem',
        codeBackground: 'var(--panel, #0d1520)',
        frames: {
          editorBackground: 'var(--panel, #0d1520)',
          terminalBackground: 'var(--panel, #0d1520)',
          editorTabBarBackground: 'var(--bg3, #162030)',
          terminalTitlebarBackground: 'var(--bg3, #162030)',
          editorActiveTabForeground: 'var(--accent, #00e5ff)',
          editorActiveTabBorderColor: 'var(--accent, #00e5ff)',
          terminalTitlebarForeground: 'var(--text-dim, #5a7a90)',
          tooltipSuccessBackground: '#27c93f',
        },
      },
    }),
    mdx(),
    sitemap({ filter: inSitemap }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
