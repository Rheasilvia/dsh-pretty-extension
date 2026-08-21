import { useEffect, useId, useState } from 'react'
import { normalizeHex } from '../../theme/color-contrast.ts'
import styles from './ColorField.module.css'

export interface ColorFieldProps {
  label: string
  value: string
  errorMessage: string
  disabled?: boolean
  onCommit: (value: string) => void
}

export function ColorField({ label, value, errorMessage, disabled, onCommit }: ColorFieldProps) {
  const [text, setText] = useState(value)
  const [invalid, setInvalid] = useState(false)
  const id = useId()
  const errorId = `${id}-error`

  useEffect(() => { setText(value); setInvalid(false) }, [value])

  const commit = (): void => {
    const normalized = normalizeHex(text)
    if (normalized === undefined) { setInvalid(true); return }
    setInvalid(false)
    setText(normalized)
    onCommit(normalized)
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.controls}>
        <input
          className={styles.swatch}
          type="color"
          aria-label={`${label} color picker`}
          value={value}
          disabled={disabled}
          onChange={event => onCommit(event.currentTarget.value.toUpperCase())}
        />
        <input
          id={id}
          className={styles.text}
          value={text}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
          onChange={event => { setText(event.currentTarget.value); setInvalid(false) }}
          onBlur={commit}
          onKeyDown={event => {
            if (event.key === 'Enter') { event.preventDefault(); commit() }
            if (event.key === 'Escape') { setText(value); setInvalid(false) }
          }}
        />
      </div>
      {invalid && <span id={errorId} className={styles.error}>{errorMessage}</span>}
    </div>
  )
}
