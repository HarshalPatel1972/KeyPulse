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
      <div className="flex items-center gap-3 mb-3">
        <div className="h-[1px] flex-1 bg-primary/10" />
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-primary/30">Manual Selection</span>
        <div className="h-[1px] flex-1 bg-primary/10" />
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-4 bg-surface border border-primary rounded-2xl hover:border-primary/30 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            {value ? (
              <>
                <img src={`https://www.google.com/s2/favicons?sz=64&domain=${value.domain}`} alt="" className="w-5 h-5 object-contain" />
                <span className="text-sm font-heading font-bold text-primary">{value.name}</span>
              </>
            ) : (
              <span className="text-sm font-heading font-bold text-primary/40">Choose AI Provider</span>
            )}
          </div>
          <svg 
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
            className={`text-primary/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full z-[99999] mt-2 bg-surface border border-primary shadow-2xl rounded-3xl p-3 xl:w-[120%] xl:-left-[10%] backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[280px] p-1 pb-4">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChange(p)
                    setIsOpen(false)
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-base/40 border border-primary hover:bg-primary/5 transition-all group"
                >
                  <img src={`https://www.google.com/s2/favicons?sz=64&domain=${p.domain}`} alt={p.name} className="w-6 h-6 object-contain mb-3 grayscale group-hover:grayscale-0 transition-all" />
                  <span className="text-[10px] font-heading font-bold text-primary">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
