"use client";

import { db } from "@/firebase";
import {
  DndContext,
  DragEndEvent,
  rectIntersection
} from "@dnd-kit/core";
import { ref, set, update } from "firebase/database";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";
import { v7 as createUUID } from "uuid";
import { Plus, RotateCcw, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import  DraggableDesk, { DraggableDeskProps }  from "@/components/functional/main/edit/draggable-desk";

export default function Page() {
  const { userInfo, desks, loading, error } = useStoreData();
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

  if (loading) return <p>Loading...</p>;
  if (error) {
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
