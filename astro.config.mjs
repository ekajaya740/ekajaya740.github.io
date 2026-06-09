// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://workofekajaya.com',
  integrations: [
    react(),
    mdx(),
    sitemap({
      serialize(item) {
        if (item.url === 'https://workofekajaya.com/') {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (item.url === 'https://workofekajaya.com/blog/') {
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (/\/blog\//.test(item.url)) {
          item.priority = 0.6;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        }
        return item;
      },
    }),
    icon({
      include: {
        lucide: ['file-text', 'mail', 'github', 'link', 'linkedin', 'external-link'],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
