# dsh-pretty-extension

面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI 的个性化主题插件。它在 **Settings > Pretty** 提供双模式配色、字体和界面层次设置，通过 DSH 公开的 settings/theme/slot 服务生效，不修改 DeepSeek Harness 源码。

## 功能

- 分别编辑浅色和深色调色板；外观模式仍由 **General > Appearance** 管理。
- 与 Codex 当前主题目录对齐的 28 套预设：Ayu、Catppuccin、Absolutely、Codex、Dracula、Everforest、GitHub、Gruvbox、Linear、Lobster、Material、Matrix、Monokai、Night Owl、Nord、Notion、Oscurange、One、Proof、Raycast、Rose Pine、Sentry、Solarized、Tokyo Night、Temple、Vercel、VS Code Plus 和 Xcode。
- 除内置界面/代码字体栈外，可按需读取 macOS Font Book 的完整字体 family 清单，并将任意本机字体分别用于界面或代码。
- 半透明侧栏使用 82% alpha；界面层次强度只影响表面、边框、次级文字和 hover 层次。
- 配色即时预览，点击“保存并应用”后才持久化；放弃更改或离开页面会恢复已保存主题。
- Pretty 关闭时锁定个性化控件并显示“启用并预览”，避免将“配置已保存”误解为“主题已启用”。
- 前景对比度低于 WCAG 4.5:1 时，保留背景并将前景向黑/白做最小幅度修正。
- 外部修改 `settings.yaml` 时使用 revision 防止草稿覆盖新配置。
- 远程浏览器的 memory settings 自动进入只读状态；loopback 浏览器可以保存。
- 中英文界面、键盘操作、可见焦点、错误关联、live region 和 reduced-motion 支持。

默认 `enabled: false`。仅安装插件不会改变 DSH 现有界面，也不会主动写入 `settings.yaml`。

## 开发期安装（推荐）

开发时使用 `link:`，源码修改后只需重新构建并重启 DSH，不必反复从 GitHub 下载：

```sh
cd /Users/chenmengjie/Documents/Repos/dsh-pretty-extension
pnpm install
pnpm build
dsh plugin --profile web add link:/Users/chenmengjie/Documents/Repos/dsh-pretty-extension
```

之后启动或重启 Web profile：

```sh
dsh --profile web
```

打开 **Settings > Pretty**，先点击“启用并预览”或打开“启用 Pretty 主题”开关，再进行个性化配置。开发中可另开终端运行 `pnpm watch`，但 Host/profile 重新加载仍以重启 DSH 最可靠。

字体列表通过浏览器的 Local Font Access API 读取。首次点击“加载系统字体”时浏览器会请求本机字体权限；这是浏览器隐私边界，插件不会绕过授权。Chromium 系浏览器在 loopback/安全上下文中支持该能力；不支持或拒绝授权时仍可使用内置字体栈。

卸载本地链接：

```sh
dsh plugin --profile web remove dsh-pretty-extension
```

## 从 GitHub 安装

DSH 支持直接安装 GitHub 仓库。建议固定 commit，避免后续推送悄悄改变已安装代码：

```sh
dsh plugin --profile web add github:Rheasilvia/dsh-pretty-extension#<commit-sha>
```

Git 安装获取的是源码，pnpm 会通过本项目的 `prepare` 脚本生成 `lib/`。pnpm 10+ 首次可能阻止该构建；按终端提示，在 DSH web profile 的 `pnpm-workspace.yaml` 中加入：

```yaml
allowBuilds:
  dsh-pretty-extension: true
```

然后重新执行安装命令。开发阶段仍推荐 `link:`：反馈更快、不会受远程 commit 与安装期构建影响；准备给其他机器试用时再用固定 commit 的 GitHub 安装。

## 配置持久化

设置由 DSH file settings provider 保存到 `$DSH_HOME/settings.yaml`（默认 `~/.dsh/settings.yaml`）。一次保存只写完整的 `ui-pretty.theme` 字段：

```yaml
ui-pretty:
  theme:
    enabled: true
    preset: custom
    light:
      accent: "#2563EB"
      background: "#F7F9FC"
      foreground: "#172033"
      sidebar: "#ECF2FA"
    dark:
      accent: "#60A5FA"
      background: "#0F172A"
      foreground: "#E7EDF8"
      sidebar: "#131D33"
    uiFont: system
    codeFont: "local:Fira Code"
    translucentSidebar: false
    contrast: 60
```

本机字体使用稳定的 `local:<Font Book family>` 标识，例如 `local:Avenir Next`。插件只保存 family 名称，不保存字体文件。“恢复默认”会 unset `ui-pretty.theme`，让 DSH 原始 theme tokens 重新生效，不会改动其他 namespace。

## 开发与验证

要求 Node.js `^22.19.0 || >=24.0.0` 和 pnpm 11：

```sh
pnpm install
pnpm check
pnpm pack --dry-run
```

常用命令：

```sh
pnpm typecheck   # TypeScript 严格类型检查
pnpm test        # 领域、控制器、组件、a11y、YAML 集成测试
pnpm build       # Host ESM、动态 client.js、声明与内联 CSS Modules
pnpm watch       # 监听并重建
```

## 工程结构

```text
src/
├── index.ts                         # Host composition root / schema 注册
├── settings/pretty-settings.ts      # 配置契约、默认值与 schema
└── client/
    ├── index.ts                     # Browser composition root
    ├── locales.ts                   # zh/en 完整键集合
    └── pretty/
        ├── PrettySection/           # 页面容器和状态分支
        ├── components/              # 共置的展示组件与 CSS Modules
        ├── state/                   # settings adapter、store、controller
        └── theme/                   # theme adapter、28 套预设、Font Book 目录与 token 纯函数
build/inline-css-modules.ts          # CSS Modules 编译并嵌入动态 client.js
tests/integration/                   # 真实 settings.yaml 持久化测试
```

架构边界：两个 `index.ts` 只组装依赖；组件不访问 Cordis/DSH context；设置与主题服务通过 adapter 隔离；颜色、预设、字体和 token 派生保持无 React、无浏览器副作用。

项目初始化与动态加载方式参考 [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)，具体运行契约以 DeepSeek Harness `0.1.0-rc.8` client/settings API 为准。

## 许可证

[MIT](LICENSE)
