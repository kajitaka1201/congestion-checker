import { cn } from "@/lib/utils";
import { DeskType } from "@/types/firebase-type";
import { useDraggable } from "@dnd-kit/core";
import { Dispatch, SetStateAction } from "react";

export type DraggableDeskProps = {
  desk: DeskType & { id: string };
  index: number;
  selectedDeskId: string | null;
  setSelectedDeskId: Dispatch<SetStateAction<string | null>>;
  width: number;
};

export default function DraggableDesk({
  desk,
  index,
  selectedDeskId,
  setSelectedDeskId,
  width
}: DraggableDeskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: desk.id
  });
  const style =
    desk.orientation === "horizontal"
      ? {
          transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
          top: `${desk.y}%`,
          left: `${desk.x}%`,
          width: width * (70 / 900),
          height: width * (50 / 900)
        }
      : {
          transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
          top: `${desk.y}%`,
          left: `${desk.x}%`,
          width: width * (50 / 900),
          height: width * (70 / 900)
        };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-primary hover:bg-primary/80 absolute flex cursor-move touch-none items-center justify-center rounded shadow",
        selectedDeskId === desk.id && "ring-4 ring-blue-500 ring-offset-2"
      )}
      onMouseDown={() => setSelectedDeskId(desk.id)}
    >
      <p className="text-xs text-white select-none">{index + 1}</p>
    </div>
  );
}
