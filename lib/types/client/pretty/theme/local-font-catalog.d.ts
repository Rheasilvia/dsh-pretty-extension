export interface LocalFontCatalog {
    readonly supported: boolean;
    loadFamilies(): Promise<string[]>;
}
interface LocalFontData {
    family?: unknown;
}
type QueryLocalFonts = () => Promise<readonly LocalFontData[]>;
export declare class BrowserLocalFontCatalog implements LocalFontCatalog {
    private readonly query;
    readonly supported: boolean;
    constructor(query: QueryLocalFonts | undefined);
    loadFamilies(): Promise<string[]>;
}
export declare function createBrowserLocalFontCatalog(): LocalFontCatalog;
export {};
