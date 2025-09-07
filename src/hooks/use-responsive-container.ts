import { useState, useEffect } from "react";

export function useResponsiveContainer(
  maxWidth: number,
  aspectRatio: number,
  horizontalPaddingInRem: number
) {
  const [dimensions, setDimensions] = useState({
    width: maxWidth,
    height: maxWidth * aspectRatio
  });

  useEffect(() => {
    const updateDimensions = () => {
      const remInPixels = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const horizontalPadding = horizontalPaddingInRem * remInPixels;
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
  }, [maxWidth, aspectRatio, horizontalPaddingInRem]);

  return dimensions;
}
