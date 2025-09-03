import { cn } from "@/lib/utils";
import { DeskType } from "@/types/firebase-type";
import { useDraggable } from "@dnd-kit/core";
import { Dispatch, SetStateAction } from "react";

export type DraggableDeskProps = {
  desk: DeskType & { id: string };
  index: number;
  selectedDeskId: string | null;
  setSelectedDeskId: Dispatch<SetStateAction<string | null>>;
};

export default function DraggableDesk({
  desk,
  index,
  selectedDeskId,
  setSelectedDeskId
}: DraggableDeskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: desk.id
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        top: desk.y,
        left: desk.x
      }
    : {
        top: desk.y,
        left: desk.x
      };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-primary hover:bg-primary/80 absolute flex cursor-move touch-none items-center justify-center rounded shadow",
        desk.rotation === 90 ? "h-[70px] w-[50px]" : "h-[50px] w-[70px]",
        selectedDeskId === desk.id && "ring-4 ring-blue-500 ring-offset-2"
      )}
      onMouseDown={() => setSelectedDeskId(desk.id)}
    >
      <p className="text-lg text-white select-none">机 {index + 1}</p>
    </div>
  );
}
