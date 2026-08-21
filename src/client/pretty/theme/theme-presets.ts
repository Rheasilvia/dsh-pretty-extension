import {
  CODEX_THEME_PRESET_IDS, type CodexThemePresetId, type PrettyPalette, type PrettyThemeConfig,
} from '../../../settings/pretty-settings.ts'

export type BuiltinPrettyPresetId = CodexThemePresetId

export interface PrettyPreset {
  id: BuiltinPrettyPresetId
  label: string
  light: PrettyPalette
  dark: PrettyPalette
}

function palette(accent: string, background: string, foreground: string, sidebar: string): PrettyPalette {
  return Object.freeze({ accent, background, foreground, sidebar })
}

function preset(
  id: BuiltinPrettyPresetId,
  label: string,
  light: PrettyPalette,
  dark: PrettyPalette,
): PrettyPreset {
  return Object.freeze({ id, label, light, dark })
}

/** The 28 theme families registered by the installed Codex desktop app. */
export const THEME_PRESETS: Readonly<Record<BuiltinPrettyPresetId, PrettyPreset>> = Object.freeze({
  ayu: preset('ayu', 'Ayu',
    palette('#F29718', '#FCFCFC', '#5C6166', '#F8F9FA'),
    palette('#E6B450', '#0B0E14', '#BFBDB6', '#0B0E14')),
  catppuccin: preset('catppuccin', 'Catppuccin',
    palette('#8839EF', '#EFF1F5', '#4C4F69', '#E6E9EF'),
    palette('#CBA6F7', '#1E1E2E', '#CDD6F4', '#181825')),
  absolutely: preset('absolutely', 'Absolutely',
    palette('#CC7D5E', '#F9F9F7', '#2D2D2B', '#F4F4F2'),
    palette('#CC7D5E', '#2D2D2B', '#F9F9F7', '#373735')),
  codex: preset('codex', 'Codex',
    palette('#0169CC', '#FFFFFF', '#0D0D0D', '#FCFCFC'),
    palette('#0169CC', '#111111', '#FCFCFC', '#131313')),
  dracula: preset('dracula', 'Dracula',
    palette('#7C3AED', '#F8F8F2', '#282A36', '#ECECF0'),
    palette('#FF79C6', '#282A36', '#F8F8F2', '#21222C')),
  everforest: preset('everforest', 'Everforest',
    palette('#93B259', '#FDF6E3', '#5C6A72', '#F4EBD4'),
    palette('#A7C080', '#2D353B', '#D3C6AA', '#252D32')),
  github: preset('github', 'GitHub',
    palette('#0969DA', '#FFFFFF', '#1F2328', '#F6F8FA'),
    palette('#1F6FEB', '#0D1117', '#E6EDF3', '#010409')),
  gruvbox: preset('gruvbox', 'Gruvbox',
    palette('#458588', '#FBF1C7', '#3C3836', '#F2E5BC'),
    palette('#458588', '#282828', '#EBDBB2', '#1D2021')),
  linear: preset('linear', 'Linear',
    palette('#5E6AD2', '#F7F8FA', '#2A3140', '#F2F4F8'),
    palette('#5E6AD2', '#17181D', '#E6E9EF', '#080A0F')),
  lobster: preset('lobster', 'Lobster',
    palette('#D64F3C', '#FFF8F5', '#2C1916', '#FCEEE9'),
    palette('#FF5C5C', '#111827', '#E4E4E7', '#171D2B')),
  material: preset('material', 'Material',
    palette('#008577', '#FAFAFA', '#37474F', '#F1F3F4'),
    palette('#80CBC4', '#212121', '#EEFFFF', '#191919')),
  matrix: preset('matrix', 'Matrix',
    palette('#008A2E', '#F3FFF6', '#083B16', '#E5F8EA'),
    palette('#1EFF5A', '#040805', '#B8FFCA', '#020402')),
  monokai: preset('monokai', 'Monokai',
    palette('#C93667', '#FAFAF7', '#272822', '#F0F0EB'),
    palette('#F92672', '#272822', '#F8F8F2', '#1E1F1C')),
  'night-owl': preset('night-owl', 'Night Owl',
    palette('#2AA298', '#FBFBFB', '#403F53', '#F0F0F0'),
    palette('#82AAFF', '#011627', '#D6DEEB', '#01111F')),
  nord: preset('nord', 'Nord',
    palette('#5E81AC', '#ECEFF4', '#2E3440', '#E5E9F0'),
    palette('#88C0D0', '#2E3440', '#D8DEE9', '#242933')),
  notion: preset('notion', 'Notion',
    palette('#3183D8', '#FFFFFF', '#37352F', '#F7F6F3'),
    palette('#3183D8', '#191919', '#D9D9D8', '#151515')),
  oscurange: preset('oscurange', 'Oscurange',
    palette('#D66E22', '#FFF8F2', '#2B1B14', '#F8EBDD'),
    palette('#F9B98C', '#0B0B0F', '#E6E6E6', '#07070A')),
  one: preset('one', 'One',
    palette('#526FFF', '#FAFAFA', '#383A42', '#EAEAEB'),
    palette('#4D78CC', '#282C34', '#ABB2BF', '#21252B')),
  proof: preset('proof', 'Proof',
    palette('#3D755D', '#F5F3ED', '#2F312D', '#EFEDE6'),
    palette('#79B99B', '#1E211D', '#E7E9E3', '#252924')),
  raycast: preset('raycast', 'Raycast',
    palette('#138AF2', '#FFFFFF', '#000000', '#FCFCFC'),
    palette('#4FA3F8', '#141414', '#FFFFFF', '#101010')),
  'rose-pine': preset('rose-pine', 'Rose Pine',
    palette('#D7827E', '#FAF4ED', '#575279', '#F2E9E1'),
    palette('#EA9A97', '#232136', '#E0DEF4', '#1F1D2E')),
  sentry: preset('sentry', 'Sentry',
    palette('#6C5CE7', '#FAF9FC', '#2F2938', '#F1EEF6'),
    palette('#7055F6', '#2D2935', '#E6DFF9', '#26222D')),
  solarized: preset('solarized', 'Solarized',
    palette('#268BD2', '#FDF6E3', '#657B83', '#EEE8D5'),
    palette('#2AA198', '#002B36', '#839496', '#00212B')),
  'tokyo-night': preset('tokyo-night', 'Tokyo Night',
    palette('#3D59A1', '#F4F5FA', '#343B58', '#E9EBF4'),
    palette('#7AA2F7', '#1A1B26', '#A9B1D6', '#16161E')),
  temple: preset('temple', 'Temple',
    palette('#607000', '#F7FAEA', '#1B2A20', '#EDF2D7'),
    palette('#E4F222', '#02120C', '#C7E6DA', '#1D2D0F')),
  vercel: preset('vercel', 'Vercel',
    palette('#006AFF', '#FFFFFF', '#171717', '#FAFAFA'),
    palette('#006EFE', '#000000', '#EDEDED', '#090909')),
  'vscode-plus': preset('vscode-plus', 'VS Code Plus',
    palette('#007ACC', '#FFFFFF', '#333333', '#F3F3F3'),
    palette('#007ACC', '#1E1E1E', '#D4D4D4', '#181818')),
  xcode: preset('xcode', 'Xcode',
    palette('#0E0EFF', '#FFFFFF', '#000000', '#F7F7F7'),
    palette('#5482FF', '#1F1F24', '#FFFFFF', '#19191E')),
})

export const BUILTIN_PRESET_IDS: readonly BuiltinPrettyPresetId[] = CODEX_THEME_PRESET_IDS

export function applyPreset(theme: PrettyThemeConfig, id: BuiltinPrettyPresetId): PrettyThemeConfig {
  const selected = THEME_PRESETS[id]
  return { ...theme, preset: id, light: { ...selected.light }, dark: { ...selected.dark } }
}
