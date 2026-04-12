'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Provider } from '@/lib/types'
import { verify } from '@/lib/verifiers'
import { VerifyResult } from '@/lib/types'
import KeyInput from '@/components/KeyInput'
import VerifyButton from '@/components/VerifyButton'
import ResultCard from '@/components/ResultCard'
import TrustStrip from '@/components/TrustStrip'
import GitHubButton from '@/components/GitHubButton'
import StarRiver from '@/components/StarRiver'

export default function Home() {
  const [key, setKey] = useState('')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<VerifyResult | null>(null)
  const [hasChecked, setHasChecked] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [forceManual, setForceManual] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const pulseRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('kp_theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('kp_theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleVerify = useCallback(async () => {
    if (!key.trim() || !provider || isLoading) return
    setIsLoading(true)
    setHasChecked(true)
    // Absolute Zero History: Clear previous result before checking new one
    setLastResult(null)
    const r = await verify(key.trim(), provider.id)
    setIsLoading(false)
    if (r.status === 'error' && (r.rawError?.toLowerCase().includes('invalid') || r.rawError?.toLowerCase().includes('unauthorized'))) {
      setIsInvalid(true)
    } else {
      setIsInvalid(false)
      setLastResult(r)
      
      // Precision Jump: Scroll to results and stop at the navbar (64px offset)
      if (typeof window !== 'undefined' && window.innerWidth < 1280) {
        setTimeout(() => {
          const target = resultsRef.current?.offsetTop || 0
          window.scrollTo({ top: target - 64, behavior: 'smooth' })
        }, 100)
      }
    }
  }, [key, provider, isLoading])

  const scrollToPulse = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setKey('')
    setHasChecked(false)
    setIsInvalid(false)
    setLastResult(null)
    scrollToPulse()
  }

  return (
    <main className="min-h-screen xl:h-screen bg-base text-primary font-sans flex flex-col relative transition-colors duration-500 overflow-x-hidden">
      <StarRiver />
      
      <nav className="h-16 w-full fixed top-0 left-0 bg-base/70 backdrop-blur-xl z-[110] border-b border-primary/5 flex items-center justify-between px-6 shrink-0 transition-colors duration-500">
        <div className="flex items-center gap-6">
          <button onClick={scrollToPulse} className="text-2xl font-heading font-bold tracking-tight text-primary drop-shadow-sm active:scale-95 transition-transform flex gap-[1px]">
            {"KeyPulse".split("").map((char, i) => (
              <span key={i} className="animate-text-wave" style={{ animationDelay: `${i * 0.1}s` }}>{char}</span>
            ))}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2.5 rounded-2xl bg-primary/5 border border-primary/5 hover:bg-primary/10 transition-all relative overflow-hidden">
            <div className={`transition-transform duration-500 ${theme === 'dark' ? '-translate-y-12 opacity-0' : 'translate-y-0 opacity-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${theme === 'light' ? 'translate-y-12 opacity-0' : 'translate-y-0 opacity-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </div>
          </button>
          <GitHubButton />
        </div>
      </nav>

      <div className="flex-1 min-h-0 flex flex-col xl:flex-row relative transition-colors duration-500 pt-16 overflow-visible xl:overflow-hidden">
        <div ref={pulseRef} className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10 shrink-0 min-h-[calc(100vh-164px)] xl:min-h-0 xl:overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-[560px] animate-fade-in py-12 md:p-0">
            <div className="interaction-card rounded-[40px] p-8 md:p-14 shadow-2xl shadow-black/5 relative overflow-visible transition-colors duration-500">
              <div className="mb-10 text-center">
                <button
                  onClick={() => setForceManual(v => !v)}
                  className="px-4 py-1.5 rounded-full bg-primary/5 border border-primary/5 text-[10px] uppercase tracking-[0.2em] font-bold mb-6 transition-all hover:bg-primary/10 text-primary"
                >
                  {forceManual ? 'Pick a provider' : '11 providers supported'}
                </button>
                <h1 className="text-6xl font-heading mb-3 tracking-tighter text-primary">KeyPulse</h1>
                <p className="text-lg opacity-60 text-primary">Check if your key still has a pulse.</p>
              </div>

              <div className="space-y-6">
                <KeyInput
                  value={key}
                  onProviderChange={setProvider}
                  forceManual={forceManual}
                  onKeyChange={(val) => {
                    setKey(val)
                    if (!val) { setIsInvalid(false); setHasChecked(false); }
                  }}
                  isLoading={isLoading}
                  isInvalid={isInvalid}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <VerifyButton onClick={handleVerify} isLoading={isLoading} disabled={!key.trim() || !provider} />
                  </div>
                  {hasChecked && (
                    <button onClick={handleReset} className="px-8 py-4 rounded-2xl bg-primary/5 border border-primary/5 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-primary/10 text-primary/60">Reset</button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-12">
              <TrustStrip />
            </div>
          </div>
        </div>

        <aside 
          ref={resultsRef}
          className="w-full xl:w-[460px] border-t xl:border-t-0 xl:border-l border-primary/5 bg-black/[0.01] flex flex-col relative z-20 transition-colors duration-500 min-h-[645px] xl:min-h-0 xl:overflow-y-auto custom-scrollbar"
        >
          <div className="px-6 xl:px-10 py-6 xl:py-8 border-b border-primary/5 flex items-center justify-between sticky top-[64px] xl:top-0 bg-base z-[95] transition-colors duration-500">
            <h2 className="text-[12px] font-bold tracking-[0.4em] uppercase text-primary/80">Result Feed</h2>
            <button onClick={scrollToPulse} className="xl:hidden px-4 py-2 rounded-full bg-primary/10 border border-primary/5 text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:bg-primary/20 transition-all">Check Another</button>
          </div>
          
          <div className="flex-1 px-6 xl:px-10 py-10 xl:py-12 space-y-8 relative z-10 transition-colors duration-500 h-auto">
            {!lastResult ? (
              <div className="py-20 flex flex-col items-center justify-center text-center text-primary/40 px-12">
                <p className="text-sm italic">Single check session. No history stored.</p>
              </div>
            ) : (
              <div className="animate-slide-up">
                <ResultCard 
                  result={lastResult as VerifyResult} 
                  onDelete={() => setLastResult(null)} 
                />
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Global Footer: Unified, visible everywhere at the bottom */}
      <footer className="w-full py-8 flex flex-col xl:flex-row items-center justify-center xl:justify-between px-10 border-t border-primary/5 bg-base relative z-30 shrink-0">
        <p className="text-[11px] font-black tracking-[0.4em] uppercase mb-2 xl:mb-0 text-primary">KeyPulse</p>
        <p className="text-[10px] font-bold tracking-wider text-primary/60">© 2026 HARSHAL PATEL. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  )
}
