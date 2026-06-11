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
      
      <nav className="h-16 w-full fixed top-0 left-0 bg-base/70 dark:bg-base/90 backdrop-blur-xl z-[110] shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.15)] flex items-center justify-between px-6 shrink-0 transition-colors duration-500">
        <div className="flex items-center gap-6">
          <button onClick={scrollToPulse} className="text-xl font-heading font-bold tracking-tight text-primary transition-transform hover:opacity-80 active:scale-95">
            KeyPulse
          </button>
        </div>

        <div className="flex items-center gap-4">
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
            <div className="interaction-card rounded-[40px] p-8 md:p-14 shadow-2xl shadow-primary/5 relative overflow-visible transition-colors duration-500">
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
                  selectedProvider={provider}
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
          className="w-full xl:w-[460px] xl:shadow-[-20px_0_80px_rgba(0,0,0,0.08)] dark:xl:shadow-[-20px_0_80px_rgba(0,0,0,0.2)] bg-primary/5 dark:bg-primary/70 flex flex-col relative z-20 transition-colors duration-500 min-h-[645px] xl:min-h-0 xl:overflow-y-auto custom-scrollbar"
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
      <footer className="w-full py-3 flex flex-col xl:flex-row items-center justify-center xl:justify-between px-10 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)] bg-base relative z-30 shrink-0">
        <div className="flex flex-col items-center xl:items-start gap-1">
          <p className="text-[11px] font-black tracking-[0.4em] uppercase text-primary">KeyPulse</p>
          <p className="text-[9px] font-bold tracking-widest text-primary/40 uppercase">By Harshal Patel</p>
        </div>

        {/* Professional Connections */}
        <div className="flex items-center gap-6 my-2 xl:my-0">
          {[
            { label: 'Portfolio', href: 'http://harshal-patel-chi.vercel.app/', iconType: 'portfolio' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harshal-patel-59b9a5278/', iconType: 'linkedin' },
            { label: 'Instagram', href: 'https://www.instagram.com/harshalpatel2819', iconType: 'instagram' },
            { label: 'Coffee', href: 'https://www.chai4.me/harshalpatel', iconType: 'coffee' },
            { label: 'Email', href: 'mailto:hp842484n@gmail.com', iconType: 'email' }
          ].map((link) => (
            <a 
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-[9px] font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-colors duration-300"
            >
              {/* Complex Fountain Particle System */}
              <div className="absolute inset-x-0 -top-4 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i} 
                    className="absolute w-3 h-3 text-primary/50 animate-fountain"
                    style={{ 
                      '--x': `${(i - 1) * 12}px`, 
                      animationDelay: `${i * 0.6}s` 
                    } as any}
                  >
                    {link.iconType === 'portfolio' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    )}
                    {link.iconType === 'linkedin' && (
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    )}
                    {link.iconType === 'instagram' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    )}
                    {link.iconType === 'coffee' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                    )}
                    {link.iconType === 'email' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    )}
                  </div>
                ))}
              </div>
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-[10px] font-bold tracking-wider text-primary/40">© 2026 ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  )
}
