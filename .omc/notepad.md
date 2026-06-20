# Notepad
<!-- Auto-managed by OMC. Manual edits preserved in MANUAL section. -->

## Priority Context
<!-- ALWAYS loaded. Keep under 500 chars. Critical discoveries only. -->

## Working Memory
<!-- Session notes. Auto-pruned after 7 days. -->
### 2026-06-20 04:09
## 2026-06-19 Session

### Admin → API Rename
- Renamed `apps/admin/` → `apps/api/`, `@ekajaya/admin` → `@ekajaya/api`
- Updated all references: package.json, AGENTS.md, deploy.yml, route paths (/admin/blog → /api/blog), robots.txt
- Both apps build cleanly

### @ekajaya/database Package Extraction
- Created `packages/database/` with schema (auth + blog), Drizzle client, tsconfig
- Moved from `apps/api/src/db/` → `packages/database/src/`
- Updated imports in apps/api (auth/index.ts, blog posts.ts, blog $slug.ts)
- Added `@ekajaya/database: workspace:*` to api deps
- Build passes

### Technical Audit
- Score: 13/20 (Acceptable)
- 4 P1: hardcoded colors in composed UI, dot nav keyboard focus, dashboard colors, hero 100vh
- 5 P2: theme duplication, touch targets, console.log, prefetchAll, a11y gaps
- 3 P3: useSession hook, Loading text, theme consolidation
- Created 9 GitHub issues (#2-#10), triaged to Project #4

### Blog Status
- Core CRUD works end-to-end (schema, API routes, admin UI, web pages, RSS)
- Gaps: i18n routing (/id/blog), author editing in admin, PUBLIC_API_URL wiring, pagination UI


## MANUAL
<!-- User content. Never auto-pruned. -->

