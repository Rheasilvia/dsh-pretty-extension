import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PRETTY_THEME, PrettySettingsSchema, decodePrettySettings,
} from './pretty-settings.ts'

describe('Pretty settings contract', () => {
  it('resolves a disabled Codex draft without persisting it', () => {
    expect(PrettySettingsSchema({} as never)).toEqual({ theme: DEFAULT_PRETTY_THEME })
    expect(DEFAULT_PRETTY_THEME.enabled).toBe(false)
    expect(DEFAULT_PRETTY_THEME.contrast).toBe(60)
  })

  it('rejects malformed browser settings snapshots', () => {
    expect(decodePrettySettings({ theme: { ...DEFAULT_PRETTY_THEME, contrast: 60.5 } })).toBeUndefined()
    expect(decodePrettySettings({
      theme: { ...DEFAULT_PRETTY_THEME, light: { ...DEFAULT_PRETTY_THEME.light, accent: '#abc' } },
    })).toBeUndefined()
  })

  it('accepts and detaches a complete config', () => {
    const source = { theme: { ...DEFAULT_PRETTY_THEME, light: { ...DEFAULT_PRETTY_THEME.light } } }
    const decoded = decodePrettySettings(source)
    expect(decoded).toEqual(source)
    expect(decoded?.theme).not.toBe(source.theme)
    expect(decoded?.theme.light).not.toBe(source.theme.light)
  })

  it('validates colors, fonts, and integer contrast at the Host boundary', () => {
    expect(() => PrettySettingsSchema({
      theme: { ...DEFAULT_PRETTY_THEME, light: { ...DEFAULT_PRETTY_THEME.light, accent: '#fff' } },
    } as never)).toThrow()
    expect(() => PrettySettingsSchema({
      theme: { ...DEFAULT_PRETTY_THEME, codeFont: 'downloaded-font' },
    } as never)).toThrow()
    expect(PrettySettingsSchema({
      theme: { ...DEFAULT_PRETTY_THEME, uiFont: 'local:Avenir Next', codeFont: 'local:Fira Code' },
    } as never).theme).toMatchObject({ uiFont: 'local:Avenir Next', codeFont: 'local:Fira Code' })
    expect(() => PrettySettingsSchema({
      theme: { ...DEFAULT_PRETTY_THEME, contrast: 101 },
    } as never)).toThrow()
  })
})
