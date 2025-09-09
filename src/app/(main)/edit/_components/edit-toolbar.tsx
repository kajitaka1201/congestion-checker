import { Separator } from "@/components/ui/separator";
import AddDeskButton from "@/app/(main)/edit/_components/add-desk-button";
import TurnDeskButton from "@/app/(main)/edit/_components/turn-desk-button";
import { DeskType, UserType } from "@/types/firebase-type";
import DeleteDeskButton from "@/app/(main)/edit/_components/desk-desk-button";
import { Val } from "react-firebase-hooks/database/dist/database/types";

export default function EditToolbar({
  selectedDeskId,
  desks,
  selectedDesk,
  userInfo
}: {
  selectedDeskId: string | null;
  desks: (DeskType & { id: string })[];
  selectedDesk: (DeskType & { id: string }) | null;
  userInfo: Val<UserType, "", ""> | undefined;
}) {
  return (
    <div className="flex items-center gap-2 py-2">
      <AddDeskButton userInfo={userInfo} />
      <Separator orientation="vertical" />
      {selectedDeskId ? (
        <div className="flex items-center gap-2">
          <p className="text-xs">
            机{desks.findIndex(d => d?.id === selectedDeskId) + 1}を選択中
          </p>
          <TurnDeskButton selectedDesk={selectedDesk} userInfo={userInfo} />
          <DeleteDeskButton selectedDesk={selectedDesk} userInfo={userInfo} />
        </div>
      ) : (
        <p className="text-xs">机を選択して下さい</p>
      )}
    </div>
  );
}
