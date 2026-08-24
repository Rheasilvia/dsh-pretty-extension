import type { CSSModuleExports } from 'lightningcss'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import {
  inlineCssModules,
  toPortableCssFilename,
  toSortedClassNames,
} from '../../build/inline-css-modules.ts'

describe('inlineCssModules', () => {
  it('uses a checkout-independent filename for CSS Module hashing', () => {
    expect(
      toPortableCssFilename(
        '/Users/developer/project/src/client/Theme.module.css',
        '/Users/developer/project',
      ),
    ).toBe('src/client/Theme.module.css')
    expect(
      toPortableCssFilename(
        '/home/runner/work/project/project/src/client/Theme.module.css',
        '/home/runner/work/project/project',
      ),
    ).toBe('src/client/Theme.module.css')
  })

  it('sorts CSS Module class names before serializing them', () => {
    const exports: CSSModuleExports = {
      zeta: { name: 'hash_zeta', isReferenced: false, composes: [] },
      alpha: { name: 'hash_alpha', isReferenced: false, composes: [] },
      middle: { name: 'hash_middle', isReferenced: false, composes: [] },
    }

    expect(toSortedClassNames(exports)).toEqual({
      alpha: 'hash_alpha',
      middle: 'hash_middle',
      zeta: 'hash_zeta',
    })
  })

  it('emits byte-identical modules across repeated transforms', async () => {
    const plugin = inlineCssModules('test-plugin')
    const cssFile = resolve('src/client/pretty/components/ThemePreview/ThemePreview.module.css')
    const virtualId = plugin.resolveId(cssFile)
    expect(virtualId).toBe(
      '\0pretty-css:src/client/pretty/components/ThemePreview/ThemePreview.module.css.mjs',
    )

    const context = { addWatchFile: vi.fn() }
    const first = await plugin.load.call(context, virtualId!)
    const second = await plugin.load.call(context, virtualId!)

    expect(first).toBe(second)
  })
})
