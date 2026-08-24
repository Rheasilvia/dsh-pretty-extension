import { type PrettyCodeFontId, type PrettyUiFontId } from '../../../../settings/pretty-settings.ts';
interface SelectOption<T extends string> {
    value: T;
    label: string;
}
export interface TypographyControlsProps {
    title: string;
    uiLabel: string;
    codeLabel: string;
    uiFont: PrettyUiFontId;
    codeFont: PrettyCodeFontId;
    uiOptions: SelectOption<PrettyUiFontId>[];
    codeOptions: SelectOption<PrettyCodeFontId>[];
    localFamilies: string[];
    builtinGroupLabel: string;
    localGroupLabel: string;
    fontBookStatus: string;
    loadFontsLabel: string;
    loadingFonts: boolean;
    canLoadFonts: boolean;
    disabled?: boolean;
    onLoadFonts: () => void;
    onUiFontChange: (value: PrettyUiFontId) => void;
    onCodeFontChange: (value: PrettyCodeFontId) => void;
}
export declare function TypographyControls(props: TypographyControlsProps): import("react").JSX.Element;
export {};
