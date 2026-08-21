import { isLocalFontFamily } from '../../../settings/pretty-settings.ts'

export interface LocalFontCatalog {
  readonly supported: boolean
  loadFamilies(): Promise<string[]>
}

interface LocalFontData {
  family?: unknown
}

type QueryLocalFonts = () => Promise<readonly LocalFontData[]>

export class BrowserLocalFontCatalog implements LocalFontCatalog {
  readonly supported: boolean

  constructor(private readonly query: QueryLocalFonts | undefined) {
    this.supported = query !== undefined
  }

  async loadFamilies(): Promise<string[]> {
    if (this.query === undefined) throw new DOMException('Local Font Access is unavailable', 'NotSupportedError')
    const fonts = await this.query()
    const families = new Set<string>()
    for (const font of fonts) {
      if (typeof font.family !== 'string') continue
      const family = font.family.trim()
      if (family.startsWith('.') || !isLocalFontFamily(family)) continue
      families.add(family)
    }
    return [...families].sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }))
  }
}

export function createBrowserLocalFontCatalog(): LocalFontCatalog {
  const owner = globalThis as typeof globalThis & { queryLocalFonts?: QueryLocalFonts }
  const query = typeof owner.queryLocalFonts === 'function' ? owner.queryLocalFonts.bind(owner) : undefined
  return new BrowserLocalFontCatalog(query)
}
