import assert from "node:assert/strict";
import test from "node:test";

import {
  getPublishedNote,
  parseNoteSource,
  validateUniqueNotes,
} from "../src/content/notes";

const validSource = `---
title: 测试文章
summary: 用于验证文章合同。
publishedAt: 2026-07-31
status: published
---

正文。
`;

test("解析完整的文章元数据", () => {
  const note = parseNoteSource("test-note", validSource);

  assert.equal(note.slug, "test-note");
  assert.equal(note.title, "测试文章");
  assert.equal(note.status, "published");
  assert.match(note.content, /正文/);
});

test("缺少摘要时拒绝文章", () => {
  const missingSummary = validSource.replace("summary: 用于验证文章合同。\n", "");

  assert.throws(() => parseNoteSource("test-note", missingSummary));
});

test("出现重复 slug 时拒绝文章集合", () => {
  const note = parseNoteSource("same-note", validSource);

  assert.throws(() => validateUniqueNotes([note, note]), /duplicate slug/);
});

test("首篇公开文章包含事实、推断和隐私边界", () => {
  const note = getPublishedNote("ai-residential-routing");

  assert.ok(note);
  assert.match(note.content, /## 实测事实/);
  assert.match(note.content, /## 合理推断/);
  assert.match(note.content, /## 隐私边界/);
});
