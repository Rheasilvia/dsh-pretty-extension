import type { PrettyPalette } from '../../../../settings/pretty-settings.ts'
import type { PaletteField } from '../../state/pretty-settings-controller.ts'
import { ColorField } from '../ColorField/ColorField.tsx'
import styles from './PaletteEditor.module.css'

export interface PaletteEditorProps {
  legend: string
  palette: PrettyPalette
  labels: Record<PaletteField, string>
  errorMessage: string
  disabled?: boolean
  onChange: (field: PaletteField, color: string) => void
}

const fields: PaletteField[] = ['accent', 'background', 'foreground', 'sidebar']

export function PaletteEditor({ legend, palette, labels, errorMessage, disabled, onChange }: PaletteEditorProps) {
  return (
    <fieldset className={styles.editor} disabled={disabled}>
      <legend className={styles.legend}>{legend}</legend>
      {fields.map(field => (
        <ColorField
          key={field}
          label={labels[field]}
          value={palette[field]}
          errorMessage={errorMessage}
          disabled={disabled}
          onCommit={color => onChange(field, color)}
        />
      ))}
    </fieldset>
  )
}
