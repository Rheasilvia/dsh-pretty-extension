import { describe, expect, it } from 'vitest'
import { resolveCodeFontStack, resolveUiFontStack } from './font-stacks.ts'

describe('font stacks', () => {
  it('quotes local Font Book families and retains platform fallbacks', () => {
    expect(resolveUiFontStack('local:Avenir Next')).toContain('"Avenir Next", -apple-system')
    expect(resolveCodeFontStack('local:Fira Code')).toContain('"Fira Code", ui-monospace')
  })
})
