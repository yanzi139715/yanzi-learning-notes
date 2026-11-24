---
title: 几个 AI 在同一个文件夹里干活，提交时会混进别人的改动
summary: 同一个工作区只有一个暂存区，只 add 自己的文件也可能把别人的改动一起提交。
publishedAt: 2026-09-23
status: published
---

同一个 git 仓库里同时开着几个 AI 编程会话，各做各的。结果出了两次“混提交”：

1. 某个会话只 `git add` 了自己的文件，再 `git commit`，提交里却多了十几个别的会话的文件。
2. 改用 `git commit -- 某文件`，想只提交这一个文件，结果把同一个文件里别人还没提交的改动也带进去了。

另外，两个会话同时编译 iOS，`xcodebuild` 报 `database is locked`。

## 原因

这些都是 git 和 Xcode 本来的行为：

- 一个工作区只有一个暂存区（准备提交的内容先放在这里）。所有在这个文件夹里干活的会话共用它。别人 `git add` 过的东西，你一执行 `git commit` 就会一起提交。
- `git commit -- 路径` 提交的是这个文件现在的完整内容，不只是你暂存的那部分。同一个文件里别人的改动也会被带上。
- Xcode 的构建数据库同一时间只能有一个构建在写，两个一起编就会互相锁住。

## 怎么做

提交前先看看暂存区里有什么：

```bash
git status --short
```

看到不是自己暂存的文件，就别直接提交。

和别人改同一个文件（比如更新日志）时，只暂存自己那几处改动：

```bash
git diff -U3 -- CHANGELOG.md > mine.patch
# 编辑 mine.patch，只留下自己的改动
git apply --cached mine.patch
git commit
```

已经提交错了，先撤回再重来：

```bash
git reset --soft HEAD~1
git restore --staged <别人的文件>
# 重新提交自己的部分
```

然后告诉对方会话，让它检查一下自己的暂存状态。

主工作区被别人改到一半、编译不过时，用 `git worktree add` 另开一个独立文件夹来编译和验证。

做原生编译前，先看看有没有别人在编：

```bash
pgrep -f xcodebuild
```

有的话就错开时间。

## 适用情况

适合多个 AI 会话或多个终端共用同一个文件夹的仓库，尤其是有更新日志、索引、配置这类大家都会改的文件时。

如果每个会话都有自己的 worktree 或独立克隆，暂存区不共用，前面的问题就不会出现。
