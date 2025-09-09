import { db } from "@/firebase";
import { UserType } from "@/types/firebase-type";
import { ref, update } from "firebase/database";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import { v7 as createUUID } from "uuid";

export function addDesk({
  userInfo
}: {
  userInfo: Val<UserType, "", ""> | undefined;
}) {
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
