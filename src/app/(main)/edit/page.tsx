import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="px-4">
      <h2>編集ページ</h2>
      <Button asChild>
        <Link href="/view">閲覧ページへ</Link>
      </Button>
    </main>
  );
}
