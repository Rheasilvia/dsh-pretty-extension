# AGENTS.md

Guidance for AI coding agents working in this repository. Assumes no prior knowledge of the project.

## Project overview

`dsh-pretty-extension` is a plugin ("extension") for the **DeepSeek Harness (DSH) Web UI**. It adds a complete theme editor under **Settings → Pretty**: 28 theme presets, independent light/dark palettes, typography controls (including local macOS fonts via the Local Font Access API), interface-depth effects, live preview, and WCAG 4.5:1 foreground color correction.

Key facts:

- It uses only the **public DSH plugin, settings, slot, and theme APIs** — it never forks or patches the DeepSeek Harness source tree (see `CONTRIBUTING.md`).
- The plugin is **disabled by default**; installing it changes nothing until the user enables it in Settings → Pretty.
- Published as an npm-style package installed via `dsh plugin --profile web add github:Rheasilvia/dsh-pretty-extension`. The `dsh` field in `package.json` and `cordis.patch.yml` declare how DSH loads it.
- User settings persist under the `ui-pretty.theme` namespace in `$DSH_HOME/settings.yaml` via DSH's file settings provider. Remote (non-loopback) browser sessions get read-only memory settings on purpose.

## Tech stack

- **Language**: TypeScript ~5.7, strict mode, ESM (`"type": "module"`), `.ts` extension imports (`allowImportingTsExtensions`).
- **UI**: React 18 (jsx runtime), CSS Modules (inlined at build time).
- **Host runtime**: `@deepseek-ai/cordis` (DI/plugin framework) + `@deepseek-ai/dsh-settings`.
- **Client runtime**: `@deepseek-ai/dsh-client-runtime` and `dsh-client-*` UI packages (slots, locale, settings, theme, primitives).
- **Schema/validation**: `@deepseek-ai/schemastery` (zod-like API, imported as `z`).
- **Toolchain**: pnpm 11 (via corepack), Node `^22.19.0 || >=24.0.0`, tsdown 0.22 (rolldown-based bundler), lightningcss, Vitest 4, jsdom, @testing-library/react, axe-core.

## Build and test commands

All commands run from the repository root with pnpm:

| Command | What it does |
| --- | --- |
| `pnpm typecheck` | `tsc --noEmit` over `src/`, `tests/`, `build/`, and configs. |
| `pnpm test` | `vitest run` — domain, controller, component, accessibility, and integration tests. |
| `pnpm build` | Cleans `lib/`, emits declarations (`tsc -p tsconfig.build.json` → `lib/types`), then bundles host + client with tsdown → `lib/`. |
| `pnpm check` | The full gate: typecheck + test + build. **Run this before committing.** |
| `pnpm check:dist` | Rebuilds and checks that the committed `lib/` tree remains clean, including modified, missing, and untracked files. |
| `pnpm watch` | `tsdown --watch` rebuild on change. |
| `pnpm pack --dry-run` | Inspect publishable package contents (also part of the PR checklist). |

Git installations execute no package lifecycle scripts. The repository carries prebuilt `lib/` artifacts, which must be regenerated locally with `pnpm build` and reviewed with the source changes.

Build output details (see `tsdown.config.ts`):

- **Host** (`src/index.ts` → `lib/index.js`): ESM, `platform: 'node'`, never bundles `@deepseek-ai/cordis` or `@deepseek-ai/dsh-settings`.
- **Client** (`src/client/index.ts` → `lib/client.js`): CJS for the browser, wrapped in DSH's `window.__ModuleLoader__.load(...)` via banner/footer. React and the `dsh-client-*` packages are external (provided by the host page, declared in `package.json`'s `dsh.client.inject`).
- **CSS Modules** are inlined by a custom tsdown plugin (`build/inline-css-modules.ts`): lightningcss compiles each `*.module.css` (hashed class names, minified) and the generated module injects a `<style data-plugin="dsh-pretty-extension">` tag at import time. The client dispose path removes all such tags.

## Repository layout

```text
src/
├── index.ts                          # Host composition root: Cordis plugin `pretty`, registers the settings schema
├── settings/pretty-settings.ts       # Persistent config contract: namespace `ui-pretty`, schema, defaults, decoders
└── client/
    ├── index.ts                      # Browser composition root: locale, settings scope, theme adapter, slot registration
    ├── locales.ts                    # English and Chinese UI copy (namespace `settings.pretty`)
    └── pretty/
        ├── PrettySection/            # The Settings → Pretty page component and its state branches
        ├── components/               # UI components, one folder each with .tsx + .module.css (+ tests)
        ├── state/                    # Settings adapter, snapshot store, controller state machine, local-font hook
        └── theme/                    # Presets, font stacks/catalog, token derivation, contrast correction, theme adapter
tests/
├── host.spec.ts                      # Host composition-root contract test (mocked Cordis context)
├── client.spec.ts                    # Client composition-root contract test (mocked ClientContext)
├── build/inline-css-modules.test.ts  # Deterministic CSS Modules build-plugin tests
├── integration/settings-file.test.ts # Real FileSettingsProvider + temp settings.yaml round-trip
└── mocks/ui-primitives.tsx           # Vitest alias for @deepseek-ai/dsh-client-ui-primitives
build/inline-css-modules.ts           # tsdown plugin that inlines CSS Modules
scripts/clean.mjs                     # Removes lib/ before a build
scripts/check-dist.mjs                # Requires generated lib/ to remain Git-clean
lib/                                  # Committed runtime bundles, maps, and declarations
cordis.patch.yml                      # DSH bundle patch: inserts plugin id `ui-pretty` into the web profile
```

`lib/` is generated and committed build output. Never edit it by hand; regenerate it with `pnpm build` and commit it alongside any source or build-tooling change that affects distribution artifacts.

## Architecture

Two entry points share one settings contract:

- **Host** (`src/index.ts`): a Cordis plugin named `pretty`. Its `apply(ctx)` injects the `settings` service and registers `PrettySettingsSchema` under namespace `ui-pretty` with `{ applies: 'live' }`.
- **Client** (`src/client/index.ts`): declares `inject = ['slots', 'locale', 'settingsScope', 'theme']`. It registers en/zh locales, binds a typed `settingsScope` to `ui-pretty`, builds the controller, and registers the `PrettySection` component into the `settings.section` slot (id `pretty`, order 100).

Inside the client, DSH services are kept out of the UI/theme domain logic via **ports and adapters**:

- `PrettySettingsPort` / `DshSettingsAdapter` — snapshot + subscribe + revision-checked save/reset over the DSH settings scope.
- `PrettyThemePort` / `DshThemeAdapter` — applies derived theme tokens through DSH's owned `theme.overrideTokens('dsh-pretty-extension', ...)` and releases them on restore/dispose.
- `PrettySettingsController` — the state machine between UI and ports: draft vs persisted config, save status (`idle | saving | saved | error | conflict`), dirty tracking, revision-conflict detection, read-only mode for remote/memory sessions, and live preview on every edit.
- `pretty-settings-store.ts` — a minimal `useSyncExternalStore`-compatible snapshot store (no external state library).
- `theme/` — pure domain logic: preset definitions, `deriveThemeTokens`, font stacks, local-font catalog, `ensureReadableForeground` contrast correction.

## Code style guidelines

- `.editorconfig`: UTF-8, LF, 2-space indent, final newline, trimmed trailing whitespace (except Markdown).
- Strict TypeScript; no lint/formatter config exists — match the surrounding style (no semicolons, single quotes, trailing commas).
- Import project files with explicit `.ts` / `.tsx` extensions (e.g. `from './locales.ts'`); `allowImportingTsExtensions` is on and the bundler handles it.
- Feature-domain colocation: each component lives in its own folder with its `.module.css` and tests next to the source; cross-cutting contracts live in `src/settings/pretty-settings.ts`.
- Comments and identifiers are in English; user-facing copy goes through `src/client/locales.ts` in both English and Chinese — update both when adding strings.
- Hex colors are uppercase `#RRGGBB` (validated by `HEX_COLOR_PATTERN`).
- Commits: Conventional Commits recommended, e.g. `feat(pretty): add theme selector` (see `CONTRIBUTING.md`).

## Testing instructions

- Run everything with `pnpm test`; the full pre-commit gate is `pnpm check`.
- Tests are Vitest with globals (`describe`/`it`/`expect` available without import in scope of `vitest/globals` types) — note test files still import from `vitest` explicitly; follow the existing files.
- Unit/domain tests live next to sources as `*.test.ts(x)`; composition-root contract tests and the integration test live in `tests/`.
- Default environment is `node`; DOM/component tests opt in with a `// @vitest-environment jsdom` pragma on line 1 and use `@testing-library/react`.
- `@deepseek-ai/dsh-client-ui-primitives` is aliased to `tests/mocks/ui-primitives.tsx` in `vitest.config.ts` — do not import the real package in tests.
- Accessibility is tested with `axe-core` inside component tests (see `PrettySection.test.tsx`).
- The integration test (`tests/integration/settings-file.test.ts`) boots a real Cordis `Context` with `FileSettingsProvider` against a temp `settings.yaml` — it asserts that only the `ui-pretty` namespace is touched. Use real providers, not mocks, when testing persistence behavior.
- When changing behavior: add/update tests, keep README in sync, run `pnpm check`, commit the regenerated `lib/` with the source change, then run `pnpm check:dist` and `pnpm pack --dry-run` from the clean commit before opening a PR.

## Security considerations

- Never patch or fork DeepSeek Harness itself; use only its public slot/service APIs.
- Settings are validated by `PrettySettingsSchema` (schemastery) on read and write — font family strings and colors have strict patterns/length caps; keep validation strict when extending the schema.
- Local Font Access is requested only on explicit user action ("Load system fonts"); only the font family *name* is persisted, never font files.
- The plugin must stay inert until the user enables it, and must clean up on unload: theme token overrides are released and all `style[data-plugin="dsh-pretty-extension"]` tags are removed in the dispose effect.
- Remote browser sessions (non-loopback) are intentionally read-only; do not weaken this guard.
- Git installations must remain free of `prepare`, `prepack`, `install`, and `postinstall` scripts. Runtime bundles, source maps, and declarations are prebuilt, committed, reviewed, and checked by CI instead.
