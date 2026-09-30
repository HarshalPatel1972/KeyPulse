'use client'

import { useMemo, useState } from 'react'
import { PROVIDERS_MAP } from '@/lib/providers'
import { Provider, VerifyResult, VerifyStatus } from '@/lib/types'
import ProviderMark from './ProviderMark'

interface Props {
  result: VerifyResult
  provider?: Provider
  onDelete?: () => void
}

const STATUS_COPY: Record<VerifyStatus, { title: string; note: string; bar: string; tone: string }> = {
  valid: {
    title: 'Alive',
    note: 'The provider answered. This key still has a pulse.',
    bar: 'bg-accent',
    tone: 'text-ink',
  },
  invalid: {
    title: 'Dead',
    note: 'The provider refused this key.',
    bar: 'bg-danger',
    tone: 'text-danger',
  },
  quota_exceeded: {
    title: 'Spent',
    note: 'The key is recognized, but its quota is used up.',
    bar: 'bg-warn',
    tone: 'text-warn',
  },
  rate_limited: {
    title: 'Held',
    note: 'The provider is throttling this key right now.',
    bar: 'bg-warn',
    tone: 'text-warn',
  },
  error: {
    title: 'Unclear',
    note: 'The check did not finish.',
    bar: 'bg-danger',
    tone: 'text-danger',
  },
}

function formatCheckedAt(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatRate(result: VerifyResult) {
  const rate = result.rateLimit
  if (!rate) return null
  const parts: string[] = []
  if (typeof rate.remaining === 'number' && !Number.isNaN(rate.remaining)) {
    parts.push(
      typeof rate.limit === 'number' && !Number.isNaN(rate.limit)
        ? `${rate.remaining} of ${rate.limit} left`
        : `${rate.remaining} left`,
    )
  }
  if (rate.resetAt) parts.push(`resets ${rate.resetAt}`)
  return parts.length ? parts.join(' · ') : null
}

export default function ResultCard({ result, provider: manualProvider, onDelete }: Props) {
  const [query, setQuery] = useState('')
  const provider = manualProvider || (result.provider ? PROVIDERS_MAP[result.provider] : null)
  const providerName = provider?.name || result.provider || 'Provider'
  const copy = STATUS_COPY[result.status]
  const rate = formatRate(result)

  const models = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return result.models
    return result.models.filter((model) => model.toLowerCase().includes(needle))
  }, [query, result.models])

  return (
    <div className="readout-in mx-auto grid max-w-[1440px] gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <div className="flex flex-wrap items-center gap-3">
          {provider && <ProviderMark domain={provider.domain} name={provider.name} size={22} />}
          <span className="font-sans text-[15px] tracking-tight">{providerName}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{result.status.replaceAll('_', ' ')}</span>
        </div>

        <span className={`mt-8 block h-[3px] w-14 ${copy.bar}`} />
        <h2 className={`mt-5 font-serif text-[clamp(4.6rem,9vw,8.4rem)] leading-[0.84] tracking-[-0.045em] ${copy.tone}`}>
          {copy.title}
        </h2>
        {result.rawError ? (
          <p className="mt-6 max-w-md border-l-2 border-danger pl-4 font-mono text-[13px] leading-relaxed text-ink">
            {result.rawError}
          </p>
        ) : (
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-muted">{copy.note}</p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-6">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="link-draw font-mono text-[11px] uppercase tracking-[0.18em] text-muted hover:text-ink"
            >
              Dismiss
            </button>
          )}
          {provider?.docsUrl && (
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw font-mono text-[11px] uppercase tracking-[0.18em] text-muted hover:text-ink"
            >
              Docs
            </a>
          )}
        </div>
      </div>

      <div className="lg:col-span-7">
        <dl className="grid border border-line sm:grid-cols-3">
          <div className="border-b border-line px-5 py-5 sm:border-r sm:border-b-0">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Subject</dt>
            <dd className="mt-3 font-sans text-[15px] leading-snug">
              {result.account?.name || result.account?.email || result.account?.type || 'Not returned'}
            </dd>
            {result.account?.email && result.account.name && (
              <dd className="mt-1 text-sm text-muted">{result.account.email}</dd>
            )}
            {result.account?.type && (
              <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{result.account.type}</dd>
            )}
          </div>
          <div className="border-b border-line px-5 py-5 sm:border-r sm:border-b-0">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Rate</dt>
            <dd className="mt-3 font-sans text-[15px] leading-snug">{rate || 'Not returned'}</dd>
          </div>
          <div className="px-5 py-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Checked</dt>
            <dd className="mt-3 font-sans text-[15px] leading-snug">{formatCheckedAt(result.checkedAt)}</dd>
          </div>
        </dl>

        <div className="mt-4 border border-line">
          <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Models
              <span className="ml-3 text-ink">{result.models.length}</span>
            </p>
            {result.models.length > 6 && (
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter"
                aria-label="Filter models"
                className="w-full bg-transparent font-mono text-[12px] text-ink outline-none placeholder:text-muted sm:w-40 sm:text-right"
              />
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto custom-scrollbar">
            {result.models.length === 0 && (
              <li className="px-5 py-8 font-mono text-[12px] text-muted">No model list came back.</li>
            )}
            {result.models.length > 0 && models.length === 0 && (
              <li className="px-5 py-8 font-mono text-[12px] text-muted">Nothing matches that filter.</li>
            )}
            {models.map((model, index) => (
              <li
                key={model}
                title={model}
                className="flex items-center gap-4 border-t border-line px-5 py-2.5 font-mono text-[12px] first:border-t-0"
              >
                <span className="w-8 shrink-0 text-muted">{String(index + 1).padStart(2, '0')}</span>
                <span className="truncate">{model}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
