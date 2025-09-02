"use client";

import { Button } from "@/components/ui/button";
import { auth, db } from "@/firebase";
import { cn } from "@/lib/utils";
import { DatabaseType, UserType } from "@/types/firebase-type";
import { ref, set } from "firebase/database";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useObjectVal } from "react-firebase-hooks/database";

export default function Page() {
  const [user, userLoading, userError] = useAuthState(auth);
  const [userInfo, userInfoLoading, userInfoError] = useObjectVal<UserType>(
    user ? ref(db, `users/${user.uid}`) : null
  );
  const [value, valueLoading, valueError] = useObjectVal<
    DatabaseType["stores"][string]["desks"]
  >(userInfo?.storeId ? ref(db, `stores/${userInfo.storeId}/desks`) : null);
  const desks = useMemo(
    () =>
      Object.entries(value || {})
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
        .filter(Boolean),
    [value]
  );
  const occupiedDesksCount = useMemo(
    () => desks.filter(desk => desk?.used).length,
    [desks]
  ); 

  if (userLoading || userInfoLoading || valueLoading) return <p>Loading...</p>;
  if (userError || userInfoError || valueError) {
    return (
      <p>データの読み込みでエラーが発生しました。再度読み込んで下さい。</p>
    );
  }

  return (
    <main className="space-y-4">
      <div className="flex w-full items-center px-4 py-2">
        <div className="w-1/4 text-center">
          <p className="text-sm">Available</p>
          <p className="text-2xl font-bold text-green-600">
            {desks.length - occupiedDesksCount}
          </p>
        </div>
        <div className="w-1/4 text-center">
          <p className="text-sm">Occupied</p>
          <p className="text-2xl font-bold text-red-600">
            {occupiedDesksCount}
          </p>
        </div>
        <div className="w-1/4 text-center">
          <p className="text-sm">Total Seats</p>
          <p className="text-2xl font-bold">{desks.length}</p>
        </div>
        <div className="w-1/4 text-center">
          <p className="text-sm">Occupancy</p>
          <p className="text-2xl font-bold text-indigo-600">
            {Math.round((occupiedDesksCount / desks.length) * 100 || 0)}%
          </p>
        </div>
      </div>
      <div className="relative mx-auto h-[700px] w-[900px] overflow-hidden rounded border">
        {desks.map((desk, index) => (
          <Button
            key={desk?.id}
            className={cn(
              "absolute flex cursor-pointer items-center justify-center rounded shadow",
              desk?.rotation === 90 ? "h-[70px] w-[50px]" : "h-[50px] w-[70px]",
              desk?.used
                ? "bg-red-600 hover:bg-red-400"
                : "bg-green-600 hover:bg-green-400"
            )}
            style={{
              top: desk?.y,
              left: desk?.x
            }}
            onClick={() => {
              set(
                ref(db, `stores/${userInfo?.storeId}/desks/${desk?.id}/used`),
                !desk?.used
              );
            }}
          >
            <p className="text-lg text-white select-none">机 {index + 1}</p>
          </Button>
        ))}
      </div>
    </main>
  );
}
