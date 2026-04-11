import { useState, useRef, useEffect } from 'react'
import { PROVIDERS } from '@/lib/providers'
import { Provider } from '@/lib/types'

interface Props {
  value: Provider | null
  onChange: (provider: Provider) => void
}

export default function ManualSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="mt-4 animate-fade-in" ref={containerRef}>
      <p 
        className="font-sans text-[10px] uppercase tracking-[0.15em] font-bold mb-2 ml-1 opacity-60"
        style={{ color: 'var(--text-muted)' }}
      >
        Provider not detected — select manually:
      </p>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm 
            transition-all duration-300 backdrop-blur-xl bg-white/[0.03] border 
            ${isOpen ? 'border-accent/40 ring-2 ring-accent/20' : 'border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15]'}
          `}
          style={{ color: value ? 'var(--text-primary)' : 'var(--text-hint)' }}
        >
          <div className="flex items-center gap-3">
            {value && (
              <img 
                src={`https://www.google.com/s2/favicons?domain=${value.domain}&sz=64`} 
                alt="" 
                className="w-4 h-4 rounded-sm"
              />
            )}
            <span className="font-sans tracking-wide">
              {value ? value.name : 'Select a provider...'}
            </span>
          </div>
          
          <svg 
            width="12" height="12" viewBox="0 0 12 12" fill="none" 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40" />
          </svg>
        </button>

        {/* Custom Dropdown List */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 rounded-2xl overflow-hidden backdrop-blur-2xl bg-[#0f0d1a]/95 border border-white/10 shadow-2xl animate-dropdown-open">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1.5">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChange(p)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    hover:bg-white/[0.08] group
                    ${value?.id === p.id ? 'bg-accent/10 border-l-2 border-accent' : 'border-l-2 border-transparent'}
                  `}
                >
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=64`} 
                    alt="" 
                    className="w-4 h-4 rounded-sm grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <span className={`font-sans tracking-wide text-[13px] ${value?.id === p.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {p.name}
                  </span>
                  
                  {value?.id === p.id && (
                    <div className="ml-auto w-1 h-1 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
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
