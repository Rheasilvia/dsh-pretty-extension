# dsh-pretty-extension

面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI 的界面美化插件。

当前为初始化版本：插件安装后会在 **Settings** 一级导航中增加 **Pretty** 选项卡，选项卡内容暂时为空。后续的主题、布局与交互美化都将在这个独立插件中实现，不修改 DeepSeek Harness 源码。

## 当前能力

- 使用 DSH 官方 profile patch 机制挂载插件。
- 通过 `settings.section` 插槽注册一级 **Pretty** 设置页。
- Host 半区保持为空；Browser 半区负责 UI 注册。
- 提供 TypeScript 类型检查、Vitest 测试和可发布构建产物。

## 技术栈

- Node.js `^22.19.0 || >=24.0.0`
- pnpm 11
- TypeScript 5.7
- tsdown 0.22
- Vitest 4
- DeepSeek Harness Web Client SDK `0.1.0-rc.8`

项目结构与动态加载方式参考了 [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)：`src/index.ts` 是 Host 半区，`src/client/index.ts` 是 Browser 半区，`cordis.patch.yml` 负责把插件加入 `web` profile。

## 开发

```sh
pnpm install
pnpm check
```

常用命令：

```sh
pnpm typecheck   # TypeScript 类型检查
pnpm test        # 单元测试
pnpm build       # 生成 lib/index.js、lib/client.js 和类型声明
pnpm watch       # 监听源码并重建 JavaScript
```

## 安装到 DeepSeek Harness

先构建插件，再通过本地链接加入 `web` profile：

```sh
pnpm install
pnpm build
dsh plugin --profile web add link:$(pwd)
```

重启 `dsh web` 后，打开 **Settings > Pretty** 即可看到该选项卡。仅刷新浏览器不会重新加载 profile 中的新插件。

卸载：

```sh
dsh plugin --profile web remove dsh-pretty-extension
```

## 项目结构

```text
.
├── cordis.patch.yml       # web profile 插件行
├── src/
│   ├── index.ts           # Host 半区（初始化阶段为空）
│   └── client/index.ts    # Browser 半区与 Pretty Settings 注册
├── tests/client.spec.ts   # Settings 插槽注册测试
├── tsdown.config.ts       # Host 与 DSH Browser 动态模块构建
└── tsconfig.build.json    # 发布类型声明构建
```

## 设计边界

- 插件只通过 DSH 公开的 Cordis/profile/slot 机制集成。
- 初始化阶段不写入设置数据，不注册 Host API，也不改变 DSH 原生样式。
- `Pretty` 当前是一级 Settings 选项卡，而不是“Plugins”页中的二级配置卡。
- 美化能力将在后续版本逐项加入，并继续保持可卸载、无宿主源码修改。

## 许可证

[MIT](LICENSE)
