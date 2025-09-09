import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { addDesk } from "@/app/(main)/edit/_hooks/get-add-desk";
import { UserType } from "@/types/firebase-type";
import { Val } from "react-firebase-hooks/database/dist/database/types";

export default function AddDeskButton({
  userInfo
}: {
  userInfo: Val<UserType, "", ""> | undefined;
}) {
  return (
    <Button onClick={() => addDesk({ userInfo })}>
      <Plus size={16} />
      机を追加
    </Button>
  );
}
