import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('GenerateCustomQR Team'),
    keywords: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    category: z.enum([
      'guides',
      'use-cases', 
      'design-tips',
      'industry',
      'comparisons',
      'news'
    ]).default('guides'),
    readingTime: z.number().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
