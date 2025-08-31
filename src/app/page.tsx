import Link from "next/link";

export default function Page() {
  return (
    <main className="space-y-4 p-4">
      <section>
        <h2 className="text-xl font-bold">Congestion Checkerについて</h2>
        <p>
          このアプリは、座席の空き状況を複数人で共有できるアプリです。座席は自由に配置することができます。
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold">リンク</h2>
        <ul className="list-inside list-disc underline">
          <li>
            <Link href="/view">座席使用状況を閲覧</Link>
          </li>
          <li>
            <Link href="/edit">座席配置を編集</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
