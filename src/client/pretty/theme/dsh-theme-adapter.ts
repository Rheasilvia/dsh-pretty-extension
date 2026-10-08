import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import type { Context } from '@deepseek-ai/cordis'
import type { PrettyThemeConfig } from '../../../settings/pretty-settings.ts'
import { deriveThemeTokens } from './theme-tokens.ts'

export interface PrettyThemePort {
  preview(theme: PrettyThemeConfig): void
  restore(theme: PrettyThemeConfig): void
  clear(): void
  dispose(): void
}

const OVERRIDE_SOURCE = 'dsh-pretty-extension'

export class DshThemeAdapter implements PrettyThemePort {
  private release: (() => void) | undefined

  constructor(private readonly theme: Context['theme']) {}

  preview(config: PrettyThemeConfig): void {
    this.replace(config)
  }

  restore(config: PrettyThemeConfig): void {
    this.replace(config)
  }

  clear(): void {
    this.release?.()
    this.release = undefined
  }

  dispose(): void {
    this.clear()
  }

  private replace(config: PrettyThemeConfig): void {
    this.clear()
    if (!config.enabled) return
    this.release = this.theme.overrideTokens(OVERRIDE_SOURCE, deriveThemeTokens(config))
  }
}
