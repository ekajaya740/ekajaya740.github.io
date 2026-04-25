import { Heatmap } from '@paper-design/shaders-react';
import { useContainerSize } from '../../../hooks/useContainerSize';

export interface WoeHeatmapProps {
  /** Source image for the heatmap shape */
  image?: string;
  /** Heatmap gradient colors (max 10) */
  colors?: string[];
  /** Background color behind the heatmap */
  colorBack?: string;
  /** Heat intensity near shape edges (0–1) */
  contour?: number;
  /** Direction of heatwaves in degrees (0–360) */
  angle?: number;
  /** Grain noise across the graphic (0–1) */
  noise?: number;
  /** Heated area inside the shape (0–1) */
  innerGlow?: number;
  /** Heated area outside the shape (0–1) */
  outerGlow?: number;
  /** Animation speed (0 = static, 1 = normal, negative = reverse) */
  speed?: number;
  /** Overall zoom level (0.01–4) */
  scale?: number;
  /** Horizontal offset of center (−1 to 1) */
  offsetX?: number;
  /** Vertical offset of center (−1 to 1) */
  offsetY?: number;
  /** How the shader fits the canvas */
  fit?: 'none' | 'contain' | 'cover';
  /** Overall rotation in degrees (0–360) */
  rotation?: number;
  /** Horizontal origin for positioning (0–1) */
  originX?: number;
  /** Vertical origin for positioning (0–1) */
  originY?: number;
}

const defaults: Required<WoeHeatmapProps> = {
  image: '/logo.webp',
  colors: ['#dd0303', '#fbff1a', '#1472ff'],
  colorBack: '#1c1c1c',
  contour: 0.23,
  angle: 180,
  noise: 0.27,
  innerGlow: 0.68,
  outerGlow: 0.3,
  speed: 0.96,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  fit: 'contain',
  rotation: 0,
  originX: 0.5,
  originY: 0.5,
};

export function WoeHeatmap(props: WoeHeatmapProps) {
  const { ref, width, height } = useContainerSize();
  const merged = { ...defaults, ...props };

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <Heatmap
        width={width}
        height={height}
        image={merged.image}
        colors={merged.colors}
        colorBack={merged.colorBack}
        contour={merged.contour}
        angle={merged.angle}
        noise={merged.noise}
        innerGlow={merged.innerGlow}
        outerGlow={merged.outerGlow}
        speed={merged.speed}
        scale={merged.scale}
        offsetX={merged.offsetX}
        offsetY={merged.offsetY}
        fit={merged.fit}
        rotation={merged.rotation}
        originX={merged.originX}
        originY={merged.originY}
      />
    </div>
  );
}
