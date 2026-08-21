import {
  localFontFamily, type PrettyCodeFontId, type PrettyUiFontId,
} from '../../../settings/pretty-settings.ts'

export const UI_FONT_STACKS = Object.freeze({
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  modern: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  humanist: 'Avenir Next, Avenir, "Segoe UI", ui-sans-serif, sans-serif',
})

export const CODE_FONT_STACKS = Object.freeze({
  'system-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  jetbrains: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fira: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
})

function quoteFamily(family: string): string {
  return `"${family.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`
}

export function resolveUiFontStack(font: PrettyUiFontId): string {
  const builtin = UI_FONT_STACKS[font as keyof typeof UI_FONT_STACKS]
  if (builtin !== undefined) return builtin
  const family = localFontFamily(font)
  if (family !== undefined) return `${quoteFamily(family)}, ${UI_FONT_STACKS.system}`
  return UI_FONT_STACKS.system
}

export function resolveCodeFontStack(font: PrettyCodeFontId): string {
  const builtin = CODE_FONT_STACKS[font as keyof typeof CODE_FONT_STACKS]
  if (builtin !== undefined) return builtin
  const family = localFontFamily(font)
  if (family !== undefined) return `${quoteFamily(family)}, ${CODE_FONT_STACKS['system-mono']}`
  return CODE_FONT_STACKS['system-mono']
}
