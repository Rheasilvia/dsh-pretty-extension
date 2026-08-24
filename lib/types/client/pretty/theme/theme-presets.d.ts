import { type CodexThemePresetId, type PrettyPalette, type PrettyThemeConfig } from '../../../settings/pretty-settings.ts';
export type BuiltinPrettyPresetId = CodexThemePresetId;
export interface PrettyPreset {
    id: BuiltinPrettyPresetId;
    label: string;
    light: PrettyPalette;
    dark: PrettyPalette;
}
/** The 28 theme families registered by the installed Codex desktop app. */
export declare const THEME_PRESETS: Readonly<Record<BuiltinPrettyPresetId, PrettyPreset>>;
export declare const BUILTIN_PRESET_IDS: readonly BuiltinPrettyPresetId[];
export declare function applyPreset(theme: PrettyThemeConfig, id: BuiltinPrettyPresetId): PrettyThemeConfig;
