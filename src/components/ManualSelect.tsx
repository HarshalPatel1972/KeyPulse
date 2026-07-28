import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { PROVIDERS } from '@/lib/providers'
import { Provider } from '@/lib/types'

interface Props {
  value: Provider | null
  onChange: (provider: Provider) => void
}

export default function ManualSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
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

  useEffect(() => {
    if (!isOpen) setActiveIndex(null)
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
        setActiveIndex(0)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev === null || prev === PROVIDERS.length - 1 ? 0 : prev + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev === null || prev === 0 ? PROVIDERS.length - 1 : prev - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex !== null) {
          onChange(PROVIDERS[activeIndex])
          setIsOpen(false)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
    }
  }

  return (
    <div className="relative w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-[1px] flex-1 bg-primary/10" />
        <span className="text-[9px] uppercase tracking-[0.3em] font-black text-primary/40">Select Intelligence Source</span>
        <div className="h-[1px] flex-1 bg-primary/10" />
      </div>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-6 py-5 bg-[var(--glass-bg)] backdrop-blur-2xl shadow-[0_15px_45px_var(--glass-shadow)] border border-[var(--glass-border)] rounded-[24px] transition-all duration-300 transform active:scale-[0.98] group ${isOpen ? 'ring-2 ring-white/30' : ''}`}
        >
          <div className="flex items-center gap-4">
            {value ? (
              <>
                <div className="w-8 h-8 rounded-xl bg-base flex items-center justify-center p-1.5 shadow-md transition-transform group-hover:scale-110">
                  <Image src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${value.domain}&size=128`} alt="" width={32} height={32} unoptimized className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col text-left">
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
          <div 
            role="listbox"
            className="absolute top-full left-0 w-full z-[99999] mt-3 bg-white dark:bg-[#1C1C1E] shadow-[0_30px_75px_var(--glass-shadow)] rounded-[32px] p-2 border border-[var(--glass-border)] animate-slide-up"
          >
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[320px] p-1 custom-scrollbar">
              {PROVIDERS.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  role="option"
                  aria-selected={value?.id === p.id}
                  onClick={() => {
                    onChange(p)
                    setIsOpen(false)
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${value?.id === p.id ? 'bg-primary/10' : ''} ${activeIndex === idx ? 'bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-primary/5'}`}
                >
                  <div className="relative w-8 h-8 rounded-xl bg-base shadow-sm flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
                    <Image 
                      src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${p.domain}&size=128`} 
                      alt={p.name} 
                      width={24}
                      height={24}
                      unoptimized
                      className="w-full h-full object-contain" 
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
