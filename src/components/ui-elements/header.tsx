import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui-elements/mode-toggle";
import Link from "next/link";
import HeaderMenu from "@/components/ui-elements/header-menu";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-2">
      <div>
        <h1 className="text-2xl font-bold">
          <Link href="/">Congestion Checker</Link>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button asChild>
          <HeaderMenu />
        </Button>
      </div>
    </header>
  );
}
