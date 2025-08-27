"use client";

import { auth, db } from "@/firebase";
import { cn } from "@/lib/utils";
import { DatabaseType, UserType } from "@/types/firebase-type";
import { UUID } from "crypto";
import { ref } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { useObjectVal } from "react-firebase-hooks/database";

export default function CongestionViewing() {
  const [user, userLoading, userError] = useAuthState(auth);
  const [userInfo, userInfoLoading, userInfoError] = useObjectVal<UserType>(
    ref(db, `users/${user?.uid}`)
  );
  const [value, valueLoading, valueError] = useObjectVal<
    DatabaseType["stores"][UUID]["desks"]
  >(ref(db, `stores/${userInfo?.storeId}/desks`));
  const desks = Object.entries(value || {})
    .map(([id, desk]) => {
      if (typeof desk !== "object" || desk === null) return null;
      return {
        id: id,
        x: desk.x,
        y: desk.y,
        rotation: desk.rotation,
        used: desk.used
      };
    })
    .filter(Boolean);

  if (userLoading || userInfoLoading || valueLoading) return <p>Loading...</p>;
  if (userError || userInfoError || valueError) {
    return (
      <p>データの読み込みでエラーが発生しました。再度読み込んで下さい。</p>
    );
  }
  return (
    <div className="m-auth relative h-[700px] w-[900px] overflow-hidden border">
      {desks.map((desk, index) => (
        <div
          key={desk?.id}
          className={cn(
            "absolute flex h-[50px] w-[70px] cursor-pointer items-center justify-center rounded shadow",
            desk?.used ? "bg-red-600" : "bg-green-600"
          )}
          style={{
            top: desk?.y,
            left: desk?.x
          }}>
          <p className="text-lg text-white select-none">机 {index + 1}</p>
        </div>
      ))}
    </div>
  );
}
