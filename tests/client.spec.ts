import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { describe, expect, it, vi } from 'vitest'
import { apply, inject } from '../src/client/index.ts'

describe('Pretty client plugin', () => {
  it('registers a blank first-level Settings section', () => {
    type Register = (
      options: Record<string, unknown>,
      component: () => null,
    ) => () => void

    const register = vi.fn<Register>(() => () => {})
    const injectSlot = vi.fn((_name: string, mount: () => unknown) => mount())
    const ctx = {
      slots: {
        inject: injectSlot,
        register,
      },
    } as unknown as ClientContext

    apply(ctx)

    expect(inject).toEqual(['slots'])
    expect(injectSlot).toHaveBeenCalledWith('settings.section', expect.any(Function))
    expect(register).toHaveBeenCalledTimes(1)

    const [options, component] = register.mock.calls[0]!
    expect(options).toEqual({
      name: 'settings.section',
      id: 'pretty',
      order: 100,
      label: 'Pretty',
    })
    expect((component as () => null)()).toBeNull()
  })
})
