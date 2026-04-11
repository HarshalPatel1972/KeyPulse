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
        <div className="flex items-center gap-2.5 group">
          {/* Pulse icon — inline SVG with neon glow */}
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" className="animate-pulse-heartbeat transition-all duration-500 group-hover:scale-110">
            <polyline
              points="1,10 5,10 7,4 9,16 11,7 13,13 15,10 19,10"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_6px_var(--accent)]"
            />
          </svg>
          <span
            className="text-lg font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 tracking-tight"
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 lg:py-16">
        <div className="w-full max-w-[900px]">
          
          {/* Hero — centered above the grid */}
          <div className="mb-10 text-center">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/[0.03] border border-white/10 text-[10px] mb-6 transition-all duration-500 hover:border-white/20 group"
              style={{
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
              }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-2.5 h-2.5 rounded-full bg-valid/40 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-valid shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
              </div>
              <span className="font-sans font-medium uppercase mt-0.5">
                11 providers supported
              </span>
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

          {/* Two-column grid: Command Center + Trust Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 items-start">
            
            {/* Left column — Command Center */}
            <div>
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

            {/* Right column — Trust Sidebar */}
            <div className="lg:sticky lg:top-8">
              <TrustStrip />
            </div>

          </div>
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
