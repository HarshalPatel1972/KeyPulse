import { VerifyResult, ProviderId } from '../types'
import { verifyOpenAI } from './openai'
import { verifyAnthropic } from './anthropic'
import { verifyGemini } from './gemini'
import { verifyGroq } from './groq'
import { verifyHuggingFace } from './huggingface'
import { verifyReplicate } from './replicate'
import { proxyVerifier } from './proxy'

const DIRECT_VERIFIERS: Partial<Record<ProviderId, (key: string) => Promise<VerifyResult>>> = {
  openai: verifyOpenAI,
  anthropic: verifyAnthropic,
  gemini: verifyGemini,
  groq: verifyGroq,
  huggingface: verifyHuggingFace,
  replicate: verifyReplicate,
  mistral: (key) => proxyVerifier(key, 'mistral'),
  cohere: (key) => proxyVerifier(key, 'cohere'),
  perplexity: (key) => proxyVerifier(key, 'perplexity'),
}

export async function verify(key: string, providerId: ProviderId): Promise<VerifyResult> {
  const verifier = DIRECT_VERIFIERS[providerId]
  if (!verifier) {
    // Phase 6: proxy-based verifiers added here
    return {
      status: 'error',
      provider: providerId,
      models: [],
      account: null,
      rateLimit: null,
      rawError: 'Proxy-based verifier not yet configured. Add NEXT_PUBLIC_CF_WORKER_URL.',
      checkedAt: new Date().toISOString(),
    }
  }
  return verifier(key)
}
