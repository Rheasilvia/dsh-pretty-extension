import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { FileSettingsProvider } from '@deepseek-ai/dsh-settings-file'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { PRETTY_SETTINGS_NAMESPACE, PrettySettingsSchema } from '../../src/settings/pretty-settings.ts'
import { THEME_PRESETS } from '../../src/client/pretty/theme/theme-presets.ts'

const cleanup: Array<() => Promise<void>> = []
afterEach(async () => { while (cleanup.length > 0) await cleanup.pop()!() })

describe('settings.yaml persistence', () => {
  it('changes only ui-pretty.theme and removes the override on reset', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-pretty-'))
    const path = join(root, 'settings.yaml')
    await writeFile(path, 'unrelated:\n  keep: true\n')
    const ctx = new Context()
    const fiber = ctx.plugin(FileSettingsProvider, { path, watch: false })
    cleanup.push(async () => { await fiber.dispose(); await rm(root, { recursive: true, force: true }) })
    await fiber
    const scope = ctx.settings.register(settingsNamespace(PRETTY_SETTINGS_NAMESPACE), PrettySettingsSchema)
    await scope.update({
      theme: {
        enabled: true, preset: 'custom', light: THEME_PRESETS.codex.light, dark: THEME_PRESETS.codex.dark,
        uiFont: 'system', codeFont: 'jetbrains', translucentSidebar: false, contrast: 60,
      },
    })
    const saved = await readFile(path, 'utf8')
    expect(saved).toContain('unrelated:')
    expect(saved).toContain('ui-pretty:')
    expect(saved).toContain('codeFont: jetbrains')
    expect(saved).toContain('accent: "#0169CC"')

    await scope.replace({})
    const reset = await readFile(path, 'utf8')
    expect(reset).toContain('unrelated:')
    expect(reset).not.toContain('theme:')
  })
})
