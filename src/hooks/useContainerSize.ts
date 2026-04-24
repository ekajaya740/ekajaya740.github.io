import { useCallback, useState } from 'react';

export interface ContainerSize {
  width: number;
  height: number;
  aspect: number;
}

export function useContainerSize() {
  const [size, setSize] = useState<ContainerSize>({
    width: 1920,
    height: 1080,
    aspect: 1920 / 1080,
  });

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      setSize({ width: w, height: h, aspect: h > 0 ? w / h : 1 });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, width: size.width, height: size.height, aspect: size.aspect };
}
