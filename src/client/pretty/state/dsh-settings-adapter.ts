import type {
  SettingsScope, SettingsScopeSnapshot,
} from '@deepseek-ai/dsh-client-runtime/client'
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

function project(snapshot: SettingsScopeSnapshot<PrettySettings>): PrettySettingsSnapshot {
  return {
    status: snapshot.status,
    ...(snapshot.value?.theme === undefined ? {} : { theme: clonePrettyTheme(snapshot.value.theme) }),
    ...(snapshot.revision === undefined ? {} : { revision: snapshot.revision }),
    writable: snapshot.writable,
    mode: snapshot.mode,
    overridden: typeof snapshot.user === 'object' && snapshot.user !== null && 'theme' in snapshot.user,
  }
}

export class DshSettingsAdapter implements PrettySettingsPort {
  constructor(private readonly scope: SettingsScope<PrettySettings>) {}

  getSnapshot(): PrettySettingsSnapshot {
    return project(this.scope.getSnapshot())
  }

  subscribe(listener: () => void): () => void {
    return this.scope.subscribe(listener)
  }

  async saveTheme(theme: PrettyThemeConfig, expectedRevision: number) {
    try {
      await this.scope.set('theme', clonePrettyTheme(theme))
      return this.settlement(expectedRevision, theme, true)
    } catch {
      return 'error' as const
    }
  }

  async resetTheme(expectedRevision: number) {
    try {
      await this.scope.unset('theme')
      const next = this.getSnapshot()
      if (!next.overridden) return 'saved' as const
      return next.revision === expectedRevision ? 'error' as const : 'conflict' as const
    } catch {
      return 'error' as const
    }
  }

  private settlement(expectedRevision: number, theme: PrettyThemeConfig, requireOverride: boolean) {
    const next = this.getSnapshot()
    if (next.revision === expectedRevision) return 'error' as const
    if (next.theme !== undefined
      && JSON.stringify(next.theme) === JSON.stringify(theme)
      && (!requireOverride || next.overridden)) return 'saved' as const
    return 'conflict' as const
  }
}
