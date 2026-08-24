export interface SettingsActionBarProps {
    resetLabel: string;
    discardLabel: string;
    saveLabel: string;
    statusLabel: string;
    dirty: boolean;
    saving: boolean;
    saveDisabled: boolean;
    onReset: () => void;
    onDiscard: () => void;
    onSave: () => void;
}
export declare function SettingsActionBar(props: SettingsActionBarProps): import("react").JSX.Element;
