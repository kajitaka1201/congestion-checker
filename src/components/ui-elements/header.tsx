import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui-elements/mode-toggle";

export default function Header() {
  return (
    <header className="p-2 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Congestion Checker</h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button>ログイン</Button>
      </div>
    </header>
  );
}
