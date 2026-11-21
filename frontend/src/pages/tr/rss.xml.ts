import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog_tr');
  return rss({
    title: 'GenerateCustomQR Blog Türkçe',
    description: 'QR kod tasarımı, ticari kullanım örnekleri, baskı ipuçları ve sektör trendleri üzerine uzman rehberler.',
    site: context.site!.toString(),
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/tr/blog/${post.id}/`,
        categories: [post.data.category],
        author: post.data.author,
      })),
    customData: `<language>tr-tr</language>`,
  });
};
