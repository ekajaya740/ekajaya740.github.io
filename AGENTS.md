# AGENTS.md — Work of Ekajaya Portfolio

## Stack

- **Runtime**: Bun (do not use npm/yarn/pnpm)
- **Framework**: Astro 6 (`astro.config.mjs`), static output mode (SSG)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind`)
- **React Islands**: Only `WoeHeatmap.tsx` uses `client:only="react"` — all other sections are `.astro` components
- **Icons**: Iconify web component (`<iconify-icon>`) via CDN loader in `<head>`. Do NOT use inline SVGs or `@iconify-icon/react`
- **Fonts**: Fontsource CSS imports in `src/styles/global.css` (Goldman, Sansation, Share Tech Mono)
- **Blog**: Astro Content Collections v2 (loader: `glob`) with MDX support. Schema defined in `src/content.config.ts`

## Commands

```bash
bun dev          # Dev server (localhost:4321)
bun run build    # SSG build → dist/
bun run preview  # Preview production build
```

No test runner configured. No linter configured.

## Architecture

```
src/
  components/
    sections/    # All portfolio sections (Astro components, NOT React)
      AboutSection.astro
      ContactSection.astro
      ExperienceSection.astro
      HeroSection.astro
      ProjectsSection.astro
      SkillsSection.astro
    react/
      shaders/WoeHeatmap.tsx  # ONLY React island — client:only="react"
    seo/
      Head.astro, JsonLd.astro, PersonSchema.astro
  layouts/
    BaseLayout.astro  # Global layout: section-dot nav, scroll progress, global.css import
  pages/
    index.astro       # Homepage (assembles all sections)
    blog/index.astro  # Blog list
    blog/[...id].astro # Individual post (MDX rendering)
    rss.xml.ts        # RSS feed
  styles/
    global.css   # Tailwind v4 @theme tokens + @layer base + font imports. MUST be imported in layouts.
  content/
    blog/        # MDX/MD blog posts
  hooks/         # React hooks (useMediaQuery, useContainerSize)
  lib/
    utils.ts     # cn() helper (clsx + tailwind-merge)
```

## Critical Patterns

- **Tailwind v4**: Uses `@theme` block in `global.css` for design tokens (not `tailwind.config.js`). Color tokens: `--color-accent: #dd0303`, `--color-accent-yellow: #fbff1a`, `--color-accent-blue: #1472ff`, `--color-background: #141414`
- **Path alias**: `@/*` maps to `./src/*` (configured in tsconfig.json)
- **Navigation**: Section-dot nav on right side (all viewports). IntersectionObserver tracks active section. No page-based nav.
- **Smooth scroll**: Set via `scroll-behavior: smooth` in `@layer base` in global.css
- **Blog frontmatter**: Must include `title`, `description`, `pubDate`. Optional: `updatedDate`, `author` (defaults to "I Putu Ekajaya Awidya Putra"), `tags`, `draft`, `coverImage`
- **shadcn/ui**: Configured via `components.json` (new-york style, CSS variables). Components go to `src/components/ui/`

## Conventions

- **Commit messages**: Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `ci:`, `build:`, `perf:`)
- **Sections**: Portfolio section IDs must match nav dots (`hero`, `about`, `experience`, `projects`, `skills`, `contact`)
- **Dark theme only**: Design is dark-first. Accent color `#dd0303` (red) from WoeHeatmap shader
- **Font usage**: `--font-display` (Goldman) for headings, `--font-sans` (Sansation) for body, `--font-mono` (Share Tech Mono) for code/labels

## AI Optimization

- `public/robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- `public/llms.txt` has machine-readable portfolio summary
- `PersonSchema.astro` provides JSON-LD structured data for AI crawlers

## Known Gotchas

- `global.css` MUST be imported in every layout — forgetting this causes Tailwind to produce no output
- The `WoeHeatmap` React component uses `client:only="react"` (no SSR) — it renders client-side only
- Content Collections v2 uses `src/content.config.ts` (NOT `src/content/config.ts` which is the v1 pattern)
- Blog post filenames become URL slugs — use kebab-case (e.g., `hello-world.mdx`)