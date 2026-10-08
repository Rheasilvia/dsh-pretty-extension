import type {
  ConfigForm, ConfigFormSnapshot,
} from '@deepseek-ai/dsh-client-ui-settings/client'
import {
  clonePrettyTheme, type PrettySettings, type PrettyThemeConfig,
} from '../../../settings/pretty-settings.ts'

export interface PrettySettingsSnapshot {
  status: 'loading' | 'ready' | 'unavailable'
  theme?: PrettyThemeConfig
  revision?: number
  writable: boolean
  mode: 'host' | 'memory'
  overridden: boolean
}

export interface PrettySettingsPort {
  getSnapshot(): PrettySettingsSnapshot
  subscribe(listener: () => void): () => void
  saveTheme(theme: PrettyThemeConfig, expectedRevision: number): Promise<'saved' | 'conflict' | 'error'>
  resetTheme(expectedRevision: number): Promise<'saved' | 'conflict' | 'error'>
}

function project(snapshot: ConfigFormSnapshot<PrettySettings>): PrettySettingsSnapshot {
  return {
    status: snapshot.status,
    ...(snapshot.value?.theme === undefined ? {} : { theme: clonePrettyTheme(snapshot.value.theme) }),
    ...(snapshot.revision === undefined ? {} : { revision: snapshot.revision }),
    writable: snapshot.writable,
    mode: snapshot.mode,
    overridden: typeof snapshot.user === 'object' && snapshot.user !== null && 'theme' in snapshot.user,
  }
}

export class ConfigFormAdapter implements PrettySettingsPort {
  constructor(private readonly form: ConfigForm<PrettySettings>) {}

  getSnapshot(): PrettySettingsSnapshot {
    return project(this.form.getSnapshot())
  }

  subscribe(listener: () => void): () => void {
    return this.form.subscribe(listener)
  }

  async saveTheme(theme: PrettyThemeConfig, expectedRevision: number) {
    try {
      const accepted = await this.form.mutate(
        [{ op: 'set', path: ['theme'], value: clonePrettyTheme(theme) }],
        expectedRevision,
      )
      return accepted ? 'saved' as const : 'conflict' as const
    } catch {
      return 'error' as const
    }
  }

  async resetTheme(expectedRevision: number) {
    try {
      const accepted = await this.form.mutate([{ op: 'unset', path: ['theme'] }], expectedRevision)
      return accepted ? 'saved' as const : 'conflict' as const
    } catch {
      return 'error' as const
    }
  }
}
