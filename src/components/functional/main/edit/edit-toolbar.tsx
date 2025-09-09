import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";
import { MdRotate90DegreesCcw } from "react-icons/md";

export default function EditToolbar({
  addDesk,
  selectedDeskId,
  desks,
  turnDesk,
  deleteDesk,
  selectedDesk
}: {
  addDesk: () => void;
  selectedDeskId: string | null;
  desks: {
    id: string;
    x: number;
    y: number;
    used: boolean;
    orientation: "horizontal" | "vertical";
  }[];
  turnDesk: (desk: {
    id: string;
    x: number;
    y: number;
    used: boolean;
    orientation: "horizontal" | "vertical";
  }) => void;
  deleteDesk: (desk: {
    id: string;
    x: number;
    y: number;
    used: boolean;
    orientation: "horizontal" | "vertical";
  }) => void;
  selectedDesk: {
    id: string;
    x: number;
    y: number;
    used: boolean;
    orientation: "horizontal" | "vertical";
  } | null;
}) {
  return (
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
          <Button
            onClick={() => selectedDesk && turnDesk(selectedDesk)}
            title="向きを変える"
          >
            <MdRotate90DegreesCcw size={16} />
          </Button>
          <Button
            onClick={() => selectedDesk && deleteDesk(selectedDesk)}
            title="机を削除"
          >
            <Trash size={16} />
          </Button>
        </div>
      ) : (
        <p className="text-xs">机を選択して下さい</p>
      )}
    </div>
  );
}
