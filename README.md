# Work of Ekajaya — Turborepo

Monorepo for [workofekajaya.com](https://workofekajaya.com) and future projects.

## Layout

```
apps/
  ekajaya740.github.io/   Astro 6 portfolio site (deployed to GitHub Pages)
packages/                 shared packages (empty for now)
turbo.json                Turborepo task graph
```

## Setup

```bash
git clone --recurse-submodules git@github.com:ekajaya740/ekajaya740.github.io.git
cd ekajaya740.github.io
bun install
bun run dev
```

`--recurse-submodules` is required: `.agents/skills` is a submodule.

## Commands

| Command | Action |
| :-- | :-- |
| `bun run dev` | Turbo dev for every workspace (site at `localhost:4321`) |
| `bun run build` | Turbo build; site output in `apps/ekajaya740.github.io/dist` |
| `bun run preview` | Preview the production build |
| `bun run clean` | Clean task outputs and `node_modules` |
| `bun run dev --filter=<package>` | Target a single workspace |

## Deploy

`.github/workflows/deploy.yml` builds with Turbo and publishes
`apps/ekajaya740.github.io/dist` to GitHub Pages on every push to `main`.

Site docs: [`apps/ekajaya740.github.io/README.md`](apps/ekajaya740.github.io/README.md),
agent conventions: [`AGENTS.md`](AGENTS.md).
