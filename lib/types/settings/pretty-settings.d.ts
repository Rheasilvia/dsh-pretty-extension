import z from '@deepseek-ai/schemastery';
export declare const PRETTY_SETTINGS_NAMESPACE = "ui-pretty";
export declare const HEX_COLOR_PATTERN: RegExp;
export declare const CODEX_THEME_PRESET_IDS: readonly ["ayu", "catppuccin", "absolutely", "codex", "dracula", "everforest", "github", "gruvbox", "linear", "lobster", "material", "matrix", "monokai", "night-owl", "nord", "notion", "oscurange", "one", "proof", "raycast", "rose-pine", "sentry", "solarized", "tokyo-night", "temple", "vercel", "vscode-plus", "xcode"];
export declare const LEGACY_PRETTY_PRESET_IDS: readonly ["ocean", "forest"];
export declare const PRETTY_PRESET_IDS: readonly ["ayu", "catppuccin", "absolutely", "codex", "dracula", "everforest", "github", "gruvbox", "linear", "lobster", "material", "matrix", "monokai", "night-owl", "nord", "notion", "oscurange", "one", "proof", "raycast", "rose-pine", "sentry", "solarized", "tokyo-night", "temple", "vercel", "vscode-plus", "xcode", "ocean", "forest", "custom"];
export declare const PRETTY_UI_FONT_IDS: readonly ["system", "modern", "humanist"];
export declare const PRETTY_CODE_FONT_IDS: readonly ["system-mono", "jetbrains", "fira"];
export declare const LOCAL_FONT_PREFIX = "local:";
export declare const MAX_LOCAL_FONT_FAMILY_LENGTH = 128;
export type PrettyPresetId = typeof PRETTY_PRESET_IDS[number];
export type CodexThemePresetId = typeof CODEX_THEME_PRESET_IDS[number];
export type LocalFontId = `local:${string}`;
export type PrettyUiFontId = typeof PRETTY_UI_FONT_IDS[number] | LocalFontId;
export type PrettyCodeFontId = typeof PRETTY_CODE_FONT_IDS[number] | LocalFontId;
export interface PrettyPalette {
    accent: string;
    background: string;
    foreground: string;
    sidebar: string;
}
export interface PrettyThemeConfig {
    enabled: boolean;
    preset: PrettyPresetId;
    light: PrettyPalette;
    dark: PrettyPalette;
    uiFont: PrettyUiFontId;
    codeFont: PrettyCodeFontId;
    translucentSidebar: boolean;
    contrast: number;
}
export interface PrettySettings {
    theme: PrettyThemeConfig;
}
export declare const DEFAULT_PRETTY_THEME: Readonly<PrettyThemeConfig>;
export declare const PrettySettingsSchema: z<Schemastery.ObjectS<NoInfer<{
    theme: z<NoInfer<Schemastery.ObjectS<NoInfer<{
        enabled: z<boolean, boolean, "defined">;
        preset: z<"ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "defined">;
        light: z<PrettyPalette, PrettyPalette, "defined">;
        dark: z<PrettyPalette, PrettyPalette, "defined">;
        uiFont: z<PrettyUiFontId>;
        codeFont: z<PrettyCodeFontId>;
        translucentSidebar: z<boolean, boolean, "defined">;
        contrast: z<number, number, "defined">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        enabled: z<boolean, boolean, "defined">;
        preset: z<"ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "defined">;
        light: z<PrettyPalette, PrettyPalette, "defined">;
        dark: z<PrettyPalette, PrettyPalette, "defined">;
        uiFont: z<PrettyUiFontId>;
        codeFont: z<PrettyCodeFontId>;
        translucentSidebar: z<boolean, boolean, "defined">;
        contrast: z<number, number, "defined">;
    }>>>, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    theme: z<NoInfer<Schemastery.ObjectS<NoInfer<{
        enabled: z<boolean, boolean, "defined">;
        preset: z<"ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "defined">;
        light: z<PrettyPalette, PrettyPalette, "defined">;
        dark: z<PrettyPalette, PrettyPalette, "defined">;
        uiFont: z<PrettyUiFontId>;
        codeFont: z<PrettyCodeFontId>;
        translucentSidebar: z<boolean, boolean, "defined">;
        contrast: z<number, number, "defined">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        enabled: z<boolean, boolean, "defined">;
        preset: z<"ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "defined">;
        light: z<PrettyPalette, PrettyPalette, "defined">;
        dark: z<PrettyPalette, PrettyPalette, "defined">;
        uiFont: z<PrettyUiFontId>;
        codeFont: z<PrettyCodeFontId>;
        translucentSidebar: z<boolean, boolean, "defined">;
        contrast: z<number, number, "defined">;
    }>>>, "volatile-defined">;
}>>, "plain">;
export declare function clonePrettyTheme(theme: PrettyThemeConfig): PrettyThemeConfig;
export declare function toLocalFontId(family: string): LocalFontId;
export declare function localFontFamily(id: PrettyUiFontId | PrettyCodeFontId): string | undefined;
export declare function isLocalFontFamily(family: string): boolean;
