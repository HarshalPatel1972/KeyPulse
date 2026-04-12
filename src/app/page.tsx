'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Provider } from '@/lib/types'
import { verify } from '@/lib/verifiers'
import { VerifyResult } from '@/lib/types'
import KeyInput from '@/components/KeyInput'
import VerifyButton from '@/components/VerifyButton'
import ResultCard from '@/components/ResultCard'
import TrustStrip from '@/components/TrustStrip'
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

  const handleVerify = useCallback(async () => {
    if (!key.trim() || !provider || isLoading) return
    setIsLoading(true)
    setHasChecked(true)
    
    // Switch to Activity tab on small screens
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
    <main className="min-h-screen bg-base text-primary font-sans flex flex-col overflow-hidden relative">
      <StarRiver />
      
      {/* Navbar */}
      <nav className="h-16 flex items-center justify-between px-6 shrink-0 relative z-50">
        <div className="text-2xl font-heading font-bold tracking-tight">
          KeyPulse
        </div>
        <GitHubButton />
      </nav>

      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden relative">
        {/* Interaction Column */}
        <div className={`flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10 ${activeTab === 'pulse' ? 'flex' : 'hidden xl:flex'}`}>
          <div className="w-full max-w-[560px] animate-fade-in">
            {/* Main Action Surface */}
            <div className="interaction-card rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-visible">
              <div className="mb-10 text-center">
                <button
                  onClick={() => setForceManual(v => !v)}
                  className="px-4 py-1.5 rounded-full bg-accent/20 border border-accent/20 text-[10px] uppercase tracking-[0.2em] font-bold mb-6 transition-all hover:bg-accent/40"
                  style={{ color: 'var(--text-inverse)' }}
                >
                  {forceManual ? 'Pick a provider' : '11 providers supported'}
                </button>
                <h1 className="text-5xl font-heading mb-3 tracking-tighter" style={{ color: 'var(--text-inverse)' }}>
                  Check Pulse
                </h1>
                <p className="text-lg opacity-60" style={{ color: 'var(--text-inverse)' }}>
                  Is your API key still alive?
                </p>
              </div>

              <div className="space-y-6">
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

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <VerifyButton
                      onClick={handleVerify}
                      isLoading={isLoading}
                      disabled={!key.trim() || !provider}
                    />
                  </div>
                  {hasChecked && (
                    <button
                      onClick={handleReset}
                      className="px-8 py-4 rounded-2xl bg-elevated/20 border border-border text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-elevated/40 transition-all"
                      style={{ color: 'var(--text-inverse)' }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12">
              <TrustStrip />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`w-full xl:w-[460px] border-l border-white/10 bg-black/5 flex-col relative z-20 transition-all ${activeTab === 'history' ? 'flex' : 'hidden xl:flex'}`}>
          <div className="p-8 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase opacity-70">Activity Feed</h2>
            <span className="text-[10px] font-mono opacity-40">{history.length} ITEMS</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-12">
                <p className="text-sm">Check a key to see activity here.</p>
              </div>
            ) : (
              history.map((result, i) => (
                <div key={`${result.provider}-${result.checkedAt}`} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ResultCard 
                    result={result} 
                    onDelete={() => handleDeleteItem(result.provider, result.checkedAt)} 
                  />
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      <MobileNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        historyCount={history.length} 
      />
    </main>
  )
}
