import Link from "next/link";

import { getPublishedNotes } from "@/content/notes";

export default function HomePage() {
  const notes = getPublishedNotes();

  return (
    <>
      <header>
        <p>妍子学习笔记</p>
        <h1>从真实问题里长出来的方法</h1>
        <p>这里记录现象、证据、判断边界，以及真正验证过的解决方案。</p>
      </header>
      <main>
        <section aria-labelledby="latest-notes">
          <h2 id="latest-notes">全部笔记</h2>
          <ul>
            {notes.map((note) => (
              <li key={note.slug}>
                <article>
                  <time dateTime={note.publishedAt}>{note.publishedAt}</time>
                  <h3>
                    <Link href={`/notes/${note.slug}`}>{note.title}</Link>
                  </h3>
                  <p>{note.summary}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
