import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getPublishedNote, getPublishedNotes } from "@/content/notes";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getPublishedNote(slug);

  return note
    ? { title: note.title, description: note.summary }
    : { title: "笔记不存在" };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getPublishedNote(slug);

  if (!note) {
    notFound();
  }

  return (
    <>
      <nav aria-label="返回">
        <Link href="/">返回全部笔记</Link>
      </nav>
      <main>
        <article>
          <header>
            <time dateTime={note.publishedAt}>{note.publishedAt}</time>
            <h1>{note.title}</h1>
            <p>{note.summary}</p>
          </header>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
        </article>
      </main>
    </>
  );
}
