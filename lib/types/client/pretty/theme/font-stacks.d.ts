import { type PrettyCodeFontId, type PrettyUiFontId } from '../../../settings/pretty-settings.ts';
export declare const UI_FONT_STACKS: Readonly<{
    system: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
    modern: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
    humanist: "Avenir Next, Avenir, \"Segoe UI\", ui-sans-serif, sans-serif";
}>;
export declare const CODE_FONT_STACKS: Readonly<{
    'system-mono': "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    jetbrains: "\"JetBrains Mono\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    fira: "\"Fira Code\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
}>;
export declare function resolveUiFontStack(font: PrettyUiFontId): string;
export declare function resolveCodeFontStack(font: PrettyCodeFontId): string;
