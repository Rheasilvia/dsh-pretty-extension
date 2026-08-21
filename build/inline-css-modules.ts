import { readFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { transform } from 'lightningcss'

const VIRTUAL_PREFIX = '\0pretty-css:'
const VIRTUAL_SUFFIX = '.mjs'

export function inlineCssModules(pluginId: string) {
  return {
    name: 'pretty-css-modules-inline',
    resolveId(source: string, importer?: string) {
      if (!source.endsWith('.module.css')) return null
      const file = importer === undefined ? source : resolve(dirname(importer), source)
      return VIRTUAL_PREFIX + file + VIRTUAL_SUFFIX
    },
    async load(this: { addWatchFile(file: string): void }, virtualId: string) {
      if (!virtualId.startsWith(VIRTUAL_PREFIX)) return null
      const file = virtualId.slice(VIRTUAL_PREFIX.length, -VIRTUAL_SUFFIX.length)
      this.addWatchFile(file)
      const result = transform({
        filename: file,
        code: await readFile(file),
        cssModules: { pattern: '[hash]_[local]' },
        minify: true,
      })
      const classes: Record<string, string> = {}
      for (const [local, value] of Object.entries(result.exports ?? {})) classes[local] = value.name
      const tagId = `${pluginId}/${basename(file)}`
      return [
        `const css = ${JSON.stringify(result.code.toString())};`,
        `const tagId = ${JSON.stringify(tagId)};`,
        "if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {",
        "  const tag = document.createElement('style');",
        `  tag.dataset.plugin = ${JSON.stringify(pluginId)};`,
        '  tag.dataset.pluginCss = tagId;',
        '  tag.textContent = css;',
        '  document.head.appendChild(tag);',
        '}',
        `export default ${JSON.stringify(classes)};`,
      ].join('\n')
    },
  }
}
