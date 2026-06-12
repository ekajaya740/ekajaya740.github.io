// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://workofekajaya.com',
  integrations: [
    react(),
    mdx(),
    sitemap({ changefreq: 'weekly', priority: 0.7, lastmod: new Date(), filter: (page) => !page.includes('/blog') }),
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
