import { spawnSync } from 'node:child_process'

const result = spawnSync(
  'git',
  ['status', '--porcelain', '--untracked-files=all', '--', 'lib'],
  { encoding: 'utf8' },
)

if (result.error !== undefined) throw result.error

if (result.status !== 0) {
  process.stderr.write(result.stderr)
  process.exit(result.status ?? 1)
}

const status = result.stdout.trim()

if (status.length > 0) {
  process.stderr.write(`Generated lib/ is out of sync:\n${status}\n`)
  process.exit(1)
}
