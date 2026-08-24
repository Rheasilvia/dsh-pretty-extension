export declare function normalizeHex(color: string): string | undefined;
export declare function contrastRatio(foreground: string, background: string): number;
export declare function mixColors(from: string, to: string, amount: number): string;
export interface ContrastCorrection {
    color: string;
    corrected: boolean;
    ratio: number;
}
export declare function ensureReadableForeground(foreground: string, background: string, minimum?: number): ContrastCorrection;
export declare function readableOnAccent(accent: string): string;
export declare function withAlpha(color: string, alpha: number): string;
