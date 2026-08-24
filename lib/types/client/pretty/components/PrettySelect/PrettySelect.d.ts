export interface PrettySelectOption<T extends string> {
    value: T;
    label: string;
}
export interface PrettySelectGroup<T extends string> {
    label?: string;
    options: readonly PrettySelectOption<T>[];
}
export interface PrettySelectProps<T extends string> {
    label: string;
    value: T;
    groups: readonly PrettySelectGroup<T>[];
    disabled?: boolean;
    onChange: (value: T) => void;
}
/** DSH-menu-backed single-value picker for Pretty settings rows. */
export declare function PrettySelect<T extends string>({ label, value, groups, disabled, onChange, }: PrettySelectProps<T>): import("react").JSX.Element;
