import { UserType } from "@/types/firebase-type";
import { DragEndEvent } from "@dnd-kit/core";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import { DraggableDeskProps } from "@/app/(main)/edit/_components/draggable-desk";
import { ref, update } from "firebase/database";
import { db } from "@/firebase";

export function handleDragEnd({
  event,
  userInfo,
  desksMap,
  dimensions
}: {
  event: DragEndEvent;
  userInfo: Val<UserType, "", ""> | undefined;
  desksMap: Map<string, DraggableDeskProps["desk"]>;
  dimensions: { width: number; height: number };
}) {
  const { active, delta } = event;
  const deskId = active.id;
  const desk = desksMap.get(String(deskId));
  if (!desk || !userInfo?.storeId) return;

  const deltaXPercent = (delta.x / dimensions.width) * 100;
  const deltaYPercent = (delta.y / dimensions.height) * 100;

  const deskWidthPercent =
    ((desk.orientation === "horizontal" ? 70 : 50) / 900) * 100;
  const deskHeightPercent =
    ((desk.orientation === "horizontal" ? 50 : 70) / 700) * 100;

  const newX = Math.max(
    0,
    Math.min(100 - deskWidthPercent, desk.x + deltaXPercent)
  );
  const newY = Math.max(
    0,
    Math.min(100 - deskHeightPercent, desk.y + deltaYPercent)
  );

  const deskRef = ref(db, `stores/${userInfo.storeId}/desks/${deskId}`);
  update(deskRef, { x: newX, y: newY });
}
