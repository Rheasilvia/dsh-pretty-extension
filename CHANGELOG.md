# Changelog

## 0.3.0 - 2026-10-08

- **破坏性**:要求 DeepSeek Harness ≥ 0.2.1-alpha.1(web 与 desktop 同包支持,desktop 渲染层与 web 共用同一插件机制)。
- 适配 DSH 新设置模型:Host 侧改为导出带 `.volatile()` 字段的 `Config` schema(命名空间即 `ui-pretty` 条目 id),设置持久化迁入 profile 的 `cordis.patch.yml`;旧版 `settings.yaml` 中的 `ui-pretty` 设置由 DSH 启动时一次性导入。
- Client 侧从已删除的 `settingsScope` 迁移到 `ctx.configForms.get('ui-pretty')`;写操作改用带 revision 栅栏的 `mutate`,Host 拒绝映射为冲突、传输失败映射为错误;远程(非 loopback)会话的 memory 只读模式维持不变。
- 依赖升级:`@deepseek-ai/cordis` ^4.0.5-alpha.1、`@deepseek-ai/schemastery` ^3.18.5-alpha.1、`@deepseek-ai/dsh-client-*` ^0.2.1-alpha.1;移除已删除的 `@deepseek-ai/dsh-client-runtime` 与 `@deepseek-ai/dsh-settings-file`。
- 跟进 ui-primitives 图标重命名(`IconChevronDownOutline14` → `IconChevronDownOutlineRegular`);抑制 Pretty 条目的自动生成设置表单(自带定制 UI)。

## Unreleased

- GitHub 安装改为直接使用仓库内预构建的 Host/Client bundles、source maps 和声明文件,并移除安装生命周期脚本;全新 DSH profile 不再需要为 Pretty 配置 `allowBuilds`。
- 稳定 CSS Modules 导出顺序,并增加生成产物一致性检查和 GitHub Actions 发布门禁。
- 让 Pretty 预览与真实 Sidebar session selected 状态共用主题 accent 派生的 active fill,并将其与中性 hover 状态分离;预览默认跟随当前明暗模式。
- 将主题预设和字体选择从系统原生下拉替换为 DeepSeek Harness 菜单样式。

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
