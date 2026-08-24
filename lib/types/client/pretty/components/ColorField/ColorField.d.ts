export interface ColorFieldProps {
    label: string;
    value: string;
    errorMessage: string;
    disabled?: boolean;
    onCommit: (value: string) => void;
}
export declare function ColorField({ label, value, errorMessage, disabled, onCommit }: ColorFieldProps): import("react").JSX.Element;
