import CongestionViewing from "@/components/functional/main/view/congestion-viewing";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="px-4">
      <Button asChild>
        <Link href="/edit">編集ページへ</Link>
      </Button>
      <CongestionViewing />
    </main>
  );
}
