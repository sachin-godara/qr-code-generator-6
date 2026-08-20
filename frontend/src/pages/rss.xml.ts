import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog');
  return rss({
    title: 'GenerateCustomQR Blog',
    description: 'Expert guides on QR code design, business use cases, print best practices, and industry trends.',
    site: context.site!.toString(),
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.id}/`,
        categories: [post.data.category],
        author: post.data.author,
      })),
    customData: `<language>en-us</language>`,
  });
};
