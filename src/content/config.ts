import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    /** Fecha de última actualización (opcional). Se muestra en el post y va al JSON-LD. */
    updated: z.date().optional(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    series: z.string().optional(),
    subsection: z.string().optional(),
    /** Posición manual dentro de la serie/subsección. Sin esto se ordena por fecha. */
    order: z.number().optional(),
    usefulFor: z.array(
      z.object({ area: z.string(), pct: z.number().min(0).max(100) })
    ).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
