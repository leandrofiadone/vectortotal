import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    series: z.string().optional(),
    subsection: z.string().optional(),
    usefulFor: z.array(
      z.object({ area: z.string(), pct: z.number().min(0).max(100) })
    ).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
