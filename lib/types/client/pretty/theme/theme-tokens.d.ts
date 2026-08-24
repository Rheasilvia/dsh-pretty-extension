import type { PrettyPalette, PrettyThemeConfig } from '../../../settings/pretty-settings.ts';
export type PrettyThemeTokenOverrides = Record<string, {
    light: string;
    dark: string;
}>;
export declare const PRETTY_SESSION_ROW_SELECTED_TOKEN = "--dsh-pretty-session-row-selected";
export interface PrettyPreviewColors {
    background: string;
    foreground: string;
    accent: string;
    accentForeground: string;
    sidebar: string;
    sidebarItemHover: string;
    sidebarItemSelected: string;
}
/** Resolve the colors shared by the live DSH theme and its miniature preview. */
export declare function derivePreviewColors(palette: PrettyPalette, theme: Pick<PrettyThemeConfig, 'contrast' | 'translucentSidebar'>): PrettyPreviewColors;
export declare function deriveThemeTokens(theme: PrettyThemeConfig): PrettyThemeTokenOverrides;
