import {
  clonePrettyTheme, DEFAULT_PRETTY_THEME, type PrettyCodeFontId, type PrettyPalette,
  type PrettyThemeConfig, type PrettyUiFontId,
} from '../../../settings/pretty-settings.ts'
import { ensureReadableForeground } from '../theme/color-contrast.ts'
import { applyPreset, type BuiltinPrettyPresetId } from '../theme/theme-presets.ts'
import type { PrettyThemePort } from '../theme/dsh-theme-adapter.ts'
import type { PrettySettingsPort, PrettySettingsSnapshot } from './dsh-settings-adapter.ts'
import {
  createPrettySettingsStore, isDirty, type PrettyPageState, type PrettySnapshotStore,
} from './pretty-settings-store.ts'

export type PaletteMode = 'light' | 'dark'
export type PaletteField = keyof PrettyPalette

export class PrettySettingsController {
  readonly store: PrettySnapshotStore<PrettyPageState> = createPrettySettingsStore()
  private readonly unsubscribe: () => void
  private disposed = false

  constructor(
    private readonly settings: PrettySettingsPort,
    private readonly theme: PrettyThemePort,
  ) {
    this.unsubscribe = settings.subscribe(() => { this.adopt(settings.getSnapshot()) })
    this.adopt(settings.getSnapshot())
  }

  setEnabled(enabled: boolean): void {
    this.edit(draft => ({ ...draft, enabled }))
  }

  selectPreset(id: BuiltinPrettyPresetId): void {
    this.edit(draft => applyPreset(draft, id))
  }

  updatePalette(mode: PaletteMode, field: PaletteField, color: string): void {
    this.edit(draft => {
      const palette = { ...draft[mode], [field]: color }
      const correction = field === 'background' || field === 'foreground'
        ? ensureReadableForeground(palette.foreground, palette.background)
        : undefined
      if (correction?.corrected === true) palette.foreground = correction.color
      return {
        ...draft,
        preset: 'custom',
        [mode]: palette,
        ...(correction?.corrected === true ? { __message: `contrast:${mode}:${correction.color}` } : {}),
      } as PrettyThemeConfig & { __message?: string }
    })
  }

  setUiFont(uiFont: PrettyUiFontId): void {
    this.edit(draft => ({ ...draft, uiFont }))
  }

  setCodeFont(codeFont: PrettyCodeFontId): void {
    this.edit(draft => ({ ...draft, codeFont }))
  }

  setTranslucentSidebar(translucentSidebar: boolean): void {
    this.edit(draft => ({ ...draft, translucentSidebar }))
  }

  setContrast(contrast: number): void {
    this.edit(draft => ({ ...draft, contrast: Math.round(Math.min(100, Math.max(0, contrast))) }))
  }

  discard(): void {
    const state = this.store.getSnapshot()
    if (state.status !== 'ready') return
    const persisted = clonePrettyTheme(state.persisted)
    this.store.set({ ...state, draft: persisted, saveStatus: 'idle', message: undefined })
    this.theme.restore(persisted)
  }

  reloadLatest(): void {
    const snapshot = this.settings.getSnapshot()
    if (snapshot.status !== 'ready' || snapshot.theme === undefined) return
    this.setReady(snapshot.theme, snapshot.revision ?? 0, 'idle')
  }

  async save(): Promise<void> {
    const state = this.store.getSnapshot()
    if (state.status !== 'ready' || state.saveStatus === 'saving' || state.saveStatus === 'conflict') return
    const draft = clonePrettyTheme(state.draft)
    this.store.set({ ...state, saveStatus: 'saving', message: undefined })
    const result = await this.settings.saveTheme(draft, state.revision)
    if (this.disposed || this.store.getSnapshot().status !== 'ready') return
    if (result === 'saved') {
      const next = this.settings.getSnapshot()
      this.setReady(next.theme ?? draft, next.revision ?? state.revision + 1, 'saved', 'saved')
      return
    }
    this.markFailure(result)
  }

  async reset(): Promise<void> {
    const state = this.store.getSnapshot()
    if (state.status !== 'ready' || state.saveStatus === 'saving') return
    this.store.set({ ...state, saveStatus: 'saving', message: undefined })
    const result = await this.settings.resetTheme(state.revision)
    if (this.disposed || this.store.getSnapshot().status !== 'ready') return
    if (result === 'saved') {
      const next = this.settings.getSnapshot()
      this.setReady(next.theme ?? clonePrettyTheme(DEFAULT_PRETTY_THEME), next.revision ?? state.revision + 1, 'saved', 'reset')
      return
    }
    this.markFailure(result)
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    const state = this.store.getSnapshot()
    if (state.status === 'ready' || state.status === 'readonly') this.theme.restore(state.persisted)
    this.unsubscribe()
    this.theme.dispose()
  }

  private edit(update: (draft: PrettyThemeConfig) => PrettyThemeConfig & { __message?: string }): void {
    const state = this.store.getSnapshot()
    if (state.status !== 'ready' || state.saveStatus === 'saving' || state.saveStatus === 'conflict') return
    const updated = update(clonePrettyTheme(state.draft))
    const { __message, ...next } = updated
    const draft = clonePrettyTheme(next as PrettyThemeConfig)
    this.store.set({ ...state, draft, saveStatus: 'idle', message: __message })
    this.theme.preview(draft)
  }

  private adopt(snapshot: PrettySettingsSnapshot): void {
    if (this.disposed) return
    if (snapshot.status === 'loading') {
      this.store.set({ status: 'loading' })
      return
    }
    const persisted = clonePrettyTheme(snapshot.theme ?? DEFAULT_PRETTY_THEME)
    if (snapshot.status === 'unavailable' || !snapshot.writable || snapshot.mode === 'memory') {
      this.store.set({
        status: 'readonly',
        reason: snapshot.mode === 'memory' ? 'remote-memory' : 'settings-unavailable',
        persisted,
      })
      this.theme.restore(persisted)
      return
    }
    const revision = snapshot.revision ?? 0
    const current = this.store.getSnapshot()
    if (current.status === 'ready' && revision === current.revision) return
    if (current.status === 'ready' && current.saveStatus !== 'saving' && isDirty(current)) {
      this.store.set({ ...current, saveStatus: 'conflict', message: 'external-change' })
      return
    }
    this.setReady(persisted, revision, current.status === 'ready' && current.saveStatus === 'saving' ? 'saved' : 'idle')
  }

  private setReady(
    theme: PrettyThemeConfig,
    revision: number,
    saveStatus: 'idle' | 'saved',
    message?: string,
  ): void {
    const persisted = clonePrettyTheme(theme)
    this.store.set({
      status: 'ready', persisted, draft: clonePrettyTheme(persisted), revision, saveStatus,
      ...(message === undefined ? {} : { message }),
    })
    this.theme.restore(persisted)
  }

  private markFailure(result: 'conflict' | 'error'): void {
    const state = this.store.getSnapshot()
    if (state.status !== 'ready') return
    this.store.set({ ...state, saveStatus: result, message: result === 'conflict' ? 'external-change' : 'save-error' })
  }
}
