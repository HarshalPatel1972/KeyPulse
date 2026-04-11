import { VerifyResult, ProviderId } from '../types'
import { PROVIDERS_MAP } from '../providers'

export async function proxyVerifier(key: string, providerId: ProviderId): Promise<VerifyResult> {
  const provider = PROVIDERS_MAP[providerId]
  const base = { provider: providerId, checkedAt: new Date().toISOString() }
  const workerUrl = process.env.NEXT_PUBLIC_CF_WORKER_URL

  if (!workerUrl) {
    return {
      ...base,
      status: 'error',
      models: [],
      account: null,
      rateLimit: null,
      rawError: 'Proxy URL missing (NEXT_PUBLIC_CF_WORKER_URL).',
    }
  }

  try {
    const res = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        endpoint: provider.verifyEndpoint,
        provider: providerId,
      }),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Proxy error' }))
      return {
        ...base,
        status: 'error',
        models: [],
        account: null,
        rateLimit: null,
        rawError: error.error || `HTTP ${res.status}`,
      }
    }

    const data = await res.json()
    return {
      ...base,
      status: data.status,
      models: data.models || [],
      account: data.account || null,
      rateLimit: data.rateLimit || null,
      rawError: data.rawError,
    }
  } catch (err) {
    return {
      ...base,
      status: 'error',
      models: [],
      account: null,
      rateLimit: null,
      rawError: 'Worker unreachable.',
    }
  }
}
