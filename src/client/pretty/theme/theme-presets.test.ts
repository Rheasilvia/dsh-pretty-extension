import { describe, expect, it } from 'vitest'
import { CODEX_THEME_PRESET_IDS } from '../../../settings/pretty-settings.ts'
import { BUILTIN_PRESET_IDS, THEME_PRESETS } from './theme-presets.ts'

describe('Codex-aligned theme presets', () => {
  it('keeps the same 28 registered theme families as Codex', () => {
    expect(BUILTIN_PRESET_IDS).toEqual(CODEX_THEME_PRESET_IDS)
    expect(BUILTIN_PRESET_IDS).toHaveLength(28)
    expect(Object.keys(THEME_PRESETS)).toHaveLength(28)
  })

  it.each(BUILTIN_PRESET_IDS)('provides complete light and dark palettes for %s', id => {
    expect(THEME_PRESETS[id]).toMatchObject({
      id,
      label: expect.any(String),
      light: { accent: expect.stringMatching(/^#[0-9A-F]{6}$/), background: expect.any(String), foreground: expect.any(String), sidebar: expect.any(String) },
      dark: { accent: expect.stringMatching(/^#[0-9A-F]{6}$/), background: expect.any(String), foreground: expect.any(String), sidebar: expect.any(String) },
    })
  })
})
