import z from '@deepseek-ai/schemastery'

export const PRETTY_SETTINGS_NAMESPACE = 'ui-pretty'
export const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/

export const CODEX_THEME_PRESET_IDS = [
  'ayu', 'catppuccin', 'absolutely', 'codex', 'dracula', 'everforest', 'github', 'gruvbox',
  'linear', 'lobster', 'material', 'matrix', 'monokai', 'night-owl', 'nord', 'notion',
  'oscurange', 'one', 'proof', 'raycast', 'rose-pine', 'sentry', 'solarized', 'tokyo-night',
  'temple', 'vercel', 'vscode-plus', 'xcode',
] as const
export const LEGACY_PRETTY_PRESET_IDS = ['ocean', 'forest'] as const
export const PRETTY_PRESET_IDS = [...CODEX_THEME_PRESET_IDS, ...LEGACY_PRETTY_PRESET_IDS, 'custom'] as const
export const PRETTY_UI_FONT_IDS = ['system', 'modern', 'humanist'] as const
export const PRETTY_CODE_FONT_IDS = ['system-mono', 'jetbrains', 'fira'] as const
export const LOCAL_FONT_PREFIX = 'local:'
export const MAX_LOCAL_FONT_FAMILY_LENGTH = 128
const LOCAL_FONT_FAMILY_PATTERN = /^[^\u0000-\u001F\u007F"\\]{1,128}$/
const UI_FONT_PATTERN = /^(?:system|modern|humanist|local:[^\u0000-\u001F\u007F"\\]{1,128})$/
const CODE_FONT_PATTERN = /^(?:system-mono|jetbrains|fira|local:[^\u0000-\u001F\u007F"\\]{1,128})$/

export type PrettyPresetId = typeof PRETTY_PRESET_IDS[number]
export type CodexThemePresetId = typeof CODEX_THEME_PRESET_IDS[number]
export type LocalFontId = `local:${string}`
export type PrettyUiFontId = typeof PRETTY_UI_FONT_IDS[number] | LocalFontId
export type PrettyCodeFontId = typeof PRETTY_CODE_FONT_IDS[number] | LocalFontId

export interface PrettyPalette {
  accent: string
  background: string
  foreground: string
  sidebar: string
}

export interface PrettyThemeConfig {
  enabled: boolean
  preset: PrettyPresetId
  light: PrettyPalette
  dark: PrettyPalette
  uiFont: PrettyUiFontId
  codeFont: PrettyCodeFontId
  translucentSidebar: boolean
  contrast: number
}

export interface PrettySettings {
  theme: PrettyThemeConfig
}

const codexLight: PrettyPalette = {
  accent: '#0169CC',
  background: '#FFFFFF',
  foreground: '#0D0D0D',
  sidebar: '#FCFCFC',
}

const codexDark: PrettyPalette = {
  accent: '#0169CC',
  background: '#111111',
  foreground: '#FCFCFC',
  sidebar: '#131313',
}

export const DEFAULT_PRETTY_THEME: Readonly<PrettyThemeConfig> = Object.freeze({
  enabled: false,
  preset: 'codex',
  light: Object.freeze(codexLight),
  dark: Object.freeze(codexDark),
  uiFont: 'system',
  codeFont: 'system-mono',
  translucentSidebar: false,
  contrast: 60,
})

const colorSchema = z.string().pattern(HEX_COLOR_PATTERN)
const paletteSchema: z<PrettyPalette> = z.object({
  accent: colorSchema.default(codexLight.accent),
  background: colorSchema.default(codexLight.background),
  foreground: colorSchema.default(codexLight.foreground),
  sidebar: colorSchema.default(codexLight.sidebar),
})

const darkPaletteSchema: z<PrettyPalette> = z.object({
  accent: colorSchema.default(codexDark.accent),
  background: colorSchema.default(codexDark.background),
  foreground: colorSchema.default(codexDark.foreground),
  sidebar: colorSchema.default(codexDark.sidebar),
})

export const PrettySettingsSchema: z<PrettySettings> = z.object({
  theme: z.object({
    enabled: z.boolean().default(false),
    preset: z.union([...PRETTY_PRESET_IDS]).default('codex'),
    light: paletteSchema.default(codexLight),
    dark: darkPaletteSchema.default(codexDark),
    uiFont: z.string().pattern(UI_FONT_PATTERN).default('system') as z<PrettyUiFontId>,
    codeFont: z.string().pattern(CODE_FONT_PATTERN).default('system-mono') as z<PrettyCodeFontId>,
    translucentSidebar: z.boolean().default(false),
    contrast: z.number().min(0).max(100).step(1).default(60),
  }).default(DEFAULT_PRETTY_THEME as PrettyThemeConfig),
})

export function clonePrettyTheme(theme: PrettyThemeConfig): PrettyThemeConfig {
  return { ...theme, light: { ...theme.light }, dark: { ...theme.dark } }
}

export function toLocalFontId(family: string): LocalFontId {
  const normalized = family.trim()
  if (!isLocalFontFamily(normalized)) throw new TypeError(`invalid local font family: ${family}`)
  return `${LOCAL_FONT_PREFIX}${normalized}`
}

export function localFontFamily(id: PrettyUiFontId | PrettyCodeFontId): string | undefined {
  if (!id.startsWith(LOCAL_FONT_PREFIX)) return undefined
  const family = id.slice(LOCAL_FONT_PREFIX.length)
  return isLocalFontFamily(family) ? family : undefined
}

export function isLocalFontFamily(family: string): boolean {
  return family.length <= MAX_LOCAL_FONT_FAMILY_LENGTH && LOCAL_FONT_FAMILY_PATTERN.test(family)
}

function isUiFontId(value: unknown): value is PrettyUiFontId {
  return typeof value === 'string' && UI_FONT_PATTERN.test(value)
}

function isCodeFontId(value: unknown): value is PrettyCodeFontId {
  return typeof value === 'string' && CODE_FONT_PATTERN.test(value)
}

export function isPrettyThemeConfig(value: unknown): value is PrettyThemeConfig {
  if (typeof value !== 'object' || value === null) return false
  const theme = value as Record<string, unknown>
  const paletteValid = (palette: unknown): palette is PrettyPalette => {
    if (typeof palette !== 'object' || palette === null) return false
    const entry = palette as Record<string, unknown>
    return ['accent', 'background', 'foreground', 'sidebar']
      .every(key => typeof entry[key] === 'string' && HEX_COLOR_PATTERN.test(entry[key] as string))
  }
  return typeof theme.enabled === 'boolean'
    && PRETTY_PRESET_IDS.includes(theme.preset as PrettyPresetId)
    && paletteValid(theme.light)
    && paletteValid(theme.dark)
    && isUiFontId(theme.uiFont)
    && isCodeFontId(theme.codeFont)
    && typeof theme.translucentSidebar === 'boolean'
    && Number.isInteger(theme.contrast)
    && (theme.contrast as number) >= 0
    && (theme.contrast as number) <= 100
}

export function decodePrettySettings(value: unknown): PrettySettings | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const theme = (value as { theme?: unknown }).theme
  return isPrettyThemeConfig(theme) ? { theme: clonePrettyTheme(theme) } : undefined
}
