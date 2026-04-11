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
      const errorData = await res.json().catch(() => ({}))
      
      if (res.status === 401 || res.status === 403) {
        return { ...base, status: 'invalid', models: [], account: null, rateLimit: null, rawError: 'Invalid API key.' }
      }
      if (res.status === 429) {
        return { ...base, status: 'rate_limited', models: [], account: null, rateLimit: null, rawError: 'Rate limit exceeded.' }
      }
      
      const rawError = errorData.error?.message || errorData.message || errorData.error || `HTTP ${res.status}`
      return {
        ...base,
        status: 'error',
        models: [],
        account: null,
        rateLimit: null,
        rawError: typeof rawError === 'string' ? rawError : JSON.stringify(rawError),
      }
    }

    const data = await res.json()
    
    // Generic model array extraction based on common AI Provider schemas
    let extractedModels: string[] = []
    if (Array.isArray(data)) {
      extractedModels = data.map((m: any) => m.id || m.name)
    } else if (data.data && Array.isArray(data.data)) {
      extractedModels = data.data.map((m: any) => m.id || m.name)
    } else if (data.models && Array.isArray(data.models)) {
      extractedModels = data.models.map((m: any) => typeof m === 'string' ? m : m.name || m.id)
    }
    extractedModels = extractedModels.filter(Boolean).map(String).sort()

    return {
      ...base,
      status: 'valid',
      models: extractedModels,
      account: null,
      rateLimit: null,
      rawError: null,
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
