import { WoeHeatmap } from '../shaders/WoeHeatmap';

export function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <WoeHeatmap />
    </section>
  );
}