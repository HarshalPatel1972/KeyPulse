import { DetectionResult } from './types'
import { PROVIDERS } from './providers'

export function detectProvider(key: string): DetectionResult {
  const trimmed = key.trim()
  if (!trimmed) return { provider: null, confidence: 'unknown' }

  let bestMatch: { provider: Provider; length: number } | null = null

  for (const provider of PROVIDERS) {
    for (const prefix of provider.prefixes) {
      if (trimmed.startsWith(prefix)) {
        if (!bestMatch || prefix.length > bestMatch.length) {
          bestMatch = { provider, length: prefix.length }
        }
      }
    }
  }

  if (bestMatch) {
    return { provider: bestMatch.provider, confidence: 'high' }
  }

  return { provider: null, confidence: 'unknown' }
}
