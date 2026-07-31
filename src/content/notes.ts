import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

const dateString = z.preprocess(
  (value) =>
    value instanceof Date ? value.toISOString().slice(0, 10) : value,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
);

const noteFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  publishedAt: dateString,
  status: z.enum(["draft", "published"]),
});

export type Note = z.infer<typeof noteFrontmatterSchema> & {
  slug: string;
  content: string;
};

const notesDirectory = path.join(process.cwd(), "content", "notes");

export function parseNoteSource(slug: string, source: string): Note {
  const parsed = matter(source);
  const metadata = noteFrontmatterSchema.parse(parsed.data);

  return {
    slug,
    ...metadata,
    content: parsed.content.trim(),
  };
}

export function validateUniqueNotes(notes: Note[]): void {
  const seen = new Set<string>();

  for (const note of notes) {
    if (seen.has(note.slug)) {
      throw new Error(`duplicate slug: ${note.slug}`);
    }
    seen.add(note.slug);
  }
}

export function getAllNotes(): Note[] {
  if (!fs.existsSync(notesDirectory)) {
    return [];
  }

  const notes = fs
    .readdirSync(notesDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const source = fs.readFileSync(path.join(notesDirectory, fileName), "utf8");
      return parseNoteSource(slug, source);
    });

  validateUniqueNotes(notes);
  return notes.sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );
}

export function getPublishedNotes(): Note[] {
  return getAllNotes().filter((note) => note.status === "published");
}

export function getPublishedNote(slug: string): Note | undefined {
  return getPublishedNotes().find((note) => note.slug === slug);
}
