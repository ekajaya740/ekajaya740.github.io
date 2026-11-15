---
version: alpha
name: Work of Ekajaya
description: Dark, bold, kinetic personal site for a full-stack engineer. Near-black field, heat-derived red accent used sparingly, three fixed type roles.
colors:
  primary: "#f5f5f5"
  background: "#141414"
  foreground: "#f5f5f5"
  card: "#1c1c1c"
  border: "#2e2e2e"
  secondary: "#1e1e1e"
  muted: "#2a2a2a"
  muted-foreground: "#a0a0a0"
  accent: "#dd0303"
  accent-yellow: "#fbff1a"
  accent-blue: "#1472ff"
typography:
  display-xl:
    fontFamily: Goldman
    fontSize: 3.75rem
    fontWeight: 700
    lineHeight: 1.05
  display-lg:
    fontFamily: Goldman
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.1
  display-md:
    fontFamily: Goldman
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 1.2
  body-md:
    fontFamily: Sansation
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Sansation
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Share Tech Mono
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.3em"
  code-label:
    fontFamily: Share Tech Mono
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section-md: 96px
  section-lg: 128px
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  tag-pill:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.code-label}"
    rounded: "{rounded.full}"
    padding: 4px
  section-eyebrow:
    backgroundColor: "{colors.background}"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
  section-heading:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.display-md}"
  project-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
  project-card-hover:
    backgroundColor: "{colors.background}"
    textColor: "{colors.accent}"
    rounded: "{rounded.xl}"
    padding: 24px
  section-rule:
    backgroundColor: "{colors.border}"
    height: 1px
  heat-mark:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
---

## Overview

A personal site read in two seconds by someone filtering candidates, then read for depth by
someone judging craft. **Bold, kinetic, technical.** Full-bleed scale, a heat field as the
identity asset, monospace labels, generous vertical rhythm.

Dark is a derived choice, not a default: the palette is lifted from the heat shader, and the
heat reads only against near-black. There is no light mode and there will not be one.

Three audiences, in priority order: recruiters skimming on mobile, prospective clients
checking trustworthiness, peers judging craft. When two rules conflict, the skimming
recruiter wins.

## Colors

Two fields and three accents, and the accents are rationed.

Contrast, measured against the background: foreground 16.9:1 (AAA), muted-foreground 7.0:1
(AAA), accent **3.6:1 — below AA and below the 4.5:1 floor for body text.**

Two places spend that budget, both deliberate and both recorded rather than fixed. The
eyebrow is 12px accent, below the large-text exemption, but it duplicates the heading
directly beneath it, so a reader who cannot resolve it loses nothing. The project card turns
its title accent on hover at 18px bold, also below AA, and it is a hover-only restatement of
text that is foreground otherwise. Never extend the exception to prose, links, or anything
whose only appearance is accent.

- **Background (#141414):** the only page field. Every section sits on it.
- **Foreground (#f5f5f5):** all primary text. Headings and body both.
- **Secondary (#1e1e1e):** the only raised surface — pill fills and secondary-button hover.
  **Card (#1c1c1c)** is defined and used only as the shader's backdrop; no DOM surface is a
  card color, because cards are outlines, not raised fills. **Muted (#2a2a2a)** is defined by
  the shadcn token set and currently has no use; prefer `secondary` for any new raised fill.
- **Border (#2e2e2e):** the hairline that separates sections. One-pixel rules, never fills.
- **Muted-foreground (#a0a0a0):** secondary prose, metadata. Everything that is true but not
  the point.
- **Accent (#dd0303):** the identity. Eyebrows, hover borders, selection, the shader core.
  **Roughly 10% of visual weight, and it earns attention by being rare.** Every additional red
  element devalues the ones already there.
- **Accent-yellow (#fbff1a) and accent-blue (#1472ff):** appear only where heat is literally
  being depicted — the shader and the tracing beam's gradient, and nothing else. A yellow
  button is a defect.

## Typography

Three roles, never blurred, never substituted.

- **Goldman — display.** Headings and the name. Geometric, engineered, slightly alien. Always
  `font-bold`, always `text-balance`.
- **Sansation — body.** Prose, descriptions. Not the Inter monoculture.
- **Share Tech Mono — labels.** Eyebrows, tags, timestamps, buttons. Uppercase, wide tracking
  (`0.3em` on eyebrows). Monospace means *label*, never *code sample*.

Hierarchy comes from scale contrast, not from weight variation or boxes. The display step is
deliberately far from body: 1.875rem against 1rem at mobile, 3rem against 1rem at desktop.
Anything closer reads as a mistake.

## Layout

One measure, held by every scrolling section: **a centred `max-width` of 48rem**, `24px`
gutters, vertical padding `96px` mobile / `128px` desktop. A section that does not match this
has drifted.

Every scrolling section opens with `border-top` in `border`, then padding, then the eyebrow,
then the heading. No section is separated by whitespace alone.

**Hero is the one exception, and it must stay one.** Full-bleed at `100dvh`, edge to edge,
heat shader behind, name block bottom-left. No `border-top`, no centred measure: its text
block caps at 42rem and sits on the left gutter. That contrast between an unbounded hero and
a narrow scrolling column is the page's structure — widening the sections to match the hero
collapses it.

One column. Grids appear only inside a section, for skill groups and project cards.

## Elevation & Depth

Depth is expressed by **contrast and hairlines**, not by lifting surfaces:

- A card is a `border` outline on the background, not a raised surface with a shadow.
- Hover raises a card by turning its border accent, never by moving or scaling it.
- Overlay chrome (the dot nav, the skip link) sits above content with `z-index`, and earns it
  by being fixed, not by silhouette.

There is exactly one shadow in the system: the tracing beam's origin dot carries a red glow
(`rgba(221,3,3,0.4) 0 3px 8px`) while the page is unscrolled, and loses it on first scroll.
That is a signal that the beam is alive, not decoration, and it is scoped to one 16px dot.
Anywhere else, a drop shadow is the fastest way to make this site look like generic SaaS.

## Shapes

Rounded corners are functional, not decorative: `8px` on buttons and inputs, `12px` on
mid-size surfaces, `16px` on cards, full pills only for tags. Nothing is squared off and
nothing is a large soft blob.

The site's geometry is otherwise hard-edged: hairlines, tight circles in the dot nav, a
rectangular heat field. Keep those hard edges — the contrast against rounded cards is
deliberate.

The **monogram** is a hard-edged `W`: no stroke, no outline, flat fill, one sharp diagonal cut
through the lower-right circle. It ships four ways and never gains a fifth — flat `#1C1C1C` on
transparency for the shader mask (`logo.webp`), flat `#1C1C1C` on a white tile (`logo.svg`),
heat gradient on transparency for the standalone mark (`logo-mark.svg` / `.png`, used in OG
cards), and the same dark mark on white for favicons. Fill only; do not round it, outline it,
add a drop shadow, or place it inside a badge.

## Components

- **`button-primary`** — light fill, dark text, one per view: the hero's "Explore" and the
  mail action in Contact. Everything else on the page is secondary.
- **`button-secondary`** — outlined in `border`, transparent fill, hover fills `secondary`
(#1e1e1e) and brightens the border to `foreground`. Any number may appear.
- **`tag-pill`** — mono, uppercase-ish, `4px`/`8px` padding, full radius. Used for skills and
  stacks. A tag is never clickable and never accent-colored.
- **`section-eyebrow`** — the site's most repeated motif. Mono, `0.3em` tracking, uppercase,
  accent, one line, directly above the heading. On OG cards an eyebrow is 22px type on a
  fixed-size bitmap, so it uses the lifted `#ff5a5a` (6.0:1) instead of `#dd0303`; the DOM
  keeps the real token. That lift is an artifact rule, not a second palette.
- **`section-heading`** — Goldman, one sentence, ends with a period. Sentence case in source,
  not title case.
- **`project-card`** — bordered `16px` card, title left and metadata baseline-aligned right,
  hover turns the border and the title accent.

Every interactive element clears `44px` of touch height. Hover states that swap a color use
Tailwind's default `transition-colors` (150ms); only the dot nav's label slide and dot fade
run at `300ms`. Do not lengthen the fast ones — a 300ms border swap feels laggy on a card.
Press states compress to `scale(0.96)` and never change color.

## Do's and Don'ts

**Do**

- Keep the measure at one column and the rhythm identical between sections.
- Let the heat shader be the loudest thing on the page. It is the identity.
- Reach for accent when something must be noticed, then stop.
- Build new artifacts as a crop of the existing site: same tokens, same fonts, same eyebrow.
- Respect `prefers-reduced-motion` for every scroll-linked or looping gesture.

**Don't**

- Don't add a light mode, a theme toggle, or a color-scheme media query.
- Don't add a raw hex where a token exists. Two React islands and the OG renderer write inline
  styles, which Tailwind classes cannot reach, so those files carry literals — that is the only
  sanctioned reason, and the value must already exist in `global.css`.
- Don't use gradient cards, floating mockups, or purple-to-blue washes. That is the exact
  anti-reference.
- Don't decorate with terminal chrome, blinking cursors, or falling code. Dark is not cyberpunk.
- Don't introduce a fourth type role, a new radius, or a second shadow.
- Don't stack two kinetic gestures in one viewport. One orchestrated motion, then stillness.
