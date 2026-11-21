import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog_pt');
  return rss({
    title: 'Blog GenerateCustomQR em Português',
    description: 'Guias especializados sobre design de códigos QR, casos de uso comercial, melhores práticas de impressão e tendências do setor.',
    site: context.site!.toString(),
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/pt/blog/${post.id}/`,
        categories: [post.data.category],
        author: post.data.author,
      })),
    customData: `<language>pt-br</language>`,
  });
};
