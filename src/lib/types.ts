export type ProviderId =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'groq'
  | 'mistral'
  | 'cohere'
  | 'huggingface'
  | 'perplexity'
  | 'together'
  | 'replicate'
  | 'elevenlabs'

export type Confidence = 'high' | 'medium' | 'unknown'

export type VerifyStatus = 'valid' | 'invalid' | 'quota_exceeded' | 'rate_limited' | 'error'

export interface Provider {
  id: ProviderId
  name: string
  prefixes: string[] // key prefixes that identify this provider
  color: string // accent hex for the badge
  docsUrl: string
  verifyEndpoint: string // the URL we call for verification
  requiresProxy: boolean // true → route through CF Worker
}

export interface DetectionResult {
  provider: Provider | null
  confidence: Confidence
}

export interface VerifyResult {
  status: VerifyStatus
  provider: ProviderId
  models: string[] // list of model IDs, may be empty
  account: {
    name?: string // org or username if API returned it
    type?: string // 'personal' | 'org' | etc.
  } | null
  rateLimit: {
    remaining?: number
    limit?: number
    resetAt?: string
  } | null
  rawError?: string // human-readable error message
  checkedAt: string // ISO timestamp
}
