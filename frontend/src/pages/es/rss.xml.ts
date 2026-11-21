import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog_es');
  return rss({
    title: 'GenerateCustomQR Blog en Español',
    description: 'Guías expertas sobre diseño de códigos QR, casos de uso empresarial, mejores prácticas de impresión y tendencias del sector.',
    site: context.site!.toString(),
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/es/blog/${post.id}/`,
        categories: [post.data.category],
        author: post.data.author,
      })),
    customData: `<language>es-es</language>`,
  });
};
