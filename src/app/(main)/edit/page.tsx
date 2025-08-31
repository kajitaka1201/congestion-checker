import CongestionEditing from "@/components/functional/main/edit/congestion-editing";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="p-4">
      <Button asChild>
        <Link href="/view">閲覧ページへ</Link>
      </Button>
      <CongestionEditing />
    </main>
  );
}
