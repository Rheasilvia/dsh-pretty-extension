import type { Context } from '@deepseek-ai/cordis';
import { type PrettyLocaleKey } from './locales.ts';
import './pretty/theme/SessionRowTheme.module.css';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'settings.pretty': PrettyLocaleKey;
    }
}
export declare const inject: string[];
export declare function apply(ctx: Context): void;
