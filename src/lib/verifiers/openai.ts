import { VerifyResult } from '../types'

export async function verifyOpenAI(key: string): Promise<VerifyResult> {
  const base: Pick<VerifyResult, 'provider' | 'checkedAt'> = {
    provider: 'openai',
    checkedAt: new Date().toISOString(),
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (res.status === 401 || res.status === 403) {
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
    const models: string[] = (data.data ?? []).map((m: { id: string }) => m.id).sort()

    const rateLimit = {
      remaining: parseInt(res.headers.get('x-ratelimit-remaining-requests') ?? ''),
      limit: parseInt(res.headers.get('x-ratelimit-limit-requests') ?? ''),
    }

    return {
      ...base,
      status: 'valid',
      models,
      account: null, // OpenAI /models doesn't expose org name
      rateLimit: isNaN(rateLimit.remaining) ? null : rateLimit,
    }
  } catch (err) {
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
