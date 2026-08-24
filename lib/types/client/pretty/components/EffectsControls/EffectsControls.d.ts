export interface EffectsControlsProps {
    title: string;
    translucentLabel: string;
    translucentHint: string;
    contrastLabel: string;
    contrastHint: string;
    translucentSidebar: boolean;
    contrast: number;
    disabled?: boolean;
    onTranslucentChange: (value: boolean) => void;
    onContrastChange: (value: number) => void;
}
export declare function EffectsControls(props: EffectsControlsProps): import("react").JSX.Element;
