import React, { useState, useEffect, useRef } from 'react'
import { PROVIDERS } from '@/lib/providers'
import { Provider } from '@/lib/types'

interface Props {
  value: Provider | null
  onChange: (provider: Provider) => void
}

export default function ManualSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-[1px] flex-1 bg-primary/10" />
        <span className="text-[9px] uppercase tracking-[0.3em] font-black text-primary/40">Select Intelligence Source</span>
        <div className="h-[1px] flex-1 bg-primary/10" />
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-6 py-5 bg-surface dark:bg-surface/95 shadow-[0_20px_60px_rgba(66,72,116,0.12)] rounded-[24px] transition-all duration-300 transform active:scale-[0.98] group ${isOpen ? 'ring-2 ring-primary/10' : ''}`}
        >
          <div className="flex items-center gap-4">
            {value ? (
              <>
                <div className="w-8 h-8 rounded-xl bg-base flex items-center justify-center p-1.5 shadow-sm transition-transform group-hover:scale-110">
                  <img src={`https://www.google.com/s2/favicons?sz=64&domain=${value.domain}`} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 leading-none mb-1.5">Selected Provider</span>
                  <span className="text-base font-heading font-bold text-primary leading-none">{value.name}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <span className="text-base font-heading font-bold text-primary/40">Choose AI Engine</span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-full bg-primary/5 transition-all duration-300 ${isOpen ? 'rotate-180 bg-primary/10' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-primary/40"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full z-[99999] mt-3 bg-surface dark:bg-surface/95 shadow-[0_40px_120px_rgba(42,48,116,0.3)] rounded-[32px] p-4 xl:w-[130%] xl:-left-[15%] backdrop-blur-2xl animate-slide-up">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto max-h-[380px] p-1 custom-scrollbar">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChange(p)
                    setIsOpen(false)
                  }}
                  className={`flex flex-col items-center justify-center p-5 rounded-[24px] transition-all duration-300 group ${value?.id === p.id ? 'bg-primary/10 ring-1 ring-primary/20' : 'bg-base/40 hover:bg-primary/5'}`}
                  style={{ '--hover-glow': `${p.color}15` } as React.CSSProperties}
                >
                  <div className="relative mb-3">
                    <div className="absolute inset-0 blur-lg transition-opacity opacity-0 group-hover:opacity-100" style={{ backgroundColor: p.color }} />
                    <div className="relative w-10 h-10 rounded-2xl bg-base shadow-sm flex items-center justify-center p-2.5 transition-transform group-hover:scale-110">
                      <img src={`https://www.google.com/s2/favicons?sz=64&domain=${p.domain}`} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <span className={`text-[11px] font-heading font-bold text-center leading-tight transition-colors ${value?.id === p.id ? 'text-primary' : 'text-primary/60 group-hover:text-primary'}`}>{p.name}</span>
                  {value?.id === p.id && (
                    <div className="mt-2 w-1 h-1 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
