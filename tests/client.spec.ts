import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { describe, expect, it, vi } from 'vitest'
import { apply, inject } from '../src/client/index.ts'

describe('Pretty client plugin', () => {
  it('registers a localized first-level Settings section with its adapters', () => {
    const register = vi.fn((..._args: unknown[]) => () => {})
    const injectSlot = vi.fn((_name: string, mount: () => unknown) => mount())
    const effects: Array<() => unknown> = []
    const ctx = {
      effect: vi.fn((factory: () => unknown) => { effects.push(factory); factory() }),
      locale: { register: vi.fn(() => () => {}), bind: vi.fn(() => (key: string) => key === 'nav' ? 'Pretty' : key) },
      settingsScope: { bind: vi.fn(() => ({
        getSnapshot: () => ({ status: 'loading', value: undefined, base: undefined, user: undefined, revision: undefined, writable: false, mode: 'host' }),
        subscribe: () => () => {}, set: async () => {}, unset: async () => {},
      })) },
      theme: {
        getTheme: vi.fn(() => ({ active: { colorScheme: 'light' } })),
        overrideTokens: vi.fn(() => () => {}),
      },
      slots: { inject: injectSlot, register },
    } as unknown as ClientContext

    apply(ctx)

    expect(inject).toEqual(['slots', 'locale', 'settingsScope', 'theme'])
    expect(injectSlot).toHaveBeenCalledWith('settings.section', expect.any(Function))
    expect(register).toHaveBeenCalledTimes(1)

    const options = register.mock.calls[0]![0] as Record<string, unknown>
    expect(options).toMatchObject({ name: 'settings.section', id: 'pretty', order: 100, inject: expect.any(Function) })
    expect((options.label as () => string)()).toBe('Pretty')
    expect((options.inject as () => { initialMode: string })().initialMode).toBe('light')
  })
})
