import { DeskType } from "@/types/firebase-type";

export function generateDeskStyle(
  desk: DeskType,
  dimensions: { width: number; height: number }
) {
  const isHorizontal = desk.orientation === "horizontal";

  return isHorizontal
    ? {
        top: `${desk.y}%`,
        left: `${desk.x}%`,
        width: dimensions.width * (70 / 900),
        height: dimensions.width * (50 / 900)
      }
    : {
        top: `${desk.y}%`,
        left: `${desk.x}%`,
        width: dimensions.width * (50 / 900),
        height: dimensions.width * (70 / 900)
      };
}
