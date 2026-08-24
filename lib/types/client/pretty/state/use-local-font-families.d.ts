import type { LocalFontCatalog } from '../theme/local-font-catalog.ts';
export type LocalFontLoadStatus = 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported' | 'error';
export interface LocalFontFamiliesState {
    status: LocalFontLoadStatus;
    families: string[];
    load: () => Promise<void>;
}
export declare function useLocalFontFamilies(catalog: LocalFontCatalog): LocalFontFamiliesState;
