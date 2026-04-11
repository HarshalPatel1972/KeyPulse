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
    const isElevenLabs = providerId === 'elevenlabs'
    const headers: Record<string, string> = isElevenLabs
      ? { 'xi-api-key': key }
      : { Authorization: `Bearer ${key}` }

    const res = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: provider.verifyEndpoint,
        method: 'GET',
        headers,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Proxy error' }))
      return {
        ...base,
        status: 'error',
        models: [],
        account: null,
        rateLimit: null,
        rawError: errorData.error || `HTTP ${res.status}`,
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
