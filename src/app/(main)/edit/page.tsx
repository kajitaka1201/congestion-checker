"use client";

import { db } from "@/firebase";
import { DndContext, DragEndEvent, rectIntersection } from "@dnd-kit/core";
import { ref, set, update } from "firebase/database";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";
import { v7 as createUUID } from "uuid";
import { Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import DraggableDesk, {
  DraggableDeskProps
} from "@/components/functional/main/edit/draggable-desk";
import { Separator } from "@/components/ui/separator";
import { MdRotate90DegreesCcw } from "react-icons/md";
import { useResponsiveContainer } from "@/hooks/use-responsive-container";

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
  const dimensions = useResponsiveContainer(900, 7 / 9);

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

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <p>データの読み込みでエラーが発生しました。再度読み込んで下さい。</p>
    );
  }
  return (
    <main className="space-y-4 px-4 py-2">
      <div className="flex items-center gap-2 py-2">
        <Button onClick={addDesk}>
          <Plus size={16} />
          机を追加
        </Button>
        <Separator orientation="vertical" />
        {selectedDeskId ? (
          <div className="flex items-center gap-2">
            <p className="text-xs">
              机{desks.findIndex(d => d?.id === selectedDeskId) + 1}を選択中
            </p>
            <Button onClick={() => turnDesk(selectedDesk)} title="向きを変える">
              <MdRotate90DegreesCcw size={16} />
            </Button>
            <Button onClick={() => deleteDesk(selectedDesk)} title="机を削除">
              <Trash size={16} />
            </Button>
          </div>
        ) : (
          <p className="text-xs">机を選択して下さい</p>
        )}
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
        collisionDetection={rectIntersection}
      >
        <div
          className="relative m-2 mx-auto overflow-hidden rounded border"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          {desks.map(
            (desk, index) =>
              desk && (
                <DraggableDesk
                  key={desk.id}
                  desk={desk}
                  index={index}
                  selectedDeskId={selectedDeskId}
                  setSelectedDeskId={setSelectedDeskId}
                  dimensions={dimensions}
                />
              )
          )}
        </div>
      </DndContext>
    </main>
  );
}
