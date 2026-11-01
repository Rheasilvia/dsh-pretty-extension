<div align="center">

# DSH Pretty Extension

**A polished theme editor for the DeepSeek Harness Web UI.**

Customize colors, typography, and interface depth from a native-looking **Settings → Pretty** page.

[![GitHub stars](https://img.shields.io/github/stars/Rheasilvia/dsh-pretty-extension?style=flat-square)](https://github.com/Rheasilvia/dsh-pretty-extension/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Rheasilvia/dsh-pretty-extension?style=flat-square)](https://github.com/Rheasilvia/dsh-pretty-extension/issues)
[![License](https://img.shields.io/github/license/Rheasilvia/dsh-pretty-extension?style=flat-square)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4f7cff?style=flat-square)](https://github.com/topics/dsh-plugin)

[Features](#features) · [Installation](#installation) · [Usage](#usage) · [Development](#development) · [Contributing](#contributing)

</div>

<p align="center">
  <img src="docs/images/pretty-settings.png" alt="Pretty settings in DeepSeek Harness, showing the theme preview, preset picker, and custom palette controls" width="1100" />
</p>

DSH Pretty Extension adds a complete theme editor to [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). Start from one of 28 presets or build your own light and dark palettes, preview every change in context, and save the result through DSH's settings system.

The extension uses the public DSH plugin, settings, slot, and theme APIs. It does not fork or patch the DeepSeek Harness source tree, and it stays disabled until you explicitly enable it.

## Features

| Capability | What it adds |
| --- | --- |
| **28 theme presets** | Ayu, Catppuccin, Codex, Dracula, GitHub, Nord, Proof, Tokyo Night, Vercel, Xcode, and more. |
| **Independent light and dark palettes** | Customize accent, background, foreground, and sidebar colors for each appearance mode. |
| **Live preview** | See the sidebar, conversation surface, and selected-session state before saving. |
| **Typography controls** | Choose separate UI and code fonts, including local macOS Font Book families when permitted by the browser. |
| **Interface depth** | Tune surfaces, borders, secondary text, hover states, and an optional translucent sidebar rendered at 82% opacity. |
| **Accessible color correction** | Low-contrast foreground colors are minimally adjusted to preserve a WCAG 4.5:1 text contrast ratio. |
| **Native DSH integration** | Uses DSH menus, semantic theme tokens, settings persistence, revision protection, and English/Chinese UI copy. |

## Installation

### Requirements

- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) `0.2.0-rc.2` or later (Web or Desktop — the same package serves both, since the desktop app embeds the web UI).
- `pnpm` available on `PATH` when installing from the terminal or from the Web UI's **Plugins** page; `dsh plugin` forwards to pnpm. The Desktop app uses the package manager bundled with the app.

### Install from inside DSH

DSH Web and Desktop both expose a **Plugins** page, which installs into the profile the UI is running — `web` in a browser, the reserved `desktop` profile in the Desktop app — so no profile name is needed.

1. Open DSH: run `dsh web` and open its loopback URL, or launch DeepSeek Harness Desktop.
2. Open **Plugins** in the sidebar, choose **Add plugin**, and enter:
   ```text
   github:Rheasilvia/dsh-pretty-extension
   ```
3. Install the plugin, then choose **Enable now** if the finished install offers it.
4. If DSH says a restart is required, restart the app or the `dsh web` process and reopen the UI.
5. Open **Settings → Pretty** and turn on **Enable Pretty theme**.

### Install from the terminal

`dsh plugin --profile <name> <args>` forwards the remaining arguments to pnpm in the profile directory.

#### Web profile

Stop any running `dsh web` process, install the plugin, and start DSH again:

```sh
dsh plugin --profile web add github:Rheasilvia/dsh-pretty-extension
dsh web
```

#### Desktop profile

The `dsh` command installed from npm cannot manage the reserved Desktop profile and exits with:

```text
error: profile "desktop" is managed exclusively by the Electron application
```

Install from the **Plugins** page instead. For the terminal, open DeepSeek Harness Desktop once so it initializes its profile, install the `dsh` command shipped with the app (the **Manage dsh Command…** menu item), fully quit the app, then run:

```sh
dsh plugin --profile desktop add github:Rheasilvia/dsh-pretty-extension
```

Relaunch the app after the command finishes. If another `dsh` installation comes first on `PATH`, the command manager reports it; run the Desktop command by its full path instead.

> [!IMPORTANT]
> `dsh plugin add` and the Plugins page update the profile on disk. A running DSH process does not load a newly added bundle, so restart DSH after installing, updating, or removing the plugin (profiles with DSH's HMR enabled apply the change without a restart).

> [!NOTE]
> The repository ships reviewed, prebuilt Host and client bundles, source maps, and declarations under `lib/`. Git installation does not run plugin lifecycle scripts and does not require a Pretty-specific `allowBuilds` entry.

For a reproducible installation, pin the GitHub dependency to a reviewed commit. The `#<sha>` suffix works in the Plugins page and on the command line:

```sh
dsh plugin --profile web add github:Rheasilvia/dsh-pretty-extension#YOUR_COMMIT_SHA
```

### Link a local checkout

Use a linked checkout for development or testing:

```sh
git clone https://github.com/Rheasilvia/dsh-pretty-extension.git
cd dsh-pretty-extension
corepack enable
pnpm install
pnpm build
dsh plugin --profile web add link:.
dsh web
```

After editing the source, run `pnpm build` and restart `dsh web`. You do not need to add the linked plugin again. For Desktop development, run `dsh plugin --profile desktop add link:.` with the Desktop `dsh` command and relaunch the app.

## Usage

1. Start DSH Web with `dsh web` and open its loopback URL, normally `http://127.0.0.1:3080`, or launch DeepSeek Harness Desktop.
2. Open **Settings → Pretty**.
3. Turn on **Enable Pretty theme**.
4. Select the light or dark palette, then choose a preset or customize its colors, fonts, and interface effects.
5. Review the live preview and click **Save and apply**.

> [!NOTE]
> The Light and Dark buttons in Pretty select the palette you are editing. The active application appearance is still controlled by **Settings → General → Appearance**.

The plugin is disabled by default. Installing it alone does not change the DSH interface or write theme settings.

## Updating

For an unpinned GitHub installation, stop DSH Web and run:

```sh
dsh plugin --profile web update dsh-pretty-extension
dsh web
```

If you pinned a commit, install the new reviewed commit SHA explicitly instead. For a Desktop installation, run `dsh plugin --profile desktop update dsh-pretty-extension` with the Desktop `dsh` command, or remove the plugin and add it again from the **Plugins** page.

## Uninstalling

Stop DSH Web, remove the plugin, and restart the profile:

```sh
dsh plugin --profile web remove dsh-pretty-extension
dsh web
```

For a Desktop installation, run `dsh plugin --profile desktop remove dsh-pretty-extension` with the Desktop `dsh` command, or remove the bundle from the **Plugins** page.

## Troubleshooting

| Problem | What to do |
| --- | --- |
| **Pretty does not appear in Settings** | Confirm DSH is `0.2.0-rc.2` or later (`dsh --version`), the bundle is installed and enabled in the profile you are running (`web` for `dsh web`, `desktop` for the Desktop app), then fully restart DSH. |
| **“Pretty is read-only in this browser”** | Open DSH through `127.0.0.1`, `localhost`, or another loopback address. Remote browser sessions intentionally use memory settings and cannot persist Pretty changes. |
| **The Host settings provider is unavailable** | Use the standard Web profile and restart it after installing or rebuilding the plugin. |
| **Local fonts are unavailable** | Local Font Access requires browser support, a loopback or secure context, and explicit permission. Built-in font stacks remain available. |

## Configuration and privacy

Pretty settings persist through DSH's configuration editor into the active profile's `cordis.patch.yml`, keyed by the plugin's `ui-pretty` entry id. Settings written by plugin versions before 0.3.0 in `$DSH_HOME/settings.yaml` are imported once by DSH itself on the first startup after the upgrade. **Restore defaults** clears the `theme` field override and lets the original DSH theme tokens take effect again.

Local Font Access is requested only after you click **Load system fonts**. The plugin stores the selected font family name; it does not copy or upload font files.

## Development

Local development requires Node.js `^22.19.0 || >=24.0.0` and pnpm 11.

| Command | Description |
| --- | --- |
| `pnpm typecheck` | Run the TypeScript type checker. |
| `pnpm test` | Run domain, controller, component, accessibility, and settings integration tests. |
| `pnpm build` | Build the Host entry, browser client bundle, declarations, and inline CSS Modules. |
| `pnpm check` | Run type checking, tests, and a production build. |
| `pnpm check:dist` | Rebuild and verify that the committed `lib/` tree remains unchanged. |
| `pnpm watch` | Rebuild when source files change. |
| `pnpm pack --dry-run` | Inspect the publishable package contents. |

`lib/` is generated by `pnpm build` and committed so Git installations remain scriptless. Never edit it by hand. After changing source or build tooling, run `pnpm check` and commit the regenerated `lib/` with the source change. `pnpm check:dist` must then pass from the clean commit and in CI.

### Project structure

```text
src/
├── index.ts                         # Host composition root and settings schema
├── settings/pretty-settings.ts      # Persistent configuration contract
└── client/
    ├── index.ts                     # Browser composition root
    ├── locales.ts                   # English and Chinese UI copy
    └── pretty/
        ├── PrettySection/           # Settings page and state branches
        ├── components/              # UI components and CSS Modules
        ├── state/                   # Config form adapter, store, and controller
        └── theme/                   # Presets, font catalog, and token derivation
```

The Host exports the `Config` schema that DSH serves as the `ui-pretty` settings form. The browser client injects the Pretty page into DSH Settings and applies colors and fonts through an owned theme-token override. Adapters keep DSH services outside the UI and theme domain logic.

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and run the verification gates before opening a PR:

```sh
pnpm check
pnpm check:dist
pnpm pack --dry-run
```

## License

Released under the [MIT License](LICENSE).

---

<p align="center">
  A community-maintained plugin for DeepSeek Harness. This project is not affiliated with or endorsed by DeepSeek AI.
</p>
