import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui-elements/mode-toggle";
import Link from "next/link";
import HeaderUser from "@/components/ui-elements/header-user";

export default function Header() {
  return (
    <header className="p-2 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          <Link href="/">Congestion Checker</Link>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button asChild>
          <HeaderUser />
        </Button>
      </div>
    </header>
  );
}
