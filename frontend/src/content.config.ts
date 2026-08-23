import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
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
});

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: blogSchema,
});

const blog_es = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog/es" }),
  schema: blogSchema,
});

const blog_pt = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog/pt" }),
  schema: blogSchema,
});

const blog_de = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog/de" }),
  schema: blogSchema,
});

export const collections = { blog, blog_es, blog_pt, blog_de };
