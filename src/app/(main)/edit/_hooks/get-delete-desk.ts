import { DraggableDeskProps } from "@/app/(main)/edit/_components/draggable-desk";
import { db } from "@/firebase";
import { UserType } from "@/types/firebase-type";
import { ref, set } from "firebase/database";
import { Val } from "react-firebase-hooks/database/dist/database/types";

export function deleteDesk({
  selectedDesk,
  userInfo
}: {
  selectedDesk: DraggableDeskProps["desk"] | null | undefined;
  userInfo: Val<UserType, "", ""> | undefined;
}) {
  if (!userInfo?.storeId || !selectedDesk) return;
  const deskRef = ref(
    db,
    `stores/${userInfo.storeId}/desks/${selectedDesk.id}`
  );
  set(deskRef, null);
}
