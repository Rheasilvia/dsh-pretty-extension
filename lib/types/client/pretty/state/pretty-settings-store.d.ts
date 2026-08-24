import type { PrettyThemeConfig } from '../../../settings/pretty-settings.ts';
export interface PrettySnapshotStore<T> {
    getSnapshot(): T;
    subscribe(listener: () => void): () => void;
    set(next: T): void;
}
export type PrettySaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'conflict';
export type PrettyPageState = {
    status: 'loading';
} | {
    status: 'readonly';
    reason: string;
    persisted: PrettyThemeConfig;
} | {
    status: 'ready';
    persisted: PrettyThemeConfig;
    draft: PrettyThemeConfig;
    revision: number;
    saveStatus: PrettySaveStatus;
    message?: string;
};
export declare function createPrettySettingsStore(): PrettySnapshotStore<PrettyPageState>;
export declare function isDirty(state: PrettyPageState): boolean;
