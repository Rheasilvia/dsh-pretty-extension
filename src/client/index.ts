/** Pretty settings section contribution for the DSH Web UI. */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'

/** Services required before the section can register. */
export const inject = ['slots']

/** Empty initialization-stage content for the Pretty settings section. */
function PrettySection(): null {
  return null
}

/** Register the Pretty entry in the first-level Settings navigation. */
export function apply(ctx: ClientContext): void {
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'pretty',
    order: 100,
    label: 'Pretty',
  }, PrettySection))
}
