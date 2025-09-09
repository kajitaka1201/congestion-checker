import { Button } from "@/components/ui/button";
import { DeskType, UserType } from "@/types/firebase-type";
import { Trash } from "lucide-react";
import { deleteDesk } from "@/app/(main)/edit/_hooks/get-delete-desk";
import { Val } from "react-firebase-hooks/database/dist/database/types";

export default function DeleteDeskButton({
  selectedDesk,
  userInfo
}: {
  selectedDesk: (DeskType & { id: string }) | null;
  userInfo: Val<UserType, "", ""> | undefined;
}) {
  return (
    <Button
      onClick={() => selectedDesk && deleteDesk({ selectedDesk, userInfo })}
      title="机を削除"
    >
      <Trash size={16} />
    </Button>
  );
}
