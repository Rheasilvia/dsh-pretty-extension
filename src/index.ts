import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-settings'
import { PrettySettingsSchema } from './settings/pretty-settings.ts'

/** Stable Cordis plugin name. */
export const name = 'pretty'

/**
 * UI-editable Pretty settings served to the browser. The settings namespace is
 * the id of this plugin's profile entry (`ui-pretty` in cordis.patch.yml);
 * values persist into the active profile's patch document.
 */
export const Config = PrettySettingsSchema

export function apply(ctx: Context): void {
  // The plugin ships its own Settings → Pretty section, so suppress the
  // auto-generated settings form for this entry.
  ctx.inject(['settings'], child => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })
}
