import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main>
      <h1>这篇笔记不存在</h1>
      <p>它可能还没有公开，或地址已经变化。</p>
      <Link href="/">返回全部笔记</Link>
    </main>
  );
}
