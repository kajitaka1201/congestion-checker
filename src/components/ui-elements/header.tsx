import Link from "next/link";
import HeaderMenu from "@/components/ui-elements/header-menu";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <div>
        <h1 className="text-2xl font-bold">
          <Link href="/">Congestion Checker</Link>
        </h1>
      </div>
      <HeaderMenu />
    </header>
  );
}
