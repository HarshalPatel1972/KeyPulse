'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Provider } from '@/lib/types'
import { verify } from '@/lib/verifiers'
import { VerifyResult } from '@/lib/types'
import { PROVIDERS_MAP } from '@/lib/providers'
import KeyInput from '@/components/KeyInput'
import VerifyButton from '@/components/VerifyButton'
import ResultCard from '@/components/ResultCard'
import TrustStrip from '@/components/TrustStrip'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import GitHubButton from '@/components/GitHubButton'
import MobileNav, { TabType } from '@/components/MobileNav'
import StarRiver from '@/components/StarRiver'

export default function Home() {
  const [key, setKey] = useState('')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<VerifyResult[]>([])
  const [hasChecked, setHasChecked] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [forceManual, setForceManual] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('pulse')
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kp_history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load history', e)
      }
    }
  }, [])

  // Auto-switch to Live Activity Feed on mobile when verification starts
  const handleVerify = useCallback(async () => {
    if (!key.trim() || !provider || isLoading) return
    setIsLoading(true)
    setHasChecked(true)
    
    // Switch to Activity tab on small screens immediately
    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      setActiveTab('history')
    }
    
    const r = await verify(key.trim(), provider.id)
    
    setIsLoading(false)
    if (r.status === 'error' && (r.rawError?.toLowerCase().includes('invalid') || r.rawError?.toLowerCase().includes('unauthorized'))) {
      setIsInvalid(true)
    } else {
      setIsInvalid(false)
      const newHistory = [r, ...history].slice(0, 50)
      setHistory(newHistory)
      localStorage.setItem('kp_history', JSON.stringify(newHistory))
    }
  }, [key, provider, isLoading, history])

  const handleReset = () => {
    setKey('')
    setHasChecked(false)
    setIsInvalid(false)
  }

  const handleDeleteItem = (id: string, timestamp: string) => {
    const newHistory = history.filter(item => !(item.provider === id && item.checkedAt === timestamp))
    setHistory(newHistory)
    localStorage.setItem('kp_history', JSON.stringify(newHistory))
  }

  return (
    <main className="min-h-screen bg-base text-primary font-sans flex flex-col overflow-hidden">
      <StarRiver />
      
      {/* Navigation - Mobile Optimized / Desktop Main */}
      <nav
        className="h-16 flex items-center justify-between px-6 shrink-0 relative z-50 transition-all duration-300"
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
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
          <GitHubButton />
        </div>
      </nav>

      {/* Main Container - Absolute rigid height to prevent any jitter */}
      <div className="flex-1 h-[calc(100vh-64px)] flex items-stretch overflow-hidden relative">
        {/* Interaction Column - Pulse Tab */}
        <div className={`flex-1 h-full flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden relative z-[20000] box-border ${activeTab === 'pulse' ? 'flex' : 'hidden xl:flex'}`}>
          <div className="w-full max-w-[540px] py-6 md:py-12 relative xl:-top-[30px] xl:scale-[1.08] transform-gpu transition-all duration-700">
            <div className="mb-8 text-center animate-fade-in px-2">
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

            {/* Unified Action Card for Mobile */}
            {/* Interaction Flow: Reordered for Desktop Natural Flow vs Mobile Thumb-First */}
            <div className="w-full flex flex-col gap-3 md:gap-4 p-1.5 md:p-0 bg-white/[0.03] md:bg-transparent rounded-[32px] md:rounded-none border border-white/5 md:border-none shadow-2xl md:shadow-none">
              
              {/* 1. Key Input (Top for Desktop) */}
              <div className="animate-slide-up relative z-[30000] order-1 md:order-1" style={{ animationDelay: '0.1s' }}>
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

              {/* 2. Action Logic (Middle for Action Momentum) */}
              <div className="relative group z-[1] order-2 md:order-2">
                 <div className="relative flex items-stretch rounded-[22px] md:rounded-2xl overflow-hidden backdrop-blur-xl bg-white/[0.03] border border-[var(--border)] transition-all duration-500 shadow-2xl mt-1">
                    <div className="flex-1 overflow-hidden transition-all duration-500 ease-out">
                      <VerifyButton
                        onClick={handleVerify}
                        isLoading={isLoading}
                        disabled={!key.trim() || !provider}
                        activeTheme={history[0]?.provider ? history[0].provider : 'default'}
                      />
                    </div>
                    
                    <div 
                      className="w-[120px] md:w-[160px] border-l border-[var(--border)] bg-white/[0.02] flex items-center justify-center overflow-hidden transition-all duration-500 ease-out"
                      style={{ 
                        width: hasChecked ? '120px' : '0px',
                        opacity: hasChecked ? 1 : 0,
                        transform: hasChecked ? 'translateX(0)' : 'translateX(20px)'
                      }}
                    >
                      <button
                        onClick={handleReset}
                        className="w-full h-full flex items-center justify-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
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

              {/* 3. Trust Strip (Support Metadata at the bottom) */}
              <div className="animate-slide-up order-3 md:order-3" style={{ animationDelay: '0.2s' }}>
                <TrustStrip />
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar - Activity Tab on Mobile / Verification Feed on Desktop */}
        <aside className={`w-full xl:w-[420px] border-l border-[var(--border)] bg-white/[0.01] flex-col relative z-40 transition-all duration-500 ${activeTab === 'history' ? 'flex' : 'hidden xl:flex'}`}>
          <div className="w-full border-b border-[var(--border)] bg-white/[0.02] shrink-0">
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">Verification Feed</h2>
              <span className="text-[10px] font-mono opacity-30">{history.length} active</span>
            </div>
          </div>
          <div className="flex-1 w-full overflow-y-auto p-4 md:p-6 space-y-6 pb-24">
            {history.length === 0 && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60 px-12">
                <div className="w-16 h-16 rounded-2xl border border-dashed border-white/30 mb-6 flex items-center justify-center animate-pulse-heartbeat bg-white/[0.02]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="font-heading font-medium text-lg mb-2">Awaiting Pulse</h3>
                <p className="text-sm font-sans" style={{ color: 'var(--text-muted)' }}>Check a key to see live activity and results here.</p>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="animate-pulse flex flex-col gap-4 opacity-50">
                    <div className="h-40 bg-white/5 rounded-2xl" />
                  </div>
                )}
                {history.map((result, i) => (
                  <div key={`${result.provider}-${result.checkedAt}`} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <ResultCard 
                      result={result} 
                      onDelete={() => handleDeleteItem(result.provider, result.checkedAt)} 
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </aside>

        {/* Footer Credit - Mobile Only (Ensuring visibility on scroll) */}
        <div className="fixed bottom-20 left-0 w-full flex flex-col items-center justify-center py-4 px-6 md:hidden opacity-40 select-none z-0">
          <p className="text-[10px] font-mono tracking-widest uppercase mb-1">© 2026 KeyPulse Platform</p>
          <p className="text-[9px] font-bold tracking-tighter uppercase opacity-80">Developed by Harshal Patel</p>
        </div>
      </div>

      <MobileNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        historyCount={history.length} 
      />
    </main>
  )
}
