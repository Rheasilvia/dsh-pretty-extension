import { useCallback, useState } from 'react'
import type { LocalFontCatalog } from '../theme/local-font-catalog.ts'

export type LocalFontLoadStatus = 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported' | 'error'

export interface LocalFontFamiliesState {
  status: LocalFontLoadStatus
  families: string[]
  load: () => Promise<void>
}

export function useLocalFontFamilies(catalog: LocalFontCatalog): LocalFontFamiliesState {
  const [status, setStatus] = useState<LocalFontLoadStatus>(catalog.supported ? 'idle' : 'unsupported')
  const [families, setFamilies] = useState<string[]>([])
  const load = useCallback(async () => {
    if (!catalog.supported || status === 'loading') return
    setStatus('loading')
    try {
      setFamilies(await catalog.loadFamilies())
      setStatus('ready')
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === 'NotAllowedError' ? 'denied' : 'error')
    }
  }, [catalog, status])
  return { status, families, load }
}
