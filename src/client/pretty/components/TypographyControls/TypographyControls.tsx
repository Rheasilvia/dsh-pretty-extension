import {
  localFontFamily, toLocalFontId, type PrettyCodeFontId, type PrettyUiFontId,
} from '../../../../settings/pretty-settings.ts'
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
      <label className={styles.row}>
        <span>{props.uiLabel}</span>
        <select value={props.uiFont} onChange={event => props.onUiFontChange(event.currentTarget.value as PrettyUiFontId)}>
          <optgroup label={props.builtinGroupLabel}>
            {props.uiOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </optgroup>
          {families.length > 0 && (
            <optgroup label={props.localGroupLabel}>
              {families.map(family => <option key={family} value={toLocalFontId(family)}>{family}</option>)}
            </optgroup>
          )}
        </select>
      </label>
      <label className={styles.row}>
        <span>{props.codeLabel}</span>
        <select value={props.codeFont} onChange={event => props.onCodeFontChange(event.currentTarget.value as PrettyCodeFontId)}>
          <optgroup label={props.builtinGroupLabel}>
            {props.codeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </optgroup>
          {families.length > 0 && (
            <optgroup label={props.localGroupLabel}>
              {families.map(family => <option key={family} value={toLocalFontId(family)}>{family}</option>)}
            </optgroup>
          )}
        </select>
      </label>
    </fieldset>
  )
}
