import type { PrettyPalette, PrettyThemeConfig } from '../../../settings/pretty-settings.ts'
import { resolveCodeFontStack, resolveUiFontStack } from './font-stacks.ts'
import { ensureReadableForeground, mixColors, readableOnAccent, withAlpha } from './color-contrast.ts'

export type PrettyThemeTokenOverrides = Record<string, { light: string; dark: string }>
export const PRETTY_SESSION_ROW_SELECTED_TOKEN = '--dsh-pretty-session-row-selected'

export interface PrettyPreviewColors {
  background: string
  foreground: string
  accent: string
  accentForeground: string
  sidebar: string
  sidebarItemHover: string
  sidebarItemSelected: string
}

/** Resolve the colors shared by the live DSH theme and its miniature preview. */
export function derivePreviewColors(
  palette: PrettyPalette,
  theme: Pick<PrettyThemeConfig, 'contrast' | 'translucentSidebar'>,
): PrettyPreviewColors {
  const strength = theme.contrast / 100
  const foreground = ensureReadableForeground(palette.foreground, palette.background).color
  return {
    background: palette.background,
    foreground,
    accent: palette.accent,
    accentForeground: readableOnAccent(palette.accent),
    sidebar: theme.translucentSidebar ? withAlpha(palette.sidebar, 0.82) : palette.sidebar,
    sidebarItemHover: withAlpha(foreground, 0.04 + strength * 0.08),
    sidebarItemSelected: withAlpha(palette.accent, 0.08 + strength * 0.1),
  }
}

function modeTokens(palette: PrettyPalette, theme: PrettyThemeConfig): Record<string, string> {
  const strength = theme.contrast / 100
  const colors = derivePreviewColors(palette, theme)
  const foreground = colors.foreground
  const surfaceAmount = 0.02 + strength * 0.06
  const raisedAmount = 0.035 + strength * 0.085
  const surface = mixColors(palette.background, foreground, surfaceAmount)
  const raised = mixColors(palette.background, foreground, raisedAmount)
  const secondarySeed = mixColors(foreground, palette.background, 0.22 + (1 - strength) * 0.1)
  const tertiarySeed = mixColors(foreground, palette.background, 0.34 + (1 - strength) * 0.08)
  const secondary = ensureReadableForeground(secondarySeed, palette.background).color
  const tertiary = ensureReadableForeground(tertiarySeed, palette.background).color
  return {
    '--dsw-alias-bg-base': palette.background,
    '--dsw-alias-bg-layer-1': surface,
    '--dsw-alias-bg-layer-2': raised,
    '--dsw-alias-bg-layer-3': mixColors(palette.background, foreground, raisedAmount + 0.025),
    '--dsw-alias-bg-overlay': raised,
    '--dsw-alias-bg-module': surface,
    '--dsw-alias-bg-module-platform': surface,
    '--dsw-alias-border-l1': withAlpha(foreground, 0.04 + strength * 0.08),
    '--dsw-alias-border-l2': withAlpha(foreground, 0.06 + strength * 0.11),
    '--dsw-alias-border-l3': withAlpha(foreground, 0.08 + strength * 0.14),
    '--dsw-alias-brand-primary': palette.accent,
    '--dsw-alias-brand-text': palette.accent,
    '--dsw-alias-button-primary-fill': palette.accent,
    '--dsw-alias-button-primary-hover': mixColors(palette.accent, foreground, 0.1 + strength * 0.08),
    '--dsw-alias-label-primary': foreground,
    '--dsw-alias-label-secondary': secondary,
    '--dsw-alias-label-tertiary': tertiary,
    '--dsw-alias-label-caption': tertiary,
    '--dsw-alias-label-primary-foreground': readableOnAccent(palette.accent),
    '--dsw-alias-interactive-bg-hover': colors.sidebarItemHover,
    '--dsw-alias-interactive-bg-hover-solid': mixColors(palette.background, foreground, 0.04 + strength * 0.08),
    '--dsw-specific-sidebar-fill': colors.sidebar,
    '--dsw-specific-sidebar-nav-item-active': colors.sidebarItemSelected,
    '--dsw-specific-sidebar-nav-item-hover': colors.sidebarItemHover,
    [PRETTY_SESSION_ROW_SELECTED_TOKEN]: colors.sidebarItemSelected,
    '--dsw-font-family': resolveUiFontStack(theme.uiFont),
    '--ds-font-family-code': resolveCodeFontStack(theme.codeFont),
  }
}

export function deriveThemeTokens(theme: PrettyThemeConfig): PrettyThemeTokenOverrides {
  const light = modeTokens(theme.light, theme)
  const dark = modeTokens(theme.dark, theme)
  return Object.fromEntries(Object.keys(light).map(name => [name, { light: light[name]!, dark: dark[name]! }]))
}
