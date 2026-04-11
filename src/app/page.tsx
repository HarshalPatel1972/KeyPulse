'use client'
import { useState, useCallback, useEffect } from 'react'
import { Provider } from '@/lib/types'
import { verify } from '@/lib/verifiers'
import { VerifyResult } from '@/lib/types'
import KeyInput from '@/components/KeyInput'
import VerifyButton from '@/components/VerifyButton'
import TrustStrip from '@/components/TrustStrip'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import ResultCard from '@/components/ResultCard'
import StarRiver from '@/components/StarRiver'
import GitHubButton from '@/components/GitHubButton'

export default function Home() {
  const [key, setKey] = useState('')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)

  const handleVerify = useCallback(async () => {
    if (!key.trim() || !provider || isLoading) return
    setIsLoading(true)
    setIsInvalid(false)
    setResult(null)
    const r = await verify(key.trim(), provider.id)
    if (r.status === 'invalid') setIsInvalid(true)
    setResult(r)
    setIsLoading(false)
  }, [key, provider, isLoading])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleVerify()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleVerify])

  return (
    <main
      className="min-h-screen flex flex-col relative z-0"
      style={{ background: 'var(--bg-base)' }}
    >
      <StarRiver />
      {/* Top nav bar */}
      <nav
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          {/* Pulse icon — inline SVG */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <polyline
              points="1,10 5,10 7,4 9,16 11,7 13,13 15,10 19,10"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span
            className="text-sm font-heading"
            style={{ color: 'var(--text-primary)' }}
          >
            KeyPulse
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <GitHubButton />
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-[520px]">

          {/* Hero */}
          <div className="mb-10 text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-5"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--valid)' }}
              />
              11 providers supported
            </div>
            <h1
              className="text-5xl font-heading mb-4 tracking-tight"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
              KeyPulse
            </h1>
            <p className="text-xl font-light" style={{ color: 'var(--text-muted)' }}>
              Check if your key still has a pulse.
            </p>
          </div>

          {/* Input section */}
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

          <TrustStrip />

          {/* Results */}
          {(isLoading || result) && (
            <div className="mt-6">
              {isLoading && !result ? (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--border)' }}
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="shimmer h-12"
                      style={{
                        borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                      }}
                    />
                  ))}
                </div>
              ) : result ? (
                <ResultCard result={result} />
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-5 text-xs"
        style={{
          color: 'var(--text-hint)',
          borderTop: '1px solid var(--border)',
        }}
      >
        Built by{' '}
        <a
          href="https://github.com/HarshalPatel1972"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-muted)' }}
        >
          Harshal Patel
        </a>
        {' · '}
        <a
          href="https://github.com/HarshalPatel1972/keypulse-worker"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-muted)' }}
        >
          Proxy source
        </a>
      </footer>
    </main>
  )
}
