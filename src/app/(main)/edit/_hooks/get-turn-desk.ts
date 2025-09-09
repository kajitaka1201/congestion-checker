import { db } from "@/firebase";
import { ref } from "firebase/database";
import { set } from "react-hook-form";
import { DraggableDeskProps } from "@/app/(main)/edit/_components/draggable-desk";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import { UserType } from "@/types/firebase-type";

export function turnDesk({
  selectedDesk,
  userInfo
}: {
  selectedDesk: DraggableDeskProps["desk"] | null | undefined;
  userInfo: Val<UserType, "", ""> | undefined;
}) {
  if (!userInfo?.storeId || !selectedDesk) return;
  set(
    ref(db, `stores/${userInfo.storeId}/desks/${selectedDesk.id}/orientation`),
    selectedDesk.orientation === "horizontal" ? "vertical" : "horizontal"
  );
}
