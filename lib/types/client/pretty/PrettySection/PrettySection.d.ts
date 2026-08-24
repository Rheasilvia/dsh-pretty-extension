import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { PrettyTranslate } from '../../locales.ts';
import type { PrettySettingsController, PaletteMode } from '../state/pretty-settings-controller.ts';
import type { LocalFontCatalog } from '../theme/local-font-catalog.ts';
export interface PrettySectionInjected {
    controller: PrettySettingsController;
    fontCatalog: LocalFontCatalog;
    hooks: {
        pretty: PrettySettingsController['store'];
    };
    initialMode: PaletteMode;
    t: PrettyTranslate;
}
export type PrettySectionProps = PropsRuntime<'settings.section'> & InjectFace<PrettySectionInjected>;
export declare function PrettySection({ controller, fontCatalog, initialMode, usePretty, t }: PrettySectionProps): import("react").JSX.Element;
