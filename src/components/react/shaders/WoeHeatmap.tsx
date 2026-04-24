import { Heatmap } from '@paper-design/shaders-react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useContainerSize } from '../../../hooks/useContainerSize';

interface ShaderPreset {
  scale: number;
  offsetX: number;
  offsetY: number;
}

function getPreset(aspect: number): ShaderPreset {
  // portrait mobile & square-ish narrow screens
  if (aspect < 0.75) return { scale: 1.0, offsetX: 0, offsetY: 0 };
  // mobile landscape / tablet portrait
  if (aspect < 1.0) return { scale: 0.75, offsetX: 0.05, offsetY: 0 };
  // tablet landscape / standard laptop
  if (aspect < 1.6) return { scale: 0.8, offsetX: 0.15, offsetY: 0 };
  // standard desktop widescreen
  if (aspect < 2.2) return { scale: 0.95, offsetX: 0.3, offsetY: 0 };
  // ultra-wide
  return { scale: 1.1, offsetX: 0.25, offsetY: 0 };
}

export function WoeHeatmap() {
  const { ref, width, height, aspect } = useContainerSize();

  // Tailwind breakpoints for additional fine-tuning if needed elsewhere
  const isMobilePortrait = useMediaQuery('(max-width: 767px) and (orientation: portrait)');
  const isTabletPortrait = useMediaQuery('(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)');
  const isShortScreen = useMediaQuery('(max-height: 600px)');

  const preset = getPreset(aspect);

  // additional fine-tune: zoom out a bit when screen is very short
  const scale = isShortScreen ? Math.max(0.6, preset.scale - 0.15) : preset.scale;

  const offsetX = preset.offsetX;
  const offsetY = isMobilePortrait ? -0.45 : isTabletPortrait ? 0.35 : isShortScreen ? -0.4 : preset.offsetY;

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <Heatmap
        width={width}
        height={height}
        image="/logo.webp"
        colors={['#dd0303', '#fbff1a', '#1472ff']}
        colorBack="#1c1c1c"
        contour={0.23}
        angle={180}
        noise={0.27}
        innerGlow={0.68}
        outerGlow={0.3}
        speed={0.96}
        scale={scale}
        offsetX={offsetX}
        offsetY={offsetY}
        fit="contain"
      />
    </div>
  );
}
