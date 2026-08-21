// @vitest-environment jsdom
import { useSyncExternalStore } from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import axe from 'axe-core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { clonePrettyTheme, DEFAULT_PRETTY_THEME, type PrettyThemeConfig } from '../../../settings/pretty-settings.ts'
import { en, type PrettyTranslate } from '../../locales.ts'
import type { PrettyThemePort } from '../theme/dsh-theme-adapter.ts'
import type { PrettySettingsPort, PrettySettingsSnapshot } from '../state/dsh-settings-adapter.ts'
import { PrettySettingsController } from '../state/pretty-settings-controller.ts'
import { PrettySection, type PrettySectionProps } from './PrettySection.tsx'

afterEach(cleanup)

class SettingsPort implements PrettySettingsPort {
  snapshot: PrettySettingsSnapshot = { status: 'ready', theme: clonePrettyTheme(DEFAULT_PRETTY_THEME), revision: 1, writable: true, mode: 'host', overridden: false }
  listeners = new Set<() => void>()
  getSnapshot = () => this.snapshot
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  async saveTheme(theme: PrettyThemeConfig) {
    this.snapshot = { ...this.snapshot, theme: clonePrettyTheme(theme), revision: 2, overridden: true }
    for (const listener of this.listeners) listener()
    return 'saved' as const
  }
  async resetTheme() {
    this.snapshot = { ...this.snapshot, theme: clonePrettyTheme(DEFAULT_PRETTY_THEME), revision: 3, overridden: false }
    for (const listener of this.listeners) listener()
    return 'saved' as const
  }
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  return Object.entries(params ?? {}).reduce((text, [key, value]) => text.replace(`{${key}}`, String(value)), template)
}

function renderReady() {
  const settings = new SettingsPort()
  const theme: PrettyThemePort = { preview: vi.fn(), restore: vi.fn(), clear: vi.fn(), dispose: vi.fn() }
  const controller = new PrettySettingsController(settings, theme)
  const fontCatalog = { supported: true, loadFamilies: vi.fn(async () => ['Fira Code', 'Avenir Next']) }
  const t: PrettyTranslate = (key, params) => interpolate(en[key], params)
  const usePretty = <T,>(selector: (state: ReturnType<typeof controller.store.getSnapshot>) => T): T => {
    const state = useSyncExternalStore(controller.store.subscribe, controller.store.getSnapshot, controller.store.getSnapshot)
    return selector(state)
  }
  const props = { close: () => {}, controller, fontCatalog, usePretty, t } as PrettySectionProps
  const result = render(<PrettySection {...props} />)
  return { ...result, controller, fontCatalog, settings, theme }
}

describe('PrettySection', () => {
  it('supports the complete keyboard-addressable settings flow', async () => {
    const { theme } = renderReady()
    expect(screen.getByRole('heading', { name: 'Pretty' })).toBeTruthy()
    fireEvent.click(screen.getByRole('switch', { name: /Enable Pretty theme/ }))
    fireEvent.change(screen.getByLabelText('Preset'), { target: { value: 'lobster' } })
    fireEvent.change(screen.getByLabelText('Interface font'), { target: { value: 'humanist' } })
    fireEvent.change(screen.getByRole('slider', { name: /Interface layer strength/ }), { target: { value: '72' } })
    expect(theme.preview).toHaveBeenCalled()
    expect(screen.getByText('Unsaved changes')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Save and apply' }))
    await waitFor(() => expect(screen.getByText('Saved and applied.')).toBeTruthy())
    expect((screen.getByRole('button', { name: 'Save and apply' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: 'Discard changes' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('makes the disabled state explicit before customization can be edited', () => {
    const { theme } = renderReady()
    expect(screen.getByText('Pretty is currently off')).toBeTruthy()
    expect((screen.getByLabelText('Preset') as HTMLSelectElement).disabled).toBe(true)
    expect(screen.getByRole('button', { name: 'Save with Pretty off' }).hasAttribute('disabled')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Enable and preview' }))

    expect((screen.getByLabelText('Preset') as HTMLSelectElement).disabled).toBe(false)
    expect(theme.preview).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: true }))
    expect(screen.queryByText('Pretty is currently off')).toBeNull()
  })

  it('loads every unique Font Book family and persists a local font selection', async () => {
    const { fontCatalog, theme } = renderReady()
    fireEvent.click(screen.getByRole('button', { name: 'Enable and preview' }))
    fireEvent.click(screen.getByRole('button', { name: 'Load system fonts' }))
    await waitFor(() => expect(screen.getByText('2 system font families available.')).toBeTruthy())
    expect(fontCatalog.loadFamilies).toHaveBeenCalledOnce()

    fireEvent.change(screen.getByLabelText('Interface font'), { target: { value: 'local:Avenir Next' } })
    expect(theme.preview).toHaveBeenLastCalledWith(expect.objectContaining({ uiFont: 'local:Avenir Next' }))
  })

  it('associates color errors and has no serious accessibility violations', async () => {
    const { container } = renderReady()
    fireEvent.click(screen.getByRole('button', { name: 'Enable and preview' }))
    const foreground = screen.getByLabelText('Foreground')
    fireEvent.change(foreground, { target: { value: '#12' } })
    fireEvent.blur(foreground)
    expect(foreground.getAttribute('aria-describedby')).toBeTruthy()
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })
    expect(results.violations.filter(item => item.impact === 'serious' || item.impact === 'critical')).toEqual([])
  })
})
