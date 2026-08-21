import { describe, expect, it, vi } from 'vitest'
import { clonePrettyTheme, DEFAULT_PRETTY_THEME } from '../../../settings/pretty-settings.ts'
import { DshThemeAdapter } from './dsh-theme-adapter.ts'

describe('DshThemeAdapter', () => {
  it('replaces one owned token layer and clears it when disabled or disposed', () => {
    const releases = [vi.fn(), vi.fn()]
    const overrideTokens = vi.fn()
      .mockReturnValueOnce(releases[0])
      .mockReturnValueOnce(releases[1])
    const adapter = new DshThemeAdapter({ overrideTokens } as never)
    const enabled = { ...clonePrettyTheme(DEFAULT_PRETTY_THEME), enabled: true }

    adapter.preview(enabled)
    expect(overrideTokens).toHaveBeenCalledWith('dsh-pretty-extension', expect.objectContaining({
      '--dsw-alias-brand-primary': expect.any(Object),
    }))
    adapter.preview({ ...enabled, contrast: 80 })
    expect(releases[0]).toHaveBeenCalledOnce()
    adapter.restore({ ...enabled, enabled: false })
    expect(releases[1]).toHaveBeenCalledOnce()
    adapter.dispose()
    expect(overrideTokens).toHaveBeenCalledTimes(2)
  })
})
