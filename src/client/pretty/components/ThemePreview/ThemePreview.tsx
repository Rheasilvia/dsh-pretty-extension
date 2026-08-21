import type { PrettyPalette } from '../../../../settings/pretty-settings.ts'
import { readableOnAccent } from '../../theme/color-contrast.ts'
import styles from './ThemePreview.module.css'

export interface ThemePreviewProps {
  palette: PrettyPalette
  translucentSidebar: boolean
  label: string
  sidebarLabel: string
  conversationLabel: string
}

export function ThemePreview({
  palette, translucentSidebar, label, sidebarLabel, conversationLabel,
}: ThemePreviewProps) {
  const previewStyle = {
    '--pretty-preview-bg': palette.background,
    '--pretty-preview-fg': palette.foreground,
    '--pretty-preview-accent': palette.accent,
    '--pretty-preview-accent-fg': readableOnAccent(palette.accent),
    '--pretty-preview-sidebar': translucentSidebar ? `${palette.sidebar}D1` : palette.sidebar,
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
