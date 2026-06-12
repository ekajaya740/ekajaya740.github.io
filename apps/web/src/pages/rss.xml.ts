import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: string | URL | undefined; }) {
  const posts = await getCollection('blog');
  const published = posts.filter((p) => !p.data.draft);
  published.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Work of Ekajaya',
    description: 'Thoughts on engineering, systems, and building things that matter.',
    site: context.site || 'https://workofekajaya.com',
    items: published.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `
      <language>en</language>
      <image>
        <url>https://workofekajaya.com/og-default.png</url>
        <title>Work of Ekajaya</title>
        <link>https://workofekajaya.com</link>
      </image>
    `,
  });
}

