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
import MobileNav, { TabType } from '@/components/MobileNav'

export default function Home() {
  const [key, setKey] = useState('')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [history, setHistory] = useState<VerifyResult[]>([])
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [activeTab, setActiveTab] = useState<TabType>('pulse')
  const [forceManual, setForceManual] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  // Heart Easter Egg State
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([])
  const [isHoveringName, setIsHoveringName] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isHoveringName) {
      interval = setInterval(() => {
        setHearts(prev => [...prev.slice(-20), { id: Math.random(), x: Math.random() * 80 + 10 }])
      }, 150)
    }
    return () => clearInterval(interval)
  }, [isHoveringName])

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
        <div className="flex items-center gap-1 group">
          <div className="text-xl font-heading font-bold tracking-tight flex">
            {"KeyPulse".split('').map((char, i) => (
              <span 
                key={i} 
                className="animate-text-flow animate-text-wave" 
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <GitHubButton />
        </div>
      </nav>

      {/* Main Container - Absolute rigid height to prevent any jitter */}
      <div className="flex-1 h-[calc(100vh-64px)] flex items-stretch overflow-hidden relative">
        {/* Interaction Column - Pulse Tab */}
        <div className={`flex-1 h-full flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto relative z-[20000] box-border ${activeTab === 'pulse' ? 'flex' : 'hidden xl:flex'}`}>
          <div className="w-full max-w-[540px] py-6 md:py-12 relative xl:-top-[30px] xl:scale-[1.08] transform-gpu transition-all duration-700">
            <div className="mb-6 text-center animate-fade-in">
              <button
                type="button"
                onClick={() => setForceManual(v => !v)}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/[0.03] border border-white/10 text-[10px] mb-4 transition-all duration-500 hover:border-white/20 active:scale-95 cursor-pointer"
                style={{ letterSpacing: '0.12em', color: 'var(--text-muted)' }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-valid/40 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-valid shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                </div>
                <span className="font-sans font-medium uppercase mt-0.5">
                  {forceManual ? 'Pick a provider' : '11 providers supported'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${forceManual ? 'rotate-180' : ''}`}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <h1 
                className="text-4xl font-heading mb-2 tracking-[-0.03em] interactive-text-flow pb-2 cursor-default"
                onMouseMove={handleMouseMove}
                style={{ 
                  '--mouse-x': `${mousePos.x}%`, 
                  '--mouse-y': `${mousePos.y}%` 
                } as React.CSSProperties}
              >
                KeyPulse
              </h1>
              <p className="text-lg font-light opacity-80" style={{ color: 'var(--text-muted)' }}>
                Check if your key still has a pulse.
              </p>
            </div>

            <div className="w-full flex flex-col-reverse gap-3">
              {/* Note: In flex-col-reverse, the first item in DOM is at the BOTTOM visually */}
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <TrustStrip />
              </div>

              <div className="relative group z-0">
                 <div className="relative flex items-stretch rounded-2xl overflow-hidden backdrop-blur-xl bg-white/[0.03] border border-[var(--border)] transition-all duration-500 shadow-2xl">
                    <div className="flex-1 overflow-hidden transition-all duration-500 ease-out">
                      <VerifyButton
                        onClick={handleVerify}
                        isLoading={isLoading}
                        disabled={!key.trim() || !provider}
                        activeTheme={history[0]?.provider ? history[0].provider : 'default'}
                      />
                    </div>
                    
                    <div 
                      className="w-[160px] border-l border-[var(--border)] bg-white/[0.02] flex items-center justify-center overflow-hidden transition-all duration-500 ease-out"
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

              <div className="animate-slide-up relative z-[30000]" style={{ animationDelay: '0.1s' }}>
                <KeyInput
                  value={key}
                  onProviderChange={setProvider}
                  forceManual={forceManual}
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
              </div>
            </div>
          </div>
        </div>

        {/* Mobile History View */}
        <div className={`flex-1 flex flex-col h-full bg-transparent overflow-hidden relative z-20 xl:hidden ${activeTab === 'history' ? 'flex' : 'hidden'}`}>
          <div className="w-full border-b border-[var(--border)] bg-white/[0.02] shrink-0 p-6 flex items-center justify-between">
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">Verification Feed</h2>
            <span className="text-[10px] font-mono opacity-30">{history.length} active</span>
          </div>
          <div className="flex-1 w-full overflow-y-auto p-4 md:p-6 space-y-6 pb-24">
            {history.length === 0 && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60 px-12">
                <div className="w-16 h-16 rounded-2xl border border-dashed border-white/30 mb-6 flex items-center justify-center animate-pulse-heartbeat bg-white/[0.02]">
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold">Feed awaiting input</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {history.map((res, idx) => (
                  <div key={res.checkedAt + idx} className="animate-slide-up">
                    <ResultCard result={res} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Settings/Theme View */}
        <div className={`flex-1 flex flex-col h-full items-center justify-center p-6 relative z-20 xl:hidden ${activeTab === 'settings' ? 'flex' : 'hidden'}`}>
          <div className="w-full max-w-sm space-y-8 animate-fade-in text-center">
            <div>
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-6">Select Atmosphere</h2>
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                <ThemeSwitcher />
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/5">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-6">Open Source</h2>
              <GitHubButton />
            </div>
          </div>
        </div>

        {/* Fixed Vertical Divider - Desktop Only */}
        <div className="hidden xl:block fixed top-16 bottom-0 right-[420px] w-[1px] z-[9999] bg-[var(--border)] pointer-events-none">
          <div className="absolute inset-x-[-1px] inset-y-0 bg-accent/20 blur-[1px]" />
        </div>

        {/* Sidebar Column - Desktop Only */}
        <div 
          className="hidden xl:flex flex-col h-full bg-transparent overflow-hidden shrink-0 w-[420px] relative z-20"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="w-full border-b border-[var(--border)] bg-white/[0.02] shrink-0">
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">Verification Feed</h2>
              <span className="text-[10px] font-mono opacity-30">{history.length} active</span>
            </div>
          </div>

          <div className="flex-1 w-full overflow-y-auto p-6 space-y-6">
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
                <div className="mt-4 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <p className="mt-4 text-[9px] uppercase tracking-[0.15em] opacity-70 text-muted font-bold">
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

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} historyCount={history.length} />

      {/* Footer - Fixed to absolute bottom with increased presence */}
      <footer className="fixed bottom-0 left-0 w-full pt-2 pb-[33px] z-[50000] bg-base/5 backdrop-blur-xs border-white/[0.01]">
        <div className="flex items-center justify-center gap-3 xl:pr-[420px]">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted opacity-30">© 2026</span>
          <div className="w-[1px] h-2 bg-[var(--border)]" />
          <div className="flex items-center gap-1.5 relative">
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted opacity-30">Built by</span>
            <div 
              className="relative inline-flex items-center group/name"
              onMouseEnter={() => setIsHoveringName(true)}
              onMouseLeave={() => setIsHoveringName(false)}
            >
              <a
                href="https://github.com/HarshalPatel1972"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary transition-all duration-300 hover:text-accent hover:opacity-100 opacity-60 z-10 relative"
                style={{ letterSpacing: '0.15em' }}
              >
                Harshal Patel
              </a>
              {/* Heart Particles - Client Side Only */}
              {isMounted && hearts.map(h => (
                <span 
                  key={h.id}
                  className="absolute animate-heart pointer-events-none z-0"
                  style={{ left: `${h.x}%`, top: '-10px' }}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
