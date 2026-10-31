# portfolio

Astro 6 portfolio site for Work of Ekajaya, a workspace in the root Turborepo.

## Run

From the repo root:

```bash
bun install
bun run dev --filter=portfolio   # http://localhost:4321
bun run build --filter=portfolio # → apps/portfolio/dist
```

Or from this directory: `bun run dev`, `bun run build`, `bun run preview`.

## Structure

```
src/
  components/sections/   portfolio sections (Astro, not React)
  components/react/      React islands (WoeHeatmap, TracingBeam)
  components/seo/        Head, JsonLd, PersonSchema
  layouts/BaseLayout.astro
  pages/                 index, blog, rss.xml.ts, 404
  content/blog/          MDX posts
  styles/global.css      Tailwind v4 @theme tokens
  lib/og/renderer.tsx    Open Graph image renderer
public/                  static assets, robots.txt, llms.txt
```

Design tokens and conventions: [`../../AGENTS.md`](../../AGENTS.md).
