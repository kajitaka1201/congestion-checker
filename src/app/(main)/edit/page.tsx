"use client";

import { auth, db } from "@/firebase";
import { DatabaseType, DeskType, UserType } from "@/types/firebase-type";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  rectIntersection
} from "@dnd-kit/core";
import { ref, set, update } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { useObjectVal } from "react-firebase-hooks/database";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";
import { v7 as createUUID } from "uuid";
import { cn } from "@/lib/utils";
import { Plus, RotateCcw, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

type DraggableDeskProps = {
  desk: DeskType & { id: string };
  index: number;
  selectedDeskId: string | null;
  setSelectedDeskId: Dispatch<SetStateAction<string | null>>;
};

function DraggableDesk({
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
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null);
  const desksMap = useMemo(
    () => new Map(desks.map(desk => [desk?.id, desk])),
    [desks]
  );
  const selectedDesk = useMemo(
    () => (selectedDeskId ? desksMap.get(selectedDeskId) : undefined) || null,
    [desksMap, selectedDeskId]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const deskId = active.id;
    const desk = desksMap.get(String(deskId));
    if (!desk || !userInfo?.storeId) return;

    const newX = Math.round(desk.x + delta.x);
    const newY = Math.round(desk.y + delta.y);

    const deskRef = ref(db, `stores/${userInfo.storeId}/desks/${deskId}`);
    update(deskRef, { x: newX, y: newY });
  }
  function addDesk() {
    if (!userInfo?.storeId) return;

    const newDesk = {
      x: 0,
      y: 0,
      rotation: 0,
      used: false
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
      ref(db, `stores/${userInfo.storeId}/desks/${desk.id}/rotation`),
      (desk.rotation + 90) % 180
    );
  }

  if (userLoading || userInfoLoading || valueLoading) return <p>Loading...</p>;
  if (userError || userInfoError || valueError) {
    return (
      <p>データの読み込みでエラーが発生しました。再度読み込んで下さい。</p>
    );
  }
  return (
    <main className="flex">
      <div className="flex w-50 flex-col gap-2 border-r p-2">
        <p className="text-xl">Layout Controls</p>
        <Button onClick={addDesk}>
          <Plus size={16} />
          机を追加
        </Button>
        <Separator orientation="horizontal" />
        <p className="text-lg">Selected Desk</p>
        {selectedDeskId ? (
          <>
            <p className="text-xs">
              机 {desks.findIndex(d => d?.id === selectedDeskId) + 1} を選択中
            </p>
            <Button onClick={() => turnDesk(selectedDesk)}>
              <RotateCcw size={16} />
              机を回転
            </Button>
            <Button onClick={() => deleteDesk(selectedDesk)}>
              <Trash size={16} />
              机を削除
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs">机をクリックし選択して下さい。</p>
          </>
        )}
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
        collisionDetection={rectIntersection}
      >
        <div className="relative m-2 h-[700px] w-[900px] overflow-hidden rounded border">
          {desks.map(
            (desk, index) =>
              desk && (
                <DraggableDesk
                  key={desk.id}
                  desk={desk}
                  index={index}
                  selectedDeskId={selectedDeskId}
                  setSelectedDeskId={setSelectedDeskId}
                />
              )
          )}
        </div>
      </DndContext>
    </main>
  );
}
