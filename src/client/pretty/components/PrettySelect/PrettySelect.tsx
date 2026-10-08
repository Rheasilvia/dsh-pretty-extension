import { useState } from 'react'
import {
  IconChevronDownOutlineRegular, Menu, type MenuEntry,
} from '@deepseek-ai/dsh-client-ui-primitives'
import styles from './PrettySelect.module.css'

export interface PrettySelectOption<T extends string> {
  value: T
  label: string
}

export interface PrettySelectGroup<T extends string> {
  label?: string
  options: readonly PrettySelectOption<T>[]
}

export interface PrettySelectProps<T extends string> {
  label: string
  value: T
  groups: readonly PrettySelectGroup<T>[]
  disabled?: boolean
  onChange: (value: T) => void
}

/** DSH-menu-backed single-value picker for Pretty settings rows. */
export function PrettySelect<T extends string>({
  label, value, groups, disabled = false, onChange,
}: PrettySelectProps<T>) {
  const [open, setOpen] = useState(false)
  const options = groups.flatMap(group => group.options)
  const selectedLabel = options.find(option => option.value === value)?.label ?? value
  const entries: MenuEntry[] = groups.flatMap((group, index) => [
    ...(group.label === undefined ? [] : [{
      type: 'label' as const,
      id: `group-${String(index)}`,
      text: group.label,
    }]),
    ...group.options.map(option => ({ id: option.value, label: option.label })),
  ])

  return (
    <Menu
      open={open && !disabled}
      onClose={() => { setOpen(false) }}
      items={entries}
      selectedId={value}
      onSelect={id => {
        setOpen(false)
        onChange(id as T)
      }}
      align="end"
      portal
      dense
      className={styles.root}
      anchor={(
        <button
          type="button"
          className={styles.trigger}
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={open && !disabled}
          disabled={disabled}
          onClick={() => { setOpen(current => !current) }}
          onKeyDown={event => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
            event.preventDefault()
            setOpen(true)
          }}
        >
          <span className={styles.value}>{selectedLabel}</span>
          <IconChevronDownOutlineRegular className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
        </button>
      )}
    />
  )
}
