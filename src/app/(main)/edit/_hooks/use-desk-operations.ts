import { DraggableDeskProps } from "@/app/(main)/edit/_components/draggable-desk";
import { db } from "@/firebase";
import { UserType } from "@/types/firebase-type";
import { DragEndEvent } from "@dnd-kit/core";
import { ref, set, update } from "firebase/database";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import { v7 as createUUID } from "uuid";

export function useDeskOperations({
  userInfo,
  desksMap,
  dimensions
}: {
  userInfo: Val<UserType, "", ""> | undefined;
  desksMap: Map<string, DraggableDeskProps["desk"]>;
  dimensions: { width: number; height: number };
}) {
  {
    function handleDragEnd(event: DragEndEvent) {
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
    function addDesk() {
      if (!userInfo?.storeId) return;

      const newDesk = {
        x: 0,
        y: 0,
        used: false,
        orientation: "horizontal"
      };

      const deskRef = ref(db, `stores/${userInfo.storeId}/desks`);
      update(deskRef, { [createUUID()]: newDesk });
    }
    function deleteDesk(desk: DraggableDeskProps["desk"] | null | undefined) {
      if (!userInfo?.storeId || !desk) return;
      const deskRef = ref(db, `stores/${userInfo.storeId}/desks/${desk.id}`);
      set(deskRef, null);
    }
    function turnDesk(desk: DraggableDeskProps["desk"] | null | undefined) {
      if (!userInfo?.storeId || !desk) return;
      set(
        ref(db, `stores/${userInfo.storeId}/desks/${desk.id}/orientation`),
        desk.orientation === "horizontal" ? "vertical" : "horizontal"
      );
    }

    return { handleDragEnd, addDesk, deleteDesk, turnDesk };
  }
}
