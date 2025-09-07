import { useDeskStyle } from "@/hooks/use-desk-style";
import { cn } from "@/lib/utils";
import { DeskType } from "@/types/firebase-type";
import { useDraggable } from "@dnd-kit/core";
import { Dispatch, SetStateAction } from "react";

export type DraggableDeskProps = {
  desk: DeskType & { id: string };
  index: number;
  selectedDeskId: string | null;
  setSelectedDeskId: Dispatch<SetStateAction<string | null>>;
  dimensions: { width: number; height: number };
};

export default function DraggableDesk({
  desk,
  index,
  selectedDeskId,
  setSelectedDeskId,
  dimensions
}: DraggableDeskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: desk.id
  });
  const basicStyle = useDeskStyle(desk, {
    width: dimensions.width,
    height: dimensions.height
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...basicStyle,
        transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`
      }}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-primary hover:bg-primary/80 absolute flex cursor-move touch-none items-center justify-center rounded shadow",
        selectedDeskId === desk.id && "ring-4 ring-blue-500 ring-offset-2"
      )}
      onMouseDown={() => setSelectedDeskId(desk.id)}
    >
      {dimensions.width > 800 ? (
        <p className="text-lg text-white select-none">机 {index + 1}</p>
      ) : (
        <p className="text-xs text-white select-none">{index + 1}</p>
      )}
    </div>
  );
}
