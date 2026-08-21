import { describe, expect, it } from 'vitest'
import { BrowserLocalFontCatalog } from './local-font-catalog.ts'

describe('BrowserLocalFontCatalog', () => {
  it('returns the complete visible family list in stable order', async () => {
    const catalog = new BrowserLocalFontCatalog(async () => [
      { family: 'Fira Code' }, { family: 'Avenir Next' }, { family: 'Fira Code' },
      { family: '.SF NS' }, { family: '  Menlo  ' }, { family: 'bad\nfont' }, {},
    ])
    await expect(catalog.loadFamilies()).resolves.toEqual(['Avenir Next', 'Fira Code', 'Menlo'])
  })

  it('reports an unavailable browser API without inventing a partial list', async () => {
    const catalog = new BrowserLocalFontCatalog(undefined)
    expect(catalog.supported).toBe(false)
    await expect(catalog.loadFamilies()).rejects.toMatchObject({ name: 'NotSupportedError' })
  })
})
