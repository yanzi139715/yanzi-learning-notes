import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="wrap empty">
      <h1 className="sec-title">这篇笔记不存在</h1>
      <p>可能还没公开，或者地址变了。</p>
      <Link className="pill" href="/">
        ← 全部笔记
      </Link>
    </main>
  );
}
