# AGENTS.md · 妍子学习笔记

## 项目目标

- 发布经过事实核验和脱敏的公开 learning。
- 当前只完成内容、路由和工程底座；正式视觉与 Vercel 生产部署等用户拍板（见红线）。
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
- 用户拍板视觉之前，不决定最终字体、色彩、版式、动效或品牌语言，也不创建 Vercel 生产部署。

## 验证

```bash
pnpm verify
```

`pnpm verify` 包含工作树敏感扫描、假 token 拒绝测试、内容合同、类型检查、lint 和生产构建。
