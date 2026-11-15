# Work of Ekajaya

The vocabulary of this site. Product names, structural names, and the handful of design terms
that mean something specific here. Terms of general web development do not belong.

## Language

**Work of Ekajaya**:
The site at https://workofekajaya.com, and the name of the brand it presents. Never "the
portfolio site" in user-facing copy.
_Avoid_: the portfolio, my website, the site

**Ekajaya**:
I Putu Ekajaya Awidya Putra. The person the site is about. Rendered in full in the hero and in
structured data, short in bylines and labels.
_Avoid_: the author, the owner, the user

**Portfolio monorepo**:
The repository. A Turborepo with the site in `apps/portfolio/`; it was previously the repo root.
_Avoid_: the repo, the project, the codebase

**Profile**:
A person's public page on Profill.link — a separate product Ekajaya builds, not a page on this
site.
_Avoid_: profile page, user page, account

**Section**:
One horizontal band of the homepage, identified by an `id` that the dot nav links to. There are
exactly six: `hero`, `about`, `experience`, `projects`, `skills`, `contact`.
_Avoid_: block, panel, page, module

**Dot nav**:
The fixed right-hand column of dots that tracks scroll position and links to each section.
Rendered only when the layout is asked for `chrome`.
_Avoid_: side nav, scrollspy, progress bar, anchor menu

**Chrome**:
The home-only page furniture: dot nav, scroll progress bar, and the inline scroll-tracking
script. Blog posts pass `chrome={false}` because none of their targets exist.
_Avoid_: layout, shell, UI, navigation

**Eyebrow**:
The one-line monospace label directly above a section heading, uppercase, accent-colored,
`0.3em` tracking. The site's most repeated structural motif.
_Avoid_: kicker, overline, subtitle, label

**Tracing beam**:
The scroll-linked gradient stroke running down the left of the Experience section. Its lit path
is hidden under `prefers-reduced-motion`.
_Avoid_: timeline, progress line, connector, spine

**Heat map / heat shader**:
The red-yellow-blue field behind the hero, rendered by `WoeHeatmap`. The site's primary identity
asset. "Heat" always refers to this palette and this rendering, never to a generic warm color.
_Avoid_: background, gradient, banner, hero image

**Monogram**:
The hard-edged `W` that dissolves into the heat field inside the shader.
_Avoid_: logo, mark, icon, avatar

**Island**:
A React component hydrated on the client via `client:only="react"`. There are two: the hero and
the tracing beam. A third island is a decision, not a convenience.
_Avoid_: component, widget, client component

**Post**:
A blog entry, one MDX/MD file in `src/content/blog/`, whose filename is its URL slug. Drafts are
not published by any mechanism the build enforces.
_Avoid_: article, blog, entry, page

**Pin**:
The `computedHash` a skill's entry carries in `skills-lock.json`. A skill is installed at the
pinned content or it is drift.
_Avoid_: version, lock, checksum, snapshot

**Standard**:
The repo's own rule set — `AGENTS.md` plus `docs/agents/*` — describing how this codebase is
built. "The standard" never means a general industry convention.
_Avoid_: conventions, guidelines, style guide, best practices

**Area doc**:
One file in `docs/agents/` owning a single area: `frontend.md`, `content.md`, `skills.md`. A rule
lives in exactly one of them, and other mentions point at it.
_Avoid_: documentation, guide, README, wiki

**Trap**:
A bug whose cause lies in a tool's behavior rather than in this code, recorded as symptom →
cause → fix in the area doc that owns it.
_Avoid_: gotcha, pitfall, caveat, footnote
