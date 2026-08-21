# Changelog

## 0.2.0 - 2026-08-21

- 实现 Settings > Pretty 个性化设置页面和中英文界面。
- 支持浅色/深色调色板、与 Codex 对齐的 28 套主题预设、82% 半透明侧栏和层次强度。
- 通过 Local Font Access API 按用户授权加载 macOS Font Book 的完整 family 清单，本机字体可用于界面与代码并持久化到 YAML。
- 通过 DSH theme token override 实时预览，并在离开、放弃或卸载时恢复已保存主题。
- 注册 `ui-pretty` settings schema，将完整 `theme` 原子保存到 `settings.yaml`；恢复默认使用 unset。
- 增加 WCAG 4.5:1 最小前景色修正、revision 冲突保护和远程只读状态。
- 引入功能域共置组件、settings/theme adapters、controller 状态机和内联 CSS Modules 构建适配。
- 增加领域、控制器、组件、accessibility 和真实 YAML provider 集成测试。
- 修正 Pretty 关闭时仍可编辑且显示“保存并应用”的误导交互；关闭状态现在会锁定编辑器并提供明确的启用入口。
- 修正操作栏与 DSH Settings surface token 不一致的问题，并合并重复的保存/未保存状态提示。

## 0.1.0 - 2026-08-21

- 初始化 DSH Web UI 插件工程。
- 在 Settings 中注册空白的 Pretty 一级选项卡。
- 添加 TypeScript、tsdown、Vitest、README 与贡献指南。
