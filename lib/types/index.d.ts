import type { Context } from '@deepseek-ai/cordis';
/** Stable Cordis plugin name. */
export declare const name = "pretty";
/**
 * UI-editable Pretty settings served to the browser. The settings namespace is
 * the id of this plugin's profile entry (`ui-pretty` in cordis.patch.yml);
 * values persist into the active profile's patch document.
 */
export declare const Config: import("@deepseek-ai/schemastery").default<Schemastery.ObjectS<NoInfer<{
    theme: import("@deepseek-ai/schemastery").default<NoInfer<Schemastery.ObjectS<NoInfer<{
        enabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "defined">;
        preset: import("@deepseek-ai/schemastery").default<"ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "defined">;
        light: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyPalette, import("./settings/pretty-settings.ts").PrettyPalette, "defined">;
        dark: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyPalette, import("./settings/pretty-settings.ts").PrettyPalette, "defined">;
        uiFont: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyUiFontId>;
        codeFont: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyCodeFontId>;
        translucentSidebar: import("@deepseek-ai/schemastery").default<boolean, boolean, "defined">;
        contrast: import("@deepseek-ai/schemastery").default<number, number, "defined">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        enabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "defined">;
        preset: import("@deepseek-ai/schemastery").default<"ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "defined">;
        light: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyPalette, import("./settings/pretty-settings.ts").PrettyPalette, "defined">;
        dark: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyPalette, import("./settings/pretty-settings.ts").PrettyPalette, "defined">;
        uiFont: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyUiFontId>;
        codeFont: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyCodeFontId>;
        translucentSidebar: import("@deepseek-ai/schemastery").default<boolean, boolean, "defined">;
        contrast: import("@deepseek-ai/schemastery").default<number, number, "defined">;
    }>>>, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    theme: import("@deepseek-ai/schemastery").default<NoInfer<Schemastery.ObjectS<NoInfer<{
        enabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "defined">;
        preset: import("@deepseek-ai/schemastery").default<"ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "defined">;
        light: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyPalette, import("./settings/pretty-settings.ts").PrettyPalette, "defined">;
        dark: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyPalette, import("./settings/pretty-settings.ts").PrettyPalette, "defined">;
        uiFont: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyUiFontId>;
        codeFont: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyCodeFontId>;
        translucentSidebar: import("@deepseek-ai/schemastery").default<boolean, boolean, "defined">;
        contrast: import("@deepseek-ai/schemastery").default<number, number, "defined">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        enabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "defined">;
        preset: import("@deepseek-ai/schemastery").default<"ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "ayu" | "catppuccin" | "absolutely" | "codex" | "dracula" | "everforest" | "github" | "gruvbox" | "linear" | "lobster" | "material" | "matrix" | "monokai" | "night-owl" | "nord" | "notion" | "oscurange" | "one" | "proof" | "raycast" | "rose-pine" | "sentry" | "solarized" | "tokyo-night" | "temple" | "vercel" | "vscode-plus" | "xcode" | "ocean" | "forest" | "custom", "defined">;
        light: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyPalette, import("./settings/pretty-settings.ts").PrettyPalette, "defined">;
        dark: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyPalette, import("./settings/pretty-settings.ts").PrettyPalette, "defined">;
        uiFont: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyUiFontId>;
        codeFont: import("@deepseek-ai/schemastery").default<import("./settings/pretty-settings.ts").PrettyCodeFontId>;
        translucentSidebar: import("@deepseek-ai/schemastery").default<boolean, boolean, "defined">;
        contrast: import("@deepseek-ai/schemastery").default<number, number, "defined">;
    }>>>, "volatile-defined">;
}>>, "plain">;
export declare function apply(ctx: Context): void;
