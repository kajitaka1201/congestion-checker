import { useState, useEffect } from "react";

export function useResponsiveContainer(maxWidth: number, aspectRatio: number) {
  const [dimensions, setDimensions] = useState({
    width: maxWidth,
    height: maxWidth * aspectRatio
  });

  useEffect(() => {
    const updateDimensions = () => {
      const remInPixels = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const horizontalPadding = 2 * remInPixels;
      const width = Math.min(
        maxWidth,
        document.documentElement.clientWidth - horizontalPadding
      );
      const height = width * aspectRatio;
      setDimensions({ width, height });
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [maxWidth, aspectRatio]);

  return dimensions;
}
