/** Build the Host entry and DSH browser module as one publishable package. */
import type { UserConfig } from 'tsdown'
import { inlineCssModules } from './build/inline-css-modules.ts'

const packageId = 'dsh-pretty-extension'

const host: UserConfig = {
  name: packageId,
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  sourcemap: true,
  clean: false,
  deps: {
    neverBundle: ['@deepseek-ai/cordis'],
  },
  outputOptions: {
    entryFileNames: 'index.js',
  },
}

const client: UserConfig = {
  name: `${packageId}/client`,
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  dts: false,
  sourcemap: true,
  clean: false,
  plugins: [inlineCssModules(packageId)],
  deps: {
    neverBundle: [
      '@deepseek-ai/cordis',
      '@deepseek-ai/dsh-client-ui-primitives',
      '@deepseek-ai/dsh-client-ui-slots',
      'react',
      'react/jsx-runtime',
    ],
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(packageId)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default [host, client]
