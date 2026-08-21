import styles from './EffectsControls.module.css'

export interface EffectsControlsProps {
  title: string
  translucentLabel: string
  translucentHint: string
  contrastLabel: string
  contrastHint: string
  translucentSidebar: boolean
  contrast: number
  disabled?: boolean
  onTranslucentChange: (value: boolean) => void
  onContrastChange: (value: number) => void
}

export function EffectsControls(props: EffectsControlsProps) {
  return (
    <fieldset className={styles.group} disabled={props.disabled}>
      <legend className={styles.legend}>{props.title}</legend>
      <label className={styles.row}>
        <span className={styles.copy}><span>{props.translucentLabel}</span><small>{props.translucentHint}</small></span>
        <span className={styles.switch}>
          <input
            type="checkbox"
            role="switch"
            checked={props.translucentSidebar}
            onChange={event => props.onTranslucentChange(event.currentTarget.checked)}
          />
          <span aria-hidden="true" />
        </span>
      </label>
      <label className={`${styles.row} ${styles.rangeRow}`}>
        <span className={styles.copy}><span>{props.contrastLabel}</span><small>{props.contrastHint}</small></span>
        <span className={styles.rangeControl}>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={props.contrast}
            aria-valuetext={`${String(props.contrast)}%`}
            onChange={event => props.onContrastChange(Number(event.currentTarget.value))}
          />
          <output>{props.contrast}</output>
        </span>
      </label>
    </fieldset>
  )
}
