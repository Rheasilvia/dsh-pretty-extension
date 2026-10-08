import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import { PRETTY_SETTINGS_NAMESPACE, type PrettySettings } from '../settings/pretty-settings.ts'
import { en, zh, type PrettyLocaleKey, type PrettyTranslate } from './locales.ts'
import { PrettySection, type PrettySectionInjected } from './pretty/PrettySection/PrettySection.tsx'
import { ConfigFormAdapter } from './pretty/state/config-form-adapter.ts'
import { PrettySettingsController } from './pretty/state/pretty-settings-controller.ts'
import { DshThemeAdapter } from './pretty/theme/dsh-theme-adapter.ts'
import { createBrowserLocalFontCatalog } from './pretty/theme/local-font-catalog.ts'
import './pretty/theme/SessionRowTheme.module.css'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'settings.pretty': PrettyLocaleKey
  }
}

const NS = 'settings.pretty' as const
const PLUGIN_ID = 'dsh-pretty-extension'

export const inject = ['slots', 'locale', 'configForms', 'theme']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'pretty: localized settings copy')
  const form = ctx.configForms.get<PrettySettings>(PRETTY_SETTINGS_NAMESPACE)
  const controller = new PrettySettingsController(
    new ConfigFormAdapter(form),
    new DshThemeAdapter(ctx.theme),
  )
  const t = ctx.locale.bind(NS) as PrettyTranslate
  const fontCatalog = createBrowserLocalFontCatalog()
  const injected = (): PrettySectionInjected => ({
    controller,
    fontCatalog,
    hooks: { pretty: controller.store },
    initialMode: ctx.theme.getTheme().active.colorScheme,
    t,
  })

  ctx.effect(() => () => {
    controller.dispose()
    if (typeof document !== 'undefined') {
      document.querySelectorAll(`style[data-plugin=${JSON.stringify(PLUGIN_ID)}]`).forEach(node => node.remove())
    }
  }, 'pretty: restore theme and remove owned styles')

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'pretty',
    order: 100,
    label: () => t('nav'),
    inject: injected,
  }, PrettySection))
}
