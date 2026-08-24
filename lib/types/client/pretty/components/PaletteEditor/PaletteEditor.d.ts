import type { PrettyPalette } from '../../../../settings/pretty-settings.ts';
import type { PaletteField } from '../../state/pretty-settings-controller.ts';
export interface PaletteEditorProps {
    legend: string;
    palette: PrettyPalette;
    labels: Record<PaletteField, string>;
    errorMessage: string;
    disabled?: boolean;
    onChange: (field: PaletteField, color: string) => void;
}
export declare function PaletteEditor({ legend, palette, labels, errorMessage, disabled, onChange }: PaletteEditorProps): import("react").JSX.Element;
