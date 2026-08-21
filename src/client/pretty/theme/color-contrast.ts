import { HEX_COLOR_PATTERN } from '../../../settings/pretty-settings.ts'

interface Rgb { r: number; g: number; b: number }

function parseHex(color: string): Rgb {
  const normalized = color.toUpperCase()
  if (!HEX_COLOR_PATTERN.test(normalized)) throw new TypeError(`invalid color: ${color}`)
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  }
}

function toHex({ r, g, b }: Rgb): string {
  const channel = (value: number): string => Math.round(value).toString(16).padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase()
}

function luminanceChannel(value: number): number {
  const channel = value / 255
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

function luminance(color: string): number {
  const { r, g, b } = parseHex(color)
  return 0.2126 * luminanceChannel(r) + 0.7152 * luminanceChannel(g) + 0.0722 * luminanceChannel(b)
}

export function normalizeHex(color: string): string | undefined {
  const normalized = color.trim().toUpperCase()
  return HEX_COLOR_PATTERN.test(normalized) ? normalized : undefined
}

export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

export function mixColors(from: string, to: string, amount: number): string {
  const start = parseHex(from)
  const end = parseHex(to)
  const ratio = Math.min(1, Math.max(0, amount))
  return toHex({
    r: start.r + (end.r - start.r) * ratio,
    g: start.g + (end.g - start.g) * ratio,
    b: start.b + (end.b - start.b) * ratio,
  })
}

function minimumMix(foreground: string, background: string, target: '#000000' | '#FFFFFF', minimum: number) {
  if (contrastRatio(target, background) < minimum) return undefined
  let low = 0
  let high = 1
  for (let index = 0; index < 24; index += 1) {
    const middle = (low + high) / 2
    if (contrastRatio(mixColors(foreground, target, middle), background) >= minimum) high = middle
    else low = middle
  }
  let candidate = mixColors(foreground, target, high)
  while (contrastRatio(candidate, background) < minimum && high < 1) {
    high = Math.min(1, high + 1 / 255)
    candidate = mixColors(foreground, target, high)
  }
  return { color: candidate, amount: high }
}

export interface ContrastCorrection {
  color: string
  corrected: boolean
  ratio: number
}

export function ensureReadableForeground(
  foreground: string,
  background: string,
  minimum = 4.5,
): ContrastCorrection {
  const current = contrastRatio(foreground, background)
  if (current >= minimum) return { color: foreground, corrected: false, ratio: current }
  const options = [
    minimumMix(foreground, background, '#000000', minimum),
    minimumMix(foreground, background, '#FFFFFF', minimum),
  ].filter((option): option is { color: string; amount: number } => option !== undefined)
  const best = options.sort((left, right) => left.amount - right.amount)[0]
  const color = best?.color ?? (contrastRatio('#000000', background) >= contrastRatio('#FFFFFF', background)
    ? '#000000' : '#FFFFFF')
  return { color, corrected: color !== foreground, ratio: contrastRatio(color, background) }
}

export function readableOnAccent(accent: string): string {
  return contrastRatio('#000000', accent) >= contrastRatio('#FFFFFF', accent) ? '#000000' : '#FFFFFF'
}

export function withAlpha(color: string, alpha: number): string {
  const { r, g, b } = parseHex(color)
  const normalized = Math.round(Math.min(1, Math.max(0, alpha)) * 1000) / 1000
  return `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${String(normalized)})`
}
