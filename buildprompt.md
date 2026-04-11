# KeyPulse — full build prompt

> Read SKILL.md fully before writing a single line of code. Everything in SKILL.md is authoritative. This file gives you the phase-by-phase execution plan.

You are building **KeyPulse** — a client-side API key validator. Developers paste any API key, the app auto-detects the provider, verifies it live, and shows a results card. Zero logging. Zero storage. Keys never leave the browser.

Work phase by phase. Do not start the next phase until the current "done when" condition is met. After every logical unit of work, commit with the exact message listed. Do not batch commits.

---

## Phase 1 — Scaffold

**Done when:** `pnpm dev` runs at localhost:3000, blank dark page, zero console errors, TypeScript strict mode on, Tailwind working.

### Tasks

1. Bootstrap the project:
```bash
pnpm create next-app@latest keypulse \
  --typescript --tailwind --eslint \
  --app --src-dir --no-turbopack \
  --import-alias "@/*"
cd keypulse
pnpm add -D prettier eslint-config-prettier
pnpm add geist
```

2. Create `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

3. Update `.eslintrc.json`:
```json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

4. Update `tsconfig.json` — ensure `"strict": true` is set.

5. Update `tailwind.config.ts` with the KeyPulse design tokens:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0a',
        surface: '#111111',
        elevated: '#1a1a1a',
        border: 'rgba(255,255,255,0.08)',
        'border-hover': 'rgba(255,255,255,0.15)',
        primary: '#f0f0f0',
        muted: '#888888',
        hint: '#555555',
        valid: '#22c55e',
        invalid: '#ef4444',
        quota: '#f59e0b',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
}
export default config
```

6. Update `src/app/globals.css` — strip all defaults, keep only Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  background-color: #0a0a0a;
  color: #f0f0f0;
  -webkit-font-smoothing: antialiased;
}
```

7. Update `src/app/layout.tsx` with Geist font:
```typescript
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata = {
  title: 'KeyPulse — Check if your key still has a pulse',
  description: 'Paste any API key. We detect the provider, verify it live, and tell you everything — in seconds. Your key never leaves your browser.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

8. Create `.env.example`:
```
NEXT_PUBLIC_CF_WORKER_URL=https://your-worker.your-subdomain.workers.dev
```

9. Update `.gitignore` — add `.env`, `.env.local`, `.vercel/`.

10. Create `src/app/page.tsx` as a temporary placeholder:
```typescript
export default function Home() {
  return (
    <main className="min-h-screen bg-base flex items-center justify-center">
      <p className="text-muted font-mono text-sm">keypulse scaffold ok</p>
    </main>
  )
}
```

### Commits
```
chore: init Next.js 14 with TypeScript and Tailwind CSS
chore: configure path aliases and tsconfig strict mode
chore: add ESLint, Prettier, and .prettierrc
chore: scaffold src folder structure (app, lib, components, types)
chore: add .env.example and update .gitignore
feat: configure Tailwind with KeyPulse dark theme tokens
```

---

## Phase 2 — Detection engine

**Done when:** Calling `detectProvider('sk-ant-abc123')` in a test or browser console returns `{ provider: { id: 'anthropic', ... }, confidence: 'high' }`. No UI code exists yet.

### Tasks

1. Create `src/lib/types.ts` — copy the types exactly from SKILL.md.

2. Create `src/lib/providers.ts`:
```typescript
import { Provider } from './types'

export const PROVIDERS: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    prefixes: ['sk-proj-', 'sk-'],
    color: '#10a37f',
    docsUrl: 'https://platform.openai.com/docs',
    verifyEndpoint: 'https://api.openai.com/v1/models',
    requiresProxy: false,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    prefixes: ['sk-ant-'],
    color: '#d97757',
    docsUrl: 'https://docs.anthropic.com',
    verifyEndpoint: 'https://api.anthropic.com/v1/models',
    requiresProxy: false,
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    prefixes: ['AIza'],
    color: '#4285f4',
    docsUrl: 'https://ai.google.dev',
    verifyEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    requiresProxy: false,
  },
  {
    id: 'groq',
    name: 'Groq',
    prefixes: ['gsk_'],
    color: '#f55036',
    docsUrl: 'https://console.groq.com/docs',
    verifyEndpoint: 'https://api.groq.com/openai/v1/models',
    requiresProxy: false,
  },
  {
    id: 'huggingface',
    name: 'HuggingFace',
    prefixes: ['hf_'],
    color: '#ff9d00',
    docsUrl: 'https://huggingface.co/docs',
    verifyEndpoint: 'https://huggingface.co/api/whoami',
    requiresProxy: false,
  },
  {
    id: 'replicate',
    name: 'Replicate',
    prefixes: ['r8_'],
    color: '#ffffff',
    docsUrl: 'https://replicate.com/docs',
    verifyEndpoint: 'https://api.replicate.com/v1/account',
    requiresProxy: false,
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    prefixes: ['pplx-'],
    color: '#20b2aa',
    docsUrl: 'https://docs.perplexity.ai',
    verifyEndpoint: 'https://api.perplexity.ai/models',
    requiresProxy: true,
  },
  {
    id: 'mistral',
    name: 'Mistral',
    prefixes: [],
    color: '#ff7000',
    docsUrl: 'https://docs.mistral.ai',
    verifyEndpoint: 'https://api.mistral.ai/v1/models',
    requiresProxy: true,
  },
  {
    id: 'cohere',
    name: 'Cohere',
    prefixes: [],
    color: '#39594d',
    docsUrl: 'https://docs.cohere.com',
    verifyEndpoint: 'https://api.cohere.com/v1/models',
    requiresProxy: true,
  },
  {
    id: 'together',
    name: 'Together AI',
    prefixes: [],
    color: '#7c3aed',
    docsUrl: 'https://docs.together.ai',
    verifyEndpoint: 'https://api.together.xyz/v1/models',
    requiresProxy: true,
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    prefixes: [],
    color: '#9333ea',
    docsUrl: 'https://elevenlabs.io/docs',
    verifyEndpoint: 'https://api.elevenlabs.io/v1/user',
    requiresProxy: true,
  },
]

export const PROVIDERS_MAP = Object.fromEntries(PROVIDERS.map((p) => [p.id, p]))
```

3. Create `src/lib/detect.ts`:
```typescript
import { DetectionResult } from './types'
import { PROVIDERS } from './providers'

export function detectProvider(key: string): DetectionResult {
  const trimmed = key.trim()
  if (!trimmed) return { provider: null, confidence: 'unknown' }

  // Sort providers so longer prefixes are checked first
  // (prevents 'sk-' matching before 'sk-proj-' for openai)
  const sorted = [...PROVIDERS].sort((a, b) => {
    const aMax = Math.max(...a.prefixes.map((p) => p.length), 0)
    const bMax = Math.max(...b.prefixes.map((p) => p.length), 0)
    return bMax - aMax
  })

  for (const provider of sorted) {
    for (const prefix of provider.prefixes) {
      if (trimmed.startsWith(prefix)) {
        return { provider, confidence: 'high' }
      }
    }
  }

  // Medium confidence: key is long enough (32+ chars) but no prefix matched
  // Show manual select — don't guess
  return { provider: null, confidence: 'unknown' }
}
```

### Commits
```
feat: define Provider and DetectionResult types in types.ts
feat: add provider registry with prefix patterns for all 11 providers
feat: implement prefix-based detectProvider() with confidence scoring
feat: handle OpenAI sk- vs sk-proj- prefix ordering in detect.ts
```

---

## Phase 3 — UI shell

**Done when:** Pasting `sk-ant-` into the input shows the Anthropic badge fade in. Pasting unknown characters shows the manual dropdown. Verify button is present with disabled state. Nothing is wired to API calls yet.

### Tasks

1. Create `src/components/TrustBanner.tsx`:
```typescript
export default function TrustBanner() {
  return (
    <p className="text-center text-xs text-hint mt-3">
      Your key is verified directly from your browser. Nothing is stored or logged.
    </p>
  )
}
```

2. Create `src/components/ProviderBadge.tsx`:
```typescript
import { Provider } from '@/lib/types'

interface Props {
  provider: Provider
}

export default function ProviderBadge({ provider }: Props) {
  return (
    <div
      className="flex items-center gap-2 animate-in"
      style={{ '--provider-color': provider.color } as React.CSSProperties}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: provider.color }}
      />
      <span className="text-xs font-medium text-primary">{provider.name}</span>
      <span
        className="text-xs px-2 py-0.5 rounded-full border"
        style={{
          color: provider.color,
          borderColor: provider.color + '40',
          backgroundColor: provider.color + '12',
        }}
      >
        detected
      </span>
    </div>
  )
}
```

3. Create `src/components/ManualSelect.tsx`:
```typescript
import { PROVIDERS } from '@/lib/providers'
import { Provider } from '@/lib/types'

interface Props {
  value: Provider | null
  onChange: (provider: Provider) => void
}

export default function ManualSelect({ value, onChange }: Props) {
  return (
    <div className="mt-2">
      <p className="text-xs text-muted mb-1.5">Provider not detected — select manually:</p>
      <select
        className="w-full bg-elevated border border-border text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-border-hover"
        value={value?.id ?? ''}
        onChange={(e) => {
          const p = PROVIDERS.find((p) => p.id === e.target.value)
          if (p) onChange(p)
        }}
      >
        <option value="">Select a provider...</option>
        {PROVIDERS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}
```

4. Create `src/components/KeyInput.tsx`:
```typescript
'use client'
import { useState, useCallback } from 'react'
import { detectProvider } from '@/lib/detect'
import { Provider } from '@/lib/types'
import ProviderBadge from './ProviderBadge'
import ManualSelect from './ManualSelect'

interface Props {
  onProviderChange: (provider: Provider | null) => void
  onKeyChange: (key: string) => void
  isLoading: boolean
  isInvalid: boolean
}

export default function KeyInput({ onProviderChange, onKeyChange, isLoading, isInvalid }: Props) {
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [detection, setDetection] = useState<ReturnType<typeof detectProvider> | null>(null)
  const [manualProvider, setManualProvider] = useState<Provider | null>(null)

  const handleChange = useCallback(
    (value: string) => {
      setKey(value)
      onKeyChange(value)
      if (!value.trim()) {
        setDetection(null)
        setManualProvider(null)
        onProviderChange(null)
        return
      }
      const result = detectProvider(value)
      setDetection(result)
      if (result.confidence === 'high' && result.provider) {
        setManualProvider(null)
        onProviderChange(result.provider)
      } else {
        onProviderChange(manualProvider)
      }
    },
    [manualProvider, onKeyChange, onProviderChange]
  )

  const handleManualSelect = (provider: Provider) => {
    setManualProvider(provider)
    onProviderChange(provider)
  }

  const showManual = detection?.confidence === 'unknown' && key.trim().length > 8

  return (
    <div className="w-full">
      <div
        className={[
          'relative flex items-center border rounded-xl overflow-hidden transition-all duration-150',
          isInvalid
            ? 'border-invalid animate-pulse-invalid'
            : 'border-border focus-within:border-border-hover',
        ].join(' ')}
      >
        <input
          type={showKey ? 'text' : 'password'}
          value={key}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste your API key here..."
          disabled={isLoading}
          className="flex-1 bg-surface text-primary font-mono text-sm px-4 py-4 outline-none placeholder:text-hint disabled:opacity-50"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => setShowKey((v) => !v)}
          className="px-4 text-hint hover:text-muted transition-colors text-xs"
        >
          {showKey ? 'hide' : 'show'}
        </button>
      </div>

      <div className="mt-2 h-6 flex items-center">
        {detection?.confidence === 'high' && detection.provider && (
          <ProviderBadge provider={detection.provider} />
        )}
      </div>

      {showManual && (
        <ManualSelect value={manualProvider} onChange={handleManualSelect} />
      )}
    </div>
  )
}
```

5. Create `src/components/VerifyButton.tsx`:
```typescript
interface Props {
  onClick: () => void
  disabled: boolean
  isLoading: boolean
}

export default function VerifyButton({ onClick, disabled, isLoading }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full mt-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-150
        bg-primary text-base hover:bg-primary/90 active:scale-[0.99]
        disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-base/30 border-t-base rounded-full animate-spin" />
          Checking...
        </span>
      ) : (
        'Check pulse'
      )}
    </button>
  )
}
```

6. Add `animate-pulse-invalid` keyframe to `globals.css`:
```css
@keyframes pulse-invalid {
  0%, 100% { box-shadow: 0 0 0 0px rgba(239, 68, 68, 0); }
  50% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25); }
}

.animate-pulse-invalid {
  animation: pulse-invalid 0.6s ease-out 1;
}
```

7. Update `src/app/page.tsx` with full layout:
```typescript
'use client'
import { useState, useCallback } from 'react'
import { Provider } from '@/lib/types'
import KeyInput from '@/components/KeyInput'
import VerifyButton from '@/components/VerifyButton'
import TrustBanner from '@/components/TrustBanner'

export default function Home() {
  const [key, setKey] = useState('')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)

  const handleVerify = useCallback(async () => {
    if (!key.trim() || !provider) return
    setIsLoading(true)
    setIsInvalid(false)
    // Phase 5 wires this up — placeholder for now
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
  }, [key, provider])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleVerify()
    },
    [handleVerify]
  )

  // Attach Enter keydown globally
  if (typeof window !== 'undefined') {
    window.onkeydown = handleKeyDown
  }

  return (
    <main className="min-h-screen bg-base flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[560px]">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-medium text-primary mb-2 tracking-tight">KeyPulse</h1>
          <p className="text-muted text-base">Check if your key still has a pulse.</p>
        </div>

        <KeyInput
          onProviderChange={setProvider}
          onKeyChange={setKey}
          isLoading={isLoading}
          isInvalid={isInvalid}
        />

        <VerifyButton
          onClick={handleVerify}
          disabled={!key.trim() || !provider}
          isLoading={isLoading}
        />

        <TrustBanner />
      </div>
    </main>
  )
}
```

### Commits
```
feat: add root layout with dark theme and Geist font config
feat: build KeyInput with mask toggle and onChange detection hook
feat: add ProviderBadge with fade-in on detection
feat: add ManualSelect fallback for unrecognised key formats
feat: add TrustBanner and VerifyButton with disabled/loading states
style: add pulse-invalid keyframe animation for bad key state
feat: wire page.tsx with full hero layout and Enter key handler
```

---

## Phase 4 — Verifiers (direct providers)

**Done when:** Pasting a real OpenAI or Anthropic key and clicking "Check pulse" logs a complete `VerifyResult` object to the console. No ResultCard yet.

### Tasks

1. Create `src/lib/verifiers/index.ts`:
```typescript
import { VerifyResult, ProviderId } from '../types'
import { verifyOpenAI } from './openai'
import { verifyAnthropic } from './anthropic'
import { verifyGemini } from './gemini'
import { verifyGroq } from './groq'
import { verifyHuggingFace } from './huggingface'
import { verifyReplicate } from './replicate'

const DIRECT_VERIFIERS: Partial<Record<ProviderId, (key: string) => Promise<VerifyResult>>> = {
  openai: verifyOpenAI,
  anthropic: verifyAnthropic,
  gemini: verifyGemini,
  groq: verifyGroq,
  huggingface: verifyHuggingFace,
  replicate: verifyReplicate,
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
```

2. Create `src/lib/verifiers/openai.ts`:
```typescript
import { VerifyResult } from '../types'

export async function verifyOpenAI(key: string): Promise<VerifyResult> {
  const base: Pick<VerifyResult, 'provider' | 'checkedAt'> = {
    provider: 'openai',
    checkedAt: new Date().toISOString(),
  }

  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    })

    if (res.status === 401 || res.status === 403) {
      return { ...base, status: 'invalid', models: [], account: null, rateLimit: null, rawError: 'Invalid API key.' }
    }
    if (res.status === 429) {
      return { ...base, status: 'rate_limited', models: [], account: null, rateLimit: null, rawError: 'Rate limited.' }
    }
    if (!res.ok) {
      return { ...base, status: 'error', models: [], account: null, rateLimit: null, rawError: `HTTP ${res.status}` }
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
    return { ...base, status: 'error', models: [], account: null, rateLimit: null, rawError: 'Network error.' }
  }
}
```

3. Create `src/lib/verifiers/anthropic.ts`:
```typescript
import { VerifyResult } from '../types'

export async function verifyAnthropic(key: string): Promise<VerifyResult> {
  const base = { provider: 'anthropic' as const, checkedAt: new Date().toISOString() }

  try {
    const res = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    })

    if (res.status === 401 || res.status === 403) {
      return { ...base, status: 'invalid', models: [], account: null, rateLimit: null, rawError: 'Invalid API key.' }
    }
    if (res.status === 429) {
      return { ...base, status: 'rate_limited', models: [], account: null, rateLimit: null, rawError: 'Rate limited.' }
    }
    if (!res.ok) {
      return { ...base, status: 'error', models: [], account: null, rateLimit: null, rawError: `HTTP ${res.status}` }
    }

    const data = await res.json()
    const models: string[] = (data.data ?? []).map((m: { id: string }) => m.id).sort()

    return { ...base, status: 'valid', models, account: null, rateLimit: null }
  } catch {
    return { ...base, status: 'error', models: [], account: null, rateLimit: null, rawError: 'Network error.' }
  }
}
```

4. Create `src/lib/verifiers/gemini.ts`:
```typescript
import { VerifyResult } from '../types'

export async function verifyGemini(key: string): Promise<VerifyResult> {
  const base = { provider: 'gemini' as const, checkedAt: new Date().toISOString() }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`
    )

    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return { ...base, status: 'invalid', models: [], account: null, rateLimit: null, rawError: 'Invalid API key.' }
    }
    if (res.status === 429) {
      return { ...base, status: 'rate_limited', models: [], account: null, rateLimit: null, rawError: 'Rate limited.' }
    }
    if (!res.ok) {
      return { ...base, status: 'error', models: [], account: null, rateLimit: null, rawError: `HTTP ${res.status}` }
    }

    const data = await res.json()
    const models: string[] = (data.models ?? [])
      .map((m: { name: string }) => m.name.replace('models/', ''))
      .sort()

    return { ...base, status: 'valid', models, account: null, rateLimit: null }
  } catch {
    return { ...base, status: 'error', models: [], account: null, rateLimit: null, rawError: 'Network error.' }
  }
}
```

5. Create `src/lib/verifiers/groq.ts` — same pattern as openai.ts, URL: `https://api.groq.com/openai/v1/models`, auth: `Bearer {key}`.

6. Create `src/lib/verifiers/huggingface.ts`:
- URL: `https://huggingface.co/api/whoami`
- Auth: `Bearer {key}`
- On success: `account.name = data.name`, `account.type = data.type`
- models = [] (HF doesn't return a flat model list here)

7. Create `src/lib/verifiers/replicate.ts`:
- URL: `https://api.replicate.com/v1/account`
- Auth: `Bearer {key}`
- On success: `account.name = data.username`, `account.type = data.type`
- models = []

8. In `page.tsx`, replace the placeholder `handleVerify` with a real call:
```typescript
import { verify } from '@/lib/verifiers'
import { VerifyResult } from '@/lib/types'

// inside component:
const [result, setResult] = useState<VerifyResult | null>(null)

const handleVerify = async () => {
  if (!key.trim() || !provider) return
  setIsLoading(true)
  setIsInvalid(false)
  setResult(null)
  const r = await verify(key.trim(), provider.id)
  if (r.status === 'invalid') setIsInvalid(true)
  setResult(r)
  setIsLoading(false)
}
```

### Commits
```
feat: define VerifyResult type and verifier dispatcher in index.ts
feat: implement OpenAI verifier via GET /v1/models
feat: implement Anthropic verifier with browser-direct header
feat: implement Gemini verifier via generativelanguage REST API
feat: implement Groq verifier via OpenAI-compatible /models endpoint
feat: implement HuggingFace verifier via /api/whoami
feat: implement Replicate verifier via /v1/account
refactor: normalise all error codes to human-readable status strings
```

---

## Phase 5 — Results card

**Done when:** Verifying a real OpenAI key shows the animated ResultCard with status badge, model pills, and copy-as-JSON button.

### Tasks

1. Create `src/components/StatusBadge.tsx`:
```typescript
import { VerifyStatus } from '@/lib/types'

const STATUS_CONFIG: Record<VerifyStatus, { label: string; color: string; bg: string }> = {
  valid: { label: 'Valid', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  invalid: { label: 'Invalid', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  quota_exceeded: { label: 'Quota exceeded', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  rate_limited: { label: 'Rate limited', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  error: { label: 'Error', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
}

export default function StatusBadge({ status }: { status: VerifyStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  )
}
```

2. Create `src/components/ModelsList.tsx`:
```typescript
import { useState } from 'react'

const MAX_SHOWN = 8

export default function ModelsList({ models }: { models: string[] }) {
  const [showAll, setShowAll] = useState(false)
  const shown = showAll ? models : models.slice(0, MAX_SHOWN)
  const overflow = models.length - MAX_SHOWN

  if (!models.length) return <p className="text-hint text-xs">No model list returned by this provider.</p>

  return (
    <div>
      <p className="text-xs text-muted mb-2">{models.length} models available</p>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((m) => (
          <span
            key={m}
            className="font-mono text-xs px-2 py-1 rounded-md bg-elevated border border-border text-muted"
          >
            {m}
          </span>
        ))}
        {!showAll && overflow > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="font-mono text-xs px-2 py-1 rounded-md border border-border text-hint hover:text-muted transition-colors"
          >
            +{overflow} more
          </button>
        )}
      </div>
    </div>
  )
}
```

3. Create `src/components/CopyButton.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { VerifyResult } from '@/lib/types'

export default function CopyButton({ result }: { result: VerifyResult }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-hint hover:text-muted transition-colors px-3 py-1.5 border border-border rounded-lg"
    >
      {copied ? 'Copied' : 'Copy as JSON'}
    </button>
  )
}
```

4. Create `src/components/ResultCard.tsx`:
```typescript
'use client'
import { VerifyResult } from '@/lib/types'
import { PROVIDERS_MAP } from '@/lib/providers'
import StatusBadge from './StatusBadge'
import ModelsList from './ModelsList'
import CopyButton from './CopyButton'

export default function ResultCard({ result }: { result: VerifyResult }) {
  const provider = PROVIDERS_MAP[result.provider]

  return (
    <div className="mt-6 border border-border rounded-2xl bg-surface overflow-hidden animate-slide-up">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: provider?.color }} />
          <span className="text-sm font-medium text-primary">{provider?.name}</span>
          <StatusBadge status={result.status} />
        </div>
        <CopyButton result={result} />
      </div>

      {result.account && (
        <div className="px-5 py-3 border-b border-border flex items-center gap-6">
          {result.account.name && (
            <div>
              <p className="text-xs text-hint mb-0.5">Account</p>
              <p className="text-sm text-primary font-mono">{result.account.name}</p>
            </div>
          )}
          {result.account.type && (
            <div>
              <p className="text-xs text-hint mb-0.5">Type</p>
              <p className="text-sm text-primary">{result.account.type}</p>
            </div>
          )}
        </div>
      )}

      {result.rateLimit && (
        <div className="px-5 py-3 border-b border-border flex items-center gap-6">
          {result.rateLimit.remaining !== undefined && (
            <div>
              <p className="text-xs text-hint mb-0.5">Requests remaining</p>
              <p className="text-sm text-primary font-mono">{result.rateLimit.remaining.toLocaleString()}</p>
            </div>
          )}
          {result.rateLimit.limit !== undefined && (
            <div>
              <p className="text-xs text-hint mb-0.5">Limit</p>
              <p className="text-sm text-primary font-mono">{result.rateLimit.limit.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {result.rawError && result.status !== 'valid' && (
        <div className="px-5 py-3 border-b border-border">
          <p className="text-xs text-invalid">{result.rawError}</p>
        </div>
      )}

      {result.models.length > 0 && (
        <div className="px-5 py-4">
          <ModelsList models={result.models} />
        </div>
      )}

      <div className="px-5 py-2.5 bg-elevated/50">
        <p className="text-xs text-hint">
          Checked at {new Date(result.checkedAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}
```

5. Add `animate-slide-up` to `globals.css`:
```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.2s ease-out forwards;
}
```

6. Add `<ResultCard result={result} />` to `page.tsx` below VerifyButton, only when `result !== null`.

### Commits
```
feat: build ResultCard shell with slide-up mount animation
feat: add StatusBadge with valid/invalid/quota/rate-limited states
feat: add ModelsList with pill overflow and +N more truncation
feat: add AccountInfo and RateLimitInfo sections in ResultCard
feat: add CopyButton with 2s copied confirmation state
style: add red pulse animation on KeyInput for invalid key state
feat: wire Verify button to verifier and render ResultCard on response
```

---

## Phase 6 — Cloudflare Worker proxy

**Done when:** Mistral, Cohere, Perplexity, ElevenLabs, and Together verifiers return real results through the deployed Worker.

> The Worker is a separate repository. See `buildprompt_worker.md` for its full spec. Complete that repo and deploy it first. Then come back here.

### Tasks (main repo — after Worker is deployed)

1. Add to `.env.local`:
```
NEXT_PUBLIC_CF_WORKER_URL=https://your-deployed-worker.workers.dev
```

2. Create a proxy helper `src/lib/verifiers/proxy.ts`:
```typescript
export async function proxyFetch(
  url: string,
  headers: Record<string, string>
): Promise<Response> {
  const workerUrl = process.env.NEXT_PUBLIC_CF_WORKER_URL
  if (!workerUrl) throw new Error('NEXT_PUBLIC_CF_WORKER_URL is not set')

  return fetch(`${workerUrl}/proxy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, method: 'GET', headers }),
  })
}
```

3. Create verifiers for all 5 proxy-based providers using `proxyFetch`. Each follows the same pattern as the direct verifiers but calls `proxyFetch` instead of `fetch` directly:

- `mistral.ts` → `https://api.mistral.ai/v1/models`, `Bearer {key}`
- `cohere.ts` → `https://api.cohere.com/v1/models`, `Bearer {key}`
- `perplexity.ts` → `https://api.perplexity.ai/models`, `Bearer {key}`
- `together.ts` → `https://api.together.xyz/v1/models`, `Bearer {key}`
- `elevenlabs.ts` → `https://api.elevenlabs.io/v1/user`, `xi-api-key: {key}`

4. Register all 5 in `src/lib/verifiers/index.ts`.

### Commits
```
feat: add proxyFetch helper for CF Worker-based verifiers
feat: implement Mistral verifier via CF Worker proxy
feat: implement Cohere verifier via CF Worker proxy
feat: implement Perplexity verifier via CF Worker proxy
feat: implement ElevenLabs verifier via CF Worker proxy
feat: implement Together AI verifier via CF Worker proxy
chore: add NEXT_PUBLIC_CF_WORKER_URL to .env.example and Vercel env docs
```

---

## Phase 7 — Polish

**Done when:** You would be comfortable tweeting the link. Every interaction has feedback. Works on mobile.

### Tasks

1. Add loading skeleton for ResultCard (show while `isLoading === true`):
   - 3 shimmer rows using the `@keyframes shimmer` sweep animation
   - Same dimensions as a typical result card
   - No third-party library

2. Add OG image and meta tags to `layout.tsx`:
```typescript
export const metadata = {
  title: 'KeyPulse — Check if your key still has a pulse',
  description: 'Paste any API key. Auto-detect the provider, verify live, see models and quota. Your key never leaves your browser.',
  openGraph: {
    title: 'KeyPulse',
    description: 'Check if your API key still has a pulse.',
    url: 'https://keypulse.vercel.app',
    siteName: 'KeyPulse',
  },
}
```

3. Create `public/favicon.svg` — a simple ECG/pulse line SVG, 16x16 safe, dark-mode aware.

4. Create `src/app/not-found.tsx` — minimal, links back to `/`.

5. Mobile audit:
   - Input and button full width on all screens
   - ResultCard readable at 375px
   - Model pills wrap correctly
   - No horizontal scroll

6. Enter keydown: refactor the global handler in page.tsx to use `useEffect` + `addEventListener` (the current `window.onkeydown` approach in phase 3 is a placeholder).

### Commits
```
feat: add Enter keydown handler via useEffect in page.tsx
style: add shimmer loading skeleton for ResultCard
feat: add OG image meta tags and page metadata
feat: add SVG favicon with pulse line icon
feat: add minimal 404 page
style: fix mobile layout for input, button, and ResultCard at 375px
```

---

## Phase 8 — Ship

**Done when:** `keypulse.vercel.app` is live, Worker is deployed, both repos are public.

### Tasks

1. Update `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
}
export default nextConfig
```

2. Push to GitHub (public repo: `keypulse`).

3. Import to Vercel:
   - Go to vercel.com/new → import `keypulse`
   - Add env var: `NEXT_PUBLIC_CF_WORKER_URL` = your deployed worker URL
   - Deploy

4. Write `README.md`:
   - What it does (2 sentences)
   - How it works (trust model, CF Worker architecture)
   - Supported providers table
   - How to self-host the Worker
   - Link to keypulse-worker repo

### Commits
```
chore: configure next.config.ts for static export
docs: write README with architecture, trust model, and self-host guide
chore: add vercel.json with build configuration
```
