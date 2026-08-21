import { describe, expect, it, vi } from 'vitest'
import { clonePrettyTheme, DEFAULT_PRETTY_THEME, type PrettyThemeConfig } from '../../../settings/pretty-settings.ts'
import type { PrettyThemePort } from '../theme/dsh-theme-adapter.ts'
import type { PrettySettingsPort, PrettySettingsSnapshot } from './dsh-settings-adapter.ts'
import { PrettySettingsController } from './pretty-settings-controller.ts'

class FakeSettings implements PrettySettingsPort {
  listeners = new Set<() => void>()
  snapshot: PrettySettingsSnapshot = {
    status: 'ready', theme: clonePrettyTheme(DEFAULT_PRETTY_THEME), revision: 1,
    writable: true, mode: 'host', overridden: false,
  }
  saveResult: 'saved' | 'conflict' | 'error' = 'saved'
  resetResult: 'saved' | 'conflict' | 'error' = 'saved'
  getSnapshot = () => this.snapshot
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  saveTheme = vi.fn(async (theme: PrettyThemeConfig) => {
    if (this.saveResult === 'saved') this.publish({ ...this.snapshot, theme: clonePrettyTheme(theme), revision: 2, overridden: true })
    return this.saveResult
  })
  resetTheme = vi.fn(async () => {
    if (this.resetResult === 'saved') this.publish({ ...this.snapshot, theme: clonePrettyTheme(DEFAULT_PRETTY_THEME), revision: 2, overridden: false })
    return this.resetResult
  })
  publish(snapshot: PrettySettingsSnapshot) { this.snapshot = snapshot; for (const listener of this.listeners) listener() }
}

function harness(settings = new FakeSettings()) {
  const theme: PrettyThemePort = { preview: vi.fn(), restore: vi.fn(), clear: vi.fn(), dispose: vi.fn() }
  return { settings, theme, controller: new PrettySettingsController(settings, theme) }
}

describe('PrettySettingsController', () => {
  it('previews edits and discards back to persisted settings', () => {
    const { controller, theme } = harness()
    controller.setEnabled(true)
    controller.setContrast(78)
    expect(controller.store.getSnapshot()).toMatchObject({ status: 'ready', draft: { enabled: true, contrast: 78 } })
    expect(theme.preview).toHaveBeenCalledTimes(2)
    controller.discard()
    expect(controller.store.getSnapshot()).toMatchObject({ status: 'ready', draft: DEFAULT_PRETTY_THEME })
    expect(theme.restore).toHaveBeenLastCalledWith(DEFAULT_PRETTY_THEME)
  })

  it('saves one complete draft and adopts the new revision', async () => {
    const { controller, settings } = harness()
    controller.selectPreset('everforest')
    await controller.save()
    expect(settings.saveTheme).toHaveBeenCalledWith(expect.objectContaining({ preset: 'everforest' }), 1)
    expect(controller.store.getSnapshot()).toMatchObject({ status: 'ready', revision: 2, saveStatus: 'saved', persisted: { preset: 'everforest' } })
  })

  it('preserves a dirty draft and fences save after an external revision', () => {
    const { controller, settings } = harness()
    controller.setCodeFont('jetbrains')
    settings.publish({ ...settings.snapshot, theme: { ...clonePrettyTheme(DEFAULT_PRETTY_THEME), contrast: 75 }, revision: 3 })
    expect(controller.store.getSnapshot()).toMatchObject({ status: 'ready', saveStatus: 'conflict', draft: { codeFont: 'jetbrains' } })
    controller.reloadLatest()
    expect(controller.store.getSnapshot()).toMatchObject({ status: 'ready', saveStatus: 'idle', draft: { contrast: 75 } })
  })

  it('resets via unset semantics and disposes every external effect', async () => {
    const { controller, settings, theme } = harness()
    controller.setEnabled(true)
    await controller.reset()
    expect(settings.resetTheme).toHaveBeenCalledWith(1)
    expect(controller.store.getSnapshot()).toMatchObject({ status: 'ready', saveStatus: 'saved', draft: DEFAULT_PRETTY_THEME })
    controller.dispose()
    expect(settings.listeners.size).toBe(0)
    expect(theme.dispose).toHaveBeenCalledOnce()
  })

  it('degrades remote memory settings to readonly', () => {
    const settings = new FakeSettings()
    settings.snapshot = { ...settings.snapshot, writable: false, mode: 'memory' }
    expect(harness(settings).controller.store.getSnapshot()).toMatchObject({ status: 'readonly', reason: 'remote-memory' })
  })
})
