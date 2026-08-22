import {
  localFontFamily, toLocalFontId, type PrettyCodeFontId, type PrettyUiFontId,
} from '../../../../settings/pretty-settings.ts'
import { PrettySelect } from '../PrettySelect/PrettySelect.tsx'
import styles from './TypographyControls.module.css'

interface SelectOption<T extends string> { value: T; label: string }

export interface TypographyControlsProps {
  title: string
  uiLabel: string
  codeLabel: string
  uiFont: PrettyUiFontId
  codeFont: PrettyCodeFontId
  uiOptions: SelectOption<PrettyUiFontId>[]
  codeOptions: SelectOption<PrettyCodeFontId>[]
  localFamilies: string[]
  builtinGroupLabel: string
  localGroupLabel: string
  fontBookStatus: string
  loadFontsLabel: string
  loadingFonts: boolean
  canLoadFonts: boolean
  disabled?: boolean
  onLoadFonts: () => void
  onUiFontChange: (value: PrettyUiFontId) => void
  onCodeFontChange: (value: PrettyCodeFontId) => void
}

export function TypographyControls(props: TypographyControlsProps) {
  const selectedFamilies = [localFontFamily(props.uiFont), localFontFamily(props.codeFont)]
    .filter((family): family is string => family !== undefined)
  const families = [...new Set([...props.localFamilies, ...selectedFamilies])]
    .sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }))
  return (
    <fieldset className={styles.group} disabled={props.disabled}>
      <legend className={styles.legend}>{props.title}</legend>
      <div className={styles.catalogRow}>
        <span aria-live="polite">{props.fontBookStatus}</span>
        {props.canLoadFonts && (
          <button type="button" disabled={props.loadingFonts} onClick={props.onLoadFonts}>{props.loadFontsLabel}</button>
        )}
      </div>
      <div className={styles.row}>
        <span>{props.uiLabel}</span>
        <PrettySelect
          label={props.uiLabel}
          value={props.uiFont}
          disabled={props.disabled}
          groups={[
            { label: props.builtinGroupLabel, options: props.uiOptions },
            ...(families.length === 0 ? [] : [{
              label: props.localGroupLabel,
              options: families.map(family => ({ value: toLocalFontId(family), label: family })),
            }]),
          ]}
          onChange={props.onUiFontChange}
        />
      </div>
      <div className={styles.row}>
        <span>{props.codeLabel}</span>
        <PrettySelect
          label={props.codeLabel}
          value={props.codeFont}
          disabled={props.disabled}
          groups={[
            { label: props.builtinGroupLabel, options: props.codeOptions },
            ...(families.length === 0 ? [] : [{
              label: props.localGroupLabel,
              options: families.map(family => ({ value: toLocalFontId(family), label: family })),
            }]),
          ]}
          onChange={props.onCodeFontChange}
        />
      </div>
    </fieldset>
  )
}
