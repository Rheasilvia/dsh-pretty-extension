import type { PrettyPalette } from '../../../../settings/pretty-settings.ts';
export interface ThemePreviewProps {
    palette: PrettyPalette;
    translucentSidebar: boolean;
    contrast: number;
    label: string;
    sidebarLabel: string;
    conversationLabel: string;
}
export declare function ThemePreview({ palette, translucentSidebar, contrast, label, sidebarLabel, conversationLabel, }: ThemePreviewProps): import("react").JSX.Element;
