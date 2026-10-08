import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import { type PrettySettings, type PrettyThemeConfig } from '../../../settings/pretty-settings.ts';
export interface PrettySettingsSnapshot {
    status: 'loading' | 'ready' | 'unavailable';
    theme?: PrettyThemeConfig;
    revision?: number;
    writable: boolean;
    mode: 'host' | 'memory';
    overridden: boolean;
}
export interface PrettySettingsPort {
    getSnapshot(): PrettySettingsSnapshot;
    subscribe(listener: () => void): () => void;
    saveTheme(theme: PrettyThemeConfig, expectedRevision: number): Promise<'saved' | 'conflict' | 'error'>;
    resetTheme(expectedRevision: number): Promise<'saved' | 'conflict' | 'error'>;
}
export declare class ConfigFormAdapter implements PrettySettingsPort {
    private readonly form;
    constructor(form: ConfigForm<PrettySettings>);
    getSnapshot(): PrettySettingsSnapshot;
    subscribe(listener: () => void): () => void;
    saveTheme(theme: PrettyThemeConfig, expectedRevision: number): Promise<"saved" | "error" | "conflict">;
    resetTheme(expectedRevision: number): Promise<"saved" | "error" | "conflict">;
}
