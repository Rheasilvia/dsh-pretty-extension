import type { PrettyPalette } from '../../../../settings/pretty-settings.ts'
import { derivePreviewColors } from '../../theme/theme-tokens.ts'
import styles from './ThemePreview.module.css'

export interface ThemePreviewProps {
  palette: PrettyPalette
  translucentSidebar: boolean
  contrast: number
  label: string
  sidebarLabel: string
  conversationLabel: string
}

export function ThemePreview({
  palette, translucentSidebar, contrast, label, sidebarLabel, conversationLabel,
}: ThemePreviewProps) {
  const colors = derivePreviewColors(palette, { translucentSidebar, contrast })
  const previewStyle = {
    '--pretty-preview-bg': colors.background,
    '--pretty-preview-fg': colors.foreground,
    '--pretty-preview-accent': colors.accent,
    '--pretty-preview-accent-fg': colors.accentForeground,
    '--pretty-preview-sidebar': colors.sidebar,
    '--pretty-preview-sidebar-item': colors.sidebarItemSelected,
  } as React.CSSProperties
  return (
    <figure className={styles.preview} style={previewStyle} aria-label={label}>
      <div className={styles.sidebar}>
        <span className={styles.previewLabel}>{sidebarLabel}</span>
        <span className={styles.navItem} />
        <span className={styles.navItem} />
        <span className={`${styles.navItem} ${styles.navItemActive}`} />
      </div>
      <div className={styles.content}>
        <span className={styles.previewLabel}>{conversationLabel}</span>
        <div className={styles.message} />
        <div className={styles.messageShort} />
        <div className={styles.composer}><span /></div>
      </div>
    </figure>
  )
}
