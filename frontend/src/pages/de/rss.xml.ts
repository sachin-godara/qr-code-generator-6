import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog_de');
  return rss({
    title: 'GenerateCustomQR Blog auf Deutsch',
    description: 'Expertenleitfäden zu QR-Code-Design, geschäftlichen Anwendungsfällen, Drucktipps und Branchentrends.',
    site: context.site!.toString(),
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/de/blog/${post.id}/`,
        categories: [post.data.category],
        author: post.data.author,
      })),
    customData: `<language>de-de</language>`,
  });
};
