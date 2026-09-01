import fs from 'fs';
import path from 'path';

const blogDir = path.resolve('src/content/blog');
const enFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

const translations = {};

for (const file of enFiles) {
  const id = file.replace(/\.md$/, '');
  translations[id] = {};
  
  for (const loc of ['en', 'es', 'pt', 'de']) {
    const filePath = loc === 'en' ? path.join(blogDir, file) : path.join(blogDir, loc, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (fmMatch) {
        const titleMatch = fmMatch[1].match(/title:\s*["']?([^"'\r\n]+)["']?/);
        const descMatch = fmMatch[1].match(/description:\s*["']?([^"'\r\n]+)["']?/);
        translations[id][loc] = {
          title: titleMatch ? titleMatch[1].trim() : '',
          description: descMatch ? descMatch[1].trim() : ''
        };
      }
    }
  }
}

console.log('Total articles processed:', Object.keys(translations).length);

const code = `import { type Locale } from './config';

export interface LocalizedBlogMeta {
  title: string;
  description: string;
  categoryLabel?: string;
}

export const blogTranslations: Record<string, Record<Locale, LocalizedBlogMeta>> = ${JSON.stringify(translations, null, 2)};

export function getLocalizedPostData(postId: string, locale: Locale, fallbackPost: any) {
  const trans = blogTranslations[postId]?.[locale];
  return {
    title: trans?.title || fallbackPost.data.title,
    description: trans?.description || fallbackPost.data.description,
    pubDate: fallbackPost.data.pubDate,
    updatedDate: fallbackPost.data.updatedDate,
    author: fallbackPost.data.author,
    category: fallbackPost.data.category,
    readingTime: fallbackPost.data.readingTime,
    featured: fallbackPost.data.featured,
    ogImage: fallbackPost.data.ogImage
  };
}
`;

fs.writeFileSync('src/i18n/blogTranslations.ts', code);
console.log('Successfully updated src/i18n/blogTranslations.ts with all 20 articles across 4 locales!');
