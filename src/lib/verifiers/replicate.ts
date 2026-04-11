import { VerifyResult } from '../types'

export async function verifyReplicate(key: string): Promise<VerifyResult> {
  const base = { provider: 'replicate' as const, checkedAt: new Date().toISOString() }

  try {
    const res = await fetch('https://api.replicate.com/v1/account', {
      headers: { Authorization: `Token ${key}` },
    })

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
    return {
      ...base,
      status: 'valid',
      models: [],
      account: {
        name: data.username,
        type: data.type,
      },
      rateLimit: null,
    }
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
