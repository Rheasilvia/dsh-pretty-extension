import { describe, expect, it, vi } from 'vitest'
import type { ConfigForm, ConfigFormSnapshot } from '@deepseek-ai/dsh-client-ui-settings/client'
import { clonePrettyTheme, DEFAULT_PRETTY_THEME, type PrettySettings } from '../../../settings/pretty-settings.ts'
import { ConfigFormAdapter } from './config-form-adapter.ts'

type PathOp = { op: 'set'; path: string[]; value: unknown } | { op: 'unset'; path: string[] }

function formHarness() {
  let snapshot: ConfigFormSnapshot<PrettySettings> = {
    status: 'ready', value: { theme: clonePrettyTheme(DEFAULT_PRETTY_THEME) }, base: undefined,
    user: undefined, revision: 1, writable: true, mode: 'host',
  }
  const form = {
    getSnapshot: () => snapshot,
    subscribe: vi.fn(() => () => {}),
    mutate: vi.fn(async (ops: readonly PathOp[], _expectedRevision?: number) => {
      const op = ops[0]!
      if (op.op === 'set') {
        snapshot = { ...snapshot, value: { theme: op.value as typeof DEFAULT_PRETTY_THEME }, user: { theme: op.value }, revision: 2 }
      } else {
        snapshot = { ...snapshot, user: {}, revision: 3, value: { theme: clonePrettyTheme(DEFAULT_PRETTY_THEME) } }
      }
      return true
    }),
    set: vi.fn(async () => true),
    unset: vi.fn(async () => true),
  } satisfies ConfigForm<PrettySettings>
  return { form, adapter: new ConfigFormAdapter(form) }
}

describe('ConfigFormAdapter', () => {
  it('writes the whole theme field under the revision fence and clears only that field', async () => {
    const { form, adapter } = formHarness()
    const theme = { ...clonePrettyTheme(DEFAULT_PRETTY_THEME), enabled: true }
    await expect(adapter.saveTheme(theme, 1)).resolves.toBe('saved')
    expect(form.mutate).toHaveBeenCalledWith([{ op: 'set', path: ['theme'], value: theme }], 1)
    await expect(adapter.resetTheme(2)).resolves.toBe('saved')
    expect(form.mutate).toHaveBeenCalledWith([{ op: 'unset', path: ['theme'] }], 2)
  })

  it('maps Host refusal to conflict and transport failure to error', async () => {
    const { form, adapter } = formHarness()
    form.mutate.mockResolvedValueOnce(false)
    await expect(adapter.saveTheme(clonePrettyTheme(DEFAULT_PRETTY_THEME), 1)).resolves.toBe('conflict')
    form.mutate.mockRejectedValueOnce(new Error('offline'))
    await expect(adapter.resetTheme(1)).resolves.toBe('error')
  })

  it('projects status, writability, mode, and user-layer presence', async () => {
    const { adapter } = formHarness()
    expect(adapter.getSnapshot()).toMatchObject({
      status: 'ready', writable: true, mode: 'host', overridden: false, revision: 1,
    })
    await adapter.saveTheme(clonePrettyTheme(DEFAULT_PRETTY_THEME), 1)
    expect(adapter.getSnapshot()).toMatchObject({ overridden: true, revision: 2 })
  })
})
