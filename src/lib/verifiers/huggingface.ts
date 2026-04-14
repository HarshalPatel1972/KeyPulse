import { VerifyResult } from '../types'

export async function verifyHuggingFace(key: string): Promise<VerifyResult> {
  const base = { provider: 'huggingface' as const, checkedAt: new Date().toISOString() }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const res = await fetch('https://huggingface.co/api/whoami-v2', {
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
      models: [], // whoami doesn't return models
      account: {
        name: data.name || data.fullname,
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
