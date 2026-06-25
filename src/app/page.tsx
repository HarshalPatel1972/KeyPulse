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
import AuroraBackground from '@/components/AuroraBackground'

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
      <AuroraBackground />
      
      <nav className="h-16 w-full fixed top-0 left-0 bg-base/70 dark:bg-base/90 backdrop-blur-xl z-[110] border-b border-border-primary flex items-center justify-between px-8 shrink-0 transition-colors duration-500">
        <div className="flex items-center">
          <button onClick={scrollToPulse} className="text-2xl font-heading font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-accent transition-transform hover:opacity-80 active:scale-95">
            KeyPulse
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/5 transition-colors relative overflow-hidden group">
            <div className={`transition-transform duration-500 ${theme === 'dark' ? '-translate-y-12 opacity-0' : 'translate-y-0 opacity-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70 group-hover:text-primary transition-colors"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${theme === 'light' ? 'translate-y-12 opacity-0' : 'translate-y-0 opacity-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70 group-hover:text-primary transition-colors"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </div>
          </button>
          <GitHubButton />
        </div>
      </nav>

      <div className="flex-1 min-h-0 flex flex-col xl:flex-row relative transition-colors duration-500 pt-16 overflow-visible xl:overflow-hidden">
        <div ref={pulseRef} className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10 shrink-0 min-h-[calc(100vh-164px)] xl:min-h-0 xl:overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-[600px] animate-fade-in py-12 md:p-0">
            <div className="interaction-card rounded-3xl p-8 md:p-12 relative overflow-visible transition-colors duration-500">
              <div className="mb-10 text-center flex flex-col items-center">
                <button
                  onClick={() => setForceManual(v => !v)}
                  className="px-3 py-1 rounded-full bg-primary text-base font-bold text-[10px] uppercase tracking-wider mb-6 transition-transform hover:scale-105 active:scale-95"
                >
                  {forceManual ? 'Pick a provider' : '11 Providers Supported'}
                </button>
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 tracking-tight text-primary">KeyPulse</h1>
                <p className="text-base opacity-60 text-primary">Check if your key still has a pulse.</p>
              </div>

              <div className="space-y-4">
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
                  rightAction={
                    <VerifyButton onClick={handleVerify} isLoading={isLoading} disabled={!key.trim() || !provider} />
                  }
                />
                
                {/* Reset Action */}
                <div className="flex justify-end h-6">
                  {hasChecked && (
                    <button 
                      onClick={handleReset} 
                      className="text-[11px] uppercase font-bold tracking-widest text-primary/40 hover:text-primary transition-colors duration-300"
                    >
                      Reset Session
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Trust Badges - Tightly aligned directly under card */}
            <div className="mt-6">
              <TrustStrip />
            </div>
          </div>
        </div>

        <aside 
          ref={resultsRef}
          className={`w-full transition-all duration-700 ease-in-out flex flex-col relative z-20 xl:min-h-0 xl:overflow-y-auto custom-scrollbar border-l border-border-primary bg-base
            ${lastResult ? 'xl:w-[460px] opacity-100' : 'xl:w-[400px] opacity-80 hover:opacity-100'}
          `}
        >
          <div className="px-6 xl:px-10 py-6 xl:py-8 border-b border-border-primary flex items-center justify-between sticky top-[64px] xl:top-0 bg-base z-[95] transition-colors duration-500">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/60 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${lastResult ? 'bg-success animate-pulse' : 'bg-primary/20'}`}></span>
              Result Feed
            </h2>
            <button onClick={scrollToPulse} className="xl:hidden px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-primary/60 hover:bg-white/10 transition-all">New Check</button>
          </div>
          
          <div className="flex-1 px-6 xl:px-10 py-10 xl:py-12 space-y-8 relative z-10 transition-colors duration-500 h-auto">
            {!lastResult ? (
              <div className="flex flex-col gap-4 opacity-40 pointer-events-none select-none animate-[pulse_3s_ease-in-out_infinite]">
                <div className="h-32 w-full bg-accent/5 rounded-2xl border border-accent/10 flex flex-col p-6 gap-4">
                  <div className="w-1/3 h-4 bg-accent/20 rounded"></div>
                  <div className="w-full h-8 bg-accent/10 rounded mt-auto"></div>
                </div>
                <div className="h-24 w-full bg-white/5 rounded-2xl border border-white/5 flex flex-col p-6 gap-4">
                  <div className="w-1/4 h-3 bg-white/10 rounded"></div>
                  <div className="w-2/3 h-6 bg-white/5 rounded mt-auto"></div>
                </div>
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

      {/* Global Footer: Clean, Minimalist, Dark Theme */}
      <footer className="w-full py-4 flex flex-col xl:flex-row items-center justify-center xl:justify-between px-10 border-t border-border-primary bg-base relative z-30 shrink-0">
        <div className="flex flex-col items-center xl:items-start gap-1">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-primary/80">KeyPulse</p>
          <p className="text-[8px] font-semibold tracking-widest text-primary/30 uppercase">By Harshal Patel</p>
        </div>

        {/* Professional Connections */}
        <div className="flex items-center gap-8 my-4 xl:my-0">
          {[
            { label: 'Portfolio', href: 'http://harshal-patel-chi.vercel.app/' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harshal-patel-59b9a5278/' },
            { label: 'Instagram', href: 'https://www.instagram.com/harshalpatel2819' },
            { label: 'Coffee', href: 'https://www.chai4.me/harshalpatel' },
            { label: 'Email', href: 'mailto:hp842484n@gmail.com' }
          ].map((link) => (
            <a 
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary/30 hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-[8px] font-bold tracking-[0.3em] text-primary/30 uppercase">© 2026 All Rights Reserved.</p>
      </footer>
    </main>
  )
}
