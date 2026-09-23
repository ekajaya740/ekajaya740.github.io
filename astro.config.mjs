// @ts-check
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import astroTakumi from 'astro-takumi';
import { ogRenderer } from './src/lib/og/renderer.tsx';

const fontFile = (pkg, file) =>
  fs.readFileSync(fileURLToPath(import.meta.resolve(`${pkg}/files/${file}`)));

// Takumi has no system fonts — every family used by the OG renderer must be registered here.
const ogFonts = [
  fontFile('@fontsource/goldman', 'goldman-latin-400-normal.woff'),
  fontFile('@fontsource/goldman', 'goldman-latin-700-normal.woff'),
  fontFile('@fontsource/sansation', 'sansation-latin-400-normal.woff'),
  fontFile('@fontsource/share-tech-mono', 'share-tech-mono-latin-400-normal.woff'),
];
// https://astro.build/config
export default defineConfig({
  site: 'https://workofekajaya.com',
  integrations: [
    react(),
    mdx(),
    astroTakumi({
      options: {
        fonts: ogFonts,
        format: 'webp',
        quality: 90,
        images: [{ src: '/logo-mark.png', data: fs.readFileSync('./public/logo-mark.png') }],
      },
      render: ogRenderer,
    }),
    // Exclude only the /blog index stub (a redirect while the section is "coming
    // soon"); individual posts stay listed so they remain discoverable.
    sitemap({ changefreq: 'weekly', priority: 0.7, lastmod: new Date(), filter: (page) => page !== 'https://workofekajaya.com/blog/' }),
    icon({
      include: {
        lucide: ['mail', 'github', 'link', 'linkedin', 'external-link'],
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
