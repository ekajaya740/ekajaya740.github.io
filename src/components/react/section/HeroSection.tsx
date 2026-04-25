import { WoeHeatmap, type WoeHeatmapProps } from '../shaders/WoeHeatmap';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useContainerSize } from '../../../hooks/useContainerSize';

interface ShaderPreset {
  scale: number;
  offsetX: number;
  offsetY: number;
}

function getPreset(aspect: number): ShaderPreset {
  if (aspect < 0.75) return { scale: 1.0, offsetX: 0, offsetY: 0 };
  if (aspect < 1.0) return { scale: 0.75, offsetX: 0.05, offsetY: 0 };
  if (aspect < 1.6) return { scale: 0.8, offsetX: 0.15, offsetY: 0 };
  if (aspect < 2.2) return { scale: 0.95, offsetX: 0.3, offsetY: 0 };
  return { scale: 1.1, offsetX: 0.25, offsetY: 0 };
}

export default function HeroSection() {
  const { ref: containerRef, aspect } = useContainerSize();

  const isMobilePortrait = useMediaQuery('(max-width: 768px) and (orientation: portrait)');
  const isTabletPortrait = useMediaQuery('(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)');
  const isShortScreen = useMediaQuery('(max-height: 600px)');

  const preset = getPreset(aspect);
  console.log(aspect)

  const scale = isShortScreen ? Math.max(0.6, preset.scale - 0.15) : preset.scale;
  const offsetX = preset.offsetX;
  const offsetY = isMobilePortrait ? -0.3 : isTabletPortrait ? -0.2 : isShortScreen ? -0.4 : preset.offsetY;

  const shaderProps: WoeHeatmapProps = { scale, offsetX, offsetY };

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, height: '100%' }}>
        <WoeHeatmap {...shaderProps} />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          paddingBottom: isMobilePortrait ? '4rem' : isShortScreen ? '3rem' : '6rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          pointerEvents: 'none',
        }}
      >
        <div style={{ textAlign: 'left', pointerEvents: 'auto', maxWidth: '42rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: isMobilePortrait ? '0.75rem' : '0.875rem',
              letterSpacing: '0.3em',
              color: 'var(--color-muted-foreground, #a1a1aa)',
              marginBottom: '0.75rem',
            }}
          >
            FULL-STACK ENGINEER — BALI, INDONESIA
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobilePortrait ? '1.875rem' : isShortScreen ? '2rem' : '3.75rem',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--color-foreground, #fafafa)',
            }}
          >
            I Putu Ekajaya
            <br />
            Awidya Putra
          </h1>

          <p
            style={{
              marginTop: '1.5rem',
              fontSize: isMobilePortrait ? '1rem' : '1.125rem',
              color: 'var(--color-muted-foreground, #a1a1aa)',
              maxWidth: '32rem',
              lineHeight: 1.625,
            }}
          >
            Building production-ready web applications with Spring Boot, Node.js, Next.js, Astro, and cloud-native infrastructure.
          </p>

          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="#about"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--color-foreground, #fafafa)',
                color: 'var(--color-background, #141414)',
                borderRadius: '0.375rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Explore
            </a>
            <a
              href="/pdf/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid var(--color-border, #27272a)',
                borderRadius: '0.375rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              CV
            </a>
            <a
              href="https://github.com/ekajaya740"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid var(--color-border, #27272a)',
                borderRadius: '0.375rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
