import { useEffect, useState } from 'react'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { PrettyThemeConfig } from '../../../settings/pretty-settings.ts'
import type { PrettyTranslate } from '../../locales.ts'
import { isDirty } from '../state/pretty-settings-store.ts'
import type { PrettySettingsController, PaletteMode } from '../state/pretty-settings-controller.ts'
import { useLocalFontFamilies } from '../state/use-local-font-families.ts'
import type { LocalFontCatalog } from '../theme/local-font-catalog.ts'
import { BUILTIN_PRESET_IDS, THEME_PRESETS } from '../theme/theme-presets.ts'
import { ThemePreview } from '../components/ThemePreview/ThemePreview.tsx'
import { PaletteEditor } from '../components/PaletteEditor/PaletteEditor.tsx'
import { TypographyControls } from '../components/TypographyControls/TypographyControls.tsx'
import { EffectsControls } from '../components/EffectsControls/EffectsControls.tsx'
import { SettingsActionBar } from '../components/SettingsActionBar/SettingsActionBar.tsx'
import styles from './PrettySection.module.css'

export interface PrettySectionInjected {
  controller: PrettySettingsController
  fontCatalog: LocalFontCatalog
  hooks: { pretty: PrettySettingsController['store'] }
  t: PrettyTranslate
}

export type PrettySectionProps = PropsRuntime<'settings.section'> & InjectFace<PrettySectionInjected>

function Loading({ t }: { t: PrettyTranslate }) {
  return (
    <section className={styles.section} aria-busy="true" aria-label={t('loading')}>
      <div className={styles.skeletonTitle} /><div className={styles.skeletonLine} /><div className={styles.skeletonPanel} />
    </section>
  )
}

function ReadonlyState({ t, reason, persisted }: { t: PrettyTranslate; reason: string; persisted: PrettyThemeConfig }) {
  return (
    <section className={styles.section}>
      <header className={styles.header}><h1>{t('title')}</h1><p>{t('description')}</p></header>
      <div className={styles.notice} role="status">
        <strong>{t('readonlyTitle')}</strong>
        <span>{t(reason === 'remote-memory' ? 'readonlyRemote' : 'readonlyUnavailable')}</span>
      </div>
      <ThemePreview palette={persisted.dark} translucentSidebar={persisted.translucentSidebar} label={t('preview')} sidebarLabel={t('previewSidebar')} conversationLabel={t('previewConversation')} />
    </section>
  )
}

export function PrettySection({ controller, fontCatalog, usePretty, t }: PrettySectionProps) {
  const state = usePretty(snapshot => snapshot)
  const [mode, setMode] = useState<PaletteMode>('dark')
  const localFonts = useLocalFontFamilies(fontCatalog)
  useEffect(() => () => { controller.discard() }, [controller])
  if (state.status === 'loading') return <Loading t={t} />
  if (state.status === 'readonly') return <ReadonlyState t={t} reason={state.reason} persisted={state.persisted} />

  const disabled = state.saveStatus === 'saving' || state.saveStatus === 'conflict'
  const editorDisabled = disabled || !state.draft.enabled
  const dirty = isDirty(state)
  const palette = state.draft[mode]
  const correction = state.message?.startsWith('contrast:') === true ? state.message.split(':') : undefined
  const correctionMessage = correction !== undefined
    ? t('contrastCorrected', { mode: correction[1] === 'dark' ? t('dark') : t('light'), color: correction[2] ?? '' })
    : ''
  const resultMessage = state.message === 'saved'
    ? t(state.draft.enabled ? 'saved' : 'savedDisabled')
    : state.message === 'reset' ? t('resetDone')
      : state.message === 'save-error' ? t('saveError') : ''
  const actionStatus = state.message === 'saved' || state.message === 'reset' || state.message === 'save-error'
    ? resultMessage
    : dirty ? t('unsaved') : t('noChanges')
  const fontBookStatus = localFonts.status === 'ready'
    ? t('fontsLoaded', { count: localFonts.families.length })
    : t(localFonts.status === 'idle' ? 'fontBookIdle'
      : localFonts.status === 'loading' ? 'loadingFonts'
        : localFonts.status === 'denied' ? 'fontsDenied'
          : localFonts.status === 'unsupported' ? 'fontsUnsupported' : 'fontsError')
  const canLoadFonts = localFonts.status !== 'unsupported' && localFonts.status !== 'loading'

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div><h1>{t('title')}</h1><p>{t('description')}</p></div>
        <label className={styles.masterSwitch}>
          <span><strong>{t('enabled')}</strong><small>{t(state.draft.enabled ? 'enabledHint' : 'disabledHint')}</small></span>
          <span className={styles.masterToggle}>
            <input type="checkbox" role="switch" checked={state.draft.enabled} disabled={disabled} onChange={event => controller.setEnabled(event.currentTarget.checked)} />
            <span aria-hidden="true" />
          </span>
        </label>
      </header>

      {state.saveStatus === 'conflict' && (
        <div className={styles.notice} role="alert">
          <strong>{t('conflictTitle')}</strong><span>{t('conflictBody')}</span>
          <button type="button" onClick={() => controller.reloadLatest()}>{t('reload')}</button>
        </div>
      )}

      {!state.draft.enabled && state.saveStatus !== 'conflict' && (
        <div className={styles.notice} role="status">
          <strong>{t('disabledTitle')}</strong>
          <span>{t('disabledBody')}</span>
          <button type="button" disabled={disabled} onClick={() => controller.setEnabled(true)}>{t('enableNow')}</button>
        </div>
      )}

      <div className={styles.previewGroup}>
        <div className={styles.segmented} aria-label={t('palette')}>
          {(['light', 'dark'] as const).map(value => (
            <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)}>{t(value)}</button>
          ))}
        </div>
        <ThemePreview palette={palette} translucentSidebar={state.draft.translucentSidebar} label={`${t('preview')} — ${t(mode)}`} sidebarLabel={t('previewSidebar')} conversationLabel={t('previewConversation')} />
      </div>

      <label className={styles.selectRow}>
        <span>{t('preset')}</span>
        <select value={state.draft.preset} disabled={editorDisabled} onChange={event => {
          const value = event.currentTarget.value
          if (value !== 'custom') controller.selectPreset(value as typeof BUILTIN_PRESET_IDS[number])
        }}>
          {BUILTIN_PRESET_IDS.map(id => <option key={id} value={id}>{THEME_PRESETS[id].label}</option>)}
          {state.draft.preset === 'custom' && <option value="custom">{t('custom')}</option>}
          {(state.draft.preset === 'ocean' || state.draft.preset === 'forest') && (
            <option value={state.draft.preset}>{t(state.draft.preset)} ({t('legacy')})</option>
          )}
        </select>
      </label>

      <PaletteEditor legend={`${t('palette')} — ${t(mode)}`} palette={palette} labels={{ accent: t('accent'), background: t('background'), foreground: t('foreground'), sidebar: t('sidebar') }} errorMessage={t('colorError')} disabled={editorDisabled} onChange={(field, color) => controller.updatePalette(mode, field, color)} />
      <TypographyControls
        title={t('typography')} uiLabel={t('uiFont')} codeLabel={t('codeFont')} uiFont={state.draft.uiFont} codeFont={state.draft.codeFont}
        uiOptions={[{ value: 'system', label: t('uiSystem') }, { value: 'modern', label: t('uiModern') }, { value: 'humanist', label: t('uiHumanist') }]}
        codeOptions={[{ value: 'system-mono', label: t('codeSystem') }, { value: 'jetbrains', label: t('codeJetbrains') }, { value: 'fira', label: t('codeFira') }]}
        localFamilies={localFonts.families} builtinGroupLabel={t('builtinFonts')} localGroupLabel={t('systemFonts')}
        fontBookStatus={fontBookStatus} loadFontsLabel={t(localFonts.status === 'ready' ? 'refreshFonts' : 'loadFonts')}
        loadingFonts={localFonts.status === 'loading'} canLoadFonts={canLoadFonts} disabled={editorDisabled}
        onLoadFonts={() => { void localFonts.load() }} onUiFontChange={value => controller.setUiFont(value)} onCodeFontChange={value => controller.setCodeFont(value)}
      />
      <EffectsControls
        title={t('effects')} translucentLabel={t('translucentSidebar')} translucentHint={t('translucentHint')} contrastLabel={t('contrast')} contrastHint={t('contrastHint')}
        translucentSidebar={state.draft.translucentSidebar} contrast={state.draft.contrast} disabled={editorDisabled}
        onTranslucentChange={value => controller.setTranslucentSidebar(value)} onContrastChange={value => controller.setContrast(value)}
      />

      <div className={styles.liveRegion} aria-live="polite" aria-atomic="true">{correctionMessage}</div>
      <SettingsActionBar resetLabel={t('reset')} discardLabel={t('discard')} saveLabel={state.saveStatus === 'saving' ? t('saving') : t(state.draft.enabled ? 'save' : 'saveDisabled')} statusLabel={actionStatus} dirty={dirty} saving={state.saveStatus === 'saving'} saveDisabled={!dirty || disabled} onReset={() => { void controller.reset() }} onDiscard={() => controller.discard()} onSave={() => { void controller.save() }} />
    </section>
  )
}
