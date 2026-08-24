import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client';
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
export declare class DshSettingsAdapter implements PrettySettingsPort {
    private readonly scope;
    constructor(scope: SettingsScope<PrettySettings>);
    getSnapshot(): PrettySettingsSnapshot;
    subscribe(listener: () => void): () => void;
    saveTheme(theme: PrettyThemeConfig, expectedRevision: number): Promise<"saved" | "error" | "conflict">;
    resetTheme(expectedRevision: number): Promise<"saved" | "error" | "conflict">;
    private settlement;
}
