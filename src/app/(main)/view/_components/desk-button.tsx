import { Button } from "@/components/ui/button";
import { DeskType, UserType } from "@/types/firebase-type";
import { cn } from "@/lib/utils";
import { generateDeskStyle } from "@/hooks/generate-desk-style";
import { ref, set } from "firebase/database";
import { db } from "@/firebase";

export default function DeskButton({
  desk,
  index,
  dimensions,
  userInfo
}: {
  desk: DeskType & { id: string };
  index: number;
  dimensions: { width: number; height: number };
  userInfo: UserType | undefined;
}) {
  const style = generateDeskStyle(desk, dimensions);
  return (
    <Button
      key={desk?.id}
      className={cn(
        "absolute flex cursor-pointer items-center justify-center rounded p-0 shadow",
        desk?.used
          ? "bg-red-600 hover:bg-red-400"
          : "bg-green-600 hover:bg-green-400"
      )}
      style={style}
      onClick={() => {
        set(
          ref(db, `stores/${userInfo?.storeId}/desks/${desk?.id}/used`),
          !desk?.used
        );
      }}
    >
      {dimensions.width > 800 ? (
        <p className="text-lg text-white select-none">机 {index + 1}</p>
      ) : (
        <p className="text-xs text-white select-none">{index + 1}</p>
      )}
    </Button>
  );
}
