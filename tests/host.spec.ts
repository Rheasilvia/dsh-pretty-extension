import type { Context } from '@deepseek-ai/cordis'
import { describe, expect, it, vi } from 'vitest'
import { apply, Config } from '../src/index.ts'
import { DEFAULT_PRETTY_THEME } from '../src/settings/pretty-settings.ts'

describe('Pretty Host composition root', () => {
  it('serves the ui-pretty config schema with a disabled Codex default', () => {
    expect(Config({} as never).theme.get()).toEqual(DEFAULT_PRETTY_THEME)
  })

  it('is optional when no settings service is composed', () => {
    const ctx = { inject: vi.fn() } as unknown as Context
    expect(() => apply(ctx)).not.toThrow()
    expect(ctx.inject).toHaveBeenCalledWith(['settings'], expect.any(Function))
  })

  it('suppresses the auto-generated settings form for its own entry', () => {
    const configure = vi.fn()
    const fiber = {}
    const ctx = {
      fiber,
      inject: vi.fn((_deps: string[], callback: (child: unknown) => void) => callback({
        effect: (run: () => unknown) => run(),
        settings: { configure },
      })),
    } as unknown as Context
    apply(ctx)
    expect(configure).toHaveBeenCalledWith({ auto: false }, fiber)
  })
})
