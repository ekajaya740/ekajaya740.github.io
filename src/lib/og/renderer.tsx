import React from 'react';
import type { RenderFunctionInput } from 'astro-takumi';

/**
 * Open Graph card renderer for workofekajaya.com.
 *
 * Runs at build time only (astro:build:done) — nothing here ships to the client.
 * Two variants share one grammar so every card reads as the same family:
 *
 *   /            -> heat portrait  (brand mark as the field, identity block bottom-left)
 *   everything   -> typographic    (eyebrow, Goldman title, description, mono footer)
 *
 * Design rules live in the `design-system` skill (reference/og-images.md).
 * Takumi has no system fonts — every family below must be registered in astro.config.mjs.
 */

const C = {
  bg: '#141414',
  fg: '#f5f5f5',
  muted: '#a0a0a0',
  border: '#2e2e2e',
  /** Site accent is #dd0303, but that reaches only 3.59:1 on the #141414 card,
   *  so the 22px mono eyebrow reads as blended. Same hue, lifted for the card. */
  accent: '#ff5a5a',
  /** Site accent. Too low-contrast as thin type on the card, but fine as a solid
   *  fill behind off-white type (4.71:1) — used for the eyebrow marker. */
  brand: '#dd0303',
} as const;

const DISPLAY = 'Goldman';
const SANS = 'Sansation';
const MONO = 'Share Tech Mono';

const SITE = 'WORKOFEKAJAYA.COM';
const NAME = 'I Putu Ekajaya Awidya Putra';

/** Brand mark, heat-gradient version (transparent field, safe on dark). */
const MARK = '/logo-mark.png';

/** Eyebrow label. `mark` sets the whole label on a solid accent block — the home
 *  role uses it so it reads at full accent strength over the busy mark field. */
function Eyebrow({ text, mark }: { text: string; mark?: boolean }) {
  const base: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontFamily: MONO,
    fontSize: 22,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: C.accent,
  };

  if (!mark) {
    return <div style={base}>{text}</div>;
  }

  return (
    <div style={base}>
      {/* The 14px left padding is cancelled by a negative margin so the marked
          text starts flush with the name below it. */}
      <span
        style={{
          backgroundColor: C.brand,
          color: C.fg,
          padding: '4px 14px 6px',
          marginLeft: -14,
        }}
      >
        {text}
      </span>
    </div>
  );
}

/** Home: full-bleed heat mark with the identity block anchored bottom-left. */
function HeatCard() {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: C.bg,
      }}
    >
      <img
        src={MARK}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Scrim so the name stays legible over the hottest part of the mark. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(to top, rgba(20,20,20,1) 4%, rgba(20,20,20,0.78) 32%, rgba(20,20,20,0.10) 80%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 80px 68px',
          width: '100%',
        }}
      >
        <Eyebrow text="Full-Stack Engineer" mark />
        <div
          style={{
            display: 'flex',
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 88,
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
            color: C.fg,
            marginTop: 22,
          }}
        >
          {NAME}
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: '0.08em',
            color: C.muted,
            marginTop: 26,
          }}
        >
          BALI, INDONESIA / {SITE}
        </div>
        <div style={{ display: 'flex', width: 120, height: 3, backgroundColor: C.accent, marginTop: 30 }} />
      </div>
    </div>
  );
}

/** Typographic card: blog posts and any other route without a bespoke treatment. */
function TypographicCard({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const size = title.length > 90 ? 50 : title.length > 55 ? 62 : 76;
  const desc =
    description && description.length > 150
      ? `${description.slice(0, 147).trimEnd()}...`
      : description;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: C.bg,
        padding: '72px 80px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Eyebrow text={eyebrow} />
        <div
          style={{
            display: 'flex',
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: size,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: C.fg,
            marginTop: 30,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {desc ? (
          <div
            style={{
              display: 'flex',
              fontFamily: SANS,
              fontSize: 26,
              lineHeight: 1.4,
              color: C.muted,
              marginBottom: 30,
              maxWidth: 980,
            }}
          >
            {desc}
          </div>
        ) : null}

        <div style={{ display: 'flex', width: '100%', height: 1, backgroundColor: C.border }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 26,
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: '0.08em',
            color: C.muted,
          }}
        >
          <span>{NAME}</span>
          <span>{SITE}</span>
        </div>
      </div>
    </div>
  );
}

export const ogRenderer = async ({ pathname, title, description }: RenderFunctionInput) => {
  // Home is the only route with the full-bleed heat treatment; everything else
  // (blog, 404, redirect stubs) gets a typographic card so no page lacks an image.
  const route = pathname.replace(/\/+$/, '');
  if (route === '') return <HeatCard />;
  const eyebrow = route.startsWith('/blog') ? 'Blog' : 'Work of Ekajaya';
  return <TypographicCard eyebrow={eyebrow} title={title} description={description} />;
};


export default ogRenderer;
