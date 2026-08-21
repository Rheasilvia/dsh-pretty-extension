# Contributing

## 本地要求

- Node.js `^22.19.0 || >=24.0.0`
- pnpm 11
- 可正常启动的 DeepSeek Harness `dsh web`

## 工作流

1. 从 `main` 创建功能分支。
2. 将 UI 功能放在 `src/client/`，仅在确实需要 Host 能力时修改 `src/index.ts`。
3. 使用 DSH 的公开 slot/service 接口，不修改 DeepSeek Harness 源码。
4. 为行为变化补充测试并更新 README。
5. 提交前运行 `pnpm check`。

建议使用 Conventional Commits，例如 `feat(pretty): add theme selector`。
