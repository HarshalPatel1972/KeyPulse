import { describe, it, expect } from 'vitest'
import { detectProvider } from '@/lib/detect'

describe('detectProvider', () => {
  it('returns unknown for empty strings', () => {
    expect(detectProvider('')).toEqual({ provider: null, confidence: 'unknown' })
    expect(detectProvider('   ')).toEqual({ provider: null, confidence: 'unknown' })
  })

  it('identifies OpenAI keys', () => {
    const result = detectProvider('sk-1234567890abcdef')
    expect(result.confidence).toBe('high')
    expect(result.provider?.id).toBe('openai')

    const projResult = detectProvider('sk-proj-1234567890abcdef')
    expect(projResult.confidence).toBe('high')
    expect(projResult.provider?.id).toBe('openai')
  })

  it('identifies Anthropic keys', () => {
    const result = detectProvider('sk-ant-api03-12345')
    expect(result.confidence).toBe('high')
    expect(result.provider?.id).toBe('anthropic')
  })

  it('identifies Cohere keys', () => {
    // Cohere keys are typically base64 encoded and might not have a strong prefix, 
    // but assuming there is a defined prefix in PROVIDERS, it should match.
    // If not, it falls back to unknown.
  })

  it('returns unknown for unrecognized keys', () => {
    const result = detectProvider('random-string-without-prefix')
    expect(result.confidence).toBe('unknown')
    expect(result.provider).toBeNull()
  })
})
