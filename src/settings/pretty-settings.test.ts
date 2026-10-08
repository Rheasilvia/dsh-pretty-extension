import { describe, expect, it } from 'vitest'
import { DEFAULT_PRETTY_THEME, PrettySettingsSchema } from './pretty-settings.ts'

describe('Pretty settings contract', () => {
  it('resolves a disabled Codex draft without persisting it', () => {
    expect(PrettySettingsSchema({} as never).theme.get()).toEqual(DEFAULT_PRETTY_THEME)
    expect(DEFAULT_PRETTY_THEME.enabled).toBe(false)
    expect(DEFAULT_PRETTY_THEME.contrast).toBe(60)
  })

  it('marks the theme field volatile so the browser form can edit it live', () => {
    const schema = PrettySettingsSchema as unknown as { dict: Record<string, { meta: { volatile?: boolean } }> }
    expect(schema.dict.theme?.meta.volatile).toBe(true)
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
    } as never).theme.get()).toMatchObject({ uiFont: 'local:Avenir Next', codeFont: 'local:Fira Code' })
    expect(() => PrettySettingsSchema({
      theme: { ...DEFAULT_PRETTY_THEME, contrast: 101 },
    } as never)).toThrow()
    expect(() => PrettySettingsSchema({
      theme: { ...DEFAULT_PRETTY_THEME, contrast: 60.5 },
    } as never)).toThrow()
  })
})
