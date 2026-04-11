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
  const [history, setHistory] = useState<VerifyResult[]>([])
  const [hasChecked, setHasChecked] = useState(false)

  const handleVerify = useCallback(async () => {
    if (!key.trim() || !provider || isLoading) return
    setIsLoading(true)
    setIsInvalid(false)
    
    const r = await verify(key.trim(), provider.id)
    if (r.status === 'invalid') setIsInvalid(true)
    
    // Add new result to the top of the history
    setHistory(prev => [r, ...prev])
    setIsLoading(false)
    setHasChecked(true)
  }, [key, provider, isLoading])

  const handleReset = useCallback(() => {
    setKey('')
    setProvider(null)
    setIsInvalid(false)
    setHistory([])
    setHasChecked(false)
  }, [])

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

      {/* Grid Layout: [ Main Content | Sidebar ] */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_420px] items-stretch overflow-hidden">
        
        {/* Left column — Command Center (Mainly for interaction) */}
        <div className="flex flex-col items-center justify-center px-4 py-16 scrollbar-hide overflow-y-auto">
          <div className="w-full max-w-[520px]">
            {/* Hero */}
            <div className="mb-10 text-center animate-fade-in">
              <div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/[0.03] border border-white/10 text-[10px] mb-6 transition-all duration-500 hover:border-white/20 group"
                style={{ letterSpacing: '0.12em', color: 'var(--text-muted)' }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-valid/40 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-valid shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                </div>
                <span className="font-sans font-medium uppercase mt-0.5">11 providers supported</span>
              </div>
              <h1 className="text-5xl font-heading mb-4 tracking-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                KeyPulse
              </h1>
              <p className="text-xl font-light" style={{ color: 'var(--text-muted)' }}>
                Check if your key still has a pulse.
              </p>
            </div>

            {/* Input steps */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <KeyInput
                value={key}
                onProviderChange={setProvider}
                onKeyChange={(val) => {
                  setKey(val)
                  if (!val) {
                    setIsInvalid(false)
                    setHasChecked(false)
                  }
                }}
                isLoading={isLoading}
                isInvalid={isInvalid}
              />
              <div className="mt-8 relative group">
                 {/* Single Chassis Control Frame */}
                 <div className="relative flex items-stretch rounded-2xl overflow-hidden backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] transition-all duration-500 shadow-2xl">
                    <div 
                      className="transition-all duration-500 ease-out flex-shrink-0"
                      style={{ width: hasChecked ? '65%' : '100%' }}
                    >
                      <VerifyButton
                        onClick={handleVerify}
                        disabled={!key.trim() || !provider}
                        isLoading={isLoading}
                      />
                    </div>

                    {hasChecked && <div className="w-[1px] bg-white/[0.08] self-stretch" />}
                    
                    <div 
                      className={`transition-all duration-700 ease-out overflow-hidden flex-1`}
                      style={{ 
                        maxWidth: hasChecked ? '100%' : '0',
                        opacity: hasChecked ? 1 : 0,
                      }}
                    >
                      <button
                        onClick={handleReset}
                        className="group/reset w-full h-full font-bold text-[10px] uppercase tracking-[0.22em] transition-all duration-300 hover:bg-white/[0.05] active:scale-95 flex items-center justify-center gap-2 px-6"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--accent)';
                          e.currentTarget.style.textShadow = '0 0 10px var(--accent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.textShadow = 'none';
                        }}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="opacity-40 transition-colors duration-300"
                        >
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                        </svg>
                        Reset
                      </button>
                    </div>
                 </div>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <TrustStrip />
            </div>
          </div>
        </div>

        {/* Right column — Results Sidebar */}
        <div 
          className="hidden xl:flex flex-col border-l border-white/[0.08] bg-transparent overflow-hidden"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">Verification Feed</h2>
            <span className="text-[10px] font-mono opacity-30">{history.length} active</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {isLoading && (
              <div className="animate-pulse space-y-4 p-6 rounded-2xl border border-border/50 bg-white/[0.02]">
                <div className="h-4 w-1/3 bg-white/10 rounded-full" />
                <div className="h-12 w-full bg-white/5 rounded-xl" />
                <div className="h-8 w-full bg-white/5 rounded-xl" />
              </div>
            )}
            
            {history.length === 0 && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 pointer-events-none px-12">
                <div className="w-12 h-12 rounded-2xl border border-dashed border-white/20 mb-4 flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <p className="text-xs uppercase tracking-[0.15em] font-medium leading-relaxed">
                  Results will populate here in real-time
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {history.map((res, idx) => (
                  <div key={res.checkedAt + idx} className="animate-slide-up">
                    <ResultCard result={res} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Results — show below on smaller screens */}
      {!isLoading && history.length > 0 && (
        <div className="xl:hidden px-4 pb-20">
          <div className="max-w-[520px] mx-auto space-y-6">
             {history.map((res, idx) => (
               <ResultCard key={res.checkedAt + idx} result={res} />
             ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="relative py-8 z-10 border-t border-white/[0.05] backdrop-blur-md bg-white/[0.01]"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted opacity-40">© 2026</span>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted opacity-40">Built by</span>
            <a
              href="https://github.com/HarshalPatel1972"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold tracking-[0.15em] uppercase text-primary transition-all duration-300 hover:text-accent"
            >
              Harshal Patel
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

