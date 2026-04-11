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
      className="h-screen flex flex-col relative z-0 overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      <StarRiver />
      
      {/* Navigation */}
      <nav
        className="h-16 flex items-center justify-between px-6 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5 group">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="transition-all duration-500 group-hover:scale-110 overflow-visible">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="logo-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#ff00c1" />
                <stop offset="40%" stopColor="#00fff0" />
                <stop offset="60%" stopColor="#ffde59" />
                <stop offset="80%" stopColor="#7ed957" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            <polyline
              style={{ filter: 'url(#glow)' }}
              stroke="url(#logo-flow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <animate 
                attributeName="points"
                dur="1.5s"
                repeatCount="indefinite"
                values="
                  1,10 5,10 7,4 9,16 11,7 13,13 15,10 19,10;
                  1,10 5,10 7,6 9,14 11,8 13,12 15,10 19,10;
                  1,10 5,10 7,4 9,16 11,7 13,13 15,10 19,10"
              />
            </polyline>
          </svg>
          <span className="text-lg font-heading font-bold animate-text-flow tracking-tight">
            KeyPulse
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <GitHubButton />
        </div>
      </nav>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_420px] items-stretch overflow-hidden">
        
        {/* Interaction Column */}
        <div className="flex flex-col items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-[500px] py-6">
            <div className="mb-6 text-center animate-fade-in">
              <div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/[0.03] border border-white/10 text-[10px] mb-4 transition-all duration-500 hover:border-white/20"
                style={{ letterSpacing: '0.12em', color: 'var(--text-muted)' }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-valid/40 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-valid shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                </div>
                <span className="font-sans font-medium uppercase mt-0.5">11 providers supported</span>
              </div>
              <h1 className="text-4xl font-heading mb-2 tracking-[-0.03em] animate-text-flow pb-2">
                KeyPulse
              </h1>
              <p className="text-lg font-light opacity-80" style={{ color: 'var(--text-muted)' }}>
                Check if your key still has a pulse.
              </p>
            </div>

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
                 <div className="relative flex items-stretch rounded-2xl overflow-hidden backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] transition-all duration-500 shadow-2xl">
                    <div className="flex-1 overflow-hidden transition-all duration-500 ease-out">
                      <VerifyButton
                        onClick={handleVerify}
                        isLoading={isLoading}
                        disabled={!key.trim() || !provider}
                        activeTheme={history[0]?.provider ? history[0].provider : 'default'}
                      />
                    </div>
                    
                    <div 
                      className="w-[160px] border-l border-white/[0.08] bg-white/[0.02] flex items-center justify-center overflow-hidden transition-all duration-500 ease-out"
                      style={{ 
                        width: hasChecked ? '160px' : '0px',
                        opacity: hasChecked ? 1 : 0,
                        transform: hasChecked ? 'translateX(0)' : 'translateX(20px)'
                      }}
                    >
                      <button
                        onClick={handleReset}
                        className="w-full h-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
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
                          width="12" height="12" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                          className="opacity-40"
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

        {/* Sidebar Column */}
        <div 
          className="hidden xl:flex flex-col border-l border-white/[0.08] bg-transparent overflow-hidden"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="border-b border-white/[0.05] bg-white/[0.02] shrink-0">
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">Verification Feed</h2>
              <span className="text-[10px] font-mono opacity-30">{history.length} active</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading && (
              <div className="animate-pulse space-y-4 p-6 rounded-2xl border border-border/50 bg-white/[0.02]">
                <div className="h-4 w-1/3 bg-white/10 rounded-full" />
                <div className="h-12 w-full bg-white/5 rounded-xl" />
                <div className="h-8 w-full bg-white/5 rounded-xl" />
              </div>
            )}
            
            {history.length === 0 && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60 px-12">
                <div className="w-16 h-16 rounded-2xl border border-dashed border-white/30 mb-6 flex items-center justify-center animate-pulse-heartbeat bg-white/[0.02]">
                  <span className="text-2xl filter drop-shadow-[0_0_10px_rgba(255,187,0,0.5)]">⚡</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: 'var(--text-muted)' }}>
                  Feed awaiting input
                </p>
                <div className="mt-4 w-24 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <p className="mt-4 text-[9px] uppercase tracking-[0.1em] opacity-40">
                  Real-time results will <br /> populate here
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

      {/* Footer - Fixed to absolute bottom with increased presence */}
      <footer className="fixed bottom-0 left-0 w-full pt-2 pb-[33px] z-50 bg-base/5 backdrop-blur-xs border-white/[0.01]">
        <div className="flex items-center justify-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted opacity-30">© 2026</span>
          <div className="w-[1px] h-2 bg-white/5" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted opacity-30">Built by</span>
            <a
              href="https://github.com/HarshalPatel1972"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary transition-all duration-300 hover:text-accent hover:opacity-100 opacity-60"
              style={{ letterSpacing: '0.15em' }}
            >
              Harshal Patel
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
