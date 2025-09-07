import { DeskType } from "@/types/firebase-type";

export interface DeskStyleOptions {
  containerWidth: number;
  baseWidth?: number;
  baseHeight?: number;
}

export function useDeskStyle(desk: DeskType, dimensions: { width: number; height: number }) {

  const isHorizontal = desk.orientation === "horizontal";

  return isHorizontal ? {
        top: `${desk.y}%`,
        left: `${desk.x}%`,
        width: dimensions.width * (70 / 900),
        height: dimensions.width * (50 / 900)
      } : {
        top: `${desk.y}%`,
        left: `${desk.x}%`,
        width: dimensions.width * (50 / 900),
        height: dimensions.width * (70 / 900)
      };
}
