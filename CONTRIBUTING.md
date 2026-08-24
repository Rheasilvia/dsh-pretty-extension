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
6. `lib/` 是提交到仓库的生成产物；不要手工修改。将 `pnpm build` 重新生成的 `lib/` 与对应源码一起暂存。
7. 提交后运行 `pnpm check:dist` 和 `pnpm pack --dry-run`，确认分发产物与源码一致且打包内容完整；CI 会执行同样的检查。

建议使用 Conventional Commits，例如 `feat(pretty): add theme selector`。
