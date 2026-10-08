import type { Context } from '@deepseek-ai/cordis';
import type { PrettyThemeConfig } from '../../../settings/pretty-settings.ts';
export interface PrettyThemePort {
    preview(theme: PrettyThemeConfig): void;
    restore(theme: PrettyThemeConfig): void;
    clear(): void;
    dispose(): void;
}
export declare class DshThemeAdapter implements PrettyThemePort {
    private readonly theme;
    private release;
    constructor(theme: Context['theme']);
    preview(config: PrettyThemeConfig): void;
    restore(config: PrettyThemeConfig): void;
    clear(): void;
    dispose(): void;
    private replace;
}
