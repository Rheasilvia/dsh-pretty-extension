import { describe, expect, it } from 'vitest'
import {
  contrastRatio, ensureReadableForeground, mixColors, normalizeHex, withAlpha,
} from './color-contrast.ts'

describe('color contrast', () => {
  it('normalizes only six-digit hex colors', () => {
    expect(normalizeHex(' #a0b1c2 ')).toBe('#A0B1C2')
    expect(normalizeHex('#fff')).toBeUndefined()
  })

  it('minimally corrects unreadable text while preserving its background', () => {
    const result = ensureReadableForeground('#777777', '#888888')
    expect(result.corrected).toBe(true)
    expect(result.ratio).toBeGreaterThanOrEqual(4.5)
    expect(result.color).not.toBe('#000000')
    expect(result.color).not.toBe('#FFFFFF')
  })

  it('keeps already readable colors unchanged', () => {
    expect(ensureReadableForeground('#172033', '#F7F9FC')).toMatchObject({
      color: '#172033', corrected: false,
    })
  })

  it('mixes deterministically and emits the sidebar alpha token', () => {
    expect(mixColors('#000000', '#FFFFFF', 0.5)).toBe('#808080')
    expect(withAlpha('#131D33', 0.82)).toBe('rgba(19, 29, 51, 0.82)')
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21)
  })
})
