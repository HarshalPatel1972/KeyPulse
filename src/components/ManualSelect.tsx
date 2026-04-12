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
          className={`w-full flex items-center justify-between px-6 py-5 bg-surface dark:bg-surface/95 shadow-[0_15px_45px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.2)] rounded-[24px] transition-all duration-300 transform active:scale-[0.98] group ${isOpen ? 'ring-2 ring-primary/10' : ''}`}
        >
          <div className="flex items-center gap-4">
            {value ? (
              <>
                <div className="w-8 h-8 rounded-xl bg-base flex items-center justify-center p-1.5 shadow-md transition-transform group-hover:scale-110">
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
          <div className="absolute top-full left-0 w-full z-[99999] mt-3 bg-surface dark:bg-surface/95 shadow-[0_30px_75px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_75px_rgba(0,0,0,0.3)] rounded-[32px] p-2 backdrop-blur-2xl animate-slide-up border border-primary/5">
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[320px] p-1 custom-scrollbar">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChange(p)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${value?.id === p.id ? 'bg-primary/10' : 'hover:bg-primary/5'}`}
                >
                  <div className="relative w-8 h-8 rounded-xl bg-base shadow-sm flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
                    <img 
                      src={`https://unavatar.io/${p.domain}?fallback=https://www.google.com/s2/favicons?domain=${p.domain}`} 
                      alt={p.name} 
                      className="w-full h-full object-contain" 
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className={`text-[13px] font-heading font-bold transition-colors ${value?.id === p.id ? 'text-primary' : 'text-primary/60 group-hover:text-primary'}`}>{p.name}</span>
                    <span className="text-[9px] uppercase tracking-widest text-primary/30 truncate w-full">{p.domain}</span>
                  </div>
                  {value?.id === p.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
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
