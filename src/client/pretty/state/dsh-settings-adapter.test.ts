import { describe, expect, it, vi } from 'vitest'
import type { SettingsScope, SettingsScopeSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import { clonePrettyTheme, DEFAULT_PRETTY_THEME, type PrettySettings } from '../../../settings/pretty-settings.ts'
import { DshSettingsAdapter } from './dsh-settings-adapter.ts'

function scopeHarness() {
  let snapshot: SettingsScopeSnapshot<PrettySettings> = {
    status: 'ready', value: { theme: clonePrettyTheme(DEFAULT_PRETTY_THEME) }, base: undefined,
    user: undefined, revision: 1, writable: true, mode: 'host',
  }
  const scope = {
    getSnapshot: () => snapshot,
    subscribe: vi.fn(() => () => {}),
    set: vi.fn(async (_field: string, value: unknown) => {
      snapshot = { ...snapshot, value: { theme: value as typeof DEFAULT_PRETTY_THEME }, user: { theme: value }, revision: 2 }
    }),
    unset: vi.fn(async () => {
      snapshot = { ...snapshot, user: {}, revision: 3, value: { theme: clonePrettyTheme(DEFAULT_PRETTY_THEME) } }
    }),
  } satisfies SettingsScope<PrettySettings>
  return { scope, adapter: new DshSettingsAdapter(scope) }
}

describe('DshSettingsAdapter', () => {
  it('writes the whole theme field and clears only that field', async () => {
    const { scope, adapter } = scopeHarness()
    const theme = { ...clonePrettyTheme(DEFAULT_PRETTY_THEME), enabled: true }
    await expect(adapter.saveTheme(theme, 1)).resolves.toBe('saved')
    expect(scope.set).toHaveBeenCalledWith('theme', theme)
    await expect(adapter.resetTheme(2)).resolves.toBe('saved')
    expect(scope.unset).toHaveBeenCalledWith('theme')
  })
})
