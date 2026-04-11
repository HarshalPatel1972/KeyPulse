---
name: keypulse
description: Build KeyPulse — a client-side API key validator with auto-detection across 11 providers. Use this skill for all tasks related to the keypulse or keypulse-worker repositories.
---

# KeyPulse skill

KeyPulse is a production Next.js 14 web app that lets developers paste any API key, auto-detects the provider by prefix, verifies it live, and returns a results card showing validity, available models, account info, and rate limit status. Zero server logging. Keys never leave the browser tab. A separate Cloudflare Worker (keypulse-worker) acts as a transparent CORS proxy for the 5 providers that block browser-direct calls.

---

## Core principles

- **Client-side only.** No backend of our own. No database. No analytics that capture keys. No localStorage. React state only.
- **Atomic commits.** Every commit is one logical unit. conventional commit format: `type(scope): message`. Types used: feat, chore, style, docs, refactor, fix. Never commit multiple concerns in one message.
- **Phase-gated.** Work in phases. Do not start phase N+1 until phase N passes its "done when" condition.
- **No AI slop UI.** Dark, focused, confident aesthetic. No gradients on text. No neon glow. No card soup. Think Vercel dashboard meets terminal.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14, App Router, TypeScript strict |
| Styling | Tailwind CSS |
| Package manager | pnpm |
| Linting | ESLint + Prettier |
| Deployment | Vercel free tier (static export) |
| CORS proxy | Cloudflare Worker (Hono, free tier) |
| Fonts | Geist Mono for the key input; Geist Sans for UI |

---

## Design system

**Palette (dark base):**
```
--bg-base:      #0a0a0a
--bg-surface:   #111111
--bg-elevated:  #1a1a1a
--border:       rgba(255,255,255,0.08)
--border-hover: rgba(255,255,255,0.15)
--text-primary: #f0f0f0
--text-muted:   #888888
--text-hint:    #555555

--valid:   #22c55e   (green-500)
--invalid: #ef4444   (red-500)
--quota:   #f59e0b   (amber-500)
--unknown: #6b7280   (gray-500)
```

**Provider accent colors (used on detection badge only):**
```
openai:      #10a37f
anthropic:   #d97757
gemini:      #4285f4
groq:        #f55036
mistral:     #ff7000
cohere:      #39594d
huggingface: #ff9d00
perplexity:  #20b2aa
together:    #7c3aed
replicate:   #000000  (white text)
elevenlabs:  #9333ea
```

**Typography rules:**
- Key input field: `font-family: 'Geist Mono', monospace` — makes keys look intentional
- All other UI: Geist Sans
- Font sizes: 13px body, 15px emphasis, 11px labels/badges
- Font weights: 400 regular, 500 medium only — never 600/700

**Motion rules:**
- ProviderBadge: `opacity 0→1, translateY 4px→0`, duration 150ms ease-out
- ResultCard: `opacity 0→1, translateY 8px→0`, duration 200ms ease-out
- ResultCard rows: stagger 40ms per row using animation-delay
- Invalid pulse: `box-shadow` keyframe red → transparent, 600ms, once only
- Skeleton shimmer: `background-position` sweep, 1.5s infinite — no third-party library

**Layout:**
- Single centered column, max-width 560px
- Hero section: headline + slogan above input
- Input section: key field + provider badge + trust banner + verify button
- Results section: ResultCard slides up below button
- No sidebar, no nav, no footer noise

---

## Folder structure (keypulse)

```
keypulse/
├── src/
│   ├── app/
│   │   ├── layout.tsx          root layout, dark bg, font config
│   │   ├── page.tsx            hero + KeyInput + ResultCard
│   │   └── not-found.tsx       minimal 404
│   ├── components/
│   │   ├── KeyInput.tsx        input + mask toggle + detection hook
│   │   ├── ProviderBadge.tsx   logo dot + provider name + confidence pill
│   │   ├── ManualSelect.tsx    dropdown fallback for unknown keys
│   │   ├── TrustBanner.tsx     single-line trust copy below input
│   │   ├── VerifyButton.tsx    loading/disabled/active states
│   │   ├── ResultCard.tsx      main results container
│   │   ├── StatusBadge.tsx     valid / invalid / quota / rate-limited
│   │   ├── ModelsList.tsx      pill list, truncated at 8 + "+N more"
│   │   ├── AccountInfo.tsx     org/username — renders only if data exists
│   │   ├── RateLimitInfo.tsx   quota info — renders only if headers returned it
│   │   └── CopyButton.tsx      copy JSON, 2s "Copied" state
│   ├── lib/
│   │   ├── types.ts            Provider, DetectionResult, VerifyResult
│   │   ├── providers.ts        registry of all 11 providers
│   │   ├── detect.ts           detectProvider(key): DetectionResult
│   │   └── verifiers/
│   │       ├── index.ts        verify(key, providerId): Promise<VerifyResult>
│   │       ├── openai.ts
│   │       ├── anthropic.ts
│   │       ├── gemini.ts
│   │       ├── groq.ts
│   │       ├── huggingface.ts
│   │       ├── replicate.ts
│   │       ├── mistral.ts      (uses CF Worker)
│   │       ├── cohere.ts       (uses CF Worker)
│   │       ├── perplexity.ts   (uses CF Worker)
│   │       ├── elevenlabs.ts   (uses CF Worker)
│   │       └── together.ts     (uses CF Worker)
│   └── types/
│       └── index.ts            re-exports from lib/types.ts
├── public/
│   └── favicon.svg             pulse/heartbeat icon SVG
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Core types (write these exactly)

```typescript
// src/lib/types.ts

export type ProviderId =
  | 'openai' | 'anthropic' | 'gemini' | 'groq'
  | 'mistral' | 'cohere' | 'huggingface' | 'perplexity'
  | 'together' | 'replicate' | 'elevenlabs';

export type Confidence = 'high' | 'medium' | 'unknown';

export type VerifyStatus =
  | 'valid' | 'invalid' | 'quota_exceeded'
  | 'rate_limited' | 'error';

export interface Provider {
  id: ProviderId;
  name: string;
  prefixes: string[];          // key prefixes that identify this provider
  color: string;               // accent hex for the badge
  docsUrl: string;
  verifyEndpoint: string;      // the URL we call for verification
  requiresProxy: boolean;      // true → route through CF Worker
}

export interface DetectionResult {
  provider: Provider | null;
  confidence: Confidence;
}

export interface VerifyResult {
  status: VerifyStatus;
  provider: ProviderId;
  models: string[];            // list of model IDs, may be empty
  account: {
    name?: string;             // org or username if API returned it
    type?: string;             // 'personal' | 'org' | etc.
  } | null;
  rateLimit: {
    remaining?: number;
    limit?: number;
    resetAt?: string;
  } | null;
  rawError?: string;           // human-readable error message
  checkedAt: string;           // ISO timestamp
}
```

---

## Provider registry (write these exactly)

```typescript
// src/lib/providers.ts — key prefix facts

openai:      prefixes: ['sk-proj-', 'sk-']          requiresProxy: false
anthropic:   prefixes: ['sk-ant-']                  requiresProxy: false
gemini:      prefixes: ['AIza']                     requiresProxy: false
groq:        prefixes: ['gsk_']                     requiresProxy: false
huggingface: prefixes: ['hf_']                      requiresProxy: false
replicate:   prefixes: ['r8_']                      requiresProxy: false
mistral:     prefixes: []  // no stable prefix       requiresProxy: true
cohere:      prefixes: []                           requiresProxy: true
perplexity:  prefixes: ['pplx-']                    requiresProxy: true
together:    prefixes: []                           requiresProxy: true
elevenlabs:  prefixes: []                           requiresProxy: true
```

Detection order for prefix matching: check longer prefixes first (`sk-proj-` before `sk-`).
For providers with no prefix: if no match found, set confidence = 'unknown' and show ManualSelect.

---

## Verification endpoints (one call per provider, lightest possible)

| Provider | Method | URL | Notes |
|---|---|---|---|
| OpenAI | GET | `https://api.openai.com/v1/models` | Auth: `Bearer {key}` |
| Anthropic | GET | `https://api.anthropic.com/v1/models` | Headers: `x-api-key: {key}`, `anthropic-version: 2023-06-01`, `anthropic-dangerous-direct-browser-access: true` |
| Gemini | GET | `https://generativelanguage.googleapis.com/v1beta/models?key={key}` | Key in query param |
| Groq | GET | `https://api.groq.com/openai/v1/models` | Auth: `Bearer {key}` |
| HuggingFace | GET | `https://huggingface.co/api/whoami` | Auth: `Bearer {key}` |
| Replicate | GET | `https://api.replicate.com/v1/account` | Auth: `Bearer {key}` |
| Mistral | GET | `https://api.mistral.ai/v1/models` | Auth: `Bearer {key}` → via proxy |
| Cohere | GET | `https://api.cohere.com/v1/models` | Auth: `Bearer {key}` → via proxy |
| Perplexity | GET | `https://api.perplexity.ai/models` | Auth: `Bearer {key}` → via proxy |
| ElevenLabs | GET | `https://api.elevenlabs.io/v1/user` | Auth: `xi-api-key: {key}` → via proxy |
| Together | GET | `https://api.together.xyz/v1/models` | Auth: `Bearer {key}` → via proxy |

**HTTP status → VerifyStatus mapping (universal):**
- 200 → `valid`
- 401, 403 → `invalid`
- 429 → `rate_limited`
- 402, and 200 with quota fields at 0 → `quota_exceeded`
- Network error, 5xx → `error`

---

## Cloudflare Worker proxy contract

The Worker lives at `process.env.NEXT_PUBLIC_CF_WORKER_URL`.

Main app calls it like this:
```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_CF_WORKER_URL}/proxy`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: targetUrl,
    method: 'GET',
    headers: { Authorization: `Bearer ${key}` }
  })
});
```

Worker returns the upstream response verbatim (status, headers, body).

---

## Commit conventions

Use exactly this format. No deviations:
```
type(scope): short imperative message
```
Allowed types: `feat` `fix` `chore` `style` `docs` `refactor`
Scope is optional but use it when it clarifies (e.g. `feat(verifier): ...`, `style(results): ...`)
Message: lowercase, imperative, no period at end, max 72 chars.

**Never:**
- Group multiple changes into one commit
- Write messages like "wip", "updates", "fix stuff", "various changes"
- Commit generated files like `.next/` or `node_modules/`

---

## .gitignore must include

```
.next/
node_modules/
.env
.env.local
dist/
.vercel/
```

`.env.example` is committed. `.env` and `.env.local` are never committed.

---

## Quality gates (check before each phase commit)

- `pnpm lint` — zero errors
- `pnpm build` — zero TypeScript errors, clean build
- No `any` types unless explicitly commented with reason
- No hardcoded API keys anywhere in source
- No `console.log` in committed code (use `console.error` for caught errors only)
