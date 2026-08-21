import { describe, expect, it } from 'vitest'
import { DEFAULT_PRETTY_THEME } from '../../../settings/pretty-settings.ts'
import { UI_FONT_STACKS } from './font-stacks.ts'
import { applyPreset, BUILTIN_PRESET_IDS } from './theme-presets.ts'
import { deriveThemeTokens } from './theme-tokens.ts'

describe('Pretty theme domain', () => {
  it.each(BUILTIN_PRESET_IDS)('derives paired tokens for %s', id => {
    const tokens = deriveThemeTokens(applyPreset({ ...DEFAULT_PRETTY_THEME }, id))
    expect(tokens['--dsw-alias-brand-primary']).toEqual(expect.objectContaining({ light: expect.any(String), dark: expect.any(String) }))
  })

  it('makes surface hierarchy stronger monotonically', () => {
    const low = deriveThemeTokens({ ...DEFAULT_PRETTY_THEME, contrast: 0 })
    const high = deriveThemeTokens({ ...DEFAULT_PRETTY_THEME, contrast: 100 })
    expect(low['--dsw-alias-border-l2']!.light).toBe('rgba(13, 13, 13, 0.06)')
    expect(high['--dsw-alias-border-l2']!.light).toBe('rgba(13, 13, 13, 0.17)')
  })

  it('uses system fallbacks and exactly 82 percent sidebar alpha', () => {
    const tokens = deriveThemeTokens({ ...DEFAULT_PRETTY_THEME, translucentSidebar: true })
    expect(tokens['--dsw-font-family']!.light).toBe(UI_FONT_STACKS.system)
    expect(tokens['--dsw-specific-sidebar-fill']!.dark).toBe('rgba(19, 19, 19, 0.82)')
  })
})
