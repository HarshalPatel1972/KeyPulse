import { DetectionResult } from './types'
import { PROVIDERS } from './providers'

export function detectProvider(key: string): DetectionResult {
  const trimmed = key.trim()
  if (!trimmed) return { provider: null, confidence: 'unknown' }

  for (const provider of PROVIDERS) {
    for (const prefix of provider.prefixes) {
      if (trimmed.startsWith(prefix)) {
        return { provider, confidence: 'high' }
      }
    }
  }

  return { provider: null, confidence: 'unknown' }
}
