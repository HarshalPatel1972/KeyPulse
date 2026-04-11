import { VerifyResult } from '../types'

export async function verifyGemini(key: string): Promise<VerifyResult> {
  const base = { provider: 'gemini' as const, checkedAt: new Date().toISOString() }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`
    )

    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return {
        ...base,
        status: 'invalid',
        models: [],
        account: null,
        rateLimit: null,
        rawError: 'Invalid API key.',
      }
    }
    if (res.status === 429) {
      return {
        ...base,
        status: 'rate_limited',
        models: [],
        account: null,
        rateLimit: null,
        rawError: 'Rate limited.',
      }
    }
    if (!res.ok) {
      return {
        ...base,
        status: 'error',
        models: [],
        account: null,
        rateLimit: null,
        rawError: `HTTP ${res.status}`,
      }
    }

    const data = await res.json()
    const models: string[] = (data.models ?? [])
      .map((m: { name: string }) => m.name.replace('models/', ''))
      .sort()

    return { ...base, status: 'valid', models, account: null, rateLimit: null }
  } catch {
    return {
      ...base,
      status: 'error',
      models: [],
      account: null,
      rateLimit: null,
      rawError: 'Network error.',
    }
  }
}
