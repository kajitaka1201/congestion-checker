import { useState, useEffect } from "react";

export function useResponsiveContainer(maxWidth: number, aspectRatio: number) {
  const [dimensions, setDimensions] = useState({
    width: maxWidth,
    height: maxWidth * aspectRatio
  });

  useEffect(() => {
    const width = Math.min(maxWidth, window.innerWidth - 32);
    const height = width * aspectRatio;
    setDimensions({ width, height });
  }, [maxWidth, aspectRatio]);

  return dimensions;
}
