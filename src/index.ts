import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { PRETTY_SETTINGS_NAMESPACE, PrettySettingsSchema } from './settings/pretty-settings.ts'

/** Stable Cordis plugin name. */
export const name = 'pretty'

export function apply(ctx: Context): void {
  ctx.inject(['settings'], settingsCtx => {
    settingsCtx.settings.register(
      settingsNamespace(PRETTY_SETTINGS_NAMESPACE),
      PrettySettingsSchema,
      { applies: 'live' },
    )
  })
}
