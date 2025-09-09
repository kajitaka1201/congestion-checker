import { Button } from "@/components/ui/button";
import { DeskType, UserType } from "@/types/firebase-type";
import { MdRotate90DegreesCcw } from "react-icons/md";
import { turnDesk } from "@/app/(main)/edit/_hooks/get-turn-desk";
import { Val } from "react-firebase-hooks/database/dist/database/types";

export default function TurnDeskButton({
  selectedDesk,
  userInfo
}: {
  selectedDesk: (DeskType & { id: string }) | null;
  userInfo: Val<UserType, "", ""> | undefined;
}) {
  return (
    <Button
      onClick={() => selectedDesk && turnDesk({ selectedDesk, userInfo })}
      title="向きを変える"
    >
      <MdRotate90DegreesCcw size={16} />
    </Button>
  );
}
