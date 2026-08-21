import type { Context } from '@deepseek-ai/cordis'
import { describe, expect, it, vi } from 'vitest'
import { apply } from '../src/index.ts'
import { DEFAULT_PRETTY_THEME } from '../src/settings/pretty-settings.ts'

describe('Pretty Host composition root', () => {
  it('is optional when no settings provider is composed', () => {
    const ctx = { inject: vi.fn() } as unknown as Context
    expect(() => apply(ctx)).not.toThrow()
    expect(ctx.inject).toHaveBeenCalledWith(['settings'], expect.any(Function))
  })

  it('registers the ui-pretty live schema when settings is available', () => {
    const register = vi.fn()
    const ctx = {
      inject: vi.fn((_deps: string[], callback: (child: unknown) => void) => callback({ settings: { register } })),
    } as unknown as Context
    apply(ctx)
    expect(register).toHaveBeenCalledWith('ui-pretty', expect.any(Function), { applies: 'live' })
    const schema = register.mock.calls[0]![1] as (value: unknown) => unknown
    expect(schema({})).toEqual({ theme: DEFAULT_PRETTY_THEME })
  })
})
