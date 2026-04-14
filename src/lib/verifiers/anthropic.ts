import { VerifyResult } from '../types'

export async function verifyAnthropic(key: string): Promise<VerifyResult> {
  const base = { provider: 'anthropic' as const, checkedAt: new Date().toISOString() }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const res = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
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
