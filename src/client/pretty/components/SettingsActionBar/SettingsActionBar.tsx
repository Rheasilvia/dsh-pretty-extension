import { Button } from '@deepseek-ai/dsh-client-ui-primitives'
import styles from './SettingsActionBar.module.css'

export interface SettingsActionBarProps {
  resetLabel: string
  discardLabel: string
  saveLabel: string
  statusLabel: string
  dirty: boolean
  saving: boolean
  saveDisabled: boolean
  onReset: () => void
  onDiscard: () => void
  onSave: () => void
}

export function SettingsActionBar(props: SettingsActionBarProps) {
  return (
    <div className={styles.bar}>
      <span className={styles.status} aria-live="polite" aria-atomic="true">{props.statusLabel}</span>
      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="sm" disabled={props.saving} onClick={props.onReset}>{props.resetLabel}</Button>
        <Button type="button" variant="outline" size="sm" disabled={!props.dirty || props.saving} onClick={props.onDiscard}>{props.discardLabel}</Button>
        <Button type="button" variant="primary" size="sm" disabled={props.saveDisabled} onClick={props.onSave}>{props.saveLabel}</Button>
      </div>
    </div>
  )
}
