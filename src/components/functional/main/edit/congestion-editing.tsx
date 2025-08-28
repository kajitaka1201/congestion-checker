"use client";

import { auth, db } from "@/firebase";
import { DatabaseType, DeskType, UserType } from "@/types/firebase-type";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  rectIntersection
} from "@dnd-kit/core";
import { UUID } from "crypto";
import { ref, set, update } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { useObjectVal } from "react-firebase-hooks/database";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";
import { v7 as createUUID } from "uuid";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";

type DraggableDeskProps = {
  desk: DeskType & { id: string };
  index: number;
  userInfo: UserType | null | undefined;
};

function DraggableDesk({ desk, index, userInfo }: DraggableDeskProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform
  } = useDraggable({
    id: desk.id
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDraggableNodeRef(node);
  };

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

  function deleteDesk() {
    if (!userInfo?.storeId) return;
    const deskRef = ref(db, `stores/${userInfo.storeId}/desks/${desk.id}`);
    set(deskRef, null);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          className="bg-primary absolute flex h-[50px] w-[70px] cursor-pointer touch-none items-center justify-center rounded shadow">
          <p className="text-lg text-white select-none">机 {index + 1}</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={deleteDesk}>削除</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default function CongestionEditing() {
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const deskId = active.id as string;
    const desk = desks.find(d => d?.id === deskId);

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

  if (userLoading || userInfoLoading || valueLoading) return <p>Loading...</p>;
  if (userError || userInfoError || valueError) {
    return (
      <p>データの読み込みでエラーが発生しました。再度読み込んで下さい。</p>
    );
  }
  return (
    <>
      <Button onClick={addDesk}>机を追加する</Button>
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
        collisionDetection={rectIntersection}>
        <div className="m-auth relative h-[700px] w-[900px] overflow-hidden border">
          {desks.map(
            (desk, index) =>
              desk && (
                <DraggableDesk
                  key={desk.id}
                  desk={desk}
                  index={index}
                  userInfo={userInfo}
                />
              )
          )}
        </div>
      </DndContext>
    </>
  );
}
