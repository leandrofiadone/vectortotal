// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
