import { useState, useEffect, RefObject } from "react";

export function useResponsiveContainer(
  containerRef: RefObject<HTMLElement | null>,
  maxWidth: number,
  aspectRatio: number
) {
  const [dimensions, setDimensions] = useState({
    width: maxWidth,
    height: maxWidth * aspectRatio
  });

  useEffect(() => {
    const element = containerRef?.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.min(maxWidth, element.clientWidth);
      const height = width * aspectRatio;
      setDimensions({ width, height });
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [containerRef, maxWidth, aspectRatio]);

  return dimensions;
}
