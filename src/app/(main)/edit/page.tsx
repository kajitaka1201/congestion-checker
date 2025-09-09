"use client";

import { DndContext, rectIntersection } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useMemo, useState } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import DraggableDesk from "@/app/(main)/edit/_components/draggable-desk";
import { useResponsiveContainer } from "@/hooks/use-responsive-container";
import EditToolbar from "@/app/(main)/edit/_components/edit-toolbar";
import { handleDragEnd } from "@/app/(main)/edit/_hooks/get-handle-drag-end";

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
  const dimensions = useResponsiveContainer(900, 7 / 9, 2);

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <p>データの読み込みでエラーが発生しました。再度読み込んで下さい。</p>
    );
  }
  return (
    <main className="space-y-4 px-4 py-2">
      <EditToolbar
        selectedDeskId={selectedDeskId}
        desks={desks}
        selectedDesk={selectedDesk}
        userInfo={userInfo}
      />
      <DndContext
        onDragEnd={event =>
          handleDragEnd({ event, userInfo, desksMap, dimensions })
        }
        modifiers={[restrictToParentElement]}
        collisionDetection={rectIntersection}
      >
        <div
          className="relative mx-auto overflow-hidden rounded border"
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
