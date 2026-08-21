import type { PrettyThemeConfig } from '../../../settings/pretty-settings.ts'

export interface PrettySnapshotStore<T> {
  getSnapshot(): T
  subscribe(listener: () => void): () => void
  set(next: T): void
}

export type PrettySaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'conflict'

export type PrettyPageState =
  | { status: 'loading' }
  | { status: 'readonly'; reason: string; persisted: PrettyThemeConfig }
  | {
    status: 'ready'
    persisted: PrettyThemeConfig
    draft: PrettyThemeConfig
    revision: number
    saveStatus: PrettySaveStatus
    message?: string
  }

export function createPrettySettingsStore(): PrettySnapshotStore<PrettyPageState> {
  let snapshot: PrettyPageState = { status: 'loading' }
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener) } },
    set(next) { snapshot = next; for (const listener of [...listeners]) listener() },
  }
}

export function isDirty(state: PrettyPageState): boolean {
  return state.status === 'ready' && JSON.stringify(state.persisted) !== JSON.stringify(state.draft)
}
