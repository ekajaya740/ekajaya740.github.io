# AGENTS.md — Work of Ekajaya Portfolio

## Branches

- **Default work branch**: `beta` — all feature work, refactors, and non-critical changes go here.
- **`main`**: Production. Only merge from `beta` when ready to deploy. Direct commits to `main` only for hotfixes or deploy-critical config.
- **Deploy**: `main` → GitHub Pages (`@ekajaya/web`) + Cloudflare Workers production (`@ekajaya/admin`).

## Stack

- **Runtime**: Bun (do not use npm/yarn/pnpm)
- **Monorepo**: Turborepo with Bun workspaces (`apps/*`, `packages/*`)
- **Web**: Astro 6 SSG → GitHub Pages
- **Admin**: TanStack Start (React SSR) → Cloudflare Workers (D1 + R2)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind`)
- **Icons**: `astro-icon` with `@iconify-json/lucide` — icons inlined as SVG at build time. Use `<Icon name="lucide:icon-name" size={16} />` from `astro-icon/components`. New icons must be added to the `include` list in `astro.config.mjs`.
- **Fonts**: Fontsource CSS imports in `@ekajaya/config/tailwind.css` (Goldman, Sansation, Share Tech Mono)
- **Blog**: Astro Content Collections v2 (loader: `glob`) with MDX support. Schema in `apps/web/src/content.config.ts`
- **shadcn/ui**: Configured in `packages/ui/components.json` (new-york style, CSS variables). Components go to `packages/ui/src/components/ui/`

## Commands

```bash
bun install                   # Install all workspace deps
bun dev                       # Run all dev servers (turbo dev)
bun run build                 # Build all apps (turbo build)
bun run build --filter=@ekajaya/web    # Build web only
bun run build --filter=@ekajaya/admin  # Build admin only
```

No test runner configured. No linter configured.

## Architecture

```
ekajaya740.github.io/
├── apps/
│   ├── web/                  # @ekajaya/web — Astro 6 SSG → GitHub Pages
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── sections/     # All portfolio sections (.astro, NOT React)
│   │   │   │   ├── react/
│   │   │   │   │   ├── section/HeroSection.tsx
│   │   │   │   │   └── shaders/WoeHeatmap.tsx  # ONLY React island — client:only="react"
│   │   │   │   └── seo/          # Head.astro, JsonLd.astro, PersonSchema.astro
│   │   │   ├── layouts/BaseLayout.astro
│   │   │   ├── pages/
│   │   │   ├── styles/global.css # Imports @ekajaya/config/tailwind.css
│   │   │   └── content/blog/     # MDX blog posts
│   │   ├── public/
│   │   └── astro.config.mjs
│   └── admin/                # @ekajaya/admin — TanStack Start → Cloudflare Workers
│       ├── src/
│       │   ├── routes/           # File-based: __root.tsx, index.tsx, api/health.ts, api/v1/info.ts
│       │   ├── router.tsx        # getRouter() + type registration
│       │   ├── ssr.tsx           # createStartHandler
│       │   ├── client.tsx        # hydrateRoot
│       │   └── server.ts         # Cloudflare createServerEntry
│       ├── vite.config.ts        # cloudflare() + tanstackStart() + react()
│       └── wrangler.jsonc        # D1 + R2 bindings (dev/staging/production)
├── packages/
│   ├── config/               # @ekajaya/config — shared Tailwind theme + tsconfig base
│   ├── hooks/                # @ekajaya/hooks — useMediaQuery, useContainerSize
│   └── ui/                   # @ekajaya/ui — cn() helper, shadcn config, UI components
├── turbo.json
├── tsconfig.json             # Root base TS config
└── package.json              # Workspace root
```

## Internal Package Imports

| Old (`@/` alias) | New (workspace package) |
|---|---|
| `@/lib/utils` (cn helper) | `@ekajaya/ui/utils` |
| `../../hooks/useMediaQuery` | `@ekajaya/hooks` |
| `../../hooks/useContainerSize` | `@ekajaya/hooks` |
| `@/styles/global.css` | Import `@ekajaya/config/tailwind.css` |

App-local imports (`@/components/sections/*`, `@/layouts/*`, `@/pages/*`) stay unchanged — `@/*` still maps to `apps/web/src/*`.

## Critical Patterns

- **Tailwind v4**: `@theme` tokens live in `packages/config/src/tailwind.css`. Web app imports it via `@import "@ekajaya/config/tailwind.css"`. Color tokens: `--color-accent: #dd0303`, `--color-accent-yellow: #fbff1a`, `--color-accent-blue: #1472ff`, `--color-background: #141414`
- **Path alias**: `@/*` maps to `./src/*` in each app's tsconfig (NOT across packages)
- **Navigation**: Section-dot nav on right side (all viewports). IntersectionObserver tracks active section in BaseLayout.astro
- **Smooth scroll**: Set via `scroll-behavior: smooth` in `@layer base` in global.css
- **Blog frontmatter**: Must include `title`, `description`, `pubDate`. Optional: `updatedDate`, `author` (defaults to "I Putu Ekajaya Awidya Putra"), `tags`, `draft`, `coverImage`
- **Font usage**: `--font-display` (Goldman) for headings, `--font-sans` (Sansation) for body, `--font-mono` (Share Tech Mono) for code/labels

## Conventions

- **Commit messages**: Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `ci:`, `build:`, `perf:`)
- **Sections**: Portfolio section IDs must match nav dots (`hero`, `about`, `experience`, `projects`, `skills`, `contact`)
- **Dark theme only**: Design is dark-first. Accent color `#dd0303` (red) from WoeHeatmap shader

## Deploy Targets

| App | Trigger | Target | Env |
|---|---|---|---|
| `@ekajaya/web` | Push to `main` | GitHub Pages | — |
| `@ekajaya/admin` | Push to `main` | Cloudflare Workers | `production` |
| `@ekajaya/admin` | Push to `beta` | Cloudflare Workers | `staging` |

## AI Optimization

- `public/robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- `public/llms.txt` has machine-readable portfolio summary
- `PersonSchema.astro` provides JSON-LD structured data for AI crawlers

## Known Gotchas

- `global.css` MUST be imported in every layout — forgetting this causes Tailwind to produce no output
- The `WoeHeatmap` React component uses `client:only="react"` (no SSR) — it renders client-side only
- Content Collections v2 uses `src/content.config.ts` (NOT `src/content/config.ts` which is the v1 pattern)
- Blog post filenames become URL slugs — use kebab-case (e.g., `hello-world.mdx`)
- `tsconfig.json` extends use relative paths (`../../tsconfig.json`), NOT package names — Vite/esbuild can't resolve package-based extends
- `packages/config/tsconfig.base.json` was removed; root `tsconfig.json` is the single base

## Skill Auto-Loading

Before starting related work, you MUST read the corresponding skill instructions:

| Skill | Trigger |
|---|---|
| `astro` | Any `.astro` file edit, Astro config, content collections, or SSG build |
| `shadcn` | Any `packages/ui/src/components/ui/` work, `components.json` changes, or shadcn component usage |
| `frontend-design` | New UI/page design, aesthetic direction, typography choices |
| `design-taste-frontend` | Component architecture, CSS, visual polish review |
| `ui-ux-pro-max` | UI/UX planning, component design, style selection |
| `web-design-guidelines` | Design review, accessibility audit, UX critique |
| `web-perf` | Performance audit, Core Web Vitals, load time optimization |
| `seo` | Meta tags, structured data, sitemaps, search visibility |
| `ai-seo` | AI search visibility, LLM citations, AEO/GEO optimization |
| `seo-aeo-best-practices` | JSON-LD, Open Graph, robots.txt, hreflang |
| `no-use-effect` | Writing or reviewing any React component with `useEffect` |
| `humanizer` | Editing or reviewing blog post content, marketing copy |
| `pdf` | Working with PDF files (generate, read, merge, split) |
| `agent-browser` | Browser automation, screenshots, form testing |
| `find-keywords` | Keyword research for blog posts or SEO |
| `github-actions` | CI/CD workflows, `.github/workflows/` changes, deployment automation |

Read via `read("skill://<name>")` before the first related edit.
