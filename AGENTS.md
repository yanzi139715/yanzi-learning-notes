# AGENTS.md · 妍子学习笔记

## 项目目标

- 发布经过事实核验和脱敏的公开 learning。
- 已上线 https://notes.yanzi.life（Vercel，推 main 自动部署）。画风跟个人网站「妍子的家」新版一致（她 2026-11-24 拍板），改视觉先对照 09妍子小家的新版样稿。
- 文风：普通学习笔记，平实好懂、去 AI 味；不写她的自我介绍（她 2026-11-24 定）。
- 技术：Next.js App Router、TypeScript、本地 Markdown、Vercel。

## 目录地图

- `content/notes/`：公开文章源文件，不从私人仓库自动同步。
- `src/content/`：文章元数据合同、读取和校验。
- `src/app/`：薄路由与语义化页面。
- `scripts/`：公开前敏感信息检查。
- `tests/`：内容合同与发布边界测试。

## 红线

- 不提交订阅、服务器、真实 IP、UUID、密码、令牌、账号、认证内容、本机用户名或私人记忆。
- 事实、推断和未知必须明确区分。
- 私人 learning 只能另写脱敏公开稿，禁止构建时读取私人仓库。
- 视觉方向已定（跟小家一套）；换风格、换品牌语言先问她。
- 推 main 就上线：推之前 `pnpm verify` 必须全绿。

## 验证

```bash
pnpm verify
```

`pnpm verify` 包含工作树敏感扫描、假 token 拒绝测试、内容合同、类型检查、lint 和生产构建。
