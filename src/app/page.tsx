import Link from "next/link";

import { getPublishedNotes } from "@/content/notes";
import { formatDate } from "@/content/format";

export default function HomePage() {
  const notes = getPublishedNotes();

  return (
    <main className="wrap">
      <span className="kicker">NOTES · 笔记</span>
      <h1 className="sec-title">学习笔记</h1>
      <p className="sub">和 AI 干活时学到的东西，核对过才写下来。</p>
      <ul className="grid">
        {notes.map((note) => (
          <li key={note.slug}>
            <Link className="ncard" href={`/notes/${note.slug}`}>
              <time className="date" dateTime={note.publishedAt}>
                {formatDate(note.publishedAt)}
              </time>
              <h3>{note.title}</h3>
              <p>{note.summary}</p>
              <span className="go">读一读 →</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="foot">— yanzi.life —</p>
    </main>
  );
}
